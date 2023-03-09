---
title: "ルーティングさせるNW構成"
metaTitle: "OpenVPNとVPC(RouteTable)の設定だけで特定ドメインのみAlibabaCloudにルーティングさせるNW構成を作る"
metaDescription: "OpenVPNとVPC(RouteTable)の設定だけで特定ドメインのみAlibabaCloudにルーティングさせるNW構成を作る"
date: "2020-03-05"
author: "sbc_tnoce"
thumbnail: "/Network_images_26006613530415200/20210524172534.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## ルーティングさせるNW構成

# はじめに
本記事では、特定のドメインやG-IP向けの通信経路だけAlibaba Cloud網を通したいときの手段として検証した結果をご紹介します。    
VPC間にCENを通して2つのVPCをつなげたうえで試してみました。
VPN接続後、NATサーバ(ECS)を通ってアクセスするようになります。


# リソース構成図とNWフロー
下図のとおりです。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613530415200/20210524172534.png)

# 手順

## OpenVPN：ECSの作成
GUIコンソールから作成しました。

- サーバー情報

|機能|Hostname|Zone|InstanceType|Spec|P-IP|
|---|---|---|---|---|---|
|NATサーバ|nat01|日本東京(ゾーンB)|ecs.t5-lc1m1.small|1vCPU 1GiB|10.68.30.153|
|VPNサーバ|openvpn01|日本東京(ゾーンA)|ecs.t5-lc1m1.small|1vCPU 1GiB|10.68.10.238|

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613530415200/20210524172705.png)

- セキュリティグループ（OpenVPN）
便宜上一旦anyしてます
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613530415200/20210524173046.png)

- セキュリティグループ（NATサーバ）
便宜上一旦anyにしてます
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613530415200/20210524173040.png)

- VPCのルートテーブル情報（OpenVPN）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613530415200/20210524173036.png)

- VPCのルートテーブル情報（NATサーバ）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613530415200/20210524173056.png)



## OpenVPN：Configure
CAは腹持ちで建てました。

- ポイント
    - push "route 13.112.0.0 255.252.0.0" ※qiitaのipアドレスをVPN接続したクライアントにpushする


```:/etc/openvpn/default.conf※コメントアウトとオプションoff項目を除く
[root@openvpn]# grep '^[^#]' 'server_r.conf
port 1194
proto udp
dev tun
ca /etc/openvpn/easy-rsa/pki/ca.crt
cert /etc/openvpn/easy-rsa/pki/issued/server_r.crt
key /etc/openvpn/easy-rsa/pki/private/server_r.key  # This file should be kept secret
dh /etc/openvpn/easy-rsa/pki/dh.pem
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist ipp.txt
push "route 13.112.0.0 255.252.0.0"
```

## ECS(NATサーバ):Configure

### eth0 の firewalld zone を external に変更
```
# firewall-cmd --zone=external --change-interface=eth0 --permanent
success
```

### externalゾーン に IPマスカレード設定
```
# firewall-cmd --zone=external --add-masquerade --permanent
success
```

### 変更の反映
```
# firewall-cmd --reload
success
```

### Firewalldを常に起動
```
# systemctl enable firewalld
```

### Firewalldを起動
```
# systemctl start firewalld
```

### Firewalldのステータスを確認（RunningになっていればOK）
```
# systemctl status firewalld
irewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; enabled; vendor preset: enabled)
   Active: active (running) since 木 2019-11-28 08:00:13 CST; 10h ago
     Docs: man:firewalld(1)
 Main PID: 542 (firewalld)
   CGroup: /system.slice/firewalld.service
           └─542 /usr/bin/python2 -Es /usr/sbin/firewalld --nofork --nopid

11月 28 08:00:13 nginx02 systemd[1]: Starting firewalld - dynamic firewall daemon...
11月 28 08:00:13 nginx02 systemd[1]: Started firewalld - dynamic firewall daemon.
11月 28 18:02:38 nginx02 firewalld[542]: WARNING: ALREADY_ENABLED: masquerade
```


# 検証

## VPN接続
vpnuxやtunnelblickなどのGUIアプリでVPN接続します。

## 接続後にNW設定を確認
OpenVPNに設定しいてたクライアントサブネットが割り当てられていることを確認します。

```
User:~$ ifconfig | grep 10.8
        inet 10.8.0.6 --> 10.8.0.5 netmask 0xffffffff 
```

Qiita向けの経路が適切にpublishされているか確認します。

```
User:~$ netstat -rn | grep 13.112/14
13.112/14          10.8.0.5           UGSc         utun8 
```

## 特定ドメイン向けの経路を確認

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613530415200/20210524173050.png)

これでVPN接続時はAlibaba CloudのVPC網を通ってNATサーバからQiitaにアクセスするようになりました 
注意点としてIPアドレスが複数ある場合は、丸めて記載するか単体でそれぞれ記載するなど工夫が必要です。
OpenVPNがドメインで経路をpushできれば良さそうなんですけど、今のところはできなさそう...🤔

しかし、特定IP範囲であれば、クライアントのProxy設定不要でVPN接続さえすればローカルスプリットします。
そして、特定経路だけVPCにルーティングしてくれるので、ユーザーにルーティングを意識させたくないとき有効的に使える構成だと思います。


# 最後に
以上、特定のドメインやG-IP向けの通信経路だけAlibaba Cloud網を通したいときの手段として検証した結果になります。ご参考に頂ければ幸いです。


 <CommunityAuthor 
    author="長岡周"
    self_introduction = "2018年からAlibabaCloudサービスに携わる。現在プリセールスエンジニア。元営業マン。初心を忘れず日々精進。AlibabaCloud Professional（Cloud computing/Security）所持。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/animal_deer.png"
    githubUrl=""
/>




