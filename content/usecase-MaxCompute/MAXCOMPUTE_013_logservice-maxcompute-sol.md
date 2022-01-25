---
title: "LogServiceから連携する方法"
metaTitle: "LogServiceからMaxComputeへ連携する方法"
metaDescription: "LogServiceからMaxComputeへ連携する方法"
date: "2021-03-18"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613699521900/20210312004454.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## LogServiceからMaxComputeへ連携する方法

本記事では、LogServiceからMaxComputeへ連携する方法について説明します。    

# 前書き

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute

    
今回はAlibaba Cloud LogServiceからMaxComputeへデータを連携します（データベース移行）。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312004454.png "img")


---
---

# 共通作業（MaxCompute全体で共通事項）

## RAM ユーザー作成＆権限付与
もしMaxComputeを操作するユーザがRAMユーザーの場合は以下を実施してください。    

RAMより対象のユーザーを選定します。ユーザーが無い場合は新規作成します。 このときにAccessKey IDとAccessKey Secretをメモとして残してください。AccessKey IDとAccessKey SecretはDataWorks DataIntegrationの処理に必要となります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210305025953.png "img")

対象のユーザーには権限ロールとしてAliyunDataWorksFullAccessをアタッチします。 これはDataWorksを操作するためのFull権限です。    
DataWorks側にてユーザーごとに読み取り専用や一部プロジェクト・テーブルなどのきめ細かい権限付与ができますが、ここでは割愛します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210305025809.png "img")

今回は、LogServiceからMaxComputeへ連携する方法なので、<b>AliyunOSSFullAccess</b> および <b>AliyunLogFullAccess</b> もアタッチします。   


## Workspace作成

MaxComputeを操作するためにはワークスペースおよびプロジェクトが必要なので新たに作成します。DataWorksコンソールから 「Create Project」を選択し、起動します。    
Modeは「Basic Mode（基本モード）」「と「Standard Mode（標準モード）」の２種類があります。ここは「Basic Mode（基本モード）」として選定します。   
  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210304212211.png "img")

続けて、MaxCompute を選定します。料金は初めて操作するなら Pay-As-You-Go（使った分だけ課金） が良いと思います。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210304220348.png "img")

MaxComputeに関する必要な情報を設定し、Workspaceを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210304220459.png "img")

##  同期タスクをサブミットする方法（基本モード（basic mode））
作業の途中で 同期タスクをサブミットする旨のアクションが発生しますが、こちらの手順を参考にいただければ幸いです。　　　　   

DataWorks DataStdioで、操作が終わったら [Commit to Production Environment] をクリックし開発環境から本番環境へ直接コミットします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210311222112.png "img")


##  同期タスクをサブミットする方法（標準モード（standard mode））

DataWorks DataStdioの右側にあるProperitiesをクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210311221338.png "img")

プロパティRerunを設定して、[Use Root Node]ボタンをクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210311221142.png "img")

開発環境にサブミットします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210311221120.png "img")

あとは開発環境から本番環境にデプロイします。    


## Maxcomputeのデータをクエリする方法
DataWorks DataStdioのAd-Hoc Query画面に入って、[ODPS SQL]のノードを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210311222431.png "img")

SQLクエリ文を作成したら、上書き保存してから、Run SQLボタンを押します。   
その後、SQLクエリの実行コストらお金が出ますが、ここも考慮のうえ、Run、で実行します。   
実行結果としてレコード数が無事表示されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210311222939.png "img")


---
---

# （事前準備）LogServiceの準備
まずはOSSコンソールに入って、特定のbucketのもと、OSSのリアルタイムログクエリ機能をアクティブします。      
これはOSSアクセスログを生成するものです。      

> https://www.alibabacloud.com/cloud-tech/doc-detail/99349.htm


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312005155.png "img")

これでリアルタイムログクエリ機能が有効になりました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312005209.png "img")

次はLogServiceコンソールに入ります。OSSログのプロダクト名をメモします。        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312005231.png "img")

LogServiceにデータを生成する目的で、OSS Bucketにイメージファイルをアップロードします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312005539.png "img")

イメージファイルのURLをコピーします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312005624.png "img")

