---
title: "CENで通話アプリ利用方法"
metaTitle: "通話アプリをCEN経由で使用してみる"
metaDescription: "通話アプリをCEN経由で使用してみる"
date: "2019-12-05"
author: "SBC engineer blog"
thumbnail: "/Network_images_26006613472212700/20191127155217.png"
---

## 通話アプリをCEN経由で使用してみる

今回はLINEやSkypeなどのスマホの通話アプリを、CEN経由で使用する方法について検証してみましたので、ご紹介します。      


      
# 検証のきっかけ   
先日とあるお客様から、「インドネシアからスマホアプリのSkype接続が遅延したり切れてしまう。安定して通話させる方法はないか。」と、ご相談がありました。   
このような海外からのアクセス遅延に対してご相談があった際は、海外リージョンからCENを使用して日本リージョンに抜け、日本リージョンに構築したHTTPプロキシーを経由させるという構成を提案するケースがよくありました。   以下のような構成です。      
![Proxyを使用した構成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191127154751.png "Proxyを使用した構成")

ところが、SkypeはUDPを使用するため、HTTPプロキシー経由での接続はできず、別の方法を検討する必要があることがわかりました。   
そこで、UDPをフォワードするための方法として、オープンソースのSoftEtherを使用した構成で、Skype接続を検証することになりました。
      

# 構築の流れ   
今回検証した環境の構築手順を簡単に説明していきます。   
以下の環境を構築します。      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191127155217.png "img")

## 1.ECS、CEN環境の構築   
まずはクラウド側の環境構築を行います。   
インドネシアリージョン、東京リージョンにVPC、Vswitchを構築しCENで接続します。



   

## 2.SoftEtherのインストール・設定   
### SoftEtherVPNserverのインストール

ECSをデプロイしたあと、SoftEtherVPNserverをインストールします。   （インドネシア、東京リージョンのECS共ににインストールします）   


```
# cd /usr/local/
# wget  http://jp.softether-download.com/files/softether/v4.29-9680-rtm-2019.02.28-tree/Linux/SoftEther_VPN_Server/
64bit_-_Intel_x64_or_AMD64/softether-vpnserver-v4.29-9680-rtm-2019.02.28-linux-x64-64bit.tar.gz
# tar zxvf Intel_x64_or_AMD64/softether-vpnserver-v4.29-9680-rtm-2019.02.28-linux-x64-64bit.tar.gz
# cd vpnserver/
# make
```
※モジュールは「softether-vpnserver-v4.29-9680-rtm-2019.02.28-linux-x64-64bit.tar.gz」を使用しました。   

ECS上でVPNサーバープロセスを常駐化させるため、Systemdでサービス化します。   
```
# vi /etc/systemd/system/vpnserver.service
[Unit]
Description=SoftEther VPN Server
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/vpnserver/vpnserver start
ExecStop=/usr/local/vpnserver/vpnserver stop

[Install]
WantedBy=multi-user.target
```
VPNサーバーを起動します。VPNサーバーを自動起動させる場合、systemctl enableを実行します。     
```
# systemctl start vpnserver
# systemctl status vpnserver    
# systemctl enable vpnserver
```
      

### SoftEtherVPNServerMangerのインストール    
続いて、GUIでSoftEtherの設定ができるように、[SoftEther公式ダウンロードページ](http://www.softether-download.com/ja.aspx?product=softether)から、SoftEther VPN Server Managerをダウンロード・インストールします。   
インストール後、VPN Server Managerを立ち上げ、ECSにインストールしたSoftEtherに接続します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128103243.png "img")
   

管理画面から以下の設定をしていきます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128103749.png "img")


### 仮想HUBの作成   
初期状態で作成されている仮想HUBを削除し、新規に仮想HUB
を作成します。   （インドネシアリージョン、東京リージョンのSoftEther共に作成します）   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128104150.png "img")

### ユーザーの作成   
ユーザーを作成します。   （インドネシアリージョン、東京リージョンのSoftEther共に作成します）   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128104209.png "img")


### ローカルブリッジ設定   
ローカルブリッジを設定します。   （インドネシアリージョンのSoftEtherのみ設定します）   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128104230.png "img")

### セキュリティNAT設定   
セキュリティNAT設定を行います。   （東京リージョンのSoftEtherのみ設定します）   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128104250.png "img")

### カスケード接続設定   
カスケード接続設定を行います。   （インドネシアリージョンのSoftEtherのみ設定します）   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128153328.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128105204.png "img")

### OpenVPN用コンフィグファイル作成   
コンフィグファイルをダウンロードします。   （インドネシアリージョンのSoftEtherのみ作成します）   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128104349.png "img")


## 3.iPhoneへのOpenVPNのインストール・設定   
### OpenVPNのインストール   
ここからはスマホ側の設定です。      
インドネシアリージョンのSoftEtherとVPN接続させるため、スマホ（今回はiPhoneを使用しました）にOpenVPNをインストールします。      
インストール後、VPN接続用のConfigファイル（SoftEtherからダウンロードしたConfigファイル）をiPhoneにコピーします。   
itunesを使うと簡単にコピーできます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128133045.png "img")

### VPN接続設定   
コピーしたConfigファイルを使用し、VPNの接続設定を行います。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128131550.png "img")

ユーザー名、パスワードはインドネシアリージョンのSoftEtherの仮想HUBユーザー名、パスワードを使用します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613472212700/20191128131536.png "img")

## 4.動作確認   
OpenVPNでVPN接続を行ったあと、Skypeアプリを起動し通話してみます。   

東京リージョンのECS上でtcpdumpコマンドを実行すると、Skype宛のパケットが流れていることを確認することができます。   

```
# tcpdump port 3478
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes

10:33:48.147540 IP iZ6we2j2t9k18vbesp7sjlZ.65100 > 203.140.30.195.stun: UDP, length 148
10:33:48.151182 IP 203.140.30.195.stun > iZ6we2j2t9k18vbesp7sjlZ.65100: UDP, length 151
10:33:48.208178 IP iZ6we2j2t9k18vbesp7sjlZ.65100 > 203.140.30.198.stun: UDP, length 148
```

   
# おわりに   
今回はSoftEtherとCENを使用して、海外リージョンからSkype等のUDPアクセスする方法について記載しました。   
この構成はUDPだけでなくTCPももちろんフォワードできますし、いろいろな用途に流用できると思います。   
構築は非常に簡単なのでぜひ試してみてください。   







