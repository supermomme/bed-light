// TODO: setup Light in general
module.exports = class Integration {
  constructor (deviceId, app) {
    this.id = deviceId
    this.app = app
  }

  setfromBuffer(buffer) {
    // set state by buffer via database
  }

  getBuffer() {
    // this.sendAll = false
    return Buffer.alloc(0)
  }

  patchState(state) {}

  destroy() {}
}