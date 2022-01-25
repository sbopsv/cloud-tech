---
title: "Cloud Firewallのご紹介"
metaTitle: "クラウドセキュリティのファーストアイテム Cloud Firewallのご紹介"
metaDescription: "クラウドセキュリティのファーストアイテム Cloud Firewallのご紹介"
date: "2020-09-16"
author: "sbc_nishino"
thumbnail: "/Security_images_26006613613881300/20200911094519.png"
---

## クラウドセキュリティのファーストアイテム Cloud Firewallのご紹介

# はじめに
本記事ではAlibaba CloudのセキュリティプロダクトであるCloud Firewallについてご紹介します。  

日本リージョンでは未導入のプロダクトではありますがAlibaba Cloudを導入/検討されていらっしゃるお客様は、  
中国国内に拠点があり中国国内いずれかのリージョンを設置するケースが多いです。  　
中国リージョンにFirewallを導入することでクラウド経由で日本リージョンに脅威が流入することも防げるため、  
Alibaba Cloudでセキュリティ製品を検討されいる方々のファーストアイテムとしてご参考になれば幸いです。

# Cloud Firewallとは

パブリッククラウド用にAlibaba Cloudより提供されるFirewall as a Serviceソリューションです。  
提供リージョンは中国、香港、マレーシア、シンガポール、インドネシア、ドイツになります。  

* Internet Firewall、VPC Firewall、Internal Firewall**の3つの制御モジュールで構成されており該当区間の通信をPolicyで制御可能です。

## 1.Internet Firewall

インターネットとECSインスタンス間のアクセストラフィックを監視、一元管理します。

## 2.VPC Firewall

VPCネットワーク間のアクセストラフィックを監視、一元管理します。

## 3.Internal Firewall / Security Group

ECSとECS間のアクセストラフィックを監視、一元管理します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613613881300/20200911094519.png "img")         

CloudFirewall Module通信フローイメージ


Alibaba Cloudにお詳しい方は **Internal FirewallとSecurity Group何が違うのか疑問**　に思われますよね。  
Security Groupより機能が拡張されておりIPアドレスをアドレス帳で管理できたりドメイン指定が可能になります。  
詳細な仕様を知りたい方は下記をご覧ください。

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/107454.html

# Cloud FirewallとAlibaba Cloud製品の関係

Cloud Firewallが保護対象とするAlibaba Cloud製品はEIPにひもづくECS・SLBが保護対象(Internet Firewall)です。  
OSS、VPN Gatewayなどは保護対象ではございません。  
VPN GatewayのようにVPCに着信した段階でVPC Firewallで保護される通信などもございますので導入される製品が保護対象かどうかご確認されることをおすすめいたします。  
詳細については下記をご覧ください。

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/107442.htm

# 特徴

Cloud Firewallの特徴について記載します。

## 1.利便性

導入時に仮想サーバーを用意しFirewallのOSイメージをインストールする作業やNW設計変更をすることなく導入できます。

## 2.スムーズなスケーリング

EIPアドレス毎に最大2Gbpsまで防御機能を提供できます。

## 3.可用性

Cloud Firewallはデフォルトで二つのAZに展開されます。

## 4.侵入防御システム(IPS/IDS)

IPS/IDSの基本機能として侵入をリアルタイムで検知し遮断を同時にサポートします。  
Alibaba Cloud運用における長期的な攻撃 / 防御の実績により、侵入と防御のルールが蓄積され、高い脅威の識別率と低い誤検知率を実現しています。

## 5.可視化

トラフィックログやイベントログなどを蓄積しグラフィカルに可視化することができます。  
可視化された情報をもとに負荷状況を把握し帯域増減の判断材料にするなどクラウドインフラ基盤の利用状況把握するためのツールとして利用したり、 セキュリテイリスクの高いサービスは遮断するなどクラウド基盤に埋没している課題を確認することができます。

# 機能概要

Cloud Firewall IPS/IDSの代表的な機能の概要を記載いたします。

## 1.脅威情報

Cloud Firewall全体で検出された悪意のあるIPアドレス情報を同期することで同じ脅威発生源から複数個所に渡る攻撃に対応します。

## 2.仮想パッチ

脆弱性を狙う攻撃を検知することでシステム自体にパッチが適用されていなくても水際でリスクの高い脆弱性から防御できます。

## 3.インテリジェント防御機能

クラウド攻撃に対する大量のデータから攻撃を識別しリアルタイムでアラートを生成します。

## 4.ポリシーの一元管理

Cloud Firewallのコンソール画面にてInternetFirewall、VPC Firewall、InternalFirewallのポリシーを統一管理を行うことができます。  
クラウドアセット(ECS / RDS / SLBなど)へのアクセスを制御し、異常なアクセスが発生した際に素早く問題を対処することができます。

## 5.トラフィック可視化

侵入イベント、ネットワークアクティビティ、トラフィックの傾向、侵入防止システム（IPS）によりブロックされたトラフィック、  
ネットワーク全体の外部接続に関する視覚化された統計情報を提供します。

**Cloud Firewallは以下の項目でトラフィックを分析します。**

### 5-1.External connections

EIPのOut bound方向のトラフィックログを確認することができます。

#### Outbound traffic

外部ドメイン、外部IPアドレス、外部接続のアセットリクエスト、関連プロトコル、外部接続データなどの情報を表示します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613613881300/20200914142026.png "img")      

#### Visualized analysis

外部接続先をグラフィカルに表示しEIP別のトラフィック量やプロトコル種別を割合で判別できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613613881300/20200914142622.png "img")      

  

### 5-2.Internet Access

