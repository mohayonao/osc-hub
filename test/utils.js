import assert from "power-assert";
import utils from "../src/utils";

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

describe("utils", () => {
  describe(".createTypeError(message: string, opts: object = {}): TypeError", () => {
    it("works", () => {
      let e = utils.createTypeError("error");

      assert(e instanceof TypeError);
      assert(e.message === "error");
    });
    it("works with options", () => {
      let e = utils.createTypeError("error", { value: 1000 });

      assert(e instanceof TypeError);
      assert(e.message === "error");
      assert(e.value === 1000);
    });
  });
  describe(".prettify(msg: object): string", () => {
    it("works", () => {
      assert(utils.prettify(OSC_MESSAGE) === '{"elements":[{"address":"/foo","args":[100,3.141]}]}');
    });
  });
  describe(".removeIfExists(array: any[], target: any): boolean", () => {
    it("works", () => {
      let array = [ 1, 2, 3, 4, 5 ];

      assert(utils.removeIfExists(array, 3) === true);
      assert.deepEqual(array, [ 1, 2, 4, 5 ]);

      assert(utils.removeIfExists(array, 6) === false);
      assert.deepEqual(array, [ 1, 2, 4, 5 ]);
    });
  });
  describe(".toArray(object: any): any[]", () => {
    it("works", () => {
      let array = [ 1, 2, 3, 4, 5 ];
      let UNDEFINED;

      assert(utils.toArray(array) === array);
      assert.deepEqual(utils.toArray(UNDEFINED), []);
      assert.deepEqual(utils.toArray(), []);
      assert.deepEqual(utils.toArray(null), [ null ]);
      assert.deepEqual(utils.toArray(1), [ 1 ]);
    });
  });
});
