---
title: "CENで日中間メール設定方法②"
metaTitle: "CENを利用した日中間メールプロキシについて #2"
metaDescription: "CENを利用した日中間メールプロキシについて #2"
date: "2019-11-14"
author: "SBC engineer blog"
thumbnail: "/Network_images_26006613458959500/20191112144211.png"
---

## CENを利用した日中間メールプロキシについて　その2


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191106135106.png "img")


本記事では、日中間のメール相互送信について書かせていただきます。  
  
  
  
# 日中リージョン間メール配送

# 構成
構成は以下になります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191112144211.png "img")


前回から構成を変更しています。  
  
新たに「172.12.128.0/24」、「10.20.128.0/24」のVSwitchを作成し、  
Linuxサーバを別途ローンチし、ドメインを割り当て、簡易的なメールの送受信サーバ(MTA)としました。
  
また、前回はメール送信をpostfixの転送サーバ内で行いましたが、  
今回はサーバを分け、Windows Severを疑似送信クライアント(MUA)として独立させました。
  
今回の検証は以下のパターンで行います。  
・上海リージョンからCEN経由で東京リージョンへの内部メール配送  
・東京リージョンからCEN経由で上海リージョンへの内部メール配送  
・上海リージョンからCEN + 東京リージョン + SES経由で外部Gmail配送  
・Gmailからインターネット + 東京リージョン + CEN経由で上海リージョンへのメール配送  
  
以下より、上記を検証できる環境の設定を構築していきます。  
              
# 設定
## VPC / VSwitch設定  
以下は前回から引き続き使用しております。  
・VPC（172.16.0.0/12） / VSwitch（172.16.22.0/24）  
・VPC（10.0.0.0/8） / VSwitch（10.20.8.0/24）  
  
上記に加え、新しくVPCとVSwitchを上海リージョンと東京リージョンに追加しています。  
詳細は以下になります。  


|Region|VPC|VSwitch|Zone|note|
|---|---|---|---|---|
|cn-shanghai|172.16.0.0/12|172.16.22.0/24|cn-shanghai-a|CEN接続VPCとして使用|
|cn-shanghai|172.16.0.0/12|172.16.128.0/24|cn-shanghai-a|メール送受信元VPCとして使用|
|ap-northeast-1|10.0.0.0/8|10.20.8.0/24|ap-northeast-1a|CEN接続VPCとして使用|
vvap-northeast-1|10.0.0.0/8|10.20.128.0/24|ap-northeast-1a|メール送受信元VPCとして使用|

            
## CEN設定  
前回のCENを継続使用します。  
詳細は以下をご確認ください。  

> https://sbopsv.github.io/cloud-tech/usecase-network/NETWORK_003_cen-mail_part1



            
## VPN接続設定  
以下の構成になっています。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111165215.png "img")

ECSの外部接続25番ポート制限を回避するため、メールリレー先のVPCとVPN接続しています。  
<span style="color: #ff0000">※メール送受信に465ポートや587ポートを使用し、  
　STARTTLSやSMTPSを使うようであれば、ECSの制限に抵触しないのでVPN接続は利用しなくても問題ありません。</span>



今回作成したVPN接続は以下になります。  
■VPN GateWay   

|No|Region|VPC|IPsec-VPN|SSL-VPN|IP Address|
|---|---|---|---|---|---|
|①|cn-shanghai|172.16.0.0/12|有効化|無効化|47.100.9.139|
|②|cn-shanghai|172.16.0.0/12|有効化|無効化|101.132.118.151|
|③|ap-northeast-1|10.0.0.0/8_|有効化|無効化|47.74.52.238|
|④|ap-northeast-1|10.0.0.0/8|有効化|無効化|47.74.1.130|

   
■Customer GateWay    

|No|IP Address|note|
|---|---|---|
|①|101.132.118.151|対向のVPN Gateway②のIPアドレスを指定|
|②|47.100.9.139|対向のVPN Gateway①のIPアドレスを指定|
|③|47.74.1.130|対向のVPN Gateway④のIPアドレスを指定|
|④|47.74.52.238|対向のVPN Gateway③のIPアドレスを指定|

   
■IPsec Connection    

