const URI          = require('url');
const http         = require('http');
const EventEmitter = require('events');
const Client       = require('./client');
/**
 * EventSource
 * @wiki https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
*/
class EventSource extends EventEmitter {
  /**
   * EventSource
   * @param {*} stream 
   * @param {*} path 
   */
  constructor(stream, path) {
    super();
    this.clients = [];
    if (path instanceof http.OutgoingMessage) {
      this.handle(stream, path);
    }
    if (stream instanceof http.Server && path) {
      const listeners = stream.listeners('request');
      stream.removeAllListeners('request');
      stream.on('request', (req, res) => {
        if (this.match(req, path)) this.handle(req, res);
        else listeners.forEach(listener => listener.call(stream, req, res));
      });
    }
    return this;
  }
  /**
   * match
   * @param {*} request 
   * @param {*} pathname 
   */
  match(request, pathname) {
    const { method, url, headers } = request;
    const { accept } = headers;
    if (method !== 'GET') return false;
    if (pathname && pathname !== URI.parse(url).pathname) return false;
    if (!(accept && ~accept.indexOf('text/event-stream'))) return false;
    return true;
  }
  /**
   * handle
   * @param {*} req 
   * @param {*} res 
   */
  handle(req, res) {
    const client = new Client(req, res);
    const index = (this.clients = this.clients || []).push(client);
    this.emit('connection', client);
    client.once('close', () => {
      this.clients.splice(index - 1, 1);
    });
    return client;
  }
  /**
   * event
   */
  event(type, data, id) {
    return this.send(data, type, id);
  }
  /**
   * send
  */
  send(data, type, id) {
    this.clients.forEach(x => x.send.apply(x, arguments));
    return this;
  }
}

module.exports = EventSource;
