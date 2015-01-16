module.exports = function(grunt) {

    /* Define the files and directories that we're working with.  */
    var configOptions = {
        "srcPath"                   : 'src/',
        "buildPath"                 : 'build/',
        "distPath"                  : 'dist/',
        "previewLocalPath"          : '/local/MAMP/path/',

        "buildAssets"               : [

                                        'index.html',
                                        'gfx/*',
                                        'css/<%= pkg.name %>.vendor.min.css',
                                        'css/<%= pkg.name %>.app.min.css',
                                        'js/<%= pkg.name %>.vendor.min.js',
                                        'js/<%= pkg.name %>.app.min.js',

                                        ],

        "cssVendorSource"           : [
                                        'bower_components/normalize-css/normalize.css',
                                        'bower_components/foundation/css/foundation.css',
                                        'bower_components/fonts/foundation-icon-fonts/foundation-icons.css'
                                        ],



        "cssBaseSource"             : 'src/scss/base.scss',
        "cssCSS3Source"             : 'src/scss/css3.scss',
        "cssAppMediaQueriesSource"  : 'src/scss/media-queries.scss',
        "cssCustomSource"           : 'src/scss/custom.scss',
        "cssAppIESource"            : 'src/scss/base-ie.scss',

        /* This doesn't work for the SASS task? Output is redundantly hard-coded below.  */
        "cssBaseOutput"             : 'build/css/base.css',
        "cssCSS3Output"             : 'build/css/css3.css',
        "cssAppMediaQueriesOutput"  : 'build/css/media-queries.css',
        "cssCustomOutput"           : 'build/css/custom.css',

        "cssAppOutput"              : 'build/css/app-concat.css',
        "cssAppIEOutput"            : 'build/css/app-ie.css',

        "jsVendorSource"            : [
                                        'bower_components/jquery/dist/jquery.js',
                                        'bower_components/foundation/js/foundation.js',
                                        'bower_components/dataset/dist/miso.ds.deps.ie.min.0.4.1.js',
                                        // 'bower_components/mediaelement/build/mediaelement-and-player.js',
                                        // 'bower_components/protonet/jquery.inview/jquery.inview.js',
                                        ],

        "jsAppSource"               : [ 'src/scripts/base.src.js' ],

    };




    /* Deploy unconcatenated copy of vendor CSS & JS including js that's not concatenated */
    cssVendorCopyThruFiles           = configOptions.cssVendorSource;
    // cssVendorCopyThruFiles.push('bower_components/leaflet/dist/leaflet.css');

    jsVendorCopyThruFiles           = configOptions.jsVendorSource;
    jsVendorCopyThruFiles.push('bower_components/modernizr/modernizr.js');
    // jsVendorCopyThruFiles.push('bower_components/leaflet/dist/leaflet.js');
    // jsVendorCopyThruFiles.push('bower_components/leaflet-providers/leaflet-providers.js');




    /* Load the required grunt modules using Matchdep  */
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Task configurations
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        sass: {

            app: {
                options: {
                    // style: 'compressed'
                },
                files: {
                    'build/css/base.css'            : configOptions.cssBaseSource,
                    'build/css/css3.css'            : configOptions.cssCSS3Source,
                    'build/css/media-queries.css'   : configOptions.cssAppMediaQueriesSource,
                    'build/css/custom.css'          : configOptions.cssCustomSource,
                    'build/css/base-ie.css'         : configOptions.cssAppIESource

                }
            }

        },

        // autoprefixer: {

        //     single_file: {
        //         options: {
        //             browsers: ['last 2 versions']
        //         },

        //         files: {
        //            'build/css/<%= pkg.name %>.app.css'                           : ['build/css/app-concat.css'],
        //            'build/css/<%= pkg.name %>.app-ie.css'                        : ['build/css/app-ie.css'],
        //            'build/css/<%= pkg.name %>.css3.css'                          : ['build/css/css3.css'],
        //            'build/css/<%= pkg.name %>.media-queries.<%= pkg.slug %>.css' : ['build/css/media-queries.<%= pkg.slug %>.css']
        //         }

        //     }
        // },

        concat: {

            options: {
                banner: grunt.util.linefeed + grunt.util.linefeed + ' /* <%= pkg.name %> | <%= grunt.template.today("yyyy-mm-dd") %> */ ' + grunt.util.linefeed + grunt.util.linefeed
            },
            cssVendor: {
                src: configOptions.cssVendorSource,
                dest: 'build/css/<%= pkg.name %>.vendor.css'
            },
            cssApp: {
                src: [
                    configOptions.cssBaseOutput,
                    configOptions.cssCSS3Output,
                    configOptions.cssCustomOutput,
                    configOptions.cssAppMediaQueriesOutput
                ],
                dest: 'build/css/<%= pkg.name %>.app-concat.css'
            },
            jsVendor: {
                src: configOptions.jsVendorSource,
                dest: 'build/js/<%= pkg.name %>.vendor.js'
            },
            jsApp: {
                src: configOptions.jsAppSource,
                dest: 'build/js/<%= pkg.name %>.app.js'
            },

        },

        cssmin: {

            options: {
                banner: grunt.util.linefeed + grunt.util.linefeed + ' /* <%= pkg.name %> | <%= grunt.template.today("yyyy-mm-dd") %> */ ' + grunt.util.linefeed + grunt.util.linefeed
            },

            cssApp: {
                files: {
                    'build/css/<%= pkg.name %>.app.min.css' : 'build/css/<%= pkg.name %>.app-concat.css'
                }
            },
            cssVendor: {
                files: {
                    'build/css/<%= pkg.name %>.vendor.min.css' : 'build/css/<%= pkg.name %>.vendor.css'
                }
            }

        },

        uglify: {

            options: {
                mangle: false,
                banner: grunt.util.linefeed + grunt.util.linefeed + ' /* <%= pkg.name %> | <%= grunt.template.today("yyyy-mm-dd") %> */ ' + grunt.util.linefeed + grunt.util.linefeed,
                compress: {
                    drop_console: false
                }
            },

            jsApp: {
                files: {
                    'build/js/<%= pkg.name %>.app.min.js' : ['build/js/<%= pkg.name %>.app.js']
                }
            },
            jsVendor: {
                files: {
                    'build/js/<%= pkg.name %>.vendor.min.js' : ['build/js/<%= pkg.name %>.vendor.js']
                }
            }

        },

        clean: {
            build: configOptions.distPath,
        },

        copy: {

            vendorCSS: {
                expand: true,
                src: configOptions.cssVendorSource,
                dest: 'build/css/vendor/',
            },

            vendorCSSCopy: {
                expand: true,
                src: cssVendorCopyThruFiles,
                dest: 'build/css/vendor/',
            },
            vendorJS: {
                expand: true,
                src: jsVendorCopyThruFiles,
                dest: 'build/js/vendor/',
            },

            vendorAssets: {
                nonull:true,
                expand: true,
                src: 'src/vendor-assets/**',
                flatten: true,
                filter: 'isFile',
                dest: 'build/css/',
            },
            assets: {
                expand: true,
                cwd: 'src/',
                src: configOptions.buildAssets,
                dest: configOptions.buildPath,
            },
            build: {
                expand: true,
                cwd: 'build/',
                src: '**',
                dest: configOptions.distPath,
            },

            deployPreview: {
                expand: true,
                cwd: configOptions.distPath,
                src: '**',
                dest: configOptions.previewLocalPath,
            }

        },

        watch: {

            options: {
                spawn: false,
            },
            html: {
                files: ['**/*.html', '!_site/**/*.html'],
                tasks: ['deploy']
            },
            scss: {
                files: ['**/scss/*.scss'],
                tasks: ['deploy']
            },
            js: {
                files: ['**/scripts/*.src.js'],
                tasks: ['deploy']
            }

        },


        responsive_images: {

            longwriter: {
              options: {
                sizes: [
                    {
                      width: 300,
                    },
                    {
                      width: 320,
                    },
                    {
                      width: 460,
                    },
                    {
                      width: 620,
                    },
                    {
                      width: 1000,
                    },
                    {
                      width: 2000,
                    }
                ]
              },
              files: [{
                expand: true,
                src: ['**.{jpg,gif,png}'],
                cwd: 'src/static/gfx/src/',
                custom_dest: 'src/static/gfx/{%= width %}/'
              }]
            }

        },


    });


    /* Define CLI tasks*/
    grunt.registerTask('preprocess',    ['sass']);
    grunt.registerTask('build',         ['preprocess', 'concat', 'cssmin', 'uglify', 'clean', 'copy:vendorCSS', 'copy:vendorJS', 'copy:vendorAssets', 'copy:assets', 'copy:build']);
    grunt.registerTask('deploy',        ['build', 'copy:deployPreview']);
    grunt.registerTask('default',       ['sass', 'deploy']);

};
