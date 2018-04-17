const chai = require('chai');
const expect = chai.expect; 
const request = require("request");
const assert = require('assert');
let chaiHttp = require('chai-http');
const app = require("../app.js");

chai.use(chaiHttp);

describe('spotify tests', function() {
	describe("GET /spotify/login", function(){
		it("returns status code 200", function(done){
			request.get("http://localhost:3000/spotify/login", function(error, response, body){
				assert.equal(200, response.statusCode);
				done();
			});
		});
	});

	describe("generates correct query", function(){
		it("response_type is code", function(done){
			request.get("http://localhost:3000/spotify/login", function(error, response, body){
				var response_array = body.substring(body.indexOf('?') + 1).split('&');
				var response_object = {};
				for (let i = 0; i < response_array.length; i++) {
					var current = response_array[i].split('=');
					response_object[current[0]] = current[1];
				}
				assert.equal('code', response_object['response_type']);
				done();
			});
		});

		it("client_id is correct", function(done){
			request.get("http://localhost:3000/spotify/login", function(error, response, body){
				var response_array = body.substring(body.indexOf('?') + 1).split('&');
				var response_object = {};
				for (let i = 0; i < response_array.length; i++) {
					var current = response_array[i].split('=');
					response_object[current[0]] = current[1];
				}
				var spotifyId = process.env.SPOTIFY_ID || require('../config.js').spotifyId;
				assert.equal(spotifyId, response_object['client_id']);
				done();
			});
		});

		it("redirect_uri is correct", function(done){
			request.get("http://localhost:3000/spotify/login", function(error, response, body){
				var response_array = body.substring(body.indexOf('?') + 1).split('&');
				var response_object = {};
				for (let i = 0; i < response_array.length; i++) {
					var current = response_array[i].split('=');
					response_object[current[0]] = current[1];
				}
				var callback = encodeURIComponent('http://localhost:3000/');
				assert.equal(callback, response_object['redirect_uri']);
				done();
			});
		});
	});
});
