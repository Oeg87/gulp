// Include gulp
var gulp = require('gulp'),
    //Var
    src = 'dev/',
    dest = 'build/',

    // Include plugins
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    htmlmin = require('gulp-htmlmin'),
    sourcemaps = require('gulp-sourcemaps');

//Server
gulp.task('connect', function() {
    connect.server({
        root: 'dev',
        livereload: true
    });
});


// Concatenate JS Files
gulp.task('scripts', function() {
    return gulp.src([src + 'js/js-1.js', src + 'js/js-2.js', src + 'js/js-3.js'])
        .pipe(concat('main.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dest + 'js'))
        .pipe(connect.reload());
});

gulp.task('lint', function() {
    return gulp.src(src + 'js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(connect.reload());
});

gulp.task('html', function() {
    gulp.src(src + '*.html')
        .pipe(connect.reload());
});

gulp.task('sass', function() {
    return sass(src + 'sass/**/*.scss', {
            style: 'default',
            sourcemap: true
        })
        .on('error', sass.logError)
        .pipe(gulp.dest(dest + 'css'))
        .pipe(connect.reload());
});

gulp.task('autoprefixer', function() {
    return gulp.src(dest + 'app.css')
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(dest + 'css/'))
        .pipe(connect.reload());
});

gulp.task('images', function() {
    return gulp.src(src + 'img/*')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(dest + 'img'))
        .pipe(connect.reload());
});



gulp.task('minify', function() {
    return gulp.src(src + '*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(dest))
        .pipe(connect.reload());
});

gulp.task('watch', function() {

    gulp.watch([src + 'js/*.js'], ['lint', 'scripts']);
    gulp.watch([src + 'sass/*.scss'], ['sass']);
    gulp.watch([src + 'img/**/*'], ['images']);
    gulp.watch([src + 'html/*'], ['html']);
    livereload.listen();
});


//clear cache
gulp.task('clear', function(done) {
    return cache.clearAll(done);
});

// Default Task
gulp.task('default', ['connect', 'scripts', 'sass', 'autoprefixer', 'images', 'lint', 'html', 'minify', 'watch']);
