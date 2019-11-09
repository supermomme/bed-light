const Matrix = require('./Matrix')
const dgram = require('dgram')

module.exports = class UdpMatrix extends Matrix {
  constructor (_width, _height, _host, _port, _fps) {
    super(_width, _height)
    this.host = _host
    this.port = _port
    this.pixelsToSend = []
    this.udpClient = dgram.createSocket('udp4')
    this.fps = _fps || 60
    this.sendInterval = setInterval(() => this.send(), 1000/this.fps)
    this.statInterval = setInterval(() => this.updateStats(), 1000)
    
    this.bytesPerSecond = 0
    this.bytesLastSecond = 0
  }

  updateStats () {
    this.bytesPerSecond = this.bytesLastSecond
    this.bytesLastSecond = 0
    console.log(`Currently sending ${this.bytesPerSecond} bps`)
  }
  
  send () {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let index = this.pixelsToSend.findIndex(n => {
          return n.x === x && n.y === y
        })
        if (index === -1 && this.matrix[x][y].isRunning()) this.pixelsToSend.push({x, y})
      }
    }
    if (this.pixelsToSend.length === 0) return
    let buffer = Buffer.alloc(this.pixelsToSend.length*5)
    for (let i = 0; i < this.pixelsToSend.length; i++) {
      const { x, y } = this.pixelsToSend[i]
      const { r, g, b }= this.matrix[x][y].getColor()
      const base = i*5
      buffer.writeUInt8(x, base)   // X
      buffer.writeUInt8(y, base+1) // Y
      buffer.writeUInt8(r, base+2) // R
      buffer.writeUInt8(g, base+3) // G
      buffer.writeUInt8(b, base+4) // B
    }
    this.pixelsToSend = []
    this.udpClient.send(buffer, 0, buffer.length, this.port, this.host, (err, bytes) => {
      if (err) throw err
      this.bytesLastSecond += bytes
    })
  }

  destroy() {
    clearInterval(this.sendInterval)
    this.udpClient.close()
  }

  pixel (x, y, ...args) {
    super.pixel(x, y, ...args)
    this.pixelsToSend.push({x,y})
  }
}