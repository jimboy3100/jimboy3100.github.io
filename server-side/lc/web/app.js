var app = new Vue({
    el: '#app',
    data: {
        state: "Connecting...",
        players: null
    },
    methods: {
        onOpen: function()
        {
            console.log("app onOpen");
            this.state = "Connected.";
        },
        onClose: function()
        {
            console.log("app onClose");
        },
        onMessage: function(evt)
        {
            console.log("app onMessage");
            console.log(evt.data);
            this.state = evt.data;
            client.send("oh hi");
        }
    },
    mounted: function()
    {
        this.$nextTick(function()
        {
            client.connect(
                app.onOpen,
                app.onClose,
                app.onMessage
            );
        });
    }
});
