const { Template, Config } = require('./_Template')
const { createCanvas, Image } = require('canvas')
const dgram = require('dgram')

exports.Info = {
  id: 'UdpImage',
  name: 'UdpImage',
  description: '',
  config: {
    ...Config
  }
}

exports.class = class UdpImage extends Template {
  constructor(_width, _height, _config) {
    super(_width, _height, _config)
    this.Info = exports.Info

    this.port = 33333
    this.defaultConfig.transparent = true
    this.canvas = null
    this.ctx = null
    this.server = null

    this.init()
  }

  setConfig (newConfig) {
    let reInit = false
    // if (newConfig.port && newConfig.port !== this.getConfig(newConfig.port)) reInit = true
    super.setConfig(newConfig)
    if (reInit) this.init()
  }

  destroy () {
    super.destroy()
    if (this.server !== null) this.server.close()
  }

  init () {
    this.destroy()
    this.canvas = createCanvas(this.width, this.height)
    this.ctx = this.canvas.getContext('2d')
    this.server = dgram.createSocket('udp4')
    this.server.on('message', (...n) => { this.handleNewImageMessage(...n) })
    this.server.bind(this.port, '0.0.0.0')
    super.init(true)
  }

  getMatrix () {
    let res = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        let p = this.ctx.getImageData(x, y, 1, 1).data
        let a = 1
        if (this.getConfig('transparent') == true) a = p[3]/255
        column.push({
          r: p[0],
          g: p[1],
          b: p[2],
          a
        })
      }
      res.push(column)
    }
    return res
  }

  handleNewImageMessage (message) {
    var img = new Image()
    img.src = message.toString()
    this.ctx.clearRect(0,0,this.width,this.height)
    this.ctx.drawImage(img, 0, 0, this.width, this.height)
  }
} 
