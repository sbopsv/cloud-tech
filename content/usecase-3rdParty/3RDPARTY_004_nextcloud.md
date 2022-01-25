---
title: "初めてのNextcloud"
metaTitle: "NextcloudをAlibaba Cloud上で利用する"
metaDescription: "NextcloudをAlibaba Cloud上で利用する"
date: "2020-06-25"
author: "SBC engineer blog"
thumbnail: "/3rdParty_images_26006613585743300/20200616101517.png"
---

## NextcloudをAlibaba Cloud上で利用する

本記事では、オンラインストレージサービスの<b>NextcloudをAlibaba Cloud上で利用する方法</b>をご紹介します。

      

## Nextcloudとは
ご存知の方も多いかと思いますが、Nextcloudは<b>オンラインストレージサービスを提供するソフトウェア</b>です。     
組織内でのファイル共有が容易にできるツールであり、数多くのプラグインが用意されているため様々な機能を追加することが可能です。     
     
## Alibaba Cloud構成
今回は、ECSにNextcloudをインストールし、外部ストレージにAlibaba Cloud OSSを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200616101517.png "img")      
     
## ECSにNextcloudをインストール
Nextcloudの推奨OSはLinux(RedHat系、Debian系)のため、ECSはCentOSまたはUbuntuを使用します。     
インストール手順については公式ドキュメントを参考にインストールください。     
また、インストール手順の中で作成するデータフォルダをAlibaba Cloud NASにマウントしたディレクトリ内に作成することで、     
使用容量を気にすることなく快適にNextcloudを使用できます      

CentOS8インストール手順
> https://docs.nextcloud.com/server/18/admin_manual/installation/example_centos.html

Ubuntu18.04LTSインストール手順
> https://docs.nextcloud.com/server/18/admin_manual/installation/example_ubuntu.html

Nextcloudシステム要件
> https://nextcloud.stylez.co.jp/requirements

コマンドラインからNextcloudとミドルウェアをインストールしたら、Nextcloud ECSへブラウザからHTTPアクセスします。     
管理者アカウントの作成、DB情報を入力をしてセットアップは完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200616104320.png "img")      


次に、外部ストレージを設定していきます。     
     
## 外部ストレージにOSSを設定
外部ストレージとして使用できるのは以下の6種類です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200616105506.png "img")      
Alibaba Cloud OSSの設定インターフェースはないのですが、AWSのS3用インターフェースを使用して設定することが可能です。     
以下の図のように、外部ストレージにAWS S3を選択し必要な項目を記載します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200622162634.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200622162644.png "img")      

【記載項目】     
フォルダ名：表示名(任意)     
外部ストレージ：S3(OSSを使用する場合はS3を選択)     
認証：アクセスキー(S3のインターフェースを使用する場合の認証はアクセスキーのみ)     
設定：バケット名(OSSバケット名)、ホスト名(OSSエンドポイント)、ポート(SSLを使用するため443)、     
リージョン(OSSのリージョンID)、アクセスキー、アクセスキーシークレット     
利用可能：外部ストレージを利用可能なユーザ/グループ     
     

Nextcloudの通常のストレージと外部ストレージの関係は以下の図のようにイメージしていただければ良いと思います。     
このように、グループごとにOSS バケットを作成し、グループの共有ストレージとして設定して使用するなどの使い方ができます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200623111734.png "img")     
各ユーザからの見え方は以下のようになっています。     
自身がアクセス権限を持っている外部ストレージについては、通常フォルダと同様にアクセスすることができます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200623111852.jpg "img")     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200623111910.jpg "img")     


OSSは料金が安いので、うまく活用することで安価にNextcloudを快適に利用できるのではないでしょうか。     
     
## その他便利機能
### ONLYOFFICEを使ったOfficeファイル編集
Nextcloudの機能でファイルを共有することが可能ですが、ONLYOFFICEのプラグインを導入することで、     
Nextcloud上でONLYOFFICEの機能を使ってOfficeファイルのオンライン編集、共同編集が可能になります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200616111939.png "img")      
     
ONLYOFFICEはMS Officeとの互換性が高く、Nextcloud上でも問題なく動作することが確認できました。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200616111648.png "img")     

### メールでのファイル共有
OutlookにNextcloudのプラグインを導入することでローカルのファイルをNextcloudの領域を使用して共有したり、     
Nextcloudの領域を使って共有フォルダを作成することが可能になります。     
この図では、ファイル共有についての使用例を表していますが、共有フォルダについても同様に送信者から発行されたURLから、     
Nextcloud上に作成された共有フォルダへのアクセスが可能です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200622145028.png "img")     


導入方法は、Nextcloudが提供している以下のダウンロード用ファイル一覧から最新のmsiファイルをダウンロードし実行するだけです      
> https://download.nextcloud.com/outlook/20190410/

Outlookを再起動し、Nextcloudサーバの情報、ご自身のアカウントでログインするだけで機能を使用できるようになります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200616135105.jpg "img")     

ファイルを送付したい場合には新規メール作成ページ上部のUpload filesから送りたいファイルを選択すると、     
Nextcloud上にアップロードされファイルへのアクセスURL(およびパスワード)が生成され、メール本文に貼り付けられます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200622144614.jpg "img")     
メールを受け取った人は、Nextcloud非ユーザでも、URL(およびパスワード)からファイルにアクセスすることが可能です。     
大きいサイズのファイルを送付したい場合にはとても役に立つ機能なのではないでしょうか      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200616172604.jpg "img")     

     
また、Share publicfolder機能は、Upload files機能と同様に共有フォルダへのアクセスURL(およびパスワード)が発行されます。     
Nextcloud非ユーザでも、URL(およびパスワード)を知っている人であれば一定期間(設定可能)使用できる     
共有フォルダがURL発行者のNextcloudアカウント上に作成されます。     
短期間で実施されるプロジェクトなど一時的に使用し、メンバーに社外の人(Nextcloud非ユーザ)もいる場合などは活用できると思います。     

## 日中間をCENでつないで使用する場合
中国にNextcloudサーバ、ONLYOFFICEサーバ建てられていて中国拠点以外で日本拠点からもアクセスする場合の構成をご紹介します。     
下図のように、中国リージョンVPCと日本リージョンVPCをCENでつなぎ、各VPCと拠点間をVPNGatewayを使ってVPN接続をすることで、     
日本拠点からでも中国リージョンにあるNextcloudを問題なく使用することができます。     
この構成を使うことで、複数の国に拠点をもつ企業であってもファイルの共有を容易に行うことが可能です。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200616173402.png "img")     


## 最後に
本記事ではNextcloudをAlibaba Cloud上で使用する方法についてご紹介しました。     
Alibaba Cloud上でも問題なくNextcloudの機能を使用することができ、     
ONLYOFFICEのプラグインを使ってOfficeファイルの作成/編集ができることをご理解いただけたかと思います。     