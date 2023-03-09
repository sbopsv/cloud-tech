---
title: "Hologresの紹介"
metaTitle: "リアルタイムDWH・Hologresのご紹介"
metaDescription: "リアルタイムDWH・Hologresのご紹介"
date: "2021-06-29"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/Hologres_images_26006613699528800/20210319122815.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## リアルタイムDWH・Hologresのご紹介

今回はAlibaba Cloudの国際サイトで提供している [Hologres](https://www.alibabacloud.com/product/hologres) を紹介します。   


# Hologresとは

> <span style="color: #ff0000"><i>Hologres はリアルタイムのインタラクティブ分析サービスです。高い同時実行性と低いレイテンシーでTB、PBクラスのデータの移動や分析を短時間で処理できます。PostgreSQL11と互換性があり、データを多次元で分析し、ビジネスインサイトを素早くキャッチすることができます。</i></span>

少し前になりますが、Hologresについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-hologres

---

# 現在のDWH（データウェアハウス）の課題
現在のDWH（データウェアハウス）やデータ分析基盤は基本的に3つの段階でのStep-by-Step構成となっています。    
データ収集、データウェアハウス、データマート、といった流れです。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210319114032.png "img")

とはいえ、実情として、実際の構成は複雑になってます。     
- 構成の複雑さ        
- リアルタイム性        
- 分析のためにデータ移動            
etc....

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210319115450.png "img")


この状況の中、リアルタイム分析・可視化は非常に重要となっています。    
現在、データは時間とともに価値が減少しつつあります。この泥沼のようなDWH問題の中から、リアルタイム分析をするのは至難です。      
この背景もあって、Hologresが登場しました。    
Hologresは時間とともに変化する大規模データセットからリアルタイム分析ができるように設計されています。HologresはMaxComputeと連携することで、安い金額で高速データ分析を実現することができます。        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210319145656.png "img")



---

# Alibaba Cloud Hologresとは

Hologresはリアルタイム・バッチ処理を完全サポートしつつ、同時クエリ処理の実行性を持ちながらPB以上のデータに対し低レイテンシ処理するリアルタイムデータプラットフォームです。これはBig Dataでの潮流の常識を変えてくれます。    
ちょっと大げさに聞こえるかもしれませんが、実際どういうものかを他メジャーなクラウドサービスの分析サービスと比較してみます。     

例えば、GCP BigQueryの場合、[Dynamic Query Execution （動的なクエリ実行）により、親から複数の子ノードへ流れるようにSQLクエリ処理](https://medium.com/google-cloud-jp/i-read-dremel-a-decade-of-interactive-sql-analysis-at-web-scale-ca2a015a522a)を実施します。これはOLAPとして非常に効率的なアルゴリズムなので、処理スピードも速いです。     
しかし、BigQueryはあくまでも分析を前提とした構成なので、削除や更新が出来ない課題があります。厳密には削除や更新処理は出来ますが、Workerに負荷がかかるため有料のうえ、[処理実行数に制限](https://cloud.google.com/bigquery/quotas#data_manipulation_language_statements) があります。      

イメージしてみてください。データアナリティクスが、tableauやPowerBIなどのBI Toolで分析するとき、個人情報とか削除あるいは変更したいテーブル・フィールド・レコード・データがあった場合、どうしますか？BI Toolから操作には制限があるので、BigQueryに格納しているデータをDataflow、Storage、Database、Cloud Functions、etc、、か何かに移動してから、データの整形処理、そしてまたBigQueryに格納。この場合、BigQueryへのデータ転送に伴うコスト増と工数が発生します。それか、BigQueryに対しお金を払ってまで削除や更新処理。上級者なら、BigQueryで特定レコードをスキップしながらインポートや、メタデータによる管理で更新削除の回避etc。実際そういう課題に悩んでいた人々は多いはずです。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210629000757.png "img")

それに対し、Hologresは Upsert（更新、削除、挿入）処理が出来るので、個人情報とか削除あるいは変更したいテーブル・フィールド・レコード・データがあった場合でも、BI ToolからSQLですぐ変更や削除することが出来ます。データ分析者が、データの整形や調整のためにデータ移動する必要はないです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210629000730.png "img")

