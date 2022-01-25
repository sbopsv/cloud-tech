---
title: "Alibaba Cloudの使いどころ"
metaTitle: "Alibaba Cloudの使いどころについて"
metaDescription: "Alibaba Cloudの使いどころについてを説明します"
date: "2021-06-02"
author: "Hironobu Ohara"
thumbnail: "/images/5.1.1.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


# Alibaba Cloudの使いどころ

Alibaba Cloudは他の世界規模の大手クラウドサービス（AWS、GCP、Azureなど）に比べると、後発のクラウドサービスになります。そのため、プロダクトサービスやサポート対応などは他のクラウドサービスよりも遅れている部分があります。そこは日進月歩、早いスピードで進化中です。その点を除き、Alibaba Cloudはほとんどのシナリオに適することができます。   

中でも、Alibab Cloudが得意とし、最もメリットが大きいのは、「独身の日」を支えるデータ処理基盤や、世界各地からのECサイトへのアクセスを支えるグローバル展開、堅牢なセキュリティ、省電力によるサービス基盤、そしてビジネスを継続するための機械学習などの分野です。   


では、それぞれ個別に、なぜAlibaba Cloudが優れているかを解説します。   


# Point1: フルマネージド型サービス

Alibaba Cloud は中国発で海外に多く広まっているクラウドサービスです。その理由は、`フルマネージド型サービスによる運用負荷からの解放` があるためです。   
その背景として、中国ではBigDataやデータ分析、AI、エッジコンピューティング、5G、IoTなどの技術の急速な発展が進んでいます。それに伴い、多くの会社はテクノロジーの変革を優先戦略としています。しかし、導入コスト、物理サーバー導入に伴うNW帯域幅、NW遅延、学習コストなどの様々な課題があり、Alibaba Cloudはこの難題を解決するためにフルマネージド型サービスとして登場しました。   

Alibaba CloudはWeb上のコンソールを数回クリックするだけで、仮想コンピューティングやデータベース、ネットワーク、AI、データ分析など様々なサービスを素早く展開することが出来ます。   

例えば、オンプレミスの環境のもと「サーバーを10台導入」となれば、データセンターおよびHW調達、HWら物理操作、OSインストール、ソフトウェア導入、運用、、と工数と労力が発生していまいます。それもサーバーがもし10、100台となると、その分だけ工数がかかります。しかし、クラウドサービスによるフルマネージド型サービスであれば、Web上でのコンソールだけでボタンを数か所クリックするだけで、数分以内にサーバーを10、100台と導入することができます。ユーザーはHW調達やOSインストール作業は不要です。   

Alibaba Cloudによるフルマネージド型サービスは仮想コンピューティングのみならず、様々なプラットフォームにも普及しています。   
Amazon Web Services（AWS）のElasticsearch プロダクトサービスは元々Elastic社からのサービスなので Alibaba CloudにもElasticsearchプロダクトサービスがありますが、AWSのElasticsearchはクラスター購入からパラメータ設定、起動に最低４つのページ遷移に細かいパラメータ設定が必要です。一方、Alibaba CloudのElasticsearchは１つのシングルページでクラスター購入から起動することが出来ます。パラメータも、Elasticsearchの利用状況に応じて自動でチューニングされます。   

Relational Database Service（RDS）も同じく、AWSのRDSはCPUやRAMなどの使用率を常時ウォッチングしながら、Spec変更やパラメータチューニングが必要ですが、Alibaba Cloudは自動スケーリングできることや Database Autonomy Service (DAS)  と呼ぶデータベースの自律運用サービスにより、RDSやPolarDBのパフォーマンスチューニングなどデータベースエンジニアにとって複雑な作業が不要になります。   

Alibaba Cloudは、フルマネージド型サービスとしてシンプルに素早く展開できるよう、未来の新しいエンジニアやユーザーのために学習コストや労力を限りなくゼロにするように、技術だけで様々な施策が行われています。   

![フルマネージド型サービス](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.1.1.png "フルマネージド")



# Point2:省電力・小スペックで最大のパフォーマンスを提供するため非常に安い

