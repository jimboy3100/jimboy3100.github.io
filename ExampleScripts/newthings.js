var xhttp = new XMLHttpRequest();

function post(server, username, password, data)
{
xhttp.open("POST", server, false);
xhttp.setRequestHeader("username", username);
xhttp.setRequestHeader("password", password);
xhttp.send(data);
}

post("http://lmsettings.snez.org/", "test", "test1234", "{ a: 1, b: 2, d: 4}");

var xhttp = new XMLHttpRequest();
function get(server, username, password)
{
xhttp.open("GET", server, false);
xhttp.setRequestHeader("username", username);
xhttp.setRequestHeader("password", password);
xhttp.send();
}
get("http://lmsettings.snez.org/", "test", "test1234");
var a= xhttp.response;

$("#export-settings").val();

post("http://lmsettings.snez.org/", "test", "test1234", $('#export-settings').val());

