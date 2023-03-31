---
title: "AWS S3からAlibaba Cloud OSSへ"
metaTitle: "AWS S3からAlibaba Cloud OSSへマイグレーションの手順"
metaDescription: "AWS S3からAlibaba Cloud OSSへマイグレーションの手順を説明します"
date: "2021-05-11"
author: "Nancy"
thumbnail: "/images/00_overview.png"
---

## AWS S3からAlibaba Cloud OSSへマイグレーションの手順

本書は、AWS S3からAlibaba Cloud OSSへマイグレーションの手順を紹介します。



# 1.はじめに

本書は、Amazon Web Services（以下AWS）環境のストレージ（AWS S3）に格納されているデータを、Alibaba Cloudのオブジェクトストレージサービス(以下OSS)へ移行する手順を記載します。移行の際には「Alibaba Cloud移行ツールOSSimport」を使用します。

# 2.Alibaba Cloud移行ツールとは
Alibaba Cloud 独自のリソース移行ツールです。ローカルまたは他のクラウドストレージシステムに格納されたデータを OSS に移行でき、以下のような特徴があります。

①豊富なデータソースをサポート(必要に応じて拡張可能)
　ローカルドライブ、Qiniu、Baidu BOS、AWS S3、Azure Blob、Youpai Cloud、Tencent Cloud COS、Kingsoft KS3、HTTP、OSS

②データ転送を中断しても、途中から再開が可能。

③トラフィック制御をサポート。

④時刻指定または指定された接頭辞の後にオブジェクトを移行することが可能。

⑤パラレルでデータのアップロードとダウンロードが可能。

⑥スタンドアロンモードと分散モードをサポート。スタンドアロンモードは展開と使用が容易で、分散モードは大規模なデータ移行に適しています。

# 3.環境構成図
 ![00_overview](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/00_overview.png "00_overview")

＜構成概要＞
1)	AWSのクラウド環境
東京リージョンに作成したAWS S3のBucketに、移行用テストデータを配置。

2)	Alibaba Cloud環境

①HangZhouリージョンにECSを配置し、移行ツール動作環境を作成。
（本書はHangzhouリージョンに例として説明します、必要に応じてリージョンを設定してください）
②移行先として、OSSにBucketを作成。
③Alibaba Cloud 移行ツールを使って、AWS S3からデータをOSSへ移行。

# 4.導入手順

本手順では、AWS環境の準備からAlibaba Cloud 移行ツールでオンライン移行を実施し、動作確認までの具体的な手順を記載します。

# 4-1. AWS環境の準備
本手順書では下記内容でAWS環境を準備します。記載していない項目は任意です。
## 4-1-1. AWS S3 bucketを作成する
|設定項目|説明|
|--|--|
|リージョン|Tokyo|
|リージョン|Asia Pacific (Tokyo) ap-northeast-1|
|バケット名|s3-to-oss|
|アクセス権|パブリックの許可|
|移行データ|CSV、Hive、Parquet|

①AWSポータルサイトにログインし、S3画面にて「Create bucket」をクリックする
![create s3 bucket ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/01-Create_s3_bucket_01.png "s3 bucket 01")

②Bucket作成画面にパブリック名前とリージョンを設定する
![create s3 bucket ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/01-Create_s3_bucket_02.png "s3 bucket 02")

③Bucket作成画面にパブリックの許可を設定する
![create s3 bucket ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/01-Create_s3_bucket_03.png "s3 bucket 03")

④Bucket作成画面にパブリックの許可の同意確認をチェックする
![create s3 bucket ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/01-Create_s3_bucket_04.png "s3 bucket 04")

⑤作成のBucketを確認する
![create s3 bucket ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/01-Create_s3_bucket_05.png "s3 bucket 05")

## 4-1-2. AWS S3 bucketにてフォルダを作成する
①フォルダ作成ボタンをクリックする
![ Create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/02-Create_s3_folder_01.png "folder 01 ")

②フォルダ名を設定する
![ Create data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/02-Create_s3_folder_02.png "folder 02 ")

③フォルダが作成される
![ Create data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/02-Create_s3_folder_03.png "folder 03 ")

![ Create data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/02-Create_s3_folder_04.png "folder 04 ")

![ Create data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/02-Create_s3_folder_05.png "folder 05 ")


## 4-1-3. AWS S3 bucketにデータを準備する

「ファイルを追加」ボタンをクリックし、各フォルダにデータファイルをアップロードする
![ upload data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/03-upload_s3_data_01.png "upload data 01 ")

