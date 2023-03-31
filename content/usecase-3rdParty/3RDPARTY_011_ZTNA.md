---
title: "日中間のゼロトラストNW"
metaTitle: "Alibaba Cloud活用で日中間のゼロトラストネットワークを実現"
metaDescription: "Alibaba Cloud活用で日中間のゼロトラストネットワークを実現"
date: "2021-05-24"
author: "sbc_saito"
thumbnail: "/3rdParty_images_26006613766108400/20210524201658.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Alibaba Cloud活用で日中間のゼロトラストネットワークを実現


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524201658.png "img")      

# はじめに

本記事では、Alibaba CloudとCloudflareとOktaを組み合わせて中国のクライアントから日本のWebサーバへゼロトラストネットワークによるアクセスを行う方法をご紹介します。    


# 構成図  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210521154005.png "img")        

各コンポーネントを簡単に紹介します  

* <b>Alibaba Cloud  </b>       
* * VPN Gateway：フルトンネル接続で中国クライアントのすべてのトラフィックを受けます       
* * CEN：上海VPCと東京VPC間をセキュア&安定性に優れた専用線で接続します       
* * ECS(NAT Server)：Linux NATサーバです。これで中国から日本のインターネットを利用できます         
* <b>Active Directory</b>：オンプレミスのADDSサーバです                   
* <b> Okta</b>：IDaaSです。ADユーザ情報を基にした認証を導入するため、AccessのIdPとして利用します                   
* <b> Cloudflare</b> Access：Webサーバへのアクセスに認証システムを導入し、ゼロトラストセキュリティを実現します       
          

# Objective
やりたいことのタスクを整理します。          
* 中国クライアントはAlibaba Cloud上海リージョンのVPN GatewayにSSL-VPNでフルトンネル接続  
* CENを通じて東京リージョンのNATサーバへアクセス。デフォルトルートはこのNATサーバに向けておく  
* ADDSサーバを構築しておき、更にOktaにインポートしておく  
* OktaとCloudflare AccessをOpenID Connectする  
* Cloudflare AccessでWebサイトの認証およびDNS設定をする  


# Alibaba Cloud編
ここでは上海VPCのVPN Gateway(SSL-VPN)へフルトンネルで接続する方法をご紹介します。  

SSLクライアントのページを開いて、証明書とOpenVPNプロファイルのセットをダウンロードします。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210521180648.png "img")      

「cert.zip」という名前のファイルが取得できるので、zip解凍しましょう。  
config.ovpnファイルをテキストエディタで編集して以下の2行を追加します。  

* `redirect-gateway autolocal`

* ` dhcp-option DNS 8.8.8.8`　※明示的にDNSサーバも指定する場合  

設定の全容はこのような形です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210521182012.png "img")        
あとは保存して、OpenVPNクライアントにインポートしましょう。  
これでVPN Gatewayに接続するとフルトンネルでアクセスできます。  
あとは東京VPC側でNATサーバも構築完了して、VPCの設定でデフォルトルートを向けてあげれば…  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210521183046.png "img")      
中国クライアントからすべてのトラフィックを東京VPCにあるNATサーバへ流すので  
結果として日本のインターネットへブレイクアウトします。
Googleへもアクセス可能です。  
画面左下のロケーションが「日本」となっていることからも、Google側も日本からのアクセスと判定していますね。

# Okta編
今回AccessのIdPとしてAD連携したOktaを採用しています。  
その理由として、AccessでActive Directoryの情報で認証を行うにはオンプレADDSと連携したAzure ADやADFSのMS系プロダクトをIdPとすることも当然可能ですが、設定ステップが少なく一番導入が容易なOktaにしました。  
開発・検証用途は無償です。詳細は以下より  
> https://www.okta.com/jp/press-room/press-releases/okta-developer-starter/


オンプレミスのADDSサーバには自身の情報のユーザを1つ追加しただけの 
いたってシンプルなADです。  
オンプレミスのADDSサーバにOktaのADエージェントをインストールし  
OktaにADユーザ情報を同期させています。  

Accessと連携させるための認証設定を行います。
左サイドバーより[Applications]を選択  
[Create App Integration]ボタンを選択します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524115653.png "img")      
          
Sign-on methodは[OIDC - OpenID Connect]を選択  
Application typeは[Web Application]を選択してNext

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524115632.png "img")        
          
続いてこのアプリケーション設定を行います。  
App Integration Nameは任意  
Sign-in redirect URIsはCloudflare TeamsチームドメインのCallBack URIを入力します。     
`https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback`

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524115636.png "img")      

そして一旦Saveします。 

          
[Applications]の画面より、先ほど作成したAccessの連携アプリケーション設定を開きます    
そしてClient IDとClient secretを控えておきます。  
後ほどCloudflare側で使用します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524115644.png "img")      
          
