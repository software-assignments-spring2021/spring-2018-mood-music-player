var express = require('express');
var router = express.Router();
var request = require('request');

router.put('/', function(req, res){
    var action = req.query.action;
    var token = req.query.token;
    var device = req.query.device;
    var song_uri = req.query.song_uri;
    var shuffle = req.query.shuffle;
    /* TODO Work on this Right Now */
    if (action === "play") {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        
        var dataString = '{context_uri: "' + song_uri + '"}';
        
        var options = {
            url: 'https://api.spotify.com/v1/me/player/play',
            method: 'PUT',
            headers: headers,
            body: dataString
        };
        
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }

    } else if (action === "transfer") {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        
        var dataString = '{"device_ids":["' + device + '"]}';
        var options = {
            url: 'https://api.spotify.com/v1/me/player',
            method: 'PUT',
            headers: headers,
            body: dataString
        };
        
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    } else if (action === "shuffle") {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        
        var options = {
            url: 'https://api.spotify.com/v1/me/player/shuffle?state=' + shuffle,
            method: 'PUT',
            headers: headers,
        };
        
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    } else if (action === "updatePlayerStatus") {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
        
        var options = {
            url: 'https://api.spotify.com/v1/me/player/shuffle?state=' + shuffle,
            method: 'PUT',
            headers: headers,
        };
        
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    }

    request(options, callback);
});


/* Code to skip to next song */
router.post('/', function(req,res) {
    var action = req.query.action;
    var token = req.query.token;
    var device = req.query.device;
    var song_uri = req.query.song_uri;

    if (action === "next") {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
    
        var options = {
            url: 'https://api.spotify.com/v1/me/player/next',
            method: 'POST',
            headers: headers
        };
    
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    } else if (action === "previous") {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
    
        var options = {
            url: 'https://api.spotify.com/v1/me/player/previous',
            method: 'POST',
            headers: headers
        };
    
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    }

    request(options, callback);
});





module.exports = router;
