const createIntegrationClass = require('./hooks/create-integration-class')
const removeIntegrationClass = require('./hooks/remove-integration-class')
const patchIntegrationClassConfig = require('./hooks/patch-integration-class-config')

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
    update: [ patchIntegrationClassConfig() ],
    patch: [ patchIntegrationClassConfig() ],
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
