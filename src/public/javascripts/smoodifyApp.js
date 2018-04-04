(function() {
	var app = angular.module('smoodifyApp', ['ngRoute', 'ngResource', 'angularCSS', 'ngCookies']).run(function($rootScope, $http, $cookies, $location) {
		$rootScope.$on('$locationChangeStart', function (/* event */) {
			// var for user stored in session cookie
			let user = '';
			if (typeof $cookies['user'] == 'string' && $cookies['user'] != '') {
				user = JSON.parse($cookies['user']);
			}
		
			console.log('grabbing cookie');
			if (user == '') {
				$rootScope.authenticated = false;
				$rootScope.current_user = '';
				console.log('not auth\'d');
			}
			// logged in session exists, set current user as authenticated
			else {
				console.log('yes auth\'d');
				$rootScope.authenticated = true;
				$rootScope.current_user = user;
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
					window.location = '/';
				});
		  	}
		});
		
		$rootScope.signout = function(){
			console.log('got into signout');
			if (typeof($cookies['user']) == 'string') {
				$http.get('auth/signout');
				$rootScope.authenticated = false;
				$rootScope.current_user = '';
				$cookies['user'] = ''; //, { path:'/', domain:'localhost'} this object may be necessary in some situations
				$cookies['token'] = '';	// erase token until next time (for debugging)
				console.log('removed cookie');
			}
		};
	});
		
	app.config(function($routeProvider, $locationProvider){
		$routeProvider
			// the landing display
			.when('/', {
				css: ['../stylesheets/login.css', '../stylesheets/base.css'],
				templateUrl: 'landing.html',
				controller: 'MainController'
			})
			// the login display
			.when('/login', {
				css: {
					href: '../stylesheets/login.css',
					preload: true
				},
				templateUrl: 'login.html',
				controller: 'AuthController'
			})
			// the signup display
			.when('/register', {
				css: {
					href: '../stylesheets/login.css',
					preload: true
				},
				templateUrl: 'register.html',
				controller: 'AuthController',
			})
			.when('/saved_songs', {
				css: {
					href: '../stylesheets/base.css',
					preload: true
				},
				templateUrl: 'saved_songs.html',
				controller: 'PlayerController'
			})
			.when('/saved_albums', {
				css: {
					href: '../stylesheets/base.css',
					preload: true
				},
				templateUrl: 'saved_albums.html',
				controller: 'PlayerController'
			})
			.when('/saved_playlists', {
				css: {
					href: '../stylesheets/base.css',
					preload: true
				},
				templateUrl: 'saved_playlists.html',
				controller: 'PlayerController'
			})
			.when('/top_artists', {
				css: {
					href: '../stylesheets/base.css',
					preload: true
				},
				templateUrl: 'top_artists.html',
				controller: 'PlayerController'
			})
			.when('/top_songs', {
				css: {
					href: '../stylesheets/base.css',
					preload: true
				},
				templateUrl: 'top_songs.html',
				controller: 'PlayerController'
			})
			.when('/spotify_login', {
				templateUrl: 'main.html',
				controller: 'SpotifyController'
			})
			.when('/account', {
				css: ['../stylesheets/login.css', '../stylesheets/base.css'],
				templateUrl: 'account.html',
				controller: 'MainController'
			});
		$locationProvider.html5Mode({requireBase: false});
	});
	
})();