const Matrix = require('./Matrix')
const dgram = require('dgram')
const colorBlend = require('color-blend')

module.exports = class UdpMatrix extends Matrix {
  constructor (_width, _height, _app, _index, _host, _port, _fps) {
    super(_width, _height, _app, _index)
    this.host = _host
    this.port = _port
    this.udpClient = dgram.createSocket('udp4')
    this.fps = _fps || 60
    this.updateInterval = setInterval(() => this.update(), 1000/this.fps)
    this.statInterval = setInterval(() => this.updateStats(), 1000)

    this.bytesPerSecond = 0
    this.bytesLastSecond = 0

    this.sendMatrix()
  }

  test () { }

  colorBlend (A, B) {
    return colorBlend.normal(A, B)
  }

  updateStats () {
    this.bytesPerSecond = this.bytesLastSecond
    this.bytesLastSecond = 0
    console.log(`Currently sending ${this.bytesPerSecond} bps`)
  }

  sendMatrix(pixelsToSend) {
    if (pixelsToSend === undefined) {
      pixelsToSend = []
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          pixelsToSend.push({x,y})
        }
      }
    }
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

    this.udpClient.send(buffer, 0, buffer.length, this.port, this.host, (err, bytes) => {
      if (err) throw err
      this.bytesLastSecond += bytes
    })
  }
  
  update () {
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
        if (alpha > 0) {
          if (mode.mode.initialized) {
            const matrix = mode.mode.getMatrix()
            for (let x = 0; x < matrix.length; x++) {
              for (let y = 0; y < matrix[x].length; y++) {
                let a = matrix[x][y].a*alpha
                newMatrix[x][y] = this.colorBlend(newMatrix[x][y], {
                  ...matrix[x][y], a
                })
              }
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
    // if pixelsToSend then send
    if (pixelsToSend.length === 0) return
    this.sendMatrix(pixelsToSend)
  }

  destroy() {
    clearInterval(this.updateInterval)
    this.udpClient.close()
  }
}