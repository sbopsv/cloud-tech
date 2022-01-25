---
title: "Log Service/RAM/DingTalk連携"
metaTitle: "Container Service for Kubernetes (ACK) と Alibaba Cloud プロダクトを連携する Part 2 (Log Service, RAM, DingTalk)"
metaDescription: "Container Service for Kubernetes (ACK) と Alibaba Cloud プロダクトを連携する Part 2 (Log Service, RAM, DingTalk)"
date: "2020-05-15"
author: "有馬 茂人"
thumbnail: "/Container_images_26006613563493300/20200514190005.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Container Service for Kubernetes (ACK) と Alibaba Cloud プロダクトを連携する Part 2 (Log Service, RAM, DingTalk)

本記事では、Container Service for Kubernetes (ACK) から、Alibaba Cloud の各プロダクトと連携する方法についてご紹介します。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200514190005.png "img")


# はじめに

前回はACKからSLB, Cloud Disk, NAS, OSSを利用する設定方法をご紹介しました。  
実施した内容については以下の記事をご覧頂ければと思います。

> https://www.sbcloud.co.jp/entry/2020/04/13/ack_and_product_part1

今回もACKからいくつかのプロダクトやサービスを連携する設定を試していきたいと思います。

---

# Log Service

     

運用されているシステムのアプリケーションやサーバ等から出力されるログを、クラウドのプロダクトやサービス等へ出力し、解析・可視化等で利用されている方も多いのではないでしょうか。  
ACKではコンテナやクラスタから出力されるログを、Alibab Cloud の Log Serviceへ転送する事ができます。  
今回はnginxのコンテナのアクセスログを、Log Serviceへ転送する設定を行ってみたいと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200514190126.png "img")

## Log Serviceプロジェクトの準備

     

コンテナから出力されたログは、<span style="color: #ff0000">Log Serviceのプロジェクト内の指定されたログストアへ転送</span>されます。  
ACKではクラスタ作成時に、プロジェクトを新規作成するか、既存のプロジェクトを利用するか選択する事ができます。  
事前に作成したLog Serviceのプロジェクトを利用したい場合は、ACK作成時にそのプロジェクトを選択します。  
今回はクラスタ作成時に「プロジェクトの作成」から、新規作成されたLog Serviceのプロジェクトを利用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200407183658.png "img")

     

クラスタが作成されると、Log Serviceのプロジェクトが<span style="color: #ff0000">「k8s-log-{ClusterID}」の形式</span>で作成されました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200407184258.png "img")

## ログ設定

     

次にコンテナのログをLog Serviceへ転送する為の設定を行います。  
設定方法は、<span style="color: #ff0000">ログを転送させたいコンテナのenvへ、Log Serviceの設定を定義</span>する事で転送が可能となります。  
以下の例では、転送先のログストアとタグを設定しています。  
作成されたLog Sreviceのプロジェクトへ、nginx-logと言うログストアを作成し、コンテナの標準出力を転送するように設定しています。  
また、転送されたログへ「app=nginx」タグを追加するように設定しています。  
転送先のログストアとタグの<span style="color: #ff0000">nameへ設定されている「aliyun_logs_」は、設定上必要となるプレフィックス</span>とお考え頂ければ良いかと思います。

では、作成したマニフェストをデプロイします。

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
        env:
        - name: aliyun_logs_nginx-log  # ログストア設定
          value: stdout # 標準出力を転送
        - name: aliyun_logs_nginx_tags
          value: app=nginx # タグ設定
---
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

      

作成されたロードバランサーのパブリックIPへ接続し、nginxのトップページを表示します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200407185854.png "img")

     

Log Serviceのコンソールから、マニフェストへ設定したログストアを確認すると、先ほど接続したnginxへのアクセスログが表示され、「app: nginx」タグが追加されている事が確認できました。  
転送されたログへタグを追加しておく事で、ログ検索等を効率的に行えるのではないでしょうか。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200407190320.png "img")

     

今回設定したLog Serviceの設定値以外にも、いくつか設定可能なパラメータがありますので、ドキュメントをご参照頂ければと思います。  

> https://www.alibabacloud.com/cloud-tech/doc-detail/87540.htm

     

---

# Resource Access Management (RAM)

     

