---
title: "Data Online Migration Service"
metaTitle: "Data Online Migration Serviceを使用して、AWS S3からAlibaba Cloud OSSにデータを転送する。"
metaDescription: "Data Online Migration Serviceを使用して、AWS S3からAlibaba Cloud OSSにデータを転送する。"
date: "2021-09-17"
author: "bob"
thumbnail: "/Migration_images_13574176438009000000/20210916232211.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Data Online Migration Serviceを使用して、AWS S3からAlibaba Cloud OSSにデータを転送する


     
本記事では、マイグレーションシナリオの１つとして、Data Online Migration Serviceを使用して、AWS S3からAlibaba Cloud OSSにデータを転送する方法をご紹介します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916232211.png "img")      


## Alibaba Cloud Data Online Migration Serviceを使ってAWS S3からAlibaba Cloud OSSにデータを移行する

[AWS S3 (Simple Storage Service)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) は Amazon Web Serviceが提供するクラウド型オブジェクトストレージです。    
[OSS (Object Storage Service) ](https://www.alibabacloud.com/cloud-tech/doc-detail/31817.htm)(Object Storage Service) は Alibaba Cloud が提供するクラウド型オブジェクトストレージです。    

Alibaba Cloud Data Online Migration Serviceは、多くのお客様のシナリオに対応した様々なデータ移行ソリューションを提供します。サービス自体は2021年9月16日 現時点で無料ですが、データのアップロード、データのダウンロード、APIリクエストには料金が発生します。    

AWS S3(Simple Storage Service) から Alibaba Cloud OSS(Object Storage Service) へのデータ移行は、[こちらのガイドラインに沿って、チュートリアル](https://www.alibabacloud.com/cloud-tech/doc-detail/95127.htm) でステップバイステップで行います。     

まずは、AWS S3 のバケットに平文で保存されている元データファイルを用意します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214042.png "img")      

## このチュートリアルについて

### 対象者:

このガイドラインは、以下のような方を対象としています。     
- Alibaba Cloud、OSS(Object Storage Service)、Data Online Migration Service、AWS(Amazon Web Services)、Amazon S3(Simple Storage Service)に関する基本的な知識を持っている       

### 前提条件:

- Alibaba Cloudのアカウントを所持している      
- Alibaba CloudでOSS(Object Storage Service)とData Online Migration Serviceが使用可能な状態になっている      
- Alibaba Cloud上に少なくとも1つのOSS(Object Storage Service) bucketがある      
- AWS（Amazon Web Services）を所持している      
- AWS（Amazon Web Services）でAWS S3(Simple Storage Service)が使用可能な状態になっている      

## 準備

ここでは、以下の準備作業について説明します。
- AWS S3 bucketの準備作業について説明します。    
- ソースデータファイルを生成し、ターゲットバケットにアップロード    
- セキュリティのために `readonly` パーミッションのユーザーアカウントを作成     

> 関連するリソースが既に用意されている場合は、これらを無視しても構いません。

### AWS S3 bucket の準備

AWS S3 のbucket をサーバー側で暗号化せず、一般に公開する形で作成します。　   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214107.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214115.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214124.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214131.png "img")      


### ソースデータファイルの生成とターゲットバケットへのファイルのアップロード

