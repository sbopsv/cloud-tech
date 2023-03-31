---
title: "OSS Transfer Acceleration"
metaTitle: "OSSブラウザで OSS Transfer Acceleration を利用する方法"
metaDescription: "OSSブラウザで OSS Transfer Acceleration を利用する方法"
date: "2020-11-25"
author: "sbc_yoshimura"
thumbnail: "/Storage_images_26006613656822400/20201125165504.png"
---


import CommunityAuthor from '../../src/CommunityAuthor.js';

## OSSブラウザで OSS Transfer Acceleration を利用する方法


# はじめに


本記事では、Alibaba Cloud の OSS Transfer Accelerationの機能を、OSSブラウザから利用する方法をご紹介します。    


# OSS Transfer Accelerationとは

簡単に説明すると、OSSバケットへのアップロードやダウンロードを高速化する機能です。

有効化すると高速化するためのエンドポイントが作成されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613656822400/20201125165504.png "img")    


# OSSブラウザでのインストール方法

Mac,Windows,Linux に対応しています。

Alibaba Cloud 公式ドキュメント

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/61872.htm

GitHubプロジェクト

[github.com](https://github.com/aliyun/oss-browser/tree/master)
> https://github.com/aliyun/oss-browser/tree/master

GitHubから最新版をダウンロード可能です。

2020/11/25時点では最新バージョン v1.13.0になります。

# OSSブラウザでの利用方法

「OSSブラウザでのTransfer Acceleration の使い方が分からない」

「Transfer Acceleration有効化したら自動的に利用できると思ってた」

という声を頂戴したので使い方をご紹介します。

Alibaba Cloud ドキュメントやOSSブラウザのGithubにも書いていないので、使い方を調べるのに苦労します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613656822400/20201125165811.png "img")    


設定方法はこんな感じです。

こちらの例では、バケット名 yoshimuara-synology-cn での設定例になります。

よくある間違いは、Endpointをデフォルト(パブリッククラウド) に設定してしまうことです。Endpointをカスタムに変更するように注意しましょう。

OSSブラウザに限らず、ossutilのようなCLIでも、Alibaba Cloud コンソール上からのファイルアップロードでも、Transfer Accelerationを利用する際には明示的にエンドポイントをoss-accelerate.aliyuncs.comに指定する必要があります。

また、OSSブラウザ で Transfer Acceleration を利用する際に悩ましい点は、プリセットOSSパスで対象バケット1つを指定してOSSブラウザにAKログインする点です。

OSSの通常エンドポイントの場合には、プリセットOSSパスは空白でOKで、ログイン後に別バケットに移動ができますが、Transfer Accelerationの場合にはそのような移動ができません。

# 最後に

Alibaba Cloud の OSS Transfer Accelerationの機能を、OSSブラウザから利用する方法をご紹介しました。ご参考に頂ければ幸いです。       


 <CommunityAuthor 
    author="吉村 真輝"
    self_introduction = "Alibaba Cloud プロフェッショナルエンジニア。中国ｘクラウドが得意。趣味は日本語ラップのDJ。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yoshimura_pic.jpeg"
    githubUrl="https://github.com/masaki-coba"
/>



