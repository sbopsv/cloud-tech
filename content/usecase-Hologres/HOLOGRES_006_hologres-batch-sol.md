---
title: "FCとAPIを使った開発方法"
metaTitle: "Hologresを使ったバッチ処理ソリューション開発方法"
metaDescription: "Hologresを使ったバッチ処理ソリューション開発方法"
date: "2021-09-06"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/Hologres_images_26006613793350600/20210902092627.png"
---

## Hologresを使ったバッチ処理ソリューション開発方法

本記事では、[Hologres](https://www.alibabacloud.com/product/hologres) を使ってFunctionComputeとAPI Gatewayによるバッチ処理サービス基盤を開発する方法をご紹介します。     

# Hologresとは

> <span style="color: #ff0000"><i>Hologres はリアルタイムのインタラクティブ分析サービスです。高い同時実行性と低いレイテンシーでTB、PBクラスのデータの移動や分析を短時間で処理できます。PostgreSQL11と互換性があり、データを多次元で分析し、ビジネスインサイトを素早くキャッチすることができます。</i></span>

少し前になりますが、Hologresについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-hologres

# Hologresを使ったバッチ処理ソリューション開発方法

このチュートリアルでは、Alibabaクラウド製品に基づいて、書籍の販売データ分析のための全体的なソリューションを作成します。
売上の日報をシステムから取得し、現在の週と前の週の間の異なる書籍に基づく総販売数と金額の違いを知りたいとします。この結果はAPIで簡単に取得することができます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210902092627.png "img")

またテーブル関係図は次の通りになります

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210910094123.png "img")

# このチュートリアルについて
## 対象者: 

本ガイドラインは、以下のような方を対象としています      
- Alibaba Cloud、MaxCompute、DataWorks、OSS（Object Storage Service）、HologresおよびFunction Computeに関する基本的な知識を有している    
- Function Computeがサポートする少なくとも1つのプログラム言語に精通している    
   
## 前提条件:
- Alibaba Cloud のアカウントを所持している    
- MaxCompute、DataWorks、OSS(Object Storage Service)、ApsaraDB for RDS、Hologres、Function Computeが使用可能な状態になっている       


# 準備作業   

## データファイルの作成    

まず、書籍の注文に関するテストデータを用意します。以下のPythonスクリプトを使用して、日付を基にしたcsvレポートファイルを生成します。     

```python
import csv
import random
import uuid

output_date = "20210712"
book_info = ["嫌われる勇気", "ノルウェイの森", "海辺のカフカ", "色彩を持たない多崎つくると彼の巡礼の年", "容疑者Ⅹの献身", "人間失格", "こころ", "天声人语", "幸せになる勇気"]
book_price = [500, 600, 700, 300, 200, 100, 350, 550, 650]
csv_writer = csv.writer(open("test_data_{0}.csv".format(output_date), "w+", newline='', encoding='UTF-8'))
for i in range(10000):
    book_id = random.randint(1, 9)
    order_count = random.randint(1, 5)
    row = [uuid.uuid1(), random.randint(1, 50), book_id, book_info[book_id-1], order_count,
           book_price[book_id-1] * order_count]  # order_id, user_id, book_id, book_name, order_count, order_amount
    csv_writer.writerow(row)
```

生成されるデータファイルには、以下のような `order_id, user_id, book_id, book_name, order_count, order_amount` の情報が含まれます。    

```csv
5761158b-f044-11eb-8be8-706655fcbfda,39,8,天声人语,1,550
57613ca0-f044-11eb-a396-706655fcbfda,46,8,天声人语,5,2750
57613ca1-f044-11eb-82e5-706655fcbfda,13,5,容疑者Ⅹの献身,1,200
57613ca2-f044-11eb-b395-706655fcbfda,35,5,容疑者Ⅹの献身,3,600
57613ca3-f044-11eb-a123-706655fcbfda,42,4,色彩を持たない多崎つくると彼の巡礼の年,1,300
57613ca4-f044-11eb-923c-706655fcbfda,18,8,天声人语,5,2750
......
```

