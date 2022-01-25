---
title: "基本的なClickHouse接続方法"
metaTitle: "ApsaraDB for ClickHouseへ接続する方法"
metaDescription: "ApsaraDB for ClickHouseへ接続する方法"
date: "2021-07-16"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613787379200/20210716161454.png"
---

## ApsaraDB for ClickHouseへ接続する方法

本記事では、[ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse) で早速使ってみたい方向けに、クイックスタートとして接続方法をご紹介します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210714233458.png "img")


# 1.ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/

---

# 2.DMSでClickHouseを接続する
1）まずはApsaraDB for ClickHouseインスタンスを作成します。       
①VPCを作成      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155113.png "img")

②ClickHouseインスタンスを作成      
著者は以下のインスタンススペックでインスタンスを作成しています。     

> ClickHouse version:20.8.7.15
> Edition：Single-replica Edition

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成       
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続      
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155401.png "img")


4）DBを作成       
下記コマンドでデータベースを作成します      

```
CREATE DATABASE dms_ch_demo;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155428.png "img")


5）テーブルを作成       
①下記コマンドでdms_ch_demoデータベースにsls_test_single_localテーブルを作成します       

```
CREATE TABLE dms_ch_demo.sls_test_single_local on cluster default(
`v1` Int8,
`v2` Int16,
`v3` Int32,
`v4` Int64,
`v5` UInt8,
`v6` UInt16,
`v7` UInt32,
`v8` UInt64,
`v9` Decimal(10, 2),
`v10` Float32,
`v11` Float64,
`v12` String,
`v13` FixedString(10),
`v14` UUID, `v15` Date,
`v16` DateTime,
`v17` Enum8('hello' = 1, 'world' = 2),
`v18` Enum16('hello' = 1, 'world' = 2),
`v19` IPv4,
`v20` IPv6)
ENGINE = MergeTree() PARTITION BY toYYYYMMDD(v16) ORDER BY v4 SETTINGS index_granularity = 8192;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155507.png "img")


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155517.png "img")



備考：EditionがDouble-replica Editionの場合、       
ローカルテーブルのSQL作成例としては次の通りになります：      

```
CREATE TABLE default.sls_test_local ON CLUSTER default (
`v1` Int8,
`v2` Int16,
`v3` Int32,
`v4` Int64,
`v5` UInt8,
`v6` UInt16,
`v7` UInt32,
`v8` UInt64,
`v9` Decimal(10, 2),
`v10` Float32,
`v11` Float64,
`v12` String,
`v13` FixedString(10),
`v14` UUID, `v15` Date,
`v16` DateTime,
`v17` Enum8('hello' = 1, 'world' = 2),
`v18` Enum16('hello' = 1, 'world' = 2),
`v19` IPv4,
`v20` IPv6)
ENGINE = ReplicatedMergeTree('/clickhouse/tables/sls_test_local/{shard}', '{replica}')
PARTITION BY toYYYYMMDD(v16) ORDER BY v4 SETTINGS index_granularity = 8192
```

②分散テーブルを作成       
ClickHouseは分散テーブル機能があり、それを使うことでデータの書き込みとクエリのパフォーマンスが飛躍的に向上するため便利です         　

```
CREATE TABLE sls_test_single_d ON CLUSTER default as dms_ch_demo.sls_test_single_local ENGINE = Distributed(default, default, sls_test_single_local, rand());
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155656.png "img")


備考：EditionがDouble-replica Editionの場合、     
分散テーブルのSQL作成例としては次の通りになります：      

```
CREATE TABLE sls_test_d ON CLUSTER default as sls_test_local ENGINE = Distributed(default, default, sls_test_local, rand());
```


---
  
# 3.ClickHouseコマンドラインツールでClickHouseへ接続
## 3-1.接続、踏み台となるECSを用意

①ECSを作成します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155808.png "img")


②作成したばかりのECSへログインします     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716155819.png "img")


## 3-2.ECSでClickHouse Client環境を設定する
1）ClickHouse Clientのインストールファイルをダウンロードします。[AlibabaCloudのHelpページ](https://www.alibabacloud.com/cloud-tech/doc-detail/301716.htm)からダウンロードしてインストールします。     

①下記AlibabaCloud Helpページのリンクを開きます     
[Use the CLI of ApsaraDB for ClickHouse to connect to a cluster](https://www.alibabacloud.com/cloud-tech/doc-detail/301716.htm)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/08_Download_Client_01.png "img")

②clickhouse-clientのダウンロードファイルリンクを確認します     
[clickhouse-client download url](https://clickhouse-release.oss-cn-shanghai.aliyuncs.com/doc-data/clickhouse-client.zip)

> Click House version :20.8.7.15      
 
②ECSで19.15.2.2のclickhouse-clientファイルをダウンロードします。     

```
wget https://clickhouse-release.oss-cn-shanghai.aliyuncs.com/doc-data/clickhouse-client.zip

