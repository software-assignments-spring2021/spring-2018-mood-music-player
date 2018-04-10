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

			newAlbum: function(name, artist, id, uri) {
				const query = '?name=' + encodeURIComponent(name) + '&artist=' + encodeURIComponent(artist) + '&id=' + encodeURIComponent(id) + '&uri=' + encodeURIComponent(uri);
					$http.post('/new/album/' + query).then(function(res) {
						console.log(res);
					});
			},

			newSong: function(name, id, uri, duration_ms) {
				const query = '?name=' + encodeURIComponent(name) + '&id=' + encodeURIComponent(id) + '&uri=' + encodeURIComponent(uri) + '&duration_ms=' + encodeURIComponent(duration_ms);
					$http.post('/new/song/' + query).then(function(res) {
						console.log(res);
					});
			}
		};
	});
})();