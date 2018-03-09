// basic setup
const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

// body parser setup
const bodyParser = require('body-parser'); 

// sessions setup
const session = require('express-session');

// passport setup
const passport = require('passport');

// setting path
const path = require('path');

// mongoose setup
const mongoose = require('mongoose');
const db = process.env.MONGODB_URI || require('./config.js').mongoKey;
mongoose.connect(db);

// mongoose schemas
const Song = require('./models/song');
const Mood = require('./models/mood');
const Playlist = require('./models/playlist');
const User = require('./models/user');

// requiring routes 
const index = require('./routes/index');
const api = require('./routes/api');
const authenticate = require('./routes/authenticate')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// speaks to you on terminal
app.use(logger('dev'));

// session options 
const sessionOptions = {
	secret: 'keyboard dog',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));

// parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// serve static files 	
app.use(express.static(path.join(__dirname, 'public')));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes middleware
app.use('/', index);
app.use('/auth', authenticate);
app.use('/api', api);

// 404 handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Initialize Passport
const initPassport = require('./passport-init');
initPassport(passport);

// this is the logger. prints out the good stuff
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// listening
app.listen(process.env.PORT || 3000);

/*
TODO: Put this in the rigth place

// setting up for ports used in hosting
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;

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
*/
