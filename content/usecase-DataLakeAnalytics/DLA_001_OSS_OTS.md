---
title: "Table Store/OSS連携"
metaTitle: "Data Lake Analyticsを利用したTable StoreおよびObject Storage Serviceのデータ参照 [ DLA + OTS + OSS ]"
metaDescription: "Data Lake Analyticsを利用したTable StoreおよびObject Storage Serviceのデータ参照 [ DLA + OTS + OSS ]"
date: "2020-06-26"
author: "SBC engineer blog"
thumbnail: "/DataAnalytics_images_26006613585463700/20200623175024.png"
---

## Data Lake AnalyticsでTable StoreとOSSを分析する


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200722145331.png "img")

本記事では、Data Lake AnalyticsでTable StoreとOSSを分析する方法をご紹介します。


# はじめに
## Data Lake Analyticsについて
Data Lake Analytics（DLA）は、サーバーレスの対話型クエリおよび分析サービスです。    
    
■以下の特徴を持っています。    

*  <b><span style="color: #ff0000">・サーバーレスアーキテクチャ</span></b>    
    * メンテナンスを不要とし、弾力的なスケーリングと透過的なアップグレードをサポート    
* <b><span style="color: #ff0000">・標準SQLインターフェースを提供</span></b>
    * 標準的なJDBC（Java Database Connectivity）とODBC（Open Database Connectivity）の技術を採用
* <b><span style="color: #ff0000">・複数のデータソースにまたがる関連性を分析</span></b>
    * Object Storage Service、TableStore、AnalyticDB、RDS（MySQL、PostgresSQL、SQL Server用）、Redis、MongoDB、PolarDBなどの複数のデータソースにまたがる関連性分析をサポート    
* <b><span style="color: #ff0000">・高性能な分析エンジン</span></b>
    * 新世代解析エンジンXIHEを活用し、MPP（Massive Parallel Processing）とDAG（Directed Acyclic Graph）技術を適用して高圧縮率、高スケーラビリティ、高可用性を実現    
* <b><span style="color: #ff0000">・BIツール連携</span></b>
    * Quick BIやDataVなどのBIツールとの連携をサポート
* <b><span style="color: #ff0000">・コストの柔軟性</span></b>
    * 利用料金はスキャンするデータ量に基づいて課金
    
   
          
本ブログでは以下の機能を実際に使用してご紹介します。      
・標準SQLインターフェースを提供      
・複数のデータソース（本ブログでは例としてObject Storage ServiceとTable Storeを使用）にまたがる関連性を分析      

以下の工程でご紹介していきます。    
・Table Storeにテーブルを作成    
・Object Storage ServiceにCSVをアップロード    
・Data Management ServiceでTable Storeテーブルのスキーマを作成    
・Data Management ServiceでTable Storeテーブルの外部テーブルを作成     
・Data Lake Analyticsでテーブル結合を確認（Table Storeの異なるテーブルを結合）     
・Data Management ServiceでCSVのスキーマを作成      
・Data Management ServiceでCSVの外部テーブルを作成      
・Data Lake Analyticsでテーブル結合を確認（Table StoreのテーブルおよびObject Storage ServiceのCSVを結合）      
・Data Lake Analyticsでクエリ結果をエクスポート      
    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623175024.png "img")


# 環境
## Table Store

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200622141255.png "img")
     
### Table Storeにテーブルを作成
まずはData Lake Analyticsで参照するデータをTable Storeで用意します。

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/55212.htm


#### 参照用テーブル001の作成
##### テーブル定義の作成（参照用テーブル001）

以下のテーブル定義を作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200625154005.png "img")
     
     
##### テーブルへのデータ挿入（参照用テーブル001）
以下のテストデータをテーブルに挿入します。    

