---
title: "MaterializeMySQLでMySQL連携"
metaTitle: "MaterializeMySQLを使用してApsaraDB RDS for MySQLからApsaraDB RDS for ClickHouseへデータ連携する方法"
metaDescription: "MaterializeMySQLを使用してApsaraDB RDS for MySQLからApsaraDB RDS for ClickHouseへデータ連携する方法"
date: "2021-08-17"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613793350200/008.png"
---

## MaterializeMySQLを使用してApsaraDB RDS for MySQLからApsaraDB RDS for ClickHouseへデータ連携する方法

本記事では、ApsaraDB RDS for MySQLからMaterializeMySQLを使って[ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse)へデータ連携する方法をご紹介します。MaterializeMySQLはClickHouseの機能です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210714233458.png "img")


構成図は次の通りです。      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/008.png "img")



# ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/


少し前になりますが、LogServiceについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。

> https://www.slideshare.net/sbopsv/alibaba-cloud-log-service


# ApsaraDB RDS for MySQL とは
Alibaba Cloudのフルマネージド型リレーショナルデータベースサービスです。     

> https://www.alibabacloud.com/product/apsaradb-for-rds-mysql

※ApsaraDBは、Alibaba Cloudがクラウドコンピューティングの上で稼働するデータベースとして名付けたもので、Apsaraはインド神話にある水の妖精で、「雲の海に生きるもの」を意味するものです。だからクラウドコンピューティングのデータベースとしてApsaraDB（アプサラス）ですね。

[アプサラス](https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%97%E3%82%B5%E3%83%A9%E3%82%B9)

> https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%97%E3%82%B5%E3%83%A9%E3%82%B9



# 1. ClickHouseClientの準備
## 1-1.ClickHouseインスタンスを準備します

この手法は[過去の記事](https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start)でも記載していますが、再掲として記載します。     

> https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start

1）まずはApsaraDB for ClickHouseインスタンスを作成します。     
①VPCを作成     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210716155113.png "img")

②ClickHouseインスタンスを作成     
著者は以下のインスタンススペックでインスタンスを作成しています。     

> ClickHouse version:20.8.7.15
> Edition：Single-replica Edition

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成     
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続     
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210716155401.png "img")


# 2. ApsaraDB RDS for MySQLおよびデータの準備
## 2-1.MySQLインスタンスを作成
1）MySQLインスタンスを作成します     

①AlibabaCloudのサイトをログインし、コンソール画面に遷移します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816223812.png "img")

②RDSをクリックし、RDSコンソール画面に遷移します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816223830.png "img")

③インスタンス作成をクリックし、RDSを作成します。     
注意として、MaterializeMySQLによるデータ連携の場合 `GTID` 機能を使う必要があり、ApsaraDB for RDS EnterpriseではGTIDがOFFであるため、BasicとHAのタイプを選択しなければならないです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816223958.png "img")

④VPCを設定します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816224024.png "img")

⑤Mysqlインスタンス情報を確認します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816224038.png "img")

④Mysqlインスタンスが作成されました     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816224053.png "img")

2）MySQLのデータベースを作成します     
①データベース画面にデータベース作成ボタンをクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816224126.png "img")

②データベースを設定します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816224151.png "img")

③データベースが作成されます     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816224212.png "img")

3）MySQLのアカウントを作成     
①アカウント画面にアカウント作成ボタンをクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816224232.png "img")

②Privileged Accountアカウントを設定します     
※通常のアカウント（Nomal Account）の場合は、MySQLライブラリのRELOAD、REPLICATION SLAVE、REPLICATION CLIENT、およびSELECTPRIVILEGE権限をアタッチする必要があります     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210816224300.png "img")

③アカウントが作成されます     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817000856.png "img")

## 2-2.DMSでDBをログイン
1）DMSでDBをログイン     
①データベースログインをクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817000918.png "img")

②データベースアカウントとパスワードを入力し、接続テストボタンをクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817000931.png "img")


③「OK」をクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001001.png "img")

④「Login」をクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001017.png "img")

⑤DMSでデータベース接続が成功したことを確認します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001056.png "img")

## 2-3.DMSでMySQLのテーブルデータの準備
1）下記shoppingテーブル作成     

①userテーブルを作成します     

```user
create table user(
    user_id bigint not null auto_increment comment 'user_id ID',
    user_name varchar(30) comment 'user name',
    phone_num varchar(20) comment 'phonenum',
    email varchar(100) comment 'email',
    acct decimal(18,2) comment 'account',
    primary key (user_id),
    key I1 (user_name)
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001209.png "img")

②inventoryテーブルを作成します     

```inventory
create table inventory(
    inventory_id bigint not null auto_increment comment 'inventory_id',
    inventory_name varchar(30) comment 'inventory name',
    price_unit decimal(18,2) comment 'price unit',
    inventory_num bigint not null default 0 comment 'inventory num',
    primary key(inventory_id)
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001236.png "img")


③ordersテーブルを作成します     

```orders
create table orders(
    order_id bigint not null auto_increment comment 'order id',
    user_id bigint not null comment 'user id',
    inventory_id bigint not null comment 'inventory id',
    price_unit decimal(18,2) comment 'price unit',
    order_num bigint not null default 0 comment 'order num',
    create_time datetime not null default current_timestamp,
    update_time datetime not null default current_timestamp on update current_timestamp,
    primary key(order_id),
    key I1(user_id),
    key I2(inventory_id)
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001305.png "img")


③テーブルを確認します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001325.png "img")


2）モックアップデータを作成します     
①userテーブルを選択し、右クリックメニューから「データプラン」 - 「テストデータ作成」をクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001354.png "img")


②10万件テストデータを設定します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001407.png "img")

③作成タスクを確認します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001420.png "img")

④データを確認します     

```
SELECT count(*) FROM `user` ;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001456.png "img")

