---
title: "Cisco ASAとの接続"
metaTitle: "VPN Gatewayを用いたCisco ASAとのIPsec-VPN接続手順を紹介します。"
metaDescription: "AVPN Gatewayを用いたCisco ASAとのIPsec-VPN接続手順を紹介します。"
date: "2021-06-13"
author: "Hironobu Ohara"
thumbnail: "/images/cm-001.png"
---


<!-- descriptionがコンテンツの前に表示されます -->

<!-- コンテンツを書くときはこの下に記載ください -->



本設定例では、VPCに作成したVPN Gatewayを、お客様拠点に設置したCisco ASAとIPsec-VPNで接続します。

# 事前準備

ネットワークやIPアドレス等を事前に設計し、VPN Gatewayを購入します。

本設定例では、クラウド側のVPC (セグメント 192.168.0.0/24) と拠点側のCisco ASAを (セグメント 192.168.100.0/24) Route-Based接続します。

# 本設定例について

Alibaba CloudのVPCとの接続を保証するものではありません。

2019年 5 月の仕様に基づいて記載しています。確認しているファームウェアは下記のとおりです。今後、サービス内容の変更や、仕様変更などによって接続できなくなる可能性があります。

本設定例でテスト済みのCisco ASAは以下になります。

| **モデル**      | **バージョン**  |
| --------------- | --------------- |
| Cisco ASA 5506W | Version 9.10(1) |

Cisco ASAに関する情報および設定方法については、Ciscoテクニカルサポートまでお問い合わせください。

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

## ステップ 2：Cisco ASAの設定

Cisco ASAにアクセスし以下の項目を設定します。

- IPsec接続設定
```
>1.      “ISAKMP(IKEv2)ポリシー設定”
>2.      crypto ikev2 policy **<prioriry>**
>3.       encryption aes
>4.       integrity sha
>5.       prf sha
>6.       group 2
>7.       lifetime 86400
>8.
>9.      “IKEv2有効化”
>10.     crypto ikev2 enable **<outside_interface_name>**
>11.
>12.     “IKEv2プロポーザル設定”
>13.     crypto ipsec ikev2 ipsec-proposal **<ikev2** **プロファイル名****>**
>14.      protocol esp encryption aes
>15.      protocol esp integrity sha-1
>16.
>17.     “IKEv2プロファイル設定”
>18.     crypto ipsec profile **<ikev2****プロファイル名****>**
>19.      set ikev2 ipsec-proposal **<ikev2****プロファイル名****>**
>20.      set security-association lifetime seconds 86400
>21.
>22.     “Virtual Tunnel IF設定”
>23.     interface Tunnel**<Number>**
>24.      nameif **<VTI****名****>**
>25.      ip address **<****任意のリンクローカルアドレス(例：169.254.0.1)****>**
>26.      tunnel source interface outside
>27.      tunnel destination **<VPN-Gateway****のグローバルIPアドレス****>**
>28.      tunnel mode ipsec ipv4
>29.      tunnel protection ipsec profile **<ikev2****プロファイル名****>**
>30.
>31.     “トンネルグループポリシー設定”
>32.     group-policy **<GROUP-Policy****名****>** internal
>33.     group-policy **<GROUP-Policy****名****>** attributes
>34.      vpn-tunnel-protocol ikev2
>35.
>36.     “トンネルグループ設定”
>37.     tunnel-group **<VPN-Gateway****のグローバルIPアドレス****>** type ipsec-l2l
>38.     tunnel-group **<VPN-Gateway****のグローバルIPアドレス****>** general-attributes
>39.      default-group-policy **<GROUP-Policy****名****>**
>40.     tunnel-group **<VPN-Gateway****のグローバルIPアドレス****>** ipsec-attributes
>41.      ikev2 remote-authentication pre-shared-key **<**A**libaba Cloud VPN Gateway****と同一の任意の共有鍵****>**
>42.      ikev2 local-authentication pre-shared-key **<**A**libaba Cloud VPN Gateway****と同一の任意の共有鍵****>**
>43.
>44.     “経路設定”
>45.     Route **<VTI****名****>** 192.168.0.0 255.255.255.0 **<****任意のリンクローカルアドレス(例：169.254.0.2)****>** 1
```


  ***注意:*** *ルーティング、ポリシー等の項目についても運用方針に沿ってCisco ASA側を設定する必要があります。ステップ１でVPN Gatewayのヘルスチェックを利用する場合は送信元IPからのICMPパケットをCisco ASA側で許可する必要があります。*



## ステップ 3：ステータス確認

Cisco ASA側設定を完了し、接続が成功すれば、接続ステータスが次の通り、「成功」に変わります。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-006.png)

## ステップ4：接続のテスト

VPC内のECSインスタンスにログインし、拠点内のプライベートIPアドレスにpingを送信して、VPCと拠点側の通信が成功することを確認します。
