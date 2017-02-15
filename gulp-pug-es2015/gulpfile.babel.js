'use strict';

import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import babel from 'gulp-babel';
import imagemin from 'gulp-imagemin';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemap from 'gulp-sourcemaps';
import size from 'gulp-size';
import frontnote from 'gulp-frontnote';
import spritesmith from 'gulp.spritesmith';
import iconfont from 'gulp-iconfont';
import rename from 'gulp-rename';
import consolidate from 'gulp-consolidate';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
const browsersync = require('browser-sync').create();

const srcDir = 'src';
const destDir = 'dist';

var getFolders = function(dir_path) {
  return fs.readdirSync(dir_path).filter(function(file) {
    return fs.statSync(path.join(dir_path, file)).isDirectory();
  });
};

//server
gulp.task('server', ['default'], () => {
    let myfonts = getFolders(srcDir + '/fonts/myfonts/');
    let sprites = getFolders(srcDir + '/sprites' );
    browsersync.init({
        server: {
          baseDir: destDir,
          index: "index.html"
        }
    });

    gulp.watch(srcDir + '/**/*.pug', ['pug']);
    gulp.watch(srcDir + '/images/**/*', ['imgMin']);
    gulp.watch([srcDir + '/**/*.scss', '!' + srcDir + '/template/**/*.scss'], ['sass']);
    gulp.watch([srcDir + '/fonts/**/*.{eot,otf,ttf,woff.woff2}', '!' + srcDir + '/fonts/myfonts/**/*'], ['copy']);
    gulp.watch(srcDir + '/**/*.js', ['babel']);
    gulp.watch(srcDir + '/fonts/myfonts/' + myfonts + '/*.svg', ['iconfont']);
    gulp.watch(srcDir + '/sprites/' + sprites + '/*.png', ['sprite']);
});

// pug
gulp.task('pug', () => {
    let option = {
        pretty: true
    };
    gulp.src([srcDir + '/**/*.pug', '!' + srcDir + '/**/_*.pug'])
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(pug(option))
        .pipe(gulp.dest(destDir))
        .pipe(browsersync.stream());
});

// Optimize images
gulp.task('imgMin', () =>
    gulp.src(srcDir + '/images/**/*')
      .pipe(imagemin({
          progressive: true,
          interlaced: true
      }))
      .pipe(gulp.dest(destDir + '/images'))
      .pipe(size({title: 'images'}))
      .pipe(browsersync.stream())
);

// Change from sass to css
gulp.task('sass', () => {
    const sassOptions = {
        indentType: 'space',
        indentWidth: 2,
        outputStyle: 'expanded',
        precision: 10
    };
    const autoprefixerOptions = {
        browsers: ['last 2 version', 'IE >= 9'],
        cascade: false
    };
    gulp.src([srcDir + '/**/*.scss', '!' + srcDir + '/template/**/*.scss'])
        .pipe(frontnote({
            out: destDir + '/styleguide',
            css: '../main.css',
            script: '../js/app.js'
        }))
        .pipe(sourcemap.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemap.write('./'))
        .pipe(rename(function (path) {
            if(path.dirname === 'sass') {
              path.dirname = 'css';
            }
        }))
        .pipe(gulp.dest(destDir))
        .pipe(size({title: 'css'}))
        .pipe(browsersync.stream());
});

// copy
gulp.task('copy', () => {
    gulp.src([srcDir + '/fonts/**/*.{eot,otf,ttf,woff.woff2}', '!' + srcDir + '/fonts/myfonts/**/*'])
        .pipe(gulp.dest(destDir + '/fonts/'));
    gulp.src(srcDir + '/js/materialize.min.js')
        .pipe(gulp.dest(destDir + '/js/'))
        .pipe(browsersync.stream());
});


// ES2015 to ES5
gulp.task('babel', () => {
    gulp.src([srcDir + '/**/*.js', '!' + srcDir + '/js/materialize.min.js'])
        .pipe(babel({
            presets: ['es2015'],
            compact: false
        }))
        .pipe(gulp.dest(destDir))
        .pipe(size({title: 'js'}))
        .pipe(browsersync.stream());
});

// Web Font Icon Create
gulp.task('iconfont', function() {
  var folders = getFolders(srcDir + '/fonts/myfonts/');
  folders.forEach(function(folder){
    gulp.src(srcDir + '/fonts/myfonts/' + folder + '/*.svg')
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
          fontPath: '../fonts/',
          className: 'icon'
        };
        // sassファイル出力
        gulp.src(srcDir + '/template/iconfont-sample.scss') // テンプレートファイル呼び出し
          .pipe(consolidate('lodash', opt))
          .pipe(rename({
            basename: '_' + folder
          }))
          .pipe(gulp.dest(srcDir + '/sass/components'));
      })
      .pipe(gulp.dest(destDir + '/fonts'))
      .pipe(browsersync.stream());
  });
});

// CSS Sprite Create
gulp.task('sprite', function() {
  var folders = getFolders(srcDir + '/sprites');
  folders.forEach(function(folder){
    var spriteData = gulp.src(srcDir + '/sprites/' + folder + '/*.png')
      .pipe(spritesmith({
        imgName: 'sprites_' + folder + '.png',
        imgPath: '../images/sprites_' + folder + '.png',
        cssName: '_sprites-' + folder + '.scss',
        cssVarMap: (sprite) => {
            sprite.name = 'sprites-' + folder + '-' + sprite.name;
        },
        retinaSrcFilter: srcDir + '/sprites/' + folder + '/*@2x.png',
        retinaImgName: 'sprites_' + folder + '@2x.png',
        retinaImgPath: '../images/sprites_' + folder + '@2x.png',
        padding: 4
      }));
    spriteData.img.pipe(gulp.dest(srcDir + '/images'));
    return spriteData.css.pipe(gulp.dest(srcDir + '/sass/components'));
  })
});

gulp.task('default', ['copy', 'sprite', 'iconfont', 'imgMin', 'pug', 'sass', 'babel']);
