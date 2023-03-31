---
title: "DaaS環境構築-構築編①"
metaTitle: "Alibaba Cloudで実現するお手軽DaaS環境 # 構築編①"
metaDescription: "Alibaba Cloudで実現するお手軽DaaS環境 # 構築編①"
date: "2020-04-23"
author: "SBC engineer blog"
thumbnail: "/computing_images_26006613554741100/20200423065138.png"
---

## DaaS環境構築-構築編①

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423183725.png "img")      

## はじめに

本記事では、<span style="color: #ff0000">`Alibaba Cloudで実現するお手軽DaaS環境`</span>シリーズ第2回目として、Alibaba Cloudを使った仮想デスクトップ環境を構築する手順をご紹介します。    

## 構築全体像
構築に入る前に、構築するAlibaba Cloudリソースの全体像と、構築手順の概要をお見せします。

### 構築対象
今回構築するDaaS環境の全体像は以下になります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065138.png "DaaS環境構築全体像")      

### 構築手順概要
DaaS環境構築のおおまかな手順は以下となります。

1. **クラウドリソース作成**：Alibaba Cloud上にクラウドリソースを作成します。<span style="color: #ff0000">本記事にてご説明します。</span>
2. **Active Directory構築**：ECS（Windows Server 2019）上にActive Directoryを構築します。<span style="color: #0000cc">次回`構築編②`で紹介予定です。</span>
3. **カスタムイメージ作成**：ECSにOS設定やToolのインストール等を行い、仮想サーバのベースとなるカスタムイメージを作成します。<span style="color: #0000cc">次回`構築編②`で紹介予定です。</span>
4. **仮想サーバローンチ**：Auto Scalingを増台し、仮想サーバを立ち上げます。<span style="color: #0000cc">次回`構築編②`で紹介予定です。</span>

本記事では、<span style="color: #ff0000">`1.クラウドリソース作成`</span>の手順を紹介していきます。

## 構築手順
ではさっそく、DaaS環境を構成するAlibaba Cloudリソース達を構築していきたいと思います 

構築は以下の順番で行っていきます。

- 1-1. VPC
- 1-2. VPN Gateway
- 1-3. NAT Gateway
- 1-4. ECS（Active Directory用）
- 1-5. ECS（カスタムイメージ取得用）
- 1-6. Auto Scaling

### 1. クラウドリソース作成
#### 1-1. VPC
まずはじめに、各リソースの土台となるVPCおよびVSwitchを作成していきます。

##### 1-1-1. VPC管理コンソール遷移
Alibaba Cloud管理コンソールTop画面より、VPCの管理コンソールに移動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065244.png "img")      

- ① トップページのプロダクト一覧より、`Networking` > `Virtual Private Cloud`を選択します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065312.png "img")      

- ② 今回はDaaS環境を東京リージョンに作成するため、デフォルトのリージョンが東京になっていない場合は、画面上部のリージョン選択プルダウンより`日本（東京）`を選択します。

##### 1-1-2. VPC作成
VPC管理コンソールトップページより、VPCとVSwitchを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065330.png "img")      

- ① `VPCの作成`ボタンを押下し、VPC作成ペインを表示させます。

VPC作成ペインにて、以下の通りパラメータを入力します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065352.png "img")      

- ② **名前**：任意のVPCリソース名を入力します。今回は`vpc-daas-demo`とします。
- ③ **IPv4 CIDR ブロック**：VPCのIPアドレス範囲を入力します。今回はデフォルトのまま`192.168.0.0/16`を選択します。
- ④ **説明**：リソースに任意の説明を付けます。

##### 1-1-3. Front VSwitch作成
VPC作成ペインにて、VPCと同時にVSwitchを作成していきます。  
まずは、Active Directoryサーバが所属するFront VSwitchを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065410.png "img")      

- ① **名前**：任意のVSwitchリソース名を入力します。今回は`vsw-daas-demo-front`としました。
- ② **ゾーン**：VSwitchをデプロイするAvailability Zoneを選択します。今回はAゾーンを使用するため、`Tokyo Zone A`を選択します。  
- ③ **IPv4 CIDR ブロック**：VPCのCIDRより、VSwitchに割り当てるIPアドレス範囲を入力します。今回は`192.168.0.0/24`を割り当てます。
- ④ **説明**：リソースに任意の説明を付けます。
- ⑤ **追加**：Back VSwitchも同手順内で作成するため、`+追加`ボタンを押下します。

