---
title: "課金・請求関連"
metaTitle: "Alibab Cloud プロダクト料課金・請求関連について"
metaDescription: "Alibab Cloud プロダクト料課金・請求関連についてを説明します。"
date: "2021-11-20"
author: "Hironobu Ohara"
thumbnail: "/images/5.2.PNG"
---

## 初めに

本書はAlibaba Cloud 料金モデルをご紹介します。    
※本書はAlibabaCloud国際サイト2021年11月時点でのドキュメントに基づいて、作成したため、プロダクトによって、料金を変更する可能性があるので、ご了承ください。    


## Alibaba Cloudの料金の基本的な考え方

Alibaba Cloudは数多くのプロダクトサービスを展開しています。    
これらは、クラウド上でのプロダクトサービスであり、基本的にユーザーはプロダクトサービスに対し、利用する場合はレンタルしながら「使った分だけ課金」する考え方になります。    
クラウド上のプロダクトサービスに対し、どのような課金タイプがあるかについては、次の項目で詳しく説明します。     


---

## 課金タイプ
Alibaba Cloud は`SubScription（サブスクリプション）`と`Pay-As-You-Go（PAYG、従量課金）`、`Preemptible（プリエンプティブ）`、`Reserved（リザーブド）` をサポートしています。     

2021年11月24日現時点で、Alibaba Cloud Elastic Compute Service（ECS）のみ、`SubScription（サブスクリプション）`と`Pay-As-You-Go（PAYG、従量課金）`、`Preemptible（プリエンプティブ）`、`Reserved（リザーブド）`、それ以外のプロダクトサービスは`SubScription（サブスクリプション）`と`Pay-As-You-Go（PAYG、従量課金）`をメインとして取り扱っています。     


|比較項目|サブスクリプション|従量課金|プリエンプティブ|リザーブド|
|--------|:-----:|:----:|:----:|:----:|
|支払いタイミング|前払い|後払い| 後払い|前払い|
|決済サイクル|週／月／年|１時間|1時間|支払い方法による、全前払いの場合年、後払いの場合一時間|
|柔軟性|低|高|中|中|
|平均単価|低|高|中|中|
|利用シーン|長時間利用|短時間利用|短時間利用|支払いタイプによる短時間または長時間利用可能|
|料金滞納リスク|なし|あり|あり|支払いタイプによる、前払いの場合なし、後払いの場合あり|
|即リリース(削除)|不可|可能|可能|支払いタイプによる、前払いの場合不可、後払いの場合可能|


前述通り、クラウド上のプロダクトサービスは基本的にレンタルしながらサービスを利用するため、一つのサービスを利用開始してから、利用できなくなる（リソースがリリースされる）までの期間を一つの`ライフサイクル`と呼びます。    

ライフサイクルのステータスは支払い方式（サブスクリプションと従量課金）によって異なります。     
サブスクリプションは購入したサービスの期限が切れるとリリースされますが、従量課金はお客様が手動でリリースしないかつ料金滞納が発生しない限り、サービスが自動的にリリースされることはありません。    

---


## SubScription（サブスクリプション）

サブスクリプションは、支払った後にリソースを使用できる前払いの一種です。      

#### 基本オプション

 * アップグレードとダウングレード     
 * サブスクリプションの延長（自動更新）   
 * サブスクリプションの中止    

※ プロダクトによって自動更新オプションとアップグレード／ダウングレードオプションは提供しない場合もあります。     

#### 料金と課金期間
サブスクリプションの平均料金は、従量課金よりも低くなります。リソースを大量に使用するユーザーには、ぴったりの料金プランです。料金プランは、基本的には`年間サブスクリプション`と`月額サブスクリプション`の 2 週類があります。     
課金期間は、リソースが有効化された時刻から始まり、1 か月後または 1 年後の翌日の 00:00:00 に終了します。     
>たとえば、2021 年 11 月 23 日 13:23:56 に月払いサブスクリプションモードで ECS インスタンスを有効化すると、インスタンスの最初の課金サイクルは 2021 年 12 月 24 日 00:00:00 に終了します。    

#### ライフサイクル管理（T+15+15 方針）
有効期限切れのサブスクリプションインスタンスのステータスについて、関連リソースのステータス遷移は以下の表のとおりになります。    

|期限|自動更新有効|
|--------|:----:|
|有効期限日当日(T)|正常に稼働|
|期限切れ15日後(T+15)|サービス停止、データは保留|
|期限切れ30日後(T+30)|リソースリリース、データ削除|


---

## Pay-As-You-Go（PAYG、従量課金）

従量課金は、実際に使用したリソース量に応じて料金が請求されます。この方式により、随時要求に応じてリソースの有効化、リリース、購入が可能で、ビジネスの成長に合わせてスケールアップすることもできます。 多くのリソースが無駄になってしまうこともある従来のホストへの投資に比べ、30% から 80% 程コストを削減することができます。      

#### 決済サイクル
従量課金リソースは 1 秒ごとに課金されますが、決済は 1 時間ごとです。 以下の点にご注意ください。    

* 従量課金リソースの支払いは、使用後に、ご利用のアカウントで課金されている他のプロダクトと合わせて決済されます。    

* 通常、ご利用のアカウントの累積の月間消費額が $ 100 USD 未満の場合、翌月の初日に料金が差し引かれます。    

#### 課金項目
クラウド製品は、課金方式および製品自体の特性に従って、同じクラウド製品/サービスで複数の課金項目を定義することができます。クラウド製品に複数のサービスフォームの組み合わせがある場合は、複数の課金項目を定義する必要があります。     
例：OSS サービスの課金項目    
 * ストレージ料金    
 * インターネットへのデータ転送料金     
 * API リクエスト料金    

#### ライフサイクル管理（T+15+15 方針）
1 回の決済期間に従量課金のリソース料金の支払いに 3 回失敗した場合、関連するリソースのステータス変更はサブスクリプションと同じ、T+15日後でリソース停止、T+30でリソースリリースされ、データも削除されます。     


#### インスタンス停止後の課金

> Alibaba Cloud では、従量課金のインスタンスが停止しても、リソースをリリースしない限り課金され続けます。    

ECS には、停止したインスタンス（VPC 接続）には課金されない という機能が導入されています。この機能を有効にすると、停止済みステータスになったときに、VPC 接続の従量課金インスタンスに料金を支払う必要はありません。詳細は、[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/63353.htm) を参照ください。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/63353.htm

---

### Preemptible（プリエンプティブ）
Preemptible（プリエンプティブ）はAlibaba Cloud Elastic Compute Service（ECS）のみの料金プランです。      
プリエンプティブインスタンスは、従量課金のインスタンスの価格に比べて一定の割引が適用される従量課金インスタンスです。 プリエンプティブインスタンスを作成後、保護期間中は安定して使用でき、市場価格が入札価格より高い場合やインスタンス仕様の在庫が不足している場合は、インスタンスが自動的にリリースされます。     

> https://www.alibabacloud.com/cloud-tech/en/doc-detail/178880.html

---

### Reserved（リザーブド）
Reserved（リザーブド）はAlibaba Cloud Elastic Compute Service（ECS）のみの料金プランです。      

リザーブドは、1年・3年単位で事前購入するインスタンスのことで、時間単価の割引が行われます。支払い方法は次の3つに分類されます。    

* 全額前払い（All Upfront）・・・購入時に全額を前払い    
* 一部前払い（PURI）・・・購入時に一部（約50％）を前払いし、残りは期間中に1時間ごとに支払い    
* 前払いなし（NURI）・・・期間中は1時間ごとに支払い    

> https://www.alibabacloud.com/cloud-tech/doc-detail/100371.html

---

### Burstable（バースト）

バーストインスタンスはCPUクレジットでコンピューティングパフォーマンスを保障するインスタンスです。平日CPU使用率は低い、たまに突発的にCPU使用率が高い場合があるシナリオに適しています。     

バーストパフォーマンスインスタンスは、インスタンスを作成後、継続的にCPUポイントを獲得できます。パフォーマンスが負荷要件を満たせない場合、インスタンスにデプロイされている環境やアプリケーションに影響されることがなく、より多くのCPUポイントを消費することで、コンピューティングパフォーマンスをシームレスに向上させることができます。 ほかのインスタンスと比較して、バーストパフォーマンスインスタンスのCPU使用率はより柔軟で、コストが低くなります。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/59977.htm

