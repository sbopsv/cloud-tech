---
title: "AWS RDS/FC/OSS/DataV連携"
metaTitle: "Alibaba CloudデータソースおよびAmazon RDSのData Lake Analytics共用利用とFunction Computeを利用したテーブル結合結果のOSSアウトプットおよびDataV連携について [ DLA + OTS + RDS + Function Compute + OSS + DataV ]"
metaDescription: "Alibaba CloudデータソースおよびAmazon RDSのData Lake Analytics共用利用とFunction Computeを利用したテーブル結合結果のOSSアウトプットおよびDataV連携について [ DLA + OTS + RDS + Function Compute + OSS + DataV ]"
date: "2020-07-13"
author: "SBC engineer blog"
thumbnail: "/DataAnalytics_images_26006613592304300/20200710165233.png"
---


## Data Lake AnalyticsでFunction ComputeとOSSとAWS RDSをDataVで可視化する

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200722144307.png "img")


本記事では、Data Lake AnalyticsでFunction ComputeとOSSとAWS RDSをDataVで可視化する方法をご紹介します。

# プロダクト連携図
各プロダクトの連携は以下のようになります。    
各プロダクトを作成し、最終的にDataVに連携します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200710165233.png "img")
     
# Table Store
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200722144533.png "img")
     
## Table Storeインスタンスの作成
Data Lake Analyticsとの連携に使用するTable Storeインスタンスを作成します。

> https://www.alibabacloud.com/cloud-tech/doc-detail/55211.htm

    
![参考画像](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200703174354.png "参考画像")

     
## Table StoreのVPCバインド
Data Lake Analyticsとの連携を図るため、Table StoreインスタンスをVPCに紐づけます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706193703.png "img")
     
以下では上海リージョンのVPCおよびゾーンBのVSwitchを指定しています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706193724.png "img")

     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706193741.png "img")
     
## Table Storeにテーブルを作成
Data Lake Analyticsで参照するテーブルを前回同様作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706103933.png "img")
     
     
## Table Storeにレコードを作成
以下のテストデータをテーブルに挿入します。  


|timeStamp|messageId|deviceName|rawMessage|
|---|---|---|---|
|2020-06-16 12:00:00|0000000000000000001|dev_001|dev_001@test@001|
|2020-06-16 12:01:00|0000000000000000002|dev_002|dev_002@test@001|
|2020-06-16 12:02:00|0000000000000000003|dev_003|dev_003@test@001|

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706104248.png "img")
     



# ApsaraDB for RDS
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200722144615.png "img")
     
## ApsaraDB for RDSインスタンスの作成
Data Lake Analyticsとの連携に使用するApsaraDB for RDSインスタンスを作成します。

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/26117.htm

     
エンジンはMySQLを選択。    
エンジンバージョンは2020年7月9日時点で最新の8.0.18（コンソールではエンジンバージョン8.0と表示）を使用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706153243.png "img")


## データベースユーザの作成
Data Lake Analyticsで参照するデータベースおよびテーブルを作成する際に使用するデータベースユーザを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706153509.png "img")


## Data Management Serviceへの接続
ApsaraDB for RDSコンソールより、DBログイン画面に遷移します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706153702.png "img")

     
Data Management Serviceコンソールで    
作成したApsaraDB for RDSインスタンスのエンドポイントを指定し、Data Management Serviceにログインします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706153752.png "img")

 
## データベース作成
クエリを実行し、Data Lake Analyticsで参照するデータベースをData Management Serviceで作成します。
```
create database aprds_blog2_test_db
```
     
## テーブル作成
クエリを実行し、Data Lake Analyticsで参照するテーブルをData Management Serviceで作成します。
```
create table aprds_blog2_test_db.tbl_002 (
`timeStamp` varchar(255) not NULL,
`messageId` varchar(255) not NULL,
`deviceName` varchar(255) NULL,
`state` varchar(255) NULL,
`message` varchar(255) NULL,
PRIMARY KEY (`timeStamp`, `messageId`)
)
```
     
