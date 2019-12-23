const Template = require('./_Template')

exports.settingComponents = [
  { type: 'SPACER', key: 'Spacer for FullRainbow' },
  { type: 'HEAD', label: 'Full Rainbow', key: 'HEAD fpor FullRainbow' },
  {
    key: 'FullRainbow.fps',
    label: 'FPS',
    tooltip: 'frames per second',
    type: 'NUMBER'
  },
  {
    key: 'FullRainbow.cycleTime',
    label: 'Cycle Time',
    tooltip: 'Cycle Time in milliseconds',
    type: 'NUMBER',
  }
]

exports.defaultSetting = {
  'FullRainbow.fps': 30,
  'FullRainbow.cycleTime': 120000
}

exports.class = class FullRainbow extends Template {
  constructor(_width, _height, _config) {
    super(_width, _height, _config)

    this.defaultConfig.cycleTime = 120000
    this.cyclePos = 0

    this.init()
  }

  init() {
    this.destroy()
    this.cyclePos = 0
    super.init(true)
  }

  setConfig (newConfig) {
    let reInit = false
    super.setConfig(newConfig)
    if (reInit) this.init()
  }

  getMatrix () {
    if (!this.initialized) return this.getEmptyMatrix()
    let res = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        let { r, g, b } = this.hslToRgb(this.cyclePos, 1, 0.5)
        column.push({
          r,
          g,
          b,
          a: 1
        })
      }
      res.push(column)
    }
    return res
  }

  update () {
    this.cyclePos += 1 / (Number(this.getConfig('fps')) * (Number(this.getConfig('cycleTime')) / 1000))
    if (this.cyclePos >= 1) this.cyclePos = 0
  }
}
