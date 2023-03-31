---
title: "IoT Platform接続方法"
metaTitle: "Alibaba Cloud  IoT Platformに接続してみました"
metaDescription: "Alibaba Cloud  IoT Platformに接続してみました"
date: "2020-01-21"
author: "sbc_haku"
thumbnail: "/IoT_Platform_images_26006613500633700/20200121092346.png"
---

## Alibaba Cloud  IoT Platformに接続してみました

本記事では、Alibaba Cloud IoT Platform上に、仮想デバイスを定義し、IoT Platform環境と接続する方法をご紹介します。     
ここでは温度センサーから温度データをCloud環境へ送信するシナリオとして説明します。   

## 環境紹介
■Cloud側
* Alibaba Cloud国際サイト日本リージョンを利用しました。
中国サイトのほうがIoT関連のプロダクトが充実ですが、デバイス接続だけであれば、国際サイトでも十分です。

■Device側
* MacBook + JavaLinkKitDemo。実デバイスは不要

必要ものは以下のリンクから入手できます。 
* JavaLinkKitDemo.zip　
* JavaIDE:IntelliJ IDEA
* JDK 8 and JRE 8

ちなみに、国際サイトと中国サイトのコンソール画面は以下です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20191128172723.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20191128173112.png "img")


## 概念紹介
■Thing Model
Alibaba IoT PlatformはThing Modelを用いて、物理デバイスの抽象化を行います。
* Productは物理デバイス類を定義する
* Featureは物理デバイス類の属性および振る舞いを定義する
* DeviceはProductを継承し、その物理デバイス類に属する１つの実物を表現する


Featureは更に、３つの分類があります。  
* Properties：物理デバイス類の属性を定義する（例えば、センサーが取れる情報の種類、温度、湿度など）     
* Serivces：物理デバイス類の振る舞いを定義する    
* Event：運用観点で分析、監視したいデータを定義する。さらに、Info,Alert,Errorとのサブ種類が付いている    

Object Oriented Programmingの考え方で例えすると、
```
Product = Class
Feature:Properties =Properties
Service = Method
Device = Instance
```
の感じですね。   


■識別子と認証
Thing Modelを用いて定義したモデルの識別子は以下となります。   
```
Product：ProductKey
Feature：Identifier
Service：Identifier
Device：Identifier
```
 
参考として、上記Thing Modelの方法論を標準化を推進するICAという組織があります。    

> https://www.ica-alliance.org/alliance


サイトにおいて定義済みのモデルの確認とJsonファイルをダウンロードします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121145941.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121145901.png "img")


## 操作手順
①国際サイトのIoT Platformのコンソール画面からデバイス管理のプロダクトメニューを選定します。    

> https://iot.console.aliyun.com/　

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121092346.png "img")

②下記の手順に従って温度計デバイスを作成する

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121093225.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121093459.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121093954.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121094008.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121094358.png "img")

③上記デバイス作成後、デバイス詳細画面にてDevice Secretを確認します。    
 
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121123752.png "img")

④Javaを改修

device_id.jsonに接続に必要な情報を反映します。    
※プロダクト詳細画面、デバイス詳細画面にて結果を確認することができます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121124334.png "img")

プロパティ値をtest_case.jsonに記載します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121130528.png "img")

送信先をTokyo Regionにするように、DeviceInfoData.javaのregionを修正します。    

```
public String region = "ap-northeast-1";
```

Helloworld.javaを実行します。   
※そのまま実行すると、test_case.jsonの値をIoT PFへ送信します。


⑤結果確認
testDeviceがIoT  PFと通信できて、「オンライン」となりました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613500633700/20200121131203.png "img")


## まとめ
以上で、Alibaba Cloud の IoT Platformを使って、簡単にデバイスの作成と接続方法をご紹介しました。         
デフォルト機能として、Quick Startも提供されています。SDKのDemoも自動生成れるため、プログラミングに慣れていない方にもおすすめです。     

