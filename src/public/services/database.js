(function() {
    
	var module = angular.module('smoodifyApp');

	module.factory('DatabaseService', function($q, $http, $cookies) {

		return {
			newArtist: function(name, id, uri) {
				const query = '?name=' + encodeURIComponent(name) + '&id=' + encodeURIComponent(id) + '&uri=' + encodeURIComponent(uri);
				$http.post('/new/artist/' + query).then(function(res) {
					console.log(res);
				});
			},

			newAlbum: function() {

			},

			newSong: function() {
				
			}
		};
	});
})();