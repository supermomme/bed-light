exports.Config = {
  fps: {
    name: 'FPS',
    description: 'frames per second',
    type: 'number',
    canBeRandom: false,
    triggerInit: true
  }
}

exports.Template = class Template {
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
} 
