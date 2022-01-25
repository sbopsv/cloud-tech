---
title: "Anti-Bot Serviceの紹介"
metaTitle: "Anti-Bot Service をさわってみました - Protection 基本編"
metaDescription: "Anti-Bot Service をさわってみました - Protection 基本編"
date: "2019-12-12"
author: "sbc_y_matsuda"
thumbnail: "/Security_images_26006613479441800/20191212114956.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Anti-Bot Serviceの紹介

本記事では、Alibaba Cloud セキュリティプロダクトサービスである Anti-Bot Service についてをご紹介します。    

Alibaba Cloud には意外と多くのセキュリティ関連のプロダクトがある事をご存知でしょうか？  
以下の図はザックリ2019年12月時点での一覧になります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191210001924.png "img")      


今回は<b>「名前だけで何が出来るかわからないシリーズ」</b>の中から偶々検証する機会のあった<b> Anti-Bot Service </b>を簡単にご紹介させて頂きたいと思います。 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191212114956.png "img")      

      

<!-- more -->

# Anti-Bot Service とは?

名前の通り`Bot` に対抗するサービスです。    
では`Bot` って何だ？という事になりますが大まかには下記の様な定義になるのかなと思います。  

> Webボットあるいは単にボットとも呼ぶ。一般に単純な繰り返しのタスクをこなし、そのようなタスクに関しては人間が手でやるよりも高速である。ボットは主にクローラとして使われることが多く、人間の何倍もの速さでWebページを自動的に集め、その内容（情報）を分析して分類する。

> https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%8D%E3%83%83%E3%83%88%E3%83%9C%E3%83%83%E3%83%88

Anti-Bot Service はアリババグループの各種サービス（淘宝（タオバオ）、 天猫(Tmall)、支付宝(Alipay)など）での経験をベースに作られているとのことなので、実際に中国で`クローラー`や`悪意のあるボットプログラム`からユーザーのサイトやアプリを守るために<span style="color: #ff0000">蓄積されたナレッジや仕組みを利用できるサービス</span>という事になります。


> https://www.alibabacloud.com/products/antibot


# Anti-Bot Service の機能

Anti-Bot Service はAlibaba Cloud あるあるで `Mainland China（中国本土向け）` と `International（中国本土以外向け）` で設定画面や価格が異なっています。     
今回は`International（中国本土以外向け）` の検証を行いましたのでソチラの内容での記事となります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191210171934.png "img")      

以下購入画面のサンプル

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191210172854.png "img")      

サービス購入後に一番最初に行うことはドメインの紐付けです。

<span style="color: #ff0000">⚠️ デフォルトの Anti-Bot Service で保護できるのは1つのTLDと最大9つのサブドメインまたはワイルドカードドメインです。  
それ以上の保護には追加オプションが必要になります。</span>

ちなみに Anti-Bot Service でSSLのオフロードをすることも可能ですし、HTTPで待ち受けることも可能です。  
<span style="color: #ff0000">※SSL証明書は別途用意する必要があります。
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191211225653.png "img")      

CNAME が払い出されますのでドメインを管理する DNS にてCNAME の設定を行います。  
これは特に Alibaba Cloud の DNS サービスである必要はありません。
問題がなければ  `DNS Resolution Status` が `Normal` となっているはずです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191211224839.png "img")      

Anti-Bot Service は機能として大きく分けて `Protection` と `Report` の２種類の機能を提供します。  
今回の記事では `Protection` の基本機能の部分をご紹介いたします。  

## Protection

Protection の機能としては以下の様になっています。  
オプション機能に関してはそれぞれ追加費用が必要になります、詳しくは後ほど説明します。  
<span style="color: #ff0000">※`App Protection` と `Intelligent Algorithm` は今回未検証の機能です、どこかで改めて紹介できればと思います。
</span>

<b>基本機能</b>  

- Blacklist and Whitelist
- Access Control List
- Rate Limiting

<b>オプション機能（本記事では対象外）</b>  

- Bot Intelligence ( Allowed Crawlers / Threat Intelligence )
- App Protection
- Intelligent Algorithm

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191210174029.png "img")      

Anti-Bot は基本的にWebサイトやサービスを守るサービスです、ではどの様に守っているのかと言うとWAFやCDNなどの様にWebサイトやサービスの前に Anti-Bot Service を配置する様なイメージになります。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191210154829.png "img")      

