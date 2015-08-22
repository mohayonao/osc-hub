import assert from "power-assert";
import index from "../src";
import oscClient from "../src/osc-client";
import oscServer from "../src/osc-server";

describe("index", () => {
  it("exports", () => {
    assert(index.client === oscClient);
    assert(index.server === oscServer);
  });
});
