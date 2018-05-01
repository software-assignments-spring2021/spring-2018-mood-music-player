const express = require('express');
const router = express.Router();
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const client_id = process.env.SPOTIFY_ID || require('../config.js').spotifyId;
const client_secret = process.env.SPOTIFY_SECRET || require('../config.js').spotifySecret;

const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:3000/';

const getRandStr = function(n) {
	let str = '';
	const options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	for (let i = 0; i < n; i++) {
		str += options.charAt(Math.floor(Math.random() * options.length));
	}
	return str;
};

const stateKey = 'spotify_auth_state';

router.use(express.static(__dirname + '/public')).use(cookieParser());

router.get('/login', function(req, res) {
	const state = getRandStr(16);	

	res.send('https://accounts.spotify.com/authorize?' + querystring.stringify({
		response_type: 'code',
		client_id: client_id,
		redirect_uri: redirect_uri,
		state: state
	}));
});

router.get('/callback/:code', function(req, res) {
	const code = req.params.code;
	const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri: redirect_uri,
			grant_type: 'authorization_code'
		},
		headers: {
			'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
		},
		json: true
	};
	request.post(authOptions, function(error, response, body) {
		if (response.statusCode === 200 && !error) {
			const access_token = body.access_token;
			const refresh_token = body.refresh_token;
			const expires_in = body.expires_in;
			res.send({access_token: access_token, refresh_token: refresh_token, expires_in: expires_in});
		} else {
			res.send({error: 'invalid_token'});
		}
	});
});

router.get('/refresh_token', function(req, res) {
	const refresh_token = req.query.refresh_token;
	const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	};

	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token;
			res.send({access_token: access_token});
		}
	});
});

module.exports = router;