---



### Resource package

Resource package（リソースパッケージ）は従量課金の補足として使われています。一部リソース（例えばトラフィック、ストレージ容量など）は事前に使用量を予測するのが難しいため、実際の使用量に応じた課金方法でしか対応できません。このようなリソースを前払いプランとして使用できるように、リソースパッケージが作成されました。リソースパッケージを使用すると、リソースパッケージ内のリソース量が優先的に差し引かれます。超過した部分は従量課金で課金されます。
通常のサブスクリプションとリソースパッケージの比較については、下記をご参照ください。     

|比較項目|サブスクリプション|リソースパッケージ|
|--------|:----:|:----:|
|課金方式|前払い|前払い|
|購買単位|時間単位(月／年)|リソース単位（通常はGB）|
|リソースタイプ|Computing|Storage,OutboundTraffic|
|使い切る場合|リリースされる|従量課金として課金される|

プロダクトサービス例：Direct Mail、CDN     

---

### Compute Units (CUs)

1Core4GBの計算リソースで一時間で消費した費用を1CUとします。     

プロダクトサービス例：MaxCompute、Realtime Compute for Apache Flink    

---

### Storage Capacity Unit（SCU）

前払いで購入したSCUが従量課金のストレージへ充当し、従量課金で利用しながらコストを最適化するプランです。     

 ![ECS payg ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/01_ECS_payg_21.png "ECS payg 21")


料金サンプル
||SCUサブスクリプション（１ヶ月）|SCU（1年）※15%OFF|SCU（3年）※50%OFF|
|--|--|--|--|
|Ultra Disk|0.072USD/GB/月|0.061USD/GB/月|0.036USD/GB/月|
|Standard SSD|0.216USD/GB/月|0.184USD/GB/月|0.108USD/GB/月|
|ESSD PL1|0.432USD/GB/月|0.367USD/GB/月|0.216USD/GB/月|

=======
※月額換算費用。実際は全額前払い。     
※東京リージョン     
※消費税は含まれていません。 

プロダクトサービス例：OSS、PolarDB Storage、EBS      

--- 

### Savings plans
Savings plansは一つの割引プランで、従量課金のインスタンス（プリエンプティブインスタンスを除く）の請求額を差し引くことができます。      
特定の期間（1年間または3年間）内に一定量のリソース（USD /時間で測定）を使用することを約束することで、より低い従量課金割引が使用できます。 Savings plansを購入した後、約束された消費量を超えない時間料金の部分がSavings plansプランの特別割引で差し引かれます。    

プロダクトサービス例：ECS、Disk、固定インタネット帯域幅     

> https://www.alibabacloud.com/cloud-tech/doc-detail/184085.htm

---

### Data Transfer Plan
Data Transfer Planは共通トラフィックパッケージです。    
Data Transfer Planを購入後、ECS、EIP、SLBおよび共有帯域幅によって生成されたIPv4の通常トラフィック費用（EIPブティックトラフィックを除く）を自動的に差し引かれます。    
プロダクトサービス例：ECS、EIP、SLB、IPv4通常トラフィック     

> https://www.alibabacloud.com/cloud-tech/doc-detail/55774.htm

---

## プロダクトサービス価格と割引について
Alibaba Cloudのプロダクトサービスは様々な要因により、料金が変動していきます。基本的には値下げしていく形ですが、RegionやZone、スペック、トラフィック量など状況に応じて料金が変わっていきます。この辺についてを説明します。     

* リージョン     
  - 基本的にはデータセンター所在国（地域）の場所によって、ハードウェアとネットワークのコストが違うため、クラウドプロダクトの料金も違います。    
* スペック   
  - インスタンスタイプによって、使ってるリソース（コンピューティング、ストーレッジ）が違います。従って、プロダクトを買う前に、お客様の業務ニーズに合わせたスペックをご選択ください。    
* 利用量     
  - 一部プロダクトのストーレッジとトラフィックは使用料が多くなるほど、単価料金が安くなります。    
* バージョン    
  - DNS、DataVなどプロダクトのバージョンによって機能が違うため、料金も大きく違います。    



## 割引と無料利用枠

お客様が手軽にAlibaba Cloud の製品の利用を開始できるように、一部プロダクトでは個別に無料利用枠が用意されており、トライアル費用を抑えることができます。     

* プロダクト個別の無料利用枠    
  - OSS、MaxComputeなどのプロダクトは、最初の何Gストーレッジ無料枠が持っています。具体的には各プロダクトの料金ページにご確認ください。    

|プロダクト|課金方法|無料項目|無料利用枠|説明|
|--------|:-----|:----|:----|:----|
|APIGateway|従量課金|API呼び出し回数|100万回／月|初年度の月間（自然月）で最初の100万回のAPI呼び出しは無料|
|OSS |従量課金 | 標準ストレージ|0~5GB/月無料 |標準ストレージは5GB以下で無料|
| | |ダウンロードリンクトラフィック |0~100GB無料|ダウンロードリンクトラフィックは100GB以下で無料|
| | |Put API Requests |0~100Million 無料|毎月0~100Millionの Put API Requests は無料|
| | |Get API Requests |0~500Million 無料|毎月0~500Millionの Get API Requests は無料|
|Function Compute |従量課金|Requests | 0~100 Million無料|毎月0~100 Million Requests は無料|
| | |Resources for function executions |0~400,000 GB-s無料 | 毎月0~400,000 GB-sは無料|
|ADAM ||Database evaluation service |無料|現時点でDatabase evaluation serviceは無料|
|||Database transformation and migration services | 無料| 現時点でDatabase evaluation serviceは無料|
|||Application assessment and transformation services | 無料|現時点でApplication assessment and transformation servicesは無料|
|Auto Scaling ||プロダクト|無料 | コンピューティングリソースの自動スケーリングは無料|
|Database Autonomy Service |従量課金 |Basicバージョン | 無料|Basicバージョンは無料|
|  |サブスクリプション|Basicバージョン |0~5 Gbpsは無料|Alibaba Cloud ECS、SLB、EIP、WAFに対し、無料で0~5 GbpsのDDoS攻撃からガード|
|Security Center |サブスクリプション |Basic Edition|無料| 基本版は様々なセキュリティ脅威からを無料でガード|
|Machine Translation |従量課金 |文字数|0~100万文字 無料| 機械翻訳サービス。毎月100万文字まで無料で翻訳が可能|
|DataWorks |従量課金|Shared resource groups for Data Integration  |1-10 成功インスタンス毎日 無料|一日で1-10インスタンスが無料 |
| | |Shared リソースグループ | 1-10 無料 | 毎日1-10のリソースグループインスタンスは無料|
| | |データサービスのAPI数 |0~1 Million無料 | 毎月データサービスのAPI呼び出し数は0~1 Millionで無料|
| | |データサービスの実行時間 | 0~400,000 GB-s無料|データサービスで毎月0~400,000 GB-sの実行は無料|
| | |知能モニターベースラインインスタンス | 1~2 無料|毎日1~2の知能モニターベースラインインスタンスは無料|
| | |OpenAPI | 0~1 Million 無料|毎月のOpenAPI呼び出し数は0~1 Millionで無料 |
|Message Service |従量課金| API requests |0~20 million無料 |2,000万のAPIリクエスト、MNSによるメッセージは無料|
| | |Message storage |無料|Messageストレージは無料|
| | |Internet traffic |無料|Internet trafficは無料|
|CloudMonitor| |プロダクト|無料|無料|
|DirectMail|従量課金|Eメール数|毎日0~200件のEメール無料|毎日0~200件のEメールが無料|
|LogService|従量課金|ログデータストレージ|0~500 MB無料|毎月0~500 MBのログデータストレージが無料|
|||読取と書込トラフィック|0~500 MB無料|毎月0~500 MBの読取と書込トラフィックが無料|
|||ログデータインデクストラフィック|0~500 MB無料|毎月0~500 MBのログデータインデクストラフィックが無料|
|||読み取りと書き込みの数|0~1 million 無料|毎月0~1 millionの読み取りと書き込み回数が無料|
|||アクティブシャードレンタル|31個shard*日/月|毎月31個shard日が無料|
|PolarDB|従量課金|バックアップと復元機能|無料|バックアップと復元機能は無料|
|||バックアップファイル用ストレージのレベル1バックアップ|データベースストレージ*50％|データベースストレージの50％部分が無料|
|||ログバックアップ|0~100 GB 無料|0~100 GBのログバックアップが無料|
|RDS MySQL|従量課金|トラフィック|無料|現時点でトラフィックは無料|
|||SQL監査|無料|現時点でトラフィックは無料|
|||性能監視|300秒/回の頻度で監視 無料|300秒/回の頻度で監視する場合、無料|
|||バックアップ機能|無料|バックアップ機能は無料|
|||スナップショットバックアップ|インスタンスストレージ*200％無料|スナップショットバックアップはインスタンスストレージの200％が無料|
|||物理バックアップ |インスタンスストレージ*50％無料|インスタンスストレージの50％が無料|
|RDS SQLServer|従量課金|トラフィック|無料|現時点でトラフィックは無料|
|||バックアップ機能|無料|バックアップ機能は無料|
|||スナップショットバックアップ|インスタンスストレージ*200％無料|スナップショットバックアップはインスタンスストレージの200％が無料|
|||物理バックアップ |インスタンスストレージ*50％無料|インスタンスストレージの50％が無料|
|RDS PostgreSQL|従量課金|トラフィック|無料|現時点でトラフィックは無料|
|||性能監視|60秒/回の頻度と300秒/回の頻度で監視 無料|60秒/回の頻度と300秒/回の頻度で監視する場合、無料|
|||バックアップ機能|無料|バックアップ機能は無料|
|||スナップショットバックアップ|インスタンスストレージ*200％無料|スナップショットバックアップはインスタンスストレージの200％が無料|
|||物理バックアップ |インスタンスストレージ*50％無料|インスタンスストレージの50％が無料|
|||データベースアジェンダ|無料|データベースアジェンダは無料|
|HBase|従量課金|トラフィック|無料|現時点でトラフィックは無料|
|Clickhouse|従量課金|Zookeeperノード|三つのZookeeperノード 無料|三つのZookeeperノードは無料|
|||バックアップストレージ|インスタンスのストレージサイズと同じサイズが無料|バックアップのストレージはインスタンスのストレージサイズと同じサイズが無料|

