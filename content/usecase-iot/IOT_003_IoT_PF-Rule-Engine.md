---
title: "IoT Platform Rule Engineの紹介"
metaTitle: "IoT Platformのルールエンジンについて"
metaDescription: "IoT Platformのルールエンジンについて"
date: "2020-02-12"
author: "SBC engineer blog"
thumbnail: "/IoT_Platform_images_26006613507773200/20200212144842.png"
---

## IoT Platformのルールエンジンについて

本記事では、Alibaba Cloudが提供するIoT Platformの機能の1つであるルールエンジンについてご紹介します。     

# ルールエンジンとは？

ルールエンジンとはIoT Platformに送られてきたデータを他のサービスに連携するための仕組みです。     
例えば、センサーからIoT Platformに対してデータを送っている場合、そのデータをデータベースに保存したい、などはよくある例かと思います。     

このような場合、ルールエンジンを使用することで、簡単にデータベースにデータを挿入することができます。

# ルールエンジンの種類

ルールエンジンには以下の2種類があります。

* サービスサブスクリプション
* データ転送

サービスサブスクリプションは簡単な手順でデータの転送を実現できます。     
データ転送はより複雑な設定をする際に有効です。

順に仕様を実際に試していきたいと思います。

# 前準備

今回は以下のような環境を事前に作成しておきます。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212140801.png "img")


【ECSの設定】     
AlibabaCloudのECSをデバイスと仮定します。
CentOS7.7環境を準備し、以下のコマンドを実行しておきます。     
unzipとNode.jsのインストールを行なっています。

```
# yum install -y unzip
# yum install -y nodejs
```

【IoT Platformの設定】     

１. IoT Platformのコンソールを開く。     
２. 左側ペインより「クイックスタート」を開く。     
３. デバイスへの接続で「開始」を押す。     
４. 再度問われるので「開始」を押す。     
５. デバイスの登録で「プロダクト名」と「デバイス名」を入力して「次へ」を押す。     
　プロダクト：blog-product　デバイス：blog-device1     
６. 開発キットの選択で「Linux」「MQTT」「Node.js」を選択し、「次へ」を押す。     
７. SDKのダウンロードにて「ダウンロード SDK kit」を押し、SDKをダウンロードする。     
８. ダウロード後、「次へ」を押します。
９. ダウンロードしたkitをECS上に起き、以下のように解凍しておきます。     
```
# unzip aliyun_iot_device_quickstart.zip
# cd aliyun_iot_device_quickstart
```
１０. kitのstart.shを実行します。     
```
# sh start.sh
```
１１. IoT Platformのコンソールに戻り、IoT Platfromでデータを受信していることを確認します。     

以上、前準備は完了です。


# サービスサブスクリプション

サービスサブスクリプションを使用することで簡単にデータを転送することができます。     
サービスサブスクリプションはAMQPとAlibaba CloudのMNSをサポートしています。     
MNSはAlibaba Cloudが提供するキューイングサービスです。(詳しくは[こちら](https://www.alibabacloud.com/cloud-tech/product/27412.htm))     

> https://www.alibabacloud.com/cloud-tech/product/27412.htm


## サービスサブスクリプションの利用方法
ここでは、以下のようなデバイスがPublishしてきたデータをMNSのキューに転送するような設定をしていきたいと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212143313.png "img")

IoT Platform > ルールエンジン > サービスサブスクリプション     
より「サブスクリプションの作成」を選択します。

以下のようなポップアップが表示されますので設定していきます。

* ・プロダクト：「blog-product」を選択してください。(前準備で作成したプロダクト)    
* ・サブスクリプションタイプ：今回はMNSを選択します。   
* ・メッセージタイプ：デバイスアップストリーム通知   

最後にOKを押します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212161426.png "img")

以下のような確認画面が表示されるので「OK」を押します。       
これはMNSにキューを作成するよ！というメッセージです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212143852.png "img")


設定がうまくいくとMNSコンソールにキューができます。      


