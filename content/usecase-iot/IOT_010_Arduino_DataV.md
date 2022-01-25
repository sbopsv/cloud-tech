---
title: "ArduinoからDataVへ可視化"
metaTitle: "IoTPlatformへArduinoからデータを送りDataVで可視化する"
metaDescription: "IoTPlatformへArduinoからデータを送りDataVで可視化する"
date: "2020-03-11"
author: "SBC engineer blog"
thumbnail: "/IoT_Platform_images_26006613530397700/20200309142543.png"
---

## IoTPlatformへArduinoからデータを送りDataVで可視化する

# はじめに
本記事では、Arduinoというマイコンに搭載されるメジャーなソフトウェアを利用して、Alibaba Cloudに接続、DataV可視化の方法をご紹介します。     

# 検証範囲
1. Seeed Wio LTE JP Version + SoracomAirでAlibabaCloud IoT Platformへ繋ぐ     
2. Wioデバイスから超音波センサーでデータを取得し、IoT Platformへデータを転送する     
3. IoT PlatformからルールエンジンでTableStoreへデータを格納する     
4. DataVで、データソースにTableStoreを指定し、取得データを可視化する     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200305172814.png "img")    
  
# デバイスについて
Soracom社が提供しているSeeed Wio LTE JP Version(Cat.1)を使用します。     
通信にはSoracomAirというコネクティビティサービスを利用します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200305173241.jpg "img")     

# 開発環境
* ArduinoIDE 1.89      
* ボードマネージャ Seeed STM32F4 version1.1.0
     

# IoT Platformの設定
IoT Platformの設定を行います。構築方法はここでは省略します。パラメータは以下です。    

|項目|パラメータ|
|---|---|
|ホスト名|a6V7HOmIB40.iot-as-mqtt.ap-northeast-1.aliyuncs.com|
|ポート|1883|
|クライアントID|Alibaba|securemode=3,signmethod=hmacsha1||
|トピック|/a6V7HOmIB40/device-sbc/user/topic_alibaba|
|ユーザ|device-sbc&a6V7HOmIB40|
|パスワード|F5D0CB6A0D89AA26C0EACEDEBF21A64C33E8687F|


# Arduinoの設定
Arduinoの操作自体は様々なサイトで紹介されているので、そちらをご参照ください。     
ここでは、Alibaba Cloudと接続する際の注意点とスケッチ例をご紹介します。     

インストール：[https://www.arduino.cc/en/main/software]　     
> https://www.arduino.cc/en/main/software

セットアップ：[https://dev.soracom.io/jp/start/lte_hw_wio-lte/]
> https://dev.soracom.io/jp/start/lte_hw_wio-lte/



# PubSubclient library注意点
<span style="color: #2196f3">PubSubclient.hに設定されているKeepAliveは15秒がデフォルトですが、     
Alibaba CloudではKeepAliveを30秒に設定する必要があります。</span>     
ご自身の端末にインストールしたライブラリを編集する必要があります。     

```cs
#ifndef MQTT_KEEPALIVE
#define MQTT_KEEPALIVE 30
#endif
```

# Arduinoでスケッチを行う

まずはデバイスのUPTIMEを送信するプログラムをスケッチしてみます。     
`ファイル->スケッチ例->Wio LTE for Arduino -> mqtt ->mqttclient`

```cs
#include <WioLTEforArduino.h>
#include <WioLTEClient.h>
#include <PubSubClient.h>     // https://github.com/SeeedJP/pubsubclient
#include <stdio.h>

#define APN               "soracom.io"
#define USERNAME          "sora"
#define PASSWORD          "sora"
#define MQTT_SERVER_HOST  "a6V7HOmIB40.iot-as-mqtt.ap-northeast-1.aliyuncs.com"
#define MQTT_SERVER_PORT  (1883)
#define ID                "Alibaba|securemode=3,signmethod=hmacsha1|"
#define OUT_TOPIC         "/a6V7HOmIB40/device-sbc/user/topic_alibaba"
#define IN_TOPIC          "IN_TOPIC"
#define MQUSER            "device-sbc&a6V7HOmIB40"
#define MQPASS            "F5D0CB6A0D89AA26C0EACEDEBF21A64C33E8687F"
#define INTERVAL          (60000)

WioLTE Wio;
WioLTEClient WioClient(&Wio);
PubSubClient MqttClient;

void callback(char* topic, byte* payload, unsigned int length) {
  SerialUSB.print("Subscribe:");
  for (int i = 0; i < length; i++) SerialUSB.print((char)payload[i]);
  SerialUSB.println("");
}

void setup() {
  delay(200);
  SerialUSB.println("");
  SerialUSB.println("--- START ---------------------------------------------------");
  
  SerialUSB.println("### I/O Initialize.");
  Wio.Init();
  
  SerialUSB.println("### Power supply ON.");
  Wio.PowerSupplyLTE(true);
  delay(500);
  SerialUSB.println("### Turn on or reset.");
  if (!Wio.TurnOnOrReset()) {
    SerialUSB.println("### ERROR! ###");
    return;
  }
  SerialUSB.println("### Connecting to \""APN"\".");
  if (!Wio.Activate(APN, USERNAME, PASSWORD)) {
    SerialUSB.println("### ERROR! ###");
    return;
  }
  SerialUSB.println("### Connecting to MQTT server \""MQTT_SERVER_HOST"\"");
  MqttClient.setServer(MQTT_SERVER_HOST, MQTT_SERVER_PORT);
  MqttClient.setCallback(callback);
  MqttClient.setClient(WioClient);
  if (!MqttClient.connect(ID,MQUSER,MQPASS)) {
    SerialUSB.println("### ERROR! ###");
    return;
  }
  MqttClient.subscribe(IN_TOPIC);
  SerialUSB.println("### Setup completed.");
}

void loop() {
  char data[100];
  sprintf(data, "{\"uptime\":%lu}", millis() / 1000);
  SerialUSB.print("Publish:");
  SerialUSB.print(data);
  SerialUSB.println("");
  MqttClient.publish(OUT_TOPIC, data);
  
err:
  unsigned long next = millis();
  while (millis() < next + INTERVAL)
  {
    MqttClient.loop();
  }
}
```
48行目の`MqttClient.connect(ID,MQUSER,MQPASS)`ですが、スケッチ例から作成するとMQUSERとMQPASSがないので、忘れずに追記しましょう。     
それではマイコンボード(Wio)への書き込みを実施しましょう      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309102930.jpg "img")     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309102939.jpg "img")     

