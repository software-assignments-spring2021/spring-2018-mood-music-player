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
				} else if ((energy > 0 && energy < .125) && (valence > 0 && valence < .125)) {

				}


				if ((energy > .375  && energy <= .625) && (valence >= 0 && valence <= .125)) {
					// Brooding
				} else if ((energy > .625 && energy <= .875) && (valence >= 0 && valence <= .125)) {
					// Despair
				} else if ((energy > .875 && energy <= 1) && (valence >= 0 && valence <= .125)) {
					// Aggressive
				} else if ((energy > .375 && energy <= .625) && (valence > .125 && valence <= .375)) {
					// Yearning
				} else if ((energy > .625 && energy <= .875) && (valence > .125 && valence <= .375)) {
					// Anxious
				} else if ((energy > .875 && energy <= 1) && (valence > .125 && valence <= .375)) {
					// Angsty
				} else if ((energy > .375 && energy <= .625) && (valence > .375 && valence <= .625)) {
					// Sensual
				} else if ((energy > .625 && energy <= .875) && (valence > .375 && valence <= .625)) {
					// Chill
				} else if ((energy > .875 && energy <= 1) && (valence > .375 && valence <= .625)) {
					// Energizing
				} else if ((energy > .625 && energy <= .875) && (valence > .875 && valence <= 1)) {
					// Excited
				} else if ((energy > .625 && energy <= .875) && (valence > .625 && valence <= .875)) {
					// Stirring
				} else if ((energy > .875 && energy <= 1) && (valence > .875 && valence <= 1)) {
					// Empowering
				} else if ((energy > .875 && energy <= 1) && (valence > .625 && valence <= .875)) {
					// Upbeat
				}

			}

		};
	});
})();