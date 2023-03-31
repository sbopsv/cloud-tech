---
title: "AlibabaCloudとAzureネットワーク接続手順"
metaTitle: "AlibabaCloudとAzure間のネットワークをVPNGatewayで接続する手順"
metaDescription: "Alibab Cloudによるネットワーク活用パターン・AlibabaCloudとAzureの間VPNGatewayでネットワーク接続手順を説明します"
date: "2021-06-09"
author: "Nancy"
thumbnail: "/images02/00_overview.png"
---

# AlibabaCloudとAzure間のネットワークをVPNGatewayで接続する手順

このVPN接続ソリューションでは、Alibaba CloudとAzureの両方でVPN Gatewayの設定方法をご紹介します

マルチクラウドは、プロバイダが複数の技術力を持つことのメリットがあり、ベンダーのロックインを避けるために、最も求められているアーキテクチャ設計の1つです。アリババクラウドで様々なクラウドプロバイダーに接続できるようにするには、いくつかの選択肢があります。その一つが、VPNゲートウェイを経由して公共のインターネットを介して接続する方法です。

構造図：
 ![00_overview](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/00_overview.png "00_overview")


# 前提条件
1.コンピュータまたはラップトップ
2.ウェブブラウザ、Google Chromeを推奨
3.インターネット、5Mbpsを推奨
4.アリババクラウドとAzureのアカウント

# 1. AlibabaCloudでリソースを作成

## 1-1.VPC/VSW作成
①AlibabaCloudサイトにログインし、コンソール画面を開く
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/01-Create_VPC_01.png "Create VPC 01")

②VPC作成ボタンをクリックし、VPC作成画面を開く
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/01-Create_VPC_02.png "Create VPC 02")

③VPCとVSWを設定し、OKボタンをクリックする
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/01-Create_VPC_03.png "Create VPC 03")

④VPCとVSwitchが作成されました
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/01-Create_VPC_04.png "Create VPC 04")


## 1-2. ECS作成

①コンソール画面にECSプロダクトを選択する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/02-Create_ECS_01.png "Create ECS 01")

②「インスタンスの作成」ボタンをクリックし、ECS作成画面を開く
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/02-Create_ECS_02.png "Create ECS 02")

③課金方法、リージョン、インスタンスタイプとイメージを設定して、次の画面に遷移する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/02-Create_ECS_03.png "Create ECS 03")

④VPCネットワークを設定して、次の画面に遷移する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/02-Create_ECS_04.png "Create ECS 04")

⑤パスワードを設定し、ECSを作成する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/02-Create_ECS_05.png "Create ECS 05")

⑥ECSインスタンスを確認する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/02-Create_ECS_06.png "Create ECS 06")

## 1-3. VPN Gateway作成
①コンソール画面にVPNGatewayプロダクトを選択する
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/03-Create_VPNGW_01.png "Create VPNGW 01")

②「VPNGatewayの作成」ボタンをクリックし、VPNGateway作成画面を開く
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/03-Create_VPNGW_02.png "Create VPNGW 02")

③VPNGatewayを設定し「今すぐ購入」をクリックする
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/03-Create_VPNGW_03.png "Create VPNGW 03")

④VPNGatewayインスタンスを確認する
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/03-Create_VPNGW_04.png "Create VPNGW 04")

# 2. Azureでリソースを作成
## 2-1.VPC/Subnet作成
①Azureサイトにログインし、VPC作成画面でVPCを設定する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/04-Create_VPC_01.png "Create VPC 01")

②VPCを設定する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/04-Create_VPC_02.png "Create VPC 02")

③CIDRを設定する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/04-Create_VPC_03.png "Create VPC 03")

④VPC/Subnet作成中
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/04-Create_VPC_04.png "Create VPC 04")

⑤VPC概要を確認する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/04-Create_VPC_05.png "Create VPC 05")

⑥Subnetを確認する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/04-Create_VPC_06.png "Create VPC 06")

## 2-2.VirtualMachine作成（セキュリティ設定）
①VM画面にVMインスタンスの作成をクリックする
![create VM ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/05-Create_VM_01.png "Create VM 01")

②イメージを選択し、ネットワーク設定画面に遷移する
![create VM ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/05-Create_VM_02.png "Create VM 02")

③サブネットを選択して、PublicIPをなしに設定する
![create VM ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/05-Create_VM_03.png "Create VM 03")

④作成ボタンをクリックし、次の画面に遷移する
![create VM ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/05-Create_VM_04.png "Create VM 04")

⑤VM作成中
![create VM ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/05-Create_VM_05.png "Create VM 05")

⑥VM詳細画面にPrivateIPを確認する
![create VM ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/05-Create_VM_06.png "Create VM 06")

⑦Networking画面に、ICMPのインバウンドセキュリティールールを追加する
![Add ICMP ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/05-Add_ICMP_01.png "Add ICMP 01")

⑧ICMPを確認する
![Add ICMP ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/05-Add_ICMP_02.png "Add ICMP 02")

## 2-3.VirtualNetworkGateway作成
①VirtualNetworkGateway作成をクリックする
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/06-Create_VPNGW_01.png "Create VPNGW 01")

