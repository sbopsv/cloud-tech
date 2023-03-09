---
title: "HDFS_Parquetを外部テーブルへ"
metaTitle: "HDFS_ParquetファイルをMaxComputeの外部テーブルとして処理する（外部テーブル・partitionつき）"
metaDescription: "HDFS_ParquetファイルをMaxComputeの外部テーブルとして処理する（外部テーブル・partitionつき）"
date: "2021-03-16"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613674380700/20210315194025.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## HDFS_ParquetファイルをMaxComputeの外部テーブルとして処理する（外部テーブル・partitionつき）

本記事では、HDFS_ParquetファイルをMaxComputeの外部テーブルとして処理する方法について説明します。

# 前書き

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute


今回はAlibaba Cloud MaxComputeでHDFS_Parquet（partition付き）を外部テーブルとして格納、SQL処理してみましょう。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315194025.png "img")


今回は、別記事で紹介している、「LogServiceでTwitterデータを収集したあと、LogSeriviceからOSS LogShipperで生成されたParquetファイル」を使います。   
LogServiceからOSSへLogShipper設定方法は以下の通り、コンソールを操作するだけです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315194753.png "img")


> https://www.alibabacloud.com/cloud-tech/doc-detail/29002.htm

> https://www.alibabacloud.com/cloud-tech/doc-detail/52798.htm



OSSフォルダはこのような感じになります。   
partitionが「%Y/%m/%d/%H/%M」なので、 year、month、day、hourlyで区切りとなります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315193232.png "img")

> https://www.alibabacloud.com/cloud-tech/doc-detail/29002.htm

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315195333.png "img")

前置きが長くなりましたが、この状態から、MaxComputeでOSSにあるParquetデータを外部テーブルとして処理します。    



# 共通作業（MaxCompute全体で共通事項）

## RAM ユーザー作成＆権限付与
もしMaxComputeを操作するユーザがRAMユーザーの場合は以下を実施してください。    

RAMより対象のユーザーを選定します。ユーザーが無い場合は新規作成します。 このときにAccessKey IDとAccessKey Secretをメモとして残してください。AccessKey IDとAccessKey SecretはDataWorks DataIntegrationの処理に必要となります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210305025953.png "img")

対象のユーザーには権限ロールとしてAliyunDataWorksFullAccessをアタッチします。 これはDataWorksを操作するためのFull権限です。    
DataWorks側にてユーザーごとに読み取り専用や一部プロジェクト・テーブルなどのきめ細かい権限付与ができますが、ここでは割愛します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210305025809.png "img")


## Workspace作成

MaxComputeを操作するためにはワークスペースおよびプロジェクトが必要なので新たに作成します。DataWorksコンソールから 「Create Project」を選択し、起動します。    
Modeは「Basic Mode（基本モード）」「と「Standard Mode（標準モード）」の２種類があります。ここは「Basic Mode（基本モード）」として選定します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210304212211.png "img")

続けて、MaxCompute を選定します。料金は初めて操作するなら Pay-As-You-Go（使った分だけ課金） が良いと思います。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210304220348.png "img")

MaxComputeに関する必要な情報を設定し、Workspaceを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210304220459.png "img")


---



## STEP1：データ格納ことDataIntegration、、、はSkipします。
DataIntegrationは異種データソース間でデータを同期するプロセスです。しかし今回はOSSにあるCSVファイルを外部テーブルとして利用するため、この手順はSkipとなります。    

DataWorks でまずは DataStdioへ遷移します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210304231934.png "img")

DataStdio画面です。最初は何もない状態です。そこからプラレールのように色々構築することが出来ます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210304232016.png "img")

## STEP2：JSONファイルを認識し、MaxCompute Tableに格納
メニューバーからworkflowを作成します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210304232146.png "img")

workflow名を入力し、「Create」ボタンで作成します。ここは「csv2maxcompute」というタイトルで登録します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210304232340.png "img")

workflow画面が出たら、メニューバーにて、緑色の「Table」から「Create Table」でテーブルを新規作成します。     
「csv2maxcompute」というワークフロー画面はタブより閉じても問題ありません。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210305031323.png "img")

`External_oss_table_parquet` という名前のテーブルを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315201419.png "img")

こんな感じになります。そこから外部データと連携してテーブルを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315201447.png "img")

まずはExternal Tableをクリックします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315161318.png "img")

MaxCompute/DataWorksとして、今操作しているNodeでOSSのデータ操作ができるよう、Nodeに対しRAM Role権限 `AliyunODPSDefaultRole` を付与します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210305031928.png "img")

