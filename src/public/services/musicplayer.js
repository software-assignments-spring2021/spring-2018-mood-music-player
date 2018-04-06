(function() {

	var module = angular.module('smoodifyApp');

	module.factory('PlayerAPI', function($q, $http, $cookies) {

		var baseUrl = 'https://api.spotify.com/v1';

		return {
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
				var data = {

				};
				$http.put(baseUrl + '/me/player/shuffle?state=' + shuffle, JSON.stringify(data), {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(r){
					ret.resolve(r);
				});
				return ret.promise;
			},

			playClickedSong: function() {
				var ret = $q.defer();
				var data = {
					context_uri: [song_uri]
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
		};
	});
})();