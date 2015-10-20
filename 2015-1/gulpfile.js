var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    tap = require('gulp-tap'),
    del = require('del'),
    cache = require('gulp-cache'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync');

//處理所有css相關的工作
gulp.task('styles', function() {
    return gulp.src('assets/css/**/*.css')
        .pipe(sourcemaps.init()) 
        .pipe(concat('main.css'))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')) //自動加入前綴，提高瀏覽器支援
        .pipe(gulp.dest('assets/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCss()) //最小化
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/css'))
        .pipe(notify({
            message: 'Styles task complete'
        }));
});


//圖片最佳化
gulp.task('images', function() {
    return gulp.src('assets/img/**')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('assets/img'))
        .pipe(notify({
            message: 'Images task complete'
        }));
});

//處理所有js的相關工作
gulp.task('scripts', function() {
    return gulp.src('assets/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('mains.js')) //合併所有js檔
        .pipe(sourcemaps.write())
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest('assets/js'))
        .pipe(rename({
            suffix: '.min'
        })) 
        .pipe(uglify()) //醜化
        .pipe(gulp.dest('assets/js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// 清除dist
gulp.task('clean', function(cb) {
    del(['dist/styles', 'dist/scripts', 'dist/images'], cb)
});

//清除cleanSrc
gulp.task('cleanSrc', function(cb) {
    del(['src/styles', 'src/scripts'], cb)
});

gulp.task('view',function(){
    return gulp.src('src/app/view/**')
            .pipe(gulp.dest('src/scripts/view'))
})
//先清除檔案再編譯所有檔案
gulp.task('build', ['cleanSrc'], function() {
    gulp.start('styles', 'scripts', 'view');
});
 
//預設任務
gulp.task('default', function() {

    // gulp.watch(['src/sass/**/*.scss','!src/sass/_sprite.scss'], ['styles']);
 
    // gulp.watch('src/app/{**/*.js, app.js}', ['scripts']);
    
    // gulp.watch('src/app/view/**',['view']);
    // gulp.watch('src/images/**',['images']);

    browserSync({
        server: {
            baseDir: "./",
        },
        port: 8080
    });
 
    // gulp.watch(['src/scripts/**','src/styles/**','src/index.html'], browserSync.reload);
 
});

//發佈
gulp.task('deploy',['clean'],function(){
    gulp.src('src/scripts/**')
    .pipe(gulp.dest('dist/scripts'));
    gulp.src('src/styles/**')
    .pipe(gulp.dest('dist/styles'));
    gulp.src('src/images/**')
    .pipe(gulp.dest('dist/images'));
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
    gulp.src('src/app/view/**')
    .pipe(gulp.dest('dist/scripts'));
});