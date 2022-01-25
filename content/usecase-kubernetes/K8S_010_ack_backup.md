---
title: "ACKをバックアップ"
metaTitle: "VeleroでContainer Service for Kubernetes (ACK) をバックアップする"
metaDescription: "VeleroでContainer Service for Kubernetes (ACK) をバックアップする"
date: "2020-04-17"
author: "sbc_sarima"
thumbnail: "/Container_images_26006613549307100/20200416144229.png"
---

## VeleroでContainer Service for Kubernetes (ACK) をバックアップする

# はじめに

本記事では、Veleroを使用して、Container Service for Kubernetes (ACK)  のバックアップについてをご紹介します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613549307100/20200416144229.png "img")      

Kubernetesを利用した環境では、マニフェストへ必要なリソースを定義し、Git等で管理を行う事で容易にアプリケーションのデプロイを行えるようしている場合が多いかと思います。
マニフェストの利用と合わせて、Kubernetesクラスタ上へデプロイされたアプリケーション等の環境を、バックアップしておきたいケースもあるのではないでしょうか。  
Container Service for Kubernetes (ACK) では、Veleroを使用してバックアップ・リストアの実行が可能です。

     

## Veleroについて
Velero(以前はHeptio Ark)はKubernetesクラスタリソースのバックアップ・リストアを行うツールです。  
現在はVMwareのOpen Source Projectsとして開発されており、複数のプロバイダーがサポートされています。  
サポートされている機能は大まかに以下のような内容となっています。  

* <span style="color: #FE6A00"><span style="font-size: 100%">・</span></span>バックアップとリストア
  *  <span style="color: #FE6A00">  -</span> クラスタリソース
  *  <span style="color: #FE6A00">  -</span> 永続ボリューム（スナップショットを利用します）
* <span style="color: #FE6A00">・</span>バックアップのスケジューリング
* <span style="color: #FE6A00">・</span>バックアップフック




Alibaba CloudのContainer Service for Kubernetes (ACK) でVeleroを使用する場合、<span style="color: #ff0000">コミュニティーから提供されているVelero Plugin</span>を利用します。    
今回はそちらを設定し、Kubernetesクラスタ上のリソースを、<span style="color: #ff0000">Alibaba Cloudのオブジェクトストレージサービス(OSS) へバックアップ</span>し、リストアしてみたいと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613549307100/20200415125102.png "img")

> https://velero.io/docs/v1.3.2/supported-providers/

     

# インストールと各種設定

Alibaba CloudでVeleroを利用する場合のインストールや、バックアップ・リストア等の手順は、Alibaba CloudのGithubリポジトリへ手順がありますので、  
今回はその内容に従って進めて行きます。

> https://github.com/AliyunContainerService/velero-plugin

     

## OSSバケットの準備

バックアップファイルがアップロードされるOSSへ、バケットを作成しておきます。    
今回は「ack-backup」という名前で作成しました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613549307100/20200413154123.png "img")      

     

## Velero CLIのインストール

Githubから最新のVelero CLIをインストールします。  
CLIはPATHが通っているディレクトリへ設置します。

```
# wget https://github.com/vmware-tanzu/velero/releases/download/v1.3.2/velero-v1.3.2-linux-amd64.tar.gz
# tar zxvf velero-v1.3.2-linux-amd64.tar.gz 
# mv velero-v1.3.2-linux-amd64/velero /usr/local/bin/
```

> https://github.com/vmware-tanzu/velero/releases

## RAMユーザの作成

Alibaba Cloudの各APIを実行する為のRAMユーザを作成し、Cloud Disk, Snapshot, OSSへのアクセス権限ポリシーを適応します。  
作成したRAMユーザへ、後ほど設定するAccessKeyも作成しておきます。

カスタムポリシー
```
{
    "Version": "1",
    "Statement": [
        {
            "Action": [
                "ecs:DescribeSnapshots",
                "ecs:CreateSnapshot",
                "ecs:DeleteSnapshot",
                "ecs:DescribeDisks",
                "ecs:CreateDisk",
                "ecs:Addtags",
                "oss:PutObject",
                "oss:GetObject",
                "oss:DeleteObject",
                "oss:GetBucket",
                "oss:ListObjects"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        }
    ]
}

```


## Credential 設定

GithubからAlibaba CloudのVelero Pluginリポジトリをローカルへダウンロードします。  

