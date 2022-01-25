---
title: "基本概念"
metaTitle: "Alibab Cloudの基本概念について"
metaDescription: "Alibab Cloudの基本概念についてを説明します"
date: "2021-05-26"
author: "Hironobu Ohara"
thumbnail: "/images/1.3.2.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

# はじめに

Alibaba Cloudで最初に把握したいことは、アカウント、AccessKey（AK）、課金について です。   


---
---
# アカウント
Alibaba Cloud 利用者。アカウントは大きく2種類に分かれています。

> 1. アカウント（Administrator、サービス管理者）
> 2. RAM ユーザー

1. アカウント（Administrator、サービス管理者）
Alibaba Cloud の各種サービスを利用するための管理者です。全てのプロダクトサービス、RAM捜査権限、などの全てのリソースへの管理権限が与えられています。またアカウントはAdministrator権限を持つサービス管理者として、RAMを使ってRAMユーザーを作成、必要に応じてそれぞれのサービス利用権限を付与することができます。アカウントが親ユーザー、RAM ユーザーが子ユーザーみたいな位置づけです。

2. RAM ユーザー
RAM ユーザーは、１つのアカウント配下で生成される固定IDと資格情報を持つRAM IDです。Alibaba Cloud アカウントは、複数のRAM ユーザーを作成できます。     
RAM ユーザーは、企業の従業員、システム、アプリケーションを特定して使用します。
![RAM](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/1.3.2.png "RAM")

例えば、データ分析のグループを作って、OSS（Object Storage Service）のみ読み取り専用にしたい、という設定もできます。   
![RAM](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/1.3.3.png "RAM")
> https://www.alibabacloud.com/cloud-tech/doc-detail/122150.htm

また、アカウント、RAMユーザーでそれぞれログオンする場所は異なります。RAMユーザーはRAMコンソールでログインする必要があります。ログインに必要な情報は、RAMユーザー作成時に表示されます。    
![RAM](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/1.3.1.png "RAM")
> https://www.alibabacloud.com/cloud-tech/doc-detail/215901.htm


その他、RAMユーザーのみならず、RAMグループによる権限管理などもありますので、詳しくはRAMに関する最新のhelpドキュメントを参照頂ければ幸いです。   
> https://www.alibabacloud.com/cloud-tech/doc-detail/122148.htm


---
---
# AccessKey（AK）
Alibaba Cloud プロダクトサービスおよびSDK、APIなどのプログラムで Alibaba Cloud を使用する場合、Alibaba Cloud AccessKey を発行して、Alibaba Cloud がプロダクトサービスのシステムによる呼び出しで AccessKey を識別するようにします。AccessKeyは、AccessID (例: JRGOJFE259DEA) とKeyID (例: reddtolnrevmfrregmef3cse) で構成されます。また、Helpドキュメントなどで`AccessKey`を`AK`と省略する場合があります。    

AccessKeyはユーザーを認証するための方法なので、セキュリティ上、非公開にする必要があります。     
（AccessKeyだけでプロダクトサービスを認証・操作できるため、漏洩などにより不正利用されるためです。）    


![AK](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/1.2.1.png "AK")

AccessKeyはコンソールのアバターのiconから作成・発行することができます。   

![AK1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/1.2.2.png "AK1")

![AK2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/1.2.3.png "AK2")

一方、RAMユーザー（子アカウント）のAccessKeyは、RAMコンソール画面から発行する必要があります。    
> https://www.alibabacloud.com/cloud-tech/doc-detail/215905.htm


---
---

# 課金について
Alibaba Cloudプロダクトサービスにはそれぞれの課金モデルがあります。基本的には以下のどれかになります。   

* PAYG（PAY-AS-YOU-GO、従量制料金、使った分だけ支払う）
* Subscription（期間を指定して購入）

PAYGは、名前通り、使用量ベースの課金モデルなので、通常の月額プランに加入しなくてもプロダクトサービスを 1回だけ購入、利用することができます。暫定的な利用あるいはスモールスタート向けです。    

Subscriptionは、プロダクトサービスへの継続的な利用を目的として定額の月額料金を支払うことで、有効期限まで継続的に利用することができます。毎月の定額的な支払いは固定されており、Subscriptionの有効期限が終了、あるいはサービスがキャンセルされるまで自動的に更新されます。SubscriptionはPAYGと比較して安くなっており、Subscriptionの期間が長期化すればするほど月々のコストが低くなります。     


Alibaba Cloudの料金支払い対象となるものは、基本的には「コンピューティング」「ストレージ」「APIあるいはプラットフォーム」「Alibaba Cloudからのデータ転送」が対象となります。    

* 「コンピューティング」は、Elastic Compute Service（ECS）だけでなく、AnalyticDB for MySQL、Hologres、ApsaraDB for POLARDBなどが挙げられます。    
インスタンス起動時は課金が発生しますが、インスタンスを停止したら、課金は発生しません。    
* 「ストレージ」は、データ量だけ課金が発生します。OSSやMaxCompute、PolarDBなどが対象です。    
* 「APIあるいはプラットフォーム」は、FunctionComputeやLogService、ImageSearchなどが挙げられます。クエリあるいはI/O数ごとに課金します。   
* 「Alibaba Cloudからのデータ転送」は、Alibaba Cloudに保持されているデータをローカル、他クラウドサービスなどへ転送すると、アウトバウンドデータ転送として料金が発生します。これは他クラウドサービスでも共通事項です。一方、同じAlibaba Cloudでありながら、同じリージョン内のデータ転送は無料です。    

プロダクトサービスによっては料金モデルが異なるため、事前に料金モデルを確認してからプロダクトサービスの利用が望ましいです。

[料金体系および請求関連でより詳しい説明はこのページ](https://ohiro18.github.io/technical.site/advisory/5.About_Billing)にて記載していますので、こちらも参考にしてください。
> https://ohiro18.github.io/technical.site/advisory/5.About_Billing


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>




