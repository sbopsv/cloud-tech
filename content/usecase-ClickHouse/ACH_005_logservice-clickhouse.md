---
title: "LogServiceからClickHouse連携"
metaTitle: "LogServiceからApsaraDB for ClickHouseへデータ連携する方法"
metaDescription: "LogServiceからApsaraDB for ClickHouseへデータ連携する方法"
date: "2021-07-21"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613789044600/002.png"
---

## LogServiceからApsaraDB for ClickHouseへデータ連携する方法

本記事では、LogServiceから[ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse)へデータ連携する方法をご紹介します。    
LogServiceは、AlibabaCloudが提供する低コストでリアルタイムログ収集から各種ログの一元管理を行うプラットフォームです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210714233458.png "img")

# ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/

少し前になりますが、LogServiceについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。

> https://www.slideshare.net/sbopsv/alibaba-cloud-log-service


# LogService - ApsaraDB for ClickHouse データ連携について
LogService - ClickHouseのデータ連携方法を記載します。LogServiceのログ配信機能を使用して、LogServiceからClickHouseにデータをインポートします。構成図は次の通りです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/002.png "img")


# 前提条件
* Alibaba Cloudのアカウントを持っている    
* 同一リージョンにある LogService とApsaraDB for ClickHouse を有効化している     
* ApsaraDB for ClickHouse でテーブルが作成できる状態になってる     

---

# 1.ClickHouseを準備する
## 1-1.ClickHouseインスタンスを準備する

この手法は[過去の記事](https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start)でも記載していますが、再掲として記載します。

> https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start

1）まずはApsaraDB for ClickHouseインスタンスを作成します。     
①VPCを作成     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210716155113.png "img")

②ClickHouseインスタンスを作成         
著者は以下のインスタンススペックでインスタンスを作成しています。       

> ClickHouse version:20.8.7.15
> Edition：Single-replica Edition

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成        
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続       
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210716155401.png "img")


# 2.LogServiceでデータ蓄積ら準備をします       
## 2-1.LogServiceのプロジェクト作成     
1）AlibabaCloudサイトをログインし、コンソール画面にLogServiceをクリックします。       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151619.png "img")

2）プロジェクトを作成       
①LogServiceコンソール上から「プロジェクト作成」をクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151608.png "img")

②Clickhouseと同じリージョンを設定します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151558.png "img")

③プロジェクトを作成完了します       
ここで、project名は `logclickhouse` にしています。       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151723.png "img")

3）Logstoreを作成        
Logstore名は `ch-logstore` にしています。       

①「OK」をクリックすると、Logstore設定画面が表示されます       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151754.png "img")

②Web Trackingを「ON」にすることで、Logstoreが作成されます     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151805.png "img")

4）DataImportを設定します      

①Web TrackingImportを選択します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151818.png "img")

②データソースを確認します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151833.png "img")

③Queryと分析を確認します       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151845.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151854.png "img")

④ DataImportを作成完了します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151919.png "img")

⑤LogStoreを確認します       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151931.png "img")

## 2-2.ログをLogstoreにアップロードする場合について       
1）HTTPGetを使ってログデータをLogStoreにアップロードする場合        

①HTTPGetのフォーマットは次の通りになります      
```
curl --request GET 'http://${project}.${host}/logstores/${logstore}/track?APIVersion=0.6.0&key1=val1&key2=val2'
```
・hostはプロジェクトの概要画面に確認することができます        
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721151945.png "img")

①ECSをログインし、下記curl.shスクリプトを作成します      

```curl.sh
for i in {1..20}
do
    curl --request GET "http://logclickhouse.ap-northeast-1.log.aliyuncs.com/logstores/ch-logstore/track?APIVersion=0.6.0&__topic__=testforclickhouse&key1=centos&key2=$i"
done
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721153056.png "img")


②下記curl.shを実行し、ログデータを生成します        
```
# sh curl.sh
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152016.png "img")


③ログデータを確認する       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152027.png "img")

# 3.LogServiceのデータをClickHouseへインポート
## 3-1.ClickHouseでターゲットテーブルを作成します

1）DMSでClickhouseへ接続します    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152042.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152051.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152101.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152113.png "img")


2）データベースを作成します  

```
create database if not exists log_clickhouse_demo ON CLUSTER default;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152132.png "img")

3）ローカルテーブルを作成します      

```
CREATE TABLE log_clickhouse_demo.log_single_local on cluster default(
    `time` Nullable(DATETIME),
    `__source__` IPv4,
    `__tag__:__client_ip__` IPv4,
    `__receive_time__` Nullable(String),
    `__topic__` String,
    `key1` String,
    `key2` String
)
ENGINE = MergeTree()
ORDER BY __source__ SETTINGS index_granularity = 8192;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152149.png "img")

4）分散テーブルを作成します     
```
CREATE TABLE log_single_distribute
    ON CLUSTER default as log_clickhouse_demo.log_single_local
    ENGINE = Distributed(default,log_clickhouse_demo,log_single_local,rand());
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152206.png "img")


## 3-1.ClickHouseでLog Deliveryタスクを作成します
Log Deliveryは、LogServiceからClickHouseへログを配信する機能です。      

> https://www.alibabacloud.com/cloud-tech/doc-detail/170130.htm

1）Log Deliveryタスクを作成します       
①Clickhouseインスタンスをクリックし、Log Deliveryというメニューをクリックします      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152219.png "img")

②「CreateLogDeliveryTask」メニューをクリックします    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152230.png "img")

③LogDeliveryTaskを設定します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152244.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152254.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152304.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152313.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152321.png "img")



2）Step 2-2を繰り返し、ログをLogstoreに再度アップロードします        

①下記curl.shを実行し、ログデータを生成します      

```
# sh curl.sh
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152335.png "img")

②ログデータを確認します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152344.png "img")

## 3-2.ClickHouseでログデリバリーを確認します

①ログデータを確認します    

```
SELECT
    *
FROM `log_single_distribute`
LIMIT 20;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152355.png "img")

```
SELECT
    *
FROM `log_single_local`
LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210721152407.png "img")



---

# 最後に

ここまで、LogService - ClickHouseのデータ連携方法を紹介しました。    
ApsaraDB for ClickHouseはAlibaba Cloudの様々なプロダクトサービスとシームレスに連携することが出来るので、LogServiceでデータを収集し、ClickHouseで圧縮しながら可視化するのも有効だと思います。（その方が、LogService側でデータを保持するよりずっと安く抑えられます）