コピーしたURLをアクセスすることで、LogServiceにてOSSログをリアルタイムで生成してくれます。    
これでデータ生成の準備は完了です。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312005729.png "img")

今度はDataWorks側での作業に移ります。   
LogServiceをDataWorks DataIntegrationデータソースに追加します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312005918.png "img")

データソースとしてLogServiceの各種情報を入力し、接続テストを実行します。    
LogServiceのEndpoint は 日本リージョンなら`ap-northeast-1.log.aliyuncs.com` です。   

> https://www.alibabacloud.com/cloud-tech/doc-detail/29008.htm

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010332.png "img")

接続テストで問題なければ、Completeボタンをクリックすることで、LogServiceのデータソースが追加されます。   
これでLogService側の設定は完了です。 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010357.png "img")


この準備が終わり次第、データを移行してみます。データ移行にはGUIモードとスクリプトモードの２つのパターンがあります。まずはGUIモードで移行します。    
スクリプトモードはtemplateな扱いができるため、後日この作業の自動化したい場合、活用できればと思います。   

# LogServiceをMaxComputeへ移行(GUIモード)

## STEP1: workflow作成
DataWorks DataIntegrationから、新規オフライン同期タスクをクリックし、DataStdio画面へ遷移します。     
DataStdio画面にて、「Create Node」らダイアログが表示されますが、ここではクローズします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210311231235.png "img")

DataStdio画面にてWorkflowを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010645.png "img")

## STEP2: DI 同期タスクを作成
同期タスクを作成します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010711.png "img")

ソースをLogHubに選択して、Logstoreを選択します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010758.png "img")

URLをアクセスした時間を含む時間帯を入力して、Previewボタンをクリックします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010842.png "img")


ターゲットをODPSに選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010902.png "img")

Maxcomputeテーブルを選択します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010920.png "img")

すると、自動でマッピングが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010956.png "img")


## STEP3: DI 同期タスクを実行
変数を時間帯に入力して、タスクを実行します。     
実行時は、引数（Arguments）として、URLをアクセスした時間を含む時間帯を入力します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312011121.png "img")

タスクが成功すると、Logが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312011155.png "img")


あとはAd-Hoc クエリで確認します（手順は上記の共通手順にて記載しています）    
```
select * from nelly01_dev.log_to_odps where ds='20200907';
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312011249.png "img")

これにより、GUIモードでLogServiceのデータをMaxCompute Tableへ取り込んだことが確認できました。     


# MySQLをMaxComputeへ移行(スクリプトモード)

## STEP1: workflow作成
DataWorks DataIntegrationから、新規オフライン同期タスクをクリックし、DataStdio画面へ遷移します。     
DataStdio画面にて、「Create Node」らダイアログが表示されますが、ここではクローズします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210311231235.png "img")

DataStdio画面にてWorkflowを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010645.png "img")

## STEP2: DI 同期タスクを作成
同期タスクを作成します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010711.png "img")

ソースをLogHubに選択して、Logstoreを選択します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010758.png "img")

URLをアクセスした時間を含む時間帯を入力して、Previewボタンをクリックします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010842.png "img")


ターゲットをODPSに選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010902.png "img")

Maxcomputeテーブルを選択します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010920.png "img")

すると、自動でマッピングが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312010956.png "img")


## STEP3: スクリプトモードにスイッチ
Switch to Code Editorボタンをクリックし、スクリプトモードにスイッチします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312011413.png "img")

するとスクリプトが表示されます。これは先述、GUIモードで選択した設定が自動でスクリプトに反映されます。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312011443.png "img")

## STEP4: DI 同期タスクを実行

スクリプト（タスク）を実行します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312011503.png "img")

スクリプト（タスク）が成功すると、タスクとしてLogが表示されます。      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312011521.png "img")


あとはAd-Hoc クエリで確認します（手順は上記の共通手順にて記載しています）    
```
select * from nelly01_dev.log_to_odps where ds='20200907';
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312011249.png "img")


---


# 最後に
本記事では、LogService からMaxComputeへ連携する方法を簡単に説明しました。     
LogServiceからMaxComputeへリアルタイムDWHとして構築したい場合、参考にできれば幸いです。   



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


