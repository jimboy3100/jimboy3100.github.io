// These bots are working with www.jimboy3100.github.io extension or agar.io
// version 1.3 version B
// creator Jimboy3100

// Url https://repl.it/@legendmod/party-bots
// Websocket wss://party-bots--legendmod.repl.co

// By comparing Url and Websocket, imagine how your websocket should below
// If repl.it not loading, wait or make a new repo. Sometimes repl.it bugs
// TLS: only skip cert verification on request-promise calls to agar.io proxies
// (they use self-signed certs). Do NOT globally disable TLS via process.env.
//
// The bots themselves (session, captcha, cipher, AI) are in botcore.js, the same file
// Legend Mod runs in the browser for its browser bots. This file adds the WebSocket
// server for the client, the allowed origins and the update check.
const WebSocket = require('ws'),
    { murmur2 } = require('murmurhash-js'),
    core = require('./botcore'),
    requester = require("request-promise").defaults({
    strictSSL: false,
    rejectUnauthorized: false
 }),
    logger = require("./logger.js"),
    config = require('./config.json');

const tagged = fn => (...args) => fn('[SERVER]:', ...args)
const server = core.createServer({
    WebSocket,
    murmur2,
    socketOptions: { origin: 'https://agar.io' },
    log: { good: tagged(logger.good), warn: tagged(logger.warn), error: tagged(logger.error) }
})

function checkUpdate() {
    if (config.server.update) {
        const request = requester(config.server.link, (err, req, data) => {
            if (err) { logger.error('[SERVER]: Update check failed:', err.message); return; }
            try {
                const requesterData = Buffer.from(data).toString()
                const requesterConfig = JSON.parse(requesterData)

                if (config.server.version < requesterConfig.server.version) {
                    logger.warn('[SERVER]: A new update was found!')
                    logger.warn('[SERVER]: Download -> https://jimboy3100.github.io/ExampleScripts/agario-bots2')
                } else {
                    logger.good('[SERVER]: No updates found!')
                }
            } catch (e) {
                logger.error('[SERVER]: Update check: invalid response:', e.message)
            }
        })
        // request-promise also rejects: without a handler an offline start crashes Node
        if (request && typeof request.catch === 'function') request.catch(() => {})
    } else {
        logger.error('[SERVER]: Update is false!')
    }
}

function start(port = config.server.port) {
    logger.warn(`[SERVER]: If error occurs on port ${port} try 8083 on config.json and websocket`);
    checkUpdate()
    logger.good(`[SERVER]: Running version ${config.server.version} on port ${port}`)
    return new WebSocket.Server({ port, verifyClient: info => core.isAllowedOrigin(info.origin) }).on('connection', server.onUserConnection)
}

module.exports = Object.assign({}, server, { isAllowedOrigin: core.isAllowedOrigin, start })

if (require.main === module) start()
