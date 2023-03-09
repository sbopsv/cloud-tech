---
title: "ApacheSparkからClickHouse連携"
metaTitle: "Apache SparkからClickHouseへデータをリアルタイム格納する方法"
metaDescription: "Apache SparkからClickHouseへデータをリアルタイム格納する方法"
date: "2021-08-24"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613794178500/20210824160415.png"
---

## Apache SparkからClickHouseへデータをリアルタイム格納する方法

本記事では、Apache Sparkから[ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse) へリアルタイ
ムでデータ連携する方法をご紹介します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210714233458.png "img")


# ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/


# Apache Sparkとは
オープンソースのビッグデータと機械学習のための非常に高速な分散処理フレームワークです。 Apache SparkはE-MapReduceやDataLake Analytics、MaxComputeなどにて付帯しています。

> https://spark.apache.org/


少し前になりますが、Apache Sparkを含む、E-MapReduceについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。

> https://www.slideshare.net/sbopsv/alibabacloudemapreduce-231725148



本記事では、Apache SparkからClickHouseへデータをリアルタイム格納してみます。構成図は次の通りです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824160415.png "img")


# 1.ClickHouseClientの準備
## 1-1.ClickHouseインスタンスを準備します

この手法は[過去の記事](https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start)でも記載していますが、再掲として記載します。

> https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start

1）まずはApsaraDB for ClickHouseインスタンスを作成します。    
①VPCを作成    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210716155113.png "img")

②ClickHouseインスタンスを作成    
著者は以下のインスタンススペックでインスタンスを作成しています。    

> ClickHouse version:20.8.7.15
> Edition：Single-replica Edition

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成    
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続    
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210716155401.png "img")




# 2. Apache Spark環境の準備

## 2-1.IntelliJ IDEAをインストールします。（具体的な説明は本記事では省略）
1）IntelliJ IDEAを起動します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823200105.png "img")


## 2-2.IntelliJ IDEAでSBTプラグインをインストールします

1）下記リンクからSBTプラグインをダウンロードします    

> https://plugins.jetbrains.com/plugin/5007-sbt/versions

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823200143.png "img")


2）ダウンロードされたSBTzipファイルをIntelliJ IDEAのプラグインフォルダに置き、SBTプラグインをインストールします    
① メニューバー [File] > [Settings] を開きます    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823200247.png "img")


②Pluginsを選択し、Install Plugin from Disk設定メニューをクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823200301.png "img")


③プラグインを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823204600.png "img")


④SBTプラグインが表示されるのを確認します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823204623.png "img")


⑤IDEを再起動します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823204644.png "img")

⑥SBTプラグインがインストールされます    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823204702.png "img")

## 2-3.SBTインストール
SBTインストール をします。この手順はWindows環境での実行となります。    
著者はMacを持っていないため、お手数ですがネットなどの情報を参考に構築いただければ幸いです。    
1）下記リンクからsbt-1.3.8.zipをローカルにダウンロードします    

> https://www.scala-sbt.org/download.html


①sbt-1.3.8.zipをダウンロードします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823204755.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823204805.png "img")


②sbt-1.3.8.zipを解凍します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823204822.png "img")


2）MyComputerプロパティから環境パスを設定    
①SBT_HOMEを設定します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823204855.png "img")

②SBT binパスを追加します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823204909.png "img")

3）CMDを開き、下記コマンドでsbtを確認します    

