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
				// TODO: import net?

				// TODO: figure this shit out.
				let output = net.run(song.analysis);
				//let output2 = net2.run(song.analysis);
				let energy = output.energy_level;
				let valence = output.valence_level;
				// TODO: add these things to our song data in database.
				// TODO: add mongo functions.
				if ((energy >= 0 && energy <= .125) && (valence >= 0 && valence <= .125)) {
					return 'Somber';
				} else if ((energy >= 0 && energy <= .125) && (valence > .125 && valence <= .375)) {
					return 'Ominous';
				} else if ((energy >= 0 && energy <= .125) && (valence > .375 && valence <= .625)) {
					return 'Sentimental';
				} else if ((energy >= 0 && energy <= .125) && (valence > .625 && valence <= .875)) {
					return 'Nostalgic';
				} else if ((energy >= 0 && energy <= .125) && (valence > .625 && valence <= 1)) {
					return 'Peaceful';
				} else if ((energy > .125 && energy <= .375) && (valence >= 0 && valence <= .125)) {
					return 'Depressing';
				} else if ((energy > .125 && energy <= .375) && (valence > .125 && valence <= .375)) {
					return 'Melancholy';
				} else if ((energy > .125 && energy <= .375) && (valence > .375 && valence <= .625)) {
					return 'Mellow';
				} else if ((energy > .125 && energy <= .375) && (valence > .625 && valence <= .875)) {
					return 'Tender';
				} else if ((energy > .125 && energy <= .375) && (valence > .875 && valence <= 1)) {
					return 'Easygoing';
				} else if ((energy > .375  && energy <= .625) && (valence >= 0 && valence <= .125)) {
					return 'Brooding';
				} else if ((energy > .375 && energy <= .625) && (valence > .125 && valence <= .375)) {
					return 'Yearning';
				} else if ((energy > .375 && energy <= .625) && (valence > .375 && valence <= .625)) {
					return 'Sensual';
				} else if ((energy > .375 && energy <= .625) && (valence > .625 && valence <= .875)) {
					return 'Optimistic';
				} else if ((energy > .375 && energy <= .625) && (valence > .875 && valence <= 1)) {
					return 'Content';
				} else if ((energy > .625 && energy <= .875) && (valence >= 0 && valence <= .125)) {
					return 'Despair';
				} else if ((energy > .625 && energy <= .875) && (valence > .125 && valence <= .375)) {
					return 'Anxious';
				} else if ((energy > .625 && energy <= .875) && (valence > .375 && valence <= .625)) {
					return 'Chill';
				} else if ((energy > .625 && energy <= .875) && (valence > .625 && valence <= .875)) {
					return 'Stirring';
				} else if ((energy > .625 && energy <= .875) && (valence > .875 && valence <= 1)) {
					return 'Excited';
				} else if ((energy > .875 && energy <= 1) && (valence >= 0 && valence <= .125)) {
					return 'Aggressive';
				} else if ((energy > .875 && energy <= 1) && (valence > .125 && valence <= .375)) {
					return 'Angsty';
				} else if ((energy > .875 && energy <= 1) && (valence > .375 && valence <= .625)) {
					return 'Energizing';
				} else if ((energy > .875 && energy <= 1) && (valence > .625 && valence <= .875)) {
					return 'Upbeat';
				} else if ((energy > .875 && energy <= 1) && (valence > .875 && valence <= 1)) {
					return 'Empowering';
				} else {
					console.log("what",energy,valence);
				}

			}

		};
	});
})();