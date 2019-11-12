const Writer = require('./writer')

module.exports = {
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
    spawn(name,token){
		//console.log(name)
        let buf = new Buffer.alloc(3 + name.length + token.length);
        buf.writeUInt8(0, 0);
		buf.write(name, 1);
        //buf.write(name, 1);
        buf.write(token, 2 + name.length);
        return buf		
    },
    spawn2(name){
        const writer = new Writer(2 + name.length)
        writer.writeUint8(0)
        writer.writeString(name)
        return writer.buffer
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
