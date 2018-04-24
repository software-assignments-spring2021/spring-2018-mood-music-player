const mongoose = require('mongoose');

const Song = new mongoose.Schema({
	name: {type: String, required: true},
	artist: [{
		name: {type: String, required: true},
		spotify_id: {type: String, required: true},
		spotify_uri: {type: String, required: true},
	}],
	album: {
		name: {type: String, required: true},
		images: [{
			height: {type: Number},
			width: {type: Number},
			url: {type: String}
		}],
		spotify_id: {type: String, required: true},
		spotify_uri: {type: String, required: true},
	},
	// This will be sorted with primary mood first.
	mood: [{ 
		mood: {type: String, required: true},
		energy: {type: String, required: true},
		valence: {type: String, required: true},
		distance: {type: Number, required: true}
	}],
	spotify_id: {type: String, required: true},
	spotify_uri: {type: String, required: true},
	duration_ms: {type: Number},
	analysis: {
		danceability: {type: Number},
		energy: {type: Number},
		key: {type: Number},
		loudness: {type: Number},
		mode: {type: Number},	// major is represented by 1, minor is 0
		valence: {type: Number},
		tempo: {type: Number}
		// sentiment: {type: Number}
	}
});

module.exports = mongoose.model('Song', Song);