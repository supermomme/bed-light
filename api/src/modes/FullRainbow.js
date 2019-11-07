const Template = require('./Template')
const Ramp = require('ramp.js')

module.exports = class FullRainbow extends Template {
  constructor(_matrix, _config) {
    super(_matrix, _config)
    this.defaultConfig = {
      brightness: 255,
      cycleTime: 60000,
      fadein: 500
    }

    this.nextPhase = 0

    this.init()
  }

  init() {
    this.initialized = false
    this.matrix.fillRed(this.getConfig('brightness'), this.getConfig('fadein'), 'LINEAR')
    this.matrix.fillGreen(0, this.getConfig('fadein'), 'LINEAR')
    this.matrix.fillBlue(0, this.getConfig('fadein'), 'LINEAR')
  }

  update () {
    super.update()
    if (!this.initialized) return

    if(!this.matrix.isRunning()) {
      switch (this.nextPhase) {
        case 0:
          this.matrix.fillRed(0, this.getConfig('cycleTime')/3, 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.matrix.fillGreen(this.getConfig('brightness'), this.getConfig('cycleTime')/3, 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.nextPhase++
          break;
        case 1:
          this.matrix.fillGreen(0, this.getConfig('cycleTime')/3, 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.matrix.fillBlue(this.getConfig('brightness'), this.getConfig('cycleTime')/3, 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.nextPhase++
          break;
        case 2:
          this.matrix.fillBlue(0, this.getConfig('cycleTime')/3, 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.matrix.fillRed(this.getConfig('brightness'), this.getConfig('cycleTime')/3, 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.nextPhase = 0
          break;
      
        default:
          this.nextPhase = 0
          break;
      }
    }
  }
} 
