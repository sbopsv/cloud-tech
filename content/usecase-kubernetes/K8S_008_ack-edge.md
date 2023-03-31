---
title: "ACK@Edge でエッジ連携"
metaTitle: "ACK@Edge でエッジ連携"
metaDescription: "ACK@Edge でエッジ連携"
date: "2021-07-21"
author: "有馬 茂人"
thumbnail: "/Container_images_26006613787317700/20210721093350.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## ACK@Edge でエッジ連携

本記事では、Container Service for Kubernetes (ACK) で利用可能な ACK@Edge を使用して、クラウドやオンプレミス等へ設置されたコンピュートとの連携をする方法をご紹介します。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210721142120.png "img")


---

# ACK@Edge

ACK ではいくつかのクラスタタイプを提供していますが、ACK@Edge はその中の1つとなります。
ACK@Edge では、Alibaba Cloud からクラウドやオンプレミスなどのエッジロケーションへ配置されたノードを、Kubernetes のワーカーノードとして管理する事ができるようになります。

・IoTデバイスやx86およびARMアーキテクチャなどのリソースをサポート  
　※ エッジノードとしてENS にも対応していますが、現在東京リージョンでは未提供のプロダクトとなります  
・セルベースでのエッジノード管理  
・リバーストンネルでエッジノードと通信  
・高い信頼性と可用性の Professional と Standard を提供

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210716113639.png "img")

    

---

    

# クラスタ作成

    

では早速 ACK@Edge クラスタを作成していきましょう。想定している構成としては、エッジノードとして登録するサーバは別途クラウド上へ構築されている前提となります。今回は Ubuntu 18.04.3 LTS のインスタンスをクラウドへ作成しました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210721093350.png "img")

作成順序はほぼ ACK と同様です。[Create Cluseter] から [Managed Edge Kubernetes] を選択し、Standard edition 、リージョン、VPC、SNAT、APIを必要に応じて選択します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210716170323.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210716170630.png "img")

    

ACK@Edge の管理コンポーネントを デプロイする必要がある為、ワーカーノードとして最低1つ ECS が必要となります。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210716170958.png "img")

    

今回は CloudMonitor エージェントと、LogService は無効にしておきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210716171009.png "img")

    

クラスタに必要となるリソースを確認し ACK@Edge クラスタを作成します。
ACK とほぼ同様に作成が可能ですね。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210716171023.png "img")

    

---

    

# 登録スクリプト生成

    

次に外部へ作成したインスタンスを、エッジノードとして登録するた為のスクリプトを作成します。  
先ほど作成したクラスタを選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210719141523.png "img")

    

[Add Existing Node] を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210719141537.png "img")

    

手動でノードを追加するので [Manual] を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210719141610.png "img")

    

Architecture で [AMD64] を選択し、[Next Step] で次へ進みます。  
この際にエッジノードへ設定するパラメーターがあればこちらへ設定します。設定可能なパラメータはドキュメントを参照ください。  

> https://www.alibabacloud.com/cloud-tech/doc-detail/126364.htm


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210719141715.png "img")

エッジノードとして登録するインスタンスで実行するスクリプトが表示されますので、こちらをコピーして [Done] で終了します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210721110916.png "img")

    

---

    

# エッジノード追加

    

ではエッジノードとして登録するインスタンスへログインし、先ほどコピーしたスクリプトをroot権限で実行します。  

```
wget http://aliacs-k8s-ap-northeast-1.oss-ap-northeast-1.aliyuncs.com/public/pkg/run/attach/1.18.8-aliyunedge.1/amd64/edgeadm -O edgeadm; chmod u+x edgeadm; ./edgeadm join --openapi-token=<YOUR TOKEN> --node-spec="{\"allowedClusterAddons\":[\"kube-proxy\",\"flannel\",\"coredns\"],\"enableIptables\":true,\"labels\":{\"apps.openyurt.io/desired-nodepool\":\"np701fd3abd8f0418dbea5578f86258ed4\"},\"manageRuntime\":true,\"quiet\":true}" --region=ap-northeast-1

```

    

スクリプトの実行が正常に終了すると、ACK@Edge と連携する為に必要なコンテナがデプロイされます。