AWSの場合であれば、外部データソースからAWS EMRもしくはAWS S3にデータを収集し、AWS EMR（HiveもしくはSparkなど）でデータクレンジング・整形・ETLし、AWS S3にまたデータを保存します。その後、AWS RedshiftでS3から限られたデータ量だけデータをインポートし、AWS Redshiftでデータ分析をします。AWS Redshiftはインスタンスベースなので格納・処理できるデータ量に限りがあります。（そのため、クラスターのノードを追加して増設するのがほとんどですが、対費用対策で節約するのが一般的です） なので、分析して求めた結果が出てこなかった場合は、もう一度S3から限られたデータ量だけをRedshiftへデータインポートします。あるいは、AWS Athenaを使って、S3をセントラルストレージながらSQL分析をします。ここまでの作業において、『分析のためのデータ移動量が非常に大きい、そのため分析に時間がかかることや、リアルタイム性がない』という課題が出ています。インスタンスベースなので、当然データ量増加に伴う無駄なコスト増の課題もあります。           

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210105013451.png "img")


これに対し、MaxCompute - Hologresの場合、HologresはMaxCompute TableをベースにSQL分析することが出来るので、データを移動する必要がないです。後述するHSAPアーキテクチャにより、SQLでDelete/Update処理することもできます。上記、AWS EMRでデータクレンジング・整形・ETLする処理も、MaxCompute 1つで完結します。そのため、MaxCompute-Hologresの連携であれば、データ移動に伴う工数やコスト、課題を完全に排除できます。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210105013611.png "img")


Hologresはメモリ128GBと低いスペックでも、GCP BigQueryやAWS Redshift、Snowflakeを上回るベンチマークを記録し、なおかつ一番安いコストパフォーマンスを提供します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210319120814.png "img")

Hologresがどれだけ最速なのかをyoutube demoにて収録していますので、こちらも参考にいただければ幸いです。     

[次世代リアルタイムDWH Alibaba Cloud Hologres 〜デモ編〜](https://youtube.com/watch?v=KXjMzaWQRY0)     
> https://youtube.com/watch?v=KXjMzaWQRY0

---

# HSAPとは

HSAPはHybrid Serving / Analytics Processingの略であり、バッチ処理・更新・削除機能を備わりつつ、大量の同時実行を支えたOLAP処理が出来るアーキテクチャを指します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210629080515.png "img")

HSAPアーキテクチャであるHologresは、リアルタイムOLAPとインサイト分析、KVスタイルの高QPSポイントクエリの両方をサポートします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210319122815.png "img")

一見単純そうに見えますが、Hologresが無ければ、様々なデータ分析プロダクトサービスを多々と積み重ねて展開する必要があります。      
上記、GCPやAWSの構成図でも説明していますが、Hologresを使うことで、様々な組み合わせが１つへシンプルに完結します。そういった背景もあり、VLDBなどの論文などでも注目を浴びています。     
先述しましたが、GCP BigQueryは優れたOLAPサービスですが、Treeベースで分析するため、上記通り、更新や削除などに制限があります。一方、Hologresは更新や削除もサポートしつつ、更に低いスペック・安い金額で高速分析ができます。 　
　　   
> https://kai-zeng.github.io/papers/hologres.pdf

このHSAPアーキテクチャが登場以降、Uberやfacebook、Linkedin、Google Incなどリアルタイムデータ分析へチャレンジングする様々な企業も注目しつつ、また参考にしながら研究開発・新サービスを開発しています。     

Uber:  [Real-time Data Infrastructure at Uber](https://arxiv.org/pdf/2104.00087.pdf)      

参考：    
> https://www.alibabacloud.com/blog/what-is-the-next-stop-for-big-data-hybrid-servinganalytical-processing-hsap_596440


---

# 列指向と行指向のハイブリットストレージ
Hologresは上記通り、HSAPアーキテクチャなので、ストレージ層で列指向、行指向両方をサポートしており、テーブル作成時に列/行指向を指定することで、様々なクエリの高速化が出来ます。
例えば、結果が少量のデータで高速クエリなら列指向、大量のデータによるクエリであれば行指向としてテーブルを作成することで、RDBと同じように複雑なSQLクエリでの分析を行うこともできます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210318145613.png "img")

