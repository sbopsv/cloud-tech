---
title: "NEC IXルーターとの接続"
metaTitle: "VPN Gatewayを用いたNEC IXルーターとのIPsec-VPN接続手順を紹介します。"
metaDescription: "VPN Gatewayを用いたNEC IXルーターとのIPsec-VPN接続手順を紹介します。"
date: "2021-06-13"
author: "Hironobu Ohara"
thumbnail: "/images/cm-003.png"
---



<!-- descriptionがコンテンツの前に表示されます -->

<!-- コンテンツを書くときはこの下に記載ください -->



本設定例では、VPCに作成したVPN Gatewayを、お客様拠点に設置したNEC IXルーターとIPsec-VPNで接続します。

# 事前準備

ネットワークやIPアドレス等を事前に設計し、VPN Gatewayを購入します。

本設定例では、クラウド側のVPC (セグメント 192.168.0.0/24) とNEC IXルーター側 (セグメント 192.168.100.0/24) をRoute-basedで接続します。

# 本設定例について

Alibaba CloudのVPCとの接続を保証するものではありません。

2019年 8 月の仕様に基づいて記載しています。確認しているファームウェアは下記のとおりです。今後、サービス内容の変更や、仕様変更などによって接続できなくなる可能性があります。

本設定例でテスト済みのNEC IXルーターは以下になります。

| **モデル** | **バージョン**   |
| ---------- | ---------------- |
| NEC IX2215 | Version  10.1.16 |

NEC IXルーターに関する情報および設定方法については、NECお問い合わせ窓口までお問い合わせください。

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

## ステップ 2：NEC IXルーターの設定

NEC IXルーターにアクセスし以下の項目を設定します。

- IPsec接続設定
```
>1.     ikev2 authentication psk id ipv4 <VPN GatewayのグローバルIPアドレス> key char <Alibaba Cloud VPN Gatewayと同一の任意の共有鍵>
>2.     ikev2 authentication psk id ipv4 <お客様拠点ルーターのグローバルIPアドレス> key char <Alibaba Cloud VPN Gatewayと同一の任意の共有鍵>
>3.     !
>4.     ikev2 default-profile
>5.      child-lifetime 86400
>6.      local-authentication psk id ipv4 <お客様拠点ルーターのグローバルIPアドレス>
>7.      sa-lifetime 86400
```

- WANインターフェイスのNAPT設定
```
>1.     interface GigaEthernet <Number>
>2.      ip address <お客様拠点ルーターのグローバルIPアドレス>
>3.      ip napt enable
>4.      ip napt static GigaEthernet<Number> 50
>5.      ip napt static GigaEthernet<Number> udp 500
>6.      ip napt static GigaEthernet<Number> udp 4500
>7.      no shutdown
```

- Tunnelインターフェイスの設定
```
>1.     interface Tunnel <Number>
>2.      tunnel mode ipsec-ikev2
>3.     ip unnumbered GigaEthernet <お客様ルーターのLANインターフェイス>
>4.     ip tcp adjust-mss auto
>5.     ikev2 connect-type auto
>6.     ikev2 peer <VPN GatewayのグローバルIPアドレス> authentication psk id ipv4 <VPN GatewayのグローバルIPアドレス>
>7.     no shutdown
```

- 経路設定
```
>1.     ip route 192.168.0.0/24 Tunnel <Number>
```

  ***注意:*** *ルーティング、ポリシー等の項目についても運用方針に沿ってNEC IXルーター側を設定する必要があります。ステップ１でVPN Gatewayのヘルスチェックを利用する場合は送信元IPからのICMPパケットをNEC IXルーター側で許可する必要があります。*

## ステップ 3：ステータス確認

NEC IXルーターの設定が完了し、接続が成功すれば、接続ステータスが「成功」、ヘルスチェックステータスが「正常」に変わります。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-006.png)

## ステップ4：接続のテスト

VPC内のECSインスタンスにログインし、拠点内のプライベートIPアドレスにpingを送信して、VPCと拠点側の通信が成功することを確認します。
