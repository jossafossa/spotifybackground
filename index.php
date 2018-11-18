<?php 
		// api settings
		$client_id = 'f8c1676b7739450daf60050339b297b5';
		$client_secret = '6fa89bf4e01243d38414cee037b074e0';
		$redirect_uri = 'https://slightlyshifted.nl/spotifybackground/';
		$scope = [
			"user-read-email", 
			"user-read-currently-playing", 
			"user-read-playback-state",
			"user-modify-playback-state",
			"user-read-recently-played"
		];
		$scope = join("%20", $scope); // convert array to querystring
		/////////////////////////////////////////////////////////////////////////
		// GET CODE
		/////////////////////////////////////////////////////////////////////////
		if ( !isset( $_GET["code"]) ) {
			header("Location: https://accounts.spotify.com/authorize?client_id={$client_id}&redirect_uri={$redirect_uri}&scope={$scope}&response_type=code");
		} else {
			$code = $_GET["code"];
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
	?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="x-ua-compatible" content="IE=edge">
	<meta charset="UTF-8">
	<title>spotify background</title>
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
	<link href="styles/main.css" rel="stylesheet" type="text/css"></link>
	<meta name="viewport" content="width=device-width, initial-scale=.8, maximum-scale=.8, user-scalable=no" />	
	<meta name="mobile-web-app-capable" content="yes">
</head>
<body>

	<div class="background"></div>
  	<div class="container-wrapper">
  		<div class="container">	
			<div class="image" style="width:640px; height:640px"></div>
			<h1 class="title"></h1>		
			<div class="play-this"><h2 class="artist"></h2><div class="play-button"><i class="fa fa-play"></i></div></div>
			<div class="play-this"><h2 class="album"></h2><div class="play-button"><i class="fa fa-play"></i></div></div>
		</div>
  	</div>
	
	<div class="controls">
		<div class="shuffle button small"><i class="fas fa-random"></i></div>
		<div class="prev button"><i class="fa fa-angle-left"></i></div>
		<div class="pause button"><i class="fa fa-play"></i></div>
		<div class="next button"><i class="fa fa-angle-right"></i></div>
		<div class="repeat button small"><i class="fas fa-redo-alt"></i></div>
	</div>

	<div class="timeline">
		<div class="time">	
				<div class="from"></div>
				<div class="to"></div>
		</div>
		<div class="timeline-bar"></div>
	</div>

	<div class="refresh button"><i class="fa fa-sync"></i></div>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script src="scripts/main.js"> </script>
</body>
</html>