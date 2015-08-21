import net from "net";
import udp from "dgram";
import { EventEmitter } from "events";
import oscmsg from "osc-msg";

function isInteger(value) {
  return typeof value === "number" && value % 1 === 0;
}

function pushPorts(source, destination) {
  if (isInteger(source)) {
    destination.push(source);
  } else if (Array.isArray(source)) {
    source.forEach((port) => {
      if (isInteger(port)) {
        destination.push(port);
      }
    });
  }
}

export default class OscHubClient extends EventEmitter {
  constructor(opts = {}) {
    super();

    this._sockets = [];
    this._sendPorts = [];
    this._receivePorts = [];

    pushPorts(opts.send, this._sendPorts);
    pushPorts(opts.receive, this._receivePorts);
  }

  connect(opts) {
    let sendPorts = this._sendPorts;
    let receivePorts = this._receivePorts;
    let socket = net.connect(opts);

    if (sendPorts.length) {
      let onReceive = (data) => {
        let msg = oscmsg.fromBuffer(data);

        if (msg.error) {
          socket.write(data, () => {
            this.emit("send", data, msg);
          });
        } else {
          let e = new TypeError("tried to send a broken OSC message");

          e.data = data;

          this.emit("error", e);
        }
      };

      sendPorts.forEach((port) => {
        let socket = udp.createSocket("udp4");

        socket.on("message", onReceive);
        socket.on("error", (e) => {
          this.emit("error", e);
        });
        socket.bind(port);
      });
    }

    if (receivePorts.length) {
      socket.on("data", (data) => {
        let msg = oscmsg.fromBuffer(data);

        if (!msg.error) {
          let count = 0;
          let done = () => {
            count += 1;
            if (count === receivePorts.length) {
              sender.close();
              this.emit("receive", data, msg);
            }
          };
          let sender = udp.createSocket("udp4");

          receivePorts.forEach((port) => {
            sender.send(data, 0, data.length, port, "127.0.0.1", done);
          });
        } else {
          let e = new TypeError("received a broken OSC message");

          e.data = data;

          this.emit("error", e);
        }
      });
    }

    socket.on("connect", () => {
      this.emit("connect", socket);
    });

    socket.on("error", (e) => {
      this.emit("error", e);
    });

    this._sockets.push(socket);

    return this;
  }

  pause() {
    this._sockets.forEach((socket) => {
      socket.pause();
    });
    return this;
  }

  resume() {
    this._sockets.forEach((socket) => {
      socket.resume();
    });
    return this;
  }
}
