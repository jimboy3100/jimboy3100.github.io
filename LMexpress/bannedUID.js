var bannedUID = localStorage.getItem("bannedUID");
if (bannedUID && (bannedUID=="true" || bannedUID==true)) document.documentElement.innerHTML = "";
