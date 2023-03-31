---
title: "PolarDB-OマイグレーションPart3"
metaTitle: "【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part3 データベースマイグレーション準備"
metaDescription: "【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part3 データベースマイグレーション準備"
date: "2021-09-23"
author: "sbc_ohara"
thumbnail: "/polardb_images_13574176438014224403/20210922092601.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part3 データベースマイグレーション準備

# はじめに

本記事では、Oracle DatabaseからPolarDB-Oマイグレーション-Part3 データベースマイグレーション準備 についてを紹介します。     
こちら長文になるので、全部でPart5に分けて紹介します。   

[Part1 OracleDatabaseセットアップ、事前準備](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_001_oracle-migration-part1)         
[Part2 Oracle Database評価](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_002_oracle-migration-part2)         
[Part3 データベースマイグレーション準備](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_003_oracle-migration-part3)←本記事です         
[Part4 データベースマイグレーション実行](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_004_oracle-migration-part4)         
[Part5 アプリケーションマイグレーションと改修](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_005_oracle-migration-part5)         


# PolarDBとは

PolarDBはAlibaba Cloudが開発したCloud Native Databaseサービスです。MySQL・PostgreSQLは100%、Oracleは高い互換性を持ちながら、ユーザーのワークロードに応じて垂直・水平スケーリングすることが出来るため、コストを大幅に削減できることが特徴です。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210923094834.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210923095110.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210923095159.png "img")    





# 最初に

この記事 Part3では、ターゲットとなるOracle Database（以降ターゲットDBと省略します）からPolarDB-O（Oracle互換性版）へマイグレーションをするための準備フェーズとなります。     
Part2 の通りADAM診断レポートを通じてターゲットDBのフィードバックがあったと思うので、それを基にPolarDB-Oへどのようにマイグレーションするかといった準備作業の説明をします。　　　　　

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922092601.png "img")    



# 5.Oracle Databaseオンラインマイグレーションと改修

ユーザーはパブリッククラウドデータベースリソースをアクティブ化し、オンラインデータベース構造の移行と改修をすることができます。       

前提条件として、操作するユーザーのアカウント権限を事前に確認する必要があります。     
Rootアカウントの場合はこの部分を無視してもかまいません。       
RAMアカウントの場合、データベースマイグレーション改修画面にアクセス権限を与える必要があります。       

# 5-1.マイグレーションプランを作成します      
## 5-1-1.PolarDBインスタンスを作成します      
1）PolarDBインスタンスを作成します      
データベース評価によるお勧めの仕様は4 Cores 16 G Memory 128 G Diskです　   

①AlibabaCloudをログインし、PolarDBコンソール画面を開きます

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093004.png "img")    



②インスタンス作成ボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093020.png "img")    


③PolarDBインスタンスを設定します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093032.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093040.png "img")    



④TermsOfserviceをチェックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093059.png "img")    


⑤インスタンス情報を確認しBuyボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093115.png "img")    



⑥PolarDBインスタンス作成中はこのような画面になります     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093143.png "img")    


⑦PolarDBインスタンスが作成完了しました

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093200.png "img")    



2）ユーザーを作成します      
①PolarDBインスタンスをクリックし、詳細画面を開きます

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093225.png "img")    


②Accountメニューをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093234.png "img")    


③Account作成ボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093242.png "img")    


④アカウント名とパスワードを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093340.png "img")    


⑤アカウントが作成したので確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093348.png "img")    


3）データベースを作成します      
①データベース作成をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093401.png "img")    



②データベース名とアカウントを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093410.png "img")    


③データベースが作成したので確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093420.png "img")    


4）ホワイトリストを設定します      
①ECS-OracleとECS-APPのIPをホワイトリストに追加します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093431.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093439.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093446.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093453.png "img")    



5）パブリックエンドポイントを追加      
①プライマリーのエンドポイントを追加します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093532.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093540.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093547.png "img")    


②クラスターのエンドポイントを追加します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093616.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093623.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922093631.png "img")    


## 5-1-2.マイグレーションプロジェクトを作成します      
1）RAMの権限を授与します      
①初回Transform and Migrate DBページを開く際に、RAMの権限を与える必要があります      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922095748.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922095757.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922095806.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922095814.png "img")    



2）マイグレーションプロジェクトを作成します      
①マイグレーションプロジェクト作成ボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922095827.png "img")    


②PolarDBのVPCを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922095836.png "img")    


③VPCとPolarDBを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922095845.png "img")    


④DBとアカウントを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922095855.png "img")    


⑤接続を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922095906.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922095913.png "img")    



⑥プロジェクトを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102255.png "img")    


⑦マイグレーションプロジェクトが作成したので確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102305.png "img")    


