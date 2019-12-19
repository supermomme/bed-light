module.exports = class Template {
  constructor(_width, _height, _config = {}) {
    this.width = _width
    this.height = _height
    this.defaultConfig = { fps : 30 }
    this.config = _config
    this.updateInterval = null
    this.initialized = false
  }

  destroy () {
    this.initialized = false
    clearInterval(this.updateInterval)
  }

  init (alreadyDestroyed = false) {
    if (!alreadyDestroyed) this.destroy()
    this.updateInterval = setInterval(() => this.update(), 1000/this.getConfig('fps'))
    this.initialized = true
  }

  update () { }

  setConfig (newConf) {
    for (const key in newConf) {
      if (newConf.hasOwnProperty(key)) {
        this.config[key] = newConf[key]
      }
    }
    if (newConf.fps) this.init()
  }

  getConfig (conf) {
    return this.getWholeConfig()[conf]
  }

  getWholeConfig () {
    let con = {}
    for (const key in this.defaultConfig) {
      con[key] = this.defaultConfig[key]
    }
    for (const key in this.config) {
      con[key] = this.config[key]
    }
    return con
  }

  randomMinMax(min, max) {
    return Math.round(Math.random()*(max-min))+min
  }

  hslToRgb (h, s, l) {
    var r, g, b
    if (s == 0) {
      r = g = b = l // achromatic
    } else {
      var hue2rgb = function hue2rgb (p, q, t) {
        if(t < 0) t += 1
        if(t > 1) t -= 1
        if(t < 1/6) return p + (q - p) * 6 * t
        if(t < 1/2) return q
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
  
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s
      var p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
  
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }
} 
