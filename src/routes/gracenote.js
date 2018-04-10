const express = require('express');
const router = express.Router();
const gracenote = require('node-gracenote');

const clientId = process.env.GN_CLIENT_ID || require('../config.js').gracenoteClientId;
const clientTag = process.env.GN_TAG || require('../config.js').gracenoteTag;
const userId = process.env.GN_USER_ID || require('../config.js').gracenoteUserId;
const api = new gracenote(clientId,clientTag,userId);

module.exports = function() {
/* code to send gracenote API results back to angular */
	router.get('/', function(req, res) {
		api.searchTrack(req.query.artist, req.query.album, req.query.song, function(err, result) {		
			res.send(result[0].tracks[0].mood[0].text);
		}, {matchMode: gracenote.BEST_MATCH_ONLY});
	});

	return router;
};