---
title: "OSSからClickHouseへ接続"
metaTitle: "OSSからApsaraDB for ClickHouseへデータ連携する方法"
metaDescription: "OSSからApsaraDB for ClickHouseへデータ連携する方法"
date: "2021-07-16"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613787434300/006.png"
---

## ApsaraDB for ClickHouseがOSSとデータ連携する方法

本記事では、[ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse)で 早速使ってみたい方向けに、クイックスタートとして OSSとデータ連携する方法をご紹介します。     
OSS(Object Storage Service)は、AlibabaCloudが提供する低コストのオブジェクトストレージサービスです。ClickHouseは、ProtobufとCapnProtoを除く、複数の形式のOSSファイルへのアクセスをサポートしています。      

今回、OSSからApsaraDB for ClickHouse へデータ連携する方法を記載します。構成図は次の通りです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/006.png "img")




# 1.ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/


---


前提条件：      
* ClickHouseバックエンドノードとOSS間のスムーズなネットワークを確保するには、テーブル関数またはテーブルエンジンパラメーターに入力されたossエンドポイントがVPCのエンドポイントである必要があります。 また、OSSバケットはClickHouseインスタンスと同じリージョンにある必要があります。      
* テーブル関数にacces-key-idとaccess-key-secretはoss-file-pathへの読み取り権限が必要です。      
* テーブルエンジンにacces-key-idとaccess-key-secretは、oss-file-pathへの読み取り権限が必要です。 挿入操作を実行する必要がある場合は、書き込み権限も必要です。      
* oss-file-pathパラメータのフォーマットは `oss://<bucket-name/<path-to-file>` です。      
* file-format-nameとcolumn-definitionsは、実際のファイル形式と一致している必要があります。なお、ProtobufとCapnProtoは非対応です。[対応フォーマット](https://clickhouse.tech/docs/en/interfaces/formats/)      
* OSSに既存のファイルを挿入する場合、OSSには追加可能なオブジェクトしか書き込むことができないため、AppendObjectインターフェイスを介してファイルがOSSにアップロードされていることを確認する必要があります。       

> https://clickhouse.tech/docs/en/interfaces/formats/




# 1.ClickHouseを準備する
## 1-1.ClickHouseインスタンスを準備する

この手法は[過去の記事](https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start)でも記載していますが、再掲として記載します。

> https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start

1）まずはApsaraDB for ClickHouseインスタンスを作成します。      
①VPCを作成      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716155113.png "img")

②ClickHouseインスタンスを作成      
著者は以下のインスタンススペックでインスタンスを作成しています。      

> ClickHouse version:20.8.7.15
> Edition：Single-replica Edition

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成      
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続      
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716155401.png "img")



# 2.OSSでデータを準備する
## 2-1.OSSにCSVファイルをアップロード

1）OSSバケットを新規作成      
①AlibabaCloudのサイトをログインし、OSSをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716202823.png "img")

②バケットを作成      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716202840.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716202849.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716202859.png "img")



③下記サンプルデータをCSVファイルとして保存し、OSSにアップロードします。      

```
id, user_name, age, city, access_url
1,tick,32,shanghai,http://xdbdsd.com/xgwgwe
2,wangl,22,beijing,http://ghwbw.com/xgwgwe
3,xiaoh,23,shenzhen,http://holko.com/xgwgwe
4,jess,45,hangzhou,http://jopjop.com/xgwgwe
5,jack,14,shanghai,http://wewsd.com/xgwgwe
6,tomy,25,hangzhou,http://sbedr.com/xgwgwe
7,lucy,45,shanghai,http://ghhwed.com/xgwgwe
8,tengyin,26,shanghai,http://hewhe.com/xgwgwe
9,cuos,27,shenzhen,http://yoiuj.com/xgwgwe
10,wangsh,37,shanghai,http://hhou.com/xgwgwe
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716202937.png "img")


③CSVファイルをOSSバケットにアップロード      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716202955.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716203006.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716203019.png "img")


# 3.ClickHouseでOSSデータを操作します。
ApsaraDB for ClickHouseは、OSSに対して２つのデータにアクセス方法を提供しています。      

```
**ApsaraDB for ClickHouseのテーブル関数を使ってOSSのデータを直接読み取って処理 **
テーブル関数：テーブル関数oss('<oss-endpoint>', '<access-key-id>', '<access-key-secret>', '<oss-file-path>', '<file-format-name>', '<column-definitions>')

