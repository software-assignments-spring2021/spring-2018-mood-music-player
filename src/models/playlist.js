const mongoose = require('mongoose');

const Playlist = new mongoose.Schema({
	name: {type: String, required: true},
	mood: [{type: String, required: true}],
	songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],

	// If we want to track who a playlist belongs to and what time it was made,
	// in the case that playlists can be shared and made public. 
	
	// users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	// datetime: {type: Date, required: true},
});


module.exports = mongoose.model('Playlist', Playlist);