# 5-2.ソースデータベースにADAMのホワイトリストを追加します      
1）下記IPをソースデータベースのホワイトリストに追加します      

```
39.100.131.0/24,47.241.17.0/24,149.129.255.0/24,47.254.192.180,47.89.251.0/24,47.245.13.0/24,47.75.108.0/24
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102324.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102331.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102341.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102348.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102356.png "img")    



# 5-3.ターゲットデータベースの事前検査（プリチェック）
1）マイグレーションプロジェクト詳細を確認します      
①詳細ボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102408.png "img")    


②事前検査（プリチェック）の実行結果が表示されます       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102419.png "img")    


③詳細を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102429.png "img")    


# 5-4.ソースデータベースプランの検証（オプション）
1）ソースデータベース検証ボタンをクリックします       
ソースデータベースの検証は必須でない手順です。オブジェクト移行の検証をスキップすると、ADAMは前回データベース収集の評価と分析の結果によって移行されます。     
そのため、データが変更されていない場合は、このStepをスキップしても問題ありません。      
ソースデータベース計画の検証は、ソースデータベースのデータとオブジェクトが前回データ収集されてから現在までの間に大きな変更があるかどうかを確認するのに役立ちます。これはソースデータベースをはじめサービス基盤やアプリケーションが一切止まることなく、データベース移行を無事完了するように差分をチェックしフォローしてくれます。      


①ソースデータベースの情報を入力します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102448.png "img")    



```
・IP:ソースデータベースのIPアドレス（8.211.143.78）
・ServiceName/SID：ソースデータベースのOracleのServiceNameまたはSID、（ServiceNameを設定します）
・Encode方法:ソースデータベースのEncodeを設定します。必須項目ではない（UTF-8を設定します）
・Port:ソースデータベースの接続Port（1521）
・ユーザー:データ収集アカウントを設定します（eoa_user）
・パスワード:データ収集パスワードを設定します（eoaPASSW0RD）
```

②接続テストします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102504.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102512.png "img")    



③下記のボタンをクリックすることで、ソースデータベースの差分の検証をスキップすることができます       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102528.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102535.png "img")    


④ソースデータベースの検証ボタンをクリックし、ソースデータベースを検証します       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102547.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102554.png "img")    


2）ソースデータベースの検証結果を確認します      
検証結果は手動で「無視」または「変換」をすることが出来ます。      
無視：DDLオブジェクトの移行を無視します。     
変換：NEW、CHANGEDはスマートで変換します。        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102654.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102702.png "img")    


# 5-5.スキーマのマイグレーション       
①スキーママイグレーションボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102720.png "img")    


②マイグレーションルールを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102733.png "img")    


③SQLトリガーオーナー追加をオンにします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102743.png "img")    


④スキーママイグレーション画面で開始をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102755.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102803.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102810.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102818.png "img")    



⑤スキーママイグレーション完了します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102832.png "img")    


⑥カスタマイズスキーママイグレーションボタンをクリックすれば、カスタマイズマイグレーションもできます

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102846.png "img")    


⑦スキーマ改修タブが表示されますので、確認します

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102902.png "img")    


⑧その他操作
すべてのオブジェクトを再移行:移行されたオブジェクトまたは移行されていないオブジェクトを含むDDLの再移行を開始します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102913.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922102921.png "img")    


* 移行失敗したものを再開：もしスキーママイグレーションタスクの移行が失敗したら、このボタンをクリックすることでタスクを再開することができます      
* 移行の停止：マイグレーションタスクを停止することができます           

# 5-6.ソースデータベース非互換性のオブジェクトの改修
## 5-6-1.非互換性のオブジェクトを確認します      
1）スキーママイグレーション完了後、ステータスを確認します      
①失敗したオブジェクト箇所を確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922103043.png "img")    


②「詳細とスキーマ改修」の詳細をクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922103054.png "img")    


③スキーマ改修が必要な個所が表示されます

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922103103.png "img")    


2）オブジェクト改修が必要な個所をダウンロードすることができます     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922103113.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922103120.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922103126.png "img")    



## 5-6-2.非互換性のテーブルを改修します      
今回の例の場合、マイグレーション失敗のオブジェクトはテーブル二つとビューが三つとなりました。      
この失敗箇所に対する解決策として、ADAM診断レポートおよびエラーメッセージのアドバイスに基づいて対処する必要があります。     
もしフォロー箇所もしくは解決策が不明な場合は、Alibaba Cloud Ticket centerへチケットをあげて、データベースサポートチームに連絡しながらデータベースの専門家達によるフォローアップで対処することもできます。     

1）エラー箇所に基づいて、スキーマを確認し修正します      
①エラー詳細：
```
2021-09-10 15:35:07 SHOPTEST TABLE TAB_TRANS_TEMP ERROR: cannot create temporary relation in non-temporary schema
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922103139.png "img")    


