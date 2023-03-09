---
title: "複数人でNextcloud"
metaTitle: "NextcloudをAlibaba Cloud上で利用する(複数人利用)"
metaDescription: "NextcloudをAlibaba Cloud上で利用する(複数人利用)"
date: "2020-06-30"
author: "SBC engineer blog"
thumbnail: "/3rdParty_images_26006613586559700/20200625102446.png"
---

## 複数人でNextcloud

本記事ではオンラインストレージであるNextcloudを複数人で利用する際の使用感をご紹介します。     
     
## Active Directoryとの連携
Active Directoryと連携することで、ドメインユーザのユーザ名/パスワードでNextcloudにログインすることが可能になります。     
ユーザ名/パスワードを統一できるため、管理がとても楽になります      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200625102446.png "img")     

IPsecVPNや専用線で環境をつなぐことで、オンプレミスや他クラウドにあるActive Dierctoyとの連携することが可能です。     
Active Directoryで社員管理をしている企業であればNextcloudのユーザ作成をすることなくActive Directoryの情報を連携できるので便利な機能です      

連携方法については、以下のサイトをご参照ください。     

> ttps://nextcloud.stylez.co.jp/techblog/nextcloud_activedirectory_password_change.html


また、NextcloudはSAML、OpenID Connect、OAuthを利用したSSOに対応しています。     
アプリを有効化させることでSAMLを利用した認証を導入できます。     
OpedID Connectなどの他の認証方法に関してもアプリを使用することで導入ができます。     

> https://apps.nextcloud.com/apps/user_saml


## 二要素認証
次に、二要素認証の導入をしてセキュリティを強化します。     
Nextcloudの二要素認証はとても簡単に導入が可能で、特定のグループのみ二要素認証を強制/除外することもできます。     
それではさっそく二要素認証を導入していきましょう      

### 二要素認証の導入
二要素認証を有効化させられるのは管理者ユーザのみです。     
管理者ユーザでNextcloudにログインし、右上のユーザアイコンからアプリを選択します。     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200623/20200623135116.jpg "img")     
     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200623/20200623135149.jpg "img")     
これで、全ユーザが各自二要素認証を設定することができるようになりました。     
さらに、管理者ユーザは他のユーザに対して二要素認証の使用を強制させることが可能です。     
管理者ユーザの設定メニューからセキュリティに関する設定を行います。     

![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200625/20200625162851.png "img")     

     
下図の"二要素認証を強制する"にチェックを入れると、他のユーザに二要素認証を強制させることができます。     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200623/20200623140828.jpg "img")     

     
次に、"次のグループに制限"という項目を入力していきます。"適用されたグループ"と、"除外されたグループ"の２つの項目がありますが、     
"適用されたグループ"にグループを記載すると、そのグループの所属ユーザのみに二要素認証が強制され、その他のユーザには強制されません。     
     
一方、"除外されたグループ"にグループを記載すると、そのグループの所属ユーザ以外全てのユーザに二要素認証が強制されます。     
なお、"適用されたグループ"と"除外されたグループ"どちらにも記載のあったグループは、二要素認証を強制されます。     
     

二要素認証を強制されたグループと強制されていないユーザのログイン方法の違いのイメージは下図です。     
二要素認証を強制されるとログイン画面でユーザ名とパスワードを入力した後、     
外部の認証アプリを使用した認証コードを入力しないとログインができません     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200630104444.png "img")     

### ユーザからの見え方
二要素認証を強制されたグループ、されなかったグループのログインはどのように行うかについてご説明します。     
二要素認証を強制されたユーザでログインを試みると、ユーザ名とパスワードを入力した後に二要素認証の設定を求められました。     
スマートフォンにTOTP認証アプリ(今回はGoogle Authenticator)をインストールし、表示されたQRコードを読み取ります。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200623142110.png "img")     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200623142115.png "img")

"TOTPアプリで認証する" を選択し、Authenticatorに表示されている数字を入力したら、ログインができました。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200623142121.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200623142132.png "img")     

ログインした後、セキュリティの設定を確認するとTOTPの無効化をすることが出来そうですが、     
二要素認証を強制されているため次回ログイン時に再び二要素認証の設定を求められます。     
     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200625/20200625172120.jpg "img")     
     
二要素認証を強制されていないユーザは、ユーザ名とパスワードでログイン可能ですが、     
管理者ユーザにて二要素認証が有効化されているため、セキュリティ設定画面から自主的に二要素認証の設定を行うことができます。     
     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200625/20200625172221.jpg "img")     
     

二要素認証を導入して、セキュリティ強化したところで次はオンラインストレージの醍醐味 <b>共有機能</b>についてご紹介します。

## 共有機能
続いて、共有機能についてご紹介していきたいと思います。     
Nextcloudにアップロードしたファイルやフォルダは、共有方法を指定して共有することが可能です。     

![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200623/20200623171946.png "img")    
 
Nextcloudには大きく分けて２つの共有方法があります。     
     
<b>①Nextcloudユーザへの共有</b>     

Nextcloudユーザへ共有を行う方法です。     
共有されたNextcloudユーザは、自身のNextcloudアカウントから共有されたデータを参照することが可能です。     

     
<b>②非Nextcloudユーザへの共有</b>     

