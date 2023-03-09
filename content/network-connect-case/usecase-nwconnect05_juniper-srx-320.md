---
title: "Juniper SRXとの接続"
metaTitle: "VPN Gatewayを用いたJuniper SRXとのIPsec-VPN接続手順を紹介します。"
metaDescription: "VPN Gatewayを用いたJuniper SRXとのIPsec-VPN接続手順を紹介します。"
date: "2021-06-13"
author: "Hironobu Ohara"
thumbnail: "/images/cm-006.png"
---



<!-- descriptionがコンテンツの前に表示されます -->

<!-- コンテンツを書くときはこの下に記載ください -->



本設定例では、VPCに作成したVPN Gatewayを、お客様拠点に設置したJuniper SRXとIPsec-VPNで接続します。

# 事前準備

ネットワークやIPアドレス等を事前に設計し、VPN Gatewayを購入します。

本設定例では、クラウド側の VPC (セグメント 192.168.0.0/24) とJuniper SRX側 (セグメント 192.168.100.0/24) をRoute-basedで接続します。

# 本設定例について

Alibaba CloudのVPCとの接続を保証するものではありません。

2019年 8 月の仕様に基づいて記載しています。確認しているファームウェアは下記のとおりです。今後、サービス内容の変更や、仕様変更などによって接続できなくなる可能性があります。

本設定例でテスト済みの Juniper SRXは以下になります。

| **モデル**     | **バージョン**            |
| -------------- | ------------------------- |
| Juniper SRX320 | Version    15.1X49-D150.2 |

Juniper SRXに関する情報および設定方法については、ジュニパーネットワークス株式会社または販売代理店までお問い合わせください。

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

## ステップ 2：   Juniper SRXの設定

Juniper SRXにアクセスし以下の項目を設定します。

- IPsec接続設定
```
>1.     !
>2.     set security ike proposal IKE-PROPOSAL authentication-method pre-shared-keys
>3.     set security ike proposal IKE-PROPOSAL dh-group group2
>4.     set security ike proposal IKE-PROPOSAL authentication-algorithm sha1
>5.     set security ike proposal IKE-PROPOSAL encryption-algorithm aes-128-cbc
>6.     set security ike proposal IKE-PROPOSAL lifetime-seconds 86400
>7.     !
>8.     set security ike policy IKE-POLICY proposals IKE-PROPOSAL
>9.     set security ike policy IKE-POLICY pre-shared-key ascii-text " Alibaba Cloud VPN Gatewayと同一の任意の共有鍵"
>10.     !
>11.     set security ike gateway GW ike-policy IKE-POLICY
>12.     set security ike gateway GW address “VPN GatewayのグローバルIPアドレス”
>13.     set security ike gateway GW dead-peer-detection always-send
>14.     set security ike gateway GW dead-peer-detection interval “DPDの任意の間隔”
>15.     set security ike gateway GW dead-peer-detection threshold “DPDの任意の回数”
>16.     set security ike gateway GW external-interface “VPN GatewayのグローバルIPアドレス”
>17.     set security ike gateway GW version v2-only
>18.     !
>19.     !
>20.     set security ipsec proposal IPSEC-PROPOSAL protocol esp
>21.     set security ipsec proposal IPSEC-PROPOSAL authentication-algorithm hmac-sha1-96
>22.     set security ipsec proposal IPSEC-PROPOSAL encryption-algorithm aes-128-cbc
>23.     set security ipsec proposal IPSEC-PROPOSAL lifetime-seconds 86400
>24.     !
>25.     set security ipsec policy IPSEC-POLICY proposals IPSEC-PROPOSAL
>26.     !
>27.     set security ipsec vpn VPN bind-interface st0.0
>28.     set security ipsec vpn VPN ike gateway GW
>29.     set security ipsec vpn VPN ike proxy-identity local 0.0.0.0/0
>30.     set security ipsec vpn VPN ike proxy-identity remote 0.0.0.0/0
>31.     set security ipsec vpn VPN ike proxy-identity service any
>32.     set security ipsec vpn VPN ike ipsec-policy IPSEC-POLICY
>33.     !
```