|No|VPN GateWay|Customer Gateway|ローカルネットワーク|リモートネットワーク|今すぐ有効化|高度な構成|事前共有鍵|LocalId|RemoteId|
|---|---|---|---|---|---|---|---|---|---|
|①|VPN GateWay①を指定|Customer Gateway①を指定|172.16.128.0/24|172.16.22.0/24|はい|on|IPsec Connection②と同じ任意の文字列|47.100.9.139(VPN GateWay①のIP)	|101.132.118.151(Customer GateWay①のIP)|
|②|VPN GateWay②を指定|Customer Gateway②を指定|172.16.22.0/24|172.16.128.0/24|はい|on|IPsec Connection①と同じ任意の文字列	|101.132.118.151(VPN GateWay②のIP)|47.100.9.139(Customer GateWay②のIP)|
|③|VPN GateWay③を指定|Customer Gateway③を指定|10.20.128.0/24|10.20.8.0/24|はい|on|IPsec Connection④と同じ任意の文字列|47.74.52.238(VPN GateWay③のIP)|47.74.1.130(Customer GateWay③のIP)|
|④|VPN GateWay④を指定|Customer Gateway④を指定|10.20.8.0/24|10.20.128.0/24|はい|on|IPsec Connection③と同じ任意の文字列|47.74.1.130(VPN GateWay④のIP)|47.74.52.238(Customer GateWay④のIP)|


※その他のパラメータはデフォルト値としています。  


            
## ECS設定 #network interface
ホスト名およびネットワークインターフェースは以下の構成になっています。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191112190021.png "img")

|No|HostName|ENI|EIP|note|
|---|---|---|---|---|
|①|なし|172.16.128.12|なし|RDP接続のためにEIPは付与しているが、本構成においては外部接続しないためEIPなしと記載|
|②|smtp.alicloud-mail-cntest.com|172.16.128.11|なし|SSH接続のためにEIPは付与しているが、本構成においては外部接続しないためEIPなしと記載|
|③|なし|172.16.22.11|なし|SSH接続のためにEIPは付与しているが、本構成においては外部接続しないためEIPなしと記載|
|④|なし|10.20.128.12|なし|RDP接続のためにEIPは付与しているが、本構成においては外部接続しないためEIPなしと記載|
|⑤|smtp.alicloud-mail-jptest.com|10.20.128.11|47.74.5.208|AWS SESへの外部送信のためEIPを付与|
|⑥|rsmtp.alicloud-mail-cntest.com|10.20.8.11|47.74.14.72|AWS SESへの外部送信および外部メール受信のためEIPを付与|


  
   
今回はドメインの利用や、DNSの利用をしているため、  
メール送受信サーバ(ECS⑤)と外部メール受信サーバ(ECS⑥)にはホスト名とEIPを付与しています。    
   
上海リージョンのメール送受信サーバ②は今回直接上海リージョンからメール送受信を行う構成にはなっていないため、  
ホスト名を付与しているもののEIPは付与していません。

            
## ECS設定 #SecurityGroup
SecurityGroupは以下の設定になっています。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191112152337.png "img")

  
ECS①のSG用途詳細  
```
IN tcp 3389/3389 cidr_ip=<クライアントGIP>    #クライアントPCからECS①（Windows）に対してリモートデスクトップ接続用途で使用
IN icmp -1/-1 cidr_ip=<クライアントGIP>    #クライアントPCからECS①（Windows）に対して死活確認用に使用
IN all -1/-1 cidr_ip=172.16.0.0/12    #同VPC内疎通のために使用
```
   
ECS②のSG用途詳細  
```
IN tcp 22/22 cidr_ip=<クライアントGIP>    #クライアントPCからECS②（CentOS）に対してSSH接続用途で使用
IN icmp -1/-1 cidr_ip=<クライアントGIP>    #クライアントPCからECS②（CentOS）に対して死活確認用に使用
IN all -1/-1 cidr_ip=172.16.0.0/12    #同VPC内疎通のために使用
```
   
ECS③のSG用途詳細  
```
IN tcp 22/22 cidr_ip=<クライアントGIP>    #クライアントPCからECS③（CentOS）に対してSSH接続用途で使用
IN icmp -1/-1 cidr_ip=<クライアントGIP>    #クライアントPCからECS③（CentOS）に対して死活確認用に使用
IN all -1/-1 cidr_ip=10.0.0.0/8    #CEN接続先VPNとの疎通のために使用
IN all -1/-1 cidr_ip=172.16.0.0/12    #同VPC内疎通のために使用
```
   
ECS④のSG用途詳細  
```
IN tcp 3389/3389 cidr_ip=<クライアントGIP>    #クライアントPCからECS④（Windows）に対してリモートデスクトップ接続用途で使用
IN icmp -1/-1 cidr_ip=<クライアントGIP>    #クライアントPCからECS④（Windows）に対して死活確認用に使用
IN all -1/-1 cidr_ip=10.0.0.0/8    #同VPC内疎通のために使用
```
   
ECS⑤のSG用途詳細  
```
IN tcp 22/22 cidr_ip=<クライアントGIP>    #クライアントPCからECS⑤（CentOS）に対してSSH接続用途で使用
IN icmp -1/-1 cidr_ip=<クライアントGIP>    #クライアントPCからECS⑤（CentOS）に対して死活確認用に使用
IN all -1/-1 cidr_ip=10.0.0.0/8    #同VPC内疎通のために使用
```
   
