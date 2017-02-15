# html-template
html5テンプレート。gulp(ejs, sass, server, imagemin)

## 使用方法
node.jsはインストール済みとする  
1. `npm install -g gulp-cli`
2. `cd プロジェクトフォルダ`
3. `npm install`

## 使用例
初回`gulp`をコマンドして開発  
ローカルサーバーが立ち上がる。  
ファイル監視するため、自動リロードが実行されるが、
まだ不安定。   
その際は手動でブラウザをリロードさせる。

個別タスク実行も可能
### sassコンパイル
`gulp sass`

### image最適化
`gulp image`

### ejsコンパイル
`gulp ejs`

### 画像最適化
`gulp image`

## distないのファイル削除
`gulp clean`


一応スプライト作成のタスクも作成しているが、  
動作するかは未確認。

#### html

ejs/pageディレクトリにページファイルを作成する。
ページを増やす場合は pages.jsonに追加  

{  
　　"id": "ページid", (ファイル名となる)  
　　"title": "タイトル",  
　　"description": "ディスクリプション",  
　　"keywords": "キーワード",  
　　"page": "_page" (pageディレクトリに作ったファイル名を記述する。)  
},
