const Template = require('./_Template')
const Ramp = require('ramp.js')

exports.settingComponents = [
  { type: 'SPACER', key: 'Spacer for FullRandom' },
  { type: 'HEAD', label: 'Full Random', key: 'HEAD fpor FullRandom' },
  {
    key: 'FullRandom.fps',
    label: 'FPS',
    tooltip: 'frames per second',
    type: 'NUMBER'
  },
  {
    key: 'FullRandom.probability',
    label: 'Probability',
    tooltip: 'Probability of new Pixel to fadeout',
    type: 'SLIDER',
    min: 0,
    max: 1,
    step: 0.01,
    thumbSize: 27,
    thumbLabel: 'always'
  },
  {
    key: 'FullRandom.fadeout',
    label: 'Fadeout',
    tooltip: 'Time in milliseconds to fadeout',
    type: 'NUMBER'
    // IMPROVEMENT: implement range feature
  },
  {
    key: 'FullRandom.colorR',
    label: 'Red Color',
    tooltip: '',
    type: 'RANGE_SLIDER',
    min: 0,
    max: 255,
    step: 1,
    thumbSize: 27,
    thumbLabel: 'always'
  },
  {
    key: 'FullRandom.colorG',
    label: 'Green Color',
    tooltip: '',
    type: 'RANGE_SLIDER',
    min: 0,
    max: 255,
    step: 1,
    thumbSize: 27,
    thumbLabel: 'always'
  },
  {
    key: 'FullRandom.colorB',
    label: 'Blue Color',
    tooltip: '',
    type: 'RANGE_SLIDER',
    min: 0,
    max: 255,
    step: 1,
    thumbSize: 27,
    thumbLabel: 'always'
  }
]

exports.defaultSetting = {
  'FullRandom.fps': 30,
  'FullRandom.probability': 0.3,
  'FullRandom.fadeout': 1000,
  'FullRandom.colorR': [ 0, 255 ],
  'FullRandom.colorG': [ 0, 255 ],
  'FullRandom.colorB': [ 0, 255 ]
}

exports.class = class FullRandom extends Template {
  constructor(_width, _height, _config) {
    super(_width, _height, _config)

    this.defaultConfig.probability = 0.3
    this.defaultConfig.fadeout = 1000
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

  setConfig (newConfig) {
    let reInit = false
    super.setConfig(newConfig)
    if (reInit) this.init()
  }

  getMatrix () {
    if (!this.initialized) return this.getEmptyMatrix()
    let res = []
    for (let x = 0; x < this.matrixR.length; x++) {
      res.push(this.matrixR[x].map((val) => {
        let a = val.a.update()
        return {
          r: a === 0 ? 0 : val.r,
          g: a === 0 ? 0 : val.g,
          b: a === 0 ? 0 : val.b,
          a
        }
      }))
    }
    return res
  }

  update () {

    if (Math.random() > Number(this.getConfig('probability'))) return

    let fadeout = Array.isArray(this.getConfig('fadeout')) ? this.randomMinMax(Number(this.getConfig('fadeout')[0]), Number(this.getConfig('fadeout')[1])) : Number(this.getConfig('fadeout'))
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
    return Array.isArray(color) ? this.randomMinMax(Number(color[0]), Number(color[1])) : Number(color)
  }

  getGreenColor () {
    let color = this.getConfig('colorG')
    return Array.isArray(color) ? this.randomMinMax(Number(color[0]), Number(color[1])) : Number(color)
  }

  getBlueColor () {
    let color = this.getConfig('colorB')
    return Array.isArray(color) ? this.randomMinMax(Number(color[0]), Number(color[1])) : Number(color)
  }
} 
