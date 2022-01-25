---
title: "POLARDBとRDSの性能比較"
metaTitle: "Alibaba Cloud POLARDBとRDSの簡単な性能比較（Sysbench編）"
metaDescription: "Alibaba Cloud POLARDBとRDSの簡単な性能比較（Sysbench編）"
date: "2020-01-10"
author: "SBC engineer blog"
thumbnail: "/Database_images_26006613495358500/000000000000000003.png"
---

## Alibaba Cloud POLARDBとRDSの簡単な性能比較（Sysbench編、2020年1月版）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613495358500/000000000000000003.png "img")      

# はじめに

本記事では、Alibaba Cloud が提供している [POLARDB](https://www.alibabacloud.com/product/polardb)に対し、Sysbench を使って POLARDB for MySQL の OLTP 処理性能を測ると同時に、Alibaba Cloud  の RDS (MySQL) と簡単な比較試験をしました、その試験のメモになります。     


# PolarDBとは
PolarDBはAlibaba Cloudが開発したCloud Native Databaseサービスです。MySQL・PostgreSQLは100%、Oracleは高い互換性を持ちながら、ユーザーのワークロードに応じて垂直・水平スケーリングすることが出来るため、コストを大幅に削減できることが特徴です。     

> https://www.alibabacloud.com/product/polardb

# 簡単に Sysbench の紹介

sysbench はベンチマークツール、デフォルトでは CPU やメモリ以外 OLTP というベンチマークも付いています。

 リレーショナルデータベース、特に MySQL のトランザクション性能測定ではよく使われています。

Github で[ダウンロードする](https://github.com/gatieme/AderXCoding/tree/master/system/tools/benchmark/sysbench)ことができます。

 今回は性能比較が目的なので、インストールなどの手順は省略します。

# 試験シナリオ

## 使用するシナリオは下記の二つ：

> oltp_read_write：読み取り/書き込みの OLTP 処理

> oltp_read_only：読み取りのみの OLTP 処理



## 使用したパラメータ：
> 
> |パラメータ|説明|値|
> |---|:---|:---|
> |table-size|１つのテーブルに挿入するレコード数|25000|
> |tables|テーブルの数|250|
> |time|実行時間（秒）|600|
> |threads|平行実行するスレッド数|10|

## 試験対象：

> |対象|スペック|DBバージョン|
> |---|:---:|---:|
> |RDS|2C8G|MySQL8.0|
> |POLARDB|2C8G|MySQL8.0|


## 試験結果

まずは軽く負荷をかけて、スレッド数10 で実行します。

> |パラメータ|説明|値|
> |---|:---|:---|
> |table-size|１つのテーブルに挿入するレコード数|25000|
> |tables|テーブルの数|250|
> |time|実行時間（秒）|600|
> |threads|平行実行するスレッド数|10|


上記のパラメータで得た結果：

> oltp-read-write

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613495358500/20191224113808.png "img")      

> oltp-read-only

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613495358500/20191224113944.png "img")      


計算してみます：
> |項目|RDS-QPS|POLARDB-QPS|比較結果|
> |---|:---:|:---:|:---:|
> |Read write|2802180|3050880|約1.1倍|
> |Read only|3425888|3425888|約1.01倍|


emmm...そんなに POLARDB が優れないと思いますが、本当に高性能を持っているか？

POLARDB のドキュメントをよく調べてみましたが、パラレル処理が特徴のようです。
つまり同時処理コネクション数を大きくなったら何か変わるかな？

下記のようにsysbench のパラメータでスレッド数を変更してみましょう：

> |パラメータ|説明|値|
> |---|:---:|---:|
> |table-size|１つのテーブルに挿入されるデータのレコード数|25000|
> |tables|テーブルの数|250|
> |time|実行時間（秒）|600|
> |threads|平行実行するスレッド数|<span style="color: #d32f2f">500</span>|

スレッド数を大幅に上げ、500に変更した結果：


> oltp-read-only

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613495358500/20191224115025.png "img")      

> oltp-read-write

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613495358500/20191224115047.png "img")      


結果を確認してみます：
> |項目|RDS-QPS|POLARDB-QPS|比較結果|
> |---|:---:|---:|---:|
> |Read write|5573400|8660600|約1.6倍|
> |Read only|7183312|7183312|約1.9倍|

１回目の試験と比べ随分結果が変わっていました。
Read-write は約 RDS の1.6倍になり、Read-only は1.9倍にもなりました。
確かに同じスペックの RDS と比べて、POLARDB が良いパフォーマンスが出そうです、素晴らしい 

また、Alibaba Cloud が公式的に公開した数値からだと、Read-only の性能が最大通常 MySQL サーバの6倍にもありました、それはすごい数値ですね 

# 最後に
Alibaba Cloud POLARDBとRDSの簡単な性能比較をしました、Alibaba Cloud POLARDBが次世代リレーショナルデータベースとして期待できると思います。