ECS⑥のSG用途詳細  
```
IN tcp 22/22 cidr_ip=<クライアントGIP>    #クライアントPCからECS⑥（CentOS）に対してSSH接続用途で使用
IN icmp -1/-1 cidr_ip=<クライアントGIP>    #クライアントPCからECS⑥（CentOS）に対して死活確認用に使用
IN all -1/-1 cidr_ip=10.0.0.0/8    #同VPC内疎通のために使用
IN all -1/-1 cidr_ip=172.16.0.0/12    #CEN接続先VPNとの疎通のために使用
IN all 25/25 cidr_ip=0.0.0.0/0    #外部ドメインからECS⑤ドメイン宛のメールを受け取るために使用。オープンリレーにならないようpostfix側で制限
```
  
   
ECS⑥のみ25番ポートを全開放しています。  
これは今回GmailからのメールをECS⑥で受信するためです。  
※gmailのSMTPサーバのIP範囲は広く、また動的に変化するので全開放しています。    
  
また、Alibaba CloudのECSには外部25番ポート制限がありますが、  
インバウンド通信の25番ポートであれば通信可能です。    
  
ただし、アウトバウンド通信は制限があるため、25番ポートでの外部メール送信はできません。  
上記の制限があるため、オープンリレーにもなりません。    


※本構成では念のため、不要な通信をpostfixでもブロックするようにしています。  
　そのため、インバウンド通信も許可された範囲以外は破棄する設定となっています。  

   
なお、アウトバウンドはすべてフルオープンとなっています。
  

  
            
## ECS設定 #OS
OSは以下の構成になっています。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191112161057.png "img")
   
メール送信クライアント(MUA)をWindows Serverが担当し、MTAをCentOSが担当します。  
  
使用するAMIは以下を使用しています。  
・Windows Server
```
win2019_64_dtc_1809_en-us_40G_alibase_20190816.vhd
```
・CentOS
```
centos_7_06_64_20G_alibase_20190711.vhd
```





            
## DNS設定 #AWS Route53
外部メール受信用にドメインの取得とMXレコードを登録します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191112155912.png "img")
     
上記図の両リージョンの赤枠ECSのドメイン取得とMXレコードを登録します。  
今回もメール送信にAWS SESを使用するため、DKIMなどの登録を簡易に実装できるようAWSのRoute53を使用しています。  


        
ドメイン取得については以下をご確認ください。  

> https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/registrar.html

> https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/resource-record-sets-creating.htm


        
今回取得したドメインと登録したMX +Aレコードは以下になります。 


|No|domain|Record(MX)|Record(A)|note|
|---|---|---|---|---|
|①|alicloud-mail-cntest.com|alicloud-mail-cntest.com MX 10 rsmtp.alicloud-mail-cntest.com.|vrsmtp.alicloud-mail-cntest.com A 47.74.14.72|外部メールを東京→CEN経由→上海へ配送するためのレコード|
|②|alicloud-mail-jptest.com|alicloud-mail-jptest.com MX 10 smtp.alicloud-mail-jptest.com.|smtp.alicloud-mail-jptest.com A 47.74.5.208|外部メールをECS②へ配送するためのレコード|

            
## AWS SES設定
AWS SESの設定をします。   
今回はサンドボックス環境上で、ドメイン検証とメールアドレス検証をします。  
送信時のFromアドレスに独自ドメインを、ToアドレスにGmailを使用するので、両者とも登録していきます。
         

1. Gmailのメールアドレス検証を実施（Toアドレス）
> https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-email-addresses.html
   

2. ドメインの検証を実施（Fromアドレス）    
> https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-domains.html

<span style="color: #ff0000">※検証時にDKIMの登録も案内されるので登録します。</span>
   

3. SMTPユーザとSMTPパスワードを発行
> https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/smtp-credentials.html





            
## Postfix設定
Postfixは以下の設定になっています。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191112160522.png "img")
   


### main.cf
■ECS①
```
myhostname = smtp.alicloud-mail-cntest.com
mydomain = alicloud-mail-cntest.com
myorigin = $mydomain

#以下をコメントアウトし追記
#inet_interfaces = localhost
inet_interfaces = all

#以下をコメントアウトし追記
#inet_protocols = all
inet_protocols = ipv4

#以下をコメントアウトし追記
#mydestination = $myhostname, localhost.$mydomain, localhost
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain

mynetworks = 172.16.128.0/24, 172.16.22.0/24, 10.20.128.0/24, 10.20.8.0/24, 127.0.0.0/8

home_mailbox = Maildir/
mail_spool_directory = /var/spool/mail/

transport_maps = hash:/etc/postfix/transport
```
  
上海リージョンの送受信サーバに設定しているため、ドメインやhostname、メールボックス設定などを設定しています。
      
