---
title: "GASで株価を収集し監視する"
metaTitle: "Google Apps Script（GAS）で株価データを収集し、LogServiceの機械学習で株価予測・異常検知・監視をする"
metaDescription: "Google Apps Script（GAS）で株価データを収集し、LogServiceの機械学習で株価予測・異常検知・監視をする"
date: "2020-12-29"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/LogService_images_26006613670107200/20201226124040.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Google Apps Script（GAS）で株価データを収集し、LogServiceの機械学習で株価予測・異常検知・監視をする

本記事では、LogServiceを使って株価をLogServiceで予測・異常検知・検知する方法を記載します。 

# 前書き
> <span style="color: #ff0000"><i>LogService は、リアルタイムデータロギングサービスです。  
ログの収集、消費、出荷、検索、および分析をサポートし、大量のログを処理および分析する能力を向上させます。</i></span>

少し前になりますが、LogServiceについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www2.slideshare.net/sbopsv/alibaba-cloud-log-service

    

今回はGoogle Apps Script（GAS）を使ってAlibaba Cloud LogServiceへ収集、蓄積、可視化してみましょう。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201226124040.png "img")


---

# プロジェクト作成（LogService全体で共通事項）

まずはプロジェクトを作成します。LogServiceコンソールから 「Create Project」を選択し、起動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201124101928.png "img")

Project Nameをここでは「techblog」にし、プロジェクトを作成します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201124102655.png "img")

その直後に "Do you want to create a Logstore for log data storage immediately?"、「Log Storeを作成しますか？」とポップアップが出ます。
Log StoreはLog Serviceでデータを蓄積するものなので、「OK」を選定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201124102805.png "img")

LogStore Nameをここでは「stock_logstore」と入力し、LogStoreを作成します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201124103013.png "img")


その後、「LogStoreが作成されました。今すぐデータアクセスしますか？」とポップアップが出ますが、これは必要に応じて選定すると良いです。
ちなみに「Yes」を選択した場合、50を超える様々なデータアクセス手法のコンソールが表示されます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201124103134.png "img")



---

# データ格納について

## STEP1: Google Apps Script（GAS）の設定、Webスクレイピングでデータ格納

今回はGoogle Apps Script（GAS）を使って、LogServiceへデータを格納します。
サンプルがあるので、これを参考に作成します。
（中国語なので気合を入れてGoogle翻訳しながら読んでみました）   

> https://github.com/aliyun-UED/aliyun-sdk-js/tree/master/samples/sls

流れとしては、①GASで新規プロジェクトを作成  ②外部ライブラリである`aliyun-sdk`をGASで使えるようにする になります。     
ここではclaspというnpmパッケージをローカル環境にグローバルインストールし、ローカルで開発（webpackをbuild）したものをGASにpushします。（gas-clasp-starterでも良いです。）    

> https://developers.google.com/apps-script/guides/clasp

> https://github.com/howdy39/gas-clasp-starter

まずはwebブラウザ側にてGASで新規プロジェクトを作成、および以下のソースコードを記載します（必要なライブラリが入ってないため、まだ実行できません）     

```js
function run_stocks_put() {
  var ENDPOINT = '<your endpoint>'
  var ACCESSKEYID = '<your ACCESSKEYID>'
  var ACCESSKEY = '<your ACCESSKEY>'  
  var PROJECT = 'tecblog'
  var LOGSTORE = 'stock_logstore'
  var TOKEN = ""
  var topic = '9984_stock'
  var source = '127.0.0.1'

  var sls = new ALY.SLS({
	"accessKeyId": ACCESSKEYID,
	"secretAccessKey": ACCESSKEY,
    "securityToken" :"tokens",
	endpoint: ENDPOINT,
    apiVersion: '2015-06-01'
  });

  var contents = {
    logs : [{
      time:  get_current_time(),
       contents: [{
            key: 'stock',
            value: fetch_stocks_data()
        }]
    }],
    topic: topic,
    source: source
  };
  
  sls.putLogs({
    projectName: PROJECT,
    logStoreName: LOGSTORE,
    logGroup: contents
  }, function (err, data) {
    if (err) {
      console.log('error:', err);
      return;
    }
    console.log('success:', data);
  });
}


function fetch_stocks_data() {  
  var url = "https://stocks.finance.yahoo.co.jp/stocks/detail/?code=9984.T";
  var m, strStocks, reg = /<td class="stoksPrice">.*?<\/td>/g
  const content = UrlFetchApp.fetch(url).getContentText('UTF-8');            
  
  while (m = reg.exec(content)) {
    Logger.log(m[0]);
    strStocks = m[0].replace('	<td class="stoksPrice">', ""); 
    strStocks = strStocks.replace('</td>', ""); 
    strStocks = strStocks.replace(',', ""); 
    return strStocks;
  }  
}

function get_current_time() {
	var now = new Date();
	return  "" + now.getFullYear() + "/" + padZero(now.getMonth() + 1) + 
		"/" + padZero(now.getDate()) + " " + padZero(now.getHours()) + ":" + 
		padZero(now.getMinutes()) + ":" + padZero(now.getSeconds());
}


```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201226130832.png "img")

