---
title: "Zabbix導入連携"
metaTitle: "Alibaba Cloud環境でZabbix導入およびCloud Monitor連携してみた"
metaDescription: "Alibaba Cloud環境でZabbix導入およびCloud Monitor連携してみた"
date: "2020-07-09"
author: "SBC engineer blog"
thumbnail: "/3rdParty_images_26006613592205800/20200707124157.jpg"
---

## Alibaba Cloud環境でZabbix導入およびCloud Monitor連携してみた

# はじめに

本記事では、Alibaba Cloud環境でZabbix導入およびCloud Monitor連携についてをご紹介します。


AWS、Azure、GCPなどのクラウド環境ではZabbixの専用マシンイメージが用意されており、Zabbixの導入が容易にできるようになっています。     
しかし<span style="color: #0000cc">Alibaba CloudではZabbixの専用のマシンイメージが用意されていません。</span>     
そのため本記事ではAlibaba CloudでZabbixの導入し、監視設定をしていき、導入の手引きになるような内容を記載していきたいと思います。     


# プロダクト紹介
## Zabbix
Zabbixは、あらゆるサーバ、システム、アプリケーションの監視が可能な監視ソフトウェアです。     
全てWebインターフェースから設定可能で、データはMySQLに保存します。     
日本でも多くの企業、システムで使用されているOSSになります。     
詳細は以下をご覧ください。     

