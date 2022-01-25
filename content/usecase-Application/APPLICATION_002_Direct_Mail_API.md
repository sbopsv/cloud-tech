---
title: "Direct Mailでメール：API編"
metaTitle: "Direct Mailでメールを送る方法：API、SMTP編"
metaDescription: "Direct Mailでメールを送る方法：API、SMTP編"
date: "2019-12-10"
author: "SBC engineer blog"
thumbnail: "/Application_images_26006613468518500/00001.png"
---

## Direct Mailでメールを送る方法：API、SMTP編

本記事では、Alibaba CloudのDirect Mailコンソールからではなく、Direct MailのAPI、SMTPを利用した送信方法をご紹介します。     

# APIでの送信

## APIメールの種類
APIでのメール送信方法のご紹介の前に、APIに準備されているメールの種類をご紹介します。     

* ・SingleSendMail     
　メールテンプレートを呼び出さずに送るメール
* ・BatchSendMail     
　メールテンプレートを呼び出して送るメール
      

今回は、BatchSendMail利用してメールを送信する方法を紹介していきたいと思います。     

## 前提
以下の設定がDirect Mailで完了していることを前提とします。     
未設定の場合はDirect Mailでメールを送る方法①を参考にして設定をしてみてください。     

* ・ドメインの登録
* ・送信者メールアドレスの作成
* ・メールテンプレートの作成
* ・受信者リストの作成

