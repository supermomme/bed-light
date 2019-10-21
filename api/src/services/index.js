const user = require('./user/user.service.js')
const currentSequenz = require('./current-sequenz/current-sequenz.service.js')
const sequenz = require('./sequenz/sequenz.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(user)
  app.configure(currentSequenz)
  app.configure(sequenz)
}
