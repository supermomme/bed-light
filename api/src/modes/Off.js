module.exports = class Off {
  constructor(_width, _height, _config) {
    this.width = _width
    this.height = _height
    this.initilized = false
    this.config = _config || {}
  }

  update () {
    if (!this.initilized) {
      let res = []
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          res.push({
            x, y,
            r: 0,
            g: 0,
            b: 0
          })
        }
      }
      this.initilized = true
      return res
    } else return []
  }
} 
