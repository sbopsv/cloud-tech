---
title: "MaxComputeの紹介"
metaTitle: "毎年世界No.1のTPC-BB（Big Data処理ベンチマーク）を記録し続けるMaxComputeのご紹介"
metaDescription: "毎年世界No.1のTPC-BB（Big Data処理ベンチマーク）を記録し続けるMaxComputeのご紹介"
date: "2021-03-03"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613674376800/20210104122110.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 毎年世界No.1のTPC-BB（Big Data処理ベンチマーク）を記録し続けるMaxComputeのご紹介

本記事では、毎年世界No.1のTPC-BB（Big Data処理ベンチマーク）を記録し続けるMaxComputeの特徴や他のビッグデータ処理プラットフォームとの違いなどを説明します。


# 背景 - 大規模データを一括処理するのはどれほど大変なのか


大規模データを処理するモチベーションとして、様々な鮮度の高いデータを、素早く示唆のあるデータへ変換することで、ビジネス・インサイト（ビジネスに必要な意思決定）を加速します。      
例えば、リテール業界でこんな有名な話があります。毎日オペレーションとして蓄積されていくPOS（Point of sales）データから、「牛乳は最も購入される商品のため、常に店の後ろに置いた方がベター」「女性の
靴は常に男性の服に向かっていると購入しやすい」「バナナは衝動的な購入なので、店の前に置いた方が効果的」「ビールとおむつは同じ時間帯にて購入する傾向が高いので、ビールを買う導線上におむつを置くと、おむつの売り上げが増加する」という不思議なデータサイエンスが発掘できます。これは普段あるPOSデータから、ビジネス・インサイト（ビジネスに必要な意思決定）へシフトした具体例です。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104114450.png "img")

> http://download.1105media.com/tdwi/Remote-assets/Events/2017/Boston/MarkMadsen_Beer-and-Diapers.pdf


このように、普段ある様々なデータからビジネス・インサイト（ビジネスに必要な意思決定）へ変換するために、Big Data、そしてデータ分析というものが実在しています。       
FacebookのJay Parikh氏曰く、こんな言葉があります。        
“Big data really is about having insights and making an impact on your business. If you aren’t taking advantage of the data you’re collecting, then you just have a pile of data, you don’t have big data.”      
（訳：「Big Dataというのは単なる量をいうのではない。そのデータから重要な情報を抽出し、ビジネス上の意思決定に活用できて初めてBig Dataと言える。そうした活用が出来ていないのであれば、いくらたくさんデータを集めていてもBig Dataではない。」）     

> https://techcrunch.com/2012/08/22/how-big-is-facebooks-data-2-5-billion-pieces-of-content-and-500-terabytes-ingested-every-day/


しかし、ビジネス・インサイト（ビジネスに必要な意思決定）を得るための大規模データを処理となると、技術的に難しくなります。      
少しイメージしてみましょう。100TB、100PB、1EB、、、サーバーやHDDストレージに乗り切らないレベルの大規模データを許容できる時間内に処理し、そこから必要なデータを効率的に抽出するのは非常に難しいです。データが増えれば増えるほど、費用、処理時間、保守運用など様々なコストがかなりかかってきます。ビジネスとして取り組む以上、現実的なコストと処理時間を考慮しなければならないです。    

例えばの話、100TBのデータを処理するとして、Diskの読み取り性能・HDDは今でも最大100MB/秒でデータを読み込むため、     
100TBのデータを読み込むために100×1000×1000 / 100 = 1000000秒、約11日と時間がかかります。    

