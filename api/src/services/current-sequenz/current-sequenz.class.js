/* eslint-disable no-unused-vars */
var dgram = require('dgram')

var currentSequenz = {
  sequenzId: null,
  sequenz: null,
  waitFrame: 0,
  currentFrame: 0,
  fullInitialized: false,
  createdAt: Date.now().toString()
}

exports.CurrentSequenz = class CurrentSequenz {
  constructor (options) {
    this.options = options || {}
  }

  setup(app) {
    this.app = app
  }

  async find (params) {
    return currentSequenz
  }

  async create ({ sequenzId }, params) {
    let sequenz = await this.app.service('sequenz').get(sequenzId)
    currentSequenz = {
      sequenzId,
      sequenz,
      waitFrame: 0,
      currentFrame: 0,
      fullInitialized: false,
      createdAt: Date.now().toString()
    }
    
    return currentSequenz
  }

  async remove (sequenzName, params) {
    currentSequenz = {
      sequenzId: null,
      sequenz: null,
      waitFrame: 0,
      currentFrame: 0,
      fullInitialized: false,
      createdAt: Date.now().toString()
    }

    return currentSequenz
  }
}


/// LED-DRIVER \\\
exports.ledDriver = function(app) {

  var led = app.get('led')

  setInterval(() => {
    if (currentSequenz.sequenz != null && currentSequenz.sequenz.sequenz.length > 0) {
      let SEQUENZ = currentSequenz.sequenz.sequenz
      
      // console.log(SEQUENZ[currentSequenz.currentFrame])
      let pixels = SEQUENZ[currentSequenz.currentFrame].map(({red, green, blue, alpha}) => ({
        red: red * alpha,
        green: green * alpha,
        blue: blue * alpha
      }))

      var message = new Buffer(JSON.stringify(pixels))
      var client = dgram.createSocket('udp4')
      client.send(message, 0, message.length, led.port, led.host, function(err, bytes) {
        if (err) throw err
        client.close()
      })

      if (currentSequenz.currentFrame === SEQUENZ.length-1) currentSequenz.currentFrame = 0
      else currentSequenz.currentFrame++

    /*
      var message = new Buffer('My KungFu is Good!')
      var client = dgram.createSocket('udp4')
      client.send(message, 0, message.length, led.port, led.host, function(err, bytes) {
        if (err) throw err
        console.log('UDP message sent to ' + led.host +':'+ led.port)
        client.close()
      })*/
    }
  }, 1000/led.fps)
}