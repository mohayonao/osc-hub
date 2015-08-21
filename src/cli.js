/* eslint-disable no-console */

import colors from "colors";
import options from "./options";
import prettify from "./prettify";
import OscHubServer from "./server";
import OscHubClient from "./client";

function help() {
  console.log(options.generateHelp());
}

function printVersion() {
  console.log("v%s", require("../package.json").version);
}

function runServer(opts) {
  let server = new OscHubServer();

  server.listen(opts.port, () => {
    console.log("Listening on port %d", opts.port);
  });

  server.on("error", (e) => {
    console.log(colors.red.underline(e.toString()));
  });
}

function runClient(opts) {
  let client = new OscHubClient({ send: opts.send, receive: opts.receive });

  if (!opts.quiet) {
    client.on("send", (data, msg) => {
      console.log(colors.yellow(">> %s"), prettify(msg));
    });

    client.on("receive", (data, msg) => {
      console.log(colors.cyan("<< %s"), prettify(msg));
    });
  }

  client.on("connect", () => {
    console.log("connected: %s:%s", opts.host, opts.port);
  });

  client.on("error", (e) => {
    console.log(colors.red.underline(e.toString()));
  });

  client.connect({ host: opts.host, port: opts.port });
}

export default {
  start() {
    let opts = options.parse(process.argv);

    if (opts.help) {
      return help();
    }

    if (opts.version) {
      return printVersion();
    }

    if (opts.server) {
      return runServer(opts);
    }

    return runClient(opts);
  },
};
