---
title: "SAG-APPを無料で試してみた"
metaTitle: "新SSL-VPNプロダクト「SAG-APP」を無料で試してみた"
metaDescription: "新SSL-VPNプロダクト「SAG-APP」を無料で試してみた"
date: "2020-09-25"
author: "sbc_saito"
thumbnail: "/Network_images_26006613631873100/20200925111102.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 新SSL-VPNプロダクト「SAG-APP」を無料で試してみた

# はじめに

本記事では、Alibaba Cloudの新SSL-VPNプロダクトである「SAG-APP」が現在無料トライアルキャンペーン中なので早速試した結果をご紹介します。   



# 1.SAG-APPとは
SAG-APPとはAlibaba CloudのSAGプロダクトシリーズの1つで、SSL-VPNソリューションとして扱われています。     
現在展開しているエリアは中国大陸、東京、香港、シンガポール、ジャカルタ、クアラルンプール、シドニー、フランクフルトです。    

SAGプロダクトは他にも拠点ルータのSAGデバイスや、仮想ルータとして利用するSAG vCPEがあります。    
SAGデバイスについては過去記事をご覧ください。    
> https://www.sbcloud.co.jp/entry/sagdevice

このSAG-APP、従来のVPN Gatewayプロダクトと異なる特徴として3つ挙げるとすれば    

1. クライアントにVPNプロファイルのインストールが不要     
1. VPNクライアントソフトの入手が容易     
1. 低遅延な接続が可能     

が挙げられます。    

1番目については運用面で嬉しいですし、2番目については昨今の中国のVPN規制状況においても、VPNクライアントソフトの入手が容易ですので、非常に魅力的なプロダクトですよね。     
そして3番目はAlibaba Cloudへ接続する出入口(POP)がサービス展開しているエリア毎に複数あり、すべてのSAGプロダクトは一番最寄りのPOPに接続する仕様のため、低遅延なVPN接続が可能となっております。     

# 2.無料トライアル要件

SAG-APPの無料トライアルには下記の利用要件があります。    

> * 中国本土リージョン/ 1ユーザ/2Mbps/月5GBまでの上り下り合計トラフィック/申込から1年間　が無料トライアル範囲となります。    
> * 2022年4月1日までが申込対象期間です。     
> * SAG-APP製品を購入したことがないユーザ     
> * 同じユーザーは1つの無料トライアルにのみ参加でき、ユーザーが複数のAlibaba Cloudアカウントを持っている場合、無料トライアルに参加できるのはそのうちの1つだけです。      

詳細はAlibaba Cloudドキュメントセンターをご確認ください。     
> https://www.alibabacloud.com/cloud-tech/doc-detail/170105.htm

# 3.早速試してみる
SAGプロダクトはまだ完全に日本語訳に対応していないので、コンソールの表示言語を英語に変更して進めていきます。     

# 3-1.SAG-APPインスタンスの作成

Alibaba Cloudにログインし、画面上部の検索バーに「smart access gateway」と入力して    
プロダクトへのリンクが候補で現れるので押下します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200924160054.png "img")    


画面左部のカラムから「Smart Access Gateway APP」→「SAG APP instances」を選択します。    
そうするとSAG-APPのコンソール画面に推移します。「Start Free Trial」ボタンを選択すると無料トライアルの申込画面が表示されます。(※自動表示される場合もあります。)    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200924160119.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200924160110.png "img")    


[Claim]ボタンを押下すると無料トライアル用のインスタンスが作成されます。     


# 3-2.SAG-APPインスタンスの設定

作成したSAG-APPインスタンスの「Quick Configuration」を選択し、設定を行います。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200925180258.png "img")    


まずはCCNと紐付けます。CCNとはSAGプロダクトをAlibaba Cloudへ接続するネットワークを提供するインスタンスです。1つのCCNに最大500のSAGプロダクトインスタンスを紐付けすることが可能です。またCCNに課金要素はありませんのでご安心を。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200925180248.png "img")    

今回、既存のCCNはありませんので、新規に作成するため「Create CCN」を選択して名前は「test-ccn」としました。    


続いてこのSAG-APPインスタンスに接続するクライアントに払い出されるプライベートネットワークCIDRを指定します。今回は「192.168.100.0/24」にしました。     
確認後、画面下部の青いNextボタンで次へ進みます。    

続いては前画面で作成したCCNを、CENと紐付けます。    

CENとは仮想専用線プロダクトで、通常は異なるリージョン同士を接続する際に利用されますが、SAGプロダクトではSAGプロダクト同士を接続する場合においても利用します。     

例えばSAGデバイスとSAG-APP間で相互に通信したい場合などです。    
例えばSAG-APPから東京リージョンにあるECSへ接続する場合にはCCN中国大陸リージョンと東京リージョンをCENでバインドしてあげれば疎通が可能です。     

こちらも既存のCENはありませんので、「Create CEN」を選択し、名前は「test-CEN」としました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200925180238.png "img")    


確認後、画面下部の青いNextボタンで次へ進みます。     

最後にユーザを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200925180228.png "img")    


```
Username:test-user
Email Address:※セキュリティ上マスクしております
Static IP:OFF (デフォルト)※固定IPにする場合はONにし、IPを指定します。
Set Maximum Bandwidth:2000Kbps(デフォルト)
Set Password:※セキュリティ上マスクしております
```

確認後、画面下部の青いConfirm Creationボタンで次へ進みます。    

これでインスタンスの設定は完了です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200925180218.png "img")    



# 3-3.クライアントの準備

クライアント側にVPNクライアントソフトを導入します。    
対応OSはWindows,macOS,Android,iOSとなっております。    

今回はmacOS High Sierra環境で試したいと思います。    

macとiOSのVPNクライアントソフトの入手はいたって簡単です！    
AppStoreからインストールするだけです！     
(しかも中国からもインストール可能!)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200924160219.png "img")    


macOS版のAppStoreリンクはこちら(※macOS 10.15.4以降は後のリンクを参照)    
> https://apps.apple.com/jp/app/%E9%98%BF%E9%87%8C%E4%BA%91%E7%BD%91%E7%BB%9C%E5%AE%A2%E6%88%B7%E7%AB%AF/id1486294815?mt=12

iOS版のAppStoreリンクはこちら     
> https://apps.apple.com/jp/app/%E9%98%BF%E9%87%8C%E4%BA%91%E7%BD%91%E7%BB%9C%E5%AE%A2%E6%88%B7%E7%AB%AF/id1484752763

その他、WindowsとAndroid、macOS 10.15.4以降に関してはこちらのリンクをご確認ください。   
> https://www.alibabacloud.com/cloud-tech/doc-detail/102544.htm


インストールして起動したら、UsernameとPasswordとSAG-APPインスタンスIDを入力して、プライバシーポリシーに同意してLoginボタンをクリックすればOKです。つまりVPNプロファイルのインストールは不要で、これらの文字列を入力するだけで完了してしまうので、展開も簡単ですよね！     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200925175909.png "img")    




展開が簡単　といえば余談ですが     
先ほどユーザを設定する際に、Eメールアドレスを入力しましたが     
そのアドレス宛にSAG-APPの利用案内が自動送信されています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200925175914.png "img")    

Username、Password、SAG-APPインスタンスIDとVPNクライアントソフトの案内を自動で送付してくれるのはIT管理側からするとアリガタイですよね！     

# 3-4.クライアントの接続

ログインが完了するとConnectボタンが中央に表示されますので、こちらを押下してください。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200924160240.png "img")    


中央のアイコンが緑色に変われば接続完了です！     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200924160235.png "img")    


macOS標準ターミナルでifconfigしてみると、仮想インタフェースにしっかりIPアドレスが払い出されていることがわかります。

