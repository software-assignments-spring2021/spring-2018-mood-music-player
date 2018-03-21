const mongoose = require('mongoose');


const Song = new mongoose.Schema({
	// song: {Some reference to Spotify API?},
	
	// if Spotify can't give anything. This is likely tentative,
	// I made this because it wouldn't run with the comment above.
	title: {type: String, required: true},
	artist: {type: String, required: true},
	genre: {type: String, required: true},
	album: {type: String, required: true},
	length: {type: String, required: true},
	mood: [{ type: String, required: true }]
});


module.exports = mongoose.model('Song', Song);