**ApsaraDB for ClickHouseのテーブルエンジンを使ってOSSのデータを読み取り処理、もしくは書き込み処理 **
テーブルエンジン：テーブルエンジンoss('<oss-endpoint>', '<access-key-id>', '<access-key-secret>', '<oss-file-path>', '<file-format-name>')
```

どのような挙動かについては次の通りです。      


## 3-1.ApsaraDB for ClickHouseのテーブル関数を使ってOSSのデータを直接読み取って処理
①Clickhouseで下記のコマンドでOSSデータを検索します。      
```
SELECT *
FROM oss('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/access_log_csv.csv', 'CSV', 'id UInt8, user_name String, age UInt16, city String, access_url String');
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716203905.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716203919.png "img")


②その他検索について      
```
SELECT *
FROM oss('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/access_log_csv.csv', 'CSV', 'id UInt8, user_name String, age UInt16, city String, access_url String') WHERE id = 9;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716203953.png "img")

```
SELECT
    user_name,
    count(*) AS uv
FROM oss('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/access_log_csv.csv', 'CSV', 'id UInt8, user_name String, age UInt16, city String, access_url String')
GROUP BY user_name;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204007.png "img")


* 備考：      
> テーブル関数でOSSデータをアクセスする際、ClickHouse側でデータを保存していない状態でのアクセスを推奨します。      
> また、OSSに保存されている大量データをアクセスする場合、OSS - ApsaraDB for ClickHouse間のNW帯域によるパフォーマンスが低下する可能性があります。加えて、ClickHouseで複雑なSQLクエリによる分析を実施する場合は、OSSのデータをClickHouseへ同期することを推奨します。      


## 3-2.ApsaraDB for ClickHouseのテーブルエンジンを使ってOSSのデータを読み取り処理
①テーブルエンジンでテーブルを作成します      

```
create table oss_test_table on cluster default
(
id UInt8,
user_name String,
age UInt16,
city String,
access_url String
)
engine = OSS('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/access_log_csv.csv', 'CSV');
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204320.png "img")

②テーブルを検索します      
```
SELECT *
FROM oss_test_table;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204344.png "img")


③再度テーブルを集計しながら検索      
```
SELECT
    city,
    count(*) AS pv
FROM oss_test_table
GROUP BY city
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204416.png "img")

* 備考：
> テーブルエンジンでOSSデータをアクセスする際、ClickHouse側でデータを保存していない状態でのアクセスを推奨します。      
> また、OSSに保存されている大量データをアクセスする場合、OSS - ApsaraDB for ClickHouse間のNW帯域によるパフォーマンスが低下する可能性があります。加えて、ClickHouseで複雑なSQLクエリによる分析を実施する場合は、OSSのデータをClickHouseへ同期することを推奨します。      

## 3-3.ApsaraDB for ClickHouseのテーブルエンジンを使ってOSSのデータを書き込み処理
①テーブルエンジンでテーブルを作成します      
```
create table oss_test_table_appenable on cluster default
(
id UInt8,
user_name String,
age UInt16,
city String,
access_url String
)
engine = OSS('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/access_log_csv.csv', 'CSV');

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204524.png "img")

②テーブルを検索します      
```
select * from oss_test_table_appenable;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204654.png "img")

③データを挿入してみます      
（この方法はデータを既存のCSVファイルに上書き保存となります。）      
```
insert into oss_test_table_appenable values(11, 'test1', 25, 'beijing', 'http://asewg.com/jhlue');
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204706.png "img")


④再度データを検索します      
```
select * from oss_test_table_appenable where id =11 ;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204718.png "img")




# 4.OSSデータをClickHouseへインポート
## 4-1.ローカルテーブルを作成します

Single-replica Editionの場合、      
```
create table oss_test_table_local on cluster default
(
id UInt8,
user_name String,
age UInt16,
city String,
access_url String
)
engine = MergeTree()
order by id;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204812.png "img")


※Double-replica Editionの場合      
```
create table oss_test_table_local on cluster default
(
id UInt8,
user_name String,
age UInt16,
city String,
access_url String
)
engine = ReplicatedMergeTree('/clickhouse/db/default/tables/oss_test_table_local/{shard}', '{replica}')
order by id;
```

## 4-2.分散テーブルを作成します
分散テーブルを作成します      

```
create table oss_test_table_distributed on cluster default
(
id UInt8,
user_name String,
age UInt16,
city String,
access_url String
)
engine = Distributed(default, default, oss_test_table_local, rand());
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204852.png "img")

## 4-3.OSSのCSVファイルらデータをClickHouseへインポート
1）OSSのCSVファイルを確認します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204904.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716204913.png "img")


2）テーブルエンジンでoss_test_table1テーブルを作成      
①テーブルエンジンでoss_test_table1テーブルを作成します      

```
create table oss_test_table1 on cluster default
(
id UInt8,
user_name String,
age UInt16,
city String,
access_url String
)
engine = OSS('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/access_log_csv1.csv', 'CSV');
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205005.png "img")

