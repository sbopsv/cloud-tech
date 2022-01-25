---
title: "ApacheKafkaからClickHouse連携"
metaTitle: "Apache kafka（Message Queue for Apache Kafka）からClickHouseへデータ連携する方法"
metaDescription: "Apache kafka（Message Queue for Apache Kafka）からClickHouseへデータ連携する方法"
date: "2021-08-15"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613793349600/003.png"
---

## Apache kafka（Message Queue for Apache Kafka）からClickHouseへデータ連携する方法

本記事では、Apache Kafkaから[ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse) へリアルタイ
ムでデータ連携する方法をご紹介します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210714233458.png "img")


構成図は次の通りです。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/003.png "img")


# ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/


# Apache kafka（Message Queue for Apache Kafka）とは
Apache kafkaはスケーラビリティに優れた分散メッセージングシステムです。      
これは元々Apacheオープンソースとして展開されていましたが、これをAlibabaによりフルマネージド型サービスとして登場したのがMessage Queue for Apache Kafkaです。      

> https://www.alibabacloud.com/product/kafka



# 1.ClickHouseの準備
## 1-1.ClickHouseインスタンスを準備します

この手法は[過去の記事](https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start)でも記載していますが、再掲として記載します。

> https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start

1）まずはApsaraDB for ClickHouseインスタンスを作成します。      
①VPCを作成      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210716155113.png "img")

②ClickHouseインスタンスを作成      
著者は以下のインスタンススペックでインスタンスを作成しています。      

> ClickHouse version:20.8.7.15
> Edition：Single-replica Edition

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成      
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続      
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210716155401.png "img")



# 2.Apache kafka（Message Queue for Apache Kafka）の準備
## 2-1.Kafkaインスタンスを作成します
1）AlibabaCloudのサイトをログインし、Message Queue for Apache Kafka を選択します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012125.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012134.png "img")


2）Kafkaインスタンスを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012149.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012158.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012205.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012214.png "img")


3）Kafkaをデプロイします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012229.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012237.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012246.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012254.png "img")


4）Topicを作成します      
①Kafka詳細画面またはTopic画面に、Topic作成をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012312.png "img")

②Topic情報を入力し、Topicを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012324.png "img")

③Topicを作成しました      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012340.png "img")


5）Consumer Groupを作成します      
①Consumer Group画面にConsumer Group作成をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012419.png "img")

②Consumer Group情報を入力し、Consumer Groupを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012431.png "img")

③Consumer Groupを作成しました      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012454.png "img")

## 2-2.IntelliJ IDEAを使ってJava SDKでKafkaデータを作成します
1）JavaProjectを作成します      

①IntelliJ IDEAを開き、ファイルメニューからプロジェクトをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012514.png "img")

②Mavenを選択します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012525.png "img")

③プロジェクト名を設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012536.png "img")

④プロジェクト名とパスを設定します（事前にフォルダを作成する必要があります）      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012548.png "img")

⑤プロジェクトを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012619.png "img")


⑥Project Encodingを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012636.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012644.png "img")

2）Kafkaデータを生成します      
①下記Java依存関係ライブラリをpom.xmlに追加します      

```pom.xml
    <dependency>
        <groupId>org.apache.kafka</groupId>
        <artifactId>kafka-clients</artifactId>
        <version>0.11.0.3</version>
        <exclusions>
            <exclusion>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-api</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
        <version>1.7.6</version>
    </dependency>
    <dependency>
        <groupId>commons-cli</groupId>
        <artifactId>commons-cli</artifactId>
        <version>1.4</version>
    </dependency>
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012700.png "img")

②log4j.propertiesコンフィグファイルを作成します      

```log4j.properties
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

log4j.rootLogger=INFO, STDOUT

log4j.appender.STDOUT=org.apache.log4j.ConsoleAppender
log4j.appender.STDOUT.layout=org.apache.log4j.PatternLayout
log4j.appender.STDOUT.layout.ConversionPattern=[%d] %p %m (%c)%n
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012717.png "img")

③kafka.propertiesを作成します      

