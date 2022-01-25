---
title: "DaaS環境構築-構築編②"
metaTitle: "Alibaba Cloudで実現するお手軽DaaS環境 # 構築編②"
metaDescription: "Alibaba Cloudで実現するお手軽DaaS環境 # 構築編②"
date: "2020-05-20"
author: "SBC engineer blog"
thumbnail: "/computing_images_26006613570123300/20200423065138.png"
---

## DaaS環境構築-構築編②

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200423183725.png "img")      

## はじめに

本記事では、<span style="color: #ff0000">`Alibaba Cloudで実現するお手軽DaaS環境`</span>シリーズ第3回目として、Alibaba Cloudを使った仮想デスクトップ環境（ECSサーバ）に各種設定を行い、実際に仮想サーバを起動するまでの手順をご紹介します。    

### 前回までのおさらい

今回構築するDaaS環境の全体構成と構築の流れについて、おさらいしておきます。

#### 全体構成図

![DaaS環境構築全体像](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200423065138.png "DaaS環境構築全体像")      


#### 構築手順概要

1. クラウドリソース作成：Alibaba Cloud上にクラウドリソースを作成します。：<span style="color: #00cc00">完了</span>  
2. Active Directory構築：ECS（Windows Server 2019）上にActive Directoryを構築します。：<span style="color: #0000cc">本記事の範囲</span>
3. カスタムイメージ作成：ECSにOS設定やToolのインストール等を行い、仮想サーバのベースとなるカスタムイメージを作成します。：<span style="color: #0000cc">本記事の範囲</span>
4. 仮想サーバローンチ：Auto Scalingを増台し、仮想サーバを立ち上げます。：<span style="color: #0000cc">本記事の範囲</span>

本記事では、未完了の<span style="color: #ff0000">`2. Active Directory構築`</span> から<span style="color: #ff0000">`4. 仮想サーバローンチ`</span>までを行っていきます。

## 構築手順
### 2. Active Directory構築
ではさっそく、Active Directoryの構築から行っていきましょう。  
おおまかな手順は以下となります。

- 2-1. Active Directoryサーバ接続
- 2-2. Active Directory構築
- 2-3. ドメイングループ作成
- 2-4. グループポリシー設定

#### 2-1. Active Directoryサーバ接続
まずはじめに、Active Directoryインストール対象のECSサーバにリモートデスクトップ接続を行います。

##### 2-1-1. 接続先IPアドレス確認
接続先となる、Active Directoryドメインコントローラサーバ用ECSのパブリックIPアドレス（EIP）を確認します。

Alibaba Cloud管理コンソールTop画面より、ECSの管理コンソールに移動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519030426.png "img")      

- ① トップページのプロダクト一覧より、`仮想サーバ` > `Elastic Compute Service`を選択します。  

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519030450.png "img")      

- ② 画面左のメニュー一覧より、`インスタンス & イメージ` > `インスタンス`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519030513.png "img")      

- ③ 表示されたECSインスタンスの一覧より、ADサーバ用のインスタンスを探し（今回の例では`ecs-daas-addc`）、パブリックIPアドレスの値を確認します。

     

##### 2-1-2. ADサーバ接続
任意のRDPクライアントを用い、ADサーバにリモートデスクトップ接続を行います。  
今回はMacから接続するため[Microsoft Remote Desktop](https://apps.apple.com/jp/app/microsoft-remote-desktop-10/id1295203466?mt=12)を利用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519030616.png "img")      

- ① **PC name**：先程控えたADサーバのパブリックIPアドレスを指定します。
- ② **Friendly name**：必要に応じて、任意のフレンドリ名を設定します。今回は`DaaS Demo / ADDC`としました。
- ③：`Add`ボタンを押下し、ADサーバへの接続を開始します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519030632.png "img")      

認証情報の入力を求められるため、以下のとおり入力します。

- ④ **Username**：`Administrator`を入力します。
- ⑤ **Password**：ECS作成時に指定したAdminユーザ用ログインパスワードを入力します。
- ⑥：`Continue`ボタンを押下し、認証情報を送信します。

     

接続先が信頼出来るサーバかどうかを確認されるため、承認を行います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519030645.png "img")      

- ⑦：`Continue`ボタンを押下し、接続を続行します。（必要に応じて証明書のインストールを行ってください）

     

