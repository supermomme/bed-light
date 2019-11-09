// Initializes the `mode` service on path `/mode`
const { Mode } = require('./mode.class')
const hooks = require('./mode.hooks')

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/mode', new Mode(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('mode')

  service.hooks(hooks)
}
