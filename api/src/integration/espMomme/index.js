/*
Integration control the communication with the end device
Integration manages its device in database and in script
  -> Detect (speak with enddevice) kind of device (can be multiple) and update database and running scripts

*/
const net = require('net')
const device = require('./device')
const logger = require('../../logger')

module.exports = class Integration {
  constructor (integrationId, app) {
    this.id = integrationId
    this.app = app

    this.device = {}
    this.client = new net.Socket()
    this.connect()

    // TODO: add updater which checks device for buffer
    // use code from function connect for that
    this.fps = 60
    this.updateInterval = setInterval(() => this.sendBuffer(), 1000/this.fps)

  }

  sendBuffer () {
    for (const id in this.device) {
      const deviceBuffer = this.device[id].getBuffer()
      const cmdbuffer = Buffer.from('02', 'hex')
      const buffer = Buffer.concat([cmdbuffer, deviceBuffer])
      // console.log(buffer.length)
      if (buffer.length > 1) this.client.write(buffer)
    }
  }

  connect () {
    this.client.connect(80, '10.0.80.21', () => {
      console.log('Connected')

      this.client.on('data', (data) => {
        this.handleData(data.toString())
          .catch(err => console.error(err))
      })
      this.discover()
    })
  }

  async handleData (data) {
    if (data.startsWith('CONFIG:')) {
      let res = data.substring(7).split(';').reduce((prev, cur) => {
        prev[cur.split('=')[0]] = cur.split('=')[1]
        return prev
      }, {})

      let device = (await this.app.service('device').find({quary: {
        deviceName: res.n
      }})).data

      const config = {}
      // TODO: config management should be better
      // maybe write out config on device and put it in database (without mode, name, etc)
      if (res.m === 'Matrix') {
        // Number Check: console.log(/^-?\d+\.?\d*$/.test(<some String with number in it>))
        config.width = Number(res.w)
        config.height = Number(res.h)
      }

      if (device.length == 0) {
        await this.app.service('device').create({
          integrationId: this.id,
          deviceName: res.n,
          type: res.m,
          config
        })
      } else {
        await this.app.service('device').patch(device[0]._id, {
          integrationId: this.id,
          type: res.m,
          config
        })
      }
      
      await this.syncDevice()
    }
  }

  async syncDevice() {
    // add missing classes
    let devices = (await this.app.service('device').find({ query: { integrationId: this.id } })).data
    for (let i = 0; i < devices.length; i++) {
      if (this.device[devices[i]._id] == undefined) {
        if (device[devices[i].type] == undefined) {
          logger.error(`Device Type ${devices[i].type} in device ${devices[i].name} in integration ${devices[i].integrationId} not found`)
        } else {
          this.device[devices[i]._id] = new device[devices[i].type](devices[i]._id, this.app)
        }
      }
    }

    // Delete removed ones
    for (const id in this.device) {
      if ((await this.app.service('device').find({ query: { _id: id } })).total === 0) {
        this.device[id].destroy()
        delete this.device[id]
      }
    }
  }

  discover () {
    let buffer = Buffer.alloc(1)
    buffer[0] = 0x01 // Command to send config
    this.client.write(buffer)
  }

  patchDeviceState(deviceId, payload) {
    if (this.device[deviceId]) {
      this.device[deviceId].patchState(payload)
    }
  }

  patchConfig(config) {
    console.log('new config', config)
    // TODO: handle new config
  }

  destroy () {
    this.client.destroy()
  }
}
