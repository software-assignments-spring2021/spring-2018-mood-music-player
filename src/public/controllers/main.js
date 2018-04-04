(function(){

	var module = angular.module('smoodifyApp');

	module.controller('MainController', function($scope, $http, $cookies){
    	$scope.refresh = function() {
    		console.log('inside refresh');
    		$http.get('/spotify/refresh_token?refresh_token=' + $cookies.refresh_token).success(function(data) {
				console.log("BEFORE:\n" + $cookies.token);
				$cookies.token = data.access_token;
				console.log("AFTER:\n" + $cookies.token);
			});
    	};
	});
    
})();

   