Alibaba Cloudではユーザ管理の仕組みとして、Resource Access Management (RAM) を利用し、認証やリソース制限等の管理を行っています。  
ACKを利用した場合でもこのRAMの制限を利用し、ユーザ単位でKubernetesのリソースに対する操作を制限したい場合もあるかと思います。  
<span style="color: #ff0000">ACKではRAMユーザに対して、Kubernetesのロールベースアクセス制御（RBAC）を使用し、リソースに対する操作制限をする事が可能です。</span>  
（RBACの詳しい説明については今回は省略させて頂きます。）    
では、設定について見てきましょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200512101510.png "img")

## RAMユーザ作成

     

ACKクラスタを作成したRAMユーザには、デフォルトで各種操作権限が割り当てられている為、今回の確認では特に設定は不要となります。  
テスト用に権限を追加するRAMユーザは別途コンソールから作成しておく必要があります。  
この手順内では、簡略化の為以下のようにRAMユーザを表記します。  

RAMユーザ01（クラスタ作成ユーザ）：UID01  
RAMユーザ02（検証ユーザ）：UID02  
※実際のUIDはもっと複雑になっていますが今回はわかりやすくする為、例として上記のUIDと記載しています。

今回はkubecltを使用して動作を確認する為、<span style="color: #ff0000">作成した検証用ユーザへ対象クラスタへの読み取り権限を付与し</span>ています。  
クラスタへの読み取り権限をRAMユーザへ設定する事で、コンソールからkubeconfig情報を取得しローカルへ設定しています。    
以下の読み取りを許可するポリシーを作成し、検証ユーザへ設定します。  

<i>ポリシー</i>

```
{
 "Statement": [{
     "Action": [
         "cs:Get*"
     ],
     "Effect": "Allow",
     "Resource": [
         "acs:cs:*:*:cluster/<CLUSTER_ID>"
     ]
 }],
 "Version": "1"
}
```
※<CLUSTER_ID>は作成した<span style="color: #ff0000">ACKクラスタのID</span>を入力します

     

## 環境設定

     

権限の動作を確認する為、RAMユーザ01で事前にnginxのデプロイメントを作成しておきます。

<i>RAMユーザ01（クラスタ作成ユーザ）</i>

```
$ kubectl create deployment nginx --image=nginx
deployment.apps/nginx created

$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
nginx-86c57db685-c4kn5   1/1     Running   0          9s
```

     

RAMユーザ02で作成されたPodを確認してみます。  
操作権限が設定されていない為、エラーとなりPodを表示する事ができませんでした。

<i>RAMユーザ02（検証ユーザ）</i>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200512102228.png "img")
※マスクした部分には実際のUIDが表示されています。


## RBAC設定


RAMユーザに対するRBACの設定は、コンソールから設定する事ができます。  
もちろんClusterRole/Roleを作成し、ClusterRoleBinding/RoleBindingでRAMユーザを指定し設定する事も可能ですが、今回はコンソールから権限を設定してみます。

RAMユーザ01（クラスタ作成ユーザ）でACKのコンソールを開き、左メニューから「認証」を選択、RAMユーザ02（検証ユーザ）の「アクセス権限の管理」をクリックします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200512102700.png "img")

     

「アクセス権限の管理」では、対象となるクラスターやネームスペースの選択、RAMユーザへ割り当てたいロールを指定します。  
ロールについては予め用意されているプリセットか、個別に作成したロールを指定する事ができます。  
今回は対象クラスタの全ネームスペースへ、読み取り操作が許可されている「Restricted User」プリセットを選択し設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200514160615.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200514180559.png "img")

     

## 動作確認

では、RAMユーザ02（検証ユーザ）で確認してみます。  
先ほどはエラーとなりましたが、今度はPodの表示が確認できました。  

<i>RAMユーザ02（検証ユーザ）</i>

```
$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
nginx-86c57db685-c4kn5   1/1     Running   0          2m42s
```

     
Deploymentを作成してみます。  
作成する操作権限が割り当てられていない為失敗しています。  

<i>RAMユーザ02（検証ユーザ）</i>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200514161737.png "img")


