(function() {

	var module = angular.module('smoodifyApp');
	var max_valence, min_valence, max_energy, min_energy;
    
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
				var ret = $q.defer();
				$http.get('/learn/data?song=' + encodeURIComponent(JSON.stringify(song))).then(function(res) {
					let energy_level = .5;
					let valence_level = .5;

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

					for (i in res.data.output) {
						if (res.data.output.i === 1) {
							for (let j = 0; j < moods.length; j++) {
								if (i === moods[j].mood) {
									energy_level = moods[j].energy;
									valence_level = moods[j].valence;
								}
							}
						} break;
					}

					for (let i = 0; i < moods.length; i++) {
						moods[i].distance = Math.sqrt(Math.pow(moods[i].energy - res.data.output.energy_level, 2) + Math.pow(moods[i].valence - res.data.output.valence_level, 2));
					}

					moods.sort(function(a, b) {
						const c = a.distance - b.distance;
						if (c === 0) {
							if (a.mood === "Tender") { return -1; } 
							else if (b.mood === "Tender") { return 1; } 
							else if (a.mood === "Stirring") { return -1; }
							else if (b.mood === "Stirring") { return 1; }
							else if (a.mood === "Melancholy") { return -1; }
							else if (b.mood === "Melancholy") { return 1; }
							else if (a.mood === "Anxious") { return -1; }
							else if (b.mood === "Anxious") { return 1; }
							else if (a.mood === "Sensual") { return -1; }
							else if (b.mood === "Sensual") { return 1; }
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
					ret.resolve(moods);
				});	
				return ret.promise;
			},

			getSongWithMood: function(song) {
				var ret = $q.defer();
				this.getNetMood(song).then(function(moods) {
					song.moods = moods;
					console.log(moods);
					ret.resolve(song);
				});
				return ret.promise;
			},

			getAlgoMood: function(song) {
				const valence_level = (song.analysis.valence - min_valence)/(max_valence - min_valence);
				const energy_level = (song.analysis.energy - min_energy)/(max_energy - min_energy);
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
					moods[i].distance = Math.sqrt(Math.pow(moods[i].energy - energy_level, 2) + Math.pow(moods[i].valence - valence_level, 2));
				}

				moods.sort(function(a, b) {
					const c = a.distance - b.distance;
					if (c === 0) {
						if (a.mood === "Tender") { return -1; } 
						else if (b.mood === "Tender") { return 1; } 
						else if (a.mood === "Stirring") { return -1; }
						else if (b.mood === "Stirring") { return 1; }
						else if (a.mood === "Melancholy") { return -1; }
						else if (b.mood === "Melancholy") { return 1; }
						else if (a.mood === "Anxious") { return -1; }
						else if (b.mood === "Anxious") { return 1; }
						else if (a.mood === "Sensual") { return -1; }
						else if (b.mood === "Sensual") { return 1; }
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
			},

			getSongWithAlgoMood: function(song) {
				song.moods = this.getAlgoMood(song);
				return song;
			},

			getSongsByMood: function(mood, song) {
				let songs = $rootScope.songsByMood[mood];
				let currentIndex = songs.length, temporaryValue, randomIndex;

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {

					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = songs[currentIndex];
					songs[currentIndex] = songs[randomIndex];
					songs[randomIndex] = temporaryValue;
				}

				if (song) {
					for (let i = 0; i < songs.length; i++) {
						if (songs[i].spotify_uri === song.spotify_uri) {
							songs.splice(i, 1);
							break;
						}
					}
				}

				return songs;
			},

			hasMood: function(mood) {
				let songs = $rootScope.songsByMood[mood];
				if (songs.length > 0) {
					return true;
				} else {
					return false;
				}
			},

			getMaxMin: function(songs) {
				max_valence = 0;
				max_energy = 0;
				min_valence = 1;
				min_energy = 1;
				for (let i = 0; i < songs.length; i++) {
					if (songs[i].analysis.energy > max_energy) {
						max_energy = songs[i].analysis.energy;
					}
					if (songs[i].analysis.valence > max_valence) {
						max_valence = songs[i].analysis.valence;
					}
					if (songs[i].analysis.energy < min_energy) {
						min_energy = songs[i].analysis.energy;
					}
					if (songs[i].analysis.valence < min_valence) {
						min_valence = songs[i].analysis.valence;
					}
				}
			}
		};
	});
})();