 angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: '../views/home.html',
            controller: 'MainController'
        })

        // nerds page that will use the NerdController
        .when('/mood', {
            templateUrl: '../views/mood.html',
            controller: 'MoodController'
        });

    $locationProvider.html5Mode(true);

}]);