以下のとおり、Windows Serverのデスクトップ画面が表示されれば、ADサーバへのログインは完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519030719.png "img")      

#### 2-2. Active Directory構築
ADサーバへログインが完了したので、Active Directoryの構築を行っていきます。

##### 2-2-1. Active Directoryドメインサービスインストール
まずはじめに、Active Directoryドメインサービスをインストールします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031212.png "img")      

- ①：画面左下の`Windows`マークより、`Server Manager`を開きます。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031232.png "img")      

- ②：画面右上の`Manage`より、`Add Roles and Features`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031248.png "img")      

- ③：機能追加前の注意事項が表示されるため、問題なければ`Next >`ボタンを押下します。（必要に応じて`Skip this page by default`にチェックを入れます）

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031301.png "img")      

- ④：`Role-based or feature-based installation`にチェックがついていること（デフォルト）を確認し、`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031310.png "img")      

- ⑤：インストール対象のサーバ（`daas-addc`）が選択されていること（デフォルト）を確認し、`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031322.png "img")      

- ⑥：サービスの一覧より、`Active Directory Domain Services`をチェックします。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031332.png "img")      

- ⑦：ポップアップでインストールされる機能の一覧が表示されるため、`Add Features`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031345.png "img")      

- ⑧：`Active Directory Domain Services`にチェックが入っていることを確認し、`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031359.png "img")      

- ⑨：追加する機能はないため、`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031459.png "img")      

- ⑩：Active Directoryドメインサービスに関する注意事項が表示されるため、問題なければ`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031512.png "img")      

- ⑪：インストールされる機能の一覧が表示されるため、`Install`ボタンを押下し、Active Directoryのインストールを開始します。

     

以下のとおり、`Installation succeeded`と表示されれば、インストールは成功です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031526.png "img")      

##### 2-2-2. ドメインコントローラ昇格
次に、本サーバをActive Directoryのドメインコントローラに昇格させます。

前項のActive Directoryドメインサービスのインストール完了画面より、操作を続行します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031740.png "img")      

- ①：`Promote this server to a domain controller`を選択します。

     
ドメインの作成方法を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031751.png "img")      

- ②：`Add a new forest`にチェックします。
- ③：任意のドメイン名を入力します。今回は`daas.demo`を指定しました。
- ④：`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031759.png "img")      

ADサービスを復元する際のパスワードを入力します。

- ⑤：任意のパスワードを入力します。
- ⑥：`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031809.png "img")      

- ⑦：デフォルトのまま`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031818.png "img")      

- ⑧：任意のNetBIOS名を入力します。今回はデフォルトのまま、`DAAS`を指定しました。
- ⑨：`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031827.png "img")      

- ⑩：各種データの保存先を指定します。今回はすべてデフォルト設定のままとしました。
- ⑪：`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031839.png "img")      

