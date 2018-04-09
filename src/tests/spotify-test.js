const request = require("request");
const chai = require('chai');
const expect = chai.expect; 
const spotify = require('../routes/spotify.js');

describe('spotify tests', function() {

	describe('add', function() {
		it('adds two numbers', function() {
			expect(2 + 2).equal(4);
		});
	});
});
