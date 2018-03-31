(function() {
    
    var module = angular.module('smoodifyApp');

    module.controller('AuthController', function($scope, $http, $rootScope, $location, $cookies){
        $scope.user = {username: '', password: ''};
        $scope.error_message = '';
        $scope.login = function(){
            $http.post('/auth/login', $scope.user).success(function(data){
                if(data.state == 'success'){
                    $cookies['user'] = JSON.stringify(data.user);
                    $rootScope.authenticated = true;
                    $rootScope.current_user = data.user.username;
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
                    $location.path('/');
                } else{
                    $scope.error_message = data.message;
                }
            });
        };
    });
    
})();  
