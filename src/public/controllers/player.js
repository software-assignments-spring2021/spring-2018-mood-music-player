(function() {

	var module = angular.module('smoodifyApp');

	module.controller('PlayerController', function($scope, PlayerAPI, SpotifyAPI, $http, $cookies, $rootScope, DatabaseService) {
		/* created spotify web sdk playback code into a ng-click function called by clicking a temp button in main.html */
		if ($rootScope.player === undefined) {
			PlayerAPI.initialize().then(function(player) {
				$rootScope.player = player;
			});

			SpotifyAPI.getTracks().then(function(allTracks) {
				for (var i = 0; i < allTracks.length; i++) {
					console.log("inside allTracks");
					var artists = allTracks[i].artists.map(function(a) {
						return {
							name: a.name,
							spotify_id: a.id,
							spotify_uri: a.uri
						}
					});		// artists array
					var album = {
						name: allTracks[i].album.name,
						images: allTracks[i].album.images,
						spotify_id: allTracks[i].album.id,
						spotify_uri: allTracks[i].album.uri
					} // album object
					var song = {
						name: allTracks[i].name,
						artist: artists,
						album: album,
						id: allTracks[i].id,
						uri: allTracks[i].uri,
						duration_ms: allTracks[i].duration_ms
					}
					DatabaseService.newSong(song).then(function(d) {
						// console.log(d.data);
					});

					$rootScope.songs = allTracks
				};
			});

			SpotifyAPI.getAlbums().then(function(data) {
				$rootScope.albums = data;
			});

			SpotifyAPI.getTopArtists().then(function(data) {
				$rootScope.artists = data;
			});

			SpotifyAPI.getTopTracks().then(function(data) {
				$rootScope.top_tracks = data;
			});

			SpotifyAPI.getUserProfile().then(function(data) {
				$rootScope.user_data = data;
			});
		}


		// Error handling
		// $scope.player.addListener('initialization_error', ({ message }) => { console.error(message); });
		// $scope.player.addListener('authentication_error', ({ message }) => { console.error(message); });
		// $scope.player.addListener('account_error', ({ message }) => { console.error(message); });
		// $scope.player.addListener('playback_error', ({ message }) => { console.error(message); });

		// Playback status updates
		// $scope.player.addListener('player_state_changed', state => { console.log(state.shuffle); });

		/* Play a song. Trigger this function when play button is pressed */
		$scope.play = function() {
			PlayerAPI.getPlayerState().then(function(data) {
				if (data.is_playing === true) {
					PlayerAPI.pause();
				} else {
					PlayerAPI.play().then(function(data) {
						PlayerAPI.getCurrentlyPlaying().then(function(data) {
							console.log(data);
							$rootScope.currentlyPlaying = {
								'imgSrc': data.item.album.images[0].url,
								'songTitle': data.item.name,
								'artistName': data.item.artists[0].name,
								'albumName': data.item.album.name
							}
						});
					});
				}
			});
		};

		/* Go back to previous song. Trigger this function when previous button is clicked */
		$scope.previous = function() {      
			PlayerAPI.playPrevious().then(function() {
				PlayerAPI.delay().then(function() {
					PlayerAPI.getCurrentlyPlaying().then(function(data) {
						$rootScope.currentlyPlaying = {
							'imgSrc': data.item.album.images[0].url,
							'songTitle': data.item.name,
							'artistName': data.item.artists[0].name,
							'albumName': data.item.album.name
						}
					});
				});
			});
		};

		/* Skip song. Trigger this function when skip button is pressed */
		$scope.skip = function() {
			PlayerAPI.playNext().then(function() {
				PlayerAPI.delay().then(function() {
					PlayerAPI.getCurrentlyPlaying().then(function(data) {
						$rootScope.currentlyPlaying = {
							'imgSrc': data.item.album.images[0].url,
							'songTitle': data.item.name,
							'artistName': data.item.artists[0].name,
							'albumName': data.item.album.name
						}
					});
				});
			});
		};

		/* TODO Fix. Currently not working */
		$scope.mute = function() {
			if ($scope.vol !== 0) {
				PlayerAPI.setVolume($scope.vol);
			} else {
				PlayerAPI.setVolume(0);
			}
		};

		/* Make setVolume parameter to the value you get from volume bar */
		$scope.setVolume = function() {
			PlayerAPI.setVolume($scope.vol);
		};

		$scope.shuffle = function() {
			PlayerAPI.getPlayerState().then(function(data){
				console.log(data.shuffle_state);
				PlayerAPI.toggleShuffle(data.shuffle_state);
			});
		};

		$scope.playSong = function(song_uri) {
			PlayerAPI.playClickedSong(song_uri).then(function() {
				PlayerAPI.delay().then(function() {
					PlayerAPI.getCurrentlyPlaying().then(function(data) {
						$rootScope.currentlyPlaying = {
							'imgSrc': data.item.album.images[0].url,
							'songTitle': data.item.name,
							'artistName': data.item.artists[0].name,
							'albumName': data.item.album.name
						}
					});
				});
			});
		};

		$scope.playAlbum = function(context_uri, total_tracks) {
			PlayerAPI.playContext(context_uri, total_tracks).then(function() {
				PlayerAPI.delay().then(function() {
					PlayerAPI.getCurrentlyPlaying().then(function(data) {
						$rootScope.currentlyPlaying = {
							'imgSrc': data.item.album.images[0].url,
							'songTitle': data.item.name,
							'artistName': data.item.artists[0].name,
							'albumName': data.item.album.name
						}
					});
				});
			});
		};
	});
})();
