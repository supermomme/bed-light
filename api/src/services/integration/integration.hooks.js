const createIntegrationClass = require('./hooks/create-integration-class')
const removeIntegrationClass = require('./hooks/remove-integration-class')
const patchIntegrationClass = require('./hooks/patch-integration-class')

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
    update: [ patchIntegrationClass() ],
    patch: [ patchIntegrationClass() ],
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
