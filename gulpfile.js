'use strict;'

var gulp = require('gulp');
var connect = require('gulp-connect'); //web server
var open = require('gulp-open'); //open url

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost:9005',
    paths: {
        html: './src/*.html',
        dist: './dist'
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

gulp.task('watch', function () {
    gulp.watch(config.paths.html, gulp.series('html'));
});

gulp.task('default', gulp.series('html', 'open', 'watch'));

