(function() {

	var module = angular.module('smoodifyApp');

	module.controller('PlayerController', function($scope, $http, $cookies, $rootScope, $location, $interval, $window, $route, $q, PlayerAPI, SpotifyAPI, MoodService, DatabaseService) {
  
  		var bar = document.querySelector('#progress-bar');
		var prog_bar = document.querySelector('#progress');
		var width = 0;
		var progress_ms = 0;
		var duration_ms = 0;
		var play_button = document.querySelector('.play-button');
    
		// /* created spotify web sdk playback code into a ng-click function called by clicking a temp button in main.html */
		// if ($rootScope.player === undefined) {
		// 	SpotifyAPI.refreshToken().then(function(token) {
		// 		$cookies.token = token;
		// 		PlayerAPI.initialize().then(function(player) {
		// 			$rootScope.player = player;
		// 			console.log($rootScope.player);
		// 			$rootScope.count = 0;	
		// 		});
		// 	})
		// }

		if ($rootScope.player !== undefined) {
			$rootScope.player.setVolume(0.5);
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

		
		
		/* pause and disconnect the player when closing tab */
		/* everything is firing except $rootScope.player.pause() */
		// $window.onbeforeunload = function(event) {

		// 	//$rootScope.player.disconnect().then(sleep(10000));

		// 	// var xhr = new XMLHttpRequest();
		// 	// xhr.open('PUT', 'https://api.spotify.com/v1/me/player/pause', false);//<-- false makes request synchronous
		// 	// xhr.setRequestHeader("Authorization", 'Bearer ' + $cookies.token);
		// 	// xhr.send();
		// 	// $rootScope.player.pause().then(function() {
		// 	// 	setTimeout(function() {
		// 	// 	}, 10000).then(function() {
		// 	// 		console.log('worked')
		// 	// 	})
		// 	// });

		// 	return 'hi';
		// }

		// function sleep(delay) {
		// 	var start = new Date().getTime();
		// 	while (new Date().getTime() < start + delay);
		// }
		

		/* Make the progress bar progress */
		$interval(function() {
			if ($rootScope.count > 0) {
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
			if ($rootScope.player === undefined) {

			} else {
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
			/* Skip song plays the next song even if the current song is paused */ 
			if ($rootScope.player === undefined) {

			} else {
				console.log('Current mood (skip): ' + $rootScope.currentMood);
				$rootScope.player.getCurrentState().then(state => {
					console.log('Dequeue (skip)');
					PlayerAPI.dequeue(state.track_window.current_track);
					let previousWidth = bar.style.width;
					previousWidth = parseInt(previousWidth.slice(0, previousWidth.length - 1));
					if (previousWidth < 25) {
						$rootScope.skips += 1
					}

					if ($rootScope.skips === 3 || !PlayerAPI.songsInQueue()) {
						$rootScope.moodIndex += 1;
						$rootScope.currentMood = $rootScope.lastSong.mood[$rootScope.moodIndex].mood;
						while (!MoodService.hasMood($rootScope.currentMood)) {
							$rootScope.moodIndex += 1;
							$rootScope.currentMood = $rootScope.lastSong.mood[$rootScope.moodIndex].mood;
							break;
						}
						$rootScope.skips = 0;
						PlayerAPI.clearQueue();
						PlayerAPI.populateQueue($rootScope.currentMood);
						$scope.playSong();
					} else {
						state.track_window.next_tracks = PlayerAPI.nextTracks();
						console.log('Last song: ' + $rootScope.lastSong.name);
						console.log('Current mood: ' + $rootScope.currentMood)
						console.log('Number of skips: ' + $rootScope.skips);
						$rootScope.player.nextTrack().then(function() {
							width = 0;
							bar.style.width = width + '%';
							PlayerAPI.delay().then(function() {
								$rootScope.player.getCurrentState().then(state => {
									let {
										current_track
									} = state.track_window;
	
									state.track_window.next_tracks = PlayerAPI.nextTracks();
									console.log(state.track_window);
									$rootScope.current_user.saved_songs.forEach((s) => {
										if (s.spotify_id === state.track_window.current_track.id) {
											console.log(s.mood.map((m) => m.mood));
										}
									});
									$rootScope.currentlyPlaying = {
										'imgSrc': current_track.album.images[0].url,
										'songTitle': current_track.name,
										'artistName': current_track.artists[0].name,
										'albumName': current_track.album.name
									}
	
									if (state.paused == false) {
										/* if it is not paused */
										play_button.innerHTML = '<i class="far fa-pause-circle"></i>';
										$rootScope.is_playing = true;
									} else {
										/* if it is paused */
										play_button.innerHTML = '<i class="far fa-play-circle"></i>';
										$rootScope.is_playing = false;
									}
	
									duration_ms = state.duration;
								});
							});
						});
					}
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
			if ($rootScope.player === undefined) {
				$rootScope.initialVolume = $scope.vol;
			} else {
				$rootScope.player.setVolume($scope.vol / 100);
			}
		};

		/* $scope.shuffle = function() {
			PlayerAPI.getPlayerState().then(function(data){
				console.log(data.shuffle_state);
				PlayerAPI.toggleShuffle(data.shuffle_state);
			});
		}; */

		$scope.playSong = function(song) {
			if (song === undefined) {
				song = PlayerAPI.dequeue();
				console.log('Dequeue (play song)');
				
			} else {
				$rootScope.lastSong = song;
				$rootScope.currentMood = song.mood[0].mood;
				// PlayerAPI.clearQueue();
				PlayerAPI.populateQueue($rootScope.currentMood, song);
				PlayerAPI.dequeue(song);
				$rootScope.skips = 0;
				$rootScope.moodIndex = 0;
			}

			console.log('Current mood (play song): ' + $rootScope.currentMood);
			var play_button = document.querySelector('.play-button');
			play_button.innerHTML = '<i class="far fa-pause-circle"></i>'
			
			/* created spotify web sdk playback code into a ng-click function called by clicking a temp button in main.html */
			if ($rootScope.player === undefined) {
				SpotifyAPI.refreshToken().then(function(token) {
					$cookies.token = token;
					PlayerAPI.initialize().then(function(player) {
						$rootScope.player = player;
						console.log($rootScope.player);
						PlayerAPI.delay().then(function() {
							PlayerAPI.playClickedSong(song).then(function() {
								width = 0;
								bar.style.width = width + '%';
								PlayerAPI.delay().then(function() {
									$rootScope.player.getCurrentState().then(state => {
										let {
											current_track
										} = state.track_window;
										state.track_window.next_tracks = PlayerAPI.nextTracks();
										console.log(state.track_window);
										console.log('song ' + current_track.name);
				
										$rootScope.currentlyPlaying = {
											'imgSrc': current_track.album.images[0].url,
											'songTitle': current_track.name,
											'artistName': current_track.artists[0].name,
											'albumName': current_track.album.name
										}
										$rootScope.count = 1;
										$rootScope.is_playing = true;
										if ($scope.vol === undefined) {
											$rootScope.player.setVolume(0.5).then(function() {
												$rootScope.player.seek(0).then(function() {
													$rootScope.player.resume();
												});
											});	
										} else {
											$rootScope.player.setVolume(($scope.vol / 100)).then(function() {
												$rootScope.player.seek(0).then(function() {
													$rootScope.player.resume();
												});
											});
										}
									});
								});
							});
						});
					});
				})
			} else {
				console.log('song ' + song);
				PlayerAPI.playClickedSong(song).then(function() {
					width = 0;
					bar.style.width = width + '%';
					PlayerAPI.delay().then(function() {
						$rootScope.player.getCurrentState().then(state => {
							let {
								current_track
							} = state.track_window;
							state.track_window.next_tracks = PlayerAPI.nextTracks();
							console.log(state.track_window);
							console.log('song ' + current_track.name);
	
							$rootScope.currentlyPlaying = {
								'imgSrc': current_track.album.images[0].url,
								'songTitle': current_track.name,
								'artistName': current_track.artists[0].name,
								'albumName': current_track.album.name
							}
							$rootScope.is_playing = true;
							$rootScope.player.resume();
						});
					});
				});
			}
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
				$cookies.token = token;
				console.log('Refreshed token');
			});
		};

		$scope.updateSongs = function() {
			SpotifyAPI.getTracksWithFeatures().then(function(allTracks) {
				const current = $rootScope.current_user.saved_songs.length;
				if (allTracks.length > current) {
					document.querySelector('#loading-gradient').style.display = 'inline-block';
					var promises = [];
					const newTracks = allTracks.slice(0, allTracks.length - current);
					newTracks.forEach((song) => {
						promises.push(DatabaseService.saveSongToUser($rootScope.current_user.username, song));
					});

					$q.all(promises).then(function(d) {
						$window.localStorage.setItem('user', JSON.stringify(d[d.length - 1].data));
						$rootScope.current_user = JSON.parse($window.localStorage.getItem('user'))
						$rootScope.songsByMood = DatabaseService.getSongsByMood();
						document.querySelector('#loading-gradient').style.display = 'none';
					});
					/*
					for (var i = 0; i < allTracks.length - current; i++) {
						console.log('Inside allTracks');
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
					*/
				} else {
					document.querySelector('#up-to-date-gradient').style.display = 'inline-block';
					PlayerAPI.delay().then(function() {
						document.querySelector('#up-to-date-gradient').style.display = 'none';
					});
					console.log('Up to date');
					// add popup saying "everything is up to date"
				}
			});
		};

	});
})();