##### 1-1-4. Back VSwitch作成
Front VSwitchと同様の手順で、仮想デスクトップ達が所属するBack VSwitchを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065431.png "img")      

- ① **名前**：今回は`vsw-daas-demo-back`としました。
- ② **ゾーン**：Front VSwitchと同様に、`Tokyo Zone A`を選択します。  
- ③ **IPv4 CIDR ブロック**：今回は`192.168.10.0/24`を割り当てます。
- ④ **説明**：Front VSwitchと同様に、任意の説明を付けます。
- ⑤ **OK**：入力内容を確認の後、`OK`ボタンを押下してVPCとVSwitchを作成します。

以下のように表示されれば、VPCおよびVSwitchの作成は成功です。  
`完了`ボタンを押下し、作成を完了させます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065445.png "img")      

#### 1-2. VPN Gateway
次に、クライアントとDaaS環境をセキュアに繋ぐVPN Gatewayを作成していきます。

##### 1-2-1. VPN Gateway管理コンソール遷移
VPC管理コンソールより、VPN Gatewayの管理コンソールに移動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065734.png "img")      

- ①：VPC管理コンソール左側のメニュー一覧より、`VPN` > `VPN Gateway`を選択します。

##### 1-2-2. VPN Gateway作成
VPN Gateway管理コンソールトップページより、VPN Gatewayを作成していきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065750.png "img")      

- ①：画面左上の`VPN Gatewayの作成`ボタンを押下し、VPN Gateway作成ページを表示させます。

VPN Gateway作成ページにて、基本設定を以下のパラメータで設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065801.png "img")      

- ② **Name**：任意のVPN Gatewayリソース名を入力します。今回は`vgw-daas-demo`とました。
- ③ **Region**：VPN Gatewayをデプロイするリージョンを選択します。`日本（東京）`を選択します。
- ④ **VPC**：VPN GatewayをデプロイするVPCを選択します。前手順で作成したVPC（`vpc-daas-demo`）を選択します。
- ⑤ **Assign VSwitch**：VPN Gatewayを任意のVSwitch内にデプロイする場合に選択します。今回はデフォルトのまま`No`を選択します。
- ⑥ **Peak Bandwidth**：VPN Gatewayの帯域幅上限を選択します。クライアントの数や利用頻度に応じて適切な帯域幅を選択してください。今回は`100 Mbps`を選択します。
- ⑦ **Billing Method**：VPN Gatewayの課金体系です。現状`Pay By Traffic`（トラフィック量に応じた課金）のみ選択可能です。

機能設定についても同様に設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065814.png "img")      

- ⑧ **IPsec-VPN**：IPsec-VPNを有効にするか否かを選択します。今回はSSL-VPNを利用するため、`Disable`を指定します。
- ⑨ **SSL-VPN**：SSL-VPNを有効にするか否かを選択します。`Enable`を選択します。
- ⑩ **SSL connections**：SSLサーバの最大同時接続数を選択します。実際に接続するクライアントの数に応じて適切な接続数を選択してください。今回は`10`を選択します。

購入モデルを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065845.png "img")      

- ⑪ **Billing Cycle**：課金のサイクルです。現状`By Hour`（1時間毎に課金）のみ選択可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065903.png "img")      

- ⑫ ：`今すぐ購入`ボタンを押下し、購入確認画面に遷移します。

購入確認画面にて、入力内容を確認の上、注文を確定させます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065917.png "img")      

- ⑬：`利用規約とSLAに同意する`にチェックを入れます。
- ⑭：`有効化`ボタンを押下します。

以下のように表示されれば、VPN Gatewayの購入は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065926.png "img")      

VPN Gateway管理コンソールのトップ画面に戻り、ステータスを確認します。  
以下のように、`正常`と表示されれば、VPN Gatewayの作成は成功です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423065937.png "img")      

