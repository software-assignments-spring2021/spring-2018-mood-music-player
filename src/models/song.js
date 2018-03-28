const mongoose = require('mongoose');

const Song = new mongoose.Schema({
	name: {type: String, required: true},
	artist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
	album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
	length: {type: String, required: true},
	mood: [{ type: String, required: true }],
	spotify_id: {type: String, required: true},
	spotify_uri: {type: String, required: true},
	duration_ms: {type: Number},
	analysis: {
		danceability: {type: Number},
		energy: {type: Number},
		key: {type: Number},
		loudness: {type: Number},
		mode: {type: Number},	// major is represented by 1, minor is 0
		speechiness: {type: Number},
		acousticness: {type: Number},
		instrumentalness: {type: Number},
		valence: {type: Number},
		tempo: {type: Number},
	}
});

module.exports = mongoose.model('Song', Song);