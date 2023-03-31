---
title: "実運用を想定した構成 Part3"
metaTitle: "実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編②～"
metaDescription: "実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編②～"
date: "2019-08-27"
author: "SBC engineer blog"
thumbnail: "/LogService_images_26006613403075200/20190823150645.png"
---

## 実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編②～


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190903123256.png "img")



今回は、Alibaba Cloudの<span style="color: #ff0000">【LogService】</span>の検索編②を投稿します。      
本記事では、<span style="color: #ff0000"><b>Apache設定</b></span>で収集したログを閲覧・検索していきます。     



## Apacheのアクセスログについて
Apacheのアクセスログは`httpd.conf`にて`LogFormat`をデフォルト設定のまま使用している場合は、下記のような形式で出力されます。   
```
111.1.1.1 - -[02/Jul/2019:16:42:49 +0800] "POST /web/jsrpc.php?output=json-rpc HTTP/1.1" 200 63 "http://47.1.1.1/web" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
```
収集したログの検索については、<b>シンプルモード</b>での検索と同様の手順で実施可能です。   

LogtailConfigで定義したApache設定を使用すると、このようなログに対して、   
<b>アクセス元</b>、<b>status</b>毎での集計や<b>数値として定義されているデータ</b>の集計が可能です。   
なお、集計を実施するためには、<b>インデックス</b>を設定する必要があります。   
そのため、本記事では、<b>ログ確認</b>⇒<b>インデックス設定</b>⇒<b>ログの集計</b>の順に実施します。   

## ログ確認
1. Alibaba Cloudのコンソール画面へログインし、【LogService】画面を開きます。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190724150628.png "img")

2. 確認対象の`Project`をクリックします。   
ここでは、`webserver-project`をクリックします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190724150645.png "img")

3. `Logstore`の一覧が表示されます。   
この中から確認対象の`Logstore`を選択します。   
ここでは、`web1-logstore`の`ログ使用モード`配下にある`検索`をクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190724151054.png "img")

4. ログ検索画面内に収集したログが表示されます。   
Apache設定にて収集した場合は、大きく分けて`生ログ`、`ログ収集元ホスト情報`、`Logtailconfigにて設定したApacheキーにて生ログから抽出した値`が表示されます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150323.png "img")   
Apacheキー名は、LogtailConfig作成時に定義しております。       
<b>（参考）</b>   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150344.png "img")

## インデックスの設定   
LogServiceにて取得したログの集計を行う場合は、インデックスの設定を実施する必要があります。   
ここでは、Apacheキー名で抽出した値を集計するためにApacheキーをインデックスとして設定します。   
インデックスについての詳細な説明は<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/90732.htm">こちらの公式ドキュメント</a>をご参照下さい。   

以下、手順です。   

1. Logstore画面にて、`インデックス属性`⇒`変更`の順にクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150402.png "img")

2. 検索と分析画面にて、`キー`の下にある`+`ボタンをクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150543.png "img")

3. キーの入力行が表示されます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150557.png "img")

4. 集計したい`キー名`を入力します。   
ここでは、下記の値を入力します。   
`__source__`   
`__tag__:__hostname__`   
`__tag__:__path__`   
`__tag__:__user_defined_id__`   
`__topic__`   
`http_user_agent`   
`remote_addr`   
`request_method`   
`request_protocol`   
`request_uri`   
`response_size_bytes`   
`status`   
`time_local`   

5. キーに対する`データ型`を入力します。   
ここでは、数値として取り扱う可能性があるものを`long`それ以外を`text`としました。   

6. クエリ発行時に ④ で定義した`キー`を別名で検索したい場合にします。   
<span style="color: #ff0000"><b>本記事では、使用しません。</b></span>

7. 大文字と小文字を区別したい場合に使用します。   
<span style="color: #ff0000"><b>本記事では、使用しません。</b></span>

8. ログ収集時、トークン内の値でログを区切って収集することが可能です。   
デフォルト設定では、下記のトークンで区切られます。   
`, '";=()[]{}?@&<>/:\n\t`   
なお、本記事では不要のため、`空白`とします。   

9. 取得した値を集計し、カウントしたい場合は、有効にします。   
本記事では、`有効`とします。

10. 設定値の入力が完了後、`OK`をクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150614.png "img")

11. 下記のポップアップが表示されたら`OK`をクリックします。   
設定反映後に取得したログから集計が可能となります。   
※インデックス設定前に取得したログについては、集計の対象外となります。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150631.png "img")

12.  `Rawデータ`の`クイック解析`の箇所に設定した`キー`が表示されていることを確認します。   

13. こちらボタンをクリックすることによって、インデックス設定後に収集したログに対して、`キー`毎での集計が可能となります。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150645.png "img")

## ログの集計
インデックスにて設定したキー毎にログの集計を実施します。   
ここでは、<b>過去1週間</b>の<b>アクセス元毎</b>での集計を例に手順を記載していきます。   

### アクセス元のみを集計
インデックスの設定後、数日間ログを流し続け、ログを正常に受信していることを確認した後、集計を実施します。   

以下、手順です。   

1. Logstore画面にて、検索対象とする時間帯を選択します。   
ここでは、`1週（相対）`とします。   

2. アクセス元を集計するため、`remote_addr`右のボタンをクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823164832.png "img")

3. 生ログに記載されているアクセス元のグローバルIPアドレスが自動で集計されて表示されます。   

4. GUI上では、`パーセンテージ`でアクセス元の割合が表示されております。   
〇〇％の箇所もしくはバーにマウスを合わせると`アクセス数`が表示されます。   

5. 下部のボタンをクリックすると`クエリ`が発行され、`グラフ画面`に遷移します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150720.png "img")

6.  `クエリ`が自動生成されます。   

7. 発行されたクエリの全量が<b>データソース</b>タブに反映されます。   

8. `グラフ`タブに自動で遷移します。   

9. グラフの種類の中から`チャートプレビュー`が自動選択されます。   

10. クエリ結果が表示されます。   
ここでは、`アクセス元`毎の`pv数`および`percentage`が表示されます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150734.png "img")

11. グラフは、様々な形式で使用することが可能です。   
使用可能なグラフの全量については、<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/69313.htm?spm=a21mg.p38356.b99.187.f2477f11epN0sV">こちらの公式ドキュメント</a>をご参照下さい。   
下記の画面は、`横棒グラフ`を選択した場合の表示結果です。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150746.png "img")

12. 円グラフを選択した場合は、下記の表示結果となります。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823170606.png "img")

13. グラフについては、ダッシュボード化することも可能です。   
ダッシュボード化については、次回以降に記載します。   

14. ログのダウンロードについては、画面上に出力されているクエリの結果をダウンロードすることや   
生ログをダウンロードすることが可能です。   
ログをダウンロードについても、次回以降に記載します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823170619.png "img")

### アクセス元をstatusで絞って集計
ここでは、アクセス元をstatusで絞って集計します。   

以下、手順です。   

1. アクセス元を集計するため、`status`右のボタンをクリックします。   

2. status`200`で絞るため、値をクリックします。   

3.  `クエリ`が自動生成されます。   

4. status`200`でログが絞りこまれることを確認します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150817.png "img")

5. 再度`remote_addr`右をクリックし、status`200`で絞り込んだアクセス元を表示します。   

6. 下部のボタンをクリックし、`クエリ`を実施します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150833.png "img")

7. クエリが自動発行されます。   

8. クエリの全量がデータソースタブに反映されます。   

9.  `status`で絞り込まれた集計結果が表示されます。   
このように、あらかじめ検索条件を絞り込んで集計・グラフ化することも可能です。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150847.png "img")