①CMDを開き、sbtを入力します    
```
# sbt
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205309.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205318.png "img")


②sbtバージョンを確認します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205331.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205506.png "img")


## 2-4.Intellij ideaでScalaプラグインをインストールします

1）下記リンクからscalaプラグインをインストールします    
前提条件として、Intellij ideaが起動されていることが必須です    

> https://plugins.jetbrains.com/plugin/1347-scala


①Install to IntelliJ IDEA2020.1.1ボタンをクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205519.png "img")


②Successと表示されます    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205532.png "img")

③IDEAでscalaのインストール画面が表示されるのを確認します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205542.png "img")

④Scalaをインストールします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205552.png "img")

⑤インストール後、IDEAでFile‐New‐Projectプロジェクトの作成画面にScalaメニューが追加されます    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205625.png "img")

# 3.Sparkプロジェクトの準備
## 3-1.Sparkプロジェクトを作成します
1）Sparkプロジェクトを作成します    
① メニューバーで File > New > Project をクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205704.png "img")

②Scalaを選択し、sbtを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205716.png "img")

③プロジェクトフォルダを選択し、JDK、sbt、Scalaを設定します    

```version
JDK:1.8
sbt:1.3.8
Scala:2.12.0
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205735.png "img")

④プロジェクトが作成されます    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205757.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205807.png "img")


## 3-2.Sparkプロジェクトのディレクトリを準備します
1）ディレクトリ構造    

```folder.
./src
./src/main
./src/main/scala
./src/main/scala/com
./src/main/scala/com/spark
./src/main/scala/com/spark/test
./src/main/scala/com/spark/test/WriteToCk.scala
./build.sbt
./assembly.sbt
./project/plugins.sbt
```

2）./src/main/scala/com/spark/test/WriteToCk.scalaを作成します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205836.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205845.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205854.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823205904.png "img")


3）WriteToCk.scalaを編集します    
①WriteToCk.scalaサンプル を次の通りに入力します    
```WriteToCk.scalaサンプル
package com.spark.test

import java.util
import java.util.Properties

import org.apache.spark.sql.execution.datasources.jdbc.JDBCOptions
import org.apache.spark.SparkConf
import org.apache.spark.sql.{SaveMode, SparkSession}
import org.apache.spark.storage.StorageLevel

object WriteToCk {
  val properties = new Properties()
  properties.put("driver", "ru.yandex.clickhouse.ClickHouseDriver")
  properties.put("user", "<your-user-name>")
  properties.put("password", "<your-password>")
  properties.put("batchsize","100000")
  properties.put("socket_timeout","300000")
  properties.put("numPartitions","8")
  properties.put("rewriteBatchedStatements","true")

  val url = "jdbc:clickhouse://<you-url>:8123/default"
  val table = "<your-table-name>"

  def main(args: Array[String]): Unit = {
    val sc = new SparkConf()
    sc.set("spark.driver.memory", "1G")
    sc.set("spark.driver.cores", "4")
    sc.set("spark.executor.memory", "1G")
    sc.set("spark.executor.cores", "2")

    val session = SparkSession.builder().master("local[*]").config(sc).appName("write-to-ck").getOrCreate()

    val df = session.read.format("csv")
      .option("header", "true")
      .option("sep", ",")
      .option("inferSchema", "true")
      .load("</your/path/to/test/data/a.txt>")
      .selectExpr(
        "Year",
        "Quarter",
        "Month"
      )
      .persist(StorageLevel.MEMORY_ONLY_SER_2)
    println(s"read done")

    df.write.mode(SaveMode.Append).option(JDBCOptions.JDBC_BATCH_INSERT_SIZE, 100000).jdbc(url, table, properties)
    println(s"write done")

    df.unpersist(true)
  }
}
```

パラメータ説明：    
* your-user-name：ターゲットClickHouseクラスターで作成されたデータベースアカウント名    
* password：データベースアカウント名に対応するパスワード    
* your-url：ターゲットClickHouseクラスターアドレス（VPCエンドポイントで設定することをお勧めする）    
* /your/path/to/test/data/a.txt：インポートするデータファイルのパス（ファイルアドレスとファイル名を含む）    
* your-table-name：ClickHouseクラスターのターゲットテーブル名    

②WriteToCk.scalaを編集します    

