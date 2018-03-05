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
	secret: 'keyboard cat!',
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

// load routes from routes folder
const placesRoutes = require('./routes/places');
app.use('/api', placesRoutes);

const db = process.env.MONGODB_URI || require('./config.js').mongoKey;
mongoose.connect(db);

function authenticated(req,res,next) {
	if(req.user) {
		return next();
	} else {
		const message = 'you are not authenticated to view this page<br><a href="/">please log in &rarr;</a>';
		res.render('error', {message: message});
	}
}

// TODO: decide if any of this works with angular.js

// TODO: check if this owrks.
app.get('/', function(req, res) {

	res.render('login');
	
	// TODO: figure this shit out once passport is poperly implemented. 
	/*
	if (authenticated(req,res,next)) {
		// TODO: add .hbs of our app
		res.render('index');
	}
	*/
	
});

// TODO: change error messages and render info
app.post('/register', function(req, res, next) {
	console.log('registering user');
	// TODO: update findOne with appropriate information.
	User.findOne({username: req.body.username}, function(err, user) {
		if (err) {
			return next(err);
		} else if (user) {
			return res.render('index', {message: 'user already exists'});
		} else if (req.body.username === '' || req.body.password === '') {
			return res.render('index', {message: 'enter username and password'});
		} else {
			// TODO: add user schema with user input here. 
			const user = new User({
				
			});
			User.register(user, req.body.password, function(err) {
				if (err) {
					return next(err);
				}
				passport.authenticate('local')(req, res, function () {
					req.session.save(function (err) {
					if (err) {
						return next(err);
					}
					// TODO: redirect to our app. This could potentially be correct if the .get for '/' works.
					res.redirect('/');
					});
				});
				console.log('user registered!');
			});
		}
	});
});

// TODO: change error messages and render info
app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) {
			if (info.name === 'IncorrectUsernameError') {
				return res.render('index', {message: 'username is incorrect' });
			} else if (info.name === 'IncorrectPasswordError') {
				return res.render('index', {message: 'password is incorrect' });
			}
		} 
		req.logIn(user, function(err) {
			if (!user) {
				return res.render('index', {message: 'please enter username & password' });
			} else {
				if (err) { return next(err); }
				// TODO: decide if we are using this. 
				return res.redirect('/user/' + user.username);	
			}
		});
	})(req, res, next);
});

// code to register spotify account
// TODO: fix conflict with path to be prettier.
app.get('/spotify_login', function(req, res) {
	var scopes = 'user-read-private user-read-email';
	res.redirect('https://accounts.spotify.com/authorize' +
	  '?response_type=code' +
	  '&client_id=' + 'dcddb8d13b2f4019a1dadb4b4c070661' +
	  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	  '&redirect_uri=' + encodeURIComponent('http://localhost:3000'));
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('*', function(req, res) {
	res.render('error', {message: 'page no existo'});
});

// listening
app.listen(process.env.PORT || 3000);
