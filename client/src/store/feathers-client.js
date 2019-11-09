import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import feathersVuex from 'feathers-vuex'

const socket = io('/', { transports: ['websocket'], path: '/api/socket.io' })

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }))

export default feathersClient

// Setting up feathers-vuex
let FeathersVuex = feathersVuex(
  feathersClient,
  {
    serverAlias: 'api', // optional for working with multiple APIs (this is the default value)
    idField: '_id', // Must match the id field in your database table/collection
    whitelist: ['$regex', '$options']
  }
)
const { makeServicePlugin, makeAuthPlugin, BaseModel, models } = FeathersVuex

export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex }
