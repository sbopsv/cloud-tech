---
title: "VPN GatewayにIPsecで接続"
metaTitle: "VPN Gatewayに拠点ルータからIPsecで冗長接続してみる"
metaDescription: "VPN Gatewayに拠点ルータからIPsecで冗長接続してみる"
date: "2020-09-16"
author: "SBC engineer blog"
thumbnail: "/Network_images_26006613628265000/20200916172346.png"
---

## VPN GatewayにIPsecで接続

## はじめに

本記事では、拠点オフィスからインターネット回線2本を使ってVPN Gatewayと冗長接続させる方法と、後半はVPN Gatewayのヘルスチェックの設定のコツをご紹介します。

## 構成概要

今回はテストでVPN Gatewayを東京リージョンに立てて、拠点ルータはNEC IX2215を使用します。拠点ルータは2台使ってVRRPで冗長化していますが、ルータ1台で回線2本といった場合も考え方は同じです。ちなみにVPN Gatewayですが、１インスタンスでも內部で冗長構成となっており、切り替わりも自動で行われます。

![基本構成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916172346.png "img")      


## 基本設定

事前に、VPC、vSwitchを作成し、VPN Gatewayを購入します。

VPN GatewayのIPsec接続の設定方法や他社ルータのサンプルコンフィグについては、こちらもご参照ください。
> https://www.alibabacloud.com/cloud-tech/doc-detail/140680.htm

     

VPN Gatewayを１つ購入したら、IPsec接続を１系、２系で２つ設定しそれぞれのステータスを確認していきます。

* VPN Gateway
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916115552.png "img")      

* カスタマーゲイトウェイ
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916115831.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916115852.png "img")      

* IPsec 接続の状態
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916120111.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916120148.png "img")      



## フェールオーバーの考えかた

【拠点側の構成】拠点ルータ2台にはVRRPを設定し、クライアントのデフォルトゲートウェイはルータの仮想IPであるVIPを指定するようにします。
さらにIP SLA Trackingをルータに設定し、対向のターゲットIP(ECS)にPing疎通が通らなくなったら自動的に1系のVRRPをshutdownさせ、2系にフェールオーバーするように設定します。障害ポイントが回線、機器どちらであった場合も考えかたは同じです。

![拠点側の構成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916171835.png "img")      

【クラウド側の構成】VPN Gatewayは重み付けによる経路の優先制御が可能です。100が一番大きくより優先されるということになります。今回は１系を100、２系を0の重み付けで設定します。
     
     
* VPN Gatewayのインスタンスをクリック > 宛先ベースルーティング > ルートエントリの追加 > １系と２系の経路を登録しVPCに公開

![経路の重み付け設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916125132.png "img")      

さらにそれぞれヘルスチェックを設定し、１系のヘルスチェックが失敗したら２系に切り替わるようにします。

![クラウド側の構成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916171900.png "img")      

ここで１点注意があります。上記の図を見て頂くとわかるのですが、VPN Gatewayのヘルスチェックの宛先は１系は拠点ルータのCPE01のIPを指定し、２系は拠点ルータのCPE02を指定しています。これはヘルスチェックの仕様上、往路・復路ともに同じIPsecトンネルを経由しないと状態を正しく検知できないからです。ヘルスチェックの送信元はVPN Gatewayが所属するVPCのCIDRから自由にアサイン可能で、ECSなど既にあるリソースとバッティングしても大丈夫です。     

こちらの図はヘルスチェックの宛先を拠点オフィス内のサーバに指定していますが、２系のヘルスチェックの往路がMasterルータを通ってしまうためNGになるパターンです。    

![ヘルスチェック設定の注意事項](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916172414.png "img")      



## 動作確認

東京リージョンのVPC内にあるECSから、拠点オフィス内のサーバに対してPingを打ち続けMasterルータの電源を落として切り替わり時間を計測します。

切り替わり前の経路（１系）
> [test@tokyo41 ~]# traceroute 10.1.22.1  
> traceroute to 10.1.22.1 (10.1.22.1), 30 hops max, 60 byte packets  
> 1  172.16.41.72 (172.16.41.72)  0.168 ms  0.235 ms  0.213 ms  
> 2  10.1.22.252 (10.1.22.252)  9.684 ms  14.912 ms  16.093 ms  
> 3  10.1.22.1 (10.1.22.1)  16.148 ms  16.149 ms  18.062 ms  

Masterルータの電源を落としたところ、およそ30秒で１系から２系へ経路が切り替わりました。

切り替わり後の経路（２系）
> [test@tokyo41 ~]# traceroute 10.1.22.1  
> traceroute to 10.1.22.1 (10.1.22.1), 30 hops max, 60 byte packets  
> 1  172.16.41.72 (172.16.41.72)  0.147 ms  0.153 ms  0.141 ms  
> 2  10.1.22.253 (10.1.22.253)  14.198 ms  10.981 ms  15.412 ms  
> 3  10.1.22.1 (10.1.22.1)  15.427 ms  15.432 ms  17.385 ms 

今回はタイマー等を短めに設定しましたが、実際は運用ポリシーに応じて１系・２系のフラッピングを避けるためにも切り替え時間を調整するのが良いかと思います。

     

## 設定サンプル

参考までにVPN GatewayとNEC IXルータの設定サンプルを載せます。

* VPN GatewayのIPsec 接続設定

![VPN Gateway IPsec接続の設定 1系](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916120453.png "img")      

![VPN Gateway IPsec接続の設定 2系](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916120513.png "VPN Gateway IPsec接続の設定 2系")      


* NEC IXルータの設定
![NEC IXルータの設定 Master](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916124150.png "img")      

![NEC IXルータの設定 Backu](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628265000/20200916124242.png "img")      
     

## おわりに

今回はVPN Gatewayと拠点オフィスをIPsecで冗長接続させるやり方についてご紹介しました。SPOF (Single Point of Failure)を避けるためにもオンプレミスでは回線やルータの冗長構成をとることが多いかと思いますし、クラウドに対する接続も冗長構成をとることでより堅牢なネットワークが構成可能です。




