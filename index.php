<?php 

error_reporting(E_ALL | E_WARNING | E_NOTICE);
ini_set('display_errors', TRUE);

		function console_log($data) {
			echo "<script>console.log('{$data}')</script>";
		}

		function p_print($data) {
			echo "<pre>";
			print_r($data);
			echo "</pre>";
		}

		// api settings
		$client_id = 'f8c1676b7739450daf60050339b297b5';
		$client_secret = '6fa89bf4e01243d38414cee037b074e0';
		$redirect_uri = 'https://slightlyshifted.nl/spotifybackground/';
		$scope = [
			"user-read-email", 
			"user-read-currently-playing", 
			"user-read-playback-state",
			"user-modify-playback-state"
		];
		$scope = join("%20", $scope); // convert array to querystring

		/////////////////////////////////////////////////////////////////////////
		// GET CODE
		/////////////////////////////////////////////////////////////////////////
		if ( !isset( $_GET["code"]) ) {
			// console_log("getting code");

			flush();
			header("Location:https://accounts.spotify.com/authorize?client_id=" . $client_id . "&redirect_uri=" . $redirect_uri . "&scope=" . $scope . "&response_type=code",  true,  301 );
			exit();
		} else {
			$code = $_GET["code"];
			// console_log("code=" . $_GET["code"]);
		}


		/////////////////////////////////////////////////////////////////////////
		// GET ACCESS TOKEN
		/////////////////////////////////////////////////////////////////////////


		$token_url = "https://accounts.spotify.com/api/token";

		$body = array(
			"grant_type" => "authorization_code",
		  "code" => $code,
		  "redirect_uri" => $redirect_uri,
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
		$refresh_token = $result->refresh_token;
		$expires_in = $result->expires_in;
		// p_print($result);

		// set the accesstoken as js variable
		echo "<script> var _token ='{$token}', _refresh_token = '{$refresh_token}', _expires_in = '{$expires_in}';</script>";







 ?><!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="x-ua-compatible" content="IE=edge">
	<meta charset="UTF-8">
	<title>spotify background</title>
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
	<link href="styles/main.css" rel="stylesheet" type="text/css"></link>
</head>
<body>

<svg id="svg-image-blur" class="background">
    <image x="0" y="0" width="100%" height="100%" id="svg-image" filter="url(#blur-effect-1)" href="" preserveAspectRatio="xMaxYMid slice"/>

    <filter id="blur-effect-1">
        <feGaussianBlur stdDeviation="20" />
    </filter>
</svg> 
  
	<div class="container">	
		<div class="image" style="width:640px; height:640px"></div>
		<h1 class="title"></h1>		
		<h2 class="artist"></h2>
	</div>
	<div class="controls">
		<div class="prev button"><i class="fa fa-angle-left"></i></div>
		<div class="pause button"><i class="fa fa-play"></i></div>
		<div class="next button"><i class="fa fa-angle-right"></i></div>
	</div>

	<div class="timeline">
		<div class="timeline-bar"></div>
	</div>

	<div class="refresh button"><i class="fa fa-sync"></i></div>





	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script src="scripts/main.js"> </script>

</body>
</html>