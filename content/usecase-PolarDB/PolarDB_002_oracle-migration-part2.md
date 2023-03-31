---
title: "PolarDB-OマイグレーションPart2"
metaTitle: "【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part2 Oracle Database評価"
metaDescription: "【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part2 Oracle Database評価"
date: "2021-09-23"
author: "sbc_ohara"
thumbnail: "/polardb_images_13574176438014223999/20210922091327.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part2 Oracle Database評価

# はじめに

本記事では、Oracle DatabaseからPolarDB-Oマイグレーション-Part2 Oracle Database評価 についてを紹介します。     
こちら長文になるので、全部でPart5に分けて紹介します。   

[Part1 OracleDatabaseセットアップ、事前準備](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_001_oracle-migration-part1)         
[Part2 Oracle Database評価](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_002_oracle-migration-part2)←本記事です         
[Part3 データベースマイグレーション準備](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_003_oracle-migration-part3)         
[Part4 データベースマイグレーション実行](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_004_oracle-migration-part4)         
[Part5 アプリケーションマイグレーションと改修](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_005_oracle-migration-part5)         

# PolarDBとは

PolarDBはAlibaba Cloudが開発したCloud Native Databaseサービスです。MySQL・PostgreSQLは100%、Oracleは高い互換性を持ちながら、ユーザーのワークロードに応じて垂直・水平スケーリングすることが出来るため、コストを大幅に削減できることが特徴です。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210923094834.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210923095110.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210923095159.png "img")    




# 最初に

この記事 Part2では、Part1で作成したターゲットとなるOracle Database（以降ターゲットDBと省略します）を評価するフェーズとなります。     
ターゲットDBを評価して、その結果がPolarDB-Oに適しているか、もし適しているならどの作業が必要か、改修作業として何があるか、といったレポーティングが行えます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922091327.png "img")    



# 4.Oracle Databaseに対するデータベース評価
# 4-1.Oracle Databaseを収集します      
## 4-1-1.データベース収集ツールをインストールします      
1）データ収集用のECSを作成します（省略）
備考：ECS-Oracleと同じVPCで設定するとイントラネットで接続できます
①ECSを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922024904.png "img")    


②ECSへログインします      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922024938.png "img")    


2）ECS環境を設定します      
①データアップロード用ツールをインストールします      
```
yum install lrzsz
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922024953.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922024959.png "img")    



②解凍用ツールをインストールします      
```
yum install -y unzip zip
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025012.png "img")    


3）Database Collectorをダウンロードします      
ADAMコンソール画面でEvaluateDB画面でDatabase Collectorをダウンロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025024.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025031.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025039.png "img")    


4）Database CollectorをECSにアップロードします      
①下記コマンドをインプット後、rainmeter-linux64.tar.gzファイルを選択し、アップロードします      
```
# rz　
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025055.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025101.png "img")    



②rainmeter-linux64.tar.gzファイルを解凍します      
```
# tar -xvmf rainmeter-linux64.tar.gz
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025113.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025120.png "img")    


ここまでrainmeterのインストールが完了しました

## 4-1-2.Oracle-ECSでデータ収集用のアカウントを設定します      
1）Oracleが起動されることを確認します      

```
# su - oracle
# lsnrctl start
# sqlplus / as sysdba
# SQL> startup
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025137.png "img")    



2）下記コマンドでrainmeter用のアカウントを作成します      
```
# sqlplus / as sysdba
SQL> create user eoa_user identified by "eoaPASSW0RD" default tablespace users;
SQL> grant connect,resource,select_catalog_role,select any dictionary to eoa_user;
SQL> grant execute on DBMS_LOGMNR to eoa_user;
SQL> grant execute on dbms_metadata to eoa_user;
SQL> grant select any transaction to eoa_user;
SQL> grant analyze any to eoa_user;
SQL> grant execute on dbms_random to eoa_user;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025151.png "img")    



## 4-1-3.Oracleデータを収集します      
1）rainmeterフォルダを開きます

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025203.png "img")    


2）データを収集します      
①下記コマンドでrainmeterを起動し、データ収集を開始します      
```
sh collect_11gR2.sh -h 172.16.0.96 -u eoa_user -p eoaPASSW0RD -d orcl11g
```

