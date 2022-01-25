---
title: "MaxComputeのセキュリティ"
metaTitle: "MaxComputeのセキュリティについて"
metaDescription: "MaxComputeのセキュリティについて"
date: "2021-03-08"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613674379100/20210310153057.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## MaxComputeのセキュリティについて

本記事では、MaxComputeのセキュリティについて説明します。 　　　　


# 前書き
> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。   
> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute


    
今回はAlibaba Cloud MaxComputeおよびDataWorksのセキュリティの考え方、設定方法についてを説明します。

# MaxComputeのセキュリティ
MaxComputeは金融機関、通信業界、行政機関独自の厳しいセキュリティ要件をクリアできるほどセキュリティ機能が充実しています。     
MaxComputeとDataWorksはそれぞれ異なる権限を持ったロールがそれぞれのタスク処理をします。今回はDataWorksにおける基本モードと標準モード、開発環境と本番環境について深掘説明します。       


# DataWorksとは
Alibaba Cloud DataWorksは、MaxComputeやHologres、E-MapReduceなどAlibaba Cloudのビッグデータプロダクトを管理、処理するIDEサービスです。    
例えば、MaxComputeは通り、「サーバレス型フルマネージドプラットフォーム」となっています。
「サーバレス型フルマネージドプラットフォームをどうやって操作、運用するの？」という回答がDataWorksに当たります。   
アリババグループのデータビジネスの99％はDataWorks上で構築されています。何万人ものデータ開発者やアナリストがDataWorksに取り組んでいます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210303200642.png "img")



# セキュリティモデルとアクセス構成


## MaxComputeとDataWorksセキュリティモデルとアクセス構成
MaxComputeでデータをアクセスするためには、このような流れで一つずつチェックされます。これが大前提となります。    

STEP1:ユーザー認証・・・Alibaba CloudアカウントとRAMユーザごとに認証・制限     
STEP2:IP ホワイトリスト・・・プロジェクトレベルでの保護を提供    
STEP3:プロジェクトステータスチェック・・・プロジェクトステータスをチェック    
STEP4:ラベルセキュリティチェック・・・ユーザ・列データレベルで機密情報を制御    
STEP5:操作権限・・・ユーザごとにテーブルレベルで操作を制限    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310153057.png "img")

一方、DataWorks側でもMaxComputeとは異なったセキュリティモデルがあります。DataWorksでMaxComputeのようにStep-by-step式ではないですが、以下シナリオがあります。     

####  DataWorksセキュリティモデル  - 組織間のデータの隔離
・ ユーザー認証とRAMとの連携がサポートされています。Alibaba CloudアカウントはプライマリーアカウントとしてDataWorksをアクティベーションし、プロジェクトを新規作成できます。プロジェクトのメンバーは該当AlibabaCloudアカウント配下のRAMユーザーのみとなります。     
・ 同じプライマリーアカウントで作成したプロジェクトたちが一つの組織を構成します。プロジェクトの間にタスクの依頼が設定できます。違うメインアカウントで作成したプロジェクトのデータ(タスク)が隔離されています。     

####  DataWorksセキュリティモデル  - 抽出、変換、およびロード（ETL）プロセス中のデータ開発のセキュリティ問題
DataWorksは開発プロジェクトと本番プロジェクトに分けることでタスクの開発/デバッグと本番の隔離を実現します。メンバーのロールを通じて、どのメンバーがタスクの開発とデバッグを実行できるか、どのメンバーが本番タスクを操作および保守できるかを制御します。

####  DataWorksセキュリティモデル  - MaxComputeセキュリティモデルとの組み合わせ  
DataWorksはMaxComputeのプロジェクトスペースが正常に作成されると同時に、DataWorksのロールに対応するMaxComputeのロールも作成し、違うロールに権限を付与します。


## MaxComputeとDataWorksの権限関係

百聞は一見にしかず、実際どのような構成かを確認してみましょう。     

RAM ユーザーを用意します    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310163456.png "img")

DataWorksにユーザーを追加します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310163628.png "img")

結果として、Userの権限Policyから権限情報を確認することができました。    
MaxComputeとDataWorksはAlibaba Cloudアカウント（ Alibaba Cloud RootアカウントまたはRAMアカウント）に基づいて権限を与えます。    
RAMアカウントがDataWorksワークスペースに追加されたら、自動的に同じ役割でMaxComputeプロジェクトにも追加されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310214304.png "img")

--- 

### 基本モードのプロジェクト－Alibaba Cloud accountでアクセス

今度はMaxCompute操作ユーザー（visitor identity）をAlibaba Cloud accountで設定した場合の挙動を確認しましょう。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310130139.png "img")

基本モードのプロジェクト－Alibaba Cloud accountで登録、アクセスしてみます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310202526.png "img")

プロジェクトsecurity_basic_a_demoに 「dataworks_demo」というRAMユーザーをメンバー・およびDevelopmentら開発ロールで追加してみたところ、     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310212422.png "img")

