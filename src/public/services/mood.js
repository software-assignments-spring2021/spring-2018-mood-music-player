(function() {

	var module = angular.module('smoodifyApp');
    
	module.factory('MoodService', function($http) {

		return {
			gracenoteMood: function(artist, title, album) {
				$http.get('/gracenote/' + artist + "-" + title + "-" + album)
				.success(function(data) {
					console.log(data);
				});
			},

			lyricSentimentMood: function(artist, title) {
				$http.get('/lyric/' + JSON.stringify({artist: artist, title: title}))
				.success(function(data) {
					console.log(data);
				});
			}
		}
	});
});