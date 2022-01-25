---
title: "SLB/Cloud Disk/NAS/OSS連携"
metaTitle: "Container Service for Kubernetes (ACK) と Alibaba Cloud プロダクトを連携する Part 1  (SLB, Cloud Disk, NAS, OSS)"
metaDescription: "Container Service for Kubernetes (ACK) と Alibaba Cloud プロダクトを連携する Part 1  (SLB, Cloud Disk, NAS, OSS)"
date: "2020-04-13"
author: "有馬 茂人"
thumbnail: "/Container_images_26006613544081200/20200409170716.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Container Service for Kubernetes (ACK) と Alibaba Cloud プロダクトを連携する Part 1  (SLB, Cloud Disk, NAS, OSS)

本記事では、Container Service for Kubernetes (ACK) を使用して、Alibaba Cloud の各プロダクトとの連携方法についてご紹介します。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613544081200/20200409170716.png "img")


# はじめに

クラウド環境でマネージドのKubernetesを利用する場合、そのクラウド環境のプロダクトとシームレスに連携が行える為、必要に応じてKubernetesから各プロダクトを利用するケースも多いのではないでしょうか。  
Alibaba Cloud でも、Container Service for Kubernetes (ACK) から各プロダクトとの連携が可能になっています。  
今回は、ロードバランサー（SLB）とストレージ（Cloud Disk, Object Storage Service, NAS）の連携についてご紹介したいと思います。  
また、今回ご紹介する内容については、Alibaba Cloud の Container Service for Kubernetes (ACK) ドキュメントへも設定手順が記載されていますので、合わせてご覧頂けると良いかと思います。

<span style="color: #ff0000">※ 各設定については、コンソールからも設定可能となっていますが、今回はKubernetesのマニフェストを使用し設定したいと思います。
</span>

---

# プロダクト連携

## Server LoadBlancer (SLB) 

まずは、ACKからAlibaba Cloud のSLB（ロードバランサー）を操作してみます。  
実施する内容ですが、Serviceを定義し新規にSLBを起動させる方法と、事前に作成されている既存のSLBを利用する方法を実施します。  

![構成イメージ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613544081200/20200408151018.png "構成イメージ")



今回はブラウザから動作を確認する為、事前にNginxのPodを作成しておき、そのPodに対してServiceを設定していきます。
```
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: nginx
  name: nginx
spec:
  replicas: 1
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

### 新規SLB作成

     
ACKからServiceを設定し、新規にSLBを利用するようにします。  
<span style="color: #ff0000">Serviceへ「Type: LoadBlancer」</span>を指定します。

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



     
SLBが作成され、EXTERNAL-IPへSLBのパブリックIPが付与されます。
```
# kubectl get  svc -l run=nginx
NAME    TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE
nginx   LoadBalancer   172.21.4.33   47.245.8.247   80:30526/TCP   67s
```

     
ブラウザでEXTERNAL-IPへ接続すると、Nginxのトップページが表示されました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613544081200/20200402171638.png "img")

### 既存SLB追加

次に作成済みのSLBをACKから利用する為、事前に以下のようにSLBは作成しておきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613544081200/20200402171711.png "img")

     
ACKから作成済みのSLBを利用するには、マニフェストの<span style="color: #ff0000">annotationsへSLBの各種設定</span>を行います。  
今回はannotationsへSLBのIDを指定し、既存設定の上書きを有効にする事で、作成したServiceの設定がSLBへ適応されます。  
※ はじめに作成したServiceは削除してから実行しています。

```
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-id: "lb-0iw0i70ijok17wfemjm4x" # SLBのIDを指定します
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-force-override-listeners: "true" # 既存設定を上書きします
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

     

Serviceには作成したSLBが設定され、リスナーや仮想サーバグループが設定されている事がコンソールからも確認できます。
```
# kubectl get svc -l run=nginx
NAME    TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nginx   LoadBalancer   172.21.13.199   47.245.7.99   80:31824/TCP   56s
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613544081200/20200402172705.png "img")

     
この他にも、annotationsへはSLBの各種設定を細かく設定する事が可能となっています。  
詳しくは以下のドキュメントを参照頂ければと思います。

> https://www.alibabacloud.com/cloud-tech/doc-detail/86531.htm

---

## ストレージ

続いて、ACKからAlibaba Cloud のストレージプロダクトを利用してみたいと思います。
ボリュームとして利用可能なプロダクトは、Cloud Disk, Object Storage Service (OSS), NASとなります。
また、ボリュームのプラグインとしてクラスタ作成時に「Flexvolume」か「CSI」が選択可能となっており、今回は「CSI」を使用しています。  
今回実施する手順は、各ストレージに対するPersistent VolumesとPersistentVolumeClaimを設定し、最後にPodからボリュームをマウントしてみます。  
※ 検証手順を簡略化する為、Cloud Disk, Object Storage Service (OSS), NASを１度に全てPodからマウントしています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613544081200/20200408152903.png "構成イメージ")


     
### Cloud Disk

     
ではCloud Diskから設定します。  
ボリュームとして利用するCloud Diskを事前に作成しておきます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613544081200/20200403165118.png "img")


作成したCloud Diskの<span style="color: #ff0000">ディスクIDとゾーン</span>を指定し、Persistent VolumesとPersistentVolumeClaimを設定します。
```
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: disk-pv
  labels:
    alicloud-pvname: static-disk-pv
spec:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  csi:
    driver: diskplugin.csi.alibabacloud.com
    volumeHandle: d-6we0wdz6sdpzip9uyj0e # Cloud Disk ID を指定します
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: topology.diskplugin.csi.alibabacloud.com/zone
          operator: In
          values:
          - ap-northeast-1b # アタッチ先のNodeのゾーンを指定します
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: disk-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  selector:
    matchLabels:
      alicloud-pvname: static-disk-pv
