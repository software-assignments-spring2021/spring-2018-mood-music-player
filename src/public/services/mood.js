(function() {

	var module = angular.module('smoodifyApp');
    
	module.factory('MoodService', function($q, $http, $rootScope) {
		return {
			gracenoteMood: function(artist, song, album) {
				const query = '?artist=' + encodeURIComponent(artist) + '&song='+ encodeURIComponent(song) + '&album=' + encodeURIComponent(album);
				$http.get('/gracenote/' +  query).success(function(data) {
					console.log(data);
					return data;
				});
			},

			lyricSentimentMood: function(artist, song) {
				var ret = $q.defer();
				const query = '?artist=' + encodeURIComponent(artist) + '&song='+ encodeURIComponent(song);
				$http.get('/lyric/' + query).success(function(data) {
					console.log(data);
					ret.resolve(data);
				});
				return ret.promise;
			}

			getNetMood: function(song) {
				let output = net.run(song.analysis);
				//let output2 = net2.run(song.analysis);
				let energy = output.energy_level;
				let valence = output.valence_level;
				if ((energy >= 0 && energy <= .125) && (valence >= 0 && valence <= .125)) {
					// Somber
				} else if ((energy >= 0 && energy <= .125) && (valence > .125 && valence <= .375)) {
					// Ominous
				} else if ((energy >= 0 && energy <= .125) && (valence > .375 && valence <= .625)) {
					// Sentimental
				} else if ((energy >= 0 && energy <= .125) && (valence > .625 && valence <= .875)) {
					// Nostalgic
				} else if ((energy >= 0 && energy <= .125) && (valence > .625 && valence <= 1)) {
					// Peaceful
				} else if ((energy > .125 && energy <= .375) && (valence >= 0 && valence <= .125)) {
					// Depressing
				} else if ((energy > .125 && energy <= .375) && (valence > .125 && valence <= .375)) {
					// Melancholy
				} else if ((energy > .125 && energy <= .375) && (valence > .375 && valence <= .625)) {
					// Mellow
				} else if ((energy > .125 && energy <= .375) && (valence > .625 && valence <= .875)) {
					// Tender
				} else if ((energy > .125 && energy <= .375) && (valence > .875 && valence <= 1)) {
					// Easygoing
				} else if ((energy > .375 && energy <= .625) && (valence > .625 && valence <= .875)) {
					// Optimistic
				} else if ((energy > .375 && energy <= .625) && (valence > .875 && valence <= 1)) {
					// Content
				}






			}

		};
	});
})();