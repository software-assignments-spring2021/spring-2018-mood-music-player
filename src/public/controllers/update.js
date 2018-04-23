(function() {

	var module = angular.module('smoodifyApp');

	module.controller('UpdateController', function($rootScope, $location, $window, SpotifyAPI, PlayerAPI, DatabaseService) {
		PlayerAPI.delay().then(function() {
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

				$location.url('/account');
			});
		});
	});

})();

