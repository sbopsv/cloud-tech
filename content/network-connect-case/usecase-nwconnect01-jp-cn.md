---
title: "日本と中国のNW接続"
metaTitle: "Alibaba Cloudによる日本リージョンからの閉域網接続パターンを解説します。"
metaDescription: "Alibaba Cloudによる日本リージョンからの閉域網接続パターンを解説します。"
date: "2021-06-13"
author: "Hironobu Ohara"
thumbnail: "/images/img.png"
---



## 日本と中国のプライベートネットワーク接続（以下、日中接続）の解説の流れとなります。

 1. [本記事の狙い](#purpose)
 1. [日中接続パターン](#patterns)
 1. [Alibaba Cloudであるメリット](#pros)
 1. [日中接続の注意点](#cons)
 1. [日中接続の構築例](#example)


---
# 1. 本記事の狙い
パブリッククラウドにおけるAlibaba Cloudの代表的な強みとして、中国との安定したネットワーク接続が挙げられます。では<b>Alibaba Cloudで具体的にどのようなサービスを用いれば日中接続を実現できるか</b>を、既存の資料を交えて紹介いたします。    


本記事を理解する前提として、Alibaba CloudのVPCとリージョンの知識が必要となるので、初見の方は以下のURLも併せてご確認ください。   

VPCとは: https://www.alibabacloud.com/cloud-tech/doc-detail/34217.htm    

リージョンとゾーン: https://www.alibabacloud.com/cloud-tech/doc-detail/40654.htm    



---

# 2. 日中接続パターン

  - [Alibaba Cloud同士の接続](#ali-ali)
  - [Alibaba Cloud以外のパブリッククラウドとの接続](#ali-pub)
  - [オンプレミスの接続](#ali-on)


### Alibaba Cloud同士の接続
日中のシステムが共にAlibaba Cloud上で構築されている場合には、<b>CEN ([Cloud Enterprise Network](https://www.alibabacloud.com/product/cen)) というサービスを用いる</b>のが一般的です。    
CENは、VPC（仮想ネットワークセグメント）に対して包括的なルーティング機能を提供します。その為「CENインスタンスの作成」と「CENインスタンスに対してVPCを紐付ける」の2ステップによって、日中VPC間でのプライベートIPアドレスによる通信が可能となります。ダイナミックルーティング等の複雑な設定は一切不要です。   

#### ステップバイステップ手順
SBCloudドキュメント: CEN利用手順書    
> https://www.sbcloud.co.jp/entry/2018/08/01/cen-introduction/

Alibaba Cloudドキュメント: CEN利用手順書   
> https://www.alibabacloud.com/cloud-tech/doc-detail/59870.htm

#### 本構成が当てはまるシステムの要件

 - データロスが許されないデータ通信
 - リアルタイム性が重要となるデータ通信
 - 新規ビジネス展開に伴う新規システムの構築
 - 既存のAlibaba Cloudリソースの利用
 - シンプルなインフラコードを実現したい

### 構成イメージ
![CEN構成例](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/img.png "CEN構成例")


### Alibaba Cloud以外のパブリッククラウドとの接続
日中のシステムにおいて、他方がAlibaba Cloud以外のパブリッククラウド（AWSやAzure）上で構成されている場合、日中接続する為に<b>IPSecを用いたVPNトンネルを構築する</b>のが一般的です。    

VPNトンネルの構築は以下の2ステップで実現出来ます。   

1. Alibaba CloudおよびAlibaba Cloud以外のアカウント、 この両方でVPNゲートウェイを作成する   
2. それぞれのVPNゲートウェイに、IPSec設定情報と対抗のゲートウェイ情報を入力する   

VPNトンネルの構築後に、VPNトンネルを介した疎通を可能にする為、以下を実施します。   

3. VPCのルートテーブルの宛先に、相手先のネットワークセグメントを入力して、静的ルーティング情報を変更する  

Alibaba Cloud同士での接続と同様、ダイナミックルーティングのような複雑な設定は不要で、上記３ステップで全てが完了します。    

#### ステップバイステップの手順
SBCloudドキュメント：Alibaba Cloud - AWS   
> https://www.sbcloud.co.jp/entry/2018/07/03/alibaba-aws_vpn/

SBCloudドキュメント：Alibaba Cloud - Azure   
> https://www.sbcloud.co.jp/entry/2018/07/04/alibaba-azure_vpn/

Alibaba Cloudドキュメント：Alibaba Cloud - 汎用    
> https://www.alibabacloud.com/cloud-tech/doc-detail/65072.htm

#### 本構成が当てはまるシステムの要件

 - 日中の通信で、秒単位での遅延や通信断が発生しても問題ない   
 - 開発環境のデータを用いて、Alibaba Cloudを試用したい   
 - 他社パブリッククラウド上のシステムを流用したい   
   e.g. 日本リージョンのAWSからコンテンツ配信して、中国リージョンのAlibaba CloudのCDNを利用して低遅延配信する   

### 構成イメージ
![構成イメージ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/img_02.png)



### オンプレミスとの接続
日中のシステムにおいて、他方がオンプレミス（＝データセンタ）に存在している場合、日中接続する為の手段は2つあります。    

一つは、他社パブリッククラウド接続と同様に、VPNトンネルを経由した接続です。   
もう一つは、ダイレクトアクセスという回線サービスを用いて、オンプレミスとAlibaba Cloudを直接接続する手法で、こちらを推奨しております。   

ダイレクトアクセスは、ソフトバンク株式会社が持つネットワーク資産とノウハウを利用して、Alibaba CloudのVPCとオンプレミスのシステムを閉域接続します。これによりVPNトンネル接続では実現できない、高品質なネットワーク接続を実現出来ます。   
また、VPNトンネルの構成でも、ダイレクトアクセスの構成でも、CENを併用する事で複数のVPCとオンプレミスとを一括で接続する事が可能です。   


#### ステップバイステップ手順書
SBCloudドキュメント：ダイレクトアクセス    
> https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/DirectAccessOpeningGuide_ver1.3_20220602.pdf
ソフトバンクドキュメント：サービス紹介書   
> https://www.softbank.jp/biz/nw/nwp/cloud_access/direct_access_for_alibaba/
Alibaba Cloudドキュメント:VPN ゲートウェイを経由したローカルデータセンターから Alibaba Cloudへの接続   
> https://www.alibabacloud.com/cloud-tech/doc-detail/87042.htm
Yamahaルータを用いたVPNトンネルによる接続    
> https://network.yamaha.com/setting/router_firewall/cloud/alibaba_cloud

#### 本構成が当てはまるシステムの要件
ダイレクトアクセスによる日中接続を前提として、以下の要件に最適と言えます。   

 - オンプレミスの基幹システムと連動したAlibaba Cloudの利用
 - オンプレミスとAlibaba Cloudでのシームレスなデータ連携
 - オンプレミスからAlibaba Cloudへのシステム移行

### 構成イメージ
ダイレクトアクセス
![構成イメージ](https://cdn.softbank.jp/biz/set/data/nw/nwp/cloud_access/direct_access_for_alibaba/img/direct_access_for_AlibabaCloud_index_01.jpg)

---

# 3. Alibaba Cloudであるメリット
Alibaba Cloud以外のパブリッククラウドと比較して、何がメリットになるのかを記載します。    

  - ネットワーク品質が保証されている   
  　　→帯域幅を購入する事でSLAに沿った品質が担保される   
  - 日中アカウントを単一のコンソールで管理できる   
  　　→ユーザ管理も含めて一括管理可能    
  - ネットワークセキュリティの実績が豊富    
  　　→中国国内の数多く攻撃から防御した実績のあるプロダクト・構成を利用できる   
  - 中国国内で利用可能なプロダクトおよびリージョン数が多い    
  　　→日本リージョンと同じプロダクトを中国リージョンでも利用できる為、システム構成に差異が生まれない    



---

# 4. 日中ネットワークの注意点
* CENのネットワークの帯域幅は1Kbpsです。したがってpingでの通信は可能ですが、httpの通信はデフォルトではほぼ疎通しません。VPC間で利用する帯域幅の上限を選択する形で実現できます   

* VPC間での帯域幅については、上限値をパッケージとして購入する事で、購入した分の帯域幅を確実に利用する事が出来ます    

* デフォルトだとIPSec IKEv1なので、IKEv2は設定変更を加えてください    

* IPSecが繋がらない場合には以下の項目をチェックします   
https://www.alibabacloud.com/cloud-tech/doc-detail/65802.htm

* Alibaba Cloud同士の日中接続は[ExpressConnectでも実現できる](https://www.sbcloud.co.jp/document/expressconnect_vcp_connection)が、同要件については現在CENの利用を推奨しています   

* [Smart Access Gateway](https://www.alibabacloud.com/ja/products/smart-access-gateway)は中国リージョンでの利用可能で、2019年9月末時点で日本リージョンでは利用不可です   



---

# 参照URL
* クラウドネットワーク接続（中国ビジネス）   
> https://www.alibabacloud.com/solutions/china-gateway/networking

* プライベートネットワークプロダクトの選び方   
> https://www.alibabacloud.com/cloud-tech/doc-detail/61133.html


