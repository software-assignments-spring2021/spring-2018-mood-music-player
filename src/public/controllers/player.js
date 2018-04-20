(function() {

	var module = angular.module('smoodifyApp');

	module.controller('PlayerController', function($scope, $http, $cookies, $rootScope, $interval, $window, PlayerAPI, SpotifyAPI, MoodService, DatabaseService) {
		/* created spotify web sdk playback code into a ng-click function called by clicking a temp button in main.html */
		if ($rootScope.player === undefined) {
			PlayerAPI.initialize().then(function(player) {
				$rootScope.player = player;
			});
		}

		var bar = document.querySelector('#progress-bar');
		var prog_bar = document.querySelector('#progress');
		var width = 0;
		var progress_ms = 0;
		var duration_ms = 0;


		/* Make the progress bar progress */
		$interval(function() {
			if ($rootScope.is_playing === true) {
				if (width >= 100) {
					PlayerAPI.delay().then(function() {
						PlayerAPI.getCurrentlyPlaying().then(function(data) {
							$rootScope.currentlyPlaying = {
								'imgSrc': data.item.album.images[0].url,
								'songTitle': data.item.name,
								'artistName': data.item.artists[0].name,
								'albumName': data.item.album.name
							}
							duration_ms = data.item.duration_ms;
						});
						width = 0;
						bar.style.width = width + '%';
					});
				} else {
					width = width + (10 / duration_ms) * 100;
					bar.style.width = width + '%';
				}
			}
		}, 10);

		/* Play a song. Trigger this function when play button is pressed */
		$scope.play = function() {
			var play_button = document.querySelector('.play-button');
			PlayerAPI.getPlayerState().then(function(data) {
				if (data.is_playing === true) {
					play_button.innerHTML = '<i class="far fa-play-circle"></i>'
					PlayerAPI.pause();
					$rootScope.is_playing = false;
				} else {
					play_button.innerHTML = '<i class="far fa-pause-circle"></i>'
					PlayerAPI.play().then(function(data) {
						PlayerAPI.getCurrentlyPlaying().then(function(data) {
							console.log(data);
							$rootScope.currentlyPlaying = {
								'imgSrc': data.item.album.images[0].url,
								'songTitle': data.item.name,
								'artistName': data.item.artists[0].name,
								'albumName': data.item.album.name
							}
							progress_ms = data.progress_ms;
							duration_ms = data.item.duration_ms;
							progress_percent = Math.floor((data.progress_ms / data.item.duration_ms) * 100);
							bar.style.width = progress_percent.toString() + '%';

						});
					});
					$rootScope.is_playing = true;
				}
			});
		};

		/* Go back to previous song. Trigger this function when previous button is clicked */
		$scope.previous = function() {      
			PlayerAPI.playPrevious().then(function() {
				width = 0;
				bar.style.width = width + '%';
				PlayerAPI.delay().then(function() {
					PlayerAPI.getCurrentlyPlaying().then(function(data) {
						$rootScope.currentlyPlaying = {
							'imgSrc': data.item.album.images[0].url,
							'songTitle': data.item.name,
							'artistName': data.item.artists[0].name,
							'albumName': data.item.album.name
						}
						duration_ms = data.item.duration_ms;
					});
				});
			});
		};

		/* Skip song. Trigger this function when skip button is pressed */
		$scope.skip = function() {
			PlayerAPI.playNext().then(function() {
				width = 0;
				bar.style.width = width + '%';
				PlayerAPI.delay().then(function() {
					PlayerAPI.getCurrentlyPlaying().then(function(data) {
						$rootScope.currentlyPlaying = {
							'imgSrc': data.item.album.images[0].url,
							'songTitle': data.item.name,
							'artistName': data.item.artists[0].name,
							'albumName': data.item.album.name
						}

						duration_ms = data.item.duration_ms;
					});
				});
			});
		};

		/* TODO $scope.vol does not have an initial value. */
		$scope.mute = function() {
			volume_button = document.querySelector('.volume-mute');
			if ($scope.vol === undefined) {
				$scope.vol = 50;
			}
			PlayerAPI.getPlayerState().then(function(data) {
				var volume = data.device.volume_percent;
				if (volume !== 0) {
					volume_button.innerHTML = '<i class="fas fa-volume-off"></i>'
					PlayerAPI.setVolume(0);
				} else {
					volume_button.innerHTML = '<i class="fas fa-volume-up"></i>'
					PlayerAPI.setVolume($scope.vol);
				}
			});
		};

		/* Make setVolume parameter to the value you get from volume bar */
		$scope.setVolume = function() {
			PlayerAPI.setVolume($scope.vol);
		};

		/* Change Progress */
		$scope.setProgress = function() {
			PlayerAPI.getCurrentlyPlaying().then(function(data) {
				PlayerAPI.setProgress(data.item.duration_ms * ($scope.prog / 100));
			})
		}

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

		/* Function to seek to a part of a song */
		$scope.seek = function($event) {
			var click_percentage = 0;
			click_percentage = Math.floor(duration_ms * ($event.clientX / $window.screen.width));
			width = $event.clientX / $window.screen.width * 100;
			bar.style.width = width + '%';
			PlayerAPI.setProgress(click_percentage);
		};

		$scope.enlarge = function($event) {
			console.log($event);
			prog_bar.style.height = 10 + 'px';
			bar.style.height = 10 + 'px';
		};

		$scope.shrink = function($event) {
			console.log($event);
			prog_bar.style.height = 5 + 'px';
			bar.style.height = 5 + 'px';
		};

		$scope.refresh = function() {
			SpotifyAPI.refreshToken().then(function(token) {
				console.log('BEFORE:', $cookies.token);
				$cookies.token = token;
				console.log('AFTER:', $cookies.token);
			});
		};
	});
})();
