const express = require('express');
const app = express();
const http = require('http').createServer(app);
const dgram = require('dgram');
const io = require('socket.io')(http);

var PORT = 33333;
var HOST = '10.0.80.21';

var client = dgram.createSocket('udp4');
var strips = [
  {
    name: "ONE",
    length: 60
  },
  {
    name: "TWO",
    length: 60
  }
]

for (let f = 0; f < strips.length; f++) {
  strips[f].data = []
  for (let i = 0; i < strips[f].length; i++) {
    strips[f].data[i] = [0,0,0]
  }
}

let mes = Buffer.alloc(strips.reduce((prev, cur) => prev+cur.length, 0)*5)
let offset = 0
for (let f = 0; f < strips.length; f++) {
  for (let i = 0; i < strips[f].data.length; i++) {
    const [r,g,b] = strips[f].data[i];
    const base = (i)*5+offset
    mes.writeUInt8(f, base)
    mes.writeUInt8(i, base+1)
    mes.writeUInt8(r, base+2)
    mes.writeUInt8(g, base+3)
    mes.writeUInt8(b, base+4)
  }
  offset += strips[f].length*5
}
sendBuffer(mes)


/*
var message = Buffer.alloc(3*5);
message[0] = 0x01 // Strip id
message[1] = 0x00 // Addr
message[2] = 0xFF // Red
message[3] = 0x00 // Green
message[4] = 0x00 // Blue

message[5] = 0x01
message[6] = 0x01
message[7] = 0xFF
message[8] = 0x00
message[9] = 0x00

message[10] = 0x01
message[11] = 0x02
message[12] = 0xFF
message[13] = 0x00
message[14] = 0x00

console.log(message)
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
  if (err) throw err;
  console.log('UDP message sent to ' + HOST +':'+ PORT);
  console.log(bytes)
  client.close();
});*/


// setInterval(() => { // all random
//   let message = Buffer.alloc(5)
//   message[0] = Math.round(Math.random())
//   message[1] = Math.round(Math.random()*60)
//   message[2] = Math.round(Math.random()*255)
//   message[3] = Math.round(Math.random()*255)
//   message[4] = Math.round(Math.random()*255)
//   sendBuffer(message)
// }, 1000/50);



// setInterval(() => { // Clear everything
//   let mes1 = Buffer.alloc(60*5)
//   for (let i = 0; i < 60; i++) {
//     mes1[i*5] = 0x00
//     mes1[i*5+1] = i
//     mes1[i*5+2] = 0x00
//     mes1[i*5+3] = 0x00
//     mes1[i*5+4] = 0x00
//   }
//   let mes2 = Buffer.alloc(60*5)
//   for (let i = 0; i < 60; i++) {
//     mes2[i*5] = 0x01
//     mes2[i*5+1] = i
//     mes2[i*5+2] = 0x00
//     mes2[i*5+3] = 0x00
//     mes2[i*5+4] = 0x00
//   }
//   let mes = Buffer.concat([mes1, mes2])
//   sendBuffer(mes)
// }, 3000);

function sendBuffer(buffer) {
  client.send(buffer, 0, buffer.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    getStripByBuffer(buffer)
  })
}

function getStripByBuffer(buffer) {
  for (let i = 0; i < buffer.length/5; i++) {
    strips[buffer[i*5]].data[buffer[i*5+1]] = [ buffer[i*5+2], buffer[i*5+3], buffer[i*5+4] ]
  }
}

// app.use(express.static(__dirname+'/../client'));

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3030, function(){
  console.log('listening on *:3030');
});