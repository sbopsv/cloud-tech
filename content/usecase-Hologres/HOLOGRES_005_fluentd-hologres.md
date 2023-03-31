---
title: "FluentdでHologresへデータ転送"
metaTitle: "FluentdでHologresへデータ転送する"
metaDescription: "FluentdでHologresへデータ転送する"
date: "2021-08-10"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/Hologres_images_26006613795939300/20210810213446.png"
---

## FluentdでHologresへデータ転送する

本記事では、[Hologres](https://www.alibabacloud.com/product/hologres) で、Fluentdを使って、Hologresへデータを転送する方法をご紹介します。        


# Hologresとは

> <span style="color: #ff0000"><i>Hologres はリアルタイムのインタラクティブ分析サービスです。高い同時実行性と低いレイテンシーでTB、PBクラスのデータの移動や分析を短時間で処理できます。PostgreSQL11と互換性があり、データを多次元で分析し、ビジネスインサイトを素早くキャッチすることができます。</i></span>

少し前になりますが、Hologresについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-hologres


# Fluentdとは
一言でいうとオープンソースのデータ収集ツールです。2011年にTreasure Data, Inc.の共同創業者である古橋氏によって開発されたOSSで、現在Cloud Native Computing Foundation (CNCF® http://cncf.io/ ) で6番目の卒業プロジェクトとして発表されるほど市場を大きく広げたツールです。Cloud Native Computing Foundationでこれまでの卒業プロジェクトとしてKubernetes、Prometheus、Envoy、CoreDNS、containerdなどがあり、Fluentdはその一員として選ばれたわけです。選ばれるためには、市場の豊富な採用実績、コミュニティの持続可能性、体系化されたガバナンスプロセスなどを証明する必要があるため、これは日本発OSSとして快挙です。

> https://www.fluentd.org/

Fluentdは元々Treasure Data, Incが開発したOSSですが、今後は株式会社クリアコードが担当し継続開発することになっています。    

> https://www.clear-code.com/press-releases/20210729-maintaining-fluentd.html

# FluentdでHologresへデータ転送について

このガイドラインでは、Fluentdを使ってHologresへデータを転送します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810213446.png "img")


# このチュートリアルについて
## 対象者: 

本ガイドラインは、以下のような方を対象としています      
- Alibaba Cloud、Hologres、 ECS(Elastic Compute Service) に関する基本的な知識を持っている       
   
## 前提条件:
- Alibaba Cloud のアカウントを所持している    
- Hologresと ECS(Elastic Compute Service) が使用可能な状態になっている          
- 使用するHologresインスタンスとECS（CentOS）を1台以上持っている     


# ECSのCentOSサーバにてFluentdのインストール

ECSのCentOSサーバーにてFluentdの環境を用意するには、まずRubyをインストールする必要があります。     
[RVM](http://rvm.io/) を使用して、適切なバージョンのRuby (Ruby version >= 2.4)をインストールします。     

```sh
# Install GPG keys
$ gpg2 --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
# Using below 2 instead if the above command does not work
$ curl -sSL https://rvm.io/mpapis.asc | gpg2 --import -
$ curl -sSL https://rvm.io/pkuczynski.asc | gpg2 --import -
# Install RVM
$ curl -sSL https://get.rvm.io | bash -s stable
$ source /etc/profile.d/rvm.sh
# List Ruby versions
$ rvm list known
# Install target Ruby 2.7 here for example
$ rvm install 2.7
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810214321.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810214331.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810214345.png "img")

Fluentdを[Ruby Gem](https://docs.fluentd.org/installation/install-by-gem) でインストールします。     

> https://docs.fluentd.org/installation/install-by-gem 


```sh
$ gem install fluentd --no-doc
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810214825.png "img")

以下のコマンドを実行して、Fluentdのインストールを確認します。    

```sh
$ fluentd --setup ./fluent
$ fluentd -c ./fluent/fluent.conf -vv &
$ echo '{"json":"message"}' | fluent-cat debug.test
```

2番目のコマンドは、Fluentdをデーモンとして起動します。そのデーモンを停止したい場合には、`$ pkill -f fluentd`とします。      
最後のコマンドは、Fluentdにdebug.testタグ付きのメッセージ  '{"json": "message"}' を送信します。インストールに成功した場合、Fluentdは関連するメッセージを出力します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810214756.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810214806.png "img")


# Fluentd用PostgreSQLプラグインのインストール

