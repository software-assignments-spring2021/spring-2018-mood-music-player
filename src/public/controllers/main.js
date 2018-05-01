(function() {

	var module = angular.module('smoodifyApp');

	module.controller('MainController', function($scope, $http, $cookies, $rootScope, $interval, $window, PlayerAPI, SpotifyAPI, MoodService, DatabaseService) {

		var bar = document.querySelector('#progress-bar');
		var prog_bar = document.querySelector('#progress');
		var width = 0;
		var progress_ms = 0;
		var duration_ms = 0;
		var play_button = document.querySelector('.play-button');
		var volume_bar = document.querySelector('.volume-bar');
		
		// if ($rootScope.player === undefined) {
		// 	SpotifyAPI.refreshToken().then(function(token) {
		// 		$cookies.token = token;
		// 		PlayerAPI.initialize().then(function(player) {
		// 			$rootScope.player = player;		
		// 			$rootScope.count = 0;		
		// 		});
		// 	})
		// }

		if ($rootScope.player === undefined) {
			$rootScope.count = 0;
		}

		if ($rootScope.player !== undefined) {
			$rootScope.player.setVolume(0.5);
			$rootScope.player.getCurrentState().then(state => {
				let {
					current_track,
					next_tracks: [next_track]
				} = state.track_window;

				// $rootScope.currentlyPlaying = {
				// 	'imgSrc': current_track.album.images[0].url,
				// 	'songTitle': current_track.name,
				// 	'artistName': current_track.artists[0].name,
				// 	'albumName': current_track.album.name
				// }
				/* FIX: sometimes it doesnt get updated here */
				if (state.paused == false) {
					/* if it is not paused */
					play_button.innerHTML = '<i class="far fa-pause-circle"></i>';
					$rootScope.is_playing = true;
				} else {
					/* if it is paused */
					play_button.innerHTML = '<i class="far fa-play-circle"></i>';
					$rootScope.is_playing = false;
				}
			})
		}

		
		$interval(function() {
			if ($rootScope.count > 0) {
				if ($rootScope.player === undefined) {

				} else {
					if ($rootScope.is_playing === true) {
						if (progress_ms >= (duration_ms * .25) && progress_ms < (duration_ms)) {
							$rootScope.player.getCurrentState().then(state => {
								const id = state.track_window.current_track.id;
								$rootScope.current_user.saved_songs.forEach((song) => {
									if (song.spotify_id === id) {
										$rootScope.lastSong = song;
									}
								});
								$rootScope.moodIndex = 0;
							});
						}
						$rootScope.player.getCurrentState().then(state => {
							let {
								current_track,
								next_tracks: [next_track]
							} = state.track_window;
		
							$rootScope.currentlyPlaying = {
								'imgSrc': current_track.album.images[0].url,
								'songTitle': current_track.name,
								'artistName': current_track.artists[0].name,
								'albumName': current_track.album.name
							}
							/* FIX: sometimes it doesnt get updated here */
							progress_ms = state.position;
							duration_ms = state.duration;
							width = (progress_ms / duration_ms) * 100
							// width = width + (10 / duration_ms) * 100;
							bar.style.width = width + '%';
						})
					} else {
						$rootScope.player.getCurrentState().then(state => {
							let {
								current_track,
								next_tracks: [next_track]
							} = state.track_window;
		
							$rootScope.currentlyPlaying = {
								'imgSrc': current_track.album.images[0].url,
								'songTitle': current_track.name,
								'artistName': current_track.artists[0].name,
								'albumName': current_track.album.name
							}
							/* FIX: sometimes it doesnt get updated here */
							progress_ms = state.position;
							duration_ms = state.duration;
							width = (progress_ms / duration_ms) * 100
							// width = width + (10 / duration_ms) * 100;
							bar.style.width = width + '%';
						})
					}
				}
			}
		}, 10);

		/* Make the progress bar progress */
		// $interval(function() {
		// 	if ($rootScope.is_playing === true) {
		// 		if (width >= 100) {
		// 			PlayerAPI.delay().then(function() {
		// 				$rootScope.player.getCurrentState().then(state => {
		// 					let {
		// 						current_track,
		// 						next_tracks: [next_track]
		// 					} = state.track_window;

		// 					$rootScope.currentlyPlaying = {
		// 						'imgSrc': current_track.album.images[0].url,
		// 						'songTitle': current_track.name,
		// 						'artistName': current_track.artists[0].name,
		// 						'albumName': current_track.album.name
		// 					}
		// 					duration_ms = state.duration;
		// 				})
		// 				width = 0;
		// 				bar.style.width = width + '%';
		// 			});
		// 		} else {
		// 			width = width + (10 / duration_ms) * 100;
		// 			bar.style.width = width + '%';
		// 		}
		// 	}
		// }, 10);

		/* Play a song. Trigger this function when play button is pressed */
		$scope.play = function() {
			if ($rootScope.player === undefined) {

			} else {
				var play_button = document.querySelector('.play-button');
				$rootScope.player.getCurrentState().then(state => {
					if (!state) {
						console.error('User is not playing music.');
						return;
					}
					if (state.paused === false) {
						play_button.innerHTML = '<i class="far fa-play-circle"></i>'
						$rootScope.player.pause();
						$rootScope.is_playing = false;
					} else {
						play_button.innerHTML = '<i class="far fa-pause-circle"></i>'
						$rootScope.player.resume().then(function(data) {
							$rootScope.player.getCurrentState().then(state => {
								let {
									current_track,
									next_tracks: [next_track]
								} = state.track_window;

								$rootScope.currentlyPlaying = {
									'imgSrc': current_track.album.images[0].url,
									'songTitle': current_track.name,
									'artistName': current_track.artists[0].name,
									'albumName': current_track.album.name
								}
								progress_ms = state.position;
								duration_ms = state.duration;
								progress_percent = Math.floor((progress_ms / duration_ms) * 100);
								bar.style.width = progress_percent.toString() + '%';
	
							});
						});
						$rootScope.is_playing = true;
					}
				});
			}
		};

		// /* Go back to previous song. Trigger this function when previous button is clicked */
		// $scope.previous = function() {      
		// 	$rootScope.player.previousTrack().then(() => {
		// 		width = 0;
		// 		bar.style.width = width + '%';
		// 		PlayerAPI.delay().then(function() {
		// 			$rootScope.player.getCurrentState().then(state => {

		// 				let {
		// 					current_track,
		// 					next_tracks: [next_track]
		// 				} = state.track_window;


		// 				$rootScope.currentlyPlaying = {
		// 					'imgSrc': current_track.album.images[0].url,
		// 					'songTitle': current_track.name,
		// 					'artistName': current_track.artists[0].name,
		// 					'albumName': current_track.album.name
		// 				}
		// 				duration_ms = state.duration;
		// 			});
		// 		});
		// 	});
		// };

		/* Skip song. Trigger this function when skip button is pressed */
		$scope.skip = function() {
			if ($rootScope.player === undefined ){

			} else {
				$rootScope.player.nextTrack().then(function() {
					width = 0;
					bar.style.width = width + '%';
					PlayerAPI.delay().then(function() {
						$rootScope.player.getCurrentState().then(state => {
	
							let {
								current_track,
								next_tracks: [next_track]
							} = state.track_window;
	
							
							$rootScope.currentlyPlaying = {
								'imgSrc': current_track.album.images[0].url,
								'songTitle': current_track.name,
								'artistName': current_track.artists[0].name,
								'albumName': current_track.album.name
							}
	
							duration_ms = state.duration;
						});
					});
				});
			}
		};

		/* TODO $scope.vol does not have an initial value. */
		$scope.mute = function() {
			if ($rootScope.player === undefined) {

			} else {
				volume_button = document.querySelector('.volume-mute');
				if ($scope.vol === undefined) {
					$scope.vol = 50;
				}
				$rootScope.player.getVolume().then(volume => {
					var volumeValue = volume * 100;
					if (volumeValue !== 0) {
						volume_button.innerHTML = '<i class="fas fa-volume-off"></i>'
						$rootScope.player.setVolume(0);
					} else {
						volume_button.innerHTML = '<i class="fas fa-volume-up"></i>'
						$rootScope.player.setVolume($scope.vol / 100);
					}
				})
			}
		};

		/* Make setVolume parameter to the value you get from volume bar */
		$scope.setVolume = function() {
			$rootScope.player.setVolume($scope.vol / 100);
		};

		/* Change Progress */
		$scope.setProgress = function() {
			if ($rootScope.player === undefined) {

			} else {
				PlayerAPI.getCurrentState().then(state => {
					let {
						current_track,
						next_tracks: [next_track]
					} = state.track_window;
	
					$rootScope.player.seek(state.duration * ($scope.prog / 100));
				})
			}
		}

	/*	$scope.shuffle = function() {
			PlayerAPI.getPlayerState().then(function(data){
				console.log(data.shuffle_state);
				PlayerAPI.toggleShuffle(data.shuffle_state);
			});
		}; */

		$scope.playSong = function(song_uri) {
			PlayerAPI.playClickedSong(song_uri).then(function() {
				PlayerAPI.delay().then(function() {
					$rootScope.getCurrentState().then(state => {

						let {
							current_track,
							next_tracks: [next_track]
						} = state.track_window;

						$rootScope.currentlyPlaying = {
							'imgSrc': current_track.album.images[0].url,
							'songTitle': current_track.name,
							'artistName': current_track.artists[0].name,
							'albumName': current_track.album.name
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
		
		$scope.seek = function($event) {
			if ($rootScope.player === undefined) {

			} else {
				var click_percentage = 0;
				click_percentage = duration_ms * ($event.clientX / $window.screen.width);
				width = ($event.clientX / $window.screen.width) * 100;
				bar.style.width = width + '%';
				$rootScope.player.seek(click_percentage);
			}
		};

		$scope.enlarge = function($event) {
			if ($rootScope.player === undefined) {

			} else {
				console.log($event);
				prog_bar.style.height = 10 + 'px';
				bar.style.height = 10 + 'px';
			}
		};

		$scope.shrink = function($event) {
			if ($rootScope.player === undefined) {

			} else {
				console.log($event);
				prog_bar.style.height = 5 + 'px';
				bar.style.height = 5 + 'px';
			}
		};

		$scope.refresh = function() {
			SpotifyAPI.refreshToken().then(function(token) {
				console.log('BEFORE:', $cookies.token);
				$cookies.token = token;
				console.log('AFTER:', $cookies.token);
				$rootScope.player
			});
		};
	});
})();
