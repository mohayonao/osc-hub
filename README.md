# osc-hub
[![NPM Version](http://img.shields.io/npm/v/osc-hub-client.svg?style=flat)](https://www.npmjs.org/package/osc-hub)
[![Dependency Status](http://img.shields.io/david/mohayonao/osc-hub-client.svg?style=flat)](https://david-dm.org/mohayonao/osc-hub)

The hub receives osc messages from all clients connected to a server and broadcasts them.

## Installation
```sh
$ npm install -g osc-hub
```

## How to use
Boot a osc-hub server

```sh
$ osc-hub --server
```

Run a osc-hub client
```sh
$ osc-hub -s 57121 -r 57122
```

## Options
```  
    --server       Server mode
-d, --daemon       Enable daemon mode
-h, --host String  Server host - default: localhost
-p, --port Int     Server port - default: 52885
-s, --send Int     send port
-r, --receive Int  receive port
    --help         Display help
```

## License

`osc-hub` is available under The MIT License.