```WriteToCk.scala
package com.spark.test
import java.util.Properties

import org.apache.spark.SparkConf
import org.apache.spark.sql.execution.datasources.jdbc.JDBCOptions
import org.apache.spark.sql.{SaveMode, SparkSession}
import org.apache.spark.storage.StorageLevel

object WriteToCk {
  val properties = new Properties()
  properties.put("driver", "ru.yandex.clickhouse.ClickHouseDriver")
  properties.put("user", "sbtest")
  properties.put("password", "Test1234")
  properties.put("batchsize","100000")
  properties.put("socket_timeout","300000")
  properties.put("numPartitions","8")
  properties.put("rewriteBatchedStatements","true")

  val url = "jdbc:clickhouse://cc-0iw4v4hezq9lw9333.ads.aliyuncs.com:8123/default"
  val table = "spark_table_distributed"

  def main(args: Array[String]): Unit = {
    val sc = new SparkConf()
    sc.set("spark.driver.memory", "1G")
    sc.set("spark.driver.cores", "4")
    sc.set("spark.executor.memory", "1G")
    sc.set("spark.executor.cores", "2")

    val session = SparkSession.builder().master("local[*]").config(sc).appName("write-to-ck").getOrCreate()

    val df = session.read.format("csv")
      .option("header", "true")
      .option("sep", ",")
      .option("inferSchema", "true")
      .load("oss://spark-clickhouse/data/access_log_csv.txt")
      .select("*")
      .persist(StorageLevel.MEMORY_ONLY_SER_2)
    println(s"read done")

    df.write.mode(SaveMode.Append).option(JDBCOptions.JDBC_BATCH_INSERT_SIZE, 100000).jdbc(url, table, properties)
    println(s"write done")

    df.unpersist(true)
  }
}
```
※今回の例はOSSに保存するtxtファイルをSparkで読み取るものです    
※予め、access_log_csv.txt  をOSS ("oss://spark-clickhouse/data/access_log_csv.txt") にアップロードしておきます    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823210037.png "img")

4）./build.sbt構成ファイルを編集して、依存関係を追加します    
①build.sbtを下記のように編集します    

```build.sbt
lazy val sparkSettings = Seq(
  organization := "com.spark.test",
  version := "0.1",
  scalaVersion := "2.12.0",
  libraryDependencies ++= Seq(
    "org.apache.spark" %% "spark-sql" % "3.0.0" % "provided",
    "org.apache.spark" %% "spark-core" % "3.0.0" % "provided",
    "com.alibaba" % "fastjson" % "1.2.4" % "provided",
    "ru.yandex.clickhouse" % "clickhouse-jdbc" % "0.2.4"
  )
)

lazy val root = (project in file("."))
  .settings(
    sparkSettings,
    name := "sparkdemo",
    mainClass in assembly := Some("com.spark.test.WriteToCk"),
    assemblyJarName in assembly := "nancy-spark-test-WriteToCk.jar",
    assemblyMergeStrategy in assembly := {
      case PathList("javax", "servlet", xs @ _*) => MergeStrategy.first
      case PathList("javax", "inject", xs @ _*) => MergeStrategy.first
      case PathList("javax", "activation", xs @ _*) => MergeStrategy.first
      case PathList("javax", "xml", xs @ _*) => MergeStrategy.first
      case PathList("org", "apache", xs @ _*) => MergeStrategy.first
      case PathList("org", "aopalliance", xs @ _*) => MergeStrategy.first
      case PathList("org", "ow2", xs @ _*) => MergeStrategy.first
      case PathList("net", "jpountz", xs @ _*) => MergeStrategy.first
      case PathList("com", "google", xs @ _*) => MergeStrategy.first
      case PathList("com", "esotericsoftware", xs @ _*) => MergeStrategy.first
      case PathList("com", "codahale", xs @ _*) => MergeStrategy.first
      case PathList("com", "yammer", xs @ _*) => MergeStrategy.first
      case PathList("com", "fasterxml", xs @ _*) => MergeStrategy.first
      case "about.html" => MergeStrategy.rename
      case "META-INF/mailcap" => MergeStrategy.first
      case "META-INF/mimetypes.default" => MergeStrategy.first
      case "plugin.properties" => MergeStrategy.first
      case "git.properties" => MergeStrategy.first
      case "log4j.properties" => MergeStrategy.first
      case "module-info.class" => MergeStrategy.discard
      case x =>
        val oldStrategy = (assemblyMergeStrategy in assembly).value
        oldStrategy(x)
    }
  )
```
※assemblyMergeStrategyでJarパッケージが重複するエラーを解決します    
※./assembly.sbt-> sbt assemblyでパッケージする方法ではru.yandex.clickhouseの3rdパーティーを引用することができます。sbt packageで作成したJarパッケージではclickhouseの3rdパーティーには含まれません。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823210233.png "img")

