var forever = require("forever");
var colors = require("colors");
var options = require("./options");
var prettify = require("./prettify");
var OscHubServer = require("./server");
var OscHubClient = require("./client");

function help() {
  console.log(options.generateHelp());
}

function printVersion() {
  console.log("v%s", require("../package.json").version);
}

function daemonServer(opts) {
  forever.startDaemon(__filename, {
    args: [ "--server", "-p", opts.port ]
  });
}

function runServer(opts) {
  var server = new OscHubServer();

  server.listen(opts.port, function() {
    console.log("Listening on port %d", opts.port);
  });
}

function runClient(opts) {
  var client = new OscHubClient({ send: opts.send, receive: opts.receive });

  client.on("send", function(data) {
    console.log(colors.yellow(">> %s"), prettify(data));
  });

  client.on("receive", function(data) {
    console.log(colors.cyan("<< %s"), prettify(data));
  });

  client.on("connect", function() {
    console.log("connected: %s:%s", opts.host, opts.port);
  });

  client.connect({ host: opts.host, port: opts.port});
}

module.exports = {
  start: function() {
    var opts = options.parse(process.argv);

    if (opts.help) {
      return help();
    }

    if (opts.version) {
      return printVersion();
    }

    if (opts.server) {
      if (opts.daemon) {
        return daemonServer(opts);
      }
      return runServer(opts);
    }

    return runClient(opts);
  }
};

if (module.parent === null) {
  module.exports.start();
}
