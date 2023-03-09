---
title: "GrafanaでClickHouseを可視化"
metaTitle: "GrafanaでClickHouseデータを可視化"
metaDescription: "GrafanaでClickHouseデータを可視化"
date: "2021-07-29"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613791699500/20210729140725.png"
---

## GrafanaでClickHouseデータを可視化

本記事では、[ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse) のデータをGrafanaで可視化する方法をご紹介します。     
Grafanaは、Grafana Labs が公開しているログ・データ可視化のためのツールです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210714233458.png "img")

# ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/


# Grafanaとは
オープンソースのログ・データ可視化ツールです。 類似サービスとしてはElastic の kibana とほぼ同じようなものです。

> https://grafana.com/

> https://qiita.com/Chanmoro/items/a23f0408f0e64658a775


# 1.ECSでClickHouseClientの準備
## 1-1.ClickHouseインスタンスを準備します

この手法は[過去の記事](https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start)でも記載していますが、再掲として記載します。

> https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start

1）まずはApsaraDB for ClickHouseインスタンスを作成します。     
①VPCを作成     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210716155113.png "img")

②ClickHouseインスタンスを作成     
著者は以下のインスタンススペックでインスタンスを作成しています。    

> ClickHouse version:20.8.7.15     
> Edition：Single-replica Edition    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成       
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続       
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210716155401.png "img")



## 1-2.ECSを用意
①ECSを作成します

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729135942.png "img")

②ECSをログインします

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729135923.png "img")



## 1-3.ECSでClickHouse Client環境を設定

1）ClickHouse Clientのインストールファイルをダウンロードします     
①下記のリンクを開きます     
Click house version :20.8.7.15     

[Click house download](https://packagecloud.io/altinity/clickhouse?page=2)    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140007.png "img")

②20.8.3.18のインストールファイルをダウンロードします     

```
wget --content-disposition https://packagecloud.io/Altinity/clickhouse/packages/el/7/clickhouse-server-common-20.8.3.18-1.el7.x86_64.rpm/download.rpm
wget --content-disposition https://packagecloud.io/Altinity/clickhouse/packages/el/7/clickhouse-server-20.8.3.18-1.el7.x86_64.rpm/download.rpm
wget --content-disposition https://packagecloud.io/Altinity/clickhouse/packages/el/7/clickhouse-common-static-20.8.3.18-1.el7.x86_64.rpm/download.rpm
wget --content-disposition https://packagecloud.io/Altinity/clickhouse/packages/el/7/clickhouse-client-20.8.3.18-1.el7.x86_64.rpm/download.rpm
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140030.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140037.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140045.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140053.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140101.png "img")


２）下記のコマンドでクライアントをインストールします

```
rpm -ivh *.rpm
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140121.png "img")


3）clickhouseをclient接続        
①clickhouse接続情報を確認します      

```
Cluster ID: cc-0iw4v4hezq9lw9333
VPC Endpoint:cc-0iw4v4hezq9lw9333.ads.aliyuncs.com
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140134.png "img")

②clickhouseコンソール画面にECSのPrivateIPをホワイトリストに追加します

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140146.png "img")

③clickhouse-clientでclickhouseを接続します（VPC connection）

```
clickhouse-client --multiline --host=cc-0iw4v4hezq9lw9333.ads.aliyuncs.com --port=3306 --user=sbtest --password=********
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140202.png "img")


# 2.ローカルファイルをClickHouseにインポート
## 2-1.ローカルファイルを用意
①下記コマンドでデータをダウンロードします     

```
wget https://clickhouse-release.oss-cn-shanghai.aliyuncs.com/doc-data/ontime-data.zip
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140217.png "img")

②unzipコマンドをインストール

```
yum install -y zip unzip
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140229.png "img")

③データを解凍
```
unzip ontime-data.zip;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140241.png "img")

## 2-2.ClickHouseにデーブルを作成

①下記コマンドでローカルテーブルを作成     

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

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140300.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140309.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140319.png "img")


②下記コマンドで分散テーブルを作成
```
CREATE TABLE ontime_distributed ON CLUSTER default AS ontime_local
ENGINE = Distributed(default, default, ontime_local, rand());
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140334.png "img")

③テーブルを表示

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140434.png "img")

# 2-3.ローカルファイルをClickHouseにインポート
①下記コマンドでローカルファイルontime-data.csvをClickHouseにインポート      

```
clickhouse-client --host=cc-0iw4v4hezq9lw9333.ads.aliyuncs.com --port=3306 --user=sbtest --password=****** --query="INSERT INTO ontime_distributed FORMAT CSVWithNames" < ontime-data.csv;
```

備考：     
・パスワードを正しく設定すること         
・ダウンロードファイルontime-data.csvが変わる可能性があるので、ontime-data.csvのカラムと上記ターゲットテーブルのパラメータが一致していること      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140452.png "img")

②Clickhouseに接続し、データを検索します     

