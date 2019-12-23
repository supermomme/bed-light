const Template = require('./_Template')

exports.settingComponents = [
  { type: 'SPACER', key: 'Spacer for Color' },
  { type: 'HEAD', label: 'Color', key: 'HEAD fpor Color' },
  {
    key: 'Color.red',
    label: 'Red',
    tooltip: 'Red',
    type: 'SLIDER',
    min: 0,
    max: 255,
    step: 1,
    thumbSize: 27,
    thumbLabel: 'always'
  },
  {
    key: 'Color.green',
    label: 'Green',
    tooltip: 'Green',
    type: 'SLIDER',
    min: 0,
    max: 255,
    step: 1,
    thumbSize: 27,
    thumbLabel: 'always'
  },
  {
    key: 'Color.blue',
    label: 'Blue',
    tooltip: 'Blue',
    type: 'SLIDER',
    min: 0,
    max: 255,
    step: 1,
    thumbSize: 27,
    thumbLabel: 'always'
  },
  // TODO: combine rgb into COLOR_PICKER
]

exports.defaultSetting = {
  'Color.red': 255,
  'Color.green': 255,
  'Color.blue': 255
}

exports.class = class Color extends Template {
  constructor(_width, _height, _config) {
    super(_width, _height, _config)

    this.defaultConfig.red = 255
    this.defaultConfig.green = 255
    this.defaultConfig.blue = 255
    this.defaultConfig.coverage = 'A'

    this.init()
  }

  setConfig (newConfig) {
    let reInit = false
    super.setConfig(newConfig)
    if (reInit) this.init()
  }

  getMatrix () {
    let res = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        let r = this.getConfig('red')
        let g = this.getConfig('green')
        let b = this.getConfig('blue')
        column.push({ r, g, b, a: 1 })
      }
      res.push(column)
    }
    return res
  }

  update () {
    this.cyclePos += 1 / (this.getConfig('fps') * (this.getConfig('cycleTime') / 1000))
    if (this.cyclePos >= 1) this.cyclePos = 0
  }
}
