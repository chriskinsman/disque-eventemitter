'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Disqueue = require('disqueue-node');


function DisqueEventEmitter(disqueHost, disquePort, queueName, options) {
    this.options = options || {};
    this.jobCount = this.options.jobCount || 1;
    var disq = new Disqueue({host: disqueHost, port: disquePort});
    var self = this;

    EventEmitter.call(this);

    // Main message processor
    function readQueue() {
        disq.getJob({queue: queueName, count: self.jobCount}, function(err, jobs) {
            if(err) {
                self.emit('error', err);
            }
            else {
                jobs.forEach(function(job) {
                    self.emit('job', job);
                });
            }

            setImmediate(readQueue);
        });
    }

    readQueue();

    this.ack = function(job, callback) {
        if(job && job.jobId) {
            disq.ackJob(job.jobId, callback);
        }
        else {
            callback('Invalid job');
        }
    };

    this.nack = function(job, callback) {
        if(job && job.jobId) {
            disq.nack(job.jobId, callback);
        }
        else {
            callback('Invalid job');
        }
    }
}
util.inherits(DisqueEventEmitter, EventEmitter);

module.exports = DisqueEventEmitter;