![ upload data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/03-upload_s3_data_02.png "upload data 02 ")

![ upload data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/03-upload_s3_data_03.png "upload data 03 ")

![ upload data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/03-upload_s3_data_04.png "upload data 04 ")

![ upload data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/03-upload_s3_data_05.png "upload data 05 ")

![ upload data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/03-upload_s3_data_06.png "upload data 06 ")

![ upload data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/03-upload_s3_data_07.png "upload data 07 ")

![ upload data ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/03-upload_s3_data_08.png "upload data 08 ")

# 4-2. Alibaba Cloud環境の準備

## 4-2-1.RAMユーザー、AccessKeyとAccessKeySecret の準備
移行作業を実施する、RAMユーザーを準備します。RAMユーザーにはAccessKeyとAccessKeySecretが必要になります。
AccessKeyとAccessKeySecretの作成権限またはVPC、ECS、OSSなどの作成権限をRAMユーザーに付与してください。

## 4-2-2.VPCの準備
①AlibabaCloudサイトに登録し、コンソール画面にOSSメニューをクリックする
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/04-Create_VPC_01.png "Create VPC 01")

②今回はHangzhouリージョンで選択し、VPC作成メニューをクリックする
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/04-Create_VPC_02.png "Create VPC 02")

③VPC CIDRを設定する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/04-Create_VPC_03.png "Create VPC 03")

④VSwitchを設定する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/04-Create_VPC_04.png "Create VPC 04")

⑤VPCを設定完了する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/04-Create_VPC_05.png "Create VPC 05")

⑥VPCを確認する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/04-Create_VPC_06.png "Create VPC 06")

## 4-2-3.ECSインスタンス作成
①ECSメニューをクリックし、ECSコンソール画面に遷移する

![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/05-Create_ECS_01.png "Create ECS 01")

②ECS画面でインスタンスの作成ボタンをクリックし、ECS作成画面に遷移する

![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/05-Create_ECS_02.png "Create ECS 02")

③ECS作成画面でリージョンを設定する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/05-Create_ECS_03.png "Create ECS 03")

④ECS作成画面でイメージを設定する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/05-Create_ECS_04.png "Create ECS 04")

⑤ECS作成画面でVPCを設定する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/05-Create_ECS_05.png "Create ECS 05")

⑥ECS作成画面でパスワードを設定する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/05-Create_ECS_06.png "Create ECS 06")

⑦ECS作成画面で利用規約を設定する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/05-Create_ECS_07.png "Create ECS 07")

⑧ECSを作成する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/05-Create_ECS_08.png "Create ECS 08")

⑨ECSを確認する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/05-Create_ECS_09.png "Create ECS 09")


## 4-2-4.Object Storage（以下OSS）バケット準備
①OSSメニューをクリックし、OSSコンソール画面に遷移する
![create oss ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/06-Create_oss_01.png "Create oss 01")

②Bukcetメニューをクリックし、Bukcetリスト画面に遷移する
![create oss ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/06-Create_oss_02.png "Create oss 02")

③「CreateBukcet」メニューをクリックし、Bukcet作成画面に遷移する
![create oss ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/06-Create_oss_03.png "Create oss 03")

④Bukcet作成画面でリージョンを設定する
![create oss ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/06-Create_oss_04.png "Create oss 04")

⑤Bukcetを作成しました。
![create oss ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/06-Create_oss_05.png "Create oss 05")

⑥Bucketファイル画面を確認する
![create oss ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/06-Create_oss_06.png "Create oss 06")

## 4-2-5.OSSImportの導入・設定
OSSImportを導入します。ECSインスタンスにrootユーザでログインして実施します。本手順はスタンドアロンモードで実施します。
①ECSをログインする
![Install OSSImport ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/07-Install_OSSImport_01.png "OSSImport 01")
```
# yum install -y unzip
# wget http://gosspublic.alicdn.com/ossimport/standalone/ossimport-2.3.1.zip
# mkdir ossimport
# mv ossimport-2.3.1.zip ossimport
# cd ossimport
# unzip ossimport-2.3.1.zip
```
②unzipをインストールする
![Install OSSImport ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/07-Install_OSSImport_02.png "OSSImport 02")

③OSSImportファイルをダウンロードする、zipファイルが正常に解凍されたことを確認する。
![Install OSSImport ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/07-Install_OSSImport_03.png "OSSImport 03")

## 4-2-6.同期用コンフィグファイルの作成
①OSSImportコンフィグファイルを設定する
```
# cp -p conf/local_job.cfg conf/local_job.cfg.bak
# vim conf/local_job.cfg
```
 ![OSSImport config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/08-OSSImport_config_01.png "OSSImport config 01")

