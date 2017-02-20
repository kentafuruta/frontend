# html-template
html5テンプレート。gulp(ejs, sass, server, imagemin, sprite)

## 使用方法
node.jsはインストール済みとする  
1. `npm install -g gulp-cli`
2. `cd プロジェクトフォルダ`
3. `npm install`

### 構造
```
dev
├── assets/
│    ├── css/
│    ├── js/
│    ├── img/
│    ├── font/
│    ├── sprite/
│          ├── hoge/　#ディレクトリがファイル名となる hoge.png
│          ├── fuga/
│          │
│          ・
│          ・
│          ・
│    └── iconfont/　#使用していない
│
├── _layout/　#使用していない。
├── _partials/　#ejsの共通部品 header footer 等
├── _sass/
├── style.scss　#サイトメインのstylesheet
└── setting.json　サイトタイトルやディスクリプション等の設定ファイル
```

## 使用例
初回`gulp`をコマンドして開発
ローカルサーバーが立ち上がる。  
ファイル監視するため、自動リロードされる。
`localhost:7000/`または`IP:7000`で確認
ページを開いたブラウザは同期される。

個別タスク実行も可能
### sassコンパイル
`gulp sass`

### image最適化
`gulp imagemin`

### ejsコンパイル
`gulp ejs`

### スプライト生成
`gulp sprite`

### リリースファイル削除
`gulp clean`



## サイト設定
```JSON
{
    "site": {
        "title"          : "サイト名",
        "description"    : "デスクリプション",
        "keywords"       : "キーワード",
        "author"         : "",
        "rootUrl"        : "http://example.com/",
        "ogpImage"       : "http://example.com/images/og-image.jpg",
        "facebookAdmins" : "",
        "facebookAppId"  : "",
        "twitterCard"    : "summary",
        "twitterSite"    : "@",
        "favicon"        : "",
        "appleIcon"      : "",
        "appTitle"       : "",
        "analyticsId"    : "UA-XXXXX-X",
        "develop"        : "dev/",  #開発フォルダ
        "release"        : "release/"  #リリースフォルダ
    }
}
```