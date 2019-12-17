// Initializes the `device-log` service on path `/device-log`
const { DeviceLog } = require('./device-log.class')
const createModel = require('./device-log.model')
const hooks = require('./device-log.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/device-log', new DeviceLog(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('device-log')

  service.hooks(hooks)
}
