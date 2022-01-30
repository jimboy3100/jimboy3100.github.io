var server = null;
var username = null;
var password = null;
var data = null;
var xhttp = new XMLHttpRequest();

function setData()
{
    clearResponse();
    server = document.getElementById("server").value;
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    data = document.getElementById("data").value;
}

function clearResponse()
{
    document.getElementById("status").innerHTML = "";
    document.getElementById("body").innerHTML = "";
}

function displayResponse()
{
    document.getElementById("status").innerHTML = xhttp.status;
    document.getElementById("body").innerHTML = xhttp.response;
}

function get()
{
    setData();
    xhttp.open("GET", server, false);
    xhttp.setRequestHeader("username", username);
    xhttp.setRequestHeader("password", password);
    xhttp.send();
    displayResponse();
}

function post()
{
    setData();
    xhttp.open("POST", server, false);
    xhttp.setRequestHeader("username", username);
    xhttp.setRequestHeader("password", password);
    xhttp.send(data);
    displayResponse();
}
