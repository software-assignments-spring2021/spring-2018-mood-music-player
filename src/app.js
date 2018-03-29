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
const Artist = require('./models/artist');
const Album = require('./models/album');

const index = require('./routes/index');
const api = require('./routes/api');
const gracenoteroute = require('./routes/gracenoteroute')

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
<<<<<<< HEAD
app.use('/spotify', spotify);
=======
app.use('/gracenote', gracenoteroute);
>>>>>>> a36d46f5d6d894807777f5152596258ce4fd4faa


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