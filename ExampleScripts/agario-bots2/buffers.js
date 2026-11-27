// Packets to the game server, as Node Buffers. The packets themselves are built by
// botcore.js (shared with Legend Mod's browser bots).
const core = require('./botcore')

const toBuffer = bytes => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
const wrap = fn => (...args) => toBuffer(fn(...args))

module.exports = {
    toBytes: wrap(core.buffers.toBytes),
    protocolVersion: wrap(core.buffers.protocolVersion),
    clientVersion: wrap(core.buffers.clientVersion),
    spawn: wrap(core.buffers.spawn),
    spawn2: wrap(core.buffers.spawn2),
    captchaV3: wrap(core.buffers.captchaV3),
    move: wrap(core.buffers.move)
}
