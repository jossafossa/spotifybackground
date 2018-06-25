<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>spotify background</title>
	<link href="styles/main.css" rel="stylesheet" type="text/css"></link>
</head>
<body>

	<svg height="110" width="110">
  <defs>
    <filter id="f1" x="0" y="0">
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
    </filter>
  </defs>
</svg>
  
	<div class="background"></div>
	<div class="container">	
		<div class="image" style="width:640px; height:640px"></div>
		<h1 class="title"></h1>		
		<h2 class="artist"></h2>
	</div>


	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	<script>

		$(document).ready(function() {

			var image = $('.image');
			var bg = $('.background');
			var title = $('.title');
			var artist = $('.artist');

			// Get the hash of the url
			const hash = window.location.hash
			.substring(1)
			.split('&')
			.reduce(function (initial, item) {
			  if (item) {
			    var parts = item.split('=');
			    initial[parts[0]] = decodeURIComponent(parts[1]);
			  }
			  return initial;
			}, {});
			window.location.hash = '';

			// Set token
			let _token = hash.access_token;

			const authEndpoint = 'https://accounts.spotify.com/authorize';

			// Replace with your app's client ID, redirect URI and desired scopes
			const clientId = 'f8c1676b7739450daf60050339b297b5';
			const redirectUri = 'http://localhost/spotifybackground/';
			const scopes = [
				"user-read-email", 
				"user-read-currently-playing", 
				"user-read-playback-state"
			];

			// If there is no token, redirect to Spotify authorization
			if (!_token) {
			  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
			}

			console.log(_token);

			

			timer = setInterval(function() {
				getMyCurrentTrack();
			}, 1000)

			function getMyCurrentTrack() {
				$.ajax({
				   url: 'https://api.spotify.com/v1/me/player/currently-playing',
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
				   		cover = response['item']['album']['images'][0]['url'];
				   		titleText = response['item']['name'];
				   		artistText = response['item']['artists'][0]['name'];
				       	console.log(response);
				       	image.css({"background-image":"url('" + cover + "')"});
				       	bg.css({"background-image":"url('" + cover + "')"});
				       	title.text(titleText);
				       	artist.text(artistText);
				   }
				});
			};
			
		})

	</script>


	
</body>
</html>