- ⑫：インストールするオプションの詳細が表示されるため、確認し問題がなければ`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519031902.png "img")      

- ⑬：インストール前の注意事項が表示されるため、確認し問題がなければ`Install`ボタンを押下し、インストールを実行します。<span style="color: #ff0000">インストール完了後は自動的にサーバが再起動されるため、注意してください。</span>

     
以上でActive Directoryドメインコントローラへの昇格は完了となります。

#### 2-3. Active Directoryグループ作成
Active Directoryで作成した<span style="color: #ff0000">ドメインユーザは、ローカル（仮想サーバ）のAdmin権限は持っていません。</span>  
運用を考えた際、利用者が増える度に仮想サーバ側にログインし、ドメインユーザにローカルのAdmin権限を追加するのは、少し面倒です。  

そこで、今回の構成では、  
ドメインユーザを管理するドメイングループを作成し、仮想サーバ側のローカルAdminグループに所属させることで、ユーザ追加の手間を削減します。  
このようにすることで、<span style="color: #0000cc">利用者が増えた場合でも、ドメインコントローラ側の操作のみで完結</span>させることが出来ます。

本稿では、DaaS環境利用者管理用のドメイングループを作成する手順を紹介します。

##### 2-3-1. ドメイングループ作成
前手順と同様にADサーバにログインし、ドメイングループを作成していきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032137.png "img")      

- ①：Server Managerを起動し、右上の`Tools`より`Active Directory Users and Computers`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032151.png "img")      

- ②：管理コンソールが起動するため、左側メニューより`<ドメイン名>` > `Users`を右クリック。`New` > `Group`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032202.png "img")      

- ③：任意のグループ名を入力します。今回は`DaaS Users`を指定しました。
- ④：`OK`ボタンを押下します。

     

以下のように、ユーザ・グループ一覧に作成したグループが表示されれば、ドメイングループの作成は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032218.png "img")      

     

#### 2-4. グループポリシー設定
仮想サーバ上での操作を制限するグループポリシーの設定を行います。  

今回は例として、<span style="color: #0000cc">クライアントとのクリップボード共有を禁止</span>する設定を行っていきます。  
必要に応じて任意のポリシーを設定可能です。

##### 2-4-1. グループポリシー設定

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032239.png "img")      

- ①：Server Managerを起動、右上の`Tools`より`Group Policy Management`を選択し、グループポリシー管理ツールを起動ます。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032248.png "img")      

- ②：`Domains` > `<ドメイン名>` > `Group Policy`を右クリックし、`New`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032259.png "img")      

- ③：任意のグループポリシーオブジェクト名を入力します。今回は`DaaS Demo Policy`を指定しました。
- ④：`OK`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032308.png "img")      

- ⑤：作成したグループポリシーオブジェクトを右クリックし、`Edit`を選択、グループポリシーエディタを起動します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032317.png "img")      

- ⑥：グループポリシーエディタにて、`Computer Configuration` > `Policies` > `Administrative Templates` > `Windows Components` > `Remote Desktop Services` > `Remote Desktop Session Host` > `Device and Resource Redirection` > `Do not allow Clipboard redirection`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032327.png "img")      

- ⑦：`Enabled`にチェックを入れます。
- ⑧：`OK`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032336.png "img")      

- ⑨：グループポリシー管理ツールに戻り、作成したグループポリシーオブジェクトをドメイン（`daas.demo`）にドラッグします。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032344.png "img")      

- ⑩：確認画面がポップアップで表示されるため、`OK`ボタンを押下します。

     

以下のとおり、作成したグループポリシーオブジェクトが表示されれば、グループポリシーの適用は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032355.png "img")      

     

以上で、Active Directoryの構築は完了となります。お疲れさまでした。

### 3. カスタムイメージ作成
次に、仮想サーバの起動イメージとなるカスタムイメージを作成していきます。  

おおまかな手順は以下となります。

- 3-1. カスタムイメージ作成用ECSサーバ接続
- 3-2. イメージ設定
- 3-3. カスタムイメージ取得
- 3-4. Auto Scaling起動イメージ差し替え
- 3-5. ユーザデータ設定

#### 3-1. カスタムイメージ作成用ECSサーバ接続
まずはじめに、前回の記事で作成したカスタムイメージ作成用のECSサーバにリモートデスクトップ接続を行います。  
手順は先程と同様のため省略させていただきます。

#### 3-2. イメージ設定
仮想サーバの起動イメージとしてカスタムイメージに内包するOS設定やToolのインストールを行います。  

カスタムイメージにどのような設定を行うかは、用途やユーザによって異なるため、手順は省略しますが、  
今回はサンプルとして、OSの日本語化およびロケール設定、`Google Chrome`のインストールを行いました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032633.png "img")      

#### 3-3. カスタムイメージ取得
イメージの設定が完了しましたら、Alibaba Cloud管理コンソール上からカスタムイメージを取得します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032651.png "img")      

- ①：管理コンソールトップページのプロダクト一覧より、`仮想サーバ` > `Elastic Compute Service`を選択し、ECS管理コンソールに遷移します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032702.png "img")      

- ②：ECS管理コンソール左側のメニュー一覧より、`インスタンス & イメージ` > `インスタンス`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032713.png "img")      

- ③：ECSインスタンス一覧よりカスタムイメージ取得用のインスタンス（`ecs-daas-tmp`）を探し、`アクション` > `詳細`より、`ディスクとイメージ` > `カスタムイメージの作成`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032723.png "img")      

ポップアップが表示されるため、以下の通りパラメータを設定します。

- ④ **イメージ名**：任意のカスタムイメージ名を入力します。今回は`img-daas-demo`を指定しました。
- ⑤ **イメージの説明**：リソースに任意の説明を付与します。
- ⑥：`作成`ボタンを押下します。

     

作成したカスタムイメージを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032736.png "img")      

- ⑦：メニュー一覧より、`インスタンス & イメージ` > `イメージ`を選択します。  

     

以下のとおり、進行度が`100%`になれば、カスタムイメージの取得は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032747.png "img")      

     

#### 3-4. Auto Scaling起動イメージ差し替え
仮想サーバスケール用のAuto Scalingについて、起動イメージを前手順で作成したカスタムイメージに差し替えます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032758.png "img")      

- ①：Alibaba Cloud管理コンソールトップページのプロダクト一覧より、`仮想サーバ` > `Auto Scaling`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032806.png "img")      

- ②：Scaling Groupの一覧より前回作成したScaling Group（`asg-daas-rds`）を探し、操作列より`管理`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032815.png "img")      

- ③：Scaling Group管理画面の左側メニュー一覧より、`インスタンス設定のソース`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032831.png "img")      

- ④：前回作成したScaling Configuration（`asc-daas-rds`）の操作列より、`変更`を選択します。

     

Scaling Configurationの設定変更画面に遷移するため、起動イメージを差し替えます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032843.png "img")      

- ⑤ **イメージ**：`カスタムイメージ`タブを選択し、起動イメージを前手順で取得したカスタムイメージ（`img-daas-demo`）に差し替えます。
- ⑥：`プレビュー`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032923.png "img")      

- ⑦：変更内容に問題がないことを確認し、`変更する`ボタンを押下します。

     

正常に変更が行われた場合、以下のようなメッセージがポップアップ表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032943.png "img")      

- ⑧：`設定の表示`ボタンを押下します。

     

以下の通り、イメージが変更されていれば、起動イメージの差し替えは完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519032951.png "img")      

     

#### 3-5. ユーザデータ設定
ユーザデータとは、ECSインスタンス起動時に実行する処理を記述したスクリプトのことを呼びます。  
bashやpowershell等のスクリプト言語を用いて、データの取得やサービスの起動等を行いたい場合に使用されます。

今回は、起動した仮想サーバを自動でActive Directoryに所属させ、運用コストを削減する目的で利用します。

##### 3-5-1. スクリプト作成

ユーザデータスクリプトでは、以下の処理を実行します。

- ① **DNS設定**：DNSサーバの向き先を、前手順で構築したActive Directoryドメインコントローラに変更します。
- ② **ドメイン参加**：サーバを前手順で構築したADドメインに所属させます。
- ③ **グループ追加**：ローカルのAdministratorsグループに、前手順で作成した利用者管理用ドメイングループを追加します。

以下のスクリプトについて、実際の設定値に応じて変数を書き換えます。

```
[powershell]
# 変数（要変更）
$ad_admin_pwd  = "xxxxxx"         # Active Directoryの管理者ユーザのパスワード
$ad_private_ip = "192.168.0.111"  # ADサーバのプライベートIPアドレス
$domain        = "daas.demo"      # ドメイン名
$domain_group  = "DaaS Users"     # 利用者管理用ドメイングループのグループ名

