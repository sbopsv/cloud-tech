---
title: "CENで日中間メール設定方法①"
metaTitle: "CENを利用した日中間メールプロキシについて"
metaDescription: "CENを利用した日中間メールプロキシについて"
date: "2019-10-30"
author: "SBC engineer blog"
thumbnail: "/Network_images_26006613447694400/20191028152111.png"
---

## CENを利用した日中間メールプロキシについて

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191023165649.png "img") 


本記事では、中国国内からのメール送信をCENを利用し、東京リージョン経由で配送する記事を書かせていただきます。    
         
中国からのインターネットを介した海外への通信は時折、一時的に繋がりにくくなることがあります。    
   
   
   
それ故、Alibaba Cloudをお選び頂き、CENを利用した日中間通信を実現されているところも多いと思われます。    
今回はその中でメールにスポットを当てて、実際に環境を構築したいと思います。    
      
では、まず実際に中国国内からインターネットを経由して送信される海外向けのメールが繋がりにくくなる状況を再現してみます。    

      
## ■検証 ～上海リージョンからGmailアドレスへのメール送信～   
Alibaba Cloud上で上海リージョンと東京リージョンにECSをローンチし、    
Googleサービスの一つであるGmailのSMTPサーバにメールを送信してみます。   

構成は以下になります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191028152111.png "img")


上記では、上海リージョンからEIP経由で「GmailのSMTPサーバ」に接続することで、   
中国国内から海外へのインターネット接続をしています。      

また、比較用として東京リージョンからも「GmailのSMTPサーバ」に接続し、   
日本国内から海外へのインターネット接続をしています。   

      
■Alibaba Cloudリソース   
Region：上海、東京   
VPC：各リージョンに1つ   
EIP：各リージョンに1つ   
ECS： 各リージョンに1つ（EIPをバインド）   
   
■Gmail設定   
安全性の低いアプリの許可: 有効   
   
■OS設定   
OS：CentOS 7.6（ECSイメージ：centos_7_06_64_20G_alibase_20190711.vhd）   
MW：Postfix-2.10.1-7、cyrus-sasl-plain-2.1.26-23   
   
・/etc/hosts    
```
# 以下をコメントアウト
#::1	localhost	localhost.localdomain	localhost6	localhost6.localdomain6
```
   
・/etc/postfix/sasl_passwd    
```
[smtp.gmail.com]:587 <Gmailアドレス>:<password>
```
   
・/etc/postfix/main.cf   
```
#以下をコメントアウトし変更
#inet_interfaces = localhost
inet_interfaces = all

#以下を追加
mynetworks = 127.0.0.0/8 

#以下を追加
relayhost = [smtp.gmail.com]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd 
smtp_tls_CAfile = /etc/ssl/certs/ca-bundle.crt
```
   
・手順①   
上海・東京リージョンのECSに以下のMWをインストール   
・Postfix-2.10.1-7　※postfixはECSパブリックイメージ（centos_7_06_64_20G_alibase_20190711.vhd）に導入済み    

・cyrus-sasl-plain-2.1.26-23
```
# yum install -y cyrus-sasl-plain
```
   
・手順②   
上記を設定後、上海・東京リージョンのECSに以下を実行    

```
# chmod 600 /etc/postfix/sasl_passwd
# postmap hash:/etc/postfix/sasl_passwd
# systemctl restart postfix
# echo "<本文>" | mail -s "<件名>" -r <Fromアドレス> <Toアドレス>
```


**結果は以下になります。**
***
   
   
■上海リージョンからのメール送信     

```
[root@ecs-suzuki10-03-01-re-gmail ~]# grep 4A5CE20756 /var/log/maillog
Oct 23 18:08:50 ecs-suzuki10-03-01-re-gmail postfix/pickup[1183]: 4A5CE20756: uid=0 from=<メールアドレス>
Oct 23 18:08:50 ecs-suzuki10-03-01-re-gmail postfix/cleanup[1192]: 4A5CE20756: message-id=<5db026b2.bMOfTrli+Q51QMLW%メールアドレス>
Oct 23 18:08:50 ecs-suzuki10-03-01-re-gmail postfix/qmgr[1184]: 4A5CE20756: from=<メールアドレス>, size=460, nrcpt=1 (queue active)
Oct 23 18:09:20 ecs-suzuki10-03-01-re-gmail postfix/smtp[1194]: 4A5CE20756: to=<メールアドレス>, relay=none, delay=30, delays=0.05/0.02/30/0, dsn=4.4.1, status=deferred (connect to smtp.gmail.com[2404:6800:4008:c01::6c]:587: Network is unreachable)
```

