---
title: "DataWorksの紹介"
metaTitle: "MaxComputeをハンドリングするDataWorksについて"
metaDescription: "MaxComputeをハンドリングするDataWorksについて"
date: "2021-03-04"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613674379500/20210224110305.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## MaxComputeをハンドリングするDataWorksについて

本記事では、Alibaba Cloud MaxComputeを操作するために必要となるDataWorksについてを説明します。     

# 前書き

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute



# DataWorksとは
一言で言うと、Alibaba Cloud DataWorksは、MaxComputeやHologres、E-MapReduceなどAlibaba Cloudのビッグデータプロダクトを管理、処理するIDEサービスです。    
例えば、MaxComputeは「サーバレス型フルマネージドプラットフォーム」となっています。
「サーバレス型フルマネージドプラットフォームをどうやって操作、運用するの？」という回答がDataWorksに当たります。   
アリババグループのデータビジネスの99％はDataWorks上で構築されています。何万人ものデータ開発者やアナリストがDataWorksに取り組んでいます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210303200642.png "img")


DataWorksはフルマネージドサービスとして、ノーコード・ローコードでデータ開発が行えます。基本機能として以下の機能が実在しています。   

* DataWorks DataMap・・・データのプレビュー、およびメタデータ管理
* DataWorks Data Integration・・・データ同期、移植、増分同期機能
* DataWorks DataStdio・・・データのクレンジング・処理・各種サービスへの格納
* DataWorks OperationCenter・・・タスク操作および処理の監視と管理
* DataWorks DataQuality・・・品質管理・レポーティング、データの暗号化および秘匿化


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210224110305.png "img")



## DataWorks DataMap
[Data Mapはメタデータ管理およびデータガバナンス を行うプラットフォーム](https://www.alibabacloud.com/cloud-tech/doc-detail/118931.htm)です。   
MaxCompute 表格存储などでフィールド構成やデータ内容をクイックに閲覧することができます。   
同時に、編集履歴や、パーティション情報、諸元、などをスムーズに可視化できます。   
もし見られたくないデータがある場合、操作ユーザ、列レベルでデータの秘匿化（非表示）にするようセキュリティ設定を行うこともできます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210303204728.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210224110834.png "img")



##  DataWorks Data Integration
[Data Integrationは異なるデータソース間でデータを同期するプラットフォーム](https://www.alibabacloud.com/cloud-tech/doc-detail/137663.htm)です。  
すべてのデータソースに限らず、異なるネットワーク、異なるロケーション（Region）間のオンラインリアルタイムおよびオフラインのデータ交換をサポートします。   
400を超えるデータソースを柔軟に組み合わせることができる上に、MaxComputeなどへシームレスにデータを同期/増分同期することができます。   
なお、[諸元データソースを設定するReader](https://www.alibabacloud.com/cloud-tech/faq-list/137716.htm) と [転送先のデータソースを設定するWriter](https://www.alibabacloud.com/cloud-tech/faq-list/137751.htm)を設定する必要があります。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210224110853.png "img")


DataWorks Data Integrationは、MaxComputeのみならず、様々なプロダクトで異なるRegion間でもデータ転送・交換に使えます。    
例えば中国や香港などでLogServiceによるデータを収集したあと、異なるリージョンとして日本リージョンのLogServiceで可視化したい場合は、このData Integrationを使うことで可視化をすることができます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210303203815.png "img")



## DataWorks DataStdio
[DataStdioはバッチ処理とストリーム処理を同時にサポートし、異なるエンジンのノードを1つのワークフローにまとめ、インターフェース付きでコード開発、ワークフロー管理、スケジュール管理、スクリプトテンプレート管理、などを行うビッグデータ開発プラットフォーム](https://www.alibabacloud.com/cloud-tech/doc-detail/139128.htm)です。    
ここでテーブル作成、データ同期処理、SQL、MapReduce（MR）、Shell、ワークフロー管理をします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210224110908.png "img")

DataStdioはワークフローとしてDo-while、for each、if-elseと言った条件分岐などのフローをプラレールのようにDrag & Dropで柔軟に組み立てられます。そのため、タスクやJobが失敗した場合を想定してのハンドリングが取れやすいことや、スクリプトなどプログラミング不要で運用することができるため、運用の負荷を大幅に減らすことができます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210303205905.png "img")



