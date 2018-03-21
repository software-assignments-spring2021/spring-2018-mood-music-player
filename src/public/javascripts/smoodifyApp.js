var app = angular.module('smoodifyApp', ['ngRoute', 'ngResource', 'angularCSS', 'ngCookies']).run(function($rootScope, $http, $cookies, $location) {
	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		// var for user stored in session cookie
		let user = '';
		if (typeof $cookies['user'] == 'string' && $cookies['user'] != '') {
			user = JSON.parse($cookies['user'])
		}

		console.log('grabbing cookie');
		// no logged in user, we should be going to #login
		if (user == '') {
			$rootScope.authenticated = false;
			$rootScope.current_user = '';
			// if (next.includes('register')) {
			// 	// if link is to register page, allow
			// 	console.log('not auth\'d');
			// }
			// else {  // otherwise redirect to login
			// 	console.log('not auth\'d');
			// }
			console.log('not auth\'d');
		}
		// logged in session exists, set current user as authenticated
		else {
			console.log('yes auth\'d');
			$rootScope.authenticated = true;
			$rootScope.current_user = user;
		}
	});
	
	$rootScope.signout = function(){
		console.log('got into signout');
		if (typeof($cookies['user']) == 'string') {
			$http.get('auth/signout');
			$rootScope.authenticated = false;
			$rootScope.current_user = '';
			$cookies['user'] = '' //, { path:'/', domain:'localhost'} this object may be necessary in some situations
			console.log('removed cookie');
		}
	};
});

app.config(function($routeProvider){
	$routeProvider
		// the landing display
		.when('/', {
			css: ['../stylesheets/login.css', '../stylesheets/base.css'],
			templateUrl: 'landing.html',
			controller: 'mainController'
		})
		// the login display
		.when('/login', {
			css: {
				href: '../stylesheets/login.css',
				preload: true
			},
			templateUrl: 'login.html',
			controller: 'authController'
		})
		// the signup display
		.when('/register', {
			css: {
				href: '../stylesheets/login.css',
				preload: true
			},
			templateUrl: 'register.html',
			controller: 'authController',
		})
		.when('/saved', {
			css: {
				href: '../stylesheets/base.css',
				preload: true
			},
			templateUrl: 'saved_music.html',
			controller: 'mainController'
		})
		.when('/account', {
			css: ['../stylesheets/login.css', '../stylesheets/base.css'],
			templateUrl: 'account.html',
			controller: 'accountController'
		});
});

app.factory('songService', function($resource) {
	return $resource ('api/songs');
});

app.controller('mainController', function(songService, $scope, $rootScope){
	$scope.songs = songService.query();

	$scope.post = function() {
	  $scope.newSong.title = $scope.new.title;
	  $scope.newSong.artist = $scope.new.artist;
	  songService.save($scope.newSong, function(){
	    $scope.songs = songService.query();
	    $scope.newSong = {title: '', artist: ''};
	  });
	};
});

app.controller('accountController', function(songService, $scope, $rootScope){
	$scope.songs = songService.query();

	$scope.post = function() {
	  $scope.newSong.title = $scope.new.title;
	  $scope.newSong.artist = $scope.new.artist;
	  songService.save($scope.newSong, function(){
	    $scope.songs = songService.query();
	    $scope.newSong = {title: '', artist: ''};
	  });
	};
});

app.controller('authController', function($scope, $http, $rootScope, $location, $cookies){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';
  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
      	$cookies['user'] = JSON.stringify(data.user);
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});