```Sql1
SELECT
    OriginCityName,
    DestCityName,
    count(*) AS flights,
    bar(flights, 0, 20000, 40)
FROM ontime_distributed
WHERE Year = 1988
GROUP BY OriginCityName, DestCityName
ORDER BY flights
DESC LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140535.png "img")

③データを検索します      

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

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140551.png "img")

④データを検索します      

```Sql3
SELECT
    OriginCityName,
    count(*) AS flights
FROM ontime_distributed
GROUP BY OriginCityName
ORDER BY flights
DESC LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140606.png "img")

# 3.Grafana環境の準備 

1）ECSにてGrafanaをインストールします    

```
# mkdir grafana
# cd grafana
# wget https://dl.grafana.com/oss/release/grafana-6.5.2-1.x86_64.rpm
# yum install grafana-6.5.2-1.x86_64.rpm
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140621.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140632.png "img")


2）ClickHouse Grafanaプラグインのインストール      
grafana-cliでClickHouse Grafanaプラグインをインストールします     

```
grafana-cli plugins install vertamedia-clickhouse-datasource
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140649.png "img")

3）Grafanaを起動し、Grafanaのステータスを確認します    

```
# systemctl start grafana-server.service
# systemctl status grafana-server.service
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140700.png "img")

# 4.GrafanaでClickHouseデータ可視化
## 4-1.ClickHouseデータソースを設定します

1）Grafana登録      
①ECSセキュリティグループにポート3000を追加します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140713.png "img")

フォーマット：
```
url:IP:3000
ID/password:admin/admin
```

②登録URL：該当ECSのIPは47.245.11.176です。      
そのため、GrafanaのURLは`47.245.11.176:3000` です。         

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140725.png "img")

③IDとPasswordを入力し、ログインします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140736.png "img")


④初回ログインする場合、パスワードをリセットする必要があります。       
まずはGrafana画面が表示されますので、対応します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140748.png "img")

2）GrafanaでClickHouseデータソースを設定します。      
①「add data source」をクリック        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140800.png "img")

②Clickhouseを検索      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140812.png "img")

③Clickhouseのselectメニューをクリック      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140825.png "img")

④Clickhouseデータソースの設定画面が表示されます

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140839.png "img")

⑤Clickhouseデータソースを設定します        
* ECSとClickhouseは同じVPCにあるため、VPC Endpointで接続します      
* 事前に、ClickhouseのWhitelist に ECS の PrivateIP を設定する必要があります       

```
url:http://cc-0iw4v4hezq9lw9333.ads.aliyuncs.com:8123
Basic auth:clickhouse account id and password
Default database:default
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140851.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729140912.png "img")

## 4-2.dashboardを設定      
1）dashboardを設定します      
①DMSでClickhouseのdefaultデータベースに下記コマンドを実行します        

```ontime_distributed合計数
SELECT count(*) FROM `ontime_distributed`;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729141044.png "img")

②dashboard homeをクリック        
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729141054.png "img")

③dashboardを作成     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729141105.png "img")

④「Add query」をクリック      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729141116.png "img")

⑤dashboardを設定します     
**備考：「;」マークは入力しません。**       

```
Query:ClickHouse
A:SELECT count(*) FROM `ontime_distributed`
Format as: Table
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729141129.png "img")

⑥Visualizationを設定します     

```
Visualization:Singlestat
Show:First
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729141142.png "img")


⑦generalを設定      
TitleとDescriptionを設定します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729142622.png "img")

⑧Dashboardを確認します   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729142639.png "img")


2）その他Dashboardを設定します     
①DMSでClickhouseのdefaultデータベースに下記コマンドを実行      
```
SELECT
    OriginCityName,
    DestCityName,
    count(*) AS flights,
    bar(flights, 0, 20000, 40)
FROM ontime_distributed
WHERE Year = 1988
GROUP BY OriginCityName, DestCityName
ORDER BY flights
DESC LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729142653.png "img")

②dashboard Panelを追加します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729142703.png "img")

③下記コマンドをQueryに入力します     

```
Query:ClickHouse
A:SELECT OriginCityName, DestCityName, count(*) AS flights,bar(flights, 0, 20000, 40) FROM ontime_distributed WHERE Year = 1988 GROUP BY OriginCityName, DestCityName ORDER BY flights DESC LIMIT 20
Format as: Table
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729142713.png "img")

④Visualizationの設定        
Tableを選択します       

```
Visualization:Table
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729142723.png "img")

⑤Generalの設定        
TitleとDescriptionを設定します         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729142733.png "img")

⑥編集したDashboardを確認     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613791699500/20210729142743.png "img")



---

# 最後に

ここまで、GrafanaでClickHouseデータを可視化する方法を紹介しました。      
ApsaraDB for ClickHouseはGrafanaとスムーズに連携できるので、Elasticsearch - kibanaのような可視化ソリューションとして仕上げることもできます。     