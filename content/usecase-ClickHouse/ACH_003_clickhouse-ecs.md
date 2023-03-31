---
title: "ECSからClickHouseへ接続"
metaTitle: "ECSからApsaraDB for ClickHouseへデータ連携する方法"
metaDescription: "ECSからApsaraDB for ClickHouseへデータ連携する方法"
date: "2021-07-16"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613787433100/007.png"
---

## ECSからApsaraDB for ClickHouseへデータ連携する方法

本記事では、[ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse) で 早速使ってみたい方向けに、クイックスタートとして ECSからデータ連携する方法をご紹介します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210714233458.png "img")

ECS - ClickHouseのデータ連携方法を記載します。構成図は次の通りです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/007.png "img")


# 1.ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。      
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/


---

# 1.ClickHouseを準備する
## 1-1.ClickHouseインスタンスを準備する
この手法は[過去の記事](https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start)でも記載していますが、再掲として記載します。

> https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start


1）まずはApsaraDB for ClickHouseインスタンスを作成します。     
①VPCを作成     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155113.png "img")

②ClickHouseインスタンスを作成     
著者は以下のインスタンススペックでインスタンスを作成しています。     

> ClickHouse version:20.8.7.15
> Edition：Single-replica Edition

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成     
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続     
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155401.png "img")



## 1-2. 接続、踏み台となるECSを用意

①ECSを作成します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155808.png "img")


②作成したばかりのECSへログインします     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716155819.png "img")


## 1-3.ECSでClickHouse Client環境を設定します
1）ClickHouse Clientのインストールファイルをダウンロードします。[AlibabaCloudのHelpページ](https://www.alibabacloud.com/cloud-tech/doc-detail/301716.htm)からダウンロードしてインストールします。     

①下記AlibabaCloud Helpページのリンクを開きます     
[Use the CLI of ApsaraDB for ClickHouse to connect to a cluster](https://www.alibabacloud.com/cloud-tech/doc-detail/301716.htm)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/08_Download_Client_01.png "img")

②clickhouse-clientのダウンロードファイルリンクを確認します     
[clickhouse-client download url](https://clickhouse-release.oss-cn-shanghai.aliyuncs.com/doc-data/clickhouse-client.zip)

> Click House version :20.8.7.15      
 
②ECSで19.15.2.2のclickhouse-clientファイルをダウンロードします。     

```
wget https://clickhouse-release.oss-cn-shanghai.aliyuncs.com/doc-data/clickhouse-client.zip

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/08_Download_Client_02.png "img")

2）clickhouse-client.zipを解凍します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/08_Download_Client_03.png "img")

3）Clientでclickhouseへ接続     
①接続先となるApsaraDB for ClickHouseの接続情報を確認します。コンソール側から確認することができます。     

```
Cluster ID: cc-0iw4v4hezq9lw9333
VPC Endpoint:cc-0iw4v4hezq9lw9333.ads.aliyuncs.com
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716160306.png "img")


②clickhouseコンソール画面にECSのPrivateIPをホワイトリストに追加します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716160325.png "img")



③clickhouse-clientでclickhouseへ接続します（VPC connection）

```
clickhouse-client --multiline --host=cc-0iw4v4hezq9lw9333.ads.aliyuncs.com --port=3306 --user=sbtest --password=********
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/08_Download_Client_04.png "img")



# 2.ローカルファイルをClickHouseにインポート
## 2-1.ローカルファイルを用意します     
①下記コマンドでCSVサンプルデータをダウンロードします     

```
wget https://clickhouse-release.oss-cn-shanghai.aliyuncs.com/doc-data/ontime-data.zip
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201241.png "img")


②unzipコマンドをインストールします     

```
yum install -y zip unzip
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201300.png "img")

③データを解凍します     
```
unzip ontime-data.zip;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201311.png "img")


## 2-2.ClickHouseにデーブルを作成

