---
title: "AWS S3からHologres連携"
metaTitle: "AWS S3からHologresへリアルタイムデータ連携方法（Embulk使用）"
metaDescription: "AWS S3からHologresへリアルタイムデータ連携方法（Embulk使用）"
date: "2021-09-08"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/Hologres_images_13574176438009000000/20210907162529.png"
---

## AWS S3からHologresへリアルタイムデータ連携方法（Embulk使用）

本記事では、Embulkを使ってAWS S3からHologresへリアルタイムデータ連携する方法をご紹介します。               


# Hologresとは

> <span style="color: #ff0000"><i>Hologres はリアルタイムのインタラクティブ分析サービスです。高い同時実行性と低いレイテンシーでTB、PBクラスのデータの移動や分析を短時間で処理できます。PostgreSQL11と互換性があり、データを多次元で分析し、ビジネスインサイトを素早くキャッチすることができます。</i></span>

少し前になりますが、Hologresについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-hologres


# AWS S3とは
AWS（Amazon Web Services）のデータを格納・管理できるオブジェクトストレージサービスです。     

> https://aws.amazon.com/jp/s3/


# AWS S3からAlibaba Cloud Hologresへデータ連携について     
このガイドラインでは、Alibaba Cloud ECS(Elastic Compute Service) サーバー上のEmbulkを使って、AWS S3からAlibaba Cloud Hologresへデータ連携する方法を順を追って説明します。     
ソースデータファイルは、AWS S3のバケットに平文モードとサーバーサイド暗号化モードの両方で保存されています。データの暗号化には、[AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html)(Key Management Service)を使用します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210907162529.png "img")

# Embulkとは
[Embulk](https://www.embulk.org/)は、バルクデータローダです。データベース、ストレージ、ファイルフォーマット、クラウドサービスなど、さまざまな種類の間でのデータ転送をサポートします。　　　
これがあれば、例えばAWS S3 - GCP BigQueryや、Azure Blob Storage - Alibaba Cloud PolarDB といったソリューションを構築することもできます。yaml形式の設定ファイルを用意するだけで、学習コストは不要です。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154603.png "img")

> https://www.embulk.org/


# このチュートリアルについて
## 対象者: 

本ガイドラインは、以下のような方を対象としています      
- Alibaba Cloud、ECS(Elastic Compute Service)、Hologres、AWS(Amazon Web Services)、Amazon S3(Simple Storage Service)、Amazon KMS(Key Management Service) 、Embulkに関する基本的な知識を持っている       
   
## 前提条件:
- Alibaba Cloud のアカウントを所持している    
- HologresとECS(Elastic Compute Service)が使用可能な状態になっている       
- 使用するHologres、ECS(Elastic Compute Service)は同一Region配下にある      
- AWS（Amazon Web Services）のアカウントを持っている
- AWS(Amazon Web Services)でAmazon S3(Simple Storage Service)とAmazon KMS(Key Management Service)を有効にしている


# Embulk作業環境の準備
ECS(Elastic Compute Service)サーバーをEmbulk作業環境に用意します。イントラネット接続を使用するために、対象となるサーバーがHologresインスタンスと同じリージョンにあることを確認します。ここではCentOSを例にしています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153139.png "img")

EmbulkはJava 8環境を必要とするため、まずECS(Elastic Compute Service)サーバーにログインし、Java 8の実行環境をインストールします。

 ```shell
 $ yum -y install java-1.8.0-openjdk.x86_64
 ```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153153.png "img")

以下のコマンドでEmbulkをインストールします。詳細については、[Embulk Quick Start](https://www.embulk.org/) を参照してください。

```shell
$ curl --create-dirs -o ~/.embulk/bin/embulk -L "https://dl.embulk.org/embulk-latest.jar"
$ chmod +x ~/.embulk/bin/embulk
$ echo 'export PATH="$HOME/.embulk/bin:$PATH"' >> ~/.bashrc
$ source ~/.bashrc
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153209.png "img")

Embulkは、データの入出力のための多くの[プラグイン](https://plugins.embulk.org/)をサポートしています。以下の手順では、AWS S3からAlibaba Cloud Hologresにデータを転送するので、[S3 input plugin](https://github.com/embulk/embulk-input-s3) と [PostgreSQL output plugin](https://github.com/embulk/embulk-output-jdbc) が必要になります。      
まずは`gem`コマンドで関連プラグインをインストールします。     

```shell
$ embulk gem install embulk-input-s3
$ embulk gem install embulk-output-postgresql
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153224.png "img")

