// express setup
const express = require('express');
const app = express();

// setting path
const path = require('path');

// linking db.js
require('./db');

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

app.get('/', (req, res) => {
	res.render('index');
});

app.get('*', function(req, res) {
	res.render('error', {message: 'page no existo'});
});

// listening
app.listen(process.env.PORT || 3000);
























