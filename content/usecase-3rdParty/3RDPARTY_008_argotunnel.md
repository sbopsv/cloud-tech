---
title: "CloudflareでゼロトラストNW"
metaTitle: "クライアントVPN不要!  Cloudflareを使ってWebサーバへゼロトラストアクセスを実現"
metaDescription: "クライアントVPN不要!  Cloudflareを使ってWebサーバへゼロトラストアクセスを実現"
date: "2021-03-17"
author: "sbc_saito"
thumbnail: "/3rdParty_images_26006613704024700/20210316182815.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## クライアントVPN不要!  Cloudflareを使ってWebサーバへゼロトラストアクセスを実現

# はじめに

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210317113202.png "img")      

本記事では、Cloudflare Accessを利用したWebサーバへのアクセスに認証機能を導入と  
Argo Tunnelを利用したWebサーバとCloudflare間の暗号化を行い、ゼロトラストネットワークを構築する方法をご紹介します。    


# 構成図
今回はこの様な構成を考えてみました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316182815.png "img")      

WebサーバはAlibaba Cloud東京リージョンのECSを利用してインターネットへのアクセスはSource NATをNATゲートウェイで行います。     
Argo Tunnelを利用すればNAT環境下であってもサーバを安全にインターネットに公開ができます。     
また、Cloudflare Accessで認証成功したユーザのみ、Webサーバへアクセスできる仕組みとなっております。     

# Cloudflareを利用するための準備
Cloudflareを利用するためにはドメインをCloudflareと紐づいている必要があります。  

# Cloudflare Accessをセットアップ
Cloudflareダッシュボードにログインし、Accessタブ→ログインメソッド→追加→One-Time Pinを選択し、保存します。  
ログインメソッドに「One-Time Pin」が表示されたことを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316190027.png "img")      


続いてログインメソッドの下部にあるAccess ポリシーに移動します。  
「Accessポリシーを作成」をクリックします。  
ここで公開するWebサーバのサブドメインと、アクセスポリシー内容を設定します。
今回はサブドメイン名を「saito」、アクセスポリシーを「@g.softbank.co.jp」のドメインのEメールアドレスのみを許可する様に設定しています。  
サブドメインが「saito」なので私の環境の<b>FQDNはsaito.<ドメイン></b>になりますね。  
許可のアクセスポリシーを追加した場合は、その他の条件でアクセスすると拒否する様になります。  
アクセスポリシーは他にもIPアドレスやGitHub組織等でも制限することが可能です。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316191547.png "img")      

以上でCloudflare Accessの設定は完了です。



# Argo Tunnelをセットアップ
今回のWebサーバの環境です。

* ECS Instance Type: ecs.c6.large    
* OS: CentOS 8.2.2004 (Core)    
* nginx version: nginx/1.14.1    

予めnginxをインストールさせた環境にArgo Tunnelを動作させるために必要なCloudflare deamonを導入します。  
> https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation


インストール方法がいくつかありますが、今回は導入が簡単な.rpm版をインストールします。

```
$sudo wget https://bin.equinox.io/c/VdrWdbjqyF/cloudflared-stable-linux-amd64.deb

$sudo dpkg -i cloudflared-stable-linux-amd64.deb
```

続いてCloudflareにログインしてサーバを認証します。

```
$cloudflared login
```

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316184114.png "img")      

ターミナルに表示されたhttp://~のURL(上記画像の赤枠部分)をお使いのWebブラウザにコピペしてアクセスします。     
(Webブラウザを利用することができるWebサーバならばそのままWebブラウザが立ち上がります。)     
          
すると、Webサーバをどのドメイン(ゾーン)で認証したいか問われますので選択します。    

私の環境ではドメインは1つしか登録していないので、1つだけ表示されています。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316183751.png "img")      

右下の「認証する」をクリック。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316183758.png "img")      
               
これでサーバの認証完了です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316183736.png "img")      


そして下記コマンドでArgo Tunnelを張り、WebサーバとCloudflare間の通信を暗号化します。     
FQDNとWebサーバのIPアドレスは適宜置き換えてください。     

```
$sudo cloudflared tunnel --hostname <FQDN> --url http://<WebサーバのプライベートIPアドレス>
```
          
下記画像の様にエラーが特に表示されなければArgo Tunnelが成功しています。          

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316184844.png "img")      
          
もう一つ確認方法としてCloudflare上のDNSレコードも確認してみましょう。     
先ほどArgo Tunnelを張る際に指定したサブドメインがAAAAレコードで登録されていることが確認できます。          

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316185348.png "img")      


# アクセス

クライアントのWebブラウザから、Cloudflareに登録した`http://<FQDN>`へアクセスします     

するとログインメソッドとAccessポリシーの時に設定した条件であるEメールアドレスを入力する画面が表示されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210317140442.png "img")      

条件に合致するEメールアドレスを欄に入力して「Send me a code」ボタンをクリックするとCloudflareから入力したEメールアドレス宛にワンタイムパスコードが送信されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316220146.png "img")      


Webブラウザに戻りメール内に記載されているワンタイムパスコードを入力して「Sign in」をクリックすると    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210317140436.png "img")      


アクセスが許可され、Webサーバへアクセスすることが出来ました(nginxの初期ページ)           

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316220004.png "img")      

ちなみにWebブラウザのURLバーをみてみるとhttps化されており、鍵アイコンが表示されています。  
実はWebサーバへのトラフィックをCloudflareを介すことにより、簡単にSSL対応が出来てしまうのです      
これが<b>Cloudflare SSL</b>というソリューションです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316221323.png "img")      

Webブラウザから証明書の詳細を覗いてみました。     
Cloudflare SSLを利用しているときは、SSL証明書の有効期限切れを心配する必要はありません。最新のSSL脆弱性についても最新情報が維持されます。  
これで「突然Webへ繋がらなくなった！」という証明書切れのトラブルからもおさらば出来ますね。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316221331.png "img")      


様々なCloudflareソリューションが互いにインテグレーションしており、セキュア&利便性に貢献しているんですね。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316222954.png "img")      


# 最後に
<b>クライアントにVPNソフトウェアをインストールしなくても、簡単&セキュアに社内システムにアクセスできる時代になりました。</b>  
WebサーバがNAT環境にあってもArgo Tunnelによりインターネット公開が出来、しかも通信はTCP/IPレベルで暗号化されています。     
加えてCloudflareからWebサーバ間およびCloudflareからクライアント間はアプリケーション層におけるSSL暗号化も可能で更にセキュアな環境が導入出来ます。     


 <CommunityAuthor 
    author="斎藤 貴広"
    self_introduction = "2020年からAlibaba Cloudのソリューション開発や技術支援に従事。ネットワークや基盤などのインフラ回りがメイン領域で、最近はゼロトラストセキュリティやWeb系もかじり中。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/saito.png"
    githubUrl=""
/>


