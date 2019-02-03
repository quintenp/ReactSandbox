'use strict;'

var gulp = require('gulp');
var connect = require('gulp-connect'); //web server
var open = require('gulp-open'); //open url
var browserify = require('browserify'); //bundle
var reactify = require('reactify'); //jsx to js
var source = require('vinyl-source-stream'); //text streams with gulp

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost:9005',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
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

gulp.task('watch', function () {
    gulp.watch(config.paths.html, gulp.series('html'));
    gulp.watch(config.paths.js, gulp.series('js'));
});

gulp.task('default', gulp.series('html', 'js', 'open', 'watch'));

