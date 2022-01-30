var players = {};

exports.update = function(state)
{
    players[state.id] = state.data;
    players[state.id].updated_at = new Date();
};

exports.list = function()
{
    return JSON.stringify(players);
};
