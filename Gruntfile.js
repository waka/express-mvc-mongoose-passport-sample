/**
 * @fileoverview Grunt config file.
 * - Compile SCSS to CSS, and compress
 * - Compile and compress JS
 * - Run client JS tests
 */
module.exports = function(grunt) {

  var SCSS_FILES = ['public/scss/**/*.scss'];

  // initialize grunt tasks
  grunt.initConfig({
    compass: {
      dist: {
        options: {
          sassDir: 'public/scss',
          cssDir: 'public/css'
        }
      }
    },
    watch: {
      css: {
        files: SCSS_FILES,
        tasks: ['compass']
      }
    }
  });

  // load modules
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // $grunt equals $grunt compass
  grunt.registerTask('default', 'compass');
};
