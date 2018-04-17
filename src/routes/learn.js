// TODO: require whatever
const express = require('express');
const router = express.Router();
// const DATA = require('../dataset.js');

const getAccuracy = function(net, testData) {
	let hits = 0;
	testData.forEach((datapoint) => {
		const output = net.run(datapoint.input);
		const outputArray = [Math.round(output[0]), Math.round(output[1]), Math.round(output[2])];
		if (outputArray[0] === datapoint.output[0] && outputArray[1] === datapoint.output[1] && outputArray[2] === datapoint.output[2]) {
			hits += 1;
		}
	});
	return hits / testData.length;  
}

router.get('/train', function(req, res) {
	const SPLIT = .8 * DATA.length();
	const trainData = DATA.slice(0, SPLIT);
	const testData = DATA.slice(SPLIT + 1);

	const net = new brain.NeuralNetwork({
		activation: 'sigmoid', // activation function
		iterations: 20000,
		learningRate: 0.3 // global learning rate, useful when training using streams
	});

	net.train(trainData);

	const accuracy = getAccuracy(net, testData);

	console.log('accuracy: ', accuracy);

	res.send({output: net});
});

router.get('/data', function(req, res) {
	var song = req.query.songid;
	// TODO: get this song from spotify
	// TODO: get metadata and import
	res.send({category: net.run(/* here */)});
});

module.exports = router;