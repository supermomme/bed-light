let Ramp = require('ramp.js')

module.exports = class FullRandom {
  constructor(_width, _height, _config) {
    this.width = _width
    this.height = _height
    this.defaultConfig = {
      sub: 5,
      waitFrames: [0, 30],
      min: 0,
      max: 255
    }
    this.config = _config || this.defaultConfig
    this.pixels = []
    this.waitFrames = 0
  }

  update () {
    if (!this.initilized) {
      for(var i = this.pixels.length - 1; i >= 0; i--) {
        if(this.pixels[i].r === 0 && this.pixels[i].g === 0 && this.pixels[i].b === 0) {
          this.pixels.splice(i, 1);
        }
      }

      for (let i = 0; i < this.pixels.length; i++) {
        this.pixels[i].r -= this.getConfig('sub')
        if (this.pixels[i].r <= 0) this.pixels[i].r = 0

        this.pixels[i].g -= this.getConfig('sub')
        if (this.pixels[i].g <= 0) this.pixels[i].g = 0

        this.pixels[i].b -= this.getConfig('sub')
        if (this.pixels[i].b <= 0) this.pixels[i].b = 0

      }

      let x = Math.round(Math.random()*(this.width - 1))
      let y = Math.round(Math.random()*(this.height - 1))
      let r = this.randomMinMax(this.getConfig('min'), this.getConfig('max'))
      let g = this.randomMinMax(this.getConfig('min'), this.getConfig('max'))
      let b = this.randomMinMax(this.getConfig('min'), this.getConfig('max'))

      if (this.waitFrames <= 0) {
        this.pixels.push({ x, y, r, g, b })
        this.waitFrames = Array.isArray(this.getConfig('waitFrames')) ? this.randomMinMax(this.getConfig('waitFrames')[0], this.getConfig('waitFrames')[1]) : this.getConfig('waitFrames')
      } else {
        this.waitFrames--
      }

      return this.pixels
    } else return []
  }

  getConfig (conf) {
    return this.config[conf] || this.defaultConfig[conf]
  }

  randomMinMax(min, max) {
    return Math.round(Math.random()*(max-min))+min
  }
} 
