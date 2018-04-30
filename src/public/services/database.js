(function() {
    
	var module = angular.module('smoodifyApp');

	module.factory('DatabaseService', function($q, $http, $cookies, $rootScope, MoodService) {

		return {
			saveSongToUser: function(user, song) {
				var ret = $q.defer();
				// MoodService.getNetMood(song).then(function(mood) {
					// song.mood = mood;
					const query = '?user=' + encodeURIComponent(user) + '&song=' + encodeURIComponent(JSON.stringify(song));
					$http.post('/db/save/song/' + query).then(function(res) {
						ret.resolve(res);
					});
				// });

				return ret.promise;
			},	

			getSongsByMood: function(allSongs) {
				const globalMoods = {
					Somber: [], Ominous: [], Sentimental: [], Nostalgic: [], Peaceful: [], 
					Depressing: [], Melancholy: [], Mellow: [], Tender: [], Easygoing: [], 
					Brooding: [], Yearning: [], Sensual: [], Optimistic: [], Content: [], 
					Despair: [], Anxious: [], Chill: [], Stirring: [], Excited: [], 
					Aggressive: [], Angsty: [], Energizing: [], Upbeat: [], Empowering: []
				}
				if (!allSongs) {
					allSongs = $rootScope.current_user.saved_songs;
				}
				allSongs.forEach((s) => {
					globalMoods[s.mood[0].mood].push(s);
				});

				return globalMoods;
			},		
				

			getUser: function(username) {
				
				const query = '?user=' + encodeURIComponent(username);
				$http.get('/db/find/user' + query).then(function(res) {
					ret.resolve(res);
					console.log(res);
				});
				ret.promise.then(function(res) {
					return res.data;
				});
			}

		};
	});
})();