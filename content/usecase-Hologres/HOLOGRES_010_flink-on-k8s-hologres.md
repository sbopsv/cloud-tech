---
title: "Flink on k8sからHologres連携"
metaTitle: "Apache Flink on k8sからHologresへデータ連携方法"
metaDescription: "Apache Flink on k8sからHologresへデータ連携方法"
date: "2021-09-10"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/Hologres_images_26006613800887600/20210910094411.png"
---

## Apache Flink on k8sからHologresへデータ連携方法

本記事では、[Hologres](https://www.alibabacloud.com/product/hologres) を使って、AWSのKubernetesサービスであるECSからApache Flinkによるマルチクラウドーリアルタイムデータ連携する方法をご紹介します。    


# Hologresとは

> <span style="color: #ff0000"><i>Hologres はリアルタイムのインタラクティブ分析サービスです。高い同時実行性と低いレイテンシーでTB、PBクラスのデータの移動や分析を短時間で処理できます。PostgreSQL11と互換性があり、データを多次元で分析し、ビジネスインサイトを素早くキャッチすることができます。</i></span>

少し前になりますが、Hologresについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-hologres


# Apache Flinkとは
[Apache Flink](https://flink.apache.org/) は、大規模データを分散ストリームおよびバッチデータ処理のためのオープンソースプラットフォームです。Apache Sparkと同様、複数のプログラム言語でハイレベルなAPIを提供しており、ビッグデータソリューションのストリーミング分野で人気があります。

> https://flink.apache.org/


# Kubernetes（k8s）とは
[Kubernetes](https://kubernetes.io/) は、K8sとも呼ばれ、コンテナ化されたアプリケーションのデプロイ、スケーリング、管理を自動化するためのオープンソースのシステムで、アプリケーションを構成するコンテナを論理的な単位にまとめ、管理と発見を容易にします。   

> https://kubernetes.io/

# Kubernetes上でApache Flinkを使ってHologresでデータ処理をする

このガイドラインでは、Kubernetes上のApache Flinkを使って、Hologresによるデータ処理を段階的に作成します。Flinkの公式イメージは[ACK(Alibaba Cloud Container Service for Kubernetes)](https://www.alibabacloud.com/cloud-tech/doc-detail/86737.htm)にデプロイされます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910094411.png "img")

# このチュートリアルについて
## 対象者: 

本ガイドラインは、以下のような方を対象としています      
- git、docker、Kubernetes,、Alibaba Cloud、Hologres,、ACK(Alibaba Cloud Container Service for Kubernetes)に関する基本的な知識を持っている       
- 基本的なデプロイメントの知識があり、Java実行ができる     
   
## 前提条件:
- Alibaba Cloudのアカウントを所持している       
- Alibaba Cloud HologresとACK(Alibaba Cloud Container Service for Kubernetes)が使用可能な状態になっている       
- 少なくとも1つのHologresインスタンスを持っている       
- 作業環境にmaven、Java、gitが用意されている     


# Kubernetesクラスタの準備

ACK(Alibaba Cloud Container Service for Kubernetes)にアクセスし、Flinkデプロイ用のサーバーレスKubernetesクラスタを作成します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095044.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095053.png "img")

新しいサーバーレスKubernetesクラスターの作成には、約3分ほどかかります。作成ログを確認しながら、クラスターの準備が整うまで待機します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095106.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095114.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095123.png "img")

# スタンドアロンのFlinkクラスターをKubernetes上にデプロイ
Flink Session clusterは、長時間実行されるKubernetes Deploymentとして実行されます。1つのSessionクラスター上で複数のFlinkジョブを実行することができます。各ジョブはクラスターがデプロイされた後にクラスターにサブミットする必要があります。     
KubernetesにおけるFlink Sessionクラスターのデプロイには、少なくとも3つのコンポーネントがあります。     
- JobManagerを実行するデプロイメント     
- TaskManagersのプールのためのデプロイメント     
- JobManagerのRESTおよびUIポートを公開するサービス     

以下のステップでは、これらを一つずつ準備していきます。より詳細な情報については、[Flink official document](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/deployment/resource-providers/standalone/kubernetes/#session-cluster-resource-definitions) を参照してください。yaml設定ファイルの記載方法は、[Flink official example configuration yaml](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/deployment/resource-providers/standalone/kubernetes/#appendix)にあります。      

> https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/deployment/resource-providers/standalone/kubernetes/#session-cluster-resource-definitions

> https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/deployment/resource-providers/standalone/kubernetes/#appendix

## ConfigMap の新規作成 

Kubernetes クラスタ管理画面に移動し、ConfigMap メニューから以下の yaml をベースにした ConfigMap を新規作成します。       

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: flink-config
  labels:
    app: flink
data:
  flink-conf.yaml: |+
    jobmanager.rpc.address: flink-jobmanager
    taskmanager.numberOfTaskSlots: 2
    blob.server.port: 6124
    jobmanager.rpc.port: 6123
    taskmanager.rpc.port: 6122
    queryable-state.proxy.ports: 6125
    jobmanager.memory.process.size: 1600m
    taskmanager.memory.process.size: 1728m
    parallelism.default: 2    
  log4j-console.properties: |+
    # This affects logging for both user code and Flink
    rootLogger.level = INFO
    rootLogger.appenderRef.console.ref = ConsoleAppender
    rootLogger.appenderRef.rolling.ref = RollingFileAppender

    # Uncomment this if you want to _only_ change Flink's logging
    #logger.flink.name = org.apache.flink
    #logger.flink.level = INFO

    # The following lines keep the log level of common libraries/connectors on
    # log level INFO. The root logger does not override this. You have to manually
    # change the log levels here.
    logger.akka.name = akka
    logger.akka.level = INFO
    logger.kafka.name= org.apache.kafka
    logger.kafka.level = INFO
    logger.hadoop.name = org.apache.hadoop
    logger.hadoop.level = INFO
    logger.zookeeper.name = org.apache.zookeeper
    logger.zookeeper.level = INFO

    # Log all infos to the console
    appender.console.name = ConsoleAppender
    appender.console.type = CONSOLE
    appender.console.layout.type = PatternLayout
    appender.console.layout.pattern = %d{yyyy-MM-dd HH:mm:ss,SSS} %-5p %-60c %x - %m%n

    # Log all infos in the given rolling file
    appender.rolling.name = RollingFileAppender
    appender.rolling.type = RollingFile
    appender.rolling.append = false
    appender.rolling.fileName = ${sys:log.file}
    appender.rolling.filePattern = ${sys:log.file}.%i
    appender.rolling.layout.type = PatternLayout
    appender.rolling.layout.pattern = %d{yyyy-MM-dd HH:mm:ss,SSS} %-5p %-60c %x - %m%n
    appender.rolling.policies.type = Policies
    appender.rolling.policies.size.type = SizeBasedTriggeringPolicy
    appender.rolling.policies.size.size=100MB
    appender.rolling.strategy.type = DefaultRolloverStrategy
    appender.rolling.strategy.max = 10

    # Suppress the irrelevant (wrong) warnings from the Netty channel handler
    logger.netty.name = org.apache.flink.shaded.akka.org.jboss.netty.channel.DefaultChannelPipeline
    logger.netty.level = OFF
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095147.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095156.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095205.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095214.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095224.png "img")

## job managerのデプロイ

Kubernetesのクラスタ管理画面に移動し、Deploymentメニューから以下のyamlに基づいてjob managerとして新しいDeploymentを作成します。     

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flink-jobmanager
spec:
  replicas: 1
  selector:
    matchLabels:
      app: flink
      component: jobmanager
  template:
    metadata:
      labels:
        app: flink
        component: jobmanager
    spec:
      containers:
      - name: jobmanager
        image: apache/flink:1.13.0-scala_2.11
        args: ["jobmanager"]
        ports:
        - containerPort: 6123
          name: rpc
        - containerPort: 6124
          name: blob-server
        - containerPort: 8081
          name: webui
        livenessProbe:
          tcpSocket:
            port: 6123
          initialDelaySeconds: 30
          periodSeconds: 60
        volumeMounts:
        - name: flink-config-volume
          mountPath: /opt/flink/conf
        securityContext:
          runAsUser: 9999  # refers to user _flink_ from official flink image, change if necessary
      volumes:
      - name: flink-config-volume
        configMap:
          name: flink-config
          items:
          - key: flink-conf.yaml
            path: flink-conf.yaml
          - key: log4j-console.properties
            path: log4j-console.properties
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095242.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095250.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095259.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095307.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095316.png "img")

## task managerのデプロイ

同じプロセスの下で、以下の yaml に基づいてTask managerとして新しいDeploymentを作成します。     


```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flink-taskmanager
spec:
  replicas: 2
  selector:
    matchLabels:
      app: flink
      component: taskmanager
  template:
    metadata:
      labels:
        app: flink
        component: taskmanager
    spec:
      containers:
      - name: taskmanager
        image: apache/flink:1.13.0-scala_2.11
        args: ["taskmanager"]
        ports:
        - containerPort: 6122
          name: rpc
        - containerPort: 6125
          name: query-state
        livenessProbe:
          tcpSocket:
            port: 6122
          initialDelaySeconds: 30
          periodSeconds: 60
        volumeMounts:
        - name: flink-config-volume
          mountPath: /opt/flink/conf/
        securityContext:
          runAsUser: 9999  # refers to user _flink_ from official flink image, change if necessary
      volumes:
      - name: flink-config-volume
        configMap:
          name: flink-config
          items:
          - key: flink-conf.yaml
            path: flink-conf.yaml
          - key: log4j-console.properties
            path: log4j-console.properties
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095331.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095340.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095348.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095359.png "img")

これにより、Kubernetesクラスタ上にFlink job managerとtask managerがデプロイされました。これらを元に、関連するサービスを作成する必要があります。      

## job manager UI サービスの作成

Kubernetes クラスタ管理画面の「サービス」メニューから、以下の yaml に基づいて、job manager UI サービスを作成します。これは非HAモードの場合のみ必要で、job manager のWeb UIポートを公開します。      

```yaml
apiVersion: v1
kind: Service
metadata:
  name: flink-jobmanager
spec:
  type: ClusterIP
  ports:
  - name: rpc
    port: 6123
  - name: blob-server
    port: 6124
  - name: webui
    port: 8081
  selector:
    app: flink
    component: jobmanager
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095417.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095426.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095434.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095442.png "img")

