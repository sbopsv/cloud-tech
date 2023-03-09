---
title: "ACRでビルドパイプラインを実装"
metaTitle: "Alibaba Cloud Container Registry (ACR) でコンテナイメージのビルドパイプラインを実装する"
metaDescription: "Alibaba Cloud Container Registry (ACR) でコンテナイメージのビルドパイプラインを実装する"
date: "2020-04-01"
author: "有馬 茂人"
thumbnail: "/Container_images_26006613540700100/20200330185020.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Alibaba Cloud Container Registry (ACR) でコンテナイメージのビルドパイプラインを実装する

本記事では、Docker イメージのビルドから、ビルドしたイメージをContainer Service for Kubernetes (ACK) へデプロイするまでのビルドパイプラインを、Alibaba Cloud Container Registry (ACR) を使用して実装する方法をご紹介します。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327180951.png "img")

---

# はじめに

コンテナを使用している環境では、コンテナイメージの保存先としてDocker Hub等のサービスやクラウドベンダーが提供しているマネージドのプロダクトを利用しているかと思います。  
Alibaba Cloud でもコンテナイメージをマネージドで利用可能なプロダクト、Alibaba Cloud Container Registry (ACR) があります。  

※ Alibaba Cloud Container Registry (ACR) はAlibaba Cloud 国際サイトで利用可能です。  
※ 以降はAlibaba Cloud Container Registry を「<span style="color: #ff0000">ACR</span>」と記載します。  
※ ブログ内で「イメージ」と記載されている部分は「Docker イメージ」の事を指します。  


---

# Alibaba Cloud Container Registry (ACR) の特徴

     

ACRで提供している主な機能以下のようになっています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200331142614.png "img")

また、ACRにはDefault Instance EditionとEnterprise Editionがあり、<span style="color: #0000cc">後者は日本リージョンではまだローンチされていない為</span>、今回はDefault Instance Editionを利用します。  
Default Instance EditionとEnterprise Editionの違いは以下のドキュメントをご覧頂ければと思います 。  
Enterprise Editionはより高速なイメージ転送や、グローバル間での利用に特化した機能をサポートしている事から、複数のリージョンからイメージを使用する等の場合に適しています。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200326174701.png "img")
> 引用:https://www.alibabacloud.com/cloud-tech/doc-detail/111958.htm

     

---

# コンテナイメージのビルドプロセス

     

コンテナイメージを開発しデプロイするまでのプロセスは、環境によって内容や順序は異なるかとは思いますが、以下のような項目が考えられます。
開発者はDockerfileを作成しコードリポジトリへアップロードします。アップロードされたコードはビルド・テストを経て、最終的に各環境へデプロイするようなプロセスとなるかと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200330154252.png "img")

# ACRビルドパイプラインの作成

## ビルドパイプライン

     

では、ここからACRを使用してDocker イメージのビルドからデプロイまでを自動で実行するパイプラインを作成してみたいと思います。  
以下は今回作成するビルドパイプラインの構成です。前述の特徴で記載しましたACRの各機能を使用し、ビルドパイプラインを作成していきます。  
また、デプロイ先にACKを利用している為、以降の説明ではACKが作成されている事を前提として進めていきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200330185020.png "img")

## Githubリポジトリの準備

     

GitHubへDockerfileをアップロードするリポジトリを作成します。   
今回はGitHubへ以下の「acr_demo_app」と言うリポジトリ名で作成しました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200326175857.png "img")

## Alibaba Cloud Container Registry (ACR) 設定

     

次にACR側の設定を実施していきたいと思います。

### コードソース設定

     

ACRでDocker イメージをビルドする際に使用する、Dockerfileが保存されるGitリポジトリの設定を行います。  
今回はGitHubを使用していますが、他にもBitbucketやGitLabをコードソースのGitリポジトリとして設定する事が可能です。

Code Source設定画面から「Bind Account」を選択し、連携するGitHubアカウントのOAuth AppsへACRを登録します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200326193710.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200326200249.png "img")

GitHubでの認証が完了すると、Code SourceのステータスがUnboundからBoundへ変更されました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200326200610.png "img")

     
  
