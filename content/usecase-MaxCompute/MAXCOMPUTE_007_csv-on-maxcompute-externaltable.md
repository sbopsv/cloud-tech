---
title: "CSVファイルを外部テーブルへ"
metaTitle: "CSVファイルをMaxComputeの外部テーブルとして処理する"
metaDescription: "CSVファイルをMaxComputeの外部テーブルとして処理する"
date: "2021-03-11"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613674380300/20210305030713.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## CSVファイルをMaxComputeの外部テーブルとして処理する

本記事では、CSVファイルをMaxComputeの外部テーブル（EXTERNAL Table）として格納する方法をについて説明します。

# 前書き

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute


今回はAlibaba Cloud MaxComputeでCSVファイルを格納、SQL処理してみましょう。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305030713.png "img")


今回は[Movielensというオープンデータ](https://grouplens.org/datasets/movielens/)を使いました。   
OSSはbucket名`bigdata-dwh`、ディレクトリ（Object Name Prefix）は`csv/links/`、CSV配下linksフォルダに対象のCSVファイルを格納しています。    

> <span style="color: #ff0000"><i>注意点として、MaxComputeでExternal Tableこと外部テーブルを利用する際は、対象のCSVファイルをディレクトリ単位で管理する必要があります。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305115149.png "img")




---

# 共通作業（MaxCompute全体で共通事項）

## RAM ユーザー作成＆権限付与
もしMaxComputeを操作するユーザがRAMユーザーの場合は以下を実施してください。    

RAMより対象のユーザーを選定します。ユーザーが無い場合は新規作成します。 このときにAccessKey IDとAccessKey Secretをメモとして残してください。AccessKey IDとAccessKey SecretはDataWorks DataIntegrationの処理に必要となります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305025953.png "img")

対象のユーザーには権限ロールとしてAliyunDataWorksFullAccessをアタッチします。 これはDataWorksを操作するためのFull権限です。    
DataWorks側にてユーザーごとに読み取り専用や一部プロジェクト・テーブルなどのきめ細かい権限付与ができますが、ここでは割愛します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305025809.png "img")


## Workspace作成

MaxComputeを操作するためにはワークスペースおよびプロジェクトが必要なので新たに作成します。DataWorksコンソールから 「Create Project」を選択し、起動します。    
Modeは「Basic Mode（基本モード）」「と「Standard Mode（標準モード）」の２種類があります。ここは「Basic Mode（基本モード）」として選定します。   
   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210304212211.png "img")

続けて、MaxCompute を選定します。料金は初めて操作するなら Pay-As-You-Go（使った分だけ課金） が良いと思います。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210304220348.png "img")

MaxComputeに関する必要な情報を設定し、Workspaceを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210304220459.png "img")


---

# CSVファイルを MaxCompute External Table（外部テーブル）として処理
ここのチュートリアルは、CSVファイルをMaxComputeのExternal Table（外部テーブル）として処理する方法です。   　 

## STEP1：データ格納ことDataIntegration、、、はSkipします。
DataIntegrationは異種データソース間でデータを同期するプロセスです。しかし今回はOSSにあるCSVファイルを外部テーブルとして利用するため、この手順はSkipとなります。    

DataWorks でまずは DataStdioへ遷移します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210304231934.png "img")

DataStdio画面です。最初は何もない状態です。そこからプラレールのように色々構築することが出来ます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210304232016.png "img")

## STEP2：CSVファイルを認識し、MaxCompute Tableに格納
メニューバーからworkflowを作成します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210304232146.png "img")

workflow名を入力し、「Create」ボタンで作成します。ここは「csv2maxcompute」というタイトルで登録します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210304232340.png "img")

workflow画面が出たら、メニューバーにて、緑色の「Table」から「Create Table」でテーブルを新規作成します。     
「csv2maxcompute」というワークフロー画面はタブより閉じても問題ありません。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305031323.png "img")

`links` という名前のテーブルを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305120014.png "img")

こんな感じになります。そこから外部データと連携してテーブルを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305120123.png "img")

まずはExternal Tableをクリックします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305031832.png "img")

MaxCompute/DataWorksとして、今操作しているNodeでOSSのデータ操作ができるよう、Nodeに対しRAM Role権限 `AliyunODPSDefaultRole` を付与します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305031928.png "img")

先ほどのDataStdio画面に戻って、、今度はフォルダパスを選定します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305032225.png "img")


