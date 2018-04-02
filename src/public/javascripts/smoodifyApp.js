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
			// if we just redirected from gaining the access token, save it to $cookies and $rootScope
			if (oldUrl.includes('access_token')) {
				if ($cookies.token === '') {	// if it hasn't been set yet, set it
					let path = oldUrl.substring(oldUrl.indexOf('access_token')).split('&');
					$cookies.token = path[0].split('=')[1];
					$cookies.token_exp = path[2].split('=')[1];	
					$rootScope.token = $cookies.token;
					$rootScope.token_exp = $cookies.token_exp;
					$rootScope.has_token = true;
				}
				$location.path('/');	// redirect to main
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
			.when('/top_artists', {
				css: {
					href: '../stylesheets/base.css',
					preload: true
				},
				templateUrl: 'top_artists.html',
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