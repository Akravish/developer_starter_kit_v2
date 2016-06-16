'use strict';

//---Import Modules
const gulp = require('gulp');
const del = require('del');

const debug = require('gulp-debug');//todo delete after finished work

const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const newer = require('gulp-newer');

const util = require('gulp-util');

//glob = require 'glob'
//util = require 'gulp-util'
//consolidate = require "gulp-consolidate"
//inlineCss = require "gulp-inline-css"
//extReplace = require 'gulp-ext-replace'
//prettify = require 'gulp-html-prettify'
//minifyHTML = require 'gulp-minify-html'

//server = require('tiny-lr')()
//refresh = require 'gulp-livereload'

//---END Base imports and vars


//---Del build directory
gulp.task('del', function(){
    return del(['temp/f2/**/*.*']).then( function(paths){
            console.log('Deleted:\n',paths.join('\n'));})
});

//---Copy js
gulp.task('js', function () {
    return gulp.src('temp/f1/js/*.js')
        .pipe(gulp.dest('temp/f2/js'));
});

//---Copy css
gulp.task('css', function () {
    return gulp.src('temp/f1/css/*.css')//todo can use in gulp v4.0 {since: gulp.lastRun('js')}
        .pipe(newer('temp/f2/css'))
        .pipe(gulp.dest('temp/f2/css'));
});

//---Copy img
gulp.task('img', function () {
    return gulp.src('temp/f1/img/**/*.*')
        .pipe(gulp.dest('temp/f2/img'));
});

//---Copy fonts
gulp.task('fonts', function () {
    return gulp.src('temp/f1/fonts/**/**')
        .pipe(gulp.dest('temp/f2/fonts'));
});

//---Copy public
gulp.task('public', function () {
    return gulp.src('temp/f1/public/**/*')
        .pipe(gulp.dest('temp/f2/'));
});

//---SASS
gulp.task('sass', function(){
    //todo not show errors...fix it
    return gulp.src(['temp/f1/sass/*.sass','!src/sass/_*'])
        //.pipe(plumber())
        //.pipe(sourcemaps.init())//todo del in prod ...set some if and we have some problem in it...test in livereload
        .pipe(sass().on('error', sass.logError))
        //.pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer({ browser: ['last 2 version'] }))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('temp/f2/css'));

});

gulp.task('watch', function () {
    gulp.watch('temp/f1/**/*.sass', ['sass']);
    gulp.watch('temp/f1/css/*.css', ['css']);
});

//gulp.task 'sass', ->
//gulp.src ['src/sass/*.sass', '!src/sass/_*']
//    .pipe compass
//css        : 'build/css/'
//sass       : 'src/sass/'
//image      : 'src/img/'
//require    : ['bootstrap-sass', 'sass-globbing']
//comments   : false
//style      : 'expanded'
//bundle_exec: true
//    .on 'error', util.log
//    .pipe autoprefixer 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
//    .pipe gulp.dest 'build/css'
//    .pipe refresh(server)



gulp.task('default',['t1','watch'], function(callback){
    console.log('t3');
    callback();
});





//-----------GULP-TEST----------------------------------
gulp.task('t1', function(callback){
   console.log('t1');
   callback();
});


gulp.task('t2', function(callback){
   console.log('t2');
   callback();
});



gulp.task('file', function(callback){
   return gulp.src('temp/f1/**/*.*')
       .on('data',function(file){
          console.log(file)
       })
       .pipe(gulp.dest('temp/f2'));
});

gulp.task('default',['t1','t2'], function(callback){
   console.log('t3');
   callback();
});



