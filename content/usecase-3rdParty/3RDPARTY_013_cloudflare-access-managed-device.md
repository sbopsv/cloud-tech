---
title: "Cloudflare Access と WARP で端末制限"
metaTitle: "Cloudflare Access と WARP でゼロトラストアクセスの端末制限が簡単に実現できるよ❗️"
metaDescription: "Cloudflare Access と WARP でゼロトラストアクセスの端末制限が簡単に実現できるよ❗️"
date: "2021-05-13"
author: "sbc_y_matsuda"
thumbnail: "/3rdparty_images_26006613725402600/20210513173946.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Cloudflare Access と WARP でゼロトラストアクセスの端末制限が簡単に実現できるよ❗️

# はじめに

今回も Cloudflare（クラウドフレア）に関する情報を紹介していきたいと思います。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210310014026.png "img")    

　
今回紹介するのは2021年3月頃に Cloudflare Access (Cloudflare for Teams)  に追加されたデバイスのシリアル番号に対する制御ルールです。  
`Device serial numbers` という形で `Device posture` に追加されました。     

セキュリティやコンプライアンスの観点からエンタープライズでの利用には、特定のデバイス以外（例えば個人所有のデバイスなど）からのアクセスを制限する要件が出ることがよくあります。Cloudflare Access (Cloudflare for Teams) では、元々 `Device posture` という部分で他のMDMなどと連携した形での端末制限を実現することが可能でした。     
ただし外部のMDM製品などを利用する前提なので、どうしても設定作業の負荷や既存のMDMの有無、価格面などが課題となることがありました。    

このデバイス制限の課題解決として使えそうなのが、WARPクライアントと併用することで使える<span style="color: #ff0000">「デバイスのシリアル番号」による制御ルール</span>です。    

デバイスのシリアル番号を使った制御が実装されたことで、外部製品に依存することなくデバイスのアクセス制限が実現できるようになったことは Cloudflare Access の利用促進につながるのではないかなと思います。    

イメージはこんな感じですかね。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210513173946.png "img")    


# シリアル番号リストの作成

Cloudflare for Teams のダッシュボード画面から設定をしていきます。     
※Cloudflare for Teams 自体の設定方法は割愛させて頂きます。    

> https://dash.teams.cloudflare.com/


ダッシュボードにログインできたら「Configuration」から `Create manual list` 又は `Upload CSV` を選んでリストを作成します。     
今回は `Create manual list` の手順を紹介します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507163517.png "img")    

`List name` `List types` を入力し、`Add entry` にデバイスのシリアル番号を入力して「Add」を選択します。     

<span style="color: #ff0000">今回のキャプチャでは `List name` を日本語で入力していますが、あとあと動作がおかしくなるので英数字を利用した方が良さそうです。後から 「pc_serial_number」 に変更しました。</span> 

登録するデバイスの数だけ入力を繰り返します。    
<span style="color: #ff0000">※デバイスの数が多い場合は `Upload CSV` がオススメです。
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507165245.png "img")    


なお、登録するシリアル番号はMacなら「このMacについて」で表示されるシリアル番号です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210513104236.png "img")    


Windows の場合は `Get-CIMInstance win32_bios` などのコマンドで取得できる BIOS にあるシリアル番号の様です。     

以下参考     
> https://community.cloudflare.com/t/device-posture-serial-number-list-help/266427


こんな感じで登録対象のシリアル番号が入力できたら「Save」を選択します。     
この状態では保存されていないので「Save」を押し忘れてタブを閉じたりすると全部消えるのでお気をつけ下さい。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507170011.png "img")    


なお、リストタイプは現時点で以下の4つが選択可能です。今回は `Serial numbers` を使っています。    

> - URLs    
> - Hostnames     
> - Serial numbers   
> - User Emails    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507164709.png "img")    



保存するとこんな感じでリストが作成されます。名前やリストの内容は後から編集することも可能です。     
<span style="color: #ff0000">※名前を 「PCシリアル番号リスト」から「pc_serial_number」 に変更しています。
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507221159.png "img")    


「My Team > Device」の「Device Posture」に作成したリストの名前で Serial number の属性が増えているはずです。    
この作成された Device Posture の属性を使って Cloudflare Access のルールを設定します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507221512.png "img")    



# Cloudflare Access のルール設定

「Access > Applications」からデバイスのアクセス制限を設定したいアプリケーションを選択します。    
今回は新規にアプリケーション定義を作る手順は割愛します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507222300.png "img")    


設定対象のルールを選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507222728.png "img")    


画面の下部にスクロールして「Require」のルールを追加します。   
ドロップダウンリストから `Device Posture - Serial Number List` と先ほど作成されたDevice Postureの属性を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507222923.png "img")    


画面上部に戻って `Save rule` を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507223314.png "img")    


まだ油断してはダメで、今度は `Save application` を選択して保存します。
なお、保存する前に Require の設定の数が増えていることを確認しましょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507223515.png "img")    


これで、このアプリケーションに対するデバイスのアクセス制限が設定できました。  
ちなみに Device Posture の設定はアプリケーション単位だけでなく「My Team > Groups」でグループ定義として設定することも可能です。

# アクセス制限を設定したサイトへのアクセス

おもむろに制限を設定したサイトへアクセスすると以下のような画面が出るのではないでしょうか？  
<span style="color: #ff0000">WARPクライアントが起動していない場合</span>や<span style="color: #ff0000">シリアル番号が登録されていないデバイス</span>からのアクセスだとこのような画面が出るように変わりました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210512231815.png "img")    


WARP クライアントを起動してみましょう。以下のように青く「<span style="color: #0000cc">Teams</span>」と表示されていれば Cloudflare for Teams の登録ができている状態です。Teams と連携できていない場合は赤文字の「<span style="color: #ff0000">WARP</span>」が表示されているはずです。

WARPの導入と設定方法は割愛させて頂きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210507224627.png "img")    



WARP クライアントを起動した状態で改めて同じサイトへアクセスすると Cloudflare Access のログイン画面が表示される様になるはずです。  
表示される画面はログインメソッドの設定によって異なります。  
今回は一番基本的な「One-time PIN」という方式です。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210512225510.png "img")    


ちなみに、IdPとの組み合わせも可能なので設定しているとこんな風にすることも可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210512225942.png "img")    


メールアドレスを入力して「Send me a code」を選択するとPINコードが送られてくるのでコードを入力して「Sign in」を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210512230333.png "img")    



すると正常にサイトが表示されます。  
<span style="font-size: 150%">これで、ID（メールアドレス）＋ PINコードの二要素認証と特定デバイスからのアクセス制限を実現することが出来ました。</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210512151056.png "img")    


ちゃんとWARPクライアントが有効化されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210512232117.png "img")    


シリアル番号を登録していない他のPCやモバイルからでは先程の「<span style="color: #ff0000">Forbidden</span>」のページが表示されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210513033709.png "img")    



# 最後に

今回は Cloudflare for Teams を使用して、デバイスのシリアル番号を使用した簡単な端末制限方法を紹介させて頂きました。  

Cloudflare for Teams の情報やシリアル番号を使う情報は、まだあまり見当たらなかったので参考になる様であれば嬉しいです。

特定端末からのみ厳密にアクセス制限を出来る構成を実現することができる様になったのは、エンタープライズ利用における要件では大きなポイントではないかなと思います。


<CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>

