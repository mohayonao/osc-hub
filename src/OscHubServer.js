import net from "net";
import { EventEmitter } from "events";

const NOOP = () => {};

export default class OscHubServer extends EventEmitter {
  constructor() {
    super();

    this._server = null;
    this._sockets = [];
  }

  listen(port = 52885, callback = NOOP) {
    let server = net.createServer();
    let sockets = this._sockets;

    server.on("connection", (socket) => {
      socket.on("data", (data) => {
        sockets.forEach((socket) => {
          socket.write(data);
        });
        this.emit("data", data);
      });

      socket.on("close", () => {
        let index = sockets.indexOf(socket);

        if (index !== -1) {
          sockets.splice(index, 1);
          this.emit("disconnect", socket);
        }
      });

      socket.on("error", (e) => {
        this.emit("error", e);
      });

      sockets.push(socket);

      this.emit("connect", socket);
    });

    server.on("error", (e) => {
      this.emit("error", e);
    });

    server.listen(port, callback);

    this._server = server;

    return this;
  }
}
