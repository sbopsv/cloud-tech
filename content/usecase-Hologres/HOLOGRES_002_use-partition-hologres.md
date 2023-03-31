---
title: "Fact・Partition Table作成方法"
metaTitle: "HologresでFact Table（単独テーブル）およびPartition Table作成について"
metaDescription: "HologresでFact Table（単独テーブル）およびPartition Table作成について"
date: "2021-07-06"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/Hologres_images_26006613699529800/20210630151343.png"
---

## HologresでFact Table（単独テーブル）およびPartition Table作成について

本記事では、[Hologres](https://www.alibabacloud.com/product/hologres) で、Fact table（単独テーブル）、およびpartition付きテーブルを作る方法を紹介します。           


# Hologresとは

> <span style="color: #ff0000"><i>Hologres はリアルタイムのインタラクティブ分析サービスです。高い同時実行性と低いレイテンシーでTB、PBクラスのデータの移動や分析を短時間で処理できます。PostgreSQL11と互換性があり、データを多次元で分析し、ビジネスインサイトを素早くキャッチすることができます。</i></span>

少し前になりますが、Hologresについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-hologres


今回はHologresでFact table（単独テーブル）、およびpartition付きテーブルを作る方法を紹介します。構成図で、こんな感じです。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630151343.png "img")


---

# 共通作業1（Hologres全体で共通事項）
1. Hologresのインスタンス購入   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630152847.png "img")

1. RAMリソースグループの設定    
もしRAMユーザーでHologresを操作するのであれば、RAM画面より、Hologres操作に対する権限をアタッチします。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630152805.png "img")

1. Database作成   
HologresのDatabaseはコンソール側からHoloWeb側へ遷移し、登録、設定ができます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630152507.png "img")
HoloWebでDatabaseを作成します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630152543.png "img")

1. User作成
同じく、HoloWeb側で設定します。    
また、RAMユーザーに紐づいたユーザーを作成することも可能です。    

1. WhiteList作成
これもHoloWeb側で設定します。     

# 共通作業2（DataWorksの設定）
DataWorksでWorkSpaceを設定、導入します。

---

まずはECSからFact table（単独テーブル）を作ってみます。
# ECSからのFact table（単独テーブル）作成について
## STEP1: 実行環境での初期設定
ECSでPostgreSQL接続をするためにPostgreSQLクライアントをインストールします。ECSはCentOS7.8を使用しています。    
まずはCentOSのアップデートから。    
```
### CentOS Upgrade
yum -y upgrade
yum -y install wget

### PostgreSQLを入れる
yum search postgresql
yum -y install postgresql.x86_64
```

PostgreSQLのクライアントをインストールします。    
```
[root@proxima ~]# yum -y install postgresql.x86_64
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
Resolving Dependencies
--> Running transaction check
---> Package postgresql.x86_64 0:9.2.24-6.el7_9 will be installed
--> Processing Dependency: postgresql-libs(x86-64) = 9.2.24-6.el7_9 for package: postgresql-9.2.24-6.el7_9.x86_64
--> Processing Dependency: libpq.so.5()(64bit) for package: postgresql-9.2.24-6.el7_9.x86_64
--> Running transaction check
---> Package postgresql-libs.x86_64 0:9.2.24-6.el7_9 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

====================================================================================================================================
 Package                            Arch                      Version                              Repository                  Size
====================================================================================================================================
Installing:
 postgresql                         x86_64                    9.2.24-6.el7_9                       updates                    3.0 M
Installing for dependencies:
 postgresql-libs                    x86_64                    9.2.24-6.el7_9                       updates                    235 k

Transaction Summary
====================================================================================================================================
Install  1 Package (+1 Dependent package)

Total download size: 3.3 M
Installed size: 17 M
Downloading packages:
(1/2): postgresql-9.2.24-6.el7_9.x86_64.rpm                                                                  | 3.0 MB  00:00:00
(2/2): postgresql-libs-9.2.24-6.el7_9.x86_64.rpm                                                             | 235 kB  00:00:00
------------------------------------------------------------------------------------------------------------------------------------
Total                                                                                                10 MB/s | 3.3 MB  00:00:00
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : postgresql-libs-9.2.24-6.el7_9.x86_64                                                                            1/2
  Installing : postgresql-9.2.24-6.el7_9.x86_64                                                                                 2/2
  Verifying  : postgresql-libs-9.2.24-6.el7_9.x86_64                                                                            1/2
  Verifying  : postgresql-9.2.24-6.el7_9.x86_64                                                                                 2/2

Installed:
  postgresql.x86_64 0:9.2.24-6.el7_9

Dependency Installed:
  postgresql-libs.x86_64 0:9.2.24-6.el7_9

Complete!
[root@proxima ~]#
```

