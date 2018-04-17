const express = require('express');
const router = express.Router();
const Song = require('../models/song');
const User = require('../models/user');

// add song to db 
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

// add song to user's saved songs
router.post('/save/song', function(req, res) {
	const user = req.query.user;
	const data = JSON.parse(decodeURIComponent(req.query.song));
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
			User.findOneAndUpdate({username: user}, {
				$push: {
					saved_songs: song
				}
			},function(err, user) {
				if (err) {
					console.log(err);
				} else if (!user) {
					console.log('user not found');
					res.send({error: 'user not found'});
				} else {
					// console.log(song);
					console.log(user);
					res.status(200).send(user);
				}
			});
		}
	});
});

// find if song is in user's saved songs
router.get('/find/song/', function(req, res) {
	const user = req.query.user;
	const song = req.query.song;
	User.findOne({username: user}, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else if (!foundUser) {
			console.log('user ' + user + ' not found');
			res.send({error: 'user ' + user + ' not found'});
		} else {
			const savedSongs = foundUser.saved_songs;
			for (let i = 0; i < savedSongs.length; i++) {
				if (savedSongs[i].spotify_id === song) {
					console.log(savedSongs[i].name + ' found');
					res.status(200).send({found: true});
				}
			}
			res.status(200).send({found: false});
		}
	});
});

// get songs from a user's saved songs that share a mood
router.get('/find/mood', function(req, res) {
	const user = req.query.user;
	const mood = req.query.mood;
	User.findOne({username: user}, function(err, user) {

	});
});

router.get('/find/user', function(req, res) {
	const user = req.query.user;
	User.findOne({username: user}, function(err, user) {
		if (err) {
			console.log(err);
		} else if (!user) {
			res.status(200).send({error: 'user not found'});
		} else {
			res.status(200).send({user: user});
		}
	});
});

// update a song's mood for a user
router.post('/update/song-mood', function(req, res) {
	const mood = req.query.mood;
	const song = req.query.song;
	const user = req.query.user;

	User.findOne({username: user}, function(err, user) {

	});
});

module.exports = router;