---
title: "PolarDB-OマイグレーションPart4"
metaTitle: "【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part4 データベースマイグレーション実行"
metaDescription: "【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part4 データベースマイグレーション実行"
date: "2021-09-23"
author: "sbc_ohara"
thumbnail: "/polardb_images_13574176438014224791/20210922195004.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part4 データベースマイグレーション実行

# はじめに

本記事では、Oracle DatabaseからPolarDB-Oマイグレーション-Part4 データベースマイグレーション実行 についてを紹介します。     
こちら長文になるので、全部でPart5に分けて紹介します。   

[Part1 OracleDatabaseセットアップ、事前準備](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_001_oracle-migration-part1)         
[Part2 Oracle Database評価](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_002_oracle-migration-part2)         
[Part3 データベースマイグレーション準備](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_003_oracle-migration-part3)         
[Part4 データベースマイグレーション実行](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_004_oracle-migration-part4)←本記事です         
[Part5 アプリケーションマイグレーションと改修](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_005_oracle-migration-part5)         

# PolarDBとは

PolarDBはAlibaba Cloudが開発したCloud Native Databaseサービスです。MySQL・PostgreSQLは100%、Oracleは高い互換性を持ちながら、ユーザーのワークロードに応じて垂直・水平スケーリングすることが出来るため、コストを大幅に削減できることが特徴です。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210923094834.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210923095110.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210923095159.png "img")    



# 最初に

この記事 Part4では、ターゲットとなるOracle Database（以降ターゲットDBと省略します）から PolarDB-O へデータベースマイグレーションを行うフェーズとなります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922195004.png "img")    



# 5-8.データベースマイグレーションを実行
## 5-8-1.スキーマを一時的に除外します      
1）データマイグレーション画面で開始ボタンをクリックし、スキーマを一時的に除外します      
①データマイグレーション画面でスキーマを一時的に除外します      
マイグレーション前にて、Excluded Schemas（スキーマ除外一覧）にオブジェクトがある場合、スキーマを一時的に除外する必要があります。マイグレーション後、再度スキーマを追加（インクルード）することができます。    
スキーマを外す理由は、テーブルにスキーマ(TRIGGER and FOREIGN KEY) がある場合、スキーマを除外しないと、データマイグレーションの処理スピードに影響する可能性があります。それだけでなく、マイグレーションタスクにスキーマロジックを理由にエラーが発生するリスクがあるためです。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922214343.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922214353.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922214402.png "img")    



②スキーマを一時的に除外します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922215411.png "img")    



## 5-8-2.マイグレーションプロジェクトを作成します      
１）ソースデータベースとターゲットデータベースでホワイトリストを追加します      
①ソースデータベースOracleのECSセキュリティグループにてDTSホワイトリストを追加します      
```whitelist
47.91.9.0/24,47.91.13.0/24,47.91.27.0/24,47.245.18.0/24,47.245.51.0/24,47.91.0.192/26,47.91.0.128/26,47.245.51.128/26,47.245.51.192/26,47.91.0.128/26,47.91.0.192/26,147.139.23.0/26,147.139.23.128/26,147.139.23.64/26,149.129.165.192/26
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922215428.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922215437.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922215447.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922215457.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922215510.png "img")    


2）Oracleのsqlnet.oraファイルを編集します      
下記の設定を追加し、設定後、Oracleを再起動します      
```
# cd /data/oracle/11gr2/network/admin/samples
# ls
# vim sqlnet.ora
    TCP.VALIDNODE_CHECKING=no
```
[reference link](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/52099.htm)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922215526.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922215534.png "img")    



3）ターゲットデータベースにDTSホワイトリストを追加します      
```whitelist
47.91.9.0/24,47.91.13.0/24,47.91.27.0/24,47.245.18.0/24,47.245.51.0/24,47.91.0.192/26,47.91.0.128/26,47.245.51.128/26,47.245.51.192/26,47.91.0.128/26,47.91.0.192/26,147.139.23.0/26,147.139.23.128/26,147.139.23.64/26,149.129.165.192/26
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922215546.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922215554.png "img")    




4）マイグレーションプロジェクトを作成します      
①マイグレーションプロジェクトを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220108.png "img")    



②DTSインスタンスを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220120.png "img")    


