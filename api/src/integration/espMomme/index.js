/*
Integration control the communication with the end device
Integration manages its device in database and in script
  -> Detect (speak with enddevice) kind of device (can be multiple) and update database and running scripts

*/

module.exports = class Integration {
  constructor (integrationId, app) {
    this.id = integrationId
    this.app = app

    this.device = {}
    // TODO: create communication
    // this.discover()
  }

  discover () {
    // TODO: detect devices via communication
    // TODO: delete, patch, create device in database
  }

  patchDeviceState(deviceId, payload) {
    this.device[deviceId].patchDeviceState(payload)
  }

  destroy () {
  }
}
