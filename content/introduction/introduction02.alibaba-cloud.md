---
title: "Alibaba Cloud紹介"
metaTitle: "Alibaba Cloud紹介"
metaDescription: "Alibaba Cloud紹介"
date: "2021-04-11"
author: "Hironobu Ohara"
thumbnail: "/images/2.1.PNG"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

# Alibaba が提供するクラウドサービス

![What is Alibaba Group](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/2.1.PNG "Alibaba Group")

Alibaba Cloud とは、その名の通り、Alibabaが提供するクラウドプラットフォームです。Alibabaが提供している各種クラウドサービスを取りまとめた概念になります。   
Alibaba Cloud は、アリババグループのエコシステムである阿里巴巴（Alibaba.com; アリババ・コム）や淘宝網、支付宝（Alipay）、天猫（Tモール）、AliExpress.com、盒马などでサービス基盤として使われました。中国は14億人もいるので、小売や流通、ECサイトなどでは１秒に1000万を超えるユーザーアクセスや負荷の高い取引処理が一般的です。そんな中、アリババグループのエコシステムの阿里巴巴や淘宝網、支付宝（Alipay）、天猫（Tモール）などはAlibaba Cloudというサービス基盤で運用しているため、一切落ちることなく安定したサービスをお客様に提供することができます。サーバーもユーザーのワークロードに応じた柔軟なスケーリングを行っているため、設備コストも非常に安いです。ハッカーによる不正アクセスやDDoS攻撃が多い中国でも、サービスが落ちることのない堅牢なセキュリティ構造も武器です。それだけでなく、日本やシンガポール、タイ、インドネシア、アメリカ、ドイツなど他の国から中国のAlibaba.comや淘宝網、支付宝（Alipay）、天猫（Tモール）などへ高速アクセスができるように、高速ネットワークによるグローバル展開を行っていることも特徴です。   
   
Alibaba Cloudは、AlibabaがECサイトとして展開している阿里巴巴や淘宝網、支付宝（Alipay）、天猫（Tモール）などので使われてるサービス基盤をAlibaba Cloudとして外部に公開したものです。Alibaba Clodは、大規模サービスを低価格で利用しつつ、データからビジネスに必要な意思決定を継続的に実現することができるクラウドサービスです。このような処理能力パフォーマンス、拡張性、安定性、低価格を持つ Alibaba Cloud を一般の人が設備やデータセンターなど初期投資なしで、すぐに利用することができます。   

Alibabaはそのクラウドサービスに問題があった場合、アリババグループのエコシステムの阿里巴巴や淘宝網、支付宝（Alipay）、天猫（Tモール）やサービスでも数億ドル規模の損失が生じると思います。従って、AlibabaはクラウドサービスであるAlibaba Cloudに非常に多くの投資をしています。Alibaba Cloudは、私たちユーザーにとって、その基盤を非常に安価に利用できるクラウドサービスです。   




![Alibaba Ecosystem](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/2.2.PNG "Alibaba Ecosystem")

# Alibaba Cloudの概要

Alibaba Cloudは大きく3つのポイントがあります。   

* 中国を含めたグローバル展開   
* 低コストで大規模処理に特化   
* アリババグループでの実績   

これらについて詳しく説明したいと思います。   

# 中国を含めたグローバル展開
1点目は、「中国を含めたグローバル展開」についてです。Alibaba Cloud は中国でAlibaba社によって生まれ培ったクラウドサービスです。Alibaba では、基本的にネットワークからデータセンター、サーバーまでを自前で設計・開発・展開・運用を自前で行っています。Alibabaは、Alibaba.comや支付宝（Alipay）などの様々なサービスを全世界向けに提供するために、中国から日本を含めたアジアン全域、EU、アメリカなど世界規模のクローズドネットワークを持ちます。そのため、例えば日本から中国へのAlibaba Cloudによるネットワークアクセスはどの事業者よりも非常に高速で快適です。   

データセンターは地球環境を考慮して、グリーンエネルギーへの対応方針にも力を入れています。Alibaba自社開発のデータセンターのPUE(*1)は最低1.17、平均PUEは1.3未満であり、中国の中でこの目標を達成した最初の企業です。ハードウェアはESSD(*2)などAlibaba Cloudが独自開発したストレージやHWなどを調達し、自社でデータセンターが運用しやすいように設計、運用しています。   

このように、自社サービスの提供に特化する形で効率性を求めた結果、Alibaba Cloud は圧倒的なコストパフォーマンスと安定したパフォーマンスを提供できるようになったのです。   

```注1 PUE（PowerUsage Effectiveness)：データセンター内のIT機器、サーバーや電源ファンなどのエネルギー効率を表す指標。PUE数値が低ければ非常に良い電力効率です。```

