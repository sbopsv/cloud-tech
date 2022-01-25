---
title: "Apache SparkからHologres連携"
metaTitle: "Apache SparkからHologresへデータ連携方法"
metaDescription: "Apache SparkからHologresへデータ連携方法"
date: "2021-09-06"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/Hologres_images_26006613798076600/20210906202810.png"
---

## Apache SparkからHologresへデータ連携方法

本記事では、[Hologres](https://www.alibabacloud.com/product/hologres) を使って、Apache SparkからHologresへリアルタイムデータ連携する方法をご紹介します。               


# Hologresとは

> <span style="color: #ff0000"><i>Hologres はリアルタイムのインタラクティブ分析サービスです。高い同時実行性と低いレイテンシーでTB、PBクラスのデータの移動や分析を短時間で処理できます。PostgreSQL11と互換性があり、データを多次元で分析し、ビジネスインサイトを素早くキャッチすることができます。</i></span>

少し前になりますが、Hologresについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-hologres


# Apache Sparkとは
[Apache Spark](http://spark.apache.org/docs/latest/)は、大規模データ処理のための統合分析エンジンです。複数のプログラム言語でハイレベルなAPIを提供しており、ビッグデータソリューションで人気があります。

また、今回のチュートリアルとしては、Alibaba Cloud EMR(E-MapReduce)  によるApache sparkを使用します。EMR(E-MapReduce)  については、こちらのSlideShareで紹介しています。     

> https://www.slideshare.net/sbopsv/alibabacloudemapreduce-231725148



# Apache SparkからHologresへデータ連携について     
このガイドラインでは、Sparkを使ってHologresでデータ処理を行う方法を順を追って説明します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906202810.png "img")



# このチュートリアルについて
## 対象者: 

本ガイドラインは、以下のような方を対象としています      
- Alibaba Cloud、Hologres、LogService、OSS（Object Storage Service）、EMR(E-MapReduce)  に関する基本的な知識を持っている       
   
## 前提条件:
- Alibaba Cloud のアカウントを所持している    
- Hologres、LogService、OSS（Object Storage Service）EMR(E-MapReduce) が使用可能な状態になっている       
- 使用するHologres、LogService、OSS（Object Storage Service）EMR(E-MapReduce) は同一Region配下にある      
- 少なくとも1つのHologresインスタンス、1つのOSS（Object Storage Service）bucketを持っている   


# EMR(E-MapReduce)クラスタをspark実行環境を準備

まず最初に、sparkの実行環境を準備します。[Apache Sparkを導入するにはいくつかの方法](http://spark.apache.org/docs/latest/index.html#launching-on-a-cluster) があります。     

> http://spark.apache.org/docs/latest/index.html#launching-on-a-cluster

Alibaba Cloud EMR(E-MapReduce)では、Hadoop、Spark、Flink、Kafka、HBaseなどのオープンソースのビッグデータサービスを数分で簡単に導入することができます。このガイドラインでは、すべてのSparkタスクをEMR(E-MapReduce)クラスタ上で実行します。      

EMRのウィザードを使って、EMR-3.36.1とspark 2.4.7でEMR(E-MapReduce)クラスタを作成します。Alibaba CloudのEMRはAWS EMRなど他社EMRとは異なってほぼマネージドサービスなので、コンソール上の操作だけで5分で出来ます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210649.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210657.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210705.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210715.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210725.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210732.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210741.png "img")

EMR(E-MapReduce)コンソールのData Platformにプロジェクトを作成し、タスクを管理します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210757.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210805.png "img")


# Hologresテーブルの準備

既存のHologresインスタンスに、関連データを格納するためのテーブルを作成します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210820.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210829.png "img")


以下は生成するDDL文です。     

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


# OSS(Object Storage Service)バケツにスクリプトとデータのフォルダを用意する    

既存のOSS(Object Storage Service)バケットに、pythonスクリプトやデータファイルを保存するためのフォルダを新規に作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210844.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210854.png "img")


# Apache SparkでCSVデータファイルをHologresテーブルに取り込む