## STEP2: ECSからHologresへpsql接続

ECSからPostgreSQL接続をします。接続方法は次の通りです。    
```
PGUSER=<AccessID> PGPASSWORD=<AccessKey> psql -p <Port> -h <Endpoint> -d postgres
```

＜AccessID＞、＜AccessKey＞ はAlibaba Cloud AccessKeyから、   
＜Port＞、＜Endpoint＞ はコンソールから確認できます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630203619.png "img")

＜AccessID＞、＜AccessKey＞、＜Port＞、＜Endpoint＞がわかれば、psqlとして接続します。（`retail_db`は事前に作成したDatabase名です）   
Hologresへのデータ移動の量やネットワークトラフィックなどを鑑みて、基本的にはVPC Endpointによる接続を推奨します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630203850.png "img")

これで接続が出来たらOKです。   

## STEP3-1: ECSインスタンスにあるcsvファイルへの格納
これはPostgreSQLをベースとする作業なので非常に簡単だと思います。   
何かに行き詰まったらPostgreSQL11をベースとした他の技術サイト、Webサイトなどで探っても良いと思います。    

例えば、list.csvファイルがあり、そのCSVファイルの中身がこれだった場合、
```
10001,どらえもん,120
10002,のび太,11
10003,スネ夫,10
10004,ジャイアン,11
10005,ドラミ,106
```

Hologres側でそれに伴うテーブルを作成し、
```
CREATE TABLE list_table (
  id char(15) NOT NULL,
  name varchar NOT NULL,
  age INTEGER ,
PRIMARY KEY (id)
);
```

PostgreSQLのCopyコマンドと同じように格納するだけです。
```
\copy list_table from './list.csv' with csv
```
結果、すぐに格納、テーブルが見れるようになりました。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630233004.png "img")

## STEP3-2: Pythonスクリプトによる格納

今回データはFakerを使います。Fakerはダミーデータを自動出力するライブラリです。    
> https://github.com/joke2k/faker


gccコンパイラ、Python38、psycopg2-binary、Fakerをインストールします。Python3.8です。      
```
yum install centos-release-scl
yum install rh-python38
scl enable rh-python38 bash
pip install psycopg2-binary
pip install Faker
```

Pythonコードとして以下入力します。ファイル名はput_fake_data.pyです。     
```
from faker import Faker
fake = Faker(['ja_JP'])
for i in range(10):
    print(str(i) + ',' + fake.name() + ',' + ',' + fake.address() + ',' + fake.phone_number() + ',' + fake.date() + ',' + fake.job())
```
出力結果として、以下のようにダミーデータが出力できたらOKです。    
```
[root@proxima ~]# python3 put_fake_data.py
0,長谷川 直子,,岡山県三鷹市中三依38丁目9番10号,090-6881-7943,1987-07-15,English as a foreign language teacher
1,John Ford,,Rotonda Pedroni 988 Piano 5
Sesto Marta terme, 47136 Venezia (RM),+39 18 6202595,1975-11-09,電気工事士
2,村上 京助,,熊本県大島町吾妻橋8丁目11番20号 ハイツ鶴ヶ丘094,070-9928-9404,1997-10-19,映画監督
3,Carlos Clements,,753 Holland Spur Suite 806
Burgessfort, UT 56575,(270)227-1670x2954,1999-01-27,Insurance risk surveyor
4,Larry Johnson,,青森県東大和市北青山27丁目23番7号 クレスト三ノ輪249,+1-026-496-1361,1986-12-10,Government social research officer
5,Kim Murphy,,大阪府横浜市栄区入谷31丁目24番16号 クレスト上高野376,001-051-403-7518x852,2000-02-06,Librarian, public
6,Richard Jackson,,Stretto Giustino 74
Bartolomeo lido, 47660 Trapani (CR),(417)791-9369x62702,1970-03-23,Producer, radio
7,Catherine Gibson,,Via Grisoni 5 Piano 9
Rita laziale, 39328 Torino (PV),+39 798 5162343,2011-05-06,Theatre stage manager
8,Annetta Albertini,,熊本県中野区北青山40丁目1番8号 クレスト鍛冶ケ沢109,068-025-6953,1981-07-02,エステティシャン
9,加藤 くみ子,,Vicolo Bianca 963
Sesto Loretta sardo, 77123 Ascoli Piceno (OR),+39 24 72759550,2014-02-28,エンジニア演奏家
[root@proxima ~]#
```

