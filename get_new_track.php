<?php 

	require 'vendor/autoload.php';

	$session = new SpotifyWebAPI\Session(
	    'f8c1676b7739450daf60050339b297b5',
	    '6fa89bf4e01243d38414cee037b074e0',
	    'http://localhost/spotifybackground/'
	);

	$api = new SpotifyWebAPI\SpotifyWebAPI();

	if (isset($_GET['code'])) {
	    $session->requestAccessToken($_GET['code']);
	    $api->setAccessToken($session->getAccessToken());

	    print_r($api->me());
	} else {
	    $options = [
	        'scope' => [
	            'user-read-email',
	            'user-read-currently-playing',
	            'user-read-playback-state',
	            "user-read-recently-played"
	        ],
	    ];

	    header('Location: ' . $session->getAuthorizeUrl($options));
	    die();
	}

	$track = $api->getMyCurrentTrack();

	echo "<pre>";
	print_r($track);
	echo "</pre>";

	return $track;
?>