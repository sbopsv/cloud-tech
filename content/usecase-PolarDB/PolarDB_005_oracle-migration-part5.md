---
title: "PolarDB-OマイグレーションPart5"
metaTitle: "【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part5 アプリケーションマイグレーションと改修"
metaDescription: "【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part5 アプリケーションマイグレーションと改修"
date: "2021-09-23"
author: "sbc_ohara"
thumbnail: "/polardb_images_13574176438014225111/20210922223627.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part5 アプリケーションマイグレーションと改修

# はじめに

本記事では、Oracle DatabaseからPolarDB-Oマイグレーション-Part5 アプリケーションマイグレーションと改修 についてを紹介します。     
こちら長文になるので、全部でPart5に分けて紹介します。   

[Part1 OracleDatabaseセットアップ、事前準備](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_001_oracle-migration-part1)         
[Part2 Oracle Database評価](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_002_oracle-migration-part2)         
[Part3 データベースマイグレーション準備](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_003_oracle-migration-part3)         
[Part4 データベースマイグレーション実行](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_004_oracle-migration-part4)         
[Part5 アプリケーションマイグレーションと改修](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_005_oracle-migration-part5) ←本記事です        

# PolarDBとは

PolarDBはAlibaba Cloudが開発したCloud Native Databaseサービスです。MySQL・PostgreSQLは100%、Oracleは高い互換性を持ちながら、ユーザーのワークロードに応じて垂直・水平スケーリングすることが出来るため、コストを大幅に削減できることが特徴です。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923094834.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923095110.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923095159.png "img")    





# 最初に

Part4でターゲットとなるOracle Database（以降ターゲットDBと省略します）からPolarDB-Oへマイグレーションを完了しました。Oracle Databaseにはあって、PolarDBにはない関数とかの改修対応もスムーズに対応できました。            
この記事 Part5では、PolarDB-O に対し、アプリケーションのマイグレーションと改修を行うフェーズとなります。        
Oracle DatabaseからPolarDB-Oへデータベースマイグレーション後、その後どのようなアクションが適切かを追って説明します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922223627.png "img")    



# 6.アプリケーションマイグレーションと改修
# 6-1.アプリケーションを収集します      
## 6-1-1.アプリケーション収集ツールをダウンロードします      
1）application collectorツールをダウンロードします      

①ADAMコンソール画面でapplication collectorツールをダウンロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225333.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225341.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225349.png "img")    


②application collectorツールをダウンロードしました
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225401.png "img")    


2）application collectorをアップロードします      
①application collectorをアプリケーションECSにアップロードします      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225409.png "img")    


②application collectorを解凍します      
```
# gunzip adam-appagent-guard.tar.gz
# tar -xmvf adam-appagent-guard.tar
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225418.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225425.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225432.png "img")    



3）application collectorの設定           
application collectorは「Collector」「javaagent」の二つのアプリケーションがあります。       

* javaagentはアプリケーションのデータを収集します。    
* Collectorではすべてのjavaagentアップロードしたデータを収集し保存します。    

Collectorとjavaagentは１つのサーバー（ECS）へ導入、もしくはそれぞれ異なるサーバー（ECS）に導入しデプロイすることができます。中にはjavaagentは監視したいアプリケーションと同じサーバーにデプロイします。Collectorでは単独的にデプロイできます。javaagentとCollector分離デプロイする場合、javaagentの設定ファイルを変更する必要があります。      
javaagentの設定ファイルの修正方法は次の通りです。     

```
vim /root/javaagent-package-1.2.6/javaagent/javaagent.config
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225446.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225454.png "img")    



今回はDemoとして一つのアプリケーションをモニタリングするため、１つのサーバー（ECS）へ導入します。デプロイ方法として設定ファイルは変更しません。     

## 6-1-2.アプリケーションデータを収集します      
1）アプリケーションが起動されることを確認します      
①バクエンドでアプリケーションを起動します      

```
# nohup ./run.sh &
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225509.png "img")    




②shopアプリケーションのPIDを確認します      

```
# ps -ef | grep java
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225530.png "img")    


③shopアプリケーションのPIDをアタッチします      

```7
# ./attach.sh -p #{pid}
```