[Zabbixとは](https://www.zabbix.com/jp/features)

> https://www.zabbix.com/jp/features

## Cloud Monitor
Cloud MonitorはAlibaba Cloud上のすべてのリソースおよびアプリケーションに対する監視サービスです。     
Alibaba Cloudの各リソースに対し、脅威や障害からの保護を実現することができ、導入も容易なモニタリングソリューションになります。     
詳細は以下をご覧ください。     

[プロダクト紹介ページ](https://www.alibabacloud.com/product/cloud-monitor)     
[国際サイトのドキュメントセンター](https://www.alibabacloud.com/cloud-tech/ja/doc-detail/35170.htm?spm=a2c63.l28256.a3.1.418949b7VR06Lp)

# 実際にやってみよう
実際にAlibaba Cloud環境でZabbixを導入しCloud Monitorとの連携設定をしていきましょう。     
今回は以下の2Stepで監視設定をしていきたいと思います。     

* Alibaba Cloud環境でZabbixのインストール     
* Cloud Monitorと連携設定     

■構成図     
今回は以下のようなシステム構成図になります。     
ECS上にZabbixを構築します。     
また今回はCloud MonitorとZabbix連携に重きを置いているので、RDSはCloud Monitorで情報取得するためだけの独立したインスタンスになります。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707124157.jpg "img")      
     
■事前のポイント紹介     
一連の構築・設定を通して分かったポイントは以下です。     
* メモリが最小構成で、かつデフォルトのmysqlメモリ設定だとmysqlの起動で失敗する可能性がある     
* ZabbixのWebコンソールの日本語化には日本語ロケールのインストールが必要     
* <span style="color: #ff0000">ZabbixのCloud Monitor連携ではCloud Monitor側の設定は不要</span>     
詳細は記事の中で紹介しているので、留意しながら読み進めてください。

## Step1. Alibaba Cloud環境でZabbixのインストール
まずはAlibaba Cloud環境でECSにZabbixをインストールしていきます。     
せっかくですので2020年5月にリリースされたZabbix5.0を使用していきます。     
またZabbix5.0から対応プラットフォームとなったCentOS8系を使用していきます。     
Zabbix5.0の詳細は以下をご覧ください。     
[Zabbix 5.0LTSの新機能](https://www.zabbix.com/jp/whats_new_5_0)     
環境情報は以下です。     

```
サイト：国際サイト
リージョン：東京
パブリックIP：割り当てる
セキュリティグループ：接続元IPアドレスの80番ポート開放
OS：CentOS 8.1 64-bit
Zabbix Server：5.0.0
Zabbix Agent2：5.0.0
Apache：2.4.37
PHP：7.2.24
MySQL：8.0.17
```
### 01. Zabbixリポジトリのインストール
Zabbixパッケージを使用するため、Zabbix公式リポジトリをインストールします。

```
# rpm -Uvh https://repo.zabbix.com/zabbix/5.0/rhel/8/x86_64/zabbix-release-5.0-1.el8.noarch.rpm
```

### 02. キャッシュデータの削除
インストール時のキャッシュデータを削除します。

```
# dnf clean all
```

### 03. Zabbixサーバ、フロントエンド、エージェントのインストール

Zabbix導入に必要な各種パッケージをインストールします。

```
# dnf install zabbix-server-mysql zabbix-web-mysql zabbix-apache-conf zabbix-agent
```

### 04. mysqlのインストール
CentOS8ではmysqlパッケージがデフォルトでインストールされていません。     
そのためmysqlのインストールを行います。

```
# dnf install mysql-server
```

### 05. mysqlの起動
mysqlのサービスを起動します。

```
# systemctl start mysqld
```

<span style="color: #ff0000">※この際、メモリが最小構成のインスタンスタイプで、mysqlのメモリ設定を変更していないと、起動に失敗します。</span>     

メモリが0.5GBのインスタンスタイプ(ecs.t5-lc2m1.nano)で実施した場合、以下のようなエラーが表示されました。

```
Job for mysqld.service failed because the control process exited with error code.
See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

ステータスを確認すると以下のように表示され、

```
# systemctl status mysqld
```

```
● mysqld.service - MySQL 8.0 database server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; disabled; vendor preset: disabled)
   Active: failed (Result: exit-code) since Tue 2020-06-30 11:18:32 CST; 2min 18s ago
 Main PID: 27408 (code=exited, status=1/FAILURE)
   Status: "Server startup in progress"

Jun 30 11:18:22 xxxxxxxxxxxxxxxxxxxxxxx systemd[1]: Starting MySQL 8.0 database server...
Jun 30 11:18:22 xxxxxxxxxxxxxxxxxxxxxxx mysql-prepare-db-dir[27324]: Initializing MySQL database
Jun 30 11:18:31 xxxxxxxxxxxxxxxxxxxxxxx systemd[1]: mysqld.service: Main process exited, code=exited, status=1/FAILURE
Jun 30 11:18:32 xxxxxxxxxxxxxxxxxxxxxxx systemd[1]: mysqld.service: Failed with result 'exit-code'.
Jun 30 11:18:32 xxxxxxxxxxxxxxxxxxxxxxx systemd[1]: Failed to start MySQL 8.0 database server.
```

ログを確認すると、以下のように出力されていました。

```
# less /var/log/mysql/mysqld.log
```

```
2020-06-30T03:18:31.391317Z 0 [System] [MY-010116] [Server] /usr/libexec/mysqld (mysqld 8.0.17) starting as process 27408
2020-06-30T03:18:31.620990Z 0 [ERROR] [MY-012681] [InnoDB] mmap(137363456 bytes) failed; errno 12
2020-06-30T03:18:31.621045Z 1 [ERROR] [MY-012956] [InnoDB] Cannot allocate memory for the buffer pool
2020-06-30T03:18:31.621063Z 1 [ERROR] [MY-012930] [InnoDB] Plugin initialization aborted with error Generic error.
2020-06-30T03:18:31.621086Z 1 [ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
2020-06-30T03:18:31.624135Z 0 [ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
2020-06-30T03:18:31.625805Z 0 [ERROR] [MY-010119] [Server] Aborting
2020-06-30T03:18:31.630234Z 0 [System] [MY-010910] [Server] /usr/libexec/mysqld: Shutdown complete (mysqld 8.0.17)  Source distribution.
```

「Cannot allocate memory for the buffer pool」と出力されているので、buffer poolに割り当てるメモリが不足していたということが分かります。     
その場合、mysqlのinnodb_buffer_pool_sizeを変更するか、ECSのインスタンスタイプを変更しましょう。     
インスタンスタイプを変更する場合、ECSを停止し、メモリに余裕があるインスタンスタイプに変更し、再度起動しましょう。     
メモリが4GBあるインスタンスタイプでは、デフォルトのmysql設定でも、正常にmysql起動できることを確認しています。

### 06. mysqlの初期設定
mysqlの初期設定をします。

```
# mysql_secure_installation
```

パスワードの設定、デフォルトユーザ、デフォルトデータベースの削除等について対話形式で設定していきます。

### 07. mysql接続
先ほど設定したパスワードを使用して、mysqlに接続します。

```
# mysql -uroot -p
```

### 08. データベースの作成
Zabbix用のデータベースを作成します。

```
> create database zabbix character set utf8 collate utf8_bin;
```

### 09. ユーザの作成
Zabbix用のユーザを作成します。

```
> create user zabbix@localhost identified by 'password';
```

### 10. 権限の付与
Zabbix用のユーザに権限を付与します。

```
> grant all privileges on zabbix.* to zabbix@localhost;
```

その後、接続を閉じます。

```
> quit;
```

### 11. スキーマのインポート
Zabbix用のDBスキーマと初期データをデータベースにインポートします。

```
# zcat /usr/share/doc/zabbix-server-mysql*/create.sql.gz | mysql -uzabbix -p zabbix
```

### 12. Zabbixの設定ファイル更新
Zabbixの設定ファイルにDBパスワード情報を記載します。

```
# vi /etc/zabbix/zabbix_server.conf
```

124行目を以下の通りに変更します。

```
DBPassword=password
```

### 13. タイムゾーン設定の変更
タイムゾーンの設定を変更します。
```
# vi /etc/php-fpm.d/zabbix.conf
```
24行目を以下の通りに変更します。
```
php_value[date.timezone] = Asia/Tokyo
```
### 14. Apache、PHPのインストール
Apache、PHPをインストールします。

```
dnf install httpd php php-{gd,bcmath,xml,mbstring}
```

### 15. サービス起動する
Zabbix、Apache、PHPのサービスを起動します。

```
# systemctl start httpd php-fpm zabbix-server zabbix-agent
```

※この後よりWebコンソールへアクセスしますが、<span style="color: #0000cc">Apacheの設定は特段必要ありません。</span>     

### 16. Webコンソールにアクセス
ブラウザより、`http://ZabbixサーバーのパブリックIPアドレス/zabbix/`にアクセスします。     
以下のような画面が表示されます。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200706191650.png "img")      
     
<span style="color: #0000cc">※接続できない場合は、本ECSにアタッチされたセキュリティグループで接続元IPアドレスの80番ポートが許可されているか再度確認してください。</span>

### 17. Webコンソールの初期設定
案内に沿って設定していき、最終確認をします。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200706191859.png "img")      
     
これで完了です。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707114107.png "img")      

### 18. Webコンソールログイン
初期設定が完了したため、Webコンソールにログインします。     
以下の情報を入力し、ログインしてください。

```
Username：Admin
Password：zabbix
```
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707114215.png "img")      
     
