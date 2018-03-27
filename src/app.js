const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const gracenote = require('node-gracenote');
//initialize mongoose schemas
const Song = require('./models/song');
const Mood = require('./models/mood');
const Playlist = require('./models/playlist');
const User = require('./models/user');

const index = require('./routes/index');
const api = require('./routes/api');
const authenticate = require('./routes/authenticate')(passport);
const mongoose = require('mongoose');
const db = process.env.MONGODB_URI || require('./config.js').mongoKey;
mongoose.connect(db);
const app = express();


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
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(session({
  secret: 'keyboard cat'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/auth', authenticate);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//// Initialize Passport
const initPassport = require('./passport-init');
initPassport(passport);

// Initialize Gracenote
const initGracenote = require('./gracenote-init');
initGracenote(gracenote);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(process.env.PORT || 3000);