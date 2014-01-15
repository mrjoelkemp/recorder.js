var gulp    = require('gulp'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat');

gulp.task('scripts', function() {
  // Google's diff patch should be prepended
  gulp.src(['vendor/**/*.js', 'src/*.js'])
    .pipe(concat('jquery.recorder.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
  gulp.run('scripts');

  // Watch files and run tasks if they change
  gulp.watch('src/js/**', function() {
    gulp.run('scripts');
  });
});