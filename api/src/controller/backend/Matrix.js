const { Modes } = require('./matrixModes')
const Ramp = require('ramp.js')
const colorBlend = require('color-blend')

module.exports = class Matrix {
  constructor (state, config, enabled) {
    // TODO: use enabled
    this.state = state
    this.config = config
    this.enabled = enabled
    
    this.matrix = []
    for (let x = 0; x < this.config.width; x++) {
      let column = []
      for (let y = 0; y < this.config.height; y++) {
        column.push({ r: 0, g: 0, b: 0, a: 0 })
      }
      this.matrix.push(column)
    }

    this.modes = []
    for (const key in Modes) {
      let mode = new Modes[key](this.config.width, this.config.height)
      this.modes.push({
        mode,
        info: mode.info,
        config: mode.getWholeConfig(),
        alpha: 0
      })
    }

    this.alphaTransitionInterval = setInterval(() => this.updateAlphaTransistions(), 10)
    this.alphaTransistions = []
  }

  defaultState () {
    return this.modes.map(({info, alpha}) => ({info, alpha}))
  }

  setState ({transition = 0, modes = []}) {
    for (let m = 0; m < modes.length; m++) {
      if (transition === 0) this.modes[m].alpha = modes[m].alpha
      else {
        let ramp = new Ramp(this.modes[m].alpha)
        ramp.go(this.modes[m].alpha, transition, 'LINEAR', 'ONCEFORWARD')
        this.alphaTransistions.push({ modeId: m, ramp })
      }      
    }
  }

  setEnabled (enabled) {
    this.enabled = enabled
  }

  isTransitioning () {
    return this.alphaTransistions.length > 0
  }

  colorBlend (A, B) {
    return colorBlend.normal(A, B)
  }

  getBuffer (sendAll = false) {
    let pixelsToSend = []
    if (sendAll) {
      for (let x = 0; x < this.config.width; x++) {
        for (let y = 0; y < this.config.height; y++) {
          pixelsToSend.push({x,y})
        }
      }
    } else {
      pixelsToSend = this.pixelsToSend()
    }

    if (pixelsToSend.length === 0) return Buffer.alloc(0)

    let buffer = Buffer.alloc(pixelsToSend.length*5)
    for (let i = 0; i < pixelsToSend.length; i++) {
      const { x, y } = pixelsToSend[i]
      const { r, g, b, a } = this.matrix[x][y]
      const base = i*5
      buffer.writeUInt8(x, base)   // X
      buffer.writeUInt8(y, base+1) // Y
      buffer.writeUInt8(r*a, base+2) // R
      buffer.writeUInt8(g*a, base+3) // G
      buffer.writeUInt8(b*a, base+4) // B
    }
    return buffer
  }
  
  pixelsToSend () {
    // Init and fill newMatrix
    let newMatrix = []
    for (let x = 0; x < this.config.width; x++) {
      let column = []
      for (let y = 0; y < this.config.height; y++) {
        column.push({ r: 0, g: 0, b: 0, a: 0 })
      }
      newMatrix.push(column)
    }
    for (const modeId in this.modes) {
      const mode = this.modes[modeId]
      const alpha = mode.alpha
      if (alpha > 0 && mode.mode.initialized) {
        const matrix = mode.mode.getMatrix()
        for (let x = 0; x < matrix.length; x++) {
          for (let y = 0; y < matrix[x].length; y++) {
            // let a = matrix[x][y].a*alpha
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




  // merge to new design

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
}