## 送信方法
APIを使用してメール送信を行う場合は署名が必要となります。
署名を生成する方法は[ドキュメント](https://www.alibabacloud.com/cloud-tech/doc-detail/29442.htm)に記載されています。     
しかし、SDKを利用することで署名不要となります。今回はPHPのSDKを使用して、メール送信行なっていきたいと思います。     
SDKはJava, PHP, C#の3種類があります。(2019年11月現在)PHPのSDKはバージョン5.3以降に対応しています。     

PHPのSDKは[こちら](http://aliyundm.oss-cn-hangzhou.aliyuncs.com/example/aliyun-php-sdk-dmV3.1.1.zip?file=aliyun-php-sdk-dmV3.1.1.zip)からダウンロードしてください。     
ダウンロードしたファイルを解凍し、「aliyun-php-sdk-core」および「aliyun-php-sdk-dm」フォルダーを
メール送信用ファイルと同じディレクトリに配置します。     

今回実行したPHP環境はバージョン7.2.19です。では実際にメール送信をするコードを書いていきたいと思います。     

* 先ほどインストールしたSDKを読み込みます。
```
include_once 'aliyun-php-sdk-core/Config.php';
use Dm\Request\V20151123 as Dm;
```

* 次にメールサーバ、アクススキー、シークレットアクセスキーをセットします。
     メールサーバは利用するリージョンによって異なります。     

|リージョン名|リージョン|メールサーバ|
|---|---|---|
|中国杭州|cn-hangzhou|dm.cn-hangzhou.aliyuncs.com|
|シンガポール|ap-southeast-1|dm.ap-southeast-1.aliyuncs.com|
|シドニー|ap-southeast-2|dm.ap-southeast-2.aliyuncs.com|

```
$iClientProfile = DefaultProfile::getProfile("リージョン", "アクセスキー", "シークレットキー");
//シンガポール、シドニーリージョンを使用する際、以下を追記してください。
$iClientProfile::addEndpoint("リージョン","リージョン","Dm","メールサーバ");
``` 

* メールサーバに接続するオブジェクトを作成し、リクエストするメールを作成します。     
今回はBatchSendMailを指定していますが、SingleSendMailを利用する際は[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/29460.htm)をご参照ください。
```
$client = new DefaultAcsClient($iClientProfile);
$request = new Dm\BatchSendMailRequest();    
```

* 送信者アドレスをセットします。     
送信者アドレスはすでにコンソールで作成されているものを使用します。
```
$request->setAccountName("送信者アドレス");
```

* アドレスタイプを選択します。     
0:ランダムアドレス 1:送信者アドレス     
※ランダムアドレス：システムによって生成されたランダムな文字列と送信者アドレスの組み合わせを表示します。
```
$request->setAddressType(1);
```

* テンプレートをセットします。
```
$request->setTemplateName("テンプレート名");
```

* 受信者リストをセットします。
```
$request->setReceiversName("受信者リスト");
```

* 最後にgetAcsResponseを呼び出し、メールを送信します。     
エラーが起きた際は、こちらの[エラーコード表](https://www.alibabacloud.com/cloud-tech/doc-detail/29447.htm)を参考にしてください。
```
try {
    $response = $client->getAcsResponse($request);
    print_r($response);
}catch (ClientException  $e) {
    print_r($e->getErrorCode());
    print_r($e->getErrorMessage());
}catch (ServerException  $e) {
    print_r($e->getErrorCode());
    print_r($e->getErrorMessage());
}
```

* 送信に成功すると以下のようなリクエストIDが返ってきます。     
```
[RequestId] => 5FE2F79A-80BF-44C9-93FD-F9DE8C436AA5
```

上記のコードをまとめておきます。
```
<?php
include_once 'aliyun-php-sdk-core/Config.php';
use Dm\Request\V20151123 as Dm;
$iClientProfile = DefaultProfile::getProfile("リージョン", "アクセスキー", "シークレットキー");
//シンガポール、シドニーリージョンを使用する際、以下を追記してください。
$iClientProfile::addEndpoint("リージョン","リージョン","Dm","メールサーバ");

$client = new DefaultAcsClient($iClientProfile);
$request = new Dm\BatchSendMailRequest();    

$request->setAccountName("送信者アドレス");
$request->setAddressType(1);
$request->setTemplateName("テンプレート名");
$request->setReceiversName("受信者リスト");
try {
    $response = $client->getAcsResponse($request);
    print_r($response);
}catch (ClientException  $e) {
    print_r($e->getErrorCode());
    print_r($e->getErrorMessage());
}catch (ServerException  $e) {
    print_r($e->getErrorCode());
    print_r($e->getErrorMessage());
}
?>
```


# SMTPでの送信方法
Direct MailではSMTPを利用してメールを送信することができます。     
SMTPが利用できれば様々な言語で利用することができます。[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/29449.htm)を参照してください。
     
今回はPythonを使用してメールを送信してみたいと思います。

## 前提
APIでの送信と同様に以下の設定がDirect Mailで完了していることを前提とします。     
未設定の場合は[こちら]()を参考にして設定をしてみてください。     

* ・ドメインの登録
* ・送信者メールアドレスの作成
* ・メールテンプレートの作成
* ・受信者リストの作成

また、SMTPでのメール送信ではコンソールよりSMTPのパスワードを設定しておく必要があります。     
Direct MailコンソールのSender Addressesより設定してください。     
※SMTPのパスワードには以下のような制約があります。
* ・10文字以上20文字以下
* ・数字または文字を使用可能
* ・数字、小文字、大文字はそれぞれ2つ以上の文字が必要
* ・単一の繰り返しは不可     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Application/Application_images_26006613468518500/20191120122136.png "img")

## 送信方法

Direct Mailを利用できるSMTPサーバは中国杭州、シンガポール、シドニーにそれぞれ準備されています。



|リージョン名|SMTPサーバ|
|---|---|
|中国杭州|smtpdm.aliyun.com|
|シンガポール|smtpdm-ap-southeast-1.aliyun.com|
|シドニー|smtpdm-ap-southeast-2.aliyun.com|

また、SMTPで使用できるポートは以下です。

* SMTPポート：25、80、465(SSL暗号化)

※Alibaba CloudのECSには25番ポート制限があるので、ECSからメールを送信する際は気をつけてください。     
> https://www.alibabacloud.com/cloud-tech/doc-detail/49123.htm


続いて、Pythonを使用したSMTPでのメール送信のコードを紹介します。     
コードは[ドキュメント](https://www.alibabacloud.com/cloud-tech/doc-detail/29453.htm)にも記載されています。     
今回実行したPython環境はバージョン2.7.5です。

* SMTPでのメール送信に使用するライブラリをインポートします。
```
import smtplib
import email
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.base import MIMEBase
from email.mime.application import MIMEApplication
from email.header import Header
```

* メール送信用のオブジェクトを作成します。

```
msg = MIMEMultipart('alternative')
```

送信するメールの情報をオブジェクトにセットします。

```
# 件名
msg['Subject'] = Header('件名'.decode('utf-8')).encode()

# 送信者名と送信者アドレス
msg['From'] = '%s <%s>' % (Header('送信者名'.decode('utf-8')).encode(),'送信者アドレス')

# 受信者アドレス
msg['To'] = '受信者アドレス'

# 返信先アドレス
msg['Reply-to'] = '返信先アドレス'

# メッセージID
msg['Message-id'] = email.utils.make_msgid()

# 日付
msg['Date'] = email.utils.formatdate() 

# テキストメールの本文
textplain = MIMEText('本文', _subtype='plain', _charset='UTF-8')
msg.attach(textplain)

# HTMLメールの本文
texthtml = MIMEText('本文', _subtype='html', _charset='UTF-8')
msg.attach(texthtml)
```

* SMTPサーバに接続するオブジェクトを作成し、接続先サーバをセットします。
```
client = smtplib.SMTP_SSL()
client.connect('SMTPサーバ', 465)
client.set_debuglevel(0)
```

* SMTPサーバへログインします。
```
username = '送信者アドレス'
password = 'SMTPパスワード'
client.login(username, password)
```

* メールを送信します。
```
client.sendmail(username,msg['To'], msg.as_string())
client.quit()
```

最後にコードをまとめておきます。
```
import smtplib
import email
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.base import MIMEBase
from email.mime.application import MIMEApplication
from email.header import Header

msg = MIMEMultipart('alternative')
msg['Subject'] = Header('[件名]'.decode('utf-8')).encode()
msg['From'] = '%s <%s>' % (Header('送信者名'.decode('utf-8')).encode(),'送信者アドレス')
msg['To'] = '受信者アドレス'
msg['Reply-to'] = '返信先アドレス'
msg['Message-id'] = email.utils.make_msgid()
msg['Date'] = email.utils.formatdate() 
textplain = MIMEText('本文', _subtype='plain', _charset='UTF-8')
msg.attach(textplain)
texthtml = MIMEText('本文', _subtype='html', _charset='UTF-8')
msg.attach(texthtml)
client = smtplib.SMTP_SSL()
client.connect('SMTPサーバ', 465)
client.set_debuglevel(0)
username = '送信者アドレス'
password = 'SMTPパスワード'
client.login(username, password)
client.sendmail(username,msg['To'], msg.as_string())
client.quit()
```

# おわりに
Direct Mailでメールを送る方法①に続き、今回はDirect MailのAPI、SMTPを使用したメール送信方法をご紹介しました。参考に頂ければ幸いです。     




