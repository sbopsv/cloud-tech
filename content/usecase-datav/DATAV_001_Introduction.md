---
title: "DataVの紹介"
metaTitle: "インパクトのあるダッシュボードを作るならDataV #1 紹介編"
metaDescription: "インパクトのあるダッシュボードを作るならDataV #1 紹介編"
date: "2019-07-04"
author: "SBC engineer blog"
thumbnail: "/DataV_images_17680117127213200000/temp1.gif"
---

## インパクトのあるダッシュボードを作るならDataV #1 紹介編

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/astronomy.png "img")


本記事では、DataVについてをご紹介します。

# DataVとは
DataVを一言でいうと、データをグラフや地図を使って視覚的に見せるWEB画面（ダッシュボード）がブラウザで作成できるツールです。

例えば、センサーで読み取った室内の温度情報や、ECサイトの売上情報などをモニターに映して見せたい時などに使われます。

# BIツールとの違い
DataVはあくまでもダッシュボードに特化しています。

世にあるBIツールの多くは、ある程度まとまったデータを抽出し、そこから様々な角度でグラフなどを作成して、可視化しますが、DataVはユーザがダッシュボードにアクセスした際に、データベースやAPIサーバからデータを抽出し、あらかじめ決めた表示条件でグラフなどを描画します。

どちらかと言うと、DataVはWEBフロントエンドアプリを作れるSaaSに近いイメージだと個人的には捉えています。

# 提供エディションと価格
Alibaba Cloudアカウントがあれば以下の3つのエディションが選択可能です。
<i>※ 2019.7時点の情報です</i>

*  ・ベーシックエディション（年間¥41,400）

*  ・エンタープライズエディション（年間¥345,000）※月払い可能

*  ・開発（Beta版）エディション（価格未定）

DataVでは１プロジェクトにつき１ダッシュボードが開発可能で、ベーシックは５プロジェクト、エンタープライズは２０プロジェクトまでの制限があります。
作成したダッシュボードの閲覧数には制限がありません。何アクセスでも可能です。

また、エディションによって、連携できるデータソースの種類と、利用できるウィジェットが異なります。本記事で後述していますが、エンタープライズは3D地図が利用できるので、価格はベーシックより高いですがお薦めです。

価格と機能差分の詳細は以下からご確認ください。   
> https://www.alibabacloud.com/product/datav



# テンプレート
では、DataVを使うとどの様な画面が作成できるのか、プロジェクト作成時に選択可能なテンプレート画面の一部を紹介します。
<i>※契約したエディションによって使用できるテンプレートが異なります</i>
          

物流状況を可視化したテンプレートです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_17680117127213200000/temp1.gif "img")


こちらはECサイトの売上情報と配送状況を可視化したテンプレートです。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_17680117127213200000/temp2.gif "img")

          

こちらも同じくECサイト系ですが、Alibabaグループのイベント（ダブルイレブン）をイメージしたものです。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_17680117127213200000/temp3.gif "img")


そして、こちらはモバイル用に縦長の画面サイズに合わせたテンプレートです。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_17680117127213200000/temp4.gif "img")


テンプレートは選択せずにゼロからオリジナル画面を作成することも可能です。

また、例では中国が中心の地図になっていますが、緯度経度で中心を他の場所に指定できるのでご安心ください。（縮尺も指定できます）

## グラフウィジェット
また、DataVでは標準で多種多様なグラフウィジェットを用意しています。
ドラッグ&ドロップで配置をして、データをセットすれば利用可能です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_17680117127213200000/graf1.gif "img")


# 地図ウィジェット
地図ウィジェットは、地図を一つ入れるだけでテンプレートのようなインパクトのあるビジュアルになります。
提供プランによりますが、地図は以下の３種類から選択可能です。

<b>基本平面マップ</b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_17680117127213200000/map1.gif "img")


<b>3D地球マップ</b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_17680117127213200000/map2.gif "img")
          

<b>3D効果付きフラットワールドマップ</b>
<i>※サイズの関係でキャプチャのみです</i>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_17680117127213200000/map3.png "img")



# まとめ
今回はDataVでどのような画面が作れそうかをイメージをしてもらうために、テンプレートやウィジェットのイメージを中心に紹介させていただきました。






