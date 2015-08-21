import assert from "power-assert";
import OscHubServer from "../src/OscHubServer";

describe("OscHubServer", () => {
  describe("constructor()", () => {
    it("works", () => {
      let server = new OscHubServer();

      assert(server instanceof OscHubServer);
    });
  });
});
