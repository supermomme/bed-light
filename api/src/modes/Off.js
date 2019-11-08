const Template = require('./_Template')

exports.info = {
  id: 'Off',
  name: 'Off',
  description: '',
  config: [
    {
      id: 'fadeout',
      name: 'Ausblendung der Farben in Millisekunden',
      type: 'number',
      default: 500,
      canBeMinMax: false
    }
  ]
}

exports.class = class Off extends Template {
  constructor(_matrix, _config) {
    super(_matrix, _config)
    this.info = module.exports.info
    this.defaultConfig.fadeout = 500

    this.init()
  }

  init() {
    this.initialized = false
    for (let x = 0; x < this.matrix.width; x++) {
      for (let y = 0; y < this.matrix.height; y++) {
        this.matrix.pixel(x, y, 0, 0, 0, this.getConfig('fadeout'), 'LINEAR', 'ONCEFORWARD')
      }
    }
  }

  update () { }
}
