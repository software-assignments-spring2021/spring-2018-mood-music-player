const mongoose = require('mongoose');

const Mood = new mongoose.Schema({
	type: {type: String, required: true, default: ''},
	songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'song' }],
	
	// seems a bit thin.
});


module.exports = mongoose.model('Mood', Mood);
