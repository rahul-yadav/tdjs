/*global desc, task, jake, fail, complete, directory*/
(function() {
    "use strict";
    var NODE_VERSION = "v0.10.32\n";
    var GENERATED_DIR = "generated";
    var TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";

    directory(TEMP_TESTFILE_DIR);
    
    desc("Delete all generated files");
    task("clean", [], function(){
        jake.rmRf("generated");
    });

    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint Everything");
    task("lint",["nodeVersion"], function () {
        var lint = require('./build/lint/lint_runner.js');

        var files = new jake.FileList();

        files.include('**/*.js');
        files.exclude("node_modules");

        var options = nodeLintOptions();
        var passed = lint.validateFileList(files.toArray(), options, {});
        if(!passed) fail("Lint Failed");
    });

    desc("Test Everything");
    task("test", ["nodeVersion", TEMP_TESTFILE_DIR], function(){
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
    task("nodeVersion",[], function(){
        
        

        sh("node --version", function(stdout){
            if(stdout !== NODE_VERSION) fail("Incorrect node version. Expected " + NODE_VERSION);
            complete();
        });
    },{async: true});

    function sh(command, callback){
        console.log("> " + command);
        
        var stdout = "";
        var process = jake.createExec(command,{printStdout: true, printStderr: true});
        process.on("stdout", function(chunk){
            stdout += chunk;
        });

        process.on('cmdEnd', function(){
           callback(stdout);
        });
        process.run();

        //Simple command run without stdOut
        // jake.exec(command, function(){
        //     complete();
        // },{printStdout: true, printStderr: true});
    }

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