書き込みが終了したらシリアルモニタを開いてみましょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309143233.png "img")      

上記の出力結果は「soracom.io」と「Alibaba Cloud」への接続が成功したことを表しています      
では、次にAlibaba Cloud Platformにちゃんとデータが送られてきているのか確認してみましょう  

# Alibaba CloudコンソールでPublishデータの確認
Alibaba CloudのIoT Platformのコンソールから、転送されたデータを確認しましょう。     
`監視と運用-> デバイスログ->デバイス動作分析`

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309103008.jpg "img")     

ステータス200で返ってきていることが確認できました。     

では、WioからPublishされたデータの中身も見てみましょう。     
`監視と運用->デバイスログ->アップストリーム分析->MessageID`

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309103227.png "img")      

しっかりUPTIMEが転送されていることが確認できました。     

# センシングデータの送信
前の項目までで、WioとIoT Platformの通信が正常に行えることが確認できました。     
この項目からは、超音波センサー(UltrasonicRanger)を用いて目標物までの距離を測定し、データをWioを介してIoT Platformへ送信します。     
そして、最終的にDataVで可視化したいと思います。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200310110415.png "img")      

> http://wiki.seeedstudio.com/jp/Grove-Ultrasonic-Ranger

ソースコードは以下です。使用するセンサー(UltrasonicRanger)のライブラリをインストールする必要があるのでご注意ください。     

```cs
#include <WioLTEforArduino.h>
#include <WioLTEClient.h>
#include <PubSubClient.h>     // https://github.com/SeeedJP/pubsubclient
#include <stdio.h>
#include <Ultrasonic.h>      // https://github.com/Seeed-Studio/Grove_Ultrasonic_Ranger
#define ULTRASONIC_PIN  (WIOLTE_D38)
#define INTERVAL        (60000)
#define APN               "soracom.io"
#define USERNAME          "sora"
#define PASSWORD          "sora"
#define MQTT_SERVER_HOST  "a6V7HOmIB40.iot-as-mqtt.ap-northeast-1.aliyuncs.com"
#define MQTT_SERVER_PORT  (1883)
#define ID                "Alibaba|securemode=3,signmethod=hmacsha1|"
#define OUT_TOPIC         "/a6V7HOmIB40/device-sbc/user/topic_alibaba"
#define IN_TOPIC          "IN_TOPIC"
#define MQUSER            "device-sbc&a6V7HOmIB40"
#define MQPASS            "F5D0CB6A0D89AA26C0EACEDEBF21A64C33E8687F"
Ultrasonic UltrasonicRanger(ULTRASONIC_PIN);
WioLTE Wio;
WioLTEClient WioClient(&Wio);
PubSubClient MqttClient;
void callback(char* topic, byte* payload, unsigned int length) {
  SerialUSB.print("Subscribe:");
  for (int i = 0; i < length; i++) SerialUSB.print((char)payload[i]);
  SerialUSB.println("");
}
void setup() {
  delay(200);
  SerialUSB.println("");
  SerialUSB.println("--- START ---------------------------------------------------");
  SerialUSB.println("### I/O Initialize.");
  Wio.Init();
  SerialUSB.println("### Power supply ON.");
  Wio.PowerSupplyLTE(true);
  delay(500);
  SerialUSB.println("### Turn on or reset.");
  if (!Wio.TurnOnOrReset()) {
    SerialUSB.println("### ERROR! ###");
    return;
  }
  SerialUSB.println("### Connecting to \""APN"\".");
  if (!Wio.Activate(APN, USERNAME, PASSWORD)) {
    SerialUSB.println("### ERROR! ###");
    return;
  }
  SerialUSB.println("### Connecting to MQTT server \""MQTT_SERVER_HOST"\"");
  MqttClient.setServer(MQTT_SERVER_HOST, MQTT_SERVER_PORT);
  MqttClient.setCallback(callback);
  MqttClient.setClient(WioClient);
  if (!MqttClient.connect(ID, MQUSER, MQPASS)) {
    SerialUSB.println("### ERROR! ###");
    return;
  }
  MqttClient.subscribe(IN_TOPIC);
  SerialUSB.println("### Setup completed.");
}
void loop() {
  char data[100];
  long distance;
  distance = UltrasonicRanger.MeasureInCentimeters();
  SerialUSB.print("Publish:");
  sprintf(data, "{ \"distance\":%lu}", distance);
  SerialUSB.print(data);
  SerialUSB.println("");
  MqttClient.publish(OUT_TOPIC,data);
  delay(INTERVAL);
}
```

