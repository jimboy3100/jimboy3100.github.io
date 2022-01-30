var ws = null;

var client = {
    // Properties
    server: "ws://127.0.0.1:3050/",
    isOpen: false,
    onOpenCallback: null,
    onCloseCallback: null,
    onMessageCallback: null,

    // Methods
    connect: function(onOpenCallback, onCloseCallback, onMessageCallback)
    {
        ws = new WebSocket(client.server);
        ws.onopen = client.onOpen;
        ws.onclose = client.onClose;
        ws.onmessage = client.onMessage;
        client.onOpenCallback = onOpenCallback;
        client.onCloseCallback = onCloseCallback;
        client.onMessageCallback = onMessageCallback;
    },

    onOpen: function()
    {
        console.log("client onOpen");
        client.isOpen = true;
        client.onOpenCallback();
    },

    onClose: function()
    {
        console.log("client onClose");
        client.isOpen = false;
        client.onCloseCallback();
    },

    onMessage: function(evt)
    {
        console.log("client onMessage");
        client.onMessageCallback(evt);
    },

    send: function(data)
    {
        ws.send(JSON.stringify({
          data: data
        }));
    }
}
