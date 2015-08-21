import assert from "power-assert";
import index from "../src";
import OscHubClient from "../src/OscHubClient";
import OscHubServer from "../src/OscHubServer";

describe("index", () => {
  it("exports", () => {
    assert(index.Client === OscHubClient);
    assert(index.Server === OscHubServer);
  });
});
