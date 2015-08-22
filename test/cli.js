import assert from "power-assert";
import sinon from "sinon";
import dgram from "dgram";
import OscMessage from "osc-msg";
import cli from "../src/cli";

const HOST = "127.0.0.1";
const PORT = 52885;
const SEND = 7400;
const RECV = 7401;

describe("cli", function() {
  before(() => {
    this.consoleLog = global.console.log;
  });
  beforeEach(() => {
    global.console.log = sinon.spy();
  });
  after(() => {
    global.console.log = this.consoleLog;
  });
  describe("osc-hub", () => {
    before(() => {
      let serverCmd = `node osc-hub --server --port ${PORT} --quiet`;
      let clientCmd = `node osc-hub --port ${PORT} --send ${SEND} --receive ${RECV} --quiet`;

      this.server = cli.run(serverCmd.split(" "));
      this.client = cli.run(clientCmd.split(" "));
    });
    after(() => {
      this.client.oschubSockets.forEach((socket) => {
        socket.close();
      });
      this.server.close();
    });
    it("works", (done) => {
      let outerSender = dgram.createSocket("udp4");
      let outerReceiver = dgram.createSocket("udp4");
      let onReceiverMessage = sinon.spy();
      let onClientSend = sinon.spy();
      let onClientReceive = sinon.spy();
      let oscMessage = OscMessage.toBuffer({
        address: "/foo", args: [],
      });

      outerReceiver.bind(RECV);
      outerReceiver.on("message", onReceiverMessage);
      this.client.once("osc-hub:send", onClientSend);
      this.client.once("osc-hub:receive", onClientReceive);

      outerSender.send(oscMessage, 0, oscMessage.length, SEND, HOST);

      setTimeout(() => {
        assert(onReceiverMessage.callCount === 1);
        assert.deepEqual(onReceiverMessage.args[0][0], oscMessage);
        assert(onClientSend.callCount === 1);
        assert(onClientSend.args[0][0].address === "/foo");
        assert.deepEqual(onClientSend.args[0][1], oscMessage);
        assert(onClientReceive.callCount === 1);
        assert(onClientReceive.args[0][0].address === "/foo");
        assert.deepEqual(onClientReceive.args[0][1], oscMessage);

        outerReceiver.close();
        done();
      }, 100);
    });
  });
  describe("osc-hub --version", () => {
    it("works", () => {
      let version = require("../package.json").version;
      let versionCmd = "node osc-hub --version";

      cli.run(versionCmd.split(" "));

      assert(global.console.log.callCount === 1);
      assert(global.console.log.args[0][0] === `v${version}`);
    });
  });
  describe("osc-hub --help", () => {
    it("works", () => {
      let versionCmd = "node osc-hub --help";

      cli.run(versionCmd.split(" "));

      assert(global.console.log.callCount === 1);
      assert(/osc-hub/.test(global.console.log.args[0][0]));
    });
  });
});
