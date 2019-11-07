var Modes = require('../modes')
const UdpMatrix = require('./UdpMatrix');

module.exports = class Controller {
  constructor(_matrices, _fps = 60) {

    // INIT Vars

    this.matrices = _matrices
    this.fps = _fps

    // start updater

    this.updater = setInterval(() => {
      this.updateMatrices()
    }, 1000/this.fps)

  }

  setMode(matrixId, uninitilizedMode, ...args) {
    this.matrices[matrixId].mode = new uninitilizedMode(this.matrices[matrixId].matrix, ...args)
  }

  // selectMode (i, mode) {
  //   this.matrices[i].mode.destroy()
  //   delete this.matrices[i].mode
  //   this.matrices[i].mode = new mode(this.matrices[i].width, this.matrices[i].height)
  // }

  updateMatrices () {
    for (let i = 0; i < this.matrices.length; i++) {
      this.matrices[i].mode.update()
    }
  }
}