---
title: "IoT Platform MQTT通信方法"
metaTitle: "Alibaba Cloud IoT Platform入門　MQTT通信してみた"
metaDescription: "Alibaba Cloud IoT Platform入門　MQTT通信してみた"
date: "2019-06-25"
author: "SBC engineer blog"
thumbnail: "/IoT_Platform_images_17680117127207100000/20190625140901.png"
---

## Alibaba Cloud IoT Platform入門　MQTT通信してみた

本記事では、Alibaba CloudのIoT Platformを使って、mosquittoというオープンソースから直接コマンドを発行してMQTT通信をする方法を記載します。   

## 今回の内容

1.Alibaba Cloud IoT Platformの設定を行う     
2.mosquitto clientからPub通信を行う

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_17680117127207100000/20190625140901.png "img")


## 用語

* パブリッシャ・・・データを送付するクライアント
* サブスクライバ・・・データを受信するクライアント
* ブローカー・・・パブリッシャとサブスクライバを仲介する
* トピック・・・ブローカーがもつデータの送付先、アドレス

## プロダクト設定

IoT Platformの設定を進めていきます。
Alibaba Cloud IoT Platformでは、プロダクトとデバイスという概念があります。
プロダクトはデバイスの集合体です。IoT Platform を使用するための最初のステップは、プロダクトの作成です。


IoT platformを選択->デバイス管理->プロダクト->プロダクトの作成

以下のような画面が起動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_17680117127207100000/20190625141032.png "img")


ゆくゆくはSIMを使った通信を考慮して、「モバイル2G/3G/4G」を設定しておきましょう。

## デバイス設定
デバイス管理->デバイス->デバイスの作成

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_17680117127207100000/20190625151825.png "img")


DeviceNameには入力規則があるので、ヘルプで確認しておきましょう。
OKをクリックするとデバイス証明書が表示されるので、控えておきましょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_17680117127207100000/20190625141139.png "img")


productkey   : `a61QmwQD5ZF`     
DiviceName   : `mosheep`      
DeviceSecret : `********`

## トピック登録
先に説明しましたがトピックとはブローカー上に配置する宛先みたいなものです。プロダクト管理画面から作成したプロダクトを選択してください。

プロダクトの詳細画面にて「トピック」カテゴリを選択してください。
するとデフォルトで作成されたトピックが確認できると思います。

今回使用するトピックを作成していきます。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_17680117127207100000/20190625141438.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_17680117127207100000/20190625141101.png "img")



今回使用するトピックが作成できました。
```
`/a61QmwQD5ZF/${deviceName}/user/sheep`
```

これでIoT Plattformの設定は完了です。

## mosquittoの設定

次にクライアント側の作業を実施していきます。
IoT用語でいうパブリッシャとサブスクライバの環境になります。
先述の通りセンサー（マイコン）ではなくmosquittoで通信をみていこうと思います。


## 環境設定

`ECS(CentOS 7.x)＋パブリックIP`
以下のコマンドでmosquitto-clientsをインストールします。

```
yum -y install epel-release
yum -y install mosquitto
systemctl start mosquitto
systemctl enable mosquitto
```
※今回実施するmosquitto_pubはサービスを有効にしなくて実行できます。

これでmosquitto環境が作成されました。

## 通信用コマンドの作成

では、コマンドを実行してIoT Platformで確認してみましょう。

パブリッシュするためのコマンドは以下です。

```
mosquitto_pub -h  "ホスト名（エンドポイント名）" \
-i "クライアントID" \
-u "ユーザ名" \
-P "パスワード" \
-t "トピック" \
-m 'メッセージ' \
-q 'QoS'
```

それぞれ作り方を見ていきましょう。
詳細はTIPS！に記載しますが、クライアントIDとパスワードはAlibaba提供のツールの利用をお勧めします。


**Alibaba Cloud提供のハッシュ生成ツール**
> https://files.alicdn.com/tpsservice/88413c66e471bec826257781969d1bc7.zip

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_17680117127207100000/20190625141600.png "img")


作成するのに必要なパラメータは前段のデバイス証明書を参照しましょう。

```
<u>**ホスト名**</u>     
<font color="Magenta">[ProductKey]</font>.iot-as-mqtt.<font color="Magenta">[RegionId]</font>.aliyuncs.com

<u>**クライアントID**</u>     
<font color="Magenta">[ClientID]</font>|securemode=3,signmethod=hmacsha1|     
```

※securemode=2だとTLSモード、securemode=3だとTLS使わないモード     
※[ClientID]は上記のハッシュ生成ツールの任意で決めた文字列です。

```
<u>**ユーザ名**</u>     
<font color="Magenta">[deviceName]</font>&<font color="Magenta">[ProductKey]</font>

<u>**パスワード**</u>     
```

devicesercretとproductKey&deviceName&clientIdの文字列をsha1でハッシュ生成する     
※上記のハッシュ生成ツールで生成されたパスワードです。

```
<u>**トピック**</u>     
```
前段で作成したトピックを指定

```
<u>**メッセージ**</u>     
```
任意（運びたいデータ）

```
<u>**Qos**</u>     
```
0:届くか保証されない（かなり軽い）     
1:届くことが保証されるが重複の可能性あり（軽い）     
2:メッセージに過不足なく正確に届く（ちょっと重い)     


今回の認証情報でコマンドを作成すると以下のようなイメージになります（パスワードはサンプルです。）


```
mosquitto_pub \
-h "a61QmwQD5ZF.iot-as-mqtt.ap-northeast-1.aliyuncs.com" \
-i "cid|securemode=3,signmethod=hmacsha1|" \
-u "mosheep&a61QmwQD5ZF" \
-P "QQA5E3998123E8D7777FE7BDB7777C5B00DC6556" \
-t "/a61QmwQD5ZF/mosheep/user/sheep" \
-m '{id:"0001",data:"hello world"}' \
-q 0
```

上記コマンドを実行するとIoT Platformにデータが送信されます。

ではコンソール上で確認していきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_17680117127207100000/20190625141717.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_17680117127207100000/20190625141720.png "img")


mosquitto_pubで送付した値が受けれていますね。

## TIPS!
接続用のパスワードですが、
devicesercretとproductKey&deviceName&clientIdの文字列をsha1でハッシュ生成する必要があります。
詳細は以下のリンクに記載されておりますが、AlibabaCloudが提供しているツールを使うのが楽です。

**マニュアル**

> https://www.alibabacloud.com/cloud-tech/doc-detail/86706.html



## 最後に
GUIで設定するだけで、簡単にブローカーが作成できました。
mosquittoをクライアントとしてAlibaba CloudでMQTT通信を受信する流れをご理解いただけたと思います。  