```
# git clone https://github.com/AliyunContainerService/velero-plugin.git
```

     

ダウンロードしたリポジトリの設定ファイル「credentials-velero」へ、作成したAccessKeyIDとAccessKeySecretを作成します。  
<i>velero-plugin/install/credentials-velero</i>

```
ALIBABA_CLOUD_ACCESS_KEY_ID=<ALIBABA_CLOUD_ACCESS_KEY_ID>
ALIBABA_CLOUD_ACCESS_KEY_SECRET=<ALIBABA_CLOUD_ACCESS_KEY_SECRET>
```


     

## 変数設定

作成した OSS のバケット名とリージョンを変数へ設定します。

```
# BUCKET=ack-backup
# REGION=ap-northeast-1
```

     

## NamespaceとSecret 作成
Veleroをインストールする為のNamespace を作成します。   

```
# kubectl create namespace velero
```

     

AccessKeyIDとAccessKeySecretを設定したファイルを指定し、Secretを作成します。    

```
# kubectl create secret generic cloud-credentials --namespace velero --from-file cloud=install/credentials-velero
```

     

NamespaceとAccessKeyのSecretが作成されました。   

```
# kubectl get ns velero
NAME     STATUS   AGE
velero   Active   2m52s

# kubectl get secret cloud-credentials -n velero
NAME                TYPE     DATA   AGE
cloud-credentials   Opaque   1      108s
```

     

## VeleroとPluginインストール

CustomResourceDefinitionを作成します。  

```
# kubectl apply -f install/00-crds.yaml
customresourcedefinition.apiextensions.k8s.io/backups.velero.io created
customresourcedefinition.apiextensions.k8s.io/backupstoragelocations.velero.io created
customresourcedefinition.apiextensions.k8s.io/deletebackuprequests.velero.io created
customresourcedefinition.apiextensions.k8s.io/downloadrequests.velero.io created
customresourcedefinition.apiextensions.k8s.io/podvolumebackups.velero.io created
customresourcedefinition.apiextensions.k8s.io/podvolumerestores.velero.io created
customresourcedefinition.apiextensions.k8s.io/resticrepositories.velero.io created
customresourcedefinition.apiextensions.k8s.io/restores.velero.io created
customresourcedefinition.apiextensions.k8s.io/schedules.velero.io created
customresourcedefinition.apiextensions.k8s.io/serverstatusrequests.velero.io created
customresourcedefinition.apiextensions.k8s.io/volumesnapshotlocations.velero.io created
```

     

マニフェストへ作成したOSSのバケット名とリージョンを設定します。    

```
# sed -i "s#<BUCKET>#$BUCKET#" install/01-velero.yaml
# sed -i "s#<REGION>#$REGION#" install/01-velero.yaml
```

     

VeleroとPluginをデプロイします。

```
# kubectl apply -f install/01-velero.yaml
serviceaccount/velero created
clusterrolebinding.rbac.authorization.k8s.io/velero created
backupstoragelocation.velero.io/default created
volumesnapshotlocation.velero.io/default created
deployment.extensions/velero created
```

     

# バックアップとリストア

ではバックアップとリストアを実施してみたいと思います。  
今回は簡単な検証環境をデプロイし、作成されたリソースをバックアップ・リストアします。  
また、<b><span style="color: #ff0000">バックアップされたオブジェクトはOSSへアップロードされます。  </span></b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613549307100/20200417112548.png "img")      

## 環境準備

examplesのマニフェストをデプロイすると、以下のリソースが作成される為、こちらの環境を利用しバックアップ・リストアを実施します。

![検証環境](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613549307100/20200417112840.png "検証環境")      

     

ダウンロードしたリポジトリの中のexamplesをデプロイし、検証環境を作成します。    

```
# kubectl apply -f examples/base.yaml
namespace/nginx-example created
deployment.apps/nginx-deployment created
service/my-nginx created
```

     

Namespace, Service, Deployment, ReplicaSet, Pod, が作成されました。    

```
# kubectl get all -n nginx-example
NAME                                    READY   STATUS    RESTARTS   AGE
pod/nginx-deployment-54f57cf6bf-7c5pj   1/1     Running   0          71s
pod/nginx-deployment-54f57cf6bf-p4krg   1/1     Running   0          71s

NAME               TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)        AGE
service/my-nginx   LoadBalancer   172.21.5.66   47.245.35.225   80:31181/TCP   71s

NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-deployment   2/2     2            2           71s

NAME                                          DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-deployment-54f57cf6bf   2         2         2       71s
```

     

