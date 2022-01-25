---
title: "ApacheFlinkからClickHouse連携"
metaTitle: "Apache FlinkからClickHouseへデータをリアルタイム格納する方法"
metaDescription: "Apache FlinkからClickHouseへデータをリアルタイム格納する方法"
date: "2021-08-23"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613797936300/20210824161648.png"
---

## Apache FlinkからClickHouseへデータをリアルタイム格納する方法

本記事では、Apache Flinkから[ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse) へリアルタイムでデータ連携する方法をご紹介します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210714233458.png "img")




# ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/


# Apache Flinkとは
オープンソースの分散ストリーム処理プラットフォームです。

> https://flink.apache.org/


本記事では、Apache FlinkからClickHouseへデータをリアルタイム格納してみます。構成図は次の通りです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824161648.png "img")


# 1.ClickHouseClientの準備
## 1-1.ClickHouseインスタンスを準備します

この手法は[過去の記事](https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start)でも記載していますが、再掲として記載します。

> https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start


1）まずはApsaraDB for ClickHouseインスタンスを作成します。     
①VPCを作成     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210716155113.png "img")

②ClickHouseインスタンスを作成     
著者は以下のインスタンススペックでインスタンスを作成しています。     

> ClickHouse version:20.8.7.15
> Edition：Single-replica Edition

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成     
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続     
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210716155401.png "img")


# 2. Apache Flinkプロジェクトを作成

## 2-1.IntelliJ IDEAをインストールします。（具体的な説明は本記事では省略）
1）IntelliJ IDEAを起動します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824161929.png "img")

## 2-2. Apache Flink 1.12でプロジェクトを準備します
1）フォルダを作成します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824161953.png "img")

2）Intellij ideaでプロジェクトを作成します     
前提条件として、Java1.8がインストールされていることが必須です     

①File‐New‐Projectをクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824162208.png "img")

②Mavenを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195607.png "img")


③フォルダを選択します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195621.png "img")

④Finishをクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195633.png "img")

⑤Projectが作成されたことを確認します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195648.png "img")

3）プロジェクトを編集します    
ディレクトリ構造    

```folder
./pom.xml
./src/main/java/com/nancy/flink/ck/FlinkCkSinkSample.java
./src/main/resources/access_log_csv.txt

```

①pom.xmlを編集します     
```pom.xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>flink-clickhouse-sink</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-core</artifactId>
            <version>1.12.3</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-table-api-java-bridge_2.11</artifactId>
            <version>1.12.3</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-table-planner_2.11</artifactId>
            <version>1.12.3</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-streaming-scala_2.11</artifactId>
            <version>1.12.3</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>ru.ivi.opensource</groupId>
            <artifactId>flink-clickhouse-sink</artifactId>
            <version>1.3.1</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.1.1</version>
                <executions>
                    <!-- Run shade goal on package phase -->
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <filters>
                                <filter>
                                    <artifact>*:*</artifact>
                                    <excludes>
                                        <exclude>META-INF/*.SF</exclude>
                                        <exclude>META-INF/*.DSA</exclude>
                                        <exclude>META-INF/*.RSA</exclude>
                                    </excludes>
                                </filter>
                            </filters>
                            <transformers>
                                <transformer
                                        implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>com.nancy.flink.ck.FlinkCkSinkSample</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195725.png "img")


② FlinkCkSinkSample.javaを編集します     
```FlinkCkSinkSample.java
package com.nancy.flink.ck;

import org.apache.commons.io.IOUtils;
        import org.apache.flink.api.java.utils.ParameterTool;
        import org.apache.flink.streaming.api.datastream.DataStream;
        import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
        import ru.ivi.opensource.flinkclickhousesink.ClickHouseSink;
        import ru.ivi.opensource.flinkclickhousesink.model.ClickHouseClusterSettings;
        import ru.ivi.opensource.flinkclickhousesink.model.ClickHouseSinkConst;

        import java.io.InputStream;
        import java.util.HashMap;
        import java.util.List;
        import java.util.Map;
        import java.util.Properties;