- NAT設定
```
>1.     set security nat source rule-set NAT from zone Trust
>2.     set security nat source rule-set NAT to zone Untrust
>3.     set security nat source rule-set NAT rule NAT-Rule match source-address 192.168.100.0/24
>4.     set security nat source rule-set NAT rule NAT-Rule match destination-address 0.0.0.0/0
>5.     set security nat source rule-set NAT rule NAT-Rule then source-nat interface
>6.     !
>7.     set security zones security-zone VPN address-book address CLOUD 192.168.0.0/24
>8.     set security zones security-zone VPN interfaces st0.0
>9.     !
>10.     set security zones security-zone Trust address-book address SRX 192.168.100.0/24
>11.     set security zones security-zone Trust interfaces “LAN側Interface名”
>12.     !
>13.     set security zones security-zone Untrust interfaces “WAN側Interface名” host-inbound-traffic system-services ike
>14.     !
>15.     set security policies from-zone VPN to-zone Trust policy VPN_SRX match source-address CLOUD
>16.     set security policies from-zone VPN to-zone Trust policy VPN_SRX match destination-address SRX
>17.     set security policies from-zone VPN to-zone Trust policy VPN_SRX match application any
>18.     set security policies from-zone VPN to-zone Trust policy VPN_SRX then permit
>19.     !
>20.     set security policies from-zone Trust to-zone VPN policy SRX_VPN match source-address SRX
>21.     set security policies from-zone Trust to-zone VPN policy SRX_VPN match destination-address CLOUD
>22.     set security policies from-zone Trust to-zone VPN policy SRX_VPN match application any
>23.     set security policies from-zone Trust to-zone VPN policy SRX_VPN then permit
>24.     !
>25.     set security policies from-zone Trust to-zone Untrust policy Permit match source-address any
>26.     set security policies from-zone Trust to-zone Untrust policy Permit match destination-address any
>27.     set security policies from-zone Trust to-zone Untrust policy Permit match application any
>28.     set security policies from-zone Trust to-zone Untrust policy Permit then permit
>29.     !
```

- Tunnelインターフェイスの設定
```
>1.     set interfaces st0 unit 0 family inet
```

- 経路設定
```
>1.     set routing-options static route 192.168.0.0/24 next-hop st0.0
```

  ***注意:*** *ルーティング、ポリシー等の項目についても運用方針に沿ってJuniper SRX側を設定する必要があります。ステップ１でVPN Gatewayのヘルスチェックを利用する場合は送信元IPからのICMPパケットをJuniper SRX側で許可する必要があります。*

## ステップ 3：ステータス確認

Juniper SRXの設定が完了し、接続が成功すれば、接続ステータスが「成功」、ヘルスチェックステータスが「正常」に変わります。
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/network-connect-case/images/cm-006.png)

## ステップ4：接続のテスト

VPC内のECSインスタンスにログインし、拠点内のプライベートIPアドレスにpingを送信して、VPCと拠点側の通信が成功することを確認します。

