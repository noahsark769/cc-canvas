/**
 * Gruntfile for babelify as per http://www.sitepoint.com/setting-up-es6-project-using-babel-browserify/
 */
module.exports = function (grunt) {
   grunt.initConfig({
      browserify: {
          dist: {
            options: {
               transform: [
                  ["babelify", {
                     loose: "all"
                  }]
               ]
            },
            files: {
               // if the source file has an extension of es6 then
               // we change the name of the source file accordingly.
               // The result file's extension is always .js
               "./build/index.js": ["./src/index.js"]
            }
         }
      },
      watch: {
         scripts: {
            files: ["./src/**/*.js"],
            tasks: ["browserify"]
         }
      }
   });

   grunt.loadNpmTasks("grunt-browserify");
   grunt.loadNpmTasks("grunt-contrib-watch");
   grunt.loadNpmTasks('grunt-mocha-test');

   grunt.registerTask("default", ["build", "watch"]);
   grunt.registerTask("build", ["browserify"]);
};
