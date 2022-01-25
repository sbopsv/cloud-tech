---
title: "実運用を想定した構成 Part1"
metaTitle: "実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ収集編～"
metaDescription: "実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ収集編～"
date: "2019-07-16"
author: "SBC engineer blog"
thumbnail: "/LogService_images_17680117127215800000/20190711194237.png"
---

## 実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ収集編～

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190903123045.png "img")      


今回は、Alibaba Cloudの<span style="color: #ff0000">【LogService】</span>について、投稿します。     

LogServiceとは、一言でいうと<span style="color: #ff0000"><b>ログの収集・検索・可視化</b></span>ができるサービスです。     

本記事では、実運用を想定したときにどのような使い方ができるのかを     
<span style="color: #ff0000"><b>ログ収集編</b></span>と<span style="color: #ff0000"><b>ログ解析編</b></span>に分けて考えていきます。     

機能についての説明は下記の記事や公式ドキュメントページが分かりやすいかと思います。     
「<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/48869.htm?spm=a21mg.p38356.b99.2.454b669cNE423O">Log Service とは</a>」     
「<a href="https://www.sbcloud.co.jp/entry/2018/02/07/log-service-logtail/">Alibaba Cloudのログ収集機能を使ってみた</a>」     
「<a href="https://www.slideshare.net/sbopsv/logservice">意外と知らないLogServiceの話</a>」     
     
     
さて、今回は<span style="color: #ff0000"><b>ログ収集編</b></span>です。




# LogServiceの処理概要と使用時の考え方

サーバ内のログをLogServiceで収集する際のフローは下記のイメージです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711194237.png "img")      
     

用語の説明は<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/28961.htm?spm=a21mg.p38356.b99.11.4bb5133deRb8lF">公式ドキュメント</a>にお任せするとして、使用する上での考え方を例として記載します。     

■前提：     
　LogService内のオブジェクトをそれぞれ下記のように仮定します。     
　　Project：ディレクトリ     
　　Logstore：サブディレクトリ     
　　Logtail Config：ログファイル     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711211750.png "img")      

<b>これを踏まえて、二つの使用例を記載します。     </b>
     

<span style="color: #0000cc">例１）インスタンス毎にログを管理したい場合</span>
     
　想定：     
　　小規模構成であり、ECSをスケールさせる必要がないため、インスタンス毎にログを管理する必要がある。     

　概要：     
　　Projectにてサーバの分類をWebサーバグループと業務サーバグループに分けています。     
　　さらにその配下にあるLogstoreをインスタンス毎に分けることで、インスタンス毎にログを管理することができます。     

　　![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711205140.png "img")      
     

<span style="color: #0000cc">例２）サーバ種別毎にログを管理したい場合</span>
     
　想定：     
　　大規模構成であり、ECSを頻繁にスケールさせるため、機能毎にログを管理する必要がある。     

　概要：     
　　Projectにてサーバの分類をWebサーバグループと業務サーバグループに分けています。     
　　大規模構成のため、その配下にさらに機能毎にグループを分けています。     
　　Logstoreを機能が異なるグループ毎で分けることにより、機能毎にログを管理することができます。     

　　なお、LogSearch/Analyticsによる検索を使用し、インスタンス毎でログを検索することも可能です。     

　　![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711205244.png "img")      
     


以上、二つの例をご紹介しましたが、使い方はプロジェクトによって変わってくるかと思いますので、     
実運用に合わせてカスタマイズしてみましょう      

次は、収集したログがLogServiceではどういう見え方になるかを確認しましょう。     
     
     

# 収集したログがLogServiceではどのように見えるか

繰り返しとなりますが、LogServiceでは、<b>収集・検索・可視化</b>が可能です。     
<b>検索や可視化</b>を容易に行うため、LogServiceでは、<span style="color: #ff0000">ログフォーマットに合わせた収集</span>が可能です。     

例として、Webサーバで下記のアクセスログを一行だけ出力した場合のLogService内でのログの見え方について、記載します。     

```
111.1.1.1 - -[02/Jul/2019:16:42:49 +0800] "POST /web/jsrpc.php?output=json-rpc HTTP/1.1" 200 63 "http://47.1.1.1/web" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
```

<b>LogServiceでの見え方は、下記のようになります。（※事前設定要）</b>

