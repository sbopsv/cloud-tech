---
title: "CloudflareでWEBフィルタリング"
metaTitle: "Cloudflare GatewayでWebフィルタリングをやってみた"
metaDescription: "Cloudflare GatewayでWebフィルタリングをやってみた"
date: "2021-03-25"
author: "sbc_saito"
thumbnail: "/3rdParty_images_26006613705046400/20210319153337.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## Cloudflare GatewayでWebフィルタリングをやってみた


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210322205236.png "img")      

# はじめに

本記事では、Cloudflare Gatewayを利用して、簡単にクライアントのWebフィルタリングする方法をご紹介します。    

# Webフィルタリングとは

Web（URL）フィルタリングとは、組織・個人によるインターネットの私的利用を制限し情報漏えいなどの防止や業務効率向上を実現するサービスです。  
主に職場や学校等で社員や生徒に閲覧に望ましくないWebサイトをブロックする用途で利用されます。

例:犯罪や麻薬に関わるサイト、アダルトサイト、オンラインゲームサイトをブロック
               

# Cloudflare Gatewayとは

インターネット上のチームとデータを保護する、包括的なセキュリティを提供するソリューションです。  
その中の「DNSフィルタリング機能」を使用して、Webフィルタリングを行うことが可能で  
悪意のあるコンテンツをネットワークから遮断します。

<b> 従来型のシステムとCloudflareの比較</b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319153337.png "img")      

> 従来型：社内端末のWebフィルタリングを実施するには、クライアントソフトウェアのインストールや制御するサーバインスタンスが必要なのが常識  
> Cloudflare：クラウド上のDNSで行う画期的なマネージドサービスのため、サーバインスタンスやソフトウェアインストールは不要

     

Cloudflare Gatewayだと専用サーバや追加ソフトウェアも要らないので構成もシンプルですし、パフォーマンスに影響することなくWebフィルタリングが行えますね 
               
# ポリシーの設定
まずはクライアントにどの様な制限や挙動を加えたいのかポリシーを設定します。    

CloudflareにログインしてAccessタブからTeamsを起動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210322093407.png "img")                


 左カラムから[Gateway]→[Policies]を選択→[Add a policy]をクリック。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319162021.png "img")                

ポリシー名を決めましょう。  
今回は「saito_policy」としました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319163047.png "img")      
          
続いて[Security risks]タブへ遷移し、「Block all」にチェックを入れてCloudflare Gatewayのデータベースに登録されている、全ての脅威に対しブロックを行います。  
Malwareはもちろんとして、最近流行りのWebブラウザ上での暗号資産のマイニング行為(Cryptomining)もブロックできるなど、脅威トレンドに敏感で安心感がありますね。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319163213.png "img")                

次に[Content categories]タブへ遷移し、ブロックするWebサイトをカテゴリ単位で決めます。
ブロックしたいカテゴリにチェックを入れるだけです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319163610.png "img")                

横に「▼」があるカテゴリ名は、さらにサブカテゴリまで指定が可能です。  
例えば[Shopping & Auctions]はこんな感じ。  
今回は、[Coupons]だけチェックを外して登録してみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319163621.png "img")                

カテゴリの選択で対象となるドメインはCloudflareのデータベースに登録されているドメインとなります。    
随時データベースは更新されておりますが、対象のドメインが制御できなかった場合は以下の方法で対応可能です。    

[Custom]タブでは、ドメイン単位で設定が可能なのでカテゴリではブロックできなかったWebサイトや、逆に例外的に許可したいWebサイトを指定できます。
[Add a destination]ボタンから設定できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319163626.png "img")                

今回は[yahoo.co.jp]を明示的にブロックしてみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319163635.png "img")                

追加されましたね 
右上の[Save]ボタンをクリックするのをお忘れずに

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319163646.png "img")                


               
# ロケーションの設定

先ほど設定したポリシーを、どの条件の通信において適用させるか決めるためロケーションを設定します。  
左カラムより[Gateway]→[Locations]を選択して[Add a location]ボタンをクリック。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319162039.png "img")                


