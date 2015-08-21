import assert from "power-assert";
import OscHubClient from "../src/OscHubClient";

describe("OscHubClient", () => {
  describe("constructor()", () => {
    it("works", () => {
      let server = new OscHubClient();

      assert(server instanceof OscHubClient);
    });
  });
});