パラメータ説明        
```
-h:　Oracle DatabaseのIPアドレス（今回のECSはOracleのと同じVPCであるため、プライベートIPを使います）
-u:　上記作った収集用のユーザーです（eoa_user）
-p:　上記作った収集用のパスワードです（eoaPASSW0RD）
-d:　OracleのSIDまたはService Nameです（Service Name：orcl11gを使います）
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025235.png "img")    



②アプリケーションウェブサイトを操作します      
注意事項として、事前にOracle Database側にSQLクエリ文を格納する必要があり、SQLクエリ文が格納されてなかったらADAMによる評価や分析等でエラーが発生することがあります。     
これはADAMによるデータ収集時、SQLクエリ文を参照しながらマイグレーションに向けた評価を行うためです。         
もちろんアプリケーションやOracle Databaseが稼働中の状態でもADAMによるデータを収集することはできます。         

```
http://8.211.134.35:8080/index.action
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025409.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025423.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025431.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025438.png "img")    



③データ収集結果を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025452.png "img")    



④収集さらたデータをダウンロードします      
```
# cd output
# ls
# sz data.zip
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025502.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025510.png "img")    



# 4-2.ソースデータベースプロファイルを分析します      
## 4-2-1.ソースデータベースプロファイルを作成します      
1）ADAMプロファイル画面を開きます
①AlibabaCloudのサイトをログインし、ADAMコンソール画面を開きます       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025532.png "img")    


②日本リージョンを選択します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025541.png "img")    


③データベース評価メニューをクリックし、ソースデータベースプロファイルをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025553.png "img")    


2）プロファイルを作成します      
①プロファイル作成ボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025606.png "img")    


②プロファイル設定し、収集のデータをアップロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025614.png "img")    


③作成ボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025623.png "img")    


④プロファイルを作成開始します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025632.png "img")    


⑤プロファイル作成中はこのような感じになります       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025641.png "img")    


⑥プロファイル作成が完了しました     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025650.png "img")    



## 4-2-2.ソースデータベースプロファイルを分析します      
1）プロファイル概要を確認します      
①プロファイルの詳細ボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025754.png "img")    


②プロファイル概要を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025806.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025814.png "img")    



③プロファイルレポートをダウンロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025823.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025830.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025836.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025842.png "img")    



2）プロファイル詳細を確認します      
プロファイル詳細画面では下記情報が確認できます       
* Performance（性能）:OracleインスタンスのTPS/QPS/CPU使用率/負荷に関する情報を提供します。複数のインスタンス情報が表示できます      
* Capacity（容量）:スキーマとオブジェクトタイプ（テーブル、インデックス、LOB）に応じた容量情報を表示します        
* Oracle Features（Oracle特性）:Oracleの特性を持つオブジェクトタイプを分析します        
* External Dependency（外部依存）:OracleのDBLink情報を表示します。オブジェクトを関連付けた後で改修する必要があります      
* Other Dimensions（その他ディメンション）:特定のディメンションに従ってOracleオブジェクトの特性を分析します。例:大きいテーブル（1000行を超えるテーブル）     
* Object Details（オブジェクト詳細）:複数のディメンションからオブジェクトの関係を表示します。例:スキーマごとオブジェクトとオブジェクトの関連情報を表示します        
* Object Search(オブジェクト検索):オブジェクトを検索し、オブジェクトの特性からオブジェクトの全文検索をサポートします      

①Performanceを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025925.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922025952.png "img")    


②Capacityを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030004.png "img")    


③Oracle Featuresを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030016.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030022.png "img")    



・オブジェクト詳細を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030037.png "img")    


・依存情報の詳細を確認します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030049.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030057.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030104.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030111.png "img")    


④External Dependencyを確認します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030122.png "img")    


⑤Other Dimensionsを確認します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030132.png "img")    


⑥Object Detailsを確認します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030144.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030152.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030159.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030206.png "img")    



⑦Object Searchを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030220.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030227.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030233.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030240.png "img")    



ここまでデータベースプロファイルの作成が完了しました。       


## 4-3.ターゲットデータベースの選択      
1）ADAM診断レポートより、互換性について説明があると思いますので、それを参考にしながら、ソースデータベースから移行先のターゲットデータベースを選定する必要があります。
今回、Oracle Databaseをソーステーブルとして利用しているので、PolarDBだと、PolarDB-O（Oracle）、PolarDB-P（PostgreSQL）、PolarDB-M（MySQL）のいずれかが候補となります。（SQLの互換性はここには含まれておらず、例えばOracleからMySQLへ移行だとSQLクエリの修正が必要となります）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210923134405.png "img")    


ADAM診断レポートからみる互換性のコメントについて少し説明します。       

①DB Object Compatibility：データベースの互換性      
・データベースの互換性（DB Object Compatibility）:         
	互換度％：ADAMスマート互換性のパーセンテージを表示します        
	ADAMスマート互換性あり：ターゲットライブラリと直接互換性のあるオブジェクトと、ADAMによってインテリジェントに変換できるオブジェクトを含みます（ADAMデータベース改修プロダクトを使用して製品を変換すると、ADAMインテリジェント互換オブジェクトをターゲットデータベースへ自動的に作成してくれます）      
	互換性なし：データベースオブジェクトを手動で変更する必要があります。 （ADAMは改修提案をしてくれます）     

②SQL compatibility：DBSQLの互換性       
・DBSQLの互換性（SQL compatibility）:       
	互換度％：互換性のあるオブジェクトと改修後互換性のあるオブジェクトを含みます       
　　互換性あり：ターゲットライブラリと直接互換性のあるオブジェクトと、ADAMによってインテリジェントに変換できるオブジェクトを含みます      
　　改修後互換性あり：データベースSQLが改修された後互換性を持つことができ、アプリケーションに対応するSQL改修を行う必要があります        
　　互換性なし：互換性のないオブジェクト      

③一部のスキーマのみを移行するユーザーの場合、互換性リストの上部にあるスキーマでフィルタリングし、移行したいスキーマを選択して、ターゲットライブラリを選択しながら作成することができます。 もしお持ちのデータベースで移行したくないスキーマが含まれていた場合、これを活用することでADAM診断レポートを含めマイグレーション方法にスキーマフィルタリングの結果を反映することが出来ます。       

④ターゲットデータベースとして推奨Databaseのタイプ表示について      
ADAMは、データベースのプロファイルに従ってソースデータベースの使用シナリオ（TPタイプ、APタイプ、HTAPタイプ、またはテストタイプ）を総合的に分析し、互換性の状況と組み合わせて、最適なターゲットデータベースを推奨してくれます。      


2）データベースプロファイルの選定       
①Evaluate DB画面でデータベースプロファイルを選択し、New Select Destination Databaseボタンをクリックします         

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030411.png "img")    


②New Select Destination Database 画面でデータベースとSQLの互換性を確認します      
※ハイライト表示のデータベースがADAM評価による推奨のデータベースです       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030421.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030428.png "img")    



④推奨のデータベースタイプを表示してくれます           
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030438.png "img")    



# 4-4.データベース互換性評価分析 
ADAM評価分析概要：        
ADAM評価分析システムは、AlibabaCloudにデプロイされ、収集されたOracleデータを分析する一連のサービスです。          
収集したデータを評価システムにアップロードすることで、ADAMは客観的な分析結果を提供してくれます。         

分析結果は        
* ターゲットデータベースの仕様と数量      
* Oracleオブジェクトとターゲットデータベース間の互換性（オブジェクトとSQL）     
* OracleアプリケーションのSQL互換性      
* 複数のアプリケーション間のトポロジー関係      
* データベース移行の移行計画（ツールを使用して構造の移行は自動化できます）      

などが充実しています。     
評価分析システムはADAMシステム独自のものです。意思決定者が分析結果に基づいてソースデータベースを完全に理解するのに役立ちます。        
同時に意思決定者は、移行するかどうかを把握または決定し、評価移行改修の難しさ、ワークロードおよび移行後のコストなどの重要な情報を評価します。       

データベースの互換性評価は、ターゲットデータベースの互換性、仕様、および移行のリスクを評価するのに役立ちます。そのため、ユーザー観点としては、現存のソースデータベースをAlibaba Cloud　データベースサービスへの移行可能性と改修ワークロードを完全に理解することができます。      

## 4-4-1.ターゲットデータベース評価プロジェクトを作成します      
①ターゲットデータベース評価プロジェクトボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030628.png "img")    


②ご覧のようにターゲットデータベース評価プロジェクトを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030640.png "img")    


③Oracleユーザーを選択します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030650.png "img")    


④評価プロジェクトを作成開始します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030659.png "img")    


⑤評価プロジェクト作成中は次のようなステータス画面になります      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030709.png "img")    


⑥評価プロジェクトを作成完了しました
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922030718.png "img")    



## 4-4-2.プロジェクト評価詳細を確認します      
データベースの評価結果は、「プロジェクトの概要」、「評価の概要」、「評価の詳細」の3点の観点で表示されます。       
1. 評価の概要     
ソースデータベースからターゲットデータベースへ移行する互換性、改修点、仕様、リスク、および全体的な互換性をまとめたものです。      
* 互換性：ソースデータベースとターゲットデータベースの互換性を測定します。互換性が高いほど、変更必要なオブジェクトとSQLが少なくなります。    
* 改修：ターゲットデータベースへ移行するため改修が必要な具体的なところを示します。     
** オブジェクト改修ポイント：ADAMデータベース改修を使用した後、ユーザーが自己改修を行う必要はありません      
** アプリケーション改修ポイント：データベースによって収集されたSQL分析を通じて取得されます。データベース移行の初期評価です     
* 仕様：収集されたデータに基づいて、ADAMによってターゲットデータベースへの移行に必要な仕様および見積もりコストを計算してくれます。 仕様評価は収集環境の影響を受けるため、実際の購入はビジネスに合わせた総合評価を参考する必要があります。       
* リスク：ユーザーの移行と改修についてリスク警告を実行します。 ソースデータベースの既存のリスクポイントとターゲットデータベースへの移行によって可能性のあるリスクポイントが含まれます      
* 全体的な互換性：ソースデータベースからターゲットデータベースへの全体的な互換性を表示してくれます。         


2. 評価の詳細      
評価の詳細には、オブジェクトの互換性、SQLの互換性、オブジェクトの改修ポイント、ターゲットデータベースの仕様、移行のリスク、プロジェクトの外部依存関係（スキーマ）の6つの部分が含まれます。詳細ボタンから評価の詳細内容が確認できます。       
* オブジェクト互換性:すべてのオブジェクト互換性をリストします。ソースデータベースのすべてオブジェクト、互換性ある、互換性なしを含みます。改修後に互換性のあるオブジェクトに対し、ADAMは変換後のDDLと改修ポイントを提供します。互換性のないオブジェクトに対し、ADAMは非互換性の理由と改修の提案を提供します。           
* SQL互換性:データベースに収集されたSQLの文法分析の結果です。        
* オブジェクト改修ポイント:主にデータベースオブジェクトの改修ポイントをまとめてくれます。           
* ターゲットデータベース仕様:ユーザーがAlibabaCloudデータベースに移行するための仕様と移行計画のガイドラインを提供してくれます。      
* 移行リスク:ソースデータベースリスクとターゲットデータベースリスクの二つがあります。     
** ソースデータベースリスクは、ソースデータベースに収集されたSQLを実行するときにCPUと大容量メモリを消費するSQLリストを指します。TOPCPU/ TOP Bufferなどのタイプに分けられます。テスト中は、これらのSQLに注目する必要があります。       
** ターゲットデータベースリスクはデータベース構造の変更またはターゲットデータベースでのSQLの実行にリスクがある可能性があることです。 異種データベースの移行によって引き起こされるパフォーマンスの違いを回避するために、ユーザーは移行のリスクポイントに注意を払う必要があります。       
* プロジェクトの外部依存関係（スキーマ）：外部依存関係のオブジェクト数を評価します。ソリューション提案も提供してくれます。     

1）評価プロジェクトの詳細を確認します      

①詳細ボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084150.png "img")    



②詳細情報が確認できます

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084241.png "img")    


2）Object Compatibility情報を確認します      

①Object Compatibility情報を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084252.png "img")    


②Summaryを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084303.png "img")    


③Evaluation Detailsを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084312.png "img")    


④Details of Incompatible Rulesを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084322.png "img")    


3）SQL Compatibility情報を確認します      
①SQL Compatibility情報を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084332.png "img")    


②Evaluation Summaryを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084341.png "img")    


③Evaluation Detailsを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084353.png "img")    


④Rule Detailsを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084403.png "img")    


4）Object Transformationを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084416.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084424.png "img")    



5）Destination DB Specificationsを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084435.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084442.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084449.png "img")    


6）Migration Riskを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084500.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084508.png "img")    


7）Project Dependency (Schema)を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084523.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084530.png "img")    



8）簡易レポートをダウンロード      
①簡易レポートをダウンロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084543.png "img")    



②ローカルにダウンロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084557.png "img")    


③内容を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084605.png "img")    


9）すべてのレポートをダウンロードします      
①すべてのレポートをダウンロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084616.png "img")    


②ローカルにダウンロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084626.png "img")    


③内容を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084646.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014223999/20210922084652.png "img")    


# 最後に
 
ここまでADAMによる、Oracle Databaseに対するデータベース評価をご紹介しました。      
次はPart3 データベースマイグレーション準備に移りたいと思います。       

> http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_003_oracle-migration-part3



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>

