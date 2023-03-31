---
title: "LogServiceの紹介"
metaTitle: "オフラインデータを含めた、様々なデータソースをシームレスに収集するLogServiceのご紹介"
metaDescription: "オフラインデータを含めた、様々なデータソースをシームレスに収集するLogServiceのご紹介"
date: "2020-12-29"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/LogService_images_26006613653714800/20201221132239.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## オフラインデータを含めた、様々なデータソースをシームレスに収集するLogServiceのご紹介


本記事では、オフラインデータを含めた、様々なデータソースをシームレスに収集するLogServiceをご紹介します。 


# 背景 - 継続してデータを収集することの難しさ

現在の人々は、データの「見える化」、データ可視化に注目しています。データ可視化することで、実態を具現化し、現在の動きにおけるボトルネックの分析、改善活動、予測、などを客観的に捉えることができます。この勢いは今後も止まらないです。例えば、   

・既存の業務記録や媒体を記録することで、そのデータを生かした様々なサービスを展開    
・業務内容の合理化・スリム化・リビルド・自動化で工数削減    

などといったデータ可視化によるSoR（System of Record）、すなわち『守りのIT』を実現することが出来ます。    
もちろん、データから新しい取り組みといったSoE（System of Engagement）、すなわち『攻めのIT』も重要ですが、データを可視化、これが出来るだけでも戦局が大きく変わります。    

孫氏の兵法にこんな言葉があります。

> <span style="color: #ff0000"><i>「守らば即ち余り有りて、攻めれば即ち足らず。」</i></span>

この意味は『守りこそ、どんな状況においても価値がある』というものです。『守り』のほうがビジネスとしてもコストパフォーマンスがはるかに高いことや、コロナ時代などこの先まったく予測できないどんなビジネス環境でも、『守り』ら基盤がしっかりしていれば、いつでも臨機応変かつ柔軟な『攻め』にシフトしていくことができます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201215131434.png "img")

とはいえ、データ可視化までの過程で、少し困難な部分があります。      
例えば、製造業界ではIOやオフラインデータ、すなわちExcelや紙などの媒体があります。これをいかにして収集するか、自動化、という意味では難しい面もあります。    

製造業業界でのデータ分析の課題:

1. 第三者提供に萎縮し、データ収集が困難（個人情報など）
1. OT（制御技術）データの収集
1. オフライン・外部データの収集

これらの課題をクリアーにするAlibaba Cloud Log Serviceがあります。
製造業以外だと、「データがあちこちに散在」「データの種類が多い」「データの整形ができてない」「データの量が多すぎる」「データの意味を理解するのに時間がかかる」などの課題が挙げられます。これもLog Serviceで解決することができます。      


# LogServiceとは

> <span style="color: #ff0000"><i>LogService は、リアルタイムデータロギングサービスです。  
ログの収集、消費、出荷、検索、および分析をサポートし、大量のログを処理および分析する能力を向上させます。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201221132239.png "img")


少し前になりますが、LogServiceについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www2.slideshare.net/sbopsv/alibaba-cloud-log-service


# 特徴

Alibaba Cloud LogServiceはフォーマットを持たない様々なシステムログやサーバログ、RDBMSデータやログ、CSV、JSONなどを、簡単に、かつ高速で収集、蓄積、可視化することができます。     
生のシステムログやデータから価値を発掘することは開発やPoCを含めて通常は数ヶ月かかりますが、LogServiceはリアルタイムで収集し、即インデックス付与、5分もしないうちに可視化します。    
データを収集した時点で、検索や分析、ETL、他プロダクトへ転送することが可能になります。LogServiceはあらゆるデータ量やデータタイプに合わせて拡張できるスケーラビリティを持ち、秒間数万レコードのRead処理を持ちながら、PBレベルまでのデータを対象に数秒以内へ返却が可能な検索能力を持ちます。    
「森を見て木を見る」ように、どんな些細なイベントでも見逃すことなく、可視化や検知、アラート発信や機械学習による異常検知をすることができます。     

コストは1ヶ月200GBのデータを利用で月額1万円台と非常にリーナブルです。LogServiceはAlibaba Cloudのデータ分析プロダクトとして中国や全世界を含めて300以上の企業が導入していますが、LogServiceはスタートアップやスモールスタートにちょうど良いプロダクトサービスです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201215105201.png "img")

---

# データ収集について
LogServiceは色々なデータソースをシームレスに収集し、すぐに可視化することができるため、便利です。

Log Serviceの実際の利用ケース、およびその方法を説明します。（記載ボリュームの関係上、手法ら詳細は別のblogにて記載になります）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201230152358.png "img")


