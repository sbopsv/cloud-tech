---
title: "ASKでデプロイとService接続"
metaTitle: "Serverless Kubernetes (ASK) を使用したPodのデプロイとServiceへの接続について"
metaDescription: "Serverless Kubernetes (ASK) を使用したPodのデプロイとServiceへの接続について"
date: "2020-03-19"
author: "有馬 茂人"
thumbnail: "/Container_images_26006613536114600/20200318150238.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Serverless Kubernetes (ASK) を使用したPodのデプロイとServiceへの接続について

本記事では、Serverless Kubernetes (ASK) の利用についてご紹介します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200319165457.png "img")

---

# はじめに

Alibaba CloudではKubernetesをマネージドで利用可能な、Container Service for Kubernetes (ACK) と言うプロダクトがあります。  
その中で利用可能なクラスタタイプは、大きく分けて３パターン利用する事が可能になっています。  
各クラスタタイプの大きな違いとしては、Kubernetesのマスターノードとワーカーノードのデプロイ構成の違いとなります。  
大まかな構成は以下のようになります。また、クラスタタイプによって他プロダクトの構成も少々変わってきますが、ここではわかりやくする為他プロダクトは省略しています。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200316151856.png "img")


* Dedicated Cluster
  * 　マスターノード（Controle plane）とワーカーノードはECSへデプロイされ、それぞれのノードをユーザ側で管理する必要があります。  
  
* Managed Cluster
  * 　マスターノード（Controle plane）はAlibaba Cloud側で管理され、ワーカーノードはユーザ側で管理する、いわゆるクラウドベンダーが提供する一般的なマネージドのクラスタ構成となります。  

* Serverless Cluster
  * 　マスターノード（Controle plane）はAlibaba Cloud側で管理され、ワーカーノードもAlibaba Cloud側で管理する構成となります。  

Serverless Kubernetes (ASK) では、Podが実行される環境として、フルマネージドのコンテナプロダクトのElastic Container Instance (ECI) 上でPodが実行されます。その為ユーザはIaaS（ワーカーノード）を管理する必要はありません。


<span style="color: #0000cc">※ 2020/3時点でServerless Kubernetes (ASK) は、日本リージョンにはローンチされていない為、利用可能なリージョンで実行する必要があります。
</span>


# クラスタ作成

では、Serverless Kubernetes (ASK) クラスタを作成したいと思います。まずクラスターテンプレートの作成から「標準サーバレスクラスター」を選択します。  
<span style="color: #0000cc">※ Serverless Kubernetes (ASK) について以降の表記はASKと記載させて頂き説明します。　　
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200317132950.png "img")

今回は以下の内容で設定していきます。  

* クラスター名：demo-ask
* リージョン：シンガポール
* ゾーン：アジア東南１ゾーンB
* VPC：自動作成
* NAT ゲートウェイ：自動作成
* パブリックアクセス：EIPでAPIサーバの公開

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200318105525.png "img")

クラスター名を入力しリージョンとゾーンを選択します。Podを起動する際に必要となるVPC, VSwitch、外部へ通信する為のNAT Gatewayは自動作成を選択します。  
VPC, VSwitch, NAT Gatewayについては、事前に作成済みのリソースを指定する事も可能ですが、今回は検証の為自動作成を選択しています。  
また、APIを外部から利用可能とする為、パブリックアクセスを有効とします。  
他の設定項目としてPraivateZooneやLog Serviceの連携も可能ですが今回は無効としています。  
  
最後にクラスター構成の確認で、クラスタ作成時に作成されるリソースが表示されます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200317163319.png "img")

クラスタ作成のログが表示されしばらくすると、クラスタが正常に作成されます。  
クラスタ作成から完了までの時間を手元で測ってみましたが、2分30秒程度で作成が完了しました。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200317163322.png "img")

# 基本操作

## kubeconfigの作成

作成したクラスタへ接続する為、クラスターの基本情報からKubeConfigをローカルへ設定します。  
コンソールから各ワークロードの設定は行えますが、今回はローカルのkubectlから実行します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200317181034.png "img")

## ノード

クラスタが作成された状態のノードの情報を見ると、virtual-kubeletが仮想ノードとして表示されています。  
Podはvirtual-kubeletにデプロイされる事で、Elastic Container Instance (ECI) のコンテグループが作成されます。  

