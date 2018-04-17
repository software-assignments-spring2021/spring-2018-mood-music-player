(function() {

	var module = angular.module('smoodifyApp');
    
	module.factory('Auth', function() {

		var CLIENT_ID = '';
		var REDIRECT_URI = '';

		if (location.host == 'localhost:3000') {
			CLIENT_ID =	'dcddb8d13b2f4019a1dadb4b4c070661';
			REDIRECT_URI = 'http://localhost:3000/spotify/callback';
		} else {
			/* change this once app is on heroku */
			CLIENT_ID = 'dcddb8d13b2f4019a1dadb4b4c070661';
			REDIRECT_URI = '';
		}
        
	});
});