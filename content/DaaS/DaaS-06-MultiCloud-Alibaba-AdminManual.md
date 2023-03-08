---
title: "Cloud Remote Desktop on Alibaba(MultiCloud)操作ポータル - 管理者マニュアル"
metaTitle: "Cloud Remote Desktop on Alibaba(MultiCloud)操作ポータル - 管理者マニュアル"
metaDescription: "Cloud Remote Desktop on Alibaba(MultiCloud)操作ポータルの管理者向けマニュアルです。"
date: "2022-08-02"
author: "Yoshihiro Matsuda"
thumbnail: "/images/DaaS-02-Portal-Manual/3.1-portal-login.png"
---

## 1. はじめに
本資料は、管理者向けのCloud Remote Desktop on Alibaba(MultiCloud)操作ポータルを利用するための手順を記述したものです。  
## 2. ログイン
（１）弊社より事前に展開したショートカットより、操作ポータルを開きます。  
※ログインページにて「詳細設定」を開きます。  
 ![詳細設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/2.png "詳細設定")  
（２）「xxxxxxにアクセスする」リンクをクリックします。  
 ![SSL確認](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-03-RemoteGateway-AdminManual/1/3.png "SSL確認")   
（３）以下のユーザー名とパスワードを入力し、ログインを押下します。  
・ユーザー名：弊社より事前に展開したもの  
・パスワード：弊社より事前に展開したもの  
![3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/3.1-portal-login.png)  

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
## 3.1 プロバイダー
ヘッダー左側のプロバイダーボタンを押下することで、クラウドプロバイダーごとのデスクトップ一覧を切り替えることができます。  
![3.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.1.0-provider.png)  
## 3.2 地域
ヘッダー左側の地域ボタンを押下することで、地域ごとのデスクトップ一覧を切り替えることができます。  
※デフォルトは日本（東京）リージョンが選択されています。  
![3.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.1.1-region.png)  
## 3.3 ログイン情報
ヘッダー右側に、ご自身のユーザ名と前回ログイン日時が表示されます。  
![3.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/3.2.1-logon-time.png)  
## 3.4 ドキュメント
ヘッダ右側のドキュメントボタンを押下することで、テクニカルサイトにアクセスすることができます。  
![3.4.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.1.4-document.png)  
## 3.5 サポート
ヘッダー右側のサポートボタンを押下することで、ソフトバンク（元SBクラウド）へ問い合わせすることができます。  
※問い合わせは別途弊社のサポートサービスと契約する必要があります。  
![3.5.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.1.2-support.png)  
## 3.6 ログアウト
ヘッダ右側のログアウトボタンを押下することで、ポータルよりログアウトすることができます。  
![3.6.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.1.3-logout.png)  
## 4. 管理者メニュー
## 4.1 ダッシュボード
ダッシュボード機能についてご紹介します。  
（１）グループ選択：デスクトップをグループ分けて管理することが可能です。defaultグループは全てのデスクトップが表示されます。  
![5.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.1.1-select-group.png)  
（２）デスクトップ一覧：現在利用中のデスクトップ一覧を確認できます。  
下記パラメータ確認できます。  
- デスクトップ名  
- OSユーザ名  
- ステータス  
- スペック  
- ディスク  
- IPアドレス  
- 課金タイプ  
- 有効期限  
- バーストモード  
- OSバージョン  
![5.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.1.2-desktop-list.png)  
## 4.2 デスクトップ管理
## 4.2.1 作成・削除
## 4.2.1.1 デスクトップの作成
（１）デスクトップ管理＞作成・削除を選択します。  
![4.2.1.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.1.1.1-menu-create.png)  
（２）作成ボタンを押下します。  
![4.2.1.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.2-create-desktop.png)  
（３）スペック選択は推奨スペック、あるいはカスタムをご選択ください。  
※本手順ではカスタムを選択します。  
![4.2.1.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.3-create-spec.png)  
（４）デスクトップの作成元イメージを指定します。  
デフォルトのイメージを使用するか、イメージ管理（後述）で作成した任意のイメージを使用します。  
※スペック選択で推奨スペックを選択した場合は指定できません。  
![4.2.1.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.1.1.3-create-image.png)  
（５）システムディスクのタイプとサイズを入力します。  
※本手順ではHDDの40GBとします。  
![4.2.1.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.1.1.4-create-system-disk.png)  
（６）データディスクの有無を指定します。  
**データディスクありの場合**  
個数を入力し、ディスクのタイプとサイズを入力します。  
※本手順では1個のデータディスク（HDD、40GB）を作成します。  
![4.2.1.1.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.1.1.5-create-data-disk.png)  
**データディスクなしの場合**  
個数に0を入力します。  
![4.2.1.1.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.5-create-data-disk2.png)  
（７）デスクトップがどのグループに所属するかを選択します。  
- 未所属：defaultのグループに表示されます。  
- 既存のグループから選択：既存のグループより指定します。  
- 新規作成：新規グループ作成します。  