前述の通り、sparkは複数のプログラム言語をサポートしていますが、ここではpythonとPySparkを例にしています。タスクが完了すると、OSS(Object Storage Service)バケット内のCSVファイルを選択し、その中の全てのレコードが対象のHologresテーブルに保存されます。        
DataFrameReaderの`csv("path")`または`format("csv").load("path")`を使うと、CSVファイルをPySparkのDataFrameに読み込むことができます。また、[JdbcRDD](http://spark.apache.org/docs/latest/api/scala/org/apache/spark/rdd/JdbcRDD.html)を使えば、特定のドライバを使って簡単にデータベースにDataFrameを書き込むことができます。       

> http://spark.apache.org/docs/latest/api/scala/org/apache/spark/rdd/JdbcRDD.html

この状態ではHologresインスタンスはPostgreSQLとして接続されています。詳しい情報は、[spark JDBC data source](http://spark.apache.org/docs/latest/sql-data-sources-jdbc.html)や[spark generic file source](http://spark.apache.org/docs/latest/sql-data-sources-load-save-functions.html)を参照してください。       

> http://spark.apache.org/docs/latest/sql-data-sources-jdbc.html

> http://spark.apache.org/docs/latest/sql-data-sources-load-save-functions.html

以下のスクリプトで`hologres_spark.py`を作成します。     


```python
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, IntegerType, StringType

if __name__ == '__main__':
    spark = SparkSession.builder.appName('HologresSparkDemo').getOrCreate()
    schema = StructType() \
        .add("order_id", StringType(), True) \
        .add("user_id", IntegerType(), True) \
        .add("book_id", IntegerType(), True) \
        .add("book_name", StringType(), True) \
        .add("order_cnt", IntegerType(), True) \
        .add("order_amt", IntegerType(), True)
    df_with_schema = spark.read.format("csv") \
        .option("header", True) \
        .schema(schema) \
        .load("<your file path in OSS bucket>")
    df_with_schema.write.mode("append").format("jdbc") \
        .option("url", "<jDBC connection url of your instance, e.g. jdbc:postgresql://<endpoint>:<port>/<database name>") \
        .option("dbtable", "<your target table name>") \
        .option("user", "<your accessKeyId>") \
        .option("password", "<your accessKeySecret>") \
        .option("driver", "org.postgresql.Driver") \
        .save()

```

以下のスクリプトを使って、関連するデータファイルを生成し、テストすることができます。      

```python
import csv
import random
import uuid

output_date = "20210712"
book_info = ["嫌われる勇気", "ノルウェイの森", "海辺のカフカ", "色彩を持たない多崎つくると彼の巡礼の年",
             "容疑者Ⅹの献身", "人間失格", "こころ", "天声人语", "幸せになる勇気"]
book_price = [500, 600, 700, 300, 200, 100, 350, 550, 650]
csv_writer = csv.writer(open("test_data_{0}.csv".format(output_date), "w+", newline='', encoding='UTF-8'))
for i in range(10000):
    book_id = random.randint(1, 9)
    order_count = random.randint(1, 5)
    row = [uuid.uuid1(), random.randint(1, 50), book_id, book_info[book_id-1], order_count,
           book_price[book_id-1] * order_count]  # order_id, user_id, book_id, book_name, order_count, order_amount
    csv_writer.writerow(row)
```

[PostgreSQL JDBC Driver](https://mvnrepository.com/artifact/org.postgresql/postgresql)をダウンロードして、pythonスクリプト、生成されたデータファイル、ドライバパッケージを上記の用意したフォルダにアップロードします。    

> https://mvnrepository.com/artifact/org.postgresql/postgresql


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210911.png "img")


EMR(E-MapReduce)プロジェクトでApache Spark Jobを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210922.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210929.png "img")

以下のフォーマットに従って、実行コマンドを入力します。       

```
--driver-class-path <your PostgreSQL driver class path in OSS> --jars <your PostgreSQL driver class path in OSS> <your python scripts path in OSS>
```

ウィザードを使ってOSS(Object Storage Service)のパスを生成するには、Enter an OSS pathリンクをクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906210944.png "img")


自作のSpark環境で作業する場合は、代わりに以下のコマンドを使用してください。      

```
spark-submit --driver-class-path <your PostgreSQL driver class path> --jars <your PostgreSQL driver class path> <your python scripts path>
```

Apache  spark job を保存し、EMR(E-MapReduce)クラスタに投入して実行します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211001.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211009.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211017.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211027.png "img")


Apache Spark Jobのインスタンス情報やログは、詳細ページで確認できます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211041.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211049.png "img")


HoloWebにアクセスして、ターゲットテーブルのデータを照会すると、CSVファイルのすべてのレコードがHologresテーブルに格納されているのがわかると思います。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211104.png "img")


# Spark streamingでLog ServiceからHologresへリアルタイムデータ転送

ここまできたら、Spark streaming動作確認のためにHologresのテーブルデータをDELETE文でクリアします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211630.png "img")

LogServiceプロジェクトとlogstoreを準備します。logstore作成時にWebTrackingが有効になっていることを確認してください。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211643.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211651.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211659.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211708.png "img")

logstore のデータページに入り、インデックス属性を有効にします。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211720.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211728.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211735.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211744.png "img")


