var normalizedPath = require('path').join(__dirname, 'matrixModes')

exports.Modes = {}
exports.Info = []

require('fs').readdirSync(normalizedPath).forEach((file) => {
  if (file[0] === '_') return
  let mode = require('./matrixModes/' + file)
  exports.Modes[mode.Info.id] = mode.class
  exports.Info.push(mode.Info)
})