##### 1-2-4. SSLサーバ管理コンソール遷移
続いて、SSL通信の複合化を行うSSLサーバを構築していきます。

VPN Gateway管理コンソールより、SSLサーバの管理コンソールに移動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070140.png "img")      

- ①：VPN Gateway管理コンソールの左側のメニュー一覧より、`VPN` > `SSLサーバー`を選択します。

##### 1-2-5. SSLサーバ作成
SSLサーバ管理コンソールのトップページより、SSLサーバを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070150.png "img")      

- ①：トップページ左上の`SSLサーバーの作成`ボタンを押下します。

SSLサーバ作成ペインにて、以下の通りパラメータを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070200.png "img")      

- ② **名前**：任意のSSLサーバリソース名を入力します。今回は`ssl-daas-demo`としました。
- ③ **VPN Gateway**：前手順で作成したVPN Gateway（`vgw-daas-demo`）を選択します。
- ④ **ローカルネットワーク**：VPN Gateway経由で接続するネットワークのIPアドレス範囲を入力します。`+ 追加 ローカルネットワーク`ボタンを押下することで、複数のネットワークを指定することが可能です。  
今回は、仮想サーバがデプロイされているBack VSwitchに接続するため、Back VSwitchのCIDRである`192.168.10.0/24`を入力します。
- ⑤ **クライアントサブネット**：クライアントに割り当てるローカルIPアドレスの範囲を指定します。この値は、<span style="color: #ff0000">④ローカルネットワークで指定した値と競合しないように注意</span>が必要です。  
今回は`10.0.0.0/24`を指定しました。
- ⑥ **高度な構成**：このチェックをONにすることで、SSL通信で利用するプロトコルやポート等を変更することが出来ます。今回はデフォルトのまま`OFF`にします。 [^1]
- ⑦ `OK`ボタンを押下し、SSLサーバを作成します。

以下のように、作成したSSLサーバが表示されれば、SSLサーバの構築は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070211.png "img")      

以上でVPN Gatewayの構築は完了になります。お疲れさまでした。

[^1]: デフォルト設定では、プロトコル：UDP、ポート番号：1194となっています。

#### 1-3. NAT Gateway
続いて、仮装サーバからインターネット向け通信の出口となるNAT Gatewayを構築していきます。

##### 1-3-1. EIP管理コンソール遷移
NAT Gatewayを作成する前に、前準備としてNAT Gatewayに紐付けるEIPを事前に作成しておきます。  
SSLサーバ管理コンソールより、EIPの管理コンソールに移動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070457.png "img")      

- ①：SSLサーバ管理コンソール左側のメニュー一覧より、`Elastic IPアドレス` > `Elastic IPアドレス`を選択します。

##### 1-3-2. NAT Gateway用EIP作成
EIP管理コンソールのトップページより、NAT Gateway用のEIPを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070509.png "img")      

- ①：トップページ画面左上の`EIPの作成`ボタンを押下します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070520.png "img")      

EIP作成ページにて、以下の通りパラメータを設定します。

- ② **購入モデル（タブ）**：購入モデルを、`サブスクリプション`（前払い）または`従量課金`より選択します。今回は`従量課金`を選択します。
- ③ **リージョン**：EIPをデプロイするリージョンを選択します。`日本`を選択します。
- ④ **isp**：インターネットサービスプロバイダです。現状`BGP`のみ選択可能です。
- ⑤ **Network Mode**：ネットワークのタイプです。現状`Public`のみ選択可能です。
- ⑥ **ネットワークトラフィック**：EIPの課金体系を選択します。今回は`トラフィックに応じた`を選択します。
- ⑦ **最大帯域幅**：EIPの帯域幅上限を指定します。仮想サーバの数や用途に応じて適切な帯域幅選択します。  
今回は`100Mbps`を指定しました。
- ⑧ **Name**：任意のEIPリソース名を指定します。今回は`eip-daas-nat`を指定しました。
- ⑨ **課金サイクル**：EIPの課金サイクルです。現状`Hour`（1時間毎に課金）のみ選択可能です。
- ⑩ **数**：購入する個数を選択します。`1`を選択します。
- ⑪：`今すぐ購入`ボタンを押下し、購入確認画面に遷移します。

