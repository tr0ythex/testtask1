const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('styles', () => {
    gulp.src('styles.sass')
        .pipe(sass())
        .pipe(gulp.dest('.'))
});