(function() {
	"use strict";

	var server = require('./server.js');
	var http = require("http");
	var fs = require('fs');
	var assert = require('assert');

	var TEST_FILE = "generated/test/test.html";

	// exports.setUp = function(done){
	// 	done();
	// };

	exports.tearDown = function(done){
		if(fs.existsSync(TEST_FILE)) {
			fs.unlinkSync(TEST_FILE);
			assert.ok(!fs.existsSync(TEST_FILE), "file should have been deleted");
		}
		done();
	};


	// exports.test_serverReturnsHelloWorld = function(test) {
		// 	server.start(9000);
		// 	var request = http.get("http://localhost:9000"); 
		// 	request.on("response", function(response){
		// 		var receivedData = false;
		// 		response.setEncoding("utf8");
		// 		test.equals(200, response.statusCode, "status code");
		// 		response.on("data", function(chunk) {
		//  			receivedData = true;
		// 			test.equals("Hello World", chunk, "response text");
		// 		});

		// 		response.on("end", function() {
		// 			test.ok(receivedData, "should have received response data");
		// 			server.stop(function(){
		// 				test.done();
		// 			});
		// 		});
		// 	});
	// };

	exports.test_serverServesHomePageFromFile = function(test) {
		var testDir = "generated/test";
		var testData = "This is served from a file";
		
		fs.writeFileSync(TEST_FILE, testData);

		httpGet("http://localhost:9000/", function(response, responseData){
			test.equals(200, response.statusCode, "status code");
			test.done();
		});
	};

	exports.test_serverReturns404ForEverythingExceptHomepage = function(test) {
		var testDir = "generated/test";
		var testData = "This is served from a file";
		
		fs.writeFileSync(TEST_FILE, testData);

		httpGet("http://localhost:9000/404Path", function(response, responseData){
			test.equals(404, response.statusCode, "status code");
			test.done();
		});
	};
	
	exports.test_serverServesHomePageWhenAskedFromIndex = function(test) {
		var testDir = "generated/test";
		var testData = "This is served from a file";
		
		fs.writeFileSync(TEST_FILE, testData);

		httpGet("http://localhost:9000/index.html", function(response, responseData){
			test.equals(200, response.statusCode, "status code");
			test.done();
		});
	};

	exports.test_serverRequiresFileToServe = function(test) {
		test.throws(function() {
			server.start();
		});
		test.done();
	};

	exports.test_serverRequiresPortNumber = function(test) {
		test.throws(function(){
			server.start(TEST_FILE);
		});
		test.done();
	};

	exports.test_serverRunsCallbackWhenStopCompletes = function(test){
		server.start(TEST_FILE,9000);
		server.stop(function(){
			test.done();
		});
	};

	exports.test_stopCalledWhenServiceIsntRunningThrowsException = function(test) {
		test.throws(function(){
			server.stop();
		});
		test.done();
	};

	function httpGet(url, callback) {
		server.start(TEST_FILE, 9000);
		var request = http.get(url); 
		request.on("response", function(response){
			var receivedData = "";
			response.setEncoding("utf8");
			response.on("data", function(chunk) {
	 			receivedData += chunk;
			});

			response.on("end", function() {
				callback(response, receivedData);
				server.stop(function(){
				});
			});
		});
	}
}());