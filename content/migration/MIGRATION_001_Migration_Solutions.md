---
title: "マイグレーションソリューション"
metaTitle: "Alibaba Cloud マイグレーションソリューション"
metaDescription: "Alibaba Cloud マイグレーションソリューション"
date: "2021-03-02"
author: "有馬 茂人"
thumbnail: "/Migration_images_26006613696236900/20210226171512.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Alibaba Cloud マイグレーションソリューション


# はじめに

本記事では、Alibaba Cloud マイグレーションソリューションの概要をご紹介します。     

成長していくビジネス変化へスピーディかつ柔軟に対応し、安定して事業を継続させる為の手段として、クラウドを採用するケースは年々増加しています。  
しかし、長年利用さた環境をクラウドへ移行する為には、技術的な問題や移行プロセス、移行後の運用等、考えなければならない課題が多岐に渡ります。

今回はマイグレーションを前提とした各利用シーン毎に、Alibaba Cloud のマイグレーションプロダクトを利用し、どのように複雑な移行プロセスを軽減し、迅速かつ安全で効率的にAlibaba Cloud への移行を行えるかご紹介したいと思います。

    

---

# クラウド環境の特徴

サービスを支える基盤としてクラウド環境を採用する事で、細分化されたIT資産やコストを柔軟に管理、必要なリソースを必要な分だけ迅速に提供し、ビジネスに最適化されたインフラ環境の利用が可能となります。  
グローバルに展開されたデータセンターを利用し、システムを分散・冗長化する事で、災害対策などにも容易に対応します。
また、クラウド環境では最新技術を使用したサービスが日々リリースされている為、それらを使用し柔軟でスケーラブルなアーキテクチャでシステムを稼働させる事が可能となっています。

    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613696236900/20210225170819.png "img")

    

既存環境で利用されているシステムからクラウド環境へのマイグレーションでは、移行対象によって検討しなければならないプロセスが多く、より移行が複雑化します。その際に、Alibaba Cloud のマイグレーションプロダクトを利用する事で、これらの複雑な移行プロセスを軽減し、迅速かつ安全で効率的にクラウド環境へシステム移行する事が可能となります。

    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613696236900/20210226171512.png "img")

    

---

# マイグレーションリソース

マイグレーションを実施する際の対象リソースとして、物理サーバやVM、データベースやファイルデータ等、いくつかのリソースが移行対象として考えられますが、今回は以下のようなリソースをAlibaba Cloud への移行対象として、マイグレーション方法を紹介して行きたいと思います。  
(今回はマイグレーショに伴う詳細なプロセス等の内容は省略させて頂きます。)



![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613696236900/20210226171328.png "img")

    

# サーバー

はじめにサーバーのマイグレーションです。 
サーバーを異なる環境へマイグレーションする場合、既存システムの設定や必要となるアプリケーション、またデプロイされているプログラム等、非常に多岐にわたる項目の洗い出しが必要となり、またこれらを移行する為の何らかの仕組みや実際の移行作業が必要となります。  

Alibaba Cloud ではサーバーマイグレーションを支援するプロダクトとして、サーバーマイグレーションセンター (SMC) を利用する事が可能です。  
マイグレーション対象として、既存環境で稼働している物理サーバー、仮想サーバー、クラウド環境下でのインスタンスに対応しており、SMCエージェントを対象サーバーへ設定する事でマイグレーションが行われます。SMCエージェントへは、データを転送する為に必要なアクセスキーやシークレットキー等の設定を行う事で、Alibaba Cloud の中間インスタンスへデータが転送されAMIが作成されます。 この作成されたAMIからECSインスタンスを起動する事でマイグレーションが完了します。

このように、SMCを利用する事で複雑な移行手順や作業を軽減し、非常に少ないステップで既存環境からAlibaba Cloud へのマイグレーションを行う事が可能となっています。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613696236900/20210226135453.png "img")




---

# VMware VM(仮想サーバー)

データセンターや自社内の環境へ、VMwareをインフラ基盤として構築し利用されている方も多いのではないのでしょうか。  
そのような場合、Alibaba Cloud ではHybrid Backup Recovery (HBR) を利用する事で、既存環境のVMwareとシームレスに連携し、VM (仮想サーバー)をAlibaba Cloud へ移行する事が可能となっています。  
HBRはAlibaba Cloud プロダクトや、オンプレミス環境等のデータバックアップに対応してたプロダクトとなっているのですが、その機能の中でVMware VMマイグレーション機能を提供しています。VM (仮想サーバー)のマイグレーション自体は先ほどのSMCを利用する事でも可能なのですが、こちらの機能を利用する事で、さらに容易にVM (仮想サーバー)をマイグレーションする事が可能となっています。

    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613696236900/20210226143337.png "img")

 
---

# データベース

Alibaba Cloud では、データベースのマイグレーションに特化したプロダクトとして、Data Transmission Service (DTS)があります。  
こちらのプロダクトは、何度かこちらのテックプログでも掲載されておりますが、DTSは、データ移行、データ統合、データ同期、変更追跡等の複製モードをサポートしており、リレーショナルデータベース、NoSQLデータベース、データウェアハウス等を、Alibaba Cloud のデータベースプロダクトやECSインスタンスへ作成されたデータベースへマイグレーションする事が可能なプロダクトです。また、DTSとAdvanced Database&Application Migration (ADAM) と組み合わせて利用する事で、Oracleからのマイグレーションにも柔軟に対応しています。  
(※ ADAMは、データベースとアプリケーションを評価し、レポート作成、ターゲットDBの選定、スキーマ変換などの処理をサポートしています。)


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613696236900/20210226145211.png "img")



---

# データ


オンプレミス環境で利用しているNASへ保存されているデータや、他クラウド環境で利用しているオブジェクトストレージのデータをAlibaba Cloud へマイグレーションする場合には、Data Online Migration を利用する事が可能です。  
既存データストアをソースターゲットとして、エンドポイントやアクセスキー等の情報を設定する事で、Alibaba Cloud 側へ作成されているOSSのバケットや、NAS領域へデータをマイグレーションします。  
Alibaba Cloud の耐久性・信頼性の高いストレージを利用する事で、より安全性の高い環境でデータを利用・保存する事が可能となります。  

ただし、こちらの機能は現在ベータ機能として提供されている為、動作を試したい場合やテスト環境での利用が推奨されています。  
今後リリースされる事に期待したいところです。

    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613696236900/20210226163736.png "img")

    

---

# まとめ

今回はオンプレミス環境等で利用されているいくつかのリソースを、作業負荷を軽減しつつ迅速にAlibaba Cloud へマイグレーションする方法をいくつかご紹介しました。  
現状利用されている環境を、異なるプラットフォームへ即時に移行する事はなかなかハードルが高く、多くの課題や工数が必要となる事が想定されますが、今回ご紹介したマイグレーションプロダクトを活用し、Alibaba Cloud への移行の手助けとなればと思います。


 <CommunityAuthor 
    author="有馬 茂人"
    self_introduction = "2018年ソフトバンクへjoin。普段はIaC・コンテナ・Kubernetes等を触っているエンジニアです。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/arima.jpeg"
    githubUrl="https://github.com/s-ari"
/>


