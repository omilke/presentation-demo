'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        presentationApp: {
            // configurable paths
            app: 'app',
            dist: 'dist'
        },
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= presentationApp.app %>/js/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            chapters: {
                files: ['<%= presentationApp.app %>/slides/*.html'],
                tasks: ['concat:server', 'includereplace:server']
            },
            compass: {
                files: ['<%= presentationApp.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= presentationApp.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= presentationApp.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= presentationApp.dist %>/*',
                            '!<%= presentationApp.dist %>/.git*'
                        ]
                    }]
            },
            server: '.tmp'
        },
        concat: {
            options: {
//              separator: ';',
            },
            server: {
                src: ['<%= presentationApp.app %>/slides/*.html'],
                dest: '.tmp/chapters.html'
            }
        },
        includereplace: {
            options: {
                basePath: 'app',
                includesDir: '<%= presentationApp.app %>/../.tmp'
            },
            server: {
                files: {
                    '.tmp/index.html': '<%= presentationApp.app %>/index.html'
                }
            }

        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
//                'compass:server'
            ],
            test: [
                'compass'
            ],
            dist: [
                'compass:dist',
                'imagemin',
                'svgmin'
            ]
        },
        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= presentationApp.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= presentationApp.app %>/images',
                javascriptsDir: '<%= presentationApp.app %>/js',
                fontsDir: '<%= presentationApp.app %>/styles/fonts',
                importPath: '<%= presentationApp.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= presentationApp.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: false
                }
            }
        },
        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            dist: {
                files: [{
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }]
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= presentationApp.app %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= presentationApp.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= presentationApp.dist %>'
                }
            }
        },
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                force: true,
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= presentationApp.app %>/js/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        }

    });


    grunt.registerTask('serve', function(target) {
//        if (target === 'dist') {
//            return grunt.task.run(['build', 'connect:dist:keepalive']);
//        }

        grunt.task.run([
            'clean:server',
            'concat:server',
            'includereplace:server',
//            'jshint',
            'concurrent:server',
//            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

};
