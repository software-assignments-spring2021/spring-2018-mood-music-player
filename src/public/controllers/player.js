(function() {

    var module = angular.module('smoodifyApp');

    module.controller('PlayerController', function($scope, $http, $cookies) {
        /* created spotify web sdk playback code into a ng-click function called by clicking a temp button in main.html */
    /* TODO: Going to need to make token dynamic in that it obtains the current users token. Code once CORS Issue is solved.*/
        var device = '';
        const token = $cookies.token;
        $scope.player = new Spotify.Player({
            name: 'Smoodify',
            getOAuthToken: cb => { cb(token); }
        });
        
        
        // Error handling
        $scope.player.addListener('initialization_error', ({ message }) => { console.error(message); });
        $scope.player.addListener('authentication_error', ({ message }) => { console.error(message); });
        $scope.player.addListener('account_error', ({ message }) => { console.error(message); });
        $scope.player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        $scope.player.addListener('player_state_changed', state => { console.log(state.shuffle); });

        // Ready
        $scope.player.addListener('ready', ({ device_id }) => {
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
            $scope.player.setVolume(0.5).then(() => {
                console.log('Volume updated!');
            });
        });

        // Connect to the player!

        $scope.player.connect().then(success => {
            if (success) {
                console.log('The Web Playback SDK successfully connected to Spotify!');
            }
        });




        /* Play a song. Trigger this function when play button is pressed */
        $scope.play = function() {
            
            $scope.player.getCurrentState().then(state => {
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

            }).then(function() {
                $scope.player.togglePlay().then(() => {
                    console.log('Toggle Button Fired');
                    /* code to get the metadata of the song currently playing */
                    
        
                    /* input variable to go into gracenote API separated by '-' */
                    // var paramString = '/gracenote/' + $scope.artistName + '-' + $scope.albumName + '-' + $scope.songTitle;
                    // /* send data to back end */
                    // $http.get(paramString).success(function(data) {
                    //  /* data variable currently holds the mood from gracenote */
                    //  /* TODO: Currently first return is undefined, fix once we have the song list */
                    //  $scope.data = data;
                    //  console.log(data);
                    // });
                });
            }); 
            
        };

        /* Go back to previous song. Trigger this function when previous button is clicked */
        $scope.previous = function() {      
            $scope.player.getCurrentState().then(state => {
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

                $http.post('/musicplayer/?action=previous&token=' + token, {
                })
            });
        
        };

        /* Skip song. Trigger this function when skip button is pressed */
        $scope.skip = function() {
            $http.post('/musicplayer/?action=next&token=' + token, {
            }).then(function() {
                /* THIS .THEN IS NOT RUNNING */
                console.log("hi");
                $scope.player.getCurrentState().then(state => {
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
        $scope.mute = function() {
            $scope.player.getVolume().then(volume => {
                let volume_percentage = volume * 100;
                if (volume_percentage == 0) {
                    $scope.player.setVolume(($scope.vol) / 100).then(() => {
                        console.log('Volume updated!');
                    });
                } else {
                    $scope.player.setVolume(0).then(() => {
                        console.log('Volume updated!');
                    });
                }
            });
        };

        /* Make setVolume parameter to the value you get from volume bar */
        $scope.setVolume = function() {
            $scope.player.setVolume(($scope.vol) / 100).then(() => {
                console.log('Volume updated!');
            });
        };
        
        /* Getting data from Spotify */
        // TODO: Move to service
        var apiBaseUrl= 'https://api.spotify.com/v1/';
        
        /* Get current user's profile */
        var getUserProfile = function (){
            $http.get(apiBaseUrl + 'me/player', {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).success(function(data) {
                var userData = data;
            });
        }
            
        var allAlbums = [];

        /* Get current user's saved albums */
        var getAlbums = function(offset) {
            $http.get(apiBaseUrl + 'me/albums?offset=' + offset + '&limit=50', {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.token
                }
            }).success(function(data) {
                if (data.items) {
                    data.items.forEach((ele) => {
                        allAlbums.push(ele.album);
                    });
                }
            }).error(function() {
                console.log('offset', offset, 'broke');
            });
        };

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
            }).error(function(/* data */){
                console.log('offset', offset, 'broke');
            }); 
        };

        var getFeatures = function(ids, i){
            $http.get(apiBaseUrl + 'audio-features/?ids=' + ids, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.token
                }
            }).success(function(data) {
                allFeatures.push.apply(allFeatures, data.audio_features);
            }).error(function(/* data */){
                console.log(i, 'broke');
            }); 
        };

        var getSongAnalysis = function() {
            for (var i = 0; i < allTracks.length; i++) {
                allIds.push(allTracks[i].id);
            }
            $http.get(apiBaseUrl + 'audio-features/?ids=' + allIds.slice(0,100).join(), {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.token
                }
            }).then(function(/* data */) {
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
        };

        $scope.shuffle = function() {
            $http.get(apiBaseUrl + 'me/player', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + $cookies.token
                }
            }).then(function(data) {
                if (data.data.shuffle_state === false) {
                    $http.put('/musicplayer/?action=shuffle&token=' + token + "&device=" + device + "&shuffle=true", {
                
                    });
                } else {
                    $http.put('/musicplayer/?action=shuffle&token=' + token + "&device=" + device + "&shuffle=false", {
                
                    });
                }
            });
            
        }

        $scope.playSong = function(song_uri) {
            console.log(token);
            $http.put('/musicplayer/?action=play&token=' + token + "&device=" + device + "&song_uri=" + song_uri, {
                
            });
        }
    })
})();