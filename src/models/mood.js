const mongoose = require('mongoose');

const Mood = new mongoose.Schema({
	type: {type: String, required: true},
	songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
});


module.exports = mongoose.model('Mood', Mood);
