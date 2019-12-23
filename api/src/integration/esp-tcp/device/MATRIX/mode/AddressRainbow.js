const Template = require('./_Template')


module.exports = class AddressRainbow extends Template {
  constructor(_width, _height, _config) {
    super(_width, _height, _config)
    this.Info = exports.Info
    this.defaultConfig.fps = 10
    this.defaultConfig.shift = 1
    this.defaultConfig.direction = 'Y'
    this.defaultConfig.cycleTime = 10000

    this.p = 0
    this.matrix = []

    this.init()
  }

  setConfig (newConfig) {
    let reInit = false
    if (newConfig.direction && newConfig.direction !== this.getConfig(newConfig.direction)) reInit = true
    super.setConfig(newConfig)
    if (reInit) this.init()
  }

  getMatrix () {
    return this.matrix
  }

  init() {
    this.destroy()

    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        column.push({ r: 0, g: 0, b: 0, a: 0 })
      }
      this.matrix.push(column)
    }
    this.p = 0
    super.init()
  }

  update () {
    if (this.getConfig('direction').toUpperCase() === 'Y') {
      this.p += 1 / (this.getConfig('fps') * (this.getConfig('cycleTime') / 1000))
      if (this.p >= 1) this.p = 0

      let { r, g, b } = this.hslToRgb(this.p, 1, 0.5)
      for (let x = 0; x < this.width; x++) {
        if (this.getConfig('shift') > 0)
          this.matrix[x][0] = { r, g, b, a: 1 }
        else
          this.matrix[x][this.height-1] = { r, g, b, a: 1 }
      }
      this.shiftY()
    }
  }

  shiftY() {
    let shift = this.getConfig('shift')

    for (let x = 0; x < this.width; x++) {
      if (shift > 0) {
        let reverseCol = this.matrix[x].reverse()
        for (let i = 0; i < reverseCol.length; i++) {
          let rgba = this.matrix[x][i]
          if (this.matrix[x][i+shift] !== undefined) {
            rgba = this.matrix[x][i+shift]
          }
          reverseCol[i] = rgba
        }
        this.matrix[x] = reverseCol.reverse()
      } else if (shift < 0) {
        let col = this.matrix[x]
        for (let i = 0; i < col.length; i++) {
          let rgba = this.matrix[x][i]
          if (this.matrix[x][i+(shift*-1)] !== undefined) {
            rgba = this.matrix[x][i+(shift*-1)]
          }
          col[i] = rgba
        }
        this.matrix[x] = col
      }
    }
  }
}