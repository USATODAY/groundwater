var config = require('../config/require');
var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var requirejsOptimize = require('gulp-requirejs-optimize');
var handleErrors = require('../lib/handleErrors');

gulp.task('require:development', function() {
    gulp.src("./bower_components/requirejs/require.js")
    .pipe(gulp.dest("./public/js/"));

    gulp.src(config.src + "main.js")
    .pipe(requirejsOptimize({
        name: "main",
        optimize: 'none',
        shim: config.shim,
        paths: config.paths
    }))
    
        .on('error', handleErrors)
        .pipe(gulp.dest(config.dest)) // pipe it to the output DIR 
        .pipe(browserSync.reload({stream:true})); 
});