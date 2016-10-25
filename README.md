# frontend
フロントエンド開発環境  
node.js >= 4.4  
npm >= 3.8
## 目次
1. [ejs-sass-ts](#section01)
2. [pug-sass-ts](#section02)
3. [pug-sass-babel](#section03)

<a id="section01"></a>
## <a href="#section01">1. ejs-sass-ts</a>
### 使い方
1. `cd ejs-sass-ts`
2. `npm install`
3. `npm start` ローカルサーバー立ち上がり、ファイル変更検知。  
srcディレクトリで作業する。distが生成されたファイル群

### 機能
|    機能     |   パッケージ   |     備考     |
|:-----------|:-------------|:------------|
| HTML       | ejs          |              |
| CSS        | sass         |              |
| JavaScript | typescript   | distのjsディレクトリに直接jsを作成しても良い |
| image      | imagemin     | gulpタスク         |
| sprite     | spritesmith  | gulpタスク             |
| server     | browser-sync |              |

<a id="section02"></a>
## <a href="#section02">2. pug-sass-ts</a>
### 使い方
1. `cd pug-sass-ts`
2. `npm install`
3. `npm start` ローカルサーバー立ち上がり、ファイル変更検知。  
srcディレクトリで作業する。distが生成されたファイル群

### 機能
|    機能     |   パッケージ   |     備考     |
|:-----------|:-------------|:------------|
| HTML       | pug          |              |
| CSS        | sass         |              |
| JavaScript | typescript   | distのjsディレクトリに直接jsを作成しても良い |
| image      | imagemin     | gulpタスク         |
| sprite     | spritesmith  | gulpタスク             |
| server     | browser-sync |              |

<a id="section03"></a>
## <a href="#section03">3. pug-sass-babel</a>
### 使い方
1. `cd pug-sass-babel`
2. `npm install`
3. `npm start` ローカルサーバー立ち上がり、ファイル変更検知。  
srcディレクトリで作業する。distが生成されたファイル群

### 機能
|    機能     |   パッケージ   |     備考     |
|:-----------|:-------------|:------------|
| HTML       | pug          |              |
| CSS        | sass         |              |
| JavaScript | babel   | ES2015 |
| image      | imagemin     | gulpタスク         |
| sprite     | spritesmith  | gulpタスク             |
| server     | browser-sync |              |