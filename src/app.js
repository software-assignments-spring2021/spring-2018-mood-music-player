// express setup
const express = require('express');
const app = express();

// setting path
const path = require('path');

// mongoose setup
const mongoose = require('mongoose');

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

let dbconf;

// is the environment variable, NODE_ENV, set to PRODUCTION? 
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
	dbconf = 'mongodb://localhost/is1235';
}

mongoose.connect(dbconf);
app.get('/', (req, res) => {
	res.render('index');
});

app.get('*', function(req, res) {
	res.render('error', {message: 'page no existo'});
});

// listening
app.listen(process.env.PORT || 3000);
























