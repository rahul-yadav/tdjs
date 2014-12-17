//launch the server
//get a page
// confirm we got something

(function() {
	"use strict";
	var child_process = require("child_process");
	var fs = require("fs");
	var http = require("http");
	var procfile = require('procfile');
	var child = null;
	var PORT_NUMBER = "5000";

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
		httpGet("http://localhost:"+ PORT_NUMBER, function(response, receivedData){
			console.log("inside callback");
			var foundHomePageFile = receivedData.indexOf("WeeWikiPaint home page")!== -1;
		 	test.ok(foundHomePageFile, "home page should contain weewikipaint marker");
		 	test.done();
		});
	};

	exports.test_canGet404Page = function(test){
		httpGet("http://localhost:"+ PORT_NUMBER + "/nonExistant.html", function(response, receivedData){
			var foundHomePageFile = receivedData.indexOf("WeeWikiPaint 404 page")!== -1;
		 	test.ok(foundHomePageFile, "404 page shoudl have contained test marker");
		 	test.done();
		});
	};

	function runServer(callback) {
		var commandLine = parseProcFile();
		child = child_process.spawn(commandLine.command, commandLine.options);
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
			});
		});
	}

	function parseProcFile(){
		var fileData = fs.readFileSync("Procfile", "utf8");
		var webCommand = procfile.parse(fileData).web;
		webCommand.options = webCommand.options.map(function(element){
			if(element === "$PORT"){
				return PORT_NUMBER;	
			} 
			return element;
		});
		return webCommand;
	}

}());