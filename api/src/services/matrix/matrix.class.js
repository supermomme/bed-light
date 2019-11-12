/* eslint-disable no-unused-vars */
const Modes = require('../../modes.js')

exports.Matrix = class Matrix {
  constructor (options) {
    this.options = options || {}
  }

  setup (app) {
    this.app = app
  }

  async find (params) {
    return this.app.$matrices.map(({name, matrix}, id) => {
      console.log(matrix.modes)
      let modes = { }
      for (const key in matrix.modes) {
        if (matrix.modes.hasOwnProperty(key)) {
          modes[key] = {
            info: matrix.modes[key].info,
            config: matrix.modes[key].config,
            alpha: matrix.modes[key].alpha
          }
        }
      }
      return {
        id,
        name,
        width: matrix.width,
        height: matrix.height,
        modes
      }
    })
  }

  async get (id, params) {
    return (await this.find())[id]
  }

  async patch (id, { cmd, modeId, data, transitionTime}, params) {
    switch (cmd) {
    case 'setModeAlpha':
      this.app.$matrices[id].matrix.setModeAlpha(modeId, data, transitionTime)
      break
    case 'setModeConfig':
      this.app.$matrices[id].matrix.setModeConfig(modeId, data)
      break
    
    default:
      return {
        cmd: [
          'setModeConfig',
          'setModeAlpha'
        ]
      }
    }
    
    return 'Ok'
  }
}
