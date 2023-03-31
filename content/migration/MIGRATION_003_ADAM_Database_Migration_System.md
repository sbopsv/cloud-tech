---
title: "ADAMによる移行方法"
metaTitle: "Alibaba Cloud Oracle 移行ツールADAM（データベース移行仕組み紹介）"
metaDescription: "Alibaba Cloud Oracle 移行ツールADAM（データベース移行仕組み紹介）"
date: "2020-03-19"
author: "SBC engineer blog"
thumbnail: "/Migration_images_26006613530385900/20200306164949.png"
---

## Alibaba Cloud Oracle 移行ツールADAM（データベース移行仕組み紹介）

本記事では、Alibaba Cloud Oracle 移行ツールAdvanced Database & Application Migration（ADAM、データベース診断）で仕組みおよびをご紹介をします。     

# はじめに

Advanced Database & Application Migration(ADAM) というのはアリババクラウドが開発したオンプレミスからデータベースとアプリケーションをクラウドへのマイグレーションサービスです。

長年のOracleデータベースとアプリケーションのストラクチャー解析、システム改造、移行経験を参考して開発したクラウド化ソリューションで、エンタープライズ向けのデータ・アプリケーション遷移・運用サービスを提供しています。

# ADAM機能紹介
まだ中国国内向けにしか提供されていませんが、ADAMには大きく４つの機能が構成されています：

* １、データベース移行診断
* ２、アプリケーション移行診断
* ３、データベース移行
* ４、アプリケーション移行

今回はアプリケーション移行診断・データベース移行・アプリケーション移行を含め、データベース移行がどうやって実行されたかその仕組みを見てみます。


# 準備作業

ADAMでデータベース移行を実行するにはADAMコンソール以外、ADAM Studioというツールが必要となります。


# ADAM Studioインストール
ADAM Studioはコンソールからダウンロードできます。

まずADAM Studioをインストールサーバのシステム要件を確認します：

* OS: CentOS6.5以降
* ECSスペック:  8C16G以上、Oracleの規模によってさらに高いスペックを調整してもいい
* 帯域幅: 可能な限り、最大限の帯域幅を確保、VPC内の構築がおすすめ
* ネットワーク要件:  Studio Tool と Worker をインストールするクライアントからは移行元のOracle サーバとターゲットのクラウドデータベースに接続可能、ホワイトリスト設定完了、また、特定のポートをオーブン。
* オープン必要ポート一覧：1521,3306,7001,70028001,8021,8031
* ディスク: 30G 以上、ツールインストール及びログ保存用

サーバ確保しましたら、いくつか環境設定をします：

・Hosts設定：
```
# vi /etc/hosts
IP アドレス ホスト名
```
・ユーザ追加：
```
# groupadd adam
# useradd –g adam adam 
# passwd adam
```

・MySQLインストール(MariaDBで代用)
  studio というデータベース作成   
```
SQL> create database if not exists studio default charset utf8 collate utf8_general_ci;
```
 DBユーザ作成
```
SQL> grant all privileges on studio.* to 'adam'@'%' identified by 'XXXXX';
```
 Studioツールにあるスクリプトを実行
```
$ mysql -h xxx.xxx.xxx.xxx -P 3306 -u adam -pパスワード studio SQL> source /tmp/studio.sql
```

また、MySQLのパラメータには下記設定が推奨されています：
```
max_allowed_packet=512M

max_binlog_cache_size=1G
```
Studio設定ファイル編集
```
# su - adam
$ tar -zxvf adam-obfuscation.tar.gz      
$ vi adam-obfuscation/config/adam.properties
```
下記内容を編集、追加
```
jdbc.url=jdbc:mysql://IPアドレス:3306/studio  
 # MySQL  ユーザ名
jdbc.username=adam
 # MySQL  ユーザパスワード
jdbc.password=XXXXX 
# ライセンス 
#  ライセンスはADAMのコンソールより取得                
license.uid=XX
license.license=XXXXXXXXXXXXX
```
ADAM Studio 起動：
```
$ cd adam-obfuscation/bin
$ ./install.sh start   実行サーバのIP
```
サービスが起動されていることを確認：  
```
$ ps aux|grep java     
adam-studio,adam-sms,adam-dms,adam-dvs,datax というプロセスが起動されている    
```

後はADAM Studioにログイン確認できれば、インストール完了です。

ADAM Studioログイン：
> URL：http://IPアドレス:7001/login 

> ユーザ名:adam/adampassword

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200218134456.png "img")



# マイグレーション実行

インストール完了しましたので、ADAM Studioにログインしてみます。

ログインすると、操作画面が出て、マイグレーションプロジェクトを作成可能です。

