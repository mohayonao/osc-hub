var net = require("net");
var udp = require("dgram");
var util = require("util");
var EventEmitter = require("events").EventEmitter;

function OscHubClient(opts) {
  opts = opts || {};
  EventEmitter.call(this);
  this._sockets = [];
  this._sendPort = opts.send;
  this._receivePort = opts.receive;
}
util.inherits(OscHubClient, EventEmitter);

OscHubClient.prototype.connect = function(opts) {
  var _this = this;
  var sendPort = this._sendPort;
  var receivePort = this._receivePort;
  var socket = net.connect(opts);

  if (sendPort) {
    udp.createSocket("udp4", function(data) {
      socket.write(data);
      _this.emit("send", data);
    }).bind(sendPort);
  }

  if (receivePort) {
    socket.on("data", function(data) {
      udp.createSocket("udp4").send(data, 0, data.length, receivePort);
      _this.emit("receive", data);
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
