const mongoose = require('mongoose');

// We want this so we can quickly find another song with an associated mood.
const Mood = new mongoose.Schema({
	mood: {type: String, required: true},
	songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

module.exports = mongoose.model('Mood', Mood);
