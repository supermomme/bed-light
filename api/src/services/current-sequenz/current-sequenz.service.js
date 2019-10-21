// Initializes the `current-sequenz` service on path `/current-sequenz`
const { CurrentSequenz, ledDriver } = require('./current-sequenz.class')
const hooks = require('./current-sequenz.hooks')

module.exports = function (app) {
  app.configure(ledDriver)

  const paginate = app.get('paginate')

  const options = {
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/current-sequenz', new CurrentSequenz(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('current-sequenz')

  service.hooks(hooks)
}
