---
title: "JP1・AJS3導入検証"
metaTitle: "AlibabaCloudでのミドルウェア導入検証【JP1/AJS3編①】～実装内容の検討～"
metaDescription: "AlibabaCloudでのミドルウェア導入検証【JP1/AJS3編①】～実装内容の検討～"
date: "2019-10-08"
author: "SBC engineer blog"
thumbnail: "/3rdParty_images_26006613446336000/20191007201046.png"
---

## JP1・AJS3導入検証


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613446336000/20191008140827.png "img")      

# はじめに
本記事では、Alibaba CloudにてJP1/AJS3（Version 12）らミドルウェアの導入検証についてご紹介します。

検証するミドルウェアは<a href="http://www.hitachi.co.jp/Prod/comp/soft1/jp1/product/jp1/list/ajs/index.html">【JP1/AJS3（Version 12）】</a>です   

JP1/AJS3の詳細な説明については、割愛しますが、  
今回の検証では、<span style="color: #ff0000"><b>カレンダ定義/スケジュール定義</b></span>を使用した<span style="color: #ff0000"><b>定期的なジョブ実行</b></span>を検証します。  


# 検証内容  
検証内容は、下記の2点です。  

* ● 環境起動  
　① 平日の10:00にAutoScalingの台数を2台に変更し、サーバ（ECS）を起動します。  
　② ECSが正常に起動したことを確認します。  
　③ ECSが正常にサービスインしていることをロードバランサー（SLB）のヘルスチェックにて確認します。  

* ● 環境停止  
　① 平日の18:00にAutoScalingの台数を0台に変更し、サーバ（ECS）を削除します。  
　② ECSがロードバランサー（SLB）の管理下から外れたことを確認します。  
　③ サーバ（ECS）が正常に削除されたことを確認します。  

* ■ JP1/AJS3を使用するメリット  
　ECSの起動/停止については、AutoScalingの<span style="color: #ff0000">台数変更にて実施</span>します。  
　AutoScalingの台数変更については、<span style="color: #ff0000">設定値の変更を実施するのみ</span>であるため、  
　ECSが正常に起動/停止しているのかは<span style="color: #ff0000">別途確認する必要があります</span>。  
　そこで、<span style="color: #ff0000">ジョブを使用し</span>、AutoScalingの台数変更から確認までの<span style="color: #ff0000">一連の処理の流れが正常に実施されていること</span>を確認します。  

# サーバ構成  
* ● ジョブサーバ構成について  
　<span style="color: #ff0000">JP1-AJS-View</span> ⇒ <span style="color: #ff0000">JP1-AJS-Manager</span> ⇒ <span style="color: #ff0000">JP1-AJS-Agent</span>の構成を作り、ジョブが実行できる環境を作成します。  
　また、JP1-AJSをインストールしているそれぞれのサーバには、<span style="color: #ff0000">JP1-Base</span>を導入します。  
　なお、ジョブに使用するスクリプトはJP1-AJS-Agentに配置します。  

* ● ジョブ実行対象の環境について  
　SLB ⇒ AutoScaling（ECSx2）の構成にて、試験環境を作成します。  
　AutoScalingの台数を操作し、環境の起動/停止を実現します。  
　  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613446336000/20191007201046.png "img")      

## ジョブのフロー  
環境の起動停止について、下記のジョブフローで検討しました。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613446336000/20191007202049.png "img")      

# ジョブネット構成  
作成するジョブネットは下記の通りとします。  

* ● 環境起動  
　AutoScalingにてECSの台数を2台とし、AutoScalingの起動確認、SLBのヘルスチェック確認を実施します。  

* ● 環境停止  
　AutoScalingにてECSの台数を0台とし、SLBのヘルスチェック確認、AutoScalingの停止確認を実施します。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613446336000/20191007201113.png "img")      



# 次回記事について   
本記事では、JP1/AJS3を使用して、どのようなジョブを実装するのかを検討しました。  
次回の記事では、実際に構築された環境を使用して、ジョブの動作確認を実施します。  



