const Template = require('./_Template')

exports.info = {
  id: 'FullRandom',
  name: 'FullRandom',
  description: '',
  config: [
    {
      id: 'fadein',
      name: 'Einblendungsphase in Millisekunden',
      type: 'number',
      default: 500,
      canBeMinMax: false
    },
    {
      id: 'fadeout',
      name: 'Ausblenden in Milliseconds',
      type: 'number',
      default: [ 700, 1300 ],
      canBeMinMax: true
    },
    {
      id: 'fps',
      name: 'Wiederholungsrate in FPS',
      type: 'number',
      default: [ 1, 25 ],
      canBeMinMax: true
    },
    {
      id: 'colorR',
      name: 'Farbe Rot',
      type: 'slider',
      min: 0,
      max: 255,
      default: [ 0, 255 ],
      canBeMinMax: true
    },
    {
      id: 'colorG',
      name: 'Farbe Green',
      type: 'slider',
      min: 0,
      max: 255,
      default: [ 0, 255 ],
      canBeMinMax: true
    },
    {
      id: 'colorB',
      name: 'Farbe Blau',
      type: 'slider',
      min: 0,
      max: 255,
      default: [ 0, 255 ],
      canBeMinMax: true
    }
  ]
}

exports.class = class FullRandom extends Template {
  constructor(_matrix, _config) {
    super(_matrix, _config)
    this.info = module.exports.info
    this.defaultConfig.fadeout = [ 700, 1300 ]
    this.defaultConfig.fps = [ 1, 25 ]
    this.defaultConfig.colorR = [0, 255]
    this.defaultConfig.colorG = [0, 255]
    this.defaultConfig.colorB = [0, 255]
    this.defaultConfig.fadein = 500

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
    if (!this.initialized || !this.shouldUpdate()) return

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