ログインが完了すると、ダッシュボードが表示されます。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707114457.png "img")      

### 19. Webコンソール日本語化
自動翻訳に頼ると思わぬ誤訳に出くわす可能性があるので、Webコンソールを日本語化します。     
左ペインより[ユーザ設定]を押下します。     
ユーザープロファイル設定画面より言語を選ぶプルダウンがありますが、日本語を選ぶことができません。     
英語で「<span style="color: #ff0000">言語のロケールがWebサーバーにインストールされていないため、一部の言語を選択できません。</span>」と記載されています。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707114435.png "img")      
     
日本語設定にするために日本語ロケールをインストールします。

```
# dnf install glibc-langpack-ja
```

ロケール設定を確認します。

```
# localectl status
```

英語になっています。

```
   System Locale: LANG=en_US.UTF-8
       VC Keymap: us
      X11 Layout: n/a
```

ロケール設定を変更します。

```
# localectl set-locale LANG=ja_JP.UTF-8
# source /etc/locale.conf
```

変更後の確認をします。

```
# localectl status
```

日本語になっています。

```
   System Locale: LANG=ja_JP.UTF-8
       VC Keymap: us
      X11 Layout: n/a
```

サービスを再起動します。

```
# systemctl restart httpd php-fpm zabbix-server zabbix-agent
```

再びWeb画面に戻り、一度画面を更新し、再び言語設定のプルダウンを選択すると、日本語が選べるようになっています。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707114442.png "img")      
     
日本語でUpdateするとダッシュボードが日本語に変わっています。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707114450.png "img")      
     
初期設定まで済みましたので、ここまででZabbixのインストールを完了とします。     

