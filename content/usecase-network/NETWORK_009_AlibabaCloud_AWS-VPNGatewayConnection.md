---
title: "AlibabaCloudとAWSネットワーク接続手順"
metaTitle: "AlibabaCloudとAWS間のネットワークをVPNGatewayで接続する手順"
metaDescription: "Alibab Cloudによるネットワーク活用パターン・AlibabaCloudとAWSの間VPNGatewayでネットワーク接続手順を説明します"
date: "2021-06-09"
author: "Nancy"
thumbnail: "/images01/00_overview.png"
---

# AlibabaCloudとAWS間のネットワークをVPNGatewayで接続する手順

このVPN接続ソリューションでは、Alibaba CloudとAmazon Web Servicesの両方でVPN Gatewayの設定方法をご紹介します

マルチクラウドは、プロバイダが複数の技術力を持つことのメリットがあり、ベンダーのロックインを避けるために、最も求められているアーキテクチャ設計の1つです。アリババクラウドで様々なクラウドプロバイダーに接続できるようにするには、いくつかの選択肢があります。その一つが、VPNゲートウェイを経由して公共のインターネットを介して接続する方法です。

構造図：
 ![00_overview](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/00_overview.png "00_overview")


# 前提条件
1.コンピュータまたはラップトップ
2.ウェブブラウザ、Google Chromeを推奨
3.インターネット、5Mbpsを推奨
4.アリババクラウドとAWSのアカウント

# 1. AlibabaCloudでリソースを作成

## 1-1.VPC/VSW作成
①AlibabaCloudサイトにログインし、コンソール画面を開く
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/01-Create_VPC_01.png "Create VPC 01")

②VPC作成ボタンをクリックし、VPC作成画面を開く
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/01-Create_VPC_02.png "Create VPC 02")

③VPCとVSWを設定し、OKボタンをクリックする
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/01-Create_VPC_03.png "Create VPC 03")

④VPCとVSwitchが作成されました
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/01-Create_VPC_04.png "Create VPC 04")


## 1-2. ECS作成

①コンソール画面にECSプロダクトを選択する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/02-Create_ECS_01.png "Create ECS 01")

②「インスタンスの作成」ボタンをクリックし、ECS作成画面を開く
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/02-Create_ECS_02.png "Create ECS 02")

③課金方法、リージョン、インスタンスタイプとイメージを設定して、次の画面に遷移する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/02-Create_ECS_03.png "Create ECS 03")

④VPCネットワークを設定して、次の画面に遷移する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/02-Create_ECS_04.png "Create ECS 04")

⑤パスワードを設定し、ECSを作成する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/02-Create_ECS_05.png "Create ECS 05")

⑥ECSインスタンスを確認する
![create ECS ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/02-Create_ECS_06.png "Create ECS 06")

## 1-3. VPN Gateway作成
①コンソール画面にVPNGatewayプロダクトを選択する
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/03-Create_VPNGW_01.png "Create VPNGW 01")

②「VPNGatewayの作成」ボタンをクリックし、VPNGateway作成画面を開く
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/03-Create_VPNGW_02.png "Create VPNGW 02")

③VPNGatewayを設定し「今すぐ購入」をクリックする
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/03-Create_VPNGW_03.png "Create VPNGW 03")

④VPNGatewayインスタンスを確認する
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/03-Create_VPNGW_04.png "Create VPNGW 04")

# 2. AWSでリソースを作成
## 2-1.VPC/ Subnet作成
①AWSサイトにログインし、VPC作成画面でVPCを設定する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/04-Create_VPC_01.png "Create VPC 01")

②VPCの詳細画面を確認する
![create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/04-Create_VPC_02.png "Create VPC 02")

③VPC画面でSubnetメニューをクリックする
![create Subnet ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/04-Create_Subnet_01.png "Create Subnet 01")

④Subnet画面にCreateSubnetメニューをクリックする
![create Subnet ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/04-Create_Subnet_02.png "Create Subnet 02")

⑤ubnet設定画面でVPC、IPv4CIDRを設定する
![create Subnet ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/04-Create_Subnet_03.png "Create Subnet 03")

⑥Subnetを確認する
![create Subnet ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/04-Create_Subnet_04.png "Create Subnet 04")

## 2-2.EC2作成（セキュリティ設定）
①コンソール画面にEC2インスタンスの作成をクリックし、IMA画面に遷移する
![create EC2 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/05-Create_EC2_01.png "Create EC2 01")

②イメージを選択し、インスタンスタイプ画面に遷移する
![create EC2 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/05-Create_EC2_02.png "Create EC2 02")

③インスタンスタイプを選択して、次の画面に遷移する
![create EC2 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/05-Create_EC2_03.png "Create EC2 03")

④作成ボタンをクリックし、次の画面に遷移する
![create EC2 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/05-Create_EC2_04.png "Create EC2 04")

⑤VPCとSubnetを選択し、次の画面に遷移する
![create EC2 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/05-Create_EC2_05.png "Create EC2 05")

⑥Keyを設定し、次の画面に遷移する
![create EC2 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/05-Create_EC2_06.png "Create EC2 06")

⑦EC2作成状態を確認する
![create EC2 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/05-Create_EC2_07.png "Create EC2 07")

⑧EC2インスタンスを確認する
![create EC2 ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/05-Create_EC2_08.png "Create EC2 08")

⑨セキュリティー設定画面に、ICMPのインバウンドを追加する
![Add security ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/05-Add_Security_01.png "Add security 01")

