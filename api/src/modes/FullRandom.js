let Ramp = require('ramp.js')

module.exports = class FullRandom {
  constructor(_width, _height, _config) {
    this.width = _width
    this.height = _height
    this.defaultConfig = {
      fadeout: [ 700, 1300 ],
      waitFrames: [0, 30],
      colorR: [0, 255],
      colorG: [0, 255],
      colorB: [0, 255],
    }
    this.config = _config || this.defaultConfig
    this.pixels = []
    this.waitFrames = 0
  }

  update () {
    for(var i = this.pixels.length - 1; i >= 0; i--) {
      if(this.pixels[i].r.isFinished() && this.pixels[i].g.isFinished() && this.pixels[i].b.isFinished()) {
        this.pixels.splice(i, 1);
      }
    }

    let fadeout = Array.isArray(this.getConfig('fadeout')) ? this.randomMinMax(this.getConfig('fadeout')[0], this.getConfig('fadeout')[1]) : this.getConfig('fadeout')
    let x = Math.round(Math.random()*(this.width - 1))
    let y = Math.round(Math.random()*(this.height - 1))

    let r = new Ramp(this.getRedColor())
    r.go(0, fadeout, 'LINEAR', 'ONCEFORWARD')
    let g = new Ramp(this.getGreenColor())
    g.go(0, fadeout, 'LINEAR', 'ONCEFORWARD')
    let b = new Ramp(this.getBlueColor())
    b.go(0, fadeout, 'LINEAR', 'ONCEFORWARD')

    if (this.waitFrames <= 0) {
      this.pixels.push({ x, y, r, g, b })
      this.waitFrames = Array.isArray(this.getConfig('waitFrames')) ? this.randomMinMax(this.getConfig('waitFrames')[0], this.getConfig('waitFrames')[1]) : this.getConfig('waitFrames')
    } else {
      this.waitFrames--
    }

    return this.pixels.map(({x,y,r,g,b}) => ({
        x,y,
        r: r.update(),
        g: g.update(),
        b: b.update()
    }))
  }

  getConfig (conf) {
    return this.config[conf] != undefined ? this.config[conf] : this.defaultConfig[conf]
  }

  getRedColor () {
    let color = this.getConfig('colorR')
    return Array.isArray(color) ? this.randomMinMax(color[0], color[1]) : color
  }

  getGreenColor () {
    let color = this.getConfig('colorG')
    return Array.isArray(color) ? this.randomMinMax(color[0], color[1]) : color
  }

  getBlueColor () {
    let color = this.getConfig('colorB')
    return Array.isArray(color) ? this.randomMinMax(color[0], color[1]) : color
  }

  randomMinMax(min, max) {
    return Math.round(Math.random()*(max-min))+min
  }
} 
