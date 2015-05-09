var OscMsg = require("osc-msg");

module.exports = function(data) {
  var osc = OscMsg.fromBuffer(data);

  var prettify = function(osc) {
    if (osc.elements) {
      osc.elements = osc.elements.map(function(elem) {
        return prettify(elem);
      });
    }

    if (osc.args) {
      osc.args = osc.args.map(function(value) {
        return value.value;
      });
    }

    return osc;
  };

  return JSON.stringify(prettify(osc));
};
