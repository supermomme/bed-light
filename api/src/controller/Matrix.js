const { Modes } = require('../modes.js')
const Ramp = require('ramp.js')

const allowedModes = [
  'AddressRainbow',
  'FullRainbow',
  'FullRandom',
  'UdpImage'
]

module.exports = class Matrix {
  constructor (_width, _height, _app, _index) {
    this.width = _width
    this.height = _height
    this.app = _app
    this.index = _index
    this.matrix = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        column.push({ r: 0, g: 0, b: 0, a: 0 })
      }
      this.matrix.push(column)
    }

    this.modes = { }
    for (const key in Modes) {
      if (Modes.hasOwnProperty(key) && allowedModes.indexOf(key) !== -1) {
        let mode = new Modes[key](this.width, this.height)
        this.modes[key] = {
          mode,
          info: mode.info,
          config: mode.getWholeConfig(),
          alpha: 0
        }
      }
    }

    this.alphaTransitionInterval = setInterval(() => this.updateAlphaTransistions(), 10)
    this.alphaTransistions = []
  }

  isTransitioning () {
    return this.alphaTransistions.length > 0
  }

  updateAlphaTransistions () {
    if (!this.isTransitioning()) return
    for (let i = 0; i < this.alphaTransistions.length; i++) {
      const transition = this.alphaTransistions[i]
      this.modes[transition.modeId].alpha = transition.ramp.update()
    }
    this.alphaTransistions = this.alphaTransistions.filter(val => val.ramp.isRunning())
    if (!this.isTransitioning() && this.app) {
      this.app.service('gadget').patch(this.index, { cmd: 'justFireEvent' })
        .catch(err => console.error(err))
    }
  }

  stopTransitions () {
    this.alphaTransistions = []
  }

  setModeAlpha (modeId, alpha, transitionTime = 0) {
    if (transitionTime === 0) {
      this.modes[modeId].alpha = alpha
    } else {
      let ramp = new Ramp(this.modes[modeId].alpha)
      ramp.go(alpha, transitionTime, 'LINEAR', 'ONCEFORWARD')
      this.alphaTransistions.push({ modeId, ramp })
    }
  }

  setModeConfig(modeId, config) {
    this.modes[modeId].mode.setConfig(config)
  }
}