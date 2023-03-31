---
title: "ACKクラスターをARMSで監視"
metaTitle: "ARMS Prometheus MonitoringでACKクラスターを監視する"
metaDescription: "ARMS Prometheus MonitoringでACKクラスターを監視する"
date: "2021-03-23"
author: "有馬 茂人"
thumbnail: "/Container_images_26006613701553900/20210322180252.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## ARMS Prometheus MonitoringでACKクラスターを監視する

本記事では、Application Real-Time Monitoring Service （ARMS）  で、Container Service for Kubernetes （ACK） のモニタリングをする方法をご紹介します。     

<span style="font-size: 80%">※ 以降は Application Real-Time Monitoring Service Prometheus Monitoring を ARMS Prometheus 、Container Service for Kubernetes を ACK と表記します  
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210323112610.jpg "img")

--- 

# Application Real-Time Monitoring Service （ARMS）について

まず初めにARMS についてですが、ARMS はアプリケーションパフォーマンスマネージメント（APM）を提供しているプロダクトで、主に以下の機能を提供しています。  

* アプリケーションモニタリング  
* ブラウザモニタリング  
* Prometheus モニタリング

この ARMS の機能の１つとして、Prometheus をマネージドで利用する事ができるようになっています。

> https://www.alibabacloud.com/ja/product/arms


## Prometheusについて

Prometheus はメトリクスの収集に特化したオープンソースのモニタリングツールです。  
スケーラブルな環境下で、ターゲットを検知するサービスディスカバリ機能や、Pull型のアーキテクチャを採用しており、ターゲットへ配置されたエクスポーターへスクレイピングする事で、メトリクスを収集します。エクスポーターには、公式・サードパーティを含め、システムやデータベースなど、多くのエクスポーターが利用できようになっています。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210318142223.png "img")

## ARMS Prometheus Monitoring について

オープンソースの Prometheus をセルフホストした場合、Prometheus の環境構築や各コンポーネント等、ユーザ自身で管理する必要があります。ARMS Prometheus ではこれらのコンポーネントを、Alibaba Cloud がマネージする事で、即座に利用でき運用負荷を軽減する事ができるようになっています。  
ARMS Prometheus は、オープンソースの Prometheus と互換性があり、エージェント （PromAgent） をインストールするだけですぐに利用可能です。また、収集したメトリクスをビジュアライズする為のダッシュボードやアラート機能などが、Alibaba Cloud のコンソールと連携され、シームレスに統合された環境での利用が可能となっています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210322180252.png "img")

     


# モニタリング設定

では、実際にセットアップから操作するまでを試していきたいと思います。  
大まかな流れとしては、 ACK クラスタへ監視エージェント （PromAgent） をセットアップし、検証用に作成した Redis コンテナに対してモニタリング設定を行いコンソールから操作してみます。

## エージェントインストール

ACK クラスタへエージェントをインストールする方法としては、ACK クラスタ作成時にエージェントを有効にする方法と、ACK クラスタ作成後にエージェントをインストールする方法があります。
今回は、ACK クラスタ作成時にエージェントをインストールしたいと思います。  

ACK クラスタ作成画面を進んでいくと、後半の各種コンポーネント設定画面から [Monitoring Agents] 項目の [Enable Prometheus Monitoring] にチェックを入れて作成する事で、エージェントがインストールされたクラスタが作成されます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210310154810.png "img")

     

作成した ACK クラスタを確認してみると、[arms-prom] ネームスペースへ Pod や Service がデプロイされます。
```
$ kubectl get pod -n arms-prom
NAMESPACE     NAME                                                  READY   STATUS      RESTARTS   AGE
arms-prom     arms-prometheus-ack-arms-prometheus-68cb5d578-mn79q   1/1     Running     0          42m
arms-prom     kube-state-metrics-749c9978d7-jjkg4                   1/1     Running     0          42m
arms-prom     node-exporter-g55jv                                   2/2     Running     0          42m
arms-prom     node-exporter-t648g                                   2/2     Running     0          42m
arms-prom     node-exporter-wwm84                                   2/2     Running     0          42m
```

```
$ kubectl get svc -n arms-prom
NAME                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)             AGE
arms-prom-admin      ClusterIP   172.16.191.207   <none>        9335/TCP            43m
arms-prom-server     ClusterIP   172.16.56.118    <none>        9090/TCP            43m
kube-state-metrics   ClusterIP   172.16.78.11     <none>        8080/TCP,8081/TCP   43m
node-exporter        ClusterIP   None             <none>        9100/TCP            43m
node-gpu-exporter    ClusterIP   172.16.100.9     <none>        9445/TCP            43m
```

     

## コンソール