## ApsaraDB for RDSにレコードを作成
Data Lake Analyticsで参照するデータをData Management Serviceで作成します。    
以下のテストデータをテーブルにINSERTします。  



|timeStamp|messageId|deviceName|state|message|
|---|---|---|---|---|
|2020-06-16 12:00:00|0000000000000000001|dev_001|info|システムが再起動しました。|
|2020-06-16 12:01:00|0000000000000000002|dev_002|warn|xxxへの接続がタイムアウトしました。|
|2020-06-16 12:02:00|0000000000000000003vdev_003|error|システムが異常終了しました。|


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706153145.png "img")
     

# Amazon RDS
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200722144649.png "img")
     
## Amazon RDSインスタンスの作成
Data Lake Analyticsとの連携に使用するAmazon RDSインスタンスを作成します。

> https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/CHAP_Tutorials.WebServerDB.CreateDBInstance.html

エンジンはMySQLを選択。    
エンジンバージョンは2020年7月9日時点で最新の8.0.19を使用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200702165113.png "img")

     
データベースユーザとパスワードを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709125543.png "img")


## Amazon RDSへの外部接続許可設定
### パブリックアクセシビリティの有効化
Data Lake Analyticsからの外部接続を許可するため、    
パブリックアクセシビリティを有効にします。    
    
インスタンス詳細画面で変更を押下します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200702170600.png "img")


パブリックアクセシビリティ項目で「はい」を選択し、ページ下部の「次へ」を押下します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709162501.png "img")


変更の概要で「パブリックアクセス可能」の新しい値が「はい」になっていることを確認します。    
すぐに設定を反映させるため、変更のスケジュールで「すぐに適用」を選択し、ページ下部の「DBインスタンスの変更」を押下します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200702171652.png "img")


インスタンスへの変更適用後、インスタンス詳細画面でパブリックアクセシビリティが「あり」になっていることを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200702181110.png "img")

     
### Amazon RDSのSecurity Group外部インバウンド通信許可
Amazon RDSにアタッチされているSecurity Groupで以下の外部インバウンド通信を許可します。  
・Amazon RDSへ接続するSQLクライアントからの外部インバウンド通信（MySQL Workbenchなど）    
・Alibaba CloudのData Lake Analyticsからの外部インバウンド通信    
    
Amazon RDSインスタンス詳細画面からアタッチされているSecurity Groupを押下し、Security Group詳細画面に遷移します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200702182940.png "img")


インバウンドルールに「SQLクライアント」と「Data Lake Analytics」のIPアドレスを追加します。    
Data Lake Analyticsからの通信を許可するには、インバウンドルールに「101.132.0.0/16」もしくは「101.132.71.223/32」を追加します。     
以下の参考画像では上記のうち、「101.132.71.223/32」を許可しています。    
※上記のIPアドレス2020年7月9日時点のIPアドレスであるため、今後予告なしに変更される可能性があります。    
※後の工程でAmazon RDSにデータベースとテーブルを作成するため、SQLクライアント接続元のIPアドレスも許可しています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200702192130.png "img")


## Amazon RDSにテーブルを作成
Data Lake Analyticsで参照するデータベースとテーブルをAmazon RDS上で作成します。    
今回はMySQL Workbenchを使用し、Amazon RDSに接続します。

> https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.MySQL.html

     

### Amazon RDSへの接続
Hostnameにエンドポイントを入力し、    
Amazon RDSインスタンス作成時に指定したUsernameとPasswordを入力し接続します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200702192636.png "img")


### データベース作成
Data Lake Analyticsが参照するデータベースを作成します。    
以下のクエリをAmazon RDSに接続したMySQL Workbench上で実行します。

```
create database rds_blog2_test_db
```
     
### テーブル作成
Data Lake Analyticsが参照するテーブルを作成します。    
以下のクエリをAmazon RDSに接続したMySQL Workbench上で実行します。

