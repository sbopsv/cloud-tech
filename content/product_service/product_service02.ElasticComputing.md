---
title: "02.仮想コンピューティング・コンテナ・IaaS"
metaTitle: "仮想コンピューティング・コンテナ・IaaS系プロダクトサービス紹介"
metaDescription: "Alibab Cloudの仮想コンピューティング・コンテナ・IaaS系プロダクトサービスをご紹介します。"
date: "2021-06-02"
author: "Hironobu Ohara"
thumbnail: "/images/1.3.PNG"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## 仮想コンピューティング・コンテナ・IaaS系プロダクトサービス紹介

Alibaba Cloudはクラウドサービスなので、Alibaba CloudユーザーはVPC（Virtual Private Cloud）を作成することで、その中に仮想サーバーを配置することができます。この仮想サーバーをECS（Elastic Compute Service）と呼びます。
ECS は HyperVisor型の仮想サーバーなので、Webコンソールから数回クリックするだけで30秒以内に素早く立ち上げられること、使い捨て利用ができること、他のユーザーからアクセスができない構造が特徴です。
Alibaba Cloud の ECS は Webコンソールで対象のRegion、対象のSpec、対象のOS、必要なストレージサイズ、必要な台数をマウスでクリックするだけで、構築することができます。Specや台数はシステム利用状況に応じて柔軟に変更することができます。
Alibaba CloudはECSをベースとする様々なプロダクトサービス及び仮想コンピューティングサービスがあるので、ECSの概要を把握しておくと損はないです。

