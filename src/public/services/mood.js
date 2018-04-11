(function() {

	var module = angular.module('smoodifyApp');
    
	module.factory('MoodService', function($q, $http) {

		return {
			gracenoteMood: function(artist, title, album) {
				const query = '?artist=' + encodeURIComponent(artist) + '&title='+ encodeURIComponent(title) + '&album=' + encodeURIComponent(album);
				$http.get('/gracenote/' +  query).success(function(data) {
					console.log(data);
				});
			},

			lyricSentimentMood: function(artist, title) {
				var ret = $q.defer();
				const query = '?artist=' + encodeURIComponent(artist) + '&title='+ encodeURIComponent(title);
				$http.get('/lyric/' + query).success(function(data) {
					console.log(data);
					ret.resolve(data);
				});
				return ret.promse;
			}
		};
	});
});