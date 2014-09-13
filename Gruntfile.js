module.exports = function (grunt)
{
    grunt.initConfig({

        jshint: {
            all:
            {
                options: {
                    'noempty': true,
                    reporter: require('jshint-stylish')
                },
                src: [
                    'Gruntfile.js',
                    'index.js',
                    'controllers/*.js',
                    'config/*.js',
                    'models/*.js'
                ],
            }
        },
        /**
         *  Usage: (Sarting with v0.0.1)
         *      grunt bump - v.0.02
         *      grunt bump:patch - v0.0.3
         *      grunt bump:minor - v0.1.0
         *      grunt bump:major - v1.0.0
         *      grunt bump:prerelease - v1.0.0-1
         *      grunt bump:git
         */
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: "Release v%VERSION%",
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },

        service: {
            restart: {
                shellCommand: 'sudo service oauth2 restart'
            },
            stop: {
                shellCommand: 'sudo service oauth2 stop'
            },
            start: {
                shellCommand: 'sudo service oauth2 start'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-service');

    grunt.registerTask('default', 'Running default build', function (cmd){

        grunt.task.run('jshint:all');
   
        if (cmd !== undefined) grunt.task.run('service:' + cmd);
    });
    
    grunt.registerTask('server', 'Running build with server command', function (cmd) {
        grunt.task.run('jshint:all');
        grunt.task.run('service:' + cmd);
    });

};
