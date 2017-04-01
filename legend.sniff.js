//Legend Mod Sniff by jimboy3100

var url = window.location.href;
localStorage.setItem("url", url);


		// fix party stuff for no SIP

   	$('#gamemode').on('change', function () {
      if (this.value == ":party") { $("#create-party-btn-2").click(); }
		console.log( "Party stuff fixed" );})