続いて、ローカルでclaspを導入します。

```bash
PS C:\Users\1200358> npm i @google/clasp -g
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228160450.png "img")

ターミナルからGoogleにログインします。    
```shell
PS C:\Users\1200358> clasp login
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228202940.png "img")

[Google Apps Script API](https://script.google.com/home/usersettings)を開いて、Google Apps Script APIを有効にします。     

> https://script.google.com/home/usersettings

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228153907.png "img")

ターミナルにて、GASの既存プロジェクトをCloneします。そのために、.clasp.json を開いてScript IDを設定します。Script IDはGASを実行するIDのことで、URLに付帯されています。以下画像の赤枠がIDです。    
.clasp.json は インストール時にPathが表示されています。ここでは、`/User/<your name>/.clasp.json`にあります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201226133138.png "img")


```
{
  "scriptId": "1_AsyvNcAcgs6aQQuytdLlYK-7Lh012bvhlWXo0PiNQfgf-8znF9Ytu9t",
  "rootDir": "dist"
}
```

既存プロジェクトをCloneします。   

```
PS C:\Users\1200358> clasp clone xxxSCRIPT-ID1_AsyvNcAcgs6aQQuytdLlYK-7Lh012bvhlWXo0PiNQfgf-8znF9Ytu9t"
```

ここで、入れたいモジュールをインストールします。このモジュールは、上記のPJにて、webpackとしてビルドしたものをclasp経由でGASでも使えるようにします。   

```
PS C:\Users\1200358> npm install aliyun-sdk
```

ソースコードに`index.js`を入れます。
```
var ALY = require('../../index.js');
```

ローカル開発で作ったものをGAS側へ反映します。      

```
PS C:\Users\1200358> clasp push
```

あとはGASのマイトリガーで株価が出てる時間帯に合わせて、10分おきにデータを取得します。     
ちなみに東証で株式市場が開いているのは平日 9:00 - 15:00のみです。   

（しばらくして、、）データが無事登録されてることを確認しました。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229095407.png "img")

ちなみにWebスクレイピングはサイトによっては著作権ら法律があるので、事前に注意をチェックのうえご対処願います。     
それでも大量のデータを連続取得したい場合は、（相手のサーバ負荷を考慮して）kabuというサイトなどで取得したほうが良いと思います。      

> https://kabu.plus/

---

## STEP2: 文字型データを数値型データへ変換する（データクレンジング、ETL）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229101022.png "img")

取得したデータは基本的に「文字型」として登録されます。なので、自らData Transformationでデータの変換処理をする必要があります。    
この例の場合、「STOCK」フィールドが文字型なので、Data Transformationの以下の関数を使って「int_STOCK」という数値型フィールドを新規作成します。     
※Queryのcast文により文字型→数値型変換ができるため、このケースでのData Transformation作業は基本的に不要ですが、他のデータ、例えば数値に`+9,412` といった `+` や`,` がついてるものを除外したい、株価以外のデータから特定の文字を抽出or置換したい場合はこちらを参考にしてください。    

