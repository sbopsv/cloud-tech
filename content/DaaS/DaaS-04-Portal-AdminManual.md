---
title: "Cloud Remote Desktop on Azure操作ポータル - 管理者マニュアル"
metaTitle: "Cloud Remote Desktop on Azure操作ポータル Web Document - 管理者マニュアル"
metaDescription: "Cloud Remote Desktop 操作ポータルの管理者向けマニュアルです。"
date: "2022-07-04"
author: "Yoshihiro Matsuda"
thumbnail: "/images/DaaS-02-Portal-Manual/3.1-portal-login.png"
---

## 1. はじめに
本資料は、管理者向けのDaaSポータルを利用するための手順を記述したものです。  
## 2. ログイン
（１）弊社より事前に展開したショートカットより、操作ポータルを開きます。  
※ログインページにて「詳細設定」を開きます。  
 ![詳細設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/2.png "詳細設定")  
（２）「xxxxxxにアクセスする」リンクをクリックします。  
 ![SSL確認](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/3.png "SSL確認")   
（３）ユーザー名とパスワードを入力し、ログインを押下します。  
・ユーザー名：弊社より事前に展開したもの  
・パスワード：弊社より事前に展開したもの  
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

## 4. 管理者メニュー
## 4.1 ダッシュボード
ダッシュボード機能についてご紹介します。  
（１）グループ選択：デスクトップをグループ分けして管理することが可能です。Allグループは全てのデスクトップが表示されます。  
![4.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.1.1-dashboard-group-all.png)  
（２）デスクトップ一覧：現在利用中のデスクトップ一覧を確認できます。  
下記パラメータを確認できます。  
- デスクトップ名  
- 表示名  
- OSユーザ名  
- ステータス  
- スペック  
- ディスク  
- IPアドレス  
- ゾーン  
- OS名  
![4.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.1.2-dashboard-daas-list.png)  
## 4.2 デスクトップ管理
## 4.2.1 作成・削除
## 4.2.1.1 デスクトップの作成
（１）デスクトップ管理＞作成・削除を選択します。  
![4.2.1.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.1-menu-create.png)  
（２）作成ボタンを押下します。  
![4.2.1.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.2-create-desktop.png)  
（３）デスクトップの作成台数を設定します。  
※2以上を設定した場合、同様なデスクトップが複数作成されます。  
![4.2.1.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.3-create-quantity.png)  
（４）スペック選択は推奨スペック、あるいはカスタムをご選択ください。  
![4.2.1.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.4-create-spec.png)  

（５）デスクトップの作成元イメージを指定します。  
デフォルトのイメージを使用するか、イメージ管理（後述）で作成した任意のイメージを使用します。  
※スペック選択で推奨スペックを選択した場合は指定できません。  
![4.2.1.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.5-create-image.png)  

（６）システムディスクのカテゴリとサイズを入力します。  
※スペック選択で推奨スペックを選択した場合は指定できません。  
※本手順ではHDDの64GBとします。  
![4.2.1.1.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.6-create-os-disk.png)  
（７）データディスクの有無を指定します。  
※スペック選択で推奨スペックを選択した場合は指定できません。  
**データディスクありの場合**  
個数を入力し、ディスクのカテゴリとサイズを入力します。  
※本手順では1個のデータディスク（HDD、64GB）を作成します。  
![4.2.1.1.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.7-create-data-disk.png)  
**データディスクなしの場合**  
個数に0を入力します。  
![4.2.1.1.8](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.8-no-data-disk.png)  
（８）デスクトップがどのグループに所属するかを選択します。  
- 未所属：Allのグループに表示されます。  
- 既存のグループから選択：既存のグループより指定します。  
- 新規作成：新規グループ作成します。  