## job manager restサービスの作成

同じプロセスの下で、以下の yaml に基づいて job manager rest サービスとして新しいサービスを作成します。 job manager用の rest ポートを公開します。      

```yaml
apiVersion: v1
kind: Service
metadata:
  name: flink-jobmanager-rest
spec:
  type: NodePort
  ports:
  - name: rest
    port: 8081
    targetPort: 8081
    nodePort: 30081
  selector:
    app: flink
    component: jobmanager
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095458.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095507.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095516.png "img")

## task manager queryステートサービスの作成

同じプロセスの下で、以下のyamlに基づいて、task manager queryステートサービスとして新しいサービスを作成します。照会可能な状態にアクセスするためのtask managerのポートを公開します。     

```yaml
apiVersion: v1
kind: Service
metadata:
  name: flink-taskmanager-query-state
spec:
  type: NodePort
  ports:
  - name: query-state
    port: 6125
    targetPort: 6125
    nodePort: 30025
  selector:
    app: flink
    component: taskmanager
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095533.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095542.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095552.png "img")

## オプション：job managerの公開用アクセスUIポートの設定

インターネット経由でサービスにアクセスする場合は、 job managerのUIポートで公開用の別のサービスが必要です。イントラネット経由でジョブマネージャUIサービスにアクセスする場合、このステップは無視してください。      
サーバー管理ページの作成ボタンをクリックし、SLB (Server Load Balancer) を利用した公開用サービスを構築します。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095605.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095614.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095622.png "img")