```
# docker ps
CONTAINER ID        IMAGE                                                        COMMAND                   CREATED             STATUS              PORTS               NAMES
1f244212b6b2        registry.ap-northeast-1.aliyuncs.com/acs/coredns             "/coredns -conf /etc…"    3 minutes ago       Up 3 minutes                            k8s_coredns_coredns-fcnhs_kube-system_1358456d-3e3f-4ca2-b992-91e5bc5e8002_0
cf5e934d3cfc        registry.ap-northeast-1.aliyuncs.com/acs/kube-proxy          "/bin/sh -c 'set -x\n…"   3 minutes ago       Up 3 minutes                            k8s_kube-proxy_kube-proxy-lvbhz_kube-system_b9110e57-c23e-48c1-af7e-251c1166ea9c_0
5c1adf228b9e        registry.ap-northeast-1.aliyuncs.com/acs/pause:3.0.edge      "/pause"                  3 minutes ago       Up 3 minutes                            k8s_POD_coredns-fcnhs_kube-system_1358456d-3e3f-4ca2-b992-91e5bc5e8002_0
aed9e5bdca80        registry.ap-northeast-1.aliyuncs.com/acs/pause:3.0.edge      "/pause"                  3 minutes ago       Up 3 minutes                            k8s_POD_kube-proxy-lvbhz_kube-system_b9110e57-c23e-48c1-af7e-251c1166ea9c_0
3cc334c0c640        d4851633d2d2                                                 "/bin/sh -c 'set -x\n…"   3 minutes ago       Up 3 minutes                            k8s_kube-flannel_kube-flannel-ds-9wv8t_kube-system_0adeb1fc-6834-4399-a86f-6dfd21cd439d_0
b64e1b7da74b        registry.ap-northeast-1.aliyuncs.com/acs/edge-tunnel-agent   "/usr/local/bin/edge…"    3 minutes ago       Up 3 minutes                            k8s_edge-tunnel-agent_edge-tunnel-agent-vv5gq_kube-system_ae5b6e3d-493e-4783-9d70-6f6464933a15_0
f1a2f3a873b8        registry.ap-northeast-1.aliyuncs.com/acs/pause:3.0.edge      "/pause"                  3 minutes ago       Up 3 minutes                            k8s_POD_kube-flannel-ds-9wv8t_kube-system_0adeb1fc-6834-4399-a86f-6dfd21cd439d_0
e676e810f7fe        registry.ap-northeast-1.aliyuncs.com/acs/pause:3.0.edge      "/pause"                  3 minutes ago       Up 3 minutes                            k8s_POD_edge-tunnel-agent-vv5gq_kube-system_ae5b6e3d-493e-4783-9d70-6f6464933a15_0
53decba4cb64        registry.ap-northeast-1.aliyuncs.com/acs/edge-hub            "/usr/local/bin/edge…"    4 minutes ago       Up 4 minutes                            k8s_edge-hub_edge-hub-ip-192-168-1-208_kube-system_2117efdbfd33bf478238e98520d4cc5a_0
e88740440c23        registry.ap-northeast-1.aliyuncs.com/acs/pause:3.0.edge      "/pause"                  4 minutes ago       Up 4 minutes                            k8s_POD_edge-hub-ip-192-168-1-208_kube-system_2117efdbfd33bf478238e98520d4cc5a_0
```

    

コンソールからも登録したインスタンスがワーカーノードとして確認できるようになります。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210719143851.png "img")

```
$ kubectl get node -o wide
NAME                           STATUS   ROLES    AGE     VERSION                INTERNAL-IP     EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION                CONTAINER-RUNTIME
ap-northeast-1.192.168.1.243   Ready    <none>   2d22h   v1.18.8-aliyunedge.1   192.168.1.243   <none>        CentOS Linux 7 (Core)   3.10.0-1160.15.2.el7.x86_64   docker://19.3.15
ip-192-168-1-93                Ready    <none>   53m     v1.18.8-aliyunedge.1   192.168.1.93    <none>        Ubuntu 18.04.3 LTS      4.15.0-1054-aws               docker://19.3.15
```



    

---

    

# Pod デプロイ

    

追加したエッジノードへ Pod をデプロイしてみます。  
今回は nodeSelector でエッジノードへ設定されたラベル(kubernetes.io/hostname=ip-192-168-1-93)を指定します。  

```
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx
  name: nginx
spec:
  containers:
  - image: nginx
    name: nginx
  nodeSelector:
    kubernetes.io/hostname: ip-192-168-1-93
```

    

エッジノードで Pod が起動されました。
```
$ kubectl get pod -o wide
NAME    READY   STATUS    RESTARTS   AGE   IP           NODE              NOMINATED NODE   READINESS GATES
nginx   1/1     Running   0          93s   10.18.0.67   ip-192-168-1-93   <none>           <none>
```

    

---

# エッジノード管理

    

先ほどは nodeSelector を使用し Pod をデプロイしましたが、ACK@Edge では Node Pool、UnitedDeployment、Service topology を使用する事で、  
エッジノードやコンテナの管理を柔軟に行えるようになっています。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210721111948.png "img")


> https://www.alibabacloud.com/cloud-tech/doc-detail/201455.htm

> https://www.alibabacloud.com/cloud-tech/doc-detail/201460.htm

> https://www.alibabacloud.com/cloud-tech/doc-detail/201461.htm


---

# まとめ

今回は ACK@Edge を使用して、エッジノードの追加、コンテナのデプロイを試してみました。   
ACK@Edge では CNCF の Sundbox Project でホストされている openyurt を使用して機能が提供されていますので、もしご興味があればそちらも公式ブログと合わせてチェックしてみてください。   

> https://openyurt.io/en-us/

> https://community.alibabacloud.com/tags/type_blog-tagid_31845



 <CommunityAuthor 
    author="有馬 茂人"
    self_introduction = "2018年ソフトバンクへjoin。普段はIaC・コンテナ・Kubernetes等を触っているエンジニアです。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/arima.jpeg"
    githubUrl="https://github.com/s-ari"
/>




