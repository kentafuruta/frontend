'use strict';

var autoprefixer = require('autoprefixer'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    ejs = require('gulp-ejs'),
    fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    imageMin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    iconfont    = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename');

// Functions
var getFolders = function(dir_path) {
  return fs.readdirSync(dir_path).filter(function(file) {
    return fs.statSync(path.join(dir_path, file)).isDirectory();
  });
};
var browsers = ['> 5%', 'ie 8'];

/********************************************
 * htmlタスク
 *********************************************/
/* 開発用 */
gulp.task('html', function() {
  return gulp.src('./src/**/ejs/!(_)*.ejs', {base: 'src'})
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(ejs('', {'ext': '.html'}))
    .pipe(rename(function (path) {
      path.dirname = path.dirname.replace(/ejs/g, '')
    }))
    .pipe(gulp.dest('public'));
});


/********************************************
 * jsタスク
 *********************************************/
/* 開発用 */
gulp.task('js', function() {
  return gulp.src(['./src/**/*.js', '!./src/assets/js/vendor/*'], {base: 'src'})
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['latest']
    }))
    //.pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public'));
});
/* リリース用 */
gulp.task('js:release', function() {
  return gulp.src(['./src/**/*.js', '!./src/assets/js/vendor/*'], {base: 'src'})
    .pipe(babel({
        presets: ['latest']
    }))
    //.pipe(concat('all.js'))
    .pipe(gulp.dest('public'));
});

/********************************************
 * cssタスク
 *********************************************/

/* 開発用 */
gulp.task('css', function() {
  var sassOptions ={
    indentType: 'space',
    indentWidth: 2,
    outputStyle: 'expanded'
  }
  gulp.src('./src/**/*.scss', {base: 'src'})
    .pipe(sourcemaps.init())
    .pipe(sass.sync(sassOptions).on('error', sass.logError))
    .pipe(postcss([
      require('autoprefixer')({browsers: browsers})
    ]))
    .pipe(sourcemaps.write('./')) // cssと同じ階層に出力する。
    .pipe(gulp.dest('public'));
});
/* リリース用 */
gulp.task('css:release', function() {
  var sassOptions ={
    indentType: 'space',
    indentWidth: 2,
    outputStyle: 'compressed'
  }
  return gulp.src('./src/**/*.scss', {base: 'src'})
    .pipe(sass.sync(sassOptions).on('error', sass.logError))
    .pipe(postcss([
      require('autoprefixer')({browsers: browsers})
    ]))
    .pipe(gulp.dest('public'));
});

/********************************************
 * imageタスク
 *********************************************/
gulp.task('image:release', function() {
  return gulp.src(['./src/**/*.{jpg,png,svg,gif}', '!./src/assets/sprite/**/*', '!./src/assets/font/**/*'], {base: 'src'})
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
    .pipe(gulp.dest('public'));
});

/********************************************
 * spriteタスク
 *********************************************/
gulp.task('sprite', function () {
  var folders = getFolders('./src/assets/sprites/');
  folders.forEach(function(folder){
    var spriteData = gulp.src('./src/assets/sprites/' + folder + '/*.png')
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(spritesmith({
        imgName: 'sprite_' + folder + '.png',
        imgPath: '../img/sprite_' + folder + '.png',
        cssName: folder + '.scss',
        retinaSrcFilter: './src/assets/sprites/' + folder + '/*@2x.png',
        retinaImgName: 'sprite_' + folder + '@2x.png',
        retinaImgPath: '../img/sprite_' + folder + '@2x.png',
        padding: 4,
        cssTemplate: function(data) {
          var opt = {
            spriteName: folder,
            className: 'ico',
            data: data
          };
          // Sprite HTML Sample Create
          gulp.src('./src/assets/template/sprite-sample.html')
            .pipe(consolidate('lodash', opt))
            .pipe(rename({
              basename: 'index'
            }))
            .pipe(gulp.dest('./src/assets/sprite_' +folder));
          // Sprite CSS Sample Create
          gulp.src('./src/assets/template/sprite-sample.css')
            .pipe(consolidate('lodash', opt))
            .pipe(rename({
              basename: 'index'
            }))
            .pipe(gulp.dest('./src/assets/sprite_' + folder));
          return '';
        }
      }));
    spriteData.img
      .pipe(gulp.dest('./src/assets/img/'));
    return spriteData.css.pipe(gulp.dest('./src/assets/sass/'));
  })
});

/********************************************
 * Web Fontタスク
 *********************************************/
gulp.task('iconfont', function() {
  var folders = getFolders('./src/assets/font/');
  folders.forEach(function(folder){
    gulp.src('./src/assets/font/' + folder + '/*.svg')
      .pipe(iconfont({
        fontName: folder,
        prependUnicode: true,
        startUnicode: 0xF001,
        formats: ['ttf', 'eot', 'woff', 'svg'],
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
          fontPath: '../font/',
          className: 'icon'
        };
        // Web Font CSS Sample Create
        gulp.src('./fontawesome/iconfont-sample.css')
          .pipe(consolidate('lodash', opt))
          .pipe(rename({
            basename: folder
          }))
          .pipe(gulp.dest('assets/font'));
        // Web Font HTML Sample Create
        gulp.src('./fontawesome/iconfont-sample.html')
          .pipe(consolidate('lodash', opt))
          .pipe(rename({
            basename: folder
          }))
          .pipe(gulp.dest('assets/'));
      })
      .pipe(gulp.dest('./public/font'));
  });
});

/********************************************
 * watchタスク
 *********************************************/
gulp.task('watch', function () {
  gulp.watch('./src/**/*.ejs', ['html']);
  gulp.watch('./src/**/*.js', ['js']);
  gulp.watch('./src/**/*.scss', ['css']);
  gulp.watch('src/sprite/*', ['sprite']);
  gulp.watch('src/font/**/*.svg', ['iconfont']);
});

/********************************************
 * gulp実行
 *********************************************/
gulp.task('default', ['watch']);

/********************************************
 * release タスク
 *********************************************/
gulp.task('release', ['html:release', 'js:release', 'css:release', 'image:release']);