もし行指向でテーブル作成後、加工処理し 列指向として分析したいのであれば、CREATE TABLE LIKEで別テーブル（列指向）を作成し、（行指向の）整形済テーブルデータをコピーしてから分析する方法もあります。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/158734.htm

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/160754.htm


---

# PostgreSQLベース
HologresはPostgreSQLベースで構築されているため（厳密にはApache Flinkなど色々なアーキテクチャがかなり詰まっていますが。。。）、HologresはPostgreSQLベースで操作するので学習コストはゼロで済みます。PostgreSQLのSQLクエリをそのままコピペで操作しても良し。
また、PostgreSQLに対応しているBI Toolであればどれでも接続することが可能です。    
例えば、フロントエンドシステムとして使い慣れてるPowerBIや、AWS QuickSight、Tableau、Looker、 SAP BusinessObjectsなどにも今すぐ接続できます。    
これは、フロントエンドとしてUI、ユーザーインターフェースを変更せずに、バックエンドをHologresへ変更するだけで、利用ユーザーはHologresへ変更したことによる課題、例えば業務調整やダッシュボードのテンプレート、ノウハウを犠牲にせずに済むことが出来ます。   
それだけでなく、SQLクエリが苦手な人でも、BI Toolの力で Drag & Drop分析することができます。それもリアルタイムデータなので会話するように楽々と分析です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210628234207.png "img")


---

# Hologres Proximaによる機械学習アプローチ
HologresはProximaというSQLによる機械学習での分析をサポートしています。
Proximaはアリババグループの技術研究開発機構であるアリババDAMOアカデミー（達摩院）によって開発されたもので、レコメンデーション、関連キーワードによるテキスト検索、画像分類、画像認識、類似画像検索、異常画像検索、動画検索、テキスト分類、コンバージョン拡張、需要予測etc・・・幅広いシナリオを満たすことが出来る高速ベクトル検索エンジンです。

> https://www.alibabacloud.com/blog/proxima-a-vector-retrieval-engine-independently-developed-by-alibaba-damo-academy_597699

Proximaについて詳しい資料はこちら（中国語）ですが、要約すると以下通り、大規模データによるリアルタイム機械学習が可能です。

> **超大規模インデックスの構築・検索**：Proximaは、エンジニアリングによる実装やアルゴリズムのアンダーレイ最適化、複合検索アルゴリズムの導入を得意としており、数十億サイズまでのシングルスライスインデックスで、限られた構築コストに基づく高効率な検索方法を実現しています。

> **インデックスの水平方向のスケーリング**：Proximaでは、非reciprocal slicingアプローチを採用し、分散型検索を実現しています。 隣接するグラフインデックスについては、限られた精度のグラフインデックスを高速に結合する問題を解決し、Map-Reduceの計算モデルと効果的に組み合わせることができます。

> **高次元・高精度**：Proximaは、複数の検索アルゴリズムをサポートしており、アルゴリズムをより深く抽象化してアルゴリズムフレームワークを形成し、異なるデータ次元と分布に基づいて異なるアルゴリズムまたはアルゴリズムの組み合わせを選択し、特定のシナリオのニーズに応じて精度と性能のバランスを実現します。

> **ストリーミングリアルタイム＆オンライン更新**：Proximaはフラットインデックス構造を採用し、0から1までのオンライン大規模ベクトルインデックスのストリーミング構築をサポートしています。 また、ネイバーグラフの利便性とデータの特性を活かして、インデックスの追加とチェック、インスタントディスクドロップ、リアルタイムダイナミックアップデートを実現しています。

> **ラベル付け＋ベクトル検索**：Proximaは、インデックス作成アルゴリズム層に「条件付きベクトル検索」を実装しており、従来の多元的な結合では満足のいくリコール結果が得られないという問題を解決し、結合検索の要件をより大きく満たしています。

