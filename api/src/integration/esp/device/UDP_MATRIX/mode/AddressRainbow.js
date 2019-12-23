const Template = require('./_Template')

exports.settingComponents = [
  { type: 'SPACER', key: 'Spacer for AddressRainbow' },
  { type: 'HEAD', label: 'Address Rainbow', key: 'HEAD for AddressRainbow' },
  {
    key: 'AddressRainbow.fps',
    label: 'FPS',
    tooltip: 'frames per second',
    type: 'NUMBER'
  },
  {
    key: 'AddressRainbow.cycleTime',
    label: 'Cycle Time',
    tooltip: 'Cycle Time in milliseconds',
    type: 'NUMBER',
  },
  {
    key: 'AddressRainbow.shift',
    label: 'Shift',
    tooltip: 'Pixels to shift',
    type: 'NUMBER'
  },
  {
    key: 'AddressRainbow.direction',
    label: 'Direction',
    tooltip: 'direction of pattern and of shift',
    type: 'SELECT',
    selectable: [
      { text: 'Y-Axis', value: 'Y' }
      // { text: 'X-Axis', value: 'X' } // Not implemented yet
    ]
  }
]

exports.defaultSetting = {
  'AddressRainbow.fps': 10,
  'AddressRainbow.cycleTime': 10000,
  'AddressRainbow.shift': 1,
  'AddressRainbow.direction': 'Y'
}

exports.class = class AddressRainbow extends Template {
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
    super.setConfig(newConfig)
    if (Number(newConfig.cycleTime) && Number(newConfig.cycleTime) !== this.getConfig('cycleTime')) this.config.cycleTime = Number(newConfig.cycleTime)
    if (Number(newConfig.shift) && Number(newConfig.shift) !== this.getConfig('shift')) this.config.shift = Number(newConfig.shift)
    if (newConfig.direction && newConfig.direction !== this.getConfig('direction')) {
      this.config.direction = newConfig.direction
      reInit = true
    }
    if (reInit) this.init()
  }

  getMatrix () {
    if (!this.initialized) return this.getEmptyMatrix()
    return this.matrix
  }

  init() {
    this.destroy()
    this.matrix = this.getEmptyMatrix()
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