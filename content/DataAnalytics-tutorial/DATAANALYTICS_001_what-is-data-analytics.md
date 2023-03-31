---
title: "データ分析とは？"
metaTitle: "今さらだが人に聞けない話、データ分析とは？"
metaDescription: "今さらだが人に聞けない話、データ分析とは？"
date: "2020-12-04"
author: "sbc_ohara"
thumbnail: "/DataAnalytics_images_26006613656608400/20201203183620.png"
---

## 今さらだが人に聞けない話、データ分析とは？


# はじめに

本記事では、データ分析の基本的なことについてをご紹介します。　


# そもそもの話、データ分析とは何か？

データ分析は、いくつかの要素が積み重なったその情報について結論を出すために、生データを分析し言語化する手法です。     
データ分析は様々な技術とプロセスがあり、その殆どは生データを処理する機械的なプロセスとアルゴリズムによって自動化されています。プロセスとしては代表としてデータマイニング・クレンジング・ETL・モデリングがあります。     
しかし、その技術およびプロセスを十分生かせてなかった場合、大量の情報を失いやすい傾向が生じます。所以、データ分析においてプロセスを最適化し、ビジネスまたはシステム全体の効率を最大限に高める工夫が必要です。     
そのため、このテクニカルサイトを通じてAlibaba Cloudによるデータ分析について手法およびプロセスをいくつか記載したいと思います。   


---

# なぜデータ分析が必要なのか？

データを分析することで、生産性を高め、ビジネスを成長させることがメイン目的ですが、基本的には以下の理由でデータ分析が必要です。   

     

1. 隠された洞察を収集
1. 利用可能なデータに基づいてレポートを生成
1. 市場分析を実行
1. 事業戦略の改善

     

データ分析 = Big Data という考えもありますが、正解はどちらでもないです。    
データ分析は、様々な種類のデータ分析を含む広義の用語です。その中で、1つ2つのサーバやストレージには乗り切らないレベルのデータ、数百TB規模のデータを扱うことがBig Dataです。数十数百TB規模のデータからデータ分析を行うのは、目視チェックの領域を超えるため、機械学習/深層学習が必要となる領域になります。実際、Alibaba Cloudでも、著者が好きな[E-MapReduceはBigDataプロダクトサービスでありながら、PAI、AIプロダクトサービスと統合しており、E-MapReduceにAutoMLやPAI-EAS](https://www.alibabacloud.com/blog/introduction-to-emr-datascience_596516)も梱包されています。    


とはいえ、いきなりBig Dataの話は難しいと思うので、まずは身近なデータ分析から順次説明します。いらすとやを使って、図解中心で説明します。

     

---

# データ分析を行うモチベーション

データ分析の身近な例を説明します。これらは数十GB、数百GBのデータ、かつ1日で構築できます。Excelで完結できるパターンもあります。   

     

## 記述的分析（データの二次元的可視化）

記述的分析は統計分析を行うための最初のステップです。これにより、データから様々なアイデアが得られ、外れ値の検出や変数間の相関を識別するためのデータを準備することができます。この分析はまだ人間による目視で特定できるものです。これらは「それぞれの個々の変数の分析」と「個々の変数の組み合わせによる分析」があります。   
この記述的分析をもって、パターンが特定できているなら、ビジネス上役に立つ新たな洞察を得ることができます。これが基本となります。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203183417.png "img")      

     

## 相関分析と因果分析（傾向分析）

相関分析と因果分析はデータ分析手法を編み出すためのアプローチで、その手法の代表例として回帰分析、分散分析、時系列分析などがあります。    
相関分析は「個々の変数で値が大きいと、他の変数も大きい（or 小さい）傾向がある」といった関係を指します。  
因果分析は「個々の変数で値が変動すると、他の変数も連動する」といった関係を指します。   
相関分析と、因果分析は似てるようなものですが、相関分析だけで、因果分析を結論づけるのは時期早々です。   
データ分析において、相関分析と因果分析の要点が抑えれば、傾向がつかめれるため、回帰分析、分散分析、時系列分析、そしてデータを使った機械学習としてレコメンテーション、異常検知、決定木、SVM、などが実現できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203183516.png "img")      

     

### 回帰分析

