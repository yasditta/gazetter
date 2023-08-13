<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');



$geonamesUsername = "shrey";
$openWeatherApiKey = "7791103cd655c9df0fcae1a36f208d6d";


if (isset($_REQUEST['lat']) && isset($_REQUEST['lng'])){
    
    $lat= $_REQUEST['lat'];
    $lng= $_REQUEST['lng'];
    

    $countryCodeUri = "http://api.geonames.org/countryCodeJSON?lat=$lat&lng=$lng&username=$geonamesUsername";
    
    // get the country's name and code based on given coordinates
    $result = getData($countryCodeUri);
    
    // decode json to get the country code
    $result=json_decode($result);
    $countryCode = urlEncode($result->countryCode);


    $countryDataByCodeUri = "https://restcountries.eu/rest/v2/alpha/$countryCode";
    $countryData = getData($countryDataByCodeUri);

    echo $countryData;
}

if (isset($_REQUEST['country'])){
    $countryName = htmlspecialchars($_REQUEST['country']);
    $countryData = getData("https://restcountries.eu/rest/v2/name/$countryName");
    echo $countryData;
}

if (isset($_REQUEST['base'])){
    $base = $_REQUEST['base'];
    $exchangeRate = getData("https://api.exchangeratesapi.io/latest?base=$base");
    echo $exchangeRate;
}
if (isset($_REQUEST['location'])){
    $location = $_REQUEST['location'];
    $weatherData = getData("http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=$openWeatherApiKey&units=metric");
    echo $weatherData;
}


function getData($uri) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $uri);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // Return instead of outputing directly
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_HEADER, 0); 
    $result = curl_exec($ch);
    
   curl_close($ch);

   if ($result === false) {
       echo  "cURL Error: " . curl_error($ch);
   }else{
       return $result;
   }
}