OSSのパスで対象のCSVファイルのあるフォルダを選定できるまで深掘りでクリックします。選定できたらOKを押します。   
今回はこのパス`oss://oss-ap-northeast-1-internal.aliyuncs.com/bigdata-dwh/csv/movies/` に設定しています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305120348.png "img")

このような状態になります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305120416.png "img")


ここで、OSSがMaxComputeに対する権限をアタッチするために、別のTabでRAMメニューを開きます。    
RAMメニューにて、RAM Rolesページを開いたら、`AliyunODPSDefaultRole`を入力して そのロールの編集画面を開きます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305032802.png "img")

今回、RAMロールの中で、赤線のARM情報が必要だったのでコピーします。     
これはAlibabaCloudアカウントごとに番号が異なるので、各自確認のうえコピペしてください。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305032911.png "img")

rolearn　にて貼り付けます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305120521.png "img")


上にある[ DDL Statement] からSQLでフィールドを作ります。下段にある[Create Field]などのボタンで手動でフィールド作成もできます。   

```
CREATE TABLE IF NOT EXISTS links (
  movieId BIGINT,
  imdbId BIGINT,
  tmdbId BIGINT
) 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305121233.png "img")


フィールド名も見れるようになりました。今回のcsvファイルには1行目にフィールド名があるため、「Rows in Text File to Ski」で`1`を入力します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305121431.png "img")

Display名を入力します。今回は「links_display」と入れます。   
これで設定は完了です。 [Commit to Production Environment] をクリックし、実行します。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305121526.png "img")


Talbeを本番環境にコミットしますか？と警告メッセージがでます。ここはOKを押します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305034411.png "img")


## STEP4：完了

これで無事コミットが完了したら、今度はSQLで確認します。今回はAd Hoc Queryを使います。   
メニューバーでAd Hoc Query →新規作成 → ODPS SQL  を選定します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305121705.png "img")

Node Nameは「check_node」、Locationは「Ad-Hoc Query」にします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305121851.png "img")

SQLクエリを入力し、実行します。   
これでテーブルがあることを確認できました。    

```
SELECT * FROM links LIMIT 5;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305122119.png "img")


# CSVファイルを MaxCompute External Table（外部テーブル）として処理（SQLで一発編）

上記、GUIでポチポチ操作しましたが、これがめんどくさい人向けに朗報です。   
SQLクエリで一発で外部テーブルを作成することが出来ます。    
先ほどのAd-Hoc Query画面にて、以下SQL文を入力します。   

```
CREATE EXTERNAL TABLE IF NOT EXISTS links_sql (
  movieId BIGINT,
  imdbId BIGINT,
  tmdbId BIGINT
) 
STORED BY 'com.aliyun.odps.CsvStorageHandler' 
WITH SERDEPROPERTIES (
  'odps.properties.rolearn'='acs:ram::5536281650763903:role/aliyunodpsdefaultrole',
  'odps.text.option.header.lines.count' = '1',
  'odps.text.option.delimiter'=',',
  'odps.text.option.encoding' = 'UTF-8'
) 
LOCATION 'oss://oss-ap-northeast-1-internal.aliyuncs.com/bigdata-dwh/csv/links/';

SELECT * FROM links_sql limit 5;
```

パラメータについて説明します。   
STORED BY 'com.aliyun.odps.CsvStorageHandler' 　は  CSVファイルを選定。   
  'odps.properties.rolearn'='acs:ram::5536281650763903:role/aliyunodpsdefaultrole', は自分のARM情報、   
  'odps.text.option.header.lines.count' = '1', は CSVファイル１行目がフィールド名なので、１行目をSkip     
  'odps.text.option.delimiter'=',',　はCSVファイルの区切り文字が「,」なので、','で区切り    
  'odps.text.option.encoding' = 'UTF-8' はCSVファイルがUTF-8なので UTF-8を指定   
LOCATION 'oss://oss-ap-northeast-1-internal.aliyuncs.com/bigdata-dwh/csv/links/';  はCSVファイルの場所    

その他、より詳しいパラメータ情報はこちらにて記載しています。   

> https://www.alibabacloud.com/cloud-tech/doc-detail/45389.htm


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305122953.png "img")

ちなみに裏技かは微妙ですが、先ほどの「link」テーブルでcommit済なら、そこからSQLクエリを参照・コピーすることもできます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305123311.png "img")


---

# 最後に
本記事では、OSSにあるCSVファイルをMaxCompute EXTERNAL Table（外部テーブル）として格納する方法を簡単に説明しました。     
この作業はノーコード・ローコードであり非常にシンプルなので、MaxComputeに対してクイックスタートしやすいです。    


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>