* 年間購入割引    
  - 一部プロダクトは長い期間（１年間毎に）で購入する場合は、15％の割引があります。詳細について各プロダクトの購入ページにご確認ください。    

利用例:  
 ![senario 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/use_example1.png "senario 01")

 ![senario 02 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/use_example2.png "senario 02")
 
 ![senario 03 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/configuration_example1.png "senario 03")
 
構成：     
□ キャッシュ（EIP、CDN）
□ ロードバランサー（SLB）     
□ ウェブサーバー（ECS、Linux 2台、永続化ディスクにEBS）     
□ データベース（RDS、単一構成）     
□ バックアップ（OSS）     

費用:     
・月額約：23,223.2円（$211.12 USD）     
・年間約:  278,678.4円（$2,533.44 USD）     
・概算見積もり詳細      

> https://www.alibabacloud.com/pricing-calculator

※ネットワークおよびＩ/Ｏ使用量によって価格が変動する可能性があります     
 
  
 ![senario 04 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/configuration_example2.png "senario 04")

構成：     
□ キャッシュ（EIP、CDN）     
□ 静的ファイルサーバー（OSS）     
□ 動的コンテンツサーバー（ECS、Linux 1台、永続化ディスクにEBS）     
□ バックアップ（OSS）     

費用:     
・月額約：10,043円（$91.3 USD）     
・年間約: 120,516 円（$ 1095.6 USD）     
・概算見積もり詳細    

> https://www.alibabacloud.com/pricing-calculator

※ネットワークおよびＩ/Ｏ使用量によって価格が変動する可能性があります     
※ECSによる動的コンテンツサーバーを全部静的ファイルサーバーとして配置すれば、さらに安価です    

### 構成例3:中規模サイト  

![senario 05 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/configuration_example3.png "senario 05")

構成:     
□ キャッシュ（EIP、CDN）     
□ ロードバランサー（SLB）     
□ ウェブサーバー（ECS、Linux 2台、永続化ディスクにEBS）     
□ APPサーバー（ECS、Linux１台）     
□ データベース（RDS、DC間フェイルオーバー構成）     
□ バックアップ（OSS）     

費用:     
・月額約：93,957.6円（$ 854.16 USD）     
・年間約: 1,127,491.2 円（$ 10,249.92 USD）     
・概算見積もり詳細      

>https://www.alibabacloud.com/pricing-calculator

※ネットワークおよびＩ/Ｏ使用量によって価格が変動する可能性があります     


## Alibaba Cloudの課金体系のご紹介
代表的なプロダクトサービスの料金の考え方についてざっくりまとめてみました。   
 
---

## Elastic Compute Service（ECS）
### Elastic Compute Service（ECS）支払タイプ
 ![ECS 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/01_ECS_01.png "ECS 01")

#### Pay-As-You-Go（PAYG、従量課金）・・・使った分だけお支払い     
> 必要な時に使った分だけ課金されるので、夜間使わないサーバを止めておくなどしてコスト削減を図ることができます。    

#### SubScription（サブスクリプション）・・・一定期間使用する前提でお支払い     
> 利用期間が決まっている場合、インスタンス代ら料金を前払いすることで割引しながら使用することができます。    

#### Preemptible（プリエンプティブ）・・・入札価格によって決まる    
> 使用したいインスタンスに対して入札し、その価格がインスタンスの市場価値を上回っている限り利用できます。    

#### Reserved（リザーブド）・・・事前予約して節約     
> 1年・3年単位とあらかじめ利用契約期間を決めてサービスを事前購入することで、利用料金が割り引かれます。    


### Elastic Compute Service（ECS）料金構成
|料金構成|単価|説明|
|----|----|----|
|インスタンス料金|例:ecs.g6.large（単価 $ 0.12 USD/時間）|インスタンススペックによって時間単価は異なります|
|ディスク料金|例:システムディスク（単価 $ 0.0300 USD /100 GB/時間）|ディスクはシステムディスクとデータディスクがあります|
|イメージ料金|例:High Performance WordPress with Free Support V5.8.1-LAMP-CentOS（単価 $ 0.055 USD /時間）|マーケットの有料イメージを使用する場合、料金を発生します。無料のパブリックイメージを提供しています|
|パブリックトラフィック料金|例:トラフィック料金（単価 $ 0.087 USD /GB/時間）|帯域幅課金とトラフィック課金の二種類があります|
|スナップショット料金|例:標準スナップショット100GB（単価 $ 0.0209 USD/GB/月）|スナップショットのサイズによって、料金が異なります。クロスリージョンの間でスナップショットのコピーペーストも料金がかかります|

### Elastic Compute Service（ECS）PAYG - 使った分だけの従量課金

> - 例：ECS１台を1ヶ月利用する場合計算方法は 総時間単価 X 24（時間）X 日数（30）X １（台数）
> - 総時間単価はインスタンス料金、ディスク料金、イメージ料金、パブリックトラフィック料金を加算
> - 1時間未満の使用も1時間分としてカウント

 ![ECS 03 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/01_ECS_03.png "ECS 03")

### Elastic Compute Service（ECS）課金の例（PAYG・従量課金）
> - リージョン：日本
> - インスタンス料金：ecs.g6.large 単価 0.12 USD/時間
> - ディスク料金：システムディスクESSD100GB 単価 0.0300 USD /100 GB/時間
> - イメージ料金： High Performance WordPress with Free Support V5.8.1-LAMP-CentOS 単価0.055 USD /時間
> - パブリックトラフィック料金：トラフィック課金 例：1GB/時間を使用する 単価 0.087 USD /GB/時間
> - スナップショット料金 例：標準スナップショット100GB 単価 $ 0.0209 USD/GB/月

