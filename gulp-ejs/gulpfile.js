var gulp        = require('gulp'),
    del         = require('del'),
    fs          = require('fs'),
    path        = require('path'),
    mergeStream = require('merge-stream');
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    rename      = require('gulp-rename'),
    ejs         = require('gulp-ejs'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    postcss     = require('gulp-postcss'),
    cssnext     = require('postcss-cssnext'),
    cssMqpacker = require('css-mqpacker'), // media queryをまとめる
    imageMin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    iconfont    = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    size        = require('gulp-size'),
    lodash      = require('lodash'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence');

// dir_path内のフォルダを取得
var getFolders = function(dir_path) {
  return fs.readdirSync(dir_path).filter(function(file) {
    return fs.statSync(path.join(dir_path, file)).isDirectory();
  });
};
// site設定JSON取得
var jsonData = JSON.parse(fs.readFileSync('setting.json', 'utf8')),
    site     = jsonData.site;

/********************************************
 * defaultタスク
 *********************************************/
gulp.task('default', ['server']);

/********************************************
 * buildタスク
 *********************************************/
gulp.task('build', function(callback) {
  runSequence('clean', 'sprite', ['ejs', 'sass', 'imagemin', 'copy'], callback);
});

/********************************************
 * serverタスク
 *********************************************/
gulp.task('server', ['build'], function () {
  browserSync.init({
    server: site.release,
    port: 7000
  });
  gulp.watch(site.develop + '**/*.ejs', ['ejs']);
  gulp.watch(site.develop + '/**/*.scss', ['sass']);
  gulp.watch([site.develop + '**/*.{png,jpg,gif,svg}', '!' + site.develop + 'assets/iconfont/*.svg', '!' + site.develop + 'assets/font/*.svg', '!' + site.develop + 'assets/sprite/**/*.png'], ['imagemin']);
  gulp.watch(site.develop + 'assets/sprite/**/*.png', ['sprite']);
  gulp.watch([site.develop + 'js/*', site.develop + 'font/*'], ['copy']);
});

/********************************************
 * ejsタスク
 *********************************************/
gulp.task('ejs', function() {
  // console.log(__dirname);
  return gulp.src(site.develop + '**/!(_)*.ejs', {base: site.develop})
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(ejs({site: site}, {'ext': '.html'}))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest(site.release))
    .pipe(browserSync.reload({stream: true}));
});

/********************************************
 * sassタスク
 *********************************************/
gulp.task('sass', function() {
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
        ]
    }),
    cssMqpacker
  ];
  return gulp.src(site.develop + '/**/!(_)*.scss', {base: site.develop})
    .pipe(sourcemaps.init())
    .pipe(sass(options).on('error', sass.logError))
    .on('error', function(err) {
        console.log(err.message);
    })
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(site.release))
    .pipe(browserSync.reload({stream: true}));
});

/********************************************
 * jsタスク
 *********************************************/
gulp.task('js', function() {
 return gulp.src(site.develop + '**/*.js', {base: site.develop})
 .pipe(gulp.dest(site.release))
 .pipe(browserSync.reload({stream: true}));
});

/********************************************
 * 画像圧縮タスク
 *********************************************/
gulp.task('imagemin', function() {
  return gulp.src([site.develop + '**/*.{png,jpg,gif,svg}', '!' + site.develop + 'assets/iconfont/*.svg', '!' + site.develop + 'assets/font/*.svg', '!' + site.develop + 'assets/sprite/**/*.png'], {base: site.develop})
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
    .pipe(gulp.dest(site.release))
    .pipe(size({title: 'images'}))
    .pipe(browserSync.reload({stream: true}));
});

/********************************************
 * spriteタスク
 * assets/sprite/にpngファイルを入れる。
 *********************************************/
gulp.task('sprite', function() {
  var spritsRoot = site.develop + 'assets/sprite/';
  var folders = getFolders(spritsRoot);
  folders.forEach(function(folder){
    var spriteName = folder;
    var spriteData = gulp.src(spritsRoot + folder + '/*.png')
      .pipe(spritesmith({
        imgName   : spriteName + '.png',
        imgPath   : 'assets/img/' + spriteName + '.png',
        cssName   : '_' + spriteName + '.scss',
        cssVarMap : function (sprite) {
            sprite.name = spriteName + '-' + sprite.name; // foldr-(個別パーツ名)で変数を使うための設定
        },
        cssSpritesheetName: spriteName,
        cssOpts: {
          functions: false
        },
        padding         : 4,
        // retinaディスプレイ対応の時はコメントアウト外して、 @2x.pngのファイル名の画像を作る。
        //  retinaSrcFilter : develop.sprite + folder +  '/*@2x.png',
        //  retinaImgName   : spriteName + '@2x.png',
        //  retinaImgPath   : '/assets/img/' + spriteName + '@2x.png',
    }));
    return mergeStream(
      spriteData.img.pipe(gulp.dest(site.develop + 'assets/img/')),
      spriteData.css.pipe(gulp.dest(site.develop + '_sass/sprite/'))
    );
  })
});

/********************************************
 * iconfontタスク
 　まだ使えない。
 *********************************************/
/*
gulp.task('iconfont', function() {
    var fontName = 'icon';

    return gulp.src(site.develop + 'assets/iconfont/*.svg', {base: site.develop})
        .pipe(iconfont({fontName: fontName}))
            .on('codepoints', function(codepoints) {
                var options = {
                    className : fontName,
                    fontName  : fontName,
                    fontPath  : 'assets/iconfont/',
                    glyphs    : codepoints
                };

                // CSS
                gulp.src(site.develop + 'assets/iconfont/template.css')
                    .pipe(consolidate('lodash', options))
                    .pipe(rename({basename: fontName}))
                    .pipe(gulp.dest('documents/iconfont/'));

                // フォント一覧 HTML
                gulp.src(site.develop + 'assets/iconfont/template.html')
                    .pipe(consolidate('lodash', options))
                    .pipe(rename({basename: 'icon-sample'}))
                    .pipe(gulp.dest('documents/iconfont/'));
            })
        .pipe(gulp.dest(site.release);
});
*/

/********************************************
 * copyタスク
 *********************************************/
gulp.task('copy', function() {
  return gulp.src([site.develop + '**/js/*', site.develop + '**/font/*'], { base: site.develop })
  .pipe(gulp.dest(site.release))
  .pipe(browserSync.reload({stream: true}));;
});

/********************************************
 * cleanタスク
 *********************************************/
gulp.task('clean', function(cb) {
  var dir = [
    './**/.DS_Store',
    site.release
  ];
  return del(dir, cb);
});
