'use strict';

//---Import Modules
const gulp = require('gulp');
const del = require('del');

const debug = require('gulp-debug');//todo delete after finished work

const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const newer = require('gulp-newer'); //todo with 40ms, without 30ms....fix it


//const util = require('gulp-util');
//glob = require 'glob'
//consolidate = require "gulp-consolidate"
//inlineCss = require "gulp-inline-css"
//extReplace = require 'gulp-ext-replace'
//prettify = require 'gulp-html-prettify'
//minifyHTML = require 'gulp-minify-html'


//---END Base imports and vars
//---Serve
const browsersync = require('browser-sync').create();
const reload  = browsersync.reload;
//---End serve


//---DEL build directory
gulp.task('del', function(){
    return del(['temp/f2/**/*.*']).then( function(paths){
            console.log('Deleted:\n',paths.join('\n'));})
});

//---Copy JS
gulp.task('js', function () {
    return gulp.src('temp/f1/js/*.js')
        .pipe(newer('temp/f2/js/*.js'))
        .pipe(gulp.dest('temp/f2/js'));
});

//---Copy CSS
gulp.task('css', function () {
    return gulp.src('temp/f1/css/*.css')//todo can use in gulp v4.0 {since: gulp.lastRun('js')}
        .pipe(newer('temp/f2/css/*.css'))
        .pipe(gulp.dest('temp/f2/css'));
});

//---Copy IMG
gulp.task('img', function () {
    return gulp.src('temp/f1/img/**/*.*')
        .pipe(newer('temp/f2/img'))
        //todo insert imagemin here code
        .pipe(gulp.dest('temp/f2/img'));
});

//---Copy FONTS
gulp.task('fonts', function () {
    return gulp.src('temp/f1/fonts/**/**')
        .pipe(newer('temp/f2/fonts'))
        .pipe(gulp.dest('temp/f2/fonts'));
});

//---Copy ASSETS
gulp.task('assets', function () {
    return gulp.src('temp/f1/assets/**/*')
        .pipe(newer('temp/f2/assets'))
        //todo insert fontsmin here code
        .pipe(gulp.dest('temp/f2/assets'));
});

//---SASS
gulp.task('sass', function(){
    //todo not show errors...fix it
    return gulp.src(['temp/f1/sass/*.sass','!src/sass/_*'])
        //.pipe(plumber())
        //.pipe(sourcemaps.init())//todo del in prod ...set some if and we have some problem in it...test in livereload
        .pipe(sass().on('error', sass.logError))
        //.pipe(sourcemaps.write({includeContent: false}))//todo we have some problem in it...test in livereload
        //.pipe(sourcemaps.init({loadMaps: true}))//todo we have some problem in browsersync
        .pipe(autoprefixer({ browser: ['last 2 version'] }))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('temp/f2/css'));
});

gulp.task('watch', function () {
    //js
    gulp.watch('temp/f1/js/*.js', ['js']);
    //css
    gulp.watch('temp/f1/css/*.css', ['css']);
    //img
    gulp.watch('temp/f1/img/**/*.*', ['img']);
    //fonts
    gulp.watch('temp/f1/fonts/**/**', ['fonts']);
    //public
    gulp.watch('temp/f1/assets/**/*', ['assets']);
    //sass
    gulp.watch('temp/f1/**/*.sass', ['sass']);
});


//---Serve
gulp.task('serve', function(callback){
    browsersync.init({
        server: 'temp/f2',
        port: 8000,
        ui: {
            port: 3001
        },
        open: false // Stop the browser from automatically opening
    })

    browsersync.watch('temp/f2/**/*.*').on('change',browsersync.reload);
});

gulp.task('default',['serve','watch'], function(callback){
    console.log('+++');
    callback();
});