## データ格納 Case1: LogtailでCSVデータを収集

製造業に限らず、業界で最もよく使われるのがCSVファイルを使ったやりとりです。これをLogServiceへ格納する方法です。    
特にCSVファイルにtimeフィールドがあり、それをLog Serviceのシステム側に合わせる方法です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201215135145.png "img")



## データ格納 Case2: SDKでExcelデータを収集

上記、CSVファイルがなく、標準のExcelファイルで運用中。それもフォーマットが決まっておりテーブル形式ではないことや、そのExcelファイルが大量にある、というシナリオでも、LogService付帯のSDKを使って収集することができます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201230152230.png "img")




## データ格納 Case3: OSS、AWS S3からCSVデータを収集

例えば各種サーバなどのメトリクスのlogファイルやcsvファイルなどをOSSもしくはAWS S3に格納したとして、それをLogServiceへ収集することもできます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201228144743.png "img")





## データ格納 Case4: SDKでTwitterデータを収集

SDKもしくはRestAPIを使ったデータ収集もできます。ここではTwitter APIを使ったデータ収集方法をクイックにまとめています。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201215140931.png "img")




## データ格納 Case5: Logstashでnetflowデータを収集

NW機器からトラフィックデータを収集し、可視化することもできます。これを使い、社内セキュリティ監視・不正検知を実現します。   

※ netflowはcisco社が開発したネットワークのトラフィックの情報を監視・分析する技術です。現在、cisco社を中心とした様々なベンダーのネットワーク機器にて利用することが可能です。   
Netflowを通じて外部・内部ネットワークの様々なセキュリティ問題を明らかにし、社内NWで検知できるレベルのインシデントを抑制することができます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201223143336.png "img")



## データ格納 Case6: Google Apps Script（GAS）でデータを収集

Google Apps Script（GAS）で株価データを収集、可視化できます。また、株価データから異常検知や予測も行えます。        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201226135049.png "img")

 

## データ格納 Case7: Container Service for Kubernetes (ACK) によるNGINXでのデータを収集

 Container Service for Kubernetes (ACK) によるNGINXの各種ログをLogServiceにて収集・可視化できます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201229162606.png "img")



---

# データを収集した「その後」

データはただ「収集」するだけでは意味がありません。データは「財産」なので、データの「今」と向き合う必要があります。    
それも、客観的証明が出来る事実のデータなので、それを生かした様々な取り組みができます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201221133144.png "img")


## クレンジング

データに欠損や重複など、「汚れ」はつきものです。これはLogServiceのData Transformation（データ変換機能）で綺麗にすることができます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201225153213.png "img")

## ETL

LogServiceで収集したデータを、他サービスでも使いやすいように、ETL（LogShipper）することができます。    
ETLはOSSにCSVファイル、jsonファイル、HDFS_parquetなどへpartition付きで出力します。    
このETL（LogShipper）のとき、Data Transformation（データ変換機能）と組み合わせることで、出力したい内容らルールを自由自在に設定できます。    

### OSSへ保存

LogServiceからOSSへcsv / json / parquet形式でファイルを出力することが出来ます。    
フィードル名を指定すれば、自動でETL処理されます。   
これによりOSSにあるデータを使って、MaxCompute、E-MapReduce、DataLake analyticsなどで分析することが出来ます。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201225154125.png "img")

### 3rd プロダクトサービスへの出力

LogServiceからOSSを介入せずにMaxCompute、E-MapReduce、AnalyticDB for MySQL、TSDBへ直接出力することもできます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201225154830.png "img")


## 付帯のダッシュボードで可視化

もちろんLogServiceで可視化、分析も可能です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201225153906.png "img")

## 異常検知

LogServiceには[DAMOアカデミー](https://damo.alibaba.com/)による機械学習アルゴリズムが付帯されているので、様々な時系列分析を実現できます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201228145448.png "img")

---

# まとめ
 
本記事では、LogServiceの概要を簡単に説明しました。     
フルマネージド環境でありながら、様々なデータを収集し蓄積・可視化する事が可能です。加えて、データ量や使い方に応じた課金なので、使い方次第ではコスト削減や、運用負荷の改善に効果があるのでは無いでしょうか。

最後までお読みいただきありがとうございました。  


余談です。Alibaba Cloud中国サイトですが、LogServiceに関する様々なDemoサイトを展開しています。参考にしてみてください。    

> https://promotion.aliyun.com/ntms/act/logdoclist.html


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201229150358.png "img")



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