```
 
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/08_Download_Client_02.png "img")

2）clickhouse-client.zipを解凍します
 
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/08_Download_Client_03.png "img")


3）Clientでclickhouseへ接続する       
①接続先となるApsaraDB for ClickHouseの接続情報を確認します。コンソール側から確認することができます。    

```
Cluster ID: cc-0iw4v4hezq9lw9333
VPC Endpoint:cc-0iw4v4hezq9lw9333.ads.aliyuncs.com
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160306.png "img")


②clickhouseコンソール画面にECSのPrivateIPをホワイトリストに追加します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160325.png "img")



③clickhouse-clientでclickhouseへ接続します（VPC connection）    

```
clickhouse-client --multiline --host=cc-0iw4v4hezq9lw9333.ads.aliyuncs.com --port=3306 --user=sbtest --password=********
```
 
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/08_Download_Client_04.png "img")


④下記コマンドでデータベースを作成します    

```
CREATE DATABASE client_demo_ch;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160434.png "img")

⑤下記コマンドでテーブルを作成します。    

```
CREATE TABLE client_demo_local ON CLUSTER default
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

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160513.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160521.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160530.png "img")



⑥下記コマンドで分散テーブルを作成します    

```
CREATE TABLE client_demo_distributed ON CLUSTER default AS client_demo_local
ENGINE = Distributed(default, default, client_demo_local, rand());
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160554.png "img")


⑦テーブルを表示します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160608.png "img")

これでClickHouseコマンドラインツールでClickHouseへ接続は以上です。

---

# 4.JDBC方法でClickHouseを接続する

1）IntelliJ IDEAでMavenプロジェクトを作成     
前提条件：IntelliJ IDEAを立ち上げ、準備すること     

①IntelliJ IDEAを起動します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160747.png "img")


②File-Settings-MavenでMaven設定画面を開きます    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160758.png "img")


③Mavenホームディレクトリをインストールパスに設定します。なお、他は基本デフォルトとしてそのままに設定します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160842.png "img")

④File-New-Projectでプロジェクトを作成します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160913.png "img")


⑤プロジェクトを設定     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160930.png "img")


⑥プロジェクト名を設定     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716160945.png "img")

⑦Mavenホームディレクトリをインストールパスに設定     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161004.png "img")

⑧DarchetypeCatalog=internalを追加     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161022.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161031.png "img")


⑨Mavenプロジェクトが作成されるので、下記プロジェクトフォルダを作成します      

```
src/main/java
src/main/resources
src/test/java
src/test/resources
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161101.png "img")


⑩フォルダを選択し、右クリックメニューからMark Directory Asを下記のようにリンク設定します      

```
src/main/java → Sources Root
src/main/resources → Resources Root
src/test/java → Test Sources Root
src/test/resources →  Test Resources Root
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161140.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161151.png "img")


⑪Projectを右クリックメニューのOpenModuleSettingsメニューをクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161211.png "img")



⑫ディレクトリのマッピング関係を確認するようになります     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161238.png "img")


2）ClickHouse driver packageをPOM.xmlに追加します    

```
    <dependency>
      <groupId>ru.yandex.clickhouse</groupId>
      <artifactId>clickhouse-jdbc</artifactId>
      <version>0.3.1</version>
    </dependency>
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161301.png "img")


```pom.xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>org.example</groupId>
  <artifactId>jdbc_clickhouse_demo</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>

  <name>jdbc_clickhouse_demo Maven Webapp</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>ru.yandex.clickhouse</groupId>
      <artifactId>clickhouse-jdbc</artifactId>
      <version>0.3.1</version>
    </dependency>

    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-simple</artifactId>
      <version>1.7.25</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-api</artifactId>
      <version>1.5.6</version>
      <type>jar</type>
    </dependency>

    <dependency>
      <groupId>slf4j-simple</groupId>
      <artifactId>slf4j-simple</artifactId>
      <version>1.5.2</version>
    </dependency>
  </dependencies>

  <build>
    <finalName>jdbc_clickhouse_demo</finalName>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
      <plugins>
        <plugin>
          <artifactId>maven-clean-plugin</artifactId>
          <version>3.1.0</version>
        </plugin>
        <!-- see http://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_war_packaging -->
        <plugin>
          <artifactId>maven-resources-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.8.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>2.22.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-war-plugin</artifactId>
          <version>3.2.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-install-plugin</artifactId>
          <version>2.5.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-deploy-plugin</artifactId>
          <version>2.8.2</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>
```