# DNS設定
Get-NetAdapter | Set-DnsClientServerAddress -ServerAddresses $ad_private_ip

# ドメイン参加
$pwd = ConvertTo-SecureString -AsPlainText -Force $ad_admin_pwd
$cred = New-Object System.Management.Automation.PSCredential("Administrator@$domain",$pwd)
Add-Computer -DomainName $domain -Credential $cred -Force -Restart

# ドメイングループにローカルAdmin権限を付与
([ADSI]"WinNT://$env:computername/Administrators,group").psbase.Invoke("Add",([ADSI]"WinNT://$domain/$domain_group").path)
```

##### 3-5-2. ユーザデータ設定
仮想サーバスケール用Auto Scalingに、作成したユーザデータスクリプトを設定します。  

先程と同様の手順で、仮想サーバ用Scaling Configuration（`asc-daas-rds`）を変更します。  
`システム構成` > `詳細設定` > `ユーザ情報`より、以下の通りパラメータを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519034000.png "img")      

- ① **Base64エンコード**：スクリプトをBase64でエンコーディングしている場合は、ここにチェックを入れます。  
今回は簡単のためプレーンテキストのまま記述していますが、パスワードが記載されているため、エンコードを行ってから設定した方がよりセキュアです。
- ② **ユーザデータ**：前手順で作成したユーザデータスクリプトを貼り付けます。

以降の手順は「3-4. Auto Scaling起動イメージ差し替え」と同様のため、省略させていただきます。

以上で、カスタムイメージ作成の手順は完了となります。お疲れさまでした。

### 4. 仮想サーバローンチ
さて、ここまでの手順を以てDaaS環境の構築は完了です。  
以降の手順は、実際に仮想サーバ利用者が増えた場合に、DaaS環境の管理者が行う<span style="color: #0000cc">運用手順</span>となります。

おおまかな手順は以下のとおりとなります。

- 4-1. クライアント証明書発行
- 4-2. ドメインユーザ追加
- 4-3. 仮想サーバローンチ

#### 4-1. クライアント証明書発行
DaaS環境にSSL-VPN接続を行うための、クライアント証明書の発行および設定を行います。

##### 4-1-1. クライアント証明書作成
まずは、クライアント証明書の作成を行います。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033251.png "img")      

- ①：Alibaba Cloud管理コンソールトップページのプロダクト一覧より、`ネットワークサービス` > `VPN Gateway`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033305.png "img")      

- ②：画面左側のメニュー一覧より、`VPN` > `SSL クライアント`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033314.png "img")      

- ③：SSLクライアント管理コンソール画面より、`クライアント証明書の作成`ボタンを押下します。

     

クライアント証明書作成ペインが表示されるため、以下のとおりパラメータを設定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033336.png "img")      

- ④ **名前**：任意のリソース名を入力します。今回は`crt-daas-demo`を指定しました。
- ⑤ **SSLサーバー**：前回作成したSSLサーバ（`ssl-daas-demo`）を指定します。
- ⑥：`OK`ボタンを押下します。

     

以下の通り、作成したSSLクライアントのステータスが`正常`と表示されることを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033349.png "img")      

     

##### 4-1-2. クライアント証明書設定
任意のVPNクライアントソフトを用い、DaaS環境とSSL-VPN接続を行います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033401.png "img")      

- ①：クライアント証明書管理画面より`ダウンロード`を選択し、クライアント証明書をローカル端末にダウンロードします。

     

- ②：ダウンロードしたzipファイルを解凍します。以下のように展開されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033417.png "img")      

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033427.png "img")      

- ③：任意のVPNクライアントを用い、DaaS環境に接続を行います。今回は[Tunnelblick](https://tunnelblick.net/index.html)を利用しました。

     

下記のように表示されれば、クライアントとDaaS環境とのSSL-VPN接続は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033436.png "img")      

     

#### 4-2. ドメインユーザ作成
次に、DaaS環境利用者が仮想サーバログインに用いるドメインユーザを作成します。

##### 4-2-1. ドメインユーザ作成
先程と同様の手順でADサーバにログインし、ユーザを追加していきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033449.png "img")      

- ①：Server Managerより、`Tools` > `Active Directory Users and Computers`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033501.png "img")      

- ②：管理コンソールが起動するため、左側メニューより`<ドメイン名>` > `Users`を右クリック。`New` > `User`を選択します。

     

ユーザ作成画面が表示されるため、以下のとおり設定を行います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033512.png "img")      

- ③ **First Name等**：任意の名前を入力します。
- ④ **User logon name**：任意のログイン名を入力します。今回は`sbc_sato`を指定しました。
- ⑤：`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033527.png "img")      

