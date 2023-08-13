<?php

	$url='https://newsapi.org/v2/everything?q=' . $_REQUEST['countryCapital'] . '&pageSize=10&sortBy=relevancy';
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
		'X-Api-Key: ***',
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