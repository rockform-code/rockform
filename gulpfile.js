var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var Promise = require('es6-promise').Promise;


gulp.task('css', function() {
    return gulp.src('frontend/themes/default/less/main.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 3 versions', '> 1%', 'IE 9', 'IE 10', 'IE 11'],
            cascade: false
        }))
        .pipe(minifyCSS({
            keepBreaks: true
        }))
        .pipe(gulp.dest('frontend/themes/default/'));
});

gulp.task('js', function() {
    return gulp.src('frontend/lib/baseform.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('frontend/lib/'));
});

gulp.task('requirejs', function() {
    return gulp.src('node_modules/requirejs/require.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('frontend/lib/'));
});

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('frontend/lib/'))
});

gulp.task('watch', function() {
    gulp.watch('frontend/themes/default/less/*.less', ['css'])
    gulp.watch('frontend/lib/*.js', ['js']),
        gulp.watch('node_modules/requirejs/require.js', ['requirejs']),
        gulp.watch('bower.json', ['bower'])
});

gulp.task('default', ['watch']);
