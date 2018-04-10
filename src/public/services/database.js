(function() {
    
	var module = angular.module('smoodifyApp');

	module.factory('DatabaseService', function($q, $http, $cookies) {

		return {
			newArtist: function(name, id, uri) {
				var ret = $q.defer();
				const query = '?name=' + encodeURIComponent(name) + '&id=' + encodeURIComponent(id) + '&uri=' + encodeURIComponent(uri);
				$http.post('/new/artist/' + query).success(function(res) {
					ret.resolve(res.data);
				});
				return ret.promise;
			},

			newAlbum: function() {

			},

			newSong: function() {

			}
		};
	});
})();