■ECS②
```
#以下をコメントアウトし追記
#inet_interfaces = localhost
inet_interfaces = all

#以下をコメントアウトし追記
#inet_protocols = all
inet_protocols = ipv4

mynetworks = 172.16.128.0/24, 172.16.22.0/24, 10.20.128.0/24, 10.20.8.0/24, 127.0.0.0/8

transport_maps = hash:/etc/postfix/transport
```
  
メールをリレーするだけのサーバのため、設定を最低限にしています。
      
■ECS③
```
#以下を追記
myhostname = smtp.alicloud-mail-jptest.com
mydomain = alicloud-mail-jptest.com
myorigin = $mydomain

#以下をコメントアウトし追記
#inet_interfaces = localhost
inet_interfaces = all

#以下をコメントアウトし追記
#inet_protocols = all
inet_protocols = ipv4

#以下をコメントアウトし追記
#mydestination = $myhostname, localhost.$mydomain, localhost
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain

#以下を追記
mynetworks = 172.16.128.0/24, 172.16.22.0/24, 10.20.128.0/24, 10.20.8.0/24, 127.0.0.0/8
home_mailbox = Maildir/
mail_spool_directory = /var/spool/mail/

#以下を追記
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_use_tls = yes
smtp_tls_security_level = may
smtp_tls_note_starttls_offer = yes
smtp_tls_CAfile = /etc/ssl/certs/ca-bundle.crt
transport_maps = hash:/etc/postfix/transport
```
  
今回ECS③ではメール送信検証はしませんが、SESに外部送信できるように設定しています。  
また、東京リージョンの送受信サーバに設定しているため、ドメインやhostname、メールボックス設定などを設定しています。
      
■ECS④
```
#以下をコメントアウトし追記
#inet_interfaces = localhost
inet_interfaces = all

#以下をコメントアウトし追記
#inet_protocols = all
inet_protocols = ipv4

#以下を追記
mynetworks = 172.16.128.0/24, 172.16.22.0/24, 10.20.128.0/24, 10.20.8.0/24, 127.0.0.0/8

#以下を追記
relay_domains = alicloud-mail-cntest.com, alicloud-mail-jptest.com

#以下を追記
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_use_tls = yes
smtp_tls_security_level = may
smtp_tls_note_starttls_offer = yes
smtp_tls_CAfile = /etc/ssl/certs/ca-bundle.crt
transport_maps = hash:/etc/postfix/transport
smtpd_recipient_restrictions = permit_mynetworks, reject_unverified_recipient, reject_unknown_recipient_domain, reject_unauth_destination
```
  
外部からメールを受信するサーバのため、    
relay_domains設定とsmtpd_recipient_restrictions設定を付与しています。
   
      
### sasl_passwd
■ECS① / ECS②  
外部送信しないため、作成しません。  
  
■ECS③ / ECS④  
ファイルを「/etc/postfix/sasl_passwd」に新規作成し、SESのSMTP認証情報を入力します。  
```
[<AWS SESのSMTPエンドポイント>]:587 <SMTPユーザ>:<SMTPパスワード>
```
※「AWS SES設定」の「3. SMTPユーザとSMTPパスワードを発行」で発行したSMTPユーザとSMTPパスワードを入力します  
  
※ AWS SESのSMTPエンドポイントについてはこちらをご確認ください
> https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/smtp-connect.html


      
### transport
ドメインごとのメールリレー先を設定します。  
   
■ECS①
```
alicloud-mail-cntest.com  :
alicloud-mail-jptest.com  relay:[172.16.22.11]:25
*                         relay:[172.16.22.11]:25
```
自ドメイン宛のメールをローカルに配送するため、1行目を設定しています。  
東京リージョン宛のメールを内部メール送信するため、2行目を設定しています。  
gmailを宛先にしたメールを東京リージョンにリレーするため、3行目を設定しています。  
   
■ECS②
```
alicloud-mail-jptest.com  relay:[10.20.8.11]:25
alicloud-mail-cntest.com  relay:[172.16.128.11]:25
*                         relay:[10.20.8.11]:25
```
上海リージョン行きのメールと東京リージョン行きのメールをリレーするため、1行目と2行目を設定しています。  
gmailなどの外部ドメインを宛先にしたメールを東京リージョンにリレーするため、3行目を設定しています。  
   
■ECS③
```
alicloud-mail-jptest.com  :
alicloud-mail-cntest.com  relay:[10.20.8.11]:25
*                         relay:[email-smtp.us-east-1.amazonaws.com]:587
```
自ドメイン宛のメールをローカルに配送するため、1行目を設定しています。  
上海リージョン宛のメールを内部メール送信するため、2行目を設定しています。  
gmailなどの外部ドメインを宛先にしたメールをSESにリレーするため、3行目を設定しています。  
   
