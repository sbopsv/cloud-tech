---
title: "操作ポータル - 管理者マニュアル"
metaTitle: "Cloud Remote Desktop 操作ポータル Web Document - 管理者マニュアル"
metaDescription: "Cloud Remote Desktop 操作ポータルの管理者向けマニュアルです。"
date: "2021-10-21"
author: "Yoshihiro Matsuda"
thumbnail: "/images/DaaS-02-Portal-Manual/3.1-portal-login.png"
---

## 1. はじめに
本資料は、管理者向けのDaaSポータルを利用するための手順を記述したものです。  
## 2. ログイン
（１）弊社より事前に展開したショートカットより、操作ポータルを開きます。  
![3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/3.1-portal-login.png)  
（２）以下のユーザー名とパスワードを入力し、ログインを押下します。  
- ユーザー名：弊社より事前に展開したもの  
- パスワード：弊社より事前に展開したもの  
（３）ログイン成功していることを確認します。  
## 3. 共通ヘッダー
## 3.1 地域
ヘッダー左側の地域ボタンを押下することで、地域ごとのデスクトップ一覧を切り替えることができます。  
※デフォルトは日本（東京）リージョンが選択されています。  
![4.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.1.1-region.png)  
## 3.2 サポート
ヘッダー右側のサポートボタンを押下することで、ソフトバンク（元SBクラウド）へ問い合わせすることができます。  
※問い合わせは別途弊社のサポートサービスと契約する必要があります。  
![4.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.1.2-support.png)  
## 3.3 ログアウト
ヘッダ右側のログアウトボタンを押下することで、ポータルよりログアウトすることができます。  
![4.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/4.1.3-logout.png)  
## 4. 管理者メニュー
## 4.1 ダッシュボード
ダッシュボード機能についてご紹介します。  
（１）グループ選択：デスクトップをグループ分けて管理することが可能です。defaultグループは全てのデスクトップが表示されます。  
![5.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.1.1-select-group.png)  
（２）デスクトップ一覧：現在利用中のデスクトップ一覧を確認できます。  
下記パラメータ確認できます。  
- デスクトップ名  
- ステータス  
- スペック  
- IPアドレス  
- 課金タイプ  
- 有効期限  
- OSバージョン  
![5.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.1.2-desktop-list.png)  
## 4.2 デスクトップ管理
## 4.2.1 作成・削除
## 4.2.1.1 デスクトップの作成
（１）デスクトップ管理＞作成・削除を選択します。  
![5.2.1.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.1-menu-create.png)  
（２）作成ボタンを押下します。  
![5.2.1.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.2-create-desktop.png)  
（３）スペック選択は推奨スペック、あるいはカスタムをご選択ください。  
※本手順ではカスタムを選択します。  
![5.2.1.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.3-create-spec.png)  
（４）システムディスクのタイプとサイズを入力します。  
※本手順ではHDDの40GBとします。  
![5.2.1.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.4-create-system-disk.png)  
（５）データディスクの個数を入力し、ディスクのタイプとサイズを入力します。  
※本手順では1個のデータディスク（HDD、40GB）を作成します。  
![5.2.1.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.5-create-data-disk.png)  
（６）デスクトップがどのグループに所属するかを選択します。  
- 未所属：defaultのグループに表示されます。  
- 既存のグループから選択：既存のグループより指定します。  
- 新規作成：新規グループ作成します。  

