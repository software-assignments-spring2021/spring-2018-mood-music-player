const express = require('express');
const router = express.Router();
const Song = require('../models/song');
const Mood = require('../models/mood');
const User = require('../models/user');

router.post('/artist', function(req, res) {
	var name = req.query.name;
	var id = req.query.id;
	var uri = req.query.uri;

	Artist.findOne({spotify_id:id}, function(err, artist) {
		if (err) {
			console.log(err);
		} else if (!artist) {
			const artist = new Artist({
				name: name,
				spotify_id: id,
				spotify_uri: uri
			});

			artist.save(function(err, art) {
				if (err) {
					console.log(err);
				} else {
					// console.log(artist);
					res.json(art);
				}
			});
		}
	});
});


router.post('/album', function(req, res) {
	var name = req.query.name;
	var artists = req.query.artist.split('+');
	var id = req.query.id;
	var uri = req.query.uri;
	
	Album.findOne({spotify_id:id}, function(err, album) {
		if (err) {
			console.log(err);
		} else if (album === null) {
			const album = new Album({
				name: name,
				artist: artists,
				spotify_id: id,
				spotify_uri: uri

			});
			album.save(function(err, a) {
				if (err) {
					console.log(err);
				} else {
					res.json(a);
				}
			});
		}
	});
});
	
	
router.post('/song/:data', function(req, res) {
	const data = JSON.parse(decodeURIComponent(req.params.data));
	Song.findOne({spotify_id:data.id}, function(err, song) {
		if (err) {
			console.log(err);
		} else if (song === null) {
			const song = new Song({
				name: data.name,
				artist: data.artist,
				album: data.album,
				//mood: //TODO 
				spotify_id: data.id,
				spotify_uri: data.uri,
				duration_ms: data.duration_ms
			});
			song.save(function(err, s) {
				if (err) {
					console.log(err);
				} else {
					// console.log(s);
					res.status(200).send(s);
				}
			});
		}
	});
});		


module.exports = router;