一ヶ月でECS費用：   
（ 0.12 USD/時間+ 100GBｘ0.0300 USD /100 GB/時間+ 0.055 USD/時間+ 0.087 USD /GB/時間ｘ 1GB）ｘ 24（時間）ｘ 30（日）ｘ1（台数）+ 100 ｘ 0.0209 USD/GB/月ｘ1（台数）＝$ 212.33 USD/月     

> https://www.alibabacloud.com/cloud-tech/doc-detail/40653.html

### Elastic Compute Service（ECS）SubScription - 料金を前払いで長期使用による割引
> - 事前に料金支払いで時間当たりの価格を割引     
> - GPUのインスタンスタイプが選択可能     
> - 購入時に以下を指定：Region / Zone /インスタンスタイプ/イメージ/ストレージ/ネットワーク/パブリック IP アドレス/セキュリティグループ    

 ![ECS 04 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/01_ECS_04.png "ECS 04")

### Elastic Compute Service（ECS）課金の例（サブスクリプション）
> - リージョン：日本
> - インスタンス料金：ecs.g6.large 単価 60.89 USD/月
> - ディスク料金：システムディスクESSD100GB 単価 （ 12.95 USD /月）
> - イメージ料金：High Performance WordPress with Free Support V5.8.2-LAMP-CentOS 単価（ 40 USD/月） 
> - パブリックトラフィック料金：固定帯域幅課金 ５Mbps 単価 18.48 USD/月

一ヶ月でECS費用：月額 60.89 USD/月+ 12.95 USD /月+ 40 USD/月+18.48 USD/月 ＝ 132.32 USD/月

> https://www.alibabacloud.com/cloud-tech/en/doc-detail/56220.html

---

## ApsaraDB for RDS

### ApsaraDB for RDS支払タイプ
 ![RDS 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/02_RDS_01.png "RDS 01")

### ApsaraDB for RDS 料金構成

|料金構成|単価|説明|
|:-----|:-----|:-----|
|インスタンス料金|例:mysql.n2.medium.1（$ 0.095/時間）|スペックにより、料金が異なります|
|ストーレジ料金 |例:20GB|請求方法については、インスタンスと同じです。ストーレジタイプはESSDとStandardSSD二種類があります|
|ネットワークトラフィック料金|無料|これまでのところ、インバウンドまたはアウトバウンドのトラフィックに対して料金を請求することはありません。|
|読み取り専用インスタンス |オプション|読み取り専用インスタンスの使用はオプションであり、選択した課金方法 (PAYG またはサブスクリプション) でインスタンスとストレージに対して課金されます。|
|SQL監査|無料 |機能の有効化または無効化に関係なく、無料で使用できます。料金は発生しません。|
|パフォーマンス監視料金 |無料|無料モニタリングサービスは、300 秒に 1 回の頻度で実施されます|
|バックアップ料金 |バックアップ機能無料、ストレージ料金あり。PAYG ベース|付加機能として、基本的にバックアップ機能は無料で利用できますが、ストレージ利用は無料ではありません。スナップショットまたは物理バックアップから選択できます。また、デフォルトでは、インスタンスのストレージ容量の 200% 以内のスナップショットバックアップストレージの使用、またはインスタンスのストレージ容量の 50% 以内の物理バックアップストレージの使用に対しては課金されません。それ以外の場合は、PAYG ベースで課金されます|

### ApsaraDB for RDS PAYG - 使った分だけの従量課金
> - 時間単価（インスタンス料金とストーレジ料金）で課金
> - 全てのDBエンジンに対応
> - 購入時に以下を指定：Region / Zone / DBエンジン / DBインスタンスタイプ /MultiAZ / ストレージタイプ


![RDS 03 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/02_RDS_03.png "RDS 03")

### ApsaraDB for MySQL 課金の例（PAYG・従量課金）

> - リージョン：日本
> - DBエンジン：Mysql8.0
> - インスタンス仕様： mysql.n2.medium.1 2CPU4GB 単価0.095 USD/時間）
> - ストレージ：ストーレジESSD PL1 20GB 価格（0.11-0.095）USD /時間 単価0.00075 USD /GB/時間
> - バックアップサイズ：1TB 単価  0.00004 USD/GB/時間

ApsaraDB for MySQL PAYG 一ヶ月分の料金：    
[0.11 USD/時間+（1024GB‐100GB*2）ｘ0.00004 USD/GB/時間]ｘ 24（時間）ｘ 30（日）＝ 102.9312 USD/月    

> https://www.alibabacloud.com/cloud-tech/doc-detail/45020.html
> https://www.alibabacloud.com/cloud-tech/doc-detail/96142.htm


### ApsaraDB for MySQL SubScription - 料金を前払いで長期使用による割引
> - 事前に料金支払いで時間当たりの価格を割引
> - 全てのDBエンジンに対応
> - 購入時に以下を指定： Region / Zone / DBエンジン / DBインスタンスタイプ /MultiAZ / ストレージタイプ


![RDS 04 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/02_RDS_04.png "RDS 04")

### ApsaraDB for MySQL 課金の例（サブスクリプション）

> - リージョン：日本
> - DBエンジン：Mysql5.7 mysql.n2.medium.25 2CPU4GB
> - ストレージ：100GB

ApsaraDB for MySQL サブスクリプション 一ヶ月分の料金： 月額 151.80 USD/月


---

## ApsaraDB for PolarDB
 ![PolarDB 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/03_PolarDB_01.png "PolarDB 01")

### ApsaraDB for PolarDB 料金構成
|料金構成|単価|説明|
|--|--|--|
|クラスター料金 |例:MySQL 8.0 4 Cores16 GB(Dedicated)（$ 0.516/時間）|プライマリノードと 1 つ以上の読み取り専用ノード、スペックにより料金が異なります|
|ストーレジ料金 |例:100GB（$ 62/月）（単価 $ 0.00085/GB/時間）|従量課金|
|バックアップ料金 |ストレージ量限度内は無料、超えるとPAYGベース|バックアップ機能は無料ですが、バックアップストーレジでは無料限度額があります。無料限度額を超えると従量課金です。バックアップはレベル1とレベル2があります|
|グローバルネットワークトラフィック料金|無料|現時点で無料です。PolarDBクラスター本体の費用のみを課金します|
|SQL監査|オプション|監査ログによって消費されたストレージ容量に基づいて従量課金されます|
|データベース代理|無料|現時点で無料です。今後無料版とエンタプライズ版を提供する|


### ApsaraDB for PolarDB ストレージパッケージ料金
PolarDBストレージ容量が10TBを超える場合、ストレージプランを適用することでストレージのコストを40%以上削減します。    

 ![PolarDB 03 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/03_PolarDB_03.png "PolarDB 03")

### ApsaraDB for PolarDB のバックアップ
|バックアップの種類|Level|デフォル設定|保持時間|概要|無料分|有料分（無料割り当て量を超える分）|
|--|--|--|--|--|--|--|
|データベースデータのバックアップ|Level1|YES|3‐14日|Redirect-on-Write（ROW）スナップショットによって作成されます。|使用済みのデータベースストレージｘ50%|1時間あたりのストレージ料金＝（レベル１バックアップの合計物理ストレージ―無料クォーター）ｘ１時間あたりの単価|
|データベースデータのバックアップ|Level2|No|30‐7300日|Level1のバックアップデータを圧縮し、格納。リストアはLevel1バックアップより時間がかかるが、Level1バックアップより低価格です。|なし|１時間あたりのストレージ料金＝レベル2バックアップの合計物理ストレージｘ１時間あたりの単価※Object Storage Serviceと同じ価格設定|
|ログのバックアップ|-|YES|3‐7300日|RedoログをOSSに並行アップロードで、バックアップを作成。スナップショットとREDOログに基づいて、ポイントインタイム復元（PITR）を実行することができます。|100GB|１時間あたりのストレージ料金＝（ログバックアップの物理ストレージの合計-100GB）ｘ１時間あたりの単価|

 ![PolarDB 04 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/03_PolarDB_04.png "PolarDB 04")

### ApsaraDB for PolarDB SubScription - 料金を前払いで長期使用による割引

> - 事前に料金支払いで時間当たりの価格を割引
> - 全てのDBエンジンに対応
> - 購入時に以下を指定：Region/Zone/DBエンジン/DBインスタンスタイプ 

