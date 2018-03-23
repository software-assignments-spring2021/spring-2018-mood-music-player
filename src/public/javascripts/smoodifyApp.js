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
	
	$rootScope.$on('$locationChangeSuccess', function (angularEvent, newUrl, oldUrl) {
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
		}).when('/spotify_login', {
			css: {
				/* Code to get to Spotify Login */
			},
			templateUrl: 'main.html',
			controller: 'spotifyController'
		})
		.when('/get_token', {
			css: {

			}, 
			templateUrl: 'main.html',
			controller: 'tokenController'
		})
		.when('/account', {
			css: ['../stylesheets/login.css', '../stylesheets/base.css'],
			templateUrl: 'account.html',
			controller: 'accountController'
		});
	
	$locationProvider.html5Mode({requireBase: false});
});

app.factory('songService', function($resource) {
	return $resource ('api/songs');
});

app.controller('mainController', function(songService, $scope, $rootScope, $window, $location){
	$scope.songs = songService.query();

	$scope.post = function() {
	  $scope.newSong.title = $scope.new.title;
	  $scope.newSong.artist = $scope.new.artist;
	  songService.save($scope.newSong, function(){
	    $scope.songs = songService.query();
	    $scope.newSong = {title: '', artist: ''};
	  });
	};
});

/* Currently separated browse page into browseController. Merge with mainController later */
app.controller('browseController', function(songService, $scope, $rootScope, $window){
	$scope.songs = songService.query();

	$scope.post = function() {
		$scope.newSong.title = $scope.new.title;
		$scope.newSong.artist = $scope.new.artist;
		songService.save($scope.newSong, function(){
			$scope.songs = songService.query();
			$scope.newSong = {title: '', artist: ''};
		});
	};
		
  /* created spotify web sdk playback code into a ng-click function called by clicking a temp button in main.html */
  /* TODO: Going to need to make token dynamic in that it obtains the current users token. Code once CORS Issue is solved.*/
  const token = 'BQAVE_hQEmioWCyzUY9ckY5pnQwmRBlqf6D49S7HF2nma85VDNhXs_xFQtFH62WjNwgJuTH27k8Evn10WscBDz5oLll4cT1Xh_UldBNisClbjTwqvF16ttOfZVRJ5id-fOEk06-nb8yPoVhTGXLlH3A-5bpNc8xEHfuL';
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
  player.addListener('player_state_changed', state => { console.log(state); });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });

  // Connect to the player!
	player.connect().then(success => {
		if (success) {
			console.log('The Web Playback SDK successfully connected to Spotify!');
	  }
	})

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
				
				console.log('Currently Playing', current_track.name);

				/* scope variables to send back to html */
				$scope.imgSrc = current_track.album.images[0].url;
				/* Code to change the title <p> tag to the current song title. */
				$scope.songTitle = current_track.name;
				$scope.artistName = current_track.artists[0].name;
			});
		});


	};

	/* Go back to previous song. Trigger this function when previous button is clicked */
	$scope.previous = function() {		
		player.previousTrack().then(() => {
			console.log('Previous');
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
				
				console.log('Currently Playing', current_track.name);
				console.log('Playing Next', next_track);

				/* scope variables to send back to html */
				$scope.imgSrc = current_track.album.images[0].url;
				/* Code to change the title <p> tag to the current song title. */
				$scope.songTitle = current_track.name;
				$scope.artistName = current_track.artists[0].name;
			});
		});


	};

	/* Skip song. Trigger this function when skip button is pressed */
	$scope.skip = function() {
		player.nextTrack().then(() => {
			console.log('Skip');
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
				
				console.log('Currently Playing', current_track.name);
				console.log('Playing Next', next_track);

				/* scope variables to send back to html */
				$scope.imgSrc = current_track.album.images[0].url;
				/* Code to change the title <p> tag to the current song title. */
				$scope.songTitle = current_track.name;
				$scope.artistName = current_track.artists[0].name;
			});
		});


	};

	/* Make setVolume parameter to the value you get from volume bar */
	$scope.setVolume = function() {
		player.setVolume($scope.vol.value).then(() => {
			console.log('Volume updated!');
		});
	};


});

app.controller('tokenController', function($rootScope, $location, $window) {
	console.log('hi');
	console.log(window.location.path);
	// console.log(window.location);
});

/* controller for spotify login. Currently giving a CORS Error */
app.controller('spotifyController', function($scope, $http, $location, $window) {
		/* Spotify Login API Code */
		const hash = window.location.hash
		.substring(1)
		.split('&')
		.reduce(function (initial, item) {
			if (item) {
				var parts = item.split('=');
				initial[parts[0]] = decodeURIComponent(parts[1]);
			}
			return initial;
		}, {});
		window.location.hash = '';

		// Set token
		let _token = hash.access_token;
		console.log(_token);
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

		// If there is no token, redirect to Spotify authorization
		if (!_token) {
			window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
		}
});

app.controller('accountController', function(songService, $scope, $rootScope){
});

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
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});