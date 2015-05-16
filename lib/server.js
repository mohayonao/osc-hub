var net = require("net");
var util = require("util");
var EventEmitter = require("events").EventEmitter;

function OscHubServer() {
  EventEmitter.call(this);
  this._server = null;
  this._sockets = [];
}
util.inherits(OscHubServer, EventEmitter);

OscHubServer.prototype.listen = function(port, callback) {
  port = port || 52885;

  var _this = this;
  var server = net.createServer();
  var sockets = this._sockets;

  server.on("connection", function(socket) {

    socket.on("data", function(data) {
      sockets.forEach(function(socket) {
        socket.write(data);
      });
      _this.emit("data", data);
    });

    socket.on("close", function() {
      var index = sockets.indexOf(socket);

      if (index !== -1) {
        sockets.splice(index, 1);
        _this.emit("disconnect", socket);
      }
    });

    socket.on("error", function(e) {
      _this.emit("error", e);
    });

    sockets.push(socket);

    _this.emit("connect", socket);

  });

  server.on("error", function(e) {
    _this.emit("error", e);
  });

  server.listen(port, function() {
    if (callback) {
      callback.apply(_this, arguments);
    }
  });

  this._server = server;

  return this;
};

module.exports = OscHubServer;
