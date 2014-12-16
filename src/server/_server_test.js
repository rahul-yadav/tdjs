(function() {
	"use strict";

	var server = require('./server.js');
	var http = require("http");
	var fs = require('fs');
	var assert = require('assert');

	var TEST_HOME_PAGE = "generated/test/test.html";
	var TEST_404_PAGE = "generated/test/test404.html";

	// exports.setUp = function(done){
	// 	done();
	// };

	exports.tearDown = function(done){
		cleanUpFile(TEST_HOME_PAGE);
		cleanUpFile(TEST_404_PAGE);
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

	exports.test_servesHomePageFromFile = function(test) {
		var expectedData = "This is served from a file";
		fs.writeFileSync(TEST_HOME_PAGE, expectedData);

		httpGet("http://localhost:9000/", function(response, responseData){
			test.equals(200, response.statusCode, "status code");
			test.done();
		});
	};

	exports.test_returns404ForEverythingExceptHomepage = function(test) {
		var expectedData = "This is 404 page file";
		
		fs.writeFileSync(TEST_404_PAGE, expectedData);

		httpGet("http://localhost:9000/404Path", function(response, responseData){
			test.equals(404, response.statusCode, "status code");
			test.equals(expectedData, responseData, "404 text");
			test.done();
		});
	};
	
	exports.test_returnsHomePageWhenAskedForIndex = function(test) {
		var expectedData = "This is served from a file";
		
		fs.writeFileSync(TEST_HOME_PAGE, expectedData);

		httpGet("http://localhost:9000/index.html", function(response, responseData){
			test.equals(200, response.statusCode, "status code");
			test.done();
		});
	};

	exports.test_requiresFileParameter = function(test) {
		test.throws(function() {
			server.start();
		});
		test.done();
	};

	exports.test_requiresPortNumberParameter = function(test) {
		test.throws(function(){
			server.start(TEST_HOME_PAGE, TEST_404_PAGE);
		});
		test.done();
	};

	exports.test_runsCallbackWhenStopCompletes = function(test){
		server.start(TEST_HOME_PAGE, TEST_404_PAGE,9000);
		server.stop(function(){
			test.done();
		});
	};

	exports.test_stopThrowsExceptionWhenNotRunning = function(test) {
		test.throws(function(){
			server.stop();
		});
		test.done();
	};

	function httpGet(url, callback) {
		server.start(TEST_HOME_PAGE, TEST_404_PAGE, 9000, function(){
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
		});
	}

	function cleanUpFile(file){
		if(fs.existsSync(file)) {
			fs.unlinkSync(file);
			assert.ok(!fs.existsSync(file), "file should have been deleted");
		}
	}
}());