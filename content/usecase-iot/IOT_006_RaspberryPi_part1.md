---
title: "Raspberry pi連携開発方法_Part1"
metaTitle: "IoT StudioでRaspberry piに基づいてワンストップ開発を試して見た(前編)"
metaDescription: "IoT StudioでRaspberry piに基づいてワンストップ開発を試して見た(前編)"
date: "2020-03-31"
author: "sbc_fengqi"
thumbnail: "/IoT_Platform_images_26006613543155600/20200331023643.png"
---

## IoT StudioでRaspberry piに基づいてワンストップ開発を試して見た(前編)

本記事では、Alibaba Cloud IoT StudioでRaspberry piに基づいてデバイスデータの収集から可視化までをカバーするシステム構築方法をご紹介します。    

ダッシュボード上で実現したい機能は以下となります。  
* リアルタイム温度、湿度の表示  
* 折れ線グラフで温度、湿度トレンド表示  
* スイッチ(IoT Studioのコンポーネント)でRGB LEDモジュールのON/OFF状態をコントロール  
* パイロットランプ(IoT Studioのコンポーネント)でRGB LEDモジュールのON/OFF状態を表示  
* jsonテキストボックスで属性の編集を可能にし、RGB LEDモジュールの色をカスタマイズ可能

## 実行中の様子

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331225942.png "img")


## 開発プロセス

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331023643.png "img")


## 使用したもの  

> Hardware

*  Raspberry pi  3 Model B+    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331164657.png "img")

*  KY-016 RGB LED module       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331053340.png "img")

*  DHT11(温湿度センサー)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331164844.png "img")
  
> Alibaba Cloud IoT Platform    
IoT デバイスと IoT プラットフォーム間の、安全で信頼性の高い通信とデバイス管理を可能にするサービスです。

> IoT Studio(中国サイト)  
Alibaba Cloudが提供するIoT開発環境です。Web開発、サービス開発、モバイル開発機能が提供されます。Alibaba Cloud IoT Platformと連動できます。


## Raspberry Pi をMacでセットアップする
セットアップ手順について、今回は割愛します。

起動して初期セットアップが完了すると下記のような画面になります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331170321.png "img")

Macのコンソールから ssh でつないでみたら下記のような画面になります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331172641.png "img")


事前作業は以上です。早速ですが、プロジェクト開発に入りたいと思います。

今回は機能面からの観点において二つのプロジェクトを作成し、開発したいと思います。

1. RGB LEDモジュール プロジェクト
2. 温湿度センサー プロジェクト

## RGB LEDモジュール 開発プロジェクト
先ずはRGB LEDモジュールプロジェクトの開発を紹介します。

*  IoT Platform側  
*  Raspberry Pi側

## IoT Platform側

## 開発プロジェクトの作成
IoT Platformのコンソールにてプロジェクトを新規作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331170608.png "img")

## プロダクトの作成
プロジェクトを作った後に、プロダクトを作成します。  
(プロダクトとは、一般的に同じ機能を持つデバイスの集合です。 対応するプロダクトを管理することで、デバイスを一括管理できます。)

LEDモジュールなのでカテゴリーはランプに指定します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331170800.png "img")

## デバイスの作成
デバイスを作成します。デバイス証明書情報を保存します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331170941.png "img")

証明書情報には、ProductKey、DeviceName、DeviceSecret が含まれています。 この情報は、デバイスが IoT Platform に接続する際のデバイス認証に使用される証明書となります。

## ファンクションの定義
このプロジェクトで開発したのはRGB LEDですので、RGB値によってライトの色を指定するためのファンクションを定義します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331171053.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331171343.png "img")

## プリワックス

## node.jsのインストール
今回はnode.jsを使ってRaspberry PiをIoT Platformへ接続します。  

コマンドラインで下記のコマンドを実行：  

```
wget -O - https://raw.githubusercontent.com/audstanley/NodeJs-Raspberry-Pi/master/Install-Node.sh | sudo bash
node -v
exit
```



## RGB LEDモジュール〜ラズパイ間の配線

