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
  {
    key: 'coverage',
    label: 'Coverage',
    tooltip: 'Where is it lit up?',
    type: 'SELECT',
    selectable: [
      { text: 'All', value: 'A' },
      { text: 'All-Right', value: 'AR' },
      { text: 'All-Left', value: 'AL' },
      { text: 'All-Top', value: 'AT' },
      { text: 'All-Middle', value: 'AM' },
      { text: 'All-Bottom', value: 'AB' },
      { text: 'Top-Right', value: 'TR' },
      { text: 'Top-Left', value: 'TL' },
      { text: 'Middle-Right', value: 'MR' },
      { text: 'Middle-Left', value: 'ML' },
      { text: 'Bottom-Right', value: 'BR' },
      { text: 'Bottom-Left', value: 'BL' }
    ]
  },
  ...settingComponents
]