const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const server = https.createServer({
  cert: fs.readFileSync('/ssl/live/snez.org/fullchain.pem'),
  key: fs.readFileSync('/ssl/live/snez.org/privkey.pem')
});
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.listen(8080);