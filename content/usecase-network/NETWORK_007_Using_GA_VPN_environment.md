---
title: "GAで安定な日中VPN環境を構築"
metaTitle: "Global Accelerator (GA) を使って安定な日中VPN環境を構築する"
metaDescription: "Global Accelerator (GA) を使って安定な日中VPN環境を構築する"
date: "2020-09-18"
author: "SBC engineer blog"
thumbnail: "/Network_images_26006613628645100/20200916174343.png"
---

## Global Accelerator (GA) を使って安定な日中VPN環境を構築する

本記事は既存の日中VPN環境を安定させたい、手軽に環境を構築する方法をご紹介いたします。    

## 構成概要

今回は新しく東京リージョンのVPCにVPNサーバを立てますが、Global AcceleratorはAlibaba Cloudの外にあるIPアドレスにもAlibabaのバックボーンを使って国際インターネットの経路を最適化、加速化できますので、オンプレミス等にあるVPNサーバに対してもご利用可能です。

![基本構成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916174343.png "基本構成")


新たに立てるVPNサーバはオープンソースの「Pritunl」の無償版を使います。Pritunlは無償版でもユーザ接続数に制限がなく、2要素認証に対応していて設定もGUIで楽です。  

無償版のオープンソースは他にも「SoftEther」が挙げられますし、メーカーサポートが得られる有償版ではプロキシやIPsecなどUTM機能が豊富な「FortiGate VM」がオススメです。FortiGateはマーケットプレイス上にBYOL版、PAYG版がそれぞれあります。


今回テストで使うECSは、1vCPU 2GiBの「ecs.t5-lc1m2.small」を用意し、OSは「CentOS7.8」を使います。  
まずは、東京リージョンにECSをCentOSで立ててPritunlをインストールし、後半はGAを作成して紐付け作業を行います。

   

## VPNサーバ（Pritunl）のインストール

Pritunlの[インストレーションガイドはこちら](https://docs.pritunl.com/docs/installation)です     
> https://docs.pritunl.com/docs/installation

**OSに合わせてPritunlとMongoDBをインストール（今回はCentOS7）**
```
sudo tee /etc/yum.repos.d/mongodb-org-4.2.repo << EOF
[mongodb-org-4.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/4.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc
EOF

sudo tee /etc/yum.repos.d/pritunl.repo << EOF
[pritunl]
name=Pritunl Repository
baseurl=https://repo.pritunl.com/stable/yum/centos/7/
gpgcheck=1
enabled=1
EOF

sudo rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
gpg --keyserver hkp://keyserver.ubuntu.com --recv-keys 7568D9BB55FF9E5287D586017AE645C0CF8E292A
gpg --armor --export 7568D9BB55FF9E5287D586017AE645C0CF8E292A > key.tmp; sudo rpm --import key.tmp; rm -f key.tmp
sudo yum -y install pritunl mongodb-org
sudo systemctl start mongod pritunl
sudo systemctl enable mongod pritunl
```

**Pritunlの初期設定**  
　ブラウザより https://"ECSのEIP"/ へアクセス  
　setup-keyを入力しSaveをクリックします。  
　setupキーはCentOSにて sudo pritunl setup-key で確認できます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917091012.png "img")
   
**ユーザログイン**  
　デフォルトのユーザ名とパスワードはCentOSにて sudo pritunl default-password で確認できます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917091033.png "img")
   
**パスワード設定**  
　新しいパスワードを入力してSaveします。   
　ユーザ名や接続ポート番号も任意のものに変更可能です。  
　※接続ポートはECSのSecurity Groupで許可が必要です。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917091046.png "img")
   
**SSL-VPNサーバの設定**  
　Servers > Add Server  
　　Name: 任意  
　　Virtual Network: クライアントにアサインするIPレンジ（デフォルト）  
　　Port: 任意 (デフォルト)   
　　Protocol: udp（デフォルト）  
　　Enable Google Authenticator: 任意  
　　※サービスポートはECSのSecurity Groupで許可が必要です。  
　　※今回はGoogle Authenticatorで2要素認証もやってみます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917091102.png "img")
   
