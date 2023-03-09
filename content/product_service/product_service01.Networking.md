---
title: "01.ネットワーク"
metaTitle: "ネットワーク系プロダクトサービス紹介"
metaDescription: "Alibab Cloudのネットワーク系プロダクトサービスをご紹介します。"
date: "2021-06-01"
author: "Hironobu Ohara"
thumbnail: "/images/2.5.PNG"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## ネットワーク系プロダクトサービス紹介

Alibaba Cloudはクラウドサービスです。そのため、世界中のユーザーがAlibaba Cloudの特定リソースを利用するために独立したネットワーク環境が必要です。この独立したネットワーク環境を実現するサービスとして、VPC（Virtual Private Cloud）があります。VPCは、Alibaba Cloud上に独立したプライベートネットワーク空間を作成できるサービスです。Alibaba Cloud上のプラットフォームやSaaS、インフラクチャは世界中のAlibaba Cloudユーザー共通で利用されています。そのため、アカウント・RAMユーザー各自VPCを作成、利用することで、論理的に分割されたアカウント・RAMユーザーごとのプライベートネットワークを構築、運用することができます。


# VPC
> [Virtual Private Cloud](https://www.alibabacloud.com/product/vpc)

* VPC は Virtual Private Cloud の略称、 Alibaba Cloudに設置されたプライベートネットワークです。
* Alibaba Cloudの中の仮想ネットワークと論理的に分離されています。
* お客様専用のプライベートネットワークを作成することができます。
* VPCごとにIPアドレス（16ビット以上の任意のCIDRブロック）を自由に割り当てることができます。

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.1.PNG "Networks")

# VSwitch
* VPC内部にて更に内側ネットワークをつくり、ECSやRDSなどを起動するための領域（サブネット、小分け袋）です。
* VSwitch作成時にゾーン、CIDR Blockを指定する必要があります。
* CIDR BlockはVPCに設定したCIDRブロックに収まる範囲でのCIDRブロックを割り当てます。
* １つのVPCにつき24のVSwitch、1つのVSwitchにつき252のIPアドレスが作成可能です。（IPv4の場合）

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.3.PNG "Networks")

# 参考:セキュリティルールについて
* セキュリティルールはVPCに対するファイアウォール機能の一つです。
* プロトコル、ポート範囲、ECSインスタンス単体、送信元IP・送信先IPアドレスによるパケットフィルターが可能です。
* イントラネット入力はそのセキュリティグループに関連付けられたインスタンスにアクセスできるトラフィックを規制するルールです。
* イントラネット出力はそのセキュリティグループに関連付けられたインスタンスからどの送信先にトラフィックを送信できるか
（トラフィックの送信先と送信先ポート）を制御するルールです。
* ちなみにACL（アクセス制御リスト）という機能があり、セキュリティグループとは[サブネットレベルで動作]、[ルールの許可と拒否設定が可能]、[ステートレス]といった違いがあります。

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.4.PNG "Networks")



# VRouter
* VRouterはVPC内のゲートウェイ、 VPC内の全てのVSwitch が接続されます。
* １つのVPCに1つのVRouter、1つのVrouterに1つのルートテーブルを配置することができます。
* ルートテーブルのエントリ数の上限は48です。

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.5.PNG "Networks")

# EIP
> [Elastic IP](https://www.alibabacloud.com/product/eip)

* EIPはElasticIP、独立したパブリック IP アドレスリソースです。固定のグローバルIPアドレスを提供します。
* EIPは独立かつ単独で所有するため、ECSインスタンス変更など内部環境変化時でも外部からの接続先IPは不変で済みます。
* EIPは帯域変更が可能なうえ、ECSインスタンス、NATゲートウェイ、SLBへアタッチできます。

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.6.PNG "Networks")


# VPN Gateway
> [VPN Gateway](https://www.alibabacloud.com/product/vpn-gateway)

* VPN GatewayはAlibabaCloudのVPCと他のネットワークをVPN(IPsec、SSL)で安全に接続するためのサービスです。
* 接続方法は主に以下の方法があります。
> * サイト間接続(IPsec)：オンプレミス～VPC間にてVPN Gateway接続
> * ポイント対サイト接続(SSL)：Windows、Linux、Mac、iOS、Androidなどクライアント〜VPC間にてVPN Gateway接続

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.2.PNG "Networks")