■ECS④
```
alicloud-mail-jptest.com  relay:[10.20.128.11]:25
alicloud-mail-cntest.com  relay:[172.16.22.11]:25
*                         relay:[email-smtp.us-east-1.amazonaws.com]:587
```
上海リージョン行きのメールと東京リージョン行きのメールをリレーするため、1行目と2行目を設定しています。  
gmailなどの外部ドメインを宛先にしたメールをSESにリレーするため、3行目を設定しています。  

            
## OS設定手順
上記設定後、以下のコマンドを実行します。
   


■ECS①
```
#PostfixはAMIにインストール済みのPostfix-2.10.1-7を使用
#本ブログではcyrus-sasl-plain-2.1.26-23を使用
yum install -y cyrus-sasl-plain

chmod 600 /etc/postfix/transport
postmap /etc/postfix/transport

#下記のユーザ名は今回suzukiで設定
useradd <user名>

systemctl restart postfix
```
自ドメインのメールを受信するためユーザを作成しています。  
   
■ECS②
```
#PostfixはAMIにインストール済みのPostfix-2.10.1-7を使用
#本ブログではcyrus-sasl-plain-2.1.26-23を使用
yum install -y cyrus-sasl-plain

chmod 600 /etc/postfix/transport
postmap /etc/postfix/transport
systemctl restart postfix
```
   
■ECS③
```
#PostfixはAMIにインストール済みのPostfix-2.10.1-7を使用
#本ブログではcyrus-sasl-plain-2.1.26-23を使用
yum install -y cyrus-sasl-plain

chmod 600 /etc/postfix/sasl_passwd
postmap /etc/postfix/sasl_passwd
chmod 600 /etc/postfix/transport
postmap /etc/postfix/transport

#下記のユーザ名は今回suzukiで設定
useradd <user名>

systemctl restart postfix
```
自ドメインのメールを受信するためユーザを作成しています。  
   
■ECS④
```
#PostfixはAMIにインストール済みのPostfix-2.10.1-7を使用
#本ブログではcyrus-sasl-plain-2.1.26-23を使用
yum install -y cyrus-sasl-plain

chmod 600 /etc/postfix/sasl_passwd
postmap /etc/postfix/sasl_passwd
chmod 600 /etc/postfix/transport
postmap /etc/postfix/transport
systemctl restart postfix
```





            
# 検証実施
## リージョン間メール相互送信検証  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191112155912.png "img")
   
上記図の両リージョンの赤枠がメール送受信サーバ(MTA)になります。  
そして前回同様、メールのリレーをCENで接続したVPC内で行い、メールをお互いに送り合います。







            
### リージョン間メール相互送信検証 #上海→東京
上海リージョンから東京リージョンへ内部メール配送をします。  


#### メール送信手順
***
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111144439.png "img")
```
$To="suzuki@alicloud-mail-jptest.com"
$From="suzuki@alicloud-mail-cntest.com”
$Subject="jp send test"
$body="test message"

# 送信サーバー設定
$SMTPServer="172.16.128.11"
$Port=“25”

# メール送信
Send-MailMessage -To $To -From $From -Subject $Subject -Body $body -SmtpServer $SMTPServer -Port $Port -Encoding UTF8

```
Windows PowerShellで上記を実行します。  
   
上海リージョンのWindows Serverからメールの送信を行います。  
宛先は東京リージョンの自ドメイン（alicloud-mail-jptest.com）です。  
まずは同リージョンのMTAに転送します。  
               
#### メール送信結果
***
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111134346.png "img")
```
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[3398]: connect from unknown[172.16.128.12]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[3398]: 7E51A2079C: client=unknown[172.16.128.12]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[3401]: 7E51A2079C: message-id=<>
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[3158]: 7E51A2079C: from=<suzuki@alicloud-mail-cntest.com>, size=456, nrcpt=1 (queue active)
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[3402]: 7E51A2079C: to=<suzuki@alicloud-mail-jptest.com>, relay=172.16.22.11[172.16.22.11]:25, delay=0.07, delays=0.02/0.01/0.02/0.02, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as 8B09D20799)
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[3158]: 7E51A2079C: removed

```
Windows Serverからメールを受信し、  
Toドメイン（alicloud-mail-jptest.com）を確認後、VPN接続を経由し、CENに接続されたリレー先に配送されます。
         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111134410.png "img")
```
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2327]: connect from unknown[172.16.128.11]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2327]: 8B09D20799: client=unknown[172.16.128.11]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2330]: 8B09D20799: message-id=<>
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2138]: 8B09D20799: from=<suzuki@alicloud-mail-cntest.com>, size=681, nrcpt=1 (queue active)
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2327]: disconnect from unknown[172.16.128.11]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[2331]: 8B09D20799: to=<suzuki@alicloud-mail-jptest.com>, relay=10.20.8.11[10.20.8.11]:25, delay=0.22, delays=0.01/0.01/0.12/0.09, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as B379E20799)
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2138]: 8B09D20799: removed

```
CENで接続されたVPC内のサーバから東京リージョンのリレーサーバにメールが転送されます。
         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111134430.png "img")
