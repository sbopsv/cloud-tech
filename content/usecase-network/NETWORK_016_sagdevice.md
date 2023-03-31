---
title: "SAGデバイスのご紹介"
metaTitle: "中国拠点のNW運用負担削減に！？SAGデバイス（Smart Access Gateway）のご紹介"
metaDescription: "中国拠点のNW運用負担削減に！？SAGデバイス（Smart Access Gateway）のご紹介"
date: "2020-09-14"
author: "sbc_saito"
thumbnail: "/Network_images_26006613617631600/20200910164037.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 中国拠点のNW運用負担削減に！？SAGデバイス（Smart Access Gateway）のご紹介

# はじめに

本記事では、Alibaba CloudのEnd to Endのネットワーク展開プロダクトである「Smart Access Gateway（SAG）」の「SAGデバイス」に焦点を当てて、ご紹介します。


# SAGデバイスとは
SAGデバイスをひと言でいうならばAlibaba Cloudマネージド型のルータとなります。     

手配→設定→運用→監視を一貫してAlibaba Cloud上で行えるのが特徴なので、中国の拠点にSAGデバイスを置いて**日本からリモートで拠点展開や管理が可能となります！**    

4G LTE回線にも対応しているのでバックアップ回線として使用したり、出先拠点用のメイン回線として使用することも出来ます。    

SAGデバイスにはエントリーモデルの「SAG-100WM」と上位モデルの「SAG-1000」の2つの種類があります。それぞれの違いは以下の表をご覧ください。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200914113841.png "img")    


また、現在リリースされているエリアは中国本土、香港、シンガポール、クアラルンプール、ジャカルタの5エリアとなります。    

# ネットワークアーキテクチャ
続いてSAGデバイスのネットワークアーキテクチャについてご紹介致します。    
これまでのVPN Gatewayプロダクトとは構造が大きく変わります！    

SAGデバイスはAlibaba Cloudと通信をする際はCloud Connect Network(以下CCN)を経由して接続します。    

CCNとは、分散アクセスポイント(POP)で構成されるSAGプロダクトの基盤コンポーネントであり、アクセスポイント&ハブの様な役割とご認識いただければと思います。   

また、CCNとVPCで取り扱うことが出来るリージョンには差異があります。   
例えば中国本土で比べてみましょう。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200910163337.png "img")    


一見、中国本土で取り扱えるリージョンがCCNだと1リージョンに対し、VPCだと10リージョンと数字だけで見るとCCNが不利なように見えますが、CCNは複数のPOPで構成されており、中国大陸だけでも数十POPあります。さらにSAGプロダクトは最寄りのPOPに自動接続する仕様のため、実際には**Alibaba Cloudへの出入り口の数の多さはCCNの方が数倍以上優れていますし、低遅延なVPN接続が可能です！**    

ただしこのCCNリージョン上にはVPCのようにECSなどのAlibaba Cloudリソースを作成することは出来ません。そのため例えばSAGデバイスからECSに接続したい場合は、VPCにECSなどのAlibaba Cloudリソースを作成し、CCNリージョンとそのVPCをCENで繋げることでSAGプロダクトからリソースへのアクセスを可能にします。     


下記図のような接続イメージです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200910164037.png "img")    



# 導入ロールプレイング

ここからは実際のコンソール画面もご紹介しながらSAGデバイスの導入ロールプレイングをしていきます。    
SAGデバイスを導入する流れをザックリとイメージしていただければ幸いです！    

それでは早速、中国本土の拠点にSAGデバイスのSAG-100WMを1台導入する想定で進めていきましょう。    



# SAGデバイスの購入
まずはSAGデバイスを購入しましょう。    
Alibaba Cloudコンソールから購入が可能です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200910171406.png "img")    

* ①購入エリア →「Mainland China」を選択    
* ②デバイスタイプ →「SAG-100WM」を選択    
* ③デバイスを既に所有しているか →「No」を選択    
* ④デバイス数量 →「1」を選択    
* ⑤インスタンス名 →任意     
* ⑥SAG帯域幅パッケージ →「2Mbps」を選択      
* ⑦SAG帯域幅パッケージ契約間隔 →「1 Year」を選択    

確認後、購入ボタンを押下します。    
続いて配送先住所を求められますので中国国内の配送先住所を入力します。     
※コンソール言語を「中国語」に切り替えないと正しく購入処理されない可能性がありますので、切り替え推奨です     
すると2~3日営業日以内にSAGデバイスが発送され、指定の住所に届けられます。    
同時にAlibaba Cloud上にSAGインスタンスが新たに作成されますが、これは後ほど設定します。    



