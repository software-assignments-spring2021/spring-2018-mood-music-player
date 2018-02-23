const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

// Everything references each other. Might have some spaghetti here... Hopefull won't be using this.

const Song = new mongoose.Schema({
	// song: {Some reference to Spotify API?},
	
	// if Spotify can't give anything. This is likely tentative,
	// I made this because it wouldn't run with the comment above.
	title: {type: String, required: true},
	artist: {type: String, required: true},
	genre: {type: String, required: true},
	album: {type: String, required: true},
	length: {type: String, required: true},
	
	// mood: [{type: String}]
	mood: [{ type: String, required: true }]
});

const Mood = new mongoose.Schema({
	type: {type: String, required: true},
	songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'song' }],
	
	// seems a bit thin.
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

const User = new mongoose.Schema({
	username: {type: String, required: true},
	name: {type: String},
	dob: {type: String},
	// If we do not add a song schema, please replace this with a reference to whatever API we use.z
	songs:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}],
	
	// Reference: playlists: [{type: mongoose.Schema.Types.ObjectId, ref: 'Playlist'}],
	
	// Embedded:
	playlists: [Playlist],

	// If we want to implement this stuff.
	friends:  [{type: mongoose.Schema.Types.ObjectId}],
});

// add remainder of setup for slugs, connection, registering models, etc. below

mongoose.model('Song', Song);
mongoose.model('Mood', Mood);
mongoose.model('Playlist', Playlist);
mongoose.model('User', User);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
	// if we're in PRODUCTION mode, then read the configration from a file
	// use blocking file io to do this...
	const fs = require('fs');
	const path = require('path');
	const fn = path.join(__dirname, 'config.json');
	const data = fs.readFileSync(fn);
	// our configuration file will be in json, so parse it and set the
	// conenction string appropriately!
	const conf = JSON.parse(data);
	dbconf = conf.dbconf;
} else {
	// if we're not in PRODUCTION mode, then use
	dbconf = 'mongodb://localhost/rc3009';
}

mongoose.connect(dbconf);