# Hologresテーブルの準備

既存のHologresインスタンスに、関連データを格納するためのテーブルを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153237.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153248.png "img")

以下は生成されたDDL文です。

```sql
BEGIN;
CREATE TABLE public.book_order (
 "order_id" text NOT NULL,
 "user_id" int8 NOT NULL,
 "book_id" int8 NOT NULL,
 "book_name" text NOT NULL,
 "order_cnt" int8 NOT NULL,
 "order_amt" int8 NOT NULL,
PRIMARY KEY (order_id)
);
CALL SET_TABLE_PROPERTY('public.book_order', 'orientation', 'column');
CALL SET_TABLE_PROPERTY('public.book_order', 'bitmap_columns', 'order_id,book_name');
CALL SET_TABLE_PROPERTY('public.book_order', 'dictionary_encoding_columns', 'order_id:auto,book_name:auto');
CALL SET_TABLE_PROPERTY('public.book_order', 'time_to_live_in_seconds', '3153600000');
CALL SET_TABLE_PROPERTY('public.book_order', 'distribution_key', 'order_id');
CALL SET_TABLE_PROPERTY('public.book_order', 'storage_format', 'orc');
COMMIT;
```

# AWS S3バケットでのデータ準備

AWS S3のバケットをサーバー側で暗号化せず、公開で作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153305.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153314.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153325.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153334.png "img")

## ソースデータファイルの生成

上記のHologresテーブルのテーブルスキーマに基づいて、以下のスクリプトで関連するデータファイルを生成してテストすることができます。    


```python
import csv
import random
import uuid

output_date = "20210712"
book_info = ["嫌われる勇気", "ノルウェイの森", "海辺のカフカ", "色彩を持たない多崎つくると彼の巡礼の年",
             "容疑者Ⅹの献身", "人間失格", "こころ", "天声人语", "幸せになる勇気"]
book_price = [500, 600, 700, 300, 200, 100, 350, 550, 650]
csv_writer = csv.writer(open("test_data_{0}.csv".format(output_date), "w+", newline='', encoding='UTF-8'))
for i in range(10000):
    book_id = random.randint(1, 9)
    order_count = random.randint(1, 5)
    row = [uuid.uuid1(), random.randint(1, 50), book_id, book_info[book_id-1], order_count,
           book_price[book_id-1] * order_count]  # order_id, user_id, book_id, book_name, order_count, order_amount
    csv_writer.writerow(row)
```

今回使用する、csv形式のデータサンプルは次の通りです。     

```csv
order_id,user_id,book_id,book_name,order_cnt,order_amt
5761158b-f044-11eb-8be8-706655fcbfda,39,8,天声人语,1,550
57613ca0-f044-11eb-a396-706655fcbfda,46,8,天声人语,5,2750
57613ca1-f044-11eb-82e5-706655fcbfda,13,5,容疑者Ⅹの献身,1,200
57613ca2-f044-11eb-b395-706655fcbfda,35,5,容疑者Ⅹの献身,3,600
57613ca3-f044-11eb-a123-706655fcbfda,42,4,色彩を持たない多崎つくると彼の巡礼の年,1,300
57613ca4-f044-11eb-923c-706655fcbfda,18,8,天声人语,5,2750
57613ca5-f044-11eb-a533-706655fcbfda,29,9,幸せになる勇気,3,1950
57613ca6-f044-11eb-9ca4-706655fcbfda,35,7,こころ,3,1050
57613ca7-f044-11eb-bd76-706655fcbfda,25,1,嫌われる勇気,1,500
......
```

## ソースデータファイルをplaintext形式でアップロード
対象となるデータファイルをplaintext形式で保存するために、`original-data`という新しいフォルダを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153355.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153404.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153413.png "img")

生成されたデータファイルをアップロードする際には、propertiesセクションのserver-side encryptionオプションが無効になっていることを確認してください。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153430.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153438.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153447.png "img")

アップロードされたソースデータファイルを`original-data`フォルダ内で確認します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153500.png "img")

## Amazon KMS(Key Management Service)で新しい共通鍵を作成
Amazon KMS(Key Management Service)のコンソールにアクセスし、鍵を新規に作成します。生成された鍵は、S3(Simple Storage Service)バケットのデータ暗号化・復号化処理に使用されます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153516.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153524.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153534.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153544.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153554.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153603.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153620.png "img")