本手順では未所属を選択します。  
![4.2.1.1.8](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.6-create-group.png)  
（８）その他設定  
- VSwitch：デスクトップが所属するVSwitchを選択します。  
- ユーザー名：user-xxx(xxxはインスタンス名のecs_daas_xxxと同じ三桁数字になります。)  
- パスワード：デスクトップのログインパスワードを設定します。（※作成されたデスクトップのユーザー名はuser-xxxとなります。）  
- 課金方式：従量課金またはサブスクリプションを選択します。  
- 作成台数：デスクトップの作成台数を設定します。（2以上を設定した場合、同様なデスクトップが複数作成されます。）  
![4.2.1.1.9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.7-create-others.png)  
（９）最終確認後、問題なければOKボタンを押下します。  
![4.2.1.1.10](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.8-create-comfirm.png)  
（１０）デスクトップが正しく作成されていることを確認し完了ボタンを押下します。  
![4.2.1.1.11](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.1.1.9-create-success.png)  
以上でデスクトップの作成が完了しました。  
※デスクトップ作成は内部処理のため約5分間かかります。5分後作成対象のデスクトップを一度再起動後、ログイン確認お願いいたします。  
## 4.2.1.2 デスクトップの削除
（１）デスクトップ管理＞作成・削除を選択します。  
![4.2.1.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.1.1.1-menu-create.png)  
（２）削除したいデスクトップにチェックを入れて削除ボタンを押下します。  
![4.2.1.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.1.2.2-delete-check.png)  
（３）最終確認後、OKボタンを押下します。  
![4.2.1.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.1.2.3-delete-confirm.png)  
以上で、デスクトップの削除が完了しました。  
## 4.2.2 起動・再起動・停止
## 4.2.2.1 デスクトップの起動
（１）デスクトップ管理＞起動・再起動・停止を選択します。  
![4.2.2.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.1.1-menu-start.png)  
（２）デスクトップの起動：  
①デスクトップ一覧より、一台または複数台のデスクトップを選択します。  
②「一括起動」を選択します。  
※「ステータス」が起動中と停止中のタスクを同時に選択することはできません。  
![4.2.2.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.1.1-desktop-start.png)  
（３）ポップアップ画面にて、起動対象のデスクトップを確認します。「OK」を押下します。  
![4.2.2.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.1.2-desktop-start-confirm.png)  
（４）処理実行完了まで待ちます。  
※処理中、他のメニューを操作することはできません。  
![4.2.2.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.3.3-desktop-stop-wait.png)  
（５）起動が成功したことを確認します。  
「完了」ボタンを押下します。  
![4.2.2.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.1.4-desktop-start-close.png)  
## 4.2.2.2 デスクトップの再起動
（１）デスクトップ管理＞起動・再起動・停止を選択します。  
![4.2.2.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.1.1-menu-start.png)  
（２）デスクトップの再起動：  
①デスクトップ一覧より、一台または複数台のデスクトップを選択します。  
②「一括再起動」を選択します。  
※「ステータス」が停止中のデスクトップを選択することはできません。  
![4.2.2.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.2.1-desktop-restart.png)  
（３）ポップアップ画面にて再起動対象のデスクトップを確認します。  
「再起動」を押下します。  
※デスクトップがフリーズしている場合は、「強制再起動」を押下します。  
![4.2.2.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.2.2-desktop-restart-confirm.png)  
（４）処理実行完了まで待ちます。  
※処理中、他のメニューを操作することはできません。  
![4.2.2.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.3.3-desktop-stop-wait.png)  
（５）再起動が成功したことを確認します。  
「完了」ボタンを押下します。  
![4.2.2.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.2.4-desktop-restart-close.png)  
## 4.2.2.3 デスクトップの停止
（１）デスクトップ管理＞起動・再起動・停止を選択します。  
![4.2.2.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.1.1-menu-start.png)  
（２）デスクトップの停止：  
①デスクトップ一覧より、一台または複数台のデスクトップを選択します。  
②「一括停止」を選択します。  
※「ステータス」が停止中、または起動中と停止中複数のデスクトップを選択することはできません。  
![4.2.2.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.3.1-desktop-stop.png)  
（３）ポップアップにて停止対象のデスクトップ一覧を確認します。  
「停止」ボタンを押下します。  
※デスクトップがフリーズしている場合は、「強制停止」を押下します。  
![4.2.2.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.3.2-desktop-stop-confirm.png)  
（４）処理実行完了まで待ちます。  
※処理中、他のメニューを操作することはできません。  
![4.2.2.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.3.3-desktop-stop-wait.png)  
（５）タスクが成功したことを確認します。  
「完了」ボタンを押下します。  
![4.2.2.3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.2.3.4-desktop-stop-close.png)  
## 4.2.3 スペック変更
## 4.2.3.1 デスクトップスペック変更
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![5.2.3.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.1.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、デスクトップスペック変更を押下します。  
![5.2.3.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.1.2-select-desktop.png)  
（３）変更後のスペックを選択します。「次へ」を押下します。  
![5.2.3.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.1.3-select-spec.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.3.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.1.4-confirm-change.png)  
（５）変更完了後、デスクトップ一覧にて新しいスペックに変更されていることを確認できます。  
![5.2.3.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.1.5-confirm-new-spec.png)  
## 4.2.3.2 ディスクサイズ変更
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![5.2.3.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.1.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、ディスクサイズ変更を押下します。  
![5.2.3.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.2.2-select-change-disk-size.png)  
（３）変更対象ディスク及び変更後のサイズを選択し、「次へ」を押下します。  
![5.2.3.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.2.3-select-disk-size.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.3.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.2.4-confirm-change.png)  
（５）変更完了後、デスクトップ一覧にて新しいサイズに変更されていることを確認できます。  
![5.2.3.2.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.2.5-confirm-new-disk-size.png)  
## 4.2.3.3 ディスクカテゴリ変更
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![5.2.3.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.1.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、ディスクカテゴリ変更を押下します。  
![5.2.3.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.3.2-select-change-disk-type.png)  
（３）変更対象ディスクを選択し、「次へ」を押下します。  
![5.2.3.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.3.3-select-target-disk.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.3.3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.3.4-confirm-change.png)  
## 4.2.3.4 データディスク追加
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![5.2.3.4.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.1.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、データディスク追加を押下します。  
![5.2.3.4.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.4.2-select-add-disk.png)  
（３）ディスクの作成方法を選択します。本手順では空のディスクを作成を選択します。  
次へディスクのカテゴリとサイズを選択し、「次へ」を押下します。  
![5.2.3.4.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.4.3-select-method.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.3.4.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.4.4-confirm-change.png)  
（５）追加完了後、デスクトップ一覧にてデータディスクが追加されたことを確認できます。  
![5.2.3.4.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.3.4.5-confirm-new-data-disk.png)  
## 4.2.4 課金タイプ変更
（１）管理者メニューより、「課金タイプ変更」を押下します。  
![5.2.4.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.4.1-select-change-payment-method.png)  
（２）デスクトップ一覧より、変更対象を選択し、「変更」を押下します。  
![5.2.4.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.4.2-select-target-ecs.png)  
（３）購入期間と自動更新（必要な場合はチェック）を選択し、「次へ」を押下します。  
![5.2.4.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.4.3-select-renew-duration.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.4.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.4.4-confirm-change.png)  
（５）変更完了後、デスクトップ一覧にて課金タイプを確認できます。  
![5.2.4.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.4.5-confirm-result.png)  
## 4.2.5 バーストモード変更
（１）管理者メニューより、「バーストモード変更」を押下します。  
![5.2.5.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.5.1-select-burst-mode.png)  
（２）デスクトップ一覧より、変更対象を選択し、「無制限モードに変更」を押下します。  
![5.2.5.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.5.2-select-target-ecs.png)  
（３）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.5.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.5.3-confirm-change.png)  
（４）変更後、デスクトップ一覧にてバーストモードは「無制限モード」に変更されたことを確認できます。  
![5.2.5.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.5.4-confirm-result.png)  
## 4.2.6 グループ変更
（１）管理者メニューのデスクトップ管理より、「グループ変更」を押下します。  
![5.2.6.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.6.1-select-change-group.png)  
（２）デスクトップ一覧より、変更対象を選択し、「変更」を押下します。  
![5.2.6.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.2.6.2-change-group.png)  
（３）問題ないことを確認したら□にチェックを入れてOKボタンを押下します。  
![5.2.6.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.6.3-confirm-change-group.png)  
（４）グループが変更されていることを確認します。  

## 4.3 スナップショット管理
## 4.3.1 スナップショットの作成
（１）管理者メニューより、「スナップショット管理」を選択します。  
![5.3.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.1.1-select-snapshot-mgmt.png)  
（２）デスクトップ一覧より、作成対象を選択し、「スナップショット作成」を押下します。  
![5.3.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.3.1.2-select-target-ecs.png)  
（３）対象ディスクを選択し、スナップショットの名前、説明文（任意）を入力し、保存期間を選択の上、「次へ」を押下します。  
![5.3.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.3.1.3-select-target-snapshot.png)  
（４）作成内容を確認し、問題なければ「OK」を押下します。  
![5.3.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.1.4-confirm-change.png)  
（５）スナップショット一覧より、スナップショットの進捗を確認できます。  
![5.3.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.3.1.5-confirm-result.png)  
## 4.3.2 スナップショットのロールバック
（１）管理者メニューより、「スナップショット管理」を選択します。  
![5.3.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.2.1-select-snapshot-mgmt.png)  
（２）ロールバック対象を選択し、「スナップショット一覧表示＆ロールバック」を押下します。  
![5.3.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.3.2.2-select-target-ecs.png)  
（３）対象スナップショットを選択し、「ロールバック」を押下します。  
![5.3.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.3.2.3-select-target-snapshot.png)  
（４）ロールバック後、インスタンスを起動するかどうかを選択し、問題なければ、「OK」を押下します。  
![5.3.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.2.4-confirm-change.png)  
（５）ロールバックが正しく完了したことを確認します。  
![5.3.2.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.2.5-confirm-result.png)  
## 4.3.3 スナップショットの削除
（１）管理者メニューより、「スナップショット管理」を選択します。  
![5.3.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.3.1-select-snapshot-mgmt.png)  
（２）削除対象を選択し、「スナップショット一覧表示＆ロールバック」を押下します。  
![5.3.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.3.2.2-select-target-ecs.png)  
（３）削除対象スナップショットを選択し、「削除」を押下します。  
![5.3.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.3.3.3-select-target-snapshot.png)  
（４）削除内容を確認し、問題なければ「OK」を押下します。  
![5.3.3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.3.4-confirm-change.png)  
（５）削除成功したことを確認します。  
![5.3.3.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.3.5-confirm-result.png)  
## 4.4 イメージ管理
## 4.4.1 イメージの作成
（１）管理者メニューより「イメージ管理」を選択します。  
![5.4.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.4.1.1-select-image-mgmt.png)  
（２）「作成」を押下します。  
![5.4.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.4.1.2-select-create.png)  
（３）作成方法を選択します。本手順ではデスクトップから作成を選択します。  
対象デスクトップを選択します。  
イメージ名と説明文を入力し、「次へ」を押下します。  
![5.4.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.4.1.3-select-target-ecs.png)  
（４）作成内容を確認し、問題なければ「OK」を押下します。  
※イメージ作成に時間を要する場合がございます。  
![5.4.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.4.1.4-confirm-change.png)  
（５）作成完了後、イメージ一覧画面より確認できます。  
![5.4.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.4.1.5-confirm-result.png)  
## 4.4.2 イメージの削除
（１）管理者メニューより「イメージ管理」を選択します。  
![5.4.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.4.2.1-select-image-mgmt.png)  
（２）対象イメージを選択し、「削除」を押下します。  
![5.4.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.4.2.2-select-target-image.png)  
（３）イメージに紐づくスナップショットも同時に削除するかどうかを選択し、「OK」を押下します。  
![5.4.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.4.2.3-confirm-change.png)  
（４）イメージが正しく削除されたことを確認します。  
![5.4.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.4.2.4-confirm-result.png)  
## 4.5 スケジュール管理
## 4.5.1 タスクの作成
## 4.5.1.1 定期実行タスク
（１）定期実行タスク（週次繰り返しタスク）の作成ボタンを押下します。  
![5.5.1.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.1.1.1-scheduler-weekly-create.png)  
（２）以下のパラメータを入力します。  
①タスク名  
②曜日  
③時間  
④実行内容（起動／停止）  
⑤グループ  
⑥対象デスクトップ  
次へを押下します。  
![5.5.1.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.1.1.2-scheduler-weekly-param.png)  
設定内容を確認し、「作成」ボタンを押下します。  
![5.5.1.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.1.1.3-scheduler-weekly-confirm.png)  
タスク作成が正しく完了していることを確認します。  
「完了」ボタンを押下します。  
![5.5.1.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.1.1.4-scheduler-weekly-close.png)  
以上で、タスクの作成が完了しました。  
## 4.5.1.2 一回実行タスク
１回実行タスク（１回のみ実行）の作成ボタンを押下します。  
![5.5.1.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.1.2.1-scheduler-onetime-create.png)  
以下のパラメータを入力します。  
①タスク名  
②日付  
③時間  
④実行内容（起動／停止）  
⑤グループ  
⑥対象デスクトップ  
次へを押下します。  
![5.5.1.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.1.2.2-scheduler-onetime-param.png)  
タスク詳細を確認し、「作成」ボタンを押下します。  
![5.5.1.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.1.2.3-scheduler-onetime-confirm.png)  
タスク作成完了していることを確認します。  
「完了」ボタンを押下します。  
![5.5.1.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.1.1.4-scheduler-weekly-close.png)  
以上で、タスクの作成が完了しました。  
## 4.5.2 タスクの編集
## 4.5.2.1 定期実行タスク
作成されたタスクに、デスクトップを追加／削除を実施する場合は、「変更」ボタンを押下します。  
![5.5.2.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.2.1.1-scheduler-weekly-edit.png)  
スケジュールの対象デスクトップを選び直して、「次へ」を押下します。  
![5.5.2.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.2.1.2-scheduler-weekly-edit-next.png)  
タスクの詳細を確認し、「確定」を押下します。  
![5.5.2.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.2.1.3-scheduler-weekly-edit-confirm.png)  
対象デスクトップの変更が完了していることを確認します。  
「完了」ボタンを押下します。  
![5.5.2.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.2.1.4-scheduler-weekly-edit-close.png)  
以上で、タスクの編集が完了しました。  
## 4.5.2.2 一回実行タスク
作成されたタスクに、デスクトップを追加／削除を実施する場合は、「変更」ボタンを押下します。  
![5.5.2.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.2.2.1-scheduler-onetime-edit.png)  
スケジュールの対象デスクトップを選び直して、「次へ」を押下します。  
![5.5.2.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.2.2.2-scheduler-onetime-edit-next.png)  
タスクの詳細を確認し、「確定」を押下します。  
![5.5.2.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.2.2.3-scheduler-onetime-edit-confirm.png)  
対象デスクトップの変更が完了していることを確認します。  
「完了」ボタンを押下します。  
![5.5.2.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.2.1.4-scheduler-weekly-edit-close.png)  
以上で、タスクの編集が完了しました。  
## 4.5.3 タスクの削除
## 4.5.3.1 定期実行タスク
対象のタスクにチェックを入れます。  
![5.5.3.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.1.1-scheduler-weekly-delete-check.png)  
削除ボタンを押下します。  
![5.5.3.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.1.2-scheduler-weekly-delete-button.png)  
削除対象の詳細を確認後、問題なければはいボタンを押下します。  
![5.5.3.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.1.3-scheduler-weekly-delete-confirm.png)  
タスクが正しく削除されたことを確認します。  
完了ボタンを押下します。  
![5.5.3.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.3.1.4-scheduler-weekly-delete-close.png)  
## 4.5.3.2 一回実行タスク
対象のタスクにチェックを入れます。  
![5.5.3.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.2.1-scheduler-onetime-delete-check.png)  
削除ボタンを押下します。  
![5.5.3.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.2.2-scheduler-onetime-delete-button.png)  
削除対象の詳細を確認後、問題なければはいボタンを押下します。  
![5.5.3.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.2.3-scheduler-onetime-delete-confirm.png)  
タスクが正しく削除されたことを確認します。  
完了ボタンを押下します。  
![5.5.3.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.5.3.1.4-scheduler-weekly-delete-close.png)  
## 4.6 アイドルタイムアウト管理
左メニューより、「アイドルタイムアウト管理」を押下します。  
![4.8.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.8.1.1-menu.png)  
## 4.6.1 アイドルタイムアウトジョブの作成
（１）ジョブ一覧の作成ボタンを押下します。  
![4.8.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.1.2-click-create.png)  
（２）ジョブ名と説明を入力します。  
※説明は省略可  
![4.8.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.1.3-job-name.png)  
（３）本ジョブの処理内容（デスクトップの課金停止 または 作成時のイメージに初期化）を選択します。  
※作成時に選択したイメージが削除されている場合、初期化は失敗します。  
![4.8.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.1.4-what-to-do.png)  
（４）アイドルタイムアウトによる処理の実行  
仮想デスクトップが一定時間以上アイドル状態だった場合に処理を実行するかを指定します。  
また、実行する場合は、アイドルタイムを分単位で指定します。  
![4.8.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.1.5-idle-timeout.png)  
（５）その他の実行オプション  
![4.8.1.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.1.6-other-options.png)  
- デスクトップにログオンしているユーザがいない場合に処理を実行するか  
ジョブ実行時にログオン数0を検知した場合に実行するかを指定します。  
- デスクトップがシャットダウン状態かつ課金継続状態の場合に処理を実行するか  
ジョブ実行時にシャットダウン状態かつ課金継続状態を検知した場合に実行するかを指定します。  

（６）処理を実行したいデスクトップを選択します。  
※複数選択可  
![4.8.1.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.8.1.7-select-daas.png)  
（７）以上の項目を入力後、「次へ」を押下します。  
![4.8.1.8](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.1.8-next.png)  
（８）最終確認後、問題なければOKボタンを押下します。  
![4.8.1.9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.1.9-end.png)  
以上でジョブの作成が完了しました。  

## 4.6.2 アイドルタイムアウトジョブの設定変更
アイドルタイムアウトジョブの設定を変更したい場合は、以下の手順を実施します。  
（１）対象ジョブの「設定変更」ボタンを押下します。  
![4.8.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.2.1-click-change-button.png)  
（２）変更したい項目の値を変更します。  
※「ジョブ名」は変更できません。  
![4.8.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.2.2-change-settings.png)  
（３）ジョブの有効状態  
ジョブを無効化したり、過去に無効化したジョブを有効化したりできます。  
![4.8.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.2.3-enable-disable-job.png)  
（４）処理対象のデスクトップを変更したい場合は変更します。  
※複数選択可  
![4.8.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.8.2.4-select-daas.png)  
（５）以上の項目を入力後、「次へ」を押下します。  
![4.8.1.8](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.1.8-next.png)  
（６）最終確認後、問題なければOKボタンを押下します。  
![4.8.1.9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.1.9-end.png)  
以上でジョブの設定変更が完了しました。  
## 4.6.3 アイドルタイムアウトジョブの削除
アイドルタイムアウトジョブを削除したい場合は、以下の手順を実施します。  
（１）対象のジョブにチェックを入れます。  
![4.8.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.3.1-select-targets.png)  
（２）削除ボタンを押下します。  
![4.8.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.3.2-click-delete-button.png)  
（３）削除対象の詳細を確認後、問題なければ「OK」ボタンを押下します。  
![4.8.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.3.3-end.png)  
（４）「完了」ボタンを押下します。  
![4.8.3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.8.3.4-end2.png)  
以上でジョブの削除が完了しました。  
## 4.7 ネットワークリソース管理
## 4.7.1 SAG管理
## 4.7.1.1 SAGインスタンス情報管理
（１）管理者メニューより、「ネットワークリソース管理」＞「SAG管理」を選択します。  
![5.6.1.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.1.1-select-sag-mgmt.png)  
（２）SAG APPインスタンス情報より、既存のSAGインスタンスを確認できます。  
![5.6.1.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.1.2-sag-instance-info.png)  
（３）ユーザー数を変更し、CIDRを追加することもできます。  
![5.6.1.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.1.3-sag-change-user.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.6.1.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.1.4-confirm-change.png)  
（５）変更成功後、SAG APPインスタンス情報より確認できます。  
## 4.7.1.2 SAGユーザー情報管理
（１）SAGユーザー情報画面からSAGユーザー情報を確認できます。  
![5.6.1.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.2.1-sag-user-info.png)  
（２）ユーザー追加の場合は、メールアドレスとパスワードを入力し、「追加」を押下します。  
![5.6.1.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.2.2-add-sag-user.png)  
（３）追加内容を確認し、問題なければ「OK」を押下します。  
![5.6.1.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.2.3-confirm-change.png)  
（４）追加完了後、SAP APPユーザー情報一覧に追加したユーザーを確認できます。  
## 4.7.2 セキュリティグループ
### 4.7.2.1 ルールの表示
（１）管理者メニューより、セキュリティグループを選択します。  

![4.7.2.1.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.1.1-sg-menu.png)  

（２）プルダウンより表示対象のセキュリティグループを選択します。  

![4.7.2.1.2](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.1.2-sg-select.png)  

（３）対象セキュリティグループのルール一覧が表示されます。  
　　　インバウンドとアウトバウンドタブにてそれぞれのルールが表示されます。  

![4.7.2.1.3](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.1.3-sg-rule-list.png)  

### 4.7.2.2 ルールの追加
（１）インバウンドタブを選択したまま、「ルールの追加」ボタンを押下します。  
※アウトバウンドルールを追加する場合は、アウトバウンドタブを選択したまま、「ルールの追加」ボタンを押下します。  

![4.7.2.2.0](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.2.0-sg-add-rule-button.png)  
  
以下の項目を入力します。  
・権限付与ポリシー：プルダウンより選択（許可／拒否）します。  
・優先度：1から100までの数値を入力します。デフォルトは1（一番優先度高い）となります。  
・プロトコルタイプ：プルダウンより選択します。  
・ポート範囲：1から65535までの数値を入力します。  
・送信元／送信先：IPアドレスのCIDRフォーマットで入力します。例：47.12.34.56/32、192.168.0.0/24  
・説明（任意）：セキュリティルールの説明文を入力します。  
  
  ![4.7.2.2.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.2.1-sg-add-rule.png)  
  
入力後、
![4.7.2.2.2](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.2.2-sg-add-rule-confirm.png)
ボタンを押下して、入力を確定します。  
複数ルールを追加する場合は、
![4.7.2.2.3](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.2.3-sg-add-rule-add-col.png)
ボタンを押下して入力行を追加できます。  
行を削除する場合は、
![4.7.2.2.4](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.2.4-sg-add-rule-del-col.png)
ボタンを押下して、削除可能です。  
  
（２）追加対象のセキュリティグループを選択します。複数セキュリティグループを追加する場合は、複数チェックをいれます。  

![4.7.2.2.5](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.2.5-sg-add-rule-select-sg.png)  

（３）「次へ」ボタンを押下します。  

（４）追加内容を確認し、問題なければチェックし、「OK」ボタンを押下します。  

![4.7.2.2.6](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.2.6-sg-add-rule-confirm.png)  

（５）ルールが正しく追加されたことを確認します。  

### 4.7.2.3 ルールの削除
（１）削除対象ルール行の「削除」ボタンを押下します。  

![4.7.2.3.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.3.1-sg-del-rule.png)  

（２）削除内容を確認し、問題なければチェックを入れ、「OK」ボタンを押下します。  

![4.7.2.3.2](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.2.3.2-sg-del-rule-confirm.png)  

（３）ルールが正しく削除されたことを確認します。  
  
## 4.7.3 NATゲートウェイ
### 4.7.3.1 NATゲートウェイ情報の確認
（１）管理者メニューより、NATゲートウェイを選択します。  

![4.7.3.1.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.3.1.1-nat-menu.png)  

（２）基本情報タブにてNATゲートウェイの基本情報を確認することができます。  
  
以下の項目を確認できます。  

・インスタンス名：NATゲートウェイの名前  
・説明：NATゲートウェイの用途  
・VPC：NATゲートウェイと関連付けているVPCのID  
・ステータス：NATゲートウェイのステータス  
・プライベートIP：NATゲートウェイのプライベートIPアドレス  

![4.7.3.1.2](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.3.1.2-nat-info-1.png)  
  
（３）関連するEIPタブにて、NATゲートウェイのグローバルIP情報を確認することができます。  
  
以下の項目を確認できます。  

・EIPアドレス：グローバルIPアドレスの値  
・帯域幅：IPアドレスの帯域幅  
・ステータス：IPアドレスのステータス  

![4.7.3.1.2](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.3.1.2-nat-info-2.png)

### 4.7.3.2 NATゲートウェイの削除
※ポータルの利用はインターネットへの接続が必須のため、有効なIPSec接続がない場合は、NATゲートウェイの「削除」ボタンを押下できません。  
（１）「削除」ボタンを押下します。  

![4.7.3.2.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.3.2.1-nat-del.png)  

（２）NATゲートウェイ以外にインターネットへの接続があることを確認し、「削除」ボタンを押下します。  

![4.7.3.2.2](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.3.2.2-nat-del-confirm.png)  

（３）NATゲートウェイが正しく削除されることを確認します。（削除に2〜3分かかります）  

※削除後すぐ再作成する場合は失敗する可能性があります。非同期削除のため、しばらく時間経ってから再度作成を試してください。  

### 4.7.3.3 NATゲートウェイの作成
（１）「作成」ボタンを押下します。（作成に2〜3分かかります。）  

![4.7.3.3.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.3.3.1-nat-create.png)  

※ポータルからNATゲートウェイを作成する場合は、入力パラメータはありません。  

以下の既定値にて作成されます。  

・インスタンス名：nat-daas  
・説明：Cloud Remote GatewayのNAT Gateway  
・EIP帯域幅：200Mbit/s（トラフィック課金）  

## 4.7.4 VPNゲートウェイ
### 4.7.4.1 VPNゲートウェイの作成
（１）管理者メニューより、VPNゲートウェイを選択します。  

![4.7.4.1.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.1.1-vpn-menu.png)  

（２）「作成」ボタンを押下します。  

![4.7.4.1.2](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.1.2-vpn-create.png)  

（３）以下の項目を入力します。  

・宛先CIDRブロック：接続先のプライベートネットワークセグメント。例：192.168.0.0/24  

・カスタマーゲートウェイ：  
　○ IPアドレス：接続先のVPNゲートウェイのグローバルIPアドレス  
　○ ASN（任意）；ASに一意に振られる番号（指定がなければ空欄のままで問題ありません）  
　○ 事前共有鍵（16桁）：接続先と共有する事前共有鍵を入力します。（入力なければ自動で作成します。）  

・IKEバージョン：プルダウンより選択します。（デフォルト：ikev2）  
・IKEネゴシエーションモード：プルダウンより選択します。（デフォルト：main）  
・IKE暗号化アルゴリズム：プルダウンより選択します。（デフォルト：aes256）  
・IKE認証アルゴリズム：プルダウンより選択します。（デフォルト：sha256）  
・IKE DHグループ：プルダウンより選択します。（デフォルト：group2）  
・IKE SAライフサイクル：SAライフサイクルを入力します。（デフォルト：86400）  

・IPSec暗号化アルゴリズム：プルダウンより選択します。（デフォルト：aes256）  
・IPSec認証アルゴリズム：プルダウンより選択します。（デフォルト：sha256）  
・IPSec DHグループ：プルダウンより選択します。（デフォルト：group2）  
・IPSec SAライフサイクル：SAライフサイクルを入力します。（デフォルト：86400）  

・DPD： ON／OFFを選択します。（デフォルト：ON）  
・NATトラバーサル：ON／OFFを選択します。（デフォルト： ON）  

（４）作成内容を確認し、問題なければチェックを入れ、「OK」ボタンを押下します。  

![4.7.4.1.3](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.1.6-vpn-create-confirm.png)  

（５）VPNゲートウェイが正しく作成されることを確認します。  

### 4.7.4.2 VPNゲートウェイの確認
（１）基本情報タブにてVPNゲートウェイの基本情報を確認できます。

![4.7.4.2.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.2.1-vpn-info-basic.png)  

（２）「ルート確認」ボタンを押下し、VPNゲートウェイに設定された宛先CIDRブロックを確認できます。  

![4.7.4.2.2](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.2.2-vpn-info-route.png)  

（３）IPSECコネクションタブにてIPSECの情報を確認できます。  

![4.7.4.2.3](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.2.3-vpn-info-ipsec.png)  

（４）「詳細表示」ボタンを押下し、詳細なIPSEC設定情報を確認できます。  

![4.7.4.2.4](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.2.4-vpn-info-ipsec-details.png)  

※事前共有鍵を自動作成する場合は、こちらのメニューより確認できます。  

### 4.7.4.3 VPNゲートウェイの削除
（１）IPSecコネクションの「削除」ボタンを押下します。  
※ポータルの利用はインターネットへの接続が必須のため、有効なNATゲートウェイ接続がない場合は、IPSec接続の「削除」ボタンを押下できません。  

![4.7.4.2.3](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.2.3-vpn-info-ipsec.png)  

（２）削除内容を確認し、問題なければチェックをいれ、「OK」ボタンを押下します。（※削除に2〜3分かります。）  

![4.7.4.3.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.3.1-vpn-del-ipsec.png)  

（３）IPSec接続が正しく削除されたことを確認します。  

（４）VPNゲートウェイの「削除」ボタンを押下します。  

![4.7.4.3.2](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.3.2-vpn-del-vpn.png)  

（５）削除内容を確認し、問題なければチェックをいれ、「OK」ボタンを押下します。  

![4.7.4.3.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.3.1-vpn-del-ipsec.png)  

（６）VPNゲートウェイが正しく削除されたことを確認します。  

※削除後すぐ再作成する場合は失敗する可能性があります。非同期削除のため、しばらく時間経ってから再度作成を試してください。 

### 4.7.4.4 IPSecコネクションの追加
※上記「4.7.4.3 VPNゲートウェイの削除」章にてIPSecコネクションを削除後、追加ボタンが押下できるようになります。  
![4.7.4.4.1](images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.7.4.4.1-vpn-ipsec-add.png)  
こちらにて、既存のVPNゲートウェイを保持したままで、新規IPSecコネクションを再作成することができます。  
入力パラメーターは「4.7.4.1 VPNゲートウェイの作成」章をご参照ください。  

## 4.8.2 ユーザ管理
## 4.8.2.1 新規ユーザ作成
ポータルユーザには管理者ユーザと一般ユーザの2種類が存在します。  
それぞれのユーザを新規作成する手順は以下の通りです。  
## 4.8.2.1.1 新規管理者ユーザ作成
管理メニューよりユーザ管理を押下します。  
![4.6.1.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.7.2.1.1-menu-user.png)  
「管理者ユーザ管理」の作成ボタンを押下します。  
![4.6.1.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.2-admin-user-create.png)  
以下の情報を入力し、OKボタンを押下します。  
- ユーザ名  
- パスワード  
![4.6.1.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.3-admin-user-create-form.png)  
ユーザーが正しく作成されたことを確認します。  
![4.6.1.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.1.4-admin-user-create-complete.png)  
以上で、新規管理者ユーザーの作成が完了します。  
## 4.8.2.1.2 新規一般ユーザ作成
管理メニューよりユーザ管理を押下します。  
![4.6.1.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.7.2.1.1-menu-user.png)  
「一般ユーザ管理」の作成ボタンを押下します。  
![4.6.1.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.2.2-normal-user-create.png)  
以下の情報を入力し、OKボタンを押下します。  
- ユーザ名  
- パスワード  
- 対象デスクトップ  
![4.6.1.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.6.1.2.3-normal-user-create-form.png)  
最終確認後、問題なければOKボタンを押下します。  
![4.6.1.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.2.4-normal-user-create-confirm.png)  
ユーザーが正しく作成されたことを確認します。  
![4.6.1.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.1.2.5-normal-user-create-complete.png)  
以上で、新規管理者ユーザーの作成が完了します。  
## 4.8.2.2 既存ユーザーパスワード変更
管理メニューよりユーザ管理を押下します。  
![4.6.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.7.2.1.1-menu-user.png)  
対象ユーザーのパスワード変更ボタンを押下します。  
![4.6.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.2.1-user-change-password.png)  
新しいパスワードを入力し、OKボタンを押下します。  
![4.6.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.2.2-user-change-password-form.png)  
以下のメッセージが表示されると完了です。  
![4.6.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.2.3-user-change-password-complete.png)  
## 4.8.2.3 既存ユーザー削除
管理メニューよりユーザ管理を押下します。  
![4.6.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.7.2.1.1-menu-user.png)  
対象ユーザーの削除ボタンを押下します。  
![4.6.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.3.1-user-delete.png)  
削除対象を確認し、問題なければOKを押下します。  
![4.6.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.3.2-user-delete-confirm.png)  
ユーザーが削除されたことを確認します。  
![4.6.3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.3.3-user-delete-complete.png)  
## 4.8.2.4 既存ユーザーMFA初期化
管理メニューよりユーザ管理を押下します。  
![4.6.4.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.7.2.1.1-menu-user.png)  
対象ユーザーのMFA初期化ボタンを押下します。  
![4.6.4.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.4.1-user-mfa-reset.png)  
問題ないことを確認したら□にチェックを入れてOKボタンを押下します。  
![4.6.4.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.4.2-user-mfa-reset-confirm.png)  
以下のメッセージが表示されると完了です。  
![4.6.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.4.3-user-mfa-reset-complete.png)  
## 4.8.2.5 既存一般ユーザー連携デスクトップ変更
管理メニューよりユーザ管理を押下します。  
![4.6.5.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.7.2.1.1-menu-user.png)  
対象一般ユーザーの変更ボタンを押下します。  
![4.6.5.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.5.1-user-change-desktop.png)  
以下の情報を入力し、次へボタンを押下します。  
- 既存のデスクトップ紐付け情報を残しますか？：  
別プロバイダーのデスクトップ紐づけ情報を残したい場合はチェックを入れます。  
- 対象デスクトップ選択：  
対象一般ユーザーに紐付けたいデスクトップを一覧から選択します。  
![4.6.5.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/4.6.5.2-user-change-desktop-form.png)  
問題ないことを確認したら□にチェックを入れてOKボタンを押下します。  
![4.6.5.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.5.3-user-change-desktop-confirm.png)  
以下のメッセージが表示されると完了です。  
![4.6.5.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.5.4-user-change-desktop-complete.png)  
## 4.8.2.6 既存ユーザーロック解除
管理メニューよりユーザ管理を押下します。  
![4.6.6.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-06-MultiCloud-Alibaba-AdminManual/5.7.2.1.1-menu-user.png)  
対象ユーザのロック解除ボタンを押下します。  
※ロック中のユーザだけロック解除ボタンが表示されます。  
![4.6.6.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.6.1-user-unlock.png)  
問題ないことを確認したら□にチェックを入れてOKボタンを押下します。  
![4.6.6.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.6.2-user-unlock-confirm.png)  
以下のメッセージが表示されると完了です。  
![4.6.6.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-04-Portal-AdminManual/4.6.6.3-user-unlock-complete.png)  