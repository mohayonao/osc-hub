module.exports = function(msg) {
  function prettify(msg) {
    if (msg.elements) {
      msg.elements = msg.elements.map(function(elem) {
        return prettify(elem);
      });
    }

    if (msg.args) {
      msg.args = msg.args.map(function(value) {
        return value.value;
      });
    }

    return msg;
  };
  return JSON.stringify(prettify(msg));
};