|timeStamp|messageId|deviceName|rawMessage|
|---|---|---|---|
|2020-06-16 12:00:00|0000000000000000001|dev_001|dev_001@test@001|
|2020-06-16 12:01:00|0000000000000000002|dev_002|dev_002@test@001|
|2020-06-16 12:02:00|0000000000000000003|dev_003|dev_003@test@001|


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200622155101.png "img")
     
     
#### 参照用テーブル002の作成
##### テーブル定義の作成（参照用テーブル002）
以下のテーブル定義を作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200625153941.png "img")
     
     
##### テーブルへのデータ挿入（参照用テーブル002）
以下のテストデータをテーブルに挿入します。    


|timeStamp|messageId|deviceName|state|message|
|---|---|---|---|---|
|2020-06-16 12:00:00|0000000000000000001|dev_001|info|システムが再起動しました。|
|2020-06-16 12:01:00|0000000000000000002|dev_002|warn|xxへの接続がタイムアウトしました。|
|2020-06-16 12:02:00|0000000000000000003|dev_003|error|システムが異常終了しました。|

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200622155135.png "img")


## Object Storage Service（OSS）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200622141314.png "img")
     
### バケットとディレクトリの作成
Data Lake Analyticsで参照するデータをObject Storage Serviceで用意します。    
Data Lake Analyticsで参照可能なファイルはCSV、JSON、TSV、Parquet、ORC、RCFile、Avroなど多岐に渡ります。


> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/109606.htm


その中で今回はCSVを使用します。    
    
参照するCSVを格納するディレクトリとそのディレクトリを内包するバケットを作成します。    
今回は以下の階層としました。    
    
OSSプロダクト    
　└バケット名    
　　└ ディレクトリ名    
　　　└ CSVファイル    
    
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200622172830.png "img")
     
### CSVファイルのアップロード
以下のテストデータが含まれたCSVをOSSにアップロードします。

```
deviceName,user,address
dev_001,斎藤,saito@test.com
dev_002,高橋,takahashi@test.com
dev_003,石本,ishimoto@test.com
```

     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200622132649.png "img")

                    
## Data Lake Analytics（DLA）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200622141143.png "img")

### エンドポイントの作成
Data Lake Analyticsへのエンドポイントを作成します。    
これは後のTable StoreやObject Storage Serviceとの連携の際に必要となる作業です。        
Data Management ServiceからData Lake Analyticsに接続できるようにします。    
    
以下画像の「Create Endpoint」ボタンを押下し、エンドポイントを設定します。    
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200622181832.png "img")
     
VPC、VSwitch、Available Zoneを設定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200622181816.png "img")
     
エンドポイントが作成されました。    
これでData Management ServiceからData Lake Analyticsにログイン可能となります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623132218.png "img")

                    
# プロダクト連携
## Data Management Serviceへのログイン

> https://www.alibabacloud.com/cloud-tech/doc-detail/107696.htm


先程、作成したエンドポイントから「Log on in DMS」を押下し、Data Management Serviceコンソールに遷移します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623132151.png "img")
     
Data Lake Analyticsエンドポイントと、    
Data Lake Analyticsのアカウント管理画面の<span style="color: #ff0000">Root Account</span>でData Management Serviceにログインします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623130305.png "img")
     
     
     
## Table Store + Data Lake Analytics 連携

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623171509.png "img")

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/110389.htm


### Table Storeスキーマの作成
Table StoreのテーブルをData Lake Analyticsに連携させるため、    
Data Management Serviceでテーブルのスキーマを作成します。

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/110391.htm



#### 記述例
以下は記述例となります。

```
CREATE SCHEMA <スキーマ名>  WITH DBPROPERTIES (
catalog = 'ots',
location = '<Table StoreインスタンスのVPCエンドポイント>',
instance = '<Table Storeインスタンス名>'
);
```
     
#### Data Management Service
実際に今回入力したスキーマは以下になります。

