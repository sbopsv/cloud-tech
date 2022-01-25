---
title: "DataV のデータ権限制御"
metaTitle: "同じ Alibab Cloud DataV Dashboard に対して違うユーザは違うデータを見えるする方法"
metaDescription: "同じ Alibab Cloud DataV Dashboard に対して違うユーザは違うデータを見えるする方法を紹介します。"
date: "2021-06-01"
author: "Hironobu Ohara"
thumbnail: "https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/system-image.jpg"
---

## Alibab CloudによるDataV活用パターン 01


# 目的
  普段の業務上では一つ Dashboard に対してユーザの権限によって表示されたデータが異なるという要望がよくあります。例えば会社の中で部長が見える社員の勤怠データ範囲は課長より広いはず。逆に課長は自分の部下以外の人の情報を見てはいけません。

  ![権限イメージ図](https://ip4pi.files.wordpress.com/2018/07/denied-1936877_1280.png?w=1000&h=288&crop=1)

  BIツールの場合はDashboard機能以外はユーザ権限管理機能もあるため、上記要件を実現しやすいですが、DataVはただの Dashboard ツールだけなので、ユーザ管理機能がふくまれていません。こんな場合はどうのようにこの要望を実現できるでしょうか？

  > 実現案のキーワードは、DataV Dashboard をユーザ既存システムに埋め込んで、DataVのAPIデータソースの中でユーザ既存システムの`Cookie`認証情報を利用すること。

   ![実現イメージ図](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/system-image.jpg)

  本ガイドでは、一つ簡単なサンプルを通じてDataVの実現方法を紹介させていただきます。

  本ガイドの全体的な流れは下記の通りです。

| セクション     |                  Topic                  |    説明    |
| -------------- |:---------------------------------------|:----------|
| 前提知識       |        DataV のAPIデータソース利用    |  DataV のAPIデータソースの紹介   |
| -              |      CookieとCORS の基本知識    | Cookieの紹介CORS制限の説明   |
| -              |        NodejsとExpressの基本知識          | Expressを使ってAPIサーバ構築の方法を紹介    |
| 準備作業       |         APIサーバの構築    |  簡単な手順を紹介、細かいところを省略 |
| -              |       DataVの設定             | DataV設定方法の紹介 |
| 実際の効果     |         効果を検証           | 実現したサンプルの効果を検証 |
| ソースコードの説明 |    APIソースコードの説明   |  APIサーバ構築中の注意ポイントを説明|


# 前提知識
本ガイドを理解するために、下記の前提知識が必要になります。

## 1.DataVの基本利用

DataV のデータ権限制御の話になる為、DavaVの基本利用を知っている前提となります。具体的には、データソース設定で「API」を選択した時の利用法となります。

 ![APIイメージ図](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/datav-api.jpg)

 データソースタイプでAPIを選択した場合は、上記のように２つ選択肢チェックボックスが出てきます。それぞれの違いは以下の通り：

 * サーバーからのリクエストを開始する (HTTPプロキシ)

 ![option1](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/image1.jpg)

 * Cookieが必要です (プロキシが選択されず、Cookieが必要な場合に使用する)

 ![option2](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/image2.jpg)

今回の実現案は`オプション２`を使います。

## 2.CookieとCORS の基本知識

> Cookie（クッキー）とは

Cookie（クッキー）とは、ホームページを訪問したユーザーの情報を一時的の保存する仕組み、またはそのデータです。ID、パスワード、メールアドレス、訪問回数などがユーザー情報として保存されます。これによって再訪問したときにユーザーを特定し、情報を入力する手間が省けます。ショッピングサイトに訪問したとき、すでにログイン状態になっている、以前カートに入れた商品がそのまま残っているのは、Cookie機能がはたらいているからです。

参考ページ：https://ferret-plus.com/6692

> CORS（Cross-Origin Resource Sharing）とは

オリジン間リソース共有Cross-Origin Resource Sharing (CORS) は、追加の HTTP ヘッダーを使用して、あるオリジン (ドメイン) で動作しているウェブアプリケーションに、異なるオリジンのサーバーにある選択されたリソースへのアクセスを許可することができる仕組みです。ウェブアプリケーションは、自分のオリジンとは異なるオリジン (ドメイン、プロトコル、ポート番号) からリソースをリクエストするとき、オリジン間 HTTP リクエストを実行します。

参考ページ：https://developer.mozilla.org/ja/docs/Web/HTTP/CORS

 ![option2](https://mdn.mozillademos.org/files/14295/CORS_principle.png)

今回はDataVはCookieを使ってユーザデータを取る場合は、Dashboardの閲覧者のブラウザから直接APIをコールするため、必ずCORS問題をクリアしないといけないです。

CORS設定しない場合は、下記のようにDataV側はエラーが出ます。

![cors error](
https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/cors-error.jpg)

## 3.NodejsとExpressの基本知識

今回のサンプルをNodeJSのExpressフレームワークを使ってAPIサーバを構築するので、環境構築方法と使い方について簡単に紹介します。

APIサーバを実現したい要件は：

* HTTPSサーバ作成
* Cookieを使ってログインする
* Cookie読んでユーザデータを返す
* CORS設定し、DataVからもコールできるようにする
* Iframe使ってDataVをログイン後の画面に埋め込む、DataVはログインユーザの名前を表示する

NodejsのExpressを使う場合は、複雑なサーバ設定なしで簡単ににAPIサーバを立ち上げすることが可能です。

 ![express](https://smarttechies.files.wordpress.com/2015/10/node-express.png?w=605)

 もちろん、PHPもJavaのSpringBootも簡単にAPIサーバを構築することが可能なので、実装方法はお好みで任せます。参考リンク：https://www.baeldung.com/spring-cors

 簡単な`Hello World`は下記チュートリアルにご参照ください。細かい説明はここで省略します。

 https://expressjs.com/ja/starter/hello-world.html

 ```javascript

 const express = require('express')
 const app = express()

 app.get('/', (req, res) => res.send('Hello World!'))

 app.listen(3000, () => console.log('Example app listening on port 3000!'))

 ```

# 準備作業

## 1.APIサーバの構築

今回はゼロからAPIを構築することではなく、ネット上簡単なサンプルを再利用し、必要な機能を追加することになります。

メインの参照ドキュメントは下記です。このサンプルはCookie使ってログインすることまで実現できます。

https://blog.csdn.net/foruok/article/details/47719063


今回は下記機能を追加しました。詳細の説明は本ガイドの最後で紹介させていただきます。ソースコードについてこちらから[ダウンロード](
https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/LoginDemo.zip)が可能です。

* HTTPSサーバ作成(http使う場合はDataV側はエラーになる可能性があります)
![error](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/http-error.jpg)
* Cookie読んでユーザデータを返す
* CORS設定し、DataVからもコールできるようにする
* Iframe使ってDataVをログイン後の画面に埋め込む、DataVはログインユーザの名前を表示する

ソースコードをダウンロードしてからサーバ立ち上げの手順をここで共有します（Centosを使う）。

> 要注意： サーバ立ち上げた後で必要なポートをOpenすることが忘れないでください。

```shell
# ログイン
ssh root@XXX.XXX.XXX.XXX

# 新バージョンのNodejsをインストール
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo yum -y install nodejs

# ソースコードをダウンロード
wget https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/LoginDemo.zip
unzip LoginDemo.zip

# 必要なパッケージをインストール
cd LoginDemo
npm install

# APIサーバ立ち上げ
npm start

> node ./bin/www

HTTP Server is running on: http://localhost:1080
HTTPS Server is running on: https://localhost:10443

```

ブラウザから https://XXX.XXX.XXX.XXX/login　をアクセスしてみて、ログイン画面が見えたらサーバ立ち上げが成功。

今回は２つユーザデータをソースコードの中に固定しました。
* admin / 123456
* datav / 888888

> 今回のHTTPSサーバ使ってるSSL証明書はopenssl使って作ったものので、ブラウザから警告が出すことがあります。

SSL証明書の作成方法は下記に参考（opensslインストールしたことを前提）。今回はこちら作成した証明書を使えるので、このステップをSKIPしても構いません。

```shell
＃key作成

openssl genrsa 1024 > ./private.pem

＃CSRの作成

openssl req -new -key ./private.pem -out csr.pem

＃証明書作成

openssl x509 -req -days 365 -in csr.pem -signkey ./private.pem -out ./file.crt
```
## 2.DataVの設定

APIサーバの立ち上げは成功したら、後のDataV設定はとても簡単です。今回は https://XXX.XXX.XXX.XXX/data というAPIを用意しました。

もしユーザログインの場合は、このAPIはCokkieを読んでユーザ名前を抽出し、クライアント側へ返します。もしユーザログインしない場合は、「no data」というJsonデータを返します。

![setting](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/datav-cookie-image.jpg)

# 実際の効果

上記準備を終わりましたら、ログイン画面を通じてログインして見てください。最終効果は下記の通り。
* adminでログイン
![eff1](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/effect1.png)
![eff2](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/effect2.png)

* datavでログイン
![eff3](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/effect3.png)
![eff4](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/image/effect4.png)

実際の録画GIFは下記を参照：

![effect](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/cookie-sample/cookie-sampe.gif)

# ソースコードの説明

## /app.js 
APIの入り口、設定ファイル

```javascript

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');

var app = express();

// below is for https
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./private.pem', 'utf8');
var certificate = fs.readFileSync('./file.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = 1080;
var SSLPORT = 10443;

httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
// https設定
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

//CORS設定
var allowCrossDomain = function (req, res, next) {
 res.header('Access-Control-Allow-Origin', 'https://datav-ap-northeast-1.alibabacloud.com');
 res.header('Access-Control-Allow-Credentials', true);
 next();
};

app.use(allowCrossDomain); //imortant

//app.all('*', users.requireAuthentication);
app.use('/', users);

...

module.exports = app;
```

## /router/users.js 
APIの中身、ログイン機能などはここで実現

```javascript

var express = require('express');
var router = express.Router();
var crypto = require('crypto');

// just for tutorial, it's bad really
var userdb = [
    {
      userName: "admin",
      hash: hashPW("admin", "123456"),
      last: ""
    },
    {
      userName: "datav",
      hash: hashPW("datav", "888888"),
      last: ""
    }
  ];

...

// DataV使うAPI、Cookieからユーザ名前を読んで返す
  router.get('/data', function(req, res, next){
     var nodata = [{
         "value":"no data",
         "url":""
     }];
    if(isLogined(req)){
      var response = [{
         "value":req.cookies["account"].account,
         "url":""
      }];
      res.end(JSON.stringify(response));
    }else{
      res.end(JSON.stringify(nodata));
    }

  });
```
## /views/profile.jade
[Jade](http://jade-lang.com/)というテンプレートエンジンの使って、DataVをIframesに埋め込み。

```html
doctype html
html
  head
    meta(charset='UTF-8')
    title= title
  body
    p #{msg}
    p #{lastTime}
    p <iframe width="700" height="350" src="https://datav-ap-northeast-1.alibabacloud.com/share/41682281fd8ed6bbef187763677c8cda"></iframe>
    p
      a(href='/logout') logout
```

以上です。

