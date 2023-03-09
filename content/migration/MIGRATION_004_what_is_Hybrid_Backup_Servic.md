---
title: "Hybrid Backup Serviceの紹介"
metaTitle: "Hybrid Backup Serviceについてのご紹介"
metaDescription: "Hybrid Backup Serviceについてのご紹介"
date: "2020-10-01"
author: "sbc_hr"
thumbnail: "/Migration_images_26006613628578200/20200916133659.jpg"
---

## Hybrid Backup Serviceについてのご紹介

本記事では、AlibabaCloudのHybrid Bakcup Service（HBR）についてご紹介します。

# はじめに

HBRのバックアップ機能はかなり豊富で、AlibabaCloud上のリソースはもちろん、オンプレミスのバックアップもサポートしています。    
・ECSのアプリケーションバックアップ    
・ECSのファイルバックアップ    
・ECSスナップショット管理    
・OSSバックアップ    
・NASバックアップ    
・オンプレミスバックアップ
        
今回はオンプレミスバックアップを実際に試してみて、以下の内容を紹介させていただきたいと思います。

    
# 1.HBRのRAMユーザー作成
    
まずはHBR用のRAMユーザーを作成する必要があります。    
新規ユーザーの作成方法は以下のドキュメントをご参照ください。    
https://www.alibabacloud.com/cloud-tech/ja/doc-detail/93720.htm?spm=a2c63.l28256.b99.21.394a7a53njX3vw
    
※HBRのユーザーはアクセスキーの発行と以下の権限が必要です。
    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133312.jpg "img")

    
# 2.HBRの有効化／クライアントインストール
    
（1）コンソール画面から「Hybrid Backup Recovery」を選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133530.jpg "img")

    
（2）画面左メニューから「オンプレミスバックアップ」を選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133545.jpg "img")

    
（3）初回サービス利用時はまずサービスの条約を同意する必要があります。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133556.jpg "img")

    
（4）「サービスの適用」を押下し、コンソール画面が開きます。
    
※利用可能なリージョンについて、ご覧の通り、現在利用できるのは以下のリージョンになります。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133616.jpg "img")

    
今回は日本リージョンを選択します。
    
（5）次は画面右上のクライアントの作成をクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133640.jpg "img")

    
クライアント作成画面では、以下のパラメータを入力する必要があります。    
「ボールト名」：新規作成するボールトの名前。    
「クライアント名」：同じボールト内に複数のバックアップサーバが存在する場合、サーバを識別するための名前となります。    
「ソフトウェアプラットフォーム」：対象バックアップサーバの種類（Win64,Win32,Linux64,Linux32をサポートしています。）    
「ネットワークタイプ」：パブリックネットワーク／VPCを選択できます。    
「HTTPS」：HTTPSを利用してデータバックアップする（HTTPSを利用する場合、バックアップの速度に影響する場合があります。）    
全てのパラメータを入力後、「作成」ボタンを押下します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133659.jpg "img")

    
（6）クライアントが正しく作成されたことを確認し、「クライアントをダウンロード」をクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133713.jpg "img")

    
（7）ダウンロードしたインストールファイルを対象サーバにコピーします。（今回デモのためにWindowsServer2019を利用しています。）    
※コンソール画面はそのまま閉じないでください。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133736.jpg "img")

    
（8）ファイルを解凍し、インストールします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133748.jpg "img")

    
（9）クライアントの言語は現在中国語と英語しか選べないので、今回は英語を選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133800.jpg "img")

    
（10）インストール先を選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133814.jpg "img")

    
（11）「Next」を押下します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133836.jpg "img")

    
（12）「Install」を押下します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133851.jpg "img")

    
（13）インストールが正しく終了後、コンソール画面に戻り、「次へ」を押下します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133904.jpg "img")

    
（14）次はクライアントの有効化を行います。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133924.jpg "img")

    
「クライアントIPアドレス」：接続対象サーバのIPアドレス。    
「AccessKeyId」：先ほど作成したHBR用のアクセスID。    
「AccessKeySecret」：先ほど作成したHBR用のアクセスシークレット。    
「パスワード」：対象サーバからHBRクライアントを起動する際のWebログイン用のパスワードになります。    
全ての項目入力後、「クライアントの有効化」をクリックします。
    
