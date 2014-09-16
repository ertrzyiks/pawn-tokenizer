module.exports = function(grunt) {
    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jscs');

    grunt.initConfig({
        jscs: {
            src: [
                "lib/*.js",
                "test/*.js",
                "index.js"
            ],
            options: {
                config: ".jscsrc"
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        }
    });

  grunt.registerTask('default', 'test');
  grunt.registerTask('test', ['jscs','mochaTest']);

};