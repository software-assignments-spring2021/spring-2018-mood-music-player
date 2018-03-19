const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

const Mood = new mongoose.Schema({
	type: {type: String, required: true},
	songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'song' }]
});

const Playlist = new mongoose.Schema({
	name: {type: String, required: true},
	mood: [{type: mongoose.Schema.Types.ObjectId, ref: 'Mood' }],
	songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],

	// If we want to track who a playlist belongs to and what time it was made,
	// in the case that playlists can be shared and made public. 
	
	// users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	// datetime: {type: Date, required: true},
});

const Song = new mongoose.Schema({
	// song: {Some reference to Spotify API?},
	
	// if Spotify can't give anything. This is likely tentative,
	// I made this because it wouldn't run with the comment above.
	title: {type: String, required: true},
	artist: {type: String, required: true},
	// genre: {type: String, required: true},
	album: {type: String, required: true},
	// length: {type: String, required: true},
	
	// mood: [{type: String}]
	mood: [{ type: String, required: true }]
});

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


mongoose.model('Mood', Mood);
mongoose.model('Song', Song);
mongoose.model('Playlist', Playlist);
mongoose.model('User', User);

//utility functions
const userModel = mongoose.model('User');

exports.findByUsername = function(username, callback){
	userModel.findOne({ user_name: username}, function(err, user){
		if(err){
			return callback(err);
		}
		return callback(null, user);
	});

}

exports.findById = function(id, callback){
	userModel.findById(id, function(err, user){
		if(err){
			return callback(err);
		}
		return callback(null, user);
	});
}