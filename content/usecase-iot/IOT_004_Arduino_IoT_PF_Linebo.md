---
title: "Arduino+Linebotスマートホーム"
metaTitle: "Arduino + Alibaba IoT Platform + Linebotで擬似スマートホームを実現する"
metaDescription: "Arduino + Alibaba IoT Platform + Linebotで擬似スマートホームを実現する"
date: "2020-03-05"
author: "sbc_hr"
thumbnail: "/IoT_Platform_images_26006613529396500/20200303173314.png"
---

## Arduino + Alibaba IoT Platform + Linebotで擬似スマートホームを実現する

本記事では、AlibabaクラウドのIoTプラットフォームを使って、擬似のスマートホームを実現する方法をご紹介します。   

実現したいシナリオは以下二つです。

> 1.LineBotからAlibabaIoTPlatform経由でArduinoのLEDを点滅させる    
> 2.Arduinoの人感センサーがものの動きを検知し、AlibabaIoTPlatform経由で、LineBotへ通知を送る

        
では、早速シナリオ1について作成してみたいと思います。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613529396500/20200303173314.png "img")
     
まず今回利用するデバイスはこちらです。OSOYOOの擬似スマートホームセットです。   

> https://osoyoo.com/2019/10/18/osoyoo-smart-home-iot-learning-kit-with-mega2560-introduction
     
メインデバイス：Arduino Uno     
WiFiモジュール：ESP8266


ArduinoとAlibabaIoTPlatformと通信のためのプログラムは以下になります。
```C
#include "WiFiEsp.h"
#include "SoftwareSerial.h"
#include "PubSubClient.h"

#define whiteLED 10
#define redLED 12

SoftwareSerial softserial(A9, A8);

char ssid[] = "";
char pass[] = "";

char username[] = "";
char password[] = "";

const char* mqtt_server = "";
const char* pubsub_topic = "";
const char* client_id = "";

int status = WL_IDLE_STATUS;

WiFiEspClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;

void setup() {
  
  pinMode(whiteLED, OUTPUT);
  pinMode(redLED, OUTPUT);
  
  // initialize serial for debugging
  Serial.begin(9600);
  softserial.begin(115200);
  softserial.write("AT+CIOBAUD=9600\r\n");
  softserial.write("AT+RST\r\n");
  softserial.begin(9600);
  
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void setup_wifi() {
  
  WiFi.init(&softserial);

  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue
    while (true);
  }

  // attempt to connect to WiFi network
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network
    status = WiFi.begin(ssid, pass);
  }

  Serial.println("You're connected to the network");
  printWifiStatus();
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  if ((char)payload[0] == '1') {
    digitalWrite(whiteLED, HIGH);
  } else if ((char)payload[0] == '0') {
    digitalWrite(whiteLED, LOW);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(client_id,username,password)) {
      Serial.println("connected");
      client.subscribe(pubsub_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {
  long now = millis();
  
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

}

void printWifiStatus()
{
  // print the SSID of the network you're attached to
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  
  // print your WiFi shield's IP address
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print where to go in the browser
  Serial.println();
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
  Serial.println();
}
```
     
コードの解説は検索すればいろんなところから出ているので、
ここではLineBotのからのメッセージを受け取る部分のみ解説したいと思います。
```C
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  if ((char)payload[0] == '1') {
    digitalWrite(whiteLED, HIGH);
  } else if ((char)payload[0] == '0') {
    digitalWrite(whiteLED, LOW);
  }
```
上記の部分はサブスクライブのTopicからのメッセージを受け取り、     
1の場合はLEDのを点灯し、0の場合はLEDを消灯します。
     