5）./assembly.sbtを編集します    
※assemblyプラグインのインストール方法はassembly関連のコンフィグファイルを正しく設定し、sbt updateコマンドを実行します    

①assembly.sbtを下記のように編集します    
```assembly.sbt
addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "1.0.0")
resolvers += Resolver.url("bintray-sbt-plugins", url("https://scala.jfrog.io/artifactory/sbt-plugin-releases/sbt-plugin-releases"))(Resolver.ivyStylePatterns)
```
※sbtとassemblyのバージョンにはご注意ください    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823210309.png "img")


6）./project/plugins.sbtを編集します    
```plugins.sbtss
logLevel := Level.Warn
addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "1.0.0")
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823210328.png "img")


7）sbt updateでsbt-assemblyをインストールします    
```
# sbt update
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823210357.png "img")

8）プラグインを確認します    
①sbt pluginsを入力します    
```
# sbt plugins
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823210414.png "img")

②sbtassembly.AssemblyPluginがインストールされます    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823210439.png "img")

ここまでsbt-assemblyがインストール完了されたことを確認します    

9）Spark依頼をインポートします    

プロジェクトを正しくビルドするため、Spark依頼をインポートします    
①下記リンクからspark-3.1.2-bin-hadoop3.2.tgzをダウンロードします    

> https://spark.apache.org/downloads.html

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211124.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211104.png "img")

②spark-3.1.2-bin-hadoop3.2.tgzを解凍し、プロジェクトの右クリックメニューから依頼Jarを追加します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211111.png "img")

③Libraries‐NewProjectLibraryにJavaを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211146.png "img")


④spark-3.1.2-bin-hadoop3.2のjarsフォルダを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211202.png "img")


⑤「OK」をクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211221.png "img")

⑥プロジェクトをBuildします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211236.png "img")

⑦プロジェクトが正しくビルドされたことを確認します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211305.png "img")

ここまで手順で問題なければプロジェクトのビルドが無事成功したと思います    

## 3-3.Sparkプロジェクトをパッケージします    

1）下記コマンドでsbtクリアします    

```
sbt clean
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211513.png "img")

2）下記コマンドでパッケージを実行します    

```
sbt assembly
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211556.png "img")

3）nancy-spark-test-WriteToCk.jarパッケージが生成されるのを確認します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210823211656.png "img")


# 4. Apache SparkからtxtファイルデータをClickHouseへ格納

## 4-1.OSSにファイルをアップロードします
1）OSSバケットを作成します    
①OSSを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153601.png "img")


②Bucketメニューを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153618.png "img")


③Bucket作成をクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153627.png "img")


④デフォルト設定でBucketを作成します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153640.png "img")

2）Step2-3で生成されたnancy-spark-test-WriteToCk.jarファイルをOSSにアップロードします    
①フォルダ作成ボタンをクリックし、jarフォルダを作成します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153652.png "img")

②jarsフォルダに遷移し、Uploadメニューをクリックし、ファイルをアップロードします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153703.png "img")

3）txtファイルをOSSにアップロードします    
①サンプルファイルを準備します    

```access_log_csv.txt
"id","user_name","age","city","access_url"
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

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153714.png "img")

② Create Folderをクリックし、dataフォルダを作成します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153723.png "img")

