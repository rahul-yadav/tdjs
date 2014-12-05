"use strict";
var http = require('http');

var server = http.createServer();

server.on('request', function(request, response){
    console.log("Received Request");

    var html = "<html><head><title>Node HTTP Spike</title></head>"+
                "<body><p>This is a spike of node's HTTP server</p></body></html>";

    response.end(html);
});

server.listen(8080);

console.log("server started");