3）src/test/javaにMain4.javaを追加し、実行    

Public IP AddressをHostに設定します。この時、passwordを正しく設定する必要があります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161354.png "img")


```Main4.java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Main4 {
    private static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private static final SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat(DATE_FORMAT);

    public static void main(String[] args) throws ClassNotFoundException, SQLException, InterruptedException, ParseException {
        String url = "cc-0iw4v4hezq9lw9333o.ads.aliyuncs.com";
        String username = "sbtest";
        String password = "********";

        Class.forName("ru.yandex.clickhouse.ClickHouseDriver");
        String connectionStr = "jdbc:clickhouse://" + url + ":8123";

        try (Connection connection = DriverManager.getConnection(connectionStr, username, password);
             Statement stmt = connection.createStatement()) {

            {
                String createTableDDL = "create table jdbc_demo_table on cluster default " +
                        "(id UInt32, " +
                        "dt_str String, " +
                        "dt_col DateTime) " +
                        "ENGINE = MergeTree()" +
                      //  "engine=ReplicatedMergeTree('/clickhouse/tables/test_table/{shard}', '{replica}')" +
                        "partition by toYYYYMM(dt_col)" +
                        "order by (id)" +
                        "primary key (id)" +
                        "sample by (id)" +
                        "settings index_granularity = 8192;";
                stmt.execute(createTableDDL);
                System.out.println("create local table done.");
            }
            {
                String createTableDDL = "create table jdbc_demo_dist on cluster default " +
                        "as default.jdbc_demo_table " +
                        "engine=Distributed(default, default, jdbc_demo_table, rand());";
                stmt.execute(createTableDDL);
                System.out.println("create distributed table done");
            }

            System.out.println("write 100000 rows...");
            long startTime = System.currentTimeMillis();

            // Write 10 batch
            for (int batch = 0; batch < 10; batch++) {
                StringBuilder sb = new StringBuilder();

                // Build one batch
                sb.append("insert into jdbc_demo_dist values(" + (batch * 10000) + ", '2020-02-19 16:00:00', '2020-02-19 16:00:00')");
                for (int row = 1; row < 10000; row++) {
                    sb.append(", (" + (batch * 10000 + row) + ", '2020-02-19 16:00:00', '2020-02-19 16:00:00')");
                }

                // Write one batch: 10000 rows
                stmt.execute(sb.toString());
            }

            long endTime = System.currentTimeMillis();
            System.out.println("total time cost to write 10W rows: " + (endTime - startTime) + "ms");

            Thread.sleep(2 * 1000);

            System.out.println("Select count(id)...");
            try (ResultSet rs = stmt.executeQuery("select count(id) from jdbc_demo_dist");) {
                while (rs.next()) {
                    int count = rs.getInt(1);
                    System.out.println("id count: " + count);
                }
            }

            try (ResultSet rs = stmt.executeQuery("select id, dt_str, dt_col from jdbc_demo_dist limit 10");) {
                while (rs.next()) {
                    int id = rs.getInt(1);
                    String dateStr = rs.getString(2);
                    Timestamp time = rs.getTimestamp(3);

                    String defaultDate = SIMPLE_DATE_FORMAT.format(new Date(time.getTime()));
                    System.out.println("id: " + id
                            + ", date_str:" + dateStr
                            + ", date_col:" + defaultDate);
                }
            }
        }
    }
}
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161426.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161434.png "img")


4）DMSにてJDBCで作成したテーブルを確認します       

```
SELECT * FROM `jdbc_demo_table` LIMIT 20;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161454.png "img")


```
SELECT * FROM `jdbc_demo_dist` LIMIT 20;
```


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613787379200/20210716161508.png "img")


これでJDBC方法でClickHouseへ接続は以上です。     


---
# 最後に

ここまで、ClickHouseへ三つの接続方法を紹介しました。    
この手法のほか、BI Tool（Grafana、re:dash、Superset、Tableauなどによる接続もありますので、そちらも参考にしてみてください。     




