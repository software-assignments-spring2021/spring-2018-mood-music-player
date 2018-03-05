const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// mongoose schemas
const Song = require('./../models/song');
const Mood = require('./../models/mood');
const Playlist = require('./../models/playlist');
const User = require('./../models/user');

// TODO: create two routes that return json
// GET /api/song
// POST /api/song/create
// You do not have to specify api in your urls
// since that's taken care of in app.js when
// this routes file is loaded as middleware
router.get('/places', (req, res) => {
	const filter = {};
	if (req.query.location !== undefined) { filter['location'] = req.query.location; }
	if (req.query.cuisine !== undefined) { filter['cuisine'] = req.query.cuisine; }  
	Place.find(filter).sort().exec((err, result) => {
		res.json(result);
	});
});

router.post('/places/create', (req, res) => {
	if (req.body.name === '' || req.body.cuisine === '' || req.body.location === '') {
		res.json({error: 'Error: missing information'});
	} else { 
		const body = {
			name: req.body.name,
			cuisine: req.body.cuisine,
			location: req.body.location
		};
		const place = new Place(body);
		Place.find(body).sort().exec((err, result) => {
			if (result.length > 0) { res.json({error: 'Error: duplicate entry'}); }
			else { 
				place.save((err, result) => {
					res.json(result);
				});
			}
		});
	}
});

module.exports = router;