今回の設定では「デバイスアップストリーム通知」を選択しているので、     
IoT PlatformにデータをPubishすることでキューにデータが送られることになります。     

MNSコンソールの画面で受信を押すことでメッセージを確認できます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200206162408.png "img")

メッセージの受信を押すと以下のようにメッセージが表示されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200206162411.png "img")



# データ転送

データ転送では以下の4つのプロダクトへの転送をサポートしています。(2020年2月現在)      
データ転送でサポートされていないデータベースにデータを保存したい場合はFunctionComuputeを経由することで実現できます。    

* RDS    
* TableStore    
* MNS    
* FunctionCompute    

## データ転送の利用方法

ここでは、データ転送のMNSを利用して、MNSにデータを転送していきたいと思います。      
サブスクリプションでもMNSを使用しましたが、サブスクリプションはMNSのキューに直接データを送ることができます。       

データ転送のMNSを使用する際はMNSトピックにデータをPublishします。      
つまりトピックのサブスクライバーに複数の送信先を指定しておけば、1つのメッセージを複数のサブスクライバーに送ることができます。      
トピックとキューに関しては[こちら](https://www.alibabacloud.com/cloud-tech/product/27412.htm)を参考にしてください。    

> https://www.alibabacloud.com/cloud-tech/product/27412.htm


今回の構成を図にすると以下のようになります。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212144842.png "img")


まず、    
トピックのサブスクライブ先としてキューを準備しておきます。    
MNSのコンソールより、キュー > キューの作成を押します。    

* キュー名：blog-test-que  

最後に「OK」を押します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212145538.png "img")

次にMNS側のトピックとキューを作成します。      
MNSのコンソールより、トピック > トピックの作成 を押します。   

* Topic名：blog-test-topic    
* 最大メッセージバイト数：1024    

「OK」を押します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212145622.png "img")


トピックのサブスクライバーとしてキューを設定します。     
トピック > サブスクリプションリスト を押します。     
トピックリストの下にサブスクリプションリストが表示されます。     
サブスクライブボタンを押し、以下のように設定します。     

* プッシュタイプ：キュー     
* サブスクリプション名：test-sub    
* エンドポイント：blog-test-que    

最後に「OK」を押します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212145641.png "img")

これでMNSの設定は完了です。    

続いてIoT Platformの設定です。      
IoT Platformのコンソールより ルールエンジン > データ転送より「ルールの作成」を選択します。     

* ルール名：testRule    
* データ型：JSON     

「OK」を押します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212145802.png "img")     

作成されたルールの「表示」を選択します。    
右上のSQLを作成から転送するトピックや値を設定できます。     
今回は以下のように既存のトピックにPulishされるデータを全て転送したいと思います。     

* フィールド：*    
* Topic：TSLデータの報告     
* プロダクト：blog-product     
* デバイス：blog-device1     
* トピック：thing/event/property/post     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212145929.png "img")


続いて、データ転送を設定していきます。「操作の追加」を押します。     
ポップアップが開かれたら以下を入力していきます。     

* 対処方法の選択：「Message Serviceに送信」     
* リージョン：東京     
* Topic：blog-test-topic     
* Role：AliyunIOTAccessingMNSRole     

最後に「OK」を押します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212150029.png "img")

※ここの「Message Service」はMNSのことです。     


作成したルールを有効化します。      
左側ペインのデータ転送を押します。有効化したいルールの「開始」を押します。      
確認画面が出るので、「確認」を押します。      
ここ中国なので少しわかりにくいですが、青いボタンの方です。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212150145.png "img")

これで設定完了です。    
MNSコンソールの「メッセージの受信」を押すとblog-test-queでデータを受けているのがわかるかなと思います。     
データ転送の場合、文字化けしてしまっているので、Base64のデコードのチェックを外すことでメッセージを確認できます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613507773200/20200212150358.png "img")


# 最後に

以上、ルールエンジンについてをご紹介しました。ルールエンジンがあれば、Alibaba Cloud各プロダクトサービスに色々連携できます。    

