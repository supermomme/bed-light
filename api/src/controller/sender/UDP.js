const dgram = require('dgram')

module.exports = class UDP {
  constructor (senderConfig) {
    this.senderConfig = senderConfig || { }

    this.udpClient = dgram.createSocket('udp4')
    this.fps = this.senderConfig.fps || 60
    this.statInterval = setInterval(() => this.updateStats(), 1000)

    this.bytesPerSecond = 0
    this.bytesLastSecond = 0

  }

  updateStats () {
    this.bytesPerSecond = this.bytesLastSecond
    this.bytesLastSecond = 0
    console.log(`Currently sending ${this.bytesPerSecond} bps`)
  }

  sendBuffer (buffer) {
    this.udpClient.send(buffer, 0, buffer.length, this.senderConfig.port, this.senderConfig.host, (err, bytes) => {
      if (err) throw err
      this.bytesLastSecond += bytes
    })
  }

  setConfig (config) { // eslint-disable-line no-unused-vars
    // TODO: handle config
  }

  destroy() {
    clearInterval(this.updateInterval)
    this.udpClient.close()
  }
}