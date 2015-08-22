# OSC HUB
> broadcast osc messages over the network

[![Build Status](http://img.shields.io/travis/mohayonao/osc-hub.svg?style=flat-square)](https://travis-ci.org/mohayonao/osc-hub)
[![NPM Version](http://img.shields.io/npm/v/osc-hub.svg?style=flat)](https://www.npmjs.org/package/osc-hub)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/mohayonao/osc-hub)

The hub receives osc messages from all clients connected to a server and broadcasts them.
It is useful to share osc messages between some computers over the network.

![architecture](http://otononaru.appspot.com/cdn/osc-hub/osc-hub.png)

## Installation

```sh
npm install -g osc-hub
```

## How to use
Run a osc-hub server.

```sh
osc-hub --server
```

Run a osc-hub client.

```sh
osc-hub -s 57121 -r 57122
```

Have fun!

![demo](http://otononaru.appspot.com/cdn/osc-hub/demo.gif)

## Run as a daemon

Run as a daemon with [forever](https://github.com/foreverjs/forever)..

```sh
forever start -c osc-hub . --server
```

## Options
```  
    --server       server mode
-h, --host String  server host - default: localhost
-p, --port Int     server port - default: 52885
-s, --send Int     send port
-r, --receive Int  receive port
-v, --version      print the version
```

## License

MIT
