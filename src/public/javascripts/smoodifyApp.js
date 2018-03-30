var app = angular.module('smoodifyApp', ['ngRoute', 'ngResource', 'angularCSS', 'ngCookies']).run(function($rootScope, $http, $cookies, $location) {
	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		// var for user stored in session cookie
		let user = '';
		if (typeof $cookies['user'] == 'string' && $cookies['user'] != '') {
			user = JSON.parse($cookies['user'])
		}

		console.log('grabbing cookie');
		if (user == '') {
			$rootScope.authenticated = false;
			$rootScope.current_user = '';
			console.log('not auth\'d');
		}
		// logged in session exists, set current user as authenticated
		else {
			console.log('yes auth\'d');
			$rootScope.authenticated = true;
			$rootScope.current_user = user;
		}

		if ($cookies.token === undefined) {
			$cookies.token = '';
			$rootScope.has_token = false;
		}
	});

	// TODO: Location change success
	$rootScope.$on('$locationChangeSuccess', function (angularEvent, newUrl, oldUrl) {
		console.log($cookies.token);
		// if we just redirected from gaining the access token, save it to $cookies and $rootScope
		if (oldUrl.includes('access_token')) {
			if ($cookies.token === '') {	// if it hasn't been set yet, set it
				let path = oldUrl.substring(oldUrl.indexOf('access_token')).split('&');
				$cookies.token = path[0].split('=')[1];
				$cookies.token_exp = path[2].split('=')[1];	
				$rootScope.token = $cookies.token;
				$rootScope.token_exp = $cookies.token_exp;
				$rootScope.has_token = true;
			}
			$location.path('/');	// redirect to main
		}
	});

	$rootScope.signout = function(){
		console.log('got into signout');
		if (typeof($cookies['user']) == 'string') {
			$http.get('auth/signout');
			$rootScope.authenticated = false;
			$rootScope.current_user = '';
			$cookies['user'] = '' //, { path:'/', domain:'localhost'} this object may be necessary in some situations
			$cookies['token'] = '';	// erase token until next time (for debugging)
			console.log('removed cookie');
		}
	};
});

app.config(function($routeProvider, $locationProvider){
	$routeProvider
		// the landing display
		.when('/', {
			css: ['../stylesheets/login.css', '../stylesheets/base.css'],
			templateUrl: 'landing.html',
			controller: 'mainController'
		})
		// the login display
		.when('/login', {
			css: {
				href: '../stylesheets/login.css',
				preload: true
			},
			templateUrl: 'login.html',
			controller: 'authController'
		})
		// the signup display
		.when('/register', {
			css: {
				href: '../stylesheets/login.css',
				preload: true
			},
			templateUrl: 'register.html',
			controller: 'authController',
		})
		.when('/saved', {
			css: {
				href: '../stylesheets/base.css',
				preload: true
			},
			templateUrl: 'saved_music.html',
			controller: 'browseController'
		})
		.when('/spotify_login', {
			templateUrl: 'main.html',
			controller: 'spotifyController'
		})
		.when('/account', {
			css: ['../stylesheets/login.css', '../stylesheets/base.css'],
			templateUrl: 'account.html',
			controller: 'mainController'
		});
	$locationProvider.html5Mode({requireBase: false});
});

app.controller('mainController', function($scope, $rootScope, $window, $location){
});

