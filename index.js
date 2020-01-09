const EventSource = require('./server');

EventSource.Client = require('./client');
EventSource.Server = EventSource;

module.exports = EventSource;