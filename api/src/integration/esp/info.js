module.exports.frontendComponents = {
  LIGHT_SWITCH: require('./device/LIGHT_SWITCH/info').frontendComponents,
  UDP_MATRIX: require('./device/UDP_MATRIX/info').frontendComponents
}

module.exports.settingComponents = {
  LIGHT_SWITCH: [], // TODO: create LIGHT_SWITCH settingComponents
  UDP_MATRIX: require('./device/UDP_MATRIX/info').settingComponents
}
