---
title: "RAM"
metaTitle: "Alibab CloudのRAMについて"
metaDescription: "Alibab CloudのRAMについてを説明します"
date: "2021-05-26"
author: "Hironobu Ohara"
thumbnail: "/images/4.1.PNG"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


# Resource Access Management（RAM） の概要

Alibaba CloudのRAM（Resource Access Management）は、Alibaba Cloudのリソースに対する権限を作成および管理をすることができます。RAMに関する料金は無料です。
RAMはリソース権限管理するためのコンソール操作があります。特定のリソース管理操作が実行できるのは、アカウント管理者か、アカウント管理者の承認を受けたRAMユーザーのみです。

RAMは、シンプルな構造で設計されており、無料かつYAML形式でプロダクトサービスやアカウント、グループなどのすべてのリソース制御を一貫で管理できるので、覚えて損はないと思います。
> https://www.alibabacloud.com/cloud-tech/doc-detail/28627.htm


# RAMの特徴

RAM（Resource Access Management）は上記説明通り、ユーザーID の管理とアクセス制御、権限管理のためのサービスです。RAMを使用することで、ユーザーアカウント (従業員、システム、アプリケーションなど) を作成および管理し、Alibaba Cloud アカウントのリソースに対してそのユーザーアカウントが所有する操作権限を制御できます。

* きめ細かいアクセス制御

Alibaba Cloudは、多くのプロダクトサービスをリソースとして利用することができます。RAMはそれぞれのリソースレベルでユーザーに役割を付与（アタッチ）することができます。例えば、Object Storage Service（OSS）に対し、特定のRAMユーザーあるいは特定のRAMグループは読み取り専用という設定ができます。RAMは、幅広いリソースに対し、それぞれのリソースに特化した独自の役割構成を構築することができます。

* 様々なサービス・SDK・APIからの制御

Alibaba Cloudは、WebコンソールからのGUI操作の他に、プロダクトサービスのAPI、SDKを使った様々な方法で操作をすることができます。
その操作において、制御管理をする場合は、RAMユーザーを発行し、目的に応じたRAMロールでプロダクトサービスに対する制御管理をしたらよいと思います。


# RAMロールとRAMユーザーの違い
* RAMロールは仮想ID であり、固定のIDは持っていますが、ID認証情報アクセスキーを持ちません。
* RAMユーザは、固定のIDとID認証アクセスキーを持つ実際のIDであり、一般的には、特定のユーザーまたはアプリケーションに対応します。

![RAM](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/4.1.PNG "RAM")

RAMロールは権限が付与された実際のユーザーが引き受ける必要があります。ロールを引き受けると実際のユーザーはこのRAMロールの一時セキュリティトークンを受け取ります。これにより、この一時セキュリティトークンを使用して、ロールに許可されているリソースにアクセスできます。


# アクセス制御管理について

権限はポリシーで定義します。ポリシーでは「実行可能なアクション」や「操作可能なリソース」を指定でき、柔軟に権限が設定できます。
ポリシードキュメントはJSON形式で管理しており、以下のようにまとめます。

```json
{
  "Statement": [
    {
      "Action": "*",
      "Effect": "Allow",
      "Resource": "*"
    }
  ],
  "Version": "1"
}
```


ポリシードキュメントでは、次のような要素を記述します。
* `Effect` - 許可する場合はAllow、許可しない場合はDeny
* `Resource` - AlibabaCloudの操作可能なリソース・許可されたオブジェクトはなにかを指定します。たとえば ”ユーザAがリソースSampleBucketに対してGetBucket操作を実行できる” という権限付与ポリシーの場合、Resourceは`SampleBucket` です。
* `Action` - AlibabaCloudの各種サービスでどんな操作が実行できるか。サービスを個別指定することも可能。たとえば ”ユーザAがリソースSampleBucketに対してGetBucket操作を実行できる” という権限付与ポリシーの場合、Actionは`GetBucket` です。
* `Condition` - 権限付与が有効になる条件です。たとえば、”ユーザAが2018年12月31日より前にリソース SampleBucketに対してGetBucket操作を実行できる” という権限付与ポリシーの場合、Conditionは `2018年12月31日より前` です。


他の例もみてみましょう。
`リクエスト送信者のソースIPアドレスが 42.160.1.0であれば、SampleBucketというOSSバケットに対して読み取り専用操作を実行できる` というRAMポリシーであれば、以下リスト のようにまとめます。

```json
{
    "Version": "1",
    "Statement":
    [{
        "Effect": "Allow",
        "Action": ["oss:List*", "oss:Get*"],
        "Resource": ["acs:oss:*:*:samplebucket", "acs:oss:*:*:samplebucket/*"],
        "Condition":
        {
            "IpAddress":
            {
                "acs:SourceIp": "42.160.1.0"
            }
        }
    }]
}
```


# RAM操作方法

RAMの操作方法は非常に簡単です。RAM（Resource Access Management）のコンソール画面から数点操作するだけです。

![RAM](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/4.2.PNG "RAM")

![RAM](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/4.3.PNG "RAM")

# まとめ
RAM（Resource Access Management）は無料で利用ユーザーを増やすだけでなく、Alibaba Cloudのリソースを制御しつつ効率よく扱うことができます。
しかし、設定を間違えるとセキュリティ的にインシデントが起きてもおかしくはないし、有事の際が大変になります。
そういう意味では、基本的には「必要に応じて最小限の権限だけ付与」といったスモールスタートから実装、確認しつつ Step-by-stepで進めたほうが良いと思います。





<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


