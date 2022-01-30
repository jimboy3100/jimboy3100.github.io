<?php

error_reporting(E_ALL ^ E_NOTICE);

function saveToDisk($username, $password, $data, $filename = "settings.json")
{
    $sha = md5($username . "someSecretSalt" . $password);
    $path = "data/$sha/";

    if (!file_exists($path))
        mkdir($path, 0755, true);

    file_put_contents("$path/$filename", $data);
}

function readFromDisk($username, $password, $filename = "settings.json")
{
    $sha = md5($username . "someSecretSalt" . $password);
    $path = "data/$sha/$filename";

    if (file_exists($path))
        return file_get_contents($path);

    return null;
}

function protectFromBruteForce($ipAddress)
{
    $attempts = apcu_inc($ipAddress, 1);

    if ($attempts > 30)
        throw new Exception("Error Processing Request", 400);

    apcu_store($ipAddress, $attempts, 600); // Expire cache in 10 minutes
}

try
{
    protectFromBruteForce($_SERVER['REMOTE_ADDR']);

    $username = $_SERVER['HTTP_USERNAME'];
    $password = $_SERVER['HTTP_PASSWORD'];

    if (empty($username) && empty($password))
        throw new Exception("What's up?", 200);

    if (strlen($username) < 4)
        throw new Exception("Username must be at least 4 characters", 400);

    if (strlen($password) < 8)
        throw new Exception("Password must be at least 8 characters", 400);

    if (strpbrk($password, '1234567890') === FALSE)
        throw new Exception("Password must include at least 1 numbber", 400);

    if ($_SERVER['REQUEST_METHOD'] == "GET")
    {
        $data = readFromDisk($username, $password);

        if (empty($data))
            throw new Exception("Not Found", 404);

        echo $data;
    }
    else if ($_SERVER['REQUEST_METHOD'] == "POST")
    {
        $data = file_get_contents('php://input');
        saveToDisk($username, $password, $data);
    }
}
catch (Exception $e)
{
    $protocol = $_SERVER["SERVER_PROTOCOL"];
    $code = (($e->getCode() >= 200) ? $e->getCode() : 500);
    $message = $e->getMessage();
    header("$protocol $code $message");
    echo $e->getMessage();
}
