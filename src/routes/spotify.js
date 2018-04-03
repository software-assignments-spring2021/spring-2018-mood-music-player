const express = require('express');
const router = express.Router();
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const client_id = 'dcddb8d13b2f4019a1dadb4b4c070661';
const client_secret = '531d0babc3c3427b9b75d9d9bdca1781';
const redirect_uri = 'http://localhost:3000/spotify/callback';

const getRandStr = function(n) {
	let str = '';
	const options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	for (let i = 0; i < n; i++) {
		str += options.charAt(Math.floor(Math.random() * options.length));
	}
	return str;
};

const stateKey = 'spotify_auth_state';

router.use(express.static(__dirname + '/public'))
	.use(cookieParser());

router.get('/login', function(req, res) {
	const state = getRandStr(16);
	const scope = [
		'user-read-birthdate',
		'user-read-email',
		'user-read-private',
		'playlist-read-private',
		'user-top-read',
		'user-library-read',
		'playlist-modify-private',
		'user-read-currently-playing',
		'user-read-recently-played',
		'user-modify-playback-state',
		'user-read-playback-state',
		'user-library-modify',
		'streaming',
		'playlist-modify-public'
	];

	res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
		response_type: 'code',
		client_id: client_id,
		scope: scope.join('%20'),
		redirect_uri: redirect_uri,
		state: state
	}));
});

router.get('/callback', function(req, res) {
	const code = req.query.code || null;
	const state = req.query.state || null;
	const stored = req.cookies ? req.cookes[stateKey]: null;
	if (state === null || state !== stored) {
		res.send({error: 'state_mismatch'});
	} else {
		res.clearCookie(stateKey);
		const authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redurect_uri: redirect_uri,
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

				const options = {
					url: 'https://api.spotify.com/v1/me',
					headers: { 'Authorization': 'Bearer ' + access_token },
					json: true
				};

				request.get(options, function(error, response, body) {
					console.log(body);
				});

				res.send({access_token: access_token, refresh_token: refresh_token});
			} else {
				res.send({error: 'invalid_token'});
			}
		});
	}
});

router.get('/refresh_token', function(req) {
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
});

module.exports = router;