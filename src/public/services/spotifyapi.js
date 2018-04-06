(function() {
    
	var module = angular.module('smoodifyApp');

	module.factory('SpotifyAPI', function($q, $http, $cookies) {

		var baseUrl = 'https://api.spotify.com/v1';
		var msToMS = function(ms) {
			var minutes = Math.floor(ms / 60000);
  			var seconds = ((ms % 60000) / 1000).toFixed(0);
  			return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		}

		var getTracksOffset = function(offset) {
			var ret = $q.defer();
			$http.get(baseUrl + '/me/tracks?offset=' + offset + '&limit=50', {
				headers: {
					'Authorization': 'Bearer ' + $cookies.token
				}
			}).success(function(data) {
				ret.resolve(data.items.map( (ele)  => ele.track ));
			});

			return ret.promise;
		}

		var numTracksArray = function() {
			var ret = $q.defer();
			$http.get(baseUrl + '/me/tracks', {
				headers: {
					'Authorization': 'Bearer ' + $cookies.token
				}
			}).then(function(data) {
				var arr = [];
				for (let i = 0; i < data.data.total; i = i + 50) {
					arr.push(i);
				}
				ret.resolve(arr);
			});
			return ret.promise;
		}

		var getAlbumOffset = function(offset) {
			var ret = $q.defer();
			$http.get(baseUrl + '/me/albums?offset=' + offset + '&limit=50', {
				headers: {
					'Authorization': 'Bearer ' + $cookies.token
				}
			}).success(function(data) {
				ret.resolve(data.items.map( (ele)  => ele.album ));
			});

			return ret.promise;
		}

		var numAlbumsArray = function() {
			var ret = $q.defer();
			$http.get(baseUrl + '/me/albums', {
				headers: {
					'Authorization': 'Bearer ' + $cookies.token
				}
			}).then(function(data) {
				var arr = [];
				for (let i = 0; i < data.data.total; i = i + 50) {
					arr.push(i);
				}
				ret.resolve(arr);
			});
			return ret.promise;
		}

		var getTopArtistsOffset = function(offset) {
			var ret = $q.defer();
			$http.get(baseUrl + '/me/top/artists?offset=' + offset + '&limit=50', {
				headers: {
					'Authorization': 'Bearer ' + $cookies.token
				}
			}).success(function(data) {
				ret.resolve(data.items);
			});

			return ret.promise;
		}

		var numTopArtistsArray = function() {
			var ret = $q.defer();
			$http.get(baseUrl + '/me/top/artists', {
				headers: {
					'Authorization': 'Bearer ' + $cookies.token
				}
			}).then(function(data) {
				var arr = [];
				for (let i = 0; i < data.data.total; i = i + 50) {
					arr.push(i);
				}
				ret.resolve(arr);
			});
			return ret.promise;
		}

		var getTopTracksOffset = function(offset) {
			var ret = $q.defer();
			$http.get(baseUrl + '/me/top/tracks?offset=' + offset + '&limit=50', {
				headers: {
					'Authorization': 'Bearer ' + $cookies.token
				}
			}).success(function(data) {
				ret.resolve(data.items);
			});

			return ret.promise;
		}

		var numTopTrackArray = function() {
			var ret = $q.defer();
			$http.get(baseUrl + '/me/top/tracks', {
				headers: {
					'Authorization': 'Bearer ' + $cookies.token
				}
			}).then(function(data) {
				var arr = [];
				for (let i = 0; i < data.data.total; i = i + 50) {
					arr.push(i);
				}
				ret.resolve(arr);
			});
			return ret.promise;
		}

		return {
			getTracks: function () {
				var allDeferred = $q.defer();
				numTracksArray().then(function(arr) {
					var promises = [];
					arr.map(function(i) {
						promises.push(getTracksOffset(i));
					});

					$q.all(promises).then(function(d) {
						var allTracks = [];
						d.forEach((r) => {
							Array.prototype.push.apply(allTracks, r);
						});
						allDeferred.resolve(allTracks);
					});
				});
				
				return allDeferred.promise;
			},

			getAlbums: function () {
				var allDeferred = $q.defer();
				numAlbumsArray().then(function(arr) {
					var promises = [];
					arr.map(function(i) {
						promises.push(getAlbumOffset(i));
					});

					$q.all(promises).then(function(d) {
						var allAlbums = [];
						d.forEach((r) => {
							Array.prototype.push.apply(allAlbums, r);
						});
						allDeferred.resolve(allAlbums);
					});
				});
				
				return allDeferred.promise;
			},

			getTopArtists: function () {
				var allDeferred = $q.defer();
				numTopArtistsArray().then(function(arr) {
					var promises = [];
					arr.map(function(i) {
						promises.push(getTopArtistsOffset(i));
					});

					$q.all(promises).then(function(d) {
						var allArtists = [];
						d.forEach((r) => {
							Array.prototype.push.apply(allArtists, r);
						});
						allDeferred.resolve(allArtists);
					});
				});
				
				return allDeferred.promise;
			},

			getTopTracks: function () {
				var allDeferred = $q.defer();
				numTopArtistsArray().then(function(arr) {
					var promises = [];
					arr.map(function(i) {
						promises.push(getTopTracksOffset(i));
					});

					$q.all(promises).then(function(d) {
						var allTracks = [];
						d.forEach((r) => {
							Array.prototype.push.apply(allTracks, r);
						});
						allDeferred.resolve(allTracks);
					});
				});
				
				return allDeferred.promise;
			}
		};
	});
})();