## OSS(Object Storage Service)のバケットにデータファイルをアップロードします。

OSS(Object Storage Service)のバケットに、関連するcsvデータファイルをアップロードします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210902093129.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210902093142.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210902093151.png "img")


## DataWorksプロジェクトの準備

DataWorksコンソールで新規プロジェクトを作成し、全てのテーブルとジョブを管理します。対象となるプロジェクトは「basic mode」であることに注意してください。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103400.png "img")



# MaxComputeソーステーブルにデータをインポートするバッチ同期Nodeの作成

このセクションでは、OSS(Object Storage Service)バケット内のデータファイルからMaxComputeのソーステーブルに、日付をパーティションとして売上データをインポートします。    
[Data Integration](https://www.alibabacloud.com/cloud-tech/doc-detail/137663.htm) は、安定した、効率的な、そしてスケーラブルなデータ同期サービスです。    
DI(Data Integration)ジョブを作成する前に、関連するデータソースと接続情報を設定する必要があります。     

データ統合管理ページに入り、「接続」リンクをクリックしてデータソース管理ページに移動します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103504.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103516.png "img")

MaxComputeのデータソースは、`odps_first`として自動生成され、DI(Data Integration)のジョブ設定で直接使用することができます。    
new data sourceボタンをクリックして、ウィザードに従ってOSS(Object Storage Service)データソースを追加します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103531.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103539.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103550.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103559.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103608.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103616.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103626.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103635.png "img")

プロジェクトのData Studioにアクセスし、新しいbusiness flowを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103702.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103710.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906103719.png "img")

データファイルからのデータに基づいて、MaxComputeソーステーブルを作成します。ウィザードの「DDLステートメント」モードで以下のSQLステートメントを直接使用してフィールド情報を生成することができます。



```sql
CREATE TABLE IF NOT EXISTS book_order_src
(
    order_id     STRING COMMENT 'Generated order ID',
    user_id      BIGINT COMMENT 'User ID',
    book_id      BIGINT COMMENT 'One of 9 books',
    book_name    STRING COMMENT 'One of 9 book names',
    order_count  BIGINT COMMENT 'How many',
    order_amount BIGINT COMMENT 'How much'
) 
PARTITIONED BY
(
    output_date  STRING
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906125713.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906125721.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906125730.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906125738.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906125747.png "img")


DI(Data Integration)ジョブ用に、上記business flowの下にバッチ同期Nodeを作成します。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906125807.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906125817.png "img")


列のマッピングを自動的に生成するには、ウィザードでデータソースを更新し、「オブジェクト名」を特定のデータファイルに設定してから、プレビューボタンをクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906125912.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906125921.png "img")

[スケジューリングパラメータ](https://www.alibabacloud.com/cloud-tech/doc-detail/137548.htm) で、データファイル名やテーブルのパーティションを設定します。    
通常は、`bizdate`を直接使用しますが、営業日がスケジューリング日と異なる場合は、式を使って定義することができます。例えば、`${yyyymmdd-3}`は、スケジューリング日と営業日の差が3日であることを意味します。このスケジューリングパラメータは、あなたの状況に応じて更新することができます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906125943.png "img")

DI(Data Integration)ジョブを毎日実行するように、Config schedule 設定を行います。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134023.png "img")

business flow全体でこのタスクが最初に実行されるべきであるため、親Nodeをroot Nodeとして設定します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134458.png "img")

`Resource group` を `public resource group` としても設定します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134558.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134608.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134618.png "img")


Task Nodeのすべての設定を保存します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134700.png "img")

選択された日付のデータは、MaxComputeソーステーブルに保存されることに注意してください。同じ日に複数回実行した場合、重複するレコードがあるかもしれませんが、これは前に設定した「書き込みルール」に依存します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134722.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134730.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134740.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134750.png "img")

ここまでで、OSS(Object Storage Service)のバケットから毎日データファイルをインポートするDI(Data Integration)のスケジュールジョブを作成しました。    


# ODPS SQL Nodeを作成して、毎日データ統計を実行   

MaxComputeのソーステーブルでは、すべてのBookオーダー情報を日付ごとにチェックすることができます。この統計データは次のステップで使用されます。     
新しい MaxCompute テーブルを作成して、毎日の統計結果を保存します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906134953.png "img")

先ほどと同様に以下のSQL文でテーブルスキーマを生成し、テーブルを本番環境にコミットします。     

```sql
CREATE TABLE IF NOT EXISTS book_order_daily
(
    output_date  STRING COMMENT 'Order output date',
    book_id      BIGINT COMMENT 'One of 9 books',
    book_name    STRING COMMENT 'One of 9 book names',
    order_count  BIGINT COMMENT 'How many - total daily',
    order_amount BIGINT COMMENT 'How much - total daily'
) ;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906135019.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906135029.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906135104.png "img")

