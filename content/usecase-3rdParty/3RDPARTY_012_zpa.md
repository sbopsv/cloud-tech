---
title: "ZPA APPコネクタでRDP接続"
metaTitle: "ZPA APPコネクタをAlibaba Cloud上に構築してRDP接続してみた"
metaDescription: "ZPA APPコネクタをAlibaba Cloud上に構築してRDP接続してみた"
date: "2021-09-27"
author: "sbc_saito"
thumbnail: "/3rdparty_images_13574176438014200000/20210927033901.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## ZPA APPコネクタをAlibaba Cloud上に構築してRDP接続してみた

# はじめに

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927033901.png "img")    

ソフトバンクでは企業のネットワークへの安全かつ柔軟なリモートアクセス環境を実現する  Zscaler™プライベートアクセス（以下ZPA）を提供しております。    

> https://www.softbank.jp/biz/security/zpa/

今回はソフトバンクの提供するZPAを利用して、Alibaba Cloud上にある仮想マシン(ECS)に"安全"にRDP接続してみます。     



# ZPAのアーキテクチャ  
ZPAとはZscaler公式によると     

> ZPA（Zscaler Private Access）は、ユーザ/アプリケーション中心のアプローチをプライベートアプリケーションアクセスに採用しています。完全クラウド提供型のサービスであるZPAは、個々のデバイスとアプリの間にセキュアセグメントを作成することで、許可されたユーザだけが特定のプライベートアプリケーションにアクセスできるようにします。したがって、ユーザのネットワークアクセスや水平方向の移動が発生することはありません。ZPAは、物理/仮想アプライアンスに依存するのではなく、軽量のソフトウェアを使用してアプリやユーザをZscaler Security Cloudに接続し、ユーザに最も近い場所で、仲介されたマイクロトンネルが連結されます。  

引用元 [https://www.zscaler.jp/products/zscaler-private-access]    

とのこと。                   
つまりプライベートなリソースへのアクセスに従来のVPNを必要とせず、ユーザやデバイスを認証して許可が与えられた場合のみリソースへのアクセスが可能となります。   

昨今話題の**ゼロトラストネットワークアクセスを実現するソリューション**ですね。    

  
ZPAの重要なコンポーネントを紹介します。    

# ZPA Service Edgesとは  
ZPA Service EdgesとはZPAのインターネットゲートウェイです。     
世界中のZscalerデータセンターに導入されており、管理ポータルで設定したポリシーに基づいて通信を転送or破棄する役割を担っています。    

# Zscaler Client Connector(ZCC)とは  
ZPAを利用するにあたってのクライアント側のクライアントソフトになります。    
様々なOSやデバイスに対応し、ZPA Service Edgesとの暗号化トンネル接続やセキュリティコントロールを行います。    

# ZPA APPコネクタとは  
ZPA APPコネクタはプライベートリソースとZPA Service Edgesの間に存在する安全なZPAの認証インターフェースであり   
ZPA Service Edgesとの間で暗号化トンネル接続を行います。    
ZPA APPコネクタはプライベートリソースと同じ場所でも、プライベートリソースにアクセスが可能な任意の場所のどちらでも構築することが可能ですが   
レスポンスやセキュリティの観点から、通常プライベートリソースに近いDMZに設置することが望ましいです。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927193446.png "img")    


# 構成図  
今回の構成図です。  
クライアント端末にはZCCをインストールして、ZPAのIdPとしてはOktaを採用します。     
Oktaの認証が成功したRDPのトラフィックはZPA Service Edges→NAT Gateway→ZPA APPコネクタを経由してWindowsをインストールしたECSに到達します。   
ちなみにNAT GatewayではDNATルールを記載する必要はありません。ZPA APPコネクタ側からのアウトバウンド通信(SNAT)が可能であれば    
TLS暗号化トンネルを確立してトンネル内でRDP通信が出来ます。    
また今回は事前にIdPとZCCの設定は完了しているものとします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210924040531.png "img")    


# ZPA管理ポータルの設定
本記事ではZPA管理ポータルの詳細な設定方法はご紹介いたしませんが    
ZPAの全般的な設定を行う管理ポータルでの作業フローの概要は以下の通りです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927002552.png "img")    


後のステップで前のステップで作成したオブジェクトを指定するため、この通りに進める必要があります。     

かなりステップが多いですが、まだ終わりではありません。    
Alibaba Cloud上に必要なZPA APPコネクタのECSインスタンスを作成しなければなりません。     
柔軟で強靭なゼロトラストネットワークを手に入れるためには必要ですので頑張っていきましょう。     

# ZPA APPコネクタのプロビジョニング
ZPA APPコネクタはAWSやAzure上では、各プラットフォーム上のMarketplaceでイメージ公開されていますが     
Alibaba Cloudでは未対応ですので、手動で構築する必要があります。    
とはいえステップは比較的簡単です。     

# ZPA APPコネクタの動作要件  

* OS：CentOS,RHEL
* CPU：ハイパースレッディングを備えた仮想マシン（VM）用の4つのCPUコア（Xeon E5クラス）  
* メモリ：4GB以上  
* Disk：8GB以上  
* ENI：1つ以上  
 
                
となり、上記基準で構築したZPA APPコネクタは最大500Mbps(上り下り合計)のスループットがサポートされます。    

# ECSインスタンスの作成  
新しい世代&メモリ8GBある<b>c6.xlarge</b>を今回選択しました。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927015809.png "img")    


