// express setup
const express = require('express');
const app = express();

// setting path
const path = require('path');

// mongoose setup
const mongoose = require('mongoose');


// lyric-get api
var lyric = require('lyric-get');
var sentiment = require('sentiment');
// todo: change the variables to equal the artist and title retrieved from spotify API. 
var artist = 'Archive', title = 'Fuck U';

// todo: get the artist, song name, from spotify api and place as parameters, make the parameters dynamic.
// https://github.com/rhnvrm/lyric-api
lyric.get(artist, title, function(err, res){
    if (err) {
        console.log(err);
    }
    else{
		var songLyrics = res;

		// sentiment API
		// TODO: make code better, make sentiment code separate from lyrics-api code, get lyrics from lyric-api to sentiment.
		var r1 = sentiment(songLyrics);
		console.log(r1);        // Score: -2, Comparative: -0.666

    }
});



// GraceNote API
// TODO: fully integrate GraceNote

// var Gracenote = require("node-gracenote");
// var clientId2 = "526687528-85C47B0F083E1455C38E5A45FF411100";
// var clientTag = "85C47B0F083E1455C38E5A45FF411100";
// var userId = null;
// var api = new Gracenote(clientId2, clientTag,userId);
// api.register(function(err, uid) {
// 	// TODO: store this somewhere for the next session
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log("You are good");
// 	}
// }); 

var Gracenote = require("node-gracenote");
var clientId2 = "269157806-FD674712D1DBE1B15D6CA2D43C847587";
var clientTag = "FD674712D1DBE1B15D6CA2D43C847587";
var userId = "49920687231833180-86F326FBA4C5F2EC7AB23B34DC1FF8C2";
var api = new Gracenote(clientId2, clientTag, userId);
api.searchTrack("NSYNC", "No Strings Attached", "It's Gonna Be Me", function(err, result) {
	// Search Result as array
	if (err) {
		console.log(err);
	} else {
		console.log(result[1]);
	}
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files 	
app.use(express.static(path.join(__dirname, 'public')));

// sessions setup
const session = require('express-session');
const sessionOptions = {
	secret: 'secret cookie thang (store this elsewhere!)',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));

// mongoose schemas
const Song = require('./models/song');
const Mood = require('./models/mood');
const Playlist = require('./models/playlist');
const User = require('./models/user');

// passport setup
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// setting up for ports used in hosting
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;

const db = process.env.MONGODB_URI || require('./config.js').mongoKey;
mongoose.connect(db);

app.get('/', (req, res) => {
	res.render('index');
});


/* code to register spotify account */
app.get('/login', function(req, res) {
	var scopes = 'user-read-private user-read-email';
	res.redirect('https://accounts.spotify.com/authorize' +
	  '?response_type=code' +
	  '&client_id=' + 'dcddb8d13b2f4019a1dadb4b4c070661' +
	  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	  '&redirect_uri=' + encodeURIComponent('http://localhost:3000'));
});


app.get('*', function(req, res) {
	res.render('error', {message: 'page no existo'});
});

// listening
app.listen(process.env.PORT || 3000);
























