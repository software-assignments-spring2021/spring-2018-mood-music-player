(function() {

	var module = angular.module('smoodifyApp');
    
	module.factory('MoodService', function($q, $http, $rootScope) {
		return {
			gracenoteMood: function(artist, song, album) {
				'?artist=' + encodeURIComponent(artist) + '&song='+ encodeURIComponent(song) + '&album=' + encodeURIComponent(album),
				$http.get('/gracenote/' +  query).success(function(data) {
					console.log(data);
					return data;
				});
			},

			lyricSentimentMood: function(artist, song) {
				var ret = $q.defer();
				'?artist=' + encodeURIComponent(artist) + '&song='+ encodeURIComponent(song),
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

				const moods = [
					{mood: 'Somber', energy: 0, valence: 0, distance: 1},
					{mood: 'Ominous', energy: 0, valence: 0.25, distance: 1},
					{mood: 'Sentimental', energy: 0, valence: 0.50, distance: 1},
					{mood: 'Nostalgic', energy: 0, valence: 0.75, distance: 1},
					{mood: 'Peaceful', energy: 0, valence: 1, distance: 1},
					{mood: 'Depressing', energy: 0.25, valence: 0, distance: 1},
					{mood: 'Melancholy', energy: 0.25, valence: 0.25, distance: 1},
					{mood: 'Mellow', energy: 0.25, valence: 0.50, distance: 1},
					{mood: 'Tender', energy: 0.25, valence: 0.75, distance: 1},
					{mood: 'Easygoing', energy: 0.25, valence: 1, distance: 1},
					{mood: 'Brooding', energy: 0.50 , valence: 0, distance: 1},
					{mood: 'Yearning', energy: 0.50 , valence: 0.25, distance: 1},
					{mood: 'Sentimental', energy: 0.50 , valence: 0.50, distance: 1},
					{mood: 'Optimistic', energy: 0.50 , valence: 0.75, distance: 1},
					{mood: 'Content', energy: 0.50 , valence: 1, distance: 1},
					{mood: 'Despair', energy: 0.75, valence: 0, distance: 1},
					{mood: 'Anxious', energy: 0.75, valence: 0.25, distance: 1},
					{mood: 'Chill', energy: 0.75, valence: 0.50, distance: 1},
					{mood: 'Stirring', energy: 0.75, valence: 0.75, distance: 1},
					{mood: 'Excited', energy: 0.75, valence: 1, distance: 1},
					{mood: 'Aggressive', energy: 1, valence: 0, distance: 1},
					{mood: 'Angsty', energy: 1, valence: 0.25, distance: 1},
					{mood: 'Energizing', energy: 1, valence: 0.50, distance: 1},
					{mood: 'Upbeat', energy: 1, valence: 0.75, distance: 1},
					{mood: 'Empowering', energy: 1, valence: 1, distance: 1},
				];



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