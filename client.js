const Stream = require('stream');

class Client extends Stream {
  constructor(request, response, options = {}) {
    super();
    this.request = request;
    this.response = response;
    this.request.socket.setNoDelay(true);
    this.response.socket.setNoDelay(true);
    this.request.on('error', (e) => this.emit('error', e));
    this.request.on('close', (e) => this.emit('close', e));
    this.response.writeHead(200, Object.assign({
      'Connection'   : 'keep-alive',
      'Cache-Control': 'no-cache',
      'Content-Type' : 'text/event-stream',
      // ref: https://serverfault.com/questions/801628/for-server-sent-events-sse-what-nginx-proxy-configuration-is-appropriate
      'X-Accel-Buffering': 'no'
    }, options.headers));
  }
  /**
   * retry
   */
  retry(ms) {
    this.send({ retry: parseInt(ms, 10) });
  }
  /**
   * event
   */
  event(event, data, id) {
    return this.send(data, event, id);
  }
  /**
   * send
   */
  send(data, event, id) {
    if (typeof data === 'object')
      data = JSON.stringify(data);
    return this.sendRaw(data, event, id);
  }
  /**
   * sendRaw
   */
  sendRaw(data, event, id) {
    id = id || Date.now();
    if (typeof data !== 'string') {
      throw new TypeError('message must be a string');
    }
    let message = '';
    if (id) message += `id: ${id}\n`;
    if (event) message += `event: ${event}\n`;
    message += data
      .split('\n')
      .map(line => `data: ${line}`)
      .join('\n');
    message += '\n\n';
    this.response.write(message);
    return this;
  }
  /**
   * close
   */
  close(){
    this.response.end();
    return this;
  }
}

module.exports = Client;