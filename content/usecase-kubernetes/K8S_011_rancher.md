---
title: "RancherでKubernetes管理"
metaTitle: "Rancher🐮でKubernetes (ACK) を管理しよう❗️ - 検証編 -"
metaDescription: "Rancher🐮でKubernetes (ACK) を管理しよう❗️ - 検証編 -"
date: "2019-06-06"
author: "sbc_y_matsuda"
thumbnail: "/Container_images_17680117127180000000/20190604205052.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Rancher🐮でKubernetes (ACK) を管理しよう❗️ - 検証編 -

# はじめに


昨年、多くのパブリッククラウドにてKubernetesサービスが正式に提供開始されたこともあり、`Kubernetes`というキーワードを聞くことがかなり多くなってきたように感じます🤔

下記のGoogle Trendsのグラフを見てもKubernetesの着実な盛り上がりが感じられますね😁  　　
こうしてみると結構日本とアメリカのグラフが連動していて面白いです。  
ちなみに日本のグラフだけガクッと下がっている部分はGWですね🎌　　　


![trend](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/trend.PNG "trend")    
（2021年10月時点）    


そんな、Kubernetesですが、もちろんAlibaba Cloud でもサービスとして提供しています😁  
<span style="color: #ff0000">A</span>libaba Cloud <span style="color: #ff0000">C</span>ontainer Service for <span style="color: #ff0000">K</span>ubernetes
というサービスで記事のタイトルにもあるのですが`ACK`と略します。

今回の記事ではAlibaba Cloud の Kubernetes サービスにも対応している「[Rancher](https://rancher.com/)」というソフトウェアをご紹介したいと思います😆
ℹ️今回は動作検証が目的の内容になります。
  
Container Service for Kubernetesの概要は[コチラ](https://www.alibabacloud.com/product/kubernetes)のプロダクトページをご覧いただければと思います。


# Rancherとは

Rancherとはオープンソースのコンテナ管理プラットフォームです。  
Kubernetesクラスタの構築、運用やアプリケーション展開機能を持っています。  
特に大きなポイントは「マルチクラウド」「マルチクラスタ」を１つのRancherプラットフォームから管理することができる点です。


参照元：  
> https://rancher.com/products/rancher/multi-cluster-management/



Rancherに関する詳しい内容は下記のThink IT連載などをご覧頂ければと思います。

> https://thinkit.co.jp/series/8740

3月末にリリースされた Rancher 2.2 からACKにも対応致しましたので実際に検証していきたいと思います。  
下記は昨年RancherがAlibabaを含む中国発クラウドのKubernetesサービスへのサポートを発表した記事になります。

> https://rancher.com/blog/2018/2018-11-14-rancher-announces-china-cloud-provider-support/

# Rancher on Alibaba Cloud ECS

Rancherの構築手順に関してはQiitaで簡単な構築手順の記事を書いていますので、こちらをご覧頂ければと思います。  


> https://qiita.com/MatYoshr/items/628cb1246655e27d10b1


# Rancher への Kubernets の登録

RancherでKubernetes環境を管理するには２通りの方法があります。  
<span style="color: #ff0000">既存</span>のKubernetsクラスターをRancher管理下に置く    
<span style="color: #0000cc">新規</span>のKubernetsクラスターをRancherから作成する     

Alibaba Cloud Container Service for Kubernetes はどちらの方法にも対応していますので、それぞれ見ていきたいと思います。     

# Import Cluster

構築済みのRancher環境へアクセスします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190604205423.png "img")    
    

Rancher上に管理対象が存在しない場合この様な画面になります。    
`クラスターを追加`を選択して既存の`Container Service for Kubernetes` 環境を設定したいと思います。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190604205052.png "img")    
    

`既存のクラスターをインポート`を選択`クラスター名`を入力し「作成」を選択します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190605152405.png "img")    
    

既存のKubernetesにRancherと通信するための設定を実施します。     
以下のコマンドをコピーし、<span style="color: #ff0000">kubectlが使える端末から</span>対象のKubernetesに実行します。    
コマンド実行後に「完了」を選択します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190605153013.png "img")    
    

ℹ️以下のコマンドのURL部分は環境によって異なります。     

```
kubectl apply -f https://xxx.yyy.zzz/v3/import/1234567894bw9qv8z7ml2xdv2p9cg899hp8s4llk.yaml
```

