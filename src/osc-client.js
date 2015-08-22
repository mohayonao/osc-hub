import dgram from "dgram";
import OscMessage from "osc-msg";
import utils from "./utils";

function setupSendToOscHub(client, sendPorts) {
  function sendToOscHub(data) {
    let msg = OscMessage.fromBuffer(data);

    if (!msg.error && msg.address[0] === "/") {
      client.write(data, () => {
        client.emit("osc-hub:send", msg, data);
      });
    } else {
      client.emit("osc-hub:error", utils.createTypeError("invalid data", { data }));
    }
  }

  let sockets = sendPorts.map((port) => {
    let socket = dgram.createSocket("udp4");

    socket.on("message", sendToOscHub);
    socket.on("error", (e) => {
      client.emit("osc-hub:error", e);
    });

    socket.bind(port);

    return socket;
  });

  client.oschubSockets = sockets;
}

function setupRecvFromOscHub(client, recvPorts) {
  let sender = dgram.createSocket("udp4");

  client.on("data", (data) => {
    let msg = OscMessage.fromBuffer(data);
    let targets = recvPorts.slice();

    function loop() {
      if (targets.length === 0) {
        client.emit("osc-hub:receive", msg, data);
      } else {
        sender.send(data, 0, data.length, targets.shift(), "127.0.0.1", loop);
      }
    }

    if (!msg.error && msg.address[0] === "/") {
      loop();
    } else {
      client.emit("osc-hub:error", utils.createTypeError("invalid data", { data }));
    }
  });
}

export default (client, opts = {}) => {
  setupSendToOscHub(client, utils.toArray(opts.send));
  setupRecvFromOscHub(client, utils.toArray(opts.receive));

  return client;
};
