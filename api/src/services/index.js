
const integration = require('./integration/integration.service.js')
const device = require('./device/device.service.js')
const deviceLog = require('./device-log/device-log.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(integration)
  app.configure(device)
  app.configure(deviceLog)
}