### ApsaraDB for PolarDB 課金の例（サブスクリプション）

> - リージョン：日本
> - DBエンジン：PostgreSQL 11 
> - エディション：クラスター
> - 仕様：４Core16GB 専用
> - ノード数：２

ApsaraDB for PolarDB 一ヶ月分の料金： 496 USD/月    

> https://www.alibabacloud.com/cloud-tech/doc-detail/68498.html

---

## Object Storage Service（OSS）
### Object Storage Service（OSS）の料金体系
 ![OSS 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/04_OSS_01.png "OSS 01")

### Object Storage Service（OSS） 料金構成
料金 = リソース実際使用量ｘ対応時間単価   
リソース実際使用量 = ストレージ料金 + トラフィック料金 + API請求料金 + OSS Transfer Acceleration料金+クロスリージョンコピー料金 + OSS Select料金 + オブジェクトラベル料金    

|料金構成|単価|説明|量を超える分）|
|--|--|--|
|ストーレジ料金|ストーレジパッケージ料金|例:スタンダードLRSプラン100GB（$ 1.40/月）|ストーレジパッケージはスタンダードストーレジプランと頻度低いストーレジプランの二種類があります|
||ストーレジ料金|例:スタンダードプラン100GB（単価:$ 0.0170/GB/月）|5GB内では無料で使用できます、5GBを超えるとストーレジタイプにより、単価が異なります|
|ダウンストリームトラフィック料金|トラフィックパッケージ料金|例:ダウンストリームトラフィックパッケージ100GB（単価:$ 8.70/月）|一ヶ月、6ヶ月、一年の種類があります|
||イントネーションダウンストリームトラフィック料金|例:200GB（単価: $ 0.0870/GB）|100GB以内で無料、100GB以上の場合、従量課金です。アップストリームトラフィックとイントラネットのトラフィックは無料です|
||CDNトラフィック料金|例:100GB（単価: $0.080/GB）|従量課金です。$0.080/GB|
||OSS Transfer Acceleration料金|例:中国以外の地域からの加速100GB（単価:$0.082/GB）|地域によって単価が異なります|
|API請求料金|API請求料金|例:スタンダードストーレジタイプ1000百万回請求（単価: $0.001600/10000Requests）|無料限度額があり、ストーレジタイプによって、単価が異なります。|
|クロスリージョンコピー料金|クロスリージョンコピー料金|例:クロスリージョンコピー100GB（単価: 0.120/GB）|リージョンによって、単価が異なります|
|OSS Select料金|OSS Select料金|例:OSS Selectによってスキャン1000GB（単価:0.00180/GB）|OSS Selectによってデータスキャン数を課金します。ストーレジタイプによって、単価が異なります|
|Object Taggingオブジェクトラベル料金|Object Taggingオブジェクトラベル料金|例:一ヶ月でラベル数は1000万個（単価:$0.00880/10000 ラベル/月）|全リージョン同じ単価です|

### Object Storage Service（OSS）課金の例（PAYG・従量課金）

> - リージョン：日本
> - ① ストレージ料金：単価:$ 0.0170 USD /GB/月（ 0-5GB 無料  ） 一ヶ月でスタンダードプラン 100GB
> - ② イントネーションダウンストリームトラフィック： 単価: $ 0.0870 USD /GB（ 0-100GB 無料）一ヶ月でイントネーションダウンストリームトラフィックは200GB
> - ③ CDNトラフィック料金：単価: $0.080 USD/GB 一ヶ月でCDNトラフィック100GB
> - ④ OSS Transfer Acceleration料金: 単価:$0.082 USD/GB一ヶ月で中国以外の地域からの加速100GB
> - ⑤ API請求料金：単価: $0.001600 USD/10000Requests (0~500Million 無料 )  一ヶ月でスタンダードストレージタイプ1000百万回請求
> - ⑥ クロスリージョンコピー料金：単価: 0.120 USD/GB  一ヶ月でクロスリージョンコピー100GB
> - ⑦ OSS Select料金：単価:0.00180 USD/GB 一ヶ月でOSS Selectによってスキャン1000GB
> - ⑧Object Taggingオブジェクトラベル料金：単価:$0.00880 USD/10000 ラベル/月 一ヶ月でラベル数は1000万個

Object Storage Service（OSS） 一ヶ月分の料金：    
（200 GB - 5 GB ）ｘ 0.0170 USD/GB/月 + [（200 GB -100 GB ）ｘ 0.0870 USD /GB + 100GBｘ 0.080 USD/GB+ 100ｘ 0.082 USD/GB
 +（1000-500）ｘ 0.001600 + 100 GBｘ 0.120 USD/GB /月 +  1000 GBｘ 0.00180 USD/GB +  1000 GBｘ 0.00880 USD/GB] /月＝ 51.615 USD/月    

※ストレージとトラフィックはパッケージ使用するときも利用可能です。  

---

## Server Load Balancer（SLB）
### Server Load Balancer（SLB）の料金体系

* ALB（Application Load Balancer）
> - PublicIPをALBインスタンスに割り当て
> - インスタンス代は有料
> - 性能LCU（Loadbalancer Capacity Unit）料金が付与
> - トラフィック料金はEIP側の料金として課金

* CLB（Classic Load Balancer）
> - PublicIPをCLBインスタンスに割り当て
> - 共有リソースCLBインスタンスは無料、専用CLBインスタンスは有料
> - トラフィック料金と帯域幅料金の二種類から課金

 ![SLB 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/05_SLB_01.png "SLB 01")

### ALB（Application Load Balancer）料金構成

ALBの従量課金料金  = インスタンス料金 + 性能LCU料金 + パブリックトラフィック料金    

|料金構成|単価|説明|
|--|--|--|
|インスタンス料金|例:標準版（単価 $ 0.021 USD/時間）|バージョンによって、単価が異なります|
|性能LCU（Loadbalancer Capacity Unit）料金|$ 0.007 USD/個|LCUの計算方法は毎秒の新規コネクション数、毎分の同時接続数、1時間のトラフィック量、ルール評価数によって計算されます|
|パブリックトラフィック料金|例:EIPトラフィック料金|トラフィック料金はEIPの課金方法をご参照ください。イントラネットトラフィック料金はかかりません|


### ALB（Application Load Balancer）課金の例(PAYG・従量課金)

> - リージョン：日本
> - インスタンス費用：標準版 単価 $ 0.021 USD/時間
> - 性能LCU（Loadbalancer Capacity Unit）： 単価 $ 0.007 USD/個（例： 1時間のLCU費用 $ 0.042USD/時間）
> - 設定費用：日本リージョン 単価 $ 0.005 USD/時間
> - トラフィック課金 例:トラフィック100GB（単価:$ 0.087 USD /GB）

ALB（Application Load Balancer） 一ヶ月分の料金：    
（ 0.021  USD/時間+ 0.042 USD/時間 + 0.005 USD/時間）X 24 ｘ 30 + 100 GBｘ0.087 USD /GB ＝ 57.66  USD/月

>https://www.alibabacloud.com/cloud-tech/en/doc-detail/197202.html

### CLB（Classic Load Balancer）の課金タイプ
CLBの課金タイプはトラフィック料金と帯域幅料金の二種類があります。    

|インターネットタイプ|課金タイプ|インスタンスタイプ|インスタンス費用|トラフィック費用|帯域幅費用|スペック費用|
|--|--|--|--|--|--|--|
|インターネット|トラフィック課金|共有インスタンス|〇|〇|×|×|
|||性能保障インスタンス|〇|〇|×|〇|
||帯域幅課金|共有インスタンス|〇|×|〇|×|
|||性能保障インスタンス|〇|×|〇|〇|
|イントラネット|-|共有インスタンス|×|×|×|×|
|||性能保障インスタンス|×|×|×|〇|
※〇は費用が発生します。一方、×は費用が発生しません。      