この解決方法として、[スケールアウトら分散処理ができるApache Hadoop](https://hadoop.apache.org/)をはじめとするBig Dataの様々なソフトウェア・技術が登場しました。その卓越した技術の中から、Alibaba CloudよりMaxComputeが登場しました。     


---

# MaxComputeとは

テンプレな回答で恐縮ですが    
> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 


> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute


---

# MaxComputeが登場した背景

少し昔話になります。     
2009年9月にAlibaba Cloudが設立されました。その時代はまだIOEの三強時代（IBMミニコンピューター、Oracleデータベース、EMCストレージデバイス）であり、Alibaba Cloudはこの情勢を踏まえ『ベンダーロックインからの脱却』と『クラウドをフルに生かしたBig Dataの分散コンピューティング/分散ストレージシステムを研究開発』を背景に、『Pangu』と呼ばれる分散ファイルシステムと、『Fuxi』と呼ばれる分散スケジューリングシステムで構成される『ODPSクラウドプラットフォーム（MaxCompute）』が開発されました。 そのあと、ODPSクラウドプラットフォームは、2009年から2013年にかけてAlibabaグループであるTaobaoの大規模データ分析基盤を支えながら様々なフィードバックを受けて、Huatuoと呼ばれるクラスター診断システム、Kuafuと呼ばれるネットワーク接続モジュール、Shennongと呼ばれる監視システム、Dayuと呼ばれるクラスター展開システムなどが次々と追加されました。              

ODPSクラウドプラットフォーム（MaxCompute）の開発経緯として、Alibabaは国内有数のHadoop大規模クラスターを構築し、5000台のサーバーをPangu分散ファイルシステムとFuxi分散スケジューリングシステムで数多くのタスクをスケジュールしながら、障害対応や保守、クラスターのストレージボトルネック（5K問題）、など、2011年当時でHadoopの最先端技術を研究開発していました。この経緯と経験があって、ODPSクラウドプラットフォーム（MaxCompute）は単なるHadoopサービスとは完全に異なった、Big Dataのためのサーバレス型フルマネージドプラットフォームとして現在に至ります。        

『ODPSクラウドプラットフォーム』は高い完成度と、統合したプラットフォームを称えて、2014年になって『MaxCompute』と変更されました。その後、2015年にAlibaba Cloudは中国サイト、国際サイトにてMaxComputeによるビッグデータサービスを提供開始しました。        





---

# MaxCompute は他のビッグデータ処理プラットフォームとどう違うのか？


MaxComputeは上記の説明通り、『Pangu』と呼ばれる分散ファイルシステムと、『Fuxi』と呼ばれる分散スケジューリングシステムで構成された、クラウドをベースとしたビッグデータ処理プラットフォームです。  
  
クラウドで構築されたサーバレス型フルマネージドプラットフォームなので、ユーザーはSQLとデータを用意するだけで、クラウドベースで処理リソースの分だけ分散処理してくれます。ワークロードに応じてサーバーを増設（スケールアウト）もしくはサーバーのスペックを増強（スケールアップ）する必要はありません。          

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104122110.png "img")


MaxComputeはMapReduceをベースとしたアーキテクチャです。MaxComputeの最下層は独自のCPU/GPU物理クラスターがあり、Pangu分散ファイルシステムおよびFuxi分散スケジューリングシステムによって１つのクラスターを最大10,000台のコンピューターへ編成することができます。Pangu分散ファイルシステムおよびFuxi分散スケジューリングシステムの上レイヤーには分散システムのタスク調整、リソース管理、クラスタースケジューリング、およびその他の機能全体をコントロールするコンピューティングエンジンがあります。これはオペレーティングシステムサービスを提供するコア基盤です。その上には、SQL、MR（MapReduce）、GraphComputing、Machine Learning、Spark、インタラクティブ分析、およびストリームコンピューティングをサポートするMaxComputeの統合コンピューティングエンジンがあります。       

このアーキテクチャは『巨大艦隊』と呼ばれるほど、Big Dataのためのアーキテクチャとして見事に成り立っています。      
このプラットフォームにより、ユーザーはプロジェクトの持つデータ量およびSQLクエリやJobなどの処理リソースに応じて、クラスター内のコンピューティングノードを1から最大10,000台まで一瞬でリニアに自動スケーリングします。処理が終われば、元に戻ります。      
ノードの増設作業やパラメータチューニングは不要です。他の大規模データをOLTP処理やデータ一括処理するデータ分析プラットフォームとして、AWSだとEMRのHiveやRedshiftなどが挙げられますが、フルマネージド型サービスのRedshiftですら処理時はAutoWLMを含め細かいメンテナンスチューニングや、スケールアウト/スケールイン時はインスタンスやノード台数変更ら手動作業が必要なので、結局専門家ら人の手が必要になります。一方、MaxComputeは事務職オペレーターの人もシームレスに操作出来るほど、非常にシンプルな構造になっています。          


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104132407.png "img")

