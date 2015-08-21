function prettify(msg) {
  if (msg.elements) {
    msg.elements = msg.elements.map(elem => prettify(elem));
  }

  if (msg.args) {
    msg.args = msg.args.map(value => value.value);
  }

  return msg;
}

export default (msg) => {
  return JSON.stringify(prettify(msg));
};