## Step2. Cloud Monitorと連携設定
Zabbixのインストールおよび初期設定まで完了したので、本StepではCloud MonitorとZabbixの連携設定を実施していきます。     

具体的には、Cloud MonitorのAPIを使用することで、Cloud Monitorで監視しているサービスの情報を取得し、それをZabbix画面上に表示させます。     
通常エージェントをインストールすることが必要なZabbixの監視ですが、(本記事ではエージェントを使用したECS監視については実施しません)     
<span style="color: #0000cc">Cloud Monitor連携を行うことで、RDSやSLBなどのエージェントのインストールが不可能なサービスの監視も可能になります。</span>     

これはZabbix上で外部チェック(スクリプト)の連携を行うことで、実現できます。     
     
今回は事前に作成しておいたApsaraDB for RDSのインスタンスをCloud Monitorで監視している状態から、     
RDSのCPU使用率をZabbixへ連携する設定をしていきたいと思います。     

### 01. 外部スクリプト配置ディレクトリ確認
Zabbixサーバの設定ファイルを確認し、外部スクリプト配置ディレクトリを確認します。

```
# grep ExternalScripts /etc/zabbix/zabbix_server.conf
```

以下よりディレクトリが確認できます。

```
### Option: ExternalScripts
# ExternalScripts=${datadir}/zabbix/externalscripts
ExternalScripts=/usr/lib/zabbix/externalscripts
```

### 02. 外部スクリプト作成
確認したディレクトリに外部スクリプトを作成します。     
今回はRDS連携用のスクリプトを作成します。

```
# vi /usr/lib/zabbix/externalscripts/rds
```

以下のように記述します。

```
#! /usr/bin/env python3
#coding=utf-8
# モジュールのインポート
from aliyunsdkcore.client import AcsClient
from aliyunsdkcms.request.v20190101.DescribeMetricListRequest import DescribeMetricListRequest

import json

# アクセスキー、シークレットキー、リージョン、対象の設定
accessKeyId = 'xxxxxxxxxxxxxxxxxxxx'
accessSecretKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
region = 'ap-northeast-1'
instanceId = 'rm-xxxxxxxxxxxxxxxxx'

# 対象の取得
client = AcsClient(accessKeyId, accessSecretKey, region)

####　Cloud Monitor にリクエスト
request = DescribeMetricListRequest()
request.set_Dimensions("{'instanceId': '" + instanceId  + "'}")
request.set_accept_format('json')

# 対象サービスと取得メトリックの設定
request.set_Namespace('acs_rds_dashboard')
request.set_MetricName('CpuUsage')

# リクエスト取得
response = client.do_action_with_exception(request)

# 監視項目の値を加工
Datapoint = json.loads(json.loads(response)["Datapoints"])[-1]
DatapointValue = Datapoint["Maximum"]

print(DatapointValue)
```

本スクリプトについて一部説明していきます。

```
# モジュールのインポート
from aliyunsdkcore.client import AcsClient
from aliyunsdkcms.request.v20190101.DescribeMetricListRequest import DescribeMetricListRequest
```

必要なモジュールは以下です。     

* aliyunsdkcore     
* aliyunsdkcms     

