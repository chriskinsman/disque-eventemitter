'use strict';

var DisqueEventEmitter = require('./index');

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