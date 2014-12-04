/*global desc, task, jake, fail, complete*/
(function() {
    "use strict";
    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint Everything");
    task("lint", function () {
        var lint = require('./build/lint/lint_runner.js');

        var files = new jake.FileList();

        files.include('**/*.js');
        files.exclude("node_modules");

        var options = nodeLintOptions();
        var passed = lint.validateFileList(files.toArray(), options, {});
        if(!passed) fail("Lint Failed");
    });

    desc("Test Everything");
    task("test", [], function(){
        var reporter = require("nodeunit").reporters.default;
        reporter.run(["src/server/_server_test.js"]);
        console.log("Test goes here");
    });

    desc("Integrate");

    task("integrate", ["default"], function(){

        console.log("Integration logic here");
    });


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