```
create table rds_blog2_test_db.tbl_003 (
`deviceName` varchar(255) not NULL,
`branch` varchar(255) NULL,
`user` varchar(255) NULL,
`address` varchar(255) NULL,
`update` varchar(255) NULL,
PRIMARY KEY (`deviceName`)
)
```
     

### レコード作成
Data Lake Analyticsが参照するデータを作成します。    
以下のテストデータをテーブルにINSERTします。  

|deviceName|branch|user|address|update|
|---|---|---|---|---|
|dev_001|toyosu|長谷川|hasegawa@test.com|2020-06-11 12:00:00|
|dev_002|toyosu|四月一日|vwatanuki@test.com|2020-06-11 12:00:00|
|dev_003|shibuya|高橋|takahashi@test.com|2020-06-12 12:00:00|


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706171426.png "img")


# Data Lake Analytics  Part1

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200722144734.png "img")
     
## Data Lake Analyticsでのスキーマ作成  Part1    
前回同様Data Lake Analyticsコンソールのアクセスポイント管理から    
Data Lake Analyticsのエンドポイントを作成し、Log on in DMSを押下します。    
※本ブログでは上海リージョンのゾーンBにエンドポイントを作成しています。    
    
ログオン後、Data Management ServiceコンソールにRoot Accountでログインし、    
スキーマをData Lake Analyticsに作成します。
     
     
### Data Lake AnalyticsでのTable Storeスキーマ作成
以下のクエリをData Management Serviceで実行し、Table Storeスキーマを作成します。

```
CREATE SCHEMA dla_ots_test WITH DBPROPERTIES (
catalog = 'ots',
location = 'https://ts-blog2-test.cn-shanghai.vpc.tablestore.aliyuncs.com',
instance = 'ts-blog2-test'
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200706193911.png "img")
     

### Data Lake AnalyticsでのApsaraDB for RDSスキーマ作成
以下のクエリをData Management Serviceで実行し、ApsaraDB for RDSスキーマを作成します。

```
CREATE SCHEMA dla_aprds_test WITH DBPROPERTIES (
CATALOG = 'mysql', 
LOCATION = 'jdbc:mysql://rm-6nn1ooor9e5aghset.mysql.rds.aliyuncs.com:3306/aprds_blog2_test_db',
USER = 'test_admin',
PASSWORD = '<パスワード>',
INSTANCE_ID = 'rm-6nn1ooor9e5aghset',
VPC_ID = 'vpc-uf6m5gn7f0wm3e249tonb'
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200707110022.png "img")

     

### Data Lake AnalyticsでのAmazon RDSスキーマ作成
以下のクエリをData Management Serviceで実行し、Amazon RDSスキーマを作成します。

```
CREATE SCHEMA dla_rds_test WITH DBPROPERTIES (
catalog = 'mysql',
location = 'jdbc:mysql://rds-blog2-test.xxxxxxxxxxxx.ap-northeast-1.rds.amazonaws.com:3306/rds_blog2_test_db',
USER = 'admin',
PASSWORD = '<パスワード>'
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200707110007.png "img")


### Data Lake Analyticsのスキーマ確認
Data Lake Analyticsコンソールのスキーマ管理でスキーマが作成されていることを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709132913.png "img")


## Data Lake Analyticsでの外部テーブル作成  Part1
Data Lake Analyticsコンソールのアクセスポイント管理からData Management ServiceコンソールにRoot Accountでログインし、外部テーブルをData Lake Analyticsに作成します。
     
     
### Data Lake AnalyticsでのTable Storeの外部テーブル作成
以下のクエリをData Management Serviceで実行し、Table Storeの外部テーブルを作成します。

```
CREATE EXTERNAL TABLE dla_ots_test.tbl_001 (
`timeStamp` varchar not NULL,
`messageId` varchar not NULL,
`deviceName` varchar NULL,
`rawMessage` varchar NULL,
PRIMARY KEY (`timeStamp`, `messageId`)
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200707155034.png "img")


