module.exports = class Off {
  constructor(strips, sendBuffer, io) {
    this.strips = strips
    this.sendBuffer = sendBuffer
    this.io = io
    this.activated = true
    this.clientInfo = {
      name: 'Off',
      description: 'No Light. No Sight!',
      id: 'OFF'
    }
  }

  events () {
    return {
      'setMode': n => this.checkMode(n)
    }
  }

  run () {
    let mes = Buffer.alloc(this.strips.reduce((prev, cur) => prev+cur.length, 0)*5)
    let offset = 0
    for (let f = 0; f < this.strips.length; f++) {
      for (let i = 0; i < this.strips[f].data.length; i++) {
        const base = i*5+offset
        mes.writeUInt8(f, base)   // StripId
        mes.writeUInt8(i, base+1) // Address
        mes.writeUInt8(0, base+2) // Red
        mes.writeUInt8(0, base+3) // Green
        mes.writeUInt8(0, base+4) // Blue
      }
      offset += this.strips[f].length*5
    }

    this.sendBuffer(mes)
  }

  checkMode (payload) {
    this.activated = payload.toUpperCase() === this.clientInfo.id.toUpperCase()
    if (this.activated) this.io.emit('mode', this.clientInfo)
    else return
    setTimeout(() => this.run(), 10)

  }

} 
