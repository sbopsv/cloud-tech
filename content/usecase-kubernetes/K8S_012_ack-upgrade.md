---
title: "ACKをアップグレードしよう"
metaTitle: "Container Service for Kubernetes (ACK)をアップグレードしよう❗️"
metaDescription: "Container Service for Kubernetes (ACK)をアップグレードしよう❗️"
date: "2019-07-01"
author: "sbc_y_matsuda"
thumbnail: "/Container_images_17680117127198400000/20190612172152.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Container Service for Kubernetes (ACK)をアップグレードしよう❗️

# はじめに


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190626150321.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190626150438.png "img")    


6月は KubeCon China 2019 もありましたし、定期リリースのKubernetes 1.15 もリリース（2019年6月19日（米国時間））されましたね😄  

> https://kubernetes.io/blog/2019/06/19/kubernetes-1-15-release-announcement/

個人的にはAlibaba Cloud Container PlatformチームがオープンソースとしてKubeCon Chinaで発表した[OpenKruise](https://openkruise.io/en-us/)が気になりますね🤔   

色々と気になるネタも多いKubernetes界隈ですが、今回はITに置いて避けては通れないアップグレードに関して、Alibaba Cloud Container Service for Kubernetes (ACK) のアップグレード方法をご紹介したいと思います。


アップグレード手順は公式ドキュメントでも公開されていますが、手順にはない部分での注意点やポイントなどご紹介させて頂きたいと思います❗️

> https://www.alibabacloud.com/cloud-tech/doc-detail/86497.htm


    


<!-- more -->


# Container Service for Kubernetes のアップグレード

ACKのアップグレードは手動でアップグレードの開始を行う必要がありますが、実行を選択するだけで<span style="color: #ff0000">アップグレード処理自体は自動的に実施されます</span>😊   

なお、現状日本サイトで提供しているDedicated タイプ（Master Node 有り）のACKではMaster、Worker共に手動での更新実行が必要になります。   
残念ながらスケジュール実行の機能は提供しておりません😣

ℹ️管理コンソールのデザインが旧コンソールになっていますが、手順に違いはありません。  

ACKで利用可能なKubernetesのバージョンはAlibaba Cloudのプロダクトチームにより管理されています。    
利用可能なKubernetesのバージョンがAlibaba Cloudで公開されるとACKのクラスターリスト画面にて「クラスターのアップグレード」に下図のような🔴が表示されます。  
※ 該当のクラスターで現在使用中のバージョンよりも新しいバージョンが利用可能な場合に表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612171526.png "img")    


「クラスターのアップグレード」を選択すると下図の様に「アップグレード可能なバージョン」が表示されます。  
<span style="color: #ff0000">アップグレード可能なバージョンはACKの提供する最新バージョンへのアップグレードのみとなります。 
</span>  
また、連続したバージョンでなくてもアップグレードが可能です。

ℹ️タイミングによりバラツキはありますがKubernetesの最新リリースから1~2バージョン前のマイナーバージョンでのご提供です。   
　本記事執筆時点ではバージョン1.12でのご提供となっています。近々新しいバージョンが提供されるかと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612172152.png "img")    



「確認」を選択することでアップグレード処理が開始されます。  
あとは正常に終了するのを待つだけです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612172404.png "img")    



# アップグレードが実行できない場合

アップグレードを実行した際に下図の様なエラーが発生することがあります。  
とても分かりにくくて申し訳ないのですがメッセージ内に必要な作業が記載されていることがあります😓  
下図でいうと`Please update your terway to newest version.`と表示されている部分が該当します。  
<span style="color: #ff0000">※ どうしたら良いか判らない場合はエラーメッセージの内容を添えてサポートにお問い合わせください。
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612173551.png "img")    


先程のエラーは`terway`をアップデートしろとなっていましたのでその作業を行います。  
ℹ️`terway` はAlibaba Cloud の開発したCNI Network Pluginです、詳しくは下記のリンクをご覧ください。

> https://www.alibabacloud.com/cloud-tech/doc-detail/97467.html

> https://github.com/AliyunContainerService/terway

クラスターリスト画面にて「アドオンのアップグレード」を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612173858.png "img")    


ACK用のコンポーネントが表示されますので必要なもの、今回ですと`terway`のアップグレードを選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612175753.png "img")    


確認画面が出ますので「確認」を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612182522.png "img")    


アップグレードが完了すると対象のコンポーネントが「最新」になります。  
画面を閉じて再び「クラスターのアップグレード」を実施して下さい。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612182843.png "img")    


# 正常にアップグレードが出来る場合

正常に開始できた場合、以下の様な画面が表示されアップグレードが実行されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612183200.png "img")    


アップグレード実行中にノードの状態を確認してみます。`kubectl get nodes` でノードのステータスが確認できます。  
一斉にアップグレードが実施される訳ではなく、ローリングで各ノードのアップグレードが実施されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612183646.png "img")    


この時はMaster Node ３台、Worker Node ４台の計７台のアップグレードでしたが10分ほどで完了しました。  
<span style="color: #ff0000">※アップグレード中はMaster が命令を受け付けないので、Node追加やDeploymentなどが実施できません。
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612184425.png "img")    


`kubectl get nodes` でノードのステータスを確認すると全てのノードのVersionが更新されています。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190625173811.png "img")    


<span style="font-size: 150%">ACKのアップグレード作業は以上になります。  
思っていたより簡単だったのではないでしょうか？
</span>

# アップグレードのポイント整理

アップグレードのポイントに関して最後に簡単にまとめたいと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190628181243.png "img")    


# 最後に

如何でしたでしょうか？  
Kubernetesのアップグレードは大変なイメージがありますが、ACKでは簡単に実現できたのではないでしょうか😊  
Alibaba CloudのKubernetes Serviceは管理コンソールから使い易く出来ている部分が多く、Kubernetesが初めてでも比較的使い易く、運用しやすいサービスではないかなと思います。

Kubernetesを使ってみたいけど難しそうと思っていた方も、是非使ってみてください🤗


 <CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>




