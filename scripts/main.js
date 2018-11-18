$(document).ready(function() {

	// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
	let vh = window.innerHeight * 0.01;
	// Then we set the value in the --vh custom property to the root of the document
	document.documentElement.style.setProperty('--vh', `${vh}px`);
	
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

				getPlayingInfo()


				
	   		
			}

			function setInfo(track) {				
				var settings = {
	   			cover: track['album']['images'][0]['url'],
					coverSmall: track['album']['images'][0]['url'],
					titleText: track['name'],
					artistText: track['artists'][0]['name'],
					artistUri: track['artists'][0]['uri'],
					albumText: track['album']['name'],
					albumUri: track['album']['uri'],
	   		}

	   		image.css({"background-image":"url('" + settings["cover"] + "')"});
       	bg.css({"background-image":"url('" + settings["coverSmall"] + "')"});
       	bg2.attr({"href":settings["coverSmall"]});
       	title.text(settings["titleText"]);
       	artist.text(settings["artistText"]);
       	artist.parent().attr({"url": settings["artistUri"]});
       	album.text(settings["albumText"]);
       	album.parent().attr({"url": settings["albumUri"]});
			}

			function saveToCookies(data) {
				settings = JSON.stringify(data)
				localStorage.setItem(settings, settings);
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

			function updatePlayingState(state) {				
				$(".controls, .timeline").removeClass("disabled");
				shuffle = state["shuffle_state"];
				repeat = (state["repeat_state"] == "off" ? false : true );
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

				playing = state["is_playing"];
       	if (playing == true) {
   				$('.pause i').attr("class","fa fa-pause");	
       	} else {				       		
   				$('.pause i').attr("class","fa fa-play");	
       	}
       	console.log("updating");
       	console.log(state);
       	


       	// timeline

       	currentTime = state['progress_ms'];
       	duration = state['item']['duration_ms'];
       	progress = 100 /duration * currentTime;
       	timeline.css({'width': progress + '%'});

       	console.log(msToTime(currentTime));
       	$(".from").html(msToTime(currentTime));
       	$(".to").html(msToTime(duration - currentTime));
			}

			function disableUI() {
				$(".controls, .timeline").addClass("disabled");
			}

			function getLatestTrack() {
				$.ajax({
					 method: "GET",
				   url: "https://api.spotify.com/v1/me/player/recently-played",
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
			        console.log(response["items"][response["items"].length - 1]);
			        setInfo(response["items"][response["items"].length - 1]["track"]);
				   	
				   },
				   error: function(response){
			        console.log(response);
			     }

				});
			};

			function getPlayingInfo() {
				$.ajax({
				   url: 'https://api.spotify.com/v1/me/player',
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {	
				   	console.log(response);
				   	if (response != undefined) {
				   		track = response["item"];
				   		setInfo(track);
				   		updatePlayingState(response);
						} else {
							getLatestTrack();
							disableUI();
						}
					}

				});
			}

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