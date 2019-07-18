module.exports = class {
    constructor(size){
        this.message = Buffer.allocUnsafe(size)
        this.byteOffset = 0
    }
    writeUint8(value){
        this.message.writeUInt8(value, this.byteOffset++)
    }
    writeInt32(value){
        this.message.writeInt32LE(value, this.byteOffset)
        this.byteOffset += 4
    }
    writeUint32(value){
        this.message.writeUInt32LE(value, this.byteOffset)
        this.byteOffset += 4
    }
    writeString(string){
        for(let i = 0; i < string.length; i++) this.writeUint8(string.charCodeAt(i))
        this.writeUint8(0)
    }
}
