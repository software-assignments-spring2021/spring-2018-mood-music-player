const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

const Playlist = require('./playlist.js');

const User = new mongoose.Schema({
	username: {type: String, required: true},
	name: {type: String},
	dob: {type: String},
	// If we do not add a song schema, please replace this with a reference to whatever API we use.z
	songs:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}],
	
	//Reference: 
	playlists: [{type: mongoose.Schema.Types.ObjectId, ref: 'Playlist'}],
	
	// Embedded:
	// playlists: [Playlist],

	// If we want to implement this stuff.
	friends:  [{type: mongoose.Schema.Types.ObjectId}],
});

User.plugin(passportLocalMongoose);
User.plugin(URLSlugs('username'));

module.exports = mongoose.model('User', User);