| RGB LEDモジュール ピン | ラズパイ ピン |
|:-----------:|:------------:|
| R           |   pin#08（GPIO 14）|
| G           |   pin#10（GPIO 15）|
| B           |   pin#12（GPIO 18）|
| GND         |   pin#06（Ground） |


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331200247.png "img")



## ソースコードを書く

## SDKインストール

*  プロジェクトフォルダ作成  

```
mkdir rgblight  
cd rgblight
```

*  作成したフォルダにaliyun-iot-device-sdkとpigpio npmをインストール：
```
npm install --save aliyun-iot-device-sdk pigpio
```


## ラズパイ側のソースコード
クラウドへの接続とRGB LEDの制御をソースコードで実装します。
index.jsファイルを作成します。内容は以下となります：

```
const aliyunIot = require('aliyun-iot-device-sdk');
const Gpio = require('pigpio').Gpio;

const device = aliyunIot.device({
  productKey: '<productKey>',
  deviceName: '<deviceName>',
  deviceSecret: '<deviceSecret>',
});

const RgbLight = {
  LightSwitch: 0,
  RGBColor: {
    Red: 255,
    Green: 255,
    Blue: 255,
  },
  ledR: new Gpio(14, {
    mode: Gpio.OUTPUT,
    pullUpDown: Gpio.PUD_DOWN,
  }),
  ledG: new Gpio(15, {
    mode: Gpio.OUTPUT,
    pullUpDown: Gpio.PUD_DOWN,
  }),
  ledB: new Gpio(18, {
    mode: Gpio.OUTPUT,
    pullUpDown: Gpio.PUD_DOWN,
  }),
  turnOff: () => {
    RgbLight.ledR.digitalWrite(0);
    RgbLight.ledG.digitalWrite(0);
    RgbLight.ledB.digitalWrite(0);
    RgbLight.LightSwitch = 0;
  },
  update: () => {
    RgbLight.ledR.pwmWrite(RgbLight.RGBColor.Red);
    RgbLight.ledG.pwmWrite(RgbLight.RGBColor.Green);
    RgbLight.ledB.pwmWrite(RgbLight.RGBColor.Blue);
    RgbLight.LightSwitch = 1;
  },
  toggle: () => {
    if (RgbLight.LightSwitch === 1) {
      return RgbLight.turnOff();
    }
    RgbLight.update();
  },
}; 

device.on('connect', () => {
  console.log('connect successfully');
  device.serve('property/set', params => {
    console.log('receieve params:', params);
    if (params.LightSwitch === 0) {
      RgbLight.turnOff();
    } else {
      RgbLight.RGBColor = params.RGBColor || RgbLight.RGBColor;
      RgbLight.LightSwitch = params.LightSwitch || RgbLight.LightSwitch;
      RgbLight.update();
    }
    const props = {
      LightSwitch: RgbLight.LightSwitch,
      RGBColor: RgbLight.RGBColor,
    };
    console.log('post props:', props);
    device.postProps(props, err => {
      if (err) {
        return console.log('post error:', err);
      }
      console.log('post successfully!');
    });
  });
});
```


## ランニング  デバッグ
プロジェクトフォルダー下に：  

`node index.js`を実行すると  
“connect successfully”と表示されたらクラウドへの接続が成功です。


デバッグファンクション リストにRGBColorを選択し、Methodリストに設定を選択します。  

下にあるJSON エディタの内容を以下の内容を書き込みます：  

```
{
    "RGBColor":
        {
            "Red":255,
            "Blue":255,
            "Green":0
        }
}
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331161605.png "img")

センドコマンド ボタンをクリックして、ラズパイ上の RGB LEDモジュールの色を紫色に変わっていけば、DownLinkのメッセージのデータを取得できていることが分かります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543155600/20200331160533.png "img")



## まとめ

 ここまでは、Raspberry piに基づいてRGB LEDモジュールのデバイス側の開発が終了になります。 

ラズパイ〜クラウドの間でUplink/Downlinkの通信ができていることで、
IoT PlatformにRGB LEDモジュールのON/OFF状態をコントロール、表示ができます。

次回後編では、温湿度センサーを使ってIoT Platformへの接続とIoT StudioでWeb可視化アプリのワンストップ開発を紹介します。ぜひ楽しみながらお読みください。