|計算項目|実際の利用量|スペックパラメータ|説明|備考|
|--|--|--|--|--|
|最大コネクション数|90,000|1,000,000|実際使用量90,000はslb.s2.smallの最大値50,000を超える、slb.s2.mediumの最大値100,000を超えません。最大コネクションから見ると時間スペックはslb.s2.mediumで計算します||
|CPS毎秒で新規コネクション数|4,000|100,000|実際使用量4,000はslb.s1.smallの最大値3,000を超える、slb.s2.smallの最大値5,000を超えません。CPSから見ると時間スペックはslb.s2.smallで計算します||
|QPS毎秒クエリ数|11,000|50,000|実際使用量11,000はslb.s2.mediumの最大値10,000を超える、slb.s3.smallの最大値20,000を超えません。QPSから見ると時間スペックはslb.s3.smallで計算します|結果一番高いスペックslb.s3.small（単価:＄0.24 USD/時間）で課金します|

### CLB（Classic Load Balancer）課金の例(PAYG・従量課金)

> - 課金タイプ: トラフィック課金 
> - インスタンスタイプ：性能保障インスタンス
> - インスタンス費用：単価 $ 0.009 USD/時間
> - トラフィック費用：一時間で１GBを使用します。単価 $ 0.087 USD/GB
> - スペック費用：Super I (slb.s3.large)を選択します。単価 $ 0.61 USD/時間 （実際の使用量によって単価: 0.24 USD/時間）

CLB（Classic Load Balancer） 一ヶ月分の料金：    
（0.009 USD/時間 + １GB/時間ｘ 0.087 USD/GB + 0.24 USD/時間）ｘ24 ｘ 30 =$ 241.92 USD/月     

※実際のアクセス量によってスペック費用が変わります。slb.s3.largeを選択しても、実際使用量によって課金します。    
ただし、選択したスペックは上限とします。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/154176.html

---


## Elastic IP Addresses（EIP）

### Elastic IP Addresses（EIP）支払タイプ

![EIP 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/06_EIP_01.png "EIP 01")

### Elastic IP Addresses（EIP） の料金体系

![EIP 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/06_EIP_02.png "EIP 02")

### Elastic IP Addresses（EIP） 料金構成

|料金構成||単価|説明|
|--|--|--|--|
|トラフィック課金|設定費用|例:日本リージョン（単価$ 0.005 USD/時間）|リージョンによって、単価が異なります|
||トラフィック料金|例:トラフィック100GB（単価:$ 0.087/GB）|リージョンによって、単価が異なります。|
||EIPバインド費用|例:EIP限度額は20個、一日で200回SLBにバインドする、一ヶ月で価格（200-100）X 0.149 X 30|ECSまたはECIのインスタンスをバインドする場合、設定費用は無料です。NATGateway、SLB、secondary elastic network interface (ENI)、HAVIPにバインドする場合、設定費用がかかります。一日中、EIPのクオーター数の5倍以内でEIPバインドすると費用がかかりません。5倍無料限度額を超えると、EIPをバインドする回数によって、設定費用がかかります。|
|帯域幅課金|設定費用|例:東京リージョン:（単価 $ 0.113 USD/時間）|リージョンによって、単価が異なります|
||帯域幅料金|例:10Mbpsの場合（単価: $ 0.85+(n-5)× 0.57 USD/日）|1~5 Mbpsの場合と5Mbps以上の場合、計算方法が異なります|
||EIPバインド費用|例:EIP限度額は20個、一日で200回SLBにバインドする、一ヶ月で価格（200-100）X 0.149 X 30|ECSまたはECIのインスタンスをバインドする場合、設定費用は無料です。NATGateway、SLB、secondary elastic network interface (ENI)、HAVIPにバインドする場合、設定費用がかかります。一日中、EIPのクオーター数の5倍以内でEIPバインドすると費用がかかりません。5倍無料限度額を超えると、EIPをバインドする回数によって、設定費用がかかります。|

### Elastic IP Addresses（EIP） 課金の例(PAYG・従量課金 トラフィック課金)

> - リージョン：日本
> - 設定費用：単価 $ 0.005 USD/時間
> - トラフィック課金：単価:$ 0.087 USD/GB 一ヶ月でトラフィック100GB

Elastic IP Addresses（EIP）  一ヶ月分の料金：    
0.005 USD/時間ｘ 24 時間ｘ 30日 + 100GBｘ 0.087 USD/GB = 12.3 USD/月    


### Elastic IP Addresses（EIP） 課金の例(PAYG・従量課金 帯域幅課金)
 ![EIP 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/06_EIP_04.png "EIP 04")

> - リージョン：日本
> - 設定費用：日単価 $ 0.113 USD/時間
> - 帯域幅課金 
> - 例:毎日で17:00に帯域幅が10 Mbpsから20 Mbpsへ変更し、23:00にまた20 Mbpsから15 Mbpsへ変更した場合します。帯域幅値は20 Mbpsです。
> - 帯域幅費用計算
> - 1~5 Mbps 単価$ 0.17 USD/日/ Mbps  
> - 5 Mbps以上 単価$（ 0.85 +(20-5) × 0.57 ）USD/日/ Mbps 
> - 該当EIPが使用時間は14.5時間で、15時間で計算します。

Elastic IP Addresses（EIP）  一ヶ月分の料金：    
[（ 0.17 USD/日/ Mbpsｘ5 Mbps +（ 20-5） × 0.57）]       
ｘ（15時間/24時間）ｘ30日 + 0.113USD/時間ｘ24 時間ｘ30 日= $ 257.61 USD/月    

---

## API Gateway

### API Gateway の料金体系

![APIGW 01](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/07_APIGW_01.png "APIGW 01")

### API Gateway 共有インスタンス 料金構成
|料金構成|単価|説明|
|--|--|--|
|API呼び出し|例:一年目の場合一ヶ月で10億回（単価:$ 0.9 USD/百万回）|すべてのリージョンは同一単価です。一年目の毎月の前百万回のAPI呼び出しは無料です。|
|インターネットトラフィック|例:一ヶ月でインターネットトラフィック100GB（単価:$ 0.087 USD/GB）|リージョンによって、単価が異なります|

### API Gateway 課金の例(PAYG・従量課金 共有インスタンス)
> - リージョン：日本
> - API呼び出し：単価 0.9 USD/百万回 一年目の場合一ヶ月で10億回（一年目毎月前百万回のAPI呼び出しは無料です）
> - インターネットトラフィック：単価: 0.087 USD/GB 一ヶ月でインターネットトラフィック100GB 

API Gateway 一ヶ月分の料金：    
（ 1000000000 - 1000000 ）/1000000 ｘ 0.9 USD/百万回 + 100GB ｘ 0.087USD/GB = 907.8 USD/月     

> https://www.alibabacloud.com/product/api-gateway/pricing

### API Gateway 専用インスタンス料金構成
|料金構成|単価|説明|
|--|--|--|
|インスタンス料金|例:api.s1.medium（単価:$ 2.37/時間）|リージョンによって、料金が異なります|
|インターネットトラフィック|例:一ヶ月でインターネットトラフィック100GB（単価:$ 0.087 USD/GB）|リージョンによって、単価が異なります|

### API Gateway 課金の例(PAYG・従量課金 専用インスタンス)
> - リージョン：日本
> - インスタンス料金：仕様 api.s1.medium 単価 2.37 USD /時間
> - インターネットトラフィック：単価: 0.087 USD/GB 一ヶ月でインターネットトラフィック100GB 

API Gateway 一ヶ月分の料金：    
2.37 USD /時間ｘ 24時間ｘ30日 + 100 GB ｘ 0.087 USD/GB =$ 1,715.1 USD/月    

> https://www.alibabacloud.com/product/api-gateway/pricing

---

## FunctionCompute（FC）

### FunctionCompute（FC）の料金構成
![FC 01](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/08_FC_01.png "FC 01")

### FunctionCompute（FC）料金構成
|料金構成|単価|説明|
|--|--|--|
|関数呼び出し料金|例:1000万回（単価:$ USD 0.2/1,000,000 requests）|すべてのリージョンの単価は同じです。|
|リソース使用量|例:一ヶ月でインターネットトラフィック100GB（単価:$　USD 0.000016384/GB-second）|すべてのリージョンの単価は同じです。|
|インターネットトラフィック|例:一ヶ月でインターネットトラフィック300GB（単価:$ 0.117/GB）|関数内データトランザクショントラフィック、関数レスポンストラフィック、CDNトラフィック三つのトラフィック単価が同じです。イントラネットとアップロードトラフィックが無料です。|