MaxComputeはコンピューティングとストレージを分離した構成です。なのでAWS RedshiftやAzure Synapse Analytics、Teradataのようなインスタンス（サーバ）上で稼働するモノリシック型DWHプラットフォームとはかなり異なります。AWS RedshiftやAzure Synapse Analytics、Teradataはコンピューティングとストレージを分割しない構成のため、データ量が増加すればするほど、維持費が高額になります。        
例えば、100TBのDWHを維持し運用する場合、MaxComputeはコンピューティングとストレージトータルで毎月3,046 USDで済みますが、AWS RedshiftはRI 3年前払い（全額）で割引しても毎月8,402 USD、Azure Synapse analyticsは3年予約で割引しても毎月24,792USDとコストがかかります。それも、インスタンスを止めることが出来ないので、データ分析ユーザーが少ない、もしくは分析する機会が少ない場合は、「使ってない時間も課金」という負のスパイラルに入ります。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104133022.png "img")


この卓越した技術の集大成であるMaxComputeはTPC-BB（Big Data処理ベンチマーク）でも、30TB、100TBデータセットに対するベンチマーク、コスト、処理能力全てNo.1を記録しています。 （2016年から2020年現在でも毎年連続No.1）     
中でも注目したいのは処理するノード数やコスト、処理パフォーマンスの高さです。オリジナルのHive on tezの約8倍の処理能力であり、それで低価格なのは他社でも類を見ないプロダクトサービスです。         

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104142712.png "img")


> http://www.tpc.org/tpcx-bb/results/tpcxbb_perf_results5.asp


もちろんForresterでも、[世界のリーダーとして選出](https://www.alibabacloud.com/blog/forrester-report-maxcompute-one-of-worlds-leading-cloud-based-data-warehouse_579989)されています。

> https://www.alibabacloud.com/blog/forrester-report-maxcompute-one-of-worlds-leading-cloud-based-data-warehouse_579989



---

# MapReduceとは

MapReduceは、2004年にGoogle社が検索エンジンで収集・提供するために社内にある大量のデータを処理するために発案・発表したものです。     

> https://static.googleusercontent.com/media/research.google.com/ja//archive/mapreduce-osdi04.pdf

MapReduceは、大きな処理を細かい処理に分割して、その細かい処理を別々のサーバが同時並行で処理するというスケールアウトの考え方です。     
例えば、選挙の投票用紙を集計し結果を表示するとき、それぞれのスタッフが分散して集計するのと同じようなイメージになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104155629.png "img")

このように、1つのサーバ/SSD/HDDらストレージには格納できないレベルのデータを処理するときは、MapReduceという分散処理フレームワークで複数ノードを使って並列分散処理をします。      
MaxComputeはクラウド上のビッグデータ処理基盤なので、最大10,000台のコンピューターで編成しながら、MapReduceアーキテクチャを生かしつつ、処理リソースに応じてCPU/GPUクラスターをリニアにスケールしつつ大量のデータを処理をします。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104155918.png "img")


---

# MaxCompute が安い理由

上記、MaxComputeの料金について軽く触れていますが、MaxComputeはEBクラスのデータを処理できる大規模Big Dataプラットフォームでありながら、非常に低価格な構成になっています。そのポイントは3つあります。    

Point1: MaxComputeはコンピューティングとストレージを分離した構成です。そのため、SQLクエリやJobなどの処理リソースに応じて、分散コンピューティングにより最大10,000台のサーバを拡張しながら処理に必要なリソース需要へ瞬時にフィットさせ、MapReduce処理を実施します。なので、ユーザーは必要な分だけ支払いで済みます。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104151922.png "img")

> https://www.alibabacloud.com/cloud-tech/doc-detail/53056.html


Point2:  Alibabaが独自開発したPangu分散ファイルシステムにて、CFileと呼ぶストレージ形式を使ってファイルを5倍近く圧縮します。通常、ファイルの圧縮レベルが高いとストレージの効率が向上しますが、読み込み/書き込み処理時CPU負荷が高くなります。その課題を踏まえ、MaxComputeはCFileというストレージ形式アーキテクチャを研究開発し展開してるので、結果として以下グラフ通り通常のcsvファイルなどと比較して5倍以上圧縮することができるようになります。このCFileストレージ形式アーキテクチャは現在第三世代ですが、更なる高速化とコスト抑制ら進化を目指して、現在も研究開発中です。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104153231.png "img")


Point3:   Alibabaが独自開発したFuxi分散スケジューリングシステムにより、たった3%の冗長ストレージ構成でありながら100,000の同時ジョブを効率よく交通整理し順次処理してくれます。その結果として、同じMapReduceアーキテクチャを持つApache Hive on Tezと比較して、TPC-DSは27%以上高速化、エラー率１桁削減、処理に必要なリソースを最低限のリソースへスリム化するため、処理に必要なノードおよびコストが15%以上削減、そして全体的なパフォーマンスが20%以上向上します。これがMaxComputは毎年世界No.1のTPC-BB（Big Data処理ベンチマーク）を記録し続ける理由の一つでもあります。     

