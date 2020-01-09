## server-send-events

> server send events library for node.js

[![server-send-events](https://img.shields.io/npm/v/server-send-events.svg)](https://npmjs.org/server-send-events)

### Installation

```bash
$ npm install server-send-events
```

### Example

```js
const http        = require('http');
const EventSource = require('server-send-events');

const es = new EventSource();
const server = new http.Server();
const send = (res) => res.end(`<script>
  var source = new EventSource('/events');
  source.onmessage = function(e) {
    document.body.innerHTML = e.data;
    console.log(e.data);
  };
</script>`);

server.on('request', (req, res) => {
  if(es.match(req, '/events')){
    es.handle(req, res);
  }else{
    send(res);
  }
})

server.listen(3000, err => {
  if(err) throw err;
  console.log(`server-send-events is running at http://localhost:${server.address().port}`);
  setInterval(() => {
    if(es) es.send(`Current time is : ${new Date().toLocaleString()}`);
  }, 1000);
});
```

### API

- send
- event
- retry

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

This work is licensed under the [MIT license](./LICENSE).

---