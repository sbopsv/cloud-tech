---
title: "Alibaba Cloud Linux 3"
metaTitle: "CentOS8 / RHEL8と互換性もある「Alibaba Cloud Linux 3」のご紹介"
metaDescription: "CentOS8 / RHEL8と互換性もある「Alibaba Cloud Linux 3」のご紹介"
date: "2021-07-27"
author: "sbc_fukuda"
thumbnail: "/computing_images_26006613784005800/20210721185833.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## CentOS8 / RHEL8と互換性もある「Alibaba Cloud Linux 3」のご紹介

# はじめに

本記事では、CentOS8 / RHEL8と互換性もある「Alibaba Cloud Linux 3」をご紹介します。


# Alibaba Cloud Linuxとは
Alibaba Cloud Linux（別名Aliyun Linux）OSは、Alibaba Operating Systemチームによって作成された     
オープンソースのLinuxディストリビューションです。     
Alibaba Cloudの「Elastic Compute Service（ECS/仮想サーバ）」を利用されるお客様に     
さまざまな機能、高性能、安定性を備えたOSサービスを提供することを目的としています。

「Alibaba Cloud Linux」と「Elastic Compute Service」は、OSとサーバの関係性となり、     
「Elastic Compute Service」で利用できるOSのひとつが「Alibaba Cloud Linux」という事になります。

> https://www.alibabacloud.com/ja/product/ecs
     

# Alibaba Cloud Linuxの歴史
これまでの軌跡としては、2017年のファーストリリースをベースに、     
2019年 Alibaba Cloud Linux 2リリース、その後LTS（Long Term Support）提供と順当なアップデートがされてきています。　　　

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613784005800/20210721185711.png "img")      

2020年、Alibaba Cloud Linux OSは、オープンソースのオペレーティングシステムコミュニティ     
およびイノベーションプラットフォームであるコミュニティに参加しました。     
Alibaba Cloud Linuxは、現在そのAnolisOSのダウンストリームディストリビューションの1つとなります。

> https://openanolis.cn/
     
     

# Alibaba Cloud Linux 3リリース
そして2021年4月28日リリースされたAlibaba Cloud Linux 3は、     
Alibaba Cloud公式オペレーティングシステムの第3世代配布バージョンであり、     
Alibaba Cloud Linux 2機能を継承し、セキュリティ、安定性、ランタイムパフォーマンスをさらに向上させています。     
     
Alibaba Cloudインフラストラクチャとの統合用に最適化されており、     
システムの起動を高速化し、パフォーマンスをさらに向上しています。
     
また、Intel、AMD、およびARMプロセッサに機能の適応、パフォーマンスチューニング、および安定性の強化を提供し、     
オペレーティングシステムが安定した信頼性の高い方法で実行し続けることができるように開発されています。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613784005800/20210723194804.png "img")      

ご参考     
> https://qiita.com/eterao/items/22baf2969120494453bc
     

# Alibaba Cloud Linux 3 の主な特徴

## 特徴1
大きな特徴の1つは、CentOS8/RHEL(Red Hat Enterprise Linux)8ベースと互換性があることです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613784005800/20210721185833.png "img")      

yum(dnf)でインストールできる、CentOSとの標準パッケージの比較を参考までに下記に記載します。     
多くのRPMパッケージで同等か上位のバージョンが利用できます（2021年7月時点）


| パッケージ | Alibaba Cloud Linux | CentOS 8 | 
| ---- | ---- | ---- |
|  Kernel  |  5.10  |  4.18  |
|  httpd  |  2.4  |  2.4 |
|  nginx  |  1.18  |  1.14  |
|  MySQL  |  8.0  |  8.0  |
|  MariaDB |  10.5  |  10.3  |
|  PostgreSQL  |  13.3  |  10.17  |
|  Redis  |  6.0  |  5.0  |
|  PHP  |  7.4  |  7.2  |
|  Python  |  3.6  |  3.6  |
|  Perl  |  4.5  |  4.5  |
|  Ruby  |  2.7  |  2.5  |
|  Node.JS  |  14.16  |  10.24  |
|  git  |  2.27  |  2.27  |
|  gcc  |  10.2  |  8.4  |
|  binutils  |  2.35  |  2.30  |
|  glibc  |  2.32  |  2.28  |


OSやネットワークのパフォーマンス分析ツールのgcc 10.2を始め、binutils 2.35、およびglibc 2.32を使用して、     
安定性を強化し、他のソフトウェアとの互換性を向上しています。

## 特徴2
Alibaba Cloud Linux 3は、長期テクニカルサポート（LTS）が提供され、     
2029年4月30日まで、無料のソフトウェアメンテナンスとテクニカルサポートが利用できます。

OSイメージは4ヶ月ごとに更新され、アップデートには、新機能、セキュリティアップデート、脆弱性の修正が含まれます。     
セキュリティ更新プログラムはYUMリポジトリーから提供されます。     
yum updateコマンドを実行して、イメージを最新バージョンに更新が可能です。     

2021年EOLを迎えるCentOS 8の移行先の選択肢としてご検討ください。     

※CentOSとの比較

|  ディストリビューション  |  サポート期限  |  運営  | 
| ---- | ---- | ---- |
|  CentOS 7  |  2024/6/30  |  The CentOS Project  |
|  CentOS 8  |  2021/12/31  |  The CentOS Project  |
|  CentOS Stream 8  |  2024/5/31  |  The CentOS Project  |
|  <b>Alibaba Cloud Linux 3</b>  |  <b>2029/4/30</b>  |  <b>Alibaba Cloud</b> |

     
     
## 特徴3
カーネルはLinuxカーネル5.10 LTSが採用されており、     
クラウド上のアプリケーション環境のLinuxコミュニティに最新のオペレーティングシステム拡張機能を提供できます（クラウドカーネル）     
     
クラウドカーネルは、Linuxカーネルのカスタマイズおよび最適化されたバージョンであり、     
Alibabaオペレーティングシステムチーム（旧称Taobaoカーネルチーム）によって作成された経緯があります。     
Alibaba Cloud Elastic Compute Service（ECS）製品で実行されている     
Alibaba Cloud Linux OSバージョン2（またはAliyun Linux 2）からデフォルトカーネルとして利用されています。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613784005800/20210721190017.png "img")      
     
     
## 特徴4
スケジューリング、メモリ、ファイルシステム、IOシステムの複数のサブシステムを包括的に最適化することにより、     
CentOS8と比較して10％〜20％のパフォーマンスが向上します。

※Redis、MySQL、Nginxの比較
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613784005800/20210721190032.png "img")      


概要はこちらにも掲載されていますので、ご参考にしていただければとおもいます。

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/212631.htm
     
     
# 最後に
Alibaba Cloud Linuxは、クラウド基盤に最適化されたパフォーマンスに優れたOSディストリビューションです。     
CentOS8/RHEL8の互換性があり、比較的扱いやすいかと思います。
さらに短い期間でEOLを迎えるCentOSに対し、長いサポート期間が付帯されているのも大きなポイントです。     
CentOS/RHELの代替OSとしても有効かと思いますので、ぜひお試しいただければ幸いです。    


 <CommunityAuthor 
    author="tfukuda"
    self_introduction = "2019年よりAlibaba Cloudに携わる。これまでのクラウド基盤の導入経験を活かし、Alibaba Cloudを活用した様々なソリューションをお客様へ提案するプリセールスエンジニアとして奔走中。MARVEL映画大好き。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/tfukuda.png"
    githubUrl=""
/>