権限の設定について、実際にどういった設定がされているか少し確認してみましょう。  
検証ユーザへアクセス権限を設定後、以下のClusterRoleBindingが作成されていました。  
ClusterRoleBindingの名前には、<span style="color: #ff0000">アクセス権限を設定した検証RAMユーザのUID</span>が先頭へ付与され、<span style="color: #ff0000">ClusterRoleには「cs:restricted」が設定</span>されています。  
また、<span style="color: #ff0000">「Kind: User」にはRAMユーザのUID</span>が設定されており、この、「Kind: User」へRAMユーザのUIDを設定する事でRAMユーザに対する権限設定がされているようです。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200512112617.png "img")

     

ClusterRoleBindingで設定されていたClusterRoleの「cs:restricted」の内容を確認してみると、各リソースに対して「get」「list」「watch」の操作が許可するように設定されています。

```
$ kubectl get clusterrole cs:restricted -o yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  creationTimestamp: "2020-05-12T02:11:41Z"
  name: cs:restricted
  resourceVersion: "248397715"
  selfLink: /apis/rbac.authorization.k8s.io/v1/clusterroles/cs%3Arestricted
  uid: 8afb1487-b1ba-453e-9079-4d5a1cd1d0bb
rules:
- apiGroups:
  - ""
  resources:
  - pods
  - pods/attach
  - pods/exec
  - pods/portforward
  - pods/proxy
  verbs:
  - get
  - list
  - watch
     .
     .
     .
※以降も各リソースに対しての設定がされていますが長い為省略します
```

     

今回は予め用意されているロールのプリセットを使用しましたが、より細かく権限を制御したいと言った場合には、
ClusterRole/Roleを作成しRAMユーザへ権限設定を行うのが良いかと思います。


> https://www.alibabacloud.com/cloud-tech/doc-detail/87656.htm


# Notification

     

運用しているシステムで発生したメッセージやイベントなどを、コミュニケーションツールへ通知し状況を確認したり、内容の共有等を行ったりしている方も多いのではないでしょうか。

ACKではKubernetesのEventを、DingTalkと言うコミュニケーションツールへ通知する事ができます。  
DingTalkはAlibaba Cloudのプロダクトではないのですが、Alibaba Groupから提供されているコミュニケーションツールで、ユーザやグループへのチャット、ビデオ会議、ファイルのアップロード、スケージュール、API等の機能が利用できます。  
Alibaba CloudのいくつかのプロダクトはこのDingTalkへ、簡単に通知設定を行う事ができるようになっています。  

DingTalkの詳しい機能については公式ページをご覧ください。

> https://page.dingtalk.com/wow/dingtalk/act/jp-home

     

また、「DingTalk」のコミュニケーション機能を切り出したライト版の「DingTalk Lite」については、  
ソフトバンクで導入支援サービスを提供しておりますので、もしご興味がある方がいらっしゃいましたらご連絡ください。

> https://www.sbcloud.co.jp/service/about/dingtalk/

## kube-eventerについて

     

ではどのようにDingTalkへ通知を行うかと言いますと、kube-eventerと言うツールを利用します。  
kube-eventerをACKへデプロイする事で、KubernetesのEventをDingTalkへ通知する事ができるようになります。  
通知先についてはDingTalk以外にも、Log ServiceやElasticsearch, mysql, InfluxDB, kafka等にも通知できるようです。  
今回は、kube-eventerをデプロイし、EventをDingTalkへ通知する動作をみて行きたいと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200513174525.png "img")

> https://github.com/AliyunContainerService/kube-eventer


## kube-eventerデプロイ

     

デプロイについては、kube-eventerのGitHubへ記載されている手順を参考に、マニフェストからデプロイします。  
また、マニフェストへ設定するWebhook URLは事前にDingTalkから作成し取得されている事を前提として進めて行きます。