EIP のInbound方向のトラフィックログを表示することができます。  
アクセス時間、送信元 / 宛先IPとポート番号やアクセスアプリケーション、プロトコル、トラフィック量などの詳細な情報を確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613613881300/20200914143443.png "img")      

  

### 5-3.VPC Access

VPCネットワーク間のリアルタイムトラフィックログを表示することができます。  
指定した期間内のVPCネットワークのInbound / Outboundトラフィック両方のピーク値と平均値や、  
Inbound / Outboundトラフィックの中で多いトラフィックを順位付で表示します。  
VPCネットワーク間のセッションランキングと、セッション数、トラフィック量を表示します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613613881300/20200914144305.png "img")      

  

### 5-4.Branch Awareness

侵入イベントリストでリスクレベルや影響を受けるIPアドレス、イベントステータスなどの詳細なイベントを表示します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613613881300/20200914152934.png "img")      

※ブロックイベント発生させれなかったのでイメージだけ抑えて頂ければ、いずれ更新いたします。  

### 5-5.Traffic Blocked by IPS

IPSでブロックされたイベント、ブロックされた送信元IPアドレス及びアプリケーションなどの詳細情報を表示します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613613881300/20200914145113.png "img")      

### 5-6.All Access Activities

正常、異常なアクティビティ、トレンドチャート、Inbound / Outboundトラフィック両方のトラフィック訪問ランキングを表示します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613613881300/20200914150254.png "img")      
  

# 構成プラン

Cloud Firewallは3つのプランが存在しそれぞれ使用できる機能が異なります。  
全量は記載せずプラン選定する上で重要な箇所のみ抜粋いたします。

|項目|Premium Edition|Enterprise Edition|Ultimate Edition|
|---|---|---|---|
|月額基本料金|420 USD|1,450 USD|3,900 USD|
|インターネット帯域幅|10Mbps|50Mbps|200Mbps|
|セキュリティポリシー数|4,000|10,000|20,000|
|保護されるIPアドレス数|20|50|200|
|Internet Firewallでサポートするリージョン数|1|3|5|
|VPC Firewallがサポートするリージョン数|×|1|3|
|保護されるVPC数|×|2|5|
|IPS脅威検出|〇|〇|〇|
|仮想パッチ|〇|〇|〇|
|IPホワイトリスト|×|〇|〇|
|セキュリティグループトラフィック可視化|×|〇|〇|
|セキュリティグループポリシー同期|×|〇|〇|


## プラン別選択ポイント

### Premium Edition

単一リージョンでWebサービスなど外部に公開しているサーバーを通信保護したい。

### Enterprise Edition

単一リージョンで社内基盤をクラウド化しVPC内通信の可視化・ログ管理を実施したい。  
本番環境・開発環境などVPCを複数に分割し用途ごとに使い分けした環境で通信保護したい。

## Ultimate Edition

BCP対策や拠点が複数リージョンに跨り、拠点間通信や外部通信を統合的に通信保護・ログ管理・可視化したい。 ※2020/08/13時点のCloud Firewall仕様一部抜粋、必ず公式ドキュメントを参照してください。  
※帯域幅や対応数などはデフォルト値でありチケットや課金を行えば上限値を上げることが可能です。

[www.alibabacloud.com](https://www.alibabacloud.com/cloud-tech/doc-detail/90274.htm?spm=a2c63.l28256.a3.15.214b1f69x4OLUq)

  

# Alibaba CloudでFirewallを導入する際の選択肢

Alibaba Cloudで利用できるFirewallの種類と選択ポイントを記載します。

|Firewall Product|Cloud Firewall|VM Firewall製品|
|---|---|---|
|提供元|Alibaba Cloud|サードパーティー製 VMライセンス 例：FortiGate,Check Point,Paloalto|
|拡張性|エディション毎に異なるがリージョン,保護できるVPC,EIPの数を拡張可能。EIP/毎にトラフィック量を拡張することができる。|BYOLライセンス：VMライセンスで有効化されるスペックの上限値（vCPU、メモリー、ストレージ）まで、拡張可能な範囲を超える場合は買い直しとなる。PAYGライセンス：4vCPUライセンスから8vCPUライセンスにECSを立て直すことで拡張可能|
|保護対象|インターネット出口対策、VPC内通信、ECS間通信それぞれのモジュール区間の通信が保護対象|インターネット出口対策のみ、VPC内のInternal通信は制御できない|
|機能|Firewall,IPS/IDS|UTM,Proxy,認証,VPN,SD-WANなど機能豊富|
|可用性|デフォルトでAZ冗長|ベンダーごとに実装が異なるので個社ごとに合わせた設計が必要|
|サポート|SBCloud テクニカルサポートサービスを提供|BYOLライセンス：ライセンス購入したディストリビュータ経由でサポート／PAYGライセンス：ユーザーがメーカーポータルに直接問い合わせを行う。|


## Cloud Firewall選定ポイント

インターネット出口対策に加えAlibaba Cloud内の通信も制御、通信ログを記録したい場合はCloud Firewallしか選択肢がなく、  
複数リージョンや複数VPCを利用されているユーザー様にはVM Firewallで構築する方法に比べコストメリットがでてきます。

## VM Firewall選定ポイント

通信保護対象はインターネット出口対策のみで良くVPNやProxy機能など、  
サードパーティー製Firewallが機能提供している機能を複合してご使用したい場合はVM Firewallで構築する方法がおすすめとなります。

# おわりに
本記事ではCloud Firewallをご紹介しました。       
社内基盤をクラウド化したい。複数のリージョンやVPCをAlibaba Cloudに構築しクラウド内外の通信を制御・管理・可視化したい用途には是非Cloud Firewallをご検討として参考に頂ければ幸いです。    


