---
title: "Cloud Remote Desktop on Azure操作ポータル - ユーザマニュアル"
metaTitle: "Cloud Remote Desktop on Azure操作ポータル Web Document - ユーザマニュアル"
metaDescription: "Cloud Remote Desktop 操作ポータルのユーザ向けマニュアルです。"
date: "2022-07-04"
author: "Yoshihiro Matsuda"
thumbnail: "/images/DaaS-02-Portal-Manual/3.1-portal-login.png"
---

## 1. はじめに
本資料は、一般ユーザ向けのDaaSポータルを利用するための手順を記述したものです。  
## 2. ログイン
（１）弊社より事前に展開したショートカットより、操作ポータルを開きます。  
※ログインページにて「詳細設定」を開きます。  
 ![詳細設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/2.png "詳細設定")  
（２）「xxxxxxにアクセスする」リンクをクリックします。  
 ![SSL確認](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/3.png "SSL確認")   
（３）ユーザー名とパスワードを入力し、ログインを押下します。  
![3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/3.1-portal-login.png)  

（４）初めてログインする際はMFA登録を行う必要があります。  
Google Authenticator等、スマートやフォンタブレット等のデバイスを使ったワンタイムパスワードが必要です。  
ここでは Google Authenticator を使用しています。  
> Android 用 Google Authenticator は[こちら](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)からダウンロードしてください。
>
> iOS用 Google Authenticator は[こちら](https://apps.apple.com/app/google-authenticator/id388497605)からダウンロードしてください。  

・Google Authenticator でQRコードを読み込んでください。  
・Google Authenticator に表示された 6桁の認証コードを入力してください。  
・「次へ」をクリックします。  
![3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/3.4-mfa-regi.png)  

※２回目以降ログインする場合は下記のようなワンタイムパスワード入力画面が表示します。  
![3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/3.3-mfa-login.png)  
（５）ログイン成功していることを確認します。  
## 3. 共通ヘッダー
## 3.1 地域
ヘッダー左側の地域ボタンを押下することで、地域ごとのデスクトップ一覧を切り替えることができます。  
※デフォルトは東日本（Japan East）リージョンが選択されています。  
![3.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/3.1.1-region.png)  
## 3.2 ログイン情報
ヘッダー右側に、ご自身のユーザ名と前回ログイン日時が表示されます。  
![3.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/3.2.1-logon-time.png)  
## 3.3 非同期タスク状況確認
非同期タスク状況についての通知が届くと、ヘッダー右側のベルマークに通知数が表示されます。  
ベルマークをクリックすることで、通知の内容を確認することができます。  
![3.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/3.3.1-notification1.png)  
## 3.4 ログアウト
ヘッダ右側のログアウトボタンを押下することで、ポータルよりログアウトすることができます。  
![3.4.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.1.3-logout.png)  

## 4. メニュー
## 4.1 デスクトップ起動・停止・再起動
メニューより「起動・再起動・停止」を押下します。  
ここでは、ご自身のユーザに紐づけられているデスクトップの各操作（起動・停止・再起動）を行うことができます。  
![4.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-05-Portal-UserManual/4.1-desktop-menu.png)  
## 4.1.1 デスクトップの起動
（１）デスクトップの起動：  
①デスクトップ一覧より、一台または複数台のデスクトップを選択します。  
②「一括起動」を選択します。  
※「ステータス」が起動中と停止中のタスクを同時に選択することはできません。  
![4.2.2.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.1.1-desktop-start.png)  
（２）ポップアップ画面にて、起動対象のデスクトップを確認します。「OK」を押下します。  
![4.2.2.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.1.2-desktop-start-confirm.png)  
（３）デスクトップ起動開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.2.2.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.1.3-desktop-start-success.png)  
起動が完了したら、画面右上に通知されます。  
![4.2.2.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.1.4-start-complete-notice.png)  
## 4.1.2 デスクトップの再起動
（１）デスクトップの再起動：  
①デスクトップ一覧より、一台または複数台のデスクトップを選択します。  
②「一括再起動」を選択します。  
※「ステータス」が停止中のデスクトップを選択することはできません。  
![4.2.2.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.2.1-desktop-restart.png)  
（２）ポップアップ画面にて再起動対象のデスクトップを確認します。  
「OK」を押下します。  
![4.2.2.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.2.2-desktop-restart-confirm.png)  
（３）デスクトップ再起動開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.2.2.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.2.3-desktop-restart-success.png)  
再起動が完了したら、画面右上に通知されます。  
![4.2.2.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.2.4-restart-complete-notice.png)  
## 4.1.3 デスクトップの停止
（１）デスクトップの停止：  
①デスクトップ一覧より、一台または複数台のデスクトップを選択します。  
②「一括停止」を選択します。  
※「ステータス」が停止中、または起動中と停止中複数のデスクトップを選択することはできません。  
![4.2.2.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.3.1-desktop-stop.png)  
（２）ポップアップにて停止対象のデスクトップ一覧を確認します。  
「OK」ボタンを押下します。  
![4.2.2.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.3.2-desktop-stop-confirm.png)  
（３）デスクトップ停止開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.2.2.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.3.3-desktop-stop-success.png)  
停止が完了したら、画面右上に通知されます。  
![4.2.2.3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.2.3.4-stop-complete-notice.png)  
## 4.2 パスワード変更
ご自身のユーザのパスワードを変更することができます。  
メニューより「パスワード変更」を押下します。  
![4.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-05-Portal-UserManual/4.2.1-change-password.png)  
パスワード変更ボタンを押下します。  
![4.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-05-Portal-UserManual/4.2.2-change-password.png)  
現在のパスワードと新パスワードを入力し、OKボタンを押下します。  
![4.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-05-Portal-UserManual/4.2.3-change-password-form.png)  
以下のメッセージが表示されると完了です。  
![4.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-05-Portal-UserManual/4.2.4-change-password-complete.png)  