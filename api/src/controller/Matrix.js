const { Modes } = require('../modes.js')
const Ramp = require('ramp.js')
const colorBlend = require('color-blend')

const allowedModes = [
  'AddressRainbow',
  'FullRainbow',
  'FullRandom',
  'UdpImage'
]

module.exports = class Matrix {
  constructor (_width, _height, _app, _index) {
    this.width = _width
    this.height = _height
    this.app = _app
    this.index = _index
    this.matrix = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        column.push({ r: 0, g: 0, b: 0, a: 0 })
      }
      this.matrix.push(column)
    }

    this.modes = { }
    for (const key in Modes) {
      if (Modes.hasOwnProperty(key) && allowedModes.indexOf(key) !== -1) {
        let mode = new Modes[key](this.width, this.height)
        this.modes[key] = {
          mode,
          info: mode.info,
          config: mode.getWholeConfig(),
          alpha: 0
        }
      }
    }

    this.alphaTransitionInterval = setInterval(() => this.updateAlphaTransistions(), 10)
    this.alphaTransistions = []
  }

  isTransitioning () {
    return this.alphaTransistions.length > 0
  }

  colorBlend (A, B) {
    return colorBlend.normal(A, B)
  }
  
  pixelsToSend () {
    // Init and fill newMatrix
    let newMatrix = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        column.push({ r: 0, g: 0, b: 0, a: 0 })
      }
      newMatrix.push(column)
    }
    for (const modeId in this.modes) {
      if (this.modes.hasOwnProperty(modeId)) {
        const mode = this.modes[modeId]
        const alpha = mode.alpha
        if (alpha > 0 && mode.mode.initialized) {
          const matrix = mode.mode.getMatrix()
          for (let x = 0; x < matrix.length; x++) {
            for (let y = 0; y < matrix[x].length; y++) {
              let a = matrix[x][y].a*alpha
              let background = {
                r: newMatrix[x][y].r || 0,
                g: newMatrix[x][y].g || 0,
                b: newMatrix[x][y].b || 0,
                a: newMatrix[x][y].a || 0
              }
              let foreground = {
                r: matrix[x][y].r || 0,
                g: matrix[x][y].g || 0,
                b: matrix[x][y].b || 0,
                a: matrix[x][y].a*alpha || 0
              }
              let color = this.colorBlend(background, foreground)
              if (!isNaN(color.r) && !isNaN(color.g) && !isNaN(color.b) && !isNaN(color.a)) newMatrix[x][y] = color
            }
          }
        }
      }
    }

    // Register pixels to send
    let pixelsToSend = []
    for (let x = 0; x < newMatrix.length; x++) {
      for (let y = 0; y < newMatrix[x].length; y++) {
        if (
          newMatrix[x][y].r !== this.matrix[x][y].r ||
          newMatrix[x][y].g !== this.matrix[x][y].g ||
          newMatrix[x][y].b !== this.matrix[x][y].b ||
          newMatrix[x][y].a !== this.matrix[x][y].a
        ) {
          let index = pixelsToSend.findIndex(n => n.x === x && n.y === y)
          if (index === -1) pixelsToSend.push({ x, y })
        }
      }
    }

    // Set this.matrix to newMatrix
    this.matrix = newMatrix
    return pixelsToSend
  }

  updateAlphaTransistions () {
    if (!this.isTransitioning()) return
    for (let i = 0; i < this.alphaTransistions.length; i++) {
      const transition = this.alphaTransistions[i]
      this.modes[transition.modeId].alpha = transition.ramp.update()
    }
    this.alphaTransistions = this.alphaTransistions.filter(val => val.ramp.isRunning())
    if (!this.isTransitioning() && this.app) {
      this.app.service('gadget').patch(this.index, { cmd: 'justFireEvent' })
        .catch(err => console.error(err))
    }
  }

  stopTransitions () {
    this.alphaTransistions = []
  }

  setModeAlpha (modeId, alpha, transitionTime = 0) {
    if (transitionTime === 0) {
      this.modes[modeId].alpha = alpha
    } else {
      let ramp = new Ramp(this.modes[modeId].alpha)
      ramp.go(alpha, transitionTime, 'LINEAR', 'ONCEFORWARD')
      this.alphaTransistions.push({ modeId, ramp })
    }
  }

  setModeConfig(modeId, config) {
    this.modes[modeId].mode.setConfig(config)
  }
}