

module.exports = class Integration {
  constructor (deviceId) {
    this.id = deviceId
    this.sendAll = true
  }

  getBuffer() {
    // TODO: return buffer
    this.sendAll = false
  }
}