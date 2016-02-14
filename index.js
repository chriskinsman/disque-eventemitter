'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Disqueue = require('disqueue-node');


function DisqueEventEmitter(disqueConfig, queueName, options) {
    options = options || {};
    this.concurrency = options.concurrency || 1;
    this.jobCount = options.jobCount || 1;
    this.withCounters = options.withCounters!==undefined ? options.withCounters : false;
    this.paused = false;
    var disq = new Disqueue(disqueConfig);
    var self = this;
    var pendingMessages = 0;
    var concurrencyPaused = false;

    EventEmitter.call(this);

    // Main message processor
    function readQueue() {
        disq.getJob({queue: queueName, count: self.jobCount, withcounters: self.withCounters}, function(err, jobs) {
            if(err) {
                self.emit('error', err);
            }
            else {
                jobs.forEach(function(job) {
                    pendingMessages++;
                    self.emit('job', job, function() {
                        pendingMessages--;
                        if(!self.paused && concurrencyPaused && pendingMessages < self.concurrency) {
                            concurrencyPaused = false;
                            setImmediate(readQueue);
                        }
                    });
                });

                if(!self.paused && pendingMessages<self.concurrency) {
                    setImmediate(readQueue);
                }
                else {
                    concurrencyPaused = true;
                }
            }
        });
    }

    disq.on('connected', function(err) {
        if(err) {
            console.error(err);
        }
        else {
            readQueue();
        }
    });

    this.ack = function ack(job, callback) {
        if(job && job.jobId) {
            disq.ackJob(job.jobId, callback);
        }
        else {
            callback('Invalid job');
        }
    };

    this.nack = function nack(job, callback) {
        if(job && job.jobId) {
            disq.nack(job.jobId, callback);
        }
        else {
            callback('Invalid job');
        }
    };

    this.pause = function pause() {
        this.paused = true;
    };

    this.resume = function resume() {
        if(this.paused) {
            this.paused = false;
            if(!concurrencyPaused && pendingMessages < self.concurrency) {
                readQueue();
            }
        }
    }
}
util.inherits(DisqueEventEmitter, EventEmitter);

module.exports = DisqueEventEmitter;