エージェントがインストールされた状態で、対象の ACK クラスタをコンソールから確認してみます。  
コンソールの [Operations] - [Prometheus Monitoring] を選択するとダッシュボードが表示されます。  
デフォルトでいくつかのダッシュボードがすでに作成されています。    
右上のリンクからは、 ARMS Prometheus のコンソールやアラート設定、Grafana のダッシュボードへ接続する事ができるようになっています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210310160537.png "img")

     

[Open in New Window] から Grafana のダッシュボードを操作する事ができます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210310161053.png "img")


     

[Go to ARMS] から ARMS Prometheus のコンソールへ移動します。 Prometheus の各種設定を行う場合は、こちらのコンソールから設定を行います。  
ただし、まだベータ機能が多い状態なので、利用する際は提供されている機能の確認が必要です。こちらについては、今後のリリースに期待したいところです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210310161539.png "img")

     

## Redis セットアップ

では、ドキュメントへ記載されている手順を参考に、Redis エクスポーター使用して、ARMS Prometheus で Redis をモニタリングしてみます。  
今回は検証が目的の為、設定内容は簡易的な形で進めたいと思います。  
詳しい手順は以下のドキュメントへ記載されていますので、参考までにリンクを記載しておきます。

> https://www.alibabacloud.com/cloud-tech/doc-detail/140606.htm

     
モニタリング対象となる Redis コンテナを準備する為、以下のマニフェストを実行し、Pod, Service をデプロイしておきます。

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis
        imagePullPolicy: Always
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        ports:
        - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  labels:
    app: redis
spec:
  ports:
  - port: 6379
    targetPort: 6379
  selector:
    app: redis
```

     

## エクスポーターセットアップ

次にエクスポーターの設定です。以下のマニフェストで、エクスポーターの Deploymen,  Service, ServiceMonitor をデプロイしていきます。  
ARMS Prometheus では、Prometheus Operator と同様に ServiceMonitor を設定する事で、対象のエクスポーターをスクレイプし、メトリクスを収集する事ができるようになっています。

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-exporter
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis-exporter
  template:
    metadata:
      labels:
        app: redis-exporter
    spec:
      containers:
      - name: redis-exporter
        imagePullPolicy: Always
        env:
        - name: REDIS_ADDR
          value: "redis://redis:6379"
        - name: REDIS_PASSWORD
          value: ""
        - name: REDIS_EXPORTER_DEBUG
          value: "1"
        image: oliver006/redis_exporter
        ports:
        - containerPort: 9121
          name: redis-exporter
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: redis-exporter
  namespace: default
spec:
  endpoints:
  - interval: 30s
    port: redis-exporter
    path: /metrics
  namespaceSelector:
    any: true
  selector:
    matchLabels:
      app: redis-exporter
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: redis-exporter
  name: redis-exporter
spec:
  ports:
  - name: redis-exporter
    port: 9121
    protocol: TCP
    targetPort: 9121
  type: NodePort
  selector:
    app: redis-exporter
```

     

## メトリクス確認

デプロイが完了したらコンソールを確認してみましょう。  
ARMS Prometheus の [Settings] - [Targets (beta)] - [default/redis-exporter/0 (1/1 up)] を選択すると、Redis エクスポーター から取得されたメトリクスを確認する事ができます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210315173325.png "img")

     

取得されたメトリクスを確認する事ができます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210315173501.png "img")

     
 
## ダッシュボード作成

Grafana へ接続し、Redis のダッシュボードを作成していきます。  
Redis のテンプレートをインポートする為、[import] から Redis のテンプレートをロードます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210315174524.png "img")

     

Redis のテンプレート [763] を入力し [Load] します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210315175045.png "img")

     

 [Folder] [prom] を今回の環境に合わせて選択し [import] します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210315175223.png "img")

     

以上で Grafana へ Redis のダッシュボードが作成されました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210318155803.png "img")

     

Grafana へ作成した Redis のダッシュボードは、ACK のコンソールからも確認する事ができるようになっています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210318155942.png "img")

     

# まとめ

今回はARMS  Prometheus を使用し、ACK へデプロイした Redis コンテナへのモニタリング設定を行ってみました。  
ARMS  Prometheus では、Prometheus のコンポーネントをマネージドで利用でき、コンソールから簡単に設定する事が出来るなど、 Alibaba Cloud で Prometheus を使用する選択枠の１つとして検討できるプロダクトになっているのではないでしょうか。

 <CommunityAuthor 
    author="有馬 茂人"
    self_introduction = "2018年ソフトバンクへjoin。普段はIaC・コンテナ・Kubernetes等を触っているエンジニアです。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/arima.jpeg"
    githubUrl="https://github.com/s-ari"
/>


