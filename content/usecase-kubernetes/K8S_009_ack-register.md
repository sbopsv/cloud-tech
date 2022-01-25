---
title: "ACKで外部k8sクラスタ連携"
metaTitle: "ACK Register Cluster で外部 k8s クラスタ連携"
metaDescription: "ACK Register Cluster で外部 k8s クラスタ連携"
date: "2021-09-03"
author: "有馬 茂人"
thumbnail: "/Container_images_26006613803150700/20210902163459.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## ACK Register Cluster で外部 k8s クラスタ連携

本記事では、Container Service for Kubernetes (ACK) の Register Cluster を使用して、外部の Kubernetes クラスタと連携する方法をご紹介します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210902162004.jpg "img")

---

# ACK Register Cluster とは

はじめに ACK Register Cluster についてですが、Alibaba Cloud やオンプレミス・他クラウド環境へ構築された複数の Kubernetes クラスタを統合管理する為のクラスタタイプとなります。  
サービスや環境毎に構築・運用している複数の Kubernetes クラスタをまとめて管理したいと言ったケースもあるかと思います。ACK Register Cluster では、既存環境のクラスタを ACK Register Cluster  へ登録する事で、ACK Register Cluster を介して各クラスタへのリソース管理が行えるようになります。  
各クラスタへのプロキシのようなイメージと思って頂ければ良いかと思います。   
※ ACK Register Cluster を以降は Register Cluster と省略して記載します

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210902163459.png "img")

---

    

# 検証環境
今回利用する環境については、以下の構成で実行していきます。  
手順の流れとしては、Alibaba Cloud へ Register Cluster を作成し、他クラウド環境へ事前に構築した Kubernetes クラスタへ ACK Register Agent をデプロイします。  
Register Cluster へクラスタ登録後にクライアントから操作を実行します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210831162059.png "img")

---

    

# ACK Register Cluster 作成
ではContainer Service for Kubernetes のコンソールから Register Cluster を作成していきます。  
クラスタタイプから [Register Cluster] を選択し、VPC・VSwitch・SLB・ログなど必要な設定を行います。  
ここで設定した SLB や LogService 等は作成されますが、クラスタのコアコンポーネント自体は Alibaba Cloud でマネージドされる為、  
特に ECS 等のノードは必要ありません。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210901120532.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210901120547.png "img")

    

作成が完了すると、エンドポイントやクラスタ登録に必要となるマニフェストが作成されます。  
まだ Kubernetes クラスタが何も登録されていない状態なので [To Be Connected] と表示されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210901121410.png "img")

    

[Connection Information] から登録するクラスタ環境に応じて、[Public Network] か [Internal Network] かを選択します。  
今回は外部環境へ事前に作成したクラスタを追加する為、 [Public Network] のマニフェストを利用します。  
こちらで表示されているマニフェストは、登録するクラスタ側で実行します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210901122710.png "img")

    

---

    

# クラスタ登録
先ほど [Public Network] でコピーしたマニフェストを、事前に作成している外部 Kubernetes クラスタへデプロイします。  
デプロイすると、マニフェストへ設定されている configmap / serviceaccount / secret / deployment 等のリソースがデプロイされ  
ACK Register Agent の Pod が起動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210903135402.png "img")

    

しばらくすると、登録されたクラスタのノードがコンソールへ表示され、ステータス等のノード情報が確認できるようになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210902142025.png "img")


    

---

    

# 動作確認
クラスタが登録後コンソールの [Connection Information] から **Register Cluster  へ接続する為の kubeconfig** が発行されます。  
こちらをローカルへ設定し、kubectl から Register Cluster を介して登録したクラスタへデプロイしていきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210902141902.png "img")

    

では Pod をデプロイしてみます。登録されたクラスタのワーカーノードへ nginx の Pod が作成されました。

```
$ kubectl run nginx --image nginx
pod/nginx created

$ kubectl get pod -o wide
NAME    READY   STATUS    RESTARTS   AGE   IP           NODE                                             NOMINATED NODE   READINESS GATES
nginx   1/1     Running   0          16s   172.16.2.8   ip-172-16-2-98.ap-northeast-1.compute.internal   <none>           <none>
```

    

実行可能な機能については、Alibaba Cloud で利用できる ACK を登録した場合と、今回登録で利用したような外部のクラスタを登録した場合では対応している機能に違いがあります。  
例として、ACK では従来通り Alibaba Cloud の各プロダクトと連携可能なのですが、外部クラスタの場合では一部未対応であったり、機能が実行環境に依存するなどです。  
詳しくはドキュメントへ対応が記載されておりますので、利用前にこちらをご確認頂くのが良いかと思います。

> https://www.alibabacloud.com/cloud-tech/doc-detail/155208.htm

    

---

    

# まとめ

今回は ACK Register Cluster を使用して簡易的に動作を確認してみました。  
動作確認で使用したクラスタは1つだけでしたが、マルチクラウドやハイブリッド環境での  
複数クラスタの管理手段として参考になればと思います。



 <CommunityAuthor 
    author="有馬 茂人"
    self_introduction = "2018年ソフトバンクへjoin。普段はIaC・コンテナ・Kubernetes等を触っているエンジニアです。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/arima.jpeg"
    githubUrl="https://github.com/s-ari"
/>



