---
title: "ApsaraDB for ClickHouseの紹介"
metaTitle: "ApsaraDB for ClickHouseの紹介"
metaDescription: "ApsaraDB for ClickHouseの紹介"
date: "2021-07-15"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/ClickHouse_images_26006613786860800/20210715183157.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## ApsaraDB for ClickHouseの紹介

本記事では、Alibaba Cloudの国際サイトで提供している [ClickHouse](https://www.alibabacloud.com/product/clickhouse) をご紹介します。      


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210714233458.png "img")



# OLAPオープンソースの乱世時代
世の中には色々なオープンソースがたくさん登場しています。    
その中で、RDBMSとしてOLAPは色々なものがあります。    


例えば、      
* ApsaraDB for PostgreSQLの基盤として使用されてる[Greenplum Database](https://github.com/greenplum-db/gpdb)      
* NoSQL基盤の上に構築された分散SQLデータベースの[DuckDB](https://github.com/duckdb/duckdb)      
* 複数のトランザクション処理の同時実行を許容する[Comdb2](https://github.com/bloomberg/comdb2)      
* AlibabaとAWS、Azureなどのk8sにデプロイしながらマルチクラウドデータベースとして展開できるNewSQLの[YugabyteDB](https://github.com/yugabyte/yugabyte-db)      
* 異なるクラウドサービスや地理的に離れたデータセンター間でも一貫性を保った、ゴxxリのようなNewSQLの[CockroachDB](https://github.com/cockroachdb/cockroach)      
* RocksDBをベースとしながらApache HBaseを更に進化させた[Apache PEGASUS](https://github.com/apache/incubator-pegasus)      
* PingCAP社が開発した、paypayの基盤となる[TiDB](https://github.com/pingcap/tidb)      
* Facebook社が開発した超高速MPPの[Presto](https://github.com/prestodb/presto)      
* PrestoをDB化しつつ、DataLakeとDWH両方をサポートした[Trino](https://github.com/trinodb/trino)      
* ペタバイト規模の大規模データに対し、対話型分析する超高速MPPの[Apache Kylin](https://github.com/apache/kylin)      
* 巨大なデータに対して高速に分散処理を行うフレームワークの[Apache Spark](https://github.com/apache/spark)      
* Cloudera社が開発したAWS S3やAlibaba Cloud OSSに対し直接SQLクエリが投げられる超高速MPPの[Apache Impala](https://github.com/apache/impala)      
* JDBCドライバーを進化させ、データシャーティング、分散トランザクション、データ移行、データガバナンスを提供しつつOLTP/OLAPプロトコルをサポートする[Apache ShardingSphere](https://github.com/apache/shardingsphere)      
* YouTube社（チーム）が開発した、PBレベルのデータに対し、MySQLを水平方向にスケーリングしながら管理する分散データベースの[Vitess](https://github.com/vitessio/vitess)      
* Go言語で開発されたKey-Valueの[BadgerDB](https://github.com/dgraph-io/badger)      
* Baidu社が開発した、GoogleMesaとApache Impalaのテクノロジーを引継いた超高速MPPの[Apache Doris](https://github.com/apache/incubator-doris)      
* GitHubのようにバージョン管理ができる分散データベースの[Noms](https://github.com/attic-labs/noms)      
* フロントエンド側、WebベースでのOLAP/トランザクション処理を提供するRDBの[TypeORM](https://github.com/typeorm/typeorm)      
* フロントエンド側、Webアプリケーションを支えるためのNoSQL分散データベースの[RethinkDB](https://github.com/rethinkdb/rethinkdb)      
* 時系列データベースの[InfluxDB](https://github.com/influxdata/influxdb)      
* SSD時代のために開発され、様々なメタデータ管理システムで使われてる超高速KeyValueの[RocksDB](https://github.com/facebook/rocksdb)、      
* Google BigTableによって開発されたKeyValueの[LevelDB](https://github.com/google/leveldb)、      
* IoTに特化した軽量の時系列DBを持つプラットフォームの[TDengine](https://github.com/taosdata/TDengine)、
その他、[Apache CouchDB](https://github.com/apache/couchdb)、[PouchDB](https://github.com/pouchdb/pouchdb)、[SSDB](https://github.com/ideawu/ssdb)、[VoltDB](https://github.com/VoltDB/voltdb)、[FoundationDB](https://github.com/apple/foundationdb)など、ここには紹介しきれてないOLAPサービスもあります。      
※MPPはMassively Parallel Processing、複数のノードを使って大量のデータを並列で処理する技術です。      


その中から、今回は最近エンジニア間で話題となってる [ClickHouse](https://github.com/ClickHouse/ClickHouse) を紹介します。      
ClickHouseは2017年にオープンソースとして登場し、現在Amazon Redshift、GCP BigQuery、Azure Synapse Analyticsに勝るスピードで人気急上昇中です。      

> https://db-engines.com/en/ranking_trend


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210714233611.png "img")


---

# ClickHouseとは
ロシアの大手インターネット企業の Yandex 社がオープンソースとして開発した、非集計データを含む大量のデータを安定的かつ継続しながら集計といったリアルタイム分析を支える列指向の分散型データベースです。      

> https://clickhouse.tech/

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210715183157.png "img")

主な特徴としては、以下の通りです
> * x500・・・大量のデータの高速インポートを提供。書き込み処理はMySQLより500倍速い。      
> * X1000・・・SQLクエリ処理はMySQLや他の列指向DBと比較して1000倍速い。      
> * 20 Engines・・・可視化、集計、リアルタイム更新処理など様々なシナリオに応じて20種類以上のテーブルエンジンを提供。      
> * Storage 1/10・・・特殊なテーブル構造により、Storage保存量を10分の１へ圧縮。      
> * MySQLと同じSQL構文・・・MySQLと同じSQL構文で、Select句やGROUPBY句クエリなどをサポート。      
> * スケーラビリティ      
> * 拡張性      
> * 高可用性とフォールトトレランス      
> * 展開のしやすさ      


---

# ClickHouseの凄さ
上記、「速い」「速い」「速い」とPRしていますが、果たしてどれだけ速いか。これは体感しないと実感しづらいです。      
なので、NYC-Taxi Open Data（2009年 - 2020年 Yellow Trip Data, 17億レコード/TSVファイルで275GB）をClickHouseに格納し、試してみました。      
ClickHouseのスペックは 4core16GB/ Single Edition / ESSD PL1 300GBです。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210714235245.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210714234916.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210714234925.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210714234934.png "img")


> https://www.youtube.com/watch?v=IqRPB8RN1Ls


結論として、      
> * 17億レコード/TSVファイルで275GBは63GBへ圧縮      
> * 2017-2020年の搭乗数と搭乗時間、走行距離、平均走行時速を1秒未満（215ms）で出力      
> * これでコストは1か月で$317USD（3万円ぐらい）      
早すぎる上に安いですね。 :)      

ちなみに、同じ条件で、Amazon Redshiftも回してみました。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210715000156.png "img")

その結果、レコード件数の集計に52秒、平均速度時間の集計に18分です。      
dc2.8xlarge (32vCPU 244GiB）、データは300GB未満でありながら、このパフォーマンスです。      

いくらクラスターが増えても、Specを強化しても、RedshiftはHWスペックに依存したアーキテクチャなので、      
データがTB、PBと増加すれば、パフォーマンスとコストにもっと差がつくのは目に見えてると思います。      
※逆にRedshiftは10億レコードを超えるテーブルや、複雑なSQL処理が苦手というのもあります。      
（この場合、Redshitできめ細かな階層的なPartition構成が理想ですが、いくらPartitionを設定してもRedshift側の問題（AQUA(Advanced Query Accelerator) 構成によってクエリを処理するために必要な計算リソースをデータに近づけ、これによりネットワークトラフィックが削減され、CPUからの作業がオフロードされますが、10億を超えるレコードで列指向MPPとしてフィールドのグルーピング化だとスライサーリソースからワークロードの処理負荷が均等でないため）によりミリ秒以下への改善は現状できないのと、もはやApple To Appleではないので今回は未設定）      
※その他、細かいベンチマークはaltinity社による記録や情報が有名です。      

> https://www.youtube.com/watch?v=zDIK3Ej86GU



---

# ClickHouseの歴史
上記は17億レコードでしたが、Yandex社による公式記録では520のデータセンター上で、5PB、22兆5000億レコードのテーブルを毎回数秒以内に出力したというレポートがあります。      
ClickHouseはなぜこのパフォーマンスが出せるのか？ このパフォーマンスに対する背景というか歴史を少し紹介します。      

2009年、Yandex社はWeb解析ツールとしてJavaScriptによる「Yandex.Metrika」を独自開発していました。これはサイトオーナーや開発者が「自分のサイトに設置するツール」のことです。現代でいうとElasticsearchのLogstash、beatsみたいなものです。外部のユーザーがサイトにアクセスしたら、そのデータをYandex.Metrikaにリアルタイムでデータを送ります。そうすると、「Metric」で統計を見ることができます。いつ、どこから、何人がサイトに来て、何をしていたのか、どの商品を買ったのか、といったものが可視化出来ます。      
このYandex.Metrikaの最終的な目標はサイトへのアクセスから始まるトラフィック監視やコンバージョン拡張、ユーザーアクセス数を増やすことです。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210715113540.png "img")

参考：      
> https://github.com/ClickHouse/clickhouse-presentations

当時、Yandex.Metrikaとしてメトリクスらログデータを毎秒MySQLに格納し、可視化をしていましたが、以下の課題がありました。      

> * データ量増加に伴う、書き込み処理の負荷大      
> * 人数、サイトへの訪問などのイベントの数、購入した商品名とその金額合計、などを求めるといった複雑なSQLクエリが出来ない      
> * １つのフィールドにつき、500を超える非常に多くの異なる属性があり、それらを集計分析するためにテーブルやデータベースを別々へ区切ることが困難      


このYandex.Metrikaによるアプローチの問題点は「このような広くて長いテーブル（当然、集約されたデータよりも長くなります）を持つことができるデータベースでなければ、どんな問い合わせも素早く読むことができない。」ことです。      

よって、Yandex社はYandex.Metrikaのための以下の要件定義を満たすRDBMSを調査しました。      

> * コストパフォーマンスを持ちながらペタバイト級のデータを保存する能力があること(データを捨てない・区別しない)      
> * リアルタイムでデータを処理（書き込み処理と読み込み処理。すぐに結果が見られること）      
> * 大量のデータに対する高速クエリや複雑なSQLクエリができること      

・・・（2009年当時）もちろんこれらを満たすRDBMSは存在しなかったです。まだHadoop1.xの時代です。      
それでYandex社は列指向ソリューションとして、フロトタイプを少しずつ開発し始めました。      
それから3年後の2012年、ClickHouseが今回のYandex.Metrikaに対する要件定義を全て満たせるようになりました。      
それでもストレージタイプやデータセンター、地理的に離れた場合のレプリケーションなどの課題も色々ありましたが、それも乗り越えつつ、、2014年には次世代のRDBMSレベルまで仕上げることができました。この成果・進化を踏まえ、YandexはHackerNewsやblog、メディアなどにこの集大成を発信しました。当時、Yandex社はClickHouseはエンジニアレベルのニッチなもので、ClickHouseによるビジネスモデルはあまり考えてなかったそうです。      

その結果、意外なことに、同じ課題・似た課題に遭遇している世界中の多くの企業やエンジニアが、Yandex社に対してClickHouseの問い合わせが殺到し、それでYandex社はClickHouseをオープンソースとして展開しました。結果、ClickHouseはYandex社以外の100社以上の企業で使われるようになりました。ClouderaやOracle EDM、Amazon Redshiftからのマイグレーション事例もあるし、 日本でもClickHouseを利用している企業も実在しているし、またClickHouseによるコミュニティなどがあることも事実です。      

参考：      
> https://www.highload.ru/2016/abstracts/2327.html

> https://www.youtube.com/watch?v=TAiCXHgZn50


---

# Alibaba Cloud として ApsaraDB for ClickHouse

さて本題。      
そんな凄いオープンソースのClickHouseがAlibaba Cloudのデータベースプロダクトサービスとして登場しました。      

> https://www.alibabacloud.com/product/clickhouse

オープンソースのClickHouse を Alibaba Cloud のApsaraDB分散システムによって展開されたクラウドサービスが、 ApsaraDB for ClickHouse です。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210714235657.png "img")


ClickHouseの機能に加えて、色々な機能が拡充しています。      

> * フルマネージドサービス      
> * スケーリング機能      
> * 自動レプリケーション・自動フェイルオーバー      
> * Secondary Index      
> * Hot DataとCold Dataによる階層型ストレージでコスト削減      
> * 分析ショートカットとなる内部・外部の辞書型関数を独自サポート      
> * クエリやユーザーごとに並列で処理順位を管理するResource Queues      
> *  OpenSource の ClickHouse と同じ機能・エコシステムをサポート      
> * SLA 99.99%      

何よりも大きいのは、ClickHouseをCloud Native Databaseとして利用することができることです。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210715115804.png "img")


ClickHouseは特殊なテーブル構造で処理しますが、RAMらメモリーを使うため、常にメモリーとの戦いというレポートが上がっていますが、これがCloud Native Database、フルマネージド型データベースとして展開されているため、利用者はClickHouseによる運用労力が一気に減ります。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210715115815.png "img")


---

# ApsaraDB for ClickHouseとしてのシナリオ
Alibaba CloudからClickHouseが登場したことで、様々なシナリオが登場しました。      
ClickHouseはRDBMSでありながらも、CDNなどWebログ分析やWeb三層、サービス監視基盤、DWH、リアルタイム分析などを幅広くカバーしています。LogServiceやLogStashへ直接連携することもできます。      
それも安いので、シナリオに応じて様々なサービス基盤をスモールスタートから構築することができます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210715120528.png "img")



---

# テーブルファミリーについて

ClickHouseは大量のデータをテーブルへ書き込みおよびSQLクエリを高速で読み取ることを前提に設計されています。      

例えば、テーブル書き込み処理で最大のスループットを得るためには、テーブルのIndex未設定やSeekを維持せずにファイルの最後に書き込むだけですが、      
それだとSQLクエリでの読み取りでIndexなしでは読み取り処理のスループットが遅くなります。      
逆に、SQLクエリでの読み取り処理で最大のスループットを得るためには、Index設定およびテーブルを常にフルスキャンする必要がありますが、      
それだと、テーブル書き込み処理で処理の帯域幅からみて追い付かないため、書き込み処理のスループットが遅くなります。      

そのため、ClickHouseは妥協案としてTable EngineをMergeTreeとして登場しています。これは一般的なRDBMSでいうとLSM Treeの位置づけです。      
Table EngineをMergeTreeとして設定することで、      

* テーブル書き込み処理時、新しいデータは常にソートされ、データの小さな断片をDiskに反映するため、最大のスループットで書き込み処理を実現、      
* SQLクエリでの読み取り処理時、ClickHouseはバックグラウンドでデータを整理し順序を保ちながらデータを読み取るため、最大のスループットで読み取り処理を実現、      

することが出来ます。

ClickHouseは様々なシナリオに応じてデータを部分的に高速処理するためにユーザー側でテーブル作成時、Table Engineを選定することができます。      
Table Engineは様々なファミリーがあります。例えば、MergeTree FamilyとしてTable EngineをReplacingMergeTreeにするとバックグラウンドでTableの中にある同じKeyを持つデータが重複していた場合それを自動的に排除してくれたり、Table EngineをAggregatingMergeTreeにすると同じデータパーティション内で、同じ主キーを持つデータを集約されたりと、色々あります。      

Table Engineを決める基準としてはシナリオに応じて様々な要件を満たすときに選定すると良いです。      
> * データの保存モードと場所
> * データの書き込みと読み出しの場所
> * どのようなSQLクエリがサポートされてるか
> * データへの同時アクセス
> * Indexがある場合、Indexを使用するか
> * 並列SQLクエリの実行可否
> * データレプリケーションのパラメータ
> * etc…
ほとんどのシナリオはMergeTree Familyでカバーすることが出来ます（公式に推奨）      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210715133129.png "img")

また、ClickHouseは「Single-replica Edition」とHA構成の「Duble-replica Edition」の2種類があり、Duble-replica Editionのみ対応できる`Replicated<xxxxxx>MergeTree`シリーズがあります。`Replicated<xxxxxx>MergeTree`シリーズは分散処理できるバージョンを指します。例えば、ReplicatedReplacingMergeTree なら、ReplacingMergeTreeを並列処理で分散処理してくれるためパフォーマンスが向上します。      


> https://www.alibabacloud.com/cloud-tech/doc-detail/146002.htm


---


# MindsDBとの連携について
オープンソースのAutoMLフレームワークであるMindsDBと大量のデータに対する処理スピードの速いClickHouseを連携することで、モデル構築からMLパイプラインを素早くデプロイすることが出来ます。      
例えば、1秒おきに100レコードの時系列データが追加される状況でも、リアルタイムでモデル構築、デプロイすることができます。正解や閾値などが見えない値から異常検知することもできます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210715133819.png "img")

> https://github.com/mindsdb/mindsdb

> https://docs.mindsdb.com/tutorials/clickhouse/

> https://docs.mindsdb.com/model/clickhouse/


---


# LCCのClickHouse
ClickHouseはLCCとしてサービス展開をすることが出来ます。      
ここでいうLCCはLow（低コスト）Conjure（魔法のように素早く取り出す）Compression（高圧縮）の意味をします。      
AWS Redshiftとの金額比較をまとめてみましたが、500GB、1TB、5TBのデータを使ったシナリオでもRedshiftのほうが無駄に高額なのが目に見えています。      
それもClickHouseはデータを高圧縮してくれることや、データをHot DataとCold Dataへ階層的に管理するため、コストを大幅削減することが出来ます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-ClickHouse/ClickHouse_images_26006613786860800/20210715143750.png "img")



---


# ApsaraDB for ClickHouseの弱点
ClickHouseはリアルタイムDBとして、「なんでも出来る」というわけではないです。      
上記にも記述していますが、データ格納（Write処理）とデータ取り出し（Read処理）に特化しているだけに、弱点も実在しています。これはどのプロダクトサービスにも必ず落とし穴があります。      
ClickHouseの弱点としては、次の通りです。（著者が認識している範囲では、、）      

> * トランザクション処理をメインとした基盤は向いていない      
> * JOIN処理には少し工夫が必要      
> * I/Oのメモリースペック（RAM）に依存      
> * 1行1行単位ずつデータを格納といった小さなクエリではパフォーマンスが低下しやすい      

そこはTable Engineを上手く使うか、他プロダクトサービスとの連携利用でカバーするか、あるいは[書き込み処理・読み込み処理・複雑なSQL分析、リアルタイムJOINなど全てが揃っていて弱点があまりないHologres](https://www.alibabacloud.com/product/hologres)を選択する手もあります。      
ただしClickHouseはDatabase、HologresはBigDataプロダクトサービスなので、Hologresで最小Specの32Core、SubScriptionで毎月11万円～とちょっと高めなので、データ量が少ない場合は注意が必要です。      
（それでもHologresはAWS Redshift、GCP BigQueryより4、5倍安く、そして一番低いスペックでもWrite/Read処理がかなり速いのは非常に魅力的ですが、、、）      


---


# 最後に
本記事ではClickHouseの凄さ、Alibaba CloudのApsaraDBシリーズとしてのClickHouseを紹介しました。      
次の記事にて、ClickHouseの使い方、プロダクトサービスとの組み合わせ、ソリューションを段階的に紹介します。      

ちなみに、[ClickHouseの影響を受けてRustで開発したリアルタイムRDBMSのDatafuse](https://github.com/datafuselabs/datafuse)もあります。こちら[DatafuseはClickHouseよりもっと早いですが、現在開発中で本番環境提供はまだまだ先の状態](https://github.com/datafuselabs/datafuse)です。こう見てみると、オープンソースの乱世時代は非常に面白いですね。      




<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


