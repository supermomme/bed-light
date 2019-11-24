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
      triggerInit: false
    }
  }
}

exports.class = class FullRainbow extends Template {
  constructor(_width, _height, _config) {
    super(_width, _height, _config)
    this.Info = exports.Info

    this.defaultConfig.cycleTime = 120000
    this.p = 0

    this.init()
  }

  setConfig (newConfig) {
    let reInit = false
    // if (newConfig.cycleTime && newConfig.cycleTime !== this.getConfig(newConfig.cycleTime)) reInit = true
    super.setConfig(newConfig)
    if (reInit) this.init()
  }

  init() {
    this.destroy()
    this.p = 0
    super.init(true)
  }

  getMatrix () {
    let res = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        let { r, g, b } = this.hslToRgb(this.p, 1, 0.5)
        column.push({
          r,
          g,
          b,
          a: 1
        })
      }
      res.push(column)
    }
    return res
  }

  update () {
    this.p += 1 / (this.getConfig('fps') * (this.getConfig('cycleTime') / 1000))
    if (this.p >= 1) this.p = 0
  }
}
