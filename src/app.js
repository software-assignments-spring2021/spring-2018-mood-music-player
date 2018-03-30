const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const gracenote = require('node-gracenote');
//initialize mongoose schemas

require('./models/song');
require('./models/mood');
require('./models/playlist');
require('./models/user');
require('./models/artist');
require('./models/album');

const index = require('./routes/index');
const api = require('./routes/api');
<<<<<<< HEAD
const gracenoteroute = require('./routes/gracenoteroute');
=======
const gracenoteroute = require('./routes/gracenote')
const musicplayerroute = require('./routes/musicplayer')
>>>>>>> 042c90bc29be26262ac120d29ec6253748f1b9be

const authenticate = require('./routes/authenticate')(passport);
const spotify = require('./routes/spotify.js');
const mongoose = require('mongoose');
const db = process.env.MONGODB_URI || require('./config.js').mongoKey;
mongoose.connect(db);
const app = express();

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
app.use('/spotify', spotify);
app.use('/gracenote', gracenoteroute);
app.use('/musicplayer', musicplayerroute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//// Initialize Passport
const initPassport = require('./passport-init');
initPassport(passport);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.listen(process.env.PORT || 3000);