# NAT Gateway
> [NAT Gateway](https://www.alibabacloud.com/product/nat)
* NAT GatewayはEIPしか持っていないECSインスタンスがインターネットと通信できるようにする機能です。
* EIPをNAT Gatewayが持つグローバルIPに変換し、外部と通信します。
* SNAT（送信元IPアドレスの変換）機能はセキュリティルール上 EIPを持たないECSにてIPアドレスをアタッチ（変換）します。
* DNAT（宛先IPアドレスの変換）機能は特定の通信先に対し、宛先のアドレスを変換します。

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.7.PNG "Networks")

# Express Connect
> [Express Connect](https://www.alibabacloud.com/product/express-connect)

* Express ConnectはVPCから異なるVPCまたはIDC間とのプライベートネットワーク通信を提供します。
* 異なるリージョンにあるVPCネットワークを相互接続するVPCコネクションと、お客様データセンターとクラウド環境を接続するダイレクト・アクセスの2種類があります。
* ネットワークトポロジの柔軟性を備え、高品質かつ高セキュリティのネットワーク間通信を実現します。

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.8.PNG "Networks")

# Cloud Enterprise Network（CEN）
> [Cloud Enterprise Network](https://www.alibabacloud.com/product/cen)

* Cloud Enterprise Network（CEN）はVPCから異なるVPCまたはIDC間とのプライベートネットワーク通信をより高品質で提供します。
* CENを利用するためにはCENインスタンスを作成し、ネットワークにアタッチ、帯域購入してから利用できます。
* CENのメリットとして、「低レイテンシと高速接続」、「ワールドワイド接続」 、「近距離アクセスと最短パス接続」、「冗長性とディザスタリカバリ」が挙げられます。

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.9.PNG "Networks")

# Global Acceleration
> [Global Accelerator](https://www.alibabacloud.com/product/ga)

* Global Accelerationは世界中のネットワークサービスへの最も近いアクセスを実現するネットワーク高速プロダクトです。
* サービス品質に影響するようなレイテンシ、ジッター、パケットロスなどのネットワーク上の問題の影響を最小化し、エンドユーザーにより良い体験を提供できます。
* 単独で購入することができて、柔軟なバインディング、帯域幅調整可能といったメリットがあります。

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.10.PNG "Networks")




# サマリ
|プロダクト名|コメント|
|---|---|
|[Virtual Private Cloud](https://www.alibabacloud.com/product/vpc)|専用ネットワークVPC|
|[Alibaba Cloud PrivateZone](https://www.alibabacloud.com/products/private-zone)|VPCのDNSサービス|
|[Server Load Balancer](https://www.alibabacloud.com/product/server-load-balancer)|負荷分散ロードパランサ|
|[NAT Gateway](https://www.alibabacloud.com/product/nat)|NATゲートウェイ|
|[Elastic IP](https://www.alibabacloud.com/product/eip)|パブリックIPリソース|
|[IPv6 Gateway](https://www.alibabacloud.com/cloud-tech/product/85563.htm)|IPv6ゲートウェイ|
|[Global Traffic Manager](https://www.alibabacloud.com/cloud-tech/doc-detail/86630.htm)|Global Traffic Manager|
|[Internet Shared Bandwidth](https://www.alibabacloud.com/cloud-tech/doc-detail/55784.htm)|帯域幅共有サービス|
|[Data Transfer Plan](https://www.alibabacloud.com/products/data-transfer-plan)|クラウド間のデータ転送|
|[Cloud Enterprise Network](https://www.alibabacloud.com/product/cen)|Cloud Enterprise Network|
|[Global Accelerator](https://www.alibabacloud.com/product/ga)|ネットワークアクセラレーションサービス|
|[VPN Gateway](https://www.alibabacloud.com/product/vpn-gateway)|VPNゲートウェイ|
|[Smart Access Gateway](https://www.alibabacloud.com/products/smart-access-gateway)|オンプレミスからのデータ転送|
|[Express Connect](https://www.alibabacloud.com/product/express-connect)|専用線接続|
|[Anycast EIP](https://www.alibabacloud.com/cloud-tech/product/164697.htm)|Anycast EIP|



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>