## Appendix：最終的な設定
```
>1.     !
>2.     security {
>3.         ike {
>4.             proposal IKE-PROPOSAL {
>5.                 authentication-method pre-shared-keys;
>6.                 dh-group group2;
>7.                 authentication-algorithm sha1;
>8.                 encryption-algorithm aes-128-cbc;
>9.                 lifetime-seconds 86400;
>10.             }
>11.             policy IKE-POLICY {
>12.                 Proposals IKE-PROPOSAL;
>13.                 pre-shared-key ascii-text “Alibaba Cloud VPN Gatewayと同一の任意の共有鍵”
>14.             }
>15.             gateway GW{
>16.                 ike-policy IKE-POLICY;
>17.                 address “VPN GatewayのグローバルIPアドレス”;
>18.                 dead-peer-detection {
>19.                     always-send;
>20.                     interval “DPDの任意の間隔”;
>21.                     threshold “DPDの任意の回数”;
>22.                 }
>23.                 external-interface “WAN側Interface名”;
>24.                 version v2-only;
>25.             }
>26.         }
>27.         ipsec {
>28.             proposal IPSEC-PROPOSAL {
>29.                 protocol esp;
>30.                 authentication-algorithm hmac-sha1-96;
>31.                 encryption-algorithm aes-128-cbc;
>32.                 lifetime-seconds 86400;
>33.             }
>34.             policy IPSEC-POLICY{
>35.                 proposals IPSEC-PROPOSAL;
>36.             }
>37.             vpn VPN{
>38.                 bind-interface st0.0;
>39.                 ike {
>40.                     gateway IPSEC-PROPOSAL;
>41.                     proxy-identity {
>42.                         local 0.0.0.0/0;
>43.                         remote 0.0.0.0/0;
>44.                         service any;
>45.                     }
>46.                     ipsec-policy IPSEC-POLICY;
>47.                 }
>48.             }
>49.         }
>50.     security {
>51.         nat {
>52.             source {
>53.                 rule-set NAT {
>54.                     from zone Trust;
>55.                     to zone Untrust;
>56.                     rule NAT-Rule {
>57.                         match {
>58.                             source-address 192.168.100.0/24;
>59.                             destination-address 0.0.0.0/0;
>60.                         }
>61.                         then {
>62.                             source-nat {
>63.                                 interface;
>64.                             }
>65.                         }
>66.                     }
>67.                 }
>68.             }
>69.         }
>70.       zones {
>71.             security-zone VPN {
>72.                 address-book {
>73.                     address CLOUD 192.168.0.0/24;
>74.                 }
>75.                 interfaces {
>76.                     st0.0;
>77.                 }
>78.             }
>79.             security-zone Trust {
>80.                 address-book {
>81.                     address SRX 192.168.100.0/24;
>82.                 }
>83.                 interfaces {
>84.                     “LAN側Interface名”;
>85.                 }
>86.             }
>87.             security-zone Untrust {
>88.                 interfaces {
>89.                     “WAN側Interface名” {
>90.                         host-inbound-traffic {
>91.                             system-services {
>92.                                 ike;
>93.                             }
>94.                         }
>95.                     }
>96.                 }
>97.             }
>98.         }
>99.         policies {
>100.             from-zone VPN to-zone Trust {
>101.                 policy VPN_SRX {
>102.                     match {
>103.                         source-address CLOUD;
>104.                         destination-address SRX;
>105.                         application any;
>106.                     }
>107.                     then {
>108.                         permit;
>109.                     }
>110.                 }
>111.             }
>112.             from-zone Trust to-zone VPN {
>113.                 policy SRX_VPN {
>114.                     match {
>115.                         source-address SRX;
>116.                         destination-address CLOUD;
>117.                         application any;
>118.                     }
>119.                     then {
>120.                         permit;
>121.                     }
>122.                 }
>123.             }
>124.             from-zone Trust to-zone Untrust {
>125.                 policy Permit {
>126.                     match {
>127.                         source-address any;
>128.                         destination-address any;
>129.                         application any;
>130.                     }
>131.                     then {
>132.                         permit;
>133.                     }
>134.                 }
>135.             }
>136.         }
>137.     }
>138.     interfaces {
>139.         st0 {
>140.             unit 0 {
>141.                 family inet {
>142.                     }
>143.                 }
>144.             }
>145.         }
>146.     }
>147.     routing-options {
>148.         static {
>149.             route 192.168.0.0/24 next-hop st0.0;
>150.         }
>151.     }
```

  ***注意:*** *ルーティング、ポリシー等の項目についても運用方針に沿ってJuniper SRX側を設定する必要があります。ステップ１でVPN Gatewayのヘルスチェックを利用する場合は送信元IPからのICMPパケットをJuniper SRX側で許可する必要があります。*