# SAGデバイスの設置
数日後、SAGデバイスが到着しました！    

SAG-100WMはものすごいコンパクトですね。しかもファンレス設計なので非常に静かです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200914112651.jpg "img")    



新規でネットワークを導入する場合は、電源ケーブルの接続、インターネットへ繋がるWAN、クライアントへ繋がるLANを接続いただければもう準備は完了です。   
4G LTE回線を使用する場合はSIMカードをスロットに挿入します。   
※初期内蔵SIMカードでは業務通信が行えません。機器設定のみとなります。   

既存のネットワーク環境がある場合は、上位のFWやルータ等に以下の追加設定をして、SAGデバイスが中国インターネットに出れるように設定をお願い致します。   

> ポート開放：
```
  * DNS	　　     TCP53/UDP53
  * HTTPS　　　TCP80/553
  * 制御用	　TCP8443
  * ICMP	　　　ALL
  * IPsec-VPN	　UDP500/4500	
```

> 機能除外設定
```
   * Flooding Attack検知(UDP/ICMP)
   * 速度制限/帯域制限
```

# SAGデバイスの設定

SAG-100WMの本体シリアル番号を確認します。    
そのシリアル番号をAlibaba Cloudと紐付けることで、Alibaba Cloudコンソール上から設定が可能となります。    
シリアル番号の入力は、SAGデバイス購入時に作成されている、SAGインスタンスの画面を開いて行います。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200910195440.png "img")    


シリアル番号を入力したら、SAG-100WMとSAGインスタンス間で同期が開始し、設定が可能な状態となります。     
SAGインスタンスはいわば、SAGデバイスの設定情報を格納し、SAGデバイスを管理するためのようなものですね！     

続いて、このSAGインスタンスとCCNのバインド(紐付け)を行います。    
CCNがまだ作成していない場合は、作成から始めて下さい。    

CCNを中国本土リージョン(Mainland China)で作成したら、作成したCCNの画面を開き     
[Associate with SAG]ボタンよりSAGインスタンスとのバインドを行います。     
(インスタンスIDやPublic IP等のプライベート情報は伏せさせていただいております)     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200911154352.png "img")    



続いてSAGインスタンスからネットワーク設定をしていきます。     
[Device Management]タブを開き、赤枠で囲っている項目をそれぞれ選択し、ネットワーク設定をしていただく形となります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200911131852.png "img")    


例えば以下は[Manage LAN Ports]を開き、LAN設定画面を表示しました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200914112119.png "img")    

接続タイプ、LANインタフェースIP、サブネットマスク、DHCPが設定でき、このように簡単にWeb GUIから操作が行えます。    

そのほかにWAN、PPPoE、ルーティング、Wi-Fi等それぞれ設定していただいたら、いよいよ次で最後のステップです。    


# 設定配信

SAGデバイスに設定した内容を確認します。      
通常は各設定画面でOKボタンを押下すると自動でSAGデバイスへ設定配信がされますが、ここではSAGデバイスに設定された内容を再度Alibaba Cloudコンソール側に読み込み、正しく設定されているかを確認します。    

設定は極めて簡単で、SAGインスタンスの[Device Management]タブにある[Synchronize Settings to Console]ボタンをポチッと押下すると即座に設定同期されます。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200910202053.png "img")    


これでデバイスの展開は完了です！    
また既にSAGインスタンスとCCNはバインドしてあるので、あとはこのCCNにCENをアタッチさせてあげれば、CENを介して他のCCNやVPCと通信することも可能です！     

# 最後に

導入ロールプレイングを通じてSAGデバイスの強力なデリバリー能力をイメージ頂けましたでしょうか。      

**日本からリモートで中国拠点のNWルータの手配から運用まで出来る**という、魅力のあるプロダクトとなっており小~中規模の中国拠点がある環境にピッタリです。

より詳細な導入・運用手順はAlibaba Cloudドキュメントセンターをご確認ください。     

> https://www.alibabacloud.com/cloud-tech/ja/product/68086.htm



![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613617631600/20200911155517.png "img")    




<CommunityAuthor 
    author="斎藤 貴広"
    self_introduction = "2020年からAlibaba Cloudのソリューション開発や技術支援に従事。ネットワークや基盤などのインフラ回りがメイン領域で、最近はゼロトラストセキュリティやWeb系もかじり中。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/saito.png"
    githubUrl=""
/>



