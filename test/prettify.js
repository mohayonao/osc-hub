import assert from "power-assert";
import prettify from "../src/prettify";

const OSC_MESSAGE = {
  elements: [
    {
      address: "/foo",
      args: [
        { type: "integer", value: 100 },
        { type: "float", value: 3.141 },
      ],
    },
  ],
};

describe("prettify(msg: object): string", () => {
  it("works", () => {
    assert(prettify(OSC_MESSAGE) === '{"elements":[{"address":"/foo","args":[100,3.141]}]}');
  });
});