この様なメッセージが表示されると思います。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190605164624.png "img")    
    

コマンドの成功後にACKのコンソール画面を確認しに行くと「名前空間」に`cattle-system`が追加されています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190605165202.png "img")    
    

Rancherの画面に戻るとこの様な画面が表示される様になります。    
先程のコマンドが成功していれば状態、プロバイダー、ノード数などの情報が取得できていると思います。    
ℹ️データが取得できる様になるまで多少の時間が必要です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190605165702.png "img")    
    

`クラスター名`の部分（今回だとalibabacloud-cluster）を選択するとクラスターの詳細が表示されます。    
ACKで作ったKubernetesクラスターはバージョンに`aliyun`などの文字列が入っている様です。   
ℹ️バージョンによって表記は変わる可能性があります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190605170211.png "img")    
    

ノードの情報もこの様に取得されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190605171836.png "img")    
    

`alibabacloud-cluster` > `Default` を選択します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606014341.png "img")    
    

表示される画面の`ワークロード`にリソースの情報が表示されます。  
Deploymentの名称やイメージ、レプリカ数などが表示されています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606015129.png "img")    
    

Deploymentを選択（testappを選択）すると詳細画面が表示されます。   
ここで`スケール`の項目の`+`ボタンを押して２から３にするとPodのスケールが実行されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606015621.png "img")    
    

少々待つと動的にPodの数が増えました。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606020551.png "img")    
    

Alibaba Cloud の管理コンソールから見たときも、ちゃんと1個増えている様子が確認できます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606021148.png "img")    




# Create Cluster 

Rancher v2.2 はAlibaba Cloudに対応しているのでRancherからACKを作成することが出来ます。     
ただし、AWSやAzure などと違いデフォルトではAlibaba Cloud対応が無効化されていますので、有効化を行ってから作成を行います。    

`クラスター`の画面などから`ツール` > `Drivers`を選択します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606021945.png "img")    


以下の様な画面が表示されます。    
`Alibaba ACK`にチェックを入れて「アクティブ化」を選択します。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606023013.png "img")    


しばらくして`Alibaba ACK`が「Active」に変われば成功です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606023243.png "img")    


クラスター画面に戻り「クラスターを追加」を選択します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606023606.png "img")    



`In a hosted Kubernetes provider`に`Alibaba ACK`が追加されています😁     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606024109.png "img")    


`Alibaba ACK`を選択し`Account Access`で必要な情報（Region,Access Key,Secret Key）を入力します。     
入力後に「Next: Configure Cluster」を選択します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606024645.png "img")    



`Cluster Configuration`で必要な情報を入力し「Next: Configure Master Node」を選択します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606024912.png "img")    


画面を省略しますが、Master Node、Worker Nodeの設定を行い「作成」を選択するとACK環境の作成が開始されます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606025826.png "img")    


作成が始まるとRancherの画面では以下の様に`Provisioning`の表記でクラスターが表示されます。    
プロバイダーがAlibaba ACKとなっています。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606030245.png "img")    


Alibaba Cloud の管理コンソール上でもクラスター構築中なのがわかります。    
15分ほど初期構築に時間がかかりますので終わるのを待ちます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606030435.png "img")    


しばらくすると`Active`に変わってKubernetesが利用可能になります🎉     
RancherがちゃんとACKに対応している事が確認できました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190606032946.png "img")    


# 最後に

Rancher というツールがAlibaba Cloud のKubernetesサービスに対応している事がご理解頂けたかと思います。     
最近はAlibaba Cloudに対応しているツールも増えてきましたので、色々活用してみてください😁      

ただ、Alibaba Cloud のKubernetes サービスは他のKubernetesサービスに比べると、管理コンソールにGUIのダッシュボードがあったりHelmが最初から使えたりと、実はRancherを入れなくても使いやすく管理しやすい構成になっていると個人的には思います🤔     
  
しかし、マルチクラウドやハイブリッドでKubernetesを管理したいという様な要望がある際にはRancherを使って一元管理をするシナリオはありそうですね。    

今回は簡単な動作検証でしたがRancheには色々と便利な機能を持っていますのでその辺とACKを組み合わせなども紹介していきたいと思います。    


 <CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>