# データを生成してHologresに送信するタスクを準備

Alibaba Cloudでは、Flink用のHologresコネクタが提供されており、[Github hologres-flink-examples](https://github.com/hologres/hologres-flink-examples)でサンプルコードも提供されています。このサンプルコードを使って、データを生成し、Hologresに送信するタスクを作成します。     


> https://github.com/hologres/hologres-flink-examples


まず、コマンドラインで `git clone https://github.com/hologres/hologres-flink-examples.git`  でプロジェクトをクローンします。     
サンプルコードではユーザの入力からHologresの接続情報を取得していますが、Kubernetesクラスタでは環境変数を使用する必要があります。    


```
<project root>/src/main/java/io/hologres/flink/example/HologresSinkExample.java
```
を以下のように更新します。     


```java
......
    public static void main(String[] args) throws Exception {
        /*Options options = new Options();
        options.addOption("e", "endpoint", true, "Hologres endpoint");
        options.addOption("u", "username", true, "Username");
        options.addOption("p", "password", true, "Password");
        options.addOption("d", "database", true, "Database");
        options.addOption("t", "tablename", true, "Table name");

        CommandLineParser parser = new DefaultParser();
        CommandLine commandLine = parser.parse(options, args);
        String endPoint = commandLine.getOptionValue("endpoint");
        String userName = commandLine.getOptionValue("username");
        String password = commandLine.getOptionValue("password");
        String database = commandLine.getOptionValue("database");
        String tableName = commandLine.getOptionValue("tablename");*/

        String database = System.getenv("HOLO_TEST_DB");
        String userName = System.getenv("HOLO_ACCESS_ID");
        String password = System.getenv("HOLO_ACCESS_KEY");
        String endPoint = System.getenv("HOLO_ENDPOINT");
        String tableName = System.getenv("HOLO_TABLE_NAME");
......
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095656.png "img")

ビルドプロセス中にエラーメッセージが表示された場合は、pom.xml内の`holo-client`のバージョンを更新します。正しいバージョンは、[maven repository](https://mvnrepository.com/artifact/com.alibaba.hologres/holo-client) から入手できます。      

> https://mvnrepository.com/artifact/com.alibaba.hologres/holo-client

ビルドが完了すると、
```
<project root>/target/hologress-flink-examples-1.0.0-jar-with-dependencies 
```
が入手出来ますので、これを利用します。    

# Kubernetes 上の Flink クラスタにタスクを投入しテスト

## Hologresテーブルの作成
ソースコードによれば、生成されるテストデータは以下のスキーマ構成になっています。そのため、送信データを保存するには、同じスキーマ配下に新しいHologresテーブルを作成する必要があります。      


```java
......
        TableSchema schema = TableSchema.builder()
            .field("user_id", DataTypes.BIGINT())
            .field("user_name", DataTypes.STRING())
            .field("item_id", DataTypes.BIGINT())
            .field("item_name", DataTypes.STRING())
            .field("price", DataTypes.DECIMAL(38, 2))
            .field("province", DataTypes.STRING())
            .field("city", DataTypes.STRING())
            .field("longitude", DataTypes.STRING())
            .field("latitude", DataTypes.STRING())
            .field("ip", DataTypes.STRING())
            .field("sale_timestamp", Types.SQL_TIMESTAMP).build();
......
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095711.png "img")