```注2 ESSD（Enhanced SSD)：Alibaba Cloud が提供する超ハイパフォーマンスクラウドディスクです。次世代の分散ブロックストレージアーキテクチャ、25 GE ネットワーク、および RDMA (Remote Direct Memory Access) 技術に基づいています。 ディスク 1 台あたり最大 100 万 のランダム IOPS と、低レイテンシを実現します。```

![Alibaba Global networks](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/2.3.PNG "global")



# 低コストで大規模処理に特化
Alibaba Cloudは、基本的に「自由自在なスケーラビリティが求められている」ことを前提に、徹底したコストパフォーマンスを図っています。   

例えば、毎年11月11日は中国国内では「独身の日（ダブルイレブン）」という大規模なショッピングフェスティバルが行われます。   
独身の日とは、毎年11月11日にアリババが運営する ECプラットフォーム「天猫（Tmall）」や「淘宝網（Taobao：タオバオ）」などで2009年から実施している世界最大規模のオンラインショッピングイベントのことです。   

このイベント、公式には「天猫ダブルイレブン・ショッピングフェスティバル」という名称なですが、もともとは「買い物で独り身を励ます」というコンセプトでスタートし、独身に見立てた「1」が4つ並ぶ11月11日に毎年行われていることから「独身の日」や「W11」と一般には呼ばれています。   

現在では、JD.comなどのアリババグループの競合となるECサイトでも同様のセールが行われ、中国国内では一大イベントに発展するまでの規模に成長しております。   

2020年の独身の日の実績は次の通りです。   
* 流通取引総額（GMV）：4982億元 （約7.9兆円）   
* 秒間ピーク注文数：58.3万/秒   
* 1億元（15.9億円）達成商品： 470個   
* 配送数：23.2億個   
* AI翻訳単語数：3.7万億個   
* AI翻訳対応言語数：214言語
* AIカスタマーサポート対応件数：21億以上   
（対象期間：2020年11月1日00:00〜2020年11月11日23:59:59）   

![W11](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/2.4.PNG "W11")

独身の日のピーク時は1秒につき58.3万/秒の注文数が発生しました。   
これは世界中の様々な人からアクセスしたことによる高ワークロードなので、常に大規模なスケーラビリティが要求されます。同時利用者数はもちろん、バックエンドで1時間に数憶件の処理が当たり前です。通常は一般的なサーバー数千～数万台配置し、注文数を処理するのがやっとですが、それでは運用コスト的にも課題があります。   

Alibaba Cloudはこうしたユーザーのワークロードに応じた処理基盤として、PolarDBやMaxCompute、Hologres、Kubernetesなどのプロダクトサービスが多くあります。   
例えば、Alibaba Cloud PolarDBはスペック変更やノード追加削除といった構成変更をしながらスケーリングするこことができます。そのため、毎年独身の日で売上が増加しても、Alibaba Cloudというサービス基盤は一切落ちないです。それどころが、ユーザーのワークロードに応じてノードを増減するため、オンプレミスのコストを約70%近く削減することができた実績があります。   
MaxComputeも、SQLクエリ投与時に処理リソースを瞬時スケーリングするため、コストパフォーマンスも高いです。[TPC-BBというビッグデータのベンチマークテスト](http://tpc.org/tpcx-bb/results/tpcxbb_perf_results5.asp)でも圧倒的なコストパフォーマンスを記録しています。   


Alibabaは `技術力で多くのユーザーに低価格で安心して利用いただけること` をコンセプトとしているため、コストも非常に安いです。それだけでなく、低価格で大規模な処理でも一切落ちることなく安心して活用できるという点が、Alibaba Cloudの１つの特徴です。   



# アリババグループでの実績
3点目は、「アリババグループでの実績」についてです。   
2点目で記述したように、独身の日を支えるサービス基盤として、Alibaba Cloudがあります。   
中国は14億人、および中国外のユーザーを含めて、独身の日で示してるように期中で約7.9兆円の売上を支えるサービス基盤としての実績があるインフラです。   

更に、Alibabaは3万人近くの社員がコアコミッターとしてオープンソースへ積極的に貢献しており、またLinux FoundationやApache Software Foundation、Cloud Native Computing Foundation（CNCF）、Free Software Foundationなど、多くの有名な国際オープン ソース組織に積極的に参加しています。   

その実績として、Apache FlinkやApache RocketMQ、Apache Spark、Kubernetes、などのサービスが世に広まっており、Alibaba Cloudを使わないお客様や他クラウドにも利用することが出来ます。   
Alibabaは技術で解決しながら未来を作ることを第一としているため、オープンソースを成長させることにより、ビジネスの発展をサポートすることができます。   

> https://opensource.alibaba.com/
![OSS](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/introduction/images/2.7.png "OSS")


参考：
[Alibaba Cloud Empowers China's Open Source Cloud Computing Communities](https://www.alibabacloud.com/blog/alibaba-cloud-empowers-chinas-open-source-cloud-computing-communities_594061)


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>



