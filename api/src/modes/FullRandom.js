const Template = require('./Template')

module.exports = class FullRandom extends Template {
  constructor(_matrix, _config) {
    super(_matrix, _config)
    this.defaultConfig = {
      fadeout: [ 700, 1300 ],
      waitFrames: [0, 30],
      colorR: [0, 255],
      colorG: [0, 255],
      colorB: [0, 255],
      fadein: 500
    }
    this.waitFrames = 0

    this.init()
  }

  init () {
    this.initialized = false
    this.matrix.fillRed(0, this.getConfig('fadein'), 'LINEAR')
    this.matrix.fillGreen(0, this.getConfig('fadein'), 'LINEAR')
    this.matrix.fillBlue(0, this.getConfig('fadein'), 'LINEAR')
  }

  update () {
    super.update()
    if (!this.initialized) return

    if (this.waitFrames <= 0) {
      let fadeout = Array.isArray(this.getConfig('fadeout')) ? this.randomMinMax(this.getConfig('fadeout')[0], this.getConfig('fadeout')[1]) : this.getConfig('fadeout')
      let x = Math.round(Math.random()*(this.matrix.width - 1))
      let y = Math.round(Math.random()*(this.matrix.height - 1))
  
      this.matrix.pixel(
        x,
        y,
        this.getRedColor(),
        this.getGreenColor(),
        this.getBlueColor()
      )
      this.matrix.pixel(
        x,
        y,
        0,
        0,
        0,
        fadeout,
        'LINEAR',
        'ONCEFORWARD'
      )
      this.waitFrames = Array.isArray(this.getConfig('waitFrames')) ? this.randomMinMax(this.getConfig('waitFrames')[0], this.getConfig('waitFrames')[1]) : this.getConfig('waitFrames')
    } else {
      this.waitFrames--
    }
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
} 