/**
 * Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements.  See the NOTICE
 * file distributed with this work for additional information regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
public class FlinkCkSinkSample {
    public static void main(String[] args) throws Exception {
        final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        buildClickHouseGlobalSinkParams(env);
        InputStream is = FlinkWithCkSinkSample.class.getClassLoader().getResourceAsStream("access_log_csv.txt");
        List<String> userRecList = IOUtils.readLines(is, "UTF-8");
        DataStream<String> userDataStream = env.fromCollection(userRecList);
        Properties props = new Properties();
        props.put(ClickHouseSinkConst.TARGET_TABLE_NAME, "flink_table_local");
        props.put(ClickHouseSinkConst.MAX_BUFFER_SIZE, "10000");
        userDataStream.map(FlinkWithCkSinkSample::toClickHouseInsertFormatFields)
                .name("convert raw record to ClickHouse table format")
                .addSink(new ClickHouseSink(props))
                .name("flink_table_distributed");
        env.execute();
    }

    // CK: d_sink_table(`id` Int32, `user_name` String, `age` Int32, `city` String, `access_url` String)
    // RAW Record: 190|30|M|administrator|95938
    public static String toClickHouseInsertFormatFields(String userRowRecord) {
        String[] fields = userRowRecord.split("\\|");
        System.out.println(fields.length);
        String rec = String.format("(%s, '%s', %s, '%s', '%s')", fields[0], fields[1], fields[2], fields[3], fields[4]);
        System.out.println(rec);
        return rec;
    }

    private static void buildClickHouseGlobalSinkParams(StreamExecutionEnvironment environment) {
        Map<String, String> globalParameters = new HashMap<>();

        // ClickHouse cluster properties
        globalParameters.put(ClickHouseClusterSettings.CLICKHOUSE_HOSTS, "cc-0iw4v4hezq9lw9333o.ads.aliyuncs.com:8123");
        globalParameters.put(ClickHouseClusterSettings.CLICKHOUSE_USER, "sbtest");
        globalParameters.put(ClickHouseClusterSettings.CLICKHOUSE_PASSWORD, "Test1234");

        // sink common
        globalParameters.put(ClickHouseSinkConst.TIMEOUT_SEC, "5");

        globalParameters.put(ClickHouseSinkConst.FAILED_RECORDS_PATH, System.getProperty("user.home"));
        globalParameters.put(ClickHouseSinkConst.NUM_WRITERS, "3");
        globalParameters.put(ClickHouseSinkConst.NUM_RETRIES, "5");
        globalParameters.put(ClickHouseSinkConst.QUEUE_MAX_CAPACITY, "1024");
        globalParameters.put(ClickHouseSinkConst.IGNORING_CLICKHOUSE_SENDING_EXCEPTION_ENABLED, "false");

        // set global paramaters
        ParameterTool parameters = ParameterTool.fromMap(globalParameters);
        environment.getConfig().setGlobalJobParameters(parameters);
    }
}
```

packageを作成します        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195753.png "img")


FlinkCkSinkSample.javaを作成します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195808.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195816.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195825.png "img")


③データソースを用意します       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195838.png "img")

4）プロジェクトをコンパイルし、Jarをパッケージ化します      
①プロジェクトを選択し、右クリックメニューからビルドします       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195901.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195910.png "img")


②下記コマンドでパッケージをします       

```
mvn clean compile package
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195922.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195931.png "img")


パッケージを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824195946.png "img")

## 3. ECS上のLinuxでApache Flink環境の準備
### 3-1.Java1.8をインストールします

1）jdk1.8を用意します     
①jdk-8u144-linux-x64.tar.gzをダウンロードします       

（下記のリンクからでもjdkがダウンロードすることができます）      


> https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200042.png "img")

②jdk-8u144-linux-x64.tar.gzをjavaフォルダに解凍します     

```
# mkdir /usr/local/java/
# tar -zxvf jdk-8u144-linux-x64.tar.gz -C /usr/local/java/
```

2）Java環境を設定します      
①Java環境パスを設定します     

```
# vim /etc/profile
    export JAVA_HOME=/usr/local/java/jdk1.8.0_144
    export PATH=${JAVA_HOME}/bin:$PATH
    export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
    export JRE_HOME=$JAVA_HOME/jre

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200132.png "img")

②Java環境パスを有効します     

```
# source /etc/profile
# ln -s /usr/local/java/jdk1.8.0_144/bin/java /usr/bin/java
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200148.png "img")


③Javaバージョンを確認します       

```
java -version
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200203.png "img")

### 3-2. Apache Flink1.12をインストールします

①下記コマンドでApache Flink1.12をダウンロードします       

```
# wget https://mirrors.tuna.tsinghua.edu.cn/apache/flink/flink-1.12.5/flink-1.12.5-bin-scala_2.12.tgz
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200228.png "img")

②Apache Flink1.12を解凍します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200242.png "img")

③下記コマンドでApache Flink1.12を起動します       
```
# cd flink-1.12.5
# ./bin/start-cluster.sh
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200307.png "img")


## 4.Linux - Apache FlinkでtxtファイルデータをClickHouseへ格納
### 4-1.ClickHouseでターゲットテーブルを作成します
1）DMSでClickhouseを接続します       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200341.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200349.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200359.png "img")


2）ClickHouseでデフォルトDBにローカルテーブルを作成します     
```
create table flink_table_local on cluster default(
   id Int32,
   user_name String,
   age Int32,
   city String,
   access_url String
)
engine = MergeTree()
order by id;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200438.png "img")


3）ClickHouseでデフォルトDBに分散テーブルを作成します        
```
create table flink_table_distributed on cluster default(
   id Int32,
   user_name String,
   age Int32,
   city String,
   access_url String
)
engine = Distributed(default, default, flink_table_local, id);

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200454.png "img")


### 4-2.Linux - Apache FlinkでtxtファイルデータをClickHouseへ格納します
1）rzコマンドでJarパッケージをECSにアップロードします     
rzコマンドがインストールされていない場合、下記コマンドでインストールします        

```
yum -y install lrzsz
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200531.png "img")

無事アップロードされたことを確認します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200601.png "img")

2）下記コマンドでJarを実行します    
```
# ./bin/flink run flink-clickhouse-sink-1.0-SNAPSHOT.jar
Job has been submitted with JobID 2de615f64f920ccd47151f3839b4384e
Program execution finished
Job with JobID 2de615f64f920ccd47151f3839b4384e has finished.
Job Runtime: 1274 ms

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200611.png "img")


### 4-3.DMSでClickHouseのデータを確認します
1）DMSでtxtデータをClickHouseにインポートすることを確認します      
①分散テーブルを検索します      

```
SELECT * FROM flink_table_distributed;
SELECT COUNT(*) FROM flink_table_distributed;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200626.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200635.png "img")

②ローカルテーブルを検索します      
```
SELECT * FROM flink_table_local;
SELECT COUNT(*)  FROM flink_table_local;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200651.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613797936300/20210824200659.png "img")

---

# 最後に

ここまで、Apache Flink - ApsaraDB for ClickHouseへデータ連携する方法を紹介しました。     
ApsaraDB for ClickHouseはApache Flinkとスムーズに連携できるので、例えば、Apache FlinkやRealtime ComputeなどからApsaraDB for ClickHouseへリアルタイムデータ連携しつつ、ClickHouseでリアルタイム可視化、といったソリューションを構築することもできます。     



