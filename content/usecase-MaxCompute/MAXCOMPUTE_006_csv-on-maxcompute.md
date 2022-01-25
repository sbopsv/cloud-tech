---
title: "CSVファイルをテーブルに格納"
metaTitle: "CSVファイルをMaxComputeの内部テーブルに格納する"
metaDescription: "CSVファイルをMaxComputeの内部テーブルに格納する"
date: "2021-03-10"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613674379900/20210305024831.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## CSVファイルをMaxComputeの内部テーブルに格納する

本記事では、MaxComputeでCSVファイルを格納、SQL処理する方法を説明します。


# 前書き

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute


    

今回はAlibaba Cloud MaxComputeでCSVファイルを格納、SQL処理してみましょう。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305024831.png "img")


今回は[Movielensというオープンデータ](https://grouplens.org/datasets/movielens/)を使いました。   
OSSはbucket名`bigdata-dwh`、ディレクトリ名（Object Name Prefix）は`CSV/`、CSV配下に以下のCSVファイルを格納しています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305024536.png "img")



---

# 共通作業（MaxCompute全体で共通事項）

## RAM ユーザー作成＆権限付与
もしMaxComputeを操作するユーザがRAMユーザーの場合は以下を実施してください。    

RAMより対象のユーザーを選定します。ユーザーが無い場合は新規作成します。 このときにAccessKey IDとAccessKey Secretをメモとして残してください。AccessKey IDとAccessKey SecretはDataWorks DataIntegrationの処理に必要となります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305025953.png "img")

対象のユーザーには権限ロールとしてAliyunDataWorksFullAccessをアタッチします。 これはDataWorksを操作するためのFull権限です。    
DataWorks側にてユーザーごとに読み取り専用や一部プロジェクト・テーブルなどのきめ細かい権限付与ができますが、ここでは割愛します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305025809.png "img")


## Workspace作成

MaxComputeを操作するためにはワークスペースおよびプロジェクトが必要なので新たに作成します。DataWorksコンソールから 「Create Project」を選択し、起動します。    
Modeは「Basic Mode（基本モード）」「と「Standard Mode（標準モード）」の２種類があります。ここは「Basic Mode（基本モード）」として選定します。   
  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304212211.png "img")

続けて、MaxCompute を選定します。料金は初めて操作するなら Pay-As-You-Go（使った分だけ課金） が良いと思います。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304220348.png "img")

MaxComputeに関する必要な情報を設定し、Workspaceを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304220459.png "img")


---

# CSVファイルを MaxCompute Tableへ格納
ここのチュートリアルは、CSVファイルをMaxComputeの内部テーブルへ格納する方法です。   　 

## STEP1：データ格納
Workspace、Project作成直後は何もない状態と思います。    
なので、まずはDataWorks のHomepageへ移動し、データを格納する準備を進めます。   


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304220751.png "img")


DataWorksのコンソール画面です。まずは「Data Integration」をクリックします。   


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304221122.png "img")


DataWorks DataIntegration画面に遷移します。今回、OSSにCSVファイルがあるため、それをソースとして設定するためにData Stores をクリックします。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304222952.png "img")


「New Data Source」をクリックし、データソースを選定します。   


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304223231.png "img")


今回はOSSがデータソースなので、OSSを選定します。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304223432.png "img")


ここで、OSSに関する必要な情報入力画面が出ます。  
End Pointはここから選定できます。今回は日本リージョンなので、`https://oss-ap-northeast-1.aliyuncs.com`を入力します。リージョン情報はここから選定できます。   
> https://www.alibabacloud.com/cloud-tech/doc-detail/31837.htm

Bucket情報を入力します。OSS接続先が目的なのでBucket名だけで問題ないです。   
AccessKey IDとAccessKey Secretを入力します。    
色々入力が終わったら「Test connectivity」をクリックして、接続が出来ていることを確認します。接続が出来ていれば、Completeをクリックし、接続設定ウィザードを完了します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304224810.png "img")

その後はData Source にて、OSSが無事登録できていることを確認できたらOKです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304231819.png "img")

次はDataStdio画面へ遷移します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304231934.png "img")

DataStdio画面です。最初は何もない状態です。そこからプラレールのように色々構築することが出来ます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304232016.png "img")

## STEP2：CSVファイルを認識し、MaxCompute Tableに格納
メニューバーからworkflowを作成します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304232146.png "img")

workflow名を入力し、「Create」ボタンで作成します。ここは「csv2maxcompute」というタイトルで登録します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304232340.png "img")

workflow画面が出たら、オレンジ色の「Batch Synchronization」をDrag & Drop で移動させます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304232641.png "img")

Drag ＆Drop後、Create Node作成ウィザードが表示されます。ここで新たに作成したいNodeの名前を入力します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304232823.png "img")

オレンジ色のNodeで名前を登録後、右クリックで「Open Node」を選定します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304233013.png "img")

このような編集画面が出てきます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304233150.png "img")

諸元となるデータソースを設定します。connectionタブで「OSS」を選定すると、先ほどDataIntegrationで登録した「csv_sample」が表示されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304233821.png "img")

Object Name Prefixにて`csv/ratings.csv` を入力します。   
今回のcsvファイルには1行目にフィールド名があるため、「Include Header」で`Yes`を選定します。  
csvファイル自体圧縮していないので、Compression Formatは「None」と選定します。   