### Data Lake AnalyticsでのApsaraDB for RDSの外部テーブル作成
以下のクエリをData Management Serviceで実行し、ApsaraDB for RDSの外部テーブルを作成します。

```
CREATE EXTERNAL TABLE dla_aprds_test (
`timeStamp` varchar(255) not NULL,
`messageId` varchar(255) not NULL,
`deviceName` varchar(255) NULL,
`state` varchar(255) NULL,
`message` varchar(255) NULL,
) tblproperties (
table_mapping = "tbl_002"
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200707155048.png "img")


### Data Lake AnalyticsでのAmazon RDSの外部テーブル作成
以下のクエリをData Management Serviceで実行し、Amazon RDSの外部テーブルを作成します。

```
CREATE EXTERNAL TABLE dla_rds_test.tbl_003 (
`deviceName` varchar(255) not NULL,
`branch` varchar(255) NULL,
`user` varchar(255) NULL,
`address` varchar(255) NULL,
`update` varchar(255) NULL
) tblproperties (
table_mapping = "tbl_003"
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200707155059.png "img")

     

# Object Storage Service

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200722144818.png "img")
     
## バケット作成
後の工程で作成するFunction Computeのファイルアップロード先をObject Storage Serviceで作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200707184201.png "img")


## ディレクトリ作成
Function Computeのファイルアップロード先ディレクトリを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200707184215.png "img")


# Resource Access Management
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200722144847.png "img")
     
## RAMロールの作成
Function Computeで使用するRAMロールを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708181100.png "img")

     
## RAMロールへの権限付与
以下の権限を付与します。    
AliyunOSSFullAccess    
AliyunECSNetworkInterfaceManagementAccess     
AliyunDLAFullAccess    
    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708181114.png "img")



# Function Compute

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200722144919.png "img")
     
## サービスの作成
 Function Computeのサービスを作成します。    
      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708181806.png "img")


## ネットワークの設定
サービス設定でネットワークの設定もします。    
インターネットアクセスは不要のためオフとし、    
Data Lake Analyticsのアクセスポイントと同じ、上海リージョンのゾーンBを指定します。    
Security Groupでの制限は今回はなしとしました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708181639.png "img")


## RAMロールのバインド
サービス設定でRAMロールを設定します。    
Function Compute用に作成したRAMロールをバインドします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708181936.png "img")


## 関数の作成
実行する内容を記述する関数を作成します。    
今回はテンプレート関数を使用したため、Python3をランタイムとして選択しました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708181503.png "img")



## Function Computeによるテーブル結合とObject Storage Serviceへの結果出力
Function ComputeでData Lake Analyticsにアクセスし、     
Data Lake Analyticsと連携した以下データソースのテーブルデータを結合し、    
Object Storage ServiceにCSVとして出力する処理を作成します。   
・Table Store     
・ApsaraDB for RDS     
・Amazon RDS    
     
テーブル結合イメージは以下になります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200702152522.png "img")


    
以下の2つのテンプレート関数をベースにし、    
Data Lake Analyticsで結合したテーブルのクエリ結果を    
Object Storage Serviceに書き出す処理を記述します。    
・data-lake-analytics    
・oss-download-zip-upload    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708163707.png "img")


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708163921.png "img")



ローカルでPyMySQLモジュールとindex.pyをzipに圧縮し、zipをFunction Computeにアップロードします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709110341.png "img")

