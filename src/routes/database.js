const express = require('express');
const router = express.Router();
const Song = require('../models/song');
const Mood = require('../models/mood');
const Playlist = require('../models/playlist');
const User = require('../models/user');
const Artist = require('../models/artist');
const Album = require('../models/album');


router.post('/artist', function(req, res) {
	var name = req.query.name;
	var id = req.query.id;
	var uri = req.query.uri;

	Artist.findOne({spotify_id:id}, function(err, artist) {
		if (err) {
			console.log(err);
		} else if (artist === null) {
			const artist = new Artist({
				name: name,
				spotify_id: id,
				spotify_uri: uri
			});

			artist.save(function(err, artist) {
				if (err) {
					console.log(err);
				} else {
					console.log(artist);
					res.send(artist);
				}
			});
		}
	});
});


router.post('/album', function(req, res) {
	var name = req.query.name;
	var artist = req.query.artists;
	var id = req.query.id;
	var uri = req.query.uri;
	
	Album.findOne({spotify_id:id}, function(err, album) {
		if (err) {
			console.log(err);
		} else if (album === null) {
			const album = new Album({
				name: name,
				artist: artists,
				spotify_id: id,
				spotify_uri: uri

			});
			album.save(function(err, album) {
				if (err) {
					console.log(err);
				} else {
					console.log(album);
					res.send(album);
				}
			});
		}
	});
});
	
	
router.post('/song', function(req, res) {
	var name = req.query.name;
	var id = req.query.id;
	var uri = req.query.uri;
	var duration_ms = req.query.duration_ms;
	
	Song.findOne({spotify_id:id}, function(err, song) {
		if (err) {
			console.log(err);
		} else if (song === null) {
			const song = new Song({
				name: name,
				//artist:
				//album:
				//mood: //TODO 
				spotify_id: id,
				spotify_uri: uri,
				duration_ms: duration_ms
			});
			song.save(function(err, song) {
				if (err) {
					console.log(err);
				} else {
					console.log(song);
					res.send(song);
				}
			});
		}
	});
});		


module.exports = router;





/*









SpotifyAPI.getTracksPromises().then(function(allTracks) {
			
	// TODO: Create databases objects 
	// uncomment after to add code

	for (var i = 0; i < allTracks.length; i++) {
		console.log("inside allTracks");
		var song = allTracks[i];
		var artists = song.artists;		// artists array
		var album = song.album;			// album object
	
		// * check if object exists before making it (use the id from the response and spotify_id)
		// 1. make Artist
		// 2. make Album that references Artist
		// 3. make Artist reference Album
		// 4. make Song object that references both Album and Artist
		// * don't forget to .save()
		for (var j = 0; j < artists.length; j++) {
		
			Artist.findOne({spotify_id:artists[i].id}, function(err, artist) {
				if (err) {
					console.log(err);
				} else if (artist === null) {
					const artist = new Artist({
						name: artist[i].name,
						//album: artist[i]
						//images: ..copy/get from artist js file to json
						//songs: artist[i].
						//genres:
						spotify_id: artist[i].id,
						spotify_uri: artist[i].uri
					});

					artist.save(function(err, artist) {
						if (err) {
							console.log(err);
						} else {
							console.log(artist);
						}
					});
				}
			});
		}
		Album.findOne({spotify_id:album.id}, function(err, album) {
			if (err) {
				console.log(err);
			} else if (album === null) {
				const album = new Album({
					name: album.name,
					artist: album.artists,
					//images:
					spotify_id: album.id,
					spotify_uri: album.uri

				});
			}
			else {
			console.log(album);
			}
		})

		}
		Song.findOne({spotify_id:song.id}, function(err, song) {
			if (err) {
				console.log(err);
				}
				else if (song === null) {
				const song = new Song({
					name: song.name,
					//artist:
					//album:
					//mood:
					spotify_id: song.id,
					spotify_uri: song.uri,
					duration_ms: song.duration_ms
					});
				}
			else {
				console.log(song);
				}
				});
	
	$scope.songs = allTracks;
});
$scope.albums = SpotifyAPI.getAlbums();
*/