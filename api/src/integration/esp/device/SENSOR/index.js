const logger = require('../../../../logger')

module.exports = class Sensor {
  constructor (deviceId, socket, app, dbDevice) {
    this.id = deviceId
    this.socket = socket
    this.app = app

    this.socket.on('data', (chunk) => this.handleData(chunk).catch(logger.error))
    this.socket.write('REQ_UPDATE\n')

    this.app.service('device').patch(this.id, {
      status: 'CONNECTED',
      statusMessage: 'Connected! All good.'
    })

    this.enable = dbDevice.state.enable
    this.destroyed = false
  }

  async handleData (chunk) {
    if (this.destroyed) return
    if (chunk.toString().startsWith('UPDATE:')) {
      let data = chunk.toString().split(':')[1].split(';').reduce((prev, cur) => {
        let res = {}
        res[`state.${cur.split('=')[0]}`] = cur.split('=')[1]
        return { ...prev, ...res }
      }, { })

      // console.log(data)

      await this.app.service('device').patch(this.id, data)
    }
  }

  destroy () {
    this.destroyed = true
  }
}
