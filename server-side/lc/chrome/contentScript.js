var state = {
    nickname: null,
    server: null,
    tag: null
};

var socket = {
    server: "ws://127.0.0.1:3050/",
    client: null,
    connect: function()
    {
        socket.client = new WebSocket(socket.server);
        socket.client.onopen = socket.updateServerDetails;
        socket.client.onclose = socket.reconnect;
    },
    reconnect: function()
    {
        console.log("Reconnecting in 5 seconds...");

        setTimeout(function(){
            socket.connect();
        }, 5000);
    },
    updateServerDetails: function()
    {
        console.log("Details have changed");
        console.log(state);

        socket.send({
            id: getSessionID(),
            type: "update_details",
            data: state
        });
    },
    send: function(msg)
    {
        if (socket.client.readyState !== socket.client.OPEN)
            return;

        socket.client.send(JSON.stringify(msg));
    }
};

function getState()
{
    if (!state.nickname)
        initLc();

    return state;
}

var reconnectTimer = null;

var initLc = function()
{
    var nick = document.getElementById("nick");
    var server = document.getElementById("server");
    var tag = document.getElementById("clantag");
    var reconnectButton = document.getElementById("server-reconnect");

    if (!nick)
    {
        console.log("Could not initialize Lc");
        return;
    }

    state.nickname = nick.value;
    state.server = server.value;
    state.tag = tag.value;

    nick.addEventListener("change", function(e){
        state.nickname = nick.value;
        socket.updateServerDetails();
    });

    server.addEventListener("change", function(e){
        state.nickname = server.value;
        socket.updateServerDetails();
    });

    tag.addEventListener("change", function(e){
        state.nickname = tag.value;
        socket.updateServerDetails();
    });

    reconnectButton.addEventListener("click", function(e)
    {
        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(function()
        {
            state.nickname = server.value;
            socket.updateServerDetails();
        }, 5000);
    });

    socket.connect();
};

window.addEventListener("load", initLc);

function getSessionID()
{
    return getCookie("__cfduid");
}

function getCookie(cname)
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

