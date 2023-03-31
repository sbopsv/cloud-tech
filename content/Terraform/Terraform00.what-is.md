---
title: "00 Terraformとは何か"
metaTitle: "Alibab Cloud Terraform"
metaDescription: "Alibab Cloud Terraformを説明します"
date: "2021-05-10"
author: "Hironobu Ohara"
thumbnail: "/images/terraform_2.1.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Terraformとは何か

# Infrastructure as Code
&nbsp; AlibabaCloudというクラウドサービスが登場したことで、クラウドサービス上にあるECSという仮想コンピューティングを作成・破棄するのが非常に簡単になりました。AlibabaCloudのWebコンソールにあるボタン一つでコンピューティングを数分以内に起動することができます。しかし、Web上でGUI操作とはいえ設定項目を一つ一つずつ画面上操作するのは骨が折れるのと、小規模サービスでも構築にヒューマンエラーや運用・学習コストはどうしても付き物になります。例えばAlibabaCloud未経験者がECSをCS 100台を手動起動してみましょう。この作業にどれほどの時間がかかるか、そしてミスをゼロにして稼働できるか、という課題があります。そこで解決の道となったのが**Infrastructure as Code**（以降は「IaC」と略します）です。

# Terraformとは
&nbsp; IaCはコード通りの内容を自動で設定する仕組みを持ちます。IaCの種類はPackerやVagrantなど様々ですが、[HashiCorp](https://www.hashicorp.com/)社がオープンソースとして手掛ける**Terraform**というマルチクラウド対応プロビジョニングツールがあります。シンプルなDSL(HCL)、自由自在な変数表現と状態管理が特徴です。TerraformはAlibabaCloudだけでなくAmazon Web Services、GoogleCloudPlatform、MicrosoftAzure、Docker、OpenStackなど様々なインフラに幅広く対応しています。インフラを構築するためのプロビジョニングツールであり、開発者だけなく、運用担当者でも必要となりうるプロビジョニングツールです。

&nbsp; Terraformは構築したいインフラの構成をテキスト形式のテンプレートファイルに定義します（Infrastructure as Code）。「どこのリージョン」「どのスペックのECS、どのリソースを使うか」「支払い方法」「展開方法」といったインフラの状態をコードとして記述し、ターミナルからコマンドを実行するだけでクラウド上に適用 (構築) が出来ます。逆に既存のリソースをTerraformでImportすることでコード化、同じ構成のコードを他リージョンで同様展開することも可能です。
他にIaCとしてPackerやVagrantがありますが、本ガイドラインとしてはTerraformを中心とした説明で進めます。
![図 1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_2.1.png)


&nbsp; 構成変更や他クラウドプロパイダからのマイグレーション、同じリソースで別リージョン、別アカウントにて展開するときにIaCがあることでエラーなくシームレスに移管ができます（リソースをGUIベースでコピーすることは不可能です。）
また障害や高負荷など問題発生時でも環境を復元することができるメリットもあります。


![図 2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_2.2.png)


&nbsp; 加えて、コードからリソースを作成することで学習コスト・運用コストを削減することができます。例えば先ほどの例、AlibabaCloud未経験者がECS 100台を手動でなくIaC、Terraformで起動すると、ミスをゼロへ抑制はもちろん、学習工数・運用保守コスト・全てが大幅に節約できます。

![図 3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_2.3.png)


# Immutable Infrastructure（使い捨て構成）
&nbsp; クラウド環境（仮想環境）が登場したことで、サーバらHW、物理的リソース制約がなくなりました。これにより、サーバやネットワークを簡単に構築したり、一旦構築したものをすぐに破棄することが出来るようになったので、一度構築したインフラやリソースは変更を加えることなく破棄して、新しいものを構築する考えが可能になりました。
→このような流れは「Immutable Infrastructure（不変のインフラ）」と呼ばれ、インフラ変更履歴を管理するのではなく、動作している「インフラの状態」を管理（=必要に応じて使い捨て）からクラウド環境ではコードによるインフラ構成・構築・管理・運用を行う必要があります。IaCとしてTerraformを上手く使うことで、ユーザーのワークロードに応じた使い捨て構成でのサーバー増設を素早く構築することができます。

![図 4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_2.4.png)


# 最後に
&nbsp; 前置きが長くなりましたが、クラウドサービスの良いところは立案した戦略や設計をすぐに試せれるところであり、AlibabaCloudの良いところは、PaaS/IaaS/SaaS/KaaS...幅多くのプロダクトサービスがあり、これらの活用によってより楽に生産的にすることができる点です。是非楽しみながらAlibabaCloudのTerraformを読み進めていただければ大変幸いです。



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>



