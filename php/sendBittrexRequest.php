<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Header: Origin, Content-Type, Accept");

$curl = curl_init();

$url = $_GET['url'];

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

$result = curl_exec($curl);

curl_close($curl);

echo $result;

?>