本手順では未所属を選択します。  
![4.2.1.1.9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.9-create-group.png)  
（９）その他設定  
- 可用性ゾーン：デスクトップを配置するゾーンを指定します。  
- 表示名：任意の名称を入力します。  
- パスワード：デスクトップのログインパスワードを設定します。  
（※作成されたデスクトップのユーザー名はuser-cloudrd-xxxxxとなります。）  
![4.2.1.1.10](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.10-create-other-settings.png)  
（９）最終確認後、問題なければOKボタンを押下します。  
![4.2.1.1.11](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.11-create-comfirm.png)  
（１０）デスクトップ作成開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.2.1.1.12](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.12-create-start-success.png)  
作成が完了したら、画面右上に通知されます。  
![4.2.1.1.13](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.13-create-complete-notice.png)  
以上でデスクトップの作成が完了しました。  
※デスクトップ作成は内部処理のため約5分間かかります。5分後作成対象のデスクトップを一度再起動後、ログイン確認お願いいたします。  
## 4.2.1.2 デスクトップの削除
（１）デスクトップ管理＞作成・削除を選択します。  
![4.2.1.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.1.1-menu-create.png)  
（２）削除したいデスクトップにチェックを入れて削除ボタンを押下します。  
![4.2.1.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.2.2-delete-check.png)  
（３）最終確認後、OKボタンを押下します。  
![4.2.1.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.2.3-delete-confirm.png)  
（４）デスクトップ削除開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.2.1.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.2.4-create-start-success.png)  
削除が完了したら、画面右上に通知されます。  
![4.2.1.2.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.1.2.5-delete-complete-notice.png)  
以上で、デスクトップの削除が完了しました。  
## 4.2.2 起動・再起動・停止
## 4.2.2.1 デスクトップの起動
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
## 4.2.2.2 デスクトップの再起動
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
## 4.2.2.3 デスクトップの停止
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
## 4.2.3 スペック変更
## 4.2.3.1 デスクトップスペック変更
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![4.2.3.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.1.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、デスクトップスペック変更を押下します。  
![4.2.3.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.1.2-select-desktop.png)  
（３）変更後のスペックを選択します。「次へ」を押下します。  
![4.2.3.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.1.3-select-spec.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![4.2.3.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.1.4-confirm-change.png)  
（５）スペック変更開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.2.3.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.1.5-change-success.png)  
変更が完了したら、画面右上に通知されます。  
![4.2.3.1.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.1.6-change-complete-notice.png)  
（６）変更完了後、デスクトップ一覧にて新しいスペックに変更されていることを確認できます。  
![4.2.3.1.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.1.7-confirm-new-spec.png)  
## 4.2.3.2 ディスクカテゴリ、ディスクサイズ変更
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![4.2.3.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.1.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、ディスク編集を押下します。  
![4.2.3.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.2.2-select-change-disk-size.png)  
（３）変更対象ディスクを選択し、「変更」を押下します。  
![4.2.3.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.2.3-select-change-disk.png)  
（４）カテゴリおよびサイズを変更し、「次へ」を押下します。  
※変更に伴ってデスクトップが強制的に停止します。変更後にデスクトップを起動させたい場合は、「変更後に対象のデスクトップを起動します」にチェックを入れてください。  
![4.2.3.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.2.4-change-disk-size.png)  
（５）変更内容を確認し、問題なければ「OK」を押下します。  
![4.2.3.2.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.2.5-change-disk-size-confirm.png)  
（６）ディスクスペック変更開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.2.3.2.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.2.6-change-success.png)  
※ディスク選択画面に戻るため、他の変更内容がない場合は、「完了」を押下します。  
![4.2.3.2.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.2.7-close-window.png)  
※変更が完了したら、画面右上に通知されます。  
![4.2.3.2.8](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.2.8-change-complete-notice.png)  
（７）変更完了後、デスクトップ一覧にて新しいカテゴリおよびサイズに変更されていることを確認できます。  
![4.2.3.2.9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.2.9-confirm-after-change.png)  
## 4.2.3.3 データディスク追加
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![4.2.3.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.1.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、ディスク編集を押下します。  
![4.2.3.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.3.2-select-change-vm.png)  
（３）「追加」を押下します。  
![4.2.3.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.3.3-click-add.png)  
（４）カテゴリおよびサイズを指定し、「次へ」を押下します。  
![4.2.3.3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.3.4-set-disk-size.png)  
（５）変更内容を確認し、問題なければ「OK」を押下します。  
![4.2.3.3.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.3.5-add-disk-confirm.png)  
（６）データディスク追加開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.2.3.3.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.3.6-add-success.png)  
※ディスク選択画面に戻るため、他の変更内容がない場合は、「完了」を押下します。  
![4.2.3.3.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.3.7-close-window.png)  
※追加が完了したら、画面右上に通知されます。  
![4.2.3.3.8](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.3.8-add-complete-notice.png)  
（７）変更完了後、デスクトップ一覧にてデータディスクが追加されていることを確認できます。  
![4.2.3.3.9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.3.9-confirm-new-disk.png)  
## 4.2.3.4 データディスク削除
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![4.2.3.4.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.1.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、ディスク編集を押下します。  
![4.2.3.4.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.4.2-select-change-vm.png)  
（３）削除するデータディスクを選択して、「削除」を押下します。  
![4.2.3.4.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.4.3-click-delete.png)  
（４）削除対象を確認し、問題なければ「OK」を押下します。  
![4.2.3.4.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.4.4-delete-confirm.png)  
（５）データディスク削除開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.2.3.4.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.4.4-delete-success.png)  
※ディスク選択画面に戻るため、他の変更内容がない場合は、「完了」を押下します。  
![4.2.3.4.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.4.5-close-window.png)  
※削除が完了したら、画面右上に通知されます。  
![4.2.3.4.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.4.6-delete-complete-notice.png)  
（７）完了後、デスクトップ一覧にてデータディスクが削除されていることを確認できます。  
![4.2.3.4.9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.3.4.7-confirm-no-data-disk.png)  
## 4.2.6 プロパティ変更
（１）管理者メニューのデスクトップ管理より、「プロパティ変更」を押下します。  
![4.2.6.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.6.1-menu-property.png)  
（２）デスクトップ一覧より、変更対象を選択し、「プロパティ変更」を押下します。  
![4.2.6.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.6.2-property-select-vm.png)  
（３）変更内容を入力し、「次へ」ボタンを押下します。  
![4.2.6.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.6.3-property-set-new-value.png)  
- プロパティ：変更したいプロパティ（グループ名、表示名）を選択します。  
- グループ設定方法：デスクトップがどのグループに所属するかを選択します。  
    - 未所属：Allのグループに表示されます。  
    - 既存のグループから選択：既存のグループより指定します。  
    - 新規作成：新規グループ作成します。  
- 表示名：任意の値を入力します。  

（４）変更内容を確認し、問題なければ「OK」を押下します。  
![4.2.6.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.6.4-property-confirm.png)  
（５）プロパティ変更開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.2.6.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.6.5-property-change-success.png)  
※変更が完了したら、画面右上に通知されます。  
![4.2.6.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.6.6-property-change-complete-notice.png)  
（６）完了後、デスクトップ一覧にてプロパティ変更されていることを確認できます。  
![4.2.6.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.2.6.7-property-confirm-new-value.png)  
## 4.3 イメージ管理
## 4.3.1 イメージの作成
（１）管理者メニューより「イメージ管理」を選択します。  
![4.3.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.1.1-menu-image.png)  
（２）「作成」を押下します。  
![4.3.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.1.2-image-click-create.png)  
（３）各項目を入力し、「次へ」を押下します。  
- イメージ名：任意の名称を入力します。  
- イメージ概要：説明文を入力します。（※省略可）  
- 対象選択：イメージ作成元のデスクトップを選択します。  
- データディスクをイメージに含める：  
チェックを入れると、OSディスク(Cドライブ)以外のディスクを含めたイメージが作成されます。  
- イメージ作成後に対象のデスクトップを起動します：  
チェックを入れると、イメージ作成後に対象デスクトップが自動起動します。  
![4.3.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.1.3-image-create-form.png)  
（４）作成内容を確認し、問題なければ「OK」を押下します。  
※イメージ作成に時間を要する場合がございます。  
![4.3.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.1.4-image-create-confirm.png)  
（５）イメージ作成開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.3.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.1.5-image-create-success.png)  
※完了したら、画面右上に通知されます。  
![4.3.1.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.1.6-image-create-complete.png)  
（６）作成完了後、イメージ一覧画面より確認できます。  
![4.3.1.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.1.7-image-create-complete2.png)  
## 4.3.2 イメージの削除
（１）管理者メニューより「イメージ管理」を選択します。  
![4.3.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.1.1-menu-image.png)  
（２）対象イメージを選択し、「削除」を押下します。  
![4.3.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.2.2-image-select-vm.png)  
（３）削除対象を確認し、「OK」を押下します。  
![4.3.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.2.3-image-delete-confirm.png)  
（４）イメージ削除開始に成功したとのメッセージが表示されることを確認し、完了ボタンを押下します。  
![4.3.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.2.4-image-delete-success.png)  
※完了したら、画面右上に通知されます。  
![4.3.2.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.2.5-image-delete-complete.png)  
（５）イメージが正しく削除されたことを確認します。  
![4.3.2.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.3.2.6-image-confirm-deleted.png)  
## 4.4 スケジュール管理
管理者メニューより「スケジュール管理」を選択します。  
![4.4.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.1.1-schedule-menu.png)  
## 4.4.1 タスクの作成
## 4.4.1.1 定期実行タスク
（１）定期実行タスク（週次繰り返しタスク）の作成ボタンを押下します。  
![4.4.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.1.2-schedule-periodic-create.png)  
（２）以下のパラメータを入力します。  
①タスク名  
②曜日  
③時間  
④実行内容（起動／停止）  
⑤グループ  
⑥対象デスクトップ  
次へを押下します。  
![4.4.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.1.3-schedule-periodic-form.png)  
設定内容を確認し、「OK」ボタンを押下します。  
![4.4.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.1.4-schedule-periodic-confirm.png)  
タスク作成が正しく完了していることを確認します。  
「完了」ボタンを押下します。  
![4.4.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.1.5-schedule-complete.png)  
以上で、タスクの作成が完了しました。  
## 4.4.1.2 一回実行タスク
１回実行タスク（１回のみ実行）の作成ボタンを押下します。  
![4.4.1.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.1.6-schedule-one-time-create.png)  
以下のパラメータを入力します。  
①タスク名  
②日付  
③時間  
④実行内容（起動／停止）  
⑤グループ  
⑥対象デスクトップ  
次へを押下します。  
![4.4.1.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.1.7-schedule-one-time-form.png)  
タスク詳細を確認し、「OK」ボタンを押下します。  
![4.4.1.8](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.1.8-schedule-one-time-comfirm.png)  
タスク作成が正しく完了していることを確認します。  
「完了」ボタンを押下します。  
![4.4.1.9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.1.5-schedule-complete.png)  
以上で、タスクの作成が完了しました。  
## 4.4.2 タスクの編集
## 4.4.2.1 定期実行タスク
作成されたタスクの設定変更を実施する場合は、「変更」ボタンを押下します。  
![4.4.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.2.1-schedule-periodic-change.png)  
以下のパラメータを入力します。  
①タスク名 ※変更不可  
②日付  
③時間  
④実行内容（起動／停止）  
⑤グループ  
⑥対象デスクトップ  
次へを押下します。  
![4.4.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.2.2-schedule-periodic-form.png)  
タスク詳細を確認し、「OK」ボタンを押下します。  
![4.4.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.2.3-schedule-periodic-confirm.png)  
対象デスクトップの変更が完了していることを確認します。  
「完了」ボタンを押下します。  
![4.4.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.2.4-schedule-complete.png)  
以上で、タスクの編集が完了しました。  
## 4.4.2.2 一回実行タスク
作成されたタスクの設定変更を実施する場合は、「変更」ボタンを押下します。  
![4.4.2.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.2.5-schedule-one-time-change.png)  
以下のパラメータを入力します。  
①タスク名 ※変更不可  
②日付  
③時間  
④実行内容（起動／停止）  
⑤グループ  
⑥対象デスクトップ  
次へを押下します。  
![4.4.2.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.2.6-schedule-one-time-form.png)  
タスク詳細を確認し、「OK」ボタンを押下します。  
![4.4.2.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.2.7-schedule-one-time-confirm.png)  
対象デスクトップの変更が完了していることを確認します。  
「完了」ボタンを押下します。  
![4.4.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.2.4-schedule-complete.png)  
以上で、タスクの編集が完了しました。  
## 4.4.3 タスクの削除
※定期実行／一回実行を問わず、どちらも同じ手順になります。  
対象のタスクにチェックを入れ、削除ボタンを押下します。  
![4.4.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.3.1-schedule-delete-click.png)  
削除対象の詳細を確認後、問題なければOKボタンを押下します。  
![4.4.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.3.2-schedule-delete-confirm.png)  
タスクが正しく削除されたことを確認します。完了ボタンを押下します。  
![4.4.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.4.3.3-schedule-delete-complete.png)  
## 4.5 アイドルタイムタスク管理
管理メニューより、「アイドルタイムタスク管理」を押下します。  
![4.5.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.1-idletime-menu.png)  
## 4.5.1 アイドルタイムタスクの作成
（１）タスク一覧の作成ボタンを押下します。  
![4.5.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.2-idletime-click-create.png)  
（２）タスク名と説明を入力します。  
※説明は省略可  
![4.5.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.3-idletime-job-name.png)  
（３）本タスクの処理内容（デスクトップの課金停止 または 作成時のイメージに初期化）を選択します。  
![4.5.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.4-idletime-what-to-do.png)  
（４）アイドルタイムアウトによる処理の実行  
仮想デスクトップが一定時間以上アイドル状態だった場合に処理を実行するかを指定します。  
また、実行する場合は、アイドルタイムを分単位で指定します。  
![4.5.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.5-idletime-timeout.png)  
（５）その他の実行オプション  
![4.5.1.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.6-idletime-other-options.png)  
- デスクトップにログオンしているユーザがいない場合に処理を実行するか  
タスク実行時にログオン数0を検知した場合に実行するかを指定します。  
- デスクトップがシャットダウン状態かつ課金継続状態の場合に処理を実行するか  
タスク実行時にシャットダウン状態かつ課金継続状態を検知した場合に実行するかを指定します。  

