'use strict';

var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    imageMin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    iconfont    = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate');
// Functions
var getFolders = function(dir_path) {
  return fs.readdirSync(dir_path).filter(function(file) {
    return fs.statSync(path.join(dir_path, file)).isDirectory();
  });
};

/********************************************
 * imageタスク
 *********************************************/
gulp.task('image', function() {
  return gulp.src('./src/img/*')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(imageMin({
          optimizationLevel: 7,
          interlaced: true,
          progressive: true,
          use: [pngquant({
            quality: '65-80',
            speed: 1
          })]
        }))
        .pipe(gulp.dest('./release/img'))
});

/********************************************
 * spriteタスク
 *********************************************/
gulp.task('sprite', function () {
  var folders = getFolders('./src/sprite/');
  folders.forEach(function(folder){
    var spriteData = gulp.src('./src/sprite/' + folder + '/*.png')
    .pipe(spritesmith({
      imgName: 'sprite_' + folder + '.png',
      imgPath: 'sprite/sprite_' + folder + '.png',
      cssName: '_sprite-' + folder + '.scss',
      // retinaSrcFilter: './src/sprite/' + folder + '/*@2x.png',
      // retinaImgName: 'sprite_'+ folder + '@2x.png',
      // retinaImgPath: 'sprite/sprite_' + folder + '@2x.png',
      padding: 4,
      cssOpts: {
          functions: false
      },
      cssVarMap: (sprite) => {
          sprite.name = "sprite-" + folder + '-' + sprite.name;
      },
      cssSpritesheetName: folder
    }));
    spriteData.img.pipe(gulp.dest('./src/img/'));
     return spriteData.css.pipe(gulp.dest('./src/sass/'));
  });
});

/********************************************
 * Web Fontタスク
 *********************************************/
gulp.task('iconfont', function() {
  var folders = getFolders('./src/font/');
  folders.forEach(function(folder){
    gulp.src('./src/font/' + folder + '/*.svg')
      .pipe(iconfont({
        fontName: folder,
        prependUnicode: true,
        startUnicode: 0xF001,
        formats: ['ttf', 'eot', 'woff'],
        normalize: true,
        fontHeight: 500
      }))
      .on('glyphs', function(glyphs, options) {
        var opt = {
          glyphs: glyphs.map(function(glyph) {
            return {
              name: glyph.name,
              codepoint: glyph.unicode[0].charCodeAt(0)
            };
          }),
          fontName: folder,
          fontPath: './font/',
          className: 'ico'
        };
        // Web Font CSS Sample Create
        gulp.src('./src/template/iconfont-sample.css')
          .pipe(consolidate('lodash', opt))
          .pipe(rename({
            basename: folder
          }))
          .pipe(gulp.dest('./src/font'));
        // Web Font HTML Sample Create
        gulp.src('./src/template/iconfont-sample.html')
          .pipe(consolidate('lodash', opt))
          .pipe(rename({
            basename: folder
          }))
          .pipe(gulp.dest('./src/font'));
      })
      .pipe(gulp.dest('./src/font'));
  });
});

/********************************************
 * serverタスク
 *********************************************/
gulp.task('watch', function () {
  gulp.watch('src/img/*', ['image']);
  gulp.watch('src/sprite/*', ['sprite']);
  gulp.watch('src/font/**/*.svg', ['iconfont']);
});

/********************************************
 * gulp実行
 *********************************************/
gulp.task('default', ['watch']);