> https://zhuanlan.zhihu.com/p/142632253



中国や海外では100TB（テラバイト）やPB（ペタバイト）を軽々と超えるデータを扱う会社が多く実在していますが、その会社が共通するほとんどの課題は「処理リソースに応じた設備投資」「パフォーマンスの低下と運用管理には専門家が必要」「コスト抑制」です。この課題はMaxComputeへ切り替えることで、全て解決することが出来た実績が多数あります。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104160733.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104161327.png "img")

> https://cn.aliyun.com/product/maxcompute/customer-case



---

# MaxComputeを操作する前に知っておきたい６つのこと

上記MaxComputeの魅力、凄さを軽く紹介しました。      
（実をいうと他にリモート分散型動的DAGやNewSQL、Fail-checking and Recoveryなど最先端技術がありますが、ここは別の機会にて、、）      
では、このMaxComputeが、現在のデータ分析基盤の上でビジネス上どんなメリットを享受するかについてを以下にて図解してみました。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104185837.png "img")

MaxComputeは上記通り、処理リソースに応じてコンピューティングがリニアにスケールするため、処理遅延問題を排除します。     
同時に、OSSにデータを蓄積するより5倍圧縮されるため、DWHとしてデータ維持費のコストを削減することができます。

（後日詳しく記載予定ですが）[Alibaba Cloud Hologres](https://www.alibabacloud.com/product/hologres)とシームレスにリンクすることもできるので、データ分析に対する課題の多くを解決することが出来ます。     

この『巨大艦隊』をうまくコントロールするためには、事前に知っておきたい６つのポイントがあります。      

---

## ①MaxComputeの操作環境
MaxComputeはサーバレス型フルマネージドプラットフォームなので、（後述する）DataWorks、IntelliJ IDEAで稼働するMaxCompute Stduio、ODPS CLIツール（odpscmdクライアント）、PyODPS、RODPS、Mars、BI Toolのいずれかを使って操作をします。    
MaxComputeはMaxCompute Tableにてデータを格納し使用する内部テーブル、OSSやTabl;eStoreなどを外部テーブルとして使用するExtraTable（外部テーブル）のどれかにてデータを格納・処理・分析することが出来ます。      
 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104234513.png "img")


---

## ② MaxComputeのセキュリティについて

MaxComputeは多くの国際的な金融機関も利用するほど、かなり厳重なセキュリティ機能を持っています。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/104045.htm


このセキュリティ機能は空港に入ってから飛行機搭乗する流れに少し似ていますので、イメージ図を使いながら説明します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104122021.png "img")


STEP1:  ユーザ認証      
MaxComputeはAlibaba Cloudのアカウントシステム（親アカウント）とRAMユーザーシステム（子アカウント）の２種類のアクセスシステムをサポートしています。そのため、アカウントもしくはRAMユーザごとに認証・制限をしかけることが可能です。また、ユーザはMFA多要素認証によるログインの強化を図ることもできます。        

STEP2:  IPホワイトリスト     
MaxComputeはプロジェクト単位で管理します。そのプロジェクトをIPホワイトリストを使ってプロジェクトレベルで保護するため、外部からの様々なデータのアクセス等を排除します。      
例えば、（STEP1のユーザー認証で許容できた）ユーザーは、関連するプロジェクトに対しアクセスできるVPC、IPアドレス、ネットワークを制限・設定することで、ホワイトリストに登録されていないアクセスを制限します。      

> https://www.alibabacloud.com/cloud-tech/doc-detail/27828.html

STEP3:  プロジェクトステータスチェック  
MaxComputeでプロジェクト作成が出来た後、Alibaba Cloud PlatformによるO&Mとしてプロジェクトのステータスをチェックされます。（ヘルスチェックに近い）     
これにより、ユーザーは関連するアクションを操作・管理することができなくなります。     


STEP4:  ラベルセキュリティ（LabelSecurity）チェック     
ラベルセキュリティ（LabelSecurity）は、MaxComputeのプロジェクト配下にあるワークスペースレベルで管理するMaxComputeアクセス制御（MAC）ポリシーです。      
これにより、ワークスペース管理者が列レベルの個人情報や機密データへのユーザーアクセスをより柔軟に制御できるようにします。            