日次統計ロジック用のODPS SQL Nodeを新規に作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906135121.png "img")

営業日を定義するために使用されるスケジューリングパラメータを持つ関連SQLステートメントを準備します。同時にスケジューリング設定を日ごとに設定をします。     


```sql
INSERT INTO book_order_daily
SELECT  ${tmp} AS output_date
        ,book_id
        ,book_name
        ,SUM(order_count) AS order_count
        ,SUM(order_amount) AS order_amount
FROM    book_order_src
WHERE   output_date = ${tmp}
GROUP BY book_id
         ,book_name
;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140741.png "img")


画像のように[線を引く（Drag＆Drop）](https://www.alibabacloud.com/cloud-tech/doc-detail/151507.htm#title-xv6-psf-5zi)ことで、ことで依存関係を更新します。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140759.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140809.png "img")

また、選択した日付の日次統計タスクをテストすることもできます。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140826.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140836.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140846.png "img")



# 日々のジョブをオペレーションセンターにコミットする

[job nodeをコミットすることで、関連するタスクをオペレーション・センターに展開](https://www.alibabacloud.com/cloud-tech/doc-detail/92402.htm#title-fgd-yis-1kq)することができます。      

> https://www.alibabacloud.com/cloud-tech/doc-detail/92402.htm#title-fgd-yis-1kq

business flow nodeに移動し、コミット・ボタンをクリックして、前のステップで準備したすべてのDaily job nodeを選択し、すべてコミットします。    
    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140903.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140913.png "img")

オペレーションセンターのサイクルタスクのページにアクセスすると、そこに新しく投入されたジョブが表示されます。スケジュールされたタスクがT+1日後にトリガーされると、関連するサイクルインスタンスが生成されます。これらのインスタンスの実行中のログは、Data Studioで行うのと同様に、`logview`リンクから確認できます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140934.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140942.png "img")


07/19にサイクルタスクをコミットしたと仮定して、`Start Instantiation`を翌日に設定すると、システムは07/19のデータファイルを持つタスクを07/20に最初に実行します。つまり、07/19以前に生成されたデータファイルにはアクセスできないということです。     
このような場合には、オペレーションセンターの`patch data`機能を使って、[遡及データを作成](https://www.alibabacloud.com/cloud-tech/doc-detail/137937.htm#title-6t7-9o8-dr2)す ることで、これらのデータファイルに対応することができます。     　　
ここでは、07/12～07/18のデータファイルに対するパッチデータ機能の操作手順を説明します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906140956.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141006.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141016.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141025.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141034.png "img")

パッチデータインスタンスの助けを借りて、選択された日付のソースデータがMaxComputeソーステーブルにインポートされます。インスタンスが正常に終了した後、MaxComputeソーステーブルのデータとパーティション情報を確認できます。

```sql
SHOW PARTITIONS book_order_src;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141050.png "img")


# ODPS SQLノードを作成してデータの統計を毎週行う

これで、DI(Data Integration)ジョブのbookオーダーソースデータと、ODPS SQLジョブの日次統計データが揃いました。APIでは週ごとの差分を表示しますので、差分を計算するためには週ごとのデータ統計を行う必要があります。    
統計結果は `book_order_weekly` という名前の新しいテーブルに保存されます。    

統計結果用に新しいMaxComputeテーブルを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141105.png "img")

