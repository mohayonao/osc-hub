/* eslint-disable no-console */

import net from "net";
import colors from "colors";
import options from "./options";
import oscClient from "./osc-client";
import oscServer from "./osc-server";
import utils from "./utils";

let quiet = false;

function print(...args) {
  if (!quiet) {
    console.log(...args);
  }
}

function printError(e) {
  print(colors.red.underline(e.toString()));
}

function help() {
  print(options.generateHelp());
}

function printVersion() {
  let version = require("../package.json").version;

  print(`v${version}`);
}

function runServer(opts) {
  let server = oscServer(net.createServer());

  server.listen(opts.port, () => {
    print("Listening on port %d", opts.port);
  });

  server.on("osc-hub:message", (msg) => {
    print(colors.green(">> %s"), utils.prettify(msg));
  });

  server.on("osc-hub:error", printError);

  return server;
}

function runClient(opts) {
  let connection = net.connect({ host: opts.host, port: opts.port }, () => {
    print("connected: %s:%s", opts.host, opts.port);
  });
  let client = oscClient(connection, opts);

  client.on("error", printError);

  client.on("osc-hub:send", (msg) => {
    print(colors.yellow(">> %s"), utils.prettify(msg));
  });

  client.on("osc-hub:receive", (msg) => {
    print(colors.cyan("<< %s"), utils.prettify(msg));
  });

  client.on("osc-hub:error", printError);

  return client;
}

export default {
  run(argv) {
    let opts = options.parse(argv);

    if (opts.help) {
      return help();
    }

    quiet = opts.quiet;

    if (opts.version) {
      return printVersion();
    }

    if (opts.server) {
      return runServer(opts);
    }

    return runClient(opts);
  },
};
