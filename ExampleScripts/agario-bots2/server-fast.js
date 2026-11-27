// Fast variant of server.js (no update check, console logging, port from config.json).
// Same bots as server.js: the bot session, captcha handling, cipher and AI are in
// botcore.js (shared with server.js and Legend Mod's browser bots).
const WebSocket = require('ws')
const {murmur2} = require('murmurhash-js')
const core = require('./botcore')

const config = require('./config.json')

const PORT = config.server.port

const tagged = (...args) => console.log('[SERVER]', ...args)
const server = core.createServer({
    WebSocket,
    murmur2,
    // handshakeTimeout: a game server that never answers the upgrade does not hold a bot for ever
    socketOptions: { origin: 'https://agar.io', handshakeTimeout: 10000 },
    log: { good: tagged, warn: tagged, error: tagged }
})

function start(port = PORT) {
    console.log('[SERVER] Server has started. Awaiting user connection...');
    return new WebSocket.Server({ port, verifyClient: info => core.isAllowedOrigin(info.origin) }).on('connection', server.onUserConnection)
}

module.exports = Object.assign({}, server, { isAllowedOrigin: core.isAllowedOrigin, start })

if (require.main === module) start()
