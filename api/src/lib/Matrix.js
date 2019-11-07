const Pixel = require('./Pixel')

module.exports = class Matrix {
  constructor (_width, _height) {
    this.width = _width
    this.height = _height
    this.matrix = []
    for (let x = 0; x < this.width; x++) {
      let column = []
      for (let y = 0; y < this.height; y++) {
        column.push(new Pixel(0, 0, 0))
      }
      this.matrix.push(column)
    }
    this.transitionFinished = true
  }

  isRunning() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.matrix[x][y].isRunning()) {
          return true
        }        
      }      
    }
    return false
  }
  
  fill(...args) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.pixel(x, y,...args)
      }
    }
  }

  fillRed(...args) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.pixelRed(x, y,...args)
      }
    }
  }

  fillGreen(...args) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.pixelGreen(x, y,...args)
      }
    }
  }

  fillBlue(...args) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.pixelBlue(x, y,...args)
      }
    }
  }

  clear() {
    this.fill(0,0,0)
  }

  pixel (x, y, ...args) {
    this.matrix[x][y].setColor(...args)
  }
  pixelRed (x, y, ...args) {
    this.matrix[x][y].setRed(...args)
  }
  pixelGreen (x, y, ...args) {
    this.matrix[x][y].setGreen(...args)
  }
  pixelBlue (x, y, ...args) {
    this.matrix[x][y].setBlue(...args)
  }

  shiftY(n = 1) {
    for (let x = 0; x < this.width; x++) {
      let oldColumn = this.matrix[x].map(val => val.getColor())
      for (let y = 0; y < this.height; y++) {
        let color = {}
        if (n < 0) {
          if (y <= n*-1) color = oldColumn[this.height-1]
          else color = oldColumn[y+n]
        } else if (n > 0) {
          if (y >= this.height-n) color = oldColumn[0]
          else color = oldColumn[y+n]
        }
        let { r, g, b } = color
        this.pixel(x, y, r,g,b)
      }
    }
  }



  // more standard matrix methods... 

  // maybe shiftX
}