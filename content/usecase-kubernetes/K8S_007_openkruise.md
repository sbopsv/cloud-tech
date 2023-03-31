---
title: "ACKでOpenKruise"
metaTitle: "ACK で OpenKruise をためしてみた"
metaDescription: "ACK で OpenKruise をためしてみた"
date: "2021-04-26"
author: "有馬 茂人"
thumbnail: "/Container_images_26006613715945600/20210414114035.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## ACK で OpenKruise をためしてみた

本記事では、オープンソースで提供されている OpenKruise を、Container Service for Kubernetes (ACK) へデプロイして動作する方法を記載します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613715945600/20210414114035.png "img")

--- 

# Alibaba サービスでのコンテナ利用の背景

Alibaba では以前からサービスのコアシステムとして、Kubernetes ベースのクラウドネイティブ環境へ移行を行ってきました。     
Double 11 Global Shopping Festival などを含む、Alibaba サービスで利用されているコンテナクラスター内のアプリケーションの数は100,000を超え、そのコンテナーの数は数百万に達しています。     
このような大規模な環境下でのコンテナリリース管理では、多数のアプリケーションのアップデートで発生する Pod のスケジューリング・ディスク割り当て・イメージ取得などにより、リリース完了までの時間がさらに長くなります。     
Kubernetes ネイティブワークロードだけでこれらの要件を満たす事は難しく、Alibaba Cloud ではこの問題を解決する為に OpenKruise を開発しました。     
OpenKruiseは、Alibaba サービスの多くのアプリケーションの展開とリリース管理で使用されています。      

---

    

# OpenKruise の主な特徴

OpenKruise は Alibaba Cloud によって大規模アプリケーション向けに開発された、オープンソースのアプリケーションマネージメントエンジンです。    
Deployment や StatefulSet など、Kubernetes ネイティブワークロードと同様の機能に加え、多くの拡張機能を提供しています。  
現在 OpenKruise は、Cloud-Native Computing Foundation（CNCF）の下、サンドボックスプロジェクトとしてホストされています。   

OpenKruise の重要な機能の１つに「<b>インプレースアップデート</b>」があります。リリース時にコンテナーを再作成・スケジュールする事なく Pod のイメージのみをアップグレードする事ができます。   
Alibaba 環境ではこの機能を利用し、従来のアップグレードよりも展開速度が80％以上向上しました。     
その他にも、サイドカーコンテナインジェクションやドメイン単位でのワークロード管理、イメージのプレダウンロードをサポートしています。   

## ◆ インプレースアップデート
・ Pod を削除および再作成せずにコンテナイメージを更新する方法で、Pod の配置先やIPアドレス・名前などが変更されないため、アップデーと時間を短縮します。

## ◆ サイドカーマネージ
・ Pod へサイドカーコンテナをインジェクトし管理します。

## ◆ マルチフォールトドメインデプロイメント
・ さまざまなドメインのワークロードのレプリカ、テンプレートおよびアップデートを管理できます。

## ◆ イメージプレダウンロード
・指定したノードへコンテナイメージをダウンロードします。

---

    

# リソース

OpenKruise で利用可能なリソースには、上記で説明した特徴的な機能が含まれており、各リソース名からもわかるように、Kubernetes のネイティブリソースを拡張させたような機能が利用できるようになっています。
以下に各リソースを簡単にまとめてみましたが、詳細な設定内容を確認したい場合は、オフィシャルのドキュメントを参照頂ければと思います。

> https://openkruise.io/


### CloneSet

CloneSet は、ステートレスアプリケーションを管理するためのリソースで、スケールアウト、スケールイン、インプレースアップデートや指定した Pod の削除などが実行でき、Deployment を拡張したようなリソースです。

### Advanced StatefulSet

Advanced StatefulSet は、インプレースアップデート、MaxUnavailable を使用したローリングアップデートがサポートされた StatefulSet を拡張したリソースです。

### SidecarSet

SidecarSet は AdmissionWebhook を使用し、 Pod にサイドカーコンテナをインジェクトします。サイドカーコンテナのインプレースアップデート、ボリュームのマウントをサポートしています。

### Advanced DaemonSet

Advanced DaemonSet は、ノードに１つだけ Pod を展開し、MaxSurge, partition, Pause を使用したローリングアップデートをサポートしています。

### UnitedDeployment

UnitedDeployment は、クラスター内のラベルで識別された複数ノードのグループに対してリソースを Pod をデプロイします。
statefulSetTemplate, advancedStatefulSetTemplate, cloneSetTemplate, deploymentTemplate をサポートしています。

### BroadcastJob

BroadcastJob は、クラスター内の全てのノードへ Pod をデプロイしジョブを実行します。

### AdvancedCronJob

