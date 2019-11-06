var Modes = require('./modes')
const dgram = require('dgram');

module.exports = class Main {
  constructor() {

    // CONFIG
    let _modes = Modes
    let _matrices = [
      { name: 'Bed', host: '10.0.80.21', port: '33333', width: 2, height: 60 }
    ]
    let _fps = 60

    // INIT Vars

    this.modes = _modes
    this.matrices = _matrices.map(({bed, host, port, width, height}) => ({
      bed, host, port, width, height,
      mode: new this.modes.FullRainbow(width, height)
    }))
    this.fps = _fps
    this.udpClient = dgram.createSocket('udp4')

    // start updater

    this.updater = setInterval(() => {
      this.updateMatrices()
    }, 1000/this.fps)

    this.lastBytesStat = 0
    this.statUpdaterI = 10000
    this.statUpdater = setInterval(() => {
      console.log(`${this.lastBytesStat*1000/this.statUpdaterI} bytes/second average in 10seconds`)
      this.lastBytesStat = 0
    }, this.statUpdaterI)
  }

  selectMode (i, mode) {
    this.matrices[i].mode.destroy()
    delete this.matrices[i].mode
    this.matrices[i].mode = new mode(this.matrices[i].width, this.matrices[i].height)
  }

  updateMatrices () {
    for (let i = 0; i < this.matrices.length; i++) {
      const matrix = this.matrices[i];
      let pixels = matrix.mode.update()
      if (pixels.length > 0) {
        // Process Pixels
        let buffer = Buffer.alloc(pixels.length*5)
        for (let i = 0; i < pixels.length; i++) {
          const pixel = pixels[i];
          const base = i*5
          buffer.writeUInt8(pixel.x, base)   // X
          buffer.writeUInt8(pixel.y, base+1) // Y
          buffer.writeUInt8(pixel.r, base+2) // R
          buffer.writeUInt8(pixel.g, base+3) // G
          buffer.writeUInt8(pixel.b, base+4) // B
        }
        this.sendBuffer(matrix.host, matrix.port, buffer)
      }
    }
  }

  sendBuffer(host, port, buffer) {
    this.udpClient.send(buffer, 0, buffer.length, port, host, (err, bytes) => {
      if (err) throw err;
      this.lastBytesStat += bytes
    })
  }
}