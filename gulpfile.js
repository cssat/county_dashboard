var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    browserify = require('browserify'),
    buffer = require('gulp-buffer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    source     = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    transform = require('vinyl-transform'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');

/* Vendor */
gulp.task('javascript:vendor', function() {
  gulp.src([
        './assets/js/vendor/d3.v3.5.6.min.js',
        './assets/js/vendor/d3-tip.v0.6.7.js'
    ])
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/vendor'));
});

/* Custom scripts */
gulp.task('scripts', function() {
  return browserify({entries:['./assets/js/dashboard.js']})
    .bundle()
    .pipe(source('dashboard.min.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

/* Watch task for development */
gulp.task('watch', function() {
 	gulp.watch('./assets/js/modules/*.js',['scripts']);
    gulp.watch('./assets/js/dashboard.js',['scripts']);
    gulp.watch('./assets/js/vendor/*.js',['javascript:vendor']);
});

/* Default build task */
gulp.task('default', function() {
 	gulp.start('scripts', 'javascript:vendor');
});
