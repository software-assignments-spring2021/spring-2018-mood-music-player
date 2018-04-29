(function() {
	var module = angular.module('smoodifyApp');

	module.factory('SpotifyAPI', function($q, $http, $cookies, MoodService) {

		var baseUrl = 'https://api.spotify.com/v1';
		var msToMS = function(ms) {
			var minutes = Math.floor(ms / 60000);
  			var seconds = ((ms % 60000) / 1000).toFixed(0);
  			return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		};

		var getTracksOffset = function(offset) {
			var ret = $q.defer();
			$http.get(baseUrl + '/me/tracks?offset=' + offset + '&limit=50', {
				headers: {
					'Authorization': 'Bearer ' + $cookies.token
				}
			}).success(function(data) {
				ret.resolve(data.items.map( (ele)  => {
					ele.track.duration = msToMS(ele.track.duration_ms);
					return ele.track;
				}));
			});

			return ret.promise;
		};

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
		};

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
		};

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
		};

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
		};

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
		};

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
		};

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
		};

		var getIds = function(songs) {
			songs = songs.map(song => song.id);
			const ids = [];
			const rem = songs.length % 100;
			let num = Math.floor(songs.length / 100);
			if (rem > 0) {
				num += 1;
			}
			for (let i = 0; i < num; i++) {
				ids.push(songs.slice(i*100, (i+1)*100 < songs.length ? (i+1)*100 : songs.length));
			}

			return ids;
		};


		var getAudioFeaturesMany = function(ids){
			var ret = $q.defer();
			$http.get(baseUrl + '/audio-features/?ids=' + ids.join(), {
				headers: {
					'Authorization': 'Bearer ' + $cookies.token
				}
			}).success(function(data) {
				ret.resolve(data);
			});
			return ret.promise;
		};


		return {
			refreshToken: function() {
				var ret = $q.defer();
				$http.get('/spotify/refresh_token?refresh_token=' + $cookies.refresh_token).success(function(data) {
					ret.resolve(data.access_token);
				});

				return ret.promise;
			},

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

			getTracksWithFeatures: function() {
				var allDeferred = $q.defer();
				this.getTracks().then(function(songs) {
					var promises = [];
					getIds(songs).forEach((ids) => {
						promises.push(getAudioFeaturesMany(ids));
					});

					$q.all(promises).then(function(d) {
						const features = {};
						for (let i = 0; i < d.length; i++) {
							for (let j = 0; j < d[i].audio_features.length; j++) {
								let song = d[i].audio_features[j];
								features[song.id] = {
									danceability: song.danceability,
									energy: song.energy,
									key: song.key,
									loudness: song.loudness,
									mode: song.mode,
									valence: song.valence,
									tempo: song.tempo
								};
							}
						}

						let allSongs = songs.map((s) => {
							var artists = s.artists.map(function(a) {
								return {
									name: a.name,
									spotify_id: a.id,
									spotify_uri: a.uri
								}
							});
							var album = {
								name: s.album.name,
								images: s.album.images,
								spotify_id: s.album.id,
								spotify_uri: s.album.uri
							};
							var song = {
								name: s.name,
								artist: artists,
								album: album,
								id: s.id,
								uri: s.uri,
								duration_ms: s.duration_ms,
								analysis: features[s.id]
							};
							return song;
						});

						MoodService.getMaxMin(allSongs);

						allDeferred.resolve(allSongs.map((s) => {
							return MoodService.getSongWithAlgoMood(s);
						}));
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
			},

			getUserProfile: function (){
				var ret = $q.defer();
				$http.get(baseUrl + '/me', {
					headers: {
						'Authorization': 'Bearer ' + $cookies.token
					}
				}).success(function(data) {
					ret.resolve(data);
				});

				return ret.promise;
			}
		};
	});
})();