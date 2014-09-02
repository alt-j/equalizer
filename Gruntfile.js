module.exports = function (grunt) {

    // Project config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: [
                    'js/src/vendor/modules.js',
                    'js/src/equalizer.js',
                    'js/src/index.js'
                ],
                dest: 'js/index.min.js'
            }
        },
        csso: {
          compress: {
            files: {
              'css/index.min.css': ['css/src/index.css']
            }
          }
        },
        watch: {
            files: ['js/src/**/*.js', 'css/src/**/*.css'],
            tasks: 'default'
        }
    });

    // Load the plugin
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task
    grunt.registerTask('default', ['uglify', 'csso', 'watch']);

};
