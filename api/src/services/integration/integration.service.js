// Initializes the `integration` service on path `/integration`
const { Integration } = require('./integration.class')
const createModel = require('./integration.model')
const hooks = require('./integration.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/integration', new Integration(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('integration')

  service.hooks(hooks)
}
