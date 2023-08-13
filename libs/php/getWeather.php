<?php

	$url='https://api.openweathermap.org/data/2.5/onecall?lat=' . $_REQUEST['lat'] . '&lon='. $_REQUEST['lng'] . '&exclude=current,minutely,hourly,alerts&units=metric&appid=***';
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);

	$result=curl_exec($ch);
	$err = curl_error($ch);
	curl_close($ch);	
	
	header('Content-Type: application/json; charset=UTF-8');

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		$decode = json_decode($result, true);
		$output['data'] = $decode;
		echo json_encode($output); 
	} 

?>