Account for Accessing MaxCompute = Alibaba Cloud account のもと、 「dataworks_demo」というRAMユーザーとして、プロジェクトsecurity_basic_a_demoでテーブル読み取り操作をすることができました。    
このことから、Alibaba Cloud rootアカウント配下のRAMユーザーは該当のプロジェクトおよびMaxComputeテーブルにアクセスするための権限を持ってることがわかります。     
また、RAMを追加していない別プロジェクト（Alibaba Cloud accountで設定）のテーブルにもアクセスすることができます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310221430.png "img")

--- 

### 基本モードのプロジェクト－Node Ownerでアクセス

次はMaxCompute操作ユーザー（visitor identity）をNode Ownerで設定した場合の挙動を確認します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310130718.png "img")

基本モードのプロジェクト－Node Ownerで登録、アクセスしてみます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310212651.png "img")

プロジェクトsecurity_basic_n_demoに 「dataworks_demo」というRAMユーザーをメンバー・およびDevelopmentら開発ロールで追加してみたところ、      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310212721.png "img")

Account for Accessing MaxCompute = Node Ownerのもと、 「dataworks_demo」というRAMユーザーとして、プロジェクトsecurity_basic_n_demoでテーブル読み取り操作するとエラーが発生しました。     
このことから、MaxCompute操作ユーザー（visitor identity）をNode Ownerで設定した場合、MaxcomputeタスクをサブミットするのはNode Owner（いわゆる個人アカウント）のみとなるため、「dataworks_demo」というRAMユーザーを登録・開発ロールを追加しただけではテーブルへのアクセスができません。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310221359.png "img")

--- 

### 標準モードのプロジェクトアクセス

続けて、標準モードでプロジェクトを設定した場合の挙動を確認します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310132520.png "img")

標準モードでプロジェクトを作成します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311021357.png "img")

プロジェクトsecurity_standard_demo1にメンバーを追加します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311124139.png "img")

DataWorksで権限を確認します。    

開発環境は個人アカウントでデバッグされます。したがって、ノードタスクはRAMアカウントが追加されていないプロジェクトのテーブルにアクセスできません。下記のようにエラーメッセージが表示されます

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311124256.png "img")


MaxComputeで権限を確認します。    
標準のDataWorksプロジェクトにRAMアカウントが追加された後、開発環境のMaxComputeにRAMアカウントを自動的に追加され、関連する権限を付与します。本番環境ではRAMアカウントが追加されるが詳細なACLがありません。    
理由としては本番環境では、タスクのリリースでは所有者アカウントによって実行されるため、個人アカウントにはデフォルトでタスクをリリースすることができません。     

* 標準モードの本番環境：    
RAMアカウントはジョブを実行する権限がありません    

* 標準モードの開発環境:     
RAMアカウントはジョブを実行する権限があります    
RAMアカウントは追加されていないプロジェクトのテーブルをアクセスすることができません     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311124520.png "img")


標準モードのまとめ      
* AlibabaCloud Accountは、DataWorksプロジェクトのプロジェクトOwnerになれます。      
* MaxComputeでは、プロジェクトのOwnerまたは通常ユーザーになることができます。      
* DataWorksプロジェクトメンバー管理を介してメンバーを追加する場合、該当のプロジェクトプライマリーアカウントに対応するRAMサブアカウントのみを追加できます。       
* MaxComputeは、`add userxxx;` コマンドを使用して他のクラウドアカウントを追加できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311132708.png "img")


---


# プロジェクトセキュリティ

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310153057.png "img")

プロジェクトのセキュリティ管理で、上記は空港をイメージした説明をしましたが、ここについて深堀説明します。    
（いらすとやを使って説明したほうがすぐ理解しやすいかなと思ったのですが、色々あって真面目に説明します、、）     


## プロジェクト内部セキュリティー管理

プロジェクトとして内部のセキュリティは以下の図のように、５つのプロセスで編成されています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311134019.png "img")

これがどのようにセキュリティ管理されているか、ここも百聞は一見にしかず、実際確認してみましょう。    

```
前提条件：
プロジェクトを作成（ Prj1_demo）
アカウントを用意(ram_test)
※多要素MFA認証を設定すると、毎回登録の際に設定の携帯電話からの認証コードを使う必要があります。ここでは省略します。
```

この前提条件を踏まえ、以下手順を実施します   
ワークスペース名は「Prj1_demo」です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311134837.png "img")

#### ユーザー管理（多要素MFA認証ー省略）

RAMユーザーを用意します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311135007.png "img")


#### Role管理
RAMページより、カスタマイズrole `ram_role`を作成します。その`ram_role`をram_test アカウントに割り当てます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311135450.png "img")

#### ACL認証
カスタマイズrole `role_test`に権限を与えてみます。ram_test アカウントでrole_testの権限を検証します。    
ram_test アカウント（= ram_role権限を持ってるユーザー）に、テーブル作成のためのCreateInstanceとCreateTableの権限をアタッチします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311135904.png "img")

その結果、ram_test アカウント（= ram_role権限を持ってるユーザー）は無事テーブルを作成することができます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311140102.png "img")

