const Template = require('./Template')
const Ramp = require('ramp.js')

module.exports = class Off extends Template {
  constructor(_matrix, _config) {
    super(_matrix, _config)
    this.defaultConfig = {
      fadeout: 500
    }

    this.init()
  }

  init() {
    this.initialized = false
    for (let x = 0; x < this.matrix.width; x++) {
      for (let y = 0; y < this.matrix.height; y++) {
        this.matrix.pixel(x, y, 0, 0, 0, this.getConfig('fadeout'), 'LINEAR', 'ONCEFORWARD')
      }
    }
  }

  update () { }
} 
