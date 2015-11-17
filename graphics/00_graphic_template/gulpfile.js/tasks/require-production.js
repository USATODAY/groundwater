var config = require('../config/require');
var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var requirejsOptimize = require('gulp-requirejs-optimize');
var handleErrors = require('../lib/handleErrors');

gulp.task('require:production', function() {
    gulp.src("./bower_components/requirejs/require.js")
    .pipe(gulp.dest("./public/js/"));

   gulp.src(config.src + "main.js")
    .pipe(requirejsOptimize({
        name: 'main',
        paths: config.paths,
        exclude: ['d3', 'jquery', 'backbone', 'underscore', 'api/analytics']
    }))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.dest)); // pipe it to the output DIR
});