- 従量料金 = 関数呼び出し料金 + リソース使用量 + インターネットトラフィック    
- 関数呼び出し料金 = 関数呼び出し回数ｘ単価    
- リソース使用量 = インターネットトラフィック + 関数内データトランザクショントラフィック（GB）ｘトラフィック単価 + 関数レスポンストラフィック+ CDNトラフィックｘトラフィック単価    

### FunctionCompute（FC）課金の例(PAYG・従量課金)

> - リージョン：日本
> - 関数呼び出し料金： 単価  0.2 USD/1,000,000 requests 一ヶ月で関数呼び出し1億回
> - リソース使用量：単価 0.000016384 USD/GB-s 一ヶ月で1億回並列数100、実行時間は1秒の場合
> - インターネットトラフィック：単価:0.117 USD/GB 一ヶ月で関数内データトランザクショントラフィック100GB、関数レスポンストラフィック100GB、CDNトラフィック100GB

FunctionCompute（FC） 一ヶ月分の料金：    
100000000ｘ0.2 USD/1000000 + 100000000 × 1 ÷ 100 ×0.000016384USD/GB-s + （100 GBｘ 0.117USD/GB + 100GBｘ 0.117USD/GB  + 100GB ｘ 0.117USD/GB）= $ 71.484 USD     

> https://www.alibabacloud.com/product/api-gateway/pricing

---

## Anti-DDoS

* Anti-DDoS Origin
> - ECS、SLB、EIP、WAPに対して最大5Gbit/sの保護機能
> - 無料
> - デフォルトで有効

* Anti-DDoS Origin Enterprise
> - 全てのプロダクトサービスに対して無制限の保護機能
> - 有料。年間単位のサブスクリプション
> - インスタンス単価はビジネス規模とIPアドレス数で決まる

* Anti-DDoS Pro/Premium
> - サーバーがデプロイされているリージョン、およびアクセスユーザーの場所に基づいて、Anti-DDoS ProとAnti-DDoS Premiumのどちらかを使用します。
> - Premiumは外部インターネット接続できるリソース・サービスにアタッチ（他クラウド、オンプレミスにも対応）

||アクセスユーザー|中国インターネット経由|中国外インターネット経由|アクセス先サーバー|
|--|--|--|--|
|Anti-DDoS Pro|中国|〇||中国|
|Anti-DDoS Premium|中国、中国以外||〇|中国以外|
|（中国向け）Anti-DDoS Pro、（中国外向け）Anti-DDoS Premium|中国、中国以外|〇|〇|中国、中国以外|
|Anti-DDoS Premium|中国、中国以外|〇|〇|中国以外|
|Anti-DDoS Premium|中国|〇|〇|中国以外|
|Anti-DDoS Pro|中国以外|〇|〇|中国|

> https://www.alibabacloud.com/cloud-tech/en/doc-detail/72017.html

---

## Web Application Firewall（WAF）
### Web Application Firewall（WAF） の料金体系

* 外部インターネット接続できるリソース・サービスにアタッチ（他クラウド、オンプレミスにも対応）
* Professional、Business、Enterpriseのパッケージプランを提供
* 1ヵ月、3ヵ月、6ヵ月、1年間単位のサブスクリプション
* 購入時、ドメイン数や専用IP、負荷分散、LogService連携、データ可視化などのオプションあり

||Professional|Business|Enterprise|
|--|--|--|--|
|通信帯域|50Mbps|100Mbps|200Mbps|
|処理能力|2000qps|5000qps|10000qps以上|
|Webアプリケーション保護|〇|〇|〇|
|ホワイトリスト|〇|〇|〇|
|ブラックリスト|〇|〇|〇|
|データマスキング||〇|〇|
|カスタムHTTPフラッド||〇|〇|
|カスタムルール|||〇|
|地域IPブロック|||〇|

### Web Application Firewall（WAF）課金の例(サブスクリプション) 
> - 課金方法：サブスクリプション
> - リージョン：グローバル
> - バージョン：プロフェッショナル
> - 追加のドメインパッケージ: 2
> - 専用 IP パッケージ : 2
> - 追加の帯域幅パッケージ : 200Mbps、
> - インテリジェントな負荷分散 : 対応
> - Log Service : True
> - Log Storage保存期間 : 180日
> - ログストレージ容量 : 3TB
> - Bot Manager : はい
> - モバイルアプリ保護 : はい
> - データ可視化: シングルスクリーン
> - 期間：一ヶ月

Web Application Firewall（WAF） 一ヶ月分の料金：    
月額 5,866 USD/月

>　https://www.alibabacloud.com/cloud-tech/doc-detail/58487.htm

---

## MaxCompute
### MaxCompute の料金構成

![MaxCompute 01](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/11_MaxCompute_01.png "MaxCompute 01")

* OSSを外部テーブルとして処理する場合、ストレージ層の料金は不要です。
* MaxComputeへのデータインポートは無料です。
* MaxComputeストレージからのダウンロード料金はUS0.1166 ドル/GB

> https://www.alibabacloud.com/cloud-tech/doc-detail/53056.html

### コンピューティング層の料金について

![MaxCompute 02](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/11_MaxCompute_02.png "MaxCompute 02")

MaxComputeおよびMaxCompute外部テーブル使用時は、SQLステートメントがスキャンするデータの実際のサイズからスキャンし、そのデータ量で料金を算出します。    
※SQLでフィールド指定およびパーティションを指定するため、必要最小限のデータ量でスキャンされます。    

MapReduceジョブおよびSpark on MaxComputeは請求金額の総計と一度のジョブごとに時間単位の実行時間、CPUコア数、メモリサイズを指定することで、処理に必要な料金を算出します。     


事前にサブスクリプションを申し込んだ場合、クエリら入力データのサイズごとにCU数（計算単位）で割り当てながら計算を実施します。SQLクエリ投与頻度が多い場合は事前にSubscriptionでCU数をリザーブドすることを推奨します。また、MaxCompute CU Managementでリソース監視および管理することができます。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/139070.html

### ストレージ層の料金について
MaxComputeはデータを５倍圧縮しながらストレージ層へ格納するため、実際はもっと安く済む場合があります。

![MaxCompute 03](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/11_MaxCompute_03.png "MaxCompute 03")


200TBのデータを保持する場合:    
（10240-1）GB x USD 0.0011GB/day + (102400-10240) GB x USD 0.0009 GB/day + (10240 x 20-102400)GB x USD 0.0006 GB/day = 1日あたり 155.64USD      


1PBのデータを保持する場合:    
（10240-1）GB x USD 0.0011GB/day + (102400-10240) GB x USD 0.0009 GB/day + (10240 x 10240 -102400)GB x USD 0.0006 GB/day = 1日あたり 661.9125 USD     

![MaxCompute 01](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/11_MaxCompute_04.png "MaxCompute 04")


* インタネットまたはクロスリージョンでのダウンロードはデータサイズによって課金されます。    
* ダウンロードのデータサイズは一回ダウンロード請求のHTTPBodyのサイズを指します。     
   HTTPBodyはprotobufferコードで使用されるため、実際のデータサイズより小さいです。ただしMaxComputeに圧縮で保存されたデータサイズより大きいです。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/139071.html

---

## NAT Gateway
### NAT Gateway の料金体系
データ転送ごとの支払いをサポート    

![NAT 01](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/10_NAT_01.png "NAT 01")

### NAT Gateway の料金構成

|料金構成|単価|説明|
|--|--|--|
|インスタンス料金|例:東京リージョンインスタンス（単価:$ 0.043 USD/時間）|中国国内のリージョンとその他リージョンの単価が異なります。|
|CapacityUnit料金|$ 0.043 USD/個/時間|CU料金はmax{該当時間のの接続数CU，該当時間の並行接続数CU，該当時間のトラフィックCU} × CU 単価|

NAT Gateway 1時間分の料金：    
インスタンス費用（単価$ 0.043/時間）＋ CU費用（単価$ 0.043/時間（変動あり））

### NAT Gateway CU指数より高いパターンの料金について 