ロケーション設定の名前を決めます。  
今回は「saito_gw」としました。
さらに下には、今CloudflareへアクセスしているクライアントのグローバルIPv4アドレスが表示されていると思います。  
このIPアドレスがロケーションとなります。  
そしてAssign policiesは先程設定した「saito_policy」を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319162031.png "img")                


画面を下にスクロールして、Default Locationは今回は特に設定しませんので  
「Add location」ボタンをクリックしてロケーションを確定させます。  
(Default Locationに関連するWARPはまた後日ご紹介しますね!)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210322192459.png "img")                

すると、ロケーションに設定したIPアドレスと、Cloudflare DNSサーバへの接続方法が記載されたページが表示されます。  
IPv6やDNS over TLS/HTTPSにも対応しているあたり流石Cloudflare

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319163932.png "img")                


画面を下の方にスクロールして...  
私の環境はmacOSなので、macOSのインストラクションを見てみましょう。  
設定方法は簡単ですね。DNSサーバを設定するだけ。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210322193330.png "img")                

記載されている通りにmacのWiFiインタフェースにDNSサーバを設定してみました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210322193710.png "img")                

インストラクションを読んで設定が終わったら、Cloudflareに戻って[Done]ボタンを押して設定を完了させましょう。
          
ここまでで設定は全て完了です。  
<b>Cloudflare Gatewayの仕組みは、ロケーションに設定したIPアドレスから、Cloudflareが提示したDNSサーバ(今回は172.64.36.x)へDNSクエリを送信すると、設定したPolicy内容のDNS応答をします。</b>

これがCloudflare流のWebフィルタリング手法です 
          
# 動作テスト
いくつかのWebサイトへアクセスして、設定した内容で正しくブロックorアクセスされるかテストしてみました。  

1. [eBay](https://www.ebay.co.jp/)（https://www.ebay.co.jp/） へアクセス  
eBayはオークションサイトなので、ブロックできれば成功です。  
<span style="color: #0000cc"><b>→ブロック成功</b></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210322194413.png "img")                

2. [Amazon.co.jp](https://www.amazon.co.jp/)（https://www.amazon.co.jp/） へアクセス  
Amazonはショッピングサイトなので、ブロックできれば成功です。  
<span style="color: #0000cc"><b>→ブロック成功</b></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210322194413.png "img")                

3.LUXA(https://luxa.jp/)（https://luxa.jp/） へアクセス  
LUXAはクーポンサイトなので、サブカテゴリで[Coupons]のチェックは外しているためアクセスできれば成功ですね   
<span style="color: #0000cc"><b>→アクセス成功</b></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210322195111.png "img")                

4.Yahoo!(https://www.yahoo.co.jp/)（https://www.yahoo.co.jp/） へアクセス  
明示的にYahoo!へのアクセスをブロックする様に設定しましたね。  
<span style="color: #0000cc"><b>→ブロック成功</b></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210322200115.png "img")                

# まとめ

<b>Cloudflare Gatewayを活用することで簡単にWebフィルタリングが実現できました  </b>   
カテゴリ別で楽に設定・運用できますし、細かく制御したければドメイン毎でも設定可能。  
更にはマルウェア、フィッシング、ランサムウェアなどのセキュリティ脅威からも防ぐ優れものです   

専用サーバも不要ですし、クライアント端末へのソフトウェアインストールも不要です。   
Webプロキシ形式ではないのでUDP通信も利用できてWeb会議のパフォーマンスにも影響しません。
          
現行のWebフィルタリングのパフォーマンスやセキュリティにお困りの方に、ピッタリのソリューションです 


 <CommunityAuthor 
    author="斎藤 貴広"
    self_introduction = "2020年からAlibaba Cloudのソリューション開発や技術支援に従事。ネットワークや基盤などのインフラ回りがメイン領域で、最近はゼロトラストセキュリティやWeb系もかじり中。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/saito.png"
    githubUrl=""
/>




