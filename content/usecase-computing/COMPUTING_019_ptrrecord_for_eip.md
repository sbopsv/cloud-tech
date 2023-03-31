---
title: "EIP に逆引きDNSを設定する方法"
metaTitle: "Alibaba Cloud の EIP にPTRレコード(逆引きDNS)を設定する方法"
metaDescription: "Alibaba Cloud の EIP にPTRレコード(逆引きDNS)を設定する方法"
date: "2020-12-03"
author: "sbc_yoshimura"
thumbnail: "/computing_images_26006613659667500/20210106190229.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## Alibaba Cloud の EIP にPTRレコード(逆引きDNS)を設定する方法

# はじめに

本記事では、Alibaba Cloud の EIP にPTRレコード(逆引きDNS)を設定する方法をご紹介します。    

# PTRレコードの取り扱い

Alibaba Cloud って逆引きDNS設定できるの？と質問があったので調べてみました。

EIPのドキュメントには特に記載がなかったのですが、ECSのFAQに回答がありました。

**How do I request reverse lookup for an ECS instance?**

> Reverse lookup is used in mail services to reject all mails from IP addresses mapped to unregistered domain names. Most spammers use dynamic IP addresses or IP addresses mapped to unregistered domain names to send unwanted emails and avoid being tracked. When reverse lookup is enabled on a mail server, the server rejects mails sent from dynamic IP addresses or unregistered domain names to reduce the amount of spam received.
> 
> You can [submit a ticket](https://workorder-intl.console.aliyun.com/?spm=a2c63.p38356.879954.40.55687081E6J9YH#/ticket/createIndex) to request reverse lookup for your ECS instance. We recommend that you specify the region, public IP address, and registered domain name of your ECS instance in the ticket for more efficient ticket processing.

 **Can an IP address point to multiple reverse lookup domain names?**

> No, each IP address can only point to a single reverse lookup domain name. For example, you cannot configure the IP address 121.196.255.\*\* to resolve to multiple domain names such as mail.abc.com, mail.ospf.com, and mail.zebra.com.

[www.alibabacloud.com](https://www.alibabacloud.com/cloud-tech/doc-detail/40637.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/40637.htm

どうやら、サポートチケットから申請すれば設定をしてくれるらしいです。1つのIPアドレスに対して、1つのドメインのみ設定できます。

一方で、Alibaba Cloud DNSのPrivate Zoneでは、プライベートIPアドレスに対するPTRレコードをコンソールから設定できます。

[www.alibabacloud.com](https://www.alibabacloud.com/cloud-tech/doc-detail/64638.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/64638.htm

パブリックIP または EIPはサポートチケットから設定を依頼する。

プライベートIPはPrivateZoneで自分で設定する。

と覚えておきましょう。

# サポートに依頼する

実際に試してみたので紹介します。

EIP : BGP (Multi-ISP) Pro in Hong Kong  (従量課金でどのインスタンスにもバインドしてない状態)

ドメイン : yoshimura.work  (お名前.comで取ったドメイン)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613659667500/20201202220845.png "img")    


文字が小さくて読めないと思いますが、やり取りはとてもシンプルです。

「このEIPに対して、このホスト名でPTRレコード設定して」という内容でサポートに依頼したら、数時間で設定が完了してました。

対応が非常に早いですね。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613659667500/20210106190229.png "img")    


次に気になったのは、PTRレコードが消えるタイミングです。

EIPをリリースした場合、勝手に消えるのでしょうか？

やってみました。

対象EIPをリリースして、しばらく待ちます。(TTL 7200 になってたので２時間かな)

・・・

・・・

・・・

２時間後

PTRレコード消えてませんでした。

とりあえず放置します。

・・・

・・・

・・・

1週間後

まだPTRレコード消えてませんでした😂

これは永遠に消えないやつだなと思ったので、再度サポートチケットを開いて、対象EIPをリリースしたからPTRレコードを削除してと依頼しました。

そして、数十分後にはPTRレコードは消えていました。

サポートにEIPがリリースされたら自動的にPTRレコードも削除されないの？と聞いてみたところ、自動的には削除されないとの回答でした。

今後EIPを取得した際に、前回のEIP利用者がPTRレコードを設定していないか確認したくなりますね。

今回は以上です。

# 最後に
Alibaba Cloud の EIP にPTRレコード(逆引きDNS)を設定する方法をご紹介しました。ご参考に頂ければ幸いです。    



<CommunityAuthor 
    author="吉村 真輝"
    self_introduction = "Alibaba Cloud プロフェッショナルエンジニア。中国ｘクラウドが得意。趣味は日本語ラップのDJ。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yoshimura_pic.jpeg"
    githubUrl="https://github.com/masaki-coba"
/>



