const { Template, Config } = require('./_Template')
const Ramp = require('ramp.js')

exports.Info = {
  id: 'FullRainbow',
  name: 'FullRainbow',
  description: '',
  config: {
    ...Config,
    'cycleTime': {
      name: 'Cycle Time',
      description: 'Cycle Time in milliseconds',
      type: 'number',
      canBeRandom: false,
      triggerInit: true
    }
  }
}

exports.class = class FullRainbow extends Template {
  constructor(_width, _height, _config) {
    super(_width, _height, _config)
    this.Info = exports.Info

    this.defaultConfig.cycleTime = 120000
    this.nextPhase = 0
    this.r = new Ramp(255)
    this.g = new Ramp(0)
    this.b = new Ramp(0)

    this.init()
  }

  setConfig (newConfig) {
    let reInit = false
    if (newConfig.cycleTime && newConfig.cycleTime !== this.getConfig(newConfig.cycleTime)) reInit = true
    super.setConfig(newConfig)
    if (reInit) this.init()
  }

  init() {
    this.destroy()
    this.nextPhase = 0
    this.r.go(255, 0, 'NONE', 'ONCEFORWARD')
    this.g.go(0, 0, 'NONE', 'ONCEFORWARD')
    this.b.go(0, 0, 'NONE', 'ONCEFORWARD')
    super.init(true)
  }

  getMatrix () {
    let res = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        column.push({
          r: Math.round(this.r.update()),
          g: Math.round(this.g.update()),
          b: Math.round(this.b.update()),
          a: 1
        })
      }
      res.push(column)
    }
    return res
  }

  update () {
    if (this.r.isRunning() || this.g.isRunning() || this.b.isRunning()) return
    switch (this.nextPhase) {
    case 0:
      this.r.go(0, Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
      this.g.go(255, Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
      this.nextPhase++
      break
    case 1:
      this.g.go(0, Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
      this.b.go(255, Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
      this.nextPhase++
      break
    case 2:
      this.b.go(0, Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
      this.g.go(255, Math.floor(this.getConfig('cycleTime')/3), 'SINUSOIDAL_INOUT', 'ONCEFORWARD')
      this.nextPhase = 0
      break
      
    default:
      this.nextPhase = 0
      break
    }
  }
} 
