---
title: "コンソールについて"
metaTitle: "Alibab Cloudのコンソールについて"
metaDescription: "Alibab Cloudのコンソールについてを説明します"
date: "2021-05-26"
author: "Hironobu Ohara"
thumbnail: "/images/3.5.PNG"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


# コンソールについて

Alibaba Cloudには、Webベースの管理コンソールがあります。アカウント、RAMユーザーは管理コンソールを使って、Alibaba Cloudの様々なプロダクトサービス、リソースを操作・管理することができます。Alibaba Cloudのコンソールは非常にシンプルな設計になっており、Webにてボタンを数回クリックするだけでElastic Compute Serviceら仮想コンピューティングや、ApsaraDB for POLARDBといったリソースを操作することができます。
> https://www.alibabacloud.com/cloud-tech/doc-detail/47605.htm


# Alibaba Cloud Top画面（国際サイト）
Alibaba Cloudは、中国内のみ利用が出来る中国サイトと、日本を含めた世界各地が利用出来る国際サイトの2つがあります。私たちは基本的に国際サイトを利用します。

> 国際サイト
![Console](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.1.PNG "Console")

> 中国サイト
![Console](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.1.1.PNG "Console")


これらは URLで国際サイト、中国サイトへ切り替えすることができますが、メニューバーにある言語設定で、中国サイト（中国站）、国際サイト（International）への切り替えもできます。

![Console](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.1.2.PNG "Console")


---
---

# 基本的なメニュー画面（ホーム）
Alibaba CloudへアカウントあるいはRAMユーザーとしてログイン後、基本的なメニュー画面が表示されます。
Alibaba Cloudのコンソール管理画面はマテリアルデザインなので、スマートフォンやタブレットからも同様の操作をすることができます。
![Console](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.2.PNG "Console")


ここで注目したいのは、画面上のナビゲーションバーです。例えば、左側の「Producet and Services」を選定すると、操作・処理したいプロダクトサービスを選定することができます。
基本的には、左側の「Producet and Services」から操作したいプロダクトサービスを選定、そこからプロダクトサービス内で詳細管理、といった一連の流れで操作を行います。
![Console](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.4.PNG "Console")


プロダクトサービスメニューからは様々なプロダクトサービスがありますが、以下はホーム画面から直接操作することができます。
CloudShellを使うことで、ユーザーはECSやローカルのターミナルからでなく、直接APIやShellによるプロダクトサービスを操作することが出来ます。

* CloudShell
![Console](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.3.PNG "Console")



その他、画面右上のメニューバーから、様々な機能へのリンクがついています。
![Console](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.5.PNG "Console")


# 料金 & クレジット残高

![Console](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.6.PNG "Console")

# アカウント情報
Alibaba Cloud のアカウントは基本的に2種類あります。１つはアカウント（Administrator、サービス管理者）、もう１つはRAM ユーザー（子アカウント）です。
それぞれの画面（構成情報、AccessKey、など）が異なりますので、注意が必要です。


> 1. アカウント（Administrator、サービス管理者）
![account](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.7.PNG "account")


> 2. RAM ユーザー
![RAMユーザー](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.8.PNG "RAMユーザー")

# Helpドキュメント
Alibaba Cloud のhelpドキュメントは英語、中国語、日本語あるいは中国語、英語、日本語の優先順位で翻訳しながら展開されます。そのため、helpページのURLで英語/中国語/日本語をスイッチングしながら切り替えて確認することができます。

また、日本語によるhelpページがない場合は英語、あるいは中国語で確認が望ましいです。Google Chromeを使っている場合はGoogle翻訳を使って好きな言語に翻訳しながら確認すると良いと思います。

![help doc](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/3.12.PNG "help doc")


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