```kafka.properties
## アクセスポイントを設定することで、コンソール画面の詳細画面にデフォルトアクセスポイントが表示されます
bootstrap.servers=172.16.0.84:9092,172.16.0.83:9092,172.16.0.82:9092

## Topicを設定することで、コンソール画面にTopicが作成されます
topic=topic_ck_new

## Consumer Groupを設定することで、コンソール画面にConsumer Groupが作成されます
group.id=group_ck

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012737.png "img")


④JavaKafkaConfigurer.javaを作成します      

```JavaKafkaConfigurer.java
import java.util.Properties;

public class JavaKafkaConfigurer {
    private static Properties properties;
    public synchronized static Properties getKafkaProperties() {
        if (null != properties) {
            return properties;
        }
        //kafka.propertiesの内容を取得
        Properties kafkaProperties = new Properties();
        try {
            kafkaProperties.load(KafkaProducerDemo.class.getClassLoader().getResourceAsStream("kafka.properties"));
        } catch (Exception e) {
            //ファイルをロード失敗しました、Quite可能
            e.printStackTrace();
        }
        properties = kafkaProperties;
        return kafkaProperties;
    }
}
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817012912.png "img")


⑤KafkaProducerDemo.javaを作成します      

```KafkaProducerDemo.java
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.Future;

import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;

public class KafkaProducerDemo {

    public static void main(String args[]) {
        //kafka.propertiesをロードします
        Properties kafkaProperties =  JavaKafkaConfigurer.getKafkaProperties();

        Properties props = new Properties();
        //アクセスポイントを設定、コンソール画面に該当Topicのアクセスポイントを取得します
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaProperties.getProperty("bootstrap.servers"));

        //Kafkaメッセージのシリアル化方法。
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        //リクエストの最大待機時間。
        props.put(ProducerConfig.MAX_BLOCK_MS_CONFIG, 30 * 1000);
        //内部クライアントの再試行回数を設定します。
        props.put(ProducerConfig.RETRIES_CONFIG, 5);
        //クライアントの内部再試行間隔を設定します。
        props.put(ProducerConfig.RECONNECT_BACKOFF_MS_CONFIG, 3000);
        //Producerオブジェクトを作成します，このオブジェクトはスレッドセーフであることに注意してください。一般的に、プロセス内の1つのProducerオブジェクトで十分です。
        //パフォーマンスを向上させたい場合は、さらにいくつかのオブジェクトを作成できますが、多すぎないようにします。できれば5つ以下にします。
        KafkaProducer<String, String> producer = new KafkaProducer<String, String>(props);

        //Kafkaメッセージを作成する。
        String topic = kafkaProperties.getProperty("topic"); //メッセージのTopic、コンソール画面で作成後、入力します
        String value = "this is the message's value"; //メッセージ内容。

        try {
            //Futureオブジェクトをバッチ取得することでスピードアップできる。バッチ量は大きく設定しないことをご注意ください
            List<Future<RecordMetadata>> futures = new ArrayList<Future<RecordMetadata>>(128);
            for (int i =0; i < 100; i++) {
                //メッセージを発信、Futureオブジェクトを取得します
                String msgBody = "{'index':" + i + ", 'content': '" + value + ": " + i + "'}"; //jsonastring
                ProducerRecord<String, String> kafkaMessage =  new ProducerRecord<String, String>(topic, msgBody);//jasonasstring
                //ProducerRecord<String, String> kafkaMessage =  new ProducerRecord<String, String>(topic, value + ": " + i);
                Future<RecordMetadata> metadataFuture = producer.send(kafkaMessage);
                futures.add(metadataFuture);

            }
            producer.flush();
            for (Future<RecordMetadata> future: futures) {
                //Futureオブジェクトの結果を同時に取得します
                try {
                    RecordMetadata recordMetadata = future.get();
                    System.out.println("Produce ok:" + recordMetadata.toString());
                } catch (Throwable t) {
                    t.printStackTrace();
                }
            }
        } catch (Exception e) {
            //クライアント内部リトライ後、再度発信失敗、このエラーを対応する必要があります
            System.out.println("error occurred");
            e.printStackTrace();
        }
    }
}
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013000.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013009.png "img")


⑥プロジェクトをコンパイルし、KafkaConsumerDemo.javaを実行します      
```KafkaConsumerDemo.java
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.ProducerConfig;

