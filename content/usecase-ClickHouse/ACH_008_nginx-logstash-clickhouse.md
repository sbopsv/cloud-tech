---
title: "Logstashでnginxログを連携"
metaTitle: "LogstashでnginxアクセスログをClickHouseへデータ連携する方法"
metaDescription: "LogstashでnginxアクセスログをClickHouseへデータ連携する方法"
date: "2021-08-14"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613800266200/20210823155034.png"
---

## LogstashでnginxアクセスログをClickHouseへデータ連携する方法

本記事では、nginxアクセスログをLogstash - [ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse) へデータ送信する方法をご紹介します。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210714233458.png "img")


# ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/


# LogStashとは
Elastic社が管理するオープンソースのデータ収集ツールです。データを収集しつつ、ETLもできるため、Elasticsearchサービスと連携することが多いです。     

> https://www.elastic.co/jp/logstash/


本記事では、nginxアクセスログをLogStash - ClickHouseへデータ連携してみます。構成図で次の通りです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823155034.png "img")



利用環境：     
ECS・・・CentOS 7.8 64-bit     
Java・・・1.8.0_144     
Nginx・・・v1.20.1     
Logstash・・・v7.0.0     
filebeats・・・v6.2.4     
Clickhouse・・・v20.8.7.15     
Logstash Plugin・・・logstash-output-clickhouse、logstash-filter-prune、logstash-filter-multiline     




# 1. ClickHouseClientの準備
## 1-1.ClickHouseインスタンスを準備します

この手法は[過去の記事](https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start)でも記載していますが、再掲として記載します。     

> https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start

1）まずはApsaraDB for ClickHouseインスタンスを作成します。     
①VPCを作成     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210716155113.png "img")

②ClickHouseインスタンスを作成     
著者は以下のインスタンススペックでインスタンスを作成しています。     

> ClickHouse version:20.8.7.15
> Edition：Single-replica Edition

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成     
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続     
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210716155401.png "img")


# 2.ECSでNginxのインストール
## 2-1.ECS作成
1）Nginx導入のためのECSを作成します     
①ECSコンソール画面でECS作成ボタンをクリックし、ECSを作成します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135321.png "img")

②ECS作成画面でSpec、課金方法を設定します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135337.png "img")

③CentOSを設定します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135420.png "img")

④VPCを選択します（ちなみに上記1 で作成したApsaraDB for Clickhouseと同じVPCを選定すると、Intranet経由で相互接続することができます）     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135433.png "img")

⑤ECSの登録パスワードを設定します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135546.png "img")

⑥ECS設定情報を確認します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135603.png "img")

⑦ECSを確認します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135619.png "img")


## 2-2 Nginxインストール
1）Nginxをインストールします     
①ECSへログインします（この時、ECSで設定しているSecurity GroupのインバウンドPortとして、Port22と80を設定します）     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135844.png "img")

②下記コマンドでnginxをインストールします     
```
# yum install nginx  -y
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135856.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135904.png "img")


2）下記コマンドでNginxを起動します     
```
# systemctl start nginx
# systemctl status nginx
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135921.png "img")


3）テストとして、Nginxサーバーへアクセスします（数回）     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823135935.png "img")

4）nginx.configファイルにlog_formatを確認します     

```
cat /etc/nginx/nginx.conf
```

```nginx.config抜粋
  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823140012.png "img")


5）Nginx logを確認します     
```access.log
# tail -f /var/log/nginx/access.log
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823140026.png "img")


# 3.ECSでfilebeatをインストール
## 3-1.ECSでfilebeatをインストールします

```
# wget https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.2.4-linux-x86_64.tar.gz
```
1）filebeatをECSにダウンロードします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823160645.png "img")


2）filebeatを解凍します     
```
# tar -zvxf filebeat-6.2.4-linux-x86_64.tar.gz
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823160700.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823160709.png "img")


3）filebeatのフォルダ名を変更します     
```
# mv filebeat-6.2.4-linux-x86_64 filebeat
# ll
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823160725.png "img")


## 3-2.filebeat設定
1）filebeat.ymlを設定します     
```
# cd /usr/local/logstash/filebeat
# vim filebeat.yml
```
filebeat.prospectorとLogstashのoutputを設定します     

