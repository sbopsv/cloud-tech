---
title: "Link Analyticsで地図可視化"
metaTitle: "Link Analyticsの地図可視化を触って見た"
metaDescription: "Link Analyticsの地図可視化を触って見た"
date: "2020-03-13"
author: "SBC engineer blog"
thumbnail: "/IoT_Platform_images_26006613530398100/20200311114742.png"
---

## Link Analyticsの地図可視化を触って見た

# はじめに

本記事では、Link Analyticsによる、地図上での2D可視化機能について設定方法をご紹介します。     

# プロダクト紹介

Link Analyticsは、IoT開発者向けのAlibaba Cloudのデータ分析サービスです。デバイスデータのストレージ、クリーニング、分析、可視化を機能を提供します。可視化に関しては、2Dマップ、3Dモデルなど可視化機能を提供しています。

以下中国サイトのプロダクト紹介リンクです。

[Link Analytics](https://help.aliyun.com/document_detail/110874.html?spm=a2c4g.11186623.6.542.750b71d4NDBAHz)
> https://help.aliyun.com/document_detail/110874.html


# 環境紹介

Alibaba Cloudの中国サイトです。

Link Analyticsは日本サイトにはリリースしていません。

# 手順

1.デバイスを定義

2.デバイスの詳細画面に入り、タグを編集します

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304134116.png "img")     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304134248.png "img")     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304134504.png "img")     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304134729.png "img")     

3.地図上で確認

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304140429.png "img")     

新規作成時に、データリソースをIoT Platformに選択

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304140504.png "img")     

表示対象はプロダクト、もしくはデバイスクループ単位で可能です。

データの権限は、読み取り専用と書き込み可２種類選択可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304140559.png "img")     

デバイス選択をしたら、地図上にデバイスの位置が現れました 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304140809.png "img")     

4.色々表現形式を変えてみる     

* 地図を衛星図にする可能
* ヒットマップとしても表示可能

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304141121.png "img")     

5.公開する※ユーザーがIoT Platformにログインせずに、一般のWebページとして参照可能    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304141452.png "img")     

効果はこんな感じです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200304141602.png "img")     

6.上記はデバイス数が少なく、わかりにくいですが、デバイス数を増やすと、下記のようになります。気象観察のセンサーや、シェアリング自転車など、地理上にデバイスを可視化するときに活用できます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200311114742.png "img")     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530398100/20200311114847.png "img")     

# 最後に
本件、Link Analyticsによる、地図上での2D可視化機能について設定方法をご紹介しました。    
Link Analyticsによる、地図上での2D可視化機能は、上記以外に面白い機能が色々付帯されています。    

* デバイスの地理情報をExcelで一括更新
* デバイスの情報をセンサーデータとして更新
* 特定の範囲からであたらアラームをあげる（GEO Fencing）
* ルート追跡

総じていえば、位置データさえあれば、地図上への表現はLink Analyticsへ任せることができます。ご参考に頂ければ幸いです。


