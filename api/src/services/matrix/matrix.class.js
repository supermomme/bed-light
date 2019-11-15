/* eslint-disable no-unused-vars */
const { BadRequest } = require('@feathersjs/errors')

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
        modes,
        isTransitioning: matrix.isTransitioning()
      }
    })
  }

  async get (id, params) {
    return (await this.find())[id]
  }

  async patch (id, { cmd, modes, modeId, data, transitionTime}, params) {
    switch (cmd) {
    case 'setModeAlpha':
      if (modes === undefined) {
        this.app.$matrices[id].matrix.setModeAlpha(modeId, data, transitionTime)
      } else {
        for (const mId in modes) {
          if (modes.hasOwnProperty(mId)) {
            this.app.$matrices[id].matrix.setModeAlpha(mId, modes[mId], transitionTime)
          }
        }
      }
      break
    case 'setModeConfig':
      this.app.$matrices[id].matrix.setModeConfig(modeId, data)
      break
    case 'stopTransitions':
      this.app.$matrices[id].matrix.stopTransitions()
      break
    case 'justFireEvent':
      console.log('just fire event')
      break
    default:
      return new BadRequest('Invalid cmd', {
        cmd,
        allowed: [
          'setModeConfig',
          'setModeAlpha',
          'stopTransitions'
        ]
      })
    }
    
    return this.get(id)
  }
}