（15）新しいブラウザが開き、以下の画面が表示されば、HBRが正しく有効化されています。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133944.jpg "img")

    
（16）コンソール画面に戻り、接続されているサーバの情報を確認できます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134000.jpg "img")

    
# 3.バックアップポリシー／プランの設定
    
（1）ブラウザの画面に戻り、画面左パネルの「Backup Policies」を押下します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134017.jpg "img")

    
（2）「Create Policy」を押下します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134029.jpg "img")

    
（3）バックアップポリシーを作成します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134102.jpg "img")

    
「Name」：バックアップポリシーの名前。    
「Frequency」：バックアップの頻度を選択します。    
「Backup Time」：バックアップの開始時間を選択します。    
「Retention Policy」：バックアップデータの保持期間を設定します。    
「Retention」：バックアップデータの保持期間を設定します。    
全てのパラメータ設定後、「Submit」を押下します。
        
（4）バックアッププランを作成します。    
画面左パネルのバックアップを選択し、「Create Backup Plan」を押下します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134124.jpg "img")

    
「Source」：バックアップ対象のディレクトリを選択します。    
「Backup Rule」：全てのファイル／一部除外を選択できます。    
「Running Plan」：一度のみ実行／スケジュール実行を選択できます。    
「Backup Policy」：先ほど作成したBackupPolicyを紐付けます。    
    
※Sourceディレクトリの指定には以下の制限事項があります。    
①ワイルドカード（＊）を利用しない場合、最大８個のディレクトリを指定できます。    
②ワイルドカード（＊）を利用する場合、最大一行のディレクトリのみサポートしています。（例/*/*）    
③VSSバックアップを利用する際、以下の設定はサポートしていません。    
・ワイルドカード（＊）の利用    
・複数ディレクトリの指定    
・UNCディレクトリの指定    
・除外ファイルの指定    
④UNCディレクトを指定する際、以下の設定はサポートしていません。    
・VSSバックアップ    
・ワイルドカード（＊）の利用    
・除外ファイルの指定    
    
※除外ファイルの指定には以下の制限事項があります。    
①最大８個のディレクトリを指定できます。（ワイルドカード利用可）    
②「／」を利用しない場合、ワイルドカードを利用する場合、全ての上位ディレクトリを指定されます。（例：設定値：*abc、除外ディレクトリ：a/abc、b/c/abc）    
③「／」を利用する場合、ワイルドカードは1階層のみ表します。（例：設定値：/home/user/*/、除外ディレクトリ/home/user/a/、/home/user/b/）    
    
（5）また、別タブでトラフィックのコントロールも設定できます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134304.jpg "img")

    
（6）上記はバックアッププランの設定について紹介させていただきました。今回は実際一般的なCドライブを丸ごとバックアップしてみたいと思います。    
Cドライブを指定したバックアッププランを作成し、バックアップを実行します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134331.jpg "img")

# 4.バックアップ
（7）指定の時間になりましたら、バックアップが開始されます。結果はこのように表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134343.jpg "img")

    
（8）今回はCドライブ丸ごとバックアップのため、一部のみ成功したと表示されています。    
ではエラー内容について確認してみましょう。エラーのダウンロードボタンを押下します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134358.jpg "img")

    
（9）ダウンロードしたExcelファイルを開いて、エラーとなるファイルおよび原因を確認できます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134410.jpg "img")

    
「shadow_all_ids」はHBRバックアップの際一時的に作成したフォルダーのため、今回は無視して問題ないでしょう。    
    
# 5.バックアップのリストア
    
（1）画面左パネルの「Restore」を選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134430.jpg "img")

    
（2）リストアしたいバックアップジョブを選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134445.jpg "img")

    
（3）今回は新規に「Restore」フォルダーを作成し、その中に先ほどダウンロードしたインストラーをリストアしてみます。（ディレクトリ単位のリストアもできます。）    
「Submit」を押下します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134459.jpg "img")

    
（4）ファイルが正しくリストアされていることを確認できます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916134512.jpg "img")



# 最後に
    
以上で、HBRのオンプレミスのファイルバックアップ／リストアについてご紹介させていただきました。    
    
Hybrid Backup Recovery Serviceの課金体系は以下のURLから確認できます。    
https://www.alibabacloud.com/ja/product/hybrid-backup-recovery/pricing
    
HBRはそれ以外にも、沢山のバックアップ機能が備わっているので、参考に頂ければ幸いです。     

