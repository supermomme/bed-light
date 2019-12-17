// Initializes the `device` service on path `/device`
const { Device } = require('./device.class')
const createModel = require('./device.model')
const hooks = require('./device.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/device', new Device(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('device')

  service.hooks(hooks)
}
