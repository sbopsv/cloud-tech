---
title: "Cloud Remote Desktop - 利用開始手順"
metaTitle: "Cloud Remote Desktop Web Document - 利用開始手順"
metaDescription: "Cloud Remote Desktopの利用開始手順"
date: "2021-09-07"
author: "Yoshihiro Matsuda"
thumbnail: "/images/DaaS-01-Manual/image_008.jpg"
---

## 1. 利用開始手順

## 1.1 SAG APP使用手順

## 1.1.1　SAG APP クライアント導入  
下記公式ドキュメントに各OSでのインストール手順が記載されております。  
ドキュメントを参考してOSに応じてSAP APPをインストールします。  
https://www.alibabacloud.com/cloud-tech/doc-detail/102544.htm

## 1.1.2　SAG APPへのSSL-VPN接続方法
① SAG APP クライアントを起動します。 
   
② 別途送付している接続情報より「SAG APPのInstanceID」、「Username」、「Password」を入力し、「Please read and agree privacy policy」にチェックを入れログインボタンを押下します。  
![1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_001.png)


③ 画面中央の「Connect to Intranet」ボタンを押下します。
![2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_002.png)

④ 下記画像のようになれば接続はSSL-VPN接続完了です。DaaSトライアル環境へ接続できるようになります。
![3](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_003.png)

## 1.2 リモートデスクトップ接続手順
　　
## 1.2.1 WindowsOSの場合  
①Windowsキーをクリックして、「リモートデスクトップ接続」を選択します。  
![4](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_004.jpg)

②「コンピューター」にて、接続先仮想デスクトップのIPアドレスを入力して、「接続」をクリックします。  
![5](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_005.jpg)

③ユーザー名とパスワードを入力して、OKをクリックします。  
![6](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_006.jpg)

④証明書確認の画面が表示されましたら、「はい」をクリックします。  
![7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_007.jpg)

⑤下記のような画面が表示されましたら、接続が成功になります。  
![8](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_008.jpg)


## 1.2.2 MacOSの場合 
①「APP Store」を起動して、「Microsoft Remote Desktop」をインストールします。  
![9](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_009.jpg)

②「Microsoft Remote Desktop」を起動して、「Add PC」をクリックします。  
![10](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_010.jpg)

③「PC name」に仮想デスクトップのIPアドレスを入力して、「Add」をクリックします。  
![11](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_011.jpg)

④上記ステップにて追加されたPCをダブルクリックします。  
![12](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_012.jpg)

⑤ユーザー名とパスワードを入力して、「Continue」をクリックします。  
![13](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_013.jpg)

⑥「Continue」をクリックします。  
![14](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_014.jpg)

⑦下記のような画面が表示されましたら、接続が成功になります。  
![15](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_015.jpg)

## 2. 基本操作
## 2.1. Alibaba Cloudコンソールにログイン
## 2.1.1 
下記urlへアクセスしてRAMユーザーのログインを行います。  
 https://signin-intl.aliyun.com/login.htm  
※ルートアカウントでログインする場合は、画面右上の「AlibabaCloudアカウントへログイン」をクリックしてログインします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-02-15-33-16.png)

## 2.1.2  
RAMアカウントのユーザー名を入力して、「次へ」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-02-15-34-00.png)

## 2.1.3  
パスワードを入力して、「ログインする」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-02-15-34-21.png)

## 2.1.4  
RAMアカウントのMFA認証が有効になっている場合、MFAセキュリティコードを入力して、「確認の送信」をクリックします。  
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-02-15-34-52.png)
  
## 2.1.5  
Alibaba Cloudのコンソール画面が表示されます。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-02-15-35-34.png)

## 2.2 ECSコンソールアクセス手順
## 2.2.1
画面左上のオレンジボタンをクリックして、「Elastic Clompute Service」を選択します。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-05-18-45-40.png)

## 2.2.2
ECSコンソール画面へアクセルできます。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-05-19-39-11.png)

## 3. その他の手順
## 3.1. マイク使用手順
## 3.1.1
リモートデスクトップ接続画面を開き、接続先IPアドレスを入力します。  
「オプションの表示」をクリックします
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-13-54-16.png)

## 3.1.2
「ローカルリソース」タブを押下し、「リモートオーディオ」の「設定」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-17-13-38.png)

## 3.1.3
①「リモートオーディオ再生」にて、「このコンピュータで再生する」を選択します。  
②「リモートオーディオ録音」にて、「このコンピュータから録音する」を選択します。  
③「OK」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-17-15-05.png)

## 3.1.4
「ローカルデバイスとリソース」にて、「詳細」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-18-44-37.png)

## 3.1.5
「ビデオキャプチャデバイス」を展開して、「Integrated Camera」を選択します。  
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-18-49-00.png)

## 3.1.6
設定を確認して、「接続」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-18-52-01.png)

## 3.1.7
パスワードを入力し、次へ進めます。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-18-53-15.png)

## 3.1.8
証明書確認の画面にて、「はい」を選択します。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-18-54-42.png)

## 3.1.9
Windowsにログイン後、画面左下のWindowsボタンをクリックし、歯車の設定ボタンを開きます。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-18-55-26.png)

## 3.1.10
「プライバシー」を選択します。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-18-56-18.png)

## 3.1.11
左ペンにて「アプリのアクセス許可」→「カメラ」を選択し、  
「アプリがカメラにアクセスできるようにする」をオンにします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-18-56-59.png)

## 3.1.12
左ペンにて「アプリのアクセス許可」→「マイク」を選択し、  
「アプリがマイクにアクセスできるようにする」をオンにします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-07-18-58-55.png)

## 3.2. WARP使用手順

## 3.2.1
タスクバーの虫眼鏡から「server」と検索し、表示される「サーバーマネージャー」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-23-11.png)

## 3.2.2
「管理」＞「役割と機能の追加」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-29-18.png)

## 3.2.3
「次へ」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-29-45.png)

## 3.2.4
そのまま「次へ」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-30-46.png)

## 3.2.5
対象サーバーを確認し、「次へ」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-33-00.png)

## 3.2.6
「サーバの役割と機能の選択」画面にて、そのまま「次へ」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-33-18.png)

## 3.2.7
機能をプルダウンして「ワイヤレスLANサービス」にチェックを入れて「次へ」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-33-49.png)

## 3.2.8
「インストール」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-35-57.png)

## 3.2.9
インストールが完了したら「閉じる」をクリックし、インスタンスを再起動します。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-36-26.png)

## 3.2.10
再起動後、OSにログインして、http://1.1.1.1 にアクセスし、Windows版のインストーラをダウンロードします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-37-30.png)

## 3.2.11
インストーラを起動します。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-37-42.png)

## 3.2.12
「Next」をクリックします。
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-38-12.png)

## 3.2.13
「Install」をクリックします。  
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_016.PNG)

## 3.2.14
インストールが完了したら「Finish」をクリックします。  
![](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/2021-07-06-19-39-00.png)

## 3.2.15
タスクバー右下の矢印をクリックして、雲マークのアイコンをクリックします。  
![17](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_017.PNG)

## 3.2.16
「次へ」をクリックします。  
![18](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_018.PNG)

## 3.2.17
「同意する」をクリックします。  
![19](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_019.PNG)

## 3.2.18
WARPのスイッチをクリックしてオンにします。  
![20](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_020.PNG)

## 3.2.19
WARP接続の状態で、楽天市場等のサイトがアクセスできます。  
![21](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/DaaS/images/DaaS-01-Manual/image_021.PNG)