```
> utun3: flags=8051<UP,POINTOPOINT,RUNNING,MULTICAST> mtu 1340
> 	inet 192.168.100.2 --> 192.168.100.2 netmask 0xffffffff
```

# 4.疎通確認

現在まで、以下ようにAlibaba Cloudインスタンスが紐付けされています。     

```
SAG-APPインスタンス<--->中国大陸CCN<--->CEN    
```

ここではCENに新たに上海リージョンのVPCをアタッチしてEnd to Endで通信を確認してみたいと思います。インスタンスの紐付け関係で表すと以下のようになります。     

```
SAG-APPインスタンス<--->中国大陸CCN<--->CEN<--->上海リージョンVPC
```


IPアドレス情報は以下の通りです。     

* SAG-APPクライアントのIPアドレスが192.168.100.2     
* 上海リージョンのECSのIPアドレスが192.168.10.20      


CCN中国大陸と上海リージョンVPCの経路情報交換は真ん中のCENが担ってくれます。    

構成図に表すと以下の図のようになります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613631873100/20200925111102.png "img")    



それではSAG-APPクライアント(mac)から上海リージョンVPCのECS宛にpingを打ってみます。    

```
>SBCMAC:~ SBCuser$ ping 192.168.10.20
>PING 192.168.10.20 (192.168.10.20): 56 data bytes
>64 bytes from 192.168.10.20: icmp_seq=0 ttl=62 time=204.323 ms
>64 bytes from 192.168.10.20: icmp_seq=1 ttl=62 time=179.083 ms
>64 bytes from 192.168.10.20: icmp_seq=2 ttl=62 time=230.653 ms
>64 bytes from 192.168.10.20: icmp_seq=3 ttl=62 time=254.032 ms
>64 bytes from 192.168.10.20: icmp_seq=4 ttl=62 time=120.832 ms
>64 bytes from 192.168.10.20: icmp_seq=5 ttl=62 time=108.447 ms
>64 bytes from 192.168.10.20: icmp_seq=6 ttl=62 time=144.797 ms
>64 bytes from 192.168.10.20: icmp_seq=7 ttl=62 time=131.614 ms
>64 bytes from 192.168.10.20: icmp_seq=8 ttl=62 time=540.283 ms
>64 bytes from 192.168.10.20: icmp_seq=9 ttl=62 time=182.787 ms
>--- 192.168.10.20 ping statistics ---
>10 packets transmitted, 10 packets received, 0.0% packet loss
>round-trip min/avg/max/stddev = 108.447/209.685/540.283/119.096 ms
```


パケットロスも無くping成功していますね！     
本構成だと日本のSAG-APPクライアントが国際インターネットを通って、CCN中国大陸に接続しているので遅延が大きくなっていますが     
中国現地でお試しいただける環境があれば、低遅延もご実感いただけることと思います。    

もちろん無料トライアルでは無く、通常でサービスインしていただければ東京でも展開しているプロダクトとなっておりますので、日本国内から低遅延での接続が可能です！    


# 最後に

今回は無料トライアルのため1ユーザのみでしたが、通常ですとSAG-APPインスタンス1つあたり最大1000ユーザまで作成可能なので、より大きな規模でもご利用可能です。    

またSAG-APPを通常のサービスインしていただく場合においては、利用価格が安価なことや、東京エリアでも利用可能なことから<span style="color: #dd830c"><b>日本国内でご利用いただく用途にも向いている</b></span>と思います！    

特に中国においては様々なVPNクライアントソフトの入手自体が困難な状態となっており、SAG-APPならば入手が容易な点も大きなメリットとなりますね。    

特徴の多い新しいプロダクトとなっておりますので、是非みなさんも試してみてくださいね！    


<CommunityAuthor 
    author="斎藤 貴広"
    self_introduction = "2020年からAlibaba Cloudのソリューション開発や技術支援に従事。ネットワークや基盤などのインフラ回りがメイン領域で、最近はゼロトラストセキュリティやWeb系もかじり中。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/saito.png"
    githubUrl=""
/>


