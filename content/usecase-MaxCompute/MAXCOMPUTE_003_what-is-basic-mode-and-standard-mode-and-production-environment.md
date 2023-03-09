---
title: "基本/標準モード、開発/本番環境"
metaTitle: "DataWorksにおける基本モードと標準モード、開発環境と本番環境について"
metaDescription: "DataWorksにおける基本モードと標準モード、開発環境と本番環境について"
date: "2021-03-05"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613700889100/20210310114634.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## DataWorksにおける基本モードと標準モード、開発環境と本番環境について

本記事では、DataWorksにおける基本モードと標準モード、開発環境と本番環境について説明します。

# 前書き     

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute



---

# 基本モード（ basic mode）と標準モード（standard mode）の違い
DataWorksは様々なセキュリティ要件および操作制限などの制御要件を持ちながらデータ操作を行うために、『基本モード（ basic mode）』と『標準モード（standard mode）』があります。    
基本モード（ basic mode）は、DataWorks WorkspaceがMaxComputeプロジェクトに直接対応することを意味します。1、2人など小人数規模での作業に適しています。 後述する『開発環境（development environment）』および『本番環境（production environment）』はセットアップできず、シンプルなデータ開発しか実行できません。    
標準モード（standard mode）は、1つのDataWorksスペースが、２つのMaxComputeプロジェクトに対応することを意味します。コードなど開発や編集は全て開発環境（development environment）のみ実施となり、本番環境（production environment）でコードや開発・編集をすることはできません。これは大規模ユーザーでの開発もしくはシステムが大規模となるシナリオにて、デグレを抑えつつプロジェクトの管理者または運用、保守の権限を持つメンバーによって承認しながらプロセスを進めることが出来ます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310114634.png "img")

> https://www.alibabacloud.com/cloud-tech/doc-detail/85772.htm


# 開発環境と本番環境

---


# 基本モード（basic mode）のプロジェクト作成を試してみる
閑話休題、実際にコンソール上で操作し、挙動を確認してみます。    

## 基本モード（basic mode）
基本モード（basic mode）は上記説明通り、DataWorks WorkSpaceが（開発環境と本番環境に分けず）一つのコンピューティングエンジンに対応することを意味します。コンピューティングエンジンはここではMaxComputeを使って説明していますが、DataWorksはMaxComputeのほか、E-MapReduce、Hologresなどのプロダクトサービスにも対応しており、基本モードであればデータベースデータベース、インスタンスなどに直接対応となります。     

長所：    
・ 開発者はすぐに本番環境へ反映するため、クイックスタートとしても使いやすい    
・ タスクをサブミット後、デプロイする必要はなく、直接スケジュールシステムに入れられ、定期的実行されるため、データがスムーズに生成することができます     

短所：     
・開発者はいつでもタスクを直接、承認なしでスケジュールシステムにサブミットできるため、（デグレやテーブル構成変更などの考慮を含め）本番環境にも影響を与えやすい     
・ 開発者はMaxComputeに対する全ての操作権限を持つため、データセキュリティにもリスクを与えやすい。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310123649.png "img")

## 基本モード（basic mode）プロジェクトの作成方法
DataWorks WorkSpaceを作成する時点で選定できます。   
ちなみにWorkSpace作成後、基本モードを標準モードへ切り替えすることは出来ないので、注意が必要です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310123912.png "img")

## 基本モード（basic mode）の場合、MaxCompute操作ユーザー（visitor identity）の設定について
DataWorks Workspace作成後、MaxComputeを操作するための操作ユーザーおよびアクセス許可を定義づける必要があります。    
> https://www.alibabacloud.com/cloud-tech/doc-detail/74277.html    

DataWorks のメンバーの権限ロールの種類としては「Project Owner」、「Workspace Manager」、「Development」、「O&M」、「Deploy」、「Visitor」があります。    
MaxComputeのメンバーの権限ロールの種類としては「Project Owner」「Role_Project_Admin」「Role_Project_Dev」「Role_Project_Pe」「Role_Project_Deploy」「Role_Project_Guest」「Role_Project_Security」があります。     