```filebeat.yml
filebeat.prospectors:
input_type: log
enabled: true
 paths:
    - /var/log/nginx/acc*.log
exclude_files: ['.gz$']

output.logstash:
hosts: ["localhost:5044"]
```
※LogstashはPort5044を使用するため、ECSのSecurityGroupでPort 5044を許可する必要があります     
※outputはLogstashのみを設定します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823160915.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823160924.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823160933.png "img")


# 4.ECSでLogstashをインストール

## 4-1.Java1.8をインストールします
1）jdk1.8を用意します     
①jdk-8u144-linux-x64.tar.gzをダウンロードします     
（下記リンクからでもjdkダウンロードができます）     

> https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161031.png "img")


②jdk-8u144-linux-x64.tar.gzをjavaフォルダへ解凍します     
```
# mkdir /usr/local/java/
# tar -zxvf jdk-8u144-linux-x64.tar.gz -C /usr/local/java/
# cd /usr/local/java/
# ll
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161049.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161057.png "img")


2）Java環境を設定します     
①Java環境パスを設定します     
```
# vim /etc/profile
    export JAVA_HOME=/usr/local/java/jdk1.8.0_144
    export PATH=${JAVA_HOME}/bin:$PATH
    export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
    export JRE_HOME=$JAVA_HOME/jre

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161113.png "img")


②Java環境パスを有効化します     

```
# source /etc/profile
# ln -s /usr/local/java/jdk1.8.0_144/bin/java /usr/bin/java
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161135.png "img")


③Javaバージョンを確認します     
```
java -version
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161149.png "img")


## 4-2.ECSでLogstashインストール     
1）ECSでLogstashをインストールします     
```
# cd /usr/local
# mkdir logstash
# cd logstash
# wget https://artifacts.elastic.co/downloads/logstash/logstash-7.0.0.tar.gz
# ll
```

①logstashをECSにダウンロードします     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161212.png "img")


②logstashを解凍します     
```
# tar -xzvf logstash-7.0.0.tar.gz
# cd logstash-7.0.0
# ll
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161227.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161235.png "img")


## 4-3.LogstashのClickHouseプラグインをインストール
1）ClickHouseプラグインをインストールします     
①logstash-output-clickhouseプラグインをインストールします     

```
# cd /usr/local/logstash/logstash-7.0.0
# ll
# ./bin/logstash-plugin install logstash-output-clickhouse
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161312.png "img")


2）filterのプラグインをインストールします     
②logstash-filter-pruneとlogstash-filter-multilineのプラグインをインストールします     

```
# ./bin/logstash-plugin install logstash-filter-prune
# ./bin/logstash-plugin install logstash-filter-multiline
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161334.png "img")

## 4-4.Logstashを設定

1）logstash-sample.confを開きます     
```
# cd /usr/local/logstash/
# ll
# cd logstash-7.0.0/
# cd config/
# ll
# vim logstash-sample.conf
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161402.png "img")


2）logstash-sample.confを編集します     

```logstash-sample.conf
input {
  beats {
    port => 5044
    host => "127.0.0.1"
    client_inactivity_timeout => 36000
  }
}

filter {
  grok {
    match =>["message",'%{IPORHOST:remote_addr} - (%{USERNAME:remote_user}|-) \[%{HTTPDATE:nginx_timestamp}\] %{HOSTNAME:http_host} %{WORD:request_method} %{URIPATH:uri} %{BASE10NUM:http_status} %{BASE10NUM:body_bytes_sent} (%{BASE10NUM:upstream_status}|-) (?:%{HOSTPORT:upstream_addr}|-) (%{BASE16FLOAT:request_time}|-) (%{BASE16FLOAT:upstream_response_time}|-) (?<http_user_agent>[^"]*)']
	}
  date {
    locale => "en"
    match =>["nginx_timestamp" , "dd/MMM/YYYY:HH:mm:ss Z"]
  }
  mutate {
    convert => [
       "request_time","float",
       "body_bytes_sent","integer",
       "upstream_response_time","float",
       "http_status","integer"
    ]
    remove_field => [
      "message", "@timestamp", "source", "@version", "beat", "offset", "tags", "prospector"
    ]
  }
}

output {
  clickhouse {
    http_hosts =>["http://172.16.0.74:8123"]
    headers => ["Authorization", "Basic c2J0ZXN0OlRlc3QxMjM0"]
    table => "nginx_logstash_local"
    request_tolerance => 1
    flush_size => 32
    pool_max => 128
  }
  stdout {
    codec => json
  }
}
```

