var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

gulp.task('images', function() {
    return gulp.src('./assets/img/**')
        .pipe(imagemin({
            optimizationLevel: 4,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('./assets/img/'));
});