## サーバーサイド側の暗号化モードで元データファイルをアップロード

サーバーサイド側の暗号化モードで対象のデータファイルを格納するために、`encryption-data`という名前のフォルダを新規に作成します。サーバーサイド暗号化を有効にすると、新しく作成したフォルダオブジェクトが暗号化されるだけですので注意する必要があります。この設定は、その中に含まれるオブジェクトによって受け入れられる `NOT` です。        
つまり、フォルダにサーバー側の暗号化が設定されているかどうかにかかわらず、アップロードするデータファイルでサーバー側の暗号化を行う場合は、データファイル自体に関連する構成を設定する必要があります。      
暗号化なしのフォルダを設定し、アップロードするデータファイルの暗号化設定のみを有効にします。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153636.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153644.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153653.png "img")

生成されたデータファイルをアップロードする場合は、プロパティセクションのサーバー側の暗号化オプションが有効になっていることを確認してください。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153707.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153716.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153727.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153736.png "img")

encryption-data`フォルダにアップロードされたソースデータファイルを確認します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153811.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153819.png "img")


# Embulkを使ったplaintext 形式でのデータ転送

ECS サーバ上に新規フォルダを作成し、Embulkの初期設定ファイルを以下のように配置します。       
データ出力モードについては、[README for PostgreSQL Output Plugin](https://github.com/embulk/embulk-output-jdbc/tree/master/embulk-output-postgresql) をご参照ください。     
`min_output_tasks` は、ページスキャッタリングを有効にするための最小出力タスク数を定義します。詳しくは、[Embulk Local Executor Plugin](https://www.embulk.org/docs/built-in.html#local-executor-plugin)を参照してください。     

> https://github.com/embulk/embulk-output-jdbc/tree/master/embulk-output-postgresql

> https://www.embulk.org/docs/built-in.html#local-executor-plugin


```yaml
in:
  type: s3
  bucket: <your target s3 bucket name, such as bob-embulk-demo>
  path_prefix: <path for your data file, such as original-data/>
  endpoint: <your s3 region endpoint, such as s3-ap-northeast-1.amazonaws.com>
  access_key_id: <access key id for your IAM account>
  secret_access_key: <access key secret for your IAM account>

exec:
  min_output_tasks: 1 
  
out:
  type: postgresql
  host: <connection host of your Hologres instance>
  port: 80
  user: <your accessKeyId>
  password: <your accessKeySecret>
  database: <your target database name>
  table: <your target table name>
  mode: insert_direct
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153835.png "img")

`guess`  コマンドを使用して、カラム情報を含む最終的な設定ファイルを生成します。    

```shell
$ embulk guess s3-hologres-demo.yml -o s3-hologres-demo-config.yml
```

```yaml
in:
  type: s3
  bucket: <your target s3 bucket name, such as bob-embulk-demo>
  path_prefix: <path for your data file, such as original-data/>
  endpoint: <your s3 region endpoint, such as s3-ap-northeast-1.amazonaws.com>
  access_key_id: <access key id for your IAM account>
  secret_access_key: <access key secret for your IAM account>
  parser:
    charset: UTF-8
    newline: CRLF
    type: csv
    delimiter: ','
    quote: '"'
    escape: '"'
    trim_if_not_quoted: false
    skip_header_lines: 1
    allow_extra_columns: false
    allow_optional_columns: false
    columns:
    - {name: order_id, type: string}
    - {name: user_id, type: long}
    - {name: book_id, type: long}
    - {name: book_name, type: string}
    - {name: order_cnt, type: long}
    - {name: order_amt, type: long}
exec: {min_output_tasks: 1}
out: {type: postgresql, host: <connection host of your Hologres instance>,
  port: 80, user: <your accessKeyId>, password: <your accessKeySecret>,
  database: <your target database name>, table: <your target table name>, mode: insert_direct}

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153857.png "img")

生成された設定ファイルでEmbulkタスクを実行します。AWS S3からAlibaba Cloud Hologresに10000レコード（csvファイル - 697kb）を転送するのに0.20秒かかりました。     

```shell
$ embulk run s3-hologres-demo-config.yml
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153911.png "img")

Check records in target Hologres table.

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153927.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153936.png "img")


# Embulkを使った暗号化モードでのデータ転送

