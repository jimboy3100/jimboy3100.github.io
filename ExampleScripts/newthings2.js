function appendLog2(message, message2) {
    var region = $("#gamemode").val();
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        '<span class="main-color">' + region.substring(0, 2) + '</span> &nbsp;' +
        '<a onclick="connectto(\`'+message2+'\`);return false;" class="logEntry" data-token="' + currentToken + '" style="color: lightgrey; font-size: 14px;">' + message + '</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}
function connectto(message2){
				$('#server-token').val(message2);
				$('#server-join').click();
}
var player2;
var client2 = {

    // Properties
    server: "ws://lc.snez.org:3050/",
    ws: null,
    isOpen: false,
    onOpenCallback: null,
    onCloseCallback: null,
    onMessageCallback: null,

    // Methods
    connect: function()
    {
        client2.ws = new WebSocket(client2.server);
        client2.ws.onopen = client2.onOpen;
        client2.ws.onclose = client2.onClose;
        client2.ws.onmessage = client2.onMessage;
		
    },
	disconnect: function()
	{
   // Close the connection, if open.

      client2.ws.close();

	},
    onOpen: function()
    {
        console.log("Connected.");
 //       app.state = "Connected.";
    },

    onClose: function()
    {
//       console.log("Reconnecting in 5 seconds...");
//        setTimeout(client2.connect, 5000);
    },

    onMessage: function(evt)
    {
        if (client2.isEmpty(evt))
            return;

        try
        {
            var data = JSON.parse(evt.data);

            if (client2.isEmpty(data) || client2.isEmpty(data.type))
                return;
        }
        catch (e)
        {
            console.log(e);
            return;
        }

        switch (data.type)
        {
            case "ping":
                client2.send({ type: "pong" });
                break;
            case "players_list":
                client2.updatePlayers(data.data);
                break;
        }
    },

    isEmpty: function(obj)
    {
        if (typeof obj == 'undefined')
            return true;

        // For arrays or empty strings
        if (obj.length === 0)
            return true;

        // For objects
        for(var key in obj)
            if (obj.hasOwnProperty(key))
                return false;

        return true;
    },

    updatePlayers: function(data)
    {

		for (var player in data) {
  			if (data.hasOwnProperty(player)) {
				if (data[player].nickname){
    			if (data[player].nickname.indexOf($("#searchInput").val()) >= 0) {
					var temporaryserver=JSON.stringify(data[player]);
					var temporaryserver2;
					var temporaryserver3;
					temporaryserver = temporaryserver.substring(0, temporaryserver.indexOf('.agar.io'));
					temporaryserver2 = temporaryserver.split('live-arena-').pop();
					temporaryserver3 = temporaryserver.split('nickname\"\:\"').pop();
					temporaryserver3 =temporaryserver3.substring(temporaryserver3, temporaryserver3.indexOf('\"\,\"server'));
					//temporaryserver.substring(0, temporaryserver.indexOf(':'));
					appendLog2(temporaryserver3 + " (" + temporaryserver2 + ")", temporaryserver2);
					//JSON.stringify(data[player]);
					//console.log(data[player]);
    			}
				}
  			}
		}
		client2.ws.close();	
    },

    send: function(data)
    {
        client2.ws.send(JSON.stringify(data));
    }
};
