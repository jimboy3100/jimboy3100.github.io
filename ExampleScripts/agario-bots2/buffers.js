const Writer = require('./writer')

// Bytes of a nick or token as they go on the wire.
// Names from the client arrive already UTF-8 encoded, one byte per character
// (the client sends unescape(encodeURIComponent(nick)) and Reader.readString
// keeps one character per byte), so characters 0x00-0xFF are written as single
// bytes, exactly like the client writes its own spawn packet. A string with a
// character above 0xFF is a plain JavaScript string and is encoded to UTF-8 here.
// Zero bytes are dropped: they would end the field early.
function toBytes(value){
    const string = value == null ? '' : String(value)
    const bytes = /[^\x00-\xff]/.test(string) ? Buffer.from(string, 'utf8') : Buffer.from(string, 'latin1')
    return bytes.includes(0) ? Buffer.from(bytes.filter(byte => byte !== 0)) : bytes
}

module.exports = {
    toBytes,
    protocolVersion(version){
        const writer = new Writer(5)
        writer.writeUint8(254)
        writer.writeUint32(version)
        return writer.buffer
    },
    clientVersion(version){
        const writer = new Writer(5)
        writer.writeUint8(255)
        writer.writeUint32(version)
        return writer.buffer
    },
    // Spawn: uint8 0, nick bytes, 0, token bytes, 0 (same layout as the player's
    // spawn in the client). Token '0' means "no captcha token".
    spawn(name, token){
        const nick = toBytes(name)
        const code = toBytes(token == null || token === '' ? '0' : token)
        const buf = Buffer.alloc(3 + nick.length + code.length)
        buf.writeUInt8(0, 0)
        nick.copy(buf, 1)
        code.copy(buf, 2 + nick.length)
        return buf
    },
    // Spawn without the token field (old protocol), kept for compatibility.
    spawn2(name){
        const nick = toBytes(name)
        const buf = Buffer.alloc(2 + nick.length)
        nick.copy(buf, 1)
        return buf
    },
    // Answer to a captcha v3 request (opcode 87): uint8 88, token bytes, 0.
    captchaV3(token){
        const code = toBytes(token)
        const buf = Buffer.alloc(2 + code.length)
        buf.writeUInt8(88, 0)
        code.copy(buf, 1)
        return buf
    },
    move(x, y, key){
        const writer = new Writer(13)
        writer.writeUint8(16)
        writer.writeInt32(x)
        writer.writeInt32(y)
        writer.writeInt32(key)
        return writer.buffer
    }
}
