const { preventChanges } = require('feathers-hooks-common')


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [ preventChanges(true, 'senderType'), preventChanges(true, 'backendType') ],
    patch: [ preventChanges(true, 'senderType'), preventChanges(true, 'backendType') ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