回帰分析は、対象となる2つ以上の個々の変数間の関係を確認する手法です。これらはグラフで可視化しないと明確にならない部分があります。   
回帰分析には様々なタイプの回帰モデルがあり、線形回帰、ロジスティック回帰、および重回帰などが有名です。     

     

### 分散分析

分散分析は、個々の変数の分布で値の差と平均値の差を確認する手法です。値と平均の差が非常に小さい場合、分散が少ないといえます。      

     

### 時系列分析

データを時系列に整理したうえで、傾向分析を処理するデータ分析手法です。時間の経過とともにデータの変動や一連の特定を得ることができます。

     

---

# 機械学習の分析

ここからは機械学習の技術を使った分析の話になります。いきなり深い「機械学習」は恐れ入ると思うので、実際に「Alibaba Cloudがよく構築・展開してる機械学習」の基本を使って説明します。    
Alibaba Cloudの機械学習はPAIだけでなく、MaxCompute、E-MapReduce、LogService、Elasticsearch、AnalyticDB、DataLake Analytics、HBase、Database Autonomy Service、SecurityCenterなどに梱包されており、Alibaba Cloudというクラウドサービスとしての恩恵を生かしつつ、誰でも機械学習による分析システムを構築・運用することができます。      

     

## レコメンデーション

レコメンデーションは、様々な要因に基づいて、ユーザに物事を推奨するプロセスです。レコメンデーションは過去の他ユーザの購入実績や、ユーザの行動、時間帯、などの特徴を持った情報から、最も重要な情報をフィルタリング・カップリングすることにより、存在する大量の情報を処理しつつ、ユーザが購入する可能性が最も高く、関心のある製品を予測・類似性を推奨します。<u>これは教師あり・教師なし機械学習じゃなくてもMapReduceやSQLベースで構築し、検知・実現することが可能です。</u>    

以下の図はレコメンデーションの基本的な方法ですが、実はレコメンデーションの歴史は長く、現在はユークリッド距離・コサイン類似度・Jaccard類似性・協調フィルタリング・K近傍・SVDアルゴリズム・確率的勾配降下法（SGD）など様々なアルゴリズムが実在しています。[Alibaba CloudもMaxComputeのMapReduceアーキテクチャを生かした、大規模データによるレコメンデーションシステム](https://www.alibabacloud.com/blog/building-a-social-recommendation-system-based-on-big-data_593980) を構築、展開しています。
[f:id:sbc_abm:20201207190535.png "img")      

     

## 異常検知

異常検知は、データの外れ値を検知するプロセスです。様々なシステムにおいてパフォーマンス管理と監視業務の範囲が広い場合、異常検知はエラーが発生している場所を特定するのに役立ちます。<u>これも教師あり・教師なし機械学習じゃなくても構築し、検知・実現することが可能です。</u>    
以下の図は時系列での異常検知の代表的なパターンですが、非構造データ（Key-Value、画像データ、ドキュメント型データなど）や、時系列でないデータでの異常検知もあります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203183620.png "img")      

     

## 決定木

決定木は、教師あり機械学習の一つで、データから２つのエンティティにわけて分類、これを繰り返すことによってカテゴライズしながら、データを分割するプロセスです。    
決定木はフローチャートのような構成であり、基本的には「TRUE（YES）」か「FALSE（NO）」で選択しながら意思決定のための意思決定フローを示します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203183720.png "img")      

     

ちなみに決定木で使う分岐は何で決めるか？というものは  「Gini index」と「情報のエントロピー」のいずれかで決定付けます。    
主に、Gini Index の場合、評価式が   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203211029.png "img")      
なので、例えば仮にデータ100のうち  「TRUE（YES）」が70、「FALSE（NO）」が30のウェイトであれば、     
分岐前：1-(0.7^2+0.3^2)=0.42    
分岐後：0.7(1-1^2)+0.3(1-1^2) = 0   
差分：-0.42   
この -0.42を閾値としてデータを分岐することができます。そのため、決定木をSQLだけで構築・展開することもできます。   
[決定木をSQLで分類する手法でこちらの記事](https://www.mssqltips.com/sqlservertip/6613/decision-tree-examples-tsql/) が参考になります。

     

## 自然言語処理

自然言語処理（NLP：Natural language processing）は、コンピュータが人間の言語・テキストを分析し、理解、操作、生成するプロセスです。     
自然言語処理は、形態素分析と、単語の分散変換がメインとなります。形態素分析は１つの文から、名詞・接続詞・助詞にわけて意味を持つ最小限の単位に因数分解することです。単語の分散変換は、文章から出力頻度の高い単語ごとに重みを識別・数値を付与しながら、近似値の単語の意味と比較、整理することです。別名：word2vecとも呼びます。    
このプロセスが達成できれば、長文の要約や、機械翻訳などを実現することができます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203190345.png "img")      

