var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Song = mongoose.model('Song');
//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/songs', isAuthenticated);

router.route('/songs')
	//creates a new song
	.post(function(req, res){
		console.log(req.body);
		const song = new Song();
		song.title = req.body.title;
		song.artist = req.body.artist;
		
		song.save(function(err, song) {
			if (err){
				return res.send(500, err);
			}
			return res.json(song);
		});
	})
	//gets all songs
	.get(function(req, res){
		Song.find(function(err, songs){
			if(err){
				return res.send(500, err);
			}
			return res.send(200,songs);
		});
	});

module.exports = router;