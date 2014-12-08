/*global desc, task, jake, fail, complete*/
(function() {
    "use strict";
    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint Everything");
    task("lint",["node"], function () {
        var lint = require('./build/lint/lint_runner.js');

        var files = new jake.FileList();

        files.include('**/*.js');
        files.exclude("node_modules");

        var options = nodeLintOptions();
        var passed = lint.validateFileList(files.toArray(), options, {});
        if(!passed) fail("Lint Failed");
    });

    desc("Test Everything");
    task("test", ["node"], function(){
        var reporter = require("nodeunit").reporters.default;
        reporter.run(["src/server/_server_test.js"], null, function(failures){
                if(failures){
                    fail("tests failed");
                }
                console.log("tests done");
                complete();
            }
        );
        console.log("Test goes here");
    }, {async: true});

    desc("Integrate");

    task("integrate", ["default"], function(){

        console.log("Integration logic here");
    });
    
    //desc("Ensure correct version of node is present");
    task("node",[], function(){
        var command = "node --version";
        var stdout = "";
        var desiredNodeVersion = "v0.10.32\n";

        console.log("> " + command);
        
        var process = jake.createExec(command,{printStdout: true, printStderr: true});
        process.on("stdout", function(chunk){
            stdout += chunk;
        });

        process.on('cmdEnd', function(){
            if(stdout !== desiredNodeVersion) fail("Incorrect node version. Expected " + desiredNodeVersion);
            console.log("stdout: "+ stdout);
            complete();
        });
        process.run();
        // jake.exec(command, function(){
        //     complete();
        // },{printStdout: true, printStderr: true});
    },{async: true});


    function nodeLintOptions() {
        return {
            bitwise: true,
            curly: false,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            regexp: true,
            undef: true,
            strict: true,
            trailing: true,
            node: true
        };
    }
}());