```
e_set("int_STOCK", ct_int(v("STOCK")))
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229101627.png "img")

この数値型へ変換するルールを継続的に利用する場合は、ETLルールとして「Transformation Rule」を保存し登録、別のLogStoreへETLしアウトプットする必要があります。    
※出力する「別のLogStore」は事前にて同じプロジェクト配下で新しく作成し、「Enable」ボタンを押してLogStoreをアクティベーションすると後がスムーズです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228205552.png "img")

ルール作成後、ETL処理が実行されます。ETL対象（日付、処理内容）によっては時間がかかります。進捗ステータスはこちらで確認できます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228210533.png "img")

ETL処理が終わったら、別のLogStoreである「stock_logstore_etl」にて処理結果が出力されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229102015.png "img")


---

## STEP3:Index機能の有効化、チャートを作ってみる
株価は折れ線チャートです。これはすぐできると思います。
先に、取得したデータの各フィールドを含め、Index機能を有効化します。Index化することで、LogStoreの中にあるデータを素早く検索できるようになり、結果としてチャートをリアルタイムに可視化することが出来ます。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/90732.htm

[Index Attributes] > [Modify]  でIndex登録の作業をします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228224136.png "img")

[Automatically Generate Index Attributes]をクリックし、フィールドタイプ（数値型、テキスト型、json型 etc）を選定しOKをクリックします。   
その後はLogStoreに入ってる過去データ/これから発生するデータに反映するようにします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228224859.png "img")


以上で、各フィールドはIndex化が出来たと思います。     
ここまでの作業が問題なければ、Queryバーにて以下Query文を入力し[Search ＆Analyze ]をクリックすると、以下画面左下の[Data Preview]にてデータが出力されます。     

```
* | select date_parse(DATE_ID,'%Y/%m/%d %H:%i') as Date,  cast(STOCK AS bigint) as Stock
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229104350.png "img")

上記SQL文についてを説明します。LogServiceのQueryは RDBなどで使われるT-SQLとは異なって全文検索をフォーカスとしたQueryとなります。もちろん読み取り専用（Select文のみ）です。詳しくは以下helpを参考にしてみてください。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/29060.htm

```
* | select date_parse(DATE_ID,'%Y/%m/%d %H:%i') as Date,  cast(STOCK AS bigint) as Stock
```

` date_parse(DATE_ID,'%Y/%m/%d %H:%i') as Date `は、「DATE_ID」フィールドを指定のタイムスタンプ形式で表示します。     
以下のドキュメントの下の方に、Date/Timeのフォーマット設定方法がありますので、参考にしてみてください。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/63451.html

`cast(STOCK AS bigint) as Stock` は 「STOCK」フィールドが文字型なので、数値型へ変換します。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/63456.htm

上記のQuery文によりデータが見れるようになったので、[Properites] タブをクリックし、グラフとして表示したい [X Axis] と [Left Y Axis] などのフィールドを設定します。    
これにより、チャートが見えるようになるはずです。上記は折れ線グラフですが、他のグラフもありますので色々試してみるといいでしょう。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228225633.png "img")

作成したグラフをDashboardへ出力します。    
Dashboardは上記のようなQuery結果をいつでも可視化できるメリットがあります。その他、複数ユーザによる閲覧や、リアルタイム可視化などいろいろありますが、ここは説明を省きます。      

> https://www.alibabacloud.com/cloud-tech/doc-detail/102530.htm

[Add to New Dashboard]をクリックし、任意のDashboardへ追加します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228225738.png "img")

Dashboardにて、先ほどのグラフが表示されました。以降のStepはこのDashboardを使って説明します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228225842.png "img")

---

## STEP4:LogServiceで異常検知・予測する

やっと本題に入ります。（ここまで１万2千文字Over、見づらくなりすいません、、）    
 
LogServiceは元々SIEMをメインとしたサービスですが、上記のようなチャートで可視化する箇所が多ければユーザーは追い付かなくなります。そのため、様々な時系列分析アルゴリズムによる異常検知・時系列の予測を行うことができます。   

異常検知は以下のように色々なパターンがありますが、今回は株価なので、変化点検知をメインとした異常検知をします。この場合、変化点検出関数`ts_cp_detect`を使います。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229104930.png "img")

時系列分析アルゴリズムによる関数の一覧はこちらにてあります。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/93024.htm


Dashboardにて、[edit]ボタンを押しながら[chart]をダブルクリックします。すると、以下のようなチャートのEdit画面らモーダルウィンドウが表示されます。      
このStepではDashboardのモーダルウィンドウ内を使って説明します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201228231210.png "img")

チャートで日付フィールドが長いためかなり見にくいと思いますので、以下のQuery文を使って[DATE_ID]フィールドから「年(year)」を削除します。[DATE_ID]フィールドのスリム化です。    

