import assert from "power-assert";
import sinon from "sinon";
import dgram from "dgram";
import { EventEmitter } from "events";
import OscMessage from "osc-msg";
import oscClient from "../src/osc-client";

const SEND = 7400;
const RECV = 7401;
const OSC_MESSAGE = OscMessage.toBuffer({
  address: "/foo", args: [],
});

class NetSocketMock extends EventEmitter {
  constructor() {
    super();
    this.write = sinon.spy((data, callback) => {
      setTimeout(callback, 0);
    });
  }
}

describe("oscClient(client: net.Socket): net.Socket", function() {
  before(() => {
    this.client = new NetSocketMock();
  });
  beforeEach(() => {
    this.client.write.reset();
  });
  after(() => {
    this.client.oschubSockets.forEach((socket) => {
      socket.close();
    });
  });
  it("bind without opts", () => {
    let emitter = new EventEmitter();
    let client = oscClient(emitter);

    assert(client === emitter);
  });
  it("bind", () => {
    let client = oscClient(this.client, { send: SEND, receive: RECV });

    assert(client === this.client);
  });
  it("receive message", (done) => {
    let outerReceiver = dgram.createSocket("udp4");
    let onMessageAtOuterReceiver = sinon.spy();
    let onMessageAtOscHubClient = sinon.spy();

    outerReceiver.on("message", onMessageAtOuterReceiver).bind(RECV);
    this.client.once("osc-hub:receive", onMessageAtOscHubClient);

    this.client.emit("data", OSC_MESSAGE);

    setTimeout(() => {
      assert(onMessageAtOuterReceiver.callCount === 1);
      assert.deepEqual(onMessageAtOuterReceiver.args[0][0], OSC_MESSAGE);
      assert(onMessageAtOscHubClient.callCount === 1);
      assert(onMessageAtOscHubClient.args[0][0].address === "/foo");
      assert(onMessageAtOscHubClient.args[0][1] === OSC_MESSAGE);

      outerReceiver.close();
      done();
    }, 100);
  });
  it("send message", (done) => {
    let onMessageAtOscHubClient = sinon.spy();

    this.client.once("osc-hub:send", onMessageAtOscHubClient);

    this.client.oschubSockets[0].emit("message", OSC_MESSAGE);

    setTimeout(() => {
      assert(this.client.write.callCount === 1);
      assert(this.client.write.args[0][0] === OSC_MESSAGE);
      assert(onMessageAtOscHubClient.callCount === 1);
      assert(onMessageAtOscHubClient.args[0][0].address === "/foo");
      assert(onMessageAtOscHubClient.args[0][1] === OSC_MESSAGE);

      done();
    }, 100);
  });
  it("send error", (done) => {
    let err = new TypeError();
    let onErrorAtOscHubClient = sinon.spy();

    this.client.once("osc-hub:error", onErrorAtOscHubClient);

    this.client.oschubSockets[0].emit("error", err);

    setTimeout(() => {
      assert(onErrorAtOscHubClient.callCount === 1);
      assert(onErrorAtOscHubClient.args[0][0] === err);

      done();
    }, 100);
  });
});