## バックアップ

では、デプロイした検証環境のバックアップを取得してみます。  
ローカルへインストールしたVelero CLIから各操作を実行します。  
「nginx-backup」という名前で、Namespace「nginx-example」 のバックアップを取得します。    

```
# velero backup create nginx-backup --include-namespaces nginx-example --wait
Backup request "nginx-backup" submitted successfully.
Waiting for backup to complete. You may safely press ctrl-c to stop waiting - your backup will continue in the background.
.
Backup completed with status: Completed. You may check for more information using the commands `velero backup describe nginx-backup` and `velero backup logs nginx-backup`.
```

     

バックアップの取得が完了しました。
```
# velero get backups 
NAME           STATUS      CREATED                         EXPIRES   STORAGE LOCATION   SELECTOR
nginx-backup   Completed   2020-04-14 13:30:19 +0900 JST   29d       default            <none>
```

     

バックアップ用に作成したOSSのバケットを確認すると、バックアップされたオブジェクトがアップロードされている事が確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613549307100/20200414133729.png "img")      

     

## リストア

次にリストアを実行する為、作成したリソースは削除しておきます。     

```
# kubectl delete namespaces nginx-example
namespace "nginx-example" deleted
```

     

作成したリソースが削除されました。    

```
# kubectl get all -n nginx-example
No resources found in nginx-example namespace.
```

     

先ほど取得したバックアップから、Velero CLIを使用しリストアを実行します。     

```
# velero restore create --from-backup nginx-backup --wait
Restore request "nginx-backup-20200414135145" submitted successfully.
Waiting for restore to complete. You may safely press ctrl-c to stop waiting - your restore will continue in the background.

Restore completed with status: Completed. You may check for more information using the commands `velero restore describe nginx-
backup-20200414135145` and `velero restore logs nginx-backup-20200414135145`.
```

     

バックアップした時と同じリソースが作成され、Velero CLIからもリストアが完了している事が確認できます。    

```
# kubectl get all -n nginx-example
NAME                                    READY   STATUS    RESTARTS   AGE
pod/nginx-deployment-54f57cf6bf-7c5pj   1/1     Running   0          21s
pod/nginx-deployment-54f57cf6bf-p4krg   1/1     Running   0          21s

NAME               TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)        AGE
service/my-nginx   LoadBalancer   172.21.11.176   47.74.46.252   80:32636/TCP   21s

NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-deployment   2/2     2            2           21s

NAME                                          DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-deployment-54f57cf6bf   2         2         2       21s
```

```
# velero restore get
NAME                                 BACKUP                STATUS      WARNINGS   ERRORS   CREATED                         SELECTOR
nginx-backup-20200414135145          nginx-backup          Completed   0          0        2020-04-14 13:51:45 +0900 JST   <none>
```

     

## スケジュール

Veleroではスケジュールを設定する事ができる為、定期的なバックアップの取得が可能となっています。  
以下の例では、5分毎にバックアップを実行するように設定しています。  
オンデマンドでのバックアップと、スケジュールからのバックアップを利用する事で、任意のタイミングでバックアップを取得する事ができます。

```
# velero schedule create nginx-backup-schedule --include-namespaces nginx-example --schedule "*/5 * * * *"
Schedule "nginx-backup-schedule" created successfully.

# velero get schedules
NAME                    STATUS    CREATED                         SCHEDULE      BACKUP TTL   LAST BACKUP   SELECTOR
nginx-backup-schedule   Enabled   2020-04-15 12:57:00 +0900 JST   */5 * * * *   720h0m0s     15s ago       <none>
```

     

# まとめ

Veleroを使用して、KubernetesクラスタリソースをAlibaba CloudのOSSへバックアップし、リストアする手順を試してみました。  
既存環境からバックアップを取得しておく事で、ディザスタ対策やマイグレーション等で利用できるシーンもあるのではないでしょうか。  


今回は永続ボリュームのバックアップ等の手順は省略しましたが、Veleroのドキュメントへ詳細な内容が記載されておりますので、  
参考にして頂ければと思います。  
また、Alibaba Cloudのドキュメントにも、Veleroを利用したマイグレーション例も記載されておりますので、こちらもご覧頂ければと思います。


> https://www.alibabacloud.com/cloud-tech/doc-detail/146618.htm

> https://velero.io/