```
* | select substr(DATE_ID,6,length(DATE_ID)-5) as dt, cast(STOCK AS bigint) as stock
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229003918.png "img")

これで見えやすくなったと思います。     
続いて、変化点検出関数`ts_cp_detect`を使って、株価の変化点を検知するようにします。　　　

> https://www.alibabacloud.com/cloud-tech/doc-detail/93197.htm

Query文は以下の通りです。
ts_cp_detect関数で、第一引数はunixtime、第二引数は変化を検知したい値、第三以降のパラメータは任意入力ですが 検知したい閾値やスパン、サンプル値などを入力します。詳しくは上記のhelpにて記載されています。    

```
* | select ts_cp_detect(to_unixtime(dt), stock , 3 ) from
 ( select date_parse(DATE_ID,'%Y/%m/%d %H:%i') as dt, cast(STOCK AS bigint) as stock 
from log )
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229013908.png "img")

これで表示されました。srcは値で、probは変化検知のための変化値を示します。probが `1` であれば、変化あり（＝変化・異常）と示します。`0`なら変化なしです。   
ここで一つ問題があります。ts_cp_detect関数の返却値として、timestampフィールドがそのまま返却されます。これでは時系列データとして見にくいので、これをyyyy/mm/dd hh:mm形式に変換したい。そういう場合は以下のQuery文を入力します。    

```
* | select from_unixtime(res.timestamp) as date_dt_from_unixtime , res.src as src, res.prob as prob
 from ( 
select ts_cp_detect(to_unixtime(dt), stock , 3 ) as res from
 ( select date_parse(DATE_ID,'%Y/%m/%d %H:%i') as dt, cast(STOCK AS bigint) as stock 
from log )
)
```

チャートにて、異常検知の時の赤丸（=probフィールドが`1` ）を表示するために、以下設定します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229023831.png "img")

これで設定完了です。株価をリアルタイム可視化、異常検知することもできます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229023649.png "img")

今度は予測機能を入れてみます。ts_predicate_arma関数で、自己回帰移動（ARIMA）モデルを使用して時系列データをモデル化し、簡単な時系列予測と異常検出を実行します。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/93210.htm

ts_predicate_arma関数で、第一引数はunixtime、第二引数は変化を検知したい値、第三以降は任意ですが 検知したい閾値やスパン、サンプル値などを入力します。詳しくは上記のhelpにて記載されています。    

```
* | select ts_predicate_arma(to_unixtime(dt), stock,10, 2, 2, 1, 'max' ) as res from
 ( select date_parse(DATE_ID,'%Y/%m/%d %H:%i') as dt, cast(STOCK AS bigint) as stock 
from log )
```

これで表示されました。srcは値で、predictは予測値、upper/lowerは信頼区間、anomaly_probは異常検知のための変化値を示します。anomaly_probが１であれば、変化あり（＝異常）と示します。    
今は株価が上昇傾向なので問題ないのですが、低下時 緑色のラインが下へ向くので、そこから動向の予測ができます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229031639.png "img")

LogServiceの機械学習は以下のアルゴリズムが梱包されていますので、目的に応じて色々試すのもありと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229110223.png "img")


余談ですが、Alibaba CloudのほうでLogServiceによる異常検知のdemoのサイトがありますので、こちらも参考にいただければ幸いです。     


[http://47.96.36.117/redirect.php?spm=5176.11777732.1159318.3.21e17a34549Qdq&type=26&amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;redirect=true]


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201226123505.png "img")



---

## STEP5: 監視・株価が急激に低下したときアラート発信する

helpにて、[Case study：トラフィックが大幅に低下したときに検知するクエリ] がありますので、これを参考にアラートを作成します。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/63662.htm

```
* | SELECT sum(stock) / (max(to_unixtime(date_parse(DATE_ID,'%Y/%m/%d %H:%i'))) - min(to_unixtime(date_parse(DATE_ID,'%Y/%m/%d %H:%i')))) as stock_per_minute, date_trunc('minute',date_parse(DATE_ID,'%Y/%m/%d %H:%i')) as minute group by minute
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229111738.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201229111511.png "img")



---

# 完了

Google Apps Script（GAS）で株価データを取得しLogServiceへ格納、およびLogServiceの機械学習機能を使って、株価の予測および異常検知を簡単に説明しました。     
また、株価が低下したときはメールによるアラートを発信することが出来ます。     
（今回、ターゲットとなる株価で暴落がなかったため、メール受信できず。なので暴落がきたときはメールのスクショ画像を含め、このblogを追記更新します）    
これにより、いつでもどこでも可視化はもちろん、異常検知や予測、監視が出来ることから目視作業を大幅に減らすことが出来ます。     



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>