public class KafkaConsumerDemo {

    public static void main(String args[]) {
        //kafka.propertiesをロードします
        Properties kafkaProperties =  JavaKafkaConfigurer.getKafkaProperties();

        Properties props = new Properties();
        //アクセスポイントを設定、コンソール画面に該当Topicのアクセスポイントを取得します
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaProperties.getProperty("bootstrap.servers"));
        //2つのポーリング間の最大許容間隔。
        //コンシューマーがこの値を超えるとハートビートを返さない、サーバーはコンシューマーが非ライブ状態であると判断し、サーバーはコンシューマーをコンシューマーグループから削除してリバランスをトリガーします。デフォルトは30秒です。
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, 30000);
        //毎回ポーリングの最大数。
        //この値は大きく設定しないように、ポーリングのデータが多すぎると次のポーリングの前に消費できない場合、SLBがトリガーされ、フリーズが発生します。
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 30);
        //メッセージを逆シリアル化する方法
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        //コンシューマーインスタンスが属するコンシューマーグループは、コンソールアで作成後入力します。
        //同じグループに属するコンシューマーインスタンスは、コンシューマーメッセージをロードします
        props.put(ConsumerConfig.GROUP_ID_CONFIG, kafkaProperties.getProperty("group.id"));
        //メッセージオブジェクトを構築します。つまり、消費インスタンスを生成します
        KafkaConsumer<String, String> consumer = new org.apache.kafka.clients.consumer.KafkaConsumer<String, String>(props);
        //コンシューマーグループがサブスクライブするトピックを設定する。複数のトピックをサブスクライブできます。
        //GROUP_ID_CONFIGが同じである場合は、サブスクライブされたトピックを同じに設定することをお勧めします。
        List<String> subscribedTopics =  new ArrayList<String>();
        //複数のトピックをサブスクライブする必要がある場合は、ここに追加してください。
        //各トピックは、予めコンソールで作成する必要があります
        String topicStr = kafkaProperties.getProperty("topic");
        String[] topics = topicStr.split(",");
        for (String topic: topics) {
            subscribedTopics.add(topic.trim());
        }
        consumer.subscribe(subscribedTopics);

        //リサイクルでメッセージを消費します
        while (true){
            try {
                ConsumerRecords<String, String> records = consumer.poll(1000);
                //次のポーリングの前にこのデータが消費される必要があり、合計時間はSESSION_TIMEOUT_MS_CONFIGを超えてはなりません。
                //メッセージを消費するために単独なスレッドプールを開くことをお勧めします。結果を非同期で返すこと
                for (ConsumerRecord<String, String> record : records) {
                    System.out.println(String.format("Consume partition:%d offset:%d", record.partition(), record.offset()));
                }
            } catch (Exception e) {
                try {
                    Thread.sleep(1000);
                } catch (Throwable ignore) {

                }
                e.printStackTrace();
            }
        }
    }
}
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013051.png "img")


⑦プロジェクトをコンパイルし、KafkaProducerDemo.javaを実行します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013103.png "img")

⑧プロジェクトをビルドします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013115.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013124.png "img")

⑧下記コマンドでJarパッケージを作成します      

```
mvn package
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013141.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013151.png "img")


2-3.Linuxでkafkaデータを生成します      
①linuxをログインし、jarファイルをLinuxにアップロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013206.png "img")

② jarを実行し、Kafkaデータを生成します      

```
# java -jar kafkaclickhouse-1.0-SNAPSHOT-jar-with-dependencies.jar
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013229.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013237.png "img")


③Kafkaコンソール画面でデータを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013249.png "img")

④JarパッケージでKafkaデータを生成します      

