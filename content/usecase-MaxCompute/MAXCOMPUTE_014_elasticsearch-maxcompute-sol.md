---
title: "Elasticsearchから連携する方法"
metaTitle: "ElasticsearchからMaxComputeへ連携する方法"
metaDescription: "ElasticsearchからMaxComputeへ連携する方法"
date: "2021-03-22"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613699523700/20210311234150.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## ElasticsearchからMaxComputeへ連携する方法


本記事では、Elasticsearch からMaxComputeへ連携する方法について説明します。

# 前書き     

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute

    
今回はMaxComputeからAlibaba Cloud Elasticsearchへデータを連携します。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311234150.png "img")


---
---

# 共通作業（MaxCompute全体で共通事項）

## RAM ユーザー作成＆権限付与
もしMaxComputeを操作するユーザがRAMユーザーの場合は以下を実施してください。    

RAMより対象のユーザーを選定します。ユーザーが無い場合は新規作成します。 このときにAccessKey IDとAccessKey Secretをメモとして残してください。AccessKey IDとAccessKey SecretはDataWorks DataIntegrationの処理に必要となります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210305025953.png "img")

対象のユーザーには権限ロールとしてAliyunDataWorksFullAccessをアタッチします。 これはDataWorksを操作するためのFull権限です。    
DataWorks側にてユーザーごとに読み取り専用や一部プロジェクト・テーブルなどのきめ細かい権限付与ができますが、ここでは割愛します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210305025809.png "img")

今回は、RDSからMaxComputeへ連携する方法なので、<b>AliyunRDSFullAccess</b>もアタッチします。   

## Workspace作成

MaxComputeを操作するためにはワークスペースおよびプロジェクトが必要なので新たに作成します。DataWorksコンソールから 「Create Project」を選択し、起動します。    
Modeは「Basic Mode（基本モード）」「と「Standard Mode（標準モード）」の２種類があります。ここは「Basic Mode（基本モード）」として選定します。   


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210304212211.png "img")

続けて、MaxCompute を選定します。料金は初めて操作するなら Pay-As-You-Go（使った分だけ課金） が良いと思います。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210304220348.png "img")

MaxComputeに関する必要な情報を設定し、Workspaceを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210304220459.png "img")

##  同期タスクをサブミットする方法（基本モード（basic mode））
作業の途中で 同期タスクをサブミットする旨のアクションが発生しますが、こちらの手順を参考にいただければ幸いです。　　　　   

DataWorks DataStdioで、操作が終わったら [Commit to Production Environment] をクリックし開発環境から本番環境へ直接コミットします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311222112.png "img")


##  同期タスクをサブミットする方法（標準モード（standard mode））

DataWorks DataStdioの右側にあるProperitiesをクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311221338.png "img")

プロパティRerunを設定して、[Use Root Node]ボタンをクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311221142.png "img")

開発環境にサブミットします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311221120.png "img")

あとは開発環境から本番環境にデプロイします。    
   

## Maxcomputeのデータをクエリする方法
DataWorks DataStdioのAd-Hoc Query画面に入って、[ODPS SQL]のノードを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311222431.png "img")

SQLクエリ文を作成したら、上書き保存してから、Run SQLボタンを押します。   
その後、SQLクエリの実行コストらお金が出ますが、ここも考慮のうえ、Run、で実行します。   
実行結果としてレコード数が無事表示されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311222939.png "img")


---
---


# （事前準備）MaxCompute Tableの準備

DataWorks DataIntegrationから、新規オフライン同期タスクをクリックし、DataStdio画面へ遷移します。     
DataStdio画面にて、「Create Node」らダイアログが表示されますが、ここではクローズします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311231235.png "img")

Workspace Tables画面に入って、テーブルを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311235320.png "img")

DDL Statementボタンをクリックして、MySQL Tableに対応するDDL Statementを入力します。    

```
CREATE TABLE IF NOT EXISTS odps_to_es (
    `create_time` string COMMENT '',
    `category` string COMMENT  '',
    `brand` string COMMENT  '',
    `buyer_id` string COMMENT  '',
    `trans_num` bigint COMMENT  '',
    `trans_amount` double COMMENT  '',
    `click_cnt` bigint COMMENT  ''
)
PARTITIONED BY (pt bigint);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311235336.png "img")


Display Nameを入力し、テーブルをコミットします。その後はテーブルが作成されてることが確認できます。    
※標準モードプロジェクトの場合は本番環境にもコミットする必要があります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311235509.png "img")

このテーブルはまだ何も入っていない状態なので、データを追加します。インポートボタンをクリックします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311235610.png "img")

パーティションが存在するかどうかを確認します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311235638.png "img")

txtファイルをアップロードします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311235709.png "img")

データのインポートが無事成功したら、Ad-Hocクエリなり、DataMapなりでレコードが確認できます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311235737.png "img")

これでMaxCompute側の設定は完了です。次はElasticsearchの準備を進めます。   


# （事前準備）Elasticsearchの準備
Elasticsearchコンソールに入って、クラスターを作成してから、詳細画面に入ります。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311235912.png "img")

Auto Indexingを有効に設定します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000016.png "img")


Auto Indexingが有効になると、このようなステータスになります。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000044.png "img")

Public Networksを有効にして、EndPointをメモします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000150.png "img")

Public Networksのホワイトリストを変更します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000228.png "img")

DataworksのデフォルトリソースグループのIPをPublic Networksアクセスのホワイトリストに追加します。     
東京リジョンなら以下の通りです。    
```
100.105.55.0/24,11.192.147.0/24,11.192.148.0/24,11.192.149.0/24,100.64.0.0/10,47.91.12.0/24,47.91.13.0/24,47.91.9.0/24,11.199.250.0/24,47.91.27.0/24,11.59.59.0/24,47.245.51.128/26,47.245.51.192/26,47.91.0.128/26,47.91.0.192/26
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000245.png "img")

