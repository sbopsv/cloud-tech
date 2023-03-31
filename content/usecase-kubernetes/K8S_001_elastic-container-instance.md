---
title: "ECIでサーバレスなコンテナ環境"
metaTitle: "Elastic Container Instance (ECI)でサーバレスなコンテナ環境を利用する"
metaDescription: "Elastic Container Instance (ECI)でサーバレスなコンテナ環境を利用する"
date: "2020-03-11"
author: "有馬 茂人"
thumbnail: "/Container_images_26006613532355000/20200310135808.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Elastic Container Instance (ECI)でサーバレスなコンテナ環境を利用する


本記事では、[Elastic Container Instance (ECI)](https://www.alibabacloud.com/ja/products/elastic-container-instance)をご紹介します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200309161305.png "img")

---

# Elastic Container Service (ECI)とは

まずはじめに、Elastic Container Service (ECI) とは何かと言いますと、プロダクトページには以下のように記載されています。

> <span style="color: #ff0000"><i>Elastic Container Instance（ECI）は、セキュアサーバレスコンテナサービスです。  
ユーザはサーバーを管理せずに簡単にコンテナを実行でき、ビジネスアプリケーションに集中する事が出来ます。</i></span>

つまり、サーバレスな環境でコンテナを実行できる為、IasSの管理が必要なくユーザはより開発に集中する事が可能になります。  

※ これ以降はElastic Container Serviceを"ECI"と表記して説明します。

---

# 特徴

以下特徴を簡単にまとめてみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310165430.png "img")

---

# アーキテクチャ

簡単なアーキテクチャイメージを記載します。ECIを起動させた場合の構成は概ね以下のような形になります。

ECIはVPC内のVSwitchネットワークで起動されENIがアタッチされます。 ECSを作成した時と動作は同じですね。  
ECIからパブリックネットワークへ通信を行う為には、NAT Gatewayを経由するかEIPをアタッチする必要があります。コンテナを起動させる際にコンテナイメージをダウンロードする等がそれに当たります。次にECIに対するアクセス制御ですが、こちらはECSと同様にSecurity Groupを使用します。以上の事からVPC, VSwitch, Security Group, NAT GatewayもしくはEIPは事前に作成しておく必要があります。

アーキテクチャイメージで登場しているコンテナグループとは、1つ以上のコンテナを束ねている単位となります。（KubernetesのPodに相当と言った方がわかりやすいでしょうか。）  
以下のイメージでは、1つのコンテナグループの中に、2つのコンテナが起動されている状態となります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310135808.png "img")

---

# ECIの作成

## 検証構成

ECIの作成方法はいくつかありますが、今回はコンソールとAlibaba Cloud CLIを使用して作成していきます。  
前述のアーキテクチャイメージにある通りVPC, VSwitch, Security Group, EIPは作成済みの状態となっている事を前提に進めていきます。（NA Gatewayは今回は使用しません）  

今回は動作検証用に、以下のような簡易的な内容でECIを作成していきます。

* リージョン：シンガポール
* ネットワーク：VPC, VSwitch, Security Group, EIPは事前に作成済みのリソースを使用します
* コンテナグループネーム：web
* コンテネーム：nginx
* コンテナイメージ：nginx
* コンテナイメージタグ：latest
* コンテナスペック：2vCPU, 4GiB

![検証構成作成イメージ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200311103907.png "検証構成作成イメージ")


## コンソール編

### 作成画面

ECIのコンソールを開き作成を進めいて行きます。  
作成画面を開くとリージョン、ネトワーク、ボリューム、コンテナグループとコンテナについての情報等を選択・入力して行く事で、簡単に作成する事ができます。  
今回コンテナスペックは2vCPU, 4GiBを指定しましたが、他にもかなり多くのスペックを指定できる事がわかるかと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310145839.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310145854.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310145910.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310150537.png "img")


最後に設定した内容を確認してECIを購入します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310150549.png "img")


### コンソール操作

