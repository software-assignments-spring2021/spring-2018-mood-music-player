(function() {
    
	var module = angular.module('smoodifyApp');

	module.controller('AuthController', function($scope, $http, $rootScope, $location, $cookies, SpotifyAPI){
		$scope.user = {username: '', password: ''};
		$scope.error_message = '';
		$scope.login = function(){
			$http.post('/auth/login', $scope.user).success(function(data){
				if(data.state == 'success'){
					$cookies['user'] = JSON.stringify(data.user);
					$rootScope.authenticated = true;
					$rootScope.current_user = data.user.username;
					// update token
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
					$location.path('/');
				} else{
					$scope.error_message = data.message;
				}
			});
		};
		$scope.register = function(){
			$http.post('/auth/signup', $scope.user).success(function(data){
				if(data.state == 'success'){
					$cookies['user'] = JSON.stringify(data.user);
					$rootScope.authenticated = true;
					$rootScope.current_user = data.user.username;
					$location.path('/spotify_login');
				} else{
					$scope.error_message = data.message;
				}
			});
		};
	});
    
})();  