先ほどと同様にスケッチ、および実行します。     
超音波センサーからWioデバイスとSoracomAirを通じてIoT Platformまで測定値が転送されていることが確認できると思います。

# ルールエンジンを用いてTableStoreに情報を格納する
IoT Platformには、受け取ったデータをAlibaba Cloudのデータソースへ渡すルールエンジンという機能があります。     
今回は、IoT Platformがセンサーから受け取ったデータをTableStoreというNoSQLデータベースに情報を格納していきます。     

TableStoreは以下の環境で作成済みのものとします。     
* インスタンス名：IoT-store     
* テーブル名：SonicRanger     
     
それでは、Alibaba CloudコンソールからIoT Platformのルールエンジンを触っていきます。     
IoT Platformの画面からルール作成画面に遷移します。     
`ルールエンジン->ルールの作成`     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309103410.png "img")      

「OK」を押下すると、ルールの編集画面に遷移します。ここでは3つの設定を行う必要があります。     

|設定値|説明|
|---|---|
|データの処理　　　　|TOPICで受け取ったデータを抽出するためのSQLを記述します。|
|データの宛先　　　　|後続に流すプロダクトの情報を設定します。|
|転送エラーの対処法　|エラー時の対応を記述します。|

# データの処理
プルダウンからSQLを生成できるので、簡単にクエリを生成することができます。     
フィールドは以下の3つを指定しました。

|設定値|説明|
|---|---|
|timestamp()　　|現在の時刻|
|deviceName()　|IoT Platformに設定したDeviceName|
|dist　　　　　　|Wioデバイスから受け取った超音波センサーの情報(任意の名前)|

     
フィールドの指定設定は[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/30555.htm?spm=a2c63.p38356.879954.7.50835acdJT0LNZ#concept-mdn-mss-vdb)をご参照ください。     
今回使用するSQLはこちらです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309141618.png "img")      

# データの宛先
IoT Platformで受けたデータを後続のプロダクトに渡す設定をしていきます。     

|対処方法の選択|
|---|
|別のトピックに転送する|
|TableStore|
|RDS|
|MessageService|
|FunctionCompute|

     
今回はtimestamp値をプライマリーキーに設定し、以下のように選択します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309144659.png "img")      

# 転送エラーの対処法
転送で失敗した際のエラーログ出力先を指定します。今回は別のトピックに流すことにします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309103435.png "img")      

# TableStoreのデータを確認
では、再度Wioデバイスを動かしてTableStoreにデータがちゃんと格納されるか確認してみます。     
TableStoreのコンソールを起動し、`インスタンス名->テーブル名->データエディタ`

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309141302.png "img")      


# DataVでTableStoreの情報を可視化する
最後に、DataVからTableStoreに接続します。DataVとはAlibaba Cloudの可視化サービスで、リアルタイムにデータを描画することができます。今回は、SonicRangerで1分おきに目標物との距離を測定したデータを可視化してみました。     
DataVのデータソースにはTableStoreを指定できるので、参照クエリを記述します。     
参照クエリの記述方法はドキュメントセンターをご参照ください。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613530397700/20200309142543.png "img")      

# 最後に
IoTセンサ－とAruduinoを使ったパブリッシュ通信をご紹介しました。    
この方法により、IoTデバイス、センサーのデータが簡単にクラウド上で取得でき、データ処理をして可視化ができます。    
IoT Platformは様々なAlibaba Cloudプロダクトを連携できるので、ご参考に頂ければ幸いです。      



