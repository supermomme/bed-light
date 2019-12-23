const Mode = require('./mode')

const frontendComponents = []

for (const modeId in Mode) {
  frontendComponents.push({
    type: 'SLIDER',
    key: `alpha.${modeId}`,
    label: modeId,
    min: 0,
    max: 1
  })
}

module.exports.frontendComponents = frontendComponents
/*
module.exports.config = []
module.exports.defaultConfig = {}
*/