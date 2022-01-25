---
title: "DataV Proxyについて"
metaTitle: "DataVユーザーの強い味方！DataV Proxyについて"
metaDescription: "DataVユーザーの強い味方！DataV Proxyについて"
date: "2020-02-05"
author: "SBC engineer blog"
thumbnail: "/DataV_images_26006613506519500/20200203161752.png"
---

## DataVユーザーの強い味方！DataV Proxyについて

本記事では、DataVでDataV Proxy設定方法をご紹介します。    
これはDataVにデータベース接続したウィジェットのコネクション数が原因で、データベースに負荷が掛かってしまう問題を解決するための手法です。    


## DataVウィジェットのコネクションの貼られ方
前提知識として、データベースと接続したDataVウィジェットがどのようにデータベースを見にいくのか、という点についてお話しします。     
DataVは、プロジェクト(DataV画面)にウィジェットを配置すると、一つのウィジェットに対して複数のコネクションを貼ってデータを     
取得しに行きます。
あくまで推測ですが、以下のような挙動のイメージです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203161752.png "img")

実際に、データベース接続した一つのウィジェットをDataV画面に配置して、     
データベースのコネクション数を確認したところ、なんと8つも確認できました。     
(自分が接続しているコネクションはカウントしていません)
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203164120.png "img")


一つのウィジェットだけでここまでコネクションが貼られるので、複数配置したらデータベースへの負荷が心配ですよね…     
そこで、DataV Proxyが登場します。     
DataV Proxyは、最大コネクションプール数とDBへのクエリタイムアウト時間(ms)をコントロールすることができます。     
データベースとDataVの間にDataV Proxyを設置することで、データベースへの負荷を軽減させることができます。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/111123.html

     

## DataV Proxyのデプロイ手順
流れとしては、以下の3ステップになります。

①DataV Proxyのインストールパッケージをサーバーにインストール     
②DataV ProxyにIDとパスワードを登録     
③DataVProxyにログインして、データベースを登録する     

それぞれのステップについて、以下に記載します。
     
     




### ①DataV Proxyのパッケージをインストール     
下記のドキュメントサイトの手順     
(https://www.alibabacloud.com/cloud-tech/doc-detail/111123.html)に沿って、     
インストールパッケージをサーバーにダウンロードし、Proxyサービスを有効化します。     WindowsとLinux/Mac OSの手順が記載されています。     
ちなみに、パッケージの中にはPDFのドキュメント(中国語)が同封されています。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/111123.html

### ②DataV ProxyにIDとパスワードを登録     
インストール後、ブラウザからProxyサービスにログインします。     
```http://domain name(ドメインがない場合はIPアドレス):ポート番号```     
でアクセスします。     ①の手順でポート番号を指定していない場合は、ポート番号はデフォルトで8001となります。
     
アクセス後、以下の画面にUsernameとPasswordを入力することで新規登録が完了となります。     
一度しか登録できないため、忘れないようにご注意ください。     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203163716.png "img")
     
### ③DataVProxyにログインして、データベースを登録する     
ログイン後は、以下のような画面が表示されてデータベースを登録・接続確認ができるようになります。     データベースはMySQL,MSSQL,Oracle,Postgresの4種類に対応しています。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203163859.png "img")
     
「add」ボタンをクリックすると、下記のようにDB情報の入力を求められるので、     
ご自身のDB情報を登録して「OK」をクリックしてください。      
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203163905.png "img")
     
下記のように登録できたら、①の「link」ボタンで接続確認できたり、②の「SQL」ボタンでクエリのテストが出来たりします。     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203163920.png "img")
     
SQLのクエリテストは、DataVと同じようにJson形式でデータの取得確認ができます。     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203163924.png "img")
     


また、「logs」というメニューをクリックすると、下記のようにログを確認することができます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203163945.png "img")     

ログの種類は、アクセスログ、SQLログ、システムログ、userログの4種類です。     
     
## DataV ProxyをDataVに接続する
では、実際にDataVProxyをDataVのデータソースに登録していきたいと思います。     
DataVのコンソール画面を開き、データソースの種類のプルダウンから、DataV Proxyを選択して、認証情報を入力してください。     
※DataV ProxyをインストールしたサーバーにSSL証明書がない場合は、DataVのページURLをHTTPに変更して本手順を実施してください。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203163949.png "img")

     

認証情報のうち、「key」「secret」とありますが、これらはDataVProxyで発行します。     
下記のように、「secret」メニューから、「create key/secret」をクリックすると発行されます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203163954.png "img")
     

DataVのデータソースにDataV Proxyが登録できたら、実際にウィジェットと接続をしてみましょう。     
以下のような形で、RDSなど、通常のデータベースを登録する時と同様に     
データソースタイプは「データベース」を選択し、登録したDataV Proxyを選択して、SQL文を入力します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203164001.png "img")

     
## DataV Proxyの効果を検証
データソースに登録したら、実際にDataV Proxyの効果を検証してみます。        
今回作成したDataVの画面は以下です。     
水色のカルーセルリストがRDSに直接接続したウィジェットを配置した画面(①)、     
ピンク色のカルーセルリストがDataV Proxyを介してRDSに接続したウィジェットを配置した画面(②)です。     
検証用のため、カルーセルリストはそれぞれ4つずつ配置しました。     
それぞれのウィジェットの自動更新リクエスト数は1秒に設定しています。     
①と、②のコネクション数を比較します。     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203164008.png "img")
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203164013.png "img")
     
結果は以下です！ちょっと頑張って手入力で10回のコネクション数をグラフにして見ました。     
DataVProxy経由であれば、一つしかコネクションが貼られないことが明らかかと思います。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203164023.png "img")     
     
     
     
## まとめ
以上、DataV Proxyの設定手順とその効果についてをご紹介しました。
DataVユーザーにとっては、役立つサービスだと思いますので、是非参考にしてください。