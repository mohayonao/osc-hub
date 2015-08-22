import assert from "power-assert";
import sinon from "sinon";
import { EventEmitter } from "events";
import OscMessage from "osc-msg";
import oscServer from "../src/osc-server";

const OSC_MESSAGE = OscMessage.toBuffer({
  address: "/foo", args: [],
});

class NetSocketMock extends EventEmitter {
  constructor() {
    super();
    this.write = sinon.spy();
  }
}

describe("oscServer(server: net.Server): net.Server", function() {
  before(() => {
    this.server = new EventEmitter();
    this.netSocket1 = new NetSocketMock();
    this.netSocket2 = new NetSocketMock();
  });
  beforeEach(() => {
    this.netSocket1.write.reset();
    this.netSocket2.write.reset();
  });
  it("bind", () => {
    let server = oscServer(this.server);

    assert(server === this.server);
    assert(this.server.listeners("connection").length === 1);
  });
  it("netSocket1 connect", () => {
    let onConnect = sinon.spy();

    this.server.once("osc-hub:connect", onConnect);

    this.server.emit("connection", this.netSocket1);

    assert(onConnect.callCount === 1);
    assert(onConnect.args[0][0] === this.netSocket1);
  });
  it("netSocket1 send osc-message", () => {
    let onData = sinon.spy();

    this.server.once("osc-hub:data", onData);

    this.netSocket1.emit("data", OSC_MESSAGE);

    assert(this.netSocket1.write.callCount === 1);
    assert(this.netSocket1.write.args[0][0] === OSC_MESSAGE);
    assert(onData.callCount === 1);
    assert(onData.args[0][0] === OSC_MESSAGE);
  });
  it("netSocket2 connect", () => {
    let onConnect = sinon.spy();

    this.server.once("osc-hub:connect", onConnect);

    this.server.emit("connection", this.netSocket2);

    assert(onConnect.callCount === 1);
    assert(onConnect.args[0][0] === this.netSocket2);
  });
  it("netSocket2 send osc-message", () => {
    let onData = sinon.spy();

    this.server.once("osc-hub:data", onData);

    this.netSocket2.emit("data", OSC_MESSAGE);

    assert(this.netSocket1.write.callCount === 1);
    assert(this.netSocket1.write.args[0][0] === OSC_MESSAGE);
    assert(this.netSocket2.write.callCount === 1);
    assert(this.netSocket2.write.args[0][0] === OSC_MESSAGE);
    assert(onData.callCount === 1);
    assert(onData.args[0][0] === OSC_MESSAGE);
  });
  it("netCocket1 disconnect", () => {
    let onDisconnect = sinon.spy();

    this.server.once("osc-hub:disconnect", onDisconnect);

    this.netSocket1.emit("close");

    assert(onDisconnect.callCount === 1);
    assert(onDisconnect.args[0][0] === this.netSocket1);
  });
  it("netSocket1 send osc-message", () => {
    let onData = sinon.spy();

    this.server.once("osc-hub:data", onData);

    this.netSocket1.emit("data", OSC_MESSAGE);

    assert(this.netSocket1.write.callCount === 0);
    assert(this.netSocket2.write.callCount === 0);
    assert(onData.callCount === 0);
  });
  it("netSocket2 send osc-message", () => {
    let onData = sinon.spy();

    this.server.once("osc-hub:data", onData);

    this.netSocket2.emit("data", OSC_MESSAGE);

    assert(this.netSocket1.write.callCount === 0);
    assert(this.netSocket2.write.callCount === 1);
    assert(this.netSocket2.write.args[0][0] === OSC_MESSAGE);
    assert(onData.callCount === 1);
    assert(onData.args[0][0] === OSC_MESSAGE);
  });
  it("netCocket2 error", () => {
    let err = new TypeError();
    let onError = sinon.spy();

    this.server.once("osc-hub:error", onError);

    this.netSocket2.emit("error", err);

    assert(onError.callCount === 1);
    assert(onError.args[0][0] === err);
  });
  it("netCocket2 disconnect", () => {
    let onDisconnect = sinon.spy();

    this.server.once("osc-hub:disconnect", onDisconnect);

    this.netSocket2.emit("close");

    assert(onDisconnect.callCount === 1);
    assert(onDisconnect.args[0][0] === this.netSocket2);
  });
  it("netSocket1 send osc-message", () => {
    let onData = sinon.spy();

    this.server.once("osc-hub:data", onData);

    this.netSocket1.emit("data", OSC_MESSAGE);

    assert(this.netSocket1.write.callCount === 0);
    assert(this.netSocket2.write.callCount === 0);
    assert(onData.callCount === 0);
  });
  it("netCocket2 disconnect", () => {
    let onDisconnect = sinon.spy();

    this.server.once("osc-hub:disconnect", onDisconnect);

    this.netSocket2.emit("close");

    assert(onDisconnect.callCount === 0);
  });
});
