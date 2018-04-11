(function() {
    
	var module = angular.module('smoodifyApp');

	module.factory('DatabaseService', function($q, $http, $cookies) {

		return {
			newSong: function(song) {
				var ret = $q.defer();
				const query = encodeURIComponent(JSON.stringify(song));
				$http.post('/api/song/' + query).then(function(res) {
					ret.resolve(res);
				});
				return ret.promise;
			}

		};
	});
})();