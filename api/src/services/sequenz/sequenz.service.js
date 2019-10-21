// Initializes the `sequenz` service on path `/sequenz`
const { Sequenz } = require('./sequenz.class')
const createModel = require('./sequenz.model')
const hooks = require('./sequenz.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/sequenz', new Sequenz(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('sequenz')

  service.hooks(hooks)
}
