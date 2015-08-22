import assert from "power-assert";
import options from "../src/options";

describe("options.parse(args: string[]): object", () => {
  it("none arguments", () => {
    let cmd = "node osc-hub";
    let opts = options.parse(cmd.split(" "));

    assert(opts.host === "localhost");
    assert(opts.port === 52885);
  });
  it("--server", () => {
    let cmd = "node osc-hub --server";
    let opts = options.parse(cmd.split(" "));

    assert(opts.server === true);
  });
  it("--host 192.168.0.1 --port 12345", () => {
    let cmd = "node osc-hub --host 192.168.0.1 --port 12345";
    let opts = options.parse(cmd.split(" "));

    assert(opts.host === "192.168.0.1");
    assert(opts.port === 12345);
  });
  it("-h 192.168.0.1 -p 12345", () => {
    let cmd = "node osc-hub -h 192.168.0.1 -p 12345";
    let opts = options.parse(cmd.split(" "));

    assert(opts.host === "192.168.0.1");
    assert(opts.port === 12345);
  });
  it("-s 7400 - r 7401", () => {
    let cmd = "node osc-hub -s 7400 -r 7401";
    let opts = options.parse(cmd.split(" "));

    assert.deepEqual(opts.send, [ 7400 ]);
    assert.deepEqual(opts.receive, [ 7401 ]);
  });
  it("--send 7400 --receive 7401", () => {
    let cmd = "node osc-hub --send 7400 --receive 7401";
    let opts = options.parse(cmd.split(" "));

    assert.deepEqual(opts.send, [ 7400 ]);
    assert.deepEqual(opts.receive, [ 7401 ]);
  });
  it("-s 7400,7401 -r 7402,7403", () => {
    let cmd = "node osc-hub -s 7400,7401 -r 7402,7403";
    let opts = options.parse(cmd.split(" "));

    assert.deepEqual(opts.send, [ 7400, 7401 ]);
    assert.deepEqual(opts.receive, [ 7402, 7403 ]);
  });
  it("--quiet", () => {
    let cmd = "node osc-hub --quiet";
    let opts = options.parse(cmd.split(" "));

    assert(opts.quiet === true);
  });
  it("-q", () => {
    let cmd = "node osc-hub -q";
    let opts = options.parse(cmd.split(" "));

    assert(opts.quiet === true);
  });
  it("--version", () => {
    let cmd = "node osc-hub --version";
    let opts = options.parse(cmd.split(" "));

    assert(opts.version === true);
  });
  it("-v", () => {
    let cmd = "node osc-hub -v";
    let opts = options.parse(cmd.split(" "));

    assert(opts.version === true);
  });
  it("--help", () => {
    let cmd = "node osc-hub --help";
    let opts = options.parse(cmd.split(" "));

    assert(opts.help === true);
  });
});
