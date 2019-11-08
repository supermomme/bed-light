var normalizedPath = require("path").join(__dirname, "modes");

exports.info = []

require("fs").readdirSync(normalizedPath).forEach((file) => {
  if (file[0] === '_') return
  let mode = require("./modes/" + file)
  exports[mode.info.id] = mode.class
  exports.info.push(mode.info)
});