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
    lodash      = require('lodash'),
    browserSync = require('browser-sync').create();

var getFolders = function(dir_path) {
  return fs.readdirSync(dir_path).filter(function(file) {
    return fs.statSync(path.join(dir_path, file)).isDirectory();
  });
};

/*
* 開発用のディレクトリのパス
*/
var devDir = 'dev';
var develop = {
  'root'     : devDir + '/',
  'css'      : devDir + '/assets/css/',
  'sass'     : [devDir + '/**/!(_)*.scss', '!' + devDir + '/vendor/**/*.scss'],
  'js'       : [devDir + '/**/*.js', devDir + '/assets/js/bundle/**/*.js'],
  'vendor'   : devDir + '/vendor/**/*.!(scss|js)',
  'image'    : [devDir + '/**/*.{png,jpg,gif,svg}', '!' + devDir + '/assets/iconfont/*.svg', '!' + devDir + '/assets/font/*.svg', '!' + devDir + '/assets/sprite/**/*.png'],
  'iconfont' : devDir + '/assets/iconfont/*.svg',
  'sprite'   : devDir + '/assets/sprite/'
};

/*
* リリース用のディレクトリのパス
*/
var releaseDir = 'release';
var release = {
  'root'     : releaseDir + '/',
  'sprite'   : releaseDir + '/assets/sprite/',
  'iconfont' : releaseDir + '/assets/iconfont/',
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
gulp.task('sprite', function() {
  var folders = getFolders(develop.sprite);
  folders.forEach(function(folder){
    var spriteName = folder;
    var spriteData = gulp.src(develop.sprite + folder + '/*.png')
                       .pipe(spritesmith({
                         imgName   : spriteName + '.png',
                         imgPath   : 'assets/img/' + spriteName + '.png',
                         cssName   : '_' + spriteName + '.scss',
                         cssVarMap : function (sprite) {
                             sprite.name = spriteName + '_' + sprite.name; // sprite-(個別パーツ名)で変数を使うための設定
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
      spriteData.img.pipe(gulp.dest(develop.root + 'assets/img/')),
      spriteData.css.pipe(gulp.dest(develop.root + 'sass/sprite/'))
    );
  })
});

/********************************************
 * fontタスク
 *********************************************/
gulp.task('iconfont', function() {
    var fontName = 'icon';

    return gulp.src(develop.iconfont, {base: develop.root})
        .pipe(iconfont({fontName: fontName}))
            .on('codepoints', function(codepoints) {
                var options = {
                    className : fontName,
                    fontName  : fontName,
                    fontPath  : './assets/iconfont/',
                    glyphs    : codepoints
                };

                // CSS
                gulp.src(develop.root + 'assets/iconfont/template.css')
                    .pipe(consolidate('lodash', options))
                    .pipe(rename({basename: fontName}))
                    .pipe(gulp.dest('documents/iconfont/'));

                // フォント一覧 HTML
                gulp.src(develop.root + 'assets/iconfont/template.html')
                    .pipe(consolidate('lodash', options))
                    .pipe(rename({basename: 'icon-sample'}))
                    .pipe(gulp.dest('documents/iconfont/'));
            })
        .pipe(gulp.dest(release.root));
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
