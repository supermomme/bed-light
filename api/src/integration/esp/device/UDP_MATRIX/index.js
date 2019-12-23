const dgram = require('dgram')
const logger = require('../../../../logger')
const { Modes, defaultSetting } = require('./mode')
const colorBlend = require('color-blend')
const Ramp = require('ramp.js')

module.exports = class Matrix {
  constructor (deviceId, _socket, app, dbDevice) {
    this.id = deviceId.toString()
    this.app = app
    this.udpSocket = dgram.createSocket('udp4')

    this.width = dbDevice.config.WIDTH
    this.height = dbDevice.config.HEIGHT
    this.udpPort = dbDevice.config.PORT
    this.udpHost = dbDevice.config.HOST

    this.matrix = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        column.push({ r: 0, g: 0, b: 0, a: 0 })
      }
      this.matrix.push(column)
    }

    this.modes = {}
    for (const key in Modes) {
      let mode = new Modes[key](this.width, this.height)
      let alpha = 0
      if (dbDevice.state.alpha && dbDevice.state.alpha[key]) alpha = dbDevice.state.alpha[key]
      this.modes[key] = { mode, alpha }
    }


    let alpha = {}
    for (const modeId in this.modes) {
      alpha[modeId] = this.modes[modeId].alpha
    }

    this.updateInterval = setInterval(() => this.send(), 1000/60)
    this.alphaTransitionInterval = setInterval(() => this.updateAlphaTransistions(), 10)
    this.alphaTransistions = []

    let settingPatch = Object.keys(defaultSetting).reduce((prev, cur) => {
      prev[`setting.${cur}`] = defaultSetting[cur]

      if (cur.split('.').reduce((o, v) => o != undefined ? o[v] : undefined, dbDevice.setting) != undefined) prev[`setting.${cur}`] = cur.split('.').reduce((o, v) => o[v], dbDevice.setting)
      return prev
    }, {})

    this.app.service('device').patch(this.id, {
      status: 'CONNECTED',
      statusMessage: 'Connected! All good.',
      'state.alpha': alpha,
      'state.isInTransition': false,
      ...settingPatch
    })

    this.app.service('device').on('patched', (data) => this.handlePatch(data).catch(logger.error))
    this.app.service('device').on('updated', (data) => this.handlePatch(data).catch(logger.error))
  }

  async handlePatch (data) {
    // Alpha
    for (const modeId in data.state.alpha) {
      const alpha = data.state.alpha[modeId]
      if (this.modes[modeId].alpha !== alpha) {
        if (data.setting.transitionTime == 0) {
          this.modes[modeId].alpha = alpha
        } else {
          let ramp = new Ramp(this.modes[modeId].alpha)
          ramp.go(alpha, data.setting.transitionTime, 'LINEAR', 'ONCEFORWARD')
          this.alphaTransistions.push({ modeId, ramp })
        }
      }
    }
    // Setting
    for (const modeId in this.modes) {
      if (data.setting[modeId]) {
        this.modes[modeId].mode.setConfig(data.setting[modeId])
      }
    }
  }

  isTransitioning () {
    return this.alphaTransistions.length > 0
  }

  updateAlphaTransistions () {
    if (!this.isTransitioning()) return
    for (let i = 0; i < this.alphaTransistions.length; i++) {
      const transition = this.alphaTransistions[i]
      this.modes[transition.modeId].alpha = transition.ramp.update()
    }
    this.alphaTransistions = this.alphaTransistions.filter(val => val.ramp.isRunning())
    if (!this.isTransitioning() && this.app) {
      this.app.service('device').patch(this.id, { 'state.isInTransition': false })
        .catch(err => console.error(err))
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
    
    if (pixelsToSend.length == 0) return

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
      const mode = this.modes[modeId]
      const alpha = mode.alpha
      if (alpha > 0 && mode.mode.initialized) {
        const matrix = mode.mode.getMatrix()
        for (let x = 0; x < matrix.length; x++) {
          for (let y = 0; y < matrix[x].length; y++) {
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
    this.udpSocket.close()
  }
}
