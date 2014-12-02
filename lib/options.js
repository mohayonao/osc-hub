module.exports = require("optionator")({
  prepend: "Usage: osc-hub [options]",
  options: [
    {
      option: "server",
      type: "Boolean",
      description: "server mode"
    },
    {
      option: "daemon",
      alias: "d",
      type: "Boolean",
      description: "enable daemon mode (available in server mode)"
    },
    {
      option: "host",
      alias: "h",
      type: "String",
      default: "localhost",
      description: "server host"
    },
    {
      option: "port",
      alias: "p",
      type: "Int",
      default: "52885",
      description: "server port"
    },
    {
      option: "send",
      alias: "s",
      type: "Int",
      description: "send port"
    },
    {
      option: "receive",
      alias: "r",
      type: "Int",
      description: "receive port"
    },
    {
      option: "version",
      alias: "v",
      type: "Boolean",
      description: "print the version",
    },
    {
      option: "help",
      type: "Boolean",
      description: "show this message"
    }
  ]
});