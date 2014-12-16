(function(){
    "use strict";

    var http = require("http");
    var fs = require("fs");
    var	server;

    exports.start = function(homePageFileToServe, notFoundFileToServe, portNumber , callback){
    	if(!portNumber) throw new Error("Port number missing");
    	
        server = http.createServer();
        server.on('request', function(request, response){
        	if(request.url === '/' || request.url === '/index.html'){
                serveFile(response, homePageFileToServe);
        	}
        	else{
    			response.statusCode = 404;
                serveFile(response, notFoundFileToServe);
        	}
            
        });

        server.listen(portNumber, callback);
    };

    exports.stop = function (callback){
        server.close(callback);
    };

    function serveFile(response, file) {
        fs.readFile(file, function(err, data){
            if (err) throw err;
            response.end(data);
        });
    }
}());