```
__raw__:  111.1.1.1 - -[02/Jul/2019:16:42:49 +0800] "POST /web/jsrpc.php?output=json-rpc HTTP/1.1" 200 63 "http://47.1.1.1/web" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
__source__:  10.1.1.1
__tag__:__hostname__:  hostname1
__tag__:__path__:  /var/log/httpd/access_log
__tag__:__user_defined_id__:  Web1
__topic__:  unyo-server
http_referer:  http://XX.XX.XX.XX/web
http_user_agent:  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36
remote_addr:  111.1.1.1
remote_ident:  -
remote_user:  -
request_method:  POST
request_protocol:  HTTP/1.1
request_uri:  /web/jsrpc.php?output=json-rpc
response_size_bytes:  63
status:  200
time_local:  [02/Jul/2019:16:42:49 +0800]
```

LogServiceでは、もちろん生ログを表示することは可能です。     
今回の例では、該当箇所は`__raw__`です。     

ただ、後のログ解析のためにあらかじめログフォーマットを定義し、     
抜き出したい項目や集計したい項目を別途表示させることが可能です。     

今回は、ApacheのLogフォーマット`LogFormat "%h %l %u %t ¥"%r¥" %>s %b ¥"%{Referer}i¥" ¥"%{User-Agent}i¥"" combined`を     
LogService内の設定で定義しております。     
8行目以降は、`__raw__`から`%h：remote_addr`や`%>s：status`を抽出しております。

このように抽出しておけば、後の解析で`status`毎に集計するといったことが可能です。     


表示内容については、以下記載します。     


|key|value|
|---|---|
|__raw__|ログ本文|
|__source__|ログ収集元IPアドレス|
|__tag__:__hostname__|ログ収集元ホスト名|
|__tag__:__path__|ログファイルパス|
|__tag__:__user_defined_id__|ログ収集時のECS定義|
|__topic__|分類|


以降は、Apache準拠のため、valueのご説明は割愛します。     
> https://httpd.apache.org/docs/2.2/ja/mod/mod_log_config.html


|key|
|---|
|http_referer|
|http_user_agent|
|remote_addr|
|remote_ident|
|remote_user|
|request_method|
|request_protocol|
|request_uri|
|response_size_bytes|
|status|
|time_local[ECS内部のシステム時刻]|


<b>では、実際に設定してみましょう </b>


# ログ収集設定の実施

検証環境は、以下の構成とします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711194344.png "img")      

     
本記事では、下記の順番で実施していきます。     
　● Logtailインストール     
　● Project     
　● Logstore     
　● Logtail MachineGroup（日本語表記：LogTailマシングループ）     
　● Logtail config（日本語表記：LogTail構成）     
     
※なお、構成図は英語表記で記載しておりますが、     
　本記事にて表示する画面キャプチャについては、日本語表記のものを使用します。     

# Logtailインストール

各ECSにログインし、以下を実施します。     

１．サーバにLogtailを<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/28982.htm">インストール</a>します。     
> https://www.alibabacloud.com/cloud-tech/doc-detail/28982.htm

<pre class="EnlighterJSRAW" data-enlighter-language="null"># wget http://logtail-release-ap-northeast-1.oss-ap-northeast-1-internal.aliyuncs.com/linux64/logtail.sh -O logtail.sh; chmod 755 logtail.sh; ./logtail.sh install ap-northeast-1</pre>

２．Logtailのインストール後、カレントディレクトリにファイル`logtail.sh`が残るため、必要に応じて削除 or 退避します。     

３．サーバ内に`/etc/ilogtail/user_defined_id`ファイルを作成し、構成図内の`user_defined_id`をサーバに応じて記載しておきます。     

　　例）Webサーバグループ1ならファイル内に`web-1`を記載しておきます。     

４．サービスを再起動します。

<pre class="EnlighterJSRAW" data-enlighter-language="null"># systemctl restart ilogtaild.service</pre>


# LogServiceの設定
     
ここからは、Alibaba Cloudのコンソール画面を操作します。     
※本記事にて表示する画面キャプチャについては、日本語表記のものを使用します。     
     
まずは、Alibaba Cloudのコンソール画面へログインし、【LogService】画面を開きましょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710164511.png "img")      
     
     


# Projectの作成
Projectの作成を実施します。     
     
１．LogServiceを開くと【プロジェクト一覧】が表示されます。     
　　右上の`プロジェクトの作成`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710164652.png "img")      
     
     