ここで設定が必要な箇所は、kube-eventerに渡されるsink設定の部分です。  
取得した<span style="color: #ff0000">DingTalkのWebhook URL、ACKクラスタID、Event
タイプ</span>（今回はWarningを設定しています）をそれぞれ設定します。  
(Time ZoneやCPU, Memory等は環境に合わせて適時設定すると良いかと思います。）   


```
- --sink=dingtalk:[your_webhook_url]&label=[your_cluster_id]&level=[Normal or Warning(default)]

```
  
     

マニフェストをデプロイすると、Deployment, ClusterRoleBinding, ClusterRole, ServiceAccountが作成され、  
ServiceAccountのアクセス権には、Event
に対してget, list, watchの読み取り操作の許可が設定されてます。
```
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    name: kube-eventer
  name: kube-eventer
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kube-eventer
  template:
    metadata:
      labels:
        app: kube-eventer
      annotations:	
        scheduler.alpha.kubernetes.io/critical-pod: ''
    spec:
      dnsPolicy: ClusterFirstWithHostNet
      serviceAccount: kube-eventer
      containers:
        - image: registry.aliyuncs.com/acs/kube-eventer-amd64:v1.1.0-252b712-aliyun
          name: kube-eventer
          command:
            - "/kube-eventer"
            - "--source=kubernetes:https://kubernetes.default"
            ## .e.g,dingtalk sink demo
           # DingTalkのWebhook URL、ACKクラスタID、Eventタイプを設定
            - --sink=dingtalk:[your_webhook_url]&label=[your_cluster_id]&level=[Normal or Warning(default)]
          env:
          # If TZ is assigned, set the TZ value as the time zone
          - name: TZ
            value: "Asia/Shanghai" 
          volumeMounts:
            - name: localtime
              mountPath: /etc/localtime
              readOnly: true
            - name: zoneinfo
              mountPath: /usr/share/zoneinfo
              readOnly: true
          resources:
            requests:
              cpu: 100m
              memory: 100Mi
            limits:
              cpu: 500m
              memory: 250Mi
      volumes:
        - name: localtime
          hostPath:
            path: /etc/localtime
        - name: zoneinfo
          hostPath:
            path: /usr/share/zoneinfo
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kube-eventer
rules:
  - apiGroups:
      - ""
    resources:
      - events
    verbs:
      - get
      - list
      - watch
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kube-eventer
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kube-eventer
subjects:
  - kind: ServiceAccount
    name: kube-eventer
    namespace: kube-system
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kube-eventer
  namespace: kube-system
```

     

## 通知確認

ではDintTalkへの通知を確認してみます。  
ここでは、存在しないイメージを指定し、Podを起動失敗させEventへWarningを出力させてみます。
```
$ kubectl run kube-eventer-demo --image=kube-eventer-demo-lskdibehaajvchuwvdqwe
```

     

Podの起動が失敗し、イベントにはWarningがいくつか出力されました。
```
$ kubectl get events --field-selector type=Warning
LAST SEEN   TYPE      REASON   OBJECT                  MESSAGE
23s         Warning   Failed   pod/kube-eventer-demo   Failed to pull image "kube-eventer-demo-lskdibehaajvchuwvdqwe": rpc error: code = Unknown desc = Error response from daemon: pull access denied for kube-eventer-demo-lskdibehaajvchuwvdqwe, reposito
ry does not exist or may require 'docker login': denied: requested access to the resource is denied
23s         Warning   Failed   pod/kube-eventer-demo   Error: ErrImagePull
35s         Warning   Failed   pod/kube-eventer-demo   Error: ImagePullBackOff
```


Webhookを設定したDingTalkのグループを確認すると、Eventへ出力されたWarningが通知がされています。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200514184520.png "img")


## node-problem-detectorとkube-eventer

今回はkube-eventer単体の動作を試してみましたが、ACKのApp CtalogのHelmから、node-problem-detectorとkube-eventerを合わせて利用できる、ack-node-problem-detector
を利用する事ができます。  
node-problem-detectorから出力されたEvent通知も行いたい場合には、こちらの利用も検討されると良いかと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200514181014.png "img")

---

# まとめ

今回はACKからLog Service、RAMユーザ、DingTalkへの連携設定を行ってみました。    
ACKでは前回ご紹介したプロダクト連携と合わせて、多くのAlibaba Cloudプロダクトとシームレスに連携する事が可能ですので、  
必要に応じて試してみてはいかがでしょうか。

最後までお読み頂き、ありがとうございました。



 <CommunityAuthor 
    author="有馬 茂人"
    self_introduction = "2018年ソフトバンクへjoin。普段はIaC・コンテナ・Kubernetes等を触っているエンジニアです。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/arima.jpeg"
    githubUrl="https://github.com/s-ari"
/>



