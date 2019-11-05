module.exports = class Manual {
  constructor(strips, sendBuffer) {
    this.strips = strips
    this.sendBuffer = sendBuffer
    this.activated = true
  }

  events () {
    return {
      'setMode': n => this.checkMode(n),
      'fillAllStrips': n => { if(this.activated )this.fillAllStrips(n) },
      'fillPixels': n => { if(this.activated )this.fillPixels(n) }
    }
  }

  fillAllStrips ([r,g,b]) {
    let mes = Buffer.alloc(this.strips.reduce((prev, cur) => prev+cur.length, 0)*5)
    let offset = 0
    for (let f = 0; f < this.strips.length; f++) {
      for (let i = 0; i < this.strips[f].data.length; i++) {
        const base = i*5+offset
        mes.writeUInt8(f, base)   // StripId
        mes.writeUInt8(i, base+1) // Address
        mes.writeUInt8(r, base+2) // Red
        mes.writeUInt8(g, base+3) // Green
        mes.writeUInt8(b, base+4) // Blue
      }
      offset += this.strips[f].length*5
    }
    this.sendBuffer(mes)
  }

  fillPixels (pixels) {
    let mes = Buffer.alloc(pixels.length*5)
    for (let i = 0; i < pixels.length; i++) {
      const { strip, address, red, green, blue} = pixels[i];
      const base = i*5
      mes.writeUInt8(strip, base)
      mes.writeUInt8(address, base+1)
      mes.writeUInt8(red, base+2)
      mes.writeUInt8(green, base+3)
      mes.writeUInt8(blue, base+4)
    }
    this.sendBuffer(mes)
  }

  checkMode (payload) {
    this.activated = payload.toUpperCase() === 'MANUAL'
    console.log(this.activated)
  }

} 