２．`プロジェクト名`と`リージョン`を入力し、`確認`をクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710193040.png "img")      
     
     

３．Logstore作成画面へと遷移するポップアップが表示されますが、Projectの作成有無を確認するために`キャンセル`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710201012.png "img")      
     
     

４．Projectが作成されていることを確認します。     
　　※Logstoreを作成する場合は、プロジェクト名をクリックします。     
　　※追加で作成する場合は、右上の`プロジェクトの作成`をクリックし、追加作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710194159.png "img")      
     
     
     

# Logstoreの作成

次は、Logstoreの作成です。

１．`プロジェクト一覧`画面にて`プロジェクト名`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710194756.png "img")      
     
     

２．表示されたLogstoreリスト画面にて右上の`作成`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710201546.png "img")      

     
     

３．`Logstore名`と`データ保存期間`を入力し、`確認`をクリックします。     
　　今回は、その他のパラメータはデフォルト値で使用します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710201855.png "img")      
     
     

４．Logtail config（Logtail 構成）の作成画面へのポップアップが表示されますが、     
　　Logstore作成有無の確認のために、`キャンセル`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710202113.png "img")      
     
     

５．Logstoreが作成されていることを確認します。     
　　続けて作成する場合は、右上の`作成`をクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710202615.png "img")      
     
     

# LogtailMachineGroup（Logtailマシングループ）の作成

ここでは、ログ収集対象のサーバを定義します。
     

１．`Logtailマシングループ`をクリックしてマシングループ画面を表示します。     
　　その後、`マシングループの作成`をクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710195135.png "img")      
     
     


２．下記の項目を入力し、`確認`をクリックします。     
　　`マシングループの識別子`については、     
　　`IPアドレス`と`ユーザー定義ID`が選択可能です。     
　　今回は、IPアドレスではなく、サーバ内で定義している`user_defined_id`を使用するため、     
　　`ユーザー定義ID`を選択します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710225451.png "img")      
     
     

３．Logtailマシングループが作成されていることを確認します。     
　　続けて作成する場合は、右上の`マシングループの作成`をクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711105431.png "img")      
     
     

４．接続確認です。     
　　`マシンステータス`をクリックし、`ハートビート`が`OK`となっていれば     
　　インスタンスと正常に通信できています。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711110130.png "img")      
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711110215.png "img")      
     
     

# Logtail config（Logtail 構成）の作成
ここでは、収集対象ログファイルおよび収集時のログフォーマットを定義します。     
今回は、下記の3パターンを作成します。     
　●デフォルト設定での収集     
　●Apacheログフォーマットでの収集     
　●カスタマイズしたログの収集     
     
# デフォルト設定での収集

デフォルト設定で収集する場合の手順を記載します。     
ここでは、`/var/log/messages`を収集します。
     
以下、手順です。
     

１．`データ・インポート・ウイザードアイコン`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710204331.png "img")      
     
     


２．データソースの選択画面にて`テキスト`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710204841.png "img")      

     
     

３．`構成名`に任意の値を入力し、`ログパス`に収集対象ファイルを入力します。     
　　　※ファイル名については、ワイルドカードが使用できます。     
　　　※モードはデフォルト値の`シンプルモード`のままにしておきます。     
     
　　`高度な設定`を展開し、`トピック生成方式`に`マシングループのトピック属性`を指定しておきます。     
　　ここでは、その他の設定はデフォルト設定とし、`次へ`をクリックします。
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711121424.png "img")      
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711120348.png "img")      
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710215741.png "img")      
     
     


４．事前に作成したマシングループを選択し、`マシングループに適用`をクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710205921.png "img")      
     
     

５．検索条件のカスタム設定

今回は、デフォルト値で設定します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710210454.png "img")      
     
     

６．OSSへのアップロード設定

今回は、OSSへのアップロードを実施しないため、設定変更をせずに`確認`をクリックします。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710210812.png "img")      
     
     


７．Logtail config（Logtail 構成）が作成されていることを確認します。     
　　続けて作成を行う場合は、画面右上の`作成`をクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710205945.png "img")      
     
     

# Apacheログフォーマットでの収集

Apchceログフォーマットで収集する場合の手順を記載します。     
ここでは、`/var/log/httpd/access_log`を収集します。
     

