(function() {
    
	var module = angular.module('smoodifyApp');

	module.controller('AuthController', function($scope, $http, $rootScope, $window, $location, $cookies, SpotifyAPI){
		$scope.user = {username: '', password: ''};
		$scope.error_message = '';
		$scope.login = function(){
			$http.post('/auth/login', $scope.user).success(function(data){
				if(data.state == 'success'){
					// console.log(data.user.username);
					$cookies['user'] = data.user.username;
					$window.localStorage.setItem('user', JSON.stringify(data.user));
					$rootScope.authenticated = true;
					// $rootScope.current_user = data.user;
					SpotifyAPI.refreshToken().then(function(token) {
						$cookies.token = token;
					});

					/* Update data in user object 
					SpotifyAPI.getTracks().then(function(data) {
						$rootScope.songs = data;
					});

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
					$location.path('/browse');
				} else{
					$scope.error_message = data.message;
				}
			});
		};
		$scope.register = function(){
			$http.post('/auth/signup', $scope.user).success(function(data){
				if(data.state == 'success'){
					$cookies['user'] = data.user.username;
					$window.localStorage.setItem('user', JSON.stringify(data.user));
					$rootScope.authenticated = true;
					$location.path('/spotify_login');
				} else{
					$scope.error_message = data.message;
				}
			});
		};

		const text = document.querySelector('#intro-text');
		const register = document.querySelector('#register-text');
		const login = document.querySelector('#login-text');

		$scope.switchRegister = function() {
			text.style.display = 'none';
			login.style.display = 'none';
			register.style.display = 'inline-block';
		};

		$scope.switchLogin = function() {
			text.style.display = 'none';
			register.style.display = 'none';
			login.style.display = 'inline-block';
		};
	});
    
})();  