```
# -*- coding: utf-8 -*-
import pymysql
import os
import oss2
import shutil

def handler(event, context):
  db = pymysql.connect(
    # Data Lake Analytics
    host='xxxxxxxxxxxxxxxxxxxxxxxx.vpc.cn-shanghai.datalakeanalytics.aliyuncs.com',
    port=10000,
    user='<Data Lake Analyticsユーザ>',
    passwd='<パスワード>',
    database='',
    charset='utf8'
  )
  
  # Execute
  sql='SELECT rawMessage, state, message, branch, user, address \
  FROM dla_ots_test.tbl_001 \
  INNER JOIN dla_aprds_test.tbl_002 \
  ON dla_ots_test.tbl_001.messageId = dla_aprds_test.tbl_002.messageId \
  INNER JOIN dla_rds_test.tbl_003 \
  ON dla_ots_test.tbl_001.devicename = dla_rds_test.tbl_003.devicename'
  
  # Object Storage Service
  creds = context.credentials
  auth = oss2.StsAuth(creds.accessKeyId, creds.accessKeySecret, creds.securityToken)
  bucket = oss2.Bucket(auth, 'oss-cn-shanghai-internal.aliyuncs.com', 'oss-blog2-test')
  uid = 'dla_result'
  os.system("rm -rf /tmp/*")
  path = '/tmp/' + uid + '.csv'
  key = 'datav/' + uid + '.csv'

  cursor = db.cursor()

  # Query
  rquery = query_oss_text_table(cursor, sql)

  # Add
  write_csv(path, rquery)

  db.close()
  
  # Upload
  total_size = os.path.getsize(path)
  part_size = oss2.determine_part_size(total_size, preferred_size = 128 * 1024)
  upload_id = bucket.init_multipart_upload(key).upload_id
 
  with open(path, 'rb') as fileobj:
    parts = []
    part_number = 1
    offset = 0
    while offset < total_size:
      num_to_upload = min(part_size, total_size - offset)
      result = bucket.upload_part(key, upload_id, part_number,oss2.SizedFileAdapter(fileobj, num_to_upload))
      parts.append(oss2.models.PartInfo(part_number, result.etag))
      offset += num_to_upload
      part_number += 1
            
    bucket.complete_multipart_upload(key, upload_id, parts)
        
  return total_size

def query_oss_text_table(cursor, sql):
  cursor.execute(sql)
  results = cursor.fetchall()
  print(results)
  return results

def write_csv(path, rquery):
  with open(path, "w", encoding='shift_jis') as file:
    for row in rquery:
      csv = ''
      for data in row:
        csv = csv + str(data) + ','
      file.write(csv[:-1] + '\n')
      file.flush()
```

     
関数を実行することにより、Object Storage ServiceにCSVファイルが生成されました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709104328.png "img")


今回作成されたCSVの内容は以下になります
```
dev_001@test@001,info,システムが再起動しました。,toyosu,長谷川,hasegawa@test.com
dev_002@test@001,warn,xxxへの接続がタイムアウトしました。,toyosu,四月一日,watanuki@test.com
dev_003@test@001,error,システムが異常終了しました。,shibuya,高橋,takahashi@test.com

```
     
## 関数のトリガー作成
Data Lake Analyticsでのテーブル結合結果を出力するCSVを常に最新状態に保つために、    
Function Computeにタイムトリガーを設定し、定期実行するようにします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709151338.png "img")


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709151353.png "img")


# Data Lake Analytics Part2

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200722145005.png "img")
     
Function Computeで出力したObject Storage Service上のCSVをDataVへ読み込ませるために    
Data Lake Analytics上でObject Storage Serviceのスキーマと外部テーブルを作成します。     

## Data Lake Analyticsでのスキーマ作成 Part2
Data Lake Analyticsコンソールのアクセスポイント管理から    
Data Management ServiceコンソールにRoot Accountでログインし、    
スキーマをData Lake Analyticsに作成します。
     
     
### Data Lake AnalyticsでのObject Storage Serviceスキーマ作成
以下のクエリをData Management Serviceで実行し、Object Storage Serviceスキーマを作成します。