Nextcloudのアカウントを持っていない非Nextcloudユーザへの共有をURLを用いて行う方法です。     
共有された非Nextcloudユーザは、共有されたURLを使用してデータを参照することが可能です。     
     
以下の表のように、２つの共有方法には機能の違いがあるため共有するデータや共有相手に応じて共有方法を変えると良いでしょう。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200630151810.png "img")     

より詳しい解説については、この記事を参考に頂ければ幸いです。    

> https://nextcloud.stylez.co.jp/blog/nextcloud-url-fileshare.html

### Nextcloudユーザへの共有
まずは、Nextcloudユーザへのファイルやフォルダの共有についてご紹介します。     
Nextclodユーザへの共有は、下図の共有メニュー内、テキストボックスから行います。     
     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200623/20200623172313.jpg "img")    

このボックスにユーザ名またはグループ名を入力することで、指定したユーザに共有することができます。     
共有されると、共有したユーザまたはグループ名が表示され、操作の許可設定が可能です。     
     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200623/20200623174544.jpg "img")    

共有されたユーザには下図のように共有フォルダが表示され、通常のフォルダと同様にアクセスが可能です。     
共有した際に有効期限が設定されていた場合、有効期限をすぎると共有が解除されます。     
     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200623/20200623175222.png "img")    
     

また、既に共有されているユーザに対してファイルやフォルダのURLを発行することが可能です。     
"内部リンク"をクリックするとURLが発行され、事前に共有されているユーザはURLから直接アクセスが可能であり、     
万が一URLをアクセス権のないユーザに知られてしまったとしても、事前に共有されていなければアクセスすることはできません。     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200625/20200625153302.jpg "img")    
     
     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200625/20200625154304.jpg "img")    
     
     
![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200625/20200625154319.jpg "img")    

細かく共有相手によって操作の制限をかけることができるので便利です。      

### 非Nextcloudユーザへの共有
次に、非Nextcloudユーザへのファイルやフォルダの共有についてご紹介します。     
非Nextcloudのユーザへの共有は、下図の共有メニュー内、"URLで共有"から行います。     
＋マークをクリックすると、選択しているファイルまたはフォルダのURLが発行されます。

![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200624/20200624101450.jpg "img")    

その後、操作の許可設定を行います。     

![img](https://cdn-ak.f.st-hatena.com/images/fotolife/s/sbc_na234/20200624/20200624102036.jpg "img")    

Nextcloudユーザへの共有と同様に操作を制限することが可能であることに加えて、
"ダウンロードを隠す"という項目にチェックを入れると、ダウンロードを制限することも可能です。     
     
この"ダウンロードを隠す"という設定をすることで、社外の人に対しリードオンリーでデータを共有することが可能です。     
Nextcloudのアカウントを持っている人宛てであってもリードオンリーで共有したいデータであればこちらのURLでの共有をすれば安心ですね      
     
下図は発行されたURLでブラウザからアクセスした際の表示です。ちゃんと設定した制限が反映されています。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200624103121.jpg "img")     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200624103100.jpg "img")     

## 編集機能
編集機能についてご紹介します。     

### Nextcloudの編集機能
Nextcloudは様々なファイルタイプに対応しており、オンラインで編集することが可能です。     
ExcelやPowerpoint、Wordファイルなど一部のファイルは編集ができず、ダウンロードのみとなっています。     
また、共有機能によって共有されたユーザ同士で共同編集が可能であり、変更は即時に反映されます。     
下図は、例としてマークダウンファイルを2人で共同編集している様子を示しています。     
例としてですが、Suzukiさんが書き足した項目もすぐにTanakaさんの編集画面に反映されます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200626101906.jpg "img")     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200626102216.jpg "img")     


### ONLYOFFICEを使った編集機能
ONLYOFFICEを使った編集についてご紹介します。     
共有機能によってNextcloudユーザに共有されたファイルは、ONLYOFFICEで編集できるものであれば     
ONLYOFFICEの機能を使用して<b>共同編集</b>を行うことが可能です。     
     
Nextcloudのみの機能ではオンライン編集ができずダウンロードのみとなっていた     
ExcelやPowerpoint、Wordファイルなどもオンラインで編集が可能になります。     
注：NextcloudでONLYOFFICEの機能を使うには、ONLYOFFICEとの連携を行う必要があります。     

同時に複数人がファイルを編集していると、下図のように右上に現在編集中のユーザが表示されます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200625110237.png "img")      
     
前のブログでご紹介した通り、ONLYOFFICEはMicrosoftOfficeとの高い互換性があるのですが、     
ONLYOFFICEには、MicrosoftOfficeにはない<b>チャット機能</b>があります     
     
チャット機能を使うと、同時に編集しているユーザ同士でチャットをすることが可能です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200625110908.png "img")      
コメント機能もあるのですが、コメント機能とチャット機能を使い分けることでよりスピーディなコミュニケーションが可能になるのではないでしょうか      

## 最後に
本記事では、Nextcloudを複数人で使用する際の使用感についてご紹介しました。     
Nextcloudのみでも十分便利なオンラインストレージサービスですが、Active Directoryとの連携やONLYOFFICEとの連携でより便利に、快適に利用できることがお分りいただけたかと思います      
是非、Alibaba Cloudを使ってNextcloudを含む<b>OFFICE IT</b>についてご検討いただけますと幸いです。     


