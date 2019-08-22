require("colour");

const Logger = {
    prefix: {
        g: 'INFO: '.green,
        a: 'ALERT:'.yellow,
        e: 'ERROR:'.red
    },

    __: function(prefix, msg) {

        console.log(prefix + " " + msg.white.bold);
    },

    error: function() {
        let msg = "";

        for (let i in arguments) {
            msg += arguments[i] + " ";
        }

        Logger.__(Logger.prefix.e, msg);
    },

    warn: function() {
        let msg = "";

        for (let i in arguments) {
            msg += arguments[i] + " ";
        }

        Logger.__(Logger.prefix.a, msg);
    },

    good: function() {
        let msg = "";

        for (let i in arguments) {
            msg += arguments[i] + " ";
        }

        Logger.__(Logger.prefix.g, msg);
    }

};
module.exports = Logger;