ECS上に新たなフォルダを作成し、その中に以下のようなEmbulkの初期設定ファイルを入れます。暗号化データのフォルダに合わせて「path_prefix」を変更します。    

```yaml
in:
  type: s3
  bucket: <your target s3 bucket name, such as bob-embulk-demo>
  path_prefix: <path for your data file, such as encryption-data/>
  endpoint: <your s3 region endpoint, such as s3-ap-northeast-1.amazonaws.com>
  access_key_id: <access key id for your IAM account>
  secret_access_key: <access key secret for your IAM account>

exec:
  min_output_tasks: 1 
  
out:
  type: postgresql
  host: <connection host of your Hologres instance>
  port: 80
  user: <your accessKeyId>
  password: <your accessKeySecret>
  database: <your target database name>
  table: <your target table name>
  mode: insert_direct
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908153953.png "img")

`guess` コマンドを使用して、カラム情報を含む最終的な設定ファイルを生成します。    

```shell
$ embulk guess s3-hologres-encryption-demo.yml -o s3-hologres-encryption-demo-config.yml
```

```yaml
in:
  type: s3
  bucket: <your target s3 bucket name, such as bob-embulk-demo>
  path_prefix: <path for your data file, such as encryption-data/>
  endpoint: <your s3 region endpoint, such as s3-ap-northeast-1.amazonaws.com>
  access_key_id: <access key id for your IAM account>
  secret_access_key: <access key secret for your IAM account>
  parser:
    charset: UTF-8
    newline: CRLF
    type: csv
    delimiter: ','
    quote: '"'
    escape: '"'
    trim_if_not_quoted: false
    skip_header_lines: 1
    allow_extra_columns: false
    allow_optional_columns: false
    columns:
    - {name: order_id, type: string}
    - {name: user_id, type: long}
    - {name: book_id, type: long}
    - {name: book_name, type: string}
    - {name: order_cnt, type: long}
    - {name: order_amt, type: long}
exec: {min_output_tasks: 1}
out: {type: postgresql, host: <connection host of your Hologres instance>,
  port: 80, user: <your accessKeyId>, password: <your accessKeySecret>,
  database: <your target database name>, table: <your target table name>, mode: insert_direct}

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154008.png "img")

生成された設定ファイルでEmbulkタスクを実行します。AWS S3からAlibaba Cloud Hologresへの10000レコード（csvファイル - 697kb）の転送にも0.20秒かかりました。     

```shell
$ embulk run s3-hologres-encryption-demo-config.yml
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154020.png "img")

Hologresのターゲットとなるtableのレコードをチェックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154035.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154043.png "img")

# その他のセキュリティオプションの概要

データ送信処理中のデータを保護するには、接続形式に注意する必要があります。EmbulkはAlibaba Cloudのイントラネットで動作しているので、EmbulkサーバーとAWS S3バケットの接続形式がより重要になってきています。     
Amazonが提供している[Security Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html) がより詳しく説明されているので、こちらも参考にしてください。     

> https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html

## サーバーサイドの暗号化処理

ご覧の通り、データファイルがサーバー側で暗号化されていても、Hologresテーブルにはplaintext形式でデータが表示されます。これは、AWS S3バケットに格納されたデータをサーバーサイド暗号化で保護しているためです。     
コンソールのDownloadやOpen、SDKのGetObjectなど、正しい方法でデータを取得すると、自動的に復号化されます。ただし、データファイルが「Public Read」となっていても、公開されているURLから直接アクセスすると、エラーメッセージが表示されます。      
詳細は [Protecting Data Using Encryption（暗号化によるデータの保護）](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html) をご参照ください。    

> https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154146.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154155.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154204.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154213.png "img")

Embulk S3 input pluginはソースデータファイルをAPIで取得するため、AWS S3バケットから取得したデータはplaintext形式になっています。このような場合には、AWS S3のバケットポリシーを利用して、転送中のデータを保護することができます。     

## バケットポリシーに基づく接続ホワイトリスト

以下のようなバケットポリシーを設定すると、定義されたソースIPからのリクエストのみがバケット配下のオブジェクトにアクセスできるようになります。ECSのサーバーIPがホワイトリストに入っていない場合、Embulkでは接続エラーが発生します。詳しくは [Limiting Access to Specific IP Address](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html#example-bucket-policies-use-case-3) を参照してください。      


```json
{
    "Version": "2012-10-17",
    "Id": "S3PolicyId1",
    "Statement": [
        {
            "Sid": "IPAllow",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::bob-embulk-demo",
                "arn:aws:s3:::bob-embulk-demo/*"
            ],
            "Condition": {
                "NotIpAddress": {
                    "aws:SourceIp": "xxxxx"
                }
            }
        }
    ]
}
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154232.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154240.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154250.png "img")


