---
title: "ECSでDNS over HTTPSを設定"
metaTitle: "中国リージョンECSで DNS over HTTPS (DoH) の設定をする"
metaDescription: "中国リージョンECSで DNS over HTTPS (DoH) の設定をする"
date: "2020-09-10"
author: "sbc_yoshimura"
thumbnail: "/computing_images_26006613626092100/000000000000000002.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## ECSでDNS over HTTPSを設定

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613626092100/000000000000000002.png "img")     

# はじめに

本記事では、中国のGreat Firewall対策としてDNSキャッシュポイズニングを避けるDNS over HTTPS (DoH)  の設定についてご紹介します。    

DoHの構成:   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613626092100/20200910121558.png "img")     

結論から言うと、**DNS over HTTPS (DoH) の設定は出来ましたが、GFW超えはできませんでした**。

# DNSCrypt について

オープンソースの DoHプロジェクトです。   

[https://github.com/DNSCrypt](https://github.com/DNSCrypt)

> https://github.com/DNSCrypt

このプロジェクト内で、DoH クライアントのDNSプロキシソフトウェアとして dnscrypt-proxy があります。

> DNSCrypt v2、DNS-over-HTTPS、Anonymized DNSCrypt などの最新の暗号化されたDNSプロトコルをサポートする柔軟なDNSプロキシです。

[github.com](https://github.com/DNSCrypt/dnscrypt-proxy)

> https://github.com/DNSCrypt/dnscrypt-proxy

# Cloudflare のキャッシュDNSについて

Cloudflareが用意しているパブリックに利用可能なキャッシュDNSサーバです。有名ですね。

キャッシュDNS サーバ : 1.1.1.1 /  1.0.0.1  

このキャッシュサーバは DoH のためのエンドポイントを用意しています。

[https://cloudflare-dns.com/dns-query](https://cloudflare-dns.com/dns-query)

> https://cloudflare-dns.com/dns-query

利用方法はこちらを見てください。

[developers.cloudflare.com](https://developers.cloudflare.com/1.1.1.1/dns-over-https)

> https://developers.cloudflare.com/1.1.1.1/dns-over-https

ドキュメントではCloudflareが開発しているクライアントソフト cloudflared からこの [https://cloudflare-dns.com/dns-query](https://cloudflare-dns.com/dns-query) を利用する方法が紹介されていますが、dnscrypt-proxy からもこのエンドポイントを利用することが出来ます。


> https://cloudflare-dns.com/dns-query

設定方法を見ていきます。

# dnscrypt-proxy のインストール

Linux のインストール方法はこちらです。この内容に沿ってやっていきます。

[github.com](https://github.com/dnscrypt/dnscrypt-proxy/wiki/Installation-linux)

ECS は root 権限です。

```
ss -lp 'sport = :domain'

Netid      State       Recv-Q      Send-Q           Local Address:Port              Peer Address:Port
tcp    LISTEN     0      128    127.0.0.1:domain                *:*                     users:(("unbound",pid=28146,fd=6))
tcp    LISTEN     0      128    127.0.0.1:domain                *:*                     users:(("unbound",pid=28146,fd=4))


systemctl stop systemd-resolved
systemctl disable systemd-resolved

ss -lp 'sport = :domain'

Netid      State       Recv-Q      Send-Q           Local Address:Port              Peer Address:Port
```

Githubから最新のソフトウェアを確認して、ダウンロードします。

2020/08/24 時点では、2.0.44 が最新バージョンでした。

ECS の Linux の場合には、**dnscrypt-proxy-linux\_x86\_64-2.x.xx.tar.gz** がファイル名となります。

```
wget https://github.com/DNSCrypt/dnscrypt-proxy/releases/download/2.0.44/dnscrypt-proxy-linux_x86_64-2.0.44.tar.gz

tar -zxvf dnscrypt-proxy-linux_x86_64-2.0.44.tar.gz
cd linux-x86_64

cp example-dnscrypt-proxy.toml dnscrypt-proxy.toml

./dnscrypt-proxy -version

./dnscrypt-proxy



[2020-08-24 20:47:32] [NOTICE] Sorted latencies:
[2020-08-24 20:47:32] [NOTICE] -    30ms nextdns
[2020-08-24 20:47:32] [NOTICE] -    55ms jp.tiar.app
[2020-08-24 20:47:32] [NOTICE] -    55ms geekdns-doh-ext
[2020-08-24 20:47:32] [NOTICE] -    57ms jp.tiar.app-doh
[2020-08-24 20:47:32] [NOTICE] -   155ms jp.tiarap.org
[2020-08-24 20:47:32] [NOTICE] -   162ms quad9-dnscrypt-ip4-nofilter-pri
・
・
・
[2020-08-24 20:47:32] [NOTICE] -  1088ms quad101
[2020-08-24 20:47:32] [NOTICE] -  1252ms bcn-doh
[2020-08-24 20:47:32] [NOTICE] -  1405ms dnscrypt.ca-2-doh
[2020-08-24 20:47:32] [NOTICE] Server with the lowest initial latency: nextdns (rtt: 30ms)
[2020-08-24 20:47:32] [NOTICE] dnscrypt-proxy is ready - live servers: 68

```

dnscrypt-proxyは起動したまま、別のターミナルでECSへアクセスしてください。

## resolve.conf 設定を変更

resolveの指定を、dnscrypt-proxy （つまりECS自身）に変更します。

```
cp /etc/resolv.conf /etc/resolv.conf.backup

nameserver 127.0.0.1
options edns0

./dnscrypt-proxy -resolve example.com


Resolving [facebook.com]

Domain exists:  yes, 4 name servers found
Canonical name: facebook.com.
IP addresses:   157.240.22.35, 2a03:2880:f131:83:face:b00c:0:25de
TXT records:    v=spf1 redirect=_spf.facebook.com google-site-verification=A2WZWCNQHrGV_TWwKh6KHY90tY0SHZo_RnyMJoDaG0s google-site-verification=wdH5DTJTc9AYNwVunSVFeK0hYDGUIEOGb-RReU6pJlY
Resolver IP:    172.69.32.84
```

続いて、キャッシュDNSサーバにCloudflareを指定します。

## dnscrypt-proxyの設定で Cloudflare を指定

```
./dnscrypt-proxy -version

vi dnscrypt-proxy.toml

　
server_names = ['cloudflare', 'cloudflare-ipv6']

./dnscrypt-proxy

[2020-08-24 21:13:30] [NOTICE] dnscrypt-proxy 2.0.44
[2020-08-24 21:13:30] [NOTICE] Network connectivity detected
[2020-08-24 21:13:30] [NOTICE] Now listening to 127.0.0.1:53 [UDP]
[2020-08-24 21:13:30] [NOTICE] Now listening to 127.0.0.1:53 [TCP]
[2020-08-24 21:13:30] [NOTICE] Source [relays] loaded
[2020-08-24 21:13:30] [NOTICE] Source [public-resolvers] loaded
[2020-08-24 21:13:30] [NOTICE] Firefox workaround initialized
[2020-08-24 21:13:32] [NOTICE] [cloudflare] OK (DoH) - rtt: 650ms
[2020-08-24 21:13:32] [NOTICE] Server with the lowest initial latency: cloudflare (rtt: 650ms)
[2020-08-24 21:13:32] [NOTICE] dnscrypt-proxy is ready - live servers: 1
```

設定は以上です。

## DoH設定はしたが、GFWは超えられない

これで中国国内のキャッシュDNSによるDNSポイズニングを回避することができます。

```
dig facebook.com +short
75.126.164.178
dig facebook.com +short
69.171.248.128
dig facebook.com +short
75.126.164.178
dig facebook.com +short
75.126.164.178
dig facebook.com +short
67.228.235.91
dig facebook.com +short
31.13.86.1



dig facebook.com +short
157.240.22.35
dig facebook.com +short
157.240.22.35
dig facebook.com +short
157.240.22.35
dig facebook.com +short
157.240.22.35
dig facebook.com +short
157.240.22.35



tcpdump -i eth0 -n port 53 or port 443

22:24:04.121170 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [S], seq 804152926, win 29200, options [mss 1460,sackOK,TS val 3646337796 ecr 0,nop,wscale 7], length 0
22:24:04.411794 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [S.], seq 1308200225, ack 804152927, win 65535, options [mss 1460,nop,nop,sackOK,nop,wscale 10], length 0
22:24:04.411831 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [.], ack 1, win 229, length 0
22:24:04.412129 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [P.], seq 1:289, ack 1, win 229, length 288
22:24:04.702571 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [.], ack 289, win 66, length 0
22:24:04.705915 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [.], seq 1:1461, ack 289, win 66, length 1460
22:24:04.705926 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [.], ack 1461, win 251, length 0
22:24:04.705943 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [P.], seq 1461:2553, ack 289, win 66, length 1092
22:24:04.705949 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [.], ack 2553, win 274, length 0
22:24:04.706880 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [P.], seq 289:353, ack 2553, win 274, length 64
22:24:04.706948 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [P.], seq 353:439, ack 2553, win 274, length 86
22:24:04.707015 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [P.], seq 439:604, ack 2553, win 274, length 165
22:24:04.707046 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [P.], seq 604:703, ack 2553, win 274, length 99
22:24:04.997449 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [.], ack 353, win 66, length 0
22:24:04.997472 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [.], ack 439, win 66, length 0
22:24:04.997527 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [.], ack 604, win 67, length 0
22:24:04.997632 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [.], ack 703, win 67, length 0
22:24:04.998953 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [P.], seq 2553:2624, ack 703, win 67, length 71
22:24:04.999062 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [P.], seq 703:734, ack 2624, win 274, length 31
22:24:05.288907 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [.], ack 734, win 67, length 0
22:24:06.768028 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [P.], seq 2624:3354, ack 734, win 67, length 730
22:24:06.808203 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [.], ack 3354, win 297, length 0
22:24:36.768389 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [P.], seq 734:758, ack 3354, win 297, length 24
22:24:36.768431 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [F.], seq 758, ack 3354, win 297, length 0
22:24:37.059664 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [.], ack 758, win 67, length 0
22:24:37.059862 IP 1.0.0.1.https > 192.168.100.249.46062: Flags [F.], seq 3354, ack 759, win 67, length 0
22:24:37.059872 IP 192.168.100.249.46062 > 1.0.0.1.https: Flags [.], ack 3355, win 297, length 0
```


# 最後に
これならGFW超えができそうな気がしましたが、実際には facebook にはアクセス出来ませんでした。　   
おそらく正常なIPアドレス自体が443/80で中国ISPにブロックされているのだろうと思います。   
とは言っても中国に限らずDNSのセキュリティとしては良い設定だと思いますので、是非試してみてください。    


 <CommunityAuthor 
    author="吉村 真輝"
    self_introduction = "Alibaba Cloud プロフェッショナルエンジニア。中国ｘクラウドが得意。趣味は日本語ラップのDJ。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yoshimura_pic.jpeg"
    githubUrl="https://github.com/masaki-coba"
/>