```
CREATE SCHEMA dla_oss_test with DBPROPERTIES(
catalog='oss',
location = 'oss://oss-blog2-test/datav/'
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709133523.png "img")
     

### Data Lake Analyticsのスキーマ確認
Data Lake Analyticsコンソールのスキーマ管理でスキーマが作成されていることを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709134409.png "img")


## Data Lake Analyticsでの外部テーブル作成 Part2 
Data Lake Analyticsコンソールのアクセスポイント管理からData Management ServiceコンソールにRoot Accountでログインし、外部テーブルをData Lake Analyticsに作成します。
     
     
### Data Lake AnalyticsでのObject Storage Serviceの外部テーブル作成
以下のクエリをData Management Serviceで実行し、Object Storage Serviceの外部テーブルを作成します。

```
CREATE EXTERNAL TABLE dla_oss_test.tbl_004(
`rawMessage` STRING,
`state` STRING,
`message` STRING,
`branch` STRING,
`user` STRING,
`address` STRING
)
ROW FORMAT
SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
WITH SERDEPROPERTIES('serialization.encoding'='SJIS'， 'field.delim'=',')
STORED AS TEXTFILE
LOCATION 'oss://oss-blog2-test/datav/dla_result.csv'
TBLPROPERTIES ('skip.header.line.count' = '0')
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709133609.png "img")



# BI連携（DataV）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200722145030.png "img")
     
Function Computeで生成し、    
Data Lake Analyticsに外部テーブルとして取り込んだCSVファイル内容をDataVで可視化します。    
     
複数のデータソースに対するクエリ実行結果をObject Storage Serviceにアップロードすることで、    
複数のデータソースのテーブル結合結果がDataVのデータソースとして利用できるようになったため、    
これを利用します。    
    
また、DataVプロダクトは少々利用料金がお高いので、      
今回用に新たに上海リージョンのDataVを購入することはせず、    
データソースのリージョンとは異なりますが、    
既に購入済みの東京リージョンのDataVプロダクトを使用します。    


## Data Lake Analyticsへのホワイトリスト追加    
Data Lake Analyticsのホワイトリストに以下のドキュメントの「日本 (東京)」のIPアドレスを追加します。

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/89582.htm

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200709144059.png "img")


## データソースの追加

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/115055.htm

データソースにMySQL互換データベースを選択し、    
Data Lake Analyticsのパブリックエンドポイントと    
Data Lake Analyticsで作成したObject Storage Serviceのスキーマを指定します。    
※データベースリストが取得できない場合は、手動でスキーマ名を入力します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708154814.png "img")


## プロジェクトの追加
データソースのデータを表示させるため、プロジェクトを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708191839.png "img")


## ウィジェットのデータソース指定
ウィジェットにデータを表示させるため、作成したデータソースを指定します。    
また、どのデータソースからどのデータを取ってくるのかをSQLで指定します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708192014.png "img")

## プロジェクトへのウィジェット表示
プロジェクトにウィジェットを表示し、    
データソースからの正常にデータが反映されているか確認します。    
以下ではキーフォームウィジェットにデータソースを指定し、   
labelフィールドおよびvalueフィールドにデータソースのフィールド名を指定することで     
Object Storage Serviceに保存したCSVの情報の一部を表示しています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708192610.png "img")


プロジェクトを公開すると以下のように見えます。    
以上、簡易ながらもDataVとの連携でした。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200708192855.png "img")


# まとめ
今回は前回よりも、よりプロダクト連携を活かしたData Lake Analyticsの利用法についてご紹介しました。    

前回は複数の異なるプロダクトのテーブルをコンソールで一時的に結合するだけに留まりましたが、    
Data Lake AnalyticsとFunction Computeを連携することで、    
Table Store、ApsaraDB for RDS、Amazon RDSのテーブルデータを結合し、自動的にDataVへと連携することができました。    
    
単一プロダクトのテーブルデータの可視化であれば、このようなプロダクト連携は不要となり、    
DataVやQuick BIなどの可視化プロダクトに直接連携させればよいですが、    
複数データソースの分析をしようとしたときは今回のようにData Lake Analyticsが大いに役立つと思われます。    
    
また、今回はテーブル結合結果をObject Storage Serviceに保存しましたが、    
RDSなどにテーブル結合結果を書き込み、それをBIツールに連携することも可能です。    
データソースに関しても、他クラウドサービスの仮想サーバ上に展開しているデータベースなどもまたData Lake Analyticsに連携可能です。    