```
CREATE SCHEMA ots_dla_test  WITH DBPROPERTIES (
catalog = 'ots',
location = 'https://suzuki10-test.cn-shanghai.vpc.tablestore.aliyuncs.com',
instance = 'suzuki10-test'
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623142626.png "img")
     

#### Data Lake Analytics
スキーマ作成に成功するとData Lake Analyticsコンソールでスキーマが作成されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623132903.png "img")
     
     


### 外部テーブルの作成
引き続きData Management Serviceで作業をします。    
スキーマの次は外部テーブルを作成します。    

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/110393.htm


#### 記述例
以下は記述例になります。    
Table Storeで作成したテーブル定義により、以下の記述は変化しますので、Table Storeのテーブルに合わせ調整します。    
<span style="color: #ff0000">※フィールド名に「-」や「_」が含まれている場合は、「\`」でフィールド名を囲む必要があります。</span>    
<span style="color: #ff0000">　例：device_name  varchar not NULL　⇒　\`device_name\`  varchar not NULL</span>    

```
CREATE EXTERNAL TABLE <スキーマ名>.<テーブル名> (
  `<フィールド名>` <データ型> <not NULL または NULL> ,
  `<フィールド名>` <データ型> <not NULL または NULL> ,
  PRIMARY KEY (`<主キーのフィールド名>`, `<主キーのフィールド名>`)
);
```
     
#### 外部テーブルの作成（参照用テーブル001）
今回作成した外部テーブルは以下になります。

```
CREATE EXTERNAL TABLE ots_dla_test.tbl_001 (
  timeStamp varchar not NULL ,
  messageId  varchar not NULL ,
  deviceName  varchar not NULL ,
  rawMessage varchar NULL ,
  PRIMARY KEY (`timeStamp`, `messageId`, `deviceName`)
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623142915.png "img")

     
#### 外部テーブルの作成（参照用テーブル002）
今回作成した外部テーブルは以下になります。

```
CREATE EXTERNAL TABLE ots_dla_test.tbl_002 (
  timeStamp varchar not NULL ,
  messageId  varchar not NULL ,
  deviceName  varchar not NULL ,
  state varchar NULL ,
  message varchar NULL ,
  PRIMARY KEY (`timeStamp`, `messageId`, `deviceName`)
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200619120247.png "img")
     
     
     
### テーブル結合
Data Management Serviceでスキーマと外部テーブルを作成すると、    
Data Lake Analyticsコンソールでクエリの実行が可能となります。     
     
では、実際にData Lake Analyticsコンソールで今回作成した2つのテーブルに対し、クエリを発行してみます。    
テーブル結合イメージは以下になります。    
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200617193752.png "img")

     
     
以下のSELECT文をData Lake Analyticsコンソールの「Serverless SQL > Execute」画面で入力し、実行します。    

```
SELECT rawMessage, state, message FROM ots_dla_test.tbl_001
    INNER JOIN ots_dla_test.tbl_002
    ON ots_dla_test.tbl_001.messageId = ots_dla_test.tbl_002.messageId;
```
     
     
結果は以下になります。     
本ブログで作成したTable Storeの2つのテーブルが結合され結果が表示されました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623142322.png "img")
     
     
     
## Table Store + Object Storage Service + Data Lake Analytics 連携

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623171549.png "img")

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/110380.htm


### Object Storage Serviceスキーマの作成
Object Storage ServiceのCSVをData Lake Analyticsに連携させるため、    
CSVのスキーマを作成します

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/110356.htm


#### 記述例
以下は記述例になります。    

```
CREATE SCHEMA oss_dla_test with DBPROPERTIES(
  catalog='oss',
  location = 'oss://<バケット名>/<あればディレクトリ名>/'
  );
```
     
#### Data Management Service
実際に今回入力したスキーマは以下になります。

```
CREATE SCHEMA oss_dla_test with DBPROPERTIES(
  catalog='oss',
  location = 'oss://oss-suzuki10n01/dla/'
  );
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623141200.png "img")
     
#### Data Lake Analytics
スキーマ作成に成功するとData Lake Analyticsコンソールでスキーマが作成されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623143118.png "img")
     
     
### 外部テーブルの作成
引き続きスキーマの次はTable Store同様、Data Management Serviceで外部テーブルを作成します。    

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/107716.htm


#### 記述例
以下は記述例になります。    
今回参照するのはObject Storage ServiceにアップロードしたCSVになりますので、    
CSVに合わせた外部テーブルを作成します。    

