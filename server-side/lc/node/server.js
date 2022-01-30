const WebSocket = require('ws');
const Players = require('./modules/players');

const wss = new WebSocket.Server({ port: 3050 });

var server = {

    onMessage: function incoming(message, ws)
    {
        try
        {
            console.log('Received: %s', message);
            var data = JSON.parse(message);
            switch (data.type)
            {
                case "update_details":
                    Players.update(data);
                    break;
                case "list_players":
                    ws.send(Players.list());
                    break;
            }
        }
        catch (e)
        {
            console.log(e);
        }
    },

    onConnection: function connection(ws)
    {
        console.log('New connection');

        ws.on('message', function(message) {
            server.onMessage(message, ws);
        });

        console.log("Sending: %s", Players.list());
        ws.send(Players.list());
    },
};

wss.on('connection', server.onConnection);
