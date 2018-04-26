(function() {

	var module = angular.module('smoodifyApp');

	module.controller('PlayerController', function($scope, $http, $cookies, $rootScope, $location, $interval, $window, $route, PlayerAPI, SpotifyAPI, MoodService, DatabaseService) {
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
		var count = 0;

		/* Make the progress bar progress */
		$interval(function() {
			if ($rootScope.is_playing === true) {
				if (width >= 25 && width < 100) {
					$rootScope.player.getCurrentState().then(s => {
						const id = s.track_window.current_track.id;
						$rootScope.current_user.saved_songs.forEach((song) => {
							if (song.spotify_id === id) {
								$rootScope.lastSong = song;
							}
						});
						$rootScope.moodIndex = 0;
					});
				} else if (width >= 100) {
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
						})
						width = 0;
						bar.style.width = width + '%';
					});
				} else {
					width = width + (10 / duration_ms) * 100;
					bar.style.width = width + '%';
				}
			}
		}, 10);


		$interval(function() {
			SpotifyAPI.refreshToken().then(function(token) {
				console.log('BEFORE:', $cookies.token);
				$cookies.token = token;
				console.log('AFTER:', $cookies.token);
			});
		}, 1800000);



		/* Play a song. Trigger this function when play button is pressed */
		$scope.play = function() {
			var play_button = document.querySelector('.play-button');
			$rootScope.player.getCurrentState().then(state => {
				if (!state) {
					console.error('User is not playing music.');
					return;
				}
				if (count == 0) {
					if ($rootScope.skips === undefined) {
						$rootScope.skips = 0;
					}
					$rootScope.player.seek(0).then(function() {
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
					})

					count++;
					
				} else {
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
				}
			});
		};

		/* Go back to previous song. Trigger this function when previous button is clicked */
		$scope.previous = function() {      
			$rootScope.player.previousTrack().then(() => {
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
		};

		/* Skip song. Trigger this function when skip button is pressed */
		$scope.skip = function() {
			if (!$rootScope.lastSong) {
				$rootScope.player.getCurrentState().then(s => {
					const id = s.track_window.current_track.id;
					$rootScope.current_user.saved_songs.forEach((song) => {
						if (song.spotify_id === id) {
							$rootScope.lastSong = song;
						}
					});
					$rootScope.moodIndex = 0;
					$rootScope.currentMood = $rootScope.lastSong.mood[$rootScope.moodIndex].mood;
					$rootScope.skips = 0;
				});
			}
			console.log($rootScope.currentMood);
			$rootScope.player.nextTrack().then(function() {
				var play_button = document.querySelector('.play-button');
				play_button.innerHTML = '<i class="far fa-pause-circle"></i>'
				let previousWidth = bar.style.width;
				previousWidth = parseInt(previousWidth.slice(0, previousWidth.length - 1));
				if (previousWidth < 25) {
					$rootScope.skips += 1
				}

				if ($rootScope.skips === 3) {
					$rootScope.moodIndex += 1;
					console.log($rootScope.lastSong);
					$rootScope.currentMood = $rootScope.lastSong.mood[$rootScope.moodIndex].mood;
					$rootScope.skips = 0;
					console.log($rootScope.currentMood);
				}
				console.log(previousWidth, $rootScope.skips);
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
		};

		/* TODO $scope.vol does not have an initial value. */
		$scope.mute = function() {
			volume_button = document.querySelector('.volume-mute');
			if ($scope.vol === undefined) {
				$scope.vol = 50;
			}
			$rootScope.player.getCurrentState().then(state => {
				var volume = data.device.volume_percent;
				if (volume !== 0) {
					volume_button.innerHTML = '<i class="fas fa-volume-off"></i>'
					$rootScope.player.setVolume(0);
				} else {
					volume_button.innerHTML = '<i class="fas fa-volume-up"></i>'
					$rootScope.player.setVolume($scope.vol / 100);
				}
			});
		};

		/* Make setVolume parameter to the value you get from volume bar */
		$scope.setVolume = function() {
			$rootScope.player.setVolume($scope.vol / 100);
		};

		/* Change Progress */
		$scope.setProgress = function() {
			PlayerAPI.getCurrentState().then(state => {
				let {
					current_track,
					next_tracks: [next_track]
				} = state.track_window;

				$rootScope.player.seek(state.duration * ($scope.prog / 100));
			})
		}

		$scope.shuffle = function() {
			PlayerAPI.getPlayerState().then(function(data){
				console.log(data.shuffle_state);
				PlayerAPI.toggleShuffle(data.shuffle_state);
			});
		};

		$scope.playSong = function(song) {
			count += 1
			$rootScope.currentMood = song.mood[0].mood;
			$rootScope.skips = 0;
			$rootScope.moodIndex = 0;
			console.log($rootScope.currentMood);
			var play_button = document.querySelector('.play-button');
			play_button.innerHTML = '<i class="far fa-pause-circle"></i>'
			PlayerAPI.playClickedSong(song.spotify_uri).then(function() {
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
						$rootScope.is_playing = true;
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
			width = ($event.clientX / $window.screen.width) * 100;
			bar.style.width = width + '%';
			$rootScope.player.seek(click_percentage);
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

		$scope.updateSongs = function() {
			SpotifyAPI.getTracks().then(function(allTracks) {
				const current = $rootScope.current_user.saved_songs.length;
				console.log(current);
				console.log(allTracks.length);
				if (allTracks.length > current) {
					for (var i = 0; i < allTracks.length - current; i++) {
						console.log(allTracks[i]);
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
		};

	});
})();
