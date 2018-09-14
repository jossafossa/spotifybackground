$(document).ready(function() {

			var image = $('.image');
			var bg = $('.background');
			var bg2 = $('#svg-image');
			var title = $('.title');
			var artist = $('.artist');
			var album = $('.album');
			var timeline = $('.timeline-bar');
			var refreshTimeout = 1000;

			setInterval(function() {

				$.ajax({
					method:"GET",
					url:"refresh_token.php",
					data: {
						refresh_token: _refresh_token
					},
					success: function(result) {
						data = JSON.parse(result);
						_token = data.access_token;
						console.log("refresh_token");
						console.log("/////////////////////////////////////////////////////////////");
						console.log("new token = " + _token);
						console.log("/////////////////////////////////////////////////////////////");

					},
					error: function(result) {
						console.log("errorrrrr:");						
						console.log(result);
					}
				})

			}, (_expires_in - 100) * 1000)

			// refresh button
			$('.refresh').on('click', function() {
				window.location = window.location.href.split("?")[0];
			})
			
			// set correct bg size
			// bg2.attr("width", window.innerWidth );
			// bg2.attr("height", window.innerHeight );
			// $("#svg-image-blur").attr("height", window.innerHeight );
			// $("#svg-image-blur").attr("width", window.innerWidth );

			// bg2.attr("y", -((window.innerWidth - window.innerHeight) / 2));

			// Get the hash of the url
			// var hash = window.location.hash
			// .substring(1)
			// .split('&')
			// .reduce(function (initial, item) {
			//   if (item) {
			//     var parts = item.split('=');
			//     initial[parts[0]] = decodeURIComponent(parts[1]);
			//   }
			//   return initial;
			// }, {});

			// var getUrlParameter = function getUrlParameter(sParam) {
			//     var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			//         sURLVariables = sPageURL.split('&'),
			//         sParameterName,
			//         i;

			//     for (i = 0; i < sURLVariables.length; i++) {
			//         sParameterName = sURLVariables[i].split('=');

			//         if (sParameterName[0] === sParam) {
			//             return sParameterName[1] === undefined ? true : sParameterName[1];
			//         }
			//     }
			// };




			// var authEndpoint = 'https://accounts.spotify.com/authorize';

			// // Replace with your app's client ID, redirect URI and desired scopes
			// var clientId = 'f8c1676b7739450daf60050339b297b5';
			// var clientSecret = '6fa89bf4e01243d38414cee037b074e0';
			// var redirectUri = 'http://localhost/spotifybackground/';
			// var scopes = [
			// 	"user-read-email", 
			// 	"user-read-currently-playing", 
			// 	"user-read-playback-state",
			// 	"user-modify-playback-state"
			// ];


			// // if code is not defined get a code
			// if (getUrlParameter("code") == null ) {
			// 	console.log("no code yet");
			// 	window.location = "" + authEndpoint + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=" + scopes.join('%20') + "&response_type=code";
			// } else {								
			// 	var code = getUrlParameter("code");
			// 	console.log("there is a code = " + code + ", getting access_token");
			// 	console.log(JSON.stringify({
			// 		   grant_type: "authorization_code",
			// 		   code: code,
			// 		   redirect_uri: redirectUri
			// 		 }));
			// 	$.ajax({
			// 		method: "POST",
			// 		contentType: "application/x-www-form-urlencoded",
			// 	   url: "https://accounts.spotify.com/api/token",
			// 	   headers: {
			// 	       'Authorization': 'Basic ' + clientId + ":" + clientSecret
			// 	   },
			// 	   data: {
			// 		   grant_type: "authorization_code",
			// 		   code: code,
			// 		   redirect_uri: redirectUri
			// 		 },
			// 	   success: function(response) {
			// 	   		console.log(response)
			// 	   }, 
			// 	   error: function(response) {
			// 	   	console.log("%c Error", 'color:red');
			// 	   		console.log(response);
			// 	   }
			// 	});
			// }



			

			// var _token = hash.access_token;

			// console.log(_token);

			
			getMyCurrentTrack();

			timer = setInterval(function() {	
				getMyCurrentTrack();
			}, refreshTimeout)
			var playing;
			var shuffle;
			var repeat;

			function getMyCurrentTrack() {
				$.ajax({
				   url: 'https://api.spotify.com/v1/me/player/currently-playing',
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {	
						update(response);
				   }
				});
			};

			function update(response) {

				$.ajax({
				   url: 'https://api.spotify.com/v1/me/player',
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {	
						 shuffle = response["shuffle_state"];
						 repeat = (response["repeat_state"] == "off" ? false : true );
						 console.log(repeat);
						 console.log(shuffle);

						if (shuffle) {
							$(".shuffle").addClass("active");
						} else {
							$(".shuffle").removeClass("active");
						}

						if (repeat) {
							$(".repeat").addClass("active");
						} else {
							$(".repeat").removeClass("active");
						}

				   }
				});

				cover = response['item']['album']['images'][0]['url'];
	   		coverSmall = response['item']['album']['images'][0]['url'];
	   		titleText = response['item']['name'];
	   		artistText = response['item']['artists'][0]['name'];
	   		artistUri = response['item']['artists'][0]['uri'];
	   		albumText = response['item']['album']['name'];
	   		albumUri = response['item']['album']['uri'];

	       	playing = response["is_playing"];
	       	if (playing == true) {
	   				$('.pause i').attr("class","fa fa-pause");	
	       	} else {				       		
	   				$('.pause i').attr("class","fa fa-play");	
	       	}
	       	console.log("updating");
	       	console.log(response);
	       	image.css({"background-image":"url('" + cover + "')"});
	       	bg.css({"background-image":"url('" + coverSmall + "')"});
	       	bg2.attr({"href":coverSmall});
	       	title.text(titleText);
	       	artist.text(artistText);
	       	artist.parent().attr({"url": albumUri});
	       	album.text(albumText);
	       	album.parent().attr({"url": artistUri});


	       	// timeline

	       	currentTime = response['progress_ms'];
	       	duration = response['item']['duration_ms'];
	       	progress = 100 /duration * currentTime;
	       	timeline.css({'width': progress + '%'});

	       	console.log(msToTime(currentTime));
	       	$(".from").html(msToTime(currentTime));
	       	$(".to").html(msToTime(duration - currentTime));
			}

			function msToTime(duration) {
			  var seconds = parseInt((duration / 1000) % 60),
			    minutes = parseInt(duration / (1000 * 60)),

			  minutes = (minutes < 10) ? "0" + minutes : minutes;
			  seconds = (seconds < 10) ? "0" + seconds : seconds;

			  return minutes + ":" + seconds;
			}

			$(".next").on("click", function() {nextTrack()});
			$(".prev").on("click", function() {prevTrack()});
			$(".play-button").on("click", function() {play($(this).parent().attr("url"))});
			$(".pause").on("click", function() {
				if (playing) {
					pauseTrack();
					playing = false;
				} else {
					playTrack();
					playing = true;
				}
			});

			$(".shuffle").on("click", function() {
				if (shuffle) {
					toggleShuffle(false);
				} else {
					toggleShuffle(true);
				}
			});

			$(".repeat").on("click", function() {
				if (repeat) {
					toggleRepeat("off");
				} else {
					toggleRepeat("context");
				}
			});

			function prevTrack() {
				$.ajax({
					 method: "POST",
				   url: 'https://api.spotify.com/v1/me/player/previous',
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
			        console.log(response);
				   	
				   },
				   error: function(response){
			        console.log(response);
			     }
				});
			};

			function pauseTrack() {
				$.ajax({
					 method: "PUT",
				   url: 'https://api.spotify.com/v1/me/player/pause',
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
			        console.log(response);
				   				$('.pause i').attr("class","fa fa-play");	
				   },
				   error: function(response){
			        console.log(response);
			     }
				});
			};

			function playTrack() {
				$.ajax({
					 method: "PUT",
				   url: 'https://api.spotify.com/v1/me/player/play',
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
				   				$('.pause i').attr("class","fa fa-pause");				   	
			        console.log(response);
				   },
				   error: function(response){
			        console.log(response);
			     }
				});
			};
				

			function nextTrack() {
				$.ajax({
					 method: "POST",
				   url: 'https://api.spotify.com/v1/me/player/next',
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
			        console.log(response);
				   	
				   },
				   error: function(response){
			        console.log(response);
			     }

				});
			};

			function toggleShuffle(value) {
				$.ajax({
					 method: "PUT",
				   url: 'https://api.spotify.com/v1/me/player/shuffle?state=' + value,
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
			        console.log(response);
				   	
				   },
				   error: function(response){
			        console.log(response);
			     }

				});
			};

			function toggleRepeat(value) {
				$.ajax({
					 method: "PUT",
				   url: 'https://api.spotify.com/v1/me/player/repeat?state=' + value,
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
			        console.log(response);
				   	
				   },
				   error: function(response){
			        console.log(response);
			     }

				});
			};

			function getAlbumSongs(album_url) {
				$.ajax({
					 method: "GET",
				   url: album_url,
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
			        console.log(response);
			        var tracks = response["tracks"]["items"];
			        tracksArray = {"uris" : []};

			        for (var i = 0; i < tracks.length; i++) {
			        	tracksArray["uris"].push(tracks[i]["uri"]);
			        }

			        console.log(tracksArray);
			        return tracksArray;
				   	
				   },
				   error: function(response){
			        console.log(response);
			     }

				});
			};

			function play(uri) {
				$.ajax({
					 method: "PUT",
				   url: "https://api.spotify.com/v1/me/player/play",
				   data:  JSON.stringify({"context_uri": uri}),
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
			        console.log(response);
				   	
				   },
				   error: function(response){
			        console.log(response);
			     }

				});
			};
			
		})