> https://www.alibabacloud.com/cloud-tech/doc-detail/34604.htm

データ活用でよくある課題が「個人情報の取り扱い」です。      
データが大量になると処理に追い付かなくなることや、機密情報やデータ開示範囲の設定などが困難なシナリオでも、この機能によりデータアクセスを列レベルまで制御することが出来ます。     

ちなみにDataWorksの機能として、Big Dataでのセキュリティをより一層強化するユニークな機能があります。      
例えば、既存テーブルに対して、     

偽情報でデータをマスキングしたり     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105002244.png "img")

HASHでデータをマスキングしたり     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105002625.png "img")

カバーでデータをマスキングしたり    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105002550.png "img")

マスキング効果を新規データに自動反映したり、、

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105002729.png "img")

他にも、AIでデータのリスクを監視する機能や、     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105002917.png "img")

機密データの自動認識、および機密データの分布状況の可視化、

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105003204.png "img")

機密データのアクセス状況の可視化、

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105003016.png "img")

などなどの機能が充実しています。ここは別のBlogにて詳しく説明したいと思います。      


STEP5:  操作権限     

MaxComputeのプロジェクト配下にあるテーブルデータの読み取り、書き込み、クエリ実行可否、関数の実行、などをユーザーごとに必要に応じて許容可否らポリシー設定をすることが出来ます。    
これはワークスペース、テーブル、列、行など、細かいレベルでユーザごとに操作可否らポリシー設定を行えます。      

> https://www.alibabacloud.com/cloud-tech/doc-detail/27935.htm


その他、MaxComputeのプロジェクト内部セキュリティ管理、各プロジェクトを跨ぐセキュリティ管理、DataWorksでのセキュリティ管理などが実在しています。          
MaxComputeの[セキュリティのホワイトペーパー](https://www.alibabacloud.com/cloud-tech/doc-detail/104028.htm)も発行していますので、気になる方は一読するといいでしょう。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/104028.htm

---

## ③MaxComputeを操作するためのDataWorks 

DataWorksは、Alibaba Cloudのプロダクトサービスの１つで、一言でいえばMaxComputeを筆頭とするビッグデータ開発環境やデータインテグレーション、データ開発、データ管理、分析プラットフォームを提供するPaaSです。      
上記通り、MaxComputeはサーバレス型フルマネージドプラットフォームなのでDataWorksを使ってMaxComputeを操作する必要があります。      

ここは、別のblog記事にてその手法を詳しく説明します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104235241.png "img")

---

## ④DataWorksの『基本モード』と『標準モード』について

DataWorksの基本的な説明になりますが、開発環境と本番環境のデグレ防止やセキュリティ対策のもと、小人数から大人数規模でのでデータ開発および運用、分析を行うために、DataWorks側で『基本モード』と『標準モード』が配置されています。      
基本モードは１つのDataworks WorkSpaceが１つの計算エンジン（MaxComput、Hologres、データベース、インスタンスなど）に対応し、開発環境と本番環境を区別せずに直接処理を実行することができます。    
標準モードは１つのDataworks WorkSpaceが２つ以上の計算エンジン（MaxComput、Hologres、データベース、インスタンスなど）に対応し、開発環境と本番環境に分けて、SQLなどの各種処理はプロジェクト管理者などの承認を得てから実行することができます。     

標準モードの場合、基本モードとは以下の違いがあります。       

1.  すべてのコードは開発環境でしか編集できない、本番環境ではコードを編集することができない
1.  タスクをサブミット後、開発環境のスケジュールシステムにいれられるが、実行はされません。定期的にタスクを実行させたい場合は、本番環境にデプロイする必要あり
1.  タスクをデプロイする前に、プロジェクト管理者あるいは監視者の承認が必要

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105021513.png "img")

DataWorksの『基本モード』と『標準モード』は組織構成や、開発スタイルに合わせて選定すると良いでしょう。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104121927.png "img")

> https://www.alibabacloud.com/cloud-tech/doc-detail/85772.htm

---

## ⑤tunnel

MaxCompute Tableにデータを送る・受け取る（Upload/Download）方法は色々ありますが、中でもメジャーなのがMaxCompute tunnelです。     
MaxCompute tunnelはローカルもしくはECSを使って、csvやjsonなどのファイルをMaxCompute TableへUploadすることができます。     

