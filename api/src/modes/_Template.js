module.exports = class Template {
  constructor(_matrix, _config = {}) {
    this.matrix = _matrix
    this.defaultConfig = { fps: this.matrix.fps }
    this.config = _config
    this.initialized = false
    this.waitFrames = 0
  }

  shouldUpdate () {
    return this.waitFrames === 0
  }

  update () {
    if (!this.initialized) this.initialized = !this.matrix.isRunning()
    if (this.waitFrames < 0) {
      let myFps = Array.isArray(this.getConfig('fps')) ? this.randomMinMax(this.getConfig('fps')[0], this.getConfig('fps')[1]) : this.getConfig('fps')
      if (myFps > this.matrix.fps) myFps = this.matrix.fps
      this.waitFrames  = Math.floor((this.matrix.fps / myFps) - 1)
    } else {
      this.waitFrames--
    }
  }

  getConfig (conf) {
    return this.getWholeConfig()[conf]
    // this.config[conf] == undefined ? this.defaultConfig[conf] : this.config[conf]
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
