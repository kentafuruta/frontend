# frontend
フロントエンド開発環境  
node.js >= 4.4  
npm >= 3.8
## 目次
1. [frontend-ejs](#section01)
2. [frontend-pug](#section02)

<a id="section01"></a>
## <a href="#section01">1. frontend-ejs</a>
### 使い方
1. `cd frontend-ejs`
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
## <a href="#section02">2. frontend-pug</a>
### 使い方
1. `cd frontend-pug`
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