※メンバーの役割についてはこちらが詳しいです。   
> https://www.alibabacloud.com/cloud-tech/doc-detail/105012.htm    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310125151.png "img")

基本モードの場合、MaxComputeのメンバーの権限ロールは、DataWorks Workspaceの「Account for Accessing MaxCompute」の設定で、「Alibaba Cloud primary account」か「Node Owner」を選定するかで扱うロールの範囲等が決まります。         
注意として、標準モードだと別のロール範囲での扱いとなります。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310130404.png "img")

### 「Account for Accessing MaxCompute」の設定でAlibaba Cloud primary accountの場合

・ DataWorksは様々な権限ロールを持つユーザーからMaxComputeのタスクをサブミットしても、MaxComputeではOwnerのロールでタスクを実行されます    
・ RAMユーザーはMaxComputeに対し、操作やタスク実行等の権限を持ちません    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310130139.png "img")


### 「Account for Accessing MaxCompute」の設定でNode Ownerの場合

・ DataWorksでMaxComputeのタスクをサブミットしたロールに対応するロールでそれぞれタスクが実行されます    
・ RAMユーザーはMaxComputeで対応するロールが付与されます    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310130718.png "img")


## MaxCompute操作ユーザー（visitor identity）の設定方法および変更方法    

MaxCompute操作ユーザー（visitor identity）の設定方法は上述通り、WorkSpace作成時にて設定します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310123912.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310130404.png "img")

一方、WorkSpace作成後、操作ユーザー（visitor identity）を変更したい場合は、以下の方法で設定します。    
まずはDataWorks WorkspaceのSetthingを選定します。そこから以下図の通りに   MaxCompute visitor identityを変更すれば良いです。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310131409.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310131601.png "img")


---

# 標準モード（standard mode）のプロジェクト作成を試してみる
今度は標準モード（standard mode）でプロジェクトを作成し、確認してみます。    

## 標準モード（standard mode）とは
標準モード（standard mode）は上記説明通り、一つのDataworks WorkSpaceが開発環境と本番環境の２つのコンピューティングエンジンに対応することを意味します。　　　　

基本モードとの違い：    
・すべてのコードは開発環境のみ編集となり、本番環境でコード編集はできません     
・タスクをサブミット後、開発環境のスケジュールシステムに入れることが出来ますが、すぐには実行することができません。定期的にタスクを実行させたい場合は、本番環境にデプロイする必要があります    
・タスクをデプロイする前に、プロジェクトの管理者もしくは監視者の権限を持つユーザーからの承認が必要です     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310123514.png "img")

## 標準モード（standard mode）プロジェクトの作成方法
上記、基本モード（basic mode）と同じよにDataWorks WorkSpaceを作成する時点で選定できます。   
ちなみにWorkSpace作成後、標準モードを基本モードへ切り替えすることは出来ないので、注意が必要です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310131838.png "img")

違いとして、作成を進めると、権限ロールなどの設定が問われます。ここもProjectなど状況に応じて対応してください。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310131948.png "img")

## 標準モード（standard mode）の場合、MaxCompute操作ユーザー（visitor identity）の設定について
先述通り、DataWorks Workspace作成後、MaxComputeを操作するための操作ユーザーおよびアクセス許可を定義づける必要があります。    
[https://www.alibabacloud.com/cloud-tech/doc-detail/74277.html:embed:cite]

DataWorks のメンバーの権限ロールの種類としては「Project Owner」、「Workspace Manager」、「Development」、「O&M」、「Deploy」、「Visitor」があります。    
MaxComputeのメンバーの権限ロールの種類としては「Project Owner」「Role_Project_Admin」「Role_Project_Dev」「Role_Project_Pe」「Role_Project_Deploy」「Role_Project_Guest」「Role_Project_Security」があります。     

標準モードの場合、MaxCompute操作ユーザー（visitor identity）は基本的に以下の設定で定義づけられています（カスタマイズ不可）   
MaxCompute開発環境の操作ユーザー（visitor identity） ：Task owner
MaxCompute本番環境の操作ユーザー（visitor identity） ：Alibaba Cloud primary account 
(DataWorks WorkSpaceの作成者はRAMユーザーの場合はAlibaba Cloud sub-accountとなります)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310132520.png "img")


