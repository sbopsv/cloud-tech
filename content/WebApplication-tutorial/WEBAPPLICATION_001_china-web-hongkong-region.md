---
title: "中国向けWebサイト構築方法"
metaTitle: "中国向けWebサイトのクラウド構築 香港リージョン編"
metaDescription: "中国向けWebサイトのクラウド構築 香港リージョン編"
date: "2021-03-18"
author: "sbc_yoshimura"
thumbnail: "/Web_Application_images_26006613700753900/20210308133952.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


# はじめに

Alibaba Cloudは中国国内パブリッククラウドのマーケットシェア No.1であり、中国国内のWebサイトのおよそ40%がAlibaba Cloud上で稼働していると言われています。

本記事では、中国向けWebサイトでもICP登録が不要となる香港リージョンで、シンプルなクラウド構成を構築する手順をご紹介します。


# 構成図と全体の流れ

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210308133952.png "img")       

本記事では香港リージョンでの構築となります。

以下の手順で進めていきます。

-   手順１ : VPC作成
-   手順２ : ECS作成
-   手順３ : SLB作成
-   手順４ : EIP pro設定
-   手順５ : DNS設定 

# 手順1 VPC作成

香港リージョンにVPCを作成します。

-   VPCコンソールから\[香港リージョン\]を選択。
-   \[VPCの作成\]をクリック。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317121845.png "img")       

**VPCの設定**

-   リージョン : 香港
-   名前 : 香港VPC
-   IPv4 CIDR ブロック : 10.0.0.0/8
-   説明 : 空欄
-   リソースグループ : 默认资源组(デフォルトリソースグループ)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317122217.png "img")       

**VSwitchの設定**

-   名前 : 香港VSwitch
-   ゾーン : Hong Kong Zone B
-   IPv4 CIDR ブロック : 10.0.1.0/24
-   説明 : 空欄
-   \[OK\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317122248.png "img")       

# 手順2. ECS作成

香港リージョンにECSを作成します。

-   ECSコンソールから\[香港リージョン\]を選択。
-   \[インスタンスの作成\]をクリック。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317122906.png "img")       

**ECS 基本構成の設定**

-   課金方式 : 従量課金
-   リージョン : 香港ゾーンB
-   インスタンスタイプ : ecs.c6.large
-   インスタンス数 : 1
-   イメージ : パブリックイメージ CentOS 7.9 64-bit / セキュリティ強化(Security Center)
-   ストレージ : ESSDクラウドディスク 40GB PL1
-   \[次のステップ : ネットワーク\]に進む

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317123854.png "img")       

**ECS ネットワークの設定**

-   ネットワーク : 先程作成したVPCとVSwitchを選択
-   パブリックIPの割当 : チェックなし
-   セキュリティグループ : デフォルトセキュリティグループのHTTPポート 80 とポート22 のみチェック
-   \* ポート22はECSへのログインに利用するため、本番時には適切なアクセス制限を行ってください。
-   ネットワークインターフェース : デフォルトENI
-   \[次のステップ : システム構成\]に進む

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317124202.png "img")       

**ECS システム構成の設定**

-   ログイン認証 : キーペア
-   \* まだキーペアがない状態なので、キーペアの作成を行います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317124819.png "img")       

別タブにてキーペア作成画面に遷移。

**キーペアの作成**

-   キーペア名 : 香港keypair
-   新規タイプ作成 : \[キーペアを自動新規作成\]をチェック
-   リソースグループ : 默认资源组(デフォルトリソースグループ)
-   \[OK\]をクリック
-   \* 香港keypair.pemファイルがダウンロードされるので、こちらを使ってECSにログインします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317124655.png "img")       

再度ECSのタブに戻ってECSの作成

-   ログイン認証 : キーペア
-   キーペア : 香港keypair
-   インスタンス名 : 香港ECS
-   説明 : 空欄
-   ホスト : hongkong-web
-   \[プレビュー\]に進む

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317125304.png "img")       

**ECS プレビューと利用規約**

-   ECSの設定を確認する
-   \[ECS SLA と プロダクトの利用規約\] にチェックを入れる
-   \[インスタンスの作成\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317125637.png "img")       

-   インタンス作成開始後、\[コンソール\]をクリック
-   \* \[戻る\]をクリックすると、別ECSインスタンスを作成することになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317130042.png "img")       

# 手順3. SLB作成

香港リージョンにSLBを作成します。

-   SLBコンソールから\[香港リージョン\]を選択。
-   \[SLBの作成\]をクリック。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317130255.png "img")       

-   リージョン : 中国(香港)
-   ゾーンタイプ : マルチゾーン
-   プライマリゾーン : 香港ゾーンB
-   バックアップゾーン : 香港ゾーンC
-   インスタンス名 : 香港SLB
-   インスタンスタイプ : イントラネット
-   インスタンスの仕様 : Small(slb.s1.small)
-   ネットワークタイプ : VPC
-   機能 : 標準
-   IPバージョン : IPv4
-   VPC : 先程作成したVPCを選択
-   VSwtich : 先程作成したVSwtichを選択
-   インターネット接続帯域 : トラフィックに応じた
-   リソースグループ : 既定のリソースグループ
-   数 :  1
-   \[今すぐ購入\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317130446.png "img")       

-   SLBの設定を確認する
-   \[Server Load Balancer の有効化サービス利用規約\] にチェックを入れる
-   \[Activate Now\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210317130854.png "img")       

続いて、SLBのコンフィグ設定です。

-   SLBのコンソールから、\[未設定\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318111003.png "img")       

