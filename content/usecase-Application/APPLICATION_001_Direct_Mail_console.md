---
title: "Direct Mailでメール：コンソール編"
metaTitle: "Direct Mailでメールを送る方法：コンソール編"
metaDescription: "Direct Mailでメールを送る方法：コンソール編"
date: "2019-12-09"
author: "SBC engineer blog"
thumbnail: "/Application_images_26006613468493200/20191120101023.png"
---

## Direct Mailでメールを送る方法：コンソール編


本記事では、Alibaba CloudのDirect Mailコンソールを利用したメール送信方法をご紹介します。     

# Direct Mailとは？
ユーザー自身の ドメインを使用して E メールを送信することができるAlibaba Cloudのプロダクトです。     
安定したスケーラブルなメール配信プラットフォームを提供し、メールサーバを準備することなくメール送信をすることができます。     
また送信方法もコンソール、API、SMTPの３種類があり、様々なユースケースに対応することができます。     
ドキュメントは[こちら](https://www.alibabacloud.com/cloud-tech/product/29412.htm)をご参照ください。

# 前提
Direct Mailはメール配信サービスであるため、あらかじめドメインの取得が必要です。

# メール送信手順
メール送信は以下の手順で行います。

1. ドメインの登録     
2. 送信アドレスの作成     
3. メールタグの作成     
4. メールテンプレートの作成     
5. 受信者リストの作成     
6. メール送信     

順に説明をしていきます。
## STEP1. ドメインの登録
このステップではドメインの登録を行います。     
まず、Direct Mailのコンソールを開きます。
Direct Mailは2019年11月現在で以下のリージョンで利用ができます。     

* ・中国杭州
* ・シンガポール
* ・シドニー

今回はシンガポールリージョンで作業を進めていきたいと思います。     
コンソール上部のリージョン選択が「Singapore」となっていることを確認してください。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120100709.png "img")

     
左メニュー[Email Domains] → [New Domains]     
ドメイン入力 → [OK]
     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120100908.png "img")

ドメイン登録後に[Configure]を押すと、4つのレコードが表示されるので、それらを自身が利用しているDNSへ登録します。     
※CNAMEレコードはメール追跡機能を使用しない場合は設定不要です。     

5〜10分ほど待ち、それぞれのステータスが「Verification successful」となればドメインの登録は成功です。     
※ステータスが変わらない場合は[Verify]を押してみてください。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120100900.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120100916.png "img")





## STEP2. 送信アドレスの作成
このステップでは送信アドレスの作成を行います。     
左メニュー[Sender Addresses] → [Create Sender Addess]
     
送信アドレス作成用のポップアップが開かれますので、項目を入力します。

* Email Domains : STEP1で作成したドメイン
* Account : 任意(メールアドレスのアカウント名)
* Reply-To Address : 返信用アドレス
* Mail Type : 用途によって選択。今回はBatch Emailsを使用。
     ※詳細は[ドキュメント](https://www.alibabacloud.com/cloud-tech/doc-detail/29427.htm)を参照してください。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120100928.png "img")

[OK]を押すと以下のような画面になります     
Direct Mailでは返信アドレスを指定してメールを送信することができます。     
返信用アドレスを使用するには承認が必要です。     
[Verify the reply-to address] → [Configure]     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120121637.png "img")
     
返信用メールアドレスに以下のようなメールが着ますので、linkを押し、承認します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120100938.png "img")
     
コンソールに戻り、refreshすることで返信用アドレスのステータスが[Successful]になっていることを確認します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191125161206.png "img")
## STEP3. メールタグの作成
このステップではメールタグの作成を行います。
メールタグは送信履歴などの管理に使用するタグです。

左メニュー[Email Tags] → [Create Email Tags]
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120100946.png "img")
任意の値を入力し、[OK]を押します。

## STEP4. メールテンプレートの作成
このステップではメールテンプレートの作成を行います。     
左メニュー[Email Templates] → [Create Email Templates]     
メールテンプレート作成用のページが開かれますので、     
[Template Name], [Mail Subject], [Sender Name], [Mail Body]を入力します。最後に[save]を押します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120100955.png "img")


作成したテンプレートはAlibaba Cloudにレビューしてもらう必要があるので、     
[Submit to Review] → [confirm]を押します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120101002.png "img")

ステータスが[Review passed]に変わったらレビュー完了です。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120104828.png "img")
※テンプレートのレビューには1〜3日ほどかかる場合があります。     


     
※メールテンプレートには、STEP5の受信者リストに登録した名前などを利用することができます。
　使用できる項目と使用する際に使う文字列を以下にご紹介します。

* ・メールアドレス：{EAddr}
* ・名前：{UserName}
* ・ニックネーム：{NickName}
* ・性別：{Gender}
* ・誕生日：{Birthday}
* ・電話番号：{Mobile}

以下のように利用します。
```
こんにちは、{UserName}
```


## STEP5. 受信者リストの作成
このステップでは受信者リストを作成します。     
左メニュー[Recipient Lists] → [New Recipient Lists]     
受信者リストの作成用のポップアップが開かれますので、     
[List Name], [Alias Address], [Description]を入力します。     
最後に[OK]を押します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120101013.png "img")


[upload]からテキストファイルもしくはCSVファイル形式の受信者リストをアップロードします。     
受信者リストのサンプルはコンソールからダウンロードすることができます。     
サンプルは以下のような構造をしています。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120101016.png "img")



## STEP6. メール送信
このステップではメールの送信を行います。     
左メニュー[Send Emails] → [Create Email Task]     

メール送信用のポップアップが開かれますので、項目を入力します。

* ・Recipient Lists : STEP5で作成した受信者リスト
* ・Template Name : STEP4で作成したメールテンプレート
* ・Sender Addresses : STEP2で作成した送信者アドレス
* ・Sender Address Type : Sender Addresses
* ・Email Tags : STEP3で作成したメールタグ
* ・Recipient Tracking : チェックしない(メール追跡機能を使用する場合にチェック。)

[OK]を押すことでメールが送信されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120101023.png "img")

# 送信履歴の確認
最後に送信したメール送信履歴を確認したいと思います。     
メールの送信履歴は[Delivery Log]から確認することができます。     
Delivery Logでは送信成功、失敗も確認することができます。     

以下のように、「Successful」と表示されているものは送信に成功しています。     
「Invalid Addresses」と表示されているものはメールアドレスが間違っており、送信に失敗しています。     
送信に失敗した場合は、受信者リストに登録したメールアドレスに間違いがないか確認してみてください。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468493200/20191120101026.png "img")

# おわりに
今回は、Alibaba Cloudのメール配信サービスであるDirect Mail紹介させていただきました。参考に頂ければ幸いです。     




