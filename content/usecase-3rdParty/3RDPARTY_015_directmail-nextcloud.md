---
title: "Nextcloud からメールを送信する"
metaTitle: "Alibaba Cloud DirectMail を使って Nextcloud からメールを送信してみる"
metaDescription: "Alibaba Cloud DirectMail を使って Nextcloud からメールを送信してみる"
date: "2020-08-06"
author: "sbc_y_matsuda"
thumbnail: "/3rdparty_images_26006613610400600/0000001.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Alibaba Cloud DirectMail を使って Nextcloud からメールを送信してみる

# はじめに
今回はAlibaba Cloud DirectMail を使って Nextcloud からのメール送信ができるか実験してみました😁    

以下の Nextcloud のメールサーバー設定に DirectMail 向けの設定をしてメールが送信できるのかを確認してみます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613610400600/0000001.png "img")    


# 概要

今回の環境構成はこちら 東京リージョンの ECS からシンガポールリージョンの DirectMail を使用して、Nextcloud からメールを送ってみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613610400600/0000002.png "img")    


# DirectMail SMTP設定

「Sender Addresses」で作成した送信用アドレスにSMTPパスワードを設定します。

`Set SMTP password`を選択します。  
システムからのメール送信（登録通知、トランザクション通知、パスワードの取得、システムアラーム、その他のシステム通知など）にはTypeが`Triggered Emails`の送信元アドレスが必要になります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613610400600/0000003.png "img")    


SMTPパスワードを設定します。   
要件は以下になっています。    

```
1) The password is composed of 10 to 20 characters which must include digits and case-sensitive letters.
2) There must be at least two digits, two upper-case letters and two lower-case letters which cannot be repeating characters.
3) The password cannot be the same as the previous password.
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613610400600/0000004.png "img")    


# Nextcloud のメールサーバー設定

Nextcloud の管理コンソールからメールサーバー設定を行います。  
各項目に関して`DirectMail`向けのパラメーターを入力していきます。

「送信モード」はSMTPで「暗号化」は`STARTTS`又は`SSL/TLS`を選択します。  
ここで注意が必要なのは**暗号化の選択と Port の組み合わせです。**  
DirectMail が待ち受ける`STARTTS`の接続ポートが何故か`25` 又は `80` なのでお気を付けください。


|暗号化|ポート|
|---|---|
|STARTTLS|25 , 80|
|SSL/TLS|465|


送信元アドレス、資格情報は DirectMail のコンソールで設定した内容を設定します。  
※資格情報の**ユーザー名は送信元アドレスになります。**

サーバーアドレスには DirectMail のサービスアドレス（エンドポイント）を入力します。  
Alibaba Cloud DirectMail の提供するサービスアドレスは以下です。

|Service Region|SMTP Service Address|
|---|---|
|China East 1|smtpdm.aliyun.com|
|Singapore|smtpdm-ap-southeast-1.aliyun.com|
|Sydney|smtpdm-ap-southeast-2.aliyun.com|


> https://www.alibabacloud.com/cloud-tech/doc-detail/29449.html

**STARTTLSの場合**      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613610400600/0000005.png "img")    


**SSL/TLSの場合**      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613610400600/0000006.png "img")    


設定が完了したら`メールを送信`を選択します。  
エラーが発生しなければ無事にメールが送れるようになります。

# 送信されたメールの確認

メールを確認すると以下の様なメールが無事に届いていると思います。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613610400600/0000007.png "img")    

SMTPで送ったメールの成否や宛先は DirectMail のコンソールから確認できます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613610400600/0000008.png "img")    

オープンソースの製品から DirectMail を介してメールを送ってみました。  
無料枠もあって簡単に利用できますので是非使ってみてください！    


# 最後に

上記、Alibaba Cloud DirectMail を使って Nextcloud からメールを送信する方法をご紹介しました。ご参考に頂ければ幸いです。     


<CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>


