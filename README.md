# winston-fluent
[![Build Status](https://travis-ci.org/lemonde/winston-fluent.svg?branch=master)](https://travis-ci.org/lemonde/winston-fluent)

Winston rewriter to optimized logs for Fluent.

## Install

```
npm install winston-fluent
```

## Usage

```js
var winston = require('winston');
var winstonFluent = require('winston-fluent').Fluent;

winston.add(winstonFluent, options);
```

`options` should be a JavaScript object with the following key-value pairs:

+ `tag`: Required. This is the first part of the Fluentd tag.
+ `label`: Required. This is the second part of the Fluentd tag.
+ `host`: Optional (default=localhost). The host for Fluentd.
+ `port`: Optional (default=24224). The port for Fluentd.
+ `timeout`: optional (default=3.0). Socket timeout for the TCP connection to Fluentd.

## License

MIT
