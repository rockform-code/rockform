var gulp = require('gulp');

var less = require('gulp-less');
var path = require('path');

gulp.task('default', function () {
  return gulp.src('/frontend/themes/default/less/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('/frontend/themes/default/'));
});