[Sign On]タブへ遷移して  
OpenID Connect ID TokenのGroups claim filterを以下に設定します。  
`groups`:`Matches regex`:`.*`  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524133854.png "img")      
          
続いて[Assignments]タブへ遷移して  
アサインするユーザ/グループを選択します。  
今回はADDSサーバよりインポートした自身のユーザのみ選択しました。  
自分専用のOkta  リッチ 


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524133857.png "img")      


          

以上でOktaの設定は完了です。

          
# Cloudflare編
Teamsにログインして左サイドバー[Configuration]→[Authentication]より  
[+Add]をクリック


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524142014.png "img")      
          
一覧よりOktaを選択  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524142019.png "img")      
          
Name:任意  
App IDは先ほどのOktaの画面で控えていたClient IDを入力  
Client secretは同様にOktaのClient secretを入力  
そしてSaveします。  これでOkta連携設定は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524142023.png "img")      

          
続いてOktaの認証を用いてアクセスするためのサイト(アプリケーション)を設定します。  
サイドバーより[Access]→[Applications]を選択  
  [Add an application]ボタンをクリック  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524172441.png "img")      
          


ZoomやGoogleWorkplaceなどへ認証を導入したい場合は[SaaS]を選択しますが  
今回は自作Webページへアクセスさせたいので[Self-hosted]を選択。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524145442.png "img")      
          

Application nameは任意  
Application domainには所有ドメイン上からサイトドメインを設定します。  
ルートドメインでも構いませんしサブドメインにしてもOKです。  
私の場合は`saito.mydomain.com`としました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524145449.png "img")      
          

Identity providersにはOktaのみを今回選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524174402.png "img")      
          

そしてアクセスルールも作成しておきましょう。
今回はOktaのDomain Usersグループに所属するユーザのみ認証可とします。  
ADDSサーバでは標準でDomain Usersグループが作成されますが  
Oktaへのインポート時に自動でグループも取り込まれます。  
もちろん私個人のユーザ情報もこのグループに格納されておりますので問題なし。
その他Countryで国の接続元制限をかけたり等、幅広くポリシーを書くことが出来ます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524172148.png "img")      
あとは画面に従い、セットアップを完了します。
          

最後に、DNS設定をします。  
Teamsではなく通常のCloudflareダッシュボードに遷移して  
DNSよりオリジンサーバのレコードを登録してあげます。   
この際、例えばAレコードならば`名前`に先ほどApplication domainに設定した値を入力してください。  
今回の場合は`saito`ですね。  
そしてオリジンサーバのIPアドレスも入力  してあげたら[保存]ボタンをクリックして完了。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524175754.png "img")      
※Argo Tunnelでオリジンサーバを登録する際は、DNSレコード登録も自動です。

> https://www.sbcloud.co.jp/entry/2021/03/17/argotunnel


# では早速アクセス 

上海にWindowsクライアントを用意しました。(実際はAlibaba Cloud上海リージョンにあるDaaS環境です)  

Cloudflareに登録したURLにアクセスします。  
するとオリジンサーバにそのままではアクセスさせてくれず  
認証画面が表示されます。ではOktaを選択しましょう。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524184217.png "img")      
          
Oktaのサインイン画面へリダイレクトされました。  
Oktaのディレクトリに登録してあるユーザ名とパスワードを入力してサインインします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524184222.png "img")      
          
Oktaで認証成功するとアクセストークンが発行→Webブラウザに送信され  
Webサイトへアクセスが出来るようになります。  
     
無事アクセスできましたね 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524184228.png "img")      
          

# 実運用ではどう使う
Accessはポータル機能を標準で用意しています。  
つまり先ほどの実演のように、1つ1つのサイトやSaaSに対して個別に認証しなくとも、ポータルに1度サインインしてしまえば、有効期限内はシングルサインオン(SSO)が可能になります。  
このようなイメージです↓  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524184206.png "img")      
          
社内のポータルサイトやSalesforce、会議用のZoomや日本にあるDaaS環境へのRDP接続などに対して、Accessを挟むことでゼロトラストセキュリティが簡単に実現できるようになります。


そしてその環境に中国からでも、Alibaba Cloudを利用することで  
低コスト&高品質&高機密な接続ができます   

# 最後に
本記事では、libaba Cloud活用で日中間のゼロトラストネットワークを実現する方法をご紹介しました。    
今回のように<b>VPN Gateway+CEN+NATサーバの構成を活用すれば日本で展開している様々なSaaSを中国から利用可能になります。 </b>  
ご興味ございましたら、ぜひ実際にハンズオンしてみてください。     


 <CommunityAuthor 
    author="斎藤 貴広"
    self_introduction = "2020年からAlibaba Cloudのソリューション開発や技術支援に従事。ネットワークや基盤などのインフラ回りがメイン領域で、最近はゼロトラストセキュリティやWeb系もかじり中。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/saito.png"
    githubUrl=""
/>



