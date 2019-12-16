/* eslint-disable no-unused-vars */
const { BadRequest } = require('@feathersjs/errors')

exports.Gadget = class Gadget {
  constructor (options) {
    this.options = options || {}
  }

  setup (app) {
    this.app = app
  }

  async find (params) {
    return this.app.$gadgets.map(({name, gadget}, id) => {
      let modes = { }
      for (const key in gadget.modes) {
        if (gadget.modes.hasOwnProperty(key)) {
          modes[key] = {
            info: gadget.modes[key].info,
            config: gadget.modes[key].config,
            alpha: gadget.modes[key].alpha
          }
        }
      }
      return {
        id,
        name,
        width: gadget.width,
        height: gadget.height,
        modes,
        isTransitioning: gadget.isTransitioning()
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
        this.app.$gadgets[id].gadget.setModeAlpha(modeId, data, transitionTime)
      } else {
        for (const mId in modes) {
          if (modes.hasOwnProperty(mId)) {
            this.app.$gadgets[id].gadget.setModeAlpha(mId, modes[mId], transitionTime)
          }
        }
      }
      break
    case 'setModeConfig':
      this.app.$gadgets[id].gadget.setModeConfig(modeId, data)
      break
    case 'stopTransitions':
      this.app.$gadgets[id].gadget.stopTransitions()
      break
    case 'justFireEvent':
      // console.log('just fire event')
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
