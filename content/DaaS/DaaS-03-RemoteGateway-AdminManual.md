---
title: "Remote Gateway - 管理者マニュアル"
metaTitle: "Remote Gateway Web Document - 管理者マニュアル"
metaDescription: "Remote Gateway の管理者ユーザー向けマニュアルです。ログイン方法や接続先の設定方法、ユーザーの作成方法などを記載しています。"
date: "2021-09-02"
author: "Yoshihiro Matsuda"
thumbnail: "/images/DaaS-03-RemoteGateway-AdminManual/1/4.png"
---

## 1.Remote Gateway へのログイン 

## 1-1.ログインページにアクセス 

提供したURLのショートカットリンクを開いてください。

 ![ショートカットリンク](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/1.png "ショートカットリンク")

## 1-2.ログインページ詳細設定画面 

ログインページにて「詳細設定」を開きます。

 ![詳細設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/2.png "詳細設定")

## 1-3.SSL確認画面 

「xxxxxxにアクセスする」リンクをクリックします。

 ![SSL確認](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/3.png "SSL確認")

## 1-4.ユーザ名とパスワードを入力 

ユーザ名とパスワードを入力します。

 ![ユーザ名とパスワード](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/4.png "ユーザ名とパスワード")

## 1-5.QRコードによる2段階認証(1) 

### 【初回の場合】 

Google Authenticator等、スマートやフォンタブレット等のデバイスを使ったワンタイムパスワードが必要です。
ここでは Google Authenticator を使用しています。

Android 用 Google Authenticator はこちらからダウンロードしてください。  
<https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2>

iOS用 Google Authenticator はこちらからダウンロードしてください。  
<https://apps.apple.com/app/google-authenticator/id388497605>

1. Google Authenticator でQRコードを読み込んでください。  
2. Google Authenticator に表示された 6桁の認証コードを入力してください。  
3. 「次へ」をクリックします。  

 ![QRコードによる2段階認証(1) ](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/5.png "QRコードによる2段階認証(1) ")

## 1-6.QRコードによる2段階認証(2) 

### 【2回目以降の場合】 

1. Google Authenticatorに表示された 6桁の認証コードを入力してください。  
2. 「次へ」をクリックします。

 ![QRコードによる2段階認証(2) ](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/6.png "QRコードによる2段階認証(2) ")

## 2.基本的な仮想デスクトップ接続設定 

## 2-1.ログイン後のホーム画面 

ログイン後のホーム画面にて右上のユーザ名アイコンをクリックして表示されたメニューから「設定」をクリックします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/2/1.png "ホーム")

## 2-2.設定画面にて接続を選択 

設定画面にて「接続」タブをクリックします。

 ![接続](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/2/2.png "接続")

## 2-3.接続設定画面にて接続の追加 

接続タブ以下にて「接続の追加」をクリックします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/2/3.png "ホーム")

## 2-4.接続名と接続プロトコルの設定 

「接続の編集」にて以下の値を入力します。  

- 「名前」にDaaS接続の名前 (「daas-taro.yamada」のように「daas-ユーザアカウント名」でお願いします。)
- 「プロトコル」にて「RDP」を選択

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/2/4.png "ホーム")

## 2-5.接続先IPアドレス・ログインアカウント・パスワードの設定 

「パラメータ」の「ネットワーク」にて以下の値を入力します。

- 「ホスト名」に自分が利用するデスクトップ環境のIPアドレスを入力

「認証」にて以下の値を入力します。

- 「ユーザ名」にデスクトップ環境にログインするためのユーザ名を入力
- 「パスワード」にデスクトップ環境にログインするためのパスワードを入力
- 「サーバ証明書を無視する」にチェック

「基本設定」までスクロールします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/2/5.png "ホーム")

## 2-6.キーボードレイアウトの設定 

「基本設定」にて、以下を設定します。  

- キーボードレイアウトにて「Japanese(QWERTY)」を選択
- Time zoneにて「Asia」「Tokyo」を選択

「ディスプレイ」までスクロールします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/2/6.png "ホーム")

## 2-7.ディスプレイサイズ変更方法の設定 

「ディスプレイ」にて、以下を設定します。

- サイズ変更方法にて「\"ディスプレイアップデート\"仮想チャンネル(RDP 8.1+)」を選択  

ページ下部までスクロールします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/2/7.png "ホーム")

## 2-8.設定を保存 

「保存」をクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/2/8.png "ホーム")

## 2-9.ホーム画面に移動 

右上のユーザ名アイコンをクリックして表示されたメニューから「ホーム」をクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/2/9.png "ホーム")

## 3.仮想デスクトップへの接続 

## 3-1.仮想デスクトップへの接続 

ホーム画面にて対象の接続先「例：daas-ユーザアカウント名」をクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/3/1.png "ホーム")

## 3-2.ログイン後の画面 

デスクトップが表示されます。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/3/2.png "ホーム")

## 4.IME日本語入力ON/OFFキーの設定 

## 4-1.IMEプロパティを起動(1) 

