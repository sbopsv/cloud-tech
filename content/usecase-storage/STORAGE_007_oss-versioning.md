---
title: "OSSバージョン管理機能"
metaTitle: "Alibaba Cloud オブジェクトストレージサービス（OSS）にバージョン管理機能が増えました❗️"
metaDescription: "Alibaba Cloud オブジェクトストレージサービス（OSS）にバージョン管理機能が増えました❗️"
date: "2019-12-07"
author: "sbc_y_matsuda"
thumbnail: "/Storage_images_26006613472801500/20191205205341.png"
---


import CommunityAuthor from '../../src/CommunityAuthor.js';

## Alibaba Cloud オブジェクトストレージサービス（OSS）にバージョン管理機能が増えました❗️"

# はじめに


本記事では、Alibaba Cloud の Object Storage Service（OSS）でオブジェクトのバージョン管理機能が実装されましたので、それをご紹介します。    



# バージョン管理機能の概要

バージョン管理機能は同一のKEY（/path/to/ファイル名）を持つオブジェクトを更新する際の動作に影響します。

<span style="color: #ff5252">バージョン管理機能が無効化されている場合</span>、  
オブジェクトの識別は`KEY`のみで行うことになります。  
オブジェクトの更新時には以下の様な形になり<span style="color: #ff0000">元のオブジェクトは無くなります</span>。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191205205341.png "img")    


<span style="color: #0000cc">バージョン管理機能が有効化されている場合</span>、  
オブジェクトに`VERSIONID`が付与され、`VERSIONID`と`KEY`でオブジェクトを識別できる様になります。  
オブジェクトの更新時には、<span style="color: #ff0000">一意な`VERSIONID`が付与された同じ`KEY`のオブジェクト</span>が生成されることになります。  
以下の様な形になり<span style="color: #0000cc">元のオブジェクトは保持されます</span>。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191205211225.png "img")    


機能としては以上の様にシンプルなので実際の設定などを見ていきたいと思います。

# バージョン管理機能の有効化

設定の方法は簡単でバケットの作成時に`Versioning`を有効化すれば利用が可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191129162043.png "img")    


既に作成済みのバケットでバージョン管理機能を使用したい場合、`基本設定`から有効化が可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191129184956.png "img")    



![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191129185228.png "img")    


設定状況はCLIから確認することも可能です。  
`aliyun oss bucket-versioning --method get oss://bucket-name `  
※`-e oss-ap-southeast-3.aliyuncs.com`はOSSのエンドポイントに合わせての指定が必要です。

表示される結果が`bucket versioning status:Enabled`となっていればバージョン管理機能が有効化されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202012423.png "img")    



# 動作検証

とりあえず、適当にテキストファイルを作成してOSSにアップロードしてみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191129191045.png "img")    


バージョン管理を有効化バケットのファイル一覧に見慣れぬ表示が増えています。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191129191415.png "img")    


`オブジェクトの履歴バージョンを表示する`のチェックを入れると少し画面の表示が変わります。  
`(Latest Version)` という表示が見えると思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191129191822.png "img")    


テキストの内容を`Ver.2`に変えてファイルをアップロードしてみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191129192120.png "img")    


想定どおり複数バージョンの`バージョニングテスト.txt`が存在しています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191129192411.png "img")    


CLIでも確認してみたいと思います。  
`aliyun oss ls oss://bucket-name --all-versions`  

GUIの画面と同様に２つのオブジェクトが表示されます。  
`VERSIONID`がオブジェクトを一意に識別するためのIDです。  
`IS-LATEST`が`true`なのがカレントバージョンのファイルになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202013411.png "img")    


この状態でCLIからカレントバージョンのファイルを`cat`してみます。  
`aliyun oss cat oss://bucket-name/object `  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202014254.png "img")    


結果は`Ver.2`と後からアップロードしたオブジェクトの内容が表示されます。

では、次に最初にアップロードされた方のオブジェクトを指定して`cat`してみます。   
カレント以外のオブジェクトの指定には`--version-id`のオプションを使用します。

`aliyun oss cat oss://bucket-name/object --version-id VERSIONID`

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202014742.png "img")    


想定通り`Ver.1`と表示され複数のバージョンのオブジェクトを保持していることが確認できました。

一応、前のバージョンのファイルをダウンロードしてみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191129193110.png "img")    


ファイルを開くと、ちゃんと`Ver.1`と書かれたファイルが取得できました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191129193452.png "img")    


ちなみに、注意点ですがこの状態はOSS的には以下のように認識されています。  
<span style="color: #ff0000">複数バージョン保持すると言うことはその分のリソースを使用します。料金的にも複数バージョン保存分の料金が掛かります。  </span>  
<b>バケット単位</b>での設定になるので有効化の必要性の検討やバケット設計は確りと行ってご利用ください。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202015454.png "img")    


# バージョン管理機能の停止

バージョン管理を有効化した後に、本機能を無効化することが出来ません。  
`一時停止`でそれ以降の新しいバージョンの作成を止めることは可能です。  
ただし、既存オブジェクトのバージョンは一時停止後も保持されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202141518.png "img")    



実際に停止してみると以下のようになります。  
CLIの結果としては`bucket versioning status:Suspended`が帰ってきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202152516.png "img")    


この状態で`Ver.3`にしたファイルをアップロードしてみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202152732.png "img")    


既存オブジェクトのバージョンは保持されるので３つのオブジェクトが表示されますが、最新のオブジェクトには`VERSIONID`が付与されていません。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202153047.png "img")    


カレントのファイルyの内容を確認すると`Ver.3`が表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202153326.png "img")    


この状態で、`Ver.4`に更新したファイルを再度アップロードすると・・・

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202153448.png "img")    


4つ目のオブジェクトは作成されず、`Latest Version`が上書きされました。  
※バージョン管理機能を有効化する前と同じ動きになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202153838.png "img")    


試しに、カレントファイルの内容を確認すると`Ver.4`が表示されているので新しいオブジェクトに上書きされていることが確認できます。

なお、一時停止状態でも保存済みの過去バージョンのオブジェクトは正常に取得できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191202154325.png "img")    


# 最後に

本記事では、OSSのバージョン管理機能を軽くご紹介しました。皆様もOSSを利用する際はご参考に頂ければ幸いです。

 <CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>



