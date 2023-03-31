---
title: "LogServiceでリアルタイムETL"
metaTitle: "LogServiceとHologres間のリアルタイムETLをする方法"
metaDescription: "LogServiceとHologres間のリアルタイムETLをする方法"
date: "2021-07-27"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/Hologres_images_26006613791223100/20210727201328.png"
---

## LogServiceとHologres間のリアルタイムETLをする方法

本記事では、[Hologres](https://www.alibabacloud.com/product/hologres) で、Log ServiceとHologres間のリアルタイムETLをする方法をご紹介します。        


# Hologresとは

> <span style="color: #ff0000"><i>Hologres はリアルタイムのインタラクティブ分析サービスです。高い同時実行性と低いレイテンシーでTB、PBクラスのデータの移動や分析を短時間で処理できます。PostgreSQL11と互換性があり、データを多次元で分析し、ビジネスインサイトを素早くキャッチすることができます。</i></span>

少し前になりますが、Hologresについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-hologres


# Log ServiceとHologres間のリアルタイムETLについて

このガイドラインでは、Log ServiceとHologres間のリアルタイムETLサービスを段階的に作成します。今回、Alibaba Cloud LogServiceとHologres、Object Storage Service (OSS)、Realtime Compute for Apache Flink（フルマネージド型Apache Flink）を使用します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727201328.png "img")



# このチュートリアルについて
## 対象者: 

本ガイドラインは、以下のような方を対象としています      
- Alibaba Cloud、Hologres、LogService、OSS（Object Storage Service）、Realtime Compute for Apache Flink（フルマネージド型Apache Flink）に関する基本的な知識を持っている       
   
## 前提条件:
- Alibaba Cloud のアカウントを所持している    
- Hologres、LogService、OSS（Object Storage Service）Realtime Compute for Apache Flink（フルマネージド型Apache Flink）が使用可能な状態になっている       
- 使用するHologres、LogService、OSS（Object Storage Service）Realtime Compute for Apache Flink（フルマネージド型Apache Flink）は同一Region配下にある      
- 少なくとも1つのHologresインスタンス、1つのOSS（Object Storage Service）bucket、Realtime Compute for Apache Flink（フルマネージド型Apache Flink）の2CUを持っている。    

# Hologresのnon-partitioned tableでの作業

Hologresのnon-partitioned tableを使ったリアルタイムETLサービスの手順は以下の通りです。    

## LogService（SLS）の準備

RealtimeCompute（フルマネージド型Apache Flink）では、LogServiceプロジェクトの logstore をソーステーブルとして動作します。     

`Web Tacking` を有効にした新規プロジェクトとlogstoreを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727203317.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727203326.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727203336.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727203403.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727203415.png "img")


LogService（SLS）では、複数の方法でデータのインポートをサポートしています。     
例として[WebTracking](https://www.alibabacloud.com/cloud-tech/doc-detail/31752.htm)を挙げます。      

> https://www.alibabacloud.com/cloud-tech/doc-detail/31752.htm


```
curl --request GET 'http://${project}.${host}/logstores/${logstore}/track? APIVersion=0.6.0&key1=val1&key2=val2'
```

続いて、Pythonスクリプトを使って、関連テストレコードを出力するようにします。    

```python
import random
import requests
import uuid

project = "<your project name>"
endpoint = "<your region endpoint>"
logstore = "<your logstore name>"
topic = "<your topic name>"
url = 'http://{0}.{1}/logstores/{2}/track?APIVersion=0.6.0&__topic__={3}&id={4}&name={5}&rating={6}'
for i in range(<your record counts>):
    res = requests.get(
        url.format(project, endpoint, logstore, topic, uuid.uuid1(), uuid.uuid1(), str(random.randint(1, 5))))
    print(res)

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204024.png "img")

対象となるLogStoreを入力し、インデックス属性を有効にします。       
今回は `id` 、`name` 、`rating`  の3つのインデックスがあります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204046.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204121.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204159.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204218.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204229.png "img")


データ生成スクリプトを実行すると、コンソールに関連するログが表示されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204249.png "img")


## Hologresの準備

HologresのHoloWebにて、`book_sls` テーブル を結果テーブルとして作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204306.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204316.png "img")

テーブルレコードを確認し、Flinkサービスの実行前に空になっていることを確認します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204330.png "img")


## Realtime Compute for Apache Flink（フルマネージド型Apache Flink）の準備

Realtime Compute for Apache Flink（フルマネージド型Apache Flink）のコンソールで「draft editor」ページに移動し、新しいストリームSQLタスクを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204348.png "img")


`schema` セクションに移動して、HologresとLog Serviceテーブル用のcreateステートメントを生成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204405.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727204418.png "img")


Taskでテーブルスキーマ、接続情報、Insertステートメント（SQL）を更新し確認します。     
詳細は、[LogService Source Table](https://www.alibabacloud.com/cloud-tech/doc-detail/176690.htm) および [Hologres Result Table](https://www.alibabacloud.com/cloud-tech/doc-detail/178795.htm) を参照してください。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/176690.htm

> https://www.alibabacloud.com/cloud-tech/doc-detail/178795.htm


```sql
CREATE TEMPORARY TABLE `sls_table_demo` (
  id                string,
  `name`            string,
  rating            string,
  `__topic__`       STRING METADATA VIRTUAL,
  `__source__`      STRING METADATA VIRTUAL,
  `__timestamp__`   BIGINT METADATA VIRTUAL
) with (
  'connector' = 'sls',
  'endpoint' = '<your log service endpoint>',
  'project' = '<your log service project name>',
  'logstore' = '<your log service logstore name>'
);

CREATE TEMPORARY TABLE `hologres_table_demo` (
  id                varchar,
  `name`            varchar,
  rating            varchar,
  sls_topic         varchar,
  sls_source        varchar,
  sls_timestamp     bigint
) with (
  'connector' = 'hologres',
  'dbname' = '<your Hologres database name>',
  'tablename' = '<your Hologres table name>',
  'username' = '<your access key id>',
  'password' = '<your access key secret>',
  'endpoint' = '<your Hologres instance access info>'
);

BEGIN STATEMENT SET;
INSERT INTO hologres_table_demo 
SELECT
    id, `name`, rating, `__topic__` as sls_topic, `__source__` as sls_source, `__timestamp__` as sls_timestamp
FROM sls_table_demo;
End;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205602.png "img")