[boto3](https://github.com/boto/boto3) で定義したS3 Clientを使って、ソースデータファイルを生成し、ターゲットとなるS3 bucket にアップロードします。     

> https://github.com/boto/boto3



```python
import csv
import datetime
import os
import random
import time
import uuid

import boto3
from botocore.exceptions import ClientError


def get_nday_list(n):
    before_n_days = []
    for day_index in range(1, n + 1)[::-1]:
        before_n_days.append((datetime.date.today() - datetime.timedelta(days=day_index)).strftime("%Y%m%d"))
    print("Generate dates info successfully.")
    return before_n_days


def generate_data_file(output_date, counts):
    book_info = ["嫌われる勇気", "ノルウェイの森", "海辺のカフカ", "色彩を持たない多崎つくると彼の巡礼の年",
                 "容疑者Ⅹの献身", "人間失格", "こころ", "天声人语", "幸せになる勇気"]
    book_price = [500, 600, 700, 300, 200, 100, 350, 550, 650]
    data_files = []
    for file_index in range(counts):
        csv_writer = csv.writer(
            open("test_data_{0}_{1}.csv".format(output_date, file_index), "w+", newline='', encoding='UTF-8'))
        # Set data counts in one data file, 1000000 as default, 68MB for each data file as default
        for data_index in range(1000000):
            book_id = random.randint(1, 9)
            order_count = random.randint(1, 5)
            # order_id, user_id, book_id, book_name, order_count, order_amount
            row = [uuid.uuid1(), random.randint(1, 50), book_id, book_info[book_id - 1], order_count,
                   book_price[book_id - 1] * order_count]
            csv_writer.writerow(row)
        print("Generate test_data_{0}_{1}.csv successfully.".format(output_date, file_index))
        data_files.append("test_data_{0}_{1}.csv".format(output_date, file_index))
    return data_files


def upload_data_file(s3_client, file_name, bucket, object_name=None):
    if object_name is None:
        object_name = os.path.basename(file_name)
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        print(e)
        return False
    return True


if __name__ == '__main__':
    client = boto3.client(
        's3',
        aws_access_key_id="<your AWS access key id>",
        aws_secret_access_key="<your AWS access key secret>",
        region_name='<your region name such as ap-northeast-1>'
    )
    bucket = "<your S3 bucket name>"
    # Set folder counts and file counts in each folder
    # Folder name is set as date string
    target_days, target_file_counts = 10, 10
    target_dates = get_nday_list(target_days)
    prefix = "<your data files prefix such as test-data>"
    for i in range(target_days):
        tmp_date = target_dates[i]
        # Generate data files locally
        tmp_files = generate_data_file(tmp_date, target_file_counts)
        for tmp_file in tmp_files:
            # Upload data files to S3 bucket
            tmp_rs = upload_data_file(client, tmp_file, bucket, "{0}/{1}/{2}".format(prefix, tmp_date, tmp_file))
            if tmp_rs:
                print("Upload file {0}/{1}/{2} in bucket {3} successfully".format(prefix, tmp_date, tmp_file, bucket))
                # Remove temp data files locally
                os.remove(tmp_file)
                # Sleep 20s and then continue next operation
                # You may be rejected by AWS server once you send the data files one by one frequently
                time.sleep(20)

```

csv形式のデータサンプルはこの通りです。     

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

以下は、スクリプトで生成されたデータ構造のサンプルです。

```
test-demo(S3 bucket) \
|----test-data(data file folder) \
|----|----20210829(data file folder) \
|----|----|----test_data_20210829_0.csv(data file) \
|----|----|----test_data_20210829_1.csv(data file) \
|----|----|----test_data_20210829_2.csv(data file) \
|----|----|----...... \
|----|----|----test_data_20210829_9.csv(data file) \
|----|----20210830(data file folder) \
|----|----|----test_data_20210829_0.csv(data file) \
|----|----|----...... \
|----|----|----test_data_20210829_9.csv(data file) \
...... \
|----|----20210908(data file folder) \
|----|----|----test_data_20210829_0.csv(data file) \
|----|----|----...... \
|----|----|----test_data_20210829_9.csv(data file) 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214151.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214159.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214206.png "img")      

### セキュリティのために readonly 権限専用のユーザーアカウントを作成

[AWS security best practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html) によると、タスクを実行するために必要なパーミッションのみを付与する必要があります。最小限の権限でのアクセスを実現することは、セキュリティリスクや、エラーや悪意による影響を軽減するための基本となります。    

> https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html

従って、Data Online Migration Serviceのジョブ構成で使用する最小限のアクセス権限を持つ新しいユーザー・アカウントを作成する必要があります。        
ここでは `AmazonS3ReadOnlyAccess` を例に使用します。ユーザーアカウントの作成プロセスに入り、手順に従って作業を完了します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214219.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214228.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214236.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214251.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214258.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214309.png "img")      

`NOT`は、今後使用するために、生成されたアクセス情報を記録することを忘れずに。。。

## Alibaba Cloud Data Online Migration Serviceによるデータ転送

コンソール画面にて、「Data Online Migration Service」がプロダクトサービス一覧に表示されない場合は、コンソールのリンクで入力し検索します。
続いて、ウィザードを使って簡単に移行ジョブを設定することができます。     
まず、移行元と移行先として使用できる新しいデータアドレスを追加し、データを転送するための移行ジョブを作成します。    

### AWS S3とAlibaba Cloud OSSのデータアドレス追加

Alibaba Cloud Data Online Migration Serviceは、Alibaba Cloud OSS(Object Storage Service)、Alibaba Cloud NAS(Apsara File Storage)、AWS S3(Simple Storage Service)、Azure Blob、Google Storage Service、FTPなどの複数のデータソースに対応しています。 関連するガイドラインは [こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/95074.htm)を参考にしてください。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/95074.htm

Data Address Management に移動し、Alibaba Cloud OSSとAWS S3のアドレスを1つずつ追加します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214323.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214330.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214338.png "img")      


AWS S3についても同様に作業します。上記作成したAWSユーザーアカウントのアクセス情報をここで使用します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214346.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214406.png "img")      

### 移行ジョブの作成
移行ジョブ管理画面（Migration Job Management）に戻り、AWS S3からAlibaba Cloud OSSへの移行ジョブを新規に作成します。     
移行ジョブをできるだけ早く起動するために、Time Rangeが0:00-24:00に設定されていることに注意する必要があります。      
また、移行ジョブのパフォーマンスを向上させるために、データサイズとファイル数の情報をできるだけ正確にパフォーマンスセクションに入力してください。S3(Simple Storage Service)コンソールのバケット管理ページにある「Metrics」タブで関連情報を得ることができます。
また、移行ジョブのパフォーマンスを向上させるには、パフォーマンスセクションにデータサイズとファイル数の情報をできるだけ正確に入力する必要があります。これらの情報は、AWS S3コンソールのバケット管理ページの `Metrics` タブで関連情報を取得することができますので、これを参考に入力します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214423.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214433.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214440.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214448.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214456.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214503.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214511.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214518.png "img")      

移行ジョブが作成されると、ジョブのステータスは 「Creating（作成中）」 になります。ジョブの作成が終わったあと、上記の手順で設定した時間範囲に基づいて、 「Migrating（移行中）」 に変更されます。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214530.png "img")      

移行プロセス中に、データ・サイズ、ファイル数、ネットワーク・フローに関する移行情報を確認できます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214542.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214550.png "img")      

移行ジョブが完了すると、ジョブのステータスが 「Finished（完了）」 へ更新されます。ジョブの詳細を確認し、移行レポートをエクスポートすることもできます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214603.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214610.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214619.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214628.png "img")      

移行レポートによると、移行ジョブでは110個のCSVファイル (7.31 GB) が672秒で転送されました ( PM 1:58:49 から PM 02:10:01) 。つまり、平均ネットワーク速度としては11.15 MB/秒でした。異なるネットワークを挟んで処理を考えると早い方です。またオプションで並列処理をすることもできます。          

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214639.png "img")      

### マイグレーションしたファイルがOSS bucketにあることを確認

移行先、ターゲットとなるOSS bucketへ移動し、移行されたデータ構造とデータファイルを確認します。     
すると、中には次のファイルを含む、生成されたマイグレーションレポートフォルダも表示されます。    

- ファイル名が `_total_list` で終わるファイルには、移行が必要なファイルのリストが含まれています。
- ファイル名が `_completed_list` で終わるファイルには、正常に移行されたファイルのリストが含まれています。
- ファイル名が `_error_list` で終わるファイルには、移行に失敗したファイルのリストが含まれています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214652.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214659.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214708.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916214716.png "img")      


## 最後に
以上、Data Online Migration Serviceを使用して、AWS S3からAlibaba Cloud OSSにデータを転送する方法をご紹介しました。     
Data Online Migration ServiceはGCPやAzureにも対応していますので、マイグレーション作業の際は参考に頂ければ幸いです。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/95074.htm


<CommunityAuthor 
    author="Bob Bao"
    self_introduction = "2017年よりAlibaba Cloudサービスに携わる。ETL、ビッグデータ、サーバーレスが得意。PythonやJavaでのプログラミング経験豊富。AlibabaCloud Expert"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/bob_icon.jpg"
    githubUrl="https://github.com/bwbw723"
/>