```
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2787]: connect from unknown[172.16.22.11]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2787]: B379E20799: client=unknown[172.16.22.11]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2790]: B379E20799: message-id=<>
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2533]: B379E20799: from=<suzuki@alicloud-mail-cntest.com>, size=906, nrcpt=1 (queue active)
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2787]: disconnect from unknown[172.16.22.11]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[2791]: B379E20799: to=<suzuki@alicloud-mail-jptest.com>, relay=10.20.128.11[10.20.128.11]:25, delay=0.12, delays=0.04/0.03/0.01/0.02, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as CAF262079A)
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2533]: B379E20799: removed
```
上海リージョンのリレーサーバからメールを受けて、自ドメイン（alicloud-mail-jptest.com）のサーバにメールがリレーされます。
         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111134449.png "img")
```
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2954]: connect from unknown[10.20.8.11]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2954]: CAF262079A: client=unknown[10.20.8.11]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2957]: CAF262079A: message-id=<>
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2608]: CAF262079A: from=<suzuki@alicloud-mail-cntest.com>, size=1125, nrcpt=1 (queue active)
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2954]: disconnect from unknown[10.20.8.11]
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/local[2958]: CAF262079A: to=<suzuki@alicloud-mail-jptest.com>, relay=local, delay=0.02, delays=0.02/0.01/0/0, dsn=2.0.0, status=sent (delivered to maildir)
Nov  8 18:55:48 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2608]: CAF262079A: removed

```
自ドメイン（alicloud-mail-jptest.com）宛のメールを受信したため、ローカル配送し、設定されたメールディレクトリに配送されました。  

   
      
■メール内容は以下になります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111162312.png "img")
   


            

### リージョン間メール相互送信検証 #東京→上海
東京リージョンから上海リージョンへののメール配送遷移は以下になります。  
上海リージョンと挙動はほぼ同じとなります。

#### メール送信手順
***
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111134523.png "img")
```
$To="suzuki@alicloud-mail-cntest.com"
$From="suzuki@alicloud-mail-jptest.com”
$Subject="cn send test"
$body="test message"

# 送信サーバー設定
$SMTPServer="10.20.128.11"
$Port=“25”

# メール送信
Send-MailMessage -To $To -From $From -Subject $Subject -Body $body -SmtpServer $SMTPServer -Port $Port -Encoding UTF8
```
Windows PowerShellで上記を実行します。  
東京リージョンのWindows Severからメールを送信します。  

               
#### メール送信結果
***
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111134538.png "img")
```
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2982]: connect from unknown[10.20.128.12]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2982]: 461DA2079B: client=unknown[10.20.128.12]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2985]: 461DA2079B: message-id=<>
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2608]: 461DA2079B: from=<suzuki@alicloud-mail-jptest.com>, size=455, nrcpt=1 (queue active)
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[2986]: 461DA2079B: to=<suzuki@alicloud-mail-cntest.com>, relay=10.20.8.11[10.20.8.11]:25, delay=0.08, delays=0.04/0.02/0.02/0.02, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as 5791420799)
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2608]: 461DA2079B: removed
```
自ドメイン（alicloud-mail-cntest.com）宛メールをRelay設定のドメイン別配送設定に従い、VPN接続先にリレーされます。
         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111134557.png "img")
```
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2813]: connect from unknown[10.20.128.11]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2813]: 5791420799: client=unknown[10.20.128.11]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2816]: 5791420799: message-id=<>
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2533]: 5791420799: from=<suzuki@alicloud-mail-jptest.com>, size=676, nrcpt=1 (queue active)
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2813]: disconnect from unknown[10.20.128.11]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[2817]: 5791420799: to=<suzuki@alicloud-mail-cntest.com>, relay=172.16.22.11[172.16.22.11]:25, delay=0.21, delays=0.01/0.02/0.11/0.08, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as 7D3D220799)
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2533]: 5791420799: removed
```
CEN経由で上海リージョンにリレーされます。
         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111134614.png "img")
```
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2350]: connect from unknown[10.20.8.11]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2350]: 7D3D220799: client=unknown[10.20.8.11]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2353]: 7D3D220799: message-id=<>
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2138]: 7D3D220799: from=<suzuki@alicloud-mail-jptest.com>, size=899, nrcpt=1 (queue active)
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2350]: disconnect from unknown[10.20.8.11]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[2354]: 7D3D220799: to=<suzuki@alicloud-mail-cntest.com>, relay=172.16.128.11[172.16.128.11]:25, delay=0.09, delays=0.04/0.01/0.02/0.02, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as 9007F2079C)
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2138]: 7D3D220799: removed
```
CENで接続された東京リージョンからメールを受け取り、自ドメイン（alicloud-mail-cntest.com）のサーバへメールが配送されます。
         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111134630.png "img")