以下は、Statistics weekly テーブルのテーブルスキーマに対する DDL 文です。    


```sql
CREATE TABLE IF NOT EXISTS book_order_weekly
(
    date_start        STRING COMMENT 'Order output date start',
    date_end          STRING COMMENT 'Order output date end',
    book_id           BIGINT COMMENT 'One of 9 books',
    book_name         STRING COMMENT 'One of 9 book names',
    order_count_diff  BIGINT COMMENT 'How many - total weekly difference',
    cur_order_count   BIGINT COMMENT 'How many- current week',
    pre_order_count   BIGINT COMMENT 'How many - previous week',
    order_amount_diff BIGINT COMMENT 'How much - total weekly difference',
    cur_order_amount  BIGINT COMMENT 'How much - current week',
    pre_order_amount  BIGINT COMMENT 'How much - previous week'
) ;
```


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141128.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141137.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141145.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141153.png "img")


週間統計ロジック用のODPS SQLノードを新規作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141209.png "img")


[ビルトイン日付関数（built-in date function）](https://www.alibabacloud.com/cloud-tech/doc-detail/48974.htm)と、営業日を定義するために使用されるスケジューリングパラメータを使用して、関連するSQLステートメントを準備します。     


```sql
WITH
        tmp_date AS (SELECT TO_DATE(${tmp},'yyyymmdd') AS tmp_date) ,
        date_info AS (SELECT
                              DATEADD(t1.tmp_date,-13,'dd') AS pre_start
                              ,DATEADD(t1.tmp_date,-7,'dd') AS pre_end
                              ,DATEADD(t1.tmp_date,-6,'dd') AS cur_start
                              ,t1.tmp_date AS cur_end
                      FROM    tmp_date t1),
        pre_info AS (SELECT  book_id
                             ,book_name
                             ,IF(SUM(t.order_count) IS NULL,0,SUM(t.order_count)) AS order_count
                             ,IF(SUM(t.order_amount) IS NULL,0,SUM(t.order_amount)) AS order_amount
                     FROM    book_order_daily t
                     WHERE   TO_DATE(t.output_date,'yyyymmdd') BETWEEN (
                                                                       SELECT  pre_start
                                                                       FROM    date_info
                                                                       ) AND (
                                                                             SELECT  pre_end
                                                                             FROM    date_info
                                                                             )
                    GROUP by book_id, book_name),
        cur_info AS (SELECT  book_id
                             ,book_name
                             ,IF(SUM(t.order_count) IS NULL,0,SUM(t.order_count)) AS order_count
                             ,IF(sum(t.order_amount) IS NULL,0,SUM(t.order_amount)) AS order_amount
                     FROM    book_order_daily t
                     WHERE   TO_DATE(t.output_date,'yyyymmdd') BETWEEN (
                                                                       SELECT  cur_start
                                                                       FROM    date_info
                                                                       ) AND (
                                                                             SELECT  cur_end
                                                                             FROM    date_info
                                                                             )
                    GROUP BY book_id, book_name)

INSERT INTO book_order_weekly  
SELECT
        (
        SELECT  to_char(cur_start,'yyyymmdd')
        FROM    date_info
        ) AS date_start
        ,${tmp} AS date_end
        ,c.book_id
        ,c.book_name
        ,c.order_count - P.order_count AS order_count_diff
        ,c.order_count AS cur_order_count
        ,P.order_count AS pre_order_count
        ,c.order_amount - P.order_amount AS order_amount_diff
        ,c.order_amount AS cur_order_amount
        ,P.order_amount AS pre_order_amount
FROM    pre_info P
JOIN    cur_info c
ON      P.book_id = c.book_id
AND     P.book_name = c.book_name
ORDER BY c.book_id
;
```

スケジューリングパラメータとスケジュール設定を週単位で設定。ノードの依存関係も同時に設定します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141224.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141233.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141244.png "img")


# 毎週のジョブをオペレーションセンターにコミットする

