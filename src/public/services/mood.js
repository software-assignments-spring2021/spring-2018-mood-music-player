(function() {

	var module = angular.module('smoodifyApp');
    
	module.factory('MoodService', function($http) {

		return {
			gracenoteMood: function(artist, title, album) {
				const query = '?artist=' + encodeURIComponent(artist) + '&song='+ encodeURIComponent(title) + '&album=' + encodeURIComponent(album);
				$http.get('/gracenote/' +  query).success(function(data) {
					console.log(data);
					return data;
				});
			},

			lyricSentimentMood: function(artist, title) {
				const query = '?artist=' + encodeURIComponent(artist) + '&song='+ encodeURIComponent(title);
				$http.get('/lyric/' + query).success(function(data) {
					console.log(data);
					return data;
				});
			}
		}
	});
});