②テーブルを検索      
```
select * from oss_test_table1;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205021.png "img")


## 4-4.データをインポートする
①oss_test_table1のデータをClickhouseにインポートする      
```
insert into oss_test_table_distributed select * from oss_test_table1;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205038.png "img")

④データを検索する      
```
select * from oss_test_table_distributed;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205056.png "img")



## 4-5.oss-file-pathはワイルドカードをサポートしているので、試してみます
通常、OSSには同じ命名規則を持つ複数の小さなファイルがあります。複数の小さなファイルの分析を簡素化するために、oss-file-pathパラメーターはあいまい一致のために次のワイルドカードをサポートします。      

> ①　*：任意のファイル名とディレクトリ名に一致します。 たとえば、/dir/* は/dirのすべてのファイルと一致します。      
> ②{x、y、z}：中括弧内の任意の値に一致します。 たとえば、file_ {x、y、z}はfile_x、file_y、file_zと一致します。      
> ③{num1..num2}：[num1、num2]のすべての数値を展開します。 たとえば、file_{1..3}は、file_1、file_2、file_3と同等です。      
> ④？：任意の1文字に一致します。 たとえば、file_？はfile_a、file_b、file_cなどと一致します。      


まずは試してみます。     
1）OSSファイルを用意します。     

```
oss-clickhouse/
    txtfiles/
        access_log_csv1.txt
        access_log_csv2.txt
        access_log_csv3.txt
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205203.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205214.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205223.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205231.png "img")


2）ClickHouseでデータを検索します     
①Case1:     
```
select * from oss('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/txtfiles/*', 'CSV', 'id UInt8, user_name String, age UInt16, city String, access_url String') order by age;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205305.png "img")


```
oss-clickhouse/
    txtfiles/
        access_log_csv1.txt
        access_log_csv2.txt
        access_log_csv3.txt
```
上記ファイルが検索結果として出力されます     

②Case2:     
```
select * from oss('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/txtfiles/access*', 'CSV', 'id UInt8, user_name String, age UInt16, city String, access_url String') order by age;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205327.png "img")


```
oss-clickhouse/
    txtfiles/
        access_log_csv1.txt
        access_log_csv2.txt
        access_log_csv3.txt
```
上記ファイルが検索結果として出力されます     


③Case3:     
```
select * from oss('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/txtfiles/access_log_csv{1,2,3}.txt', 'CSV', 'id UInt8, user_name String, age UInt16, city String, access_url String')order by age;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205415.png "img")


```
oss-clickhouse/
    txtfiles/
        access_log_csv1.txt
        access_log_csv2.txt
        access_log_csv3.txt
```
上記ファイルが検索結果として出力されます     

④Case4:     
```
select * from oss('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/*/access_log_csv{1,3}.txt', 'CSV', 'id UInt8, user_name String, age UInt16, city String, access_url String') order by age;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205450.png "img")


```
oss-clickhouse/
    txtfiles/
        access_log_csv1.txt
        access_log_csv3.txt
```
上記ファイルが検索結果として出力されます     

⑤Case5:     
```
select * from oss('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/*/*', 'CSV', 'id UInt8, user_name String, age UInt16, city String, access_url String') order by age;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205552.png "img")

```
oss-clickhouse/
    txtfiles/
        access_log_csv1.txt
        access_log_csv2.txt
        access_log_csv3.txt
```
上記ファイルが検索結果として出力されます     

⑥Case6:     
```
select * from oss('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/*/access_log_csv{1..3}.txt', 'CSV', 'id UInt8, user_name String, age UInt16, city String, access_url String') order by age;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205610.png "img")


```
oss-clickhouse/
    txtfiles/
        access_log_csv1.txt
        access_log_csv2.txt
        access_log_csv3.txt
```
上記ファイルが検索結果として出力されます     

⑦Case7:     
```
select * from oss('oss-ap-northeast-1-internal.aliyuncs.com', '<your-access-key-id>', '<your-access-key-secret>', 'oss://oss-clickhouse/*/access_log_csv?.txt', 'CSV', 'id UInt8, user_name String, age UInt16, city String, access_url String') order by age;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787434300/20210716205623.png "img")


```
oss-clickhouse/
    txtfiles/
        access_log_csv1.txt
        access_log_csv2.txt
        access_log_csv3.txt
```
上記ファイルが検索結果として出力されます     


---

# 最後に

ここまで、OSS - ClickHouseのデータ連携方法を紹介しました。     
ClickHouseはOSSにあるCSVファイルの分析や書き込み処理が出来るので、シナリオ次第ではDWHだけでなくDataLakeとして運用できると思います。     