dsn=4.4.1で接続が拒否されました。

   
■東京リージョンからのメール送信     
```
[root@ecs-suzuki10-02-03-re-gmail ~]# grep C005320756 /var/log/maillog
Oct 23 18:08:28 ecs-suzuki10-02-03-re-gmail postfix/pickup[1063]: C005320756: uid=0 from=<メールアドレス>
Oct 23 18:08:28 ecs-suzuki10-02-03-re-gmail postfix/cleanup[1159]: C005320756: message-id=<5db0269c.FIWsKEFsYrwyuaTw%<メールアドレス>
Oct 23 18:08:28 ecs-suzuki10-02-03-re-gmail postfix/qmgr[1064]: C005320756: from=<メールアドレス>, size=482, nrcpt=1 (queue active)
Oct 23 18:08:31 ecs-suzuki10-02-03-re-gmail postfix/smtp[1161]: C005320756: to=<メールアドレス>, relay=smtp.gmail.com[64.233.189.109]:587, delay=3.2, delays=0.07/0.25/1.5/1.4, dsn=2.0.0, status=sent (250 2.0.0 OK  1571825311 m12sm11203865pjk.13 - gsmtp)
Oct 23 18:08:31 ecs-suzuki10-02-03-re-gmail postfix/qmgr[1064]: C005320756: removed
```

dsn=2.0.0のstatus=sentでメールが送信されました。

         
中国国内（上海リージョン）からのメール送信が失敗しました。   
   
このように中国国内からのインターネット通信は時折、失敗もしくは繋がりにくくなります。   

そのため、中国国内から海外のインターネットに出るのではなく、   
中国国内からAlibaba CloudのCENを通り、日本国内からインターネットに出ることでこの問題を解決します。   

   
また、Alibaba Cloudのサービスである[DirectMail](https://www.alibabacloud.com/product/directmail) の   
代替としてAWSのSESを使用し、マルチクラウド環境とします。  

> https://www.alibabacloud.com/product/directmail
  
※AWS SESの採用理由は以下になります。  　
> ・Alibaba CloudのECSに外部通信25番ポートの制限が存在するため     
> ・配送状況をモニタリングできるため（送信数 / 配信数 / バウンス数 / 苦情数 など）    
> ・メールの認証を簡易に実装するため     
> ・AWS SESのフィルタリングにより、送信元のIPアドレスやドメインの評価を下げず、スパムメールのブラックリスト入りを避けるため    


      
## ■CENを利用した日中間メールプロキシ   
構成は以下になります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191028163932.png "img")

上記では、上海リージョンからCEN経由で東京リージョンのECSにメールをリレーすることで、   
中国国内からのインターネット接続を回避しています。   
   
そして、日本リージョンにリレーされたメールはEIP経由で日本国内から海外のSMTPサーバに配送されるため、   
中国国内から海外への通信不良は解消される、という流れとなっております。   



### 手順① ～Alibaba Cloudリソース（上海リージョン）の作成～   
中国国内でメールを受け取るSMTPサーバ（ECS）周りの環境を構築します。
      

1. VPCの作成（今回は 172.16.0.0/12 を作成）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191028195743.png "img")
    1. VSwitchの作成（今回は 172.16.22.0/24 と 172.16.24.0/24 を作成）
    1. VRouterの作成（自動）
1. ECSの作成
    1. リージョンの指定
        1. 中国東部２を指定
            1. 中国東部２ゾーンAを指定
    1. インスタンスタイプを指定（任意）
    1. イメージの指定
        1. パブリックイメージを指定
            1. CentOS / 7.6 64 ビット（centos_7_06_64_20G_alibase_20190711.vhd）を指定
    1. ブロックストレージの作成
    1. ネットワークの作成
        1. VPCの指定（今回は 172.16.0.0/12 を指定）
        1. VSwitchの指定（今回は 172.16.22.0/24 を指定）
    1. セキュリティグループの作成
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191028165257.png "img")
        1. イントラネット入力
            1. クライアントからECSへのssh接続用に22番ポートを許可  
                ※クライアントからECSに対して開発者が環境構築目的でSSH接続をするため  
            1. 接続確認用にICMPを許可  
                ※クライアントおよび他ECSから開発者が疎通確認を行うため 
            1. メール転送用にpostfixのsmtpポートを許可  
                ※東京リージョンのpostfix導入済みECSからメールリレーを受け入れるため  
                1. 東京リージョンECSのpostfixで指定したsmtpポート(3535)を許可
                1. 権限付与オブジェクトに東京リージョンのVPC IPv4 CIDRブロック（今回は 10.0.0.0/8 ）を指定
    1. ssh用にキーペアを作成



      
### 手順② ～Alibaba Cloudリソース（東京リージョン）の作成～   
上海リージョンからメールを受け取り、AWS SESにメールを配送するSMTPサーバ（ECS）周りの環境を構築します。
      