AdvancedCronJob は、スケジュールされたジョブや BroadcastJob を実行します。

### ImagePullJob

ImagePullJob は、selector を使用して指定したノードへコンテナイメージをダウンロードし、事前にイメージをウォームアップします。

    

# 実行例

では、公式ドキュメントを参考に動作を確認して行きたいと思います。  
事前準備として、OpenKruise を Kubernetes 環境へデプロイしておく必要があり、Alibaba Cloud の ACK コンソールの App Catalog からもデプロイする事も出来るのですが、こちらは最新バージョンではない為、今回はドキュメント記載の Helm からセットアップしています。

デプロイすると CustomResourceDefinition (CRD) , Service , Deployment, Daemonset が作成されます。
```
$ helm install kruise https://github.com/openkruise/kruise/releases/download/v0.8.1/kruise-chart.tgz

$ kubectl get all -n kruise-system
NAME                                             READY   STATUS    RESTARTS   AGE
pod/kruise-controller-manager-6797f89d9b-28vg9   1/1     Running   0          26s
pod/kruise-controller-manager-6797f89d9b-hkz7f   1/1     Running   0          26s
pod/kruise-daemon-9ss7t                          1/1     Running   0          26s
pod/kruise-daemon-dgtr7                          1/1     Running   0          26s
pod/kruise-daemon-jcjvn                          1/1     Running   0          26s

NAME                             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/kruise-webhook-service   ClusterIP   172.16.13.160   <none>        443/TCP   26s

NAME                           DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
daemonset.apps/kruise-daemon   3         3         3       3            3           <none>          26s

NAME                                        READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/kruise-controller-manager   2/2     2            2           26s

NAME                                                   DESIRED   CURRENT   READY   AGE
replicaset.apps/kruise-controller-manager-6797f89d9b   2         2         2       26s


$ kubectl get crd | grep kruise
advancedcronjobs.apps.kruise.io                  2021-04-14T06:14:48Z
broadcastjobs.apps.kruise.io                     2021-04-14T06:14:48Z
clonesets.apps.kruise.io                         2021-04-14T06:14:48Z
daemonsets.apps.kruise.io                        2021-04-14T06:14:48Z
imagepulljobs.apps.kruise.io                     2021-04-14T06:14:48Z
nodeimages.apps.kruise.io                        2021-04-14T06:14:48Z
sidecarsets.apps.kruise.io                       2021-04-14T06:14:48Z
statefulsets.apps.kruise.io                      2021-04-14T06:14:48Z
uniteddeployments.apps.kruise.io                 2021-04-14T06:14:48Z

```

    

## CloneSet

OpenKruise の重要な機能の一つである「インプレースアップデート」と、Pod のスケールインの際に指定した Pod を削除する 「Selective Pod deletion」 を CloneSet から実行してみます。  
インプレースアップデートを使用する事で、Pod の Name, IPアドレス , 起動しているホストを変更せず、コンテナイメージだけアプデートすることが出来るようになっています。 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613715945600/20210422151405.png "img")

    

ドキュメント記載のサンプルマニフェストを作成し CloneSet をデプロイします。  
```updateStrategy``` へ ```type: InPlaceOnly``` を設定することで、インプレースアップデートでアップデートが実行されるようになります。
```
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  labels:
    app: sample
  name: sample
spec:
  replicas: 5
  selector:
    matchLabels:
      app: sample
  updateStrategy:
    type: InPlaceOnly
  template:
    metadata:
      labels:
        app: sample
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
```

    

CloneSet から ```nginx:alpine``` イメージで Pod が作成されました。  
作成された Pod のステータスを確認しておきます。
```
$ kubectl get cloneset
NAME     DESIRED   UPDATED   UPDATED_READY   READY   TOTAL   AGE
sample   5         5         5               5       5       15s

$ kubectl get pod -o wide
NAME           READY   STATUS    RESTARTS   AGE   IP           NODE                           NOMINATED NODE   READINESS GATES
sample-4d2gd   1/1     Running   0          16s   10.8.0.150   ap-northeast-1.192.168.1.170   <none>           1/1
sample-7457c   1/1     Running   0          16s   10.8.0.148   ap-northeast-1.192.168.1.170   <none>           1/1
sample-kh852   1/1     Running   0          16s   10.8.0.147   ap-northeast-1.192.168.1.170   <none>           1/1
sample-tcnpm   1/1     Running   0          16s   10.8.0.149   ap-northeast-1.192.168.1.170   <none>           1/1
sample-tvrb7   1/1     Running   0          16s   10.8.0.151   ap-northeast-1.192.168.1.170   <none>           1/1


$ kubectl get pods sample-4d2gd -o jsonpath='Name: {.metadata.name}{"\n"}uid: {.metadata.uid}{"\n"}hostIP: {.status.hostIP}{"\n"}podIP: {.status.podIP}{"\n"}image: {.status.containerStatuses[].image}{"\n"}'
Name: sample-4d2gd
uid: 9cae0047-8f4b-448f-bc35-c804ff4b3fbe
hostIP: 192.168.1.170
podIP: 10.8.0.150
image: nginx:alpine
```

    

