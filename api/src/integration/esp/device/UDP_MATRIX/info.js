const { Modes, settingComponents } = require('./mode')

const frontendComponents = []

for (const modeId in Modes) {
  frontendComponents.push({
    type: 'SLIDER',
    key: `alpha.${modeId}`,
    label: modeId,
    min: 0,
    max: 1,
    step: 0.01,
    thumbSize: 27,
    thumbLabel: 'always'
  })
}

module.exports.frontendComponents = frontendComponents
module.exports.settingComponents = [
  {
    type: 'NUMBER',
    key: 'transitionTime',
    label: 'Transition Time',
    min: 0
  },
  ...settingComponents
]