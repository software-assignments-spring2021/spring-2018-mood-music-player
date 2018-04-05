(function() {
    
	var module = angular.module('smoodifyApp');

	module.factory('SpotifyAPI', function($q, $http, $cookies) {

		var baseUrl = 'https://api.spotify.com/v1';
		var msToMS = function(ms) {
			var minutes = Math.floor(ms / 60000);
  			var seconds = ((ms % 60000) / 1000).toFixed(0);
  			return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		}

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

			toggleShuffle: function() {
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

			getTracks: function() {
				var allTracks = [];
				$http.get(baseUrl + '/me/tracks?limit=50', {
					headers: {
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).then(function(data) {
					if (data.items) {
						data.items.forEach((ele) => {
							ele.track.duration = msToMS(ele.track.duration_ms);
							allTracks.push(ele.track);
						});
					}
					var songsLeft = data.data.total;
					for (var offset = 0; offset <= songsLeft; offset = offset + 50) {
						$http.get(baseUrl + '/me/tracks?offset=' + offset + '&limit=50', {
							headers: {
								'Authorization': 'Bearer ' + $cookies.token
							}
						}).success(function(data) {
							if (data.items) {
								data.items.forEach((ele) => {
									ele.track.duration = msToMS(ele.track.duration_ms);
									allTracks.push(ele.track);
								});
							}
						}).error(function(/* data */){
							console.log('offset', offset, 'broke');
						});
					}
				});
				return allTracks;
			},

			getAlbums: function() {
				var allAlbums = [];
				$http.get(baseUrl + '/me/albums?limit=50', {
					headers: {
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).then(function(data) {
					if (data.items) {
						data.items.forEach((ele) => {
							allAlbums.push(ele.album);
						});
					}
					var songsLeft = data.data.total;
					for (var offset = 0; offset <= songsLeft; offset = offset + 50) {
						$http.get(baseUrl + '/me/albums?offset=' + offset + '&limit=50', {
							headers: {
								'Authorization': 'Bearer ' + $cookies.token
							}
						}).success(function(data) {
							if (data.items) {
								data.items.forEach((ele) => {
									allAlbums.push(ele.album);
								});
							}
						}).error(function(/* data */){
							console.log('offset', offset, 'broke');
						});
					}
				});
				return allAlbums;
			},

			getPlaylists: function() {
				var allPlaylists = [];
				$http.get(baseUrl + '/me/playlists?limit=50', {
					headers: {
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).then(function(data) {
					if (data.items) {
						data.items.forEach((ele) => {
							allPlaylists.push(ele);
						});
					}
					var songsLeft = data.data.total;
					for (var offset = 0; offset <= songsLeft; offset = offset + 50) {
						$http.get(baseUrl + '/me/playlists?offset=' + offset + '&limit=50', {
							headers: {
								'Authorization': 'Bearer ' + $cookies.token
							}
						}).success(function(data) {
							if (data.items) {
								data.items.forEach((ele) => {
									allPlaylists.push(ele);
								});
							}
						}).error(function(/* data */){
							console.log('offset', offset, 'broke');
						});
					}
				});
				return allPlaylists;
			}
		};
	});
})();