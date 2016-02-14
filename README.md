# disque-eventemitter

  [![shippable Build][shippable-image]][shippable-url]
  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

EventEmitter to simplify disque GETJOB

## Features
  * EventEmitter pattern for GETJOB
  * job event emitted for each job
  * Supports pause/resume of emitter

## Installation

``` bash
  $ npm install disque-eventemitter --save
```

## Usage

```js
'use strict';

var DisqueEventEmitter = require('disque-eventemitter');

console.info('Listening for jobs Ctrl-C to end');
var de = new DisqueEventEmitter({host:'127.0.0.1', port: 7711}, 'test', {concurrency: 2});

de.on('error', function(err) {
    console.error(err);
});

de.on('job', function(job, done) {
    console.info(job);
    // Indicate we are done and to ack the job
    setTimeout(function(){
        done(true);
    }, 5000 * Math.random());
});
```

## Documentation

### new DisqueEventEmitter(disqueConfig, queueName, options)

Sets up the instance of disque to connect to and the queue to use
 
__Arguments__

* `disqueConfig` - Config hash that is passed straight through to disque.  Example: {'host':'127.0.0.1', 'port': 7711} 
* `queueName` - Name of queue to get jobs from
* `options` - Options
    - `concurrency` - Number of jobs to emit in parallel.  Defaults to 1
    - `jobCount` - Number of jobs to get at once. Defaults to 1.  If you get more than one job at a time all will be emitted and may exceed concurrency limit.
    - `withCounters` - Get jobs with counters showing nacks and additional deliveries 


### pause()

Pauses emitting jobs.  Jobs may still be emitted from the previous scan operation.

### resume()

Resumes a paused emitter.

## People

The author is [Chris Kinsman](https://github.com/chriskinsman) from [PushSpring](http://www.pushspring.com)

## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/disque-eventemitter.svg?style=flat
[npm-url]: https://npmjs.org/package/disque-eventemitter
[downloads-image]: https://img.shields.io/npm/dm/disque-eventemitter.svg?style=flat
[downloads-url]: https://npmjs.org/package/disque-eventemitter
[shippable-image]: https://img.shields.io/shippable/chriskinsman/disque-eventemitter.svg
[shippable-url]: https://app.shippable.com/projects/56c0bcc51895ca447473f9f3
