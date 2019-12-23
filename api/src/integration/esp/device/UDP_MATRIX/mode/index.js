

module.exports.Modes = {
  AddressRainbow: require('./AddressRainbow').class,
  FullRainbow: require('./FullRainbow').class,
  FullRandom: require('./FullRandom').class
}

module.exports.defaultSetting = {
  transitionTime: 500,
  ...require('./AddressRainbow').defaultSetting,
  ...require('./FullRainbow').defaultSetting,
  ...require('./FullRandom').defaultSetting
}

module.exports.settingComponents = [
  ...require('./AddressRainbow').settingComponents,
  ...require('./FullRainbow').settingComponents,
  ...require('./FullRandom').settingComponents,
]