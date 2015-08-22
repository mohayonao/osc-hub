function createTypeError(message, opts = {}) {
  let e = new TypeError(message);

  Object.keys(opts).forEach((key) => {
    e[key] = opts[key];
  });

  return e;
}

function prettify(msg) {
  function peel(msg) {
    if (msg.elements) {
      msg.elements = msg.elements.map(peel);
    }

    if (msg.args) {
      msg.args = msg.args.map(value => value.value);
    }

    return msg;
  }

  return JSON.stringify(peel(msg));
}

function removeIfExists(array, target) {
  let index = array.indexOf(target);

  if (index === -1) {
    return false;
  }

  array.splice(index, 1);

  return true;
}

function toArray(object) {
  if (Array.isArray(object)) {
    return object;
  }
  if (typeof object === "undefined") {
    return [];
  }
  return [ object ];
}

export default {
  createTypeError,
  prettify,
  removeIfExists,
  toArray,
};
