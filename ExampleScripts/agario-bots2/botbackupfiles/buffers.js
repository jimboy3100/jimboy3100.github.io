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
    spawn(name){
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
    },
    createView(t) {
      return new DataView(new ArrayBuffer(t));
    },
    sendRecaptcha(captchatoken, key) {
                const writer = new Writer(3 + captchatoken.length);
                writer.writeUint8(86);
                writer.writeString(captchatoken)          
                return writer.buffer
    }
    /*
    sendGplusToken(socialtoken, version, accessTokenSen) {
                this.sendAccessToken(socialtoken, version, accessTokenSent, 4);
            },   
    sendFbTokenn(socialtoken, version, accessTokenSen) {
                this.sendAccessToken(socialtoken, version, accessTokenSent, 2);
            },               
    sendAccessToken(socialtoken, version, accessTokenSent, options, oW) {
            if (accessTokenSent) {
                return;
            }
            if (!oW) {
                oW = 102;
            }
            const curr = socialtoken.length;
            const count = version.length;
			let writer = new Writer();
            data = [oW, 8, 1, 18];
            writer.writeUint32(data, curr + count + 23);
            data.push(8, 10, 82);
            writer.writeUint32(data, curr + count + 18);
            data.push(8, options, 18, count + 8, 8, 5, 18, count);
            for (var length = 0; length < count; length++) {
                data.push(version.charCodeAt(length));
            }
            data.push(24, 0, 32, 0, 26);
            writer.writeUint32(data, curr + 3);
            data.push(10);
            writer.writeUint32(data, curr);
            for (length = 0; length < curr; length++) {
                data.push(socialtoken.charCodeAt(length));
            }
            data = new Uint8Array(data);
            return data.buffer
        }     
        */           
}