それではLineBotの部分はみていきましょう。
```python
import os
import base64

from flask import Flask
from flask import request
from flask import abort

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkiot.request.v20180120.PubRequest import PubRequest

from linebot import LineBotApi
from linebot import WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent
from linebot.models import TextMessage
from linebot.models import TextSendMessage

app = Flask(__name__)

# LineBot Access Token
CHANNEL_ACCESS_TOKEN = os.environ["CHANNEL_ACCESS_TOKEN"]
CHANNEL_SECRET = os.environ["CHANNEL_SECRET"]

# AliCloud Access Token
ALICLOUD_ACCESS_KEY = os.environ["ALICLOUD_ACCESS_KEY"]
ALICLOUD_ACCESS_SECRET = os.environ["ALICLOUD_ACCESS_SECRET"]
ALICLOUD_REGION = os.environ["ALICLOUD_REGION"]
ALICLOUD_IOT_PRODUCTKEY = os.environ["ALICLOUD_IOT_PRODUCTKEY"]
ALICLOUD_IOT_TOPIC = os.environ["ALICLOUD_IOT_TOPIC"]

line_bot_api = LineBotApi(CHANNEL_ACCESS_TOKEN)
handler = WebhookHandler(CHANNEL_SECRET)

# create AcsClient instance
client = AcsClient(ALICLOUD_ACCESS_KEY, ALICLOUD_ACCESS_SECRET, ALICLOUD_REGION)

# callback()
@app.route("/callback", methods=['POST'])
def callback():
  # Get X-Line-Signature header value
  signature = request.headers['X-Line-Signature']

  # Get request body as text
  body = request.get_data(as_text=True)
  app.logger.info("Request body: " + body)

  # Handle webhook body
  try:
    handler.handle(body, signature)
  except InvalidSignatureError:
    abort(400)

  return 'OK'

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
  
  message = event.message.text
  message_bytes = message.encode('utf-8')
  base64_bytes = base64.b64encode(message_bytes)
  base64_message = base64_bytes.decode('utf-8')

  request = PubRequest()
  request.set_accept_format('json')
  request.set_TopicFullName(ALICLOUD_IOT_TOPIC)
  request.set_MessageContent(base64_message)
  request.set_ProductKey(ALICLOUD_IOT_PRODUCTKEY)
  request.set_Qos("0")
  client.do_action_with_exception(request)
  #result = str(response)
  if message == "1":
    line_bot_api.reply_message(
      event.reply_token,
      TextSendMessage(text="電気をつけました")
    )
  elif message == "0":
    line_bot_api.reply_message(
      event.reply_token,
      TextSendMessage(text="電気を消しました")
    )
  else:
    line_bot_api.reply_message(
      event.reply_token,
      TextSendMessage(text=message)
    )

if __name__ == "__main__":
  callback()
  app.run()

```

LineBotの部分の説明は[こちらの記事](https://sbopsv.github.io/cloud-tech/usecase-AI/AI_004_LineBot_imagesearch_demo) をご参照ください。     

> https://sbopsv.github.io/cloud-tech/usecase-AI/AI_004_LineBot_imagesearch_demo


具体的な説明を省いて、AlibabaIoTPlatformと通信の際の注意点のみ紹介させていただきます。    
```python
message = event.message.text
  message_bytes = message.encode('utf-8')
  base64_bytes = base64.b64encode(message_bytes)
  base64_message = base64_bytes.decode('utf-8')
```

Topicにメッセージを送信する際、base64でエンコード必要があります。     
ここでbase64のエンコードを行います。
          
では、実際通信する際のイメージをみていきましょう。
     
まずLineBotからメッセージ「1」を送信すると、

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613529396500/20200303114435.png "img")

Arduinoにてメッセージを受けれることを確認できます。
デバイスのLEDも点灯されることが確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613529396500/20200303114129.png "img")
          
次LineBotからメッセージ「0」を送信してみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613529396500/20200303115036.png "img")

Arduinoにてメッセージを受けれることを確認できます。
デバイスのLEDも消灯されることが確認できます。

これで、LineBotからどこからでもArduinoのLEDをコントロールすることができました。
     
次は、シナリオ②の部分を作成します。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613529396500/20200303173449.png "img")
          
まず、Arduinoに以下のコードを追加します。

```C
#define motion_sensor 11
#define buzzer 

void loop() {
  long now = millis();
  
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  motionStatus=digitalRead(motion_sensor);
  if (motionStatus==0) {
    if (now - lastMsg > 3000) {
      lastMsg = now;
      //digitalWrite(buzzer,LOW);
      digitalWrite(redLED,LOW);
      client.publish(pubsub_topic, "{Intruder:\"None\"}");
    }
  } else
  {
    if (now - lastMsg > 3000) {
      lastMsg = now;
      //digitalWrite(buzzer,HIGH);
      digitalWrite(redLED,HIGH);
      client.publish(pubsub_topic, "{Intruder:\"Detected\"}");
    }
  }
}
```
クラウド側の画面をみてみましょう。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613529396500/20200303171724.png "img")


## 最後に
これで、人感センサーが人の動きを検知したら、AlibabaIoTPlatformにメッセージを送信することができました。


