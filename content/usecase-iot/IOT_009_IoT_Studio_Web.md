---
title: "IoT StudioでWebページ作成"
metaTitle: "IoT StudioでWebページを作ってみました"
metaDescription: "IoT StudioでWebページを作ってみました"
date: "2020-01-23"
author: "SBC engineer blog"
thumbnail: "/IoT_Platform_images_26006613501570500/20200123165009.gif"
---

## IoT StudioでWebページを作ってみました


# はじめに

本記事では、IoT StudioでWebページを作ってみる方法をご紹介します。       

このシナリオとしては、オフィスの温度を確認、ライトをコントロールするシンプルなページです。      
電球をダブルクリックしたら、ライトデバイスをon/offする、温度をリアルタイムに表示することを下記のように実現できました。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123165009.gif "img")

その内容を紹介します。

# 環境紹介

Alibaba Cloudの中国サイトです。IoT Studioは日本サイトにはリリースしていません。

# プロダクト紹介

IoT Studio（以前のLink Develop）は、Alibaba Cloudが提供するIoT開発ツールです。Webページ開発、サービス開発、モバイルアプリ開発機能を提供します。

特徴としては、ドラッグアンドコンフィグで多くの機能を開発できること、そして、Alibaba Cloud IoT Platformと連動できること。

IoT Studioを利用すれば、IoTアプリの開発工数を大幅に削減できます。 

# 手順

1.デバイスを定義

2.IoT Platformのコンソール画面でIoT Studioのプロジェクトを作成

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123172518.png "img")      

3.Web可視化開発のWeb Appを作成

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123172622.png "img")      

4.ページを作って、背景をOfficeの画像にする。デフォルトのHome-pageでも良い。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123172842.png "img")      

5.文字、図形、画像を使って、電球や、温度計の枠を設置

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123173031.png "img")      

6.電球イメージの動作を定義する

* 電球offのイメージをクリックすると、電球onのイメージを表示し、デバイスのプロパティをonにする
* 電球onのイメージをクリックすると、電球offのイメージを表示し、デバイスのプロパティをoffにする

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123173420.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123173432.png "img")      

7.温度文字をデバイスの温度に紐付く

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123173733.png "img")      

8.電球イメージの配置を調整後、ページをプレビュー

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123173649.png "img")      

9.プレビューページで動作確認する

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123165009.gif "img")     

* 電球の切り替えは無事動作できている
* 温度もリアルタイムに変わっている
* 電球のon/offの通信履歴は確認できている  
※IoT Platformの画面でデバイス通信結果を確認

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613501570500/20200123174500.png "img")      



# 最後に
上記、IoT StudioでWebページを作ってみる方法をご紹介しました。     
IoT StudioはIoT Webページを即時作成し、公開できるのはとても便利だと思います。ご参考に頂ければ幸いです。