/* Currently separated browse page into browseController. Merge with mainController later */
app.controller('browseController', function($scope, $http, $cookies, $rootScope, $window, $q){
  /* created spotify web sdk playback code into a ng-click function called by clicking a temp button in main.html */
  /* TODO: Going to need to make token dynamic in that it obtains the current users token. Code once CORS Issue is solved.*/
	var device = "";
	const token = $cookies.token;	
	const player = new Spotify.Player({
		name: 'Smoodify',
		getOAuthToken: cb => { cb(token); }
	});
  
	// Error handling
	player.addListener('initialization_error', ({ message }) => { console.error(message); });
	player.addListener('authentication_error', ({ message }) => { console.error(message); });
	player.addListener('account_error', ({ message }) => { console.error(message); });
	player.addListener('playback_error', ({ message }) => { console.error(message); });

	// Playback status updates
	player.addListener('player_state_changed', state => { console.log(state.shuffle); });

	// Ready
	player.addListener('ready', ({ device_id }) => {
		device = device_id;
		console.log('Ready with Device ID', device_id);
		/* Code to play from our device */
		$http.put('/musicplayer/?action=transfer&token=' + token + "&device=" + device, {
		});

		$http.get(apiBaseUrl + 'me/tracks?offset=0&limit=50', {
			headers: {
				'Authorization': 'Bearer ' + $cookies.token
			}
		}).then(function(data) {
			if (data.items) {
				data.items.forEach((ele) => {
					allTracks.push(ele.track);
				});
			}
			var songsLeft = data.data.total;
			for (var offset = 0; offset <= songsLeft; offset = offset + 50) {
				getTracks(offset);
			}
		}).then(function() {
			$scope.songs = allTracks;
			// $scope.song = allTracks[0];
			console.log($scope.songs);
			$scope.getSongAnalysis();
		});

		/* Initialize the player volume to our volume bar's starting point */
		player.setVolume(0.5).then(() => {
			console.log('Volume updated!');
		});
	});

	// Connect to the player!

	player.connect().then(success => {
		if (success) {
			console.log('The Web Playback SDK successfully connected to Spotify!');
	  	}
	});




	/* Play a song. Trigger this function when play button is pressed */
	$scope.play = function() {
		
	
		player.togglePlay().then(() => {
			console.log('Toggle Button Fired');
					/* code to get the metadata of the song currently playing */
			player.getCurrentState().then(state => {
				if (!state) {
					console.error('User is not playing music through the Web Playback SDK');
					return;
				}
				
				let {
					current_track,
					next_tracks: [next_track]
				} = state.track_window;
				
				console.log('Currently Playing', current_track);

				/* scope variables to send back to html */
				$scope.imgSrc = current_track.album.images[0].url;
				/* Code to change the title <p> tag to the current song title. */
				$scope.songTitle = current_track.name;
				$scope.artistName = current_track.artists[0].name;
				$scope.albumName = current_track.album.name;
			});

			/* input variable to go into gracenote API separated by '-' */
			//var paramString = "/gracenote/" + $scope.artistName + "-" + $scope.albumName + "-" + $scope.songTitle;
			/* send data to back end */
			// $http.get(paramString).success(function(data) {
			// 	/* data variable currently holds the mood from gracenote */
			// 	/* TODO: Currently first return is undefined, fix once we have the song list */
			// 	$scope.data = data;
			// 	console.log(data);
			// })
		});
	};

	/* Go back to previous song. Trigger this function when previous button is clicked */
	$scope.previous = function() {		

		$http.post('/musicplayer/?action=previous&token=' + token, {
		})
		
		player.getCurrentState().then(state => {
			if (!state) {
				console.error('User is not playing music through the Web Playback SDK');
				return;
			}
				
			let {
				current_track,
				next_tracks: [next_track]
			} = state.track_window;
				
			console.log('Currently Playing', current_track.name);
			console.log('Playing Next', next_track);
				/* scope variables to send back to html */
			$scope.imgSrc = current_track.album.images[0].url;
			/* Code to change the title <p> tag to the current song title. */
			$scope.songTitle = current_track.name;
			$scope.artistName = current_track.artists[0].name;
		});
	};
  
	/* Skip song. Trigger this function when skip button is pressed */
	$scope.skip = function() {


		$http.post('/musicplayer/?action=next&token=' + token, {
		})



		player.getCurrentState().then(state => {
			if (!state) {
				console.error('User is not playing music through the Web Playback SDK');
				return;
			}
				
			let {
				current_track,
				next_tracks: [next_track]
			} = state.track_window;

			/* scope variables to send back to html */
			$scope.imgSrc = current_track.album.images[0].url;
			/* Code to change the title <p> tag to the current song title. */
			$scope.songTitle = current_track.name;
			$scope.artistName = current_track.artists[0].name;
		});
	};

	
	/* Make setVolume parameter to the value you get from volume bar */
	$scope.mute = function() {
		player.getVolume().then(volume => {
			let volume_percentage = volume * 100;
			if (volume_percentage == 0) {
				player.setVolume(($scope.vol) / 100).then(() => {
					console.log('Volume updated!');
				});
			} else {
				player.setVolume(0).then(() => {
					console.log('Volume updated!');
				});
			}
		});
	};

	/* Make setVolume parameter to the value you get from volume bar */
	$scope.setVolume = function() {
		player.setVolume(($scope.vol) / 100).then(() => {
			console.log('Volume updated!');
		});
	};
  
	var apiBaseUrl= 'https://api.spotify.com/v1/';
	var allTracks = [];
	var allIds = [];
	var allFeatures = [];



	var getTracks = function(offset){
		$http.get(apiBaseUrl + 'me/tracks?offset=' + offset + '&limit=50', {
			headers: {
				'Authorization': 'Bearer ' + $cookies.token
			}
		}).success(function(data) {
			if (data.items) {
				data.items.forEach((ele) => {
					allTracks.push(ele.track);
				});
			}
		}).error(function(data){
			console.log('offset', offset, 'broke');
		}); 
	}

	var getFeatures = function(ids, i){
		$http.get(apiBaseUrl + 'audio-features/?ids=' + ids, {
			headers: {
				'Authorization': 'Bearer ' + $cookies.token
			}
		}).success(function(data) {
			allFeatures.push.apply(allFeatures, data.audio_features);
		}).error(function(data){
			console.log(i, 'broke');
		}); 
	}

	$scope.shuffle = function() {
		$scope.getPlayerStates()
		console.log($scope.PlayerObject);
		if (player.shuffle_state === false) {

		} else {

		}
	}

	$scope.getPlayerStates = function() {
		$http.get(apiBaseUrl + 'me/player', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + $cookies.token
			}
		}).then(function(data) {
			$scope.PlayerObject = data;
		});
	}

	$scope.getSongAnalysis = function() {
		for (var i = 0; i < allTracks.length; i++) {
			allIds.push(allTracks[i].id);
		}
		$http.get(apiBaseUrl + 'audio-features/?ids=' + allIds.slice(0,100).join(), {
			headers: {
				'Authorization': 'Bearer ' + $cookies.token
			}
		}).then(function(data) {
			for (var i = 0; i < allIds.length; i += 100) {
				var end;
				if (i + 100 >= allIds.length) {
					end = allIds.length - i;
				} else {
					end = i + 100;
				}
				var ids = allIds.slice(i, end);
				getFeatures(ids.join(), i);
			}
		}).then(function() {
			// pair allTracks and allFeatures based on song id and create song object then save to db
		});
	}


	$scope.playSong = function(song_uri) {
		console.log(song_uri);
		$http.put('/musicplayer/?action=play&?token=' + token + "&device=" + device + "&song_uri=" + song_uri, {
			
		});
	}


});