②グローバルテンポラリテーブルの問題を修正します      
PolarDBはグローバルテンポラリテーブルをサポートしています。ユーザーからはグローバルテンポラリテーブルを設定することが出来ないため、Alibaba Cloud Ticket centerへチケットをあげて、データベースサポートチームに連絡しながら対処してもらう必要があります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922103152.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922103200.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922103208.png "img")    



③Alibaba Cloud Ticket centerにて、エラーメッセージとインスタンス情報などを入力してチケットをあげます      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104142.png "img")    



④データベースサポートチームにグローバルテンポラリテーブルをオンにすることを依頼します         

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104154.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104201.png "img")    



⑤グローバルテンポラリテーブルのパラメータを確認します      
```
show polar_num_active_global_temp_table;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104216.png "img")    



⑥ステータスを変更後、グローバルテンポラリテーブルパラメータを確認します      
```
show polar_num_active_global_temp_table;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104229.png "img")    



⑦テーブルを改修します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104243.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104251.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104258.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104305.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104313.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104321.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104328.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104335.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104342.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104349.png "img")    



## 5-6-3.非互換性のビューと関数を改修します      
1）KANA_HIRAGANA_VIEWを改修します      
①エラーメッセージを確認します      
```
NANCYTEST VIEW KANA_HIRAGANA_VIEW ERROR: function utl_i18n.transliterate(character varying, unknown) does not exist
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104402.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104410.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104417.png "img")    



②DMSでPolarDBへ接続し、新しい関数を作成します      
※PolarDBで関数を正しく設定します。今回はデモなので、あくまでも参考程度に頂ければ幸いです。     
```nancytest.h2z_hana
CREATE OR REPLACE FUNCTION nancytest.h2z_hana(text) 
  RETURNS text AS
$BODY$
    DECLARE
        zenkaku alias FOR $1;
        result text;
        i int;
        zt varchar[] = ARRAY['ガ', 'ギ', 'グ', 'ゲ', 'ゴ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ', 'ダ', 'ヂ', 'ヅ', 'デ', 'ド', 'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ', 'ヴ'];
        ht varchar[] = ARRAY['ｶﾞ', 'ｷﾞ', 'ｸﾞ', 'ｹﾞ', 'ｺﾞ', 'ｻﾞ', 'ｼﾞ', 'ｽﾞ', 'ｾﾞ', 'ｿﾞ', 'ﾀﾞ', 'ﾁﾞ', 'ﾂﾞ', 'ﾃﾞ', 'ﾄﾞ', 'ﾊﾞ', 'ﾋﾞ', 'ﾌﾞ', 'ﾍﾞ', 'ﾎﾞ', 'ﾊﾟ', 'ﾋﾟ', 'ﾌﾟ', 'ﾍﾟ', 'ﾎﾟ', 'ｳﾞ'];
    BEGIN
        result = zenkaku;
        -- 2バイトで変換
        FOR i IN 1..26 LOOP
            result = replace(result, ht[i], zt[i]);
        END LOOP;
        -- 1バイトで変換
        result = translate(result,
                   ' ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮﾜｲｴｶｹｰ､｡･｣｢ﾞ,<.>/?_}]*:+;{[~@|\\`^=-)(&%$#"!',
                   ' がぎぐげござじずぜぞだじずでどばびぶべぼぱぴぷぺぽゔあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉっゃゅょわいえかけー、。・」「゛，＜．＞／？＿｝］＊：＋；｛［￣＠｜￥｀＾＝－）（＆％＄＃"！'
              );

        RETURN result;
    END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104902.png "img")    


③KANA_HIRAGANA_VIEWを改修します      
改修前
```
CREATE OR REPLACE VIEW NANCYTEST.KANA_HIRAGANA_VIEW(KANA_HIRAGANA_NAME) AS
SELECT
    UTL_I18N.TRANSLITERATE(name, 'kana_HIRAGANA') AS kana_HIRAGANA_name
FROM
    ignore_case_products
where not regexp_like(name, '^[a-zA-Z0-9]'); 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104920.png "img")    


改修後
```
CREATE OR REPLACE VIEW NANCYTEST.KANA_HIRAGANA_VIEW(KANA_HIRAGANA_NAME) AS
SELECT
    nancytest.h2z_hana(name) AS kana_HIRAGANA_name
FROM
    ignore_case_products
where not regexp_like(name, '^[a-zA-Z0-9]'); 
```
※マイグレーションプロセスが成功したら、マイグレーション後、上記の関数を修正することもできます

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104936.png "img")    


2）KANA_FWKATAKANA_VIEWを改修します      
①エラーメッセージを確認します      
```
NANCYTEST VIEW KANA_FWKATAKANA_VIEW ERROR: function utl_i18n.transliterate(character varying, unknown) does not exist
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922104949.png "img")    