まだ英語版のメニューがないですが、簡単にこういう構成になります：
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200220111640.png "img")


Profileメニューには移行用のデータベースの情報を記録しています。

移行元データベース（Oracle）と移行先データベース（例：POLARDB）のProfileをそれぞれ作成します。

必要情報：Profile名、サーバIP、SID、ポート、ユーザ名、パスワード
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305105502.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305105550.png "img")


マイグレーションプロジェクトを作成します：
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305111011.png "img")

> マイグレーションプロジェクト作成の必要条件として、Migration planファイルが必要、ADAMコンソールからダウンロードできます。
> 
> プロジェクト→管理→プロジェクト管理項目から「Migration planを作成」をクリックすれば、マイグレーションプランメニューが出てきます、そこからダウンロードをすれば、Jsonファイルがローカルディスクにダウンロードされます。
> ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200303151421.png "img")

> migrateplan-[プロジェクト番号]-[回数].jsonのようなファイル名になります。

このマイグレーションプランを使ってADAM studio にマイグレーションプロジェクトを作成します。

作成が完了後、

プレビュー、ダッシュボード、プラン詳細三つのメニューがあります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305111525.png "img")

ダッシュボードからオブジェクトとデータの遷移を行うことができます。

四つのグラフがあり、それぞれ、プランチェック完成率、オブジェクト遷移完成率、全量データ遷移完成率、データ校正完成率を示します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200303151524.png "img")


# プランチェック
プランチェック完成率のグラフは移行元データベースとマイグレーションプランを見比べ、変更チェック結果を表すグラフです。

今回マイグレーションで新規オブジェクト(NEW)、変更するオブジェクト(CHANGED)、削除するオブジェクト(DELETED)などを示します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305131620.png "img")

# オブジェクト遷移
「オブジェクト移行」グラフの矢印をクリックすれば、移行詳細画面に移します。

ここで、オブジェクトの定義DDLを修正したり、移行対象のオブジェクトを選ぶことができます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305133349.png "img")

「オブジェクト」タブから移行対象オブジェクの選択

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305133536.png "img")

オブジェクトの定義DDLの修正ができます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200303151610.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200303151638.png "img")

移行対象の選択が終わりましたら、「サービス」タブに戻り、「スタート」ボタンを押せば、オブジェクトの移行を起動します

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200303134847.png "img")

進捗バーが100％になったら、完了です。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200303135107.png "img")


もし失敗した場合は右側の詳細リンクから、失敗原因を確認できます。
そこで失敗対象を変更し、ロールバックするか、移行から除外するか、のアクションを取ることができます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305134055.png "img")


# 全量データ遷移
オブジェクト移行完了できたオブジェクトのテーブルデータを移行先のデータベースに遷移操作です。

ダッシュボードの「全量データ遷移完成率」グラフの矢印をクリックし、実行画面に移動します。

メニューは三つあり、サービス、レポート、ノードになります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305143909.png "img")

> ・サービス：マイグレーションサービスの管理、新規作成、起動、停止、削除
> 
> ・レポート：マイグレーション結果報告
> 
> ・ノード：利用できるWorkerノードの情報展示

データ移行開始するにはまず「サービス」タブより「新規作成」をクリック、「基本情報」に必要な情報を記入、「移行対象選択」からデータ移行したいテーブルなどを選択します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305152217.png "img")

移行対象選択し、追加する：
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305152341.png "img")


「作成」をクリックすると、「対象テーブルのデータがクリアされます、進みますか」という旨のワーニングメッセージが出る、問題なければ、確認ボタンをクリックして、データ遷移始めます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305154041.png "img")


移行サービス実行中、または実行完了後、「報告」をクリックすると、詳細が確認できます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305155259.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200305155131.png "img")


# 移行後データチェック

オブジェクトとデータが遷移完了後、正確に移行できたかをチェックするステップです。

データチェックタスクを作成し、いくつかのパラメータを設定する必要があります。

・サンプリング比率：

チェック対象データの範囲、0.1〜1、0.1は10%、1は100%を表します。

・中断閾値：

一つのテーブルにデータチェック失敗件数が指定した数値を超えた場合、チェックを中止

・チェックモード：

データの精度をチェックするかどうか、例えば、小数点の扱い、8 と 8.00 は同じ扱いかどうか。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200306143000.png "img")


データチェックタスクが完了すると、結果報告も確認できます。

性能、データチェック結果、エラーなどを含まれます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200306164949.png "img")


チェックしたデータのまとめ：
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200306165155.png "img")

差分の詳細：
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200306165551.png "img")


# 最後に
以上で、ADAM Studio を使ってデータバースを移行する際の具体的なステップです。    
ADAM はアプリケーションの移行診断などもできますので、参考に頂ければ幸いです。   