別途、著者もWebを使った会議で [Web Speech API](https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API) を使った音声認識から文字起こし（Speech-To-Text）を行っていますが、複数人でのSpeechだと精度が低いので [Apache FlinkをAlibaba Cloudの機械学習チームによって開発したAlink](https://github.com/alibaba/Alink/blob/master/README.en-US.md) と[kuromoji.jsら形態素解析ライブラリ](https://github.com/takuyaa/kuromoji.js)を使ったリアルタイム学習しながら自然言語処理によりボキャブラリーを１つ１つずつ認識させ、Speech-to-text、意味あるメッセージを示すようテキスト出力しています。深層学習といったモデル構築は一切していないです。（それでもまだまだなのは認識しつつ、、いつかは使い物になるレベルになれば紹介したいと思います） 

※著者はこの[Webカメラの映像に自動字幕を重ねるWebページ](https://github.com/1heisuzuki/speech-to-text-webcam-overlay)も知っていますが、複数人トークには向いていないため、自助努力で何とかしょうと思った次第でした。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201204182344.gif "img")     

     

## 画像認識

画像認識は、コンピュータ上で媒体を認識するプロセスです。
コンピュータ上での画像データは、ピクセルという色のついた点の集まりなので、コンピュータ側から「事前に識別してる媒体が、今回のターゲット画像に写ってるか」を認識させる必要があります。この技術をパターン認識と呼び、中には物体検出などの幅広い様々な手法があります。    
以下の図は「Sliding window mothod」と呼ぶ、画像の全領域から一定のウィンドウ（枠）をスライドしつつ、媒体が特定できるかといった最も簡単な物体検出です。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203191317.png "img")      

この問題は     
1):「一定のウィンドウ（枠）」でそのサイズが2-3 pixelでもずれたら 画像の全領域からのウィンドウをスライドしても一切検出ができなくなってしまう   
2): ターゲット画像のサイズによりますが、基本的には計算量が大きいので、処理の負荷が大きい  
3): 処理するのに時間がかかってしまう  

といった課題があります。   
※ 1)、2)、3) は 媒体をウェーブレット変換し、波長型でターゲット画像の波長を合わせて識別する方法もありますが、、   
   
この課題は画像認識だけでなく、他の機械学習を使った分析も似た課題はあると思います。これらはAlibaba Cloudのデータ分析サービス、高パフォーマンスの恩恵を生かして解決することができます。    
この画像認識も、DataLake AnalyticsやAnalyticDB for PostgreSQLで分析することもできます。    
例えば、OSSに画像データを置いて、DataLake AnalyticsのServerlessSparkを使って、Spark MLlibによるR-CNNと呼ぶ汎用的な媒体検出アルゴリズムを使って画像を認識、そこからキャプション生成できます。AnalyticDB for PostgreSQLはApache MADlibを併用します。    
キャプション生成は、媒体に単語や文などラベルを付与することで、ターゲット画像から媒体に対するコメントを述べることができます。    
（このdemoは、写真からサンダルの個数をサマリ化するものです。ターミナルにある媒体 - サンダルのリストの隣にある数値は画像の位置・座標です。）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201204182430.gif "img")
     
※blog記載後クラスター破棄後に発覚したのですが、最後に媒体認識 - 個数識別でキャプション生成の print 出力失敗していましたorz

> https://www.slideshare.net/sbopsv/alibaba-cloud-datalake-analytics


     

--- 

# Big Dataの分析

ここからは、Big Dataの話に入ります。
Big Dataは1つ2つのサーバやストレージには乗り切らないレベルのデータ、数百TB規模のデータを扱うため、利用すること自体、スモールデータの10〜1000倍の複雑さを持ちます。
従来のデータ処理では、数百TB～EB規模の巨大で複雑なデータを処理することができません。中でも一番難しいのが、分散システムの必要性に起因した技術的な要素です。例えば、スモールデータは数十GB〜数百GB、まだメモリにデータを保持しながら様々な処理を実現しますが、Big Dataは数十数百台以上の複数のコンピュータ・ノードを使って、データを分割しながら保存・処理します。

