---
title: "Fluentdでnginxログを連携"
metaTitle: "FluentdでnginxアクセスログをClickHouseへデータ連携する方法"
metaDescription: "FluentdでnginxアクセスログをClickHouseへデータ連携する方法"
date: "2021-08-10"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613800266700/20210823154316.png"
---

## FluentdでnginxアクセスログをClickHouseへデータ連携する方法

本記事では、nginxアクセスログをFluentd(td-agent)- [ApsaraDB for ClickHouse](https://www.alibabacloud.com/product/clickhouse) へデータ送信する方法をご紹介します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613789044600/20210714233458.png "img")


# ClickHouseとは
ClickHouseは非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースサービスです。      
[トラフィック分析、広告およびマーケティング分析、行動分析、リアルタイム監視などのビジネスシナリオで幅広く](https://clickhouse.tech/docs/en/introduction/adopters/) 使用されています。

> https://clickhouse.tech/docs/en/introduction/adopters/



# Fluentdとは
一言でいうとオープンソースのデータ収集ツールです。2011年にTreasure Data, Inc.の共同創業者である古橋氏によって開発されたOSSで、現在Cloud Native Computing Foundation (CNCF® http://cncf.io/ ) で6番目の卒業プロジェクトとして発表されるほど市場を大きく広げたツールです。Cloud Native Computing Foundationでこれまでの卒業プロジェクトとしてKubernetes、Prometheus、Envoy、CoreDNS、containerdなどがあり、Fluentdはその一員として選ばれたわけです。選ばれるためには、市場の豊富な採用実績、コミュニティの持続可能性、体系化されたガバナンスプロセスなどを証明する必要があるため、これは日本発OSSとして快挙です。

> https://www.fluentd.org/

Fluentdは元々Treasure Data, Incが開発したOSSですが、今後は株式会社クリアコードが担当し継続開発することになっています。      

> https://www.clear-code.com/press-releases/20210729-maintaining-fluentd.html


本記事では、nginxアクセスログをFluentd(td-agent)- ClickHouseへデータ連携してみます。構成図は次の通りです。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823154316.png "img")


利用環境：      
ECS・・・CentOS 7.8 64-bit      
Nginx・・・v1.20.1      
td-agent・・・v4.2.0      
Clickhouse・・・v20.8.7.15      
td-agent Plugin・・・fluent-plugin-clickhouse      


# 1. ClickHouseClientの準備
## 1-1.ClickHouseインスタンスを準備します

この手法は[過去の記事](https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start)でも記載していますが、再掲として記載します。      

> https://sbopsv.github.io/cloud-tech/usecase-ClickHouse/ACH_002_clickhouse-quick-start

1）まずはApsaraDB for ClickHouseインスタンスを作成します。      
①VPCを作成      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210716155036.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210716155113.png "img")

②ClickHouseインスタンスを作成      
著者は以下のインスタンススペックでインスタンスを作成しています。      

> ClickHouse version:20.8.7.15
> Edition：Single-replica Edition

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210716155212.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210716155220.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210716155231.png "img")


2）ClickHouseの登録アカウントを作成      
インスタンスをクリックし、左側にアカウント管理画面で、アカウントを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210716155256.png "img")


3）ClickHouseクラスターにDMSで接続      
①ClickHouseのインスタンスをクリックし、トップメニューの「Log On to Database」をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210716155315.png "img")


② DBアカウントとパスワードを入力し、ClickHouseへログイン      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210716155334.png "img")

③DMS画面でClickHouseのインスタンスが表示されます      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210716155401.png "img")


# 2.ECSでNginxのインストール
## 2-1.ECS作成
1）Nginx導入のためのECSを作成します      
①ECSコンソール画面でECS作成ボタンをクリックし、ECSを作成します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135321.png "img")

②ECS作成画面でSpec、課金方法を設定します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135337.png "img")

③CentOSを設定します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135420.png "img")

④VPCを選択します（ちなみに上記1 で作成したApsaraDB for Clickhouseと同じVPCを選定すると、Intranet経由で相互接続することができます）      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135433.png "img")

⑤ECSの登録パスワードを設定します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135546.png "img")

⑥ECS設定情報を確認します
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135603.png "img")

⑦ECSを確認します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135619.png "img")


## 2-2 Nginxインストール
1）Nginxをインストールします      
①ECSへログインします（この時、ECSで設定しているSecurity GroupのインバウンドPortとして、Port22と80を設定します）      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135844.png "img")

②下記コマンドでnginxをインストールします      
```
# yum install nginx  -y
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135856.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135904.png "img")


2）下記コマンドでNginxを起動します      
```
# systemctl start nginx
# systemctl status nginx
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135921.png "img")


3）テストとして、Nginxサーバーへアクセスします（数回）      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823135935.png "img")

4）nginx.configファイルにlog_formatを確認します      

```
cat /etc/nginx/nginx.conf
```

```nginx.config抜粋
  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823140012.png "img")


5）Nginx logを確認します      
```access.log
# tail -f /var/log/nginx/access.log
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823140026.png "img")

# 3.ECSでFluentd(td-agent)インストール

## 3-1.fluentd前提条件を確認します
1）下記のリンクでfluentd前提条件を確認します      

[fluentd beforeinstall](https://docs.fluentd.org/installation/before-install)    

> https://docs.fluentd.org/installation/before-install

①ECSのLinuxにてulimitを確認します（65535が必要）      
```
# ulimit -n
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823140057.png "img")

②上記もしulimitが足りない場合、limits.confを設定します（今回のECSは65535であるため、設定しないでおきます）      

```
/etc/security/limits.conf
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823140145.png "img")


