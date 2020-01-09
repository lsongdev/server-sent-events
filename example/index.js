const http = require('http');
const EventSource = require('..');

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
