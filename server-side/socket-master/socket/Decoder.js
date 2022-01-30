
var decode = function(opcode, message)
{
    var data = {};

    switch (opcode)
    {
        case 30:
            data.type = "player_position";
            data.bufferLength = message.length;
            data.x = message.readInt32BE(8);
            data.y = message.readInt32BE(12);
            break;

        default:
            data.type = "unknown_opcode";
            break;
    }

    return data;
}

module.exports = { decode }
