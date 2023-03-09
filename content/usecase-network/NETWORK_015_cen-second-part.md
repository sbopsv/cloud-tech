---
title: "CENでクラウドネットワークPart2"
metaTitle: "《後編》CENでつなげる↔クラウドネットワーク🕸"
metaDescription: "《後編》CENでつなげる↔クラウドネットワーク🕸"
date: "2019-08-28"
author: "sbc_y_matsuda"
thumbnail: "/Network_images_26006613400731600/20190805200841.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 《後編》CENでつなげる↔クラウドネットワーク🕸

# はじめに

本記事は、Alibaba Cloud のエンタープライズ向けネットワークサービス Cloud Enterprise Network （CEN）をご紹介します。    

内容が長いので、今回はCENの実際の構成例やCENのオススメポイントなどをご紹介します。   

前回はCENの基本的な用語や概念の説明を行いました。    
> http://sbopsv.github.io/cloud-tech/usecase-network/NETWORK_015_cen-second-part



<!-- more -->


# CENでの相互接続
  

現時点でCENを使って相互に接続できるのは以下のパターンになります。

* 同一リージョンでの相互接続  
* クロスリージョンでの相互接続  
* クロスアカウントでの相互接続  
* Alibaba Cloud に接続済のネットワーク（IDCなど）との相互接続  



<b><span style="color: #ff0000">＜制限事項＞</span></b>  
CENは簡単に設定できる反面、制約事項もあります。  
基本的な制限事項は下記のドキュメントをご確認ください。  


> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/64647.htm


上記に記載されていない構成・設計的な部分で気をつけるべき点は<span style="color: #ff0000">IPセグメント（CIDR ブロック）の重複です。</span>  
CENは接続されたVPCやゲートウェイへの経路を各VPCのプライマリルートテーブルに学習します。  
その際に同じIPセグメント（CIDR ブロック）が存在するとルーティングの問題が発生するので、VSwitch（サブネット）は綺麗に設計しましょう。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190821192611.png "img")    


VSwitchのセグメント重複があると接続ができないのですが、以下の様に<span style="color: #ff0000">ネットマスクが異なる場合は設定が可能です。</span>  
ただし、<span style="color: #ff0000">ロンゲストマッチのルールが適用されます</span>のでお気をつけください。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190821211000.png "img")    


<span style="font-size: 150%">さて、ここまでは前置きです、実際に可能な構成を紹介していきたいと思います。
</span>
## CENの接続構成例

## 同一アカウントでの同一リージョンVPC相互接続


同一リージョンの各VPCを接続可能で、所謂VPCピアリングです。  
上述の通りVSwitchの設計にはお気をつけください。  

<b>帯域幅パッケージ：<span style="color: #00cc00">不要</span></b>  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190805200336.png "img")    


ちなみに<b><span style="color: #ff0000">同一リージョン内における帯域幅はVPCの最大帯域幅</span></b>（現状10Gbps）となります。  
また、各インスタンス毎にイントラネット内での帯域幅（下図の赤枠部分）が決まっています。  
※状況により上限等は変わりますので正確な情報はサポートまでお問い合わせ下さい。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190805202219.png "img")    


参考までに`ecs.g5.4xlarge`でVPC間接続をして速度測定をした時の結果が以下になります。  
`Transfer`と`Bandwidth`を見て頂けるとスペック上の帯域幅の確認ができると思います。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190822212808.png "img")    



## 同一アカウントでのクロスリージョンVPC相互接続


異なるリージョン（下図では上海リージョン）との接続が追加されたクロスリージョンパターンです。     
異なるリージョン間を接続するので「帯域幅パッケージ」が必要になります。    

※ 帯域幅パッケージに関しては [前回の記事](http://sbopsv.github.io/cloud-tech/usecase-network/NETWORK_014_cen-first-part) をご覧ください。  
> http://sbopsv.github.io/cloud-tech/usecase-network/NETWORK_014_cen-first-part


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190805200731.png "img")    



## クロスアカウントでの同一リージョンVPC相互接続


<span style="color: #ff0000"><b>異なるアカウントの同一リージョン</b></span>と接続するパターンです。  
クロスアカウントですが<span style="color: #00cc00"><b>同一リージョンなので「帯域幅パッケージ」は不要です。</b></span>    

<b>帯域幅パッケージ：<span style="color: #00cc00">不要</span></b>  
<b>CEN クロスアカウント権限付与：<span style="color: #ff0000">必要</span></b>  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190805200841.png "img")    


