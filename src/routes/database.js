const express = require('express');
const router = express.Router();
const Song = require('../models/song');
const User = require('../models/user');

// add song to user's saved songs
router.post('/save/song', function(req, res) {
	const user = req.query.user;
	const data = JSON.parse(decodeURIComponent(req.query.song));
	const song = new Song({
		name: data.name,
		artist: data.artist,
		album: data.album,
		spotify_id: data.id,
		spotify_uri: data.uri,
		duration_ms: data.duration_ms,
		analysis: data.analysis,
		mood: data.moods
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
					console.log(user.saved_songs.length + ' songs saved');
					res.status(200).send(user);
				}
			});
		}
	});
});

// find a user
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

module.exports = router;