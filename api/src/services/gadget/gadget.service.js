// Initializes the `gadget` service on path `/gadget`
const { Gadget } = require('./gadget.class')
const createModel = require('./gadget.model')
const hooks = require('./gadget.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/gadget', new Gadget(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('gadget')

  service.hooks(hooks)
}
