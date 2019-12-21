const Net = require('net')
const device = require('./device')
const logger = require('../../logger')

module.exports = class Integration {
  constructor (integrationId, app) {
    this.id = integrationId
    this.app = app

    this.device = {}
    this.port = 33333
    this.server = new Net.Server()
    this.server.on('connection', (socket) => this.handleConnect(socket))
    this.server.listen(33333)
  }

  handleConnect (socket) {
    let deviceName = null
    console.log('connection')
    socket.write('REQ_CONF\n')
    const configListener = async (chunk) => {
      if (chunk.toString().startsWith('CONF:')) {
        let config = chunk.toString().split(':')[1].split(';').reduce((prev, cur) => {
          let res = {}
          res[cur.split('=')[0]] = cur.split('=')[1]
          return { ...prev, ...res}
        }, { })

        const filteredConfig = Object.keys(config)
          .filter(key => !(['TYPE', 'NAME'].includes(key)))
          .reduce((obj, key) => {
            obj[key] = config[key];
            return obj;
          }, {});

        if (config.TYPE != undefined && config.NAME != undefined) {
          deviceName = config.NAME
          let dbDevices = (await this.app.service('device').find({ query: { deviceName: config.NAME }})).data

          if (dbDevices.length === 0) {
            // CREATE
            await this.app.service('device').create({
              deviceName: config.NAME,
              integrationId: this.id,
              type: config.TYPE,
              config: filteredConfig,
              status: 'INITIALIZING',
              statusMessage: 'Device and Home Control are getting prepared'
            })
          } else {
            if (dbDevices[0].type === config.TYPE && dbDevices[0].integrationId === this.id) {
              // PATCH
              await this.app.service('device').patch(dbDevices[0]._id, {
                config: filteredConfig,
                status: 'INITIALIZING',
                statusMessage: 'Device and Home Control are getting prepared'
              })
            } else {
              // DELETE
              await this.app.service('device').remove(dbDevices[0]._id)
              // CREATE
              await this.app.service('device').create({
                deviceName: config.NAME,
                integrationId: this.id,
                type: config.TYPE,
                config: filteredConfig,
                status: 'INITIALIZING',
                statusMessage: 'Device and Home Control are getting prepared'
              })
            }
          }
          
          // TODO: init device class

        }
      }
    }
    let pongArrived = true
    let pongNotArrivedTrain = 0
    socket.on('data', (chunk) => {
      configListener(chunk).catch(err => console.error(err))
      if (chunk.toString() === 'PONG') pongArrived = true
    })

    let pingInterval = setInterval(() => {
      socket.write('PING\n')
      if (!pongArrived) pongNotArrivedTrain += 1
      else pongNotArrivedTrain = 0
      if (pongNotArrivedTrain > 2) {
        socket.destroy()
      }
      pongArrived = false
    }, 1000)
    socket.setTimeout(3000)
    socket.on('timeout', () => {
      console.log('socket timeout')
      socket.destroy()
    });

    const destroyDevice = async () => {
      let device = (await this.app.service('device').find({ query: { deviceName }})).data[0]
      if (device != undefined) {
        if (this.device[device._id] != undefined) {
          this.device[device._id].destroy()
          delete this.device[device._id]
        }
        await this.app.service('device').patch(device._id, {
          status: 'DISCONNECTED',
          statusMessage: 'Device is disconnected'
        })
      }
    }

    socket.on('close', () => {
      console.log('Closing connection with the client')
      clearInterval(pingInterval)
      
      destroyDevice().catch(err => console.error(err))
    });

    socket.on('error', (err) => {
      console.log(`Error: ${err}`)
    });
  }

  async syncDevice() {
    return // need to be deleted; but usefull for one TODO
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

  destroy () {
    this.server.destroy()
  }
}
