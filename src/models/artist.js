const mongoose = require('mongoose');

const Artist = new mongoose.Schema({
	name: {type: String, required: true},
	album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
	images: [{
		height: {type: Number},
		width: {type: Number},
		url: {type: String}
	}],
	songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Songs' }],
	genres: [{ type: String, required: true }],
	spotify_id: {type: String, required: true},
	spotify_uri: {type: String, required: true},
});

module.exports = mongoose.model('Artist', Artist);