```
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[3422]: connect from unknown[172.16.22.11]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[3422]: 9007F2079C: client=unknown[172.16.22.11]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[3425]: 9007F2079C: message-id=<>
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[3158]: 9007F2079C: from=<suzuki@alicloud-mail-jptest.com>, size=1123, nrcpt=1 (queue active)
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[3422]: disconnect from unknown[172.16.22.11]
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/local[3426]: 9007F2079C: to=<suzuki@alicloud-mail-cntest.com>, relay=local, delay=0.02, delays=0.01/0.01/0/0, dsn=2.0.0, status=sent (delivered to maildir)
Nov  8 19:03:45 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[3158]: 9007F2079C: removed
```
自ドメイン（alicloud-mail-cntest.com）宛のメールを受信したため、ローカル配送し、設定されたメールディレクトリに配送されました。

   
      
■メール内容は以下になります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111162223.png "img")





            
## 外部メール送信検証 #上海→CEN→東京→SES→Gmail
今度は前回同様上海リージョンからCENを経由してGmailにメールを外部送信します。  
#### メール送信手順
***
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111144535.png "img")
```
$To="<Gmailアドレス>"
$From="suzuki@alicloud-mail-cntest.com”
$Subject="cn cen send test"
$body="test message"

# 送信サーバー設定
$SMTPServer="172.16.128.11"
$Port=“25”

# メール送信
Send-MailMessage -To $To -From $From -Subject $Subject -Body $body -SmtpServer $SMTPServer -Port $Port -Encoding UTF8
```
ToアドレスにSESでメールアドレス検証したGmailアドレスを指定します。  

               
#### メール送信結果
***
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111144556.png "img")
```
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[3434]: connect from unknown[172.16.128.12]
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[3434]: 2CA592079B: client=unknown[172.16.128.12]
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[3437]: 2CA592079B: message-id=<>
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[3158]: 2CA592079B: from=<suzuki@alicloud-mail-cntest.com>, size=462, nrcpt=1 (queue active)
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[3438]: 2CA592079B: to=<Gmailアドレス>, relay=172.16.22.11[172.16.22.11]:25, delay=0.07, delays=0.02/0.01/0.02/0.02, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as 386C520797)
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[3158]: 2CA592079B: removed
```
Relay設定の*にマッチしたため、CEN接続先のVPC内インスタンスにメールが配送されます。

         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111144610.png "img")
```
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2361]: connect from unknown[172.16.128.11]
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2361]: 386C520797: client=unknown[172.16.128.11]
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2364]: 386C520797: message-id=<>
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2138]: 386C520797: from=<suzuki@alicloud-mail-cntest.com>, size=688, nrcpt=1 (queue active)
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2361]: disconnect from unknown[172.16.128.11]
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[2365]: 386C520797: to=<Gmailアドレス>, relay=10.20.8.11[10.20.8.11]:25, delay=0.19, delays=0.01/0.01/0.1/0.07, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as 5A57120799)
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2138]: 386C520797: removed
```
日本リージョンにCEN経由でメールが配送されます。
         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111144626.png "img")
```
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2823]: connect from unknown[172.16.22.11]
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2823]: 5A57120799: client=unknown[172.16.22.11]
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2826]: 5A57120799: message-id=<>
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2533]: 5A57120799: from=<suzuki@alicloud-mail-cntest.com>, size=914, nrcpt=1 (queue active)
Nov  8 19:13:05 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2823]: disconnect from unknown[172.16.22.11]
Nov  8 19:13:07 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[2827]: 5A57120799: to=<Gmailアドレス>, relay=email-smtp.us-east-1.amazonaws.com[100.24.90.91]:587, delay=2.4, delays=0.04/0.01/1.5/0.88, dsn=2.0.0, status=sent (250 Ok 0100016e4ab7c399-5058a2a5-d4ad-407b-92b8-94472f229325-000000)
Nov  8 19:13:07 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2533]: 5A57120799: removed
```
Relay設定の*にマッチしたため、SESにメールが配送されます。  

   
      
■メール内容は以下になります。
>![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111162053.png "img")

   
メールがGmailに受信されました。



            
## 外部メール受信検証 #Gmail→R53→東京→CEN→上海
最後にGmailから送信したメールを上海リージョンの自ドメイン（alicloud-mail-cntest.com）宛に配送します。  
#### メール送信手順
***
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111144644.png "img")
>![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111163511.png "img")