①下記コマンドでローカルテーブルを作成します     
```
CREATE TABLE ontime_local ON CLUSTER default
(
    Year UInt16,
    Quarter UInt8,
    Month UInt8,
    DayofMonth UInt8,
    DayOfWeek UInt8,
    FlightDate Date,
    UniqueCarrier FixedString(7),
    AirlineID Int32,
    Carrier FixedString(2),
    TailNum String,
    FlightNum String,
    OriginAirportID Int32,
    OriginAirportSeqID Int32,
    OriginCityMarketID Int32,
    Origin FixedString(5),
    OriginCityName String,
    OriginState FixedString(2),
    OriginStateFips String,
    OriginStateName String,
    OriginWac Int32,
    DestAirportID Int32,
    DestAirportSeqID Int32,
    DestCityMarketID Int32,
    Dest FixedString(5),
    DestCityName String,
    DestState FixedString(2),
    DestStateFips String,
    DestStateName String,
    DestWac Int32,
    CRSDepTime Int32,
    DepTime Int32,
    DepDelay Int32,
    DepDelayMinutes Int32,
    DepDel15 Int32,
    DepartureDelayGroups String,
    DepTimeBlk String,
    TaxiOut Int32,
    WheelsOff Int32,
    WheelsOn Int32,
    TaxiIn Int32,
    CRSArrTime Int32,
    ArrTime Int32,
    ArrDelay Int32,
    ArrDelayMinutes Int32,
    ArrDel15 Int32,
    ArrivalDelayGroups Int32,
    ArrTimeBlk String,
    Cancelled UInt8,
    CancellationCode FixedString(1),
    Diverted UInt8,
    CRSElapsedTime Int32,
    ActualElapsedTime Int32,
    AirTime Int32,
    Flights Int32,
    Distance Int32,
    DistanceGroup UInt8,
    CarrierDelay Int32,
    WeatherDelay Int32,
    NASDelay Int32,
    SecurityDelay Int32,
    LateAircraftDelay Int32,
    FirstDepTime String,
    TotalAddGTime String,
    LongestAddGTime String,
    DivAirportLandings String,
    DivReachedDest String,
    DivActualElapsedTime String,
    DivArrDelay String,
    DivDistance String,
    Div1Airport String,
    Div1AirportID Int32,
    Div1AirportSeqID Int32,
    Div1WheelsOn String,
    Div1TotalGTime String,
    Div1LongestGTime String,
    Div1WheelsOff String,
    Div1TailNum String,
    Div2Airport String,
    Div2AirportID Int32,
    Div2AirportSeqID Int32,
    Div2WheelsOn String,
    Div2TotalGTime String,
    Div2LongestGTime String,
    Div2WheelsOff String,
    Div2TailNum String,
    Div3Airport String,
    Div3AirportID Int32,
    Div3AirportSeqID Int32,
    Div3WheelsOn String,
    Div3TotalGTime String,
    Div3LongestGTime String,
    Div3WheelsOff String,
    Div3TailNum String,
    Div4Airport String,
    Div4AirportID Int32,
    Div4AirportSeqID Int32,
    Div4WheelsOn String,
    Div4TotalGTime String,
    Div4LongestGTime String,
    Div4WheelsOff String,
    Div4TailNum String,
    Div5Airport String,
    Div5AirportID Int32,
    Div5AirportSeqID Int32,
    Div5WheelsOn String,
    Div5TotalGTime String,
    Div5LongestGTime String,
    Div5WheelsOff String,
    Div5TailNum String
)ENGINE = MergeTree()
 PARTITION BY toYYYYMM(FlightDate)
 PRIMARY KEY (intHash32(FlightDate))
 ORDER BY (intHash32(FlightDate),FlightNum)
 SAMPLE BY intHash32(FlightDate)
SETTINGS index_granularity= 8192 ;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201330.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201340.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201350.png "img")


②下記コマンドで分散テーブルを作成     
```
CREATE TABLE ontime_distributed ON CLUSTER default AS ontime_local
ENGINE = Distributed(default, default, ontime_local, rand());
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201412.png "img")

③テーブルを表示
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201421.png "img")


## 2-3.ローカルファイルをClickHouseにインポート
①下記コマンドでローカルファイルontime-data.csvをClickHouseにインポートします     

```
clickhouse-client --host=cc-0iw4v4hezq9lw9333.ads.aliyuncs.com --port=3306 --user=sbtest --password=****** --query="INSERT INTO ontime_distributed FORMAT CSVWithNames" < ontime-data.csv;
```

備考：
> ・パスワードを正しく設定
> ・ダウンロードファイルontime-data.csvが変わる可能性が’あるので、ontime-data.csvのカラムと上記ターゲットテーブルのパラメータが一致していること

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201533.png "img")

②Clickhouseに接続し、データを検索してみる     
```Sql1
SELECT
    OriginCityName,
    DestCityName,
    count(*) AS flights,bar(flights, 0, 20000, 40)
FROM ontime_distributed
WHERE Year = 1988
GROUP BY OriginCityName, DestCityName
ORDER BY flights DESC LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201545.png "img")

③データを検索
```Sql2
SELECT
    OriginCityName < DestCityName ? OriginCityName : DestCityName AS a,
    OriginCityName < DestCityName ? DestCityName : OriginCityName AS b,
    count(*) AS flights,
    bar(flights, 0, 40000, 40)
FROM ontime_distributed
WHERE Year = 1988
GROUP BY a, b
ORDER BY flights
DESC LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201555.png "img")

④データを検索
```Sql3
SELECT
    OriginCityName,
    count(*) AS flights
FROM ontime_distributed
GROUP BY OriginCityName
ORDER BY flights
DESC LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201608.png "img")

# 3.DMSでClickHouseデータを確認
1）DMSでClickHouseデータを確認します     
①ローカルテーブルで検索     
```
SELECT
    *
FROM `ontime_local`
LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201619.png "img")

②分散テーブルで検索     
```
SELECT
    *
FROM `ontime_distributed`
LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787433100/20210716201632.png "img")



---
# 最後に

ここまで、ECS（orローカル） - ClickHouseのデータ連携方法を紹介しました。     
ClickHouseはMySQLベースのSQL構文でCSVファイルのインポートや分析処理が出来ますので、MySQLを参考に色々試すと良いです。     