// Controller for spotify login. Currently giving a CORS Error 
app.controller('spotifyController', function($scope, $http, $location, $window) {
		/* Spotify Login API Code */
		const authEndpoint = 'https://accounts.spotify.com/authorize';

		// Replace with your app's client ID, redirect URI and desired scopes
		const clientId = 'dcddb8d13b2f4019a1dadb4b4c070661';
		const redirectUri = 'http://localhost:3000/';
		const scopes = [
			'user-read-birthdate',
			'user-read-email',
			'user-read-private',
			'playlist-read-private',
			'user-top-read',
			'user-library-read',
			'playlist-modify-private',
			'user-read-currently-playing',
			'user-read-recently-played',
			'user-modify-playback-state',
			'user-read-playback-state',
			'user-library-modify',
			'streaming',
			'playlist-modify-public'
		];

		window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;

	$scope.scopes = 'user-read-birthdate user-read-email user-read-private playlist-read-private user-top-read user-library-read playlist-modify-private user-read-currently-playing user-read-recently-played user-modify-playback-state user-read-playback-state user-library-modify streaming playlist-modify-public';

	$http.get('https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' + 'dcddb8d13b2f4019a1dadb4b4c070661' +
      ($scope.scopes ? '&scope=' + encodeURIComponent($scope.scopes) : '') +
			'&redirect_uri=' + encodeURIComponent('http://localhost:3000'))
			.then(function(response) {
				$scope.my_data = response.data;
	});
});

// TODO
app.controller('accountController', function(songService, $scope, $rootScope){
});

// Controller used for loging in and registering using Passport
app.controller('authController', function($scope, $http, $rootScope, $location, $cookies){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';
	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.state == 'success'){
				$cookies['user'] = JSON.stringify(data.user);
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			} else{
				$scope.error_message = data.message;
			}
		});
	};
	$scope.register = function(){
		$http.post('/auth/signup', $scope.user).success(function(data){
			if(data.state == 'success'){
				$cookies['user'] = JSON.stringify(data.user);
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			} else{
				$scope.error_message = data.message;
			}
		});
	};
});
