"use strict";

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    minify = require('gulp-minify'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync');

/*
 * Directories here
 */

var paths = {
    build: './build/',
    prodPages: './',
    src: './src/',
    srcScss: './src/styles',
    buildJs: './build/js/',
    buildCss: './build/styles/'
};

/**
 * Compile html files.
 */
gulp.task('html', function () {
    'use strict';
    return gulp.src(paths.src + '/template/*.html')
        .pipe(gulp.dest(paths.build))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/**
 * Compile .scss files into build css directory then live reload the browser.
 */
gulp.task('sass', function () {
    return gulp.src(paths.src + '/styles/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)

        .pipe(autoprefixer({
            browsers: ['> 1%', 'ie 8-10'],
            cascade: false
        }))
        .pipe(gulp.dest(paths.buildCss))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/**
 * Concat js libs and move to build
 */

let jsList = [
    paths.src + '/js/libs/*.js',
];

gulp.task('js', function () {
    return gulp.src(jsList)
        .pipe(concat('libs.js'))
        .on('error', function (err) {
            process.stderr.write(err.message + '\n');
            this.emit('end');
        })
        .pipe(minify())
        .pipe(gulp.dest(paths.buildJs));

});

/**
 * Base js build
 */
gulp.task('js-main', function () {
    return gulp.src(paths.src + '/js/*.js')

        .on('error', function (err) {
            process.stderr.write(err.message + '\n');
            this.emit('end');
        })
        .pipe(gulp.dest(paths.buildJs))
        .pipe(minify())
        .pipe(browserSync.reload({
            stream: true
        }));
});

/**
 * Optimize and move images
 */
gulp.task('img', function () {
    return gulp.src(paths.src + '/img/**/*')
        .pipe(imagemin())
        .on('error', function (err) {
            process.stderr.write(err.message + '\n');
            this.emit('end');
        })
        .pipe(gulp.dest(paths.build + 'img'));
});

gulp.task('browser-sync', function (done) {
    browserSync.init({
        server: {
            baseDir: './build/'
        },
        notify: false
    });

        gulp.watch('./src/**/*.scss', gulp.series('sass'));
        gulp.watch('./src/template/*.html', gulp.series('html'));
        gulp.watch('./src/**/**/*.js', gulp.series('js-main'));
    done()
});

// Build task compile sass and twig.
gulp.task('build', gulp.series('sass', 'html', 'js', 'js-main', 'img'));

/**
 * Default task, running just `gulp` will compile,
 * launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', gulp.series('browser-sync'));
