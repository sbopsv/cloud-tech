---
title: "Cloudflareで次世代VPN"
metaTitle: "Cloudflare WARPで次世代VPNを体験しよう "
metaDescription: "Cloudflare WARPで次世代VPNを体験しよう "
date: "2021-04-19"
author: "sbc_saito"
thumbnail: "/3rdParty_images_26006613715939400/20210416105911.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Cloudflare WARPで次世代VPNを体験しよう


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210416105911.png "img")      

# はじめに

本記事では、Cloudflare WARPというクライアントVPNソリューションをご紹介します。    
 

# 「WARP」とは

Cloudflareが提供する次世代のVPNソリューションです。  
VPNのプロトコルとして「WireGuard」を採用しているのが特徴で  
現代のデバイスに最適化した暗号設計のため、IPsecやOpenVPNと比べて  
より堅牢で、より高速に通信が行うことが出来ます。  

利用方法は専用クライアントソフトをインストールすることで簡単にお使い頂けます。  
パブリックDNSである1.1.1.1は皆さんご存知のことと思いますが  
このアプリケーション版がWARPクライアントソフトも兼ねています。  


WARPのDNSリゾルバは1.1.1.1を利用しますが
1.1.1.1自体がパブリックDNSとして世界最速のリゾルバですので  
WireGuardプロトコルの高速なスループットも相乗して  
WARPは世界最速のクライアントVPNと言えるかもしれませんね。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210414120817.png "img")      
          




# WARPをインストールしてみた

今回はmacOSで動作確認していきます。  
1.1.1.1のダウンロードはもちろん

> https://1.1.1.1

から。            
対応OS:Windows,macOS,iOS,Android  

インストールが完了したら接続は至ってシンプル  
トグルをクリックしてオンにするだけ。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210414114945.png "img")      

ターミナルでmacOSのネットワークインタフェースを確認してみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210414111952.png "img")      
私のmacでは「utun2」というWARP用の仮想インタフェースが新たに作成され  
IPv4とIPv6のIPアドレスが払い出されていますね。
          


# パフォーマンステスト

スループットのパフォーマンスを測ってみます。
回線はソフトバンク 5Gを利用しています。

<b>まずはWARP未接続の通常接続時</b>  
本題の趣旨から逸れますが5G爆速ですね   
モバイル回線なのにレイテンシも優秀  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210416104854.png "img")      
          

<b>そしてWARP接続時</b>  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210416104922.png "img")      

WARPはWireGuardプロトコルを採用していることや  
Cloudflareのインフラアーキテクチャが優れていることから  
VPNであっても100Mbps越えと、高パフォーマンスを実現できています。
          



続いてWeb表示のパフォーマンスを測定します。  
表示対象のWebページはGoogleニュース(https://news.google.com/) です。  
          

<b>まずはWARP未接続の通常接続時  </b>  
Webページ表示の体感速度である「Time to Interactive」で比較すると10.2秒。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210416095336.png "img")      



<b>続いてWARP接続時  </b>  
「Time to Interactive」は9.0秒。  
VPN接続時の方がパフォーマンスが優れる結果となりました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210416095331.png "img")      

# Cloudflare Teamsと組み合わせる

WARPはCloudflare Teamsと結合すること可能なので
コンテンツフィルタ等にも対応しエンタープライズユースにも向いています。

設定方法はWARPのトグルスイッチの画面右上の歯車アイコンをクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210415094834.png "img")      
「Preferences」をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210414111930.png "img")      

Connectionタブに遷移して  
Gateway DoH Subdomainの「Change」ボタンをクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210414111934.png "img")      

するとDoHのサブドメインの入力を求められます。
これがどこに書いてあるのかというと

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210414111941.png "img")      

Cloudflare Teamsにログインして
Gateway→Locations→設定したポリシー　に遷移すると
DNS over HTTPS(DoH)のサブドメインがわかります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210415094821.png "img")      


DoHのサブドメインをWARPの入力欄にコピー&ペーストでDone

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210415095202.png "img")      

接続画面に戻って、Teamsのロゴが表示されていれば
正しく設定ができています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210416094559.png "img")      

この状態でYahoo!(https://www.yahoo.co.jp)にアクセスします。  
Gatewayにて、Yahoo!ドメインへのアクセスをブロックする様に設定していますので  
正しくブロックされています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210416094616.png "img")      
          

# まとめ

<b>Cloudflare WARPを利用して簡単・安全・高速なVPN接続を手に入れることが可能です。 </b>   
WARPは1GBまでは無料&登録不要で即時使えるプロダクトですので  
カフェや駅などの公共のWiFiスポットやセキュリティが貧弱なWiFiスポットを利用する場合に是非使ってみてください。  


 <CommunityAuthor 
    author="斎藤 貴広"
    self_introduction = "2020年からAlibaba Cloudのソリューション開発や技術支援に従事。ネットワークや基盤などのインフラ回りがメイン領域で、最近はゼロトラストセキュリティやWeb系もかじり中。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/saito.png"
    githubUrl=""
/>