Alibaba Cloudが提供するSpark SDK](https://www.alibabacloud.com/cloud-tech/doc-detail/51075.htm)では、ReceiverまたはDirectモードでLog ServiceからLog dataを消費することができます。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/51075.htm


関連する紹介やデモコードは[Git aliyun-emapreduce-datasources](https://github.com/aliyun/aliyun-emapreduce-datasources/tree/master-2.x/emr-logservice)や[Git aliyun-emapreduce-demo](https://github.com/aliyun/aliyun-emapreduce-demo)で入手できます。     

> https://github.com/aliyun/aliyun-emapreduce-demo


Apache Spark SDKにより、DataStreamReaderがログサービスを `loghub` というフォーマットで認識するようになりました。Pythonの使い方については<https://github.com/aliyun/aliyun-emapreduce-datasources/blob/main/docs/how_to_run_spark_with_python_sdk.md>を参照してください。     

> https://github.com/aliyun/aliyun-emapreduce-datasources/blob/main/docs/how_to_run_spark_with_python_sdk.md

関連するSDKを使用して、まずテストのためにコンソールにストリーミングデータを表示します。以下のスクリプトで `hologres_spark_streaming.py` を作成します。      


```python
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, IntegerType, StringType


if __name__ == '__main__':
    spark = SparkSession.builder.appName('HologresSparkStreamingDemo').getOrCreate()
    schema = StructType() \
        .add("order_id", StringType(), True) \
        .add("user_id", IntegerType(), True) \
        .add("book_id", IntegerType(), True) \
        .add("book_name", StringType(), True) \
        .add("order_cnt", IntegerType(), True) \
        .add("order_amt", IntegerType(), True)
    line_with_schema = spark.readStream.format("loghub") \
        .schema(schema) \
        .option("sls.project", "<your log service project name>") \
        .option("sls.store", "<your log service logstore name>") \
        .option("access.key.id", "<your accessKeyId>") \
        .option("access.key.secret", "<your accessKeySecret>") \
        .option("endpoint", "<your endpoint such as ap-northeast-1-intranet.log.aliyuncs.com>") \
        .option("startingoffsets", "latest") \
        .load()
    stream = line_with_schema.writeStream.format("console") \
        .outputMode("append") \
        .trigger(processingTime='25 seconds') \
        .start()
    stream.awaitTermination()

```


Pythonスクリプト、PostgreSQLドライバ、log service spark sdk (emr-logservice_2.11-2.2 .0.jar) 、およびfastjson-1.2 .45.jar、commons-validator-1.4 .0.jar、ezmorf-1.0 .6.jar、loghub-client-lib-0.6 .13.jar、aliyun-log-0.6 .10.jar、json-lib-2.4-jdk 15.jar、zkclient-0.10.jar、emr-common_2.11-2.2 .0.jarをアップロードします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211806.png "img")

EMR(E-MapReduce)プロジェクトの下に、新しいspark streaming jobを作成し、ジョブ実行コマンドを更新します。      


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211823.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211832.png "img")

OSS(Object Storage Service)のパスを指定して、以下のフォーマットに沿って実行コマンドを入力してください。     

```
--master yarn-client --driver-memory 7G --executor-memory 5G --executor-cores 1 --num-executors 32 --driver-class-path ossref://xxx/postgresql-42.2.6.jar  --jars ossref://xxx/postgresql-42.2.6.jar,ossref://xxx/fastjson-1.2.45.jar,ossref://xxx/commons-validator-1.4.0.jar,ossref://xxx/ezmorph-1.0.6.jar,ossref://xxx/emr-logservice_2.11-2.2.0.jar,ossref://xxx/loghub-client-lib-0.6.13.jar,ossref://xxx/aliyun-log-0.6.10.jar,ossref://xxx/json-lib-2.4-jdk15.jar,ossref://xxx/zkclient-0.10.jar,ossref://xxx/emr-common_2.11-2.2.0.jar <your python scripts path in OSS>
```

自分で構築したspark環境で作業している場合は、関連ファイルのパスも更新してください。     

sparkのジョブを保存し、EMR(E-MapReduce)クラスタに投入して実行します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211852.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211901.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211910.png "img")

spark streamingジョブの実行中に、以下のスクリプトで新しいログサービスレコードを送信し、関連するログを確認します。      