接続後のデスクトップ画面にてタスクバー右の「A」を右クリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/4/1.png "ホーム")

## 4-2.IMEプロパティを起動(2) 

プロパティを選択します。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/4/2.png "ホーム")

## 4-3.IMEプロパティの詳細設定 

「詳細設定」をクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/4/3.png "ホーム")

## 4-4.キー設定 

編集操作にて「Microsoft IME」を選択し、「変更」をクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/4/4.png "ホーム")

## 4-5.「Shift+TAB」のキーアサイン変更 

「Shift+TAB」の一番左側(入力/変換文字なし)のキーアサインが「-」であることを確認し、ダブルクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/4/5.png "ホーム")

## 4-6.「IME-オン/オフ」を選択 

「IME-オン/オフ」を選択し、OKをクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/4/6.png "ホーム")

## 4-7.キー設定の確定 

「Shift + TAB」の一番左側が「IME-オン/オフ」になっていることを確認し、OKをクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/4/7.png "ホーム")

## 4-8.IMEプロパティの確定 

OKをクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/4/8.png "ホーム")

## 5.パネルからのDaaS切断 

## 5-1.「alt」「ctrl」「shift」によるパネルからの切断(1) 

「alt」+「ctrl」+「shift」を押下します。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/5/1.png "ホーム")

## 5-2.「alt」「ctrl」「shift」によるパネルからの切断(2) 

ユーザ名アイコンをクリックして表示されたメニューから「切断」をクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/5/2.png "ホーム")

## 5-3.ログアウト画面 

「ログアウト」をクリックすることでRemoteGatewayからログアウトします。  
「ホーム」をクリックすることでホーム画面に移動します。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/5/3.png "ホーム")

## 6.スタートメニューからのDaaS切断 

## 6-1.スタートメニューからの切断(1) 

スタートメニューから電源ボタンを押下します。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/6/1.png "ホーム")

## 6-2.スタートメニューからの切断(2) 

「切断」を押下します。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/6/2.png "ホーム")

## 6-3.ログアウト画面 

「ログアウト」をクリックすることで Remote Gateway からログアウトします。  
「ホーム」をクリックすることでホーム画面に移動します。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/6/3.png "ホーム")

## 7.接続設定の変更(機能有効化) 

## 7-1.ホーム画面にて設定を選択 

ホーム画面にて右上のユーザ名アイコンをクリックして表示されたメニューから「設定」をクリックします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/7/1.png "ホーム")

## 7-2.設定画面にて接続を選択 

設定画面にて「接続」タブをクリックします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/7/2.png "ホーム")

## 7-3.ファイルアップロードダウンロードの有効化 

「デバイスリダイレクト」にて以下を入力する。  

- 「入力オーディオ(マイク)の有効化」にチェック
- 「ドライブの有効化」にチェック
- ドライブ名に「RG」を入力
- ドライブパスに「/opt/guac_drive/${GUAC_USERNAME}」を入力
- 「ドライブの自動作成」にチェック

「スクリーンレコーディング」までスクロールします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/7/3.png "ホーム")

## 7-4.動画ログの有効化設定 

「スクリーンレコーディング」にて以下を入力する。  

- ログ保存ディレクトリに `/opt/guac_record/screenrecording/` を入力  
- ログファイル名に `${GUAC_DATE}-${GUAC_TIME}_${GUAC_USERNAME}.record` を入力  

ページ下部までスクロールします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/7/4.png "ホーム")

## 7-5.設定を保存 

「保存」をクリックします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/7/5.png "ホーム")

## 7-6.ホーム画面に移動 

右上のユーザ名アイコンをクリックして表示されたメニューから「ホーム」をクリックします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/7/6.png "ホーム")

## 8.ユーザ追加 

## 8-1.ホーム画面にて設定を選択 

ホーム画面にて右上のユーザ名アイコンをクリックして表示されたメニューから「設定」をクリックします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/8/1.png "ホーム")

## 8-2.設定画面にてユーザを選択 

設定画面にて「ユーザ」タブをクリックします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/8/2.png "ホーム")

## 8-3.ユーザ設定画面にてユーザの追加 

ユーザタブ以下にて「ユーザ追加」をクリックします。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/8/3.png "ホーム")

## 8-4.ユーザの編集画面にてユーザパラメータの追加 

1. 「ユーザの編集」画面にてユーザ名およびパスワードを入力してください。  
2. 「権限」欄にて適宜必要な権限にチェックをいれます。  

※管理者ではない一般ユーザとしては下記項目にチェックを入れます。  
接続の作成  
接続グループの作成  
共有プロファイルの作成  
自身のパスワードの変更  

3. 既存の接続をユーザに紐付けるには「すべての接続」タブをクリックし接続オブジェクトを選択します。  

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/8/4.png "ホーム")

## 8-5.設定を保存 

「保存」をクリックします。

 ![ホーム](https://raw.githubusercontent.com/sbopsv/cloud-tech/main/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/8/5.png "ホーム")
