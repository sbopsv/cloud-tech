---
title: "03.ストレージ"
metaTitle: "ストレージ系プロダクトサービス紹介"
metaDescription: "Alibab Cloudのストレージ系プロダクトサービスをご紹介します。"
date: "2021-06-03"
author: "Hironobu Ohara"
thumbnail: "/images/3.1.PNG"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## ストレージ系プロダクトサービス紹介

Alibaba Cloudは様々なストレージタイプを提供しています。


# Object Storage Service（OSS）
> [Object Storage Service](https://www.alibabacloud.com/product/oss)

* OSS は Object Storage Service の略称、 99.9999999999％（9が12個） の SLA を持つ大容量のオブジェクトストレージサービスです。
* 高可用性・信頼性・拡張性を備えるほか、豊富な付加機能とレプリケーション機能、複数のストレージオプションが用意されています。

![Storage](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/3.1.PNG "Storage")


# OSSの特徴について

> * 高い信頼性・可用性： 99.9999999999％（9が12個）の信頼性、99.995％の可用性
> * 拡張性：容量無制限、ファイル数無制限
> * アクセス：HTTP/HTTPS で簡単にデータアクセス
> * 各種ニーズに対応できるストレージプラン：標準、低頻度アクセス、アーカイブ
> * 高パフォーマンス：オリジンサーバーとして利用可能、帯域幅無制限
> * 豊富な付加機能：画像処理機能、Function Compute、MPSなどのプロダクトとの連携機能
> * 行動なセキュリティマネージメント機能：暗号化機能、ACLアクセス制御などの機能でコンテンツの安全性を確保


## ストレージタイプ
**Standard** :デフォルトのストレージクラス。頻繁なデータアクセスに対応できる高耐久性、高可用性、高性能のオブジェクトストレージサービスを提供します。

**Infrequent Access (IA)** :　月1～2回程度の頻度でアクセスするデータに適しているストレージクラス。Standardと比べて費用が安めです。

**Archive** :アクセス頻度の低いデータを長期間保存（最低6カ月は触れない）に適しているストレージクラス。Infrequent Access (IA)と比べて費用が安めですが、高圧縮で保存するため、データ復元には読み込みまでに最大で1分かかります。

**Cold Archive** :更にデータを長期間保存（年間データなど、Archiveより頻度が低いデータ）に適しているストレージクラス。Archiveと比べて費用が安めですが、高圧縮で保存するため、データ復元には読み込みまでに少し時間がかかります。


## OSSネットワークパフォーマンス
* ECSインスタンスからOSS bucketへ高速アクセスするためには、ECSインスタンスがbucketと同じRegion内にある必要があります。
* 更にデータアクセスを高速化する場合、TableStoreやDLA（DataLake Analytics）、RDS for MySQL、MaxComputeなどのプロダクトサービスと連携することが出来ます。
* OSSはストレージ容量、リクエスト数、ユーザー数に応じて自動スケールアップするため、ユーザーのワークロードに応じた静的ウェブアプリケーションなどに対応できます。
* OSSには、離れた場所にある大きなオブジェクトのアップロードやダウンロードを高速化する転送アクセラレーション機能があります。転送アクセラレーションは、スマートスケジューリング、プロトコルスタックのチューニング、最適なルート選択、転送アルゴリズムの最適化をOSSのサーバー側の設定と組み合わせることで、エンドツーエンドの高速化ソリューションを提供します。

## OSSからCDN
* OSS は Alibaba Cloud Content Delivery Network（CDN）をサポートし、OSSにあるデータの静的ダウンロード機能を提供します。
* Alibaba Cloud CDN は、OSS の bucket をオリジンとして使用し、オリジンからエッジノードにコンテンツを配信することができます。
* Alibaba Cloud CDN はインターネットのトラフィックの輻輳抑制を目的とした構造になっています。具体的にはユーザーから最適なエッジノードにリクエスト分配しつつ対象の必要コンテンツを素早くアクセスできるようにしています。


## OSSから他プロダクトサービスへの連携について
* OSSはデータの保存に、検索エンジンやデータベースはオブジェクト名、オブジェクトサイズ、キーワードなどのメタデータの保存に使われます。
* データベースに格納されたメタデータは、インデックスを作成したり、クエリを実行したりすることができます。
* OSSを検索エンジンやデータベースと併用することで、OSSに保存されているオブジェクトの検索や問い合わせを行うことができます。

## OSSコスト
* OSSの料金には、ストレージ料金、トラフィック料金、API操作呼び出し料金、データ処理料金などがあります。
* OSSでは、実際に使用されたリソースの量に応じて料金を請求します。計算式は `1時間あたりの料金 ＝ 実際の使用量 × 単価` です。
* コスト削減のために、一部の課金項目でサブスクリプションを利用することができます。

## ライフサイクル
* OSSでライフサイクルを設定することで、設定した期間が過ぎたら、対象のオブジェクトファイルを自動削除したり、ストレージタイプArchiveへ自動アーカイブしたり、ログを送信することができます。
* ライフサイクルの一環として、RAMロールを使って、ユーザーが対象オブジェクトファイルへのアクセス有効期限の設定をすることもできます。

## アクセス方法
* OSSはRESTful APIで操作管理します。ユーザー、SDK、WebコンソールはこれらのAPI操作を利用して、グローバルに一意の名前を持つbucketにオブジェクトを格納することができます。
* 各オブジェクトは、そのbucket内のオブジェクトを識別するキーを持ちます。
* OSSはフォルダを使用せず、bucket内のオブジェクトを識別するキーを持ちながら、オブジェクトとして保存されます。ただし、folder1/folder2/fileのように、名前の末尾をスラッシュ `/` で繋げるオブジェクトを作成することで、擬似的なフォルダを作成することができます。
* APIの操作をOSSのSDKやToolを使って、アプリケーションを開発することができます。OSSでは、Java、Python、PHP、Go、Android、iOSなど、10種類以上のプログラミング言語に対応したSDKを提供しています。
* ossutilは、bucketやオブジェクトを管理するためのls、cp、cat、config などさまざまなシンプルなコマンドを提供するコマンドラインツールです。
* Webブラウザ上の ossbrowser を使用して、オブジェクトの参照、オブジェクトやフォルダのアップロードまたはダウンロードなどの基本的な操作を行うことができます。
* Webブラウザ上の OSSコンソールを使って、OSSのリソースを管理することができます。
* イベント通知機能を使えば、OSSリソースで行われた操作をすぐに知ることができます。操作履歴をログとして蓄積、可視化することもできます。


## シナリオ
### 音声、動画、Webサイトの静止画データの保存と配信
* OSSのオブジェクトは固有のHTTP URLでアクセスでき、データ配信に利用することができます。
* OSSのbucketは、Alibaba Cloud Content Delivery Network（CDN）のオリジンとして利用することができます。
* なお、OSSのストレージスペースはRAIDやHDFS、file_blockのように分割で保持されていないので、画像や動画の共有サイトなど、ユーザー主導でデータ量の多いWebサイトのデータ保存に最適です。
* さまざまなデバイス、ウェブサイト、モバイルアプリケーションが、OSSから直接データを読み取ったり、OSSにデータを書き込んだりすることができます。
* OSSへのデータの書き込みは、ファイルのアップロードやストリームを使って行うことができます。

### 静的ウェブサイトのホスティング
* 静的なHTMLファイル、画像、動画、JavaScriptなどのクライアントスクリプトなどを、費用対効果、可用性、拡張性の高いストレージソリューションとして利用することができます。

### 計算・分析用データウェアハウス
* OSSは複数のコンピューティングノードから同時にデータにアクセスできる高いスケーラビリティを備えており、並列処理ができるので単一のノードのパフォーマンスに制限されずに済みます。

### データのバックアップとアーカイビング
* OSSは重要なデータのバックアップとアーカイブのために、高い可用性、拡張性、安全性、信頼性を備えたソリューションを提供します。
* ライフサイクルルールを設定することで、コールドデータのストレージクラスをIAまたはアーカイブに自動的に変換し、ストレージコストを削減することができます。
* CRR（cross-region replication）ルールを設定することで、異なるRegionのbucket間で自動的かつ非同期でリアルタイムデータを複製することができます。例えば、中国RegionにあるOSSにデータをアップロードしたら、日本RegionのOSSでそのデータをアクセスすることが出来ます。




# Elastic Block Storage
> [Elastic Block Storage](https://www.alibabacloud.com/product/disk)

* Elastic Block Storage（EBS）はECS向けのブロックストレージサービス。ECSにアタッチしながら、ECSのストレージ容量を増やすことが出来ます。
* EBSに書き込まれたデータは、同じZone配下の3つのBlock Storageクラスターに保存されるため、99.9999999％（9が9個）の信頼性・可用性を持ちます。
* Elastic Block Storage（EBS）のブロックストレージとは、データを「ブロック」 と呼ばれる細かい単位で分割して保管する方式です。
* ビジネス要件に応じてストレージ容量をリアルタイムで調整することが出来ます。また、別のECSへ接続もしくは別のEBSへ切り替えしながら接続、利用することもできます。


# TableStore
> [Table Store](https://www.alibabacloud.com/product/table-store)

* 大量の構造化データを保存するデータストレージサービス。データを効率的に検索しやすく、DingTalkチャットツールやIoTなどでも幅広く利用されています。
* データは複数のバックアップファイルを作成し、ラック全体の異なるサーバーに保存します。そのため、99.99％の耐久性と99.999999999％（9の11個）の可用性を持ちます。
* Talbe Store テーブルは固定フォーマットを必要としない構造で、格納されるデータ量は無制限です。
* 異なるラックの異なるサーバーにまたがって複数のデータコピーを保存するため、障害自動検出時はバックアップからすぐ復元するといった高可用性を持ちます。


![Storage](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/3.2.PNG "Storage")


# File Storage NAS
> [Network Attached Storage](https://www.alibabacloud.com/product/nas)

* NASはECS、EGS、Container Service for Kubernetes（ACK）などにアタッチできるクラウドストレージサービスです。
* NFSプロトコルとSMBプロトコルの両方をサポートし、分散ファイルシステムとして共有アクセス、スケーラビリティ、高い信頼性を持ちます。
* NASは複数のコンピューティングノードにマウントしエータを共有することができるため、コスト節約ができます。

![Storage](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/3.3.PNG "Storage")


# Data Transport
> [Data Transport](https://www.alibabacloud.com/cloud-tech/product/data-transport)

* Data TransportはIDCやオンプレミスなどオフラインにあるTBレベルの大規模データを移行するサービスです。
* ローカルファイルシステム、NAS、HDFS などに対応しています。(HDFS などは NAS に変換が必要)
* AlibabaCloudカスタマーよりDataTransportらハードディスクを借りて、オンプレミスのデータをOSSへアップロードします。

![Storage](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/3.4.PNG "Storage")



# サマリ
|プロダクト名|コメント|
|---|---|
|[Object Storage Service](https://www.alibabacloud.com/product/oss)|オブジェクトストレージ|
|[Elastic Block Storage](https://www.alibabacloud.com/product/disk)|ブロックストレージ|
|[Table Store](https://www.alibabacloud.com/product/table-store)|TableStore(NoSQL)|
|[OSS Archive Storage](https://www.alibabacloud.com/cloud-tech/doc-detail/90090.htm)|アーカイブストレージ|
|[Network Attached Storage](https://www.alibabacloud.com/product/nas)|ファイルストレージNAS|
|[Cloud Paralleled File System](https://www.alibabacloud.com/cloud-tech/product/111536.htm)|クラウドパラレルファイルストレージ|
|[Data Transport](https://www.alibabacloud.com/cloud-tech/product/data-transport)|オンラインとオフラインのデータ転送サービス（Lightning Cube）|
|[Hybird Backup Recovery](https://www.alibabacloud.com/ja/products/hybrid-backup-recovery)|ハイブリッドクラウドのバックアップサービス|
|[Cloud Storage Gateway](https://www.alibabacloud.com/ja/products/cloud-storage-gateway)|クラウドストレージゲートウェイ|
|[Hybrid Cloud Storage Array](https://www.alibabacloud.com/product/storage-array)|ハイブリッドクラウドストレージアレイ|
|[Hybrid Cloud Distributed Storage](https://www.alibabacloud.com/product/hybrid-cloud-distributed-storage)|ハイブリッド分散ストレージ|
|[Storage Capacity Unit](https://www.alibabacloud.com/product/scu)|ストーレジ容量単位パッケージ|

<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


