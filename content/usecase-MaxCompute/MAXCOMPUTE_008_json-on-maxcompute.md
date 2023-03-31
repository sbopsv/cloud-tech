---
title: "JSONファイルをテーブルに格納"
metaTitle: "JSONファイルをMaxComputeの内部テーブルに格納する"
metaDescription: "JSONファイルをMaxComputeの内部テーブルに格納する"
date: "2021-03-12"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613699520700/20210314104120.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## JSONファイルをMaxComputeの内部テーブルに格納する

本記事では、JSONファイルをMaxComputeの内部テーブルに格納する方法について説明します。


# 前書き

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute


    

今回はAlibaba Cloud MaxComputeでJSONファイルを格納、SQL処理してみましょう。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210314104120.png "img")

今回は[Movielensというオープンデータ](https://grouplens.org/datasets/movielens/)をJSONへ変換して使います。    
注意として、MaxComputeはJSONデータを１つのString文字型として格納するため、JSONデータを少し加工する必要があります。   
具体的には以下の通り、 開始の "["  と 終了の"]" を除外、｛ ... ｝を1つのレコードとして格納するために、{ ... } , { ... } の間の"," を除去します。     
※少し奇妙かもしれないですが、[本家Apache Hiveも同じアプローチ](https://hive.apache.org/javadocs/r2.1.1/api/org/apache/hive/hcatalog/data/JsonSerDe.html)です。    

```
{"movieId": "1", "title": "Toy Story (1995)", "genres": "Adventure|Animation|Children|Comedy|Fantasy"}
{"movieId": "2", "title": "Jumanji (1995)", "genres": "Adventure|Children|Fantasy"}
{"movieId": "3", "title": "Grumpier Old Men (1995)", "genres": "Comedy|Romance"}
{"movieId": "4", "title": "Waiting to Exhale (1995)", "genres": "Comedy|Drama|Romance"}
{"movieId": "5", "title": "Father of the Bride Part II (1995)", "genres": "Comedy"}
{"movieId": "6", "title": "Heat (1995)", "genres": "Action|Crime|Thriller"}
{"movieId": "7", "title": "Sabrina (1995)", "genres": "Comedy|Romance"}
{"movieId": "8", "title": "Tom and Huck (1995)", "genres": "Adventure|Children"}
{"movieId": "9", "title": "Sudden Death (1995)", "genres": "Action"}
{"movieId": "10", "title": "GoldenEye (1995)", "genres": "Action|Adventure|Thriller"}
{"movieId": "11", "title": "American President, The (1995)", "genres": "Comedy|Drama|Romance"}
{"movieId": "12", "title": "Dracula: Dead and Loving It (1995)", "genres": "Comedy|Horror"}
{"movieId": "13", "title": "Balto (1995)", "genres": "Adventure|Animation|Children"}
{"movieId": "14", "title": "Nixon (1995)", "genres": "Drama"}
{"movieId": "15", "title": "Cutthroat Island (1995)", "genres": "Action|Adventure|Romance"}
{"movieId": "16", "title": "Casino (1995)", "genres": "Crime|Drama"}
{"movieId": "17", "title": "Sense and Sensibility (1995)", "genres": "Drama|Romance"}
{"movieId": "18", "title": "Four Rooms (1995)", "genres": "Comedy"}
{"movieId": "19", "title": "Ace Ventura: When Nature Calls (1995)", "genres": "Comedy"}
{"movieId": "20", "title": "Money Train (1995)", "genres": "Action|Comedy|Crime|Drama|Thriller"}
{"movieId": "21", "title": "Get Shorty (1995)", "genres": "Comedy|Crime|Thriller"}
{"movieId": "22", "title": "Copycat (1995)", "genres": "Crime|Drama|Horror|Mystery|Thriller"}
{"movieId": "23", "title": "Assassins (1995)", "genres": "Action|Crime|Thriller"}
{"movieId": "24", "title": "Powder (1995)", "genres": "Drama|Sci-Fi"}
{"movieId": "25", "title": "Leaving Las Vegas (1995)", "genres": "Drama|Romance"}
{"movieId": "26", "title": "Othello (1995)", "genres": "Drama"}
{"movieId": "27", "title": "Now and Then (1995)", "genres": "Children|Drama"}
{"movieId": "28", "title": "Persuasion (1995)", "genres": "Drama|Romance"}
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315132616.png "img")



---

# 共通作業（MaxCompute全体で共通事項）

## RAM ユーザー作成＆権限付与
もしMaxComputeを操作するユーザがRAMユーザーの場合は以下を実施してください。    

RAMより対象のユーザーを選定します。ユーザーが無い場合は新規作成します。 このときにAccessKey IDとAccessKey Secretをメモとして残してください。AccessKey IDとAccessKey SecretはDataWorks DataIntegrationの処理に必要となります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210305025953.png "img")

対象のユーザーには権限ロールとしてAliyunDataWorksFullAccessをアタッチします。 これはDataWorksを操作するためのFull権限です。    
DataWorks側にてユーザーごとに読み取り専用や一部プロジェクト・テーブルなどのきめ細かい権限付与ができますが、ここでは割愛します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210305025809.png "img")


## Workspace作成

MaxComputeを操作するためにはワークスペースおよびプロジェクトが必要なので新たに作成します。DataWorksコンソールから 「Create Project」を選択し、起動します。    
Modeは「Basic Mode（基本モード）」「と「Standard Mode（標準モード）」の２種類があります。ここは「Basic Mode（基本モード）」として選定します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210304212211.png "img")

続けて、MaxCompute を選定します。料金は初めて操作するなら Pay-As-You-Go（使った分だけ課金） が良いと思います。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210304220348.png "img")

MaxComputeに関する必要な情報を設定し、Workspaceを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210304220459.png "img")


---

# JSONファイルを MaxCompute Tableへ格納 （Tunnelを使用）
ここのチュートリアルは、JSONファイルをMaxComputeの内部テーブルへ格納する方法です。   　 
前回の記事：CSVファイルをMaxComputeの内部テーブルへ、、ではGUIベースで追加していたので、今回は[Tunnel](https://www.alibabacloud.com/cloud-tech/doc-detail/27833.htm)を使います。      

> https://www.alibabacloud.com/cloud-tech/doc-detail/27833.htm


## STEP1：データ格納
Workspace、Project作成直後は何もない状態と思います。    
なので、まずはDataWorks のHomepageへ移動し、データを格納する準備を進めます。   


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210304220751.png "img")


DataWorksのコンソール画面です。今回はTunnelを使うので、「DataStdio」をクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210304221122.png "img")


DataStdio画面です。最初は何もない状態です。そこからプラレールのように色々構築することが出来ます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210304232016.png "img")

## STEP2：JSONファイルを認識し、MaxCompute Tableに格納
メニューバーからworkflowを作成します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210304232146.png "img")

workflow名を入力し、「Create」ボタンで作成します。ここは「csv2maxcompute」というタイトルで登録します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210304232340.png "img")

workflow画面が出たら、メニューバーにて、緑色の「Table」から「Create Table」でテーブルを新規作成します。     
「csv2maxcompute」というワークフロー画面はタブより閉じても問題ありません。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210305031323.png "img")

`external_oss_table_json` という名前のテーブルを作成します。

Table名を入力して作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210314125032.png "img")


DataStdio画面です。最初は何もない状態です。この状態からJSONデータを登録してみます。       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210314125455.png "img")


JSONデータは１つのフィールドとして格納してから処理するので、「json_data」というフィールドを作成します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315134548.png "img")


Display/Nameを入力したら、Commitします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315134944.png "img")

## STEP2：JSONファイルをMaxCompute TableにUpload
JSONファイルをMaxComputeに格納します。Tunnelを使います。   
ファイルはTunnelが使えれば、ECSでもどこでも大丈夫です。今回、著者はローカルにJSONデータを保存しています。この状態から、tunnel コマンドでアップロードします。     

```
tunnel upload C:/Users/1200358/Desktop/ml-latest-small-master/movieslite.json oss_target_table_json -fd ";";
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315150211.png "img")


## STEP3：実行
DataWorks DataStdio画面に戻って、、TableにJSONデータが無事格納されたか確認しましょう。Ad-Hoc Query画面を開きます。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315135757.png "img")


