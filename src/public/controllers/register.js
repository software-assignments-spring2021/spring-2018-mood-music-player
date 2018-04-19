(function() {

	var module = angular.module('smoodifyApp');

	module.controller('RegisterController', function($scope, $http, $location, $window, $rootScope, $cookies, SpotifyAPI, DatabaseService) {
		// this is where SpotifyLogin redirects
		// want to get data and set user object then redirect to /
		console.log(window.location);
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
				DatabaseService.findSong($rootScope.current_user.username, song.id).then(function(res) {
					if (res.data.found) {
						console.log('song ' + song.name + ' in user\'s saved songs');
					} else if (!res.data.found) {
						DatabaseService.saveSongToUser($rootScope.current_user.username, song).then(function(d) {
							console.log(d.data);
						});
					}
				});
			};
		});

		SpotifyAPI.getAlbums().then(function(data) {
			// $rootScope.albums = data;
		});

		SpotifyAPI.getTopArtists().then(function(data) {
			// $rootScope.artists = data;
		});

		SpotifyAPI.getTopTracks().then(function(data) {
			// $rootScope.top_tracks = data;
		});

		SpotifyAPI.getUserProfile().then(function(data) {
			// $rootScope.user_data = data;
		});

		// $window.localStorage.setItem('user', JSON.stringify(data.user));
		// window.location = '/';
	});

})();