本手順では未所属を選択します。  
![5.2.1.1.6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.6-create-group.png)  
（７）その他設定  
- VSwitch：デスクトップが所属するVSwitchを選択します。  
- パスワード：デスクトップのログインパスワードを設定します。（※作成されたデスクトップのユーザー名はadministratorとなります。）  
- 課金方式：従量課金またはサブスクリプションを選択します。  
- 作成台数：デスクトップの作成台数を設定します。（2以上を設定した場合、同様なデスクトップが複数作成されます。）  
![5.2.1.1.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.7-create-others.png)  
（８）最終確認後、問題なければOKボタンを押下します。  
![5.2.1.1.8](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.8-create-comfirm.png)  
（９）デスクトップが正しく作成されていることを確認し、ユーザー情報をダウンロードします。  
個別にファイル出力：ユーザー情報を１ファイルずつダウンロードします。  
1ファイルにまとめて出力：ユーザー情報を一つのファイルにまとめて出力します。  
![5.2.1.1.9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.1.9-create-success.png)  
ユーザーポータル用の情報ファイルをダウンロード後、完了ボタンを押下します。  
以上でデスクトップの作成が完了しました。  
## 4.2.1.2 デスクトップの削除
（１）デスクトップ管理＞作成・削除を選択します。  
![5.2.1.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.2.1-menu-delete.png)  
（２）削除したいデスクトップにチェックを入れます。  
![5.2.1.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.2.2-delete-check.png)  
（３）最終確認後、OKボタンを押下します。  
![5.2.1.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.1.2.3-delete-confirm.png)  
以上で、デスクトップの削除が完了しました。  
## 4.2.2 起動・再起動・停止
## 4.2.2.1 デスクトップの起動
（１）デスクトップの起動：  
①デスクトップ一覧より、一台または複数台のデスクトップを選択します。  
②「一括起動」を選択します。  
※「ステータス」が起動中と停止中のタスクを同時に選択することはできません。  
![5.2.2.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.1.1-desktop-start.png)  
（２）ポップアップ画面にて、起動対象のデスクトップを確認します。「はい」を押下します。  
![5.2.2.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.1.2-desktop-start-confirm.png)  
（３）処理実行完了まで待ちます。※処理中、他のメニューを操作することはできません。  
![5.2.2.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.1.3-desktop-start-wait.png)  
（４）起動が成功したことを確認します。  
「閉じる」ボタンを押下します。  
![5.2.2.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.1.4-desktop-start-close.png)  
## 4.2.2.2 デスクトップの再起動
（１）デスクトップの再起動：  
①デスクトップ一覧より、一台または複数台のデスクトップを選択します。  
②「一括再起動」を選択します。  
※「ステータス」が停止中のデスクトップを選択することはできません。  
![5.2.2.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.2.1-desktop-restart.png)  
（２）ポップアップ画面にて再起動対象のデスクトップを確認します。  
「再起動」を押下します。  
※デスクトップがフリーズの場合は、「強制再起動」を押下します。  
![5.2.2.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.2.2-desktop-restart-confirm.png)  
（３）処理実行完了まで待ちます。  
※処理中、他のメニューを操作することはできません。  
![5.2.2.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.2.3-desktop-restart-wait.png)  
（４）再起動が成功したことを確認します。  
「閉じる」ボタンを押下します。  
![5.2.2.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.2.4-desktop-restart-close.png)  
## 4.2.2.3 デスクトップの停止
（１）デスクトップの停止：  
①デスクトップ一覧より、一台または複数台のデスクトップを選択します。  
②「一括停止」を選択します。  
※「ステータス」が停止中、または起動中と停止中複数のデスクトップを選択することはできません。  
![5.2.2.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.3.1-desktop-stop.png)  
（２）ポップアップにて停止対象のデスクトップ一覧を確認します。  
「停止」ボタンを押下します。  
![5.2.2.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.3.2-desktop-stop-confirm.png)  
（３）処理実行完了まで待ちます。  
※処理中、他のメニューを操作することはできません。  
![5.2.2.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.3.3-desktop-stop-wait.png)  
（４）タスクが成功したことを確認します。  
「閉じる」ボタンを押下します。  
![5.2.2.3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.2.3.4-desktop-stop-close.png)  
## 4.2.3 スペック変更
## 4.2.3.1 デスクトップスペック変更
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![5.2.3.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.1.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、デスクトップスペック変更を押下します。  
![5.2.3.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.1.2-select-desktop.png)  
（３）変更後のスペックを選択します。「次へ」を押下します。  
![5.2.3.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.1.3-select-spec.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.3.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.1.4-confirm-change.png)  
（５）変更完了後、デスクトップ一覧にて新しいスペックに変更されていることを確認できます。  
![5.2.3.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.1.5-confirm-new-spec.png)  
## 4.2.3.2 ディスクサイズ変更
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![5.2.3.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.2.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、ディスクサイズ変更を押下します。  
![5.2.3.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.2.2-select-change-disk-size.png)  
（３）変更対象ディスク及び変更後のサイズを選択し、「次へ」を押下します。  
![5.2.3.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.2.3-select-disk-size.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.3.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.2.4-confirm-change.png)  
（５）変更完了後、デスクトップ一覧にて新しいサイズに変更されていることを確認できます。  
![5.2.3.2.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.2.5-confirm-new-disk-size.png)  
## 4.2.3.3 ディスクカテゴリ変更
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![5.2.3.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.3.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、ディスクカテゴリ変更を押下します。  
![5.2.3.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.3.2-select-change-disk-type.png)  
（３）変更対象ディスクを選択し、「次へ」を押下します。  
![5.2.3.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.3.3-select-target-disk.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.3.3.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.3.4-confirm-change.png)  
## 4.2.3.4 データディスク追加
（１）管理者メニューより、「デスクトップ管理」＞「スペック変更」を押下します。  
![5.2.3.4.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.4.1-select-change-spec.png)  
（２）デスクトップ一覧より、変更対象を選択し、データディスク追加を押下します。  
![5.2.3.4.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.4.2-select-add-disk.png)  
（３）ディスクの作成方法を選択します。本手順では空のディスクを作成を選択します。  
次へディスクのカテゴリとサイズを選択し、「次へ」を押下します。  
![5.2.3.4.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.4.3-select-method.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.3.4.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.4.4-confirm-change.png)  
（５）追加完了後、デスクトップ一覧にてデータディスクが追加されたことを確認できます。  
![5.2.3.4.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.3.4.5-confirm-new-data-disk.png)  
## 4.2.4 課金タイプ変更
（１）管理者メニューより、「課金タイプ変更」を押下します。  
![5.2.4.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.4.1-select-change-payment-method.png)  
（２）デスクトップ一覧より、変更対象を選択し、「変更」を押下します。  
![5.2.4.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.4.2-select-target-ecs.png)  
（３）購入期間と自動更新（必要な場合をチェック）を選択し、「次へ」を押下します。  
![5.2.4.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.4.3-select-renew-duration.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.4.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.4.4-confirm-change.png)  
（５）変更完了後、デスクトップ一覧にて課金タイプを確認できます。  
![5.2.4.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.4.5-confirm-result.png)  
## 4.2.5 バーストモード変更
（１）管理者メニューより、「バーストモード変更」を押下します。  
![5.2.5.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.5.1-select-burst-mode.png)  
（２）デスクトップ一覧より、変更対象を選択し、「無限モードに変更」を押下します。  
![5.2.5.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.5.2-select-target-ecs.png)  
（３）変更内容を確認し、問題なければ「OK」を押下します。  
![5.2.5.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.5.3-confirm-change.png)  
（４）変更後、デスクトップ一覧にてバーストモードは「無制限モード」に変更されたことを確認できます。  
![5.2.5.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.2.5.4-confirm-result.png)  
## 4.3 スナップショット管理
## 4.3.1 スナップショットの作成
（１）管理者メニューより、「スナップショット管理」を選択します。  
![5.3.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.1.1-select-snapshot-mgmt.png)  
（２）デスクトップ一覧より、作成対象を選択し、「スナップショット作成」を押下します。  
![5.3.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.1.2-select-target-ecs.png)  
（３）対象ディスクを選択し、スナップショットの名前、説明文（任意）を入力し、保存期間を選択の上、「次へ」を押下します。  
![5.3.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.1.3-select-target-snapshot.png)  
（４）作成内容を確認し、問題なければ「OK」を押下します。  
![5.3.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.1.4-confirm-change.png)  
（５）スナップショット一覧より、スナップショットの進捗を確認できます。  
![5.3.1.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.1.5-confirm-result.png)  
## 4.3.2 スナップショットのロールバック
（１）管理者メニューより、「スナップショット管理」を選択します。  
![5.3.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.2.1-select-snapshot-mgmt.png)  
（２）ロールバック対象を選択し、「スナップショット一覧表示＆ロールバック」を押下します。  
![5.3.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.2.2-select-target-ecs.png)  
（３）対象スナップショットを選択し、「ロールバック」を押下します。  
![5.3.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.2.3-select-target-snapshot.png)  
（４）ロールバック後、インスタンスを起動するかどうかを選択し、問題なければ、「OK」を押下します。  
![5.3.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.2.4-confirm-change.png)  
（５）ロールバックが正しく完了したことを確認します。  
![5.3.2.5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.2.5-confirm-result.png)  
## 4.3.3 スナップショットの削除
（１）管理者メニューより、「スナップショット管理」を選択します。  
![5.3.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.3.1-select-snapshot-mgmt.png)  
（２）削除対象を選択し、「スナップショット一覧表示＆ロールバック」を押下します。  
![5.3.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.3.2-select-target-ecs.png)  
（３）削除対象スナップショットを選択し、「削除」を押下します。  
![5.3.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.3.3.3-select-target-snapshot.png)  
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
![5.4.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.4.1.3-select-target-ecs.png)  
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
![5.5.1.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.1.1.2-scheduler-weekly-param.png)  
設定内容を確認し、「作成」ボタンを押下します。  
![5.5.1.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.1.1.3-scheduler-weekly-confirm.png)  
タスク作成が正しく完了していることを確認します。  
「閉じる」ボタンを押下します。  
![5.5.1.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.1.1.4-scheduler-weekly-close.png)  
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
![5.5.1.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.1.2.2-scheduler-onetime-param.png)  
タスク詳細を確認し、「作成」ボタンを押下します。  
![5.5.1.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.1.2.3-scheduler-onetime-confirm.png)  
タスク作成完了していることを確認します。  
![5.5.1.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.1.2.4-scheduler-onetime-close.png)  
以上で、タスクの作成が完了しました。  
## 4.5.2 タスクの編集
## 4.5.2.1 定期実行タスク
作成されたタスクに、デスクトップを追加／削除を実施する場合は、「変更」ボタンを押下します。  
![5.5.2.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.2.1.1-scheduler-weekly-edit.png)  
スケジュールの対象デスクトップを選び直して、「次へ」を押下します。  
![5.5.2.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.2.1.2-scheduler-weekly-edit-next.png)  
タスクの詳細を確認し、「確定」を押下します。  
![5.5.2.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.2.1.3-scheduler-weekly-edit-confirm.png)  
対象デスクトップの変更が完了していることを確認します。  
「閉じる」ボタンを押下します。  
![5.5.2.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.2.1.4-scheduler-weekly-edit-close.png)  
以上で、タスクの編集が完了しました。  
## 4.5.2.2 一回実行タスク
作成されたタスクに、デスクトップを追加／削除を実施する場合は、「変更」ボタンを押下します。  
![5.5.2.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.2.2.1-scheduler-onetime-edit.png)  
スケジュールの対象デスクトップを選び直して、「次へ」を押下します。  
![5.5.2.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.2.2.2-scheduler-onetime-edit-next.png)  
タスクの詳細を確認し、「確定」を押下します。  
![5.5.2.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.2.2.3-scheduler-onetime-edit-confirm.png)  
対象デスクトップの変更が完了していることを確認します。  
「押下」ボタンをクリックします。  
![5.5.2.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.2.2.4-scheduler-onetime-edit-colse.png)  
以上で、タスクの編集が完了しました。  
## 4.5.3 タスクの削除
## 4.5.3.1 定期実行タスク
対象のタスクにチェックを入れます。  
![5.5.3.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.1.1-scheduler-weekly-delete-check.png)  
削除ボタンを押下します。  
![5.5.3.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.1.2-scheduler-weekly-delete-button.png)  
削除対象の詳細を確認後、問題なければはいボタンを押下します。  
![5.5.3.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.1.3-scheduler-weekly-delete-confirm.png)  
タスクが正しく削除されたことを確認します。閉じるボタンを押下します。  
![5.5.3.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.1.4-scheduler-weekly-delete-close.png)  
## 4.5.3.2 一回実行タスク
対象のタスクにチェックを入れます。  
![5.5.3.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.2.1-scheduler-onetime-delete-check.png)  
削除ボタンを押下します。  
![5.5.3.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.2.2-scheduler-onetime-delete-button.png)  
削除対象の詳細を確認後、問題なければはいボタンを押下します。  
![5.5.3.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.2.3-scheduler-onetime-delete-confirm.png)  
タスクが正しく削除されたことを確認します。閉じるボタンを押下します。  
![5.5.3.2.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.5.3.2.4-scheduler-onetime-delete-close.png)  
## 4.6 ネットワークリソース管理
## 4.6.1 SAG管理
## 4.6.1.1 SAGインスタンス情報管理
（１）管理者メニューより、「ネットワークリソース管理」＞「SAG管理」を選択します。  
![5.6.1.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.1.1-select-sag-mgmt.png)  
（２）SAG APPインスタンス情報より、既存のSAGインスタンスを確認できます。  
![5.6.1.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.1.2-sag-instance-info.png)  
（３）ユーザー数を変更し、CIDRを追加することもできます。  
![5.6.1.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.1.3-sag-change-user.png)  
（４）変更内容を確認し、問題なければ「OK」を押下します。  
![5.6.1.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.1.4-confirm-change.png)  
（５）変更成功後、SAG APPインスタンス情報より確認できます。  
## 4.6.1.2 SAGユーザー情報管理
（１）SAGユーザー情報画面からSAGユーザー情報を確認できます。  
![5.6.1.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.2.1-sag-user-info.png)  
（２）ユーザー追加の場合は、メールアドレスとパスワードを入力し、「追加」を押下します。  
![5.6.1.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.2.2-add-sag-user.png)  
（３）追加内容を確認し、問題なければ「OK」を押下します。  
![5.6.1.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.1.2.3-confirm-change.png)  
（４）追加完了後、SAP APPユーザー情報一覧に追加したユーザーを確認できます。  
## 4.6.2 VPN管理
（１）管理者メニューより、VPN管理を選択します。  
![5.6.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.2.1-select-vpn-mgmt.png)  
（２）VPN Gatewayインスタンス情報が表示され、既存のVPNインスタンス情報を確認できます。  
![5.6.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.6.2.2-vpn-info.png)  
## 4.7 ポータル設定
## 4.7.1 アカウント情報更新
ポータル設定＞アクセスキー更新を押下します。  
![5.7.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.1.1-menu-accesskey.png)  
更新ボタンを押下します。  
![5.7.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.1.2-accesskey-refresh.png)  
アクセスキーが正しく更新されたことを確認します。  
![5.7.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.1.3-accesskey-confirm.png)  
以上で、アクセスキーの更新が完了しました。  
## 4.7.2 管理者ユーザ管理
## 4.7.2.1 新規ユーザー作成
ポータル設定＞管理者ユーザー管理を押下します。  
![5.7.2.1.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.2.1.1-menu-user.png)  
作成ボタンを押下します。  
![5.7.2.1.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.2.1.2-user-create.png)  
以下の情報を入力します。  
- メールアドレス  
- 表示名  
- パスワード  
![5.7.2.1.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.2.1.3-user-create-param.png)  
ユーザーが正しく作成されたことを確認します。  
![5.7.2.1.4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.2.1.4-user-create-close.png)  
以上で、新規管理者ユーザーの作成が完了します。  
## 4.7.2.2 既存ユーザーパスワード変更
ポータル設定＞管理者ユーザー管理を押下します。  
![5.7.2.2.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.2.2.1-menu-user.png)  
対象ユーザーのパスワード変更ボタンを押下します。  
![5.7.2.2.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.2.2.2-user-password-edit.png)  
新しいパスワードを入力し、OKボタンを押下します。  
![5.7.2.2.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.2.2.3-user-password-confirm.png)  
## 4.7.2.3 既存ユーザー削除
ポータル設定＞管理者ユーザー管理を押下します。  
![5.7.2.3.1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.2.3.1-select-user-mgmt.png)  
対象ユーザーの削除ボタンを押下します。  
![5.7.2.3.2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.2.3.2-remove-user.png)  
削除対象確認し、問題なければOKを押下します。  
![5.7.2.3.3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-02-Portal-Manual/5.7.2.3.3-confirm-change.png)  
ユーザーが削除されたことを確認します。  