### Namespace設定

ACRへNamespaceを作成します。  
Namespaceは組織や役割、チームやユーザと言った、ある程度の範囲でコンテナリポジトリをグループ化する機能となります。  

     
「namespace_demo」と言うNamespaceを作成しました。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200326205908.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200326210223.png "img")

     

### イメージリポジトリ作成

     

Docker イメージを保存するリポジトリを作成します。  
先ほど作成したネームスペースを選択し、リポジトリ名を「app」としました。  
Repository Typeでプライベートかパブリックで公開先の設定可能です。今回は検証が目的の為Publicを選択しています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327102724.png "img")

Code Sourceは先ほど設定したGitHubのユーザとリポジトリが選択可能となっているので、Dockerfileのアップロード先のリポジトリを選択します。  
また、自動ビルドを有効にする事で、以降で設定するビルドルールに一致した場合に、Docker イメージのビルドが自動で開始されます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327102731.png "img")

GitHubのリポジトリセッティングを見てみると、ACRへのWebhookが作成されました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327133408.png "img")

     

### ビルドルール設定

     

ビルドルールは、対象のソースコードリポジトリのブランチ・タグへイベントがあった場合、イメージのビルドを開始させる為の設定となります。  
以下の例では、Dockerfileをアップロードするリポジトリの「master」ブランチへPushイベントがあった場合にビルドが開始されるように設定しています。
また、ビルドが完了したDocker イメージへ「latest」タグが設定されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327172650.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327134657.png "img")


今回は検証の為簡易的な内容でブランチとイメージタグの設定を行なっていますが、実際の運用では開発ブランチや、ステージング用のブランチ、またイメージタグについてもそれぞれの環境に合わせた設定がされるかと思います。

     

### ビルド確認

     

ではDockerfileを作成し、GitHubのmasterブランチへPushしてみます。  
今回使用するDockerfileではnginxのイメージを使用しています。後ほどイメージをアップデートした際の変化をわかりやすくする為、index.htmlの書き換えを行なっています。

> Dockerfile
```
FROM nginx
RUN echo "<h1>ACR Demo App v1</h1>" > /usr/share/nginx/html/index.html
```

     

作成したDockerfileをmasterブランチへPushします。
```
# git add Dockerfile 
# git commit -m "ACR Demo App v1"
# git push origin master
```

     

Build StatusがBuildingになりビルドが開始されました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327141445.png "img")

     

Build Statusが47秒でビルドが完了しました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327141007.png "img")

     

Tagsから確認してみると、latestタグでイメージが作成されている事が確認できます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327142128.png "img")

### Security ScanとImage Layers

     

今回の趣旨とは少しずれますが、「Tages」の右側のSecurity Scanから、イメージに対してセキュリティスキャンの実行が可能となっており、脆弱性のレポーティングを確認する事ができます。  
こちらのイメージをスキャンしてみると、以下のようにレポーティング表示してくれます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327142849.png "img")

     

また、Image Layersからは、イメージをビルドした際に実行された内容を確認する事ができます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327142732.png "img")

     

### トリガーURL取得

     

ここまでで、GitHubのmasterブランチへDockerfileをPushし、Docker イメージのビルドが自動で実行される事が確認できました。    
次にビルドされたイメージを、指定したDeploymentへ継続して更新されるようにトリガーURLの設定をしていきます。
ACRでビルドしたイメージを、ACKへデプロイする為には「Trigger URL」が必要となります。「Trigger URL」とはイメージのデプロイ先であるDeploymentへのリンクとなります。

### Deployment作成

     

まずはACKへDeploymentを作成する為、マニフェストを作成します。
イメージの取得先として、先ほど作成されたイメージのエンドポイントとタグを指定しています。  
また、ブラウザからイメージのアップデートを確認する為、ServiceでLoadBalancerを設定しています。    

