var express = require('express');
var router = express.Router();
var gracenote = require('node-gracenote');

var clientId = process.env.GN_CLIENT_ID || require('../config.js').gracenoteClientId;
var clientTag = process.env.GN_TAG || require('../config.js').gracenoteTag;
var userId = process.env.GN_USER_ID || require('../config.js').gracenoteUserId;
var api = new gracenote(clientId,clientTag,userId);

// router.get('/', function(req, res){
// 	res.send('respond with a resource');
// });

/* code to send gracenote API results back to angular */
router.get('/', function(req, res) {
	var artist = req.query.artist;
	var album = req.query.album;
	var song = req.query.song;
	
	api.searchTrack(artist, album, song, function(err, result) {
		// Search Result as array
		// console.log(result[0].tracks[0].mood[0].text);
		
		res.send(result[0].tracks[0].mood[0].text);
	}, {matchMode: gracenote.BEST_MATCH_ONLY});
});

module.exports = router;