|CU計算項目|実際の利用量|CU指数|CU数(実際の利用量/CU指数)|CU費(CU数×CU単価)|CU費用|備考|
|--|--|--|--|--|--|--|
|毎秒の新規コネクション数|1100|1000|1100/1000|(1100/1000*0.043)|(1100/1000*0.043)=0.0473|
|毎分の同時接続数|20000|10000|20000/10000|(20000/10000*0.043)|(20000/10000*0.043)=0.0473|
|1時間のトラフィック量|3.5GB|1GB|3.5/1|(3.5/1*0.043)|(3.5/1*0.043)=0.1505| 一番高い価格0.1505がCU費用として計算される|

NAT Gateway 1時間分の料金 = ( インスタンス費用 ＋ CU費用 ) = 0.043 + 0.1505 =$ 0.1935 USD/時間      

NAT Gateway 1ヶ月分の料金：    
（0.043+0.1505）X 24 X 30 =$ 139.32 USD/月     

### NAT Gateway CU指数より安いパターンの料金について

|CU計算項目|実際の利用量|CU指数|CU数(実際の利用量/CU指数)|CU費(CU数×CU単価)|CU費用|備考|
|--|--|--|--|--|--|--|
|毎秒の新規コネクション数|500|1000|500/1000|500/1000*0.043|(500/1000*0.043)=0.0215|
|毎分の同時接続数|100|10000|100/10000|100/10000*0.043|(100/10000*0.043)=0.00043|
|1時間のトラフィック量|0.056GB|1GB|0.056/1|0.056/1*0.043|0.056/1*0.043=0.002408| 一番高い価格0.0215がCU費用として計算される|

NAT Gateway 1時間分の料金 = ( インスタンス費用 ＋ CU費用 ) =  0.043 + 0.0215 = $ 0.0645 USD/時間      
NAT Gateway 1ヶ月分の料金：    
（0.043+0.0215）X 24 X 30 =$ 46.44 USD/月      

---

## Container Service for Kubernetes (ACK)
### Container Service for Kubernetes (ACK) の料金体系
![ACK 01](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/11_ACK_01.png "ACK 01")

### Kubernetesクラスタータイプ 
![ACK 01](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/11_ACK_02.png "ACK 02") 

### Managed Kubernetes Cluster Proバージョン
 ![ACK 01](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/11_ACK_03.png "ACK 03")

### Container Service for Kubernetes (ACK) 課金の例（PAYG・従量課金）

> - リージョン：日本
> - バージョン：ACKPro
> - ACKProクラスター管理費：単価0.09USD/時間
> - ECSワーカー:単価 0.26USD/時間 ２台
> - SLB-APIServer ：slb.s2.small 単価 0.06 USD/時間 トラフィック 無料
> - SLB-Ingress： slb.s2.small 単価 0.06 USD/時間 
> - 一ヶ月でトラフィック100 GB（単価:0.087 USD /GB）
> - CloudMonitor：無料
> - Prometheus：ベーシックバージョン 無料
> - NAS： 単価 0.06USD /GB/月 例：100GB使用 容量型無料額5GB 
> - ROS：無料
> - AutoScaling：無料
> - ENI：無料
> - EIP：単価0.005 USD/時間 ２個
> - LogService：
> - ストレージ 0.002875 USD /GB*日 例：1日で100GB  
> - 書込読取トラフィック 0.045 USD/GB 例：1日で10GB 
 
 

Container Service for Kubernetes (ACK) 費用 = クラスター管理費用 + クラウドプロダクト費用（ECS*2 + EIP*2 + LogService + SLB-API Server + SLB-Ingress + NAS）    

計算例：    
Container Service for Kubernetes (ACK) 一ヶ月分の料金：     
（0.09 USD/時間+2ｘ0.26 USD/時間+0.06USD/時間 +0.06 USD/時間 ）ｘ24時間ｘ30日 + 100 GBｘ0.087 USD /GB+ （100GB-5GB）ｘ0.06USD /GB/月 + 100GB/日ｘ0.002875 USD /GB*日+ 10GB /日ｘ0.045 USD/GB = 540.74 USD/月    

※プロダクト費用は各プロジェクトの料金をご参照ください    
※クラスター管理費はACKのバージョンによっては無料です     

> https://www.alibabacloud.com/cloud-tech/doc-detail/86759.html

---

## Global Accelerator

### Global Accelerator支払タイプ
![GA 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/17_GA_01.png "GA 01")

### Global Accelerator の料金体系

![GA 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/17_GA_02.png "GA 02")

![GA 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/17_GA_03.png "GA 03")

|アクセスユーザ加速リージョン|サーバー設置リージョン|インスタンススペック費用（A）|ベーシック加速帯域幅費用（B）|クロスリージョン加速帯域幅費用（C）|課金方法|料金例|
|--------|:-----|:----|:----:|:----:|:----:|:----:|
|中国|中国|〇|〇|×|GA費用＝A＋B|・アクセスユーザー:上海、深圳 ・サーバー設置リージョン:北京・インスタンス：Small（II）USD 315/月・ベーシック加速帯域幅：スタンダード10Mb，USD 300/月 GA費用: USD 315/月 + USD 300/月=615 USD/月|
|中国以外|中国以外|〇|〇|×|GA費用＝A＋B|・アクセスユーザー:日本、シンガポール  ・サーバー設置リージョン:米国  ・インスタンス：Small（II） USD 315/月  ・ベーシック加速帯域幅：スタンダード10Mb，USD 300/月  GA費用: USD 315/月 + USD 300/月=615 USD/月|
|中国以外|中国|〇|〇|〇|GA費用＝A＋B＋C|・アクセスユーザー:日本、シンガポール・サーバー設置リージョン:上海  ・インスタンス：Small（II） USD 315/月  ・ベーシック加速帯域幅：スタンダード10Mb，USD 300/月   ・クロスリージョン加速帯域幅：USD 750 /月  GA費用: USD 315/月 + USD 300/月 + USD 750 /月=1,365 USD/月|
|中国|中国以外|〇|〇|〇|GA費用＝A＋B＋C|・アクセスユーザー:上海、深圳  ・サーバー設置リージョン:日本  ・インスタンス：Small（II） 315 USD/月  ・ベーシック加速帯域幅：スタンダード10Mb，300 USD /月  ・クロスリージョン加速帯域幅：USD 750 /月  GA費用: USD 315/月 + USD 300/月 + USD 750 /月=1,365 USD/月|


> https://www.alibabacloud.com/product/ga

---

##  CDN (Content Delivery Network)
###  CDN (Content Delivery Network) の料金体系

![CDN 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/18_CDN_01.png "CDN 01")

###  CDN (Content Delivery Network) 構成
![CDN 02 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/18_CDN_02.png "CDN 02")

###  CDN (Content Delivery Network) 課金の例（ 一ヶ月で10TBのトラフィックを使用する場合）
> - 課金方法：トラフィック
> - リージョン：日本
> - トラフィック単価：0.081USD/GB
> - 静的HTTPS請求数：1,000万回 単価： 0.008 USD/万回
> - 静的QUIC請求数：1,000万回 単価： 0.008 USD/万回
> - 動的QUIC請求数：100万回 単価： 0.024 USD/万回
> - ログ数:０件
> - リソースパッケージ：なし

CDN (Content Delivery Network)  一ヶ月分の料金：  
10 x 1024 GB x 0.081USD/GB +1000万回x 0.008 USD/万回 + 1000万回x 0.008 SD/万回 + 100万回x 0.024 USD/万回 = 847.84 USD/月    

> https://www.alibabacloud.com/product/cdn/pricing

---

## ImageSearch
### ImageSearch支払タイプ
 ![ImageSearch 01 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/22_ImageSearch_01.png "ImageSearch 01")

### ImageSearch の料金体系

 ![ImageSearch 02 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/22_ImageSearch_02.png "ImageSearch 02")

### 課金の例（サブスクリプション）
> - 課金方法：サブスクリプション
> - リージョン：全リージョン
> - 最大画像容量：500万枚
> - QPS:5

ImageSearch費用：月額 1,600 USD/月

> https://www.alibabacloud.com/cloud-tech/doc-detail/85153.html



