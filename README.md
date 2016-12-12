# frontend
フロントエンド開発環境  
node.js >= 4.4  
npm >= 3.8  
(yarn >= 0.16.1)
## 目次
1. [使い方](#section01)

<a id="section01"></a>
## <a href="#section01">1. 使い方</a>
1. `cd プロジェクトファイル`
2. `npm install` or `yarn install`
3. `npm start` or `yarn start`
4. 納品ファイル作成  
   `npm run release` or `yarn run release`


### 機能
|    機能     |   パッケージ   |     備考     |
|:-----------|:-------------|:------------|
| HTML       | pug          | -            |
| CSS        | sass         | gulpタスク   |
| JavaScript | es2015       | gulpタスク moduleディレクトリ内で作業する。   |
| image      | imagemin     | gulpタスク   |
| sprite     | spritesmith  | gulpタスク spriteディレクトリに任意のフォルダを作って画像を入れる   |
| server     | browser-sync |-          |