- ⑥ **Password / Confirm Password**：任意のパスワードを入力します。
- ⑦ **オプション**：任意でオプションを設定します。今回は`User must change password at next logon`（初回ログイン時にパスワード変更を強制）にチェックを入れました。
- ⑧：`Next >`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033559.png "img")      

- ⑨：設定に間違いがないことを確認し、`Finish`ボタンを押下します。

     

以下の通り、作成したユーザが表示されれば、ドメインユーザの作成は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033609.png "img")      

     

##### 4-2-2. 利用者管理用ドメイングループに追加
作成したユーザを、前手順で作成した利用者管理用のドメイングループに追加します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033622.png "img")      

- ①：ユーザ管理ツールにて、前手順で作成したユーザ（`sbc sato`）を選択し右クリック > `Add to a group`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033637.png "img")      

- ②：前手順で作成した利用者管理用ドメイングループのグループ名（`DaaS Users`）を入力します。
- ③：`Check Names`ボタンを押下します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033650.png "img")      

- ④：グループ名のチェックが正常に完了した場合、グループに下線が付きます。`OK`ボタンを押下します。

     

以下のとおりメッセージが表示されれば、グループへの追加は成功です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033658.png "img")      

     

- ⑤：`OK`ボタンを押下し、グループへの追加を完了させます。

     

