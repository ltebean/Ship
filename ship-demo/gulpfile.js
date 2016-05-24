var gulp = require('gulp');
var rev = require('gulp-rev');

gulp.task('default', function () {
    return gulp.src('src/**/*')
        .pipe(rev())
        .pipe(gulp.dest('build'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build'));
});