---
title: "ワンクリックでPolarDBへ"
metaTitle: "ワンクリックで既存のRDSからPOLARDBを作成する"
metaDescription: "ワンクリックで既存のRDSからPOLARDBを作成する"
date: "2020-01-17"
author: "SBC engineer blog"
thumbnail: "/Database_images_26006613497985700/000000000000000004.png"
---

## ワンクリックでPolarDBへ

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/000000000000000004.png "img")   

# はじめに

本記事では、Alibaba Cloud ApsaraDB for POLARDB のデータベースクラスターを素早く作成する３つの方法をご紹介します。    
     
基本的には次の方法があります。   
* 新規購入
* RDSからクローン
* RDSからマイグレーション

     
それぞれの詳細なやり方を紹介します。   

# PolarDBとは
PolarDBはAlibaba Cloudが開発したCloud Native Databaseサービスです。MySQL・PostgreSQLは100%、Oracleは高い互換性を持ちながら、ユーザーのワークロードに応じて垂直・水平スケーリングすることが出来るため、コストを大幅に削減できることが特徴です。     

> https://www.alibabacloud.com/product/polardb
     
# １、新規購入

下記購入ページのイメージのように、Create Type(作成種類)の選択肢からデフォルトのDefault Create Type を選択し、他は通常のプロダクトを購入するときと同様に、リージョン、スペック、ネットワークなど選択して、購入すれば、新規のクラスタが作成されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200108170341.png "img")      
     
# ２、RDSからクローン

すでに作成済みのRDSから全く同じ構成のデータベースをPOLARDBで作成する方法です。    
データベース構成はもちろん、パラメータなどの設定は全く同じです。   
ただし、注意したいのは、こちらの方法について、制限があります。    

* まず、ストレージエンジンが InnoDB の RDS for MySQL5.6、5.7のみ対応されています
* また、TDE(データベースプロキシ)とSSLが無効であること
* 管理者権限アカウントが必要

クローン機能を試してみます。

まず既存のRDS for MySQL5.6、5.7がクローン対象かどうかを確認します。

<b><i>バージョン確認：</i></b>

```
MySQL [dba1]> show variables like '%version%';
+--------------------------------+-----------------------+
| Variable_name                  | Value                 |
+--------------------------------+-----------------------+
| innodb_version                 | 5.6.16                |
| protocol_version               | 10                    |
| slave_type_conversions         |                       |
| tls_version                    | TLSv1,TLSv1.1,TLSv1.2 |
| tokudb_version                 | 7.5.6                 |
| version                        | 5.6.16-log            |
| version_comment                | Source distribution   |
| version_compile_compiler       | GNU                   |
| version_compile_compiler_major | 4                     |
| version_compile_compiler_minor | 8                     |
| version_compile_machine        | x86_64                |
| version_compile_os             | Linux                 |
+--------------------------------+-----------------------+
12 rows in set (0.00 sec)
```

<b><i>エンジンがInnoDBであること：</i></b>

```
MySQL [dba1]> show variables like '%engine%';
+----------------------------+--------+
| Variable_name              | Value  |
+----------------------------+--------+
| default_storage_engine     | InnoDB |
| default_tmp_storage_engine | InnoDB |
| storage_engine             | InnoDB |
+----------------------------+--------+
3 rows in set (0.00 sec)
```

<b><i>SSL：</i></b>

```
MySQL [dba1]> show status like '%ssl%';
+---------------------------------+-------+
| Variable_name                   | Value |
+---------------------------------+-------+
| Com_show_processlist            | 0     |
| Com_rds_show_actual_processlist | 0     |
| Ssl_accept_renegotiates         | 0     |
| Ssl_accepts                     | 0     |
| Ssl_callback_cache_hits         | 0     |
| Ssl_cipher                      |       |
| Ssl_cipher_list                 |       |
| Ssl_client_connects             | 0     |
| Ssl_connect_renegotiates        | 0     |
| Ssl_ctx_verify_depth            | 0     |
| Ssl_ctx_verify_mode             | 0     |
| Ssl_default_timeout             | 0     |
| Ssl_finished_accepts            | 0     |
| Ssl_finished_connects           | 0     |
| Ssl_server_not_after            |       |
| Ssl_server_not_before           |       |
| Ssl_session_cache_hits          | 0     |
| Ssl_session_cache_misses        | 0     |
| Ssl_session_cache_mode          | NONE  |
| Ssl_session_cache_overflows     | 0     |
| Ssl_session_cache_size          | 0     |
| Ssl_session_cache_timeouts      | 0     |
| Ssl_sessions_reused             | 0     |
| Ssl_used_session_cache_entries  | 0     |
| Ssl_verify_depth                | 0     |
| Ssl_verify_mode                 | 0     |
| Ssl_version                     |       |
+---------------------------------+-------+
27 rows in set (0.00 sec)
```
無効化状態であることがわかります。

<b><i>データベースプロキシ機能：</i></b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109110457.png "img")      

プロキシ機能も有効化されていません。

クローンできる条件に満たしていますので、クローン作成に進みます。

購入する時にCreate Type(作成種類)の選択肢からClone from RDS を選択すると、クローンできる対象のRDSインスタンスが選択できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200108170419.png "img")      