③マイグレーションタスクを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220129.png "img")    


④データ収集アカウントとSIDを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220139.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220146.png "img")    


⑤フルマイグレーションを選択し、マイグレーションテーブルを設定します      
ここでもしマイグレーションタスクが失敗したら、エラー詳細を確認し、必要に応じて修正対応しつつ再度マイグレーションを実行することができます       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220155.png "img")    


⑥今回のプロジェクトはDemoなので、TAB_ANYDATAはサポートしていないため、今回は除外します        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220204.png "img")    


⑦作成ボタンをクリックし、マイグレーションタスクを作成します       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220213.png "img")    



## 5-8-3.データマイグレーションを実行します      
①DTSコンソール画面でマイグレーションタスクを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220224.png "img")    


②タスクを開始します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220234.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220241.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220248.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220256.png "img")    


③次へをクリックすると、マイグレーションタスクを実行開始します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220310.png "img")    


④マイグレーションが無事成功したので確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220319.png "img")    


⑤マイグレーション詳細を確認します

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220329.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220336.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220342.png "img")    



## 5-8-4.スキーマを追加（インクルード）します      
①データマイグレーション実行完成したら、ADAMコンソール画面でスキーマを追加（インクルード）します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220353.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220401.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220408.png "img")    




## 5-8-5.マイグレーション後テーブルを検証します      
1）マイグレーションデータ一致するかをチェックします      
①ターゲットデータベースでデータを確認します      
ソースデータベーステーブル：

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220423.png "img")    


ターゲットデータベーステーブル：

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220432.png "img")    


②マイグレーションしたデータが一致するかをチェックします      
ソースデータテーブル、ターゲットデータテーブルとの比較方法は色々ありますが、そこはアプリケーションシナリオや普段のSQLクエリなどを使って確認します。    
或いは、Alibaba Cloud Ticket Center へチケットをあげて、サポートチームにデータが一致するかの確認を依頼することもできます。       
注意として、サポートチームでのチェックはIndexが張ってないテーブルだと最大で1000行までのチェックとなります。もし10000行を超えるとサポートチームのチェックシステム側によるチェックができなくなります。      

## 5-8-6.マイグレーション後ビューを検証します      
1）改修後のビューをチェックします      
①KANA_HIRAGANA_VIEWを確認します      
```
CREATE OR REPLACE VIEW NANCYTEST.KANA_HIRAGANA_VIEW(KANA_HIRAGANA_NAME) AS
SELECT
    nancytest.h2z_hana(name) AS kana_HIRAGANA_name
FROM
    ignore_case_products
where not regexp_like(name, '^[a-zA-Z0-9]'); 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220448.png "img")    


②Oracle Databaseにはあったregexp_likeがPolarDBには対応されていなかったので、合わせて改修します      
```
CREATE OR REPLACE VIEW NANCYTEST.KANA_HIRAGANA_VIEW(KANA_HIRAGANA_NAME) AS
SELECT
    nancytest.h2z_hana(name) AS kana_HIRAGANA_name
FROM
    ignore_case_products
where name not SIMILAR to '^[a-zA-Z0-9]';
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220501.png "img")    


```
SELECT * FROM NANCYTEST.KANA_HIRAGANA_VIEW;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220511.png "img")    




②KANA_FWKATAKANA_VIEWを確認します      
```
CREATE OR REPLACE VIEW NANCYTEST.KANA_FWKATAKANA_VIEW(KANA_FWKATAKANA_NAME) AS
SELECT
    nancytest.h2z_kana(name) AS kana_fwkatakana_name
FROM
    ignore_case_products
where name not SIMILAR to '^[a-zA-Z0-9]';

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220524.png "img")    


```
SELECT * FROM NANCYTEST.KANA_FWKATAKANA_VIEW;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220539.png "img")    


③num_en_name_viewを確認します      
```
SELECT * FROM num_en_name_view;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014224791/20210922220548.png "img")    


# 最後に

ここまでDTSによるOracle DatabaseからPolarDBへのデータマイグレーションが完了しました。Oracle Databaseにはあって、PolarDBにはない関数とかの改修対応もスムーズに対応できました。      
次はPart5 アプリケーションマイグレーションと改修に移りたいと思います。       

> http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_005_oracle-migration-part5



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>




