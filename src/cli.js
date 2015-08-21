/* eslint-disable no-console */

import colors from "colors";
import options from "./options";
import prettify from "./prettify";
import OscHubServer from "./server";
import OscHubClient from "./client";

let quiet = false;

function print(...args) {
  if (!quiet) {
    console.log(...args);
  }
}

function help() {
  print(options.generateHelp());
}

function printVersion() {
  print("v%s", require("../package.json").version);
}

function runServer(opts) {
  let server = new OscHubServer();

  server.listen(opts.port, () => {
    print("Listening on port %d", opts.port);
  });

  server.on("error", (e) => {
    print(colors.red.underline(e.toString()));
  });
}

function runClient(opts) {
  let client = new OscHubClient({ send: opts.send, receive: opts.receive });

  client.on("send", (data, msg) => {
    print(colors.yellow(">> %s"), prettify(msg));
  });

  client.on("receive", (data, msg) => {
    print(colors.cyan("<< %s"), prettify(msg));
  });

  client.on("connect", () => {
    print("connected: %s:%s", opts.host, opts.port);
  });

  client.on("error", (e) => {
    print(colors.red.underline(e.toString()));
  });

  client.connect({ host: opts.host, port: opts.port });
}

export default {
  start() {
    let opts = options.parse(process.argv);

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
