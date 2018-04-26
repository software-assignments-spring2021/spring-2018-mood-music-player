(function() {

	var module = angular.module('smoodifyApp');

	module.factory('PlayerAPI', function($q, $http, $cookies, $rootScope) {
		var _queue_ = [];
		var baseUrl = 'https://api.spotify.com/v1';

		return {
			initialize: function() {
				var ret = $q.defer();

				/* ReferenceError: Spotify is not defined in MainController */
				var player = new Spotify.Player({
					name: 'Smoodify',
					getOAuthToken: cb => { cb($cookies.token); },
					volume: 0.5
				});

				this.pause();


				player.connect().then(success => {
					if (success) {
						player.addListener('ready', ({ device_id }) => {
							$cookies.device = device_id;
							console.log('Ready with Device ID', device_id);
							/* Code to play from our device */
							this.switchToDevice()
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
					console.log(r);
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

			toggleShuffle: function(shuffle) {
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
			},

			playClickedSong: function(song_uri) {
				_queue_.unshift(song_uri)
				var ret = $q.defer();
				var data = {
					uris: _queue_
				};
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

			playContext: function(context_uri, total_tracks) {
				var num = Math.floor(Math.random() * total_tracks);
				console.log(num);
				var ret = $q.defer();
				var data = {
					context_uri: context_uri,
					offset: {
						position: num
					}
				};
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

			addToQueue: function(song) {
				_queue_.push(song.spotify_uri);
			},

			swap: function() {
				var ret = $q.defer();
				var data = {
					code: $cookies.token,
				};
				$http.post(baseUrl + '/swap', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).success(function(r) {
					ret.resolve(r);
				});
				return ret.promise;
			}

			
		};
	});
})();