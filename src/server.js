// express setup
const express = require('express');
const app = express();

// setting path
const path = require('path');

// configure files
const port = process.env.PORT || 3000;
const db = process.env.MONGODB_URI || require('./config.js').mongoKey;

// set up database
const mongoose = require('mongoose');
mongoose.connect(db);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

// body parser setup
const bodyParser = require('body-parser'); 
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// method override setup
var methodOverride = require('method-override');
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

// serve static files 	
app.use(express.static(path.join(__dirname, 'public')));


// configure our routes
require('./app/routes')(app); 

// listening
app.listen(port);
console.log('Listening on port ' + port);
exports = module.exports = app;