⑩ICMPのインバウンドを確認する
![Add security ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/05-Add_Security_02.png "Add security 02")

## 2-3.VirtualPrivateGateway作成
①VirtualPrivateGateway画面で名前とASNを設定する
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/06-Create_VPNGW_01.png "Create VPNGW 01")

②VirtualPrivateGatewayを作成する
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/06-Create_VPNGW_02.png "Create VPNGW 02")

③VirtualPrivateGatewayのステータスを確認する
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/06-Create_VPNGW_03.png "Create VPNGW 03")

④VirtualPrivateGatewayをVPCにバインドする
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/06-Create_VPNGW_04.png "Create VPNGW 04")

⑤VirtualPrivateGatewayをVPCにバインド中
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/06-Create_VPNGW_05.png "Create VPNGW 05")

⑥VirtualPrivateGatewayをVPCにバインド完了
![create VPNGW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/06-Create_VPNGW_06.png "Create VPNGW 06")

# 3. VPN接続設定
## 3-1.CustomerGateway作成（AWS）
①CustomerGateway設定画面で、IPアドレスはカスタマーのIPを作成する
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/07-Create_Customer_GW_01.png "Create Customer GW 01")

②CustomerGatewayを作成完了
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/07-Create_Customer_GW_02.png "Create Customer GW 02")

③CustomerGatewayを確認する
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/07-Create_Customer_GW_03.png "Create Customer GW 03")

## 3-2.VPNConnection作成（AWS）
①VPN Connection画面で下記キャプチャーのように設定する
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/08-Create_VPN_Connection_01.png "Create VPN Connection 01")

![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/08-Create_VPN_Connection_02.png "Create VPN Connection 02")

②VPN Connectionが作成される
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/08-Create_VPN_Connection_03.png "Create VPN Connection 03")

④TunnelDetailsタブをクリックする
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/08-Create_VPN_Connection_04.png "Create VPN Connection 04")

⑤Tunnel1のIPを確認する
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/08-Create_VPN_Connection_05.png "Create VPN Connection 05")

## 3-3.RouteEntry作成（AWS）
①RouteTablesメニューをクリックし、RouteTablesが表示される
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/09-Create_Route_Entry_01.png "Create Route Entry 01")

②RouteTableIDをクリックし、Routes画面に遷移する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/09-Create_Route_Entry_02.png "Create Route Entry 02")

③Edit routesをクリックし、Route設定画面に遷移する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/09-Create_Route_Entry_03.png "Create Route Entry 03")

④Routeが設定される
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/09-Create_Route_Entry_04.png "Create Route Entry 04")

⑤VPNConnectionsで設定のStaticRouteを確認する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/09-Create_Route_Entry_05.png "Create Route Entry 05")

## 3-4.CustomerGateway作成（AlibabaCloud）
①VPNのCustomerGateway設定画面で、「カスタマーゲートウェイの作成」をクリックする
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/10-Create_Customer_GW_01.png "Create Customer GW 01")

②CustomerGatewayを設定する
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/10-Create_Customer_GW_02.png "Create Customer GW 02")

③CustomerGatewayを確認する
![create Customer GW ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/10-Create_Customer_GW_03.png "Create Customer GW 03")

## 3-5.VPNConnection作成（AlibabaCloud）
①VPNのIPsec接続メニューをクリックし、「VPN接続の作成」をクリックする
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/11-Create_VPN_Connection_01.png "Create VPN Connection 01")

②IPsec Connection下記のキャプチャーを参考し設定する
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/11-Create_VPN_Connection_02.png "Create VPN Connection 02")

 ![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/11-Create_VPN_Connection_03.png "Create VPN Connection 03")

 ![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/11-Create_VPN_Connection_04.png "Create VPN Connection 04")

⑤IPsec Connectionを確認する
![create VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/11-Create_VPN_Connection_05.png "Create VPN Connection 05")

## 3-6.RouteEntry作成（AlibabaCloud）
①VPNGatewayの詳細画面にて宛先ベースルーティングの「ルートエントリの追加」をクリックする
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/12-Create_Route_Entry_01.png "Create Route Entry 01")

②ルートエントリの設定画面でルートエントリを追加する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/12-Create_Route_Entry_02.png "Create Route Entry 02")

③ルートエントリを確認する
![create Route Entry ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/12-Create_Route_Entry_03.png "Create Route Entry 03")

## 3-7.通信確認
①AlibabaCloud ECSのIPsec接続のステータスを確認する
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/13-Check_VPN_Connection_01.png "Check VPN Connection 01")

②AWSのTunnel1のステータスを確認する
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/13-Check_VPN_Connection_02.png "Check VPN Connection 02")

③AlibabaCloudのECS PrivateIPを確認する
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/13-Check_VPN_Connection_03.png "Check VPN Connection 03")

④AWSのEC2 PrivateIPを確認する
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/13-Check_VPN_Connection_04.png "Check VPN Connection 04")

⑤VNC接続をクリックする
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/13-Check_VPN_Connection_05.png "Check VPN Connection 05")

⑥Connectをクリックする
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/13-Check_VPN_Connection_06.png "Check VPN Connection 06")

⑦AlibabaCloudのECSからAWSのEC2のIPをPingチェックする
![Check VPN Connection ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/images01/13-Check_VPN_Connection_07.png "Check VPN Connection 07")

# まとめ

このVPNゲートウェイソリューションにより、Alibaba CloudとAWSの両方でインターネットを介して両サイト間を安全に接続することができます。


