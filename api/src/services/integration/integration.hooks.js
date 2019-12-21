const createIntegrationClass = require('./hooks/create-integration-class')
const removeIntegrationClass = require('./hooks/remove-integration-class')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ createIntegrationClass() ],
    update: [],
    patch: [],
    remove: [ removeIntegrationClass() ]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