IPがホワイトリストに追加されたらOKです。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000355.png "img")

Kibanaのコンソールに入ります。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000422.png "img")

Kibanaにログインし、DevToolからIndexを作成します。    
```
PUT odps_index?include_type_name=false
{
  "mappings": {
    "properties": { 
      "category": {
        "type": "text"
      },
      "brand": {
        "type": "text"
      },
      "buyer_id": {
        "type": "text"
      },
      "trans_num": {
        "type": "integer"
      },
      "trans_amount": {
        "type": "double"
      },
      "click_cnt": {
        "type": "integer"
      }
    }
  }
}
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000529.png "img")

DataWorks DataIntegrationに切り替えて、、データソースにElasticsearchを追加します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000607.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000624.png "img")

データソースとしてElasticsearchのPublic Endpoint、ユーザー名、パスワードなどの情報を入力し、接続テストを実行します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000643.png "img")


接続テストで問題なければ、Completeボタンをクリックすることで、Elasticsearchのデータソースが追加されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312000801.png "img")

この準備が終わり次第、データを同期してみます。データ同期にはGUIモードとスクリプトモードの２つのパターンがあります。まずはGUIモードで同期します。    
スクリプトモードはtemplateな扱いができるため、後日この作業の自動化したい場合、活用できればと思います。   


# MaxCompute TableをElasticsearchへ移行(GUIモード)

## STEP1: workflow作成
DataWorks DataIntegrationから、新規オフライン同期タスクをクリックし、DataStdio画面へ遷移します。     
DataStdio画面にて、「Create Node」らダイアログが表示されますが、ここではクローズします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311231235.png "img")

DataStdio画面にてWorkflowを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312001831.png "img")

## STEP2: DI 同期タスクを作成
同期タスクを作成します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312001916.png "img")

ソースをODPSに選択して、テーブルを選択します。そのあとはPreviewボタンをクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002001.png "img")

Previewでデータが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002013.png "img")

ターゲットをElasticsearchに選択します。    
Elasticsearchの場合、IndexとIndex Typeが必須なので入力し、Advanced Settingsをクリックします。       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002150.png "img")

Advanced Settings画面にて、Auto Mappingを有効に設定します。 (Elasticsearchがver7.xの場合は必要です)     
設定後はTarget Field ボタンをクリックすることで編集します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002319.png "img")

odpsのデータに対応するフィールドを入力します。    
```
{"name":"create_time","type":“id"}
{"name": "category","type": "text"}
{"name": "brand","type": "text"}
{"name": "buyer_id","type": "text"}
{"name": "trans_num","type": "integer"}
{"name": "trans_amount","type": "double"}
{"name": "click_cnt","type": "integer"}
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002412.png "img")

## STEP3: DI 同期タスクを実行

タスクを保存して、実行します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002440.png "img")

タスクが成功すると、Logが表示されます。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002453.png "img")

今度はElasticsearch - kibana画面に遷移し、データが届いてるかを確認します。    
KibanaコンソールのDevToolより、データを検索します。    

```
POST /odps_index/_search?pretty
{
    "query": {  "match_all": {} }
}
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002653.png "img")

その結果、GUIモードでMaxComputeのデータをElasticsearchへ同期したことが確認できました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002704.png "img")


# MaxCompute TableをElasticsearchへ移行(スクリプトモード)

## STEP1: workflow作成
DataWorks DataIntegrationから、新規オフライン同期タスクをクリックし、DataStdio画面へ遷移します。     
DataStdio画面にて、「Create Node」らダイアログが表示されますが、ここではクローズします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311231235.png "img")

DataStdio画面にてWorkflowを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312001831.png "img")

## STEP2: DI 同期タスクを作成
同期タスクを作成します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312001916.png "img")

ソースをODPSに選択して、テーブルを選択します。そのあとはPreviewボタンをクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002001.png "img")

Previewでデータが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002013.png "img")

ターゲットをElasticsearchに選択します。    
Elasticsearchの場合、IndexとIndex Typeが必須なので入力し、Advanced Settingsをクリックします。       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002150.png "img")

Advanced Settings画面にて、Auto Mappingを有効に設定します。 (Elasticsearchがver7.xの場合は必要です)     
設定後はTarget Field ボタンをクリックすることで編集します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002319.png "img")

odpsのデータに対応するフィールドを入力します。    
```
{"name":"create_time","type":“id"}
{"name": "category","type": "text"}
{"name": "brand","type": "text"}
{"name": "buyer_id","type": "text"}
{"name": "trans_num","type": "integer"}
{"name": "trans_amount","type": "double"}
{"name": "click_cnt","type": "integer"}
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312002412.png "img")

## STEP3: スクリプトモードにスイッチ
Switch to Code Editorボタンをクリックし、スクリプトモードにスイッチします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312003409.png "img")

するとスクリプトが表示されます。これは先述、GUIモードで選択した設定が自動でスクリプトに反映されます。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312003423.png "img")


## STEP4: DI 同期タスクを実行
スクリプト（タスク）を実行します。 スクリプト（タスク）が成功すると、タスクとしてLogが表示されます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210312003457.png "img")

あとは上記通り、Elasticsearch - kibanaでcheck、可視化できます。    

---

# 最後に
本記事では、MaxComputeからElasticsearchへ連携する方法を簡単に説明しました。     
MaxComputeのデータをElasticsearch - kibanaダッシュボードでリアルタイム可視化したい場合、参考に頂ければ幸いです。   


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