> **ヘテロジニアス・コンピューティング**：Proximaは、大きなデータによるバッチ処理と高スループットのオフライン検索アクセラレーションをサポートし、ネイバーグラフインデックスの構築問題をGPUで解決する一方で、小バッチ＋低レイテンシー＋高スループットのリソース利用問題の解決にも成功し、タオバオの検索推薦システムに適用しています。

> **クラウドサーバーや一部の組み込み機器への対応** :分散スケジューリングエンジンとの組み合わせによるオフラインでのデータ検索・学習の実現、フラットインデックスとディスクによるコールドデータ検索の実現など、マルチプラットフォーム・マルチハードウェアでの最適化を実現しています。 Proximaは、フラットなインデックスとディスク検索のスキームにより、コールドデータの高速検索を実現します。

> **シナリオの適応**：超参照チューニングや複合インデックスなどの手法を組み合わせ、データをサンプリングして事前に実験することで、Proximaはいくつかのデータシナリオのインテリジェントな適応の問題を解決することができ、システムの自動化能力を向上させ、ユーザーの使いやすさを向上させます。


> https://www.slidestalk.com/u45737/7Proxima72523

このProximaはAlibaba Cloud Elasticsearchにて aliyun-knnとして使われているものですが、これがHologresとなるとかなり強烈です。      

流れとしてはこんな感じです。    

```
-- proximaが使えるように宣言
create extension proxima;


-- モデル構築のためのfeature_tbテーブルを作成。PL/pgSQLによるブロック構造なので、一気に作成。
-- "distance_method":"InnerProduct" のInnerProductはベクトル空間上で定義される非退化かつ正定値のエルミート半双線型形式のことを指します。
-- "distance_method":"SquaredEuclidean" であれば、ユークリッド距離計算の平方根　で計算
-- "distance_method":"Euclidean" であれば、ユークリッド距離計算　で計算
begin;
create table feature_tb (
    id bigint,
    feature float4[] check(array_ndims(feature) = 1 and array_length(feature, 1) = 4)
);
call set_table_property('feature_tb', 'proxima_vectors', '{"feature":{"algorithm":"Graph","distance_method":"InnerProduct","builder_params":
{"min_flush_proxima_row_count" : 1000}, "searcher_init_params":{}}}');
end;
```

特徴量データを格納しました。続いて1万レコードのデータを格納します。データの中身は乱数かつ配列として格納しています。
```
-- 1万レコードの格納
insert into feature_tb select i, array[random(), random(), random(), random()]::float4[] from generate_series(1, 10000) i;
```

準備が終わったら、ベクトル検索します。
```
-- エルミート半双線型形でベクトル検索
select pm_inner_product_distance(feature, '{0.1,0.2,0.3,0.4}') as di distance
----------
 0.940253
 0.938515
  0.93709
 0.935856
 0.929624
(5 rows)

retail_db=#
retail_db=# -- ユークリッド距離計算で近似ベクトル検索
retail_db=# select pm_approx_euclidean_distance(feature, '{0.1,0.2,0.3,0.4}') as distance from feature_tb order by distance desc limit 5 ;
stance from feature_tb order by distance desc limit 5 ;

-- ユークリッド距離計算でベクトル検索
select pm_euclidean_distance(feature, '{0.1,0.2,0.3,0.4}') as distance from feature_tb order by distance desc limit 5 ;

-- ユークリッド距離計算の平方根でベクトル検索
select pm_squared_euclidean_distance(feature, '{0.1,0.2,0.3,0.4}') as distance from feature_tb order by distance desc limit 5 ;


 distance
----------
  1.42282
  1.38024
  1.37326
  1.37312
  1.37251
(5 rows)

retail_db=#
retail_db=# -- ユークリッド距離計算の平方根で近似ベクトル検索
retail_db=# select pm_approx_squared_euclidean_distance(feature, '{0.1,0.2,0.3,0.4}') as distance from feature_tb order by distance desc limit 5 ;
 distance
----------
  2.02441
  1.90505
  1.88586
  1.88545
  1.88379
(5 rows)

retail_db=#
retail_db=#
retail_db=# -- エルミート半双線型形でベクトル検索
retail_db=# select pm_inner_product_distance(feature, '{0.1,0.2,0.3,0.4}') as distance from feature_tb order by distance desc limit 5 ;
 distance
----------
 0.949515
 0.940253
 0.938515
  0.93709
 0.935856
(5 rows)

retail_db=#
retail_db=# -- ユークリッド距離計算でベクトル検索
retail_db=# select pm_euclidean_distance(feature, '{0.1,0.2,0.3,0.4}') as distance from feature_tb order by distance desc limit 5 ;
 distance
----------
  1.42282
  1.38024
  1.37326
  1.37312
  1.37251
(5 rows)

retail_db=#
retail_db=# -- ユークリッド距離計算の平方根でベクトル検索
retail_db=# select pm_squared_euclidean_distance(feature, '{0.1,0.2,0.3,0.4}') as distance from feature_tb order by distance desc limit 5 ;
 distance
----------
  2.02441
  1.90505
  1.88586
  1.88545
  1.88379
(5 rows)

retail_db=#
```


