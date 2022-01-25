---
title: "Spark on k8sからHologres連携"
metaTitle: "Apache Spark on k8sからHologresへデータ連携方法"
metaDescription: "Apache Spark on k8sからHologresへデータ連携方法"
date: "2021-09-09"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/Hologres_images_26006613798077100/20210909084249.png"
---

## Apache Spark on k8sからHologresへデータ連携方法

本記事では、[Hologres](https://www.alibabacloud.com/product/hologres) を使って、AzureのKubernetesサービスであるAKSからApache Sparkによるマルチクラウドーリアルタイムデータ連携する方法をご紹介します。            


# Hologresとは

> <span style="color: #ff0000"><i>Hologres はリアルタイムのインタラクティブ分析サービスです。高い同時実行性と低いレイテンシーでTB、PBクラスのデータの移動や分析を短時間で処理できます。PostgreSQL11と互換性があり、データを多次元で分析し、ビジネスインサイトを素早くキャッチすることができます。</i></span>

少し前になりますが、Hologresについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-hologres


# Apache Sparkとは
[Apache Spark](http://spark.apache.org/docs/latest/)は、大規模データ処理のための統合分析エンジンです。複数のプログラム言語でハイレベルなAPIを提供しており、ビッグデータソリューションで人気があります。

> http://spark.apache.org/docs/latest/


# Kubernetes（k8s）とは
[Kubernetes](https://kubernetes.io/) は、K8sとも呼ばれ、コンテナ化されたアプリケーションのデプロイ、スケーリング、管理を自動化するためのオープンソースのシステムで、アプリケーションを構成するコンテナを論理的な単位にまとめ、管理と発見を容易にします。   

> https://kubernetes.io/


# Azure Kubernetes上でApache Sparkを使ってHologresでデータ処理をする
このガイドラインでは、Kubernetes上のApache Sparkを使って、Hologresによるデータ処理を段階的に作成します。    
マルチクラウドによるデータ分析サービスを構築するため、Apache Sparkは[AKS(Azure Kubernetes Service)](https://docs.microsoft.com/ja-jp/azure/aks/)  にてデプロイします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084249.png "img")


# このチュートリアルについて
## 対象者: 

本ガイドラインは、以下のような方を対象としています      
- docker、Kubernetes,、Alibaba Cloud、Hologres,、Azure、AKS(Azure Kubernetes Service) 、Azure Storage Accountに関する基本的な知識を持っている       
   
## 前提条件:
- Alibaba Cloud、Azure のアカウントを所持している       
- Alibaba Cloud Hologresが使用可能な状態になっている       
- 少なくとも1つのHologresインスタンスを持っている       
- Azure AKS(Azure Kubernetes Service) と　Azure Storage Account が使用可能な状態になっている        
- 作業環境にAzure CLI、およびdocker(17.05以降)をインストールしている      


# Hologresテーブルの準備

既存のHologresインスタンスに、関連データを格納するためのテーブルを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084305.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084313.png "img")

以下は生成するDDL文です     

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

# 特定データファイルおよびjarファイルを含むApache SparkのImageファイルのbuild

AKS(Azure Kubernetes Service) にApache Sparkをデプロイするためには、Sparkの実行環境、python 3環境下のPySpark、ソースデータファイル、依存関係にあるJARを含む、適切なSparkのImageを構築する必要があります。       
以下の手順で独自のイメージを構築することもできますし、あるいはDocker Image libraryにある `bwbw723/spark-k8s-hologres-demo:2.4.7` をそのまま使うこともできます。       

> https://hub.docker.com/r/bwbw723/spark-k8s-hologres-demo

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084330.png "img")

上記のパブリックイメージを使用する場合は、次のセクションから始めてください。独自のイメージを構築するには、作業環境でdockerサービスが実行されていることを確認する必要があります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084345.png "img")

## Apache Spark用Imageファイルの準備
Alibaba Cloud Log Service SDK は spark 2.x.x を必要とするので、ここでは `spark-2.4.7-bin-hadoop2.7` を使用します。

```shell
$ wget https://archive.apache.org/dist/spark/spark-2.4.7/spark-2.4.7-bin-hadoop2.7.tgz
$ tar -xzvf spark-2.4.7-bin-hadoop2.7.tgz
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084401.png "img")



## ImageのJAR依存関係とデータファイルの準備

上記のHologresテーブルのテーブルスキーマに従って、以下のスクリプトで関連するデータファイルを生成してテストすることができます。


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

以下のスクリプトを使って、関連するデータファイルを生成し、テストすることができます。     

```csv
order_id,user_id,book_id,book_name,order_cnt,order_amt
5761158b-f044-11eb-8be8-706655fcbfda,39,8,天声人语,1,550
57613ca0-f044-11eb-a396-706655fcbfda,46,8,天声人语,5,2750
57613ca1-f044-11eb-82e5-706655fcbfda,13,5,容疑者Ⅹの献身,1,200
57613ca2-f044-11eb-b395-706655fcbfda,35,5,容疑者Ⅹの献身,3,600
57613ca3-f044-11eb-a123-706655fcbfda,42,4,色彩を持たない多崎つくると彼の巡礼の年,1,300
57613ca4-f044-11eb-923c-706655fcbfda,18,8,天声人语,5,2750
57613ca5-f044-11eb-a533-706655fcbfda,29,9,幸せになる勇気,3,1950
57613ca6-f044-11eb-9ca4-706655fcbfda,35,7,こころ,3,1050
57613ca7-f044-11eb-bd76-706655fcbfda,25,1,嫌われる勇気,1,500
......
```

[PostgreSQL JDBC Driver](https://mvnrepository.com/artifact/org.postgresql/postgresql) の依存関係にあるJARを[Maven Repository](https://mvnrepository.com/) からダウンロードします。    

> https://mvnrepository.com/artifact/org.postgresql/postgresql

> https://mvnrepository.com/




spark root folder(spark-2.4.7-bin-hadoop2.7 here) と入力し、`demo`という名前の新しいフォルダ を作成し、準備したデータファイル (data.csv) 、PostgreSQLドライバ (postgresql-42.2 .6.jar) 、ログサービスのspark sdk (emr-logservice_2.11-2.2 .0.jar) とその依存関係 (fastjson-1.2 .45.jar、commons-validator-1.4 .0.jar、ezmorf-1.0 .6.jar、loghub-client-lib-0.6 .13.jar、aliyun-log-0.6 .10.jar、json-lib-2.4-jdk 15.jar、zkclient-0.10.jar、emr-common_2.11-2.2 .0.jarなど) を入れます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084417.png "img")


## Apache spark imageをビルドおよびプッシュ

以下の2つの点について `/kubernetes/dockerfiles/spark/Dockerfile` を更新します。     
- python 3実行環境を追加します。     
- データファイルと依存関係JARを作業ディレクトリに置く     

以下はDockerfileのサンプルです。

```
FROM openjdk:8-jdk-slim

ARG spark_jars=jars
ARG img_path=kubernetes/dockerfiles
ARG k8s_tests=kubernetes/tests

# Before building the docker image, first build and make a Spark distribution following
# the instructions in http://spark.apache.org/docs/latest/building-spark.html.
# If this docker file is being used in the context of building your images from a Spark
# distribution, the docker build command should be invoked from the top level directory
# of the Spark distribution. E.g.:
# docker build -t spark:latest -f kubernetes/dockerfiles/spark/Dockerfile .

RUN set -ex && \
    apt-get update && \
    ln -s /lib /lib64 && \
    apt install -y bash tini libc6 libpam-modules libnss3 && \
    mkdir -p /opt/spark && \
    mkdir -p /opt/spark/work-dir && \
    touch /opt/spark/RELEASE && \
    rm /bin/sh && \
    ln -sv /bin/bash /bin/sh && \
    echo "auth required pam_wheel.so use_uid" >> /etc/pam.d/su && \
    chgrp root /etc/passwd && chmod ug+rw /etc/passwd && \
    rm -rf /var/cache/apt/*

COPY ${spark_jars} /opt/spark/jars
COPY bin /opt/spark/bin
COPY sbin /opt/spark/sbin
COPY ${img_path}/spark/entrypoint.sh /opt/
COPY examples /opt/spark/examples
COPY ${k8s_tests} /opt/spark/tests
COPY data /opt/spark/data
COPY python /opt/spark/python

ENV SPARK_HOME /opt/spark

# Add python3 running environment
ENV PYTHON_VERSION=3.7.3

RUN apt-get install -y \
    build-essential \
    libreadline-gplv2-dev \
    libncursesw5-dev \
    libssl-dev \
    libsqlite3-dev \
    tk-dev \
    libgdbm-dev \
    libc6-dev \
    libbz2-dev \
    libffi-dev \
    zlib1g-dev \
    liblzma-dev \
    wget \
    && apt-get autoremove -y \
    && apt-get clean

WORKDIR /usr/src

RUN wget https://www.python.org/ftp/python/$PYTHON_VERSION/Python-$PYTHON_VERSION.tgz

RUN tar xzf Python-$PYTHON_VERSION.tgz

WORKDIR /usr/src/Python-$PYTHON_VERSION

RUN ./configure --enable-optimizations --with-ensurepip=install

RUN make altinstall

RUN ln -s /usr/local/bin/python3.7 /usr/local/bin/python3
RUN ln -s /usr/local/bin/python3.7 /usr/local/bin/python
RUN ln -s /usr/local/bin/pip3.7 /usr/local/bin/pip3
RUN ln -s /usr/local/bin/pip3.7 /usr/local/bin/pip

RUN pip install findspark

WORKDIR /opt/spark/work-dir

RUN rm -rf /usr/src/Python-$PYTHON_VERSION
RUN rm -rf /usr/src/Python-$PYTHON_VERSION.tgz

# Put data file and dependency JARs into work dir

ADD demo/aliyun-log-0.6.10.jar aliyun-log-0.6.10.jar
ADD demo/fastjson-1.2.45.jar fastjson-1.2.45.jar
ADD demo/loghub-client-lib-0.6.13.jar loghub-client-lib-0.6.13.jar
ADD demo/ezmorph-1.0.6.jar ezmorph-1.0.6.jar
ADD demo/emr-common_2.11-2.2.0.jar emr-common_2.11-2.2.0.jar
ADD demo/emr-logservice_2.11-2.2.0.jar emr-logservice_2.11-2.2.0.jar
ADD demo/commons-validator-1.4.0.jar commons-validator-1.4.0.jar
ADD demo/postgresql-42.2.6.jar postgresql-42.2.6.jar
ADD demo/zkclient-0.10.jar zkclient-0.10.jar
ADD demo/json-lib-2.4-jdk15.jar json-lib-2.4-jdk15.jar
ADD demo/data.csv data.csv

ENTRYPOINT [ "/opt/entrypoint.sh" ]

```

[Docker Hub](https://hub.docker.com/)、 [ACR(Azure Container Registry)](https://docs.microsoft.com/en-us/azure/container-registry/)、 [Alibaba Cloud Container Registry](https://www.alibabacloud.com/cloud-tech/doc-detail/257112.htm) などのコンテナイメージレジストリにログインします。ここではDocker Hubを例に説明します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084439.png "img")

`<spark root dir>` に移動し、関連するコマンドを実行してイメージをビルドし、プッシュします。必要に応じて、イメージのレジストリ名やタグを変更します。      


```shell
$ docker build -t bwbw723/spark-k8s-hologres-demo:2.4.7 -f ./kubernetes/dockerfiles/spark/Dockerfile .
$ docker push bwbw723/spark-k8s-hologres-demo:2.4.7
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084454.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084502.png "img")


# AKS(Azure Kubernetes Service) clusterの準備

AKS(Azure Kubernetes Service) クラスタの作成は、[Azure official help document](https://docs.microsoft.com/en-us/azure/aks/spark-job#create-an-aks-cluster)の手順に従って、Azure CLIで行うことができます。       
Azure CLIの準備ができていない場合は、[Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)と[Sign in](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli)を参照してください。       

> https://docs.microsoft.com/en-us/azure/aks/spark-job#create-an-aks-cluster

> https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

> https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli


コマンドは次の通りです。       

```shell
# Install Azure CLI
$ curl -L https://aka.ms/InstallAzureCli | bash
# Sign in
$ az login
# Create a resource group for the cluster
$ az group create --name <resource group name> --location <group location>
# Create a Service Principal for the cluster
$ az ad sp create-for-rbac --name <service principal name>
# Create the AKS cluster with nodes that are of size Standard_DS2_v2
$ az aks create --resource-group <above resource group name> --name <aks cluster name> --node-vm-size <node vm size such as Standard_DS2_v2> --generate-ssh-keys --service-principal <APPID generated above> --client-secret <PASSWORD generated above>
# Get credentials for cluster connection
$ az aks get-credentials --resource-group <above resource group name> --name <above aks cluster name>
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084515.png "img")


# PySparkでスパークジョブの準備

Sparkは複数のプログラム言語をサポートしており、ここではpythonとPySparkを例にしています。タスクが完了すると、スパークイメージで用意したCSVファイルに含まれる全てのレコードが対象のHologresテーブルに保存されます。     
DataFrameReaderの`csv("path")`または`format("csv").load("path")`を使うと、CSVファイルをPySparkのDataFrameに読み込むことができます。また、[JdbcRDD](http://spark.apache.org/docs/latest/api/scala/org/apache/spark/rdd/JdbcRDD.html)を使えば、特定のドライバを使って簡単にデータベースにDataFrameを書き込むことができます。    

この状態ではHologresインスタンスはPostgreSQLとして接続されています。詳しい情報は、[spark JDBC data source](http://spark.apache.org/docs/latest/sql-data-sources-jdbc.html)や[spark generic file source](http://spark.apache.org/docs/latest/sql-data-sources-load-save-functions.html)を参照してください。     

以下のスクリプトで `hologres_spark.py` を作成します。     

```py
import findspark

findspark.init()

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
        .load("<your file path in spark image, such as /opt/spark/work-dir/data.csv>")
    df_with_schema.write.mode("append").format("jdbc") \
        .option("url", "<JDBC connection url of your instance, e.g. jdbc:postgresql://<endpoint>:<port>/<database name>") \
        .option("dbtable", "<your target table name>") \
        .option("user", "<your accessKeyId>") \
        .option("password", "<your accessKeySecret>") \
        .option("driver", "org.postgresql.Driver") \
        .save()

```

# Submit spark job

pythonスクリプトをAzure blob storageに置くには、[この手順](https://docs.microsoft.com/en-us/azure/aks/spark-job#copy-job-to-storage)に従って配置する必要があります。     

> https://docs.microsoft.com/en-us/azure/aks/spark-job#copy-job-to-storage

コマンドは次の通りです。     

```shell
# Create storage account
$ az storage account create --resource-group <above resource group name> --name <storage account name> --sku Standard_LRS
# Export Azure storage connection string
$ export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string --resource-group <above resource group name> --name <above storage account name> -o tsv`
# Create storage container
$ az storage container create --name <container name>
# Set container permission as public
$ az storage container set-permission --name <above container name> --public-access blob
# Upload python script into container
$ az storage blob upload --container-name <above container name> --file <local file path> --name <file name in container>
# Get access url for uploaded python script
$ scriptUrl=$(az storage blob url --container-name <above container name> --name <above file name in container> | tr -d '"')
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084538.png "img")

ここでは[Spark Jobをsubmitする方法](https://docs.microsoft.com/en-us/azure/aks/spark-job#submit-a-spark-job)を説明します。      
`kubectl proxy`を実行して、kube-proxyを別のコマンドラインで起動します。    

> https://docs.microsoft.com/en-us/azure/aks/spark-job#submit-a-spark-job

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084552.png "img")

先ほど前のコマンドラインに戻り、以下のようにサービスアカウントとクラスターを作成します。     


```shell
$ kubectl create serviceaccount spark
$ kubectl create clusterrolebinding spark-role --clusterrole=edit --serviceaccount=default:spark --namespace=default
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084605.png "img")

PySparkタスクをAKS (Azure Kubernetes Service) クラスターにSubmit します。必要に応じて、image 情報とFile pathを更新します。    

```shell
./bin/spark-submit \
    --master k8s://http://127.0.0.1:8001 \
    --deploy-mode cluster \
    --name hologres-spark \
    --conf spark.executor.instances=3 \
    --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
    --conf spark.kubernetes.container.image.pullPolicy=Always \
    --conf spark.kubernetes.container.image=bwbw723/spark-k8s-hologres-demo:2.4.7 \
    --driver-class-path local:///opt/spark/work-dir/postgresql-42.2.6.jar \
    --jars local:///opt/spark/work-dir/postgresql-42.2.6.jar \
    <above scriptUrl>
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084617.png "img")

`kubectl get pods`で実際のPod情報を確認します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084629.png "img")

Hologresテーブルのレコードをチェックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084641.png "img")


##PySparkでspark streaming jobを準備する



[Alibaba Cloudが提供するSpark SDK](https://www.alibabacloud.com/cloud-tech/doc-detail/51075.htm) を使用すると、LogServiceでReceiver（受信モード）もしくはDirect（直接モード）でログデータを受け取りすることが出来ます。関連情報およびソースとして [Git aliyun-emapreduce-datasources](https://github.com/aliyun/aliyun-emapreduce-datasources/tree/master-2.x/emr-logservice)  および、[Git aliyun-emapreduce-demo](https://github.com/aliyun/aliyun-emapreduce-demo) にて詳しい説明があります。         


> https://www.alibabacloud.com/cloud-tech/doc-detail/51075.htm

Spark SDKを使って、DataStreamReaderはログサービスを `loghub` フォーマットとして認識することができました。
Pythonの使い方については、[こちら](https://github.com/aliyun/aliyun-emapreduce-datasources/blob/main/docs/how_to_run_spark_with_python_sdk.md)を参照してください。

> https://github.com/aliyun/aliyun-emapreduce-datasources/blob/main/docs/how_to_run_spark_with_python_sdk.md

以下のスクリプトで`holres_spark_streaming.py`を作成します。

```py
import findspark

findspark.init()

from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, IntegerType, StringType


def foreach_batch_function(df, epoch_id):
    df.write.mode("append").format("jdbc") \
        .option("url", "<public JDBC connection url of your instance, e.g. jdbc:postgresql://<endpoint>:<port>/<database name>") \
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
        .option("endpoint", "<your endpoint such as ap-northeast-1.log.aliyuncs.com>") \
        .option("startingoffsets", "latest") \
        .load()
    stream = line_with_schema.writeStream.foreachBatch(foreach_batch_function).start()
    stream.awaitTermination()

```

# データ転送のためにAlibaba Cloud Log Serviceのリソース準備
Alibaba Cloudコンソールに入り、Log ServiceプロジェクトとLogStoreを準備します。LogStoreを作成するときは、WebTrackingが有効になっていることを確認します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084658.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084707.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084717.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084726.png "img")

logstore dataを入力し、インデックス属性を有効にします。　   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084739.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084746.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084755.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084803.png "img")


# Spark streaming jobの実行
まずはHologresのテーブルデータをDELETEらSQLクエリでクリアします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084816.png "img")

Azure CLI (`az storage blob upload ...`) またはAzure Portalで、事前に作成したSpark streamingスクリプトをAzure blobストレージにアップロードします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084829.png "img")

アップロードされたスクリプトのアクセスURLを取得します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084841.png "img")

作業環境のコマンドラインに戻り、AKS(Azure Kubernetes Service)クラスタにSpark streaming Taskを投入します。     

```shell
./bin/spark-submit \
    --master k8s://http://127.0.0.1:8001 \
    --deploy-mode cluster \
    --name hologres-spark-streaming \
    --conf spark.executor.instances=3 \
    --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
    --conf spark.kubernetes.container.image.pullPolicy=Always \
    --conf spark.kubernetes.container.image=bwbw723/spark-k8s-hologres-demo:2.4.7 \
    --driver-class-path local:///opt/spark/work-dir/postgresql-42.2.6.jar \
    --jars local:///opt/spark/work-dir/postgresql-42.2.6.jar,local:///opt/spark/work-dir/fastjson-1.2.45.jar,local:///opt/spark/work-dir/commons-validator-1.4.0.jar,local:///opt/spark/work-dir/ezmorph-1.0.6.jar,local:///opt/spark/work-dir/emr-logservice_2.11-2.2.0.jar,local:///opt/spark/work-dir/loghub-client-lib-0.6.13.jar,local:///opt/spark/work-dir/aliyun-log-0.6.10.jar,local:///opt/spark/work-dir/json-lib-2.4-jdk15.jar,local:///opt/spark/work-dir/zkclient-0.10.jar,local:///opt/spark/work-dir/emr-common_2.11-2.2.0.jar \
    <access url of your spark streaming script>
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084856.png "img")

`kubectl get pods` で realted pod 情報を確認します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084909.png "img")

Spark streaming job の実行中に、以下のスクリプトで新しいLog Serviceのレコードを送信し、関連するログを確認します。


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

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084924.png "img")

今度はHologresでレコードを確認します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084935.png "img")

# 最後に
ここまで、Azureのk8s（AKS）にApache Sparkを配置し、Hologresへデータ連携する方法を紹介しました。      
この方法を生かすことで、Alibaba Cloudでない、他社クラウドサービスからApache Spark on k8sを使ってk8sのサービス基盤からリアルタイムでHologresへ連携、Hologresでリアルタイム可視化を実現することができます。      




