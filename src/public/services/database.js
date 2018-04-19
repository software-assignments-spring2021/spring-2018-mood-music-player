(function() {
    
	var module = angular.module('smoodifyApp');

	module.factory('DatabaseService', function($q, $http, $cookies) {

		return {
			saveSongToUser: function(user, song) {
				var ret = $q.defer();
				const query = '?user=' + encodeURIComponent(user) + '&song=' + encodeURIComponent(JSON.stringify(song));
				$http.post('/db/save/song/' + query).then(function(res) {
					ret.resolve(res);
				});
				return ret.promise;
			},

			getUser: function(username) {
				var ret = $q.defer();
				const query = '?user=' + encodeURIComponent(username);
				$http.get('/db/find/user' + query).then(function(res) {
					ret.resolve(res);
					console.log(res);
				});
				ret.promise.then(function(res) {
					return res.data;
				});
			}

		};
	});
})();