> kubernetes manifest
```
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: app
  name: app
spec:
  replicas: 1
  selector:
    matchLabels:
      run: app
  template:
    metadata:
      labels:
        run: app
    spec:
      containers:
      - image: registry-intl-vpc.ap-northeast-1.aliyuncs.com/namespace_demo/app:latest
        imagePullPolicy: Always
        name: app
---
apiVersion: v1
kind: Service
metadata:
  labels:
    run: app
  name: app
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    run: app
  type: LoadBalancer
EOF
```

     

作成されたPodと、LoadBalancerのEXTERNAL-IPを確認します。
```
# kubectl get pod
NAME                  READY   STATUS    RESTARTS   AGE
app-5f79d7c56-qnrrm   1/1     Running   0          2s

# kubectl get svc -l run=app
NAME   TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)        AGE
app    LoadBalancer   172.21.12.19   47.245.8.224   80:30581/TCP   45s
```

     

ブラウザからEXTERNAL-IPを表示します。  
先ほど作成したイメージでコンテナが起動している事がわかります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327154245.png "img")

ACKのデプロイメントから、今回作成した「app」を選択し、「Trigger URL」の設定を行います。  
少し下の方に「トリガーの作成」の項目があるので、そちらから「再デプロイ」を選択し設定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327154950.png "img")

以下のように作成されたトリガーリンクが、ACRで使用するTrigger URLとなります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327155406.png "img")

### トリガー設定

     

ACRのコンソールに戻り、先ほど取得したトリガーリンクを「Trigger URL」へ設定します。  
ここで選択可能なトリガーの条件ですが、「イメージ作成時に毎回デプロイする」、「イメージのタグを正規表現でフィルタリングしマッチした場合デプロイする」、「指定したイメージのタグにマッチした場合デプロイする」の３種類のトリガーが選択可能です。  
今回はイメージタグに「latest」が指定されたイメージをデプロイする設定としています。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327160424.png "img")

ここでは先ほど作成したDeploymentを指定しトリガーを設定していますが、別のDeploymentのトリガーを設定する事で、複数のDeploymentへのイメージを更新する事も可能です。

## ビルド・デプロイ確認

     

では最後にイメージを更新し、DeploymentのPodが更新される事を確認したいと思います。

先ほどのDockerfileの表示する文字列を<span style="color: #ff0000">v1からv2</span>へ変更します。
```
FROM nginx
RUN echo "<h1>ACR Demo App v2</h1>" > /usr/share/nginx/html/index.html
```

     

GitHubのmasterブランチへ再度Pushします。
```
# git add Dockerfile 
# git commit -m "ACR Demo App v2"
# git push origin master
```

     

ビルドの実行が開始され成功しています。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327163756.png "img")

     

ReplicaSetを確認してみると、新しいReplicaSetが作成されている事がわかります。
```
# kubectl get rs    
NAME            DESIRED   CURRENT   READY   AGE
app-5f79d7c56   0         0         0       56m
app-696c68bf8   1         1         1       64s
```

     

EXTERNAL-IPへブラウザから接続すると、v2へ更新されたイメージでPodが起動されている事が確認できました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200327164224.png "img")

# まとめ

Docker イメージのビルドから、デプロイを実行するビルドパイプラインをACRを使用して作成してみました。  
ACRと連携させる為の設定や、ACKの設定等がいくつかあり、多少複雑な印象があったかとは思いますが、1度設定してしまえば継続して実行可能な環境を構築する事が可能となっています。  
また、ビルドルールとトリガーを併用する事で、異なるネームスペースやクラスタ、リージョンへのデプロイを柔軟に振り分けたりするような使い方もできるのではないでしょうか。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200331112616.png "img")

先日配信されました「Alibaba Cloud Academy Day Online Conference」のセッションの中でも、ACRを使用したDevOpsソリューションを動画で見る事ができるので、こちらも参考になればと思います。

> https://resource.alibabacloud.com/ja/webinar/detail.html?spm=a3c0i.13976856.9463370820.15.24627f81D7MHj3&id=1481


 <CommunityAuthor 
    author="有馬 茂人"
    self_introduction = "2018年ソフトバンクへjoin。普段はIaC・コンテナ・Kubernetes等を触っているエンジニアです。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/arima.jpeg"
    githubUrl="https://github.com/s-ari"
/>