購入確認画面にて、入力内容を確認の上、注文を確定させます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070535.png "img")      

- ⑫：`利用規約とSLAに同意する`にチェックを入れます。
- ⑬：`有効化`ボタンを押下します。

以下のように表示されれば、VPN Gateway用EIPの構築は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070546.png "img")      

##### 1-3-3. NAT Gateway管理コンソール遷移
前準備が整ったので、NAT Gatewayを作成していきます。  

EIP管理コンソールより、NAT Gatewayの管理コンソールに移動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070613.png "img")      

- ①：EIP管理コンソール左側のメニュー一覧より、`NAT Gateway`を選択します。

##### 1-3-4. NAT Gateway作成
NAT Gateway管理コンソールのトップページより、NAT Gatewayを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070626.png "img")      

- ①：トップページ画面左上の`NAT Gatewayの作成`ボタンを押下します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070635.png "img")      

NAT Gateway作成ページにて、以下の通りパラメータを設定します。

- ② **Region**：NAT Gatewayをデプロイするリージョンを選択します。`Japan (Tokyo)`を選択します。
- ③ **VPC ID**：NAT GatewayをデプロイするVPCを選択します。前手順で作成したVPC（`vpc-daas-demo`）を選択します。
- ④ **Specification**：NAT Gatewayのスペックを選択します。スペックによってNAT Gatewayのパフォーマンスメトリック（最大接続数およびCPS）が決定されるため、仮想サーバの台数や用途に応じて適切なスペックを選択します。[^2]  
今回は`Small`を選択しました。
- ⑤ **Billing Cycle**：課金のサイクルです。現状`By Day`（1日毎に課金）のみ選択可能です。
- ⑥ `Buy Now`ボタンを押下し、購入確認画面に遷移します。

購入確認画面にて、入力内容を確認の上、注文を確定させます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070646.png "img")      

- ⑦：`NAT Gateway (Pay-As-You-Go) Agreement of Service`にチェックを入れます。
- ⑧：`Activate`ボタンを押下します。

以下のように表示されれば、VPN Gatewayの作成は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070705.png "img")      

トップページより、作成したNAT Gatewayのステータスが`使用可能`になっていることを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070716.png "img")      

[^2]: 詳細は[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/42757.htm)のドキュメントをご確認ください。

##### 1-3-5. EIPバインド
NAT Gatewayに前手順で作成したEIPをバインドします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070735.png "img")      

- ①：対象NAT Gatewayのアクション列より、`Elastic IPアドレスのバインド`を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070745.png "img")      

EIPの紐付けペインが表示されるため、以下の通りパラメータを設定します。

- ② **EIP選択方法（タブ）**：EIPの選択方法を指定します。既存EIPから選択する場合は`EIPリストから選択`を、新規で作成する場合は`EIPを購入してNAT Gatewayインスタンスにバインド`を選択します。  
今回は`EIPリストから選択`を指定します。
- ③ **使用可能なEIPリスト**：NAT GatewayにアタッチするEIPを選択します。前手順で作成したEIP（`eip-daas-nat`）を指定します。
- ④ **VSwitch**（オプション）：ここにNAT Gatewayを利用するVSwitchを指定することで、自動でルーティングを追加することが出来ます。（後から手動で追加するも可能です）  
今回は、仮想サーバからのインターネット向け通信をNAT Gateway経由にしたいので、仮想サーバがデプロイされているVSwitchである`vsw-daas-demo-back`を指定しました。
- ⑤：入力項目を確認の上、`OK`ボタンを押下します。

以下のように、紐付けたEIPのIPアドレスが表示されていれば、EIPのバインドは完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423070757.png "img")      

以上で、NAT Gatewayの構築は完了になります。お疲れさまでした。

#### 1-4. ECS（Active Directory）
次に、Active DirectoryのドメインコントローラとなるECSサーバを作成していきます。

##### 1-4-1. ADサーバ用EIP作成
前準備としてECSにアタッチするEIPを予め作成しておきます。  
手順はNAT Gateway用のEIPと同様のため、省略します。  
今回は、リソース名`eip-daas-addc`で作成しました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071136.png "img")      

