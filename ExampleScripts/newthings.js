var xhttp = new XMLHttpRequest();

function post(server, username, password, data)
{
xhttp.open("POST", server, false);
xhttp.setRequestHeader("username", username);
xhttp.setRequestHeader("password", password);
xhttp.send(data);
}

post("http://lmsettings.snez.org/", "test", "test1234", "{ a: 1, b: 2, d: 4}");

var xhttp = new XMLHttpRequest();
function get(server, username, password)
{
xhttp.open("GET", server, false);
xhttp.setRequestHeader("username", username);
xhttp.setRequestHeader("password", password);
xhttp.send();
}
get("http://lmsettings.snez.org/", "test", "test1234");
var a= xhttp.response;

$("#export-settings").val();

post("http://lmsettings.snez.org/", "test", "test1234", $('#export-settings').val());






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
        console.log("Reconnecting in 5 seconds...");
        setTimeout(client2.connect, 5000);
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
    			if (data[player].nickname.indexOf("℄") >= 0) {
					console.log(data[player]);
    			}
				}
  			}
		}	
    },

    send: function(data)
    {
        client2.ws.send(JSON.stringify(data));
    }
};
