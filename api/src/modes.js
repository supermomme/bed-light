var normalizedPath = require('path').join(__dirname, 'modes')

exports.Modes = {}
exports.Info = []

require('fs').readdirSync(normalizedPath).forEach((file) => {
  if (file[0] === '_') return
  let mode = require('./modes/' + file)
  exports.Modes[mode.Info.id] = mode.class
  exports.Info.push(mode.Info)
})