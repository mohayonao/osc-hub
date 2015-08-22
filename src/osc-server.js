import utils from "./utils";

export default (server) => {
  let sockets = [];

  server.on("connection", (socket) => {
    function onData(data) {
      sockets.forEach((socket) => {
        socket.write(data);
      });
      server.emit("osc-hub:data", data);
    }

    function onError(e) {
      server.emit("osc-hub:error", e);
    }

    function onClose() {
      utils.removeIfExists(sockets, socket);
      server.emit("osc-hub:disconnect", socket);

      socket.removeListener("data", onData);
      socket.removeListener("close", onClose);
      socket.removeListener("error", onError);
    }

    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("close", onClose);

    sockets.push(socket);

    server.emit("osc-hub:connect", socket);
  });

  return server;
};
