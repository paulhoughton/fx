var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  request = require('request');

app.use(express.static(__dirname + '/'));

var fields = ["currencyPair", "timestamp", "bidBig", "bidPips", "offerBig", "offerPips", "high", "low", "open"]
var cachedData;
var connected = 0;

var interval = setInterval(getData, 5000);

io.on('connection', function (socket) {
  connected++;
  io.sockets.emit('data', cachedData);
  socket.on('disconnect', function () {
    connected--;
  });
});

getData();

function getData() {
  request('http://webrates.truefx.com/rates/connect.html?f=csv', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var result = body.split("\n")
        .map(row => row.split(",")
          .reduce((acc, val, i) => { acc[fields[i]] = val; return acc }, {}))
        .filter(obj => obj.hasOwnProperty("timestamp"))

      cachedData = result;
      io.sockets.emit('data', result);
    }
  })
}

http.listen(3000, function () {
  console.log('listening on: 3000');
});