Hologres側でこれを受け入れるテーブルを作成します。   
```
CREATE TABLE Customer_list(
  id INTEGER NOT NULL,
  name varchar(50) NOT NULL,
  address varchar(255) NOT NULL,
  phone_number  varchar(50) NOT NULL,
  date date,
  job varchar(50),
  PRIMARY KEY (id)
);
```

テーブル作成後は、上記、put_fake_data.pyファイルにて psycopg2 によるHologres接続、データの登録SQLを入れます。    
```
import psycopg2 
from faker import Faker

# 接続
connection = psycopg2.connect(\
    host='hgpost-sg-4vl27pie0001-ap-northeast-1-vpc.hologres.aliyuncs.com',\
    port=80,\
    dbname='retail_db',\
    user='LTAI5txxxxxxxxxxxxdG9umV',\
    password='QnlbsxxxxxxxxxqrAGR7PA')

# fakerで日本語設定
fake = Faker(['ja_JP'])

# カーソル取得
cursor = connection.cursor() 

# SQL実行
for i in range(10):
  insert_data_sql = str(i) + ",'" + fake.name() + "','" + fake.address() + "','" + fake.phone_number() + "','" + fake.date() + "','" + fake.job() + "'"
  cursor.execute("INSERT INTO Customer_list VALUES (" + insert_data_sql + ")") 

# もし上記SQLがSelect文で、結果取得したいのであれば、以下コードを追加
# for row in cursor.fetchall() : 
#     print(row)

# カーソル終了
cursor.close() 

# psycopg2終了
connection.close() 

```
あとはHologres SQLで確認します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630231845.png "img")

これでPython実行によるHologresへのデータ格納が出来たことを確認できました。    


--- 
---



今度はpartition付きテーブルを作成してみます。    

# OSSからのpartition付きテーブル作成について
今回はDataWorks DataIntegrationで操作します。    

## Step1: 事前準備
全てのプロセスを完了するためには、以下のインスタンスを準備する必要があります。

- OSSのCSVデータファイル
- Hologres partition table
- DataWorks DI用のDataWorksプロジェクトとリソースグループ

### OSSのCSVデータファイル

ソースデータファイルはOSSバケットに格納され、以下のようなパーティションキーに基づいたフォルダ構造になっています。

