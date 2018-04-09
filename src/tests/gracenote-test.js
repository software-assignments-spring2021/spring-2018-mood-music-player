const chai = require('chai');
const expect = chai.expect; 
const request = require("request");
const assert = require('assert');
let chaiHttp = require('chai-http');
const app = require("../app.js");

chai.use(chaiHttp);

describe('gracenote tests', function() {
	describe("GET /gracenote", function(){
		it("returns status code 200", function(done){
			request.get("http://localhost:3000/gracenote", function(error, response, body){
				assert.equal(200, response.statusCode);
				done();
			});
		});

		it("returns correct initial response", function(done){
			request.get("http://localhost:3000/gracenote", function(error, response, body){
				assert.equal('respond with a resource', body);
				done();
			});
		});

	});
	
	describe("returns correct response", function(){
		it("returns energizing", function(done){
			request.get("http://localhost:3000/gracenote/Vanilla%20Ice-To%20The%20Extreme-Ice%20Ice%20Baby", function(error, response, body){
				assert.equal("Energizing", body);
				done();
			});
		});

		it("returns string", function(done){
			request.get("http://localhost:3000/gracenote/Vanilla%20Ice-To%20The%20Extreme-Ice%20Ice%20Baby", function(error, response, body){
				assert.equal('string', typeof(body));
				done();
			});
		});

		
	});
});