## Flinkサービスとの連携

準備したStreamingSQLタスクを公開してから、ジョブを開始します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205626.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205636.png "img")

`Deployments` ページで公開されたタスクを確認し、タスクを開始します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205659.png "img")

もし、以下のような`SqlParseException` エラーが発生した場合は、Insertステートメント（SQL）文のカラムマッピングが原因です。    
ソーステーブルと結果テーブルのカラム名が一致しているか確認してください。同一でない場合は、Insert SQL文の中でエイリアスを使って更新してください。      

```
Failed to create the job graph for the job: 5fe48ce699684c55a5f702cbcae2485f (message = 36:1-36:5, Translating the JobGraph for this deployment failed before. Please delete the JobGraph before requesting a new translation.
Error message: Failed to translate a SQL Script into a JobGraph.
Cause: Could not parse SQL: Encountered "BEGIN" at line 36, column 1.
Was expecting one of:
    <EOF> 
    "LIKE" ...
    ";" ...
    .
	StackTrace: 
	org.apache.flink.table.api.SqlParserException: Could not parse SQL: Encountered "BEGIN" at line 36, column 1.
Was expecting one of:
    <EOF> 
    "LIKE" ...
    ";" ...
    
	at com.ververica.platform.sql.environment.VvpSqlParser.parse(VvpSqlParser.java:80)
	at com.ververica.platform.sql.entrypoint.SqlJobEntrypoint.executeInClassLoader(SqlJobEntrypoint.java:85)
	at com.ververica.platform.sql.entrypoint.SqlJobEntrypoint.lambda$execute$0(SqlJobEntrypoint.java:67)
	at com.ververica.platform.sql.classloader.ClassLoaderWrapper.execute(ClassLoaderWrapper.java:12)
	at com.ververica.platform.sql.entrypoint.SqlJobEntrypoint.execute(SqlJobEntrypoint.java:67)
	at com.ververica.platform.sql.entrypoint.SqlJobEntrypoint.main(SqlJobEntrypoint.java:54)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.base/java.lang.reflect.Method.invoke(Method.java:566)
	at org.apache.flink.client.program.PackagedProgram.callMainMethod(PackagedProgram.java:349)
	at org.apache.flink.client.program.PackagedProgram.invokeInteractiveModeForExecution(PackagedProgram.java:219)
	at org.apache.flink.client.program.PackagedProgramUtils.getPipelineFromProgram(PackagedProgramUtils.java:158)
	at org.apache.flink.client.deployment.application.ClassPathJobGraphRetriever.retrieveJobGraph(ClassPathJobGraphRetriever.java:84)
	at org.apache.flink.client.deployment.application.JobGraphTranslator.translateJobGraph(JobGraphTranslator.java:87)
	at org.apache.flink.client.deployment.application.JobGraphTranslationTask.run(JobGraphTranslationTask.java:89)
	at org.apache.flink.client.deployment.application.JobGraphTranslationTask.run(JobGraphTranslationTask.java:77)
	at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)
	at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)
	at java.base/java.lang.Thread.run(Thread.java:984)
Caused by: org.apache.calcite.sql.parser.SqlParseException: Encountered "BEGIN" at line 36, column 1.
Was expecting one of:
    <EOF> 
    "LIKE" ...
    ";" ...
    
	at org.apache.flink.sql.parser.impl.FlinkSqlParserImpl.convertException(FlinkSqlParserImpl.java:446)
	at org.apache.flink.sql.parser.impl.FlinkSqlParserImpl.normalizeException(FlinkSqlParserImpl.java:209)
	at org.apache.calcite.sql.parser.SqlParser.handleException(SqlParser.java:140)
	at org.apache.calcite.sql.parser.SqlParser.parseStmtList(SqlParser.java:195)
	at com.ververica.platform.sql.environment.VvpSqlParser.parse(VvpSqlParser.java:77)
	... 19 more
Caused by: org.apache.flink.sql.parser.impl.ParseException: Encountered "BEGIN" at line 36, column 1.
Was expecting one of:
    <EOF> 
    "LIKE" ...
    ";" ...
    
	at org.apache.flink.sql.parser.impl.FlinkSqlParserImpl.generateParseException(FlinkSqlParserImpl.java:40152)
	at org.apache.flink.sql.parser.impl.FlinkSqlParserImpl.jj_consume_token(FlinkSqlParserImpl.java:39963)
	at org.apache.flink.sql.parser.impl.FlinkSqlParserImpl.SqlStmtList(FlinkSqlParserImpl.java:3346)
	at org.apache.flink.sql.parser.impl.FlinkSqlParserImpl.parseSqlStmtList(FlinkSqlParserImpl.java:261)
	at org.apache.calcite.sql.parser.SqlParser.parseStmtList(SqlParser.java:193)
	... 20 more
)
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205722.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205734.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205745.png "img")


もし、LogService（SLS）やRAMによって拒否されたことを示す `LogException` が出る場合は、認証許可が原因です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205800.png "img")

RAMコンソールで他のプロダクトサービスにアクセスするためにRealtime Compute for Apache Flink（フルマネージド型Apache Flink）に使用される`AliyunStreamAsiDefaultRole`という名前の既存のロールを見つけ、必要な関連ポリシーを追加する必要があります。     
LogService（SLS）のアクセスポリシー (`AliyunLogReadOnlyAccess`)  を `AliyunStreamAsiDefaultRole` に追加する例として、次の手順を実行します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205811.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205820.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205830.png "img")


すべてがうまくいけば、ジョブは実行ステータスになり、データはHologresのnon-partitioned tableにリアルタイムで転送されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205849.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205900.png "img")

ここまで、LogService（SLS）とHologresのnon-partitioned table間のリアルタイムETLを実現しました。    

---

# Hologresのpartitioned tableでの作業

上記はnon-partitioned tableベースでの作業になりますが、今度はHologresのpartitioned tableを使ったリアルタイムETLサービスを構築します。手順は以下の通りです。    

Book対するユーザー評価を収集し、LogService（SLS）に送信するシステムがあるとします。
データにはbook_idのみが含まれ、book_nameなどの詳細情報はCSVファイルとしてOSS（Object Storage Service）のバケットで管理されます。    
Hologresテーブルはbook_idでパーティショニングされており、各Bookに基づいて迅速な統計を行うことができます。 データがHologresへリアルタイム転送されると、book_idに基づいてブックの詳細情報が同時に結合されます。      

## LogService（SLS）の準備

LogStoreを新規で作成します。このLogStoreはパーティション化されたテーブルの情報に一致する、インデックス属性情報を持ちます。      
まずは上記のステップと同様にWebTrackingが有効になっていることを確認します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205923.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205933.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727205943.png "img")


新しいインデックス属性に基づいてテストレコードを生成するPythonスクリプトを更新します。      

```python
import random
import requests
import uuid