同時に、スモールデータであれば、データ分析者やビジネスインテリジェンスのチームは技術的な観点や経営的な観点から、データをコントロールするチームとの編成やデータエンハンスを行う必要はないです。しかし、データ量が大きくなると、データの複雑さから、複数のチームを編成する必要が生じてきます。例えば、DevOps、MLOps、SRE・・・組織や利用者によっては定義範囲が異なりますが、一般的には異なるミッションを持った複数のチームで結成しながらBigDataによるデータ分析へ取り組む必要があります。ここはサイロ化されたりコントロールできなかったり、、経営的にも複雑となるところなのです。

そのため、クラウドをフルに生かしたAlibaba Clouddプロダクトサービスを使って、データ分析・運用のコントロールを司る必要があります。以下はBig Data について基本的な用語集、そして全体枠をつかんでもらうための説明になりますが、この要点だけ抑えれば、データ分析のほとんどは理解できるようになると思います。      

     

## Data Lake と Data Warehouse

Data Lakeは、データ分析において必要になるまで、大量の生データをネイティブ形式で保持する大規模なストレージリポジトリです。   
Data Lakeのメリットは、異種のコンテンツ・異種のデータソースを一元化できることです。事前にデータを集約することにより、分析ユーザはいつでも柔軟にアクセスすることができます。
Data WareHouseは、企業または組織による大量の情報をまとめた大規模ストレージです。Data Lakeとは異なり、様々な分析サービスから複数の異種のコンテンツ・異種のデータソースに対してもスムーズに分析できるよう、データを整形し、蓄積する必要があります。この作業をデータクレンジング、ETL と呼びます。    
以下の図はData Lake と Data Warehouseのイメージ図です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203184113.png "img")      

     

## データクレンジング と ETL

上記、Data Lake と Data Warehouseの説明を行いましたが、Data Lake から Data Warehouseへ変換する作業のプロセスとして、データクレンジングとETL があります。   
データクレンジングは、データセットの中から、破損したデータ、欠損したデータ、重複したデータ、不完全なデータを修正または削除するプロセスです。  
ETL は、データをある形式または構造から別の形式または構造に変換するプロセスです。ETL は Extract / Transform / Load の略語です。
以下の図はData Lake から、データクレンジング と ETL を通じて、どのようにして Data Warehouseを作成するかのイメージ図です。（極端ですいません笑
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203183859.png "img")      

     

## 定例分析・Ad-Hoc 分析（レポーティング）

定例分析は、名前通り、毎日一定時刻にて同じ内容で同じ頻度でレポーティングを行うプロセスです。     
Ad-Hoc分析は、突発的な案件、もしくは計画外（イレギュラー対応など）において、目的を達成する形でレポーティングを行うプロセスです。   
定例分析はパターンが決まってるので自動化することや、システムを最小限に抑えることができますが、Ad-Hoc分析は 手動作業が必要になります。    
MaxCompute、DataLake Analytics、GCP BigQueryはクエリを投与した分だけ課金なので、Ad-Hoc分析が向いている場合があります（その方が安いため）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203183958.png "img")      

     

## パーティション

先ほどのData Warehouseで、データ量が100TB、1PB、10PBと多ければ、分析サービスで全テーブルをスキャンするのに時間がかかります。   
そのため、Data Warehouseは通常はPartitionを使って、データを分割しながら管理します。   
分析サービスでpartitionを絞ることで、必要なデータのみをリロード、結果として処理パフォーマンスを向上することができます。    
同時に、partitionを日付単位で管理する場合であれば、管理が容易になることや、バックアップ・リカバリがしやすくなるメリットもあります。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203184459.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201204195111.png "img")      

     

## オンライン分析（リアルタイム処理）とオフライン分析（バッチ処理）

オンライン分析（リアルタイム処理）はオーダー情報や在庫情報、トレンドなどデータの処理要求が発生したとき、即座に処理を実行して結果を返すプロセスです。 そのため、データの「今」と会話しながらアクションを実施することができます。    
オフライン分析（バッチ処理）は大量のデータを1日に1回のベースで処理し、結果をアウトプットするプロセスです。そのため、大量のデータを一括で処理しやすいが、結果反省型なので
軌道修正などのアクションに数日～数十日かかってしまいます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203184629.png "img")      

     

