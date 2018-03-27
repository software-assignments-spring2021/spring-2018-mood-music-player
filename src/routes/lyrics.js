var lyric = require('lyric-get');
var sentiment = require('sentiment');
var express = require('express');
var router = express.Router();

module.exports = function(){

	//sends successful login state back to angular
	router.get('/lyrics', function(req, res){
		// todo: change the variables to equal the artist and title retrieved from spotify API. 
		var artist = 'Archive', title = 'Fuck U';
		// todo: get the artist, song name, from spotify api and place as parameters, make the parameters dynamic.
		// https://github.com/rhnvrm/lyric-api
		lyric.get(artist, title, function(err, res){
		    if (err) {
		        console.log(err);
		    }
		    else{
				var songLyrics = res;
				// sentiment API
				// TODO: make code better, make sentiment code separate from lyrics-api code, get lyrics from lyric-api to sentiment.
				var r1 = sentiment(songLyrics);
				console.log(r1);        // Score: -2, Comparative: -0.666
				res.send({sentiment: r1});
		    }
		});
	});

	return router;

}
