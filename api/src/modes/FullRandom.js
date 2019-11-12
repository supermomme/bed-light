const { Template, Config } = require('./_Template')
const Ramp = require('ramp.js')

exports.Info = {
  id: 'FullRandom',
  name: 'FullRandom',
  description: '',
  config: {
    ...Config,
    'probability': {
      name: 'Probability',
      description: 'Probability of new Pixel to fadeout',
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.01,
      canBeRandom: false,
      triggerInit: false
    },
    'fadeout': {
      name: 'Fadeout',
      description: 'Time in milliseconds to fadeout',
      type: 'number',
      canBeRandom: true,
      triggerInit: false
    },
    'colorR': {
      name: 'Red Color',
      description: '',
      type: 'slider',
      min: 0,
      max: 255,
      step: 1,
      canBeRandom: true,
      triggerInit: false
    },
    'colorG': {
      name: 'Green Color',
      description: '',
      type: 'slider',
      min: 0,
      max: 255,
      step: 1,
      canBeRandom: true,
      triggerInit: false
    },
    'colorB': {
      name: 'Blue Color',
      description: '',
      type: 'slider',
      min: 0,
      max: 255,
      step: 1,
      canBeRandom: true,
      triggerInit: false
    }
  }
}

exports.class = class FullRandom extends Template {
  constructor(_width, _height, _config) {
    super(_width, _height, _config)
    this.Info = exports.Info

    this.defaultConfig.probability = 0.3
    this.defaultConfig.fadeout = [ 700, 1300 ]
    this.defaultConfig.colorR = [ 0, 255 ]
    this.defaultConfig.colorG = [ 0, 255 ]
    this.defaultConfig.colorB = [ 0, 255 ]

    this.matrixR = []

    this.init()
  }

  init () {
    this.destroy()
    this.matrixR = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        column.push({ r: 0, g: 0, b: 0, a: new Ramp(0) })
      }
      this.matrixR.push(column)
    }
    super.init()
  }

  getMatrix () {
    let res = []
    for (let x = 0; x < this.matrixR.length; x++) {
      res.push(this.matrixR[x].map((val) => {
        return {
          r: val.r,
          g: val.g,
          b: val.b,
          a: val.a.update()
        }
      }))
    }
    return res
  }

  update () {

    if (Math.random() > this.getConfig('probability')) return

    let fadeout = Array.isArray(this.getConfig('fadeout')) ? this.randomMinMax(this.getConfig('fadeout')[0], this.getConfig('fadeout')[1]) : this.getConfig('fadeout')
    let x = Math.round(Math.random()*(this.width - 1))
    let y = Math.round(Math.random()*(this.height - 1))

    this.matrixR[x][y].r = this.getRedColor()
    this.matrixR[x][y].g = this.getGreenColor()
    this.matrixR[x][y].b = this.getBlueColor()
    this.matrixR[x][y].a.go(1, 0, 'NONE', 'ONCEFORWARD')

    this.matrixR[x][y].a.go(0, fadeout, 'LINEAR', 'ONCEFORWARD')

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
