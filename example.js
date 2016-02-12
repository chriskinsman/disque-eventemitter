'use strict';

var DisqEvent = require('./index');

console.info('Listening for jobs Ctrl-C to end');
var de = new DisqEvent('127.0.0.1', 7711, 'test');

de.on('error', function(err) {
    console.error(err);
});

de.on('job', function(job) {
    console.info(job);
    de.ack(job, function(err) {
       console.info('Job acked');
    });
});