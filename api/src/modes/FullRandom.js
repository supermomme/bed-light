module.exports = class FullRandom {
  constructor(strips, sendBuffer, io) {
    this.strips = strips
    this.sendBuffer = sendBuffer
    this.io = io
    this.activated = false
    this.clientInfo = {
      name: 'Full Random',
      description: 'Random Random Random...',
      id: 'FULL_RANDOM'
    }
    this.fps = 10
    this.interval;
    this.pixels = []
  }

  events () {
    return {
      'setMode': n => this.checkMode(n)
    }
  }

  run () {
    this.interval = setInterval(() => {

      for (let i = 0; i < this.pixels.length; i++) {
        this.pixels[i].red -= 10
        if (this.pixels[i].red <= 0) this.pixels[i].red = 0

        this.pixels[i].green -= 10
        if (this.pixels[i].green <= 0) this.pixels[i].green = 0

        this.pixels[i].blue -= 10
        if (this.pixels[i].blue <= 0) this.pixels[i].blue = 0

      }
    

      let strip = Math.round(Math.random()*(this.strips.length - 1))
      let address = Math.round(Math.random()*(this.strips[strip].length - 1))
      let red = Math.round(Math.random()*255)
      let green = Math.round(Math.random()*255)
      let blue = Math.round(Math.random()*255)

      this.pixels.push({ strip, address, red, green, blue })

      let mes = Buffer.alloc(this.pixels.length*5)
      for (let i = 0; i < this.pixels.length; i++) {
        const { strip, address, red, green, blue} = this.pixels[i];
        const base = i*5
        mes.writeUInt8(strip, base)
        mes.writeUInt8(address, base+1)
        mes.writeUInt8(red, base+2)
        mes.writeUInt8(green, base+3)
        mes.writeUInt8(blue, base+4)
      }
      this.sendBuffer(mes)
      
      for(var i = this.pixels.length - 1; i >= 0; i--) {
        if(this.pixels[i].red === 0 && this.pixels[i].green === 0 && this.pixels[i].blue === 0) {
          this.pixels.splice(i, 1);
        }
      }

    }, 1000/this.fps);
  }
  
  cleanup() {
    
  }

  checkMode (payload) {
    this.activated = payload.toUpperCase() === this.clientInfo.id
    if (this.activated) this.io.emit('mode', this.clientInfo)
    else {
      clearInterval(this.interval)
      this.pixels = []
      return
    }
    setTimeout(() => this.run(), 10)
  }

} 