```
# cd /root/javaagent-package-1.2.6/javaagent
# ./attach.sh -p 12943
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225541.png "img")    


④アプリケーションを操作します      
※一定のデータを収集するために、データ収集中アプリケーションを操作します。

ECS上で構築した、アプリケーションで仮オーダー操作をします      
PolarDBらデータベース側へ反映されるような操作アクションであれば、何でも良いです。以下スクリーンショットはアプリケーション上で処理完了するまでのDemo動作となります。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225557.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225605.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225613.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225621.png "img")    



②収集されたデータを確認します      

```
# cd /root/javaagent-package-1.2.6/collector/data
# ls
# cd app/
# ls
# cd adamApp17216097/
# ls
# cd 172.16.0.97/
# ls
# cd 7001/
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225657.png "img")    



③収集されたデータを圧縮します      
```
# zip appData.zip *.csv
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225709.png "img")    


④appData.zipをローカルにダウンロードします      

```
# sz appData.zip
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225721.png "img")    


⑤ローカルにappData.zipを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225734.png "img")    


# 6-2.アプリケーションプロファイルを分析します      
## 6-2-1.アプリケーションプロファイルを作成します      
1）アプリケーションプロファイルを作成します      
①アプリケーションプロファイル作成をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225742.png "img")    


②プロファイル作成をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922225752.png "img")    


③プロファイル作成を作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233513.png "img")    


④収集されたアプリケーションデータをアップロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233523.png "img")    


⑤データベースプロファイルを選択します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233534.png "img")    


⑥追加ボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233543.png "img")    


⑦プロファイル作成ボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233554.png "img")    


⑧アプリケーションプロファイルを作成開始します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233604.png "img")    


⑨アプリケーションプロファイルを作成完了します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233614.png "img")    



## 6-2-2.アプリケーションプロファイル分析結果を確認します      
1）アプリケーションプロファイル分析概要を確認します      
①Summaryを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233625.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233633.png "img")    




2）アプリケーションプロファイル分析概要を確認します      
プロファイル詳細画面では下記情報が確認できます      

* System Information（システム情報）:アプリケーションのシステム情報とパフォーマンスを表示します      
* Object Overview（オブジェクト概要）:アプリケーションの基本操作情報      
* Object Details（オブジェクト詳細）:オブジェクト詳細を確認します。呼び出し情報も確認します      

①System Informationを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233704.png "img")    


②Object Overviewを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233718.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233726.png "img")    


③Object Detailsを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233735.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233744.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233753.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233800.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233807.png "img")    


④アプリケーションプロファイル分析レポートをダウンロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233819.png "img")    


⑤分析レポートをローカルにダウンロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233828.png "img")    


⑥分析レポートを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233837.png "img")    


⑦SQL互換性情報を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233846.png "img")    


ここまでアプリケーションプロファイルの作成が無事完了しました。        


# 6-3.アプリケーション評価
1）アプリケーション評価プロジェクトを作成します      

①「次へプロジェクト作成」をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233856.png "img")    


②アプリケーション評価プロジェクト作成をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233907.png "img")    


③アプリケーション評価プロジェクトを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233919.png "img")    


④APPプロファイルを選択します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233929.png "img")    


⑤データベースを選択します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233937.png "img")    


⑥アプリケーション評価プロジェクトを作成開始します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233945.png "img")    


⑦アプリケーション評価プロジェクトが作成完了しました

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922233954.png "img")    


2）アプリケーション評価プロジェクト詳細を確認します      
①詳細画面を開きます      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922234004.png "img")    


②評価結果を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922234041.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922234050.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922234058.png "img")    



③プロジェクト概要を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922234110.png "img")    


④プロファイルを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210922234122.png "img")    


⑤レポートをダウンロードします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000415.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000429.png "img")    



⑥レポートを解凍します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000440.png "img")    



⑦レポート内容を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000451.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000459.png "img")    


# 6-4.データベースマイグレーションに伴うアプリケーションの改修
このStepは、データベースマイグレーションに伴う接続先変更など、既存アプリケーションを一部改修するフェーズとなります。例えばjdbcドライバー変更、SQLクエリの対応、待ち時間設定etc....          
そのため、お持ちのアプリケーション構造など、必要に応じてこのStepを実施するなり、Skipしても問題ないです。      

## 6-4-1.アプリケーションを開きます
１）今回のデモ改修プロジェクトは下記のリンクからダウンロードできます          
[app polardb link](https://code.aliyun.com/best-practice/130/tree/polardb)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000516.png "img")    


2）IntelijIDEAでプロジェクトを開きます          

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000527.png "img")    



## 6-4-2.データベースマイグレーションに伴うアプリケーションの改修     
1）コンフィグファイルを改修します      
①アプリケーションのJDBCドライバー(pom.xml)を改修します      
ソースアプリケーションとしてOracle DatabaseのDriver packageを使用しているので、マイグレーション後はPolarDBのDriver packageに変更します      