1. VPCの作成（今回は 10.0.0.0/8 を作成）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191028195721.png "img")
    1. VSwitchの作成（今回は 10.20.8.0/24 と 10.20.64.0/24 を作成）
    1. VRouterの作成（自動）
1. ECSの作成
    1. リージョンの指定
        1. 日本（東京）を指定
            1. アジア東北１ゾーンAを指定
    1. インスタンスタイプを指定（任意）
    1. イメージの指定
        1. パブリックイメージを指定
            1. CentOS / 7.6 64 ビット（centos_7_06_64_20G_alibase_20190711.vhd）を指定
    1. ブロックストレージの作成
    1. ネットワークの作成
        1. VPCの指定（今回は 10.20.8.0/24 を指定）
        1. VSwitchの指定（今回は 10.20.8.0/24 を指定）
    1. セキュリティグループの作成
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191028165319.png "img")
        1. イントラネット入力
            1. クライアントからECSへのssh接続用に22番ポートを許可  
                ※クライアントからECSに対して開発者が環境構築目的でSSH接続をするため  
            1. 接続確認用にICMPを許可  
                ※クライアントおよび他ECSから開発者が疎通確認を行うため  
            1. メール転送用にpostfixのsmtpポートを許可  
                ※上海リージョンのpostfix導入済みECSからメールリレーを受け入れるため  
                1. 上海リージョンECSのpostfix（Relayhost）で指定したsmtpポート(2525)を許可
                1. 権限付与オブジェクトに上海リージョンのVPC IPv4 CIDRブロック（今回は 172.16.0.0/12 ）を指定
    1. ssh用にキーペアを作成









      
### 手順③ ～Alibaba Cloudリソース（CEN）の作成～   
上海リージョンと東京リージョンを結ぶ、CEN環境を構築します。
      

1. CENの作成
    1.  プロダクトとサービス > ネットワークサービス > Express Connect > VPC-VPC 接続 > [CENの作成](https://cen.console.aliyun.com/cen/list)    

> https://cen.console.aliyun.com/cen/list
   


   
   
   
CENについては上記の記事で作成方法が詳細に説明されているので省略します。   
今回作成したCENは以下になります。

> ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191023144514.png "img")

   

> ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191023144535.png "img")

   

> ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191023144551.png "img")

   

> ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191023144603.png "img")

   

> ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191023144611.png "img")

   

> ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191023144621.png "img")

   






      
### 手順④ ～VRouter（上海リージョン）の追加設定～   
ルートエントリとして、タイプ Cloud Enterprise Networkのルートエントリを追加します（東京リージョンのVSwitchを追加する）
      
> ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191023134132.png "img")

      
### 手順⑤ ～VRouter（東京リージョン）の追加設定～   
ルートエントリとして、タイプ Cloud Enterprise Networkのルートエントリを追加します（上海リージョンのVSwitchを追加する）
      
> ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191023134150.png "img")






      
### 手順⑥ ～AWS SES（サンドボックス環境）の設定～   
AWS SESの設定をします。   
今回はサンドボックス環境でのメールアドレス検証で構築しています。   
      

1. Gmailのメールアドレス検証を実施

※ドメイン検証についてはこちらをご確認ください     
> https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-domain-procedure.html

> https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-email-addresses.html
   

1. SMTPユーザとSMTPパスワードを発行
> https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/smtp-credentials.html





      
### 手順⑦ ～Postfixの設定～
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613447694400/20191028165536.png "img")

   
以下の設定を上海リージョンおよび東京リージョンのECSに設定します。   

   
・/etc/hosts
```
# 以下をコメントアウト
#::1	localhost	localhost.localdomain	localhost6	localhost6.localdomain6
```

   
・master.cf　※設定するECSのpostfixポートを指定（デフォルト25ポート）   
　→ 今回は上海リージョンのECSに2525ポートを設定し、東京リージョンのECSに3535ポートを設定
```
<2525 or 3535>      inet  n       -       n       -       -       smtpd
#smtp      inet  n       -       n       -       -       smtpd
```

   

・sasl_passwd（上海リージョンECSのみ以下を設定）   
　→ /etc/postfix/sasl_passwdの空ファイルを作成する（メール転送時にサービスステータスにopen databaseエラーが出力されるため）   
   