OSは作成当時最新のCentOS8.3、Diskは初期標準のESSD 40GBを選択して作成します。   
NAT GatewayにてSNATを行うので、Public IPないしEIPは今回不要です。プライベートIPのみでOK。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927015813.png "img")    

# ZPA APPコネクタ構築
ECSインスタンスが正常に作成されたら、SSH or VNC等でマシンにログインします。     
sudoコマンドあるいはrootユーザにて下記を実行していきます。     

# 1.ZPA APPコネクタのリポジトリ登録  

```
>[root@ecs-daas-zpa ~]#  sudo vi /etc/yum.repos.d/zscaler.repo  
>>[zscaler]  
name=Zscaler Private Access Repository  
baseurl=https://yum.private.zscaler.com/yum/el7  
enabled=1  
gpgcheck=1  
gpgkey=https://yum.private.zscaler.com/gpg  
```
                
# 2.ZPA APPコネクタのインストール

```
>[root@ecs-daas-zpa ~]# sudo yum -y install zpa-connector  
```

1.5MBくらいのrpmファイルがDL/インストールされ、ZPA APPコネクタが導入されました。    

# 3.ZPA APPコネクタの停止

ここで一旦ZPA APPコネクタを停止します。     
  (既に停止している場合は問題ありません)     

```
>[root@ecs-daas-zpa ~]sudo systemctl stop zpa-connector  
```

# 4.Provisioning Keyファイルの作成

```
>[root@ecs-daas-zpa ~]# sudo touch /opt/zscaler/var/provision_key  
```


# 5.Provisioning KeyファイルのPermission変更

```
>[root@ecs-daas-zpa ~]#  sudo chmod 644 /opt/zscaler/var/provision_key  
```


# 6.Provisioning Keyの確認(ZPA管理ポータル)  

ここでZPA管理ポータルにログインします。    

```
Administration>APP CONNECTOR MANAGEMENT>App Connector Provisioning Keys  
```

から対象のProvisioning Keyをコピーして控えます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927022819.png "img")    


# 7.Provisioning Keyの登録  

```
>[root@ecs-daas-zpa ~]# sudo vi /opt/zscaler/var/provision_key
>> <b>Provisioning Keyを貼り付けて保存</b>
```

# 8.Provisioning Keyの登録確認 
```
>[root@ecs-daas-zpa ~]# sudo cat /opt/zscaler/var/provision_key  
>> Provisioning Keyが表示されます  
```

# 9.ZPA APPコネクタのサービス自動起動化
```
>[root@ecs-daas-zpa ~]# sudo systemctl enable zpa-connector
```

# 10.ZPA APPコネクタのサービス起動
```
>[root@ecs-daas-zpa ~]# sudo systemctl start zpa-connector  
```

# 11.ZPA APPコネクタの起動確認(ZPA管理ポータル)  

再びZPA管理ポータルです。  正しくZPA APPコネクタがプロビジョニングされていれば

```
Administration>APP CONNECTOR MANAGEMENT>App Connectors  
```

に自動的にApp Connecorオブジェクトが新規作成されているはずです。     
また、Connection Statusが[Connected]となっていることも確認してください。     
これでZPA APPコネクタの構築は完了です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927023947.png "img")    


# 12.Access Policyの定義(ZPA管理ポータル)  

ZPA管理ポータルから  

```
Administration>POLICY MANAGEMENT>Access Policy  
```

へ遷移し、新規Access Policyを作成します。   
ポリシーの対象条件としてすべてのApp Connectors、Windows ECSのApplication Segmentsを複数台選択し、Allowとしました。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927025645.png "img")    

参考     
> https://help.zscaler.com/zpa/connector-deployment-guide-centos-oracle-and-redhat

# 動作確認

クライアント端末にてZCCを起動するとIDとパスワードが求められるので入力。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927030808.png "img")    

すると連携済みのIdPにリダイレクトされ、再度IDとパスワードを入力します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927030811.png "img")    

ログインが完了したらService StatusとAuthentication Statusを確認します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927030815.png "img")    

この状態でZCCとZPA Service Edges間で接続が行われているので      
いつでもサーバへのゼロトラストアクセスがReadyな状態です。      

RDPクライアントを起動します。    
宛先はWindowsインストール済みECSのプライベートIPです。    
それでは接続！    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927031247.png "img")    


接続完了！RDPステータスも良好ですね。     
通常のRDPと操作感も何ら変わりません。ファイルのコピー等RDPで可能なことは問題なく行えます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927031251.png "img")    


# 最後に
以上でAlibaba Cloud上でZPA APPコネクタの動作確認やZPAとの接続の正常動作が確認できました。   

安全なネットワーク上でRDPするだけであれば、SSL-VPNやSAG-APPでも事足りるかもしれませんが     
複雑な認証が可能、ユーザ単位でのログ可視化などZPAは導入メリットが多いです。    

セキュリティやコストの要件/規模に合わせて最適なリモートアクセスの仕組みを導入しましょう！      

<CommunityAuthor 
    author="斎藤 貴広"
    self_introduction = "2020年からAlibaba Cloudのソリューション開発や技術支援に従事。ネットワークや基盤などのインフラ回りがメイン領域で、最近はゼロトラストセキュリティやWeb系もかじり中。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/saito.png"
    githubUrl=""
/>

