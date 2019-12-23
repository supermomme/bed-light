const dgram = require('dgram')
const logger = require('../../../../logger')
const Modes = require('./mode')
const colorBlend = require('color-blend')

module.exports = class Matrix {
  constructor (deviceId, app, dbDevice) {
    this.id = deviceId.toString()
    this.app = app
    this.udpSocket = dgram.createSocket('udp4')
    this.width = dbDevice.config.WIDTH
    this.height = dbDevice.config.HEIGHT
    this.matrix = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        column.push({ r: 0, g: 0, b: 0, a: 0 })
      }
      this.matrix.push(column)
    }

    this.modes = {}
    this.trans
    for (const key in Modes) {
      let mode = new Modes[key](this.width, this.height)
      let alpha = 0
      if (dbDevice.state.alpha && dbDevice.state.alpha[key]) alpha = dbDevice.state.alpha[key]
      this.modes[key] = {
        mode,
        alpha
      }
    }

    this.app.service('device').on('patched', (data) => this.handlePatch(data).catch(logger.error))
    this.app.service('device').on('updated', (data) => this.handlePatch(data).catch(logger.error))

    let alpha = {}
    for (const modeId in this.modes) {
      alpha[modeId] = this.modes[modeId].alpha
    }
    this.app.service('device').patch(this.id, {
      status: 'CONNECTED',
      statusMessage: 'Connected! All good.',
      state: { alpha }
    })

    this.updateInterval = setInterval(() => this.send(), 1000/0.5)
  }

  async handlePatch (data) {
    for (const modeId in data.state.alpha) {
      const alpha = data.state.alpha[modeId]
      if (this.modes[modeId].alpha !== alpha) this.modes[modeId].alpha = alpha
    }
  }

  colorBlend (A, B) {
    return colorBlend.normal(A, B)
  }

  send (sendAll = false) {
    let pixelsToSend = []
    if (sendAll) {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          pixelsToSend.push({x,y})
        }
      }
    } else {
      pixelsToSend = this.pixelsToSend()
    }
    
    // pixelsToSend
    let buffer = Buffer.alloc(pixelsToSend.length*5)
    for (let i = 0; i < pixelsToSend.length; i++) {
      const { x, y } = pixelsToSend[i]
      const { r, g, b, a } = this.matrix[x][y]
      const base = i*5
      buffer.writeUInt8(x, base)   // X
      buffer.writeUInt8(y, base+1) // Y
      buffer.writeUInt8(r*a, base+2) // R
      buffer.writeUInt8(g*a, base+3) // G
      buffer.writeUInt8(b*a, base+4) // B
    }
    
    this.udpSocket.send(buffer, Number(this.udpPort), this.udpHost, (error, bytes) => {
      if (error) {
        logger.error(error)
      }
    })
    
  }

  pixelsToSend () {
    // Init and fill newMatrix
    let newMatrix = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        column.push({ r: 0, g: 0, b: 0, a: 0 })
      }
      newMatrix.push(column)
    }
    for (const modeId in this.modes) {
      if (this.modes.hasOwnProperty(modeId)) {
        const mode = this.modes[modeId]
        const alpha = mode.alpha
        if (alpha > 0 && mode.mode.initialized) {
          const matrix = mode.mode.getMatrix()
          for (let x = 0; x < matrix.length; x++) {
            for (let y = 0; y < matrix[x].length; y++) {
              let a = matrix[x][y].a*alpha
              let background = {
                r: newMatrix[x][y].r || 0,
                g: newMatrix[x][y].g || 0,
                b: newMatrix[x][y].b || 0,
                a: newMatrix[x][y].a || 0
              }
              let foreground = {
                r: matrix[x][y].r || 0,
                g: matrix[x][y].g || 0,
                b: matrix[x][y].b || 0,
                a: matrix[x][y].a*alpha || 0
              }
              let color = this.colorBlend(background, foreground)
              if (!isNaN(color.r) && !isNaN(color.g) && !isNaN(color.b) && !isNaN(color.a)) newMatrix[x][y] = color
            }
          }
        }
      }
    }

    // Register pixels to send
    let pixelsToSend = []
    for (let x = 0; x < newMatrix.length; x++) {
      for (let y = 0; y < newMatrix[x].length; y++) {
        if (
          newMatrix[x][y].r !== this.matrix[x][y].r ||
          newMatrix[x][y].g !== this.matrix[x][y].g ||
          newMatrix[x][y].b !== this.matrix[x][y].b ||
          newMatrix[x][y].a !== this.matrix[x][y].a
        ) {
          let index = pixelsToSend.findIndex(n => n.x === x && n.y === y)
          if (index === -1) pixelsToSend.push({ x, y })
        }
      }
    }

    // Set this.matrix to newMatrix
    this.matrix = newMatrix
    return pixelsToSend
  }

  destroy () {
    clearInterval(this.updateInterval)
    this.socket.destroy()
  }
}