> https://github.com/aliyun/aliyun-odps-console/releases

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105020118.png "img")

> https://www.alibabacloud.com/cloud-tech/doc-detail/27837.htm


---

## ⑥Alibaba Cloud Hologres

Hologresはリアルタイム・バッチ処理を完全サポートしつつ、同時クエリ処理の実行性を持ちながらPB以上のデータに対し低レイテンシ処理するリアルタイムデータプラットフォームです。これはBig Dataでの潮流の常識を変えてくれます。    
例えば、AWSの場合、外部データソースからAWS EMRもしくはAWS S3にデータを収集し、AWS EMR（HiveもしくはSparkなど）でデータクレンジング・整形・ETLし、AWS S3にまたデータを保存します。その後、AWS RedshiftでS3から限られたデータ量だけデータをインポートし、AWS Redshiftでデータ分析をします。AWS Redshiftはインスタンスベースなので格納・処理できるデータ量に限りがあります。（そのため、クラスターのノードを追加して増設するのがほとんどですが、対費用対策で節約するのが一般的です） なので、分析して求めた結果が出てこなかった場合は、もう一度S3から限られたデータ量だけをRedshiftへデータインポートします。あるいは、AWS Athenaを使って、S3をセントラルストレージながらSQL分析をします。ここまでの作業において、『分析のためのデータ移動量が非常に大きい、そのため分析に時間がかかることや、リアルタイム性がない』という課題が出ています。           

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105013451.png "img")

これに対し、MaxCompute - Hologresの場合、HologresはMaxCompute TableをベースにSQL分析することが出来るので、データを移動する必要がないです。HSAPアーキテクチャにより、SQLでDelete/Update処理することもできます。上記、AWS EMRでデータクレンジング・整形・ETLする処理も、MaxCompute 1つで完結します。そのため、MaxCompute-Hologresの連携であれば、データ移動に伴う工数やコスト、課題を完全に排除できます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105013611.png "img")


Hologresはメモリ128GBと低いスペックでも、GCP BigQueryやAWS Redshiftを上回るベンチマークを記録し、なおかつ一番安いコストパフォーマンスを提供します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105000238.png "img")

Hologresがどれだけ最速なのかをyoutube demoにて収録していますので、こちらも参考にいただければ幸いです。

<iframe width="560" height="315" frameborder="0" allowfullscreen="" src="//www.youtube.com/embed/KXjMzaWQRY0"></iframe>   <a href="https://youtube.com/watch?v=KXjMzaWQRY0">次世代リアルタイムDWH Alibaba Cloud Hologres 〜デモ編〜</a>


ーーー    
*Bowen Liは、Apache FlinkのPMCであり、Hologresのシニアマネージャーで、現在Apple Siri AI/MLで働いています。*         
*Xiaowei Jiangは、Apache FlinkのPMCであり、Hologresチームで働いています。*              
*Billy(Yiming) Liu は、Apache KylinのPMCであり、Hologres PDとしてチームで働いています。*           

---

# 最後に

本記事では、MaxComputeの概要を簡単に説明しました。     
MaxComputeはサーバレス型フルマネージドプラットフォームとして、現存のBig Dataやデータ分析に対する運用負荷やコスト問題など様々な課題を解決することができます。      

ーーー    
*Tao Yangは、Apache HadoopのPMCであり、現在MaxComputeチームのシニアマネージャーとして働いています。*     
*Botong Huangは、Apache Hadoopのコミッターであり、現在AlibabaのDAMO Academy上級研究員としてMaxComputeを含めた次世代のBig Dataプラットフォームを研究開発しています。*      
*Xuefu Zhangは、Apache HiveのPMCであり、Cloudera在籍時にHive on Sparkを設計開発した人で、現在Alibaba Cloud シニアスタッフエンジニアとしてMaxComputeチームで働いています。*     
*Rui Liは、Apache  HiveのPMCであり、またApache OCRのコミッターで、現在MaxComputeチームで働いています。*     
*Weiwei Yangは、Apache HadoopおよびApache YuniKornのPMCであり、現在MaxCompute、RealtimeComputeチームで働いています。*     



    



最後までお読みいただきありがとうございました。


余談です。Alibaba Cloud中国サイトですが、MaxComputeを使った、Demoサイトを展開しています。参考にしてみてください。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210105020726.png "img")

> http://report.amap.com/

> https://developer.aliyun.com/article/689240

 
 <CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>



 