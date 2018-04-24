(function() {
	var app = angular.module('smoodifyApp', ['ngRoute', 'ngResource', 'angularCSS', 'ngCookies']).run(function($rootScope, $http, $cookies, $window, $location, SpotifyAPI, DatabaseService, MoodService) {
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
				if (path !== '/') {
					$location.url('/');
				}
			} else {
				console.log('yes auth\'d');
				$rootScope.authenticated = true;
				$rootScope.current_user = JSON.parse($window.localStorage.getItem('user'));
				console.log($rootScope.current_user);
				if (path === '/' && $rootScope.current_user.saved_songs.length > 0) {
					$location.url('/browse');
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
				$http.get('/learn/train').then(function(trainData) {
					console.log(trainData.data.output);
					const code = newUrl.substring(oldUrl.indexOf('code')).split('&')[0].split('=')[1];
					$http.get('/spotify/callback/' + code).then(function(data) {
						const access_token = data.data.access_token;
						const refresh_token = data.data.refresh_token;
						$cookies.token = access_token;
						$cookies.refresh_token = refresh_token;
						$rootScope.has_token = true;

						SpotifyAPI.getTracksWithFeatures().then(function(allTracks) {
							for (var i = 0; i < allTracks.length; i++) {
								console.log("inside allTracks");
								song = allTracks[i];
								// get track moods, add to track, then save
								DatabaseService.saveSongToUser($rootScope.current_user.username, song).then(function(d) {
									// console.log(d);
									$window.localStorage.setItem('user', JSON.stringify(d.data));
								});
							};

							$location.url('/browse');						
						});
					});
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
				$cookies['user'] = '';
				$rootScope.player.disconnect();
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
			.when('/browse', {
				css: ['../stylesheets/browse.css', '../stylesheets/base.css'],
				templateUrl: '../partials/browse.html',
				controller: 'MainController',
			})
			.when('/saved_songs', {
				css: ['../stylesheets/base.css', '../stylesheets/saved_songs.css'],
				templateUrl: '../partials/saved_songs.html',
				controller: 'PlayerController'
			})
			.when('/mood_playlists', {
				css: ['../stylesheets/base.css', '../stylesheets/mood_playlists.css'],
				templateUrl: '../partials/mood_playlists.html',
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