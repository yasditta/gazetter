<?php

	$url='https://aerodatabox.p.rapidapi.com/airports/search/location/' . $_REQUEST['lat'] . '/'. $_REQUEST['lng'] .'/km/500/15?withFlightInfoOnly=true';
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
		'x-rapidapi-host: aerodatabox.p.rapidapi.com',
		'x-rapidapi-key: ***',
        'Content-Type: application/json; charset=UTF-8'
	]);
	curl_setopt($ch, CURLOPT_URL, $url);

	$result=curl_exec($ch);
	$err = curl_error($ch);
	curl_close($ch);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		$decode = json_decode($result, true);
		echo json_encode($decode); 
	}	

?>