クロスアカウントの場合、どちらかのアカウントでCENインスタンスを保有していればOKです。  
対向側のアカウント<b>（上図でいうとBアカウント）</b>で<span style="color: #ff0000"><b>クロス接続するVPC毎に権限付与が必要になります。</b></span>  

上図を例にすると<b>「BアカウントのVPC詳細画面（X VPCとY VPC）」</b>で『<span style="color: #ff0000">AアカウントのUID</span>』と『<span style="color: #ff0000">AアカウントのCEN ID</span>』を入力して認可します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190823174834.png "img")    


## クロスアカウントでのクロスリージョンVPC相互接続

<span style="color: #ff0000"><b>異なるアカウントで異なるリージョン</b></span>を接続するパターンです。  
これまで説明したクロスリージョンとクロスアカウントの設定が必要になります。  
この場合、<b><span style="color: #ff0000">CENを保有しているアカウント側で「帯域幅パッケージ」を購入する必要があります。</span></b>  

下図を例にすると、<span style="color: #ff0000">Aアカウントが「帯域幅パッケージ」を購入して「日本 ⇆ 上海」の経路を用意します。</span>  
Bアカウント側は、<span style="color: #0000cc">Aアカウントが用意した経路上で通信をするので「帯域幅パッケージ」が不要です。</span>

<b>帯域幅パッケージ：<span style="color: #ff0000">必要</span></b>  
<b>CEN クロスアカウント権限付与：<span style="color: #ff0000">必要</span></b>  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190805200951.png "img")    



# CENの接続構成例 - Advanced

ここまでは基本的なCENの構成例をご紹介しましたが、もう少しCENの特徴的な構成例もお見せします。

## CENを利用した国際拠点間の相互接続


<span style="font-size: 150%">CENはVPN Gatewayなどの外部接続経路を利用した、<span style="color: #ff0000">拠点間での相互接続（折り返しの接続）</span>が可能です❗️  </span>  

<span style="color: #ff0000">実は拠点部分をそれぞれ別のクラウドサービスを使って</span>実験しました、それは改めてブログに公開したいと思います。

拠点との接続はVPNGWの代わりに、CENに対応している回線事業者の接続サービスを利用することも可能です。  
※日本でも現在準備中ですが、詳しくはお問い合わせ下さい。
  
<b>帯域幅パッケージ：<span style="color: #ff0000">必要</span></b>  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190805210822.png "img")    


注意点としては<span style="color: #ff0000">拠点側のIPセグメントも含めて重複しない構成が必要</span>です。  
また、<span style="color: #ff0000">拠点側、VPNGWのルーティング</span>も適切に設定する必要があります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190822184151.png "img")    



## CENを利用したマルチリージョンネットワーク


CENでは異なるリージョンを接続する場合にどのリージョンを接続するのか設定します。  
下図のように「日本 ⇆ 上海」と「日本 ⇆ 北京」を設定すると、「日本 ⇆ 上海」「日本 ⇆ 北京」のそれぞれはつながりますが<span style="color: #ff0000">「北京 ⇆ 上海」の接続は出来ません</span>。  
※この状態でも細い経路（1Kbps程度）は引かれるので「北京 ⇆ 上海」でPingは通ります。

<b>帯域幅パッケージ：<span style="color: #ff0000">必要：「アジア太平洋 ⇆ 中国本土」</span></b>  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190806115425.png "img")    

<figure class="figure-image figure-image-fotolife" title="リージョン接続の設定">![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190806111650.png "img")    

<figcaption>リージョン接続の設定</figcaption></figure>


つなげるには下図のように「北京 ⇆ 上海」のリージョン接続の設定が必要になります。  
この状態であれば全てのリージョン間で相互接続が設定されているので拠点も含め全て通信可能です。

<b>帯域幅パッケージ：<span style="color: #ff0000">必要：「アジア太平洋 ⇆ 中国本土」＋「中国本土 ⇆ 中国本土」</span></b>  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190806163322.png "img")    




更にリージョンを増やして以下のような構成になると、<span style="color: #ff0000">「日本 ⇆ 北京」の接続設定がないので北京から日本へは直接つながりません。</span>   
しかし、北京から上海は接続されているので<span style="color: #0000cc">上海VPNGW経由で「北京 ⇆ 中国拠点」は接続可能です。</span>  

<b>帯域幅パッケージ：<span style="color: #ff0000">必要：「アジア太平洋 ⇆ 中国本土」＋「中国本土 ⇆ 中国本土」</span></b>  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190827205552.png "img")    


