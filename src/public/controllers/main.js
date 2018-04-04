(function(){

	var module = angular.module('smoodifyApp');

	module.controller('MainController', function($scope, $http, $cookies){
    	$scope.refresh = function() {
    		console.log('hi! ' + $cookies.refresh_token);
    	};
	});
    
})();

   