## 輸送中のデータの暗号化を強制する

HTTPS(TLS)を使用することで、潜在的な攻撃者による中間者攻撃などによるネットワークトラフィックの盗聴や操作を防ぐことができます。     
AWS SDKのデフォルト設定では、セキュリティを高めるために、すべてのリクエストのプロトコルとして「HTTPS」を使用します。[ClientConfiguration.java](https://github.com/aws/aws-sdk-java/blob/master/aws-java-sdk-core/src/main/java/com/amazonaws/ClientConfiguration.java)の159～165行目をご参照ください。    

```java
......
    /**
     * The protocol to use when connecting to Amazon Web Services.
     * <p>
     * The default configuration is to use HTTPS for all requests for increased security.
     */
    private Protocol protocol = Protocol.HTTPS;
......
```

Embulk S3 input pluginは、クライアント設定のデフォルトプロトコルを使用しているため、Embulk経由の接続はすべて`HTTPS`になります。詳しくは [AbstractS3FileInputPlugin.java](https://github.com/embulk/embulk-input-s3/blob/master/embulk-input-s3/src/main/java/org/embulk/input/s3/AbstractS3FileInputPlugin.java) の　226行目～241行目をご参照ください。     

```java
......
    protected ClientConfiguration getClientConfiguration(PluginTask task)
    {
        ClientConfiguration clientConfig = new ClientConfiguration();

        //clientConfig.setProtocol(Protocol.HTTP);
        clientConfig.setMaxConnections(50); // SDK default: 50
//        clientConfig.setMaxErrorRetry(3); // SDK default: 3
        clientConfig.setSocketTimeout(8 * 60 * 1000); // SDK default: 50*1000
        clientConfig.setRetryPolicy(PredefinedRetryPolicies.NO_RETRY_POLICY);
        // set http proxy
        if (task.getHttpProxy().isPresent()) {
            setHttpProxyInAwsClient(clientConfig, task.getHttpProxy().get());
        }

        return clientConfig;
    }
......
```

また、Amazon S3のバケットポリシーで[aws:SecureTransport](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html#Conditions_Boolean) という条件を使って、HTTPS(TLS)による暗号化された接続のみを許可することもできます。   
あるいは、[s3-bucket-ssl-requests-only](https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-ssl-requests-only.html)というマネージドAWS Configルールを使って、継続的な検知制御を実施することも検討できます。    

## 最小限の特権でのアクセスの実装

Embulkの設定では、タスクの実行に使用する対象のIAMアカウントのaccessKeyIdとaccessKeySecretが必要です。パーミッションを付与する際に、誰がどのAmazon S3リソースに対してどのようなパーミッションを取得するかを決めることができます。それらのリソースに対して許可したい特定のアクションを有効にします。     
したがって、タスクを実行するために必要なパーミッションのみを付与する必要があります。最小限の権限でのアクセスを実装することは、セキュリティリスクと、エラーや悪意に起因する影響を軽減するための基本的な対処です。    

> https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-iam-policies.html


## Alibaba Cloud Hologresインスタンスのホワイトリスト

一方、Alibaba Cloud Hologresでもホワイトリストの設定が可能です。詳細は、[Hologres IP Address Whitelist](https://www.alibabacloud.com/cloud-tech/doc-detail/201028.htm)をご参照ください。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/201028.htm


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154315.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154323.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154332.png "img")

Embulk ServerのIPアドレスが対象となるHologresインスタンスのホワイトリストに入っていないため、Embulkタスクで接続エラーメッセージが表示されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908154344.png "img")



# 最後に
ここまで、Embulkを使ってAWS S3からHologresへリアルタイムデータ連携方法を紹介しました。     
この方法を生かすことで、AWS S3をはじめ、AWS各種システムやサービス基盤からリアルタイムでHologresへ連携、Hologresでリアルタイム可視化を実現することができます。    
また、Embulkのプラグインがある限り、GCP Cloud Storageからの連携といった技もできます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210908161912.png "img")



