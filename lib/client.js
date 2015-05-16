var net = require("net");
var udp = require("dgram");
var util = require("util");
var oscmsg = require("osc-msg");
var EventEmitter = require("events").EventEmitter;

function OscHubClient(opts) {
  opts = opts || {};
  EventEmitter.call(this);
  this._sockets = [];
  this._sendPorts = opts.send;
  this._receivePorts = opts.receive;
}
util.inherits(OscHubClient, EventEmitter);

OscHubClient.prototype.connect = function(opts) {
  var _this = this;
  var sendPorts = this._sendPorts;
  var receivePorts = this._receivePorts;
  var socket = net.connect(opts);

  if (sendPorts.length) {
    var onReceive = function(data) {
      var msg = oscmsg.fromBuffer(data);
      if (!msg.error) {
        socket.write(data, function() {
          _this.emit("send", data, msg);
        });
      } else {
        var e = new TypeError("tried to send a broken OSC message");
        e.data = data;
        _this.emit("error", e);
      }
    };
    sendPorts.forEach(function(port) {
      var socket = udp.createSocket("udp4");
      socket.on("message", onReceive);
      socket.on("error", function(e) {
        _this.emit("error", e);
      });
      socket.bind(port);
    });
  }

  if (receivePorts.length) {
    socket.on("data", function(data) {
      var msg = oscmsg.fromBuffer(data);
      if (!msg.error) {
        var count = 0;
        var done = function() {
          count += 1;
          if (count === receivePorts.length) {
            sender.close();
            _this.emit("receive", data, msg);
          }
        };
        var sender = udp.createSocket("udp4");
        receivePorts.forEach(function(port) {
          sender.send(data, 0, data.length, port, "127.0.0.1", done);
        });
      } else {
        var e = new TypeError("received a broken OSC message");
        e.data = data;
        _this.emit("error", e);
      }
    });
  }

  socket.on("connect", function() {
    _this.emit("connect", socket);
  });

  this._sockets.push(socket);

  return this;
};

OscHubClient.prototype.pause = function() {
  this._sockets.forEach(function(socket) {
    socket.pause();
  });
  return this;
};

OscHubClient.prototype.resume = function() {
  this._sockets.forEach(function(socket) {
    socket.resumt();
  });
  return this;
};

module.exports = OscHubClient;