```pom.xml
<dependency>
<groupId>edb</groupId>
<artifactId>edb.driver</artifactId>
<version>1.8</version>
<scope>system</scope>
<systemPath>${project.basedir}/src/driver/edb.driver.jar</systemPath>
</dependency>
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000541.png "img")    


②jdbc.propertiesを改修します       
改修前     

```jdbc.properties
jdbc.driver=oracle.jdbc.driver.OracleDriver
jdbc.url=jdbc:oracle:thin:@//172.16.0.96:1521/orcl11g
jdbc.user = shoptest
jdbc.password = shoptest
```

改修後（jdbc.urlでスキーマは大文字で正しくしてください）         

```jdbc.properties
jdbc.driver=com.edb.Driver
jdbc.url=jdbc:edb://pc-0iw446wg8ov2y7ul0.o.polardb.japan.rds.aliyuncs.com:1521/sbdb?currentSchema=SHOPTEST
jdbc.user = sbtest
jdbc.password = Test1234
```

今回はアプリケーションのECSはPolarDBと同じVPC上で作成するため、イントラネットエンドポイントで設定します        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000554.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000601.png "img")    




③applicationContext.xmlを改修します       

```applicationContext.xml
        <property name="hibernateProperties">
			<props>
				<prop key="hibernate.dialect">org.hibernate.dialect.PostgreSQLDialect</prop>
				<prop key="hibernate.show_sql">true</prop>
				<prop key="hibernate.format_sql">true</prop>
				<prop key="hibernate.connection.autocommit">false</prop>
				<prop key="hibernate.hbm2ddl.auto">update</prop>
			</props>
		</property>
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000611.png "img")    


2）SQL改修      
SQL改修機能は（2021/9/23時点で）コンソールの表示言語が中国語版のみ対応しています。        
英語版は2021年10月以降に利用することができます。表示言語が異なりますが中の挙動は同じとなりますので、ここでは中国語版として改修をします。          

①必要に応じてSQL改修します         

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000621.png "img")    


3）プロジェクトをビルドします       
①アプリケーションコードが改修完了したら、ビルドします       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000634.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000641.png "img")    



②プロジェクトを作成します      

```
mvn clean package -DskipTests
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000654.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000702.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000710.png "img")    


## 6-4-3.アプリケーションをデプロイします      
1）新しいサーバー環境を作成します（作成方法はここでは省略します）      
①PolarDBインスタンスのVPCを確認します       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000722.png "img")    


②ECSを作成します      
移行前のECSと同じ仕様で作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000732.png "img")    


③ECSを接続します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000741.png "img")    



2）ECSでjava環境を設定します      
①Javaをインストールします      

```
# yum install java -y
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000750.png "img")    


②Javaバージョンを確認します      

```
# java -version
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000800.png "img")    


3）lrzszをインストールします      

```
# yum install lrzsz
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000808.png "img")    


4）アプリケーションJarをECSにデプロイします        
①ターゲットJarファイルをアップロードします      　  

```
# rz 
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000818.png "img")    


②Jarファイルを解凍します      

```
# gunzip shop-1.0.0-SNAPSHOT-release.tar.gz
# ls
# tar -xvmf shop-1.0.0-SNAPSHOT-release.tar
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000828.png "img")    


4）アプリケーションサイトを起動します       
①PolardbインスタンスにECSのホワイトリストを追加します       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000838.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000846.png "img")    



②下記コマンドでアプリケーションを起動します       

```
# cd shop
# ./run.sh
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000856.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000904.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000912.png "img")    


5）下記のアプリケーションサイトをアクセスします      
①アプリケーションサイトをアクセスします      

```
http://47.74.57.81/index.action
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000922.png "img")    


②オーダーを作成します        
このDemoは中国語で作られたため、キャプチャーは中国語で表示されています       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000933.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000942.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000950.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014225111/20210923000957.png "img")    



ここまでアプリケーションのマイグレーションが無事完成しました。         


# 最後に


以上、Part1～Part5を通じて、Oracle DatabaseからPolarDB-Oへのマイグレーション手法のご紹介でした。       
Oracle DatabaseからPolarDB-Oへのマイグレーションを検討されている方はご参考に頂ければ大変幸いです。      

> http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_001_oracle-migration-part1
> http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_002_oracle-migration-part2
> http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_003_oracle-migration-part3
> http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_004_oracle-migration-part4
> http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_005_oracle-migration-part5


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>