先ほどと同様に、週次の統計ジョブをオペレーションセンターにコミットします。ウィークリー統計ジョブはデイリー統計の結果に基づいて動作するため、デイリー統計ジョブの後に実行されます。      
スケジュール設定に基づき、毎週月曜日に実行されます。コミットする前に、ビジネスロジックに基づいて関連情報を更新する必要があります。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141302.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141310.png "img")


オペレーションセンターで週次統計のサイクルタスクを確認します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141422.png "img")


# 毎週の統計結果を表示するAPIを用意する

DataWorksプラットフォームの[Data Service](https://www.alibabacloud.com/cloud-tech/doc-detail/73263.htm)では、APIの作成・登録が可能です。    
しかし、DataService StudioはMaxComputeに直接接続することはできません。Hologres接続を作成し、Hologresのアクセラレートクエリ機能を利用することで、DataService StudioからMaxComputeのデータを照会することができます。   
Hologres は Data Service の [サポートされている接続リスト](https://www.alibabacloud.com/cloud-tech/doc-detail/73271.htm#h2-url-2)に含まれていますが、日本地域では十分に統合されていません。（2021年9月にリリース予定、そろそろな気がします）   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906141636.png "img")


このような場合には、2つの選択肢があります。
‐ DataWorks Data Service夜ソリューション     
  - 新しいDI(Data Integration)ジョブを追加して、毎週の統計結果をRDS MySQLに同期させる    
  - RDS MySQLをベースにデータサービスが構築した関連APIを利用する    
- FC(Function Compute)によるソリューション       
  - Hologresの外部テーブルを使用して、MaxComputeの週次統計テーブルにアクセス     
  - FC(Function Compute)で、クエリパラメータに基づいてデータを照会する関数を作成     
  - API Gatewayに手動でAPIを登録し、FC(Function Compute)の機能をバックエンドサーバとして使用する    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143804.png "img")


# DataWorks Data Serviceによるソリューション    

ここでは、DataWorks Data Serviceによるソリューションの手順を説明します。まずは同じ地域の RDS MySQL インスタンスを用意します。     
その後、MaxCompute Weekly Statistics Table と同じスキーマのユーザー、データベース、テーブルを RDS MySQL インスタンスに作成します。    
RDS MySQLのテーブル構造は以下を参考にしてください。       


```sql
-- ----------------------------
-- Table structure for book_order_weekly
-- ----------------------------
DROP TABLE IF EXISTS `book_order_weekly`;
CREATE TABLE `book_order_weekly`  (
  `date_start` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `date_end` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `book_id` bigint(20) NULL DEFAULT NULL,
  `book_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `order_count_diff` bigint(20) NULL DEFAULT NULL,
  `cur_order_count` bigint(20) NULL DEFAULT NULL,
  `pre_order_count` bigint(20) NULL DEFAULT NULL,
  `order_amount_diff` bigint(20) NULL DEFAULT NULL,
  `cur_order_amount` bigint(20) NULL DEFAULT NULL,
  `pre_order_amount` bigint(20) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
```



### RDS MySQLにデータを同期する新しいバッチ同期ノードの作成

DataWorks DI(Data Integration)のデータソース管理ページに戻り、ウィザードで新しいRDS MySQLデータソースを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143821.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143830.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143838.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143846.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143855.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143903.png "img")



既存のMaxCompute週間統計テーブルには、過去のすべての統計結果が含まれています。これをMySQLに同期すると、結果が重複してしまいます。そのため、DI(Data Integration)ジョブのために、weekly statisticsテーブルと同じテーブルスキーマを持つ別のMaxComputeを作成する必要があります。      
`CREATE TABLE <table1> LIKE <table2>`  ステートメントを使うか、以前のようにテーブル作成ウィザードを使ってこれを処理することができます。Data Studioに戻って、関連する操作を行います。       


```sql
CREATE TABLE sfa_statistics_weekly_results LIKE sfa_statistics_weekly;
```

```sql
CREATE TABLE IF NOT EXISTS book_order_weekly_result
(
    date_start        STRING COMMENT 'Order output date start',
    date_end          STRING COMMENT 'Order output date end',
    book_id           BIGINT COMMENT 'One of 9 books',
    book_name         STRING COMMENT 'One of 9 book names',
    order_count_diff  BIGINT COMMENT 'How many - total weekly difference',
    cur_order_count   BIGINT COMMENT 'How many- current week',
    pre_order_count   BIGINT COMMENT 'How many - previous week',
    order_amount_diff BIGINT COMMENT 'How much - total weekly difference',
    cur_order_amount  BIGINT COMMENT 'How much - current week',
    pre_order_amount  BIGINT COMMENT 'How much - previous week'
) ;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143922.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143930.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143940.png "img")

