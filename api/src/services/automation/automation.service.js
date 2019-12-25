// Initializes the `automation` service on path `/automation`
const { Automation } = require('./automation.class')
const createModel = require('./automation.model')
const hooks = require('./automation.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/automation', new Automation(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('automation')

  service.hooks(hooks)
}