なお、上海（中国拠点）から日本（日本拠点）へは接続可能なので<span style="color: #0000cc">「北京 ⇆ 上海（中国拠点）⇆ 日本（日本拠点）」という形で中継して接続することは可能です。  </span>  
※この状態でも細い経路は引かれるので「日本 ⇆ 北京」でPingは通ります。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190827212837.png "img")    


実際のCENの設定画面は以下のようになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190806170804.png "img")    


リージョン接続やVPCのアタッチを行わない限りは実際にアクセス出来ないので、必要可否を判断し適切な範囲で接続をしましょう。


# CENのオススメポイント

さて、ここまでCENで出来る構成例をお見せしてきました。   
拠点間の相互接続などは特徴的ではありますが、CENのオススメポイントはそれだけではありません。  

CENの一番良いところはクラウド特有の弾力性を持った設定が可能な点です。

## リージョン間接続の帯域幅変更

前編でも説明をしておりますが、CENでは「リージョンの接続」でリージョン間の帯域幅を設定することで異なるリージョン間での接続が可能になります。  
例えば以下のようなリージョン間接続の構成があるとします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190814184636.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190826204457.png "img")    


「リージョンの接続」で設定されているリージョン間の帯域幅は上記画面からオンラインで変更が可能です。   
<span style="color: #ff0000">※設定変更に数分のタイムラグは発生します。</span> 


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190826200310.png "img")    

<span style="font-size: 80%">※電車の絵はイメージです
</span>

## 接続先リージョンの変更

CENでは帯域幅の変更だけでなく接続先のリージョンの変更もオンラインで可能です。  
<span style="color: #ff0000">※帯域幅パッケージの該当エリア内のリージョンへの変更のみ対応
</span>  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190826210307.png "img")    


<span style="font-size: 80%">※電車の絵はイメージです
</span>

下記の様に「帯域幅パッケージ」のエリアが異なるエリアへの変更はできません。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190826214312.png "img")    



## 帯域幅パッケージの帯域幅変更

ここまでは購入している「帯域幅パッケージ」の中での設定変更でした。  
前編でも説明していますが「帯域幅パッケージ」は<span style="color: #ff0000">1Mbps単位で1ヶ月から購入可能な通信帯域幅の利用権です。</span>  

と聞くと購入後の帯域幅変更は難しそうに感じるのではないでしょうか？  
私はそうでした。  

<span style="font-size: 150%">実はCENは帯域幅パッケージで購入している<span style="color: #ff0000">帯域の拡大も縮小もオンラインで可能なんですよ。</span>
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190827164301.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190827165933.png "img")    


変更処理自体も数分以内に適用されますし、追加分の「帯域幅パッケージ」の<span style="color: #ff0000">料金も<span style="font-size: 150%">分単位</span> で計算されています。</span> 

以下がアップグレード（拡張）時の料金計算式になります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190827163755.png "img")    

<span style="color: #ff0000">※記事作成時の情報になります。正確な情報はサポートにお問い合わせください。</span>

アジア太平洋  ⇆  アジア太平洋でアップグレードしたときの例を元に値を入れてみると下図の様になります。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190827173555.png "img")    

<span style="color: #ff0000">※終了日が翌月同日になっているのは中国標準時での計算に合わせているためです。
</span>

「アジア太平洋 ⇆ 中国本土」の場合も同じ計算になりますが、単価が異なりますので料金が変わります。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613400731600/20190827202451.png "img")    


ダウングレード（帯域幅縮小）を行なった場合も<span style="color: #ff0000">「帯域幅パッケージ」の残存期間に応じて返金が行われる仕組みになっています。  </span>

ただし、ダウングレード（帯域幅縮小）の場合は返金という形になり計算が複雑なため返金額に関してはお手数ですが個別にサポートへご確認ください。     



# 最後に

今回は後編ということでCENで出来る構成やCEN特有の弾力性に関してご紹介させて頂きました。
CENを使うことで中国本土内を含む国際拠点間の相互接続構成がつくれる点は大きなポイントではないでしょうか？

また、コンソールから簡単に帯域幅や接続先の変更・拡張・縮小が可能な手軽さもCENの良いところですね。  
拡張・縮小の料金に関しても、必要な時に大きく帯域を確保して不要になったら減らすという弾力性のある使い方ができることをご理解いただければ幸いです。


 <CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>


