---
title: "Yamahaルーターとの接続"
metaTitle: "VPN Gatewayを用いたYamahaルーターとのIPsec-VPN接続手順を紹介します。"
metaDescription: "VPN Gatewayを用いたYamahaルーターとのIPsec-VPN接続手順を紹介します。"
date: "2021-06-13"
author: "Hironobu Ohara"
thumbnail: "/images/cm-003.png"
---



<!-- descriptionがコンテンツの前に表示されます -->

<!-- コンテンツを書くときはこの下に記載ください -->



本設定例では、VPC に設置したVPN Gatewayを、お客様拠点に設置したYamahaルーターとIPsec-VPNで接続します。

# 事前準備

ネットワークや IP アドレス等を事前に設計し、VPN Gatewayを購入します。

本設定例では、クラウド側のVPC (セグメント 192.168.0.0/24) とYamahaルーター側 (セグメント 192.168.100.0/24) をRoute-basedで接続します。

# 本設定例について

Alibaba CloudのVPCとの接続を保証するものではありません。

2019年 5 月の仕様に基づいて記載しています。確認しているファームウェアは下記のとおりです。今後、サービス内容の変更や、仕様変更などによって接続できなくなる可能性があります。

本設定例でテスト済みの Yamahaルーターは以下になります。

| **モデル** | **バージョン** |
| ---------- | -------------- |
| RTX830     | Rev.15.02.09   |
| RTX1210    | Rev.14.01.33   |

Yamahaルーターに関する情報および設定方法については、Yamahaルーターお客様相談センターまでお問い合わせください。

# 設定手順

## ステップ 1：VPN Gateway の設定

1. 対象VPCにVPN Gatewayとカスタマーゲートウェイを作成します。カスタマーゲートウェイの設定ではお客様拠点 ルーターのグローバルIPアドレスを使って設定します。

2. IPsec ConnectionsよりVPN接続を作成します。

- *以下の項目を入力します*

  *「名前」任意の識別名を入力します。*
  *「VPN Gateway」作成したVPN Gateway名を選択します。*
  *「カスタマーゲートウェイ」　作成したカスタマーゲートウェイを選択します。*
  *「ローカルネットワーク」クラウド側ネットワーク (0.0.0.0/0) を入力します。*
  *「リモートネットワーク」お客様拠点側ネットワーク ( 0.0.0.0/0 ) を入力します。*
  *「今すぐ有効化」“はい”を選択します。*
  *「高度な構成」有効にします。*
  *「事前共有鍵」お客様拠点側ルーターと同一の任意の共有鍵を入力します。*
  *「バージョン」ikev2を選択します。*

- *以下の設定はヘルスチェックです。(任意)*
  *有効にするとVPN GatewayがIPsecトンネルの通信断を検出できるようになり、チェックが失敗した場合にはIPsecの再接続をします。*

  *「ヘルスチェック」 有効にします。*
  *「宛先IP」お客様拠点側サブネット内の疎通可能な任意のIPアドレスを入力します。*
  *「送信元IP」クラウド側サブネットの内で任意のIPアドレスを入力します。*
  *「再試行間隔」任意の間隔を指定します。*
  *「再試行回数」任意の回数を指定します。*
  *「OK」ボタンを押します。*

  ***注意:*** *そのほか項目についても運用方針に沿って指定いただけます。*

3. ルートの追加をします。

- *上記完了後、下記のポップアップが表示されるので、OKボタンを押します。*
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-001.png)

- *下記、VPN-GWのルートテーブル画面へ遷移しますので、宛先ベースルーティングのタブを選択し、ルートエントリの追加を行います。*
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-002.png)

- *ルートエントリの追加は下記の様に行います。*

  *「宛先CIDRブロック」お客様拠点側セグメントを設定します。*

  *「VPCに公開」“はい”を選択します。*
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-003.png)

  *「OK」ボタンを押します。*

- *VPN-GW**のルートテーブルにてルートエントリの追加が行われ、ステータスが公開済みとなっていることを確認します。*
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-004.png)

4. IPsec Connectionsの画面より、VPN 接続が追加されることを確認します。
    ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-005.png)

## ステップ 2：Yamahaルーターの設定

Yamahaルーターにアクセスし以下の項目を設定します。

-  IPsec接続設定
```
>1.     tunnel select 1
>2.     description tunnel "Alibaba Cloud"
>3.     ipsec tunnel 1
>4.     ipsec sa policy 1 1 esp aes-cbc sha-hmac
>5.     ipsec ike version 1 2
>6.     ipsec ike duration child-sa 1 86400
>7.     ipsec ike duration ike-sa 1 86400
>8.     ipsec ike keepalive log 1 off
>9.     ipsec ike keepalive use 1 on dpd
>10.     ipsec ike local address 1 (お客様拠点ルーターのグローバルIPアドレス)
>11.     ipsec ike log 1 key-info payload-info
>12.     ipsec ike local name 1 (お客様拠点ルーターのグローバルIPアドレス) ipv4-addr
>13.     ipsec ike nat-traversal 1 on
>14.     ipsec ike message-id-control 1 on
>15.     ipsec ike child-exchange type 1 2
>16.     ipsec ike pre-shared-key 1 text (任意の共有鍵)
>17.     ipsec ike remote address 1 （VPN GatewayグローバルIPアドレス）
>18.     ipsec ike remote name 1 （VPN GatewayグローバルIPアドレス） ipv4-addr
>19.     ipsec ike negotiation receive 1 off
>20.     ip tunnel tcp mss limit auto
>21.     tunnel enable 1
```

-  NATマスカレード設定
```
>1.     nat descriptor type 200 masquerade
```

-  IPsec用静的マスカレード設定
```
>1.     nat descriptor masquerade static 200 1 192.168.100.1 udp 4500
>2.     nat descriptor masquerade static 200 2 192.168.100.1 udp 500
>3.     nat descriptor masquerade static 200 3 192.168.100.1 esp
```

-  IPsec接続始動（鍵交換）設定
```
>1.     ipsec auto refresh on
```

-  経路設定
```
>1.     ip route 192.168.0.0/24 gateway tunnel 1
```

  ***注意:*** *ルーティング、ポリシー等の項目についても運用方針に沿ってYamahaルーター側を設定する必要があります。ステップ１でVPN Gatewayのヘルスチェックを利用する場合は送信元IPからのICMPパケットをYamaha ルーター側で許可する必要があります。*

## ステップ 3：ステータス確認

Yamahaルーターの設定が完了し、接続が成功すれば、接続ステータスが「成功」、ヘルスチェックステータスが「正常」に変わります。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-006.png)

## ステップ4：接続のテスト

VPC内のECSインスタンスにログインし、拠点内のプライベートIPアドレスにpingを送信して、VPCと拠点側の通信が成功することを確認します。