#### Policy認証
Policy認証はRoleのみが対象となる、ユーザーへの権限付与ができません。   
確認として、今度はPolicy認証を確認するために、drop_testテーブルを作成します。  
drop_testテーブル作成直後はDataWorks DataMapで確認することができます。ユーザーは何も権限を付与していないため、このdrop_testテーブルを削除することもできます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311161823.png "img")

これに対し、Policy認証を設定します。ProjectOwnerアカウントでram_roleにDropテーブルの権限をPolicyで拒否するか確認します。    
 
Policyとなるjsonファイルの中身は以下の通りです。     
```
{
    "Version": "1",
    "Statement":
    [{
        "Effect":"Deny",
        "Action":"odps:Drop",
        "Resource":"acs:odps:*:projects/prj1_demo_dev/tables/*"
    }]
}
```
設定し、ram_test ユーザーでPolicyが効くことを検証したところ、、、Policyが効いてエラーが発生したことがわかります。    
このように、Policy、ACL、Role、ユーザー別できめ細かいレベルで管理することができます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311162958.png "img")


#### Labelアクセス管理
Labelアクセスはテーブルデータに機密情報などが含まれている場合に適用し、ユーザーごとにセキュリティレベルを付与、閲覧権限をコントロールします。    
Labelことセキュリティレベルは全部で4段階となっています。   
LABEL ０：無効状態、Unclassified、どのテーブルでも閲覧可能状態（defaultはLABEL 0です）             
LABEL １：秘密、Confidential、テーブルのデータのプレビューを表示することができます。                
LABEL ２：機密、Sensitive             
LABEL ３：高機密、Highly Sensitive                      

> https://www.alibabacloud.com/cloud-tech/doc-detail/34604.html


例えば、ram_testユーザーは、デフォルトとなるLABEL 0だとTableデータプレビューができます。この状態でLABEL 1を設定します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311164902.png "img")

まずはLabelを有効にします。   
```
show SecurityConfiguration;
Set LabelSecurity=true;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311165332.png "img")

続いて、ram_testユーザーをLABEL 1 に設定します。 
```
SET LABEL 1 TO USER ram$5445574761551201:239996701173677377;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311165521.png "img")

テーブルのLabelレベルを１に設定します。
```
SET LABEL 1 TO TABLE org_log_all_0; 
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311165547.png "img")

これで、org_log_all_0テーブルはLABEL1 以上の権限を持つユーザーでないと閲覧も操作もできない状態となります。     

今度はorg_log_all_0テーブルのIP列とUID列だけ、LABELを2にします。     

```
SET LABEL 2 TO TABLE org_log_all_0(ip, uid); 
```
そのあと、LABEL 1のram_testユーザーが`select * from org_log_all_0 where dt='20200926' limit 10;` でテーブルデータを取得してみます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311193352.png "img")

結果、↑上記画像通りレコード取得が出来ませんでした。    
今度はLABEL２ 以外の列（LABEL1のみ）を指定して、テーブルデータを取得してみます。    
```
select 
    time,
    region,
    bytes,
    status,
    method,
    url,
    protocol,
    referer,
    device,
    identity
 from org_log_all_0 
 where dt='20200926' 
 limit 10;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311193632.png "img")

これは無事取得できました。    
今度はLABEL2 のみでの列でデータを取得します。    
```
select 
    ip,
    uid
 from org_log_all_0 
 where dt='20200926' 
 limit 10;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311193930.png "img")

結果として、権限がないエラーが返ってきました。
またDataMapでも、鍵として非表示されています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210311194031.png "img")

--- 

# 最後に
MaxComputeのセキュリティについてを説明しました。DataWorksからこのようにきめ細かいレベルでのセキュリティ設定ができます。    
MaxComputeのセキュリティはここで説明したものの他に「プロジェクトを跨ぐセキュリティ管理」「アクセス許可リストや設定」「RAMロールのカスタマイズ」など、様々なニーズに応じたセキュリティ設定を行うことができます。       
また、これはMaxComputeを対象としたセキュリティ設定ですが、DataWorksからE-MapReduceへのセキュリティ設定はまた別の設定（例えばYARNリソースの制限、クラスターのオートスケール設定、etc）がありますので、こちらもドキュメントを参考にいただければ幸いです。       
セキュリティが厳しい要件でも、このようにセキュリティを厳重かつ柔軟に対応できると思いますので、ご参考にいただければ幸いです。      




参考：    
[MaxCompute and DataWorks Security Management Guide: Basics (1)](https://www.alibabacloud.com/blog/maxcompute-and-dataworks-security-management-guide-basics-1_594470)
> https://www.alibabacloud.com/blog/maxcompute-and-dataworks-security-management-guide-basics-1_594470   

[MaxCompute and DataWorks Security Management Guide: Basics (2)](https://www.alibabacloud.com/blog/maxcompute-and-dataworks-security-management-guide-basics-2_594471)
> https://www.alibabacloud.com/blog/maxcompute-and-dataworks-security-management-guide-basics-2_594471   

[MaxCompute and DataWorks Security Management Guide: Examples](https://www.alibabacloud.com/blog/594476)
> https://www.alibabacloud.com/blog/594476


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>




