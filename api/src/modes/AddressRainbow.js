const Template = require('./Template')

module.exports = class AddressRainbow extends Template {
  constructor(_matrix, _config) {
    super(_matrix, _config)
    this.defaultConfig = {
      brightness: 255,
      cycleTime: 60000,
      fadein: 500,
      repeat: 1,
      waitFrames: 8,
      shift: 1
    }

    this.nextPhase = 0
    this.waitFrames = 0

    this.init()
  }

  init() {
    this.initialized = false
    let frequency = this.matrix.height/600*this.getConfig('repeat')
    for (let x = 0; x < this.matrix.width; x++) {
      for (let y = 0; y < this.matrix.height; y++) {
        this.matrix.pixel(
          x,y,
          Math.sin(frequency*y + 0) * 127 + 128,
          Math.sin(frequency*y + 2) * 127 + 128,
          Math.sin(frequency*y + 4) * 127 + 128,
          this.getConfig('fadein'),
          'LINEAR'
        )
      }
    }
  }

  update () {
    super.update()
    if (!this.initialized) return

    if (this.waitFrames <= 0) {
      this.matrix.shiftY(this.getConfig('shift'))
      this.waitFrames = Array.isArray(this.getConfig('waitFrames')) ? this.randomMinMax(this.getConfig('waitFrames')[0], this.getConfig('waitFrames')[1]) : this.getConfig('waitFrames')
    } else {
      this.waitFrames--
    }
  }
} 


// TODO: This could be done better!
/*
Ich könnte den ramp kram nutzen (pixel-individuell)
dafür bräuchte ich den im pixel ein phase storage
*/