この後の手順でモジュールをインストールします。     
「v20190101」の部分についてはバージョンを記載します。     
aliyunsdkcmsの最新バージョンは[ここ](https://github.com/aliyun/aliyun-openapi-python-sdk/blob/master/aliyun-python-sdk-cms/aliyunsdkcms/request/v20190101/PutCustomMetricRequest.py?spm=a2c63.p38356.879954.5.500d1f02ZNS5tF&file=PutCustomMetricRequest.py)で確認してください。     

```
# 対象サービスと取得メトリックの設定
request.set_Namespace('acs_rds_dashboard')
request.set_MetricName('CpuUsage')
```

対象サービスのプロジェクト名と取得するメトリックについては[プリセットメトリックのリファレンス](https://www.alibabacloud.com/cloud-tech/ja/doc-detail/28619.htm)で確認できます。     
今回はApsaraDB for RDSのCPU使用率を取得するため、プロジェクト名は「acs_rds_dashboard」、メトリック名は「CpuUsage」となります。     

```
# 監視項目の値を加工
Datapoint = json.loads(json.loads(response)["Datapoints"])[-1]
DatapointValue = Datapoint["Maximum"]

print(DatapointValue)
```

今回は最大値(Maximum)のみを取得するため、上記記述にしています。     
必要に応じて、「DatapointValue」の値は変更し、取得したい項目を記載してください。

### 03. 実行権限の付与
作成したスクリプトに実行権限を付与します。     

```
# chmod 755 /usr/lib/zabbix/externalscripts/rds
```

権限の確認をします。

```
# ls -l /usr/lib/zabbix/externalscripts/rds
```

### 04. 外部スクリプト実行
作成したスクリプトを実行してみます。

```
# sudo -u zabbix /usr/lib/zabbix/externalscripts/rds
```

モジュールがインストールされていない場合、以下のように表示されます。

```
Traceback (most recent call last):
  File "/usr/lib/zabbix/externalscripts/rds", line 4, in <module>
    from aliyunsdkcore.client import AcsClient
ModuleNotFoundError: No module named 'aliyunsdkcore'
ModuleNotFoundError: No module named 'aliyunsdkcms'
```

### 05. モジュールのインストール
必要なモジュールをインストールしていきます。

```
# pip3 install -Iv aliyun-python-sdk-cms==5.0.0
# pip3 install aliyun-python-sdk-core
# pip3 install aliyun-python-sdk-cms
```

詳しくはCloud Monitorの[Python SDKマニュアル](https://www.alibabacloud.com/cloud-tech/ja/doc-detail/28622.htm?spm=a2c63.p38356.a1.2.500d1f02ZNS5tF)を参考にしてください。

### 06. 外部スクリプト実行2回目
再度スクリプトを実行してみます。

```
# sudo -u zabbix /usr/lib/zabbix/externalscripts/rds
```

以下のように出力されました。

```
0.72
```

これは対象のRDSのCPU使用率の最大値(単位:%)になります。     
実際にCloud Monitorで対象のリソースを確認すると同様の値になっていることが確認できます。     
※取得する値はCPU使用率のMaximumですが、画像ではAverageになっています。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707121639.png "img")      
     
正常に値を取得できたようです。     

### 07. Zabbixホスト登録
ZabbixWebコンソール上でホスト登録を実施します。     
左ペインより[設定]→[ホスト]を押下します。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707121751.png "img")      
     
画面右上の[ホストの作成]を押下します。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707121847.png "img")      
     
ホスト名、グループを入力し、[追加]を押下します。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707121941.png "img")      

### 08. アイテム登録
ホストから取得するデータを定義するアイテムを登録します。     
ホスト一覧画面より[アイテム]を押下します。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707122019.png "img")      
     
画面右上の[アイテムの作成]を押下します。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707122058.png "img")      
     
名前、タイプ、キー、データ型、監視間隔を入力します。     
名前は取得するデータの分かりやすい名前を入力してください。     
タイプは外部チェックを選択します。これが外部スクリプトを使用して監視を行うパラメータになります。     
データ型、単位、監視間隔は取得するデータに応じて、任意に変更してください。     
その他の項目についても任意に変更してください。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707122141.png "img")      
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707122220.png "img")      
     
### 09. データ確認
アイテムの登録まで完了したので、そのアイテムでデータの取得ができているか確認します。     
左ペインより[監視データ]→[ホスト]を押下し、対象ホストの[最新データ]を押下します。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707122251.png "img")      
     
対象ホストの最新データ画面で、[グラフ]を押下します。     
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707122326.png "img")      
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707122355.png "img")      
     
正常に値が取得できていて、Zabbix画面上で確認できました。


# 最後に
今回はAlibaba Cloudで専用のマシンイメージが用意されていないZabbixを、Alibaba Cloud環境に導入して監視設定を行いました。     
<span style="color: #ff0000">専用のマシンイメージがなくても比較的導入は容易</span>であり、     
また<span style="color: #ff0000">Cloud Monitorとの連携についても難なく実現可能</span>でした。     

本記事で記載した内容について、監視したのはRDSの1メトリックのみではありましたが、     
応用することで多数のAlibaba Cloudリソースの多数のメトリック監視が可能になると思います。     
ぜひ参考にしてみてください。     


