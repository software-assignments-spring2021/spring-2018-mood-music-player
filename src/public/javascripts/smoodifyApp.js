(function() {
	var app = angular.module('smoodifyApp', ['ngRoute', 'ngResource', 'angularCSS', 'ngCookies']).run(function($rootScope, $http, $cookies, $window, $location, SpotifyAPI, DatabaseService) {
		$rootScope.$on('$locationChangeStart', function (/* event */) {

			let user = '';
			if (typeof $cookies['user'] == 'string' && $cookies['user'] != '') {
				user = $cookies['user'];
			}
			var path = window.location.pathname;
			console.log('grabbing cookie');
			if (user == '') {
				$rootScope.authenticated = false;
				$rootScope.current_user = '';
				console.log('not auth\'d');
				if (path !== '/' && path !== '/login' && path !== '/regsiter') {
					window.location = '/';
				}
			} else {
				console.log('yes auth\'d');
				$rootScope.authenticated = true;
				$rootScope.current_user = JSON.parse($window.localStorage.getItem('user'));
				console.log($rootScope.current_user);
				if (path === '/' && $cookies.token) {
					$location.path('/browse');
				}
			}
			
			if ($cookies.token === undefined) {
				$cookies.token = '';
				$rootScope.has_token = false;
			}

		});
		/* Location change success */
		$rootScope.$on('$locationChangeSuccess', function (angularEvent, newUrl, oldUrl) {
			console.log($cookies.token);
			if (newUrl.includes('code=')) {
				const code = newUrl.substring(oldUrl.indexOf('code')).split('&')[0].split('=')[1];
				$http.get('/spotify/callback/' + code).then(function(data) {
					const access_token = data.data.access_token;
					const refresh_token = data.data.refresh_token;
					$cookies.token = access_token;
					$cookies.refresh_token = refresh_token;
					$rootScope.has_token = true;

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
							DatabaseService.saveSongToUser($rootScope.current_user.username, song).then(function(d) {
								$window.localStorage.setItem('user', JSON.stringify(d.data));
							});
						};

						$location.path('/browse');
						
					});
					/* Pull data and save in user object
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
					*/
				});
		  	}
		});
		
		$rootScope.signout = function(){
			console.log('got into signout');
			if (typeof($cookies['user']) == 'string') {
				$http.get('auth/signout');
				$rootScope.authenticated = false;
				$rootScope.current_user = '';
				$window.localStorage.removeItem('user');
				console.log($window.localStorage.getItem('user'));
				$cookies['user'] = '';
				console.log('removed cookie');
			}
		};
	});
		
	app.config(function($routeProvider, $locationProvider){
		$routeProvider
			// the landing display
			.when('/', {
				css: ['../stylesheets/login.css', '../stylesheets/base.css'],
				templateUrl: '../partials/landing.html',
				controller: 'AuthController'
			})
			// the login display
			.when('/login', {
				css: ['../stylesheets/login.css'],
				templateUrl: '../partials/login.html',
				controller: 'AuthController'
			})
			// the signup display
			.when('/register', {
				css: ['../stylesheets/login.css'],
				templateUrl: '../partials/register.html',
				controller: 'AuthController',
			})
			.when('/browse', {
				css: ['../stylesheets/browse.css', '../stylesheets/base.css'],
				templateUrl: '../partials/browse.html',
				controller: 'PlayerController',
			})
			.when('/saved_songs', {
				css: ['../stylesheets/base.css', '../stylesheets/saved_songs.css'],
				templateUrl: '../partials/saved_songs.html',
				controller: 'PlayerController'
			})
			.when('/saved_albums', {
				css: ['../stylesheets/base.css', '../stylesheets/saved_albums.css'],
				templateUrl: '../partials/saved_albums.html',
				controller: 'PlayerController'
			})
			.when('/saved_playlists', {
				css: ['../stylesheets/base.css', '../stylesheets/saved_playlists.css'],
				templateUrl: '../partials/saved_playlists.html',
				controller: 'PlayerController'
			})
			.when('/top_artists', {
				css: ['../stylesheets/base.css', '../stylesheets/top_artists.css'],
				templateUrl: '../partials/top_artists.html',
				controller: 'PlayerController'
			})
			.when('/top_songs', {
				css: ['../stylesheets/base.css', '../stylesheets/top_songs.css'],
				templateUrl: '../partials/top_songs.html',
				controller: 'PlayerController'
			})
			.when('/spotify_login', {
				templateUrl: '../partials/browse.html',
				controller: 'SpotifyController'
			})
			.when('/account', {
				css: ['../stylesheets/login.css', '../stylesheets/base.css', '../stylesheets/account.css'],
				templateUrl: '../partials/account.html',
				controller: 'PlayerController'
			});
		$locationProvider.html5Mode({requireBase: false});
	});
	
})();