var app = angular.module('smoodifyApp', ['ngRoute', 'ngResource', 'angularCSS']).run(function($rootScope, $http) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	
	$rootScope.signout = function(){
    	$http.get('auth/signout');
    	$rootScope.authenticated = false;
    	$rootScope.current_user = '';
	};
});

app.config(function($routeProvider){
	$routeProvider
		// the landing display
		.when('/', {
			css: {
				href: '../stylesheets/login.css',
				preload: true
			},
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
		// the logged in display
		.when('/browse', {
			css: {
				href: '../stylesheets/base.css',
				preload: true
			},
			templateUrl: 'main.html',
			controller: 'mainController'
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

app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';
  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/browse');
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
        $location.path('/browse');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});