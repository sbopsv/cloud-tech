---
title: "Synology(NAS)とOSS連携"
metaTitle: "Synology(NAS)のCloudSync機能でAlibaba Cloud OSS連携"
metaDescription: "Synology(NAS)のCloudSync機能でAlibaba Cloud OSS連携"
date: "2020-10-14"
author: "sbc_yoshimura"
thumbnail: "/Storage_images_26006613640530800/20201014120344.png"
---


import CommunityAuthor from '../../src/CommunityAuthor.js';

## Synology(NAS)のCloudSync機能でAlibaba Cloud OSS連携


# はじめに
本記事では、Synologyという台湾メーカーのNASとAlibaba Cloud OSS連携についてをご紹介します。    

特に中国とのファイル共有で良さそうなので、このような構成を作っていきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014120344.png "img")      


#  すごいぞ Synology!

Alibaba Cloud OSSとの連携は SynologyのCloudSyncという機能を使います。

[www.synology.com](https://www.synology.com/ja-jp/knowledgebase/DSM/cloud-tech/CloudSync/cloudsync)
> https://www.synology.com/ja-jp/knowledgebase/DSM/cloud-tech/CloudSync/cloudsync

私が持っているのは家庭用のエントリーモデルなのに、こんなに多くのパブリッククラウドサービスと連携できることに感動します。

家庭用にだけでなく企業ユースでのNASのバックアップ対策でも十分使えそうですね。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014120823.png "img")      

上記URLのCloudSync説明より

CloudSync以外にも様々なパッケージ(アドオン)があって非常に面白いです。

どうでしょうか、どんどんSynologyが欲しくなってきますね。

今回はSynologyでAlibaba Cloud OSSと連携の紹介になりますが、Synology以外にもAlibaba Cloud OSSと連携できるNASやソフトウェアは結構ありますので、是非探してみてください。

-   [Rclone](https://rclone.org/)
    
-   [統合マルチクラウドサービスでハイブリッドクラウドを極める | QNAP](https://www.qnap.com/solution/hybrid-cloud/ja-jp/)
    
-   [Server Manager を使用したデータの ArcGIS Server への登録—ArcGIS Server | ArcGIS Enterprise のドキュメント](https://enterprise.arcgis.com/ja/server/latest/manage-data/windows/registering-your-data-with-arcgis-server-using-manager.htm)
    
-   [Dell EMC PowerScale: CloudPools and Alibaba Cloud](https://www.dellemc.com/resources/en-us/asset/white-papers/products/storage/h17745_isilon_cloudpools_and_alibaba_cloud_wp.pdf)

# Alibaba Cloud OSS の設定

最初にAlibaba Cloud 側の設定をやっていきましょう。

Alibaba Cloud 上海リージョンとAlibaba Cloud 東京リージョンにそれぞれバケットを作ってください。

例えばこのような設定で大丈夫です。 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014124233.png "img")        

それぞれのバケットを作成したら、今回は東京リージョンから上海リージョンにクロスリージョンレプリケーションを行う設定にします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014125527.png "img")     

東京リージョンバケットのメニューから、「冗長性とフォールトトレランス」→「クロスリージョンレプリケーション」→「同期を有効にする」をクリック。

例えば同期方法の設定はこのようになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014140956.png "img")      

設定後、90分ほどで有効化されるようです。

# Alibaba Cloud RAMの設定

次にAlibaba Cloud RAMの設定を行います。

Synology がAlibaba Cloud OSS にアクセスする際に AccessKey が必要になるため、先程作ったバケットのみ操作できる権限のRAMユーザーを作成しましょう。

OSSに関するRAMポリシー作成はこちらのツールを使うと簡単です。

[gosspublic.alicdn.com](http://gosspublic.alicdn.com/ram-policy-editor/english.html)

例えば、yoshimura-synology ディレクトリと yoshimura-synologyディレクトリすべてのファイルを操作できるポリシーはこのようになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014141802.png "img")      

Alibaba Cloud RAMコンソール → 「ポリシー」→「ポリシーの作成」でカスタムポリシーを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014142824.png "img")      

```
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "oss:*"
      ],
      "Resource": [
        "acs:oss:*:*:yoshimura-synology",
        "acs:oss:*:*:yoshimura-synology/*"
      ],
      "Condition": {}
    }
  ]
}
```


Alibaba Cloud RAMコンソール → 「ユーザー」→「ユーザーの作成」でRAMユーザーを作成します。

例えばこのようになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014143158.png "img")      

このようにAccessKeyとSecretが発行されますので、こちらを後ほどSynologyのCloudSync設定で利用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014143627.png "img")     

Alibaba Cloud RAMコンソール → 「ユーザー」→ 今作成したユーザーの権限設定で先程のRAMポリシーを権限付与します。

例えばこのようになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014143846.png "img")       

これでRAMの作業は完了です。

今は東京リージョンバケットのみアクセスできるRAMユーザーなので、同様の手順で上海リージョンバケット用のRAMユーザーも作成しておいてください。

# CloudSyncの設定

ここからはSynology側の設定になります。Synologyの管理コンソールにログインして、パッケージセンターからCloudSyncをインストールします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014144109.png "img")      

CloudSyncを起動して、Alibaba Cloud OSS を選択して、次へ

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014144217.png "img")      

このように先程の作ったAccessKeyとSecret、OSSバケット名を入力します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014144253.png "img")      

例えばこのように設定を行います。

* 接続名：お好きな名前を
* ローカルパス：Synology側のフォルダを指定
* リモートパス：OSS側のディレクトリを指定
* 同期方法：双方向、リモートの変更をローカルに反映させる、ローカルの変更をローカルに反映させるのいずれか
* Partサイズ： マルチパート アップロードのサイズ

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014144444.png "img")      

詳細で同期するフォルダの指定

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014144614.png "img")      

詳細で同期するファイルフォーマットの指定

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014144635.png "img")      

細かい部分まで指定できるのが魅力ですね。

設定はこれだけです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014144708.png "img")      

今回は私の自宅と東京リージョンバケットの同期設定のみ行なっていますが、同様の手順で中国のSynologyと上海リージョンバケットの同期設定も行ってみてください。

最終的に以下のような構成になります。 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014144945.png "img")      

# 動作確認

自宅(ローカル)のSynologyにファイルを保存(アップロード)します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014145145.jpg "img")     

リモート側(Alibaba Cloud OSS東京リージョンバケット)に同期されました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014145214.jpg "img")     

OSS東京リージョンバケットにファイルがアップロードされています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014145309.jpg "img")     

しばらく待つとOSS上海リージョンバケットにファイルがレプリケーションされています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014145350.jpg "img")     

正確な時間は測っていないですが、1GBファイルサイズの同期で、自宅NASからOSS東京リージョンバケットまでが5分くらい、OSS東京リージョンバケットからOSS上海リージョンバケットまでが10分くらいでした。

OSSにファイルをアップロードしたら、ファイル共有だけではなく様々なクラウドの機能と連携ができますね。


# 最後に
本記事では、NASとAlibaba Cloud OSS連携についてをご紹介しました。ご参考に頂ければ幸いです。    



 <CommunityAuthor 
    author="吉村 真輝"
    self_introduction = "Alibaba Cloud プロフェッショナルエンジニア。中国ｘクラウドが得意。趣味は日本語ラップのDJ。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yoshimura_pic.jpeg"
    githubUrl="https://github.com/masaki-coba"
/>




