const { Template, Config } = require('./_Template')

exports.Info = {
  id: 'AddressRainbow',
  name: 'AddressRainbow',
  description: '',
  config: {
    ...Config,
    'repeat': {
      name: 'Repeat',
      description: 'Pattern to repeat',
      type: 'number',
      canBeRandom: false,
      triggerInit: true
    },
    'shift': {
      name: 'Shift',
      description: 'Pixels to shift',
      type: 'number',
      canBeRandom: false,
      triggerInit: false
    },
    'direction': {
      name: 'Direction',
      description: 'direction of pattern and of shift',
      type: 'select',
      selectable: [
        { text: 'Y-Axis', value: 'Y' },
        { text: 'X-Axis', value: 'X' }
      ],
      triggerInit: true
    }
  }
}

exports.class = class AddressRainbow extends Template {
  constructor(_width, _height, _config) {
    super(_width, _height, _config)
    this.Info = exports.Info
    this.defaultConfig.repeat = 1
    this.defaultConfig.fps = 8
    this.defaultConfig.shift = 1
    this.defaultConfig.direction = 'Y'

    this.matrix = []

    this.init()
  }

  setConfig (newConfig) {
    let reInit = false
    if (newConfig.repeat && newConfig.repeat !== this.getConfig(newConfig.repeat)) reInit = true
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

    if (this.getConfig('direction').toUpperCase() === 'Y') {
      let frequency = this.height/600*Math.floor(this.getConfig('repeat'))
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          this.matrix[x][y] = {
            r: Math.floor((Math.sin(frequency*y + 0) * 127 + 128)),
            g: Math.floor((Math.sin(frequency*y + 2) * 127 + 128)),
            b: Math.floor((Math.sin(frequency*y + 4) * 127 + 128)),
            a: 1
          }
        }
      }
    }
    super.init()
  }

  update () {
    if (this.getConfig('direction').toUpperCase() === 'Y') {
      this.shiftY()
    }
  }

  shiftY() {
    let shift = this.getConfig('shift')

    for (let x = 0; x < this.width; x++) {
      let oldColumn = this.matrix[x]
      
      for (let y = 0; y < this.height; y++) {
        let color = [ 0, 0, 0 ]
        if (shift < 0) {
          color = y <= shift*-1 ? oldColumn[this.height-1] : oldColumn[y+shift]
        } else if (shift > 0) {
          color = y >= this.height-shift ? oldColumn[0] : oldColumn[y+shift]
        }
        this.matrix[x][y] = color
        
      }
    }
  }
}