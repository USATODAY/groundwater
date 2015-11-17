var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('build:production', function(cb) {
  process.env.NODE_ENV = 'production'
  gulpSequence('clean', ['images'], ['sass', 'require:production'], 'html', 'data', cb);
});