ではコンテナイメージを```nginx:alpine``` から debian ベースの```nginx:latest```へマニフェストを変更しデプロイします。  
一度 Pod が再起動された為 ```RESTARTS``` が ```1``` になっています 。  
Pod のステータスを確認すると、アップデート前と同じ状態のままでコンテナイメージだけが変更されています。

```
$ kubectl get pod -o wide
NAME           READY   STATUS    RESTARTS   AGE     IP           NODE                           NOMINATED NODE   READINESS GATES
sample-4d2gd   1/1     Running   1          2m43s   10.8.0.150   ap-northeast-1.192.168.1.170   <none>           1/1
sample-7457c   1/1     Running   1          2m43s   10.8.0.148   ap-northeast-1.192.168.1.170   <none>           1/1
sample-kh852   1/1     Running   1          2m43s   10.8.0.147   ap-northeast-1.192.168.1.170   <none>           1/1
sample-tcnpm   1/1     Running   1          2m43s   10.8.0.149   ap-northeast-1.192.168.1.170   <none>           1/1
sample-tvrb7   1/1     Running   1          2m43s   10.8.0.151   ap-northeast-1.192.168.1.170   <none>           1/1


$ kubectl get pods sample-4d2gd  -o jsonpath='Name: {.metadata.name}{"\n"}uid: {.metadata.uid}{"\n"}hostIP: {.status.hostIP}{"\n"}podIP: {.status.podIP}{"\n"}image: {.status.containerStatuses[].image}{"\n"}'
Name: sample-4d2gd
uid: 9cae0047-8f4b-448f-bc35-c804ff4b3fbe
hostIP: 192.168.1.170
podIP: 10.8.0.150
image: nginx:latest
```

    

次に Pod のスケールインで、指定した Pod だけ削除される Selective Pod deletion を試してみます。  
こちらは、先ほどのマニフェストへ ```scaleStrategy:podsToDelete:- <削除したいPod>```  を設定します。今回は ```replicas``` を ```4 ``` へ変更し ```sample-4d2gd``` が削除されるようにしてみます。  
※ podsToDelete を設定しない場合は、ランダムに Pod が削除されます。
```
apiVersion: apps.kruise.io/v1alpha1
kind: CloneSet
metadata:
  labels:
    app: sample
  name: sample
spec:
  replicas: 4
  scaleStrategy:
    podsToDelete:
    - sample-4d2gd
  selector:
    matchLabels:
      app: sample
  updateStrategy:
    type: InPlaceOnly
  template:
    metadata:
      labels:
        app: sample
    spec:
      containers:
      - name: nginx
        image: nginx:latest
```

    

指定した ```sample-4d2gd``` が削除され、CloneSet の値も更新されています。
```
$ kubectl get pod -o wide
NAME           READY   STATUS        RESTARTS   AGE   IP           NODE                           NOMINATED NODE   READINESS GATES
sample-4d2gd   0/1     Terminating   1          12m   10.8.0.150   ap-northeast-1.192.168.1.170   <none>           1/1
sample-7457c   1/1     Running       1          12m   10.8.0.148   ap-northeast-1.192.168.1.170   <none>           1/1
sample-kh852   1/1     Running       1          12m   10.8.0.147   ap-northeast-1.192.168.1.170   <none>           1/1
sample-tcnpm   1/1     Running       1          12m   10.8.0.149   ap-northeast-1.192.168.1.170   <none>           1/1
sample-tvrb7   1/1     Running       1          12m   10.8.0.151   ap-northeast-1.192.168.1.170   <none>           1/1

$ kubectl get pod -o wide
NAME           READY   STATUS    RESTARTS   AGE   IP           NODE                           NOMINATED NODE   READINESS GATES
sample-7457c   1/1     Running   1          12m   10.8.0.148   ap-northeast-1.192.168.1.170   <none>           1/1
sample-kh852   1/1     Running   1          12m   10.8.0.147   ap-northeast-1.192.168.1.170   <none>           1/1
sample-tcnpm   1/1     Running   1          12m   10.8.0.149   ap-northeast-1.192.168.1.170   <none>           1/1
sample-tvrb7   1/1     Running   1          12m   10.8.0.151   ap-northeast-1.192.168.1.170   <none>           1/1

$ kubectl get cloneset
NAME     DESIRED   UPDATED   UPDATED_READY   READY   TOTAL   AGE
sample   4         4         4               4       4       20m
```

    