![OSSImport config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/08-OSSImport_config_02.png "OSSImport config 02")
記入例
srcType ：ソース元を指定します。今回はS3を指定します
```
srcType＝s3
```
srcAccessKey：AWS API にアクセスするための AccessKeyIDを記載します
```
srcAccessKey=*************OXBX
```
srcSecretKey：AWS API にアクセスするための AccessKeySecretを記載します
```
srcSecretKey=*************cNum
```
srcDomain：AWS S3のリージョンをご記入ください
```
srcDomain=http://s3.ap-northeast-1.amazonaws.com
```
srcBucket：S3のバケット名を記載します
```
srcBucket=s3-to-oss
```
srcPrefix：スペースを指定します
```
srcPrefix=
```
destAccessKey：Alibaba Cloud API にアクセスするための AccessKeySecretを記載します
```
destAccessKey==*************RKwQ
```
destSecretKey：Alibaba Cloud API にアクセスするための AccessKeyIDを記載します
```
destSecretKey==*************ofVU
```
destDomain：Alibaba Cloud OSSのエンドポイントを記載してください。内部ドメイン名を使用してください（非仮想マシンは使用できません）
例：http://oss-cn-hangzhou-internal.aliyuncs.com
ドメイン名にバケット接頭辞を含めないでください
```
destDomain=http://oss-cn-hangzhou-internal.aliyuncs.com
```
destBucket：Alibaba Cloud OSSのバケット名を記載します
```
destBucket=awstooss
```
destPrefix：Alibaba Cloud OSSのディレクトリを記載します
注：OSSは '/'でファイルの先頭をサポートしていません。 '/'で始まる値は記入しないでください
```
destPrefix=
```

## 4-2-7.Java環境の確認とインストール
①java環境の確認。※バージョンは 1.7 以上
```
# yum install -y java
# java -version
```
![Java config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/09-Java_config_01.png "Java config 01")

## 4-2-8.OSSImportを起動、データ移行
①OSSImportを起動し、移行元の全データを移行するテストを行います。
```
# bash import.sh stat
```
![ Run OSSImport ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/10-Run_OSSImport_01.png "OSSImport 01")

![ Run OSSImport ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/10-Run_OSSImport_02.png "OSSImport 02")
「Clean the previous job, Yes or No:」が表示された場合は「Yes」を入力して、エンターキーを押します。
インポートが終了すると「Stop import service, Yes or No:」が表示されるので「Yes」を入力して、エンターキーを押します。

![ Run OSSImport ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/10-Run_OSSImport_03.png "OSSImport 03")

# 4-3.データ移行動作確認
## 4-3-1.データ移行動作確認
①移行先のOSSにログインして、移行が正常に行われたかを確認します。
![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_01.png "Migration check 01")

②フォルダおよびファイルを確認する
![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_02.png "Migration check 02")

![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_03.png "Migration check 03")

![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_04.png "Migration check 04")

![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_05.png "Migration check 05")

![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_06.png "Migration check 06")

![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_07.png "Migration check 07")

![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_08.png "Migration check 08")

![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_09.png "Migration check 09")

![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_10.png "Migration check 10")

③OSSImport実行ログを確認する
![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_11.png "Migration check 11")

![ Migration check ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/11-Check_Migration_12.png "Migration check 12")

＜注意＞
今回はisIncremental=falseに設定しているため、OSSImportを実行した後に、AWS S3にアップロードされたファイルは、実行中の処理の中では移行対象になりません。実行後に追加したデータは、もう一度OSSImportを実行することでファイルを移行できます。
isIncrementalがtrueに設定する場合、incrementalModeIntervalが設定している秒数ごとインクリメンタルデータをスキャンして、インクリメンタルデータを同期します。

# 5. 移行時間（参考値）
Alibaba Cloud 移行ツールの日本リージョンから日本リージョンまで移行時間の参考値を以下に記載します。
```
＜AWS環境＞
・データサイズ：5GB

＜移行時間＞
Alibaba Cloud 移行ツールのコマンドを実行して、コマンドが終了するまでの時間は次の通りです。
移行時間：約15分
```

今回は日本リージョンからHangzhouリージョンまで実際の移行時間の参考値を以下に記載します。
```
＜AWS環境＞
・データサイズ：30GB

＜移行時間＞
Alibaba Cloud 移行ツールのコマンドを実行して、コマンドが終了するまでの時間は次の通りです。
移行時間：約168分
```


