// src/store/services/gadget.js
import feathersClient, { makeServicePlugin, BaseModel } from '../feathers-client'

class Gadget extends BaseModel {
  static modelName = 'Gadget'
}
const servicePath = 'gadget'
const servicePlugin = makeServicePlugin({
  Model: Gadget,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
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
})

export default servicePlugin
