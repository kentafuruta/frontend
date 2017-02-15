var gulp = require('gulp'),
    del = require('del'),
    fs = require('fs'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    ejs = require('gulp-ejs'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    cssnext = require('postcss-cssnext'),
    cssMqpacker = require('css-mqpacker'), // media queryをまとめる
    imageMin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    browserSync = require('browser-sync').create(),

/*
* 開発用のディレクトリのパス
*/
var devDir = 'dev';
var develop = {
  'root'     : devDir + '/',
  'css'      : devDir + '/assets/css/',
  'sass'     : [devDir + '/**/!(_)*.scss', '!' + devDir + '/assets/vendor/**/*.scss'],
  'js'       : [devDir + '/**/*.js', devDir + '/assets/js/bundle/**/*.js'],
  'vendor'   : devDir + '/assets/vendor/**/*.!(scss|js)',
  'image'    : [devDir + '/**/*.{png,jpg,gif,svg}', '!' + devDir + '/assets/icon/*.svg', '!' + devDir + '/assets/font/*.svg', '!' + devDir + '/assets/sprite/**/*.png'],
  'iconfont' : devDir + '/assets/icon/*.svg',
  'sprite'   : devDir + '/assets/sprite/**/*.png'
};

/*
* リリース用のディレクトリのパス
*/
var releaseDir = 'release';
var release = {
  'root'     : releaseDir + '/',
  'sprite'   : releaseDir + '/assets/sprite/',
  'bundleJs' : releaseDir + '/assets/js/bundle/',
};
/********************************************
 * ejsタスク
 *********************************************/
gulp.task('ejs', function() {
  var jsonFile = develop.root + 'setting.json',
      json = JSON.parse(fs.readFileSync(jsonFile, 'utf8')),
      site = json.site,
      pages = json.pages;

  for (var i = 0; i < pages.length; i++) {
    var page = pages[i];
    var destDir = release.root;
    if(page.path !== '') {
      destDir += page.path;
    }
    gulp.src(develop.root + 'layout/_' + page.layout + '.ejs')
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(ejs({
       site: site,
       page: page
      },
      {ext: '.html'}
      ))
      .pipe(rename(page.id + ".html"))
      .pipe(gulp.dest(destDir))
      .pipe(browserSync.reload({stream: true}));
  }
});

/********************************************
 * sassタスク
 *********************************************/
gulp.task('sass', ['sprite'], function() {
  var options = {
      outputStyle: 'expanded',
      precision: 10,
      sourceMap: true,
      sourceComments: false
  };
  var processors = [
    cssnext({
        browsers: [
          // @see https://github.com/ai/browserslist#browsers
          // Major Browsers（主要なブラウザの指定）
          'last 2 version', // （Major Browsersの）最新2バージョン
          // 'Chrome >= 34', // Google Chrome34以上
          // 'Firefox >= 30', // Firefox30以上
          'ie >= 9', // IE9以上
          // 'Edge >= 12', // Edge12以上
          'iOS >= 7', // iOS7以上
          // 'Opera >= 23', // Opera23以上
          // 'Safari >= 7', // Safari7以上

          // Other（Androidなどのマイナーなデバイスの指定）
          'Android >= 4.0' // Android4.0以上
        ],
    }),
    cssMqpacker
  ];
  return gulp.src(develop.sass, {base: develop.root})
        .pipe(sourcemaps.init())
        .pipe(sass(options).on('error', sass.logError))
        .on('error', function(err) {
            console.log(err.message);
        })
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(release.root))
        .pipe(browserSync.reload({stream: true}));
});

/********************************************
 * jsタスク
 *********************************************/
gulp.task('js', function() {
 return gulp.src(develop.js, {base: develop.root})
 .pipe(gulp.dest(release.root))
 .pipe(browserSync.reload({stream: true}));
});
 /********************************************
  * vendorタスク
  * プラグイン、ライブラリなどはここに入れる。
  *********************************************/
gulp.task('vendor', function() {
  return gulp.src(develop.vendor, {base: develop.root})
  .pipe(gulp.dest(release.root))
  .pipe(browserSync.reload({stream: true}));
});

/********************************************
 * 画像圧縮タスク
 *********************************************/
gulp.task('imagemin', function() {
  return gulp.src(develop.image, {base: develop.root})
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(imageMin({
          optimizationLevel: 7, // PNGファイルの圧縮率（7が最高）を指定します
          interlaced: true, // gifをインターレースgifにします
          progressive: true, // jpgをロスレス圧縮（画質を落とさず、メタデータを削除）
          use: [pngquant({
            quality: '65-80',
            speed: 1
          })]
        }))
        .pipe(gulp.dest(release.root))
        .pipe(size({title: 'images'}))
        .pipe(browserSync.reload({stream: true}));
});

/********************************************
 * spriteタスク
 * assets/sprite/にpngファイルを入れる。
 *********************************************/
gulp.task('sprite', function () {
  var spriteData = gulp.src(develop.sprite)
      .pipe(spritesmith({
        //retinaSrcFilter: ['./src/sprite/*@2x.png'],
        imgName: 'sprite.png',
        //retinaImgName: 'sprite@2x.png',
        cssName: '_sprite.scss',
        imgPath: 'sprite/sprite.png',
        //cssFormat: 'scss',
        padding: 10,
        cssVarMap: function (sprite) {
            sprite.name = 'sprite-' + sprite.name;
        },
      }));
  spriteData.img.pipe(gulp.dest(release.sprite));
  spriteData.css.pipe(gulp.dest(develop.css));
});

/********************************************
 * fontタスク
 *********************************************/
gulp.task('font', function() {
  return gulp.src('src/font/*')
  .pipe(gulp.dest('dist/font/'));
});

/********************************************
 * copyタスク
 *********************************************/
gulp.task('copy', function() {
  return gulp.src([
    'src/js/*',
    'src/font/*',
  ],{ base: 'src' })
  .pipe(gulp.dest('dist/'));
});

/********************************************
 * cleanタスク
 *********************************************/
gulp.task('clean', function(cb) {
  var dir = [
    './**/.DS_Store',
  ];
  return del(dir, cb);
});

/********************************************
 * serverタスク
 *********************************************/
gulp.task('server', ['copy', 'sass', 'image', 'ejs'], function () {
  browserSync.init({
    server: release.root,
    port: 7000
  });

  gulp.watch('src/sass/**/*', ['sass']);
  gulp.watch('src/img/*', ['image']);
  gulp.watch('src/sprite/*.png', ['sass']);
  gulp.watch('src/js/*', ['js']);
  gulp.watch('src/font/*', ['font']);
  gulp.watch('src/ejs/**/*.+(ejs|json)', ['ejs']);
  gulp.watch('./dist/**/*').on('change', browserSync.reload);
});

/********************************************
 * gulp実行
 *********************************************/
gulp.task('default', ['server']);
