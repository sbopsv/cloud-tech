---
title: "JSONファイルを外部テーブルへ"
metaTitle: "JSONファイルをMaxComputeの外部テーブルとして処理する"
metaDescription: "JSONファイルをMaxComputeの外部テーブルとして処理する"
date: "2021-03-15"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613699520900/20210315154903.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## JSONファイルをMaxComputeの外部テーブルとして処理する

本記事では、JSONファイルをMaxComputeの外部テーブルとして処理する方法について説明します。


# 前書き

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute

    

今回はAlibaba Cloud MaxComputeでJSONファイルを格納、SQL処理してみましょう。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315154903.png "img")

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
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315132616.png "img")


このJSONファイルを
OSSはbucket名`bigdata-dwh`、ディレクトリ（Object Name Prefix）は`json/`、jsonフォルダに対象のjsonファイルを格納しています。    

> <span style="color: #ff0000"><i>注意点として、MaxComputeでExternal Tableこと外部テーブルを利用する際は、対象のjsonファイルをディレクトリ単位で管理する必要があります。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315151823.png "img")




---

# 共通作業（MaxCompute全体で共通事項）

## RAM ユーザー作成＆権限付与
もしMaxComputeを操作するユーザがRAMユーザーの場合は以下を実施してください。    

RAMより対象のユーザーを選定します。ユーザーが無い場合は新規作成します。 このときにAccessKey IDとAccessKey Secretをメモとして残してください。AccessKey IDとAccessKey SecretはDataWorks DataIntegrationの処理に必要となります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210305025953.png "img")

対象のユーザーには権限ロールとしてAliyunDataWorksFullAccessをアタッチします。 これはDataWorksを操作するためのFull権限です。    
DataWorks側にてユーザーごとに読み取り専用や一部プロジェクト・テーブルなどのきめ細かい権限付与ができますが、ここでは割愛します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210305025809.png "img")


## Workspace作成

MaxComputeを操作するためにはワークスペースおよびプロジェクトが必要なので新たに作成します。DataWorksコンソールから 「Create Project」を選択し、起動します。    
Modeは「Basic Mode（基本モード）」「と「Standard Mode（標準モード）」の２種類があります。ここは「Basic Mode（基本モード）」として選定します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210304212211.png "img")

続けて、MaxCompute を選定します。料金は初めて操作するなら Pay-As-You-Go（使った分だけ課金） が良いと思います。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210304220348.png "img")

MaxComputeに関する必要な情報を設定し、Workspaceを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210304220459.png "img")


---

# JSONファイルを MaxCompute External Table（外部テーブル）として処理
ここのチュートリアルは、JSONファイルをMaxComputeのExternal Table（外部テーブル）として処理する方法です。       　 
CSVファイルをMaxComputeのExternal Table（外部テーブル）として処理する方法と似ています。    


## STEP1：データ格納ことDataIntegration、、、はSkipします。
DataIntegrationは異種データソース間でデータを同期するプロセスです。しかし今回はOSSにあるCSVファイルを外部テーブルとして利用するため、この手順はSkipとなります。    

DataWorks でまずは DataStdioへ遷移します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210304231934.png "img")

DataStdio画面です。最初は何もない状態です。そこからプラレールのように色々構築することが出来ます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210304232016.png "img")

## STEP2：JSONファイルを認識し、MaxCompute Tableに格納
メニューバーからworkflowを作成します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210304232146.png "img")

workflow名を入力し、「Create」ボタンで作成します。ここは「csv2maxcompute」というタイトルで登録します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210304232340.png "img")

workflow画面が出たら、メニューバーにて、緑色の「Table」から「Create Table」でテーブルを新規作成します。     
「csv2maxcompute」というワークフロー画面はタブより閉じても問題ありません。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210305031323.png "img")

`External_oss_table_json` という名前のテーブルを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315160721.png "img")

こんな感じになります。そこから外部データと連携してテーブルを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315161248.png "img")

まずはExternal Tableをクリックします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315161318.png "img")

MaxCompute/DataWorksとして、今操作しているNodeでOSSのデータ操作ができるよう、Nodeに対しRAM Role権限 `AliyunODPSDefaultRole` を付与します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210305031928.png "img")

先ほどのDataStdio画面に戻って、、今度はフォルダパスを選定します。    
OSSのパスで対象のJSONファイルのあるフォルダを選定できるまで深掘りでクリックします。選定できたらOKを押します。   
今回はこのパス`oss://oss-ap-northeast-1-internal.aliyuncs.com/bigdata-dwh/json/` に設定しています。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315162104.png "img")

ここで、OSSがMaxComputeに対する権限をアタッチするために、別のTabでRAMメニューを開きます。    
RAMメニューにて、RAM Rolesページを開いたら、`AliyunODPSDefaultRole`を入力して そのロールの編集画面を開きます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210305032802.png "img")

今回、RAMロールの中で、赤線のARM情報が必要だったのでコピーします。     
これはAlibabaCloudアカウントごとに番号が異なるので、各自確認のうえコピペしてください。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210305032911.png "img")

rolearn　にて貼り付けます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315162216.png "img")


上にある[ DDL Statement] からSQLでフィールドを作ります。下段にある[Create Field]などのボタンで手動でフィールド作成もできます。   

```
CREATE TABLE IF NOT EXISTS External_oss_table_json(
  movieId BIGINT,
  title String,
  genres String
) 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315162447.png "img")


フィールド名も見れるようになりました。最後にDisplay名を入力します。今回は「links_display」と入れます。   
これで設定は完了です。 [Commit to Production Environment] をクリックし、実行します。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315162639.png "img")


Talbeを本番環境にコミットしますか？と警告メッセージがでます。ここはOKを押します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210305034411.png "img")


## STEP4：完了

これで無事コミットが完了したら、今度はSQLで確認します。今回はAd Hoc Queryを使います。   
メニューバーでAd Hoc Query →新規作成 → ODPS SQL  を選定します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315162915.png "img")

Node Nameは「check_json」、Locationは「Ad-Hoc Query」で、Ad-Hoc Query画面を開きます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210305121851.png "img")

SQLクエリを入力し、実行します。   
これでテーブルがあることを確認できました。    

```
SELECT * FROM External_oss_table_json;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315163423.png "img")


---

# 最後に
本記事では、OSSにあるJSONファイルをMaxCompute EXTERNAL Table（外部テーブル）として格納する方法を簡単に説明しました。     


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