## Hologres接続情報のための新しいSecretsの作成

更新されたソースコードによると、スクリプトは環境変数からHologres接続情報を取得します。そのため、新しいSecretsを作成し、Flinkクラスタに設定する必要があります。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095725.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095735.png "img")


## Hologres 接続情報のための有効な環境変数

job manager、task managerともに編集ボタンをクリックし、作成したSecretsに基づいて環境変数を追加します。`Variable Key`が更新されたソースコードと一致することを確認します。      


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095752.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095801.png "img")

job manager、task managerの両方を再デプロイして、更新された環境変数をアクティベーションします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095815.png "img")


## UIサービスからのタスク投入

外部のエンドポイントからjob managerのUIサービスにアクセスし、ビルドしたJARを使ってタスクを投入します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095828.png "img")

新しいタスクが作成され、生成されたデータが対象のHologresテーブルに送信されます（`running`ステータスになります）      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095841.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095850.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095858.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095906.png "img")

実行中のタスクを停止したい場合は、「cancel job」リンクをクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095920.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095929.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910095937.png "img")


# 最後に
ここまで、Apache FlinkからHologresへリアルタイムデータ連携する方法を紹介しました。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910104701.png "img")
 
この方法を生かすことで、例えばAWSやGCPなどのKubernetes（k8s）を使ったサービス基盤からApache FlinkでリアルタイムでHologresへ連携、Hologresでリアルタイム可視化を実現することができます。     





