---
title: "Link AnalyticsでBIM"
metaTitle: "Link AnalyticsでBIMを作って見た"
metaDescription: "Link AnalyticsでBIMを作って見た"
date: "2020-03-13"
author: "SBC engineer blog"
thumbnail: "/IoT_Platform_images_26006613530398500/20200305110359.png"
---

## Link AnalyticsでBIMを作って見た

# はじめに

本記事では、Link Analyticsの3D可視化機能を使った、シンプルな[BIM](http://bim-design.com/about/index.html)デモを作成しましたので、その内容をご紹介します。

# プロダクト紹介

Link Analyticsは、IoT開発者向けのAlibaba Cloudのデータ分析サービスです。デバイスデータのストレージ、クリーニング、分析、可視化を機能を提供します。可視化に関しては、2Dマップ、3Dモデルなど可視化機能を提供しています。

以下中国サイトのプロダクト紹介リンクです。

[Link Analytics](https://help.aliyun.com/document_detail/110874.html?spm=a2c4g.11186623.6.542.750b71d4NDBAHz)

# 環境紹介

Alibaba Cloudの中国サイトです。

Link Analyticsは日本サイトにはリリースしていません。

# 触って見た内容

1.下記メニューを開けば、Link Analyticsの3D機能が出てきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305110359.png "img")      
 

2.初期画面にDemo Videoが用意されています

プロダクトの紹介と使い方の説明を話してくれますが、[ドキュメントサイト](https://help.aliyun.com/document_detail/106174.html?spm=5176.11485173.0.0.169259afbKQboN)に同じビデオを見れます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305110707.png "img")      
  

3.モデル作成ツールとDemoのリンクも用意されています

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305110929.png "img")      

上記ボタンをクリックすると、CampusBuilderというWindows版ツールがDLされます。

ちょっと調べて見たら、[ThingJS社](https://www.thingjs.com/guide/)が提供したツールでした。

ThingJS社のサイトに行くと、沢山のおもしろい素材が見つかりました。

例えば、各種編集ツール

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305111414.png "img")      


そして、いくつかの可視化公開Project

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305111526.png "img")      


コロナウイルスの速報画面はこんな感じ。色々活用されていますね。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305111559.png "img")      


4.編集済みのDemoモデルはzipファイルでDLできます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305111909.png "img")      


5.BIMのDemoも用意されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305112046.png "img")      


中に入ると、ビルの３Dモデルが表示されました。クリックしたら、中のオフィスが表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305112245.png "img")      


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305112746.png "img")      


ズームしたり、特定の場所、ものを見たりできます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305112843.png "img")      


デバイスとの紐付きを試したら、失敗しました。読み取り専用は原因だと思っています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305113039.png "img")      


6.プロジェクトを新規作りました。

初期に使いそうなプロダクトを指定できます。

権限は「読み取り専用」と「書き込み可」２種類選択可能。

3Dモデルは「オンライン編集」と「ローカル編集」２種類選択可能。

今回は、「書き込み可」と「オンライン編集」にしました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305113157.png "img")      


7.オンラインに3Dモデルを編集できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305113629.png "img")      


編集に使えるのは、CampusBuilder Online(beta)版です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305113726.png "img")      


8.デバイスと紐付けます。

※デバイスの作成方は[別記事](https://www.sbcloud.co.jp/entry/2020/01/21/150154)参考

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305113858.png "img")      


9.3D画面の動作を細かく制御には「JS開発」使えます。  
今回は使わずに、機能を確認するだけでした。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305114200.png "img")      


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305114246.png "img")      


10.動作確認

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305114346.png "img")      


プレビュー画面に、デバイスを見つかって、スイッチのOn,Offを操作して見ました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305114508.png "img")      


デバイスの通信ログを見たら、ちゃんと動きました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305114603.png "img")      


11.ページ公開方法を確認

公開する際に、「認証なし」と「認証あり」２種類選択できます。

認証ありの方は、中国の電話番号が必要で、SMSコードで認証します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305114725.png "img")      


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305114921.png "img")      


認証なしで試したら、無事アクセスできました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398500/20200305115030.png "img")      


# 最後に 
Link Analyticsを使って、3Dモデルの作成、デバイスとの紐付け、およびWeb公開をする方法をご紹介しました。    
BIM開発は非常に簡単なので、ぜひ参考に頂ければ幸いです。      