## DataWorks OperationCenter
[Operation Centerは タスクの運用やメンテナンス、Job処理のステータスや結果、データのライフサイクル管理などを行うビッグデータ運用プラットフォーム](https://www.alibabacloud.com/cloud-tech/doc-detail/137930.htm)です。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210224110926.png "img")


## DataWorks DataQuality
[DataQualityはデータの品質管理やセキュリティ管理などを行うビッグデータのセキュリティ運用プラットフォーム](https://www.alibabacloud.com/cloud-tech/doc-detail/73660.htm)です。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210224110942.png "img")


その他として、[MaxComputeテーブルなどを使ってExcelのようにセル操作したりグラフ作成、そしてレポート作成が行えるDataWorls Analysis](https://www.alibabacloud.com/cloud-tech/doc-detail/119756.htm)、[コードレスUIにより、ノーコードでAPIを作成することができるDataService Stdio](https://www.alibabacloud.com/cloud-tech/doc-detail/73263.htm)などの機能があります。


### DataWorls Analysis
Excel、Google スプレットシート みたいにデータ編集および定例レポートを作成することができます。新規データはもちろん、MaxCompute Tableなど既存データを使って編集することができます。   
このDataWorls Analysisは上記のDataStdioでタスク管理や、DataQualityでセキュリティ設定なども行えるため、非エンジニアでも定例レポートを好きにカスタマイズし出力することができます。       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210303211151.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210303211359.png "img")


# DataWorksの操作手順
DataWorksには上記の機能がありますが、基本的には
「DataWorks Data Integration」でデータを同期・転送し、
「DataWorks DataStdio」でテーブル設定
だけでデータ分析を行うことができます。


# DataWorksの料金について
DataWorksは Basic Edition / Standard Edition / Professional Edition / Enterprise Edition / Ultimate Edition のいずれかの料金プランがあります。   
基本はBasic Edition（無料）で使えて問題ないですが、データの秘匿化、暗号化などセキュリティを実装したい場合はStandard Edition、カスタムリソース設定や運用をしたい場合はProfessional EditionかEnterprise Editionで足りると思います。   
こちらは2021/01/20時点での料金表です。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210303195541.png "img")


# なぜ、Alibaba CloudにはDataWorksが必要だったのか？
ここまで、DataWorksについてを軽く紹介しました。   
DataWorksはビッグデータソリューションとしての全ての機能を完全にサポートします。通常であればプログラミングと言ったコード開発に、運用のエンジニア調達が必要ですが、DataWorksはそれを排除します。   
DataWorksはMaxComputeのみならずさまざまなシナリオ、ワークロードでも柔軟に対応できるため、[エンジニアがあまりいない企業でもDataWorksを使うことで、ワンクリックでデータウェアハウスを構築、運用している事例](https://www.alibabacloud.com/blog/wanwudezhi-gives-top-priority-to-efficiency-and-builds-a-big-data-platform-based-on-dataworks-%2B-maxcompute-%2B-hologres_597331) などが多くあります。DataWorksがあればデータ分析・運用エンジニアを新たに雇うより、ずっと低コスト・最速で構築・運用が出来ます。       

Alibaba Cloudはデータ分析・活用を得意とするクラウドサービスであり、大規模データからリアルタイムで意思決定プロセスを自動化するための取り組みの一環としても、管理・運用ハードルの面から見てDataWorksが必要になります。これは他クラウドサービスには無いユニークな機能と思います。   


# 最後に
本記事では、MaxComputeをハンドリングするDataWorksの概要を簡単に説明しました。     
DataWorksはデータ分析基盤の構築・運用・管理を支えるフルマネージドプラットフォームとして、現存のBig Dataやデータ分析に対する運用負荷や学習コストなど様々な課題を解決することができます。      
データ構築・運用・管理にはエンジニア不足やセキュリティなど多くの課題や工数が必要となる事が想定されますが、今回ご紹介したDataWorksを活用し、データ分析基盤の構築・運用・管理の手助けとなればと思います。     

最後までお読みいただきありがとうございました。   

参考：[How Does DataWorks Support More Than 99% of Alibaba's Data Development](https://www.alibabacloud.com/blog/how-does-dataworks-support-more-than-99%25-of-alibabas-data-development_596135)
> https://www.alibabacloud.com/blog/how-does-dataworks-support-more-than-99%25-of-alibabas-data-development_596135

<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


