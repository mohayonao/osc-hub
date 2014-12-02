# osc-hub
> broadcast osc messages over the network

[![NPM Version](http://img.shields.io/npm/v/osc-hub.svg?style=flat)](https://www.npmjs.org/package/osc-hub)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/mohayonao/osc-hub)
[![Dependency Status](http://img.shields.io/david/mohayonao/osc-hub.svg?style=flat)](https://david-dm.org/mohayonao/osc-hub)

The hub receives osc messages from all clients connected to a server and broadcasts them.
It is useful to share osc messages between some computers over the network.

## Installation
```sh
$ npm install -g osc-hub
```

## How to use
Run a osc-hub server. `osc-hub --server -d` runs as a daemon server with [forever](https://github.com/nodejitsu/forever).

```sh
$ osc-hub --server
```

Run a osc-hub client.
```sh
$ osc-hub -s 57121 -r 57122
```

Have fun!

![demo](http://otononaru.appspot.com/cdn/osc-hub/demo.gif)

## Options
```  
    --server       server mode
-d, --daemon       enable daemon mode (available in server mode)
-h, --host String  server host - default: localhost
-p, --port Int     server port - default: 52885
-s, --send Int     send port
-r, --receive Int  receive port
-v, --version      print the version
```

## API
### OscHubServer
This class is used create a OscHub server.

- `new oschub.Server()`
  - Constructor is a new OscHub server.
- `server.listen(port, [ callback ])`
  - Begin accepting connections on the specified port.
- `Event: connect`
  - `net.Socket`
  - Emitted when a new connection.
- `Event: disconnect`
  - `net.Socket`
  - Emitted when a connection is disconnected.
- `Event: data`
  - `Buffer`
  - Emitted when data is received.

### OscHubClient
The class is used create a OscHub client.

- `new oschub.Client(options)`
  - Constructor is a new OscHub client.
  - `options` is an object with the following defaults: `{ send: null, receive: null }`
- `client.connect(options)`
  - Open the connection.
  - `options` is passed to `net.connect()`
- `client.pause()`
  - Pauses the reading of data.
- `client.resume()`
  - Resumes reading after a call to `pause()`
- `Event: connect`
  - `net.Socket`
  - Emitted when a socket connection is successfully established.
- `Event: send`
  - `Buffer`
  - Emitted when data is sent.
- `Event: receive`
  - `Buffer`
  - Emitted when data is received.

## License

`osc-hub` is available under The MIT License.
