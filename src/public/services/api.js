(function() {
    
    var module = angular.module('smoodifyApp');

    module.factory('SpotifyAPI', function($q, $http) {

        var baseUrl = 'https://api.spotify.com/v1';

        return {
            getSong: function() {
                var ret = $q.defer();
                $http.put(baseUrl + '/me/player', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    data: {
                        'device_ids': '["' + device + '"]}'
                    }
                }).success(function(r) {
                    ret.resolve(r);
                });
                return ret.promise;
            },
            
            
            getPlayerState: function() {
                var ret = $q.defer();
                $http.get(apiBaseUrl + '/me/player', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + $cookies.token
                    }
                }).success(function(r) {
                    ret.resolve(r);
                });
                return ret.promise;
            },


            playNext: function() {
                var ret = $q.defer();
                $http.post(apiBaseUrl + '/me/player/next', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }).success(function(r) {
                    ret.resolve(r);
                });
                return ret.promise;
            },


            playPrevious: function() {
                var ret = $q.defer();
                $http.post(apiBaseUrl + '/me/player/previous', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }).success(function(r) {
                    ret.resolve(r);
                });
                return ret.promise;
            },

            toggleShuffle: function() {
                var ret = $q.defer();
                $http.put(apiBaseUrl + '/me/player/shuffle?state=' + shuffle, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }).success(function(r){
                    ret.resolve(r);
                });
                return ret.promise;
            },


            

        }
    })
})();