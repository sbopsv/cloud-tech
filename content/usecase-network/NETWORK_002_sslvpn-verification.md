---
title: "SSL-VPNでPCからECSへ接続"
metaTitle: "SSL-VPNを使用してクライアントPCからECSへ接続してみた"
metaDescription: "SSL-VPNを使用してクライアントPCからECSへ接続してみた"
date: "2019-10-28"
author: "SBC engineer blog"
thumbnail: "/Network_images_26006613453327100/20191024172933.png"
---

## SSL-VPNを使用してクライアントPCからECSへ接続してみた

## はじめに

本記事では、SSL-VPNを使用してクライアントPCからECSへの接続をする方法をご紹介します。    

### SSL-VPNとは

VPN（Virtual Private Network）とは、インターネット上に仮想的なプライベートネットワークを構築することで、よりセキュアな通信を行うための技術です。

Alibaba Cloudでは、以下の2つの接続方法をサポートしています。

#### IPsec-VPN

IPsec-VPNはIPsec（IP Security Architecture）技術を使用したVPNソリューションです。

プロトコル階層はネットワーク層であり、組織間を接続するプライベートネットワークとして開発されました。

##### メリット

・ ネットワーク層で実装されるため、アプリケーションに依存しない

・ SSL-VPNに比べて高速

##### デメリット

・ SSL-VPNに比べてコストが高い

・ クライアントPCには専用のVPNクライアントソフトウェアの導入が必要

#### SSL-VPN

SSL-VPNはSSL（Secure Sockets Layer）技術を使用したVPNソリューションです。

プロトコル階層はセッション層であり、ウェブブラウザからサーバへのSSL通信を可能とするために開発されました。

##### メリット

・ IPsec-VPNに比べてコストが低い

・ アクセス制御等、各種設定が容易

##### デメリット

・アプリケーションに依存するため、アプリケーションごとにSSL対応が必要

・SSL-VPNに比べて低速


SSL-VPN / IPsec-VPN の特徴については、[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/64960.htm)もご参照ください。

> https://www.alibabacloud.com/cloud-tech/doc-detail/64960.htm


### 今回検証用に構築する環境

今回は下図の構成でSSL-VPN接続を行ってみたいと思います。

Alibaba Cloudで作成するコンポーネントは以下です。

・ VPC

・ VSwitch

・ セキュリティグループ

・ ECSインスタンス

・ VPNGateway

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024172933.png "img")





## 検証準備

それではさっそく、検証の準備を始めましょう。

検証準備は以下の流れで行います。

コンポーネントの作成はすべてAlibaba Cloudのコンソールで行います。

1. VPC・VSwitchの作成
1. セキュリティグループの作成
1. ECSインスタンスの作成
1. SSL-VPN接続用の設定





### VPC・VSwitchを作成する

VPC・VSwitchを作成します。

Alibaba Cloudのコンソール画面へログインし、`Virtual Private Cloud`画面を開きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024120023.png "img")





`VPCの作成`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024120100.png "img")





VPCおよびVSwitchの各項目を設定します。

①：任意のVPC名を入力します。

②：VPCのIPv4 CIDR ブロックを入力します。デフォルトは`192.168.0.0/16`です。

③：任意のVSwitch名を入力します。

④：VSwitchのゾーンをプルダウンから選択します。

⑤：VSwitchのIPv4 CIDR ブロックを入力します。デフォルトは`192.168.0.0/24`です。

①～⑤の項目を設定し、⑥`OK`をクリックします。

※ここではVPCおよびVSwitchのIPv4 CIDRブロックはデフォルトにしておりますが、必要に応じて入力しなおしてください。

※説明は任意です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024120141.png "img")





VPCおよびVSwitchが作成されたことを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024180131.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024180152.png "img")





### セキュリティグループを作成する

接続先ECSにアタッチするセキュリティグループを作成します。

`Elastic Compute Service`画面を開きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024130205.png "img")





`Elastic Compute Service`画面左に表示されるメニューから`セキュリティグループ`を選択します。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024130227.png "img")





`セキュリティグループの作成`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024130246.png "img")





セキュリティグループの各項目を設定します。

①：テンプレートは`カスタマイズ`を選択します。

②：任意のセキュリティグループ名を入力します。

③：先ほど作成したVPCを選択します。

①～③の項目を設定し、④`OK`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024151128.png "img")





セキュリティグループが作成されたことを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024180235.png "img")





#### セキュリティグループのルール設定

セキュリティグループのルールを設定します。

pingコマンドで通信が可能か確認した後にリモートデスクトップ接続を実施するため、2つのルールを設定します。

セキュリティグループ作成時と同様に`セキュリティグループ`画面を開きます。