## リアルタイムML（オンライン学習）

リアルタイムML（オンライン学習）はスモールスタートとして小規模のデータをモデル・システムに投入させ、学習サイクルが確立した後に新しいデータ・新しいモデルを次々と投入させるプロセスです。TB、PBを超えるデータセットに対し、バッチベースでの機械学習ではPDCAサイクルとしても回転率が悪くなる課題がありました。一方、リアルタイムMLはすばやく次のフェーズへ進めることができます。リアルタイムML（オンライン学習）は、Alibaba Cloudが最も得意とする機械学習アプローチです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201203184721.png "img")      

     

----

# データ分析におけるROI（設備投資費用回収）

ここまで、データ分析の基本、機械学習による分析、Big Dataについてを軽く説明しました。     
データ分析は、生産性を高め、ビジネスを成長させることが目的ですが、当然構築費用やランニングコストなどの費用が発生します。この費用が高額であれば、データ分析を行うモチベーションどころではありません。しかしAlibaba Cloudの場合、他社のデータ分析サービスとは異なり、「データからビジネスに必要な洞察を得るまで一貫した展開」を安価かつシンプルに実現することが出来ます。   
   
たとえば、Alibaba Cloud Elasticsearchは、複数のデータソースを一元集約するだけでなく、予実管理、保全管理、そしてDAMOアカデミーによる様々な独自機能により、異常検知や予測などを安価で実現することができます。そのため、Alibaba Cloudでデータ分析を行うことは、顧客の様々な課題を解決させながら利用者を楽に、幸せにすることです。     
Alibaba Cloudのプロダクトサービスはほとんど安く、他社クラウド以上にほとんどのサービス提供が利用出来ます。Alibaba Cloud Elasticsearchで大規模データ分析を行うとしても、たった６か月でROI、設備投資費用を回収することが可能です。AWS Elasticsearch だと、3倍近くの金額になることや、高度な分析機能が付帯されていないため、真似することはできません。     
    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201204203304.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201204203331.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DataAnalytics-tutorial/DataAnalytics_images_26006613656608400/20201204203359.png "img")      
    
> https://www.slideshare.net/sbopsv/alibaba-cloudelasticsearch
      
Alibaba Cloudによるデータ分析のために、新たにデータサイエンティストを雇う必要はありません。Alibaba Cloudのデータ分析プロダクトサービスは、基本的に[世界トップクラスの科学者・研究者による DAMOアカデミー](https://damo.alibaba.com/) と連携しながら、非エンジニアでも、データ分析初心者でも、問題解決にむけた様々なデータ分析が出来る仕組みを整えています。実際、Alibaba Cloudを利用しているお客様にはエンジニア層だけでなく、プログラミングが出来ない事務スタッフも混ざっています。そのため、Alibaba Cloudはシンプルさとスピード、顧客課題を技術で解決することを意識している背景があります。        

     

---

# さいごに

データ分析は単調に見えて実は奥深い世界です。本記事通り、データ分析の基本、機械学習、Big Dataについて要点を軽く書いてみたので、著者としては少しだけでも理解いただければ大変幸甚です。     
「データ分析」を飛ばして、いきなり「機械学習」「AI」「Big Data」は自爆行為なので、データを可視化するまでのプロセス、そしてデータ分析のプロセス、データからどうやってビジネスに必要な隠された洞察を得るか、段階を踏まえてから、目的を達成する姿での構築がベターと、著者は考えています。   

※参考：データ分析の優先順位。特に10Pは著者としてもいつも考えされられます     
> https://www.slideshare.net/TokorotenNakayama/ss-122256960/10

     

Alibaba Cloudはデータをビジネスに変換するだけの相当の力を持っています。LogServiceだけでも、月１万円程度でビジネスに必要な隠された洞察を素早く得ることができます。
著者としては、シナリオ、問題、求めてるゴール、素材など必要なものがわかれば、BIツールにしろ、Python/R関連にしろ、手段はなんでもいいので、もっと簡単な分析の仕組みが必要と認識しています。そのため、Alibaba Cloudを使ったデータ分析のノウハウ・テクニックを不定期ながらtech blogに記載しょうと考えています。    
次回はLogService、MaxCompute-Hologresなどデータ分析プロダクトサービスの構築方法などについて記載したいと思います。     

　