「Preview」をクリックし、CSVファイルの構成を確認することができます。    
ここで入力情報で間違ってなかったら「OK」ボタンをクリックすることで、フィールド一覧が自動認識されます。    
今はターゲットソースの情報がないので、何も表示されていませんが、コンソール内部では認識されている状態になっています。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304234441.png "img")

今度はTarget でソース設定情報を登録します。今回はMaxComputeなので、「ODPS」を選定します。ODPSはMaxComputeの昔の名称です。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304234730.png "img")

今回新しくMaxCompute Projectを作成したため、当然データがない状態です。
なので、SQLを使ってデータを登録します。

```
CREATE TABLE IF NOT EXISTS ratings (
  userid INT, 
  movieid INT,
  rating INT, 
  tstamp STRING
) 
COMMENT 'movielen ratings table'
lifecycle 36500;
```
COMMENT は、名前通りコメントです。不要ならスキップ（空白）しても問題ないです。   
lifecycle は、名前通り、tableのライフサイクルです。この数値（日）を経過したテーブルは自動削除されます。これをうまく使って一時テーブルの削除などストレージコストを節約できればと思います。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210304235928.png "img")

SQLでテーブル作成が無事完了すると、「02 Mappings」の画面でフィールド選定が出ます。ここで諸元ソースと、ターゲットで同じフィールドであるかMappingsの設定を合わせます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305000113.png "img")

これでデータ同期の設定完了です。メニューバーのところにある上書き保存のアイコンをクリックして上書き保存します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305000336.png "img")

参考として、ここにある「03 Channel」で数点補足します。  
Expected Maximum Concurrency・・・最大同時実行数。ソースからターゲットへデータを転送するスレッド最大数です。
Bandwidth Throttling・・・帯域数。諸元データの容量次第では帯域を増やしたほうがベストです。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305000447.png "img")



## STEP3：実行
先ほどの上書き保存のアイコンの隣にある、実行ボタンをクリックします。以降、データ同期処理としてRuntiume Log画面で 長いLogが出ますが、このタスクが完了するのを待ちます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305001632.png "img")

ここでResource Groupについて説明します。   
Resource GroupはDataWorksで今回のようなタスク処理に必要なリソースを選定することが出来ます。    
Resource は共有リソースグループ（shared resource groups）、専用リソースグループ（exclusive resource groups）、カスタムリソースグループ（custom resource groups）の３種類があります。共有リソースグループは無料枠ですが、同リージョン配下で他のアカウント：DataWorksを使っているユーザリソースを含め処理されるため、少ないタスク・あるいは少数のノードが実行されるシナリオに向いています。処理を最大化したい場合は、有料となる専用リソースグループか、カスタムリソースグループを選定すると良いです。カスタムリソースグループはData IntegrationとShell Nodeのみに特化したリソースグループです。        

> https://www.alibabacloud.com/cloud-tech/doc-detail/158096.htm



## STEP4：完了

先ほどのworkflowのTabをクリックし、画面を切り替えます。
workflowで、オレンジ色のDI（DataIntegration）で先ほど設定完了したので、今度は緑色のODPS SQL をDrag ＆DropでNodeを作成します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305010615.png "img")

「Run_SQL」という名前にします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305010754.png "img")

緑色のところを右クリックで、Open Nodeを選定し、SQLクエリ編集画面を開きます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305010829.png "img")


レコード件数を集計するSQLクエリを作成し、上書き保存したら、実行ボタンをクリックしてSQLクエリを実行します。

```
SELECT Count(*) as record from ratings;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305011127.png "img")

SQLクエリの実行コストらお金が出ます。（PAYGのみ）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305011233.png "img")

実行結果としてレコード数が無事表示されました。これで以上です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305011349.png "img")

## 補足
上記 DataIntegratinとしての「実行」およびSQLクエリとしての「実行」。これらを連続で実行処理するのが面倒な場合は、workflowを使います。  
workflow画面にて、Drag ＆Dropで処理順ごとにラインを作成します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305012315.png "img")


※注意として、MaxComputeは「DELETE」をサポートしません。なので、全てのレコードを削除したい場合は、DELETEの代わりにTRUNCATE TABLEを入れて全てのレコードを削除します。   

```
TRUNCATE TABLE ratings;
```
> https://www.alibabacloud.com/cloud-tech/doc-detail/73768.htm

ワークフロー、処理の順番が完成したら、Runボタンをクリックして実行します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305012413.png "img")

処理の過程はNodeを右クリック → View Logを選定するとLogが見れます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305012544.png "img")

今度はRun_SQL Node を右クリックし、View Logを選定すると、SQLクエリ結果が出力されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305013453.png "img")


このようにして、DataIntegrationやSQL、Shell、Python、Job、レポート作成などなどの処理が多い場合はworkflowを使って、プラレールのように好きにワークフローを作成すると良いです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305023900.png "img")

---

# 最後に
本記事では、OSSにあるCSVファイルをMaxCompute Tableとして格納する方法を簡単に説明しました。     
この作業はノーコード・ローコードであり非常にシンプルなので、MaxComputeに対してクイックスタートしやすいです。    


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


