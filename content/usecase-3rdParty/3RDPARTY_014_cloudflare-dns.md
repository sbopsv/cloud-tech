---
title: "Cloudflareで既存のDNSを使う"
metaTitle: "Cloudflare（クラウドフレア）で既存のDNSを使う方法を紹介するよ❗️"
metaDescription: "Cloudflare（クラウドフレア）で既存のDNSを使う方法を紹介するよ❗️"
date: "2021-03-12"
author: "sbc_y_matsuda"
thumbnail: "/3rdparty_images_26006613695831800/20210303020206.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Cloudflare（クラウドフレア）で既存のDNSを使う方法を紹介するよ❗️

# はじめに


今回はソフトバンク（元SBクラウド）でも取り扱っている Cloudflare（クラウドフレア）に関して、初期設定とDNS周りのお話をちょっとしたいと思います。 


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210310014026.png "img")    


# Cloudflare を利用するには

<span style="color: #d32f2f">Cloudflare を利用するにはドメインが Cloudflare に紐づいている必要があります。  
</span>そのため、よくある手順ではドメインレジストラのネームサーバー（権威DNS）をCloudflareのネームサーバーに切り替える手順が必須とされています。

利用開始手順やFAQに以下の様な記載がありますし、個人でCloudflareを使っていた事もあり、私も最初ネームサーバーの切り替えが必須だと思っていました・・・

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210224163358.png "img")    

出典：[Cloudflareを使い始める：チュートリアル動画 &ndash; Cloudflareヘルプセンター](https://support.cloudflare.com/hc/ja/articles/360037345072-Cloudflare%E3%82%92%E4%BD%BF%E3%81%84%E5%A7%8B%E3%82%81%E3%82%8B-%E3%83%81%E3%83%A5%E3%83%BC%E3%83%88%E3%83%AA%E3%82%A2%E3%83%AB%E5%8B%95%E7%94%BB)



![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210224162818.png "img")    

出典：[Cloudflare DNSに関するFAQ &ndash; Cloudflareヘルプセンター](https://support.cloudflare.com/hc/ja/articles/360017421192-Cloudflare-DNS%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8BFAQ#CloudflareDNSFAQ-IsCloudflareafreeDNSdomainnameserverprovider)

ですが、いろいろ調べてみると`CNAME Setup`という方式で設定する事で、ネームサーバーの切り替えをせずにCloudflareを利用することが可能になりますので紹介していきたいと思います。  

# CNAME Setup ?

`CNAME Setup`は名前の通りCNAMEを使った導入・設定方法になります。  
CloudflareとDNSそれぞれでCNAMEを使ってチェーンする様に設定する事で、既存のDNSを利用したままCloudflareを利用する事が可能になります。 
  
詳細は以下のページをご確認頂ければと思います。

<span style="color: #d32f2f">※Cloudflare 無料プラン、Proプランでは対応していない様です
</span>


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210303020206.png "img")    


出典：[Understanding a CNAME Setup &ndash; Cloudflare Help Center ](https://support.cloudflare.com/hc/en-us/articles/360020348832)





という事で、実際に`CNAME Setup`の手順を設定して試していきます。

# Freenom で検証のドメインを取得します

検証するためにはドメインが必要なのですが、新規で買うのももったいないのでFreenomで検証用のドメインを調達してきます。  
Freenom にアクセスして Register a New Domain からドメインを取得します。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225101128.png "img")    


任意のドメイン名を入力し適当なFreeのドメインを選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225101449.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225101732.png "img")    


購入を進めていき必要なパラメータなどを入力して、最後にPriceが `$0.00USD` であることを確認してComplete Order で購入します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225102238.png "img")    


購入が完了すれば Freenom は一旦置いておきます。  
あとでまた設定が必要なので開いたまま置いておきましょう。


# Cloudflare 

Cloudflare 側の設定に移ります。  
こちら既にアカウントは作成済みの状態になります。

`+サイトを追加する` を選択して設定を開始します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225104605.png "img")    


先程 Freenom で取得したドメインを入力します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225104752.png "img")    


契約済みで Enterprise が選択可能な場合は以下のような画面が表示されます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225105806.png "img")    


無料プランなどをご利用の場合や Enterprise の利用枠が残ってない場合、以下のような画面になるかと思います。  
Business または Enterprise どちらかを選んで`続行`を選択します。  

Enterprise Plan にご興味のある方は弊社までお問い合わせ頂くことも可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210309231818.png "img")    


最初に指定したドメインに対してレコードのチェックが行われます。  
既存のレコードがある場合はここに内容が表示されます。  
`続行`を選択します。 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225110755.png "img")    


今回はドメインを取得しただけで何もレコードが存在しないので以下のようなメッセージが表示されます。  
`確認`を選択します。 


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225110920.png "img")    


こんな感じでネームサーバの変更をする手順が表示されるのが通常です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225111810.png "img")    


