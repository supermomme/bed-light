const matrix = require('./matrix/matrix.service.js')
const mode = require('./mode/mode.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(matrix)
  app.configure(mode)
}
