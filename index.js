
var express = require('express');
var app = express();

var router = express.Router();

var https = require('https');
var parseString = require('xml2js').parseString;

var retrieve = require('./retrieve.js');

var url = 'https://api.cryptowat.ch/markets/prices';

app.set('port', (process.env.PORT || 5000));

app.use('/', express.static('dist'));
var gt;
var lt;
var e;
var items;
router.get('/:gt-:lt-:e', function(req, res) {
  gt = parseInt(req.params.gt);
  lt = parseInt(req.params.lt);
  e = req.params.e;
  console.log(e);
  retrieve.connectAndGetData(gt, lt, e,
    (_items) => {
      items = _items;
      res.jsonp(items);
    });

});

app.use('/data/', router);

var a = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var io = require('socket.io')(a);

function emitNewData(data, callback) {
  gt = (new Date()).getTime();
  var _gt = 1490310149726;
  lt = gt - 300000;
  retrieve.connectAndGetData(gt, lt, data,
    (_items) => {
      var oldLastValue = items[items.length - 1];
      var currentLastValue = _items[_items.length - 1];
      console.log(oldLastValue, currentLastValue);
      if (oldLastValue[1] != currentLastValue[1]) {
        callback(currentLastValue);
      }
    });
    /*retrieve.connectAndGetData(gt, lt, e, (_items) => {
      console.log(">>>>>>", items, _items);
    });*/

}

io.on('connection', function(socket) {
  /*setInterval(function() {
    socket.emit('data', [(new Date()).getTime(), Math.random() * 3000]);
  }, 20000);*/
  socket.on('exchange', function(data) {
    setInterval(function() {
      emitNewData(data, (d) => {
        console.log(d);
        socket.emit('data', d);
      });
    }, 2000);
  });
});
