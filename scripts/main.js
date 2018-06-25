// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
if (!Array.prototype.reduce) {
  Object.defineProperty(Array.prototype, 'reduce', {
    value: function(callback /*, initialValue*/) {
      if (this === null) {
        throw new TypeError( 'Array.prototype.reduce ' + 
          'called on null or undefined' );
      }
      if (typeof callback !== 'function') {
        throw new TypeError( callback +
          ' is not a function');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0; 

      // Steps 3, 4, 5, 6, 7      
      var k = 0; 
      var value;

      if (arguments.length >= 2) {
        value = arguments[1];
      } else {
        while (k < len && !(k in o)) {
          k++; 
        }

        // 3. If len is 0 and initialValue is not present,
        //    throw a TypeError exception.
        if (k >= len) {
          throw new TypeError( 'Reduce of empty array ' +
            'with no initial value' );
        }
        value = o[k++];
      }

      // 8. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kPresent be ? HasProperty(O, Pk).
        // c. If kPresent is true, then
        //    i.  Let kValue be ? Get(O, Pk).
        //    ii. Let accumulator be ? Call(
        //          callbackfn, undefined,
        //          « accumulator, kValue, k, O »).
        if (k in o) {
          value = callback(value, o[k], k, o);
        }

        // d. Increase k by 1.      
        k++;
      }

      // 9. Return accumulator.
      return value;
    }
  });
}


$(document).ready(function() {

			var image = $('.image');
			var bg = $('.background');
			var bg2 = $('#svg-image');
			var title = $('.title');
			var artist = $('.artist');

			// set correct bg size
			// bg2.attr("width", window.innerWidth );
			// bg2.attr("height", window.innerHeight );
			// $("#svg-image-blur").attr("height", window.innerHeight );
			// $("#svg-image-blur").attr("width", window.innerWidth );

			// bg2.attr("y", -((window.innerWidth - window.innerHeight) / 2));

			// Get the hash of the url
			var hash = window.location.hash
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
			var _token = hash.access_token;

			var authEndpoint = 'https://accounts.spotify.com/authorize';

			// Replace with your app's client ID, redirect URI and desired scopes
			var clientId = 'f8c1676b7739450daf60050339b297b5';
			var redirectUri = 'https://slightlyshifted.nl/spotifybackground/';
			var scopes = [
				"user-read-email", 
				"user-read-currently-playing", 
				"user-read-playback-state",
				"user-modify-playback-state"
			];

			// If there is no token, redirect to Spotify authorization
			if (!_token) {
			  window.location = "" + authEndpoint + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=" + scopes.join('%20') + "&response_type=token";
			}

			console.log(_token);

			
			getMyCurrentTrack();

			timer = setInterval(function() {
				getMyCurrentTrack();
			}, 1000)
			var playing;

			function getMyCurrentTrack() {
				$.ajax({
				   url: 'https://api.spotify.com/v1/me/player/currently-playing',
				   headers: {
				       'Authorization': 'Bearer ' + _token
				   },
				   success: function(response) {
				   		cover = response['item']['album']['images'][0]['url'];
				   		coverSmall = response['item']['album']['images'][0]['url'];
				   		titleText = response['item']['name'];
				   		artistText = response['item']['artists'][0]['name'];

				       	playing = response["is_playing"];
				       	if (playing == true) {
				   				$('.pause i').attr("class","fa fa-pause");	
				       	} else {				       		
				   				$('.pause i').attr("class","fa fa-play");	
				       	}
				       	console.log(response);
				       	image.css({"background-image":"url('" + cover + "')"});
				       	bg.css({"background-image":"url('" + coverSmall + "')"});
				       	bg2.attr({"href":coverSmall});
				       	title.text(titleText);
				       	artist.text(artistText);
				   }
				});
			};

			$(".next").on("click", function() {nextTrack()});
			$(".prev").on("click", function() {prevTrack()});
			$(".pause").on("click", function() {
				if (playing) {
					pauseTrack();
					playing = false;
				} else {
					playTrack();
					playing = true;
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
			
		})