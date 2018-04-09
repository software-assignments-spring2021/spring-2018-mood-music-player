const chai = require('chai');
const expect = chai.expect; 
const request = require("request");
const assert = require('assert');
let chaiHttp = require('chai-http');
const app = require("../app.js");

chai.use(chaiHttp);

describe('index tests', function() {
	describe("GET /", function(){
		it("returns status code 200", function(done){
			request.get("http://localhost:3000/", function(error, response, body){
				assert.equal(200, response.statusCode);
				done();
			});
		});
	});
});