EOF
```

> https://www.alibabacloud.com/cloud-tech/doc-detail/127601.htm

     
### NAS

     
次にNASを設定します。  
事前にNASを作成しマウントポイントを追加しておきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613544081200/20200408160301.png "img")

     
NASへ追加した<span style="color: #ff0000">マウントポイント「2536074bee3-uav64.ap-northeast-1.nas.aliyuncs.com」を指定し</span>、Persistent VolumesとPersistentVolumeClaimを設定します。
```
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nas-pv
  labels:
    alicloud-pvname: nas-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteMany
  csi:
    driver: nasplugin.csi.alibabacloud.com
    volumeHandle: nas-pv
    volumeAttributes:
      server: "2536074bee3-uav64.ap-northeast-1.nas.aliyuncs.com" # マウントポイントを指定します
      path: "/csi"
      vers: "3"
      options: "noresvport,nolock"
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: nas-pvc
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 5Gi
  selector:
    matchLabels:
      alicloud-pvname: nas-pv
EOF
```

> https://www.alibabacloud.com/cloud-tech/doc-detail/134884.htm


     
### Object Storage Service (OSS)

     
OSSも同様に事前にバケットを作成しておきます。    
今回は「oss-volume」と言う名前でバケットを作成しました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613544081200/20200406165700.png "img")

作成したバケット利用する為、<span style="color: #ff0000">AccessKey ID とAccessKey の設定</span>が必要となります。  
こちらは、<span style="color: #ff0000">KubernetesのSecretへ登録</span>します。  
※ AccessKey ID とAccessKeyの値はマスクしています。

```
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: oss-secret
  namespace: default
stringData:
  akId: ***
  akSecret: ***
EOF
```

     
次にPersistent Volumesの設定ですが、先ほど登録した<span style="color: #ff0000">Secret、作成したOSSのバケット、OSSのエンドポイントを指定</span>します。

```
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: oss-pvc
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 5Gi
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: oss-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  csi:
    driver: ossplugin.csi.alibabacloud.com
    volumeHandle: data-id
    nodePublishSecretRef:
      name: oss-secret # AccessKeyIDとAccessKeyを設定したSecretを指定
      namespace: default
    volumeAttributes:
      bucket: "oss-volume" #バケットを指定
      url: "oss-ap-northeast-1-internal.aliyuncs.com" # OSSのエンドポイントを指定
      otherOpts: "-o max_stat_cache_size=0 -o allow_other"
EOF
```

> https://www.alibabacloud.com/cloud-tech/doc-detail/134903.htm

     

### ボリューム確認

     
作成したボリュームを確認してみます。各ストレージのボリュームが作成されています。
```
# kubectl get pv,pvc
NAME                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM              STORAGECLASS   REASON   AGE
persistentvolume/disk-pv   20Gi       RWO            Retain           Bound    default/disk-pvc                           3m56s
persistentvolume/nas-pv    5Gi        RWX            Retain           Bound    default/nas-pvc                            3m35s
persistentvolume/oss-pv    5Gi        RWX            Retain           Bound    default/oss-pvc                            3m21s

NAME                             STATUS   VOLUME    CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/disk-pvc   Bound    disk-pv   20Gi       RWO                           3m56s
persistentvolumeclaim/nas-pvc    Bound    nas-pv    5Gi        RWX                           3m35s
persistentvolumeclaim/oss-pvc    Bound    oss-pv    5Gi        RWX                           3m21s

```

     
先ほど作成した各ボリュームのPersistentVolumeClaim、マウント先を指定してPodを作成します。
```
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: busybox
  name: busybox
spec:
  containers:
  - image: busybox
    name: busybox
    args:
    - /bin/sh
    - -c
    - sleep 3600
    volumeMounts:
    - name: disk-pvc
      mountPath: /disk # Cloud Diskのマウント先
    - name: nas-pvc
      mountPath: /nas # NASのマウント先
    - name: oss-pvc
      mountPath: /oss # OSSのマウント先
  volumes:
  - name: disk-pvc
    persistentVolumeClaim:
      claimName: disk-pvc # CloudDisk PVC
  - name: nas-pvc
    persistentVolumeClaim:
      claimName: nas-pvc # NAS PVC
  - name: oss-pvc
    persistentVolumeClaim:
      claimName: oss-pvc # OSS PVC
EOF
```

     
起動したPodからマウントを確認します。  
先ほど作成したCloud Disk, NAS, OSSがボリュームとしてマウント出来ている事が確認できました。  

```
# kubectl exec -it busybox -- df -Th | egrep "disk|nas|oss"
ossfs                fuse.ossfs    256.0T         0    256.0T   0% /oss
/dev/vdb             ext4           19.6G     44.0M     19.5G   0% /disk
2536074bee3-qnd82.ap-northeast-1.nas.aliyuncs.com:/csi
                     nfs            10.0P         0     10.0P   0% /nas
```

     

---


# まとめ

今回はACKからロードバランサー（SLB）と、Cloud Disk, NAS, OSSの連携を試してみました。  
各実行手順については、リンク先のドキュメントへも記載されていますので、ぜひ合わせてご覧頂ければと思います。  
     
次回はLog Service, RAM等の連携についてご紹介出来ればと思います。  
最後までお読み頂き、ありがとうございました。


 <CommunityAuthor 
    author="有馬 茂人"
    self_introduction = "2018年ソフトバンクへjoin。普段はIaC・コンテナ・Kubernetes等を触っているエンジニアです。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/arima.jpeg"
    githubUrl="https://github.com/s-ari"
/>