> https://www.alibabacloud.com/cloud-tech/doc-detail/181641.htm


これを応用し、K最近傍法（KNN）でのレコメンデーションを試してみます。考え方としては以下の通り、ユーザーが選んだ商品から趣向が類似している商品を選ぶアプローチです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210629015931.png "img")

MovieLensというデータセットでHologres Proximaによるレコメンデーション分析をしてみます。1GBを超えるデータセットです。                     

> https://grouplens.org/datasets/movielens/

まずは初期設定します。`193609`はMovieLenデータセット全体のレコード数のことを指します。   
```
create extension proxima;

begin;
create table movielens_feature_tb (
    movieID bigint,
    movieName char(200),
    movie_feature float4[] check(array_ndims(feature) = 1 and array_length(feature, 1) = 4)
);
call set_table_property('feature_tb', 'proxima_vectors', '{"feature":{"algorithm":"Graph","distance_method":"InnerProduct","builder_params":
{"min_flush_proxima_row_count" : 193609}, "searcher_init_params":{}}}');
end;
```

続いて、Pythonを使って、MovieLenデータセットを全体から特徴量データへ変換し、Hologresテーブルへ登録します。     
> https://www.alibabacloud.com/cloud-tech/doc-detail/208129.htm


各映画の評価で人気総数とすべての映画の平均評価を計算し、これを特徴量データに変換するための準備をします。
```
import pandas as pd
import numpy as np

r_cols = ['user_id', 'movie_id', 'rating']
ratings = pd.read_csv('ml-100k/u.data', sep='\t', names=r_cols, usecols=range(3))
movieProperties = ratings.groupby('movie_id').agg({'rating': [np.size, np.mean]})
movieNumRatings = pd.DataFrame(movieProperties['rating']['size'])
movieNormalizedNumRatings = movieNumRatings.apply(lambda x: (x - np.min(x)) / (np.max(x) - np.min(x)))
```

MovieLenのデータセットをDataFrameに保持したのち、これらをHologresへ格納します。

```
# fields = line.rstrip('\n').split('|')
cur.execute("INSERT INTO movielens_feature_tb VALUES ( %s, %s, array([%s]), %f, %f )", int(fields[0]), fields[1], np.array(list(map(int, fields[5:25]))), movieNormalizedNumRatings.loc[int(fields[0])].get('size'), movieProperties.loc[int(fields[0])].rating.get('mean'))
```
さて私の好きな映画、ミッションインポッシブル（2018年）を入れてみます。英語名だと「Mission: Impossible - Fallout (2018)」です。

こんな感じでテーブル一覧から検索し、この映画が好みのタイプ向けにレコメンデーションをしてみます。

