module.exports = {
    rotateMessageKey(key){
        key = Math.imul(key, 1540483477) | 0
        key = (Math.imul(key >>> 24 ^ key, 1540483477) | 0) ^ 114296087
        key = Math.imul(key >>> 13 ^ key, 1540483477) | 0
        return key >>> 15 ^ key
    },
    rotateMessageBytes(message, key){
        for(let i = 0; i < message.byteLength; i++) message.writeUInt8(message.readUInt8(i) ^ key >>> (i % 4 * 8) & 255, i)
        return message
    },
    uncompressMessage(input, output){ // https://github.com/pierrec/node-lz4/blob/master/lib/binding.js
        for(let i = 0, j = 0, n = input.length; i < n;){
            const token = input[i++]
            let literalsLength = token >> 4
            if(literalsLength > 0){
                let length = literalsLength + 240
                while(length === 255){
                    length = input[i++]
                    literalsLength += length
                }
                const end = i + literalsLength
                while(i < end) output[j++] = input[i++]
                if(i === n) return output
            }
            const offset = input[i++] | (input[i++] << 8)
            if(offset === 0 || offset > j) return -(i - 2)
            let matchLength = token & 15
            let length = matchLength + 240
            while(length === 255){
                length = input[i++]
                matchLength += length
            }
            let pos = j - offset
            const end = j + matchLength + 4
            while(j < end) output[j++] = output[pos++]
        }
        return output
    }
}