Fluentdは、データの入出力のために多くの [plugins](https://www.fluentd.org/plugins) をサポートしています。HologresはPostgreSQL 11に対応していますので、接続には [fluentd-plugin-postgres](https://github.com/uken/fluent-plugin-postgres) を使用することができます。


> https://www.fluentd.org/plugins 

> https://github.com/uken/fluent-plugin-postgres 

ちなみに注意として、PostgreSQLのヘッダを事前にインストールしておかないと、`"checking for libpq-fe.h... no Can't find the 'libpq-fe.h header"`のような関連エラーが発生します。    

```sh
$ yum install postgresql-devel -y
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810215608.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810215619.png "img")


fluentd-plugin-postgresをgemでインストールします。    

```sh
gem install fluent-plugin-postgres
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810215659.png "img")


# Hologresテーブルの準備

Fluentdをはじめ関連データをHologresへ格納するために、既存のHologresインスタンスにテーブルを作成します。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810221036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810221046.png "img")

以下、DDL文でテーブルを生成します。     

```sql
BEGIN;
CREATE TABLE public.book_order (
 "order_id" text NOT NULL,
 "user_id" int8 NOT NULL,
 "book_id" int8 NOT NULL,
 "book_name" text NOT NULL,
 "order_cnt" int8 NOT NULL,
 "order_amt" int8 NOT NULL,
PRIMARY KEY (order_id)
);
CALL SET_TABLE_PROPERTY('public.book_order', 'orientation', 'column');
CALL SET_TABLE_PROPERTY('public.book_order', 'bitmap_columns', 'order_id,book_name');
CALL SET_TABLE_PROPERTY('public.book_order', 'dictionary_encoding_columns', 'order_id:auto,book_name:auto');
CALL SET_TABLE_PROPERTY('public.book_order', 'time_to_live_in_seconds', '3153600000');
CALL SET_TABLE_PROPERTY('public.book_order', 'distribution_key', 'order_id');
CALL SET_TABLE_PROPERTY('public.book_order', 'storage_format', 'orc');
COMMIT;
```

# Fluentdのconfファイルを用意して実行

Fluentdのconfファイルを作成し、PostgreSQLプラグインのテンプレートに合わせて更新します。     

```conf
# In v1 configuration, type and id are @ prefix parameters.
# @type and @id are recommended. type and id are still available for backward compatibility

## built-in TCP input
## $ echo <json> | fluent-cat <tag>
<source>
  @type forward
  @id forward_input
</source>

## match tag=debug.** and dump to console
<match debug.**>
  type postgres
  host <your Hologres instance endpoint>
  port <your Hologres instance port>
  database <your Hologres database name>
  username <your accessKeyId>
  password <your accessKeySecret>
  key_names order_id, user_id, book_id, book_name, order_cnt, order_amt
  sql INSERT INTO book_order (order_id, user_id, book_id, book_name, order_cnt, order_amt) VALUES ($1,$2,$3,$4,$5,$6)
  flush_intervals 5s
</match>

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810221212.png "img")

Fluentdをデーモンとして起動し、関連するjsonを入力してテストします。      


```sh
$ fluentd -c ./holo-demo/fluent.conf -vv &
$ echo '{"order_id":"5761158b-f044-11eb-8be8-706655fcbfda","user_id":39,"book_id":8,"book_name":"天声人语","order_cnt":1,"order_amt":550}' | fluent-cat debug.test
$ echo '{"order_id":"57613ca1-f044-11eb-82e5-706655fcbfda","user_id":13,"book_id":5,"book_name":"容疑者Ⅹの献身","order_cnt":1,"order_amt":200}' | fluent-cat debug.test
$ echo '{"order_id":"57613ca5-f044-11eb-a533-706655fcbfda","user_id":29,"book_id":9,"book_name":"幸せになる勇気","order_cnt":3,"order_amt":1950}' | fluent-cat debug.test
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810221256.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810221307.png "img")


HoloWebにアクセスして、対象のテーブルに更新されたレコードを確認します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810221336.png "img")

以上で、FluentdでHologresへデータ転送を実現しました。    


---

# 最後に

ここまで、FluentdでHologresへデータ転送をする方法を紹介しました。      
この方法を生かすことで、どのサービス基盤でも、Fluentdからリアルタイムデータ収集した後に、Hologresへリアルタイム転送、可視化を実現することができます。     