この様な構成なので保護対象となるWebサイトやサービスは <span style="color: #ff0000">Alibaba Cloud 上で公開されている必要性はありません。</span>   
他のクラウドでもオンプレでもオリジンサイトがパブリックに公開されていれば Anti-Bot Service での保護の対象とすることが可能です。

また、Anti-Bot Service と CDN を同時に使用すると言う構成も可能です。

> https://www.alibabacloud.com/cloud-tech/doc-detail/100969.htm

### 基本機能

基本機能の3つはWAFの様な設定をしていく機能になります。

#### Blacklist and Whitelist

下記の様な画面で設定します。  
Blacklist と Whitelist それぞれ最大で200個の<span style="color: #ff0000">IPアドレス又はIPセグメント</span>を指定できます。  
複数指定する場合は`1.2.3.4 , 5.6.7.8/24`の様にカンマ区切りで入力します。  
<span style="color: #ff0000">ドメインでの指定はNGです。</span>  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191211220645.png "img")      


#### Access Control List

Access Control List はルールとマッチしたリクエストの内容に対するアクションを定義します。  

ルールの作り方はシンプルで `Filter Field` と `Filter Pattern` が `Operator ` の条件と一致した場合に `Rule Action` を実行します。

Filter Fieldの項目は以下になります。

- URL
- IP
- Referer
- User-Agent
- Params
- Cookie
- Content-Type
- Content-Length
- X-Forwarded-For
- Post-Body
- Http-Method
- Header

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191211224256.png "img")      

重要な `Rule Action` は以下の4つになります。  

- Block  
- Allow  
- Monitor  
- Slider Captcha  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191211231631.png "img")      

今回は実際に防御系の動作をする `Block` と `Slider Captcha` の動作を少し説明します。

以下の図は `Rule ID 68032` の `/xxxxxxx/index.php/settings` というルールに該当したので `Slider Captcha` が表示されています。  
実際に人が操作する場合はブラウザ上で表示されるスライダーを操作して先に進むことが出来ますが、単純なBotやクローラーの場合は先に進むことが出来ずここでブロックされることになります。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191211223740.png "img")      

以下の図は `Rule ID 68078` の `/xxxxxxx//index.php/apps/calendar` というルールに該当したので `Block` が表示されています。  
今回の場合特定のURLに対してブロック動作を定義したのでブラウザでもブロック画面が表示されていますが、`User-Agent`や`Header`などを上手く使ってブラウザではない場合にブロックするのが実際の利用シーンかと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191211232745.png "img")      



#### Rate Limiting

Rate Limiting は特定のURLへの単位時間あたりのアクセス数などから悪意のあるBotを検出するために使用します。  

Botやクローラーは実際の人間がWebを見る動きとは異なり、高速で何度もアクセスを行うので Rate Limiting を使って人間と異なる動きをするbotを検出するために使用します。

Access Control List との相違点としては `Rule Action` から `Allow` がなくなり `JavaScript Validation` が追加されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191211234358.png "img")      


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191212105543.png "img")      

`Rule ID 1276` のBlockルールに該当した場合、
５秒間に２回、同一のIPから`rate-test`というURLへアクセスした場合に`Block`が適用されます。    
Access Control List の時の`405`とは異なり一時的にアクセス自体が遮断される様な動きになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191212000800.png "img")      

JavaScript Validation はルールに該当した場合、Redirect と認証処理を行うJavaScriptファイルがブラウザ、又はbotに渡されます。  
ブラウザであれば一瞬遷移したなと言うレベルで上記が実施され気づかずに通過できますが、一般的なBotやクローラーは渡されたJavaScriptファイルを処理できずにブロックされると言う仕組みになります。

試しに Chrome のデベロッパーツールなどを起動した状態で`JavaScript Validation`のルールに該当したアクセスを行うと以下の様に謎のJavaScriptが間に差し込まれていることがわかります。  
<span style="color: #ff0000">※ちゃんとデベロッパーツールを閉じると正常にページにアクセスできます。
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191212110036.png "img")      

Curl などでアクセスすると謎の結果が返ってきます。  
botやクローラーの場合はこの様な結果が返ってきて、正常な画面へのアクセスを防ぐ仕組みになっています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613479441800/20191212110735.png "img")      


# おわりに

今回はProtection 基本編ということでココまでの内容になります。  
なかなか判りにくい Anti-Bot Service の理解の一助になれば幸いです。

スライドキャプチャやブロック機能をWebサイトの改修なしに
差し込むことが出来るのが Anti-Bot Service のポイントですね😃


 <CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>