```
# kubectl get nodes -o wide
NAME              STATUS   ROLES   AGE    VERSION                  INTERNAL-IP    EXTERNAL-IP   OS-IMAGE    KERNEL-VERSION   CONTAINER-RUNTIME
virtual-kubelet   Ready    agent   140m   v1.11.2-aliyun-1.0.242   10.10.106.37   <none>        <unknown>   <unknown>        <unknown>
```

![引用](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200318093441.png "img")

> https://www.alibabacloud.com/cloud-tech/doc-detail/86371.htm


## Podのデプロイ

ではPodをデプロイしてみましょう。DeploymentからnginxのPodを2つ作成します。今回は検証の為細かな設定は省略しています。

```
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: nginx
  name: nginx
spec:
  replicas: 2 
  selector:
    matchLabels:
      run: nginx
  template:
    metadata:
      labels:
        run: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
EOF
```

NginxのPodが2つvirtual-kubeletへ起動されました。
```
# kubectl get pods -o wide
NAME                     READY   STATUS    RESTARTS   AGE   IP             NODE              NOMINATED NODE   READINESS GATES
nginx-7db9fccd9b-dk9v6   1/1     Running   0          40s   192.168.0.15   virtual-kubelet   <none>           <none>
nginx-7db9fccd9b-rpv2g   1/1     Running   0          40s   192.168.0.14   virtual-kubelet   <none>           <none>
```

ECIのコンソール画面からも、コンテナグループが2つ作成されている事が確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200318105619.png "img")

![PodはECIのコンテナグループとして起動されます](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200318143551.png "PodはECIのコンテナグループとして起動されます")


## Serviceの作成

作成したPodへServiceを作成してみます。「type: LoadBalancer」を指定する事で、Alibaba Cloud のロードバランサーSLBが作成されPodへバランシングします。  


```
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  labels:
    run: nginx
  name: nginx
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    run: nginx
  type: LoadBalancer
EOF
```

ServiceがTYPE LoadBalancerで作成され、パブリックIPでEXTERNAL-IP が取得できました。
```
# kubectl get service -l run=nginx
NAME    TYPE           CLUSTER-IP      EXTERNAL-IP       PORT(S)        AGE
nginx   LoadBalancer   172.19.10.141   161.117.162.169   80:31702/TCP   4m9s
```

作成されたSLBをコンソールから確認をしてると、EXTERNAL-IPで取得したパブリックIPでSLBが作成されている事が確認できます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200318110514.png "img")

SLBのバランシング対象である仮想サーバグループには、ECIのコンテナグループ（Pod）へアタッチされたENIが設定されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200318145034.png "img")

![Alibaba CloudのSLBが作成された状態です](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200318150238.png "Alibaba CloudのSLBが作成された状態です")


ServiceのEXTERNAL-IPをブラウザで表示してみます。Nginxのトップページが表示されました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200318110915.png "img")

接続したPodのログを確認すると、アクセスログが出力されています。(接続元IPはマスクしています)
```
# kubectl logs  nginx-7db9fccd9b-rpv2g
XX.XX.XX.XX - - [18/Mar/2020:02:08:56 +0000] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36" "-"
```

# まとめ

今回はASKクラスタの作成からPodのデプロイ、Service（SLB）を作成し外部からの接続を確認してみました。  
簡易的な構成ではありますが、ASKを使用した場合も変わらずKubernetesを利用できている事が確認できたかと思います。  
ただし現時点で全てのKubernetesの機能ををサポートしているわけでありませんので、ドキュメントをご確認の上ご利用頂ければと思います。

> https://www.alibabacloud.com/cloud-tech/doc-detail/86371.htm

次回はAlibaba Cloud Container Registry (ACR) を使用した、コンテナイメージのCI/CDパイプライについてご紹介できればと思います。  
最後までお読みいただきありがとうございました。

ソフトバンク（元SBクラウド）のSlideShareへElastic Container Instance (ECI)とServerless Kubernetes (ASK) についてのスライドをアップロードしていますので、  
こちらも参考になればと思います。

> https://www.slideshare.net/sbopsv/elastic-container-instanceserverless-kubernetesnodeless-200272122


 <CommunityAuthor 
    author="有馬 茂人"
    self_introduction = "2018年ソフトバンクへjoin。普段はIaC・コンテナ・Kubernetes等を触っているエンジニアです。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/arima.jpeg"
    githubUrl="https://github.com/s-ari"
/>



