const logger = require('../../../../logger')

module.exports = class Light_Switch {
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

    this.app.service('device').on('patched', (data) => this.handlePatch(data).catch(logger.error))
    this.app.service('device').on('updated', (data) => this.handlePatch(data).catch(logger.error))

    this.enable = dbDevice.state.enable
    this.destroyed = false
  }

  async handleData (chunk) {
    if (this.destroyed) return
    if (chunk.toString().startsWith('UPDATE:')) {
      let data = chunk.toString().split(':')[1].split(';').reduce((prev, cur) => {
        let res = {}
        res[cur.split('=')[0]] = cur.split('=')[1]
        return { ...prev, ...res }
      }, { })

      this.enable = data.ENABLE === '1'
      await this.app.service('device').patch(this.id, { 'state.enable': this.enable })
    }
  }

  async handlePatch (data) {
    if (this.destroyed) return
    if (data.state.enable != this.enable) {
      this.enable = data.state.enable
      this.socket.write(`UPDATE:ENABLE=${this.enable ? '1': '0'}\n`)
    }
  }

  destroy () {
    this.destroyed = true
  }
}