ODPS weekly statistics SQL nodeに以下のステートメントを追加する。これにより同期テーブルがクリーンになり、最新の統計結果が挿入されます。     

```sql
-- Clean up results table
TRUNCATE TABLE book_order_weekly_result
;
-- Copy new statistics data into results table
INSERT INTO book_order_weekly_result
SELECT  *
FROM    book_order_weekly
WHERE   date_end = ${tmp}
;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906143955.png "img")

新しいバッチ同期ノードを作成し、毎週の統計データをMySQLに同期させます。バッチ同期ノードにODPSとMySQLのデータソースを設定します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144013.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144024.png "img")

` resource group` を `public resource group` として設定します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144459.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144508.png "img")

同期ジョブは毎週の統計結果に基づいて実行されるので、親ノードを週間統計SQLノードに設定し、スケジュール設定も週間にします。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144522.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144531.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144539.png "img")



### オペレーションセンターへの関連ノードのコミット

更新された週次統計SQLノードと新しい週次同期ノードを含むBusiness Flowをコミットします。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144557.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144609.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144619.png "img")

オペレーションセンターの `patch data`機能を使って、[遡及データを作成](https://www.alibabacloud.com/cloud-tech/doc-detail/137937.htm#title-6t7-9o8-dr2) を行います。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144634.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144650.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144704.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144719.png "img")


### データサービスでのAPIの生成と公開

API GatewayコンソールでAPIグループを作成します。   


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144736.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144743.png "img")


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144754.png "img")

リンクをクリックすると、DataWorks Data Service studioに移動されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144827.png "img")

作成したAPIグループで新しいビジネスプロセスを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144839.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906144847.png "img")

`Script Mode` で [API生成（Generate API）](https://www.alibabacloud.com/cloud-tech/doc-detail/73279.htm) を実行し、データソースとクエリステートメントを更新します。   


```sql
SELECT  date_start
        ,date_end
        ,book_id
        ,book_name
        ,order_count_diff
        ,cur_order_count
        ,pre_order_count
        ,order_amount_diff
        ,cur_order_amount
        ,pre_order_amount
FROM    book_order_weekly
WHERE   ${tmp_date} >= date_start
and     ${tmp_date} <= date_end
;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906145827.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906145836.png "img")

生成されたリクエストパラメータの設定を確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906145846.png "img")

Test linkをクリックして、APIをテストします。query parameterを入力し、レスポンスの結果を確認します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906145900.png "img")

Publishリンクをクリックして、APIを公開します。　    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906145910.png "img")

公開されたAPIの管理、APIの統計情報や認証情報の確認は、サービス管理セクションで行うことができます。また、テスト用APIも用意されています。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906145925.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906145934.png "img")


これでDataWorks Data Serviceよるソリューションとしての構築が完成しました。


## FC(Function Compute)によるソリューション        

ここでは、FC(Function Compute)ソリューションの手順を説明します。同じリージョンで Hologres インスタンスが稼働していることを確認してください。

### Hologres の外部テーブルを作成します。    
対象となるインスタンスのHoloWebにアクセスします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906145952.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150011.png "img")


新しいデータベースと外部テーブルを作成します。テーブルスキーマは、選択されたMaxComputeテーブルに基づいて自動的に生成されます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150023.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150031.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150039.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150048.png "img")

HoloWebでクエリ結果を確認します。           

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150100.png "img")


### FC(Function Compute)のサービスと関数の作成

FC(Function Compute)コンソールで新しいサービスを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150111.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150118.png "img")

