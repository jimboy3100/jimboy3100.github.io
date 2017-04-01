//Legend Mod Sniff by jimboy3100

var url = window.location.href;
localStorage.setItem("url", url);

var searchSip = getParameterByName("sip", url);
		// fix party stuff for no SIP
		if (searchSip==null){
 	
  	$('#gamemode').on('change', function () {
      if (this.value == ":party") { $("#create-party-btn-2").click(); }
		console.log( "Party stuff fixed" );});$('#gamemode option[value=":party"]').prop('selected', 'selected').change();
		history.pushState(stateObj, "page 2", "?r=" + MC.getRegion() + "&m=" + getGameMode() + "&search=ws://" + currentIP);
}	