```
CREATE EXTERNAL TABLE <スキーマ名>.<テーブル名>(
<フィールド名> <データ型>,
<フィールド名> <データ型>
)
ROW FORMAT
SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
WITH SERDEPROPERTIES('serialization.encoding'='<文字コード>'， 'field.delim'='<データの区切り文字>')
STORED AS TEXTFILE
LOCATION 'oss://<バケット名>/<ディレクトリ名>/<ファイル名>'
TBLPROPERTIES ('skip.header.line.count' = '<読み込み対象外の行数>')
```

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/109657.htm

     
#### 外部テーブルの作成（CSV）
実際に作成したテーブルは以下になります。        
OSSにアップロードしたCSVに合わせ以下を調整しています。        
・CSVの区切り文字にカンマを使用しているため、'field.delim'=','を指定        
・CSVに日本語が含まれるため、'serialization.encoding'='SJIS'を指定        
・CSVにフィールド名を記入しているので、'skip.header.line.count' = '1'を指定        

```
CREATE EXTERNAL TABLE oss_dla_test.oss_testdata_csv(
deviceName STRING,
user STRING,
address STRING
)
ROW FORMAT
SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
WITH SERDEPROPERTIES('serialization.encoding'='SJIS'， 'field.delim'=',')
STORED AS TEXTFILE
LOCATION 'oss://oss-suzuki10n01/dla/oss_testdata001.csv'
TBLPROPERTIES ('skip.header.line.count' = '1')
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200619141042.png "img")
     
     
     
### テーブル結合
Data Management ServiceでObject Storage ServiceのCSVスキーマと外部テーブルを作成すると、    
Object Storage Serviceに関してもData Lake Analyticsコンソールでクエリの実行が可能となります。     
     
実際にData Lake Analyticsコンソールで以下の3つのテーブルに対し、クエリを実行してみます。    
・Table Store 参照用テーブル001    
・Table Store 参照用テーブル002    
・Object Storage Service CSVファイル    
    
テーブル結合イメージは以下になります。    
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200617193819.png "img")
     
     
以下のSELECT文をData Lake Analyticsコンソールの「Serverless SQL > Execute」画面で入力し、実行します。 

```
SELECT rawMessage, state, message, address FROM ots_dla_test.tbl_001
INNER JOIN ots_dla_test.tbl_002
ON ots_dla_test.tbl_001.messageId = ots_dla_test.tbl_002.messageId
INNER JOIN oss_dla_test.oss_testdata_csv
ON ots_dla_test.tbl_001.devicename = oss_testdata_csv.devicename
```
     
結果は以下になります。     
本ブログで作成したTable Storeの2つのテーブルとObject Storage ServiceのCSVが結合され異なるデータソースからなる結果が表示されました。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623120405.png "img")




          
# データエクスポート
Data Lake Analyticsはクエリで結合したテーブルをCSV形式でエクスポートが可能です。    
Execute画面の「エクスポート結果セット（Export Result Set）」ボタンを押下することでCSVファイルをダウンロード可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623120511.png "img")
     
     
ダウンロードされたCSVファイルはExecute画面でのクエリ結果が反映されています。

```
"rawMessage","state","message","address"
"dev_001@test@001","info","システムが再起動しました。","saito@test.com"
"dev_003@test@001","error","システムが異常終了しました。","ishimoto@test.comm"
"dev_002@test@001","warn","xxxへの接続がタイムアウトしました。","takahashi@test.com"
```

          
# まとめ
今回はData Lake Analyticsを使用したクエリ実行についてご紹介しました。    
    
Data Lake Analyticsと各プロダクトを連携することでTable Storeのテーブルだけではなく、    
Object Storage ServiceのCSVもまとめてデータ分析することができました。    
Data Lake Analyticsうまく活用することで異なるデータソースの関連データの解析が容易になると思われます。    
    
今回はTable StoreとObject Storage Serviceとの連携について記載しましたが、    
他にもRDSとの連携や、OSSにアップロードしたログの分析などにもData Lake Analyticsは活用できます。    
    


