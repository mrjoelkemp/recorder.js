var gulp    = require('gulp'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat');

var scripts = ['vendor/diff_patch/*.js', 'src/*.js'];

gulp.task('scripts', function() {

  gulp.src(scripts)
    .pipe(concat('jquery.recorder.unmin.js'))
    .pipe(gulp.dest('dist'));

  // Google's diff patch should be prepended
  gulp.src(scripts)
    .pipe(concat('jquery.recorder.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
  gulp.run('scripts');

  // Watch files and run tasks if they change
  gulp.watch(scripts, function () {
    gulp.run('scripts');
  });
});