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
        let rgb = this.hslToRgb(this.p, 1, 0.5)
        column.push({
          r: rgb[0],
          g: rgb[1],
          b: rgb[2],
          a: 1
        })
      }
      res.push(column)
    }
    return res
  }

  hslToRgb (h, s, l) {
    var r, g, b;
    if (s == 0) {
      r = g = b = l // achromatic
    } else {
      var hue2rgb = function hue2rgb (p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
  
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
  
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  update () {
    this.p += this.getConfig('fps') / this.getConfig('cycleTime')
    if (this.p >= 1) this.p = 0
  }
}