（６）処理を実行したいデスクトップを選択します。  
※複数選択可  
![4.5.1.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.7-idletime-select-daas.png)  
（７）以上の項目を入力後、「次へ」を押下します。  
![4.5.1.8](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.8-idletime-create-next.png)  
（８）最終確認後、問題なければOKボタンを押下します。  
![4.5.1.9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.9-idletime-create-confirm.png)  
タスクが正しく作成されたことを確認します。完了ボタンを押下します。  
![4.5.1.10](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.10-idletime-create-complete.png)  
以上でタスクの作成が完了しました。  

## 4.5.2 アイドルタイムタスクの設定変更
アイドルタイムタスクの設定を変更したい場合は、以下の手順を実施します。  
（１）対象タスクの「設定変更」ボタンを押下します。  
![4.5.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.2.1-idletime-click-change-button.png)  
（２）変更したい項目の値を変更します。  
※「タスク名」は変更できません。  
![4.5.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.2.2-idletime-change-settings.png)  
（３）タスクの有効状態  
タスクを無効化したり、過去に無効化したタスクを有効化したりできます。  
![4.5.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.2.3-idletime-enable-disable-job.png)  
（４）処理対象のデスクトップを変更したい場合は変更します。  
※複数選択可  
![4.5.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.2.4-idletime-select-daas.png)  
（５）以上の項目を入力後、「次へ」を押下します。  
![4.5.2.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.1.8-idletime-create-next.png)  
（６）最終確認後、問題なければOKボタンを押下します。  
![4.5.2.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.2.6-idletime-edit-confirm.png)  
タスクが正しく変更されたことを確認します。完了ボタンを押下します。  
![4.5.2.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.2.7-idletime-edit-complete.png)  
以上でタスクの設定変更が完了しました。  
## 4.5.3 アイドルタイムタスクの削除
アイドルタイムタスクを削除したい場合は、以下の手順を実施します。  
（１）対象のタスクにチェックを入れ、削除ボタンを押下します。  
![4.5.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.3.1-idletime-select-targets.png)  
（２）削除対象の詳細を確認後、問題なければ「OK」ボタンを押下します。  
![4.5.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.3.2-idletime-delete-confirm.png)  
（３）「完了」ボタンを押下します。  
![4.5.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.5.3.3-idletime-delete-complete.png)  
以上でタスクの削除が完了しました。  

