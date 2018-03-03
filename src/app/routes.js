const Mood = require('./models/mood');


module.exports = function(app) {
	app.get('/api/moods', function(req, res) {
		Mood.find({}, function(err, moods) {
			if (err) {
				res.send(err);
			} else {
				res.json(moods);
			}
		});
	});

	// app.get('/spotify_login', function(req, res) {
	// 	const scopes = 'user-read-private user-read-email';
	// 	res.redirect('https://accounts.spotify.com/authorize' +
	// 	  '?response_type=code&client_id=' + 'dcddb8d13b2f4019a1dadb4b4c070661' +
	// 	  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	// 	  '&redirect_uri=' + encodeURIComponent('http://localhost:3000'));
	// });


	app.get('*', function(req, res) {
		// res.sendFile('/index.html', {root: path.join(__dirname, '../public')});
		res.sendfile('./public/index.html');
	});	
}