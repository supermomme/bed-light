/* eslint-disable no-unused-vars */
const Modes = require('../../modes.js')

exports.Mode = class Mode {
  constructor (options) {
    this.options = options || {}
  }

  async find (params) {
    return Modes.Info
  }

  async get (id, params) {
    return (await this.find()).find(o => o.id === id)
  }
}
