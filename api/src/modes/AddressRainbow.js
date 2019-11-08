const Template = require('./_Template')

exports.info = {
  id: 'AddressRainbow',
  name: 'AddressRainbow',
  description: '',
  config: [
    {
      id: 'brightness',
      name: 'Helligkeit',
      type: 'slider',
      min: 0,
      max: 255,
      default: 255,
      canBeMinMax: false
    },
    {
      id: 'fadein',
      name: 'Einblendungsphase in Millisekunden',
      type: 'number',
      default: 500,
      canBeMinMax: false
    },
    {
      id: 'repeat',
      name: 'Wiederholung des Farbspektrums',
      type: 'number',
      default: 1,
      canBeMinMax: false
    },
    {
      id: 'fps',
      name: 'Wiederholungsrate in FPS',
      type: 'slider',
      default: 8,
      min: 1,
      max: 60,
      canBeMinMax: true
    },
    {
      id: 'shift',
      name: 'Anzahl der Pixel die Verschoben werden sollen',
      type: 'number',
      default: 1,
      canBeMinMax: false
    },
  ]
}

exports.class = class AddressRainbow extends Template {
  constructor(_matrix, _config) {
    super(_matrix, _config)
    this.info = module.exports.info

    this.defaultConfig.brightness = 255
    this.defaultConfig.fadein = 500
    this.defaultConfig.repeat = 1
    this.defaultConfig.fps = 8
    this.defaultConfig.shift = 1

    this.nextPhase = 0

    this.init()
  }

  init() {
    this.initialized = false
    let frequency = this.matrix.height/600*Math.floor(this.getConfig('repeat'))
    for (let x = 0; x < this.matrix.width; x++) {
      for (let y = 0; y < this.matrix.height; y++) {
        this.matrix.pixel(
          x,y,
          Math.floor((Math.sin(frequency*y + 0) * 127 + 128)/255*this.getConfig('brightness')),
          Math.floor((Math.sin(frequency*y + 2) * 127 + 128)/255*this.getConfig('brightness')),
          Math.floor((Math.sin(frequency*y + 4) * 127 + 128)/255*this.getConfig('brightness')),
          Math.floor(this.getConfig('fadein')),
          'LINEAR'
        )
      }
    }
  }

  update () {
    super.update()
    if (!this.initialized || !this.shouldUpdate()) return

    this.matrix.shiftY(Math.floor(this.getConfig('shift')))
  }
} 


// TODO: This could be done better!
/*
Ich könnte den ramp kram nutzen (pixel-individuell)
dafür bräuchte ich den im pixel ein phase storage
*/