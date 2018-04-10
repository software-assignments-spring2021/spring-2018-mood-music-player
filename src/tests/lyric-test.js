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
			request.get("http://localhost:3000/lyric", function(error, response, body){
				assert.equal(200, response.statusCode);
				done();
			});
		});

	});
	
	describe("returns correct response", function(){
		it("returns energizing", function(done){
			request.get("http://localhost:3000/lyric/?artist=Vanilla%20Ice&song=Ice%20Ice%20Baby", function(error, response, body){
				// console.log(body.sentiment);
				assert.equal("Energizing", body);
				done();
			});
		});
	});
});

