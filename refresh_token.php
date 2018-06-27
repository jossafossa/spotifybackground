<?php 
	
	// api settings
	$client_id = 'f8c1676b7739450daf60050339b297b5';
	$client_secret = '6fa89bf4e01243d38414cee037b074e0';
	$redirect_uri = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]/refresh_token.php";
	$scope = [
		"user-read-email", 
		"user-read-currently-playing", 
		"user-read-playback-state",
		"user-modify-playback-state"
	];
	$scope = join("%20", $scope); // convert array to querystring



	$token_url = "https://accounts.spotify.com/api/token";

		$body = array(
			"grant_type" => "refresh_token",
			"refresh_token" => $_GET["refresh_token"],
		  'client_id' => $client_id,
		  'client_secret' => $client_secret
		);

		$opts = array(
			'http' => array(
		    'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
		    'content' => http_build_query($body)
		  )
		);

		$context  = stream_context_create($opts);

		$result = json_decode( file_get_contents($token_url, false, $context) );

		$token = $result->access_token;

		echo json_encode($result);

 ?>