---
title: "Cloud Storage Gatewayのご紹介"
metaTitle: "Alibaba Cloud の Cloud Storage Gateway を試してみた"
metaDescription: "Alibaba Cloud の Cloud Storage Gateway を試してみた"
date: "2019-12-27"
author: "SBC engineer blog"
thumbnail: "/Storage_images_26006613489252600/20191226165720.png"
---

## Alibaba Cloud Cloud Storage Gatewayのご紹介

本記事では、Cloud Storage Gatewayをご紹介します。

# はじめに

そもそも「Cloud Storage Gateway」ってなに、という質問に対して、[プロダクトサイト](https://www.alibabacloud.com/ja/products/cloud-storage-gateway)で確認してみました：

> Cloud Storage Gateway はオンプレミスおよびクラウド環境からクラウドストレージへのアクセスを提供する Gateway サービスです。 Cloud Storage Gateway を利用することでオンプレミスインフラストラクチャーから Alibaba Cloud Object Storage Service のようなクラウドストレージサービスへシムレスかつ安全に接続できます。Cloud Storage Gateway が標準なストレージプロトコルをサポートします：NFS、SMB、iSCSI。

とのことです。

Alibaba Cloud OSS をストレージとして、制限のないストレージを ECS インスタンスやオンプレミスサーバーへもマウントで、データバックアップやシステム移行など、様々な用途に適用できます。この記事では、ECS インスタンスからアクセスする File Gateway を作成して、その転送速度など調べてみたいと思います。

# 事前準備とやること一覧

Cloud Storage Gateway が Alibaba Cloud OSS バケットをストレージとして利用されるので、OSS バケットが事前に準備されるとします。後、File Gateway が構築されてから、ECS インスタンスからマウントし、テストをする予定となります。テスト用 ECS インスタンスも別途用意されているとします。

本実験は以下の流れで行います：


> 1. File Gateway および NFS Share 作成
> 2. ECS から File Gateway をマウント
> 3. ファイル転送などテスト


# File Gateway および NFS Share 作成

File Gateway を作成する前に、Gateway Cluster と呼ばれるものを作成する必要があります。Cloud Storage Gateway コンソールより作成できます。

![Gateway Cluster 作成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613489252600/20191226162602.jpg "Gateway Cluster 作成")



次に、File Gateway を作成します。Alibaba Cloud の Cloud Storage Gateway では、モデルによって性能や課金が変わります。詳細は[プロダクト課金](https://www.alibabacloud.com/ja/product/hcs_sgw/pricing)をご参考ください。このテストでは Basic モデルを利用します。

![20191226163128](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613489252600/20191226163128.png "20191226163128")

ここまで File Gateway の作成が完了しますが、ECS からマウントマウントできるのに、NFS Share を作成する必要があります。NFS Share を作る前に、Cache Disk が必要です。Cache Disk はコンソールから簡単に作れます。

![20191226163832](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613489252600/20191226163832.png "20191226163832")


最後に NFS Share を作成します

![20191226164107](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613489252600/20191226164107.png "20191226164107")

![20191226164242](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613489252600/20191226164242.png "20191226164242")


# ECS から File Gateway をマウント

前のステップで作成した NFS Share の詳細情報には、マウント用エンドポイントがあります

![20191226164521](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613489252600/20191226164521.png "20191226164521")


また、この NFS Share にアクセスできる IP アドレスなど設定が可能です

![20191226164629](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613489252600/20191226164629.png "20191226164629")


ここで、何も指定しない場合、もしくは ECS の内部 IP アドレスを含む設定になった場合、ECS インスタンスから NFS Share をマウントできます。その他の場合はマウントできませんので、この設定に注意しましょう。

![20191226165042](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613489252600/20191226165042.png "20191226165042")

※注意点：ECS で mount.nfs 実行する前に、nfs-common をインストールする必要な場合があります。

# ファイル転送などテスト

次に、rsync を使用して、ローカルの 1GB のファイルを mount フォルダに同期する実験を行いました。

![20191226165720](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613489252600/20191226165720.png "20191226165720")


実験結果のスクリーンショットでは、左の画面が ECS の操作画面とあり、右側が ローカルマシンで aliyun cli を用いて OSS の内容を確認する画面となります。以下の実験結果が出ました：

1. 同期速度がおよそ 1Gbpsに近い (最大 128MBps)、Basic Gateway の仕様が確認できます。
2. 数秒後、OSS バケットでファイル確認できいます。
3. ECS からファイルを削除すると、数秒後 OSS バケットの状態が反映されます。

なかなかいい性能が期待できると思います。

# おわりに

本実験では、Alibaba Cloudのインターナショナルサイトのプロダクトの「Cloud Storage Gateway」を試してみました。実際、AWS の Storage Gateway と似たような機能を持ってるので、AWS Storage Gateway も試してみました。どちらが良いかよりも、仕様の違いと価格体系の違いがわかりました。

仕様違いに関しては、AWS Storage Gateway を作成する際に、ゲートウェイ用の EC2 インスタンスの作成する必要があります。その EC2 の選択で、Gateway の性能が変わるでしょうかと思います。それに対して、Alibaba Cloud の Cloud Storage Gateway では、ECS インスタンスがいらずに Gateway が作成できます。そして Gateway の性能がモデルによって決めます。また、Alibaba Cloud の Cloud Storage Gateway のデータ書き込みなど OSS の API リクエストしか課金しますが、AWS Storage Gateway では、S3 の API リクエスト課金の他に GB 単位でデータの書き込み費用がかかります（但し月間 $125 という上限があります）。