Gmailからメールを上海リージョンのドメイン向けにメールを送信します。
上記はGmailでのメール内容となります。  

               
#### メール送信結果
***
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111144700.png "img")
```
Nov  8 19:19:36 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2829]: connect from mail-wm1-f50.google.com[209.85.128.50]
Nov  8 19:19:37 iZuf6h1kfgutxc3el68z2lZ postfix/verify[2833]: cache btree:/var/lib/postfix/verify_cache full cleanup: retained=0 dropped=0 entries
Nov  8 19:19:37 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2834]: 5AFFC20799: message-id=<20191108111937.5AFFC20799@rsmtp.alicloud-mail-cntest.com>
Nov  8 19:19:37 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2533]: 5AFFC20799: from=<double-bounce@rsmtp.alicloud-mail-cntest.com>, size=279, nrcpt=1 (queue active)
Nov  8 19:19:37 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[2835]: 5AFFC20799: to=<suzuki@alicloud-mail-cntest.com>, relay=172.16.22.11[172.16.22.11]:25, delay=0.18, delays=0/0.02/0.11/0.05, dsn=2.1.5, status=deliverable (250 2.1.5 Ok)
Nov  8 19:19:37 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2533]: 5AFFC20799: removed
Nov  8 19:19:40 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2829]: 5BD2820799: client=mail-wm1-f50.google.com[209.85.128.50]
Nov  8 19:19:40 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2834]: 5BD2820799: message-id=<CADaVyAXBTw=q_a8b7dXKM=QPpHNfBoyXhVFp6FOKx73urbW3tQ@mail.gmail.com>
Nov  8 19:19:40 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2533]: 5BD2820799: from=<Gmailアドレス>, size=2684, nrcpt=1 (queue active)
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[2835]: 5BD2820799: to=<suzuki@alicloud-mail-cntest.com>, relay=172.16.22.11[172.16.22.11]:25, delay=3.7, delays=3.5/0/0.09/0.06, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as E7F8220799)
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2533]: 5BD2820799: removed
```
Route53のMXとAレコードにより、25番ポートに自ドメイン（alicloud-mail-cntest.com）宛のメールを受けます。  
Postfixのrelay_domain設定に宛先アドレスがマッチしているため、メールが配送されます。  
         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111144713.png "img")
```
Nov  8 19:19:37 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2366]: connect from unknown[10.20.8.11]
Nov  8 19:19:37 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2366]: 81E4B20797: client=unknown[10.20.8.11]
Nov  8 19:19:37 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2366]: disconnect from unknown[10.20.8.11]
Nov  8 19:19:40 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2366]: connect from unknown[10.20.8.11]
Nov  8 19:19:40 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2366]: E7F8220799: client=unknown[10.20.8.11]
Nov  8 19:19:40 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[2369]: E7F8220799: message-id=<CADaVyAXBTw=q_a8b7dXKM=QPpHNfBoyXhVFp6FOKx73urbW3tQ@mail.gmail.com>
Nov  8 19:19:40 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2138]: E7F8220799: from=<Gmailアドレス>, size=2907, nrcpt=1 (queue active)
Nov  8 19:19:40 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[2366]: disconnect from unknown[10.20.8.11]
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/smtp[2370]: E7F8220799: to=<suzuki@alicloud-mail-cntest.com>, relay=172.16.128.11[172.16.128.11]:25, delay=0.09, delays=0.03/0.01/0.02/0.03, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as 082102079C)
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[2138]: E7F8220799: removed
```
postfixのmynetwork設定により、許可されたネットワークからメールが転送されてきたため、  relay設定に従い、自ドメイン（alicloud-mail-cntest.com）のサーバにメールが配送されます。
         
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111144729.png "img")
```
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[3439]: connect from unknown[172.16.22.11]
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[3439]: 082102079C: client=unknown[172.16.22.11]
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/cleanup[3442]: 082102079C: message-id=<CADaVyAXBTw=q_a8b7dXKM=QPpHNfBoyXhVFp6FOKx73urbW3tQ@mail.gmail.com>
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[3158]: 082102079C: from=<Gmailアドレス>, size=3131, nrcpt=1 (queue active)
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/smtpd[3439]: disconnect from unknown[172.16.22.11]
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/local[3443]: 082102079C: to=<suzuki@alicloud-mail-cntest.com>, relay=local, delay=0.03, delays=0.01/0.01/0/0, dsn=2.0.0, status=sent (delivered to maildir)
Nov  8 19:19:41 iZuf6h1kfgutxc3el68z2lZ postfix/qmgr[3158]: 082102079C: removed
```
自ドメイン（alicloud-mail-cntest.com）宛のメールが受信されたので、ローカルのユーザメールディレクトリに配送されました。  

   
      
■メール内容は以下になります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613458959500/20191111161923.png "img")





            
# おわりに  
今回は前回の内容をさらに補完した内容としました。  
外部メールを受信するにあたって、今回はGmailを使用しましたが、  
他のメールサービスでも受信できる構成となっています。  
  
日中間のメールは繋がりにくくなることもありますが、  
CENとメールリレーを利用できれば改善できる内容となっていますので、  
ぜひAlibaba CloudのCENを利用していただければと存じます。  
  
以上です。









