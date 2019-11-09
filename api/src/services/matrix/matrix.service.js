// Initializes the `matrix` service on path `/matrix`
const { Matrix } = require('./matrix.class')
const hooks = require('./matrix.hooks')

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/matrix', new Matrix(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('matrix')

  service.hooks(hooks)
}
