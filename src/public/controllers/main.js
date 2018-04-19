(function(){

	var module = angular.module('smoodifyApp');

	module.controller('MainController', function($scope, $http, $cookies, $rootScope, $location, $window, PlayerAPI, SpotifyAPI, DatabaseService){
		$scope.refresh = function() {
			SpotifyAPI.refreshToken().then(function(token) {
				console.log('BEFORE:', $cookies.token);
				$cookies.token = token;
				console.log('AFTER:', $cookies.token);
			});
		};
		
		/* Play a song. Trigger this function when play button is pressed */
		$scope.play = function() {
			PlayerAPI.getPlayerState().then(function(data) {
				if (data.is_playing === true) {
					PlayerAPI.pause();
				} else {
					PlayerAPI.play().then(function(data) {
						PlayerAPI.getCurrentlyPlaying().then(function(data){
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
				PlayerAPI.toggleShuffle(data.data.shuffle_state);
			});  
		};

		$scope.playSong = function(song_uri) {
			PlayerAPI.playClickedSong();
		};

		$scope.updateSongs = function() {
			SpotifyAPI.getTracks().then(function(allTracks) {
				const current = $rootScope.current_user.saved_songs.length;
				if (allTracks.length > current) {
					for (var i = 0; i < allTracks.length - current; i++) {
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
						DatabaseService.saveSongToUser($rootScope.current_user.username, song).then(function(d) {
							$window.localStorage.setItem('user', JSON.stringify(d.data));
						});
					};
				} else {
					console.log("up to date");
					// add popup saying "everything is up to date"
				}
			});
		}
	});
    
})();

   

