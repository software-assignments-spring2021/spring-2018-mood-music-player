const lyric = require('lyric-get');
const sentiment = require('sentiment');
const express = require('express');
const router = express.Router();

module.exports = function() {
	// sends successful login state back to angular
	router.get('/', function(req, res) {
		// https://github.com/rhnvrm/lyric-api
		lyric.get(req.query.artist, req.query.title, function(err, res){
			if (err) {
				console.log(err);
			} else {
				// sentiment API
				const r1 = sentiment(res.lyric);
				res.send({sentiment: r1, lyric: res.lyric});
			}
		});
	});

	return router;
};