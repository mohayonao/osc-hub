#!/usr/bin/env node

var net = require("net");
var udp = require("dgram");
var oscmin = require("osc-min");
var colors = require("colors/safe");
var optionator = require("optionator")({
  prepend: "Usage: osc-hub [options]",
  options: [
    {
      option: "server",
      type: "Boolean",
      description: "Server mode"
    },
    {
      option: "daemon",
      alias: "d",
      type: "Boolean",
      description: "Enable daemon mode"
    },
    {
      option: "host",
      alias: "h",
      type: "String",
      default: "localhost",
      description: "Server host"
    },
    {
      option: "port",
      alias: "p",
      type: "Int",
      default: "52885",
      description: "Server port"
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
      option: "help",
      type: "Boolean",
      description: "Display help"
    }
  ]
});

function help() {
  console.log(optionator.generateHelp());
}

function daemonServer(opts) {
  forever.startDaemon(__filename, {
    args: [ "--server", "-p", opts.port ]
  });
}

function prettifyOsc(data) {
  var osc = oscmin.fromBuffer(data);

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
}

function server(opts) {
  var connections = [];

  net.createServer(function(conn) {

    conn.on("data", function(data) {
      connections.forEach(function(conn) {
        conn.write(data);
      });
    });

    conn.on("close", function() {
      var index = connections.indexOf(conn);

      if (index !== -1) {
        connections.splice(index, 1);
      }
    });

    connections.push(conn);

  }).listen(opts.port, function() {
    console.log("Listening on port %d", this.address().port);
  });
}

function client(opts) {
  var client = net.connect({ host: opts.host, port: opts.port });

  if (opts.send) {
    udp.createSocket("udp4", function(data) {
      client.write(data);
      console.log(colors.yellow(">> %s"), prettifyOsc(data));
    }).bind(opts.send);
  }

  if (opts.receive) {
    var socket = udp.createSocket("udp4");
    client.on("data", function(data) {
      socket.send(data, 0, data.length, opts.receive);
      console.log(colors.cyan("<< %s"), prettifyOsc(data))
    });
  }
}

(function(opts) {

  if (opts.help) {
    return help();
  }

  if (opts.server) {
    if (opts.daemon) {
      return daemonServer(opts);
    } else {
      return server(opts);
    }
  }

  return client(opts);

})(optionator.parse(process.argv));