②VirtualNetworkGatewayを設定する
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/06-Create_VPNGW_02.png "Create VPNGW 02")

③VirtualNetworkGatewayの情報を確認する
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/06-Create_VPNGW_03.png "Create VPNGW 03")

④VirtualNetworkGateway作成中
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/06-Create_VPNGW_04.png "Create VPNGW 04")

⑤VirtualNetworkGateway詳細にて、VPNIPを確認する
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/06-Create_VPNGW_05.png "Create VPNGW 05")


# 3. VPN接続設定
## 3-1.LocalNetworkGateway作成（Azure）
①LocalNetworkGateway作成をクリックし、LocalNetworkGateway設定画面に遷移する
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/07-Create_LocalNW_GW_01.png "Create Customer GW 01")

②LocalNetworkGateway設定画面で、IPアドレスとAddressSpaceはカスタマーのIPとCIDRを設定する
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/07-Create_LocalNW_GW_02.png "Create Customer GW 02")

③LocalNetworkGatewayを確認する
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/07-Create_LocalNW_GW_03.png "Create Customer GW 03")


## 3-2.VPNConnection作成（Azure）
①VPN Connection画面で下記キャプチャーのように設定する
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/08-Create_VPN_Connection_01.png "Create VPN Connection 01")

②Ipsec/IKEをカスタマイズする
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/08-Create_VPN_Connection_02.png "Create VPN Connection 02")


## 3-3.RouteTables作成（Azure）
①RouteTables作成画面にリソースグループ、リージョンとRouteTableの名前を設定する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/09-Create_Route_Entry_01.png "Create Route Entry 01")

②RouteTables設定情報をプレビューする
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/09-Create_Route_Entry_02.png "Create Route Entry 02")

③RouteTableが作成完了
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/09-Create_Route_Entry_03.png "Create Route Entry 03")

④RouteTable画面にVPCのデフォルトSubnetを追加する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/09-Create_Route_Entry_04.png "Create Route Entry 04")

⑤RouteTable画面にVPNGatewayのSubnetを追加する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/09-Create_Route_Entry_05.png "Create Route Entry 05")

⑥Subnetを確認する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/09-Create_Route_Entry_06.png "Create Route Entry 06")

⑦Routesを追加する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/09-Create_Route_Entry_07.png "Create Route Entry 07")

⑧Routeを設定する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/09-Create_Route_Entry_08.png "Create Route Entry 08")

⑨Routeを確認する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/09-Create_Route_Entry_09.png "Create Route Entry 09")

## 3-4.CustomerGateway作成（AlibabaCloud）
①VPNのCustomerGateway設定画面で、「カスタマーゲートウェイの作成」をクリックする
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/10-Create_Customer_GW_01.png "Create Customer GW 01")

②CustomerGatewayを設定する
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/10-Create_Customer_GW_02.png "Create Customer GW 02")

③CustomerGatewayを確認する
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/10-Create_Customer_GW_03.png "Create Customer GW 03")

## 3-5.VPNConnection作成（AlibabaCloud）
①VPNのIPsec接続メニューをクリックし、「VPN接続の作成」をクリックする
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/11-Create_VPN_Connection_01.png "Create VPN Connection 01")

②IPsec Connection下記のキャプチャーを参考し設定する
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/11-Create_VPN_Connection_02.png "Create VPN Connection 02")

 ![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/11-Create_VPN_Connection_03.png "Create VPN Connection 03")

 ![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/11-Create_VPN_Connection_04.png "Create VPN Connection 04")

⑤IPsec Connectionを確認する
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/11-Create_VPN_Connection_05.png "Create VPN Connection 05")

## 3-6.RouteEntry作成（AlibabaCloud）
①VPNGatewayの詳細画面にて宛先ベースルーティングの「ルートエントリの追加」をクリックする
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/12-Create_Route_Entry_01.png "Create Route Entry 01")

②ルートエントリの設定画面でルートエントリを追加する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/12-Create_Route_Entry_02.png "Create Route Entry 02")

③ルートエントリを確認する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/12-Create_Route_Entry_03.png "Create Route Entry 03")

## 3-7.通信確認
①AlibabaCloudのVPNConnectionステータスを確認する
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/13-Check_VPN_Connection_01.png "Check VPN Connection 01")

②AzureのVPNConnectionステータスを確認する
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/13-Check_VPN_Connection_02.png "Check VPN Connection 02")

③AlibabaCloudのECSPrivateIPを確認する
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/13-Check_VPN_Connection_03.png "Check VPN Connection 03")

④AzureのVM PrivateIPを確認する
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/13-Check_VPN_Connection_04.png "Check VPN Connection 04")

⑤VNC接続をクリックする
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/13-Check_VPN_Connection_05.png "Check VPN Connection 05")

⑥Connectをクリックする
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/13-Check_VPN_Connection_06.png "Check VPN Connection 06")

⑦AlibabaCloudのECSからAzureのEC2のIPへPingチェックする
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images02/13-Check_VPN_Connection_07.png "Check VPN Connection 07")

# まとめ
このVPNゲートウェイソリューションにより、Alibaba CloudとAzureの両方でインターネットを介して両サイト間を安全に接続することができます。