##### 1-4-2. Security Group管理コンソール遷移
ECSを作成する前に、前準備としてECSにアタッチするSecurity Groupを作成しておきます。  
まずはSecurity Groupの管理コンソールに遷移します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071216.png "img")      

- ①：Alibaba Cloud管理コンソールトップページのプロダクト一覧より、`仮想サーバー` > `Elastic Compute Service`を選択します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071228.png "img")      

- ②：画面左側メニューより、`ネットワーク&セキュリティ` > `セキュリティグループ`を選択し、Security Groupの管理コンソールへ遷移します。

##### 1-4-3. ADサーバ用SG作成
Active Directoryドメインコントローラ用のSecurity Groupを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071314.png "img")      

- ①：Security Group管理ページ右上の`セキュリティグループの作成`ボタンを押下し、Security Group作成ペインを表示します。

Security Group作成ペインにて、以下の通りパラメータを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071330.png "img")      

- ② **テンプレート**：作成するSecurity Groupのベースとなるテンプレートを選択します。今回は全てのルールを手動で設定するため、`カスタマイズ`を選択します。
- ③ **セキュリティグループ名**：任意のSecurity Groupリソース名を入力します。今回は`sg-daas-addc`を指定しました。
- ④ **説明**：任意の説明を付けます。
- ⑤ **セキュリティグループタイプ**：Security Groupの種別を選択します。`アドバンスド`を選択するとより多くのルールを設定することが可能ですが、今回は不要なため`ベーシックセキュリティグループ`を選択します。
- ⑥ **ネットワークタイプ**：Security Groupをデプロイするネットワークのタイプを選択します。`VPC`を選択します。
- ⑦ **VPC**：Security GroupをデプロイするVPCを選択します。前手順で作成したVPC（`vpc-daas-demo`）を選択します。
- ⑧ **タグ**：必要に応じてタグ情報を付与します。今回は不要のため設定しません。
- ⑨：`OK`ボタンを押下して、Security Groupを作成します。

以上でADドメインコントローラ用Security Groupの作成は完了です。

##### 1-4-4. ADサーバ用SGルール設定
Seurity Group作成時に`カスタムテンプレート`選択した場合、Security Groupの作成完了後にルールの設定を促すポップアップが表示されます。  
画面表示に従い、Security Groupのルールを設定していきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071355.png "img")      

- ①：`ルールをすぐに設定`ボタンを押下します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071431.png "img")      

- ②：Security Groupのルール設定画面に遷移するため、`セキュリティグループルールを追加`ボタンを押下します。

ルール追加ペインがポップアップするため、管理者のリモートデスクトップ接続を許可するルールを追加します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071447.png "img")      

- ③ **ルールの方向**：制御する通信の方向を指定します。`受信`を選択します。
- ④ **権限許可ポリシー**：アクセスを許可するか拒否するかを選択します。`許可`を指定します。
- ⑤ **プロトコルタイプ**：アクセス制御を行うプロトコルを選択します。 `RDP(3389)`を指定します。
- ⑥ **プライオリティ**：ルールの優先度を指定します。`1`を指定します。
- ⑦ **権限付与タイプ**：アクセス制限を行う対象（IPアドレス or Security Group）を選択します。`IPv4 CIDRブロック`を選択します。
- ⑧ **権限付与オブジェクト**：アクセス制御対象のIPアドレスを指定します。<span style="color: #ff0000">管理者アクセス元のグローバルIPアドレスを指定してください。</span>
- ⑨ **説明**：任意の説明を付けます。
- ⑩：`OK`ボタンを押下します。

以下のように、設定したルールが表示されていれば、Security Groupのルール追加は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071459.png "img")      

##### 1-4-5. ECS管理コンソール遷移
準備が整ったので、Active Directoryドメインコントローラサーバ用のECSを作成していきます。  
Security Group管理コンソールより、ECSインスタンス管理コンソールに遷移します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071513.png "img")      

- ①：画面左側メニュー一覧より、`インスタンス&イメージ` > `インスタンス`を選択します。

##### 1-4-6. ADサーバ作成
Active Directoryドメインコントローラ用のECSを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071526.png "img")      

- ①：ECSインスタンス管理コンソールトップページより、画面右上の`インスタンスを作成`ボタンを押下します。

ECS作成ページに遷移するため、以下の通りパラメータを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071543.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071554.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071608.png "img")      

- ② **サブスクリプション**：ECSの購入モデルを選択します。`従量課金`を選択します。
- ③ **リージョン**：ECSをデプロイするリージョンを選択します。`日本（東京）`を選択します。
- ④ **ゾーン**：ECSをデプロイするAvailability Zoneを選択します。`アジア東北１ゾーンA`を選択します。
- ⑤ **インスタンスタイプ**：任意のインスタンスタイプを選択します。今回は、`全世代` > `x86アーキテクチャ` > `一般目的` > `ecs.sn2ne.large`を選択しました。
- ⑥ **インスタンス数**：作成するECSインスタンスの個数を指定します。`1`を指定します。
- ⑦ **イメージ**：ECSのベースとなる、イメージを選択します。`パブリックイメージ` > `Windows Server` > `2019 Datacenter 64-bit(English)`を選択します。
- ⑧ **システムディスク**：任意のシステムディスク（Cドライブ）のタイプとサイズを選択します。今回は、`Ultraクラウドディスク`/`40GiB`で作成します。
- ⑨：`次のステップ：ネットワーク`ボタンを押下し、ネットワーク設定画面に遷移します。

ネットワーク設定ページについても同様に、以下の通りパラメータを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071627.png "img")      

- ⑩ **VPC**：ECSをデプロイするVPCを選択します。前手順で作成したVPC（`vpc-daas-demo`）を指定します。
- ⑪ **VSwitch**：ECSをデプロイするVSwitchを選択します。前手順で作成したBack VSwitch（`vsw-daas-demo-back`）を指定します。
- ⑫ **セキュリティグループ**：ECSにアタッチするSecurity Groupを選択します。前手順で作成したADサーバ用Security Group（`sg-daas-addc`）を指定します。
- ⑬：`次のステップ：システム構成`ボタンを押下し、システム構成設定画面に遷移します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071640.png "img")      

- ⑭ **パスワード/パスワードの確認**：任意のOSログインパスワードを入力します。
- ⑮ **インスタンス名**：任意のECSリソース名を入力します。今回は`ecs-daas-addc`を指定しました。
- ⑯ **説明**：リソースに任意の説明を付けます。
- ⑰ **ホスト**：任意のホスト名を入力します。今回は`daas-addc`を指定しました。
- ⑱：`プレビュー`ボタンを押下し、購入確認画面に遷移します。

ECS購入確認画面にて、入力内容を確認し、注文を確定させます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071653.png "img")      

- ⑲：`ECS SLAと利用規約に同意する`にチェックを入れます。
- ⑳：`インスタンスの作成`ボタンを押下し、ECSインスタンスを注文します。

以下のような画面がポップアップされれば、ECSの作成は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071704.png "img")      

- ㉑：`コンソール`ボタンを押下し、ECSインスタンス管理コンソールに戻ります。

以下の通り、ECSインスタンスのステータスが`実行中`になれば、ECSの作成成功です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071717.png "img")      

##### 1-4-7. EIPバインド
最後に、ADサーバに予め作成しておいたEIPを紐付けます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071728.png "img")      

- ①：対象ECSインスタンス右側のアクションより、`詳細` > `ネットワークとセキュリティグループ` > `Elastic IPアドレスのバインド`を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071739.png "img")      

- ② **Elastic IPアドレス**：前手順で作成したADサーバ用のEIP（`eip-daas-addc`）を選択します。
- ③：`OK`ボタンを押下します。

以下の通り、対象ECSインスタンスのIPアドレスに紐付けたEIPが表示されれば、EIPのバインドは成功です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423071846.png "img")      

以上で、Active Directoryドメインコントローラ用ECSサーバの作成は完了となります。お疲れさまでした。

#### 1-5. ECS（カスタムイメージ作成用）
続いて、カスタムイメージ作成用のECSインスタンスを作成します。  
基本手順はADサーバと同様のため省略させていただきますが、本サーバはイメージ取得後リリースするサーバのため、<span style="color: #ff0000">EIPではなくパブリックIPアドレスを付与</span>します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072010.png "img")      

今回は、リソース名`ecs-daas-tmp`、ホスト名`daas-tmp`で作成しました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072039.png "img")      

#### 1-6. Auto Scaling
次に、仮想デスクトップサーバの増台を行うAuto Scalingを作成していきます。

##### 1-6-1. 仮想サーバ用SG作成
前準備として、仮想サーバ用のSecurity Groupを作成しておきます。  
基本手順はADサーバ用Security Groupと同様のため省略させていただきます。

今回は、リソース名`sg-daas-rds`で作成しました。  
ルールには以下の2つを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072102.png "img")      

- ①：クライアント（10.0.0.0/24）からのRDP接続を許可
- ②：ADサーバからの通信を全て許可

##### 1-6-2. ADサーバ用SGルール追加
ADサーバ用のSecurity Groupにルールを追加し、仮想サーバからADサーバへの通信の許可設定を行います。

以下の通り、ADサーバ用Security Group（`sg-daas-addc`）にルールを追加します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072122.png "img")      

- ①：仮想サーバからの通信を全て許可[^3]

[^3]: 今回は簡単のため、仮想サーバからADサーバへの通信を全て許可しましたが、より正確に通信制御を行う場合はActive Directoryに必要なプロトコル/ポートのみを許可設定してください。

##### 1-6-3. Auto Scaling管理コンソール遷移
準備が整ったので、仮想サーバ用Auto Scalingを作成していきます。  
まずは、Auto Scalingの管理コンソールに遷移します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072134.png "img")      

- ①：Alibaba Cloud管理コンソールトップページのプロダクト一覧より、`仮想サーバー` > `Auto Scaling`を選択します。  

##### 1-6-4. Scaling Group作成
Auto Scaling管理コンソールのトップページより、仮想サーバ用Scaling Groupを作成していきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072200.png "img")      

- ①：画面右上の`スケーリンググループの追加`ボタンを押下します。

Scaling Group作成画面に遷移するため、以下の通りパラメータを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072226.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072242.png "img")      

- ② **ソースタイプ**：テンプレートとなる起動設定のソースを選択します。今回はScaling Configurationを新規で作成するため、`最初から作成する`を選択します。
- ③ **スケーリンググループ名**：任意のScaling Groupリソース名を入力します。今回は`asg-daas-rds`を指定しました。
- ④ **最大インスタンス数/最小インスタンス数**：スケールイン/アウトの際の上限値を設定します。こちらは仮想サーバを起動する際に変更するため、一旦`0`を指定します。
- ⑤ **想定インスタンス数**：起動するECSインスタンスの数を設定します。こちらも仮想サーバ起動時に変更するため、一旦デフォルトのまま空にしておきます。
- ⑥ **デフォルトクールダウン時間（秒）**：スケーリング後のクールダウン時間を設定します。今回はデフォルトのまま`300`を指定します。
- ⑦ **インスタンス削除ポリシー**：スケールイン時の対象ECSインスタンスの選定方法を設定します。今回はデフォルトのまま、`スケーリング設定が最も古いインスタンス`および`最初に作成されたインスタンス`を指定します。
- ⑧ **スケーリンググループの削除保護を有効にする**：ECSの削除保護を有効にする場合にONにします。今回はデフォルトのまま`OFF`に設定します。
- ⑨ **タグ情報**：必要に応じて、起動したECSインスタンスに付与するタグ情報を設定ことが出来ます。今回は不要のため、空とします。
- ⑩ **VPC**：Scaling GroupをデプロイするVPCを指定します。前手順で作成したVPC（`vpc-daas-demo`）を指定します。
- ⑪ **VSwitch**：Scaling GroupoをデプロイするVSwitchを指定します。前手順で作成したBack VSwitch（`vsw-daas-back`）を指定します。
- ⑫ **マルチゾーンスケーリングポリシー**：マルチゾーンにデプロイする場合に、ECSを起動するゾーンの選定方法を指定します。今回はAゾーン シングルで構築しているため、デフォルトのまま`優先ポリシー`を指定します。
- ⑬ **インスタンス再利用モード**：スケールイン時の挙動を選択します。`リリースモード`（削除）を選択します。
- ⑭ **詳細設定**：こちらの設定を行うことで、SLBやRDSとの紐付けを行えます。今回は不要のため、デフォルトのまま`OFF`とします。
- ⑮：`作成`ボタンを押下し、Scaling Group作成の注文を確定させます。

以下のように表示されれば、Scaling Groupの作成は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072254.png "img")      

##### 1-6-5. Scaling Configuration作成
次に、仮想サーバの起動設定となるScaling Configurationを作成していきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072316.png "img")      

- ①：作成したScaling Groupの`インスタンス設定のソース`より、`スケーリング設定の追加`を押下します。

Scaling Configuration作成画面に遷移するため、以下の通りパラメータを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072331.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072346.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072359.png "img")      

- ② **インスタンスタイプ**：任意のインスタンスタイプを選択します。今回は、`x86アーキテクチャ` > `一般目的` > `ecs.sn2ne.large`を選択しました。
- ③ **イメージ**：仮想サーバの起動イメージを選択します。今回は`パブリックイメージ` > `Windows Server` > `2019 Datacenter 64-bit(English)`を選択しました。  
こちらのイメージは、仮想サーバのカスタムイメージ完成後に差し替えを行うため、一時的なものとなります。
- ④ **システムディスク**：任意のシステムディスク（Cドライブ）のタイプとサイズを選択します。今回は、`Ultraクラウドディスク`/`64GiB`で作成します。
- ⑤ **データディスク**（オプション）：必要に応じて、データディスク（Dドライブ）を追加します。今回はデータ保持領域として、`Ultraクラウドディスク`/`128GiB`のディスクを1つ追加します。
- ⑥ **セキュリティグループ**：仮想サーバにアタッチするSecurity Groupを選択します。前手順で作成した仮想サーバ用Security Group（`sg-daas-rds`）を選択します。
- ⑦：`次のステップ：システム構成`ボタンを押下します。

システム構成設定画面に遷移するため、基本設定と同様にパラメータを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072414.png "img")      

- ⑧ **インスタンス名**：任意のECSリソース名を入力します。今回は`ecs-daas-rds`を指定しました。
- ⑨：`プレビュー`ボタンを押下し、購入確認画面に遷移します。

購入確認画面に遷移するため、入力内容を確認の上、注文を確定させます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072438.png "img")      

- ⑩ **スケーリング設定名**：任意のScaling Configurationリソース名を入力します。今回は、`asc-daas-rds`としました。
- ⑪：`作成`ボタンを押下します。

Scaling Configurationの作成が成功すると、以下のように有効化を促すポップアップが表示されるため、画面指示に従い有効化します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072454.png "img")      

- ⑫ `適応`ボタンを押下します。

確認を促すポップアップが表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072512.png "img")      

- ⑬：`確認`ボタンを押下します。

Scaling Groupの有効化を促すポップアップが表示されるため、画面指示に従いScaling Groupを有効化します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072527.png "img")      

- ⑭：`確認`ボタンを押下します。

以下のように、対象Scaling Groupのステータスが`有効`になっていれば、Scaling Configurationの作成は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613554741100/20200423072541.png "img")      

以上で、仮想サーバ用Auto Scalingの作成は完了です。お疲れさまでした。

### ここまでの構築作業まとめ

以上を以って、Alibaba Cloudリソースの構築は一旦完了となります。  

1. **クラウドリソース作成**：<span style="color: #00cc00">完了</span>
2. **Active Directory構築**：<span style="color: #0000cc">未実施</span>
3. **カスタムイメージ作成**：<span style="color: #0000cc">未実施</span>
4. **仮想サーバローンチ**：<span style="color: #0000cc">未実施</span>

<span style="color: #ff0000">`2.Active Directory構築`</span>以降の手順は、次回の記事でご紹介したいと思います。

お疲れさまでした 

## 最後に
今回はDaaS環境の構築手順の一部として、Alibaba Cloudリソースの作成手順をご紹介しました。     
構築手順として書き出すと結構な量になってしまいますが、慣れている方ならば2時間もあれば終わる作業かと思います。ご参考に頂ければ幸いです。        
