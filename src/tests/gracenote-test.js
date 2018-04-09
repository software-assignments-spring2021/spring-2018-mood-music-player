const chai = require('chai');
const expect = chai.expect; 
const gracenote = require('../routes/gracenote.js');

describe('gracenote tests', function() {

	describe('add', function() {
		it('adds two numbers', function() {
			expect(2 + 2).equal(4);
		});
	});
});