```
retail_db=# select rank, movie_name, pm_approx_inner_product_distance(feature, '{(SELECT movie_feature  FROM movielens_feature_tb WHERE movie_name = 'Mission: Impossible - Fallout (2018)' ))}') as distance from feature_tb order by distance desc limit 10 ;
 rank |                movie_name                   | distance
------+---------------------------------------------+----------
    1 | Mission: Impossible - Ghost Protocol (2011) | 0.840254
    1 | Gone in 60 Seconds (2000)                   | 0.788515
    1 | Mission: Impossible - Rogue Nation (2015)   | 0.787139
    1 | Mission: Impossible II (2000)               | 0.767092
    1 | Starship Troopers (1997)                    | 0.695908
    1 | Minority Report (2002)                      | 0.685856
    1 | Mission: Impossible III (2006)              | 0.669625
    1 | Matrix Reloaded, The (2003)                 | 0.655714
    1 | Mission: Impossible (1996)                  | 0.645351
    1 | Matrix Revolutions, The (2003)              | 0.634082
(10 rows)

retail_db=#
```

秒殺でレコメンデーションができました。確かに、ミッションインポッシブル（2018年）の観点から、好みの映画に関連する映画が出ていますね。      
その他、Proximaによる機械学習アプローチは多岐にわたるため、近いうちにProximaによる分析手法を整理し紹介したいと思います。     
※上記はK最近傍法（KNN）によるレコメンデーションですが、論文によればCF（協調フィルタリング）、Factorization Machine、教師あり機械学習ベースの[Disentangled Graph Collaborative Filtering](https://arxiv.org/pdf/2007.01764.pdf)、[Neural Graph Collaborative Filtering](https://arxiv.org/pdf/1905.08108.pdf)、[RNNRecommender](http://yongfeng.me/attach/sequential-rec-memory-network-wsdm18.pdf)もできる模様。しかもリアルタイム機械学習。手法は追って確認中ですが、Hologresでこのような高度な機械学習が出来るため、MLOps基盤が不要になります。従って、DevOpsとMLOpsの双方運営問題やコスト増問題を全て排除できます。     


AWS Redshift + ML（SageMaker）やBigQueryML、Azure Synapse Analyticsだと、追加パイプラインが必要で有料のうえ、処理に時間がかかります。
それも、寄り道が多いので、3倍以上のコスト差が出てきます。以下は軽く見積もっての料金です。              
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210629084320.png "img")

データ分析、例えばレコメンデーション分析のために、MLOpsなど機械学習プラットフォームをあれこれ組み込み追加するより、TableauやBI ToolなどでSQLでシンプルに終わらせる方が何よりもスムーズです。      
これは著者としては In Database Analytics というアプローチと思うのですが、ユーザー目線でも総じてかなりメリットが多いです。     

---

# 最後に

本記事では、Hologresの概要を説明しました。Hologresはリアルタイムデータウェアハウスとして、現存のBig Dataやデータ分析に対する分析負荷やコスト問題など様々な課題を解決することができます。     
Hologresはリリースしてまだ１年弱と若いプロダクトサービスですが、これほどのアジリティ、弾力性、コストパフォーマンスから、今後プロダクトサービスとしての成熟が非常に楽しみです。      
なぜなら（2021/06/20時点）Hologres最新バージョンはたった0.10です。まだ歴史が浅いのに、他社クラウドサービスのOLAP（MPP）を凌駕しつつ、それもリアルタイム機械学習付きで、50%以上のコスト削減。      
Hologresはschemaでのindex設定や独自関数、APIは（2021/06/20時点）まだ未対応状態ですが、その辺は留意しつつ、みなさまも色々お試し試ただければ幸いです。 
サービスインして1年もしないうちに中国やシンガポール、US、インドネシア、UAEなどで多くの実績を続出しています。皆さまも一緒に実績を作りましょう。     



ーーー    
* Xiaowei Jiangは、Apache FlinkのPMC・コアコミッターであり、Hologresチームで働いています。              
* Billy(Yiming) Liu は、Apache KylinのPMC・コアコミッターであり、Hologres PDとしてチームで働いています。     
* Bowen Liは、Apache FlinkのPMC・コアコミッターであり、Hologresのシニアマネージャーで、現在Apple AI/MLで働いています。        
* その他、Apacheコミッター10数名がHologresチームで働いています。    



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>