project = "<your project name>"
endpoint = "<your region endpoint>"
logstore = "<your logstore name>"
topic = "<your topic name>"
url = 'http://{0}.{1}/logstores/{2}/track?APIVersion=0.6.0&__topic__={3}&id={4}&user_id={5}&rating={6}'
for i in range(<your record counts>):
    res = requests.get(
        url.format(project, endpoint, logstore, topic, str(random.randint(1, 9)), uuid.uuid1(), str(random.randint(1, 5))))
    print(res)
```

## Hologresの準備

Hologresでpartition tableを新規作成します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210003.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210013.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210023.png "img")


## OSS(Object Storage Service) の準備

OSS(Object Storage Service)のバケットに次のようなBook情報の入ったcsvファイルをアップロードします。

```csv
1,嫌われる勇気
2,ノルウェイの森
3,海辺のカフカ
4,色彩を持たない多崎つくると彼の巡礼の年
5,容疑者Ⅹの献身
6,人間失格
7,こころ
8,天声人語
9,幸せになる勇気
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210101.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210112.png "img")



## Realtime Compute for Apache Flink（フルマネージド型Apache Flink）の準備

Realtime Compute for Apache Flink（フルマネージド型Apache Flink）コンソールの`draft editor` ページに移動し、別のストリームSQLタスクを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210134.png "img")


