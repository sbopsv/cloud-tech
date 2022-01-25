---
title: "Raspberry pi連携開発方法_Part2"
metaTitle: "IoT StudioでRaspberry piに基づいてワンストップ開発を試して見た(後編)"
metaDescription: "IoT StudioでRaspberry piに基づいてワンストップ開発を試して見た(後編)"
date: "2020-03-31"
author: "sbc_fengqi"
thumbnail: "/IoT_Platform_images_26006613543250900/20200331220355.png"
---

## IoT StudioでRaspberry piに基づいてワンストップ開発を試して見た(後編)

本記事では、温湿度センサーをRaspberry piに基づいてプロジェクトでの開発手法や、IoT StudioのWeb可視化アプリ開発ツールを使ってデバイスからのデータを収集し、そのデータをダッシュボードにリアルタイム表示する方法をご紹介します。デバイス〜クラウドの間で双方向通信が行えますので、デバイスのコントロールも実現できます。    


## IoT Platform側

開発プロジェクトの作成、プロダクトの作成、デバイスの作成等IoT Platform側で作ったものは前編にて細かく紹介したので、今回は割愛します。

## 回路を組む

今回利用したのはDHT11の温湿度センサー単体のものです。    
ネット上で公開されているマニュアルを参考に回路図を組んでみました。    
センサーのピン構成について、4つのピンがあります。    

| ピン | ファンクション |
|:-----------:|:------------:|
| pin#01        |         5V |
| pin#02       |     GPIO |
| pin#03       |        NC |
| pin#04       |     GND |


今回、pin#3は使用しません。     
回路の組み方は複数あるかと思いますが、個人的には下記のように組んでみました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543250900/20200331202753.png "img")

簡単にまとめると、pin#01、pin#04にラズパイの5V、GNDを接続します。pin#02に任意のGPIOを割り当ててデータを取得します。    

## モジュールのインストール

今回使用するのはnode-dht-sensorです。    
詳細：[node-dht-sensor](https://www.npmjs.com/package/node-dht-sensor)     

> https://www.npmjs.com/package/node-dht-sensor

ダウンロードし、インストールします。    

## ソースコードを書く
pin#02には今回ラズパイのGPIO 14を接続します。    
先ずはクラウドとの接続を考えずに機能検証ぐらいのプログラムを記載します。      

ソースコードは以下の通りです。      

```
const sensor = require('node-dht-sensor');

const DHT11 = 11;
const data_pin = 14;

sensor.read(DHT11, data_pin, (err, temp, humid) => {
  if (err) return console.log('DHT11からデータを取得することができない(pin# :%d)', data_pin);
  console.log(new Date().toString());
  console.log('temperature: %d℃', temp);
  console.log('humidity: %d％', humid);
});

```

実行します。     

```
$ node index.js
Tue Mar 31 2020 12:10:17 GMT+0900 (Japan Standard Time)
temperature: 21℃
humidity: 60％
```

部屋の温度、湿気などの情報が表示されました。     
続いては、クラウドへの接続をします。    

温湿度変化のトレンドを見たいので、今回はRANDOM関数を使って温湿度のデータを擬似します。      

node.jsファイルは以下となります：     
```
const aliyunIot = require('aliyun-iot-device-sdk');
const device = aliyunIot.device({
  productKey: "xxxxxxxxx", 
  deviceName: "xxxxxxxxx",
  deviceSecret: "xxxxxxxxxxxx"
});


device.on('connect', () => {
  console.log('connect succesfully!');
  const interval = setInterval(() => {

    const t = Math.floor((Math.random() -0.5)*5+20);
    const h = Math.floor((Math.random() -0.5)*10+70);
    console.log(`Post current temperature: ${t}`);
    console.log(`Post current humidity: ${h}`);
    device.postProps({
    CurrentTemperature: t,
    CurrentHumidity: h
    });
  }, 5000);
  });
  device.on('error', (err) => {
  console.log(err);
});
```
コンソールでnode index.jsを実行し、コンソールにてアップリンクのメッセージがプリントされます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543250900/20200331214020.png "img")


続いて、これらのデータを可視化するためにWebアプリケーション開発に入ります。    

## 可視化Webアプリケーション開発
## プロジェクト作成

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543250900/20200331215221.png "img")

## 基本手順
*  コンポーネントの選択  

![compo](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543250900/20200331220851.png "compo")

今回はダッシュボードと折れ線グラフをそれぞれ二つ追加します。

*  UIの設計

ブランクナビゲーションUIを使ってコンポーネントを見やすくように配置します。 

*  デバイスとの連携

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543250900/20200331221952.png "img")

今回は連携について、イベントトリガーによってデバイスの属性の値を設定することでデバイスをコントロルすることが可能です。(DownLink Messege)

デバイス側で開発したプログラムにIoT Platform と接続して、データをアップデートします。そのデータをWeb可視化開発ツールでリアルタイムで表示されます。(UpLink Messege)

*  表示させたいデータを選択し、UIに表示することができます。
  
一定時間において、最終的な効果は以下となります：

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613543250900/20200331220355.png "img")


## まとめ
以上で、Alibaba IoT Platformによりデバイスデータの収集から可視化までをワンストップで実現することができます。参考に頂ければ幸いです。