②DMSでPolarDBへ接続し、新しい関数を作成します      
```nancytest.h2z_kana
CREATE OR REPLACE FUNCTION nancytest.h2z_kana(text) 
  RETURNS text AS
$BODY$
    DECLARE
        zenkaku alias FOR $1;
        result text;
        i int;
        zt varchar[] = ARRAY['ガ', 'ギ', 'グ', 'ゲ', 'ゴ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ', 'ダ', 'ヂ', 'ヅ', 'デ', 'ド', 'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ', 'ヴ'];
        ht varchar[] = ARRAY['ｶﾞ', 'ｷﾞ', 'ｸﾞ', 'ｹﾞ', 'ｺﾞ', 'ｻﾞ', 'ｼﾞ', 'ｽﾞ', 'ｾﾞ', 'ｿﾞ', 'ﾀﾞ', 'ﾁﾞ', 'ﾂﾞ', 'ﾃﾞ', 'ﾄﾞ', 'ﾊﾞ', 'ﾋﾞ', 'ﾌﾞ', 'ﾍﾞ', 'ﾎﾞ', 'ﾊﾟ', 'ﾋﾟ', 'ﾌﾟ', 'ﾍﾟ', 'ﾎﾟ', 'ｳﾞ'];
    BEGIN
        result = zenkaku;
        -- 2バイトで変換
        FOR i IN 1..26 LOOP
            result = replace(result, ht[i], zt[i]);
        END LOOP;

        -- 1バイトで変換
        result = translate(result,
                   ' がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽヴあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮﾜｲｴｶｹｰ､｡･｣｢ﾞ,<.>/?_}]*:+;{[~@|\\`^=-)(&%$#"!',
                   ' ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョヮヰヱヵヶー、。・」「゛，＜．＞／？＿｝］＊：＋；｛［￣＠｜￥｀＾＝－）（＆％＄＃"！'
              );
        RETURN result;
    END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922105008.png "img")    



③KANA_FWKATAKANA_VIEWを改修します      
改修前
```
CREATE OR REPLACE VIEW NANCYTEST.KANA_FWKATAKANA_VIEW(KANA_FWKATAKANA_NAME) AS
SELECT
    UTL_I18N.TRANSLITERATE(name, 'kana_fwkatakana') AS kana_fwkatakana_name
FROM
    ignore_case_products
where not regexp_like(name, '^[a-zA-Z0-9]'); 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922105022.png "img")    



改修後
```
CREATE OR REPLACE VIEW NANCYTEST.KANA_FWKATAKANA_VIEW(KANA_FWKATAKANA_NAME) AS
SELECT
    nancytest.h2z_kana(name) AS kana_fwkatakana_name
FROM
    ignore_case_products
where not regexp_like(name, '^[a-zA-Z0-9]');
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922105036.png "img")    



3）V_CONNECT_BYを改修します      
①エラーメッセージ:
```
SHOPTEST VIEW V_CONNECT_BY ERROR: syntax error at or near "empno"
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922105048.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922105055.png "img")    



②改修前の関数を確認します      
```V_CONNECT_BY
CREATE OR REPLACE VIEW "SHOPTEST"."V_CONNECT_BY"("EMPNO", "MGR", "LV") AS
select
    empno,
    mgr,
    level as lv
from
    tab_connect_by a start with mgr is null connect by(prior empno) = mgr
and deptno = 10
order by
    level;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922105109.png "img")    


③改修後も関数を確認します      
```V_CONNECT_BY
CREATE OR REPLACE VIEW "SHOPTEST"."V_CONNECT_BY"("EMPNO", "MGR", "LV") AS
select
    empno,
    mgr,
    level as lv
from
    tab_connect_by a start with mgr is null connect by prior empno = mgr
and prior deptno = 10
order by
    level;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922105123.png "img")    


4）ADAM診断による移行失敗した箇所をすべて対応したことを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922105135.png "img")    


ここまでADAM診断による移行失敗した箇所をすべて改修したので、エラーメッセージは0、無くすことができました。

# 5-7.増量ソースデータの比較（オプション）
増量ソースデータの比較はオプション操作です。
マイグレーション中、データの増分が少ない場合、スキップすることもできます。          

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922105148.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922110619.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922112431.png "img")    



![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224403/20210922112439.png "img")    


# 最後に

ここまでADAMによる、Oracle Databaseオンラインマイグレーションでボトルネックとなる箇所の確認、および改修方法をご紹介しました。      
次はPart4 データベースマイグレーション実行に移りたいと思います。       


> http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_004_oracle-migration-part4



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>




