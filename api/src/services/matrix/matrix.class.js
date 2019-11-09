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
    return this.app.$controller.getMatrices().map((matrix, id) => {
      return {
        id,
        name: matrix.name,
        width: matrix.width,
        height: matrix.height,
        mode: matrix.mode.info,
        modeId: matrix.mode.info.id,
        modeConfig: matrix.mode.getWholeConfig()
      }
    })
  }

  async get (id, params) {
    return (await this.find())[id]
  }

  async patch (id, { modeId, config }, params) {
    console.log(id, modeId, config)
    console.log(Modes[modeId])
    this.app.$controller.setMode(id, Modes[modeId], config)
    return 'Ok'
  }

  async remove (id, params) {
    this.patch(id, { modeId: 'Off' })
    return 'Ok'
  }
}
