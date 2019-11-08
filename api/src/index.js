const Controller = require('./lib/Controller')
const UdpMatrix = require('./lib/UdpMatrix');
// const schedule = require('node-schedule');
var Modes = require('./modes.js')

let matrices = [
  { name: 'Bed', matrix: new UdpMatrix(2, 60, '10.0.80.21', '33333') }
]

matrices.forEach((matrix) => {
  matrix.mode = new Modes.FullRainbow(matrix.matrix, {cycleTime:120000})
});

let controller = new Controller(matrices)

// schedule.scheduleJob('45 8 * * 5', function(){
//   controller.setMode(0, Modes.AddressRainbow)
// });

// schedule.scheduleJob('30 9 * * 5', function(){
//   controller.setMode(0, Modes.Off)
// });

// setTimeout(() => {
//   controller.setMode(0, Modes.FullRandom)
// }, 5000)
// setTimeout(() => {
//   controller.setMode(0, Modes.Off)
// }, 6000)

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  socket.on('reqMatricies', () => {
    socket.emit('matricies', controller.getMatrices())
  })
  socket.on('reqModes', () => {
    socket.emit('modes', Modes.info)
  })

  // let mode = {  }
  // let existingModes = []
  // // Add Modes events
  // Object.keys(Modes).forEach((key) => {
  //   existingModes.push(Modes[key].clientInfo)
  //   if (Modes[key].activated) mode = Modes[key].clientInfo;
  //   var events = Modes[key].events()
  //   Object.keys(events).forEach(k => {
  //     socket.on(k, events[k])
  //   })
  // })

  // socket.emit('strips', strips)
  // socket.emit('mode', mode)
  // socket.emit('existingModes', existingModes)

  socket.on('setMode', (n) => {
    if (n.matrixId != undefined && n.modeId != undefined)
      controller.setMode(n.matrixId, Modes[n.modeId], n.config)
      io.emit('matricies', controller.getMatrices())
  })
})

http.listen(3030, function(){
  console.log('listening on *:3030');
});