先ほどのDataStdio画面に戻って、今度はフォルダパスを選定します。    
OSSのパスで対象のParquetファイルのあるフォルダで、partitionが見える段階まで深掘りでクリックします。選定できたらOKを押します。   
今回はこのパス`oss://oss-ap-northeast-1-internal.aliyuncs.com/realtime-analytics-test-ohara/hdfs/parquet/` に設定しています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315201956.png "img")

RAMロールから`AliyunODPSDefaultRole`のARNをコピーし、rolearnにペーストします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315152214.png "img")

File FormatをPARQUETに選定します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315202237.png "img")

今回はpartitionファイルなので、Partitioned Table　をクリックします。すると、Partition Field Name一覧が表示されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315202535.png "img")


今回、LogServiceのOSS Shipperとしてpartitionの構成を ` %Y/%m/%d/%H/%M` として入力しているので、以下の構成でpartitionを設定します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315224335.png "img")



フィールド名を入力します。
今回は以下の構成でOSSへ格納しているので、これをベースにフィールドを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315222728.png "img")



parquetでフィールド構成が不明な場合は、[ParquetViewer](https://github.com/mukunku/ParquetViewer/releases)を使って確認すると良いです。インストール不要です。   

> https://github.com/mukunku/ParquetViewer/releases


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315222939.png "img")



上にある[ DDL Statement] からSQLでフィールドを作ります。下段にある[Create Field]などのボタンで手動でフィールド作成もできます。   

```
CREATE TABLE IF NOT EXISTS External_oss_table_parquet(
  logservice_source String,
  logservice_topic String,
  logservice_time String,
  created_at String,
  created_at_utc String,
  id_str String,
  Web String,
  Android String,
  iPhone String,
  text String,
  source String,
  tweet_size String
) 
```

フィールド名も見れるようになりました。最後に「Time-to-Live（TTL）」のチェックを外し、Display名を入力します。今回は「links_display」と入れます。        
これで設定は完了です。 [Commit to Production Environment] をクリックし、実行します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315224255.png "img")

Talbeを本番環境にコミットしますか？と警告メッセージがでます。ここはOKを押します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210305034411.png "img")


## STEP3：partition認識

これで無事コミットが完了したら、今度はSQLで操作、確認します。今回はAd Hoc Queryを使います。   
メニューバーでAd Hoc Query →新規作成 → ODPS SQL  を選定します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315205821.png "img")

Node Nameは「check_parquet」、Locationは「Ad-Hoc Query」で、Ad-Hoc Query画面を開きます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315210018.png "img")

先ほど作成したexternal_oss_table_parquetテーブルは現在partitionが無い状態だとおもうので、partitionを識別する前にテーブルプロパティで情報を確認します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315210401.png "img")

現在、PartitionsはNo Data、何もない状態ということがわかります。   
この状態からAd-Hoc Queryを使ってPartitionを識別します。    

```
MSCK REPAIR TABLE external_oss_table_parquet;
```

その結果、Log側でもpartitionが認識されています。テーブルプロパティ側でも認識することが出来たらOKです。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315211840.png "img")

## STEP4：完了

あとはpartitionを指定しながらSQLクエリを回すだけです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315231911.png "img")


----
# 参考

Partition で次のようなケース `sale_date=20200921/region=Japan` の場合、以下の通りに設定することができます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315232236.png "img")

DataStdio でpartitionは以下設定し、コミットします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315232349.png "img")

上記と同様、partitionを認識するSQLクエリ ` MSCK REPAIR TABLE ～; ` を実行することで、テーブルプロパティでもpartitionが認識されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315232538.png "img")

あとはSQLクエリでpartitionを認識しながら実行することで、テーブルが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315232708.png "img")


---

# 最後に
本記事では、OSSにあるHDFS_Parquetファイル（partition付き）をMaxCompute EXTERNAL Table（外部テーブル）として格納する方法を簡単に説明しました。     
LogServiceでデータ収集後、LogShipperでOSSへpartition付きデータとして出力されるので、これをうまく連携できれば誰でもDWHが簡単に構築できます。   


最後までお読みいただきありがとうございました。     


参考:

[Partition samples](https://www.alibabacloud.com/cloud-tech/doc-detail/27898.html)
> https://www.alibabacloud.com/cloud-tech/doc-detail/27898.html

[Partition and column operations](https://www.alibabacloud.com/cloud-tech/doc-detail/73771.html)
> https://www.alibabacloud.com/cloud-tech/doc-detail/73771.html


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>