Ad-Hoc Query用のノードを作成します。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315135850.png "img")


まずは、oss_target_table_jsonテーブルをそのまま表示してみます。　　　
```
select * from oss_target_table_json;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315145231.png "img")

このように、１つのフィールドにJSONファイルが格納されたことがわかります。    
これに対し、Selectサブクエリおよび`get_json_object`関数を使ってJSONデータを正しく表示します。   

```
SELECT * FROM (
    SELECT 
        get_json_object(json_data, '$.movieId') as movieId,
        get_json_object(json_data, '$.title') as title,
        get_json_object(json_data, '$.genres') as genres
    FROM oss_target_table_json
)
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315145526.png "img")


---

# JSONファイルを MaxCompute Tableへ格納 （OSSからSQLクエリを使用）

今度はOSSにあるJSONファイルをSQLクエリで格納してみましょう。 同じく、oss_target_table_jsonテーブルを使います。
先に`TRUNCATE TABLE`コマンドで、oss_target_table_jsonテーブルのデータを空にします。
※注意として、MaxComputeは「DELETE」をサポートしません。なので、全てのレコードを削除したい場合は、DELETEの代わりにTRUNCATE TABLEを入れて全てのレコードを削除します。   

```
TRUNCATE TABLE ratings;
```
> https://www.alibabacloud.com/cloud-tech/doc-detail/73768.htm

