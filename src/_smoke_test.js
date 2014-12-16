//launch the server
//get a page
// confirm we got something

(function() {
	"use strict";
	var child_process = require("child_process");
	var http = require("http");
	var child = null;

	exports.setUp = function(done){
		runServer(done);
	};

	exports.tearDown = function(done){
		child.on("exit", function(code, signal){
			done();
		});
		child.kill();
	};

	exports.test_canGetHomePage = function(test) {
		httpGet("http://localhost:8080", function(response, receivedData){
			console.log("inside callback");
			var foundHomePageFile = receivedData.indexOf("WeeWikiPaint home page")!== -1;
		 	test.ok(foundHomePageFile, "home page should contain weewikipaint marker");
		 	test.done();
		});
	};

	exports.test_canGet404Page = function(test){
		httpGet("http://localhost:8080/nonExistant.html", function(response, receivedData){
			console.log("inside callback");
			var foundHomePageFile = receivedData.indexOf("WeeWikiPaint 404 page")!== -1;
		 	test.ok(foundHomePageFile, "404 page shoudl have contained test marker");
		 	test.done();
		});
	};

	function runServer(callback) {
		child = child_process.spawn("node", ["src/server/weewikipaint", "8080"]);
		child.stdout.setEncoding("utf8");
		child.stdout.on("data", function(chunk){
			if(chunk.trim() === "Server started") callback();
		});
	}

	//TODO: eliminate duplication of this method.
	function httpGet(url, callback) {
		var request = http.get(url); 
		request.on("response", function(response){
			var receivedData = "";
			response.setEncoding("utf8");
			response.on("data", function(chunk) {
	 			receivedData += chunk;
			});

			response.on("end", function() {
				callback(response, receivedData);
				// server.stop(function(){
				// });
			});
		});
	}

}());