<span style="color: #ff0000">ここからが重要です。  
</span>対応しているプランであれば「概要」の右下の方にある「高度な操作」に`CNAME DNS セットアップに変更` という項目があります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225112637.png "img")    



「高度な操作 > CNAME DNS セットアップに変更」を選択します。  
CNAMEでの設定が出来ない場合、Cloudflareサポートに連絡して特定のドメインのCNAMEセットアップの許可をリクエストします。

> Enterprise customers can enable CNAME setups for any of their Business or Enterprise domains by requesting Cloudflare support enable the CNAME setup self-service feature. Once enabled for a Cloudflare account, Enable Partial Setup appears in the Overview app of the Cloudflare Dashboard for Business or Enterprise domains with the account.


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225105901.png "img")    

出典：[Understanding a CNAME Setup &ndash; Cloudflare Help Center ](https://support.cloudflare.com/hc/en-us/articles/360020348832)

権威DNSじゃ無くなるぞ、良いのか？  
と言った内容のメッセージが表示されますが `変更` を選択しましょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225120859.png "img")    


もう一回聞いてきます。`変更` を選択しましょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225121020.png "img")    


CNAME でのセットアップモードに切り替わり検証用のTXTレコードが払い出されます。  
これを既存のDNSに設定してドメインの所有が検証できれば利用可能になります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225121222.png "img")    



レコードの検証が終わるまでは概要ページにこの様に記載されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225123100.png "img")    


# TXT レコードを既存のDNSに設定します。

払い出された検証用のTXTレコードを既存のDNSに登録していきます。  
今回は先ほどドメインを登録した Freenom に設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225162519.png "img")    


`Manage Domain` で対象のドメインの設定を開きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225164700.png "img")    


`Manage Freenom DNS` で対象のDNS設定を開きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210225165908.png "img")    


払い出された検証用のTXTレコードをDNSに登録します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210226095658.png "img")    


登録に成功すれば以下の様な成功のメッセージが表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210226095813.png "img")    


しばらくするとTXTレコードの検証が完了し Cloudflare の概要ページが以下の様に変わります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210226102325.png "img")    


ここまで来れば CNAME でのセットアップの準備は完了です。  

# レコードの検証が終わらない場合
 
もし反映されない場合は Google Admin Toolbox や DNS Checker などでレコードが伝播されているか確認して見るといいです。

伝播されていない様であれば、TTLの見直しやレコードの再設定。  
伝播はされていてレコードが取れている様であれば設定値の確認やブラウザのリロードなどをしてみると良いかと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210226101530.png "img")    


> https://toolbox.googleapps.com/apps/dig/



![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210302091816.png "img")    


> https://dnschecker.org/



# Cloudflare 経由で既存のサイトを公開する

手元に丁度良いものがないので以前 Alibaba Cloud OSS で作った静的ウェブサイトを使います。  


<iframe width="560" height="315" frameborder="0" allowfullscreen="" src="//www.youtube.com/embed/9baf0UmK_0k"></iframe>        <a href="https://youtube.com/watch?v=9baf0UmK_0k">OSS の Image Processing で簡単画像処理</a>



OSSの管理コンソールでカスタムドメインに`www.cf-test.ga`を設定します。  
Cloudflareで設定する予定のサブドメイン部分まで含めて設定します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210302134946.png "img")    


OSS Domain Name をオリジンのCNAMEとして使います。 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210302135056.png "img")    


Cloudflare の管理コンソールに移動し、DNSの設定でレコードを追加します。  
タイプを`CNAME`、名前にサブドメインの`www`、ターゲットに`OSS Domain Name の値`を設定して保存します。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210302121340.png "img")    



次にDNS側の設定を行います。ここが CNAME Setup のポイントの一つになります。  
今回はFreenomの管理コンソールに移動して、こちらにもDNSのレコードを追加します。

<span style="font-size: 150%"><span style="color: #ff5252">Nameにサブドメインの`www`、Typeを`CNAME`、Targetに`FQDN.cdn.cloudflare.net`  を設定して保存します。
</span></span>

今回は `cf-test.ga` というドメインの `www` サブドメインに対して Cloudflare CDN の CNAME に向先を設定します。  
イメージにするとこんな感じかな。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210311200720.png "img")    


詳細はコチラを参照下さい
> https://support.cloudflare.com/hc/en-us/articles/360020348832-Understanding-a-CNAME-Setup#h_836723523521544131668686


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210302121734.png "img")    


DNSレコードが伝播すれば以下の様に正常にアクセスが出来る様になります。  
無事にネームサーバーを変更しなくてもCloudflareをCDNとして利用する事が出来ました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210302135734.png "img")    



# 最後に

今回は Cloudflare という Alibaba Cloud 以外の製品を紹介させて頂きました。  
CNAME Setup の手順はあまり見当たらなかったので参考になる様であれば嬉しいです。

Cloudflare には CDN 以外にも Jamstack をデプロイできる Cloudflare Pages やゼロトラスト系の Cloudflare for Teams など面白いものがあるのでそれらにも順次ふれて行きたいと思います。

<CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>


