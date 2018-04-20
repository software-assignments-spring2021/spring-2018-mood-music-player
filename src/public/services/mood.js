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
				// TODO: import net? can we call net from there?
				// TODO: figure out if we need one neural network or two.
				$http.get('/learn/data?song=' + encodeURIComponent(song)).then(function(res) {

					// const output = net.run(song.analysis);
					// let output2 = net2.run(song.analysis);
					// TODO: add these things to our song data in database. returning to be saved in db? 
					// TODO: add mongo functions. Assuming mongo functions are called from outside?

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
						{mood: 'Sensual', energy: 0.50 , valence: 0.50, distance: 1},
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

					for (let i = 0; i < moods.length; i++) {
						moods[i].distance = Math.sqrt(Math.pow(moods[i].energy - res.body.output.energy_level, 2) + Math.pow(moods[i].valence - res.body.output.valence_level, 2));
					}

					moods.sort(function(a, b) {
						const c = a.distance - b.distance;
						if (c === 0) {
							if (a.mood === "Sensual") { return -1; }
							else if (b.mood === "Sensual") { return 1; }
							else if (a.mood === "Tender") { return -1; } 
							else if (b.mood === "Tender") { return 1; } 
							else if (a.mood === "Stirring") { return -1; }
							else if (b.mood === "Stirring") { return 1; }
							else if (a.mood === "Melancholy") { return -1; }
							else if (b.mood === "Melancholy") { return 1; }
							else if (a.mood === "Anxious") { return -1; }
							else if (b.mood === "Anxious") { return 1; }
							else if (a.mood === "Peaceful") { return -1; }
							else if (b.mood === "Peaceful") { return 1; }
							else if (a.mood === "Content") { return -1; }
							else if (b.mood === "Content") { return 1; }
							else if (a.mood === "Empowering") { return -1; }
							else if (b.mood === "Empowering") { return 1; }
							else if (a.mood === "Sentimental") { return -1; }
							else if (b.mood === "Sentimental") { return 1; }
							else if (a.mood === "Energizing") { return -1; }
							else if (b.mood === "Energizing") { return 1; }
							else if (a.mood === "Somber") { return -1; }
							else if (b.mood === "Somber") { return 1; }
							else if (a.mood === "Brooding") { return -1; }
							else if (b.mood === "Brooding") { return 1; }
							else if (a.mood === "Aggressive") { return -1; }
							else if (b.mood === "Aggressive"){ return 1; } 
						}
						return c;
					});

					return moods;
				
				});	
			}
		};
	});
})();