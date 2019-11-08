const Template = require('./_Template')

exports.info = {
  id: 'FullRainbow',
  name: 'FullRainbow',
  description: '',
  config: [
    {
      id: 'brightness',
      name: 'Helligkeit',
      type: 'slider',
      min: 0,
      max: 255,
      default: 255,
      canBeMinMax: false
    },
    {
      id: 'fadein',
      name: 'Einblendungsphase in Millisekunden',
      type: 'number',
      default: 500,
      canBeMinMax: false
    },
    {
      id: 'cycleTime',
      name: 'RGB Cycle durchgang in Milliseconds',
      type: 'number',
      default: 60000,
      canBeMinMax: false
    },
    {
      id: 'fps',
      name: 'Wiederholungsrate in FPS',
      type: 'number',
      default: 60,
      canBeMinMax: true
    }
  ]
}

exports.class = class FullRainbow extends Template {
  constructor(_matrix, _config) {
    super(_matrix, _config)
    this.info = module.exports.info
    this.defaultConfig.brightness = 255
    this.defaultConfig.cycleTime = 60000
    this.defaultConfig.fadein = 500

    this.nextPhase = 0

    this.init()
  }

  init() {
    this.initialized = false
    this.matrix.fillRed(Math.floor(this.getConfig('brightness')), Math.floor(this.getConfig('fadein')), 'LINEAR')
    this.matrix.fillGreen(0, Math.floor(this.getConfig('fadein')), 'LINEAR')
    this.matrix.fillBlue(0, Math.floor(this.getConfig('fadein')), 'LINEAR')
  }

  update () {
    super.update()
    if (!this.initialized || !this.shouldUpdate()) return

    if(!this.matrix.isRunning()) {
      switch (this.nextPhase) {
        case 0:
          this.matrix.fillRed(0, Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.matrix.fillGreen(Math.floor(this.getConfig('brightness')), Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.nextPhase++
          break;
        case 1:
          this.matrix.fillGreen(0, Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.matrix.fillBlue(Math.floor(this.getConfig('brightness')), Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.nextPhase++
          break;
        case 2:
          this.matrix.fillBlue(0, Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.matrix.fillRed(Math.floor(this.getConfig('brightness')), Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
          this.nextPhase = 0
          break;
      
        default:
          this.nextPhase = 0
          break;
      }
    }
  }
} 