# ECS
> [Elastic Compute Service](https://www.alibabacloud.com/product/ecs)

* Alibaba Cloud Elastic Compute Serviceの略でAlibabaCloudの基幹となる仮想サーバ提供サービスです。
* 仮想サーバの1つ1つの実体は「インスタンス」と呼ばれ、ECSインスタンスはサーバとは異なります。
* クライアントからのリクエスト数やビジネス要件に応じてインスタンス台数を増やす（スケールアウト）、インスタンスの性能を上げる（スケールアップ）が簡単なので、サーバ調達のための時間やコストを削減できます。

![ElasticComputing](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/1.1.PNG "ElasticComputing")


## ECS導入への流れについて
### 料金タイプの設定
* ECSは PAYG（従量課金制）とSubScriptionのどれかとなっており、また利用した分だけのコスト負担で済みます。
* ECSをはじめ仮想コンピューティングの課金時間は1秒単位で扱われており、最小課金は1分となるため1分後から秒単位で課金されます。
* ECSを長期運用する場合、SubScriptionとして継続利用割引が適用され、年間最大で15%の割引が発生します。
* AWSのようにリザーブドインスタンス（RI）で年間割引で利用した場合、リザーブドインスタンス（RI）は事前支払い式なので途中解約しても返金されませんが、Alibaba CloudのSubScriptionだと途中解約しても返金することが可能です。
* accountごとに信用スコアがあり（仕組みは非公開）信用スコアが高ければ高いほど途中返金対応やSubScriptionを年間最大55%割引などの様々な特典があります。
* その他、サービングプランというものがあり、事前に1年もしくは3年の間に一定量のリソースを使用することで、 PAYG（従量課金制）をリソース使用率ごとに割引してくれます。


### インスタンスタイプの選択
* ECS は インスタンスのスペックごとにファミリータイプがあります。例えば、CPU/メモリ/ネットワーク/などのスペックごとの組み合わせをパッケージしながら展開しています。
* 具体的には、g5という一般用途タイプファミリーではvCPU とメモリーの比率は1:4で高いネットワークパフォーマンスに合う、より高度なコンピューティング仕様とか、様々なファミリー・タイプがあります。[インスタンスファミリーの詳細はこちら](https://www.alibabacloud.com/cloud-tech/doc-detail/25378.htm) を参照頂ければ幸いです。

> https://www.alibabacloud.com/cloud-tech/doc-detail/25378.htm

![ElasticComputing](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/1.2.PNG "ElasticComputing")



### OSの設定
* ECSインスタンスは通常イメージファイルを使ってOSを選定します。イメージファイルはWindows ServerやRedHat EnterpriseLinuxのようにOSのライセンス代が発生するものを除いては基本的に無料です。
* イメージファイルは「Public Image」「Custom Image」「Shared Image」「Marketplace Image」の4種類があります。
* Public Image は [Basic なイメージファイル](https://www.alibabacloud.com/cloud-tech/doc-detail/108393.htm)です。ユーザーが初期設定をする必要があります。
* Custom Image は[システム環境、アプリケーション、ソフトウェア構成などが含まれているイメージファイル](https://www.alibabacloud.com/cloud-tech/doc-detail/172789.htm)です。
* Shared Image は他のAlibaba Cloud account間で共有するCustom Imageのことを指します。[ECSインスタンスのコンソールからImageを共有](https://www.alibabacloud.com/cloud-tech/doc-detail/25463.htm)することが出来ます。
* Marketplace Image は独立した様々なソフトウェアベンダーによって提供されたイメージファイルです。[Webアプリケーションやソフトウェア開発などを素早くデプロイすることを目的](https://www.alibabacloud.com/cloud-tech/doc-detail/52224.htm)としています。
* OSには、Windows Server、Anolis OS、 Ubuntu、CentOS、Red Hat Enterprise Linux、Debian、OpenSUSE、SUSE Linux、FreeBSD、Fedora CoreOS、Fedora、およびCoreOSなどが選定可能です。


### ストレージの設定
* ECSインスタンスに接続するストレージとしてCloud disks（システムディスク）を設定します。Cloud disksはECS付帯のストレージや、外部Elastic Block Storage（EBS）などを選定することができます。
* ストレージは [ESSD（Enhanced SSDs）](https://www.alibabacloud.com/cloud-tech/doc-detail/122389.htm) を提供しており、高い処理パフォーマンス・スループットを提供します。
* Cloud disks（システムディスク）は最大で500GBまでです。これ以上のストレージを追加する場合は、Elastic Block Storage（EBS）を作成し、アタッチする必要があります。


### ECSインスタンスのネットワーク設定
* ECSインスタンスが外部・内部インターネットや、その他Alibaba Cloudプロダクトサービスのリソースと通信が出来るように、ネットワークの設定をします。
* オプションとして、Public IPアドレスを割り当てることが出来ます。外部インターネットからECSへアクセスするときはPublic IP割り当てをしていることが必須となっています。
* Public IPアドレス割り当ては、ネットワークのトラフィック量に依存しない帯域幅ごとの支払いと、トラフィック量に依存したトラフィックによる支払いの2種類があります。


### セキュリティグループの設定
* セキュリティグループは、ECSインスタンスからデータを外部に出すアウトバウンドトラフィックと、外部からECSインスタンスへデータを入れるインバウンドトラフィックの2種類を制御する仮想ファイアウォールです。
* ECSインスタンスには少なくとも１つのセキュリティグループに所属している必要があります。
* セキュリティグループは同リージョンの複数のECSインスタンスを管理することが出来ます。
* 異なるセキュリティグループを持つECSインスタンス間で、内部ネットワークを通じて相互に通信することはできません。ただし、セキュリティグループを通じて相互通信をすることは可能です。
* このセキュリティグループを通じて、HTTP portの80、HTTPS portの443、SSH portの22、RDP portの3389、など許容Portを設定することができます。

![Networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/2.4.PNG "Networks")


### SSHキーペアの設定（Linuxのみ）
* OSがLinuxの場合のみ、SSHキーペアを使ったログインをすることが出来ます。SSHキーペアは公開鍵/秘密鍵認証方式であり、鍵認証を用いてログインという形になります。
* コンソールでキーペアというサービスで公開鍵・秘密鍵を発行します。公開鍵はAlibaba Cloud側で管理され、ECSインスタンス生成時にコピーされます。秘密鍵はユーザー側がダウンロードし、保管しながら、ECSインスタンスへSSHアクセス時に使用します。
* SSHキーペアとしてユーザー側が秘密鍵を紛失した場合、ECSにアタッチされてる公開鍵へ認証することができず、結果としてログインができなくなるため注意が必要です。


### タグの追加
* ECSインスタンスに対してタグ（Alibaba Cloudリソースとして付け加えられるラベル）を付与することができます。
* タグはプロジェクト、ユーザー、組織、などのグループ化をすることができるので運用の効率化やリソースのアクセス制御ができます。

> https://www.alibabacloud.com/cloud-tech/doc-detail/25477.htm

### リソースグループの設定
* Alibaba Cloudは、様々なプロジェクトサービスを一元管理するリソースグループがあります。
* デフォルトは `Default Resource` ですが、要件やプロジェクトに応じて独自リソースグループを作成することができます。
* リソースグループ内ではサービス間、例えばECSからECSやRDSへの連携をすることができますが、別のリソースグループをまたぐ接続は基本的に別環境となります。
* リソースグループごとにプロダクトサービスのユーザー（RAM）権限管理を行うことができます。
* 用途としては、テスト環境と本番環境の区別、ユーザーごとの権限管理、などが挙げられます。


# Server Load Balancer（SLB）
> [Server Load Balancer](https://www.alibabacloud.com/product/server-load-balancer)

* AlibabaCloud Server Load Balancerの略でECSに配置したアプリケーションやWeb サイトのトラフィックを分散させ、拡張性と可用性を高める負荷分散制御サービスです。
* SLBはアタッチしたECSらバックエンドサーバのヘルスチェックを行い、異常状態あれば自動に分離するといったSPOF (単一障害点) 問題を回避します。
* ユーザーからのトラフィックを分散するだけでなく、DDoS攻撃からの負荷を分散する効能もあります。

![ElasticComputing](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/1.3.PNG "ElasticComputing")




# Auto Scaling
> [Auto Scaling](https://www.alibabacloud.com/product/auto-scaling)

* Auto ScalingはECSの処理リソースに応じてECS台数を自動調整するサービスです。
* 需要増・需要減が必要な場所のみリソースを割り当てるため、需要予測やトラフィックの急増に関する心配がなくなります。
* 時刻指定、動的、カスタム、固定、スケジュール設定、ヘルシーモードなど、複数のスケーリングモードを同時に設定できます。
* API 経由で外部のモニタリングシステムにアクセスすることもできます。

![ElasticComputing](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/1.4.PNG "ElasticComputing")




# Container Service for Kubernetes
> [Container Service for Kubernetes](https://www.alibabacloud.com/product/kubernetes)

* Alibaba Cloud Container Service for Kubernetes はフルマネージドでKubernetesをクラウド上で管理するサービスです。
* 複数のアプリケーションリリース方法と継続的な配信機能を提供し、マイクロサービスアーキテクチャをサポートします。
* コンテナ管理クラスターのセットアップを簡易化し、仮想化やストレージ、ネットワーク、セキュリティなどAlibabaCloud機能とインテグレートすることで、コンテナーの実行に理想なクラウド環境を構築します。


![ElasticComputing](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/1.5.PNG "ElasticComputing")


# Function Compute
> [Function Compute](https://www.alibabacloud.com/product/function-compute)

* FunctionComputeはECSなど仮想サーバ不要、必要な時のみコードを実行するフルマネージドのサーバーレス実行環境です。
* アプリケーションを実行するインフラクチャ(IaaS）はAlibaba Cloudが管理されるため、オートスケーリングも不要です。
* 処理件数が増えてくると、自動的に実行ユニットを増やして並列にスケールアウトしてくれます。そのため、CPUやメモリなの使用率に応じてオートスケール設定を調整するなどの作業は不要となります。
* 様々なSDKや開発言語にも対応しており、また様々なAlibaba Cloudサービスと連携することが可能です。そのため、例えばOSSにファイルアップロードされたことをトリガーとしてkafkaがそのデータを送信といった、イベント駆動型アプリケーションを構築、運用することができます。
* コードを実行する回数・かかった時間だけ料金が発生するだけなので、ECSを運用するより低コストで済みます。

![ElasticComputing](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/1.6.PNG "ElasticComputing")


# Elastic GPU Service
> [Elastic GPU Service](https://www.alibabacloud.com/product/gpu)

* Alibaba Cloud Elastic GPU Serviceの略でGPUベースの仮想サーバ提供サービスです。
* GPUは並列演算処理に特化しており、DeepLearningやビデオ処理、グラフィック処理など高い演算能力を必要とする分野で活躍できます。
* E-MapReduceやPAIでもクラスタのインスタンスタイプとしてGPUインスタンスを選定することができます。

# ECS Bare Metal Instance
> [ECS Bare Metal Instance](https://www.alibabacloud.com/product/ebm)

* ECS Bare Metal Instanceの略で、物理的な分離により、セキュアで高いパフォーマンスを実現する水平拡張可能なベアメタルコンピューティングサービスです。
* Bare Metalは物理マシンの「高処理能力」と「安定性」、仮想マシンの「スピード」と「柔軟性」を併せ持つインスタンスです。
* 高パフォーマンスが必要なら物理マシンを利用し、分散（HA 可用性）が必要なら仮想マシンを利用するといった使い分けが可能です。
* ※Bare（むき出しの）Metal（金属）、OSが入ってない物理サーバで稼働する仮想サーバサービス。

![ElasticComputing](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/1.7.PNG "ElasticComputing")


# E-HPC
> [E-HPC](https://www.alibabacloud.com/product/ehpc)

* AlibabaCloud Elastic High Performance Computingの略で、高性能計算の仮想コンピュータサービスです。
* E-HPCはGPUインスタンスを備えたIaaS、高性能コンピューティングソフトウェアスタックを備えたPaaS、アプリケーションテンプレートのカスタマイズを備えたSaaSをサポートします。
* 1つのHPCにつき、通常PCの1,000〜10,000台分の計算能力を持ち、これらはMPIやGPGPUなど分散処理では追いつかない高性能計算処理を目的としたものです。

![ElasticComputing](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/1.8.PNG "ElasticComputing")



# Dedicated Host
> [Dedicated Host](https://www.alibabacloud.com/product/ddh)

* Dedicated Hostの略で、 Alibaba Cloud によって提供される物理サーバーです。
* DDHを使うことで、ECSにはないハイスペック環境を構築、運用することができます。またWindows Server やWindows SQL Server といった既存のソフトウェアライセンスを包括で使用することができます。
* ソケット単位、コア単位、VM 単位でソフトウェアライセンスを所有してる場合、DDHを利用することでクラウドへ移行した時のコスト削減が可能になります。加えて、CPUとI/Oの安定性を保証するため、ゲーム案件などで高パフォーマンスを確実にします。

![ElasticComputing](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/1.9.PNG "ElasticComputing")



# Resource Orchestration Service
> [Resource Orchestration Service](https://www.alibabacloud.com/product/ros)

* Resource Orchestration Serviceの略で、JSON形式のテキストファイルでAlibabaCloudリソース（VPC、ECS、RDS、OSS等）を自動構築するサービスです。
* ROS自体は利用無料で、利用したインスタンス等のみ料金がかかります。
* テンプレート化することにより、 AlibabaCloudリソース構成の見える化、バージョン管理、同じ構成を何度も構築することができます。

![ElasticComputing](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/product_service/images/1.10.PNG "ElasticComputing")



# サマリ

|プロダクトサービス名|内容|
|---|---|
|[Elastic Compute Service](https://www.alibabacloud.com/product/ecs)|クラウドサーバ|
|[ECS Bare Metal Instance](https://www.alibabacloud.com/product/ebm)|Bare Metalクラウドサーバ|
|[Simple Application Server](https://www.alibabacloud.com/product/swas)|軽量アプリケーションサーバー|
|[FPGA Compute Service](https://www.alibabacloud.com/cloud-tech/doc-detail/108504.htm)|FPGAクラウドサーバ|
|[Elastic GPU Service](https://www.alibabacloud.com/product/gpu)|GPUクラウドサーバ|
|[Dedicated Host](https://www.alibabacloud.com/product/ddh)|専有ホスト|
|[Elastic Desktop Service](https://www.alibabacloud.com/product/cloud-desktop)|ワークステーション|
|[Super Computing Cluster](https://www.alibabacloud.com/product/scc)|スーパーコンピューティングクラスター（SCC）|
|[E-HPC](https://www.alibabacloud.com/product/ehpc)|高性能コンピューティング（E-HPC）|
|[Batch Compute](https://www.alibabacloud.com/product/batch-compute)|バッチ計算|
|[Container Service for Kubernetes](https://www.alibabacloud.com/product/kubernetes)|コンテナサービスKubernetes版|
|[Container Service](https://www.alibabacloud.com/product/container-service)|コンテナサービス|
|[Elastic Container Instance](https://www.alibabacloud.com/products/elastic-container-instance)|サーバレスコンテナサービス|
|[Alibaba Cloud Service Mesh](https://www.alibabacloud.com/cloud-tech/doc-detail/147513.htm)|サービスメッシュ|
|[Container Registry](https://www.alibabacloud.com/product/container-registry)|コンテナレジストリ|
|[Function Compute](https://www.alibabacloud.com/product/function-compute)|Function as a Service|
|[Auto Scaling](https://www.alibabacloud.com/product/auto-scaling)|Auto Scaling|
|[Operation Orchestration Service](https://www.alibabacloud.com/product/oos)|O＆Mプラットフォームのオーケストレーション|
|[Resource Orchestration Service](https://www.alibabacloud.com/product/ros)|リソースの作成と管理サービス|
|[Web App Service](https://www.alibabacloud.com/ja/products/webx)|Webアプリケーションホスティングサービス|
|[Serverless Workflow](https://www.alibabacloud.com/cloud-tech/doc-detail/114020.htm)|Function as a Service型分散ワークフロー|
|[Alibaba Cloud Linux 2](https://www.alibabacloud.com/zh/product/alibaba-cloud-linux-2)|Alibaba Cloud Linux 2|



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