## 4.6 ポータルユーザ管理
## 4.6.1 新規ユーザ作成
ポータルユーザには管理者ユーザと一般ユーザの2種類が存在します。  
それぞれのユーザを新規作成する手順は以下の通りです。  
## 4.6.1.1 新規管理者ユーザ作成
管理メニューよりポータユーザ管理を押下します。  
![4.6.1.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.1-user-menu.png)  
「管理者ユーザ管理」の作成ボタンを押下します。  
![4.6.1.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.2-admin-user-create.png)  
以下の情報を入力し、OKボタンを押下します。  
- ユーザ名  
- パスワード  
![4.6.1.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.3-admin-user-create-form.png)  
ユーザーが正しく作成されたことを確認します。  
![4.6.1.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.4-admin-user-create-complete.png)  
以上で、新規管理者ユーザーの作成が完了します。  
## 4.6.1.2 新規一般ユーザ作成
管理メニューよりポータユーザ管理を押下します。  
![4.6.1.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.1-user-menu.png)  
「一般ユーザ管理」の作成ボタンを押下します。  
![4.6.1.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.2.2-normal-user-create.png)  
以下の情報を入力し、OKボタンを押下します。  
- ユーザ名  
- パスワード  
- 対象デスクトップ  
![4.6.1.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.2.3-normal-user-create-form.png)  
最終確認後、問題なければOKボタンを押下します。  
![4.6.1.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.2.4-normal-user-create-confirm.png)  
ユーザーが正しく作成されたことを確認します。  
![4.6.1.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.2.5-normal-user-create-complete.png)  
以上で、新規管理者ユーザーの作成が完了します。  
## 4.6.2 既存ユーザーパスワード変更
管理メニューよりポータユーザ管理を押下します。  
![4.6.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.1-user-menu.png)  
対象ユーザーのパスワード変更ボタンを押下します。  
![4.6.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.2.1-user-change-password.png)  
新しいパスワードを入力し、OKボタンを押下します。  
![4.6.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.2.2-user-change-password-form.png)  
以下のメッセージが表示されると完了です。  
![4.6.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.2.3-user-change-password-complete.png)  
## 4.6.3 既存ユーザー削除
管理メニューよりポータユーザ管理を押下します。  
![4.6.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.1-user-menu.png)  
対象ユーザーの削除ボタンを押下します。  
![4.6.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.3.1-user-delete.png)  
削除対象を確認し、問題なければOKを押下します。  
![4.6.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.3.2-user-delete-confirm.png)  
ユーザーが削除されたことを確認します。  
![4.6.3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.3.3-user-delete-complete.png)  
## 4.6.4 既存ユーザーMFA初期化
管理メニューよりポータユーザ管理を押下します。  
![4.6.4.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.1-user-menu.png)  
対象ユーザーのMFA初期化ボタンを押下します。  
![4.6.4.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.4.1-user-mfa-reset.png)  
問題ないことを確認したら□にチェックを入れてOKボタンを押下します。  
![4.6.4.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.4.2-user-mfa-reset-confirm.png)  
以下のメッセージが表示されると完了です。  
![4.6.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.4.3-user-mfa-reset-complete.png)  
## 4.6.5 既存一般ユーザー連携デスクトップ変更
管理メニューよりポータユーザ管理を押下します。  
![4.6.5.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.1-user-menu.png)  
対象一般ユーザーの変更ボタンを押下します。  
![4.6.5.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.5.1-user-change-desktop.png)  
対象一般ユーザーに紐づけるデスクトップを選択し、次へボタンを押下します。  
![4.6.5.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.5.2-user-change-desktop-form.png)  
問題ないことを確認したら□にチェックを入れてOKボタンを押下します。  
![4.6.5.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.5.3-user-change-desktop-confirm.png)  
以下のメッセージが表示されると完了です。  
![4.6.5.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.5.4-user-change-desktop-complete.png)  
## 4.6.6 既存ユーザーロック解除
管理メニューよりポータユーザ管理を押下します。  
![4.6.6.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.1-user-menu.png)  
対象ユーザのロック解除ボタンを押下します。  
※ロック中のユーザだけロック解除ボタンが表示されます。  
![4.6.6.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.6.1-user-unlock.png)  
問題ないことを確認したら□にチェックを入れてOKボタンを押下します。  
![4.6.6.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.6.2-user-unlock-confirm.png)  
以下のメッセージが表示されると完了です。  
![4.6.6.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.6.3-user-unlock-complete.png)  