STEP1:  事前準備
OSSにて、JSONファイルを以下のどおりに格納します。   
OSSはbucket名`bigdata-dwh`、ディレクトリ（Object Name Prefix）は`json/`、jsonフォルダに対象のjsonファイルを格納しています。    

> <span style="color: #ff0000"><i>注意点として、MaxComputeでLOAD OVERWRITE TABLEによるSQLでのテーブル格納時は、対象のjsonファイルをディレクトリ単位で管理する必要があります。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315151823.png "img")

RAMロール画面を開いて、`AliyunODPSDefaultRole`を検索します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315152135.png "img")

RAMロールから`AliyunODPSDefaultRole`のARNをコピーします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315152214.png "img")


STEP2: SQLクエリで格納
上記、準備が完了したら、DataWorks DataStdioのAd-Hock Query画面にて、以下SQLクエリを入力します。   

```
LOAD OVERWRITE TABLE hands_on_workspace.oss_target_table_json 
FROM 
LOCATION 'oss://<Access key ID>:<AccessKey Secret>@oss-apnortheast-1.aliyuncs.com/bigdata-dwh/json/'
ROW FORMAT SERDE 'org.apache.hive.hcatalog.data.JsonSerDe'
WITH WITH SERDEPROPERTIES (
    'odps.properties.rolearn' = 'acs:ram::5536281650763903:role/aliyunodpsdefaultrole'
)
STORED AS TEXTFILE;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315153431.png "img")


## STEP3：完了
Tableが無事格納できたと思うので、確認します。   
先ほどと同じように、Selectサブクエリおよび`get_json_object`関数を使ってJSONデータを正しく表示します。   

```
SELECT * FROM (
    SELECT 
        get_json_object(json_data, '$.movieId') as movieId,
        get_json_object(json_data, '$.title') as title,
        get_json_object(json_data, '$.genres') as genres
    FROM oss_target_table_json
)
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210315153714.png "img")

これでJSONファイルが正しく表示されてることが確認できました。     

---

# 最後に
本記事では、JSONファイルをMaxCompute Tableとして格納する方法を簡単に説明しました。     


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>



