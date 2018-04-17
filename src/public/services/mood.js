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
			},

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
					return  {energy: energy, valence: valence, mood: 'Somber'};
				} else if ((energy >= 0 && energy <= .125) && (valence > .125 && valence <= .375)) {
					return  {energy: energy, valence: valence, mood: 'Ominous'};
				} else if ((energy >= 0 && energy <= .125) && (valence > .375 && valence <= .625)) {
					return  {energy: energy, valence: valence, mood: 'Sentimental'};
				} else if ((energy >= 0 && energy <= .125) && (valence > .625 && valence <= .875)) {
					return  {energy: energy, valence: valence, mood: 'Nostalgic'};
				} else if ((energy >= 0 && energy <= .125) && (valence > .625 && valence <= 1)) {
					return  {energy: energy, valence: valence, mood: 'Peaceful'};
				} else if ((energy > .125 && energy <= .375) && (valence >= 0 && valence <= .125)) {
					return  {energy: energy, valence: valence, mood: 'Depressing'};
				} else if ((energy > .125 && energy <= .375) && (valence > .125 && valence <= .375)) {
					return  {energy: energy, valence: valence, mood: 'Melancholy'};
				} else if ((energy > .125 && energy <= .375) && (valence > .375 && valence <= .625)) {
					return  {energy: energy, valence: valence, mood: 'Mellow'};
				} else if ((energy > .125 && energy <= .375) && (valence > .625 && valence <= .875)) {
					return  {energy: energy, valence: valence, mood: 'Tender'};
				} else if ((energy > .125 && energy <= .375) && (valence > .875 && valence <= 1)) {
					return  {energy: energy, valence: valence, mood: 'Easygoing'};
				} else if ((energy > .375  && energy <= .625) && (valence >= 0 && valence <= .125)) {
					return  {energy: energy, valence: valence, mood: 'Brooding'};
				} else if ((energy > .375 && energy <= .625) && (valence > .125 && valence <= .375)) {
					return  {energy: energy, valence: valence, mood: 'Yearning'};
				} else if ((energy > .375 && energy <= .625) && (valence > .375 && valence <= .625)) {
					return  {energy: energy, valence: valence, mood: 'Sensual'};
				} else if ((energy > .375 && energy <= .625) && (valence > .625 && valence <= .875)) {
					return  {energy: energy, valence: valence, mood: 'Optimistic'};
				} else if ((energy > .375 && energy <= .625) && (valence > .875 && valence <= 1)) {
					return  {energy: energy, valence: valence, mood: 'Content'};
				} else if ((energy > .625 && energy <= .875) && (valence >= 0 && valence <= .125)) {
					return  {energy: energy, valence: valence, mood: 'Despair'};
				} else if ((energy > .625 && energy <= .875) && (valence > .125 && valence <= .375)) {
					return  {energy: energy, valence: valence, mood: 'Anxious'};
				} else if ((energy > .625 && energy <= .875) && (valence > .375 && valence <= .625)) {
					return  {energy: energy, valence: valence, mood: 'Chill'};
				} else if ((energy > .625 && energy <= .875) && (valence > .625 && valence <= .875)) {
					return  {energy: energy, valence: valence, mood: 'Stirring'};
				} else if ((energy > .625 && energy <= .875) && (valence > .875 && valence <= 1)) {
					return  {energy: energy, valence: valence, mood: 'Excited'};
				} else if ((energy > .875 && energy <= 1) && (valence >= 0 && valence <= .125)) {
					return  {energy: energy, valence: valence, mood: 'Aggressive'};
				} else if ((energy > .875 && energy <= 1) && (valence > .125 && valence <= .375)) {
					return  {energy: energy, valence: valence, mood: 'Angsty'};
				} else if ((energy > .875 && energy <= 1) && (valence > .375 && valence <= .625)) {
					return  {energy: energy, valence: valence, mood: 'Energizing'};
				} else if ((energy > .875 && energy <= 1) && (valence > .625 && valence <= .875)) {
					return  {energy: energy, valence: valence, mood: 'Upbeat'};
				} else if ((energy > .875 && energy <= 1) && (valence > .875 && valence <= 1)) {
					return  {energy: energy, valence: valence, mood: 'Empowering'};
				} else {
					console.log("what",energy,valence);
				}

			}

		};
	});
})();