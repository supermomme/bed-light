const pixel = require("node-pixel")
const firmata = require('firmata')
const dgram = require('dgram');

const PORT = 33333;
const HOST = '0.0.0.0';

const server = dgram.createSocket('udp4');

var board = new firmata.Board('/dev/ttyACM0',function(){
  strip = new pixel.Strip({
    firmata: board,
    strips: [
      {pin: 6, length: 60},
      {pin: 7, length: 60}
    ]
  })
  console.log("Strip ready connecting to mqtt and start http server...")

  server.on('listening', function() {
    console.log('UDP Server listening on ' + server.address().address + ':' + server.address().port);
  });

  server.on('message', function(message, remote) {
    try {
      let doc = JSON.parse(message)
      for (let i = 0; i < doc.length; i++) {
        strip.pixel(i).color([
          doc[i].red * 255,
          doc[i].green * 255,
          doc[i].blue * 255
        ])
      }
      strip.show()
    } catch (error) { }
  });

  server.bind(PORT, HOST)
})