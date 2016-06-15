###
Base imports and vars
###
glob = require 'glob'
gulp = require 'gulp'
util = require 'gulp-util'
consolidate = require "gulp-consolidate"
autoprefixer = require "gulp-autoprefixer"
sass = require "gulp-sass"
inlineCss = require "gulp-inline-css"
extReplace = require 'gulp-ext-replace'
prettify = require 'gulp-html-prettify'
minifyHTML = require 'gulp-minify-html'
compass = require 'gulp-compass'
del = require 'del'
server = require('tiny-lr')()
refresh = require 'gulp-livereload'

log = util.log
colors = util.colors
SERVER_PORT = 8000


log ''
log colors.green  "------------------------------------"
log colors.green  "----------Building project----------"
log colors.green  "------------------------------------"
log ''

#Live Reload Server for instant file change reload
gulp.task 'refresh', ->
  log ''
  log colors.gray "-----------------------------------"
  log "Build Status: " + colors.yellow("Starting Live Reload Server")
  log colors.gray "-----------------------------------"
  log ''

  refresh.listen 35729, (err)->
    start : true
    if (err)
      console.log(err)

gulp.task 'sass', ->
  gulp.src ['src/sass/*.sass', '!src/sass/_*']
  .pipe compass
    css        : 'build/css/'
    sass       : 'src/sass/'
    image      : 'src/img/'
    require    : ['bootstrap-sass', 'sass-globbing']
    comments   : false
    style      : 'expanded'
    bundle_exec: true
  .on 'error', util.log
  .pipe autoprefixer 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
  .pipe gulp.dest 'build/css'
  .pipe refresh(server)

gulp.task 'html', ->
  gulp.src 'src/jade/*.jade'
  .pipe consolidate 'jade'
  .pipe extReplace '.html'
  .pipe prettify
    indent_char: ' '
    indent_size: 2
  .pipe gulp.dest 'build'
  .pipe refresh()

# Cleanup build directory
gulp.task 'clean', (cb)->
  del ['build'], cb

#Copy js
gulp.task 'js', ->
  gulp.src 'src/js/**/*'
  .pipe gulp.dest 'build/js'

#Copy css
gulp.task 'css', ->
  gulp.src 'src/css/**/*'
  .pipe gulp.dest 'build/css'

#Copy img
gulp.task 'img', ->
  gulp.src 'src/img/**/*'
  .pipe gulp.dest 'build/img'

#Copy fonts
gulp.task 'fonts', ->
  gulp.src 'src/fonts/**/*'
  .pipe gulp.dest 'build/fonts'

#Copy public
gulp.task 'public', ->
  gulp.src 'src/public/**/*'
  .pipe gulp.dest 'build'

#Servers for web and api
gulp.task 'servers', (callback)->
  log = util.log
  colors = util.colors;
  log ''
  log colors.gray "-----------------------------------";
  log "Build Status: " + colors.yellow("Starting Servers")
  log colors.gray "-----------------------------------"

  apiServer = require './api-stub/routes.js'
  apiServer log, colors

  webServer = require './api-stub/server.js'
  webServer({
    port  : SERVER_PORT
    log   : log
    colors: colors
  })

#gulp watch
gulp.task 'watch', ->
  log ''
  log colors.gray "-----------------------------------"
  log "Build Status: " + colors.yellow("Watching for changes")
  log colors.gray "-----------------------------------"
  log ''

  gulp.watch 'src/sass/**/*.sass', ['sass']
  gulp.watch 'src/jade/**/*.jade', ['html']
  gulp.watch 'src/js/**/*.js', ['js']


## Build task
#gulp.task 'build', ['html', 'js', 'copy', 'sass'], ->
#  log ''
#  log colors.gray "-----------------------------------"
#  log "Build Status: " + colors.green("Compiling Build")
#  log colors.gray "-----------------------------------"
#  log ''


# The default task (called when you run `gulp`)
gulp.task 'default', ['html', 'sass', 'js', 'css', 'fonts', 'img','public','refresh','servers', 'watch',], ->
  log ''
  log colors.gray "-----------------------------------"
  log "Build Status: " + colors.green("Completed")
  log colors.gray "-----------------------------------"
  log ''