**SLB プロトコルとリスナー設定**

-   リスナープロトコルの選択 : HTTPS
-   \* 今回はHTTPSで行いますが、SSL証明書の設定が必要になります。SSL/TLSが不要な場合はHTTPで行ってください。
-   リスニングポート : 443
-   リスナー名 : slb-443
-   \[次へ\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318111128.png "img")       

**SLB SSL証明書設定**

-   \[サーバー証明書の作成\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318112330.png "img")       

-   サーバ証明書の公開鍵と秘密鍵をアップロードして\[作成\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318112256.png "img")       

-   サーバ証明書を選択して、\[次へ\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318112621.png "img")       

**SLB バックエンドサーバ設定**

-   リクエストの転送先 : デフォルトのサーバーグループ
-   \[さらに追加\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318112758.png "img")       

-   先程作成したECSを選択して、\[次へ\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318112914.png "img")       

-   重み : 100 
-   \[追加\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318113045.png "img")       

-   ポート : 80
-   \[次へ\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318114147.png "img")       

**SLB ヘルスチェック設定**

-   \[次へ\]をクリック
-   \*必要の応じてヘルスチェックの詳細設定を行う

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318114324.png "img")       

-   SLBの各種設定を確認し、問題がなければ\[送信\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318114434.png "img")       

-   \[OK\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318114505.png "img")       

# 手順4. EIP pro作成

香港リージョンでEIP作成を行います。

-   EIPコンソールに移動して、香港リージョンを選択
-   \[EIPの作成\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318114716.png "img")       


-   Billing Method : 従量課金
-   リージョン : 中国(香港)
-   ISP : BGP(マルチ ISP)Pro
-   \* EIP Proを選択することで、中国本土からAlibaba Cloud香港リージョンへの通信が低遅延になります。
-   Network Mode : Public
-   トラフィック料金 : トラフィックに応じた
-   EIP帯域幅 : 200Mbps
-   Name : 香港EIP-SLB
-   課金サイクル : Hour
-   数 : 1
-   \[今すぐ購入\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318114901.png "img")       


-   \[Elastic IPサービス利用規約\]にチェックを入れる
-   \[Activate Now\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318115353.png "img")       

-   EIPのコンソールに移動
-   \[リソースのバインド\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318115848.png "img")       

-   先程作成したSLBを選択
-   \[OK\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318115954.png "img")       

https:// Elastic IPアドレス　にアクセスして確認

\*以下の画像例はECSのヘルスチェックエラーでSLBの502が出ています。これはAlibaba Cloud SLBがNginxをフォークしたオープンソース[Tengine](https://tengine.taobao.org/)を利用しているためです。  
 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318120947.png "img")       

# 手順5. DNS作成

おまけでAlibaba Cloud DNSの設定を行います。

Alibaba Cloud DNS は無料プランもあるので、お得に利用できます。

ご自身のドメインのゾーン管理をすべてAlibaba Cloud DNSで管理してもよいですし、一部のレコードのみをAlibaba Cloud DNSに委任してもよいです。

-   Alibaba Cloud DNSコンソールに遷移します。
-   \[ドメイン名を追加\]をクリック。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318122328.png "img")       

-   サブドメインを入力
-   \*今回は一部レコードのみをAlibaba Cloud DNSで管理します。 
-   \[TXTレコードの検証\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318122538.png "img")       

-   ドメインのDNSレコードで以下を設定
-   alidnscheck     IN    TXT  値(ランダムな英数字)
-   DNSレコード設定し、名前解決できることを確認したら\[検証\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318122737.png "img")       

-   \[検証完了、ドメイン名を追加\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318123038.png "img")       

-   対象のサブドメインが追加されたら、ドメイン名をクリック

Alibaba Cloud DNSのネームサーバを設定して、権威委任を行います。

-   ドメインのDNSレコードで以下を設定
-   サブホスト   IN    NS   ns7.alidns.com
-   サブホスト   IN    NS   ns8.alidns.com

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318123200.png "img")       

-   権威委任ができたら、\[レコードを追加\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318123704.png "img")       

**DNSレコードを設定**

-   タイプ : A - IPV4 アドレス
-   ホスト : 空欄
-   ISP 回線 : デフォルト
-   値 : 先ほどのElastic IP アドレス
-   TTL : 10分
-   \[OK\]をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318124051.png "img")       

https:// サブドメイン　にアクセスして確認

以上で、こちらの構成が構築完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210318132033.png "img")       



# 最後に
本記事ではシンプルな構成のご紹介いたしました。ご参考に頂ければ幸いです。    

ちなみにこれよりワンランク上でお勧めの本格的なWebサイト向けの構成方法もあります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/Web_Application_images_26006613700753900/20210308134721.png "img")       

-   マルチAZ構成として、ECSを冗長化、RDS、OSSを導入。
-   セキュリティ対策として、WAF、Security Center Enterprise Edition、Alibaba Cloud DNS Enterprise Standard Edition、SSL証明書を導入。 

このような構成をとることで、配信だけでなく、運用面やセキュリティ面でもインフラ管理を最適化することができます。

ソフトバンクではAlibaba Cloudプロフェッショナルエンジニアによる構築サービスもご提供しているため、作業のご依頼の際には是非こちらまでお問い合わせください。


 <CommunityAuthor 
    author="吉村 真輝"
    self_introduction = "Alibaba Cloud プロフェッショナルエンジニア。中国ｘクラウドが得意。趣味は日本語ラップのDJ。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yoshimura_pic.jpeg"
    githubUrl="https://github.com/masaki-coba"
/>





