const gadget = require('./gadget/gadget.service.js')
const mode = require('./mode/mode.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(gadget)
  app.configure(mode)
}
