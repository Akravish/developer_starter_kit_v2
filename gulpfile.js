'use strict';

//---Import Modules
var gulp = require('gulp'),
    del = require('del'),
    debug = require('gulp-debug'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    newer = require('gulp-newer'), //todo with 40ms, without 30ms....fix it
    jadeInheritance = require('gulp-jade-inheritance'),
    jade = require('gulp-jade');

//const util = require('gulp-util');
//glob = require 'glob'
//consolidate = require "gulp-consolidate"
//inlineCss = require "gulp-inline-css"
//extReplace = require 'gulp-ext-replace'
//prettify = require 'gulp-html-prettify'
//minifyHTML = require 'gulp-minify-html'

//---END Base imports and vars


//---Serve
var browsersync = require('browser-sync').create(),
    reload  = browsersync.reload;
//---End serve


//---VARS
var apiServerPort   = 3001,
    webServerPort   = 8000,
    autoOpenBrowser = false;


var devSrc = 'temp/f1',
    devDest = 'temp/f2',
    pathProject = {
        del: '/**/*.*',
        js: {
            input: '/js/*.js',
            output: '/js'
        },
        css: {
            input: '/css/*.css',
            output: '/css'
        },
        img: {
            input: '/img/**/*.*',
            output: '/img'
        },
        fonts: {
            input: '/fonts/**/**',
            output: '/fonts'
        },
        assets: {
            input: '/assets/**/*',
            output: '/assets'
        },
        vendor: {
            input: '',
            output: ''
        },
        sass: {
            input: 'assets/**/*',
            output: '/assets'
        },
        jade: {
            input1: '/jade/*.jade',
            input2: '/jade',
            watchPath: '/**/*.jade'
        }
    };

//---End VARS

//For Future
//----
//can use in gulp v4.0 {since: gulp.lastRun('js')}
//gulp.src('temp/folder/css/*.css',{since: gulp.lastRun('name_task')})
//---


//---DEL build directory
gulp.task('del', function(){
    return del([devDest + pathProject.del]).then(function(paths){
            console.log('Deleted:\n',paths.join('\n'));})
});
//---Copy JS
gulp.task('js', function () {
    return gulp.src(devSrc + pathProject.js.input)
        .pipe(newer(devDest + pathProject.js.input))
        .pipe(gulp.dest(devDest + pathProject.js.output))
        .pipe(reload({stream:true}));
});
//---Copy CSS
gulp.task('css', function () {
    return gulp.src(devSrc + pathProject.css.input)
        .pipe(newer(devDest + pathProject.css.input))
        .pipe(gulp.dest(devDest + pathProject.css.output))
        .pipe(reload({stream:true}));
});
//---Copy IMG
gulp.task('img', function () {
    return gulp.src(devSrc + pathProject.img.input)
        .pipe(newer(devDest + pathProject.img.output))
        //todo insert imagemin here code
        .pipe(gulp.dest(devDest + pathProject.img.output))
        .pipe(reload({stream:true}));
});
//---Copy FONTS
gulp.task('fonts', function () {
    return gulp.src(devSrc + pathProject.fonts.input)
        .pipe(newer(devDest + pathProject.fonts.output))
        .pipe(gulp.dest(devDest + pathProject.fonts.output))
        .pipe(reload({stream:true}));
});
//---Copy ASSETS
gulp.task('assets', function () {
    return gulp.src(devSrc + pathProject.assets.input)
        .pipe(newer(devDest + pathProject.assets.output))
        //todo insert fontsmin here code
        .pipe(gulp.dest(devDest + pathProject.assets.output))
        .pipe(reload({stream:true}));
});
//---VENDORS
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
//---JADE
gulp.task('jade', function() {
    gulp.src([devSrc + pathProject.jade.input1,'!src/jade/_*'])
        .pipe(jadeInheritance({ basedir: devSrc + pathProject.jade.input2}))
        .pipe(jade({
            pretty: '\t',
            basedir: devSrc + pathProject.jade.input1
        }))
        //.on('error', handleError)
        .pipe(gulp.dest(devDest + '/'))
        .pipe(reload({stream:true}));
});


//---WATCH
gulp.task('watch', function () {
    //js
    gulp.watch(devSrc + pathProject.js.input, ['js']);
    //css
    gulp.watch(devSrc + pathProject.css.input, ['css']);
    //img
    gulp.watch(devSrc + pathProject.img.input, ['img']);
    //fonts
    gulp.watch(devSrc + pathProject.fonts.input, ['fonts']);
    //public
    gulp.watch(devSrc + pathProject.assets.input, ['assets']);
    //sass
    gulp.watch(devSrc +'/**/*.sass', ['sass']);
    //jade
    gulp.watch(devSrc + pathProject.jade.watchPath, ['jade']);
});

//---Serve
gulp.task('serve', function(callback){
    browsersync.init({
        server: 'temp/f2',
        port: webServerPort,
        ui: {
            port: apiServerPort
        },
        open: autoOpenBrowser
    });

    //watch all for files in dest folder
    //browsersync.watch('temp/folder/**/*.*').on('change',reload);
});

//---BUILD
gulp.task('build',['js','css','img','fonts','assets','sass','jade'], function(callback){
    callback(console.log('--- Build DONE ---'));
});

gulp.task('default',['build','serve','watch'], function(callback){
    console.log('+++');
    callback();
});


//===================================================
//// Инициализируем плагины
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
