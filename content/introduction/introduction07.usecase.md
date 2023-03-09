---
title: "ユースケース紹介"
metaTitle: "Alibaba Cloudによる基本的なユースケース紹介をまとめています"
metaDescription: "Alibaba Cloudによる基本的なユースケース紹介をまとめています"
date: "2021-07-01"
author: "Hironobu Ohara"
thumbnail: "/images/SOL02.PNG"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## ユースケース
Alibaba Cloudで何が出来るか？をイメージさせるために、いくつか基本的もしくは代表的なユースケースを紹介します。
> ここには載せていないその他のユースケースも多数あり、適時追加する予定です

---

# Case1. Alibaba Cloud と Amazon Web Service（AWS） との間のVPN接続
* 構成：Alibaba CloudとAmazon Web Service（AWS）をVPN Gatewayで接続
* 効果：Alibaba CloudとAmazon Web Service（AWS）をVPN接続することで、双方間でよりセキュアなデータ転送やデータやり取りが行える
* 費用：毎月100USD～（ VPN Gatewayによるトラフィック料は $0.120USD/GB）
* 構築方法：[AlibabaCloudとAWSネットワーク接続手順](https://sbopsv.github.io/cloud-tech/usecase-network/NETWORK_009_AlibabaCloud_AWS-VPNGatewayConnection)
![solution samples](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/SOL02.PNG "solution samples")



---

# Case2. Alibaba Cloud と Azure との間のVPN接続
* 構成：Alibaba CloudとAzureをVPN Gatewayで接続
* 効果：Alibaba CloudとAzureをVPN接続することで、双方間でよりセキュアなデータ転送やデータやり取りが行える
* 費用：毎月10USD～（ VPN Gatewayによるトラフィック料は $0.120USD/GB）
* 構築方法：[AlibabaCloudとAzureネットワーク接続手順](https://sbopsv.github.io/cloud-tech/usecase-network/NETWORK_010_AlibabaCloud_Azure-VPNGatewayConnection)
![solution samples](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/SOL03.PNG "solution samples")


---

# Case3. AWS S3からAlibaba Cloud OSSへのマイグレーション
* 構成：OSSImportを使ってAWS S3から Alibaba Cloud OSSへデータをマイグレーション
* 効果：AWS S3から Alibaba Cloud OSSへセキュアなデータマイグレーションを実現
* 費用：毎月1USD～（AWS S3から外部へのアウトバインドで1GB以上のデータなら0.114 USD/GB ）
* 構築方法：[AWS S3からAlibaba Cloud OSSへ](https://sbopsv.github.io/cloud-tech/migration/MIGRATION_005_Migrate_from_S3_to_OSS)
![solution samples](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/SOL04.PNG "solution samples")


---

# Case4. MC-Hologresによるバッチ処理の自動化～可視化
* 構成：OSSにCSVファイルをアップロードすることで、毎日もしくは週次バッチベースでMaxCompute、Hologresへ格納し可視化。その結果はAPIサービスとして展開。
* 効果：ローコードながら1時間で日々のデータ可視化の自動化を構築・運用することができます
* 費用：毎月250USD～（DataWorks DataIntegrationが最低190USD～）
* 構築方法：[MC-Hologresによるバッチ処理の自動化～可視化](https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_006_hologres-batch-sol)

![solution samples](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/SOL01.PNG "solution samples")



---


# Case5.LogServiceとHologres間のリアルタイムETL
* 構成：LogServiceでリアルタイムデータ収集しソーステーブル、OSSをディメンションテーブルとしながらRealtimeComputeでリアルタイム整形し、Hologreで集約・可視化
* 効果：ローコードながら1時間で日々のデータ可視化の自動化を構築・運用することができます
* 費用：毎月350USD～
* 構築方法：[Log ServiceとHologres間のリアルタイムETL](https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_004_logservice-hologres)

![solution samples](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/SOL16.PNG "solution samples")



---


# Case5. logtailから始まるLogServiceによる可視化
* 構成：ECSやIDCなどにlogtailをインストールすることで、データをリアルタイムでLogServiceへ集約、可視化
* 効果：様々なデータソースに対し、logtailを導入することでクイックにデータ可視化をすることが出来ます。
* 費用：毎月100USD～（200GBのデータを使用した場合）
* 構築方法：[logtailから始まるLogServiceによる可視化](https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_007_Actual_Operation_part1)
![solution samples](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/SOL15.PNG "solution samples")


---

# Case6. KnativeによるサーバーレスK8Sデプロイメント
* 構成：Knativeを使うことで、コンテナ化されたアプリケーションをデプロイ
* 効果：O&M（運用保守）などの労力を抑えることができるうえ、サーバレスなのでセキュアな展開ができます
* 費用：毎月130USD～
* 構築方法：[KnativeによるサーバーレスK8Sデプロイメント](https://sbopsv.github.io/cloud-tech/usecase-serverless/SERVERLESS_003_serverless_k8s_deployment)
![solution samples](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/SOL05.PNG "solution samples")


---