```
SELECT * FROM `user`
LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001517.png "img")


⑤同じ方法でinventoryデータを作成します     

```
SELECT count(*) FROM `inventory` ;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001541.png "img")

```
SELECT * FROM `inventory`
LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001558.png "img")


⑥同じ方法でordersデータを作成します     

```
SELECT count(*) FROM `orders` ;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001619.png "img")


```
SELECT * FROM `orders`
LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001635.png "img")


3）ordersデータを更新     
①下記コマンドでordersを更新します     

```
update orders set update_time = create_time;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001659.png "img")


②update_timeが create_timeと同じであることを確認します     

```
SELECT * FROM `orders`
LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817001720.png "img")



# 3.MaterializeエンジンでMySQLデータをClickHouseに同期します

ここから本題です。     
ApsaraDB for ClickHouseはデータベースエンジンを `MaterializeMySQL` と設定することで、ApsaraRDS for MySQLのテーブルをApsaraDB for ClickHouseへリアルタイムでデータを同期することができます。     
そのため、ApsaraDB for ClickHouseサービスはMySQLのコピーとして、Binlogを読み取り、DDLおよびDMLリクエストを実行することで、MySQL Binlogメカニズムに基づくデータベースのリアルタイム同期機能を実現することができます。       　　　　　


* 前提条件：
> * データソースとなるApsaraRDS for MySQLクラスターと、ターゲットのApsaraDB for ClickHouseクラスターは同じVPCネットワークに配置している必要があります     
> * ClickHouseクラスターのアドレスを ApsaraRDS for MySQLのホワイトリストに追加する必要があります     
> * MaterializeMySQLテーブルエンジンのユーザーは、MySQLライブラリのRELOAD、REPLICATION SLAVE、REPLICATION CLIENT、およびSELECT PRIVILEGE権限を持っている必要があります     
> * MySQL側でGTIDが対応していること、およびON状態になっている必要があります     


## 3-1.DMSでClickHouseデータを確認します
1）DMSでClickHouseデータベースを作成します     

```
CREATE DATABASE [IF NOT EXISTS] db_name [ON CLUSTER cluster]
ENGINE = MaterializeMySQL('host:port', ['database' | database], 'user', 'password')
SETTINGS
include_tables ='a,b,c...';
```

パーシングルール：     
* *：/含む空の文字列を除く任意の文字を置き換えます     
* ?:任意の1文字を置き換えます     
* {N..M} ：NとMを含む、NからMの範囲の任意の数を置き換えます     

①下記コマンドを実行し、MaterializeMySQLデータベースを作成します     

※RDSのホワイトリストを設定し、Mysqlインスタンスにアクセス権限がある状態にします。     

```
CREATE DATABASE mysql_clickhouse ENGINE = MaterializeMySQL('rm-0iw928qvgwn4c8ue8.mysql.japan.rds.aliyuncs.com:3306', 'sbdb', 'sbtest', 'Test1234')
SETTINGS
include_tables ='*';
```

* Internal Endpointを確認します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002419.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002430.png "img")


```
SHOW TABLES FROM mysql_clickhouse;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002446.png "img")


2）DMSでテーブルを検索します     
```
SELECT * FROM mysql_clickhouse.user;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002500.png "img")

```
SELECT * FROM mysql_clickhouse.inventory;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002512.png "img")


```
SELECT * FROM mysql_clickhouse.orders;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002526.png "img")


3）Mysqlでuserテーブルにデータを挿入     
①userテーブルにデータを挿入します     

```
INSERT INTO sbdb.user VALUES (100001,'test','ts','des','46.88');
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002543.png "img")


②Clickhouseからデータを同期します     

```
SELECT * FROM mysql_clickhouse.user WHERE user_id = 100001;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002605.png "img")


4）Mysqlでuserテーブルにデータを削除します     

```
DELETE FROM sbdb.user WHERE user_id = 100001;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002622.png "img")


②Clickhouseからデータを同期します     

```
SELECT * FROM mysql_clickhouse.user WHERE user_id = 100001;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002639.png "img")


5）Mysqlでuserテーブルにデータを更新     
①userテーブルにデータを更新します     

```
UPDATE sbdb.user SET user_name='test' where user_id =100000;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002702.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002713.png "img")


②Clickhouseからデータ同期します     
```
SELECT * FROM mysql_clickhouse.user WHERE user_id = 100000;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793350200/20210817002727.png "img")




---

# 最後に

ここまで、ApsaraDB for ClickHouseはデータベースエンジンを `MaterializeMySQL` と設定することで、ApsaraRDS for MySQLのテーブルをApsaraDB for ClickHouseへリアルタイムでデータを同期する方法を紹介しました。     
ApsaraDB for ClickHouseはMySQLのテーブルとスムーズに連携できるので、例えば、RDS for MySQLでWebアプリケーション運用のち、MaterializeMySQLを使ってClickHouseへリアルタイム同期しながら、ClickHouseでリアルタイム可視化、といったソリューションとして仕上げることもできます。     




