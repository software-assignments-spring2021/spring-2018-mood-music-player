var express = require('express');
var router = express.Router();
var request = require('request');

    

router.get('/', function(req, res){
    res.send('respond with a resource');
});


/* Code to skip to next song */

router.post('/:id', function(req,res) {
    var token = req.params.id;
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

    request(options, callback);
   
});







/* Code to Play from our device */

router.put('/:token', function(req, res) {
    var deviceProperties = req.params.token.split(" ");
    var token = deviceProperties[0];
    var device = deviceProperties[1];

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
    
    request(options, callback);
})

module.exports = router;
