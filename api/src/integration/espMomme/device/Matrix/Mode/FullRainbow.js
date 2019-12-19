const Template = require('./_Template')
const Ramp = require('ramp.js')


module.exports = class FullRandom extends Template {
  constructor(_width, _height, _config) {
    super(_width, _height, _config)

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
