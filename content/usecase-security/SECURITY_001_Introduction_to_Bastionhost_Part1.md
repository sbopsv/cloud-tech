---
title: "Bastionhostの紹介 Part1"
metaTitle: "二要素認証を用いたホストログイン管理およびユーザ操作監査が可能なプロダクト「Bastionhost」のご紹介①"
metaDescription: "二要素認証を用いたホストログイン管理およびユーザ操作監査が可能なプロダクト「Bastionhost」のご紹介①"
date: "2020-09-07"
author: "SBC engineer blog"
thumbnail: "/Security_images_26006613606632100/20200827194124.png"
---

## 二要素認証を用いたホストログイン管理およびユーザ操作監査が可能なプロダクト「Bastionhost」のご紹介①


![20200908191822](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200908191822.png "20200908191822")


本記事では、Bastionhostについて検証しましたので、ご紹介します。   


## はじめに
Bastionhostは、Alibaba Cloudが提供するシステム運用保守（O＆M）およびセキュリティ監査プラットフォームです。    

[Alibaba Cloud Bastionhost](https://www.alibabacloud.com/ja/product/bastionhost)
> https://www.alibabacloud.com/ja/product/bastionhost



    
Bastionhostプロダクトには以下の機能があります。    


> O＆M操作の記録
> * Linuxコマンド監査
> * Windows操作の記録
> * ファイル転送監査

> アクセス制御
> * アカウント管理
> * 権限管理

> セキュリティ認証
> * 2要素認証（SMS認証や動的トークン）
> * AD認証の同期
> * LDAP認証の同期




Bastionhostはいわゆる踏み台サーバのような役割を果たし、Bastionhostでのログイン認証、アカウント管理、そしてBastionhostを介して接続したHostでの操作を記録します。    


![20200827131133](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827131133.png "20200827131133")


接続プロトコルはSSH、RDP、またはSFTPをサポートします。    
クライアントはPuTTY、SecureCRT、XShell、WinSCP、MSTSCなどをサポートします。    
    
今回はシンプルな構成を例にとり、Bastionhostを使用してみたいと思います。         
      
      
      

## 検証の環境構成図
今回は以下の構成をとり、Bastionhostを検証していきます。
      

![20200827194124](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827194124.png "20200827194124")
      
      

## 準備
Bastionhostインスタンスにバインドする以下のリソースを用意します。    
・VPC　※Bastionhostインスタンスおよび管理化のリソースローンチのため、作成    
・VSwitch　※Bastionhostインスタンスおよび管理化のリソースローンチのため、作成    
・ECS　※Bastionhostインスタンスへの紐づけのため、作成    
・Security Group　※※Bastionhostインスタンスおよび管理下のリソースへのアタッチのため、作成    
      

BastionhostインスタンスはSecurity GroupとWhitelistが使用できます。        
今回は空ルールのSecurity Groupのみ使用します。    
※空ルールのSecurity GroupでもBastionhostインスタンスに接続が可能です。    
      

![20200827155457](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827155457.png "20200827155457")

以下はECSインスタンスのSecurity Groupとして作成します。     
Bastionhostインスタンス配下のHostのSecurity Groupは    
Bastionhostインスタンスからのインバウンド通信のみ許可します。
      
![20200827153505](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827153505.png "20200827153505")

追加するBastionhostインスタンスのプライベートIPアドレスとグローバルIPアドレスはBastionhostインスタンスの「Egress IP」にマウスオーバーすると表示されるので、Bastionhostインスタンス作成後に各HostのSecurity Group追加します。
      
![20200827155704](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827155704.png "20200827155704")
      
今回はSecurity Groupを以下のように設定しています。
      
![20200827193805](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827193805.png "20200827193805")

      
      
## Bastionhostインスタンスの作成
Bastionhostインスタンスを購入します。    
インスタンス作成可能なリージョンは2020/8/20時点では以下になります。    
・香港     
・シンガポール     
・マレーシア     
・インドネシア     
・インド     
     
東京リージョンはありませんが、日本からも上記のリージョンにローンチされたBastionhostインスタンスに接続可能です。    
      

![20200820233808](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200820233808.png "20200820233808")
      
          
## Bastionhostインスタンスの初期化 
Runを押下し、インスタンスのローンチ先VPCとVSwitch、Security Groupを指定し、初期化します。    
      

![20200820234705](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200820234705.png "20200820234705")

      
![20200820234922](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200820234922.png "20200820234922")
      
    
初期化後、Manageを押下し、Bastionhostインスタンスの設定画面に遷移します。
      
      
![20200821003503](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821003503.png "20200821003503")
      

      

![20200821003513](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821003513.png "20200821003513")
      
      
      

## 今回使用するBastionhostの設定箇所全容
Bastionhostインスタンスが作成されたので、設定をしていきます。     
     
設定箇所と設定の連動は以下の図のようになっております。     
順番に設定していきます。     
      

![20200826174041](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826174041.png "20200826174041")
      
      
      

## Host（ECS）の追加パターン１

[Add hosts](https://www.alibabacloud.com/cloud-tech/doc-detail/143811.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/143811.htm

既に作成しているECSを追加します。    
Hosts画面で「Import ECS Instances」を押下します。
      
![20200824102623](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824102623.png "20200824102623")
      

ECSがローンチしているリージョンを選択します。     
複数選択可能です。
      

![20200824102836](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824102836.png "20200824102836")
      

リージョンに所属するECSがすべて表示されるので、    
Bastionhostインスタンスに紐づけるECSを選択し、「Import」を押下します。
      

![20200824103935](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824103935.png "20200824103935")
      

Hosts画面に追加されます。
      

![20200824104406](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824104406.png "20200824104406")
      
      
      
      

## Host（ECS）の追加パターン２

Hosts画面から「Import Other Hosts」プルダウンの「Create Host」からもHostを追加できます。
      
![20200826105731](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826105731.png "20200826105731")
      

ローンチしているECSの情報を入力します。     
HostがBastionhostインスタンスのVPC内に存在しない場合は、     
Bastionhostインスタンスからローカル通信でHostに到達できないので、パブリックIPアドレスを指定します。
      

![20200826110245](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826110245.png "20200826110245")
      

Hostが追加されました。
      
![20200826110552](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826110552.png "20200826110552")
      
      
      

## Host（RDS）の追加
RDS専用クラスターホストもHostとして追加が可能です。    
本ブログでは割愛します。

[Add Hosts](https://www.alibabacloud.com/cloud-tech/doc-detail/143811.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/143811.htm

[Dedicated cluster](https://www.alibabacloud.com/cloud-tech/doc-detail/157559.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/157559.htm

      
      
      

## Host Groupの追加およびHostの紐づけ

[Create a host group](https://www.alibabacloud.com/cloud-tech/doc-detail/143813.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/143813.htm

Host Groups画面で「Create Host Group」を押下します。    
      
![20200824102049](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824102049.png "20200824102049")
      

ホストグループ名を入力します。
      
![20200824105945](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824105945.png "20200824105945")
      

Host Groupが作成されました。    
次にHost GroupにHostを追加します。

![20200827141451](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827141451.png "20200827141451")
      

「Add Member」を押下し、Hostを追加します。
      
![20200824121045](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824121045.png "20200824121045")
      

      
![20200824121454](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824121454.png "20200824121454")
      

Host GroupにHostが追加されました。
      
![20200827141812](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827141812.png "20200827141812")
      
      
      

## RAMユーザ作成
BastionhostのユーザとしてRAMユーザを使用します。     
そのため、まずはRAMユーザを作成します。     
     
今回は管理者ユーザと一般ユーザ相当のRAMユーザを作成します。     
※以下では管理者ユーザのみ作成していますが、同様の手順で一般ユーザも作成します。    
     
パスワードと2要素認証を有効化します。
      
![20200820175821](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200820175821.png "20200820175821")
      

MFAデバイスを有効化します。
      
![20200827142204](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827142204.png "20200827142204")
      

MFAデバイスにQRコードの読み込みまたは「Retrieve manually enter information.」タブのUser NameとKeyを入力します。    
MFAデバイスは今回、chrome ウェブストアのAuthenticatorを使用しました。
      

![20200820175841](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200820175841.png "20200820175841")
      

認証が成功したことを確認します。
      

![20200820180336](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200820180336.png "20200820180336")
      
      
      

## Userの追加
BastionhostインスタンスのUser画面で「Import RAM User」を押下し、RAMコンソールで作成したRAMユーザをインポートします。
      

![20200821160012](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821160012.png "20200821160012")
      

RAMコンソールで作成したRAMユーザが表示されますので、     
作成したRAMユーザをチェックボックス押下で選択し、importを行います。
      

![20200821160731](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821160731.png "20200821160731")
      

RAMユーザが追加されたことを確認します。
      

![20200827142644](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827142644.png "20200827142644")
      
      
      

## User Groupの追加およびUserの紐づけ
User Groupを作成します。    
User Groupを作成することでHostへのユーザ割り当てがまとめてできるので、    
ユーザ増減時の対応スピード向上のメリットがあります。

今回は全RAMユーザが所属するAll_Usersと管理者だけが所属するAdministratorsを作成します。

「Create User Group」を押下し、User Groupを作成します。
      

![20200821161519](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821161519.png "20200821161519")
      

ユーザグループ名を入力します。
      

![20200821162239](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821162239.png "20200821162239")
      

User Groupが作成されました。
      
20200821163648
![20200821163648](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821163648.png "20200821163648")
      

作成されたUser Groupを押下し、詳細画面に遷移します。
MembersタブでAdd Memberを押下し、ユーザを追加します。
      

![20200821162927](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821162927.png "20200821162927")
      

User Groupに所属させるUserを選択し、Addを押下します。
      

![20200828181430](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200828181430.png "20200828181430")
      

User GroupにUserが所属しました。
      

![20200828181450](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200828181450.png "20200828181450")
      
      
      

## ログイン許可ユーザの設定
Userに対してどのHostにログイン許可を与えるかを設定します。     
以下の図の赤枠の部分となります。
      
      

![20200827100501](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827100501.png "20200827100501")
      

User Groups画面で「Authorize Host Groups」を押下します。
      

![20200828181938](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200828181938.png "20200828181938")
      

User GroupにHost Groupに紐づけます。    
「Authorized Host Group」タブで「Authorize Host Groups」ボタンを押下します。
      

![20200824140457](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824140457.png "20200824140457")
      

紐づけるHost Groupを選択し、OKを押下します。
      

![20200824142521](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824142521.png "20200824142521")
      

User GroupとHost Groupが紐づけられました。
      

![20200824143910](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200824143910.png "20200824143910")
      
      
      


## Host内OSユーザの認証
BastionhostインスタンスのUserがHostにログインする際に使用するHostのOSユーザの認証を行います。
      
      
20200827100423
![20200827100423](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827100423.png "20200827100423")
      

Hosts画面で各インスタンスの詳細画面でOSユーザの認証を行います。     
OSユーザの認証は１ホストずつでもまとめてでも可能です。    

[Create an account for hosts](https://www.alibabacloud.com/cloud-tech/doc-detail/145703.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/145703.htm

今回は１ホストずつログインユーザの認証を行います。     
     
     
インスタンスを押下します。
      

![20200825140209](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200825140209.png "20200825140209")
      

「Host Account」タブの「Create Host Account」を押下します。
      

![20200825141248](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200825141248.png "20200825141248")
      

接続プロトコルとユーザ、パスワードを入力し、「Verify」を押下し、有効かどうかチェックします。
      

![20200825142517](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200825142517.png "20200825142517")
      

問題ない場合は「The verification is successful.」がポップアップします。
      

![20200826121914](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826121914.png "20200826121914")
      

Host Accountsが追加されました。
      

![20200826130942](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826130942.png "20200826130942")
      
      

補足となりますが、OSユーザの認証はパスワードだけでなく、SSH Private Keyでの認証も可能です。
      

![20200827144214](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827144214.png "20200827144214")
      
      

![20200827144235](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827144235.png "20200827144235")
      
      
      


## UserごとのHostログイン時OSユーザの設定
BastionhostインスタンスのUserがHostにログインする際に使用するHostのOSユーザの設定を行ったため、次にHostにそのOSユーザを割り当てます。
      

![20200827100552](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827100552.png "20200827100552")
      

「UsersまたはUser Groups」で目的のUser/User GroupのAction列、「Authorize HostsまたはAuthorize Host Groups」を押下します。
      

![20200828181716](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200828181716.png "20200828181716")
      

「Authorized Host Groups」のAuthorized Accounts列「None. Authorize accounts」を押下します。
      

![20200826213305](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826213305.png "20200826213305")
      

OSユーザを入力します。
      

![20200826213700](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826213700.png "20200826213700")
      

OSユーザが設定されました。     
これでHostに接続可能となります。
      

![20200826213818](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826213818.png "20200826213818")
      
      
      


## ログイン時の見え方
接続先は以下になります。    
Bastionhostコンソールか、BastionhostインスタンスのManage画面で確認可能です。
      

![20200821105820](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821105820.png "20200821105820")
      

      

![20200821105457](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821105457.png "20200821105457")
      

IPアドレスでも接続可能です。    
Bastionhostコンソールで「Egress IP」にマウスオーバーすると「グローバルIPアドレスとプライベートIPアドレス」が表示されます。
      

![20200827160129](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827160129.png "20200827160129")
      
      
      
また、今回の構成では管理者と一般ユーザでアクセス範囲を分け、アクセス制限を以下としました。
      

![20200827194212](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827194212.png "20200827194212")
      
      

### Windowsへの接続

[RDP-based O&M](https://www.alibabacloud.com/cloud-tech/doc-detail/143796.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/143796.htm

Windowsでmstsc.exeを実行し、Bastionhostインスタンスに接続します。    
※デフォルトポートは63389になります。変更可能です。
      

![20200827145342](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827145342.png "20200827145342")
      

      

![20200827145428](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827145428.png "20200827145428")
      

ユーザとパスワードの認証画面が表示されます。    
ここではBastionhostインスタンスでUserとして登録したRAMユーザを入力します。    
パスワードもRAMユーザ作成時のパスワードになります。    
※キーボード操作のみ有効となります。    
      

![20200821113336](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821113336.png "20200821113336")
      

ユーザおよびパスワードが正しい場合、MFAの認証画面が表示されます。    
ここではBastionhostインスタンスでUserとして登録したRAMユーザのMFAを使用し、MFA認証を行います。    
※キーボード操作のみ有効となります。    
      

![20200821113407](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200821113407.png "20200821113407")
      

接続先Hostを選択します。    
※キーボード操作のみ有効となります。    
      

![20200827150003](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827150003.png "20200827150003")
      

Host（ECS）にログインしました。     
      

![20200827145946](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200827145946.png "20200827145946")
      
      
      

### Linux

[SSH-based O&M](https://www.alibabacloud.com/cloud-tech/doc-detail/143795.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/143795.htm


PuTTYで接続します。     
※デフォルトポートは60022になります。変更可能です。
      

![20200825104401](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200825104401.png "20200825104401")
      

ユーザ名、パスワード、MFAを入力します。
      

![20200825104410](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200825104410.png "20200825104410")
      

許可されたHostが表示されます。    
      

![20200826141157](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826141157.png "20200826141157")
      

ログインしました。
      

![20200826141212](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200826141212.png "20200826141212")
      
      
      

## おわりに

今回はBastionhostインスタンスを介した同VPC内および別リージョンのECSに対しての接続や、    
RAMユーザのMFAを利用したBastionhostインスタンスログイン時の2要素認証を行ってみました。    
    
Bastionhostを利用することでユーザやグループごとのアクセス権限管理やキーペアやパスワードの管理、     
踏み台サーバの保守、監視・記録ソフトの構築・導入などが不要となります。     
      

![20200828114739](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613606632100/20200828114739.png "20200828114739")
      
ぜひBastionhostの導入をご検討頂ければ幸いです。     






