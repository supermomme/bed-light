const Matrix = require('./Matrix')
const dgram = require('dgram')

module.exports = class UdpMatrix extends Matrix {
  constructor (_width, _height, _app, _index, _host, _port, _fps) {
    super(_width, _height, _app, _index)
    this.host = _host
    this.port = _port
    this.udpClient = dgram.createSocket('udp4')
    this.fps = _fps || 60
    this.updateInterval = setInterval(() => this.sendMatrix(), 1000/this.fps)
    this.statInterval = setInterval(() => this.updateStats(), 1000)

    this.bytesPerSecond = 0
    this.bytesLastSecond = 0

    this.sendMatrix(true)
  }

  updateStats () {
    this.bytesPerSecond = this.bytesLastSecond
    this.bytesLastSecond = 0
    console.log(`Currently sending ${this.bytesPerSecond} bps`)
  }

  sendMatrix(sendAll = false) {
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

  destroy() {
    clearInterval(this.updateInterval)
    this.udpClient.close()
  }
}