let Ramp = require('ramp.js')

module.exports = class FullRainbow {
  constructor(_width, _height, _config) {
    this.width = _width
    this.height = _height
    this.defaultConfig = {
      brightness: 20,
      cycleTime: 10000
    }
    this.config = _config || this.defaultConfig
    this.r = new Ramp(this.getConfig('brightness'))
    this.g = new Ramp(0)
    this.b = new Ramp(0)
    this.waitFrames = 0
    this.nextPhase = 0
  }

  update () {
    let allFinished = this.r.isFinished() && this.g.isFinished() && this.b.isFinished()
    if(allFinished) {
      switch (this.nextPhase) {
        case 0:
          this.g.go(this.getConfig('brightness'), this.getConfig('cycleTime')/6, 'LINEAR', 'ONCEFORWARD')
          this.nextPhase++
          break;
        case 1:
          this.r.go(0, this.getConfig('cycleTime')/6, 'LINEAR', 'ONCEFORWARD')
          this.nextPhase++
          break;
        case 2:
          this.b.go(this.getConfig('brightness'), this.getConfig('cycleTime')/6, 'LINEAR', 'ONCEFORWARD')
          this.nextPhase++
          break;
        case 3:
          this.g.go(0, this.getConfig('cycleTime')/6, 'LINEAR', 'ONCEFORWARD')
          this.nextPhase++
          break;
        case 4:
          this.r.go(this.getConfig('brightness'), this.getConfig('cycleTime')/6, 'LINEAR', 'ONCEFORWARD')
          this.nextPhase++
          break;
        case 5:
          this.b.go(0, this.getConfig('cycleTime')/6, 'LINEAR', 'ONCEFORWARD')
          this.nextPhase = 0
          break;
      
        default:
          break;
      }
    }

    let res = []
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        res.push({
          x,y,
          r: this.r.update(),
          g: this.g.update(),
          b: this.b.update()
        })
      }
    }
    return res
  }

  getConfig (conf) {
    return this.config[conf] != undefined ? this.config[conf] : this.defaultConfig[conf]
  }
} 
