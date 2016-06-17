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
const jadeInheritance = require('gulp-jade-inheritance');
const jade = require('gulp-jade');

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


//---VARS
const apiServerPort   = 3001,
      webServerPort   = 8000,
      autoOpenBrowser = false;
      //destFolder      =

//---End VARS


//---DEL build directory
gulp.task('del', function(){
    return del(['temp/f2/**/*.*']).then( function(paths){
            console.log('Deleted:\n',paths.join('\n'));})
});

//---Copy JS
gulp.task('js', function () {
    return gulp.src('temp/f1/js/*.js')
        .pipe(newer('temp/f2/js/*.js'))
        .pipe(gulp.dest('temp/f2/js'))
        .pipe(reload({stream:true}));
});

//---Copy CSS
gulp.task('css', function () {
    return gulp.src('temp/f1/css/*.css')//todo can use in gulp v4.0 {since: gulp.lastRun('js')}
        .pipe(newer('temp/f2/css/*.css'))
        .pipe(gulp.dest('temp/f2/css'))
        .pipe(reload({stream:true}));
});

//---Copy IMG
gulp.task('img', function () {
    return gulp.src('temp/f1/img/**/*.*')
        .pipe(newer('temp/f2/img'))
        //todo insert imagemin here code
        .pipe(gulp.dest('temp/f2/img'))
        .pipe(reload({stream:true}));
});

//---Copy FONTS
gulp.task('fonts', function () {
    return gulp.src('temp/f1/fonts/**/**')
        .pipe(newer('temp/f2/fonts'))
        .pipe(gulp.dest('temp/f2/fonts'))
        .pipe(reload({stream:true}));
});

//---Copy ASSETS
gulp.task('assets', function () {
    return gulp.src('temp/f1/assets/**/*')
        .pipe(newer('temp/f2/assets'))
        //todo insert fontsmin here code
        .pipe(gulp.dest('temp/f2/assets'))
        .pipe(reload({stream:true}));
});

//---Vendors
//todo dest must be reload when files sre added

//todo addes errorlog for all task

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
        .pipe(gulp.dest('temp/f2/css'))
        .pipe(reload({stream:true}));
});

gulp.task('jade', function() {
    gulp.src(['temp/f1/jade/*.jade','!src/jade/_*'])
        .pipe(jadeInheritance({ basedir: 'temp/f1/jade'}))
        .pipe(jade({
            pretty: '\t',
            basedir: 'temp/f1/jade'
        }))
        //.on('error', handleError)
        .pipe(gulp.dest('temp/f2/'))
        .pipe(reload({stream:true}));
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
    //jade
    gulp.watch('temp/f1/**/*.jade', ['jade']);
});


//---Serve
gulp.task('serve', function(callback){
    browsersync.init({
        server: 'temp/f2',
        port: webServerPort,
        ui: {
            port: apiServerPort
        },
        open: autoOpenBrowser // Stop the browser from automatically opening
    });

    //watch all for files in dest folder
    //browsersync.watch('temp/f2/**/*.*').on('change',reload);
});

gulp.task('default',['serve','watch'], function(callback){
    console.log('+++');
    callback();
});


//===================================================

//'use strict';
//
//// Инициализируем плагины
//var gulp = require('gulp'),

//    autoprefixer = require('gulp-autoprefixer'),
//    imagemin = require('gulp-imagemin'),
//    cssbeautify = require('gulp-cssbeautify'),
//    gutil = require('gulp-util'),
//    cache = require('gulp-cache'),
//    include = require('gulp-include'),
//    rename = require("gulp-rename"),
//    uglify = require('gulp-uglify'),
//    imageminPngquant = require('imagemin-pngquant'),

//
//// Функция обработки ошибок
//var handleError = function(err) {
//    gutil.log(err);
//    gutil.beep();
//};
//
//// Пути к файлам
//var path = {
//    html: {
//        source: ['./source/**/*.jade', '!./source/partials/*.jade', '!./source/blocks/**/*.jade'],
//        watch: 'source/**/*.jade',
//        destination: './public/',
//        basedir: './source'
//    },
//    css: {
//        source: ['./source/css/*.styl', '!./source/css/lib/**/*.styl', '!./source/**/_*.styl'],
//        watch: 'source/**/*.styl',
//        destination: './public/css/'
//    },
//    assets: {
//        source: './assets/**/*',
//        watch: 'assets/**/*',
//        destination: './public'
//    },
//    img: {
//        source: './source/img/**/*.{jpg,jpeg,png,gif,svg}',
//        watch: 'source/img/**/*',
//        destination: './public/img'
//    },
//    js: {
//        plugins: {
//            source: './source/js/*.js',
//            watch: './source/js/*',
//            destination: './public/js'
//        }
//    }
//};
//
//
//// Локальный сервер
//gulp.task('browser-sync', function () {
//    browserSync.init([
//        '*.html',
//        'css/*.css',
//        '**/*.{png,jpg,svg}',
//        'js/*.js',
//        'fonts/*.{eot,woff,woff2,ttf}'
//    ], {
//        open: true,
//        server: { baseDir: './public' }
//    });
//});
//
//
//// Собираем html из Jade

//
//// Копируем и минимизируем изображения
//gulp.task('images', function() {
//    gulp.src(path.img.source)
//        .pipe(cache(imagemin({
//            optimizationLevel: 3,
//            progressive: true,
//            interlaced: true,
//            svgoPlugins: [{removeViewBox: false}],
//            use: [imageminPngquant()]
//        })))
//        .on('error', handleError)
//        .pipe(gulp.dest(path.img.destination));
//});
//
//// Копируем файлы
//gulp.task('copy', function() {
//    gulp.src(path.assets.source)
//        .on('error', handleError)
//        .pipe(gulp.dest(path.assets.destination))
//        .pipe(reload({stream:true}));
//});
//
//// Собираем JS
//gulp.task('plugins', function() {
//    gulp.src(path.js.plugins.source)
//        .pipe(include())
//        .pipe(gulp.dest(path.js.plugins.destination))
//        .pipe(uglify())
//        .pipe(rename({
//            suffix: ".min"
//        }))
//        .on('error', handleError)
//        .pipe(gulp.dest(path.js.plugins.destination))
//        .pipe(reload({stream:true}));
//});
//
//
//gulp.task("build", ['stylus', 'jade', 'images', 'plugins', 'copy']);
//
//gulp.task("default", ["build", "browser-sync"], function(){
//    gulp.watch(path.css.watch, ["stylus"]);
//    gulp.watch(path.html.watch, ["jade"]);
//    gulp.watch(path.img.watch, ["images"]);
//    gulp.watch(path.js.plugins.watch, ["plugins"]);
//    gulp.watch(path.assets.watch, ["copy"]);
//});