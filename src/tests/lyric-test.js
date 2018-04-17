const chai = require('chai');
const expect = chai.expect; 
const request = require("request");
const assert = require('assert');
let chaiHttp = require('chai-http');
const app = require("../app.js");

chai.use(chaiHttp);

describe('lyric-API and Sentiment tests', function() {
	describe("GET /lyric", function(){
		it("returns status code 200", function(done){
			request.get("http://localhost:3000/lyric/?artist=Vanilla%20Ice&song=Ice%20Ice%20Baby", function(error, response, body){
				assert.equal(200, response.statusCode);
				done();
			});
		});
	});
	
	describe("returns correct response", function(){
		it("returns -24", function(done){
			request.get("http://localhost:3000/lyric/?artist=Drake&song=God's%20Plan", function(error, response, body) {
				console.log(JSON.parse(body).sentiment.score);
				assert.equal(-24, JSON.parse(body).sentiment.score);
				done();
			});
		});

		it("returns 249", function(done){
			request.get("http://localhost:3000/lyric/?artist=Pharrell&song=Happy", function(error, response, body) {
				assert.equal(249, JSON.parse(body).sentiment.score);
				done();
			});
		});

		it("returns -39", function(done){
			request.get("http://localhost:3000/lyric/?artist=Twenty%20One%20Pilots&song=Kitchen%20Sink", function(error, response, body) {
				assert.equal(-39, JSON.parse(body).sentiment.score);
				done();
			});
		});
	});
});