ECIのコンソールに戻ると、先ほど設定した内容でコンテナグループが実行されてる事がわかるかと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310152819.png "img")

試しにECIへアタッチしたEIPにブラウザから接続してみます。nginxのトップページが表示されました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310152504.png "img")

続いて、コンソールからECI・コンテナの状態を簡単に見て行きたいたいと思います。  
コンソールからは、コンテナのステータス、ボリューム、イベント、ログ、ターミナル接続、モニタリングの操作が可能です。  
ログを表示してみると、先ほどブラウザからECIのEIPへ接続した際のアクセスログが出力されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310155334.png "img")

ターミナルで起動中のコンテナへ接続したり、モニタリングからリソースの使用状況が確認できます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310160938.png "img")

検証用の簡易的な構成ではありますが、コンソールからかなり簡単にコンテナを作成しステータス等の確認をする事ができたかと思います。

---

## Alibaba Cloud CLI編

前述のようにコンソールからECIを作成する事も可能ですが、Alibaba Cloud CLIからもECIの各種設定が可能になっています。


### コマンド実行

先ほどコンソールから作成した内容と同様の設定をCLIで実行しECIを作成します。  

Alibaba Cloud CLIについては、CLIをインストールした環境から実行しても良いですし、インストールが面倒な場合はAlibaba Cloud Shellを起動するとデフォルトでCLIが利用可能な状態となっているので、設定が不要で便利かと思います。今回は手元の環境からCLIを実行したいと思います。使用したAlibaba Cloud CLIのバージョンは3.0.36となります。

```
aliyun eci CreateContainerGroup --RegionId=ap-southeast-1 \
                                --SecurityGroupId=sg-t4ne2kuq06cr7k374urx \
                                --VSwitchId=vsw-t4nn8khkgk565gu4ak302 \
                                --EipInstanceId=eip-t4nt2upskoxtdrbvd1z94 \
                                --ContainerGroupName=web \
                                --Container.1.Name=nginx \
                                --Container.1.Image=nginx \
                                --Container.1.Cpu=2.0 \
                                --Container.1.Memory=4.0
```

コンソールから作成した場合と同様のオプションを指定する事で、ECIを作成する事ができます。

Alibaba Cloud CLIのECI関連のオプションをみてみると、かなり数が多くの掲載しきれない為以下のドキュメントをご覧ください。
ご覧頂くとわかるかと思いますが、コンソソールより細かくECIの設定が可能である事がおわかり頂けるかと思います。

> https://www.alibabacloud.com/cloud-tech/doc-detail/94110.htm

---

# 料金体系

最後にECIの料金体系ですが、従量課金（秒単位）とリザーブドインスタンス（RI）の課金請求が適応されます。  
（NAT Gateway、EIPについては別途課金の対象となります。）  
参考までにドキュメント記載のCPUとMemory単価は以下のようになっています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200311113601.png "img")

> https://www.alibabacloud.com/cloud-tech/doc-detail/89142.htm

---

# まとめ

Elastic Container Instance (ECI)の概要と簡単な作成方法を説明しました。  
サーバレスな環境でコンテナを実行する事が可能になっており、適切なスペックを柔軟に選択できる事や秒単位での従量課金に対応している等、  
使い方によってはコスト削減や、運用負荷の改善に効果があるのでは無いでしょうか。

次回はECIと関わり合いが深いContainer Service for Kubernetes (ACK)のクラスタタイプの1つである、Serverless Kubernetes (ASK)について紹介できればと思います。  
最後までお読みいただきありがとうございました。  

少し前になりますが、Elastic Container Instance (ECI)についての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/elastic-container-instanceserverless-kubernetesnodeless-200272122


 <CommunityAuthor 
    author="有馬 茂人"
    self_introduction = "2018年ソフトバンクへjoin。普段はIaC・コンテナ・Kubernetes等を触っているエンジニアです。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/arima.jpeg"
    githubUrl="https://github.com/s-ari"
/>