③ dataフォルダに遷移し、Uploadメニューをクリックし、ファイルをアップロードします    
※data保存パスはCodeに書いてあるファイルパスと同じです    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153751.png "img")

## 4-2.ClickHouseでテーブルを作成します
1）DMSでClickhouseを接続します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153803.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153812.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153821.png "img")


2）ClickHouseでデフォルトDBにローカルテーブルを作成します    
```
create table spark_table_local on cluster default (
  id UInt8,
  user_name String,
  age UInt16,
  city String,
  access_url String
)
engine = MergeTree()
order by id;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153837.png "img")

3）ClickHouseでデフォルトDBに分散テーブルを作成します    
```
create table spark_table_distributed on cluster default(
  id UInt8,
  user_name String,
  age UInt16,
  city String,
  access_url String
)
engine = Distributed(default, default, spark_table_local, id);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153915.png "img")


## 4-3.EMRのSparkタスクでデータをClickHouseにインポートします
### 4-3-1.EMRインスタンスを作成します
①コンソール画面でEMRを検索します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153934.png "img")

②日本リージョンを選択し、ClusterWizardをクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824153951.png "img")

③ClusterタイプでHadoopを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154004.png "img")

④従量課金を選択し、ClickHouseと同じVPCを設定します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154017.png "img")

⑤Cluster基本情報を設定し、PublicIPをオンにします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154028.png "img")

⑥Cluster情報を確認します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154039.png "img")

⑦EMRClusterを作成完成します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154051.png "img")

### 4-3-2.EMRでプロジェクトを作成します
①EMRClusterを選択し、EMR情報画面を表示します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154104.png "img")

②「Data Platform」をクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154118.png "img")


③「Create Project」をクリックし、プロジェクトを作成します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154131.png "img")

④Projectを設定します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154142.png "img")

⑤プロジェクトが作成されたことを確認します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154204.png "img")

### 4-3-2.EMRでSparkJobを作成します
①Projectをクリックし、Workflows画面を表示します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154216.png "img")

②EditJobをクリックし、Job作成メニューをクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824154312.png "img")

③sparkジョブが作成されました    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824155748.png "img")

### 4-3-4.EMRでSparkJobを実行します
1）jarファイルパスを自動的に入力します    
①Enter an OSS pathメニューでOSSバケットを選択し、OSSREFを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824155814.png "img")

②nancy-spark-test-WriteToCk.jarを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824155826.png "img")

③コンソール画面でossref://spark-clickhouse/jars/nancy-spark-test-WriteToCk.jarを入力します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824155840.png "img")

2）sparkジョブで下記コマンドを入力します    

```
--class com.spark.test.WriteToCk --master yarn-client --driver-memory 7G --executor-memory 5G --executor-cores 1 --num-executors 32 ossref://spark-clickhouse/jars/nancy-spark-test-WriteToCk.jar
```

①「run」をクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824155920.png "img")

②ResourceGroupを設定します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824155933.png "img")

③spark jobを実行します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824155944.png "img")

④record画面でジョブ実行状態を確認します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824160014.png "img")

### 4-3-5.DMSでClickHouseのデータを確認します
1）DMSでtxtデータをClickHouseにインポートすることを確認します    

①分散テーブルを検索します    

```
SELECT * FROM spark_table_distributed;
SELECT COUNT(*) FROM spark_table_distributed;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824160028.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824160037.png "img")

②ローカルテーブルを検索します    
```
SELECT * FROM spark_table_local;
SELECT COUNT(*)  FROM spark_table_local;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824160053.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613794178500/20210824160102.png "img")



---

# 最後に

ここまで、Apache Spark- ApsaraDB for ClickHouseへデータ連携する方法を紹介しました。    
ApsaraDB for ClickHouseはApache Sparkとスムーズに連携できるので、例えば、Spark StreamingやDataLake Analytics Serverless SparkなどからApsaraDB for ClickHouseへリアルタイムデータ連携しつつ、ClickHouseでリアルタイム可視化、といったソリューションを構築することもできます。    





