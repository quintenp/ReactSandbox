'use strict;'

var gulp = require('gulp');
var connect = require('gulp-connect'); //web server
var open = require('gulp-open'); //open url
var browserify = require('browserify'); //bundle
var reactify = require('reactify'); //jsx to js
var source = require('vinyl-source-stream'); //text streams with gulp
var concat = require('gulp-concat'); //Concats files
var eslint = require('gulp-eslint'); //Lints the code

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost:9005',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css'
        ],
        dist: './dist',
        mainJs: './src/app.js'
    }
}

gulp.task('connect', function (done) {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
    done();
});

gulp.task('open', gulp.series('connect', function (done) {
    gulp.src('./dist/index.html')
        .pipe(open({ uri: config.devBaseUrl }));
    done();
}));

gulp.task('html', function (done) {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
    done();
});

gulp.task('js', function (done) {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
    done();
});

gulp.task('css', function (done) {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
    done();
});

gulp.task('lint', function (done) {
    return gulp.src(config.paths.js)
        .pipe(eslint({ config: 'eslint.config.jsom' }))
        .pipe(eslint.format());
});

gulp.task('watch', function () {
    gulp.watch(config.paths.html, gulp.series('html'));
    gulp.watch(config.paths.js, gulp.series(['js','lint']));
});

gulp.task('default', gulp.series('html', 'js', 'css', 'lint', 'open', 'watch'));