```python
import random
import requests
import uuid

project = "<your log service project name>"
endpoint = "<your endpoint such as ap-northeast-1.log.aliyuncs.com>"
logstore = "<your log service logstore name>"
topic = "<your logs topic>"
# urlencoded book name in Japanese
book_info = ["%E5%AB%8C%E3%82%8F%E3%82%8C%E3%82%8B%E5%8B%87%E6%B0%97",
             "%E3%83%8E%E3%83%AB%E3%82%A6%E3%82%A7%E3%82%A4%E3%81%AE%E6%A3%AE",
             "%E6%B5%B7%E8%BE%BA%E3%81%AE%E3%82%AB%E3%83%95%E3%82%AB",
             "%E8%89%B2%E5%BD%A9%E3%82%92%E6%8C%81%E3%81%9F%E3%81%AA%E3%81%84%E5%A4%9A%E5%B4%8E%E3%81%A4%E3%81%8F%E3%82%8B%E3%81%A8%E5%BD%BC%E3%81%AE%E5%B7%A1%E7%A4%BC%E3%81%AE%E5%B9%B4",
             "%E5%AE%B9%E7%96%91%E8%80%85%E2%85%A9%E3%81%AE%E7%8C%AE%E8%BA%AB", "%E4%BA%BA%E9%96%93%E5%A4%B1%E6%A0%BC",
             "%E3%81%93%E3%81%93%E3%82%8D", "%E5%A4%A9%E5%A3%B0%E4%BA%BA%E8%AF%AD",
             "%E5%B9%B8%E3%81%9B%E3%81%AB%E3%81%AA%E3%82%8B%E5%8B%87%E6%B0%97"]
book_price = [500, 600, 700, 300, 200, 100, 350, 550, 650]
url = 'http://{0}.{1}/logstores/{2}/track?APIVersion=0.6.0&__topic__={3}&order_id={4}&user_id={5}&book_id={6}&book_name={7}&order_cnt={8}&order_amt={9}'
for i in range(5):
    book_id = random.randint(1, 9)
    order_count = random.randint(1, 5)
    res = requests.get(
        url.format(project, endpoint, logstore, topic, uuid.uuid1(), random.randint(1, 50), book_id,
                   book_info[book_id - 1], order_count,
                   book_price[book_id - 1] * order_count))
    print(res)

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211926.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211934.png "img")

ここでストリームデータをターゲットのHologresテーブルに保存するために、format`console`を`jdbc`に置き換えると、`java.lang.UnsupportedOperationException: Data source jdbc does not support streamed writing`という関連エラーが発生します。つまり、データソースをjdbcと設定では、ストリーミング処理をサポートすることができないことがわかります。      

```python
......
    # Error Data source jdbc does not support streamed writing
    stream = line_with_schema.writeStream.format("jdbc") \
        .outputMode("append") \
        .option("url", "<jDBC connection url of your instance, e.g. jdbc:postgresql://<endpoint>:<port>/<database name>") \
        .option("dbtable", "<your target table name>") \
        .option("user", "<your accessKeyId>") \
        .option("password", "<your accessKeySecret>") \
        .option("driver", "org.postgresql.Driver") \
        .start()
......
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906211947.png "img")


[foreachBatch(...)](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html#foreachbatch) でフォーマットコンソールを更新すると、ストリーミングクエリの各マイクロバッチの出力データに対して実行する関数を指定できます。Sparkジョブで以前行ったように、DataFrameをHologresテーブルに保存します。     

> https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html#foreachbatch



```python
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, IntegerType, StringType


def foreach_batch_function(df, epoch_id):
    df.write.mode("append").format("jdbc") \
        .option("url", "<jDBC connection url of your instance, e.g. jdbc:postgresql://<endpoint>:<port>/<database name>") \
        .option("dbtable", "<your target table name>") \
        .option("user", "<your accessKeyId>") \
        .option("password", "<your accessKeySecret>") \
        .option("driver", "org.postgresql.Driver") \
        .save()
    pass


if __name__ == '__main__':
    spark = SparkSession.builder.appName('HologresSparkStreamingDemo').getOrCreate()
    schema = StructType() \
        .add("order_id", StringType(), True) \
        .add("user_id", IntegerType(), True) \
        .add("book_id", IntegerType(), True) \
        .add("book_name", StringType(), True) \
        .add("order_cnt", IntegerType(), True) \
        .add("order_amt", IntegerType(), True)
    line_with_schema = spark.readStream.format("loghub") \
        .schema(schema) \
        .option("sls.project", "<your log service project name>") \
        .option("sls.store", "<your log service logstore name>") \
        .option("access.key.id", "<your accessKeyId>") \
        .option("access.key.secret", "<your accessKeySecret>") \
        .option("endpoint", "<your endpoint such as ap-northeast-1-intranet.log.aliyuncs.com>") \
        .option("startingoffsets", "latest") \
        .load()
    stream = line_with_schema.writeStream.foreachBatch(foreach_batch_function).start()
    # stream = line_with_schema.writeStream.format("console") \
    #     .outputMode("append") \
    #     .trigger(processingTime='25 seconds') \
    #     .start()
    stream.awaitTermination()

```

新しいPythonスクリプトをアップロードし、sparkストリーミングジョブを再実行します。新しいログサービステストレコードを送信し、Hologresテーブルを確認します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906212005.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906212012.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906212020.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906212028.png "img")


# 最後に
ここまで、Apache SparkからHologresへリアルタイムデータ連携する方法を紹介しました。      
この方法を生かすことで、Apache Sparkがあるサービス基盤からリアルタイムでHologresへ連携、Hologresでリアルタイム可視化を実現することができます。     



