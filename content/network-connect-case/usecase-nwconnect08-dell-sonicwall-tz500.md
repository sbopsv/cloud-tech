---
title: "SonicWALLとの接続"
metaTitle: "VPN Gatewayを用いたSonicWALLとのIPsec-VPN接続手順を紹介します。"
metaDescription: "VPN Gatewayを用いたSonicWALLとのIPsec-VPN接続手順を紹介します。"
date: "2021-06-13"
author: "Hironobu Ohara"
thumbnail: "/images/cm-003.png"
---


<!-- descriptionがコンテンツの前に表示されます -->

<!-- コンテンツを書くときはこの下に記載ください -->



本設定例では、VPCに設置したVPN Gatewayを、お客様拠点に設置したSonicWALLとIPsec-VPNで接続します。

# 事前準備

ネットワークやIPアドレス等を事前に設計し、VPN Gatewayを購入します。

本設定例では、クラウド側のVPC (セグメント 192.168.0.0/24) とSonicWALL側 (セグメント 192.168.100.0/24) をRoute-basedで接続します。

# 本設定例について

Alibaba CloudのVPCとの接続を保証するものではありません。

2019年 11 月の仕様に基づいて記載しています。確認しているファームウェアは下記のとおりです。今後、サービス内容の変更や、仕様変更などによって接続できなくなる可能性があります。

本設定例でテスト済みの SonicWALLは以下になります。

| **モデル**      | **バージョン**                    |
| --------------- | --------------------------------- |
| SonicWALL TZ500 | SonicOS Enhanced  6.5.4.4-44n.jpn |

SonicWALLに関する情報および設定方法については、SonicWALLお客様サポートセンターまでお問い合わせください。

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

## ステップ 2：SonicWALLの設定

SonicWALLにアクセスし以下の項目を設定します。

- IPsec接続設定
管理 > 接続性 > VPN > 基本設定 を選択し、VPN ポリシー > 追加を選択します。

- 一般設定タブ
\> セキュリティ
ポリシー種別：トンネル インターフェースを選択します。
認証方式：IKE (事前共有鍵を使用)を選択します。
名前：任意の名前を入力します。
プライマリ IPsec ゲートウェイ名またはアドレス：VPN GatewayのIPアドレスを入力します。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/sw-001.png)
\> IKE 認証
共有鍵：Alibaba Cloud VPN Gatewayと同一の任意の共有鍵を入力します。
ローカル IKE ID：IPv4アドレスを選択し、お客様拠点ルータのIPアドレスを入力します。
ピア IKE ID：IPv4 アドレスを選択し、VPN GatewayのIPアドレスを入力します。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/sw-002.png)

- プロポーザル設定タブ
\> IKE（フェーズ１）プロポーザル
鍵交換モード：IKEv2モードを選択します。
DH グループ：グループ 2を選択します。
暗号化：AES-128を選択します。
認証：SHA1を選択します。
存続期間 (秒)：86400 を入力します。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/sw-003.png)
\> Ipsec（フェーズ２）プロポーザル
プロトコル：ESPを選択します。
暗号化：AES-128を選択します。
存続期間 (秒)：86400 を入力します。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/sw-004.png)

- 詳細タブ
\> 詳細設定
VPN ポリシーの適用先：Alibaba Cloudへ向かうInterfaceを指定します。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/sw-005.png)

  ***注意:*** *ルーティング、ポリシー等の項目についても運用方針に沿ってSonicWALL側を設定する必要があります。ステップ１でVPN Gatewayのヘルスチェックを利用する場合は送信元IPからのICMPパケットをSonicWALL側で許可する必要があります。*

## ステップ 3：ステータス確認

SonicWALLの設定が完了し、接続が成功すれば、接続ステータスが「成功」、ヘルスチェックステータスが「正常」に変わります。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-006.png)

## ステップ4：接続のテスト

VPC内のECSインスタンスにログインし、拠点内のプライベートIPアドレスにpingを送信して、VPCと拠点側の通信が成功することを確認します。
