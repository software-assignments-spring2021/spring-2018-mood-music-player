var request = require('request');

request.get('/gracenote/' + JSON.stringify({artist: "Kings of Leon", title: "Sex on fire", album: "Only by the Night"})).then(function(data) {
	console.log(data);
});