Alibaba Cloudによるクラウドサービスの初期構想を作り、立ち上げ、HPCA殿堂入りした[Jiang Xiaowei氏およびXie Yuan氏](https://www.alibabacloud.com/blog/alibaba-cloud-scientist-jiang-xiaowei-listed-in-the-hpca-hall-of-fame-being-the-first-inductee-from-the-cloud-computing-industry_596268) がいます。Jiang Xiaowei氏は、[Intel社で歴史上史上初の低電力x86 CPU QuarkD1000およびEdisonSoCを設計・構築した経験](https://dl.acm.org/doi/10.1109/HPCA.2012.6169046)があり、更に、[Google社で世界規模向けのSDNネットワークを構築し、世界中のデータセンターを効率よく大規模に展開した](https://www.usenix.org/conference/atc15/technical-session/presentation/mandal) 実績があります。Jiang Xiaowei氏曰く、将来的には「CPUアーキテクチャ、チップ、ハードウェア、メモリ、I/O、セキュリティ、ネットワーク、仮想テクノロジーは限りなく高度化・多様化する」という概念のもと、Alibaba Cloudのデータセンターは独自の技術により省電力・小スペックで最大のパフォーマンスを得るように設計されています。   

その経緯もあって、Alibaba Cloudは最小限のリソースで最大限のパフォーマンスを発揮するコンセプトを持ちます。   
例えば、Alibaba Cloudの主要プロダクトサービスとなるECSは他社を圧倒するパフォーマンスを発揮しています。Alibaba CloudのECS（Elastic Compute Service）は、物理サーバーよりシンプルかつ効率的に管理することができる仮想コンピューティングです。ECSを立ち上げるために事前の準備や予約作業は不要です。インスタンス起動も、Webコンソールから数回クリックするだけで、100台のコンピューティングを30秒未満で立ち上げることができます。30秒未満という数値は、他クラウドサービスからみたら非常に高速です。   

実際、SBCがクラウドコンピューティングに対するベンチマークをとったところ、AWS、GCP、Azureクラウドサービス比較でNo.1のコストパフォーマンスを出しています。   

![ECS](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.2.1.PNG "ECS")

![ECS](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.2.2.PNG "ECS")

![ECS](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.2.3.PNG "ECS")

![ECS](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.2.4.PNG "ECS")

![ECS](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.2.5.PNG "ECS")


他、PolarDB、Hologres、MaxCompute、Elasticsearch、Cloud Enterprise Networkなど、他プロダクトサービスも、最小限の構成で最大限のパフォーマンスを得るようになっていますので、他社プロダクトサービスと比較してかなり安いのが特徴です。   

# Point3: アジアンリージョン展開No.1のクラウドサービス

Alibaba Cloudは中国発でアジアンリージョン展開No.1のクラウドサービスです。そのため、欧米文化を持つAmazon Web Services（AWS）、Azure、Google Cloud Platform（GCP）とはひと味違ったサービス品質基準や利用方法が異なります。特にAlibaba Cloudは多数のユーザーがプロダクトサービスを利用しても落ちない・落ちてもすぐリカバリー出来るよう堅牢な設計ポリシーを持つため、Alibaba CloudだけクラウドサービスでトップレベルのSLAを持ちます。   

||Alibaba Cloud|AWS|Azure| GCP|
|---|---|---|---|---|
|リージョン数|24リージョン展開|25リージョン展開|56リージョン展開|26リージョン展開|
|リージョンエリア|アジアリージョン多数|欧米リージョン多数|世界全域|欧米リージョン多数|
|ECS障害時のリカバリ|◯標準提供|△オプション提供|||
|冗長構成（DB）|◯標準提供|△オプション提供|◯標準提供|△オプション提供|
|SLA（IaaS）|◯1インスタンス毎に保証|△マルチAZ構成が前提|△同じ可用性セットに2 つ以上のインスタンス|△マルチAZ構成が前提|
|サポート|△無償サポートのみ|○サポートメニュー多数|○サポートメニュー多数|○サポートメニュー多数|
|請求費用|全リージョン日本円決済|日本円決済|日本円決済|日本円決済|
|請求支払い方法|請求書払い可能|請求書払い可能|請求書払い可能|請求書払い可能|

参考： [Regions and zones](https://www.alibabacloud.com/cloud-tech/doc-detail/40654.htm)



# Point4: クラウドネイティブデータベース

Alibabaは最初はOracleやMySQLなどのベンダーシステムに依存していました。   
しかし、データ量の増加に伴う処理遅延、ユーザーのワークロードに応じたスケーリングが出来ないこと、運用負荷、容量の上限とコスト問題といった課題に悩まされました。   
そのため、Alibabaはクラウドをベースとした、ApsaraDB for PolarDBをはじめとするクラウドネイティブデータベースを次々とリリースしています。   

![PolarDB](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.5.0.PNG "PolarDB")

クラウドネイティブデータベースは、クラウド環境をフルに生かしながら、ユーザーのワークロードに応じて自動スケーリングするなど、低コストで適切なアプリケーション・パフォーマンスを提供することです。   
そのため、往来のようにデータベース選定時Spec調整や、運用中にSpec変更作業といったサイジングに悩まされることはありません。   
   
実際に、Alibaba Cloud ApsaraDB for PolarDB へマイグレーションして70%もコストを削減した多くの事例があります。   

![PolarDB](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.5.1.png "PolarDB")



# Point5: 「11.11 独身の日」やAlibaba Groupのエコシステムなどで培ったビッグデータ
Alibabaがいかに優れている理由は、大量のデータを効率よく処理し、データ分析結果をビジネスへ還元するところが有名です。   
Alibaba Cloudが独自に開発したLogService、MaxCompute、Hologresと呼ぶプロダクトサービスは、既存のデータ分析基盤やDWHの常識を変えてくれるぐらい衝撃的なアーキテクチャ、性能、価格を持ちます。   

繰り返しになりますが、MaxComputeは2020年独身の日でピーク時は1秒につき58.3万/秒の注文数が発生するレベルで300EBの大規模基盤でも一切落ちることや遅延することなく、サービス処理基盤として運用したり、Hologresは2.5PBを超えるFact Table（単独テーブル）に対しクエリの99%を80ms以下で返却しながら運用した実績があります。これは世界中の様々な人からアクセスしたことによる高ワークロードなので、常に大規模なスケーラビリティが要求されます。同時利用者数はもちろん、バックエンドで1時間に数憶件の処理が当たり前です。通常は一般的なサーバー数千～数万台配置し、注文数を処理するのがやっとですが、それでは運用コスト的にも課題があります。それを解決するのがMaxComputeとHologresです。（PolarDBなども同様に貢献していますが）   

MaxComputeはコンピューティングとストレージを分離した構成でMapReduceアーキテクチャを持つため、ストレージ層はデータを高圧縮しながら保持、コンピューティング層はSQLクエリなどを投与時、処理リソースに応じてクラウドサービスとして瞬時スケーリングするため、低コストながら処理パフォーマンスが非常に高いです。   

![MaxCompute](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.5.3.png "MaxCompute")


現に、MaxComputeは、[TPC-BBというビッグデータのベンチマークテスト](http://tpc.org/tpcx-bb/results/tpcxbb_perf_results5.asp) で圧倒的なコストパフォーマンスを記録しています。これはスペックやノード台数などを追及したらパフォーマンスが向上するが、トレードオフ問題としてコストが増加するという観点からみれば、本当にすごいことです。実際、AWS Redshift、GCP BigQuery、Azure Synapse Analyticsですら、低コストでこれだけのパフォーマンスを発揮することが出来ないので評価対象外になっています。例えば、GCP BigQueryでは10TBを超えるデータのスキャンやクエリ処理は制限事項となっています。   

他社クラウドサービスのDWH基盤に対し毎月500万円、1000万円払っているものは、Alibaba Cloud MaxComputeに切り替えるだけでコストは半分以下に抑制できるのも不可能ではないです。実際MaxComputeへシフトすることで、DWH運用コストを70%削減したお客様の事例もあります。   

![MaxCompute](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.5.2.png "MaxCompute")


続いて、MaxComputeが大規模データの加工処理を含めたDWHとしたら、リアルタイムDWHがHologresです。   
Hologresはバッチ処理とリアルタイム処理の両方をサポートするDWHなので、MaxComputeのテーブルを対象にSQL分析することや、ストリーミングで入ってくるデータをそのままSQL分析することが出来ます。   

![Hologres](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.5.5.png "Hologres")

これはデータ移動に伴うコストや時間を削減すると同時に、分析対象となる「母集団」からデータ容量制限を気にすることなく分析することができるので、非常に大きいです。   
もちろん、SQL分析するだけでなく、Upsert（Update、Insert、Delete）処理することもできます。GCP BigQueryは削除処理に制限事項があり苦労しますが、Hologresだとスムーズに削除することができます。   

![Hologres](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.5.6.png "Hologres")


また、HologresはApacheのコアコミッター数十名によって設計・開発されたもので、その処理パフォーマンス・コストは他DWHと比較してNo.1の実績を持ちます。Alibaba Cloudは「技術で解決する」ことをモットーとしているため、Azure Synapse Analyticsなど他社クラウドサービスに導入されてるApacheソフトウェアを一から設計・開発するほど超越した技術力を持つメンバーたちによって開発されたプロダクトサービスです。そのため、Hologresは他社クラウドサービスより速く、安いのが大きな特徴です。   

![Hologres](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.5.4.png "Hologres")



# Point6: 中国を含めたグローバル展開を支えるネットワーク

前章で紹介したように、Alibabaは、Alibaba.comや支付宝（Alipay）などの様々なサービスを全世界向けに提供するために、Alibaba Cloudは中国から日本を含めたアジアン全域、EU、アメリカなど世界規模のクローズドネットワークを持ちます。そのため、例えばCloud Enterprise Network (CEN) を使うことで、Alibaba Cloud 日本Regionから中国Regionへのネットワークアクセスはどの事業者よりも非常に高速で快適です。   

![CEN](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.6.1.PNG "CEN")

同時に、CENを使うことで、日中ネットワーク品質として、低レイテンシ、パケットロスはゼロです。ユーザーは日本にいながら中国国内のネットワーク環境をストレスフリーに操作することができます。逆のパターン、中国ユーザーが日本国内のネットワーク環境を通じてyoutubeやskypeなど規制されているサイトを自由自在に閲覧することもできます。   

![CEN](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.6.2.PNG "CEN")



# Point7: AIサービス・機械学習

上記にも記述していますが、Alibaba Cloudの強みは「大量のデータを効率よく処理し、データ分析結果をビジネスへ還元」「技術で解決する」をコンセプトとした、様々なAIサービスを展開しています。   
例えば、アリババグループのエコシステムの阿里巴巴や淘宝網（Taobao）、支付宝（Alipay）、天猫（Tモール）などはデータ収集したのち、それをユーザーへ還元するためのアプローチとして「ImageSearch」や「AIRec」などがあります。   

ImageSearch は 淘宝網（Taobao）などのECサイトで培ったノウハウを生かしつつ、商品に対する類似画像検索を提供します。予め商品となる画像データをObject Storage Service (OSS) に格納するだけで、ECサイト上でお客様が欲しい商品がすぐに見つかるような画像認識ソリューションを素早く展開することが出来ます。   

![ImageSearch](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.7.1.PNG "ImageSearch")


AIRec は 商品名一覧と、ユーザーの行動情報（どの商品を閲覧したかetc）、ユーザーリストをMaxCompute、もしくはRDS、OSSに格納するだけで、深層学習ベースでリアルタイムレコメンデーションを提供します。AIRec は 淘宝網（Taobao）や天猫（Tモール）など多くのECサイトやシステムなどに導入され、ユーザー数が1000万人を超えて同時アクセス数が多い状況でも、低価格で秒速でレコメンデーションを実現します。   

![AIRec](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/5.7.2.PNG "AIRec")

他に MLaaS（Machine Learning as a Service）として Machine Learning Platform For AI（PAI）などノーコードで機械学習システム開発ができるプラットフォームなどが多数あります。   

また、データ分析サービスにも付帯で様々な機械学習機能があります。例えば、HologresはProximaというSQLによる機械学習での分析をサポートしています。 Proximaはアリババグループの技術研究開発機構であるアリババDAMOアカデミー（達摩院）によって開発されたもので、SQLクエリだけでレコメンデーション、関連キーワードによるテキスト検索、画像分類、画像認識、類似画像検索、異常画像検索、動画検索、テキスト分類、コンバージョン拡張、需要予測etc・・・幅広いシナリオを満たすことが出来る高速ベクトル検索エンジンです。そのため、Hologresを使うことでリアルタイム機械学習を素早く展開することが出来ます。   


# まとめ
以上、Alibaba Cloudの特徴を説明しました。Alibaba Cloudはクラウドをフルに生かした様々なサービスを展開しています。   
例えば、データベースではユーザーのワークロードに応じてノードを自動でスケーリングするPolarDB、コンテナやEC2インスタンスのオートスケール、RDSのデータ容量の自動拡張、SQLクエリ投与時、処理リソースだけノードを瞬時に分散し並列処理するMaxCompute、使った分だけ課金するのでオンプレミスより安いリモートデスクトップ、データをアップロードするだけで類似画像検索やレコメンデーション、などなどがあります。   

Alibaba Cloudが選ばれる理由の１つとして、「グローバル展開をはじめ、エンジニアの労力からの解放」が挙げられます。例えば淘宝網（Taobao）ではECサイトなどのサービスを通じて毎日数億を超えるデータ量の処理を行っていますが、インフラ運用担当者は不在という体制で運用しています。その他、大規模Webシステムやリアルタイム分析基盤を構築する場合でも、Alibaba Cloudによるフルマネージド型サービスを使うことで、1日、長くて1週間以内にサービスを完成することも可能です。   



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