FC(Function Compute)でサポートされているプログラム言語であれば、バックエンドサーバを構築することができます。サンプルとしてPythonとFuncraft(https://www.alibabacloud.com/cloud-tech/doc-detail/140283.htm)を使用しています。     
[Funcraft](https://www.alibabacloud.com/cloud-tech/doc-detail/161136.htm)をインストールして、以下の4つのファイルを新しいフォルダに用意します。      

`.env` ファイルは、Funcraft の設定に使用します。関連情報は各自で更新してください。     

```yml
ACCOUNT_ID=xxxxxxxx
REGION=cn-shanghai
ACCESS_KEY_ID=xxxxxxxxxxxx
ACCESS_KEY_SECRET=xxxxxxxxxx
FC_ENDPOINT=https://{accountid}.{region}.fc.aliyuncs.com
TIMEOUT=10
RETRIES=3
```

`Funfile` ファイルにはPythonの実行環境が記述されています。今回はHologresインスタンスを接続するので、configsに`psycopg2`を追加します。      

```
RUNTIME python3
RUN fun-install pip install psycopg2
```

`template.yml` は、FC(Function Compute)のデプロイ情報を定義しています。このファイルの中身として、この関数は、`book_demo_service`というサービスの下に、`book_demo_fc_py`というHTTP関数としてデプロイされます。詳しくは[template.yml introduction](https://github.com/alibaba/funcraft/blob/master/docs/specs/2018-04-03.md) をご覧ください。


```yml
ROSTemplateFormatVersion: '2015-09-01'
Transform: 'Aliyun::Serverless-2018-04-03'
Resources:
  book_demo_service:  
    Type: 'Aliyun::Serverless::Service' 
    book_demo_fc_py:    
      Type: 'Aliyun::Serverless::Function'   
      Properties:     
        Handler: index.handler     
        Runtime: python3     
        CodeUri: './'
      Events:
        http-test:
          Type: HTTP
          Properties:
            AuthType: FUNCTION
            Methods: ['GET', 'POST']
```

`index.py` は対象となる関数のソースコードです。より詳しい情報は、[Python HTTP Function](https://www.alibabacloud.com/cloud-tech/doc-detail/74756.htm)を参照してください。なお使う前に、Hologresの接続情報を更新してください。     

```py
import decimal
import json
import logging
import psycopg2


def handler(environ, start_response):
    logger = logging.getLogger() 
    # Connect to the database
    connection = psycopg2.connect(host="<your instance host>", port=80,
                                  dbname="<your db name>", user="<your access key id>",
                                  password="<your access key secret>")
    tmp_date = environ['QUERY_STRING'].replace("tmpdate=", "")
    logger.info(tmp_date)
    cur = connection.cursor()
    cur.execute(
        """
        SELECT  date_start
                ,date_end
                ,book_id
                ,book_name
                ,order_count_diff
                ,cur_order_count
                ,pre_order_count
                ,order_amount_diff
                ,cur_order_amount
                ,pre_order_amount
        FROM    book_order_weekly
        WHERE   '{0}' >= date_start
        AND     '{0}' <= date_end
        """.format(tmp_date))
    row_headers = [x[0] for x in cur.description]  # this will extract row headers
    logger.info(row_headers)
    rv = cur.fetchall()
    json_data = []
    for result in rv:
        json_data.append(dict(zip(row_headers, result)))
    
    logger.info(json_data)
    cur.close()
    connection.close()
    status = '200 OK'    
    response_headers = [('Content-type', 'text/plain')]    
    start_response(status, response_headers)
    tmp_response = json.dumps(json_data)
    logger.info(tmp_response)
    return [tmp_response.encode('utf-8') ]
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150141.png "img")


関数のルートディレクトリで `fun install` を実行して、依存関係をインストールします。    
docker serviceがインストールされ、正常に動作していることを確認します。    
なお、インストールにはマルチステージビルドを使用しているため、dockerのバージョンは17.05以降である必要があります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150155.png "img")


FunCraftを使って、`fun deploy -y`というコマンドで機能をデプロイします。      
処理中に「インスタンスメトリクスを有効にするには、プロジェクトとログストアの両方が必要です」というエラーメッセージが表示された場合は、サービス設定で「Request-level Metrics」と「Instance Metrics」を無効にする必要があります。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150207.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150215.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150222.png "img")

Query parameter `tmpdate` を使って関数テストをします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150234.png "img")


### API Gatewayコンソールで新しいAPIを作成
上記、DataWorksのData Serviceによるソリューション で作成したAPIグループを再利用することができます。上記のを[FC(Function Compute)内の関数をバックエンドサービスとして使用](https://www.alibabacloud.com/cloud-tech/doc-detail/54788.htm)を使用し、FC(Function Compute) コンソールのHTTPトリガー情報でバックエンドサービスのトリガーパスを記入します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906150253.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152358.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152406.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152421.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152431.png "img")

新たに作成したAPIをテスト公開し、テストを行います。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152443.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152452.png "img")

APIを呼び出すための新しいAPPを作成します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152505.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152514.png "img")

テスト段階のAPIで新規に作成したAPPを認証します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152527.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152537.png "img")

作成したAPPでテスト段階のAPIをデバッグします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152554.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152602.png "img")


これでHologres-FC-APIGatewayのソリューションが完成しました。     


# API Gateway SDKによるAPIへのアクセス

APIは、Data ServiceソリューションやFC(Function Compute)ソリューションで生成されたものであっても、API Gatewayコンソールで確認することができ、[API Gateway SDKでアクセス](https://www.alibabacloud.com/cloud-tech/doc-detail/185548.htm)することができます。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/185548.htm

ここでは、FC(Function Compute)によるソリューションで作成したAPIを例にとります。     
そのAPIを「リリース」の段階で公開し、作成したAPPで認証処理を行います。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152618.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152626.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152635.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152643.png "img")

生成されたJAVA SDKをダウンロードし、パッケージ内のmdファイルに基づいて設定を行います。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152656.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152705.png "img")


Demo*.java`のAppKeyとAppSecretを以下のように更新します。     

```java
......
    static{
        //HTTP Client init
        HttpClientBuilderParams httpParam = new HttpClientBuilderParams();
        httpParam.setAppKey("<your AppKey>");
        httpParam.setAppSecret("<your AppSecret>");
        HttpApiClientbook_demo_group.getInstance().init(httpParam);


        //HTTPS Client init
        HttpClientBuilderParams httpsParam = new HttpClientBuilderParams();
        httpsParam.setAppKey("<your AppKey>");
        httpsParam.setAppSecret("<your AppSecret>");

        /**
        * HTTPS request use DO_NOT_VERIFY mode only for demo
        * Suggest verify for security
        */
        //httpsParam.setRegistry(getNoVerifyRegistry());

        HttpsApiClientbook_demo_group.getInstance().init(httpsParam);


    }
......
```

Demo*.java`で、すべてのテストパラメータを「default」から意味のある値に更新します。     

```java
......
    public static void book_order_weekly_diffHttpTest(){
        // HttpApiClientbook_demo_group.getInstance().book_order_weekly_diff("default" , new ApiCallback() {
        HttpsApiClientbook_demo_group.getInstance().book_order_weekly_diff("20210720" , new ApiCallback() {
            @Override
            public void onFailure(ApiRequest request, Exception e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(ApiRequest request, ApiResponse response) {
                try {
                    System.out.println(getResultString(response));
                }catch (Exception ex){
                    ex.printStackTrace();
                }
            }
        });
    }
......
```

次に、APIをテストするための新しいJavaクラスを作成します。     


```java
public class App {

    public static void main(String[] args) {
        Demobook_demo_group.book_order_weekly_diffHttpTest();
    }
}
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210906152718.png "img")


# 最後に
ここまで、Hologres、FunctionCompute、APIGatewayを使ってHologreを使ったバッチ処理ソリューションを開発する方法を紹介しました。    
この方法を生かすことで、HologresをDWHとしながらAPIサービス展開をすることができます。     





