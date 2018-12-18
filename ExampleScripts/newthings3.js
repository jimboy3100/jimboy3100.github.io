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
				var hourschecked = new Date(Date.now()-lastchecked).getHours()-2;
				var minuteschecked = new Date(Date.now()-lastchecked).getMinutes();
				var secondachecked = new Date(Date.now()-lastchecked).getSeconds();
				var resulttime;				
				if (hourschecked==0){
					if (minuteschecked==0){
							resulttime=("Seconds: "+ secondachecked + " ago");
					}
					else{
						resulttime=("Minutes: "+ minuteschecked + " Seconds: "+ secondachecked + " ago");
					}
				}
				else{
					resulttime=("Hours: " + hourschecked + " Minutes: "+ minuteschecked + " Seconds: "+ secondachecked + " ago");
				}
				console.log(resulttime);				
			}

        }
    });
}	











<select id="backgroundPic" class="form-control" onchange="changePicFun();" required="" data-original-title="" title="" style="bottom: 85px; position: fixed; pointer-events: auto; color: rgb(255, 255, 255);width: 50%; text-shadow: rgb(0, 0, 0) 0.3px 0.3px; font-size: small; border: none; display: inline-block; background-color: transparent; color: rgb(171, 171, 171); text-transform: capitalize;">
<option value="1" data-itr="">Minimap</option><option value="2" data-itr="">Leaderboard</option><option value="3" data-itr="">Teamboard</option><option value="4" data-itr="">Main Canvas</option><option value="5" data-itr="">Main Banner</option></select>



<select id="note3" class="form-control main-color note" style="display: inline-block; position: relative; width: 40%; height: 20px; pointer-events: auto;background: transparent; border: none; border-bottom: 1px solid; margin-left: 10px; text-align: center; border-color: darkgrey;">         <option selected value="" data-itr="page_region_select"></option>
         <option value="US-Atlanta" data-itr="page_region_north_america"></option>
         <option value="BR-Brazil" data-itr="page_region_south_america"></option>
         <option value="EU-London" data-itr="page_region_europe"></option>
         <option value="RU-Russia" data-itr="page_region_russia"></option>
         <option value="TK-Turkey" data-itr="page_region_turkey"></option>
         <option value="JP-Tokyo" data-itr="page_region_east_asia"></option>
         <option value="CN-China" data-itr="page_region_china"></option>
         <option value="SG-Singapore" data-itr="page_region_oceania"></option></select>
		 
			$("#statsInfo").remove();	 
        $("#overlays-hud").prepend('<div id="statsInfo" class="main-color" style="pointer-events: auto;display: none;font-size: 13px;margin-top: 3px;float: left;font-weight: 700;background-color: rgba(0, 0, 0, 0.2);padding: 3px;border-radius: 4px;width: 65%;height: 24px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 85px;position: fixed;pointer-events: auto;color: #ffffff;"><p style="float: left;margin-left: 10px;">'+
			'<i class="fa fa-search retro"></i><span id="notesRegion">Region: </span><span id="currentRegion" data-toggle="tooltip" data-placement="top" data-original-title style="display: inline-block;">"The region you are searching"></span>'+
			'<select id="note3" class="form-control main-color note" style="display: inline-block; position: relative; width: 100px; height: 20px; pointer-events: auto;background: transparent; border: none; border-bottom: 1px solid; margin-left: 10px; text-align: center; border-color: darkgrey;">         <option selected value="" data-itr="page_region_select"></option>'+
         '<option value="US-Atlanta" data-itr="page_region_north_america"></option>'+
         '<option value="BR-Brazil" data-itr="page_region_south_america"></option>'+
         '<option value="RU-Russia" data-itr="page_region_russia"></option>'+
         '<option value="TK-Turkey" data-itr="page_region_turkey"></option>'+
         '<option value="JP-Tokyo" data-itr="page_region_east_asia"></option>'+
         '<option value="CN-China" data-itr="page_region_china"></option>'+
         '<option value="SG-Singapore" data-itr="page_region_oceania"></option></select>'+			
			'</p>'+
			'<p style="float: right; margin-right: 10px;"><span id="notesServer">Servers: </span><span id="numServers"></span> (<span id="pps"></span> <span data-toggle="tooltip" data-placement="top" data-original-title="Players per server">PPS</span>)</p>'+
			'<p style="float: right;margin-right: 100px;"><span id="notesPlayers">Players: </span><span id="numPlayers"></span> / <span id="totalPlayers"  data-toggle="tooltip" data-placement="top" data-original-title="Total players online"></span></p></div>' +
            '<div id="searchHud" class="hud" style="width: 65%; height: 60px; z-index: 15; margin: auto; top: 0; right: 0; left: 0; bottom: 0; position: fixed;">' +
            '<div id="" style="margin-top: 10px;">' +
            '<input id="searchInput" class="form-control" title="" placeholder="Enter friend\'s token, IP, leaderboard, name or clan tag..." style="pointer-events: auto;margin-bottom: 10px;float: left;width: 80% !important;text-align: center;">' +
            '<button id="searchBtn" class="btn btn-copy-token copy-party-token btn-primary" data-toggle="tooltip" data-placement="bottom" data-original-title="Cancel search" style="pointer-events: auto;margin-bottom:10px;width: 15%;"><span id="searchSpan"><i class="fa fa-search"></i></span></button>' +
            '<button id="closeBtn" class="btn btn-copy-token copy-party-token" data-toggle="tooltip" style="pointer-events: auto;color: #ffffff;margin-bottom:10px;width: 10%; background-color: transparent;" data-placement="right" data-original-title="Close" title=""><i class="fa fa-window-close fa-2"></i></button>' +
            '</div></div>'
        );		


