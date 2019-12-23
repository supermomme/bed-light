const dgram = require('dgram')
const Device = require('./device')
const logger = require('../../logger')

module.exports = class Integration {
  constructor (integrationId, app) {
    this.id = integrationId.toString()
    this.app = app

    this.device = {}
    this.port = 33334
    this.udp = dgram.createSocket('udp4')
    this.udp.on('message', (message) => this.handleMessage(message).catch(logger.error))
    this.udp.bind(this.port)

    // set all device to DISCONNECTED
    this.app.service('device').find({ query: { integrationId: this.id }})
      .then(res => {
        let prom = []
        for (let i = 0; i < res.data.length; i++) {
          prom.push(this.app.service('device').patch(res.data[i]._id, {
            status: 'DISCONNECTED',
            statusMessage: 'Device is disconnected'
          }))
        }
        return Promise.all(prom)
      })
  }

  async handleMessage (message) {
    if (message.toString().startsWith('CONF:')) {
      console.log('conf')
      let config = message.toString().split(':')[1].split(';').reduce((prev, cur) => {
        let res = {}
        res[cur.split('=')[0]] = cur.split('=')[1]
        return { ...prev, ...res}
      }, { })

      const filteredConfig = Object.keys(config)
        .filter(key => !(['TYPE', 'NAME'].includes(key)))
        .reduce((obj, key) => {
          obj[key] = config[key]
          return obj
        }, {})


      if (config.TYPE != undefined && config.NAME != undefined) {
        let dbDevices = (await this.app.service('device').find({ query: { deviceName: config.NAME }})).data
        let dev = null
        if (dbDevices.length === 0) {
          // CREATE
          dev = await this.app.service('device').create({
            deviceName: config.NAME,
            integrationId: this.id,
            type: config.TYPE,
            config: filteredConfig,
            status: 'INITIALIZING',
            statusMessage: 'Device and Home Control are getting prepared'
          })
        } else {
          if (dbDevices[0].type === config.TYPE && dbDevices[0].integrationId.toString() === this.id) {
            // PATCH
            dev = await this.app.service('device').patch(dbDevices[0]._id, {
              config: filteredConfig,
              status: 'INITIALIZING',
              statusMessage: 'Device and Home Control are getting prepared'
            })
          } else {
            // DELETE
            await this.app.service('device').remove(dbDevices[0]._id)
            // CREATE
            dev = await this.app.service('device').create({
              deviceName: config.NAME,
              integrationId: this.id,
              type: config.TYPE,
              config: filteredConfig,
              status: 'INITIALIZING',
              statusMessage: 'Device and Home Control are getting prepared'
            })
          }
        }
        
        let devId = Object.keys(this.device).find(v => this.device[v].name === config.NAME)
        if (devId == undefined) {
          if (Object.keys(Device).indexOf(dev.type) != -1) {
            this.device[dev._id] = new Device[dev.type](dev._id, this, this.app, dev)
          } else {
            // Update Device Status
            logger.error(`Device Type '${dev.type}' in device '${dev.name}' in integration '${dev.integrationId}' not found`)
          }
        }
      }
    }
  }

  destroy () {
    this.udp.destroy()
  }
}
