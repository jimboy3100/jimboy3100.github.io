var region2search = "BR-Brazil";
var gamemode2search = "experimental";
function getInfo2() {
    $.ajax({
        type: "GET",
        url: "https://agarlist.alien.moe/graphql?query={serverList(length:5,region:%20%22"+region2search+"%22,mode:%22"+gamemode2search+"%22)%20{%20addr,%20lastChecked%20}}",
        datatype: "json",
        success: function(info) {
            //$("#currentRegion").html($('#region').val());
			servers=info.data.serverList;
			for (var player = 0; player < servers.length; player++) {
				console.log(servers[player].addr);
				var lastchecked=servers[player].lastChecked;
				console.log(servers[player].lastChecked);
				a=("Hours: " + new Date(Date.now()-lastchecked).getHours() + " Minutes: "+new Date(Date.now()-lastchecked).getMinutes()) + " Seconds: "+new Date(Date.now()-lastchecked).getSeconds()+" ago"
				
				
			}

        }
    });
}					
