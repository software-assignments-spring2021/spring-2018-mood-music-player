const lyric = require('lyric-get');
const sentiment = require('sentiment');
const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	// https://github.com/rhnvrm/lyric-api
	var artist = req.query.artist;
	var song = req.query.song;
	lyric.get(artist, song, function(err, response) {
		if (err) {
			console.log(err);
		} else {
			// sentiment API
			const r1 = sentiment(response);
			res.send({sentiment: r1, lyric: response});
		}
	});
});

module.exports = router;