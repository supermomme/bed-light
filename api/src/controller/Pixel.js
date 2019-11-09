const Ramp = require('ramp.js')

module.exports = class Pixel {
  constructor (_r, _g, _b) {
    this.r = new Ramp(_r)
    this.g = new Ramp(_g)
    this.b = new Ramp(_b)
  }

  isRunning() {
    return this.r.isRunning() && this.g.isRunning() && this.b.isRunning()
  }

  setColor(r, g, b, ms, interpolation_mode, loop_mode) {
    this.setRed(r, ms, interpolation_mode, loop_mode)
    this.setGreen(g, ms, interpolation_mode, loop_mode)
    this.setBlue(b, ms, interpolation_mode, loop_mode)
  }

  setRed(r, ms = 0, interpolation_mode = 'NONE', loop_mode = 'ONCEFORWARD') {
    this.r.go(r, ms, interpolation_mode, loop_mode)
  }

  setGreen(g, ms = 0, interpolation_mode = 'NONE', loop_mode = 'ONCEFORWARD') {
    this.g.go(g, ms, interpolation_mode, loop_mode)
  }

  setBlue(b, ms = 0, interpolation_mode = 'NONE', loop_mode = 'ONCEFORWARD') {
    this.b.go(b, ms, interpolation_mode, loop_mode)
  }

  getColor() {
    return {
      r: Math.floor(this.r.update()),
      g: Math.floor(this.g.update()),
      b: Math.floor(this.b.update())
    }
  }

  // TODO: put ramp.js in here!
}