POLARDBのノードスペックを選択し、そのまま購入を進みます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109112958.png "img")      

購入完了後、数分が経つと、POLARDBのコンソールにRDSからクローンしたPOLARDBクラスタが使用できるようになります。

できたPOLARDBの中身を確認してみますと、

ホワイトリストはソース RDS と同じ設定になっていです：
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109131840.png "img")      

アカウントも作成済みです：
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109132038.png "img")      

データベース及びテーブルなどももちろん全部クローンできていました：
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109132112.png "img")      

```
MySQL [dba1]> show tables;
+----------------+
| Tables_in_dba1 |
+----------------+
| departments    |
| dept_emp       |
| dept_manager   |
| employees      |
| salaries       |
+----------------+
5 rows in set (0.00 sec)
```

# ３、RDSからマイグレーション
こちらの方法も既存RDSデータベースから複製する方法です、さらにRDSの増量データもPOLARDBに同期できます。
さらに、万が一マイグレーションが失敗した場合、元のRDSにロールバックすることもできます。

注意事項として、クローン作成と同じく、

* ストレージエンジンが InnoDB の RDS for MySQL5.6、5.7のみ対応
* TDE(データベースプロキシ)とSSLが無効であること
* 管理者権限アカウントが必要


こちらのマイグレーション機能も検証してみましょう。
購入画面もクローン作成と同じく、Create Type(作成種類)の選択肢からMigration from RDS を選択すると、ソースRDSインスタンスが選択できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109134903.png "img")      

> <i>クローン作成よりマイグレーション作成タスクのほうが時間かかる感じですね。
> </i>

POLARDB データベースクラスタが作成できた後、POLARDBの管理コンソールで確認してみます。

ホワイトリスト、アカウント、データはクローンと同じくできています、
さらに、通常の管理画面よりマイグレーション管理メニューが増えています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109143544.png "img")      

今の状態だと、POLARDBはまだ読み取り用のみで、ソースRDSの側からの更新を同期するしかできないです。
RDSでデータ更新をやってみます：

```
MySQL [dba1]> show tables;
+----------------+
| Tables_in_dba1 |
+----------------+
| departments    |
| dept_emp       |
| dept_manager   |
| employees      |
| salaries       |
+----------------+
5 rows in set (0.00 sec)
```

productというテーブルを追加します：
```
MySQL [dba1]> CREATE TABLE product (
    ->     id     INT             NOT NULL COMMENT 'PK',
    ->     price       INT             NOT NULL,
    ->     store_num   INT            NOT NULL,
    ->     in_store_date     DATE      NOT NULL
    -> );
Query OK, 0 rows affected (0.00 sec)

MySQL [dba1]> show tables;
+----------------+
| Tables_in_dba1 |
+----------------+
| departments    |
| dept_emp       |
| dept_manager   |
| employees      |
| product        |
| salaries       |
+----------------+
6 rows in set (0.00 sec)
```

POLARDBで同じテーブルが増えてることを確認できます：

```
MySQL [dba1]> show tables;
+----------------+
| Tables_in_dba1 |
+----------------+
| departments    |
| dept_emp       |
| dept_manager   |
| employees      |
| product        |
| salaries       |
+----------------+
6 rows in set (0.00 sec)
```


マイグレーション管理メニューでSwitch（切り替え）ボタンを押すと、ソースRDSとPOLARDBの役が切り替えられます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109153952.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109154029.png "img")      

切り替え終了後、管理コンソールからRead Writeになったことがわかります：

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109154053.png "img")      

今の状態で、POLARDB側ではデータ書き込めるようになりました：

```
MySQL [dba1]> INSERT INTO `product` VALUES
    -> (1001,5000,'100','2020-01-01');
Query OK, 1 row affected (0.01 sec)

MySQL [dba1]> SELECT * from product;
+------+-------+-----------+---------------+
| id   | price | store_num | in_store_date |
+------+-------+-----------+---------------+
| 1001 |  5000 |       100 | 2020-01-01    |
+------+-------+-----------+---------------+
1 row in set (0.01 sec)
```

その代わり、ソースRDS側ではデータ更新できなくなっているはず：

```
MySQL [dba1]> SELECT * from product;
+------+-------+-----------+---------------+
| id   | price | store_num | in_store_date |
+------+-------+-----------+---------------+
| 1001 |  5000 |       100 | 2020-01-01    |
+------+-------+-----------+---------------+
1 row in set (0.00 sec)

MySQL [dba1]> INSERT INTO `product` VALUES
    -> (1002,5000,'100','2020-01-02');

ERROR 1290 (HY000): The MySQL server is running with the --read-only option so it cannot execute this statement
```

これでうまくRDSからPOLARDBにマイグレーションできました。
最後はマイグレーション終了ボタンを押せばマイグレーション終了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109154853.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109154826.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200109190853.png "img")      

Read onlyになったソースRDSを同期切り離して、コンールからマイグレーションメニューが消えます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613497985700/20200117100530.png "img")      

RDSからPOLARDBへのマイグレーションが完了です。


# 終わりに
以上で、既存のRDSからPOLARDBへ移行する機能の検証でした。PolarDBをスタートする際、ご参考に頂ければ幸いです。    