上記設定内容として、、     
* input・・・デフォルトのBeats     
* Filter・・・matchはNginxログと一致していること     
* output:・・・output先として次の設定通り     
```
   >http_hosts:ClickHouseのVPCエンドポイントのIPを設定する（今回はECSとClickHouseが同じVPC内であるため、Intranetで接続）
   >headers:c2J0ZXN0OlRlc3QxMjM0の形式は admin:password　のBase64コードとなります
   >table:ターゲットテーブルです。ターゲットテーブルのパラメータがNginxログとmatchと一致していること
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161755.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161804.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161811.png "img")


# 5.LogstashでデータをClickHouseに格納
## 5-1.ClickHouseでターゲットテーブルを作成します

1）ローカルテーブルを作成します       
①DMSでClickHouseをログインし、デフォルトDBで下記のテーブルを作成します       

```
CREATE TABLE default.nginx_logstash_local
(
    remote_addr String,
    remote_user String,
    nginx_timestamp String,
    http_host String,
    request_method String,
    uri String,
    http_status UInt32,
    body_bytes_sent UInt32,
    upstream_status UInt32,
    upstream_addr String,
    request_time Float32,
    upstream_response_time Float32,
    http_user_agent String
)
ENGINE = MergeTree() ORDER BY remote_addr SETTINGS index_granularity = 8192
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161836.png "img")


2）分散テーブルを作成します       
```
CREATE TABLE nginx_logstash_distributed ON CLUSTER default as nginx_logstash_local ENGINE = Distributed(default, default, nginx_logstash_local, rand());
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161855.png "img")


## 5-2.Logstashとfilebeatを実行し、NginxのアクセスログをClickhouseへ格納       
1）nginxがすでに起動されていることを確認します       
```
# systemctl status nginx
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161923.png "img")

2）logstashを起動します       
①下記コマンドでlogstashを起動します       
```
# cd /usr/local/logstash/logstash-7.0.0
# ll
# nohup ./bin/logstash -f ./config/logstash-sample.conf &
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161935.png "img")

②logstashを確認します       
```
# ps aux|grep logstash
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823161952.png "img")


3）下記コマンドでfilebeatを起動します       

①下記コマンドでfilebeatを起動します       
```
# cd /usr/local/logstash/filebeat
# ll
# nohup ./filebeat -e -c filebeat.yml &
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162006.png "img")


②filebeatを確認します       
```
# ps aux|grep filebeat
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162022.png "img")


4）テストとして、nginx web page を10回アクセスします       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162052.png "img")


5）nginxアクセスログを確認します       
```access.log
# cd /var/log/nginx
# ll
# tail -f -n 10 ./access.log
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823163505.png "img")


6）logstashログを確認します       
```nohup.out
# cd /usr/local/logstash/logstash-7.0.0
# ll
# cat nohup.out
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162123.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162131.png "img")


6）filebeatログを確認します       
```nohup.out
# cd /usr/local/logstash/filebeat
# ll
# cat nohup.out
```


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162144.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162152.png "img")


## 5-3.ClickhouseでNginxのアクセスログデータを確認します

1）nginx_logstash_localを確認します       
①データを確認します
```
select * from nginx_logstash_local;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162205.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162213.png "img")

②データ件数を確認します       
```
select count(*) from nginx_logstash_local;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162228.png "img")

2）nginx_logstash_distributedを確認します       
①データを確認します       
```
select * from nginx_logstash_distributed
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162244.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162253.png "img")



②データ件数を確認します       
```
select count(*) from nginx_logstash_distributed
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266200/20210823162303.png "img")


---

# 最後に

ここまで、nginxアクセスログを Logstash（filebeat）- ApsaraDB for ClickHouseへ連携する方法を紹介しました。       
ApsaraDB for ClickHouseはLogstash（filebeat）とスムーズに連携できるので、例えば、WebサーバーのデータをLogstash（filebeat）で収集し、 ApsaraDB for ClickHouseへリアルタイムデータ連携しながら、ClickHouseでリアルタイム可視化、といったソリューションを構築することもできます。       