## SidecarSet

Pod へ サイドカーコンテナをインジェクトする SidecarSet を実行してみたいと思います。  
SidecarSet は指定したラベルにマッチした Pod に対して、サイドカーコンテナを自動的にインジェクトします。  
ロギングやモニタリング・コンテンツ共有などの、サイドカーパターンなどでの利用が想定されます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613715945600/20210421171250.png "img")

では、こちらも公式ドキュメントのサンプルを参考に、SidecarSet を実行していきます。  
実行内容として、はじめに SidecarSet を作成、その後に Pod をデプロイしサイドカーコンテナのインジェクトを確認します。  
SidecarSet では Volume を利用する事が出来るので、今回は SidecarSet でインジェクトされたサイドカーコンテナと、  
Pod のメインコンテナ で emptyDir をマウントし、コンテナ間でのデータ共有も確認してみたいと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613715945600/20210422151433.png "img")

SidecarSet のマニフェストを作成しデプロイします。  
サイドカーコンテナをインジェクトする Pod のラベル ```app:busybox``` をセレクターへ設定します。  
ボリュームの設定として、emptyDir で ボリュームを /var/log へマウントするようにも設定しています。
```
apiVersion: apps.kruise.io/v1alpha1
kind: SidecarSet
metadata:
  name: test-sidecarset
spec:
  selector:
    matchLabels:
      app: busybox
  updateStrategy:
    type: RollingUpdate
    maxUnavailable: 1
  containers:
  - name: sidecar
    image: centos:7
    args:
    - /bin/sh
    - -c
    - sleep 3600
    volumeMounts:
    - name: log-volume
      mountPath: /var/log
  volumes:
  - name: log-volume
    emptyDir: {}
```

    

SidecarSet が作成されました。
```
$ kubectl get sidecarsets
NAME              MATCHED   UPDATED   READY   AGE
test-sidecarset   0         0         0       11s
```

    

次に Pod のラベルへ ```app: busybox``` を設定しデプロイします。    
こちらも emptyDir で ボリュームを /var/log へマウントし、データ共有を確認するためテストファイルを書き込むようにしておきます。
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: busybox # matches the SidecarSet's selector
  name: test-pod
spec:
  containers:
  - image: busybox
    name: main
    args:
    - /bin/sh
    - -c
    - echo "sidecar test" > /var/log/test.log && sleep 3600
    volumeMounts:
    - name: log-volume
      mountPath: /var/log
  volumes:
  - name: log-volume
    emptyDir: {}
```

    

Pod をデプロイすると、```READY``` が ```2/2``` となり、Pod へ サイドカーコンテナ (sidecar) と、メインコンテナー ( busybox) が作成されます。
```
$ kubectl get sidecarsets
NAME              MATCHED   UPDATED   READY   AGE
test-sidecarset   1         1         1       66s

$ kubectl get pod -o wide
NAME       READY   STATUS    RESTARTS   AGE   IP           NODE                           NOMINATED NODE   READINESS GATES
test-pod   2/2     Running   0          6s    10.8.0.183   ap-northeast-1.192.168.1.170   <none>           <none>

$ kubectl describe pod test-pod | tail
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  37s   default-scheduler  Successfully assigned default/test-pod to ap-northeast-1.192.168.1.170
  Normal  Pulled     36s   kubelet            Container image "centos:7" already present on machine
  Normal  Created    36s   kubelet            Created container sidecar
  Normal  Started    36s   kubelet            Started container sidecar
  Normal  Pulling    36s   kubelet            Pulling image "busybox"
  Normal  Pulled     34s   kubelet            Successfully pulled image "busybox" in 2.655062088s
  Normal  Created    34s   kubelet            Created container main
  Normal  Started    34s   kubelet            Started container main
```

    

2つのコンテナからマウントされたボリュームで、テストファイルを参照する事ができています。
```
$ kubectl exec -it test-pod -c main -- cat /var/log/test.log
sidecar test

$ kubectl exec -it test-pod -c sidecar -- cat /var/log/test.log
sidecar test
```

    

# まとめ

OpenKruise の CloneSet と SidecarSet をためしてみましたが、ご紹介できなかった他のリソースについても簡単に実行できるようになっています。  
今回参考にした OpenKruise 公式ドキュメントの他、Alibaba Cloud のブログにも OpenKruise の導入背景や機能が詳しく書かれているので、もしご興味があればぜひ参照してみてください。

> https://community.alibabacloud.com/tags/type_blog-tagid_29383/



 <CommunityAuthor 
    author="有馬 茂人"
    self_introduction = "2018年ソフトバンクへjoin。普段はIaC・コンテナ・Kubernetes等を触っているエンジニアです。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/arima.jpeg"
    githubUrl="https://github.com/s-ari"
/>



