# frontend
フロントエンド開発環境  
node.js >= 4.4  
npm >= 3.8  
(yarn >= 0.16.1)
## プロジェクト
* [gulp-ejs](#section01)
* [gulp-pug-es2015](#section02)

<a id="section01"></a>
## <a href="#section01">gulp-ejs</a>
html5テンプレート。gulp(ejs, sass, imagemin, sprite, iconfont, server)

### 開発方法
node.jsはインストール済みとする
1. `npm install -g gulp-cli`
2. `cd プロジェクトフォルダ`
3. `npm install`

yarnをインストールしている場合は
1. `cd プロジェクトフォルダ`
1. `yarn install`

### 構造
```
dev
└── assets/
│    ├── css/
│    ├── common.scss
│    ├── foundation/
│    │   ├── base/
│    │   ├── function/
│    │   ├── mixin/
│    │   └── variable/
│    ├── layout/
│    └── object/
│          ├── component/
│          ├── project/
│          ├── scope/
│          └── utility/
├── _layout/
├── _partials/
├── _sass/
    
├── vendor
├── style.scss
└── setting.json　サイトタイトルや、ページタイトル、テンプレート等の設定ファイル
```

### 使用例
初回  
`gulp server`  
または  
`npm run server`  
または  
`yarn server`

ローカルサーバーが立ち上がる。  
ファイル監視するため、自動リロードが実行されるが、まだ不安定。   
その際は手動でブラウザをリロードさせる。

個別タスク実行も可能
#### ejsコンパイル
`gulp ejs`

#### sassコンパイル
`gulp sass`

#### 画像最適化
`gulp image`

#### スプライト画像作成
`gulp sprite`

### 納品ファイル等の削除
`gulp clean`

### ページの作り方

ejs/pageディレクトリにページファイルを作成する。  
ページを増やす場合は pages.jsonに追加

{  
　　"id": "ページid", (ファイル名となる)  
　　"title": "タイトル",  
　　"description": "ディスクリプション",  
　　"keywords": "キーワード",  
　　"page": "_page" (pageディレクトリに作ったファイル名を記述する。)  
}

<a id="section02"></a>
## <a href="#section02">gulp-pug-es2015</a>
### 開発方法
1. `cd プロジェクトファイル`
2. `npm install` or `yarn install`
3. `npm start` or `yarn start`
4. 納品ファイル作成  


### 機能
|    機能     |   パッケージ   |     備考     |
|:-----------|:-------------|:------------|
| HTML       | pug          | -            |
| CSS        | sass         | gulpタスク   |
| JavaScript | es2015       | gulpタスク moduleディレクトリ内で作業する。   |
| image      | imagemin     | gulpタスク   |
| sprite     | spritesmith  | gulpタスク spriteディレクトリに任意のフォルダを作って画像を入れる   |
| server     | browser-sync |-          |