`schema` セクションに移動して、再びHologresとLogService（SLS）テーブル用のcreateステートメントを生成します。     
HologresとLogService（SLS）テーブルの他に、もう一つ`filesystem`というテーブルを追加しなければなりません。これは、OSS(Object Storage Service)のバケットにあるCSVファイルを元にしたFileSystemディメンションテーブルに使用されます。     
Hologresの設定情報の中で、`partitionrouter`はパーティションテーブルにデータを書き込むかどうかを指定し、`createparttable`は存在しないパーティションテーブルを自動的に作成して、そこにパーティション値に基づいてデータを書き込むかどうかを指定します。両方とも「true」に設定すると、スクリプトは対象のテーブルをパーティショニングされたものと認識し、値（ここでは`book_id` ）に基づいて対象のパーティションテーブルを自動的に作成します。         
詳細は、[LogService Source Table](https://www.alibabacloud.com/cloud-tech/doc-detail/176690.htm) および [Hologres Result Table](https://www.alibabacloud.com/cloud-tech/doc-detail/178795.htm) 、[FileSystem Dimension Table](https://www.alibabacloud.com/cloud-tech/doc-detail/208021.htm)を参照してください。     


```sql
CREATE TEMPORARY TABLE `sls_table_demo_p` (
  id                string,
  `user_id`         string,
  rating            string,
  `__topic__`       STRING METADATA VIRTUAL,
  `__source__`      STRING METADATA VIRTUAL,
  `__timestamp__`   BIGINT METADATA VIRTUAL
) with (
  'connector' = 'sls',
  'endpoint' = '<your log service endpoint>',
  'project' = '<your log service project name>',
  'logstore' = '<your log service logstore name>'
);

CREATE TEMPORARY TABLE `hologres_table_demo_p` (
  id                varchar,
  `user_id`         varchar,
  `name`            varchar,
  rating            varchar,
  sls_topic         varchar,
  sls_source        varchar,
  sls_timestamp     bigint
) with (
  'connector' = 'hologres',
  'dbname' = '<your Hologres database name>',
  'tablename' = '<your Hologres table name>',
  'username' = '<your access key id>',
  'password' = '<your access key secret>',
  'endpoint' = '<your Hologres instance access info>',
  'partitionrouter' = 'true',
  'createparttable' = 'true'
);

CREATE TEMPORARY TABLE `oss_table_p` (
  id                varchar,
  `name`            varchar
) with (
  'connector' = 'filesystem',
  'path' = '<your csv path in OSS bucket>',
  'format' = 'csv'
);

BEGIN STATEMENT SET;
INSERT INTO hologres_table_demo_p 
SELECT
    s.id, s.`user_id`, o.`name`, s.rating, s.`__topic__` as sls_topic, s.`__source__` as sls_source, s.`__timestamp__` as sls_timestamp
FROM sls_table_demo_p AS s
JOIN oss_table_p FOR SYSTEM_TIME AS OF proctime() AS o
ON s.id = o.id;
End;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210150.png "img")


## Flinkサービスとの連携

パーティショニングされたテーブルのために、新しいcreate stream SQLタスクを開始します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210205.png "img")

ジョブを開始し、LogStoreにテストレコードを作成してから、実行結果を確認します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210221.png "img")


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210231.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727210251.png "img")


以上で、LogService（SLS）とOSS、Hologresのpartitioned table間のリアルタイムETLを実現しました。    

---

# 最後に

ここまで、LogService（SLS）とOSS、Realtime Compute for Apache Flink（フルマネージド型Apache Flink）を使ってHologres（partition付きテーブル、Non-partition）のリアルタイムETLをする方法を紹介しました。      
この方法を生かすことで、LogServiceからリアルタイムデータ収集した後に、Hologresでリアルタイム可視化を実現することができます。     