以上で、仮想サーバ利用者用のドメインユーザ作成とグループ追加は完了となります。

#### 4-3. 仮想サーバローンチ
最後に、Auto Scalingの台数を変更し、仮想サーバを起動させましょう。  

##### 4-3-1. Auto Scaling台数変更

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033725.png "img")      

- ①：Scaling Group一覧より対象のScaling Group（`asg-daas-demo`）を探し、操作列より`変更`を選択します。

     

Scaling Group変更ペインが表示されるため、以下のとおりパラメータを変更します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033737.png "img")      

- ② **スケーリングに許可される最大インスタンス数**：スケーリング上限を入力します。この値は実際に起動する仮想サーバの台数以上に設定する必要があります。今回は1台のみ起動するため、`1`を指定します。
- ③ **スケーリングに許可される最小インスタンス数**：スケーリング下限を入力します。この値は実際に起動する仮想サーバの台数以下に設定する必要があります。今回は1台のみ起動するため、`1`を指定します。
- ④：`送信`ボタンを押下します。

     

以下のとおりメッセージがポップアップ表示されれば、台数の変更は完了です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033757.png "img")      

- ⑤：`OK`ボタンを押下し、Scaling Group管理画面に戻ります。

     

Auto Scalingの起動により、ECSインスタンスが起動していることを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033818.png "img")      

- ⑥：対象Scaling Group（`asg-daas-demo`）の操作列より、`管理`を選択します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033825.png "img")      

- ⑦：左側メニュー一覧より、`ECSインスタンスリスト`を選択します。

     

以下の通り、起動したECSインスタンスのステータスが`サービス中`になっていることを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033838.png "img")      

     

最後に、起動したECSインスタンスのインスタンスIDをクリックし、接続先となるプライベートIPアドレスを確認しておきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033850.png "img")      

- ⑧：インスタンスIDをクリックします。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519033901.png "img")      

- ⑨：ECSインスタンスの詳細画面に遷移するため、プライベートIPアドレスを控えます。

     

以上で、仮想サーバのローンチは完了となります。お疲れさまでした。

     

## 仮想サーバに接続してみよう 
大変長らくお待たせしました。  
ついに仮想サーバに接続する準備が整いました。

RDPクライアントを用いて仮想サーバに接続してみましょう。

### 仮想サーバ接続

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519034018.png "img")      

- ①：リモートデスクトップ接続を行う前に、SSL-VPN接続が行われていることを確認します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519034028.png "img")      

- ②：RDPクライアントの接続先には、前手順で控えた仮想サーバのプライベートIPアドレスを指定します。

     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519164106.png "img")      

- ③：認証情報には、前手順で作成したDaaS環境利用者用のドメインユーザを指定します。  
<ユーザ名>@<ドメイン名>の形式で指定するので、注意が必要です。    

     

`Continue`ボタンを押下し、接続を続行すると、、、

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519034059.png "img")      

仮想サーバに接続することが出来ました   

<span style="color: #0000cc">カスタムイメージに取り込んだ、OS日本語化やロケール設定、`Google Chrome`のインストールも完了した状態で起動しています。</span>  
また、画像では伝わり難いですが、<span style="color: #0000cc">クリップボードによる共有も禁止されていることが確認出来ます。</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519034111.png "img")      

     

以上を以て、DaaS環境の構築は完了となります。お疲れさまでした 


## Appendix：運用時の注意点について
DaaS環境の運用を考える際、仮想サーバの利用者が増えた場合（仮想サーバを増台する場合）は、  
上記手順に従って操作を行っていただければ問題ありません。  

しかし、

- ・クラウド利用コスト削減のため、<span style="color: #ff0000">仮想サーバの計画停止</span>を行う場合
- ・退プロ等の理由で利用者が減り、<span style="color: #ff0000">仮想サーバを減台</span>する場合