```
# java -classpath kafkaclickhouse-1.0-SNAPSHOT-jar-with-dependencies.jar com.test.kafka.KafkaProducerDemo
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013302.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013313.png "img")


⑤JarパッケージでKafkaデータを消費します      

```
# java -classpath kafkaclickhouse-1.0-SNAPSHOT-jar-with-dependencies.jar com.test.kafka.KafkaConsumerDemo
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013335.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013344.png "img")


# 3.KafkaデータをClickHouseにインポート
## 3-1.ClickHouseでテーブルを作成します
1）DMSでClickhouseへ接続します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013414.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013424.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013432.png "img")


2）データベースを作成します      

```
create database if not exists kafka_clickhouse_demo ON CLUSTER default;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013446.png "img")

3）ClickHouseでKafkaコンシューマーテーブルを作成します。ここではkafka_clickhouse_demoデータベースを使用します。      

```
create table kafka_src_table(
`message` String
)
ENGINE = Kafka()
SETTINGS kafka_broker_list = '172.16.0.84:9092,172.16.0.83:9092,172.16.0.82:9092',
         kafka_topic_list = 'topic_ck_new',
         kafka_group_name = 'group_ck',
         kafka_format = 'JSONAsString';
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013544.png "img")

※kafka_formatおよびパラメータがKafkaのデータソースと一致する必要があります      
※Kafkaコンシューマーテーブル消費テーブルを結果テーブルとして直接使用することはできません。Kafka消費テーブルは、Kafkaデータを消費するためにのみ使用されます。そのため、kafka側で実際にすべてのデータを保存しているわけではありません。      

4）ClickHouseでローカルテーブルを作成します      

```
CREATE TABLE kafka_table_local(
    `message` String
)
ENGINE = MergeTree()
ORDER BY message;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013639.png "img")


5）Clickhouseの分散テーブルを作成します      

```
CREATE TABLE kafka_table_distributed ON CLUSTER default AS kafka_clickhouse_demo.kafka_table_local
ENGINE = Distributed(default, kafka_clickhouse_demo,kafka_table_local, rand());
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013700.png "img")


6）ClickHouseでMATERIALIZED VIEWテーブルを作成します      
```
CREATE MATERIALIZED VIEW source_mv TO kafka_table_distributed AS
SELECT
    `message`
FROM kafka_src_table;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013717.png "img")


③テーブルを表示します      
```
show tables;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013734.png "img")


## 3-2.kafkaでデータを生成します
1）下記コマンドでKafkaデータを生成します      

```
# java -jar kafkaclickhouse-1.0-SNAPSHOT-jar-with-dependencies.jar
```

または      

```
# java -classpath kafkaclickhouse-1.0-SNAPSHOT-jar-with-dependencies.jar com.test.kafka.KafkaProducerDemo
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013756.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013805.png "img")


2）Kafkaコンソール画面でデータを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013820.png "img")


## 3-3.Clickhouseでデータをインポートします
1）kafka_src_tableを確認します      

```
SELECT * FROM `kafka_src_table` LIMIT 20;
SELECT COUNT( *) FROM kafka_src_table;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013836.png "img")


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013845.png "img")


2）kafka_table_localを確認します      

```
SELECT * FROM `kafka_table_local` LIMIT 20;
SELECT COUNT( *) FROM kafka_table_local;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013903.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013911.png "img")


3）kafka_table_distributedを確認します      
```
SELECT * FROM `kafka_table_distributed` LIMIT 20;
SELECT COUNT( *) FROM kafka_table_distributed;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013924.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013932.png "img")


4）source_mvを確認します      
```
SELECT * FROM `source_mv` LIMIT 20;
SELECT COUNT( *) FROM source_mv;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013946.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613793349600/20210817013954.png "img")



---

# 最後に

ここまで、Apache kafka（Message Queue for Apache Kafka）- ClickHouseのデータ連携方法を紹介しました。      
ApsaraDB for ClickHouseは Apache kafka とスムーズに連携できるので、Apache kafka（Message Queue for Apache Kafka）もしくはApache kafka  - ClickHouse といったリアルタイムデータ分析ソリューションとして仕上げることもできます。      



