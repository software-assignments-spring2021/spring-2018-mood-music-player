const x = require('./getFeatures.json');

let arr = x.audio_features.map(function(item) {
	return { danceability: item.danceability,
		energy: item.energy,
		key: item.key,
		loudness: item.loudness,
		mode: item.mode,
		valence: item.valence,
		tempo: item.tempo
	}
});

console.log(arr.slice(99));