には<b><span style="color: #ff0000">注意が必要</span></b>となるので、本稿でご紹介します。

### 仮想サーバの計画停止を行う場合
仮想サーバを構成するECSの課金をストップさせたい場合、通常ECSインスタンスであれば  
下記キャプチャのように、管理コンソール上からECSのステータスを`停止`に変更することで実現可能です。

![ECSインスタンスの停止](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519170757.png "ECSインスタンスの停止")      

しかし、本DaaS環境の構成の場合Auto Scalingを用いてECSをローンチしているため、  
<span style="color: #ff0000">停止中のECSインスタンスが自動でリリースされてしまう</span>、といった問題が発生します。  

これは、Scaling Groupが配下のECSインスタンスの状態を確認（ヘルスチェック）し、異常と判断したインスタンスを自動でリリースしているためです。  

上記課題を解決するためには、Scaling Groupの<span style="color: #0000cc">ヘルスチェック機能（プロセス）を一時的に停止</span>する必要があります。

下記キャプチャのとおり、  
対象のScaling Groupを選択 > `変更` > `一時停止中のプロセス` > `ヘルスチェック`を選択することで、  
ECSインスタンス停止中の自動削除を防ぐことが出来ます。

![ヘルスチェックプロセス停止](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519172158.png "ヘルスチェックプロセス停止")      

### 仮想サーバを減台する場合
仮想サーバを増台する場合は、Scaling Groupの台数を増やすことでECSインスタンスをローンチしていましたが、  
減台する場合は逆に、Scaling Groupの台数を減らすことで、Auto Scalingの機能にてECSインスタンスをリリースすることが出来ます。

しかし、Auto Scalingの機能を用いてECSインスタンスのリリースを行った場合、  
Scaling Group配下の<span style="color: #ff0000">どのインスタンスがリリースされるかわからない</span>、といった問題が発生します。[^1]

そのため、特定のECSインスタンスを指定してリリースしたい場合は、  
通常のECSインスタンスと同様に、ECS側からリリースを行います。  
（前述の通り、ヘルスチェックプロセスが有効な場合はインスタンスを停止することでもリリース可能です）

![ECSインスタンスのリリース](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519174012.png "ECSインスタンスのリリース")      

ただし、ECSインスタンスを手動でリリースした結果、Scaling Group配下のECSインスタンス数が最小台数を下回った場合、  
Auto Scalingの機能にて新たなインスタンスがローンチされてしまうため、  
<span style="color: #0000cc">予め最小台数を減らしておくか、またはスケールアウト機能（プロセス）を停止しておく</span>必要があります。  

これらはどちらも、Scaling Groupの変更から操作可能です。

![最小台数変更・スケールアウトプロセス停止](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613570123300/20200519175222.png "最小台数変更・スケールアウトプロセス停止")      

[^1]: 正確には、リリースされるインスタンスはScaling Groupで設定した`Removal policies`によって決定されます。デフォルト設定の場合、起動元のScaling Configurationが古い順→インスタンスの作成日時が古い順の優先度でリリース対象が決定します。

## 最後に
今回はDaaS環境の構築手順の一部として、仮想デスクトップ環境（ECSサーバ）に各種設定を行い、実際に仮想サーバを起動するまでの手順をご紹介しました。    

DaaS環境を整えるにあたり一番大変なのは<span style="color: #ff0000">初回構築時のみであり、一度この環境を構築してしまえばあとは簡単に仮想サーバの追加・削除が可能</span>です。  　

<span style="color: #ff0000">`Apsara File Storage NAS`</span>（NAS）を用いて共有ファイルサーバを構築したり、  
<span style="color: #ff0000">`Cloud Enterprise Network`</span>（CEN）と組み合わせてオンプレDCや他の拠点とプライベート通信を行ったりと、  
<span style="color: #0000cc">柔軟にアーキテクチャをカスタマイズ出来る点も、Alibaba Cloudを用いるメリットの一つ</span>だと考えます。  

今後も在宅勤務を始めとしたテレワークは更に加速していくことが予想されます。  
<span style="color: #0000cc">「新しい生活様式」</span>実践のお伴に、是非Alibaba Cloudを検討いただければと思います。    