・ sasl_passwd（東京リージョンECSのみ以下を設定）　※ファイルが存在しない場合は新規作成する
```
[<AWS SESのSMTPエンドポイント>]:587 <SMTPユーザ>:<SMTPパスワード>
```
※「手順⑥ ～AWS SES（サンドボックス環境）の設定～」の「2. SMTPユーザとSMTPパスワードを発行」で発行したSMTPユーザとSMTPパスワードを入力します

   
・main.cf
```
#以下をコメントアウトし変更
#inet_interfaces = localhost
inet_interfaces = all

#以下をコメントアウトし変更
#mydestination = $myhostname, localhost.$mydomain, localhost
mydestination = localhost

#以下を追加
mynetworks = <上海リージョンのVPC IPv4 CIDRブロック>, <東京リージョンのVPC IPv4 CIDRブロック>, 127.0.0.0/8

#上海リージョンのECSにのみ以下を追加
relayhost = [<東京リージョンのECSのENI>]:3535
#東京リージョンのECSにのみ以下を追加
relayhost = [<AWS SESのSMTPエンドポイント>]:587

#以下を追加
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_use_tls = yes
smtp_tls_security_level = may
smtp_tls_note_starttls_offer = yes
smtp_tls_CAfile = /etc/ssl/certs/ca-bundle.crt

```
※AWS SESのSMTPエンドポイントについてはこちらをご確認ください      
> https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/smtp-connect.html

   
・手順①   
上海・東京リージョンのECSに以下のMWをインストール   
・Postfix-2.10.1-7　※postfixはECSパブリックイメージ（centos_7_06_64_20G_alibase_20190711.vhd）に導入済み  
・cyrus-sasl-plain-2.1.26-23
```
# yum install -y cyrus-sasl-plain
```
   
・手順②   
上記すべてを設定後、上海・東京リージョンのECSで以下を実行
```
# chmod 600 /etc/postfix/sasl_passwd
# postmap hash:/etc/postfix/sasl_passwd
# systemctl restart postfix
```

   
・手順③   
上海リージョンのECSで以下を実行
```
# echo "<本文>" | mail -s "<件名>" -r <Fromアドレス> <Toアドレス>
```
※SESをサンドボックス環境で利用しているならば、FromアドレスおよびToアドレスのメールアドレス検証またはドメイン検証が必要


   
   
   
   
   
**結果は以下になります。**
***
   
   
■上海リージョンECS
```
[root@ecs-suzuki10-blogmail ~]# grep 8DE012082C /var/log/maillog
Oct 18 17:35:15 iZuf6h1kfgutxc3el68z2lZ postfix/pickup[14871]: 8DE012082C: uid=0 from=<メールアドレス>
Oct 18 17:35:15 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[14944]: 8DE012082C: message-id=<5da98753.O30Lr64J+jeKiafh%tomoya.suzuki10@g.softbank.co.jp>
Oct 18 17:35:15 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[14872]: 8DE012082C: from=<メールアドレス>, size=491, nrcpt=1 (queue active)
Oct 18 17:35:15 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[14946]: 8DE012082C: to=<メールアドレス>, relay=10.20.8.37[10.20.8.37]:3535, delay=0.23, delays=0.02/0.02/0.11/0.08, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as B713F20812)
Oct 18 17:35:15 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[14872]: 8DE012082C: removed
```
dsn=2.0.0の250 okでrelay=10.20.8.37[10.20.8.37]:3535にメールが送信されました。

   
■東京リージョンECS
```
[root@ecs-suzuki10-blogmail ~]# grep B713F20812 /var/log/maillog
Oct 18 17:35:15 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[27186]: B713F20812: client=unknown[172.16.22.241]
Oct 18 17:35:15 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[27189]: B713F20812: message-id=<5da98753.O30Lr64J+jeKiafh%メールアドレス>
Oct 18 17:35:15 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[27154]: B713F20812: from=<メールアドレス>, size=721, nrcpt=1 (queue active)
Oct 18 17:35:18 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[27190]: B713F20812: to=<メールアドレス>, relay=email-smtp.us-east-1.amazonaws.com[52.54.1.156]:587, delay=2.3, delays=0.04/0.02/1.4/0.83, dsn=2.0.0, status=sent (250 Ok 0100016dde38a703-1b19a90e-48e6-4b58-9044-242e54fd4d99-000000)
Oct 18 17:35:18 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[27154]: B713F20812: removed
```
client=unknown[172.16.22.241]からsmtp通信を受け、   
dsn=2.0.0の250 okでメールがrelay=email-smtp.us-east-1.amazonaws.com[52.54.1.156]:587に送信されました。



      
## おわりに   
今回は、Cloud Enterprise Network（CEN）を利用した日中間メールプロキシについて、   
中国→日本の経路のみ実際に環境を構築して検証してみました。   
   
※補足ですが、Alibaba CloudのECSには25番ポート制限があるので、postfixのポートには気を付ける必要があります。   
> https://www.alibabacloud.com/cloud-tech/doc-detail/49123.htm
   
以上です。





