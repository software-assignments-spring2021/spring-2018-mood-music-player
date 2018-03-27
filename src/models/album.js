const mongoose = require('mongoose');

const Album = new mongoose.Schema({
	name: {type: String, required: true},
	artist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
	images: [{
		height: {type: Number},
		width: {type: Number},
		url: {type: String}
	}],
	spotify_id: {type: String, required: true},
	spotify_uri: {type: String, required: true},
});

module.exports = mongoose.model('Album', Album);