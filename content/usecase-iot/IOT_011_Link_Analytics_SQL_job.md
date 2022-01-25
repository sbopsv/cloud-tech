---
title: "Link AnalyticsでSQLジョブ"
metaTitle: "Link AnalyticsのSQLジョブを作って見ました"
metaDescription: "Link AnalyticsのSQLジョブを作って見ました"
date: "2020-03-13"
author: "SBC engineer blog"
thumbnail: "/IoT_Platform_images_26006613530397700/20200304123446.png"
---

## Link AnalyticsのSQLジョブを作って見ました

# はじめに

本記事では、Link AnalyticsのSQLジョブを通じて、デバイスから上がってきたデータをSQLでフィールターをかけて、APIとして外部に公開する方法をご紹介します。

# プロダクト紹介

Link Analyticsは、IoT開発者向けのAlibaba Cloudのデータ分析サービスです。デバイスデータのストレージ、クリーニング、分析、視覚化を機能を提供します。開発者が手軽にデータ分析を実現でき、とても便利なサービスとなります。

以下中国サイトのプロダクト紹介リンクです。

[Link Analytics](https://help.aliyun.com/document_detail/110874.html?spm=a2c4g.11186623.6.542.750b71d4NDBAHz)
> https://help.aliyun.com/document_detail/110874.html

# 環境紹介

Alibaba Cloudの中国サイトです。Link Analyticsは日本サイトにはリリースしていません。

# 手順

1.デバイスを定義

2.Link Analyticsのデータ開発画面を開く

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304121906.png "img")      

3.開発ジョブを新規作成

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304122003.png "img")      

4.SQLを作成

プロダクトを定義したら、プロダクトテーブルが自動生成されます。

SQLの検索先テーブルをそれに設定可能です。

テーブル名は${}の文字列となります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304122441.png "img")      

今回は温度を取得するジョブである為、getTempertureに設定しています。

※SQLの文法は[Flink](https://www.alibabacloud.com/cloud-tech/doc-detail/103076.html?spm=a2c5t.10695662.1996646101.searchclickresult.7f9d4984susJqJ)参照
> https://www.alibabacloud.com/cloud-tech/doc-detail/103076.html

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304122153.png "img")      

5.APIを新規作成します

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304122535.png "img")      

名前を指定し、紐付くSQLジョブを選択

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304122951.png "img")      

APIのPath,Request Parameter,Response 型定義は設定可能

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304123207.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304123238.png "img")      
  

6.作ったAPIをテスト

値のところにデバイス名を入力し、青い実行ボタンを押すと、APIを呼び出します。

リクエスト詳細および戻り値を確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304123412.png "img")      


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304123446.png "img")        

7.テスト後APIをリリース

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200304123617.png "img")      

※APIの利用について

SDKとAcessKeyが必要となります。

使い方は中国サイトの[ドキュメント](https://www.alibabacloud.com/cloud-tech/doc-detail/103076.html?spm=a2c5t.10695662.1996646101.searchclickresult.7f9d4984susJqJ)を参照

> https://www.alibabacloud.com/cloud-tech/doc-detail/103076.html

# 最後に
データの収集、保存、API公開、および認証等一連の流れはLink Analyticsで簡単に実現できました。
総じて、Link AnalyticsはIoTのデータ分析に活用できるサービスだと思っています。
参考に頂ければ幸いです。




