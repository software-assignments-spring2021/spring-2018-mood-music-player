(function() {

    var module = angular.module('smoodifyApp');

    module.controller('SpotifyController', function($scope, $http, $location, $window) {
        /* Spotify Login API Code */
        const authEndpoint = 'https://accounts.spotify.com/authorize';
    
        // Replace with your app's client ID, redirect URI and desired scopes
        const clientId = 'dcddb8d13b2f4019a1dadb4b4c070661';
        const redirectUri = 'http://localhost:3000/';
        const scopes = [
            'user-read-birthdate',
            'user-read-email',
            'user-read-private',
            'playlist-read-private',
            'user-top-read',
            'user-library-read',
            'playlist-modify-private',
            'user-read-currently-playing',
            'user-read-recently-played',
            'user-modify-playback-state',
            'user-read-playback-state',
            'user-library-modify',
            'streaming',
            'playlist-modify-public'
        ];
    
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
    
        $scope.scopes = 'user-read-birthdate user-read-email user-read-private playlist-read-private user-top-read user-library-read playlist-modify-private user-read-currently-playing user-read-recently-played user-modify-playback-state user-read-playback-state user-library-modify streaming playlist-modify-public';
    
        $http.get('https://accounts.spotify.com/authorize' +
            '?response_type=token' +
            '&client_id=' + 'dcddb8d13b2f4019a1dadb4b4c070661' +
            ($scope.scopes ? '&scope=' + encodeURIComponent($scope.scopes) : '') +
            '&redirect_uri=' + encodeURIComponent('http://localhost:3000'))
            .then(function(response) {
                $scope.my_data = response.data;
            });
    });

})();

