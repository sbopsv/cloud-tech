---
title: "ECS で CentOS 8.0が登場"
metaTitle: "Alibaba Cloud ECS で CentOS 8.0 が使えるようになりました❗️"
metaDescription: "Alibaba Cloud ECS で CentOS 8.0 が使えるようになりました❗️"
date: "2020-01-08"
author: "sbc_y_matsuda"
thumbnail: "/computing_images_26006613494549400/20200107221928.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Alibaba Cloud ECS で CentOS 8.0 が使えるようになりました❗️

# はじめに

皆さんお待ちかねの <b>CentOS 8.0 が Alibaba Cloud ECS でも提供が開始されました。</b>

<span style="font-size: 400%">🎉</span>

今回はパブリックイメージのアップデートなので<b>日本サイト、国際サイト共にすでに利用可能になっています</b> 😀

また、CentOS以外のOSイメージもいくつか更新されているので合わせてご紹介させて頂きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107221928.png "img")    





# CentOS 8.0 の選択

ECSのインスタンス作成画面からOSイメージを選択できるようになっていますので、日本サイト、国際サイトそれぞれの画面を確認してみたいと思います。  
なお、<span style="color: #ff0000"><b>東京リージョンを含む全てのリージョンで利用可能</b></span>です。

## 日本サイトの画面

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107211258.png "img")    


# 国際サイトの画面

ちなみに国際サイトのECSのインスタンス作成の画面デザインが少ーし変わっています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107211050.png "img")    


# CentOS 8.0 へのアクセス

細かい手順は割愛しますが、CentOS 8.0 のイメージを指定して作成したインスタンスがコチラです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107213310.png "img")    


ターミナルからアクセスします。  
今回は踏み台なしで直接アクセスします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107213822.png "img")    


ECS にログイン出来たのでOSの情報をみてみたいと思います。  
`uname -a` `cat /etc/redhat-release` `rpm --query centos-release` `hostnamectl` `dmidecode | grep "Product Name"` などのコマンドで確認してみます。  
無事に`CentOS Linux 8` とか `Alibaba Cloud ECS` と表示されているのが確認出来ました😀

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107214257.png "img")    


# CentOS 以外の追加された OS イメージ

CentOS 以外の追加されたOSイメージは以下です。

# Debian

* Debian 9.11  
* Debian 10.2

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107215026.png "img")    



![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107223007.png "img")    



# CoreOS

* CoreOS 2303

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107215235.png "img")    



# OpenSUSE

* Opensuse 15.1

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107215444.png "img")    


# おまけ

恒例のタイムゾーンはどうなっているかなーと見てみました❗️  

結果は・・・

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107220013.png "img")    


安定のCST（中国標準時）でしたー😂

# おまけその２（ウェブコンソール）

CentOS 8.0 や RHEL8 ではデフォルトでウェブコンソール機能が付いています。  
Alibaba Cloud ECS でも使えるのか試してみたいと思います。 


OSにログインした時に `Active the Web console with: systemctl enable --now cockpit.socket` というメッセージが出ていたと思います。  
cockpit サービスの自動起動の有効化とサービス起動してねって内容ですね。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200107213822.png "img")    


この `cockpit` というのが ウェブコンソールのサービスになります。  
詳しくは Cockpit の Project ページをご確認ください。

> https://cockpit-project.org/

 
一応 `dnf list installed | grep cockpit` で  Cockpit関連パッケージの確認を行います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108013141.png "img")    


結果を見るとインストール済みのようです。  
cockpit のプロセスは止まっているので`systemctl start cockpit` で起動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108014147.png "img")    


Cockpitへの接続はTCPの9090ポートを使用します、一応確認してみましょう。  
`ss -tlnp` で 9090 ポートをLISTENしていることが確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108014912.png "img")    


TCPの9090ポートを使用するので、Cockpit用のセキュリティグループを設定します。  
インスタンスへのセキュリティグループの割り当ても忘れないようにしましょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108013649.png "img")    


セキュリティグループの設定が出来たらブラウザからアクセスします。  
URLは `https://IP-Address:9090` のような形式です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108015523.png "img")    


現状では自己証明書なので「この接続ではプライバシーが保護されません」エラーが表示されますが、今回は一旦このまま進みます。  
本番利用などではちゃんと設定しましょう。

「詳細設定」をクリックすると表示される`"IPアドレス"にアクセスする（安全ではありません）`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108015950.png "img")    


こんな感じで WebConsole が表示されますが、OSユーザーのIDとパスワードが必要です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108020424.png "img")    


`useradd` と `passwd` でログオン用のユーザーIDとパスワードを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108021602.png "img")    


作成したユーザー名とパスワードを入力して`ログイン`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108021754.png "img")    


無事にログインできると以下のような画面が表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108022057.png "img")    


cockpit の ターミナルも問題なく利用できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108022236.png "img")    


ちなみに設定完了後にOSにログインするとメッセージが変わっています。   
`Web console: https://centos8:9090/ or https://10.10.0.154:9090/`  
ホスト名かプライベートIPでアクセスしてねと出ていますねー  
<span style="color: #ff0000">※ECSに付いているパブリックIPはOSから認識できていないので表示されません
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613494549400/20200108112224.png "img")    


# 最後に

なんだかおまけの方が長くなってしまいましたが、今回は ECS で利用可能な OS イメージの追加情報をお知らせさせて頂きました。  
CentOS 8.0 のイメージを待っていた方も多いと思いますのでぜひ使ってみて下さいね。


<CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>


