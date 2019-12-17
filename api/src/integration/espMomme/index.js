/*
Integration control the communication with the end device
Integration manages its device in database and in script
  -> Detect (speak with enddevice) kind of device (can be multiple) and update database and running scripts

*/
const net = require('net')

const availableDevice = {
  Matrix: require('./device/Matrix')
}

module.exports = class Integration {
  constructor (integrationId, app) {
    this.id = integrationId
    this.app = app

    this.device = {}
    this.client = new net.Socket()
    this.connect()

    // TODO: add updater which checks device for buffer
    // use code from function connect for that
  }

  connect () {
    this.client.connect(80, '10.0.80.21', () => {
      console.log('Connected')
      // let buffer = Buffer.alloc(11)
      // buffer.writeUInt8(0, 0)
      // Command to set state (followed by mode stuff)
      // buffer[0] = 0x02 // CMD
      // buffer[1] = 0x00 // X
      // buffer[2] = 0x03 // Y
      // buffer[3] = 0xFF // R
      // buffer[4] = 0xFF // G
      // buffer[5] = 0xFF // B
    
      // buffer[6] = 0x01 // X
      // buffer[7] = 0x03 // Y
      // buffer[8] = 0xFF // R
      // buffer[9] = 0xFF // G
      // buffer[10] = 0xFF // B
      // client.write(buffer)
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
        deviceName: res.n,
        integrationId: this.id,
        type: res.m
      }})).data

      if (device.length == 0) {
        let deviceNameDevice = (await this.app.service('device').find({quary: { deviceName: res.n }})).data
        if (deviceNameDevice.length != 0) {
          await this.app.service('device').remove(deviceNameDevice[0]._id)
        }

        await this.app.service('device').create({
          integrationId: this.id,
          deviceName: res.n,
          type: res.m
        })
      }
      
      await this.updateDevice()
    }
  }

  async updateDevice() {
    let devices = (await this.app.service('device').find({ integrationId: this.id })).data
    for (let i = 0; i < devices.length; i++) {
      // TODO: sync device from database into running scripts
      // if (this.device[devices[i]._id] == undefined && devices[i].type) {
      //   this.device[devices[i]._id] = new 
      // }
      
    }
  }

  discover () {
    let buffer = Buffer.alloc(1)
    buffer[0] = 0x01 // Command to send config
    this.client.write(buffer)
  }

  patchDeviceState(deviceId, payload) {
    this.device[deviceId].patchDeviceState(payload)
  }

  destroy () {
    this.client.destroy()
  }
}
