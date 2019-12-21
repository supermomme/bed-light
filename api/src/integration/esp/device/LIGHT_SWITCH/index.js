const logger = require('../../../../logger')

module.exports = class Integration {
  constructor (integrationId, socket, app) {
    this.id = integrationId
    this.socket = socket
    this.app = app

  }

  destroy () {
    this.socket.destroy()
  }
}