## 開発環境/本番環境にデータソースを追加する方法

DataIntegration画面から、新規データソースを作成します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310133814.png "img")
ここで、データソースを設定するときに、開発環境と本番環境プラグインをチェックすることで、開発環境/本番環境にデータソースを追加することができます。    
Development・・・開発環境にデータソースを追加     
Production・・・本番環境にデータソースを追加     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310133916.png "img")


## タスクを開発環境から本番環境にデプロイする方法
ユーザーはDataWorks DataStdio 開発環境にてタスクを作成後、これを本番環境にデプロイしたい。その場合はこのような流れで設定します。    
ここでは同期タスクを例として説明します。 まずは同期タスクを作成します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310134805.png "img")

DataStdio（開発環境）で何か作成したあと、画像のボタン「タスクをサブミット」をクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310134849.png "img")

タスクのサブミットが成功したら、緑色のアラートメッセージが出ます。そのあと、 赤矢印の「Deploy」をクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310135030.png "img")

DataWorks Deploy画面に遷移したら、先ほどサブミットしたタスクを「Deploy」します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310135151.png "img")

タスクがデプロイされます。デプロイ結果やリソース等はPrelease Packageタブから確認できます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310135257.png "img")

デプロイ後、Operation Centerの画面に遷移します。    
※[Operation Centerは タスクの運用やメンテナンス、Job処理のステータスや結果、データのライフサイクル管理などを行うビッグデータ運用プラットフォーム](https://www.alibabacloud.com/cloud-tech/doc-detail/137930.htm)です。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310135359.png "img")

タスクがOperation Centerにて表示されます。      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310135532.png "img")


## MaxCompute Tableで開発環境/本番環境にスイッチする方法
操作ユーザーはMaxCompute Tableで開発環境、本番環境をシンプルにスイッチングすることができます。    
DataIntegration画面から、新規オフライン同期タスクを開きます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310133302.png "img")

Workspace Tables画面に入ったあと、画像のスイッチボタンをクリックすると、開発環境/本番環境へスイッチすることができます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310133504.png "img")

## OperationCenterで開発環境/本番環境にスイッチする方法
Operation Centerでの有効技ですが、ここで操作ユーザーは開発環境、本番環境をシンプルにスイッチングすることができます。    
※[Operation Centerは タスクの運用やメンテナンス、Job処理のステータスや結果、データのライフサイクル管理などを行うビッグデータ運用プラットフォーム](https://www.alibabacloud.com/cloud-tech/doc-detail/137930.htm)です。   
まずはOperation Centerの画面をひらきます。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310132949.png "img")

URLの切り替えで開発環境/本番環境にスイッチすることができます。   
URLで「env=prod」の場合は本番環境です。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310133015.png "img")

URLで「env=dev」の場合は開発環境です。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310133041.png "img")

---

# たぶんよくある質問

質問:   なぜ、このように開発環境と本番環境、基本モードと標準モードがあるのか？       
おおはら回答：  DataWorks 開発者に問い合わせた結果、回答としては、

・ 開発環境（検証環境）を使うことで、本番運用中の環境はもちろん、他の開発者に干渉しないで済む（仮に再起不能なほど壊しても迷惑をかけない）   
・ 開発環境（検証環境）があればMaxComputeテーブルの構成変更などがあった場合、全員で同期する段取りがスムーズになる    
・ 本番環境はお客様の財産なので、操作できるメンバーは厳密にコントロールする必要がある    

とのことでした。


# 最後に
DataWorksにおける基本モードと標準モード、開発環境と本番環境についてを説明しました。    
これを使って小人数規模から企業レベルの大規模までの開発・運用に柔軟に対応できると思いますので、ご参考にいただければ幸いです。      


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