③ Network Kernelを設定します      
/etc/sysctl.confを開き、下記内容をsysctl.confに追加します     　

```/etc/sysctl.conf
net.core.somaxconn = 1024
net.core.netdev_max_backlog = 5000
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_wmem = 4096 12582912 16777216
net.ipv4.tcp_rmem = 4096 12582912 16777216
net.ipv4.tcp_max_syn_backlog = 8096
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 10240 65535
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823140203.png "img")


## 3-2.fluentd(td-agent)をインストール
1）下記コマンドでtd-agentをインストールします      

```
# curl -L https://toolbelt.treasuredata.com/sh/install-redhat-td-agent3.sh | sh
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823140226.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823140234.png "img")


2）下記コマンドでtd-agentを起動し、ステータスを確認します      

```
# systemctl start td-agent
# systemctl status td-agent
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823140249.png "img")

## 3-3.fluentd(td-agent)のClickhouseプラグインをインストールします
1）下記コマンドでClickhouseプラグインをインストールします      

```
td-agent-gem install fluent-plugin-clickhouse
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823140304.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823140322.png "img")


# 4.Fluentd(td-agent)でデータをClickHouseへ格納

## 4-1.fluentd(td-agent) の configファイルを設定します

1）td-agent.confのsourceとmatchを設定します      

①td-agent.confを開きます      
```
# cd /etc/td-agent
# vim td-agent.conf
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823151625.png "img")


②sourceとmatchを正しく設定します      
※上記手順2-2のnginx.confのlog_formatに基づいて、td-agent.confのsourceを設定します      
※matchのcolumnsはClickhouseにあるターゲットテーブルのcolumnsと一致するようにします      

```td-agent.conf
<source>

@type tail
path /var/log/nginx/access.log

pos_file /var/log/td-agent/access.log.pos
tag nginx.access

format /^(?<remote_addr>[^ ]*) [^ ]* (?<remote_user>[^ ]*) \[(?<time_local>[^\]]*)\] "(?<method>\S+)(?: +(?<path>[^ ]*) +\S*)?" (?<status>[^ ]*) (?<body_bytes_sent>[^ ]*)(?: "(?<http_referer>[^\"]*)" "(?<http_user_agent>[^\"]*)")? "(?<http_x_forwarded_for>[^ ]*)"$/

time_format %d/%b/%Y:%H:%M:%S %z
</source>

<match nginx.access>
@type clickhouse
host 172.16.0.74
port 8123
database default
username sbtest
password Test1234
columns remote_addr,remote_user,time_local,method,path,status,body_bytes_sent,http_referer,http_user_agent,http_x_forwarded_for
table fluent_accesslog_local
flush_interval 10s
</match>

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823151701.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823151709.png "img")

※hostはClickHouseインスタンスのHostです。今回はVPC Intranetで接続するため、VPC EndpointのIPを設定します      
※columnsはターゲットテーブルのcolumnsと一致するようにします      

## 4-1.Clickhouseでターゲットテーブル作成

1）ローカルテーブルを作成します      
①DMSでClickHouseをログインし、デフォルトDBで下記のテーブルを作成します      

```
create table fluent_accesslog_local on cluster default
(
remote_addr  String,
remote_user Nullable(String),
time_local String,
method String,
path String,
status Int32,
body_bytes_sent Nullable(Int32),
http_referer Nullable(String),
http_user_agent String,
http_x_forwarded_for Nullable(String)
)
engine = MergeTree()
order by time_local;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823151815.png "img")


2）分散テーブルを作成します      
```
CREATE TABLE fluent_accesslog_distributed ON CLUSTER default as fluent_accesslog_local ENGINE = Distributed(default, default, fluent_accesslog_local, rand());
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823151828.png "img")


## 4-2.fluentd(td-agent)を実行し、NginxのアクセスログをClickhouseへ格納
1）nginxがすでに起動されていることを確認します      
```
# systemctl status nginx
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823151857.png "img")


2）td-agentを再起動します      
```
# systemctl restart td-agent
# systemctl status td-agent
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823151911.png "img")

3）テストとして、nginx web page を10回アクセスします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823151924.png "img")


4）nginxアクセスログを確認します      
```access.log
# cd /var/log/nginx
# ll
# tail -f -n 10 ./access.log
```


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823163522.png "img")


5）td-agent
```
# cd /var/log/td-agent
# ll
# tail -f -n 10 ./td-agent.log
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823152009.png "img")

## 4-3.ClickhouseでNginxのアクセスログデータを確認します

1）fluent_accesslog_localを確認します      
```
select * from fluent_accesslog_local;
select count(*) from fluent_accesslog_local;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823152118.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823152129.png "img")



2）fluent_accesslog_distributedを確認します      
```
select * from fluent_accesslog_distributed
select count(*) from fluent_accesslog_distributed
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823152151.png "img")


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613800266700/20210823152203.png "img")


---

# 最後に

ここまで、nginxアクセスログを Fluentd(td-agent) - ApsaraDB for ClickHouseへ連携する方法を紹介しました。      
ApsaraDB for ClickHouseはFluentdとスムーズに連携できるので、例えば、WebサーバーのデータをFluentdで収集し、 ApsaraDB for ClickHouseへリアルタイムデータ連携しながら、ClickHouseでリアルタイム可視化、といったソリューションを構築することもできます。      






