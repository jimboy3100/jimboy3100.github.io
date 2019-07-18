module.exports = class {
    constructor(message){
        this.message = message
        this.byteOffset = 0
    }
    readUint8(){
        return this.message.readUInt8(this.byteOffset++)
    }
    readUint16(){
        const value = this.message.readUInt16LE(this.byteOffset)
        this.byteOffset += 2
        return value
    }
    readInt32(){
        const value = this.message.readInt32LE(this.byteOffset)
        this.byteOffset += 4
        return value
    }
    readUint32(){
        const value = this.message.readUInt32LE(this.byteOffset)
        this.byteOffset += 4
        return value
    }
    readDouble(){
        const value = this.message.readDoubleLE(this.byteOffset)
        this.byteOffset += 8
        return value
    }
    readString(){
        let string = ''
        while(true){
            const charCode = this.readUint8()
            if(charCode === 0) break
            string += String.fromCharCode(charCode)
        }
        return string
    }
}