**ユーザ組織の追加**  
　Users > Add Organization >   
　　Name: 任意
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917091117.png "img")
   
**ユーザの追加**  
　Users > Add User  
　　Name: 任意  
　　Select an organization: 上記の組織を選択  
　　Email: 任意  
　　Pin: 任意（接続認証時に使います）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917091129.png "img")
   
**ユーザ組織とサーバの紐付け**  
　Servers > Attach Organization   
　　Select an organization: 指定の組織  
　　Select a server: 指定のサーバ  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917091143.png "img")
   
**サーバ起動**  
　Servers > Start Server
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916183523.png "img")

   

## ユーザの接続方法

**クライアントソフトのダウンロード・インストール**  
Pritunlの専用クライアントソフトを公式ページからダウンロードできます。    
> https://client.pritunl.com/
   

対応OSはWindows, Mac, Linuxのみですが、Pritunl自体はOpenVPNとの互換性がありますので、iPhone, AndroidであってもOpenVPNのクライアントソフトを使えばVPN接続が可能です。
   

**ユーザプロファイルのダウンロード**  
ユーザプロファイルはPritunlサーバのUsersページからダウンロードできます。  
また、専用URLを発行しサーバ管理者以外にプロファイルをダウンロードしてもらうこともできます。  
今回はプロファイルをダウンロードし、.tarファイルを解凍します。  
　下の画像赤枠は右から順に   
　　Google Authenticator用のバーコード取得  
　　テンポラリープロファイルURLの取得（ユーザに渡すための）  
　　プロファイルのダウンロード（今回はこちらからダウンロード）  
　　ユーザの無効化・切断  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916184955.png "img")
   
**ユーザプロファイルのインポート**  
Pritunlクライアントを開き、Import Profileで解凍した .ovpnファイルを取り込みます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916185530.png "img")
   
右上の三本線をクリックし、Connectをクリックすると、ユーザ設定で指定したPinの入力を求められます。  
その次にOTP Code(Google Authenticator)から発行される6桁のワンタイムコードを入力しOkをクリックします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916190220.png "img")
   
これで接続が確立されました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916191134.png "img")
   
ここまでで、VPNサーバ単体の動きを確認できました。  
一般的な確認サイトでグローバルIPを調べるとちゃんとVPNサーバのEIPが出てきます。  
AlibabaのIPとも表示されてますね。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917091217.png "img")
   
まだGAを作成していないため、今は中国から繋いでもパフォーマンスはでません。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916220220.png "img")

   

## Global Accelerator (GA) の設定

おまたせしました、ここからはGAの設定になります。  
GAに関するドキュメントはコチラ  
> https://www.alibabacloud.com/cloud-tech/ja/product/55629.htm   

GAの課金項目はインスタンス料金 + 仕様料金 + 帯域幅料金となります。  
詳細はドキュメントをご参照ください。  
> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/153194.htm
   

**1. GAインスタンスの作成**  
    Global Accelerator > インスタンスの作成   
    テストのため今回はSmall Iを選択
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916220538.png "img")
   
**2. 基本帯域プランの購入・バインド**  
    Global Accelerator > 基本帯域幅の購入  
    こちらテスト用に2Mbpsを選択
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916220742.png "img") 
   
**3. クロスリージョンの帯域プランを購入・バインド**  
    Global Accelerator > クロスボーダー加速帯域プランの購入  
    こちらもテスト用に2Mbpsを選択  
    エリアAが中国本土、エリアBがグローバルになっていることを確認
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916221053.png "img")
   
**4. リスナーの追加**  
　Global Accelerator > GAインスタンスをクリック > リスナー > リスナーを追加  
　リスナー名: 任意  
　プロトコル: Pritunlサーバで指定したもの（今回はUDP）  
　ポート番号: Pritunlサーバで指定したもの（今回は12784）   
　次へ
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200918132306.png "img")
   
