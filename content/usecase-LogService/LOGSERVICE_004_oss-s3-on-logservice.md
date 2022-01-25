---
title: "OSS、AWS S3からデータを収集"
metaTitle: "OSS、AWS S3からデータを収集するLogService"
metaDescription: "OSS、AWS S3からデータを収集するLogService"
date: "2020-12-29"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/LogService_images_26006613660740700/20201229131536.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## OSS、AWS S3からデータを収集するLogService


本記事では、LogServiceを使ってOSS、AWS S3からLogServiceへデータを収集する方法を記載します。    


# 前書き
> <span style="color: #ff0000"><i>LogService は、リアルタイムデータロギングサービスです。  
ログの収集、消費、出荷、検索、および分析をサポートし、大量のログを処理および分析する能力を向上させます。</i></span>

少し前になりますが、LogServiceについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www2.slideshare.net/sbopsv/alibaba-cloud-log-service

 

今回はOSS、AWS S3を使ってAlibaba Cloud LogServiceへ収集、蓄積、可視化してみましょう。構成図で、こんな感じです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229131536.png "img")


---

# プロジェクト作成（LogService全体で共通事項）

まずはプロジェクトを作成します。LogServiceコンソールから 「Create Project」を選択し、起動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201124101928.png "img")



Project Nameをここでは「techblog」にし、プロジェクトを作成します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201124102655.png "img")

その直後に "Do you want to create a Logstore for log data storage immediately?"、「Log Storeを作成しますか？」とポップアップが出ます。
Log StoreはLog Serviceでデータを蓄積するものなので、「OK」を選定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201124102805.png "img")

LogStore Nameをここでは「oss_logstore」と入力し、LogStoreを作成します。

その後、「LogStoreが作成されました。今すぐデータアクセスしますか？」とポップアップが出ますが、これは必要に応じて選定すると良いです。
ちなみに「Yes」を選択した場合、50を超える様々なデータアクセス手法のコンソールが表示されます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201124103134.png "img")

---

# データ格納について

## STEP1: OSSにてcsvファイルのアップロード

まずはOSS格納から行います。この作業自体シンプルで５分もしないうちに済みます。（著者的には多分csvファイルをLogServiceへ格納する作業の中で最も一番楽と思います）  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229132754.png "img")

OSSにて、csvファイルをアップロードします。以下、シンプルなcsvファイルです。
※LogServiceと同リージョンであることが望ましい     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229133431.png "img")


---

## STEP2: OSSからLogServiceへインポート


LogServiceの LogStore コンソールにて、インポート諸元を [OSS - Object Storage Service]へクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229134405.png "img")

OSSにてcsvファイルをアップロードしたので、そのOSSのBucket、Prefixを入力します。FormatもCSVへプルタウン選択します。    
必要情報入力が出来たら、無事ロード出来てるか確認として、「Preview」をクリックします。これでcsvファイルの先頭数行の読み取り結果が表示されたらOKで、次のステップへ進めます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229133943.png "img")

続いて、OSSにあるcsvファイルの[START_DT]フィールドをLogServiceのsystem timeとして登録したいので、[Use system time]のスイッチを切り替えます。    
すると [Time Field] [time format] などが表示されますので、合わせて入力します。   
今回の[START_DT]フィールドは yyyy/mm/dd hh:mmフォーマット形式なので、`yyyy/mm/dd HH:mm`として登録します。Time zomeも日本時間に合わせて`GMT+09:00`にします。    

csvなどのファイルに含まれている日付 - 時間のフォーマットをLog Serviceへ合わせる場合は、[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/28980.htm)を参考にしてフォーマットを指定する必要があります。

> https://www.alibabacloud.com/cloud-tech/doc-detail/28980.htm

このあとは「Test」をクリックし、csvファイルの先頭数行の読み取り結果およびLog Time（Unixtime）が無事表示されたらOKです。次のステップへ進めます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229134701.png "img")

Import Intervalで５分おきに実施にします。これは何分おきに新規ファイルがあればインポート処理をするかといった設定です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229144844.png "img")

Import処理に入ります。ここは待たなくても、処理中でも結果が表示されるので、「Next」をクリックし、「Log Query」の「Try now」で即可視化します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229135324.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229135519.png "img")

以上で表示されます。（タイムラグもあるのでURLを更新し、ページを再リロードしてください）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229152650.png "img")

---

## STEP3: AWS S3にcsvファイルのアップロード

今度はAWS S3格納から行います。これはAWSでのsyslogやcsvファイルなどのデータをLogServiceで可視化したいときに役立ちます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229132935.png "img")


AWSにて、csvファイルをアップロードします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229140533.png "img")


---

## STEP4: AWS lambdaでの設定

AWS Lambdaを使って、AWS S3からAlibaba Cloud OSSへデータを自動転送するようにします。流れとしては、上記のAWS S3 bucketに新規でcsvファイルがアップロードされたら、STEP1で作成したOSSのbucketに転送し、あとはSTEP2の設定によりLogServiceへ自動格納します。     

デザイナーおよび関数コードは以下の通りです。Python 3.7です。    

```
import json
import urllib.parse
import boto3
import uuid

print('Loading function')

s3 = boto3.resource('s3')

def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        oss = boto3.client('s3', aws_access_key_id='<your aws_access_key_id>',aws_secret_access_key='<your aws_secret_access_key>',
                                                region_name='cn-hangzhou', endpoint_url='http://datalake-ohara-202010.oss-cn-hangzhou.aliyuncs.com')
        tmp_file_name = uuid.uuid1()
        s3.Bucket(bucket).download_file(key,'/csv/{0}'.format(tmp_file_name))
        response = oss.upload_file('/csv/{0}'.format(tmp_file_name), 'lamdatooss', key)
        
        return response
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e


```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229143749.png "img")


リソース概要は以下の通りです。  

```
{
  "Version": "2012-10-17",
  "Id": "default",
  "Statement": [
    {
      "Sid": "lambda-a2b5ac8d-923a-4b8a-911a-3147fb6c1dea",
      "Effect": "Allow",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Action": "lambda:InvokeFunction",
      "Resource": "arn:aws:lambda:ap-northeast-1:<your aws_access_id>:function:s3oss_demo",
      "Condition": {
        "StringEquals": {
          "AWS:SourceAccount": "<your aws account>"
        },
        "ArnLike": {
          "AWS:SourceArn": "arn:aws:s3:::democode2020"
        }
      }
    }
  ]
}
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229141735.png "img")

あとは「デプロイ」で、AWS S3にあったcsvファイルがAlibaba Cloud OSSにコピーという形で格納されます。    
以降、AWS S3の上記bucketに新規csvファイルが格納されたら、上記lambdaによって自動でコピーしOSSへ格納されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229142509.png "img")

その後はSTEP2 で設定したImportの処理により、LogService側もAWS S3からのデータが無事反映されてることがわかります。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229151636.png "img")

---

# さいごに

OSS Importを使って、csvファイルをLogServiceへ格納、可視化する方法を簡単に説明しました。       
LogServiceはシンプルかつスピーディに構築することができます。この構築も、可視化まで1時間もかからないです。5分あれば見れます。      

LogServiceはフルマネージド環境でありながら、様々なデータを収集し蓄積・可視化する事が可能です。          
加えて、データ量や使い方に応じた課金なので、使い方次第ではコスト削減や、運用負荷の改善に効果があるのでは無いでしょうか。       


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>




