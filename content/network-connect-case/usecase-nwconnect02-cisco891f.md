---
title: "Ciscoルータとの接続"
metaTitle: "VPN Gatewayを用いたCiscoルータとのIPsec-VPN接続手順を紹介します。"
metaDescription: "VPN Gatewayを用いたCiscoルータとのIPsec-VPN接続手順を紹介します。"
date: "2021-06-13"
author: "Hironobu Ohara"
thumbnail: "/images/img_02.png"
---


<!-- descriptionがコンテンツの前に表示されます -->

<!-- コンテンツを書くときはこの下に記載ください -->

本設定例では、VPCに作成したVPN Gatewayを、お客様拠点に設置したCiscoルーターとIPsec-VPNで接続します。

# 事前準備

ネットワークや IP アドレス等を事前に設計し、VPN Gatewayを購入します。

本設定例では、クラウド側のVPC (セグメント 192.168.0.0/24) とCiscoルーター側 (セグメント 192.168.100.0/24) をRoute-basedで接続します。

# 本設定例について

Alibaba CloudのVPCとの接続を保証するものではありません。

2019年 5 月の仕様に基づいて記載しています。確認しているファームウェアは下記のとおりです。今後、サービス内容の変更や、仕様変更などによって接続できなくなる可能性があります。

本設定例でテスト済みのCiscoルーターは以下になります。

| **モデル** | **バージョン**    |
| ---------- | ----------------- |
| C891FJ-K9  | Version 15.4(3)M8 |

Ciscoルーターに関する情報および設定方法については、Ciscoテクニカルサポートまでお問い合わせください。

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


## ステップ 2：Ciscoルーターの設定

Cisco ルーターにアクセスし以下の項目を設定します。

-  IPsec接続設定

```
>1.     !
>2.     crypto ikev2 proposal <ikev2proposal>
>3.     encryption aes-cbc-128
>4.     integrity sha1
>5.     group 2
>6.     !
>7.     crypto ikev2 policy <ikev2policy>
>8.     proposal <ikev2proposal>
>9.     !
>10.     crypto ikev2 keyring <ikev2keyring>
>11.     peer <AlibabaCloud>
>12.     address <VPN GatewayのグローバルIPアドレス>
>13.     pre-shared-key <Alibaba Cloud VPN Gatewayと同一の任意の共有鍵>
>14.     !
>15.     !
>16.     !
>17.     crypto ikev2 profile <ikev2profile>
>18.     match address local <お客様拠点ルーターのグローバルIPアドレス>
>19.     match identity remote address <VPN GatewayのグローバルIPアドレス> 255.255.255.255
>20.     authentication remote pre-share
>21.     authentication local pre-share
>22.     keyring local <ikev2keyring>
>23.     !
>24.     crypto ipsec transform-set ESP-AES-SHA esp-aes esp-sha-hmac
>25.     mode tunnel
>26.     !
>27.     crypto ipsec profile <ipsecprofile>
>28.     set security-association lifetime seconds <86400>
>29.     set transform-set <ESP-AES-SHA>
>30.     set ikev2-profile <ikev2profile>
>31.     !
```

-  Tunnelインターフェイスの設定
```
>1.     interface Tunnel <Number>
>2.     ip unnumbered <お客様ルーターのWANインターフェイス>
>3.     ip virtual-reassembly in
>4.      tunnel source <お客様ルーターのグローバルIPアドレス>
>5.      tunnel mode ipsec ipv4
>6.      tunnel destination <VPN GatewayのグローバルIPアドレス>
>7.      tunnel protection ipsec profile <ipsecprofile>
```

-  経路設定
```
>1.     ip route 192.168.0.0 255.255.255.0 Tunnel <Number>
```

  ***注意:*** *ルーティング、ポリシー等の項目についても運用方針に沿ってCiscoルーター側を設定する必要があります。ステップ１でVPN Gatewayのヘルスチェックを利用する場合は送信元IPからのICMPパケットをCiscoルーター側で許可する必要があります。*

## ステップ 3：ステータス確認

Cisco ルーターの設定が完了し、接続が成功すれば、接続ステータスが「成功」、ヘルスチェックステータスが「正常」に変わります。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-006.png)

## ステップ4：接続のテスト

VPC内のECSインスタンスにログインし、拠点内のプライベートIPアドレスにpingを送信して、VPCと拠点側の通信が成功することを確認します。
