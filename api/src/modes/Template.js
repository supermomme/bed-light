module.exports = class Template {
  constructor(_matrix, _config = {}) {
    this.matrix = _matrix
    this.defaultConfig = { }
    this.config = _config
    this.initialized = false
  }

  update () {
    if (!this.initialized) this.initialized = !this.matrix.isRunning()
  }

  getConfig (conf) {
    return this.config[conf] != undefined ? this.config[conf] : this.defaultConfig[conf]
  }

  randomMinMax(min, max) {
    return Math.round(Math.random()*(max-min))+min
  }
} 