　エンドポイントグループ名: 任意  
　リージョン: 東京  
　バックエンドサービス: Alibaba Cloud  
　バックエンドサービスタイプ: Alibaba CloudパブリックIPアドレス  
　バックエンドサービス: VPNサーバのEIP  
　重量: 0〜255で指定（今回は100）  
　※エンドポイントには計4つのIPアドレスが登録可能で重み付けによる負荷分散に対応しています。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200918132332.png "img")
   
**5. リスナーの確認**  
作成が終わったら状態が有効になっていることを確認し、リスナーIDをクリックします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916231500.png "img")
   
表示されるエンドポイントグループIPをメモします。   
　※1つのリスナーに対して払い出されるエンドポイントグループIPは4つです。  
　※この4つのIPからの通信に対してエンドポイント(ECSのVPNサーバ)のSecurity Groupで許可する必要があります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916233041.png "img")
   
**6. アクセラレーションエリアの設定**  
　Global Accelerator > GAインスタンスをクリック > アクセラレーションエリア > アクセラレーションエリアの追加  
　アクセラレーションエリア: ユーザに近い地域（今回は中国東部）  
　リージョン: ユーザの最寄りリージョン（今回は上海）  
　帯域幅: クロスリージョン帯域幅から割当（今回は2Mbps）   
　OKをクリック  
　※高速化IPアドレスが表示されますのでメモします。  
　※このIPが実際にユーザがアクセスするIPとなります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916231236.png "img")

   

## GA + VPNサーバの接続テスト

それでは接続テストをしてみましょう。  
先ほどユーザの接続方法の項目でPritunlのプロファイルをクライアントにインポートして接続を試しましたが、今回は接続先のIPをVPNサーバのEIPからGAのEIPに変更してあげる必要があります。そうでないと、GAを通ることにはなりませんのでご注意ください。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917005539.png "img")
   
Pritunlクライアント右上の三本線をクリックし、Edit Configをクリックします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200916234930.png "img")
   
この行でECSのEIPアドレスをGAのEIPアドレスに変更し、Save Profileをクリックします。（上から6行目あたり）
> remote "ip xx.xx.xx.xx" "port xxxxx" udp

そしてConnectをクリックしてVPN接続するとServer AddressがGAのEIPになっていますが、正常に接続できていることが確認できます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917004815.png "img")
   

グローバルIPを調べると先ほどと同じ東京リージョンにあるVPNサーバのEIPが出てきます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917091217.png "img")

   

## GA vs Internetの品質（上海〜東京）

Pingでの品質測定を金曜日と土曜日に実施してみたところこのような結果となりました。左がレイテンシー、右がパケットロスです。
   

【GA + VPNサーバ】
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917011258.png "img")
   
【インターネット】
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628645100/20200917011323.png "img")

   
上海のサーバからyahoo.co.jpまでの結果になります。GAを使うと46msec前後のレイテンシーでパケロスが0%に対し、国際インターネットをそのまま使うと78msec前後のレイテンシーでパケロスが最大9%ありました。パケロスが多い場合でもWeb閲覧はなんとかできるかもしれませんが、データ転送やWeb会議はやはり安定した通信をさせたいものです。

   

## おわりに

このようにGAは特定のWebサービスのIPやドメインに対して海外からのアクセスを加速化させることができます。今回はAlibaba Cloud上のIPを加速化しましたが、なんと言ってもAlibaba Cloud外のIPも加速化できるので、例えば既にオンプレミスにVPNサーバがある場合などは新たにシステムを構築する必要がなくGAと組み合わせるだけで日中接続が快適になります。
   

ここでは紹介しきれなかったGAを使った冗長構成やIPsec-VPNの加速化などもありますので、是非ドキュメントもご参照ください。
   

【GAの冗長構成例】  
> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/170640.htm
   

【GAを使った国際IPsec-VPNの加速化】  
> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/160672.htm
