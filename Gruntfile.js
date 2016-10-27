module.exports = function(grunt) {  
    //config project  
    grunt.initConfig({  
        watch: {  
            options: {  
                livereload: true,  
            },  
            express: {  
                files:  [ '**/*.js', 'views/**/*.js' ], 
                tasks:  [ 'express:dev' ], 
                options: {  
                    spawn: false
                }  
            },
            // less: {
            //     files: ["public/**/*.less"],
            //     tasks: ["less"],
            //     options: {
            //       livereload: false
            //     }
            // },
            public: {
                files: ["public/**/*.css", "public/**/*.js"]
            } 
        },  
        //start express server and run server.js  
        express: {  
            options: {  
                // Override defaults here  
            },  
            dev: {  
                options: {  
                    script: './bin/www'  
                }  
            }  
        }  
    });  
    //enable plugins  
    grunt.loadNpmTasks('grunt-express-server');  
    grunt.loadNpmTasks('grunt-contrib-watch');  
    //register task  
    grunt.registerTask('default', ['express:dev','watch']);  
};  