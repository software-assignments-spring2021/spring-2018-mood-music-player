(function() {

	var module = angular.module('smoodifyApp');

	module.controller('SpotifyController', function($scope, $http, $location, $window) {
		/* Spotify Login API Code */
		const scopes = [
			'user-read-birthdate',
			'user-read-email',
			'user-read-private',
			'playlist-read-private',
			'playlist-read-collaborative',
			'user-top-read',
			'user-library-read',
			'playlist-modify-private',
			'user-read-currently-playing',
			'user-read-recently-played',
			'user-modify-playback-state',
			'user-read-playback-state',
			'user-library-modify',
			'streaming',
			'playlist-modify-public'
		];

		$http.get('/spotify/login').success(function(data) {
			window.location = data + `&scope=${scopes.join('%20')}`;
		});
	});

})();

