---
title: "RDS for MySQL連携方法"
metaTitle: "RDS for MySQL からMaxComputeへ連携する方法"
metaDescription: "RDS for MySQL からMaxComputeへ連携する方法"
date: "2021-03-12"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613699522100/20210311220708.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## RDS for MySQL からMaxComputeへ連携する方法

本記事では、RDS for MySQL からMaxComputeへ連携する方法について説明します。


# 前書き
> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 


> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute

    
今回はAlibaba Cloud RDS for MySQL からMaxComputeへデータを連携します（データベース移行）。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311220708.png "img")


---
---

# 共通作業（MaxCompute全体で共通事項）

## RAM ユーザー作成＆権限付与
もしMaxComputeを操作するユーザがRAMユーザーの場合は以下を実施してください。    

RAMより対象のユーザーを選定します。ユーザーが無い場合は新規作成します。 このときにAccessKey IDとAccessKey Secretをメモとして残してください。AccessKey IDとAccessKey SecretはDataWorks DataIntegrationの処理に必要となります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210305025953.png "img")

対象のユーザーには権限ロールとしてAliyunDataWorksFullAccessをアタッチします。 これはDataWorksを操作するためのFull権限です。    
DataWorks側にてユーザーごとに読み取り専用や一部プロジェクト・テーブルなどのきめ細かい権限付与ができますが、ここでは割愛します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210305025809.png "img")

今回は、RDSからMaxComputeへ連携する方法なので、<b>AliyunRDSFullAccess</b>もアタッチします。   


## Workspace作成

MaxComputeを操作するためにはワークスペースおよびプロジェクトが必要なので新たに作成します。DataWorksコンソールから 「Create Project」を選択し、起動します。    
Modeは「Basic Mode（基本モード）」「と「Standard Mode（標準モード）」の２種類があります。ここは「Basic Mode（基本モード）」として選定します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210304212211.png "img")

続けて、MaxCompute を選定します。料金は初めて操作するなら Pay-As-You-Go（使った分だけ課金） が良いと思います。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210304220348.png "img")

MaxComputeに関する必要な情報を設定し、Workspaceを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210304220459.png "img")

##  同期タスクをサブミットする方法（基本モード（basic mode））
作業の途中で 同期タスクをサブミットする旨のアクションが発生しますが、こちらの手順を参考にいただければ幸いです。　　　　   

DataWorks DataStdioで、操作が終わったら [Commit to Production Environment] をクリックし開発環境から本番環境へ直接コミットします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311222112.png "img")


##  同期タスクをサブミットする方法（標準モード（standard mode））

DataWorks DataStdioの右側にあるProperitiesをクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311221338.png "img")

プロパティRerunを設定して、[Use Root Node]ボタンをクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311221142.png "img")

開発環境にサブミットします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311221120.png "img")

あとは開発環境から本番環境にデプロイします。    



## Maxcomputeのデータをクエリする方法
DataWorks DataStdioのAd-Hoc Query画面に入って、[ODPS SQL]のノードを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311222431.png "img")

SQLクエリ文を作成したら、上書き保存してから、Run SQLボタンを押します。   
その後、SQLクエリの実行コストらお金が出ますが、ここも考慮のうえ、Run、で実行します。   
実行結果としてレコード数が無事表示されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311222939.png "img")


---
---

# （事前準備）RDS for MySQLの準備
RDSコンソールに入り、RDS for MySQLのインスタンスを作成します。   
インスタンス生成後、そのインスタンスIDをメモします。このIDは後述する作業にて必要となります。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311225949.png "img")

DataworksのデフォルトリソースグループのIPをMySQLインスタンのホワイトリストに追加します。     
東京リジョンのIPアドレスは次の通りです。    
```
100.105.55.0/24,11.192.147.0/24,11.192.148.0/24,11.192.149.0/24,100.64.0.0/10,47.91.12.0/24,47.91.13.0/24,47.91.9.0/24,11.199.250.0/24,47.91.27.0/24,11.59.59.0/24,47.245.51.128/26,47.245.51.192/26,47.91.0.128/26,47.91.0.192/26
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311230107.png "img")

MySQLを接続する用のホストのIPもホワイトリストに追加します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311230145.png "img")

MySQLのパブリックエンドポイントを申請します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311230216.png "img")

表示されたPublic Endpointをメモします。これも後述する作業にて必要となります。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311230305.png "img")

MySQLにてアカウントとDatabaseを作成します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311230359.png "img")


アカウントとパブリックエンドポイントを使ってDMSなどでMySQLに接続して、作成したDBにテーブルとデータを作成します。    

```SQL
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255),
  `email` varchar(255),
  `password` varchar(30),  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB ROW_FORMAT=dynamic DEFAULT 
CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` VALUES ('1', '加藤', '123@nice.com', 'niceday123@#2980');
INSERT INTO `users` VALUES ('2', '三島', '993@hello.com', '3ofoshfslk$&klj*2K');
INSERT INTO `users` VALUES ('3', '田島', '5ddd@happy.com', '*(&sjhvskjdhvks^%');
INSERT INTO `users` VALUES ('4', '三橋', '398@kkk.com', 'feifuwe^&%*&6rf4');
INSERT INTO `users` VALUES ('5', '渋谷', '898@cccc.com', 'vwejh^(&*(efwj4r');
INSERT INTO `users` VALUES ('6', '斉藤', '93839@cdfsf.com', '347r9^%*&3r234t');
INSERT INTO `users` VALUES ('7', '石井', 'mini@aaa.com', '4398^&%^*jkdv');
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311230525.png "img")

今度はDataWorks側での作業に移ります。   
RDS for MySQLをDataWorks DataIntegrationデータソースに追加します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311230553.png "img")

データソース追加をクリックして、MySQLを選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311230909.png "img")


データソースとしてMySQLのインスタンスID、UID、DB Name、アカウントなどの情報を入力し、接続テストを実行します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311231021.png "img")

接続テストで問題なければ、Completeボタンをクリックすることで、MySQLのデータソースが追加されます。   
これでMySQL側の設定は完了です。次はMaxCompute Tableの準備を進めます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311231130.png "img")


# （事前準備）MaxCompute Tableの準備

DataWorks DataIntegrationから、新規オフライン同期タスクをクリックし、DataStdio画面へ遷移します。     
DataStdio画面にて、「Create Node」らダイアログが表示されますが、ここではクローズします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311231235.png "img")

Workspace Tables画面に入って、テーブルを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311231300.png "img")

DDL Statementボタンをクリックして、MySQL Tableに対応するDDL Statementを入力します。    

```
CREATE TABLE IF NOT EXISTS mysql_users (
    `id` INT COMMENT '',
    `username` VARCHAR(255) COMMENT  '',
    `email` VARCHAR (255) COMMENT  '',
    `password` VARCHAR (30) COMMENT  ''
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311231559.png "img")


Display Nameを入力し、テーブルをコミットします。その後はテーブルが作成されてることが確認できます。    
※標準モードプロジェクトの場合は本番環境にもコミットする必要があります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311231644.png "img")


この準備が終わり次第、データを移行してみます。データ移行にはGUIモードとスクリプトモードの２つのパターンがあります。まずはGUIモードで移行します。    
スクリプトモードはtemplateな扱いができるため、後日この作業の自動化したい場合、活用できればと思います。   

# MySQLをMaxComputeへ移行(GUIモード)

## STEP1: workflow作成
DataWorks DataIntegrationから、新規オフライン同期タスクをクリックし、DataStdio画面へ遷移します。     
DataStdio画面にて、「Create Node」らダイアログが表示されますが、ここではクローズします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311231235.png "img")

DataStdio画面にてWorkflowを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311232629.png "img")

## STEP2: DI 同期タスクを作成
同期タスクを作成します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311232713.png "img")

ソースをMySQLに選択して、テーブルを選択します。そのあとはPreviewボタンをクリックします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311232808.png "img")

ターゲットをODPSに選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311232841.png "img")

Maxcomputeテーブルを選択します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311232931.png "img")

すると、自動でマッピングが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311233002.png "img")


## STEP3: DI 同期タスクを実行

タスクを実行します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311233055.png "img")


タスクが成功すると、Logが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311233146.png "img")

あとはAd-Hoc クエリで確認します（手順は上記の共通手順にて記載しています）    
```
select * from nelly_test_dev.mysql_users;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311233321.png "img")

これにより、GUIモードでMySQLのデータをMaxCompute Tableへ取り込んだことが確認できました。     


# MySQLをMaxComputeへ移行(スクリプトモード)

## STEP1: workflow作成
DataWorks DataIntegrationから、新規オフライン同期タスクをクリックし、DataStdio画面へ遷移します。     
DataStdio画面にて、「Create Node」らダイアログが表示されますが、ここではクローズします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311231235.png "img")

DataStdio画面にてWorkflowを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311232629.png "img")

## STEP2: DI 同期タスクを作成
同期タスクを作成します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311232713.png "img")


## STEP3: スクリプトモードにスイッチ
Switch to Code Editorボタンをクリックし、スクリプトモードにスイッチします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311233608.png "img")

するとスクリプトが表示されます。これは先述、GUIモードで選択した設定が自動でスクリプトに反映されます。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311233726.png "img")

## STEP4: DI 同期タスクを実行

スクリプト（タスク）を実行します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311233756.png "img")

スクリプト（タスク）が成功すると、タスクとしてLogが表示されます。       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311233814.png "img")

あとはAd-Hoc クエリで確認します（手順は上記の共通手順にて記載しています）    
```
select * from nelly_test_dev.mysql_users;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311233321.png "img")


---


# 最後に
本記事では、RDS for MySQL からMaxComputeへ連携する方法を簡単に説明しました。     
RDSでデータ量が肥大化した場合は、この方法でMaxComputeへデータ移植、コスト削減およびDWHとしての運用ができれば幸いです。   

<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