```
|--bob-demo-oss-jp(OSS bucket) 
|--|--partition_demo(parent folder of the data files) 
|--|--|--partition_key=202105(detail partition folder) 
|--|--|--|--test_data_202105.csv(detail data file) 
|--|--|--partition_key=202106(detail partition folder) 
|--|--|--|--test_data_202106.csv(detail data file) 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213245.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213256.png "img")

また、テスト用データをデータファイルはこのような構造になっています。

```test_data_202106.csv
202106,1,partion 202106 with id 1
202106,2,partion 202106 with id 2
202106,3,partion 202106 with id 3
202106,4,partion 202106 with id 4
202106,5,partion 202106 with id 5
202106,6,partion 202106 with id 6
```

### Hologres パーティションテーブルの準備
Hologresインスタンスを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213313.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213322.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213330.png "img")


インスタンス詳細ページの「Database」メニューをクリックして、HoloWebコンソールに入ります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213345.png "img")

システム管理ページでターゲットデータベースを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213356.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213405.png "img")


メタデータ管理」のページで、対象となるパーティションテーブルを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213417.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213426.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213434.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213444.png "img")


### DataWorks DI用のDataWorksプロジェクトとリソースグループ

以下の手順で新規にDataWorksプロジェクトを作成します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213502.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213511.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213520.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213531.png "img")


パブリックリソースグループは、Hologresの統合ジョブには使用できませんでした。代わりに[Dedicated Resource Group](https://www.alibabacloud.com/cloud-tech/doc-detail/137838.htm#title-qly-815-tp0)を購入する必要があります。   

現在、データソースページやジョブ設定ページでの購入処理ができません（2021/7/5時点、現在Alibaba側対応中）。なので、導入の際はリソースグループのメニューから関連するリソースを調達する必要があります。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213546.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213554.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213601.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213609.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213618.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213627.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213637.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213647.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213655.png "img")


## STEP2: DataWorks DataIntegrationでデータ格納における定期的なジョブ設定（同期処理）
上記STEP1 の事前準備が完了したら、今度はDataWorks DataIntegrationで、HologresをData sourceとして登録しながらデータ統合ジョブ（同期処理）を実行します。    

データ統合ジョブは[データソース](https://www.alibabacloud.com/cloud-tech/doc-detail/137670.htm)に基づいて定義されますが、ここでは[OSS Reader](https://www.alibabacloud.com/cloud-tech/faq-detail/137726.htm)と[Hologres Writer](https://www.alibabacloud.com/cloud-tech/faq-detail/158321.htm)を使用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213728.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213736.png "img")


### OSSデータソースの構成

`Add Data Source` ボタンをクリックし、OSSデータソースを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213750.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213759.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213809.png "img")

### Hologresデータソースの設定

Hologresデータソースの場合も同じプロセスです。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213827.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213835.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213844.png "img")


データソースが接続テストで失敗する場合は、警告メッセージを表示して関連する設定を確認することができます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213904.png "img")


### DIジョブの設定

DataWorks の DataStdio で BusinessFlow とバッチ同期ノードを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213923.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213935.png "img")

ウィザードでOSSデータソースをソースとして、Hologresデータソースをターゲットとして設定し、データを正常にプレビューします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706213950.png "img")

`file path`、 `partition info` 、 `arguments` をパラメータ引数として設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706214011.png "img")


## STEP3: DataIntegrationジョブ設定（同期処理）の結果確認
パラメータを使って実行し、関連する結果をHolo Webで確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706214042.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706214050.png "img")


Hologres側で、HoloWebとしてログイン後、新しく作成したパーティションとそのデータを確認します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210706214124.png "img")





---

# 注意事項
Hologresは[2019年11月11日 独身の日で、毎秒5億9600万件のリアルタイム格納をしつつ、2.5PBを超えるのFact table（単独テーブル）で運用。多くの多次元分析とインタラクティブ分析を同時実行しつつも、クエリの99%は80ms以下で返却という実績](https://developer.aliyun.com/article/779284) があります。これはこれですごいですが、これと同等レベルのパフォーマンスを実体感するためには、Hologresのアーキテクチャ性質上、注意しなければならないことがあります。    
HologresはShardという、１つのテーブルを複数に分割しながらリソース管理する機能があります。    

Shardはインスタンスのスペック事に決まっており、   
* Shard数が多いほど、Apache Flink、RealtimeCompute、Apache Spark Streamingからのリアルタイム書き込み処理で負荷がかからない。しかし、リソースに空白（無駄）があるため、SQLクエリでは少し負荷がかかりやすい。    
* Shard数が少ないほど、SQLクエリによる検索が高速です。しかし、書き込み処理で分散パフォーマンスが取りにくいため、リアルタイム書き込み処理で負荷がかかりやすい。    

というトレードオフ問題があります。
そのため、まずはインスタンスでスモールスタート構成からスタートし、メトリクスやパフォーマンスをみながらインスタンススペックの変更（Shard台数の調整）をすると良いです。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630194950.png "img")


> https://www.alibabacloud.com/cloud-tech/doc-detail/183398.htm

> https://www.alibabacloud.com/cloud-tech/doc-detail/203609.htm

> https://alibabatech.medium.com/evolution-of-the-real-time-data-warehouses-of-the-alibaba-search-and-recommendation-data-platform-e3717bc01b7f


---
# 最後に
本記事では、HologresでFact Table（単独テーブル）およびPartition Tableを作成・格納する方法を簡単に説明しました。     
Hologresでテーブル設計時、参考に頂ければ幸いです。     