※注     
上記の手順から追加作成を行います。     
なお、     
　５．検索条件のカスタム設定     
　６．OSSへのアップロード設定     
については、一度設定しておけば追加設定不要です。     
     
     
以下、手順です。
     


１．`Logtail 構成`にて`作成`をクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710214821.png "img")      
     
     

２．データソースの選択にて`テキスト`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710214852.png "img")      
     
     

３．収集モードの指定にて、必要事項を入力します。     
　　ここでは、ログ収集時のモードを`APACHE設定`とし、     
　　ログフォーマットをWebサーバにて使用しているフォーマットを指定します。     
　　`APACHE設定フィールド`および`APACHEキー名`は`ログフォーマット`指定時に自動表示されます。     
　　また、生ログについても収集したいため、`高度な設定`を展開し、`オリジナルログ`を有効化しておきます。     
　　`トピック生成方式`については`マシングループのトピック属性`を指定しておきます。     
　　ここでは、その他の設定はデフォルト設定とし、`次へ`をクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710214923.png "img")      
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710222312.png "img")      
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711121834.png "img")      
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710215741.png "img")      
     
     

４．事前に作成したマシングループを選択し、`マシングループに適用`をクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710205921.png "img")      
     
     


５．Logtail config（Logtail 構成）が作成されていることを確認します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710220056.png "img")      


# カスタマイズしたログの収集

カスタマイズしたログを収集する場合の手順を記載します。     
ここでは、`/var/log/ap/ap1.log`を収集します。
     
     
※注     
上記の『Apacheログフォーマットで収集・解析したい場合』との違いは、項番『３』での`収集モード`の指定方法のみとなります。     
ここでは、収集モードの指定についてのみ記載します。     
その他の手順については、同様となります。     
そのため、以下は収集モードの指定についてのみ記載します。     
     
カスタマイズしたログを収集する場合は、`デミリタモード`にて任意の`ログサンプル`を指定し、`デミリタ`に`カスタム`を選択し、     
`デミリタ`を指定することでログを区切ることができます。     
なお、デミリタは3文字まで設定できます。     
ここでは、` : `(半角スペース+コロン+半角スペースの3文字)としております。     
また、ここでも生ログを出力するため、`オリジナルログ`は有効化しておきます。     
`トピック生成方式`については`マシングループのトピック属性`を指定しておきます。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710221236.png "img")      
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710222312.png "img")      
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711121834.png "img")      
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710215741.png "img")      
     


# 収集したログの確認
では、実際に収集したログを順番に見ていきましょう。     
該当のLogstoreの`検索`をクリックします。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711124936.png "img")      
     
表示する時間帯は、調整可能です。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711124947.png "img")      
     
     
<b>以下、出力結果です。</b>
     
####デフォルト設定での収集
デフォルト設定の場合は、`content`の箇所に生ログが表示されます。     
その他に事前に設定した`topic`や`user_defined_id`も表示されていますね。     
これを使って検索することも可能です。
     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711124310.png "img")      
     

# Apacheログフォーマットでの収集
ここでは、`オリジナルログ`を有効化しているため、生ログは、`__raw__`の箇所に表示されます。     
また、`http_referer`以下は、指定通り、分割して表示されてますね。     
下記の例だと`status`毎等で集計することも可能です。
     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711124335.png "img")      
     

# カスタマイズしたログの収集
`ap_number`以下は、指定した通り、分割して表示されてますね。     
下記の例だと、`message`に`error`と出力しているので、errorの数を集計することも可能です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711124352.png "img")      
     
     
<b>次回は、これらの機能を使用して、実際にログを検索・解析していきましょう </b>


# まとめ

LogServiceは、ログを収集することはもちろんのこと、ログ解析用として使うことも可能であるため、     
LogServiceを使用すれば、ログ収集用のミドルウェアを導入する必要はありません。     
そのため、<b>ログ収集用のサーバを構築する必要がなく、構成上の障害ポイントも減るのではないでしょうか。</b>     

下記のようなログ収集・解析用の製品導入をご検討されている方は、是非<span style="color: #ff0000">【LogService】</span>についても併せてご検討してみてはいかがでしょうか。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190710121548.png "img")      

次回の記事では、<span style="color: #ff0000">収集したログをどのように検索・解析するのか</span>を投稿します。     
本記事がAlibaba Cloudを使用する際のご参考になれば幸いです。     



