(function() {

	var module = angular.module('smoodifyApp');

	module.factory('PlayerAPI', function($q, $http, $cookies, $rootScope, MoodService) {
		var _queue_ = [];
		var _queue_songs_ = [];
		var baseUrl = 'https://api.spotify.com/v1';

		return {
			initialize: function() {
				var ret = $q.defer();

				/* ReferenceError: Spotify is not defined in MainController */
				var player = new Spotify.Player({
					name: 'Smoodify',
					getOAuthToken: cb => { cb($cookies.token); },
					volume: 0.0000000000000001
				});

				this.pause();


				player.connect().then(success => {
					if (success) {
						player.addListener('ready', ({ device_id }) => {
							$cookies.device = device_id;
							console.log('Ready with Device ID', device_id);
							console.log(player);
							this.switchToDevice();
						});
						ret.resolve(player);
					}
				});
				return ret.promise;
			},

			switchToDevice: function() {
				var ret = $q.defer();
				var data = {
					device_ids: [$cookies.device]
				};
				$http.put(baseUrl + '/me/player', JSON.stringify(data), {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r) {
					// console.log(r);
					ret.resolve(r);
				}).error(function(r) {
					console.log(r);
				});
				return ret.promise;
			},

			setVolume: function(volume) {
				var ret = $q.defer();
				$http.put(baseUrl + '/me/player/volume?volume_percent=' + volume, {}, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r) {
					ret.resolve(r);
				});
				return ret.promise;
			},

			setProgress: function(progress) {
				var ret = $q.defer();
				$http.put(baseUrl + '/me/player/seek?position_ms=' + progress, {}, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r) {
					ret.resolve(r);
				});
				return ret.promise;
			},

			play: function() {
				var ret = $q.defer();
				$http.put(baseUrl + '/me/player/play', {}, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r) {
					ret.resolve(r);
				});
				return ret.promise;
			},

			pause: function() {
				var ret = $q.defer();
				$http.put(baseUrl + '/me/player/pause', {}, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r) {
					ret.resolve(r);
				});
				return ret.promise;
			},

			getPlayerState: function() {
				var ret = $q.defer();
				$http.get(baseUrl + '/me/player', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r) {
					ret.resolve(r);
				});
				return ret.promise;
			},

			getCurrentlyPlaying: function() {
				var ret = $q.defer();
				$http.get(baseUrl + '/me/player/currently-playing', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r) {
					console.log(r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			playNext: function() {
				var ret = $q.defer();
				var data = {
					uris: _queue_
				};
				$http.post(baseUrl + '/me/player/next', JSON.stringify(data), {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r) {
					ret.resolve(r);
				});
				return ret.promise;
			},

			delay: function() {
				var ret = $q.defer();
				setTimeout(function(r) {
					ret.resolve(r);
				}, 1000);
				return ret.promise;
			},

			playPrevious: function() {
				var ret = $q.defer();
				var data = {

				};
				$http.post(baseUrl + '/me/player/previous', JSON.stringify(data), {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r) {
					ret.resolve(r);
				});
				return ret.promise;
			},

			/* toggleShuffle: function(shuffle) {
				var ret = $q.defer();
				if (shuffle === true) {
					$http.put(baseUrl + '/me/player/shuffle?state=' + false, {}, {
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + $cookies.token
						}
					}).success(function(r){
						ret.resolve(r);
					});
				} else {
					$http.put(baseUrl + '/me/player/shuffle?state=' + true, {}, {
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + $cookies.token
						}
					}).success(function(r){
						ret.resolve(r);
					});
				}
				return ret.promise;
			}, */

			playClickedSong: function(song) {
				_queue_.unshift(song)
				console.log(song)
				let context = _queue_.map((s) => s.spotify_uri);
				var ret = $q.defer();
				var data = {
					uris: context
				};
				console.log('Queue (play clicked): ');
				console.log(_queue_);
				$http.put(baseUrl + '/me/player/play', JSON.stringify(data), {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r) {
					ret.resolve(r);
				});
				return ret.promise;
			},

			populateQueue: function(mood, song) {
				this.clearQueue();
				if (song) {
					_queue_ = MoodService.getSongsByMood(mood, song);
				} else {
					_queue_ = MoodService.getSongsByMood(mood);
				}
			},

			clearQueue: function() {
				_queue_ = [];
			},

			getQueue: function() {
				return _queue_
			},

			nextTracks: function(n) {
				let nextTracks = [];
				_queue_.forEach((song) => {
					let newTrack = {
						uri: song.spotify_uri, // Spotify URI
						id: song.spotify_id,                // Spotify ID from URI (can be null)
						type: "track",             // Content type: can be "track", "episode" or "ad"
						media_type: "audio",       // Type of file: can be "audio" or "video"
						name: song.name,         // Name of content
						is_playable: true,         // Flag indicating whether it can be played
						album: {
							uri: song.album.spotify_uri, // Spotify Album URI
							name: song.album.name,
							images: song.album.images.map((image) => {
								return {url: image.url};
							})
						},
						artists: song.artist.map((artist) => {
							return {uri: artist.spotify_uri, name: artist.name};
						})
					}
					nextTracks.push(newTrack);
				});
				if (n) {
					return nextTracks.splice(0, n);
				} else {
					return nextTracks;
				}
			},

			dequeue: function(song) {
				if (song) {
					const ids = _queue_.map((s) => s.spotify_id);
					const index = ids.indexOf(song.id);
					if (index !== -1) {
						return _queue_.splice(index, 1)[0];
					}
				} else {
					return _queue_.splice(0, 1)[0];
				}
			},

			songsInQueue: function() {
				if (_queue_.length > 0) {
					return true;
				} else {
					return false;
				}
			}
		};
	});
})();