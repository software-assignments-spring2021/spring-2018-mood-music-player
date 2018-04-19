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

				for (let i = 0; i < moods.length(); i++) {
					moods[i].distance = Math.sqrt(Math.pow(moods[i].energy - output.energy_level, 2) + Math.pow(moods[i].valence - output.valence_level, 2));
				}

				// TODO: sort by distance, idealy it will solve ties by preferring center,
				// will likely have to implement own. Only 25 elements at all times, might not need O(nlogn). 
				// Ties will likely only occur when we have very little data.



				return moods;
			}

		};
	});
})();