先ほど作成したセキュリティグループの`アクション`列の`ルール設定`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024151707.png "img")





`セキュリティグループルールを追加`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024151722.png "img")





まずはpingコマンド用のルールを設定します。

①：プロトコルタイプは`すべてのICMP（IPv4）`を選択します。

②：権限付与オブジェクトにはクライアントがECSインスタンスに接続するために使用する任意のIPv4 CIDRブロックを入力します。

※権限付与オブジェクトに設定するIPv4 CIDRブロックは作成したVPC内のVSWitchと競合しないように設定してください。

今回、VPCのIPv4 CIDRブロックは`192.168.0.0/16`、VSwitchのIPv4 CIDRブロックは`192.168.0.0/24`としているため、競合しないよう`192.168.0.10/24`とします。

①、②の項目を設定し、③`OK`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024151737.png "img")





再度`セキュリティグループルールを追加`をクリックし、リモートデスクトップ接続用のルールを設定します。

①：プロトコルタイプは`RDP（3389）`を選択します。

②：権限付与オブジェクトにはpingコマンド用のルールと同様のIPv4 CIDRブロックを設定します。

①、②の項目を設定し、③`OK`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024151749.png "img")




### ECSインスタンスを作成する

接続先となるECSインスタンスを作成します。

`Elastic Compute Service`画面を開きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024130421.png "img")





`Elastic Compute Service`画面左に表示されるメニューから`インスタンス`を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024130908.png "img")





`インスタンスを作成`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024130921.png "img")





ECSインスタンスの基本構成を設定します。

①：検証後はすぐに削除するため、価格モデルは従量課金を選択します。

②：リージョンおよびゾーンはVPC・VSwich作成時の設定と同一にします。

③：任意のインスタンスタイプを選択します。今回は比較的料金の安いインスタンスタイプを選択します。

④：任意のイメージを選択します。今回はWindowsServer 2019 64-bitの英語版とします。

⑤：任意のシステムディスクを選択します。今回は最も料金が安くなるよう、サイズ40GBのUltraクラウドディスクとします。

①～⑤の項目を設定し、⑥`次のステップ:ネットワーク`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024130947.png "img")





ECSインスタンスのネットワーク構成を設定します。

①：先ほど作成したVPCを選択します。

②：先ほど作成したVSwitchを選択します。

③：先ほど作成したセキュリティグループを選択します。

①～③の項目を設定し、④`次のステップ:システム構成`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131007.png "img")





ECSインスタンスのシステム構成を設定します。

①：任意のadministratorユーザ用パスワードを入力します。

②：任意のインスタンス名を入力します。

①、②の項目を設定し、③`次のステップ:グループ化`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131027.png "img")





今回はECSインスタンスのグループ化は特に何も設定せず、`次のステップ:プレビュー`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131052.png "img")





ECSインスタンスの設定を確認します。

すべての設定値が誤っていないことを確認し、①`ECS SLA と 利用規約に同意する`にチェックを入れ、②`インスタンスの作成`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131117.png "img")





ECSインスタンスが作成されたことを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024180339.png "img")





★後ほどpingコマンドを使用して、クライアントPCからECSインスタンスへの疎通確認を行うため、ECSインスタンスのプライベートIPアドレスを控えておきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024180619.png "img")





### SSL-VPN接続用の設定を行う

接続先のECSインスタンスが完成したので、次からはSSL-VPN接続を実現するための作業になります。

SSL-VPN接続を開始するまでの流れは以下です。 

1. VPNGatewayを作成する

1. SSLサーバを作成する

1. クライアント証明書を作成する

1. クライアントPCの設定を行う





#### VPNGatewayを作成する

VPNGatewayを作成します。

`Virtual Private Cloud`画面を開きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131137.png "img")





`Virtual Private Cloud`画面左に表示されるメニューから`VPN Gateways`を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131215.png "img")





`VPNGateway の作成`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131242.png "img")





VPNGatewayの各項目を設定します。

①：任意のインスタンス名を入力します。

②：先ほど作成したVPCを選択します。

③：今回はSSL-VPN接続を行うため、IPsec-VPNを無効化します。

④：SSL-VPNを有効化します。

①～④の項目を設定し、ピーク帯域幅およびSSL接続は最小のものが選択されていることを確認します。
その後⑤`今すぐ購入`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131341.png "img")





VPNGatewayの設定を確認します。

すべての設定値が誤っていないことを確認し、①`利用規約とSLAに同意する`にチェックを入れ、②`有効化`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131300.png "img")





VPNGatewayが作成されたことを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024180723.png "img")





#### SSLサーバを作成する

SSLサーバを作成します。

`Virtual Private Cloud`画面左に表示されるメニューから`SSL Servers`を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131409.png "img")





`SSL サーバーの作成`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131428.png "img")





SSLサーバの各項目を設定します。

①：任意のSSLサーバ名を入力します。

②：先ほど作成したVPNGatewayを選択します。

③：先ほど作成したVSwitchのIPv4 CIDRブロックを入力します。

④：セキュリティグループルールの権限付与オブジェクトに設定したIPv4 CIDRブロックを入力します。

①～④の項目を設定し、⑤`OK`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131446.png "img")





SSLサーバが作成されたことを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024180812.png "img")





#### SSLクライアント証明書を作成する

SSLクライアント証明書を作成します。

`Virtual Private Cloud`画面左に表示されるメニューから`SSL Clients`を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131516.png "img")





`クライアント証明書の作成`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131606.png "img")





クライアント証明書の各項目を設定します。

①：任意のクライアント証明書名を入力します。

②：先ほど作成したSSLサーバを選択します。

①、②の項目を設定し、③`OK`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024131625.png "img")





SSLクライアント証明書が作成されたことを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024180851.png "img")
以上でAlibaba Cloud（接続先）側の作業が完了となります。





#### クライアントPCの設定

それでは接続元となるクライアントPC側の作業を行います。

今回はMacをクライアントPCとして接続確認を行いたいと思います。    





##### SSLクライアント証明書のダウンロード

先ほど作成したSSLクライアント証明書をダウンロードします。

SSLクライアント証明書作成時と同様に`SSL Clients`画面を開きます。

先ほど作成したSSLクライアント証明書の`アクション`列の`ダウンロード`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191024181026.png "img")





##### OpenVPN クライアントのインストール・設定

ターミナルから以下のコマンドを実行し、OpenVPNクライアントのインストールおよび設定を行います。

※以下はクライアントPCがMacの場合のインストール・設定方法になります。

OpenVPN クライアントをインストールします。

```
brew install openvpn
```

デフォルトの設定を削除します。

```
rm /usr/local/etc/openvpn/*
```

先ほどダウンロードしたクライアント証明書を/usr/local/etc/openvpn/配下へ解凍します。

※$CERT_LOCATION はダウンロードしたクライアント証明書のパスです。　例) /Users/example/Downloads/certs.zip

```
unzip $CERT_LOCATION -d /usr/local/etc/openvpn/
```


接続を開始します。

```
cd /usr/local/etc/openvpn
sudo /usr/local/opt/openvpn/sbin/openvpn --config /usr/local/etc/openvpn/config.ovpn
```


非常に少ない手順ですが、接続元の設定は以上になります。

<span style="color: #ff0000">※接続開始時に/usr/local/etc/openvpnに移動しているのは、configファイル（/usr/local/etc/openvpn/config.ovpn）内で指定されているファイルが/usr/local/etc/openvpnに配置されているためです。
configファイル内で指定されているファイルが絶対パスで記載されていれば、移動の必要はありません。</span>

※ターミナルを閉じてしまうと接続が切断されるため、接続中はターミナルは開いたままにしておいてください。


## SSL-VPN接続確認

それではいよいよ接続確認を行ってみましょう。
pingコマンドで通信可能なことを確認し、リモートデスクトップ接続を実施します。





### pingコマンドによる疎通確認

まずはpingコマンドによる疎通確認を行います。

以下のコマンドを実行してみます。     

※$PRIVATE_IP_ADDRESS はECSインスタンス作成時に控えたプライベートIPアドレスです。

```
ping $PRIVATE_IP_ADDRESS
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191018155312.png "img")





通信可能なことが確認できました。     





### リモートデスクトップ接続確認

次にリモートデスクトップ接続を行ってみましょう。

任意のRDPクライアントを起動してください。

今回はMicrosoft Remote Desktopアプリを使用します。     

アプリを起動し、画面左上の`+`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191018155332.png "img")





接続を作成します。

Connection nameに接続名となる任意の値を入力し、PC nameにECSインスタンスのプライベートIPアドレスを入力します。

User nameは`administrator`を入力し、PasswordはECSインスタンス作成時に指定したパスワードを入力します。

入力が完了し、左上の`×`をクリックし、画面を閉じます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191018155355.png "img")





作成した接続を選択し、`↗`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191018155541.png "img")





証明書に関する警告が表示された場合は、`Continue`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191018155630.png "img")





リモートデスクトップ接続が成功しました。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613453327100/20191018155734.png "img")





## 最後に

今回はSSL-VPNを使用してクライアントPCからECSに接続する方法をご紹介させていただきました。

Alibaba Cloudにほとんど触れたことのない方でも非常に簡単に設定ができることをお伝え出来たかと思います。

SSL-VPNはIPsec-VPNと比較すると安価であり設定も簡単なので、ぜひご活用ください。




