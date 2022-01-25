---
title: "日中間動画配信サーバーの構築"
metaTitle: "日中間動画配信サーバーの構築"
metaDescription: "日中間動画配信サーバーの構築"
date: "2018-11-30"
author: "SBC engineer blog"
thumbnail: "/Media_images_98012380860378000/20181202132152.png"
---

## 日中間動画配信サーバーの構築

本記事では、国際間動画配信の構成についてをご紹介します。    


## 国際間動画配信の構成

中国から日本へ動画配信する際の構成を考えて見ましょう。下の図は中国上海に動画配信元のサーバーを構築し、ストリーミングサーバーを日本に構築、その間をインターネットで繫いでいるという形です。        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/20181202132040.png "img")

Express Connectを用いる場合はこの構成がどう変わるのでしょうか？    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/20181202132152.png "img")

実はほとんど変わりません。リージョン間をインターネットで直接通信させるか、Express Connectを通すかの違いだけになります。    

触れていませんでしたが、動画配信ソフトにはOBSというオープンソースのソフトを用いています。流行りのYouTuberさんも使っていらっしゃるとか…？このソフトに弊社のプロモーション動画を配信させるとい内訳になっています。サーバーのスペックも図に記載の通りです。    


## Express Connectの設定

### VPCの作成

Express ConnectはAlibaba CloudのVPCとVPCを結ぶものであるため、構成図のように配信元（上海）と中継地点（日本）にそれぞれVPCを立てる必要があります。VPCはAlibaba Cloudへログインし、コンソールから「VPC 」> 「VPCを作成」の流れで進んでいきます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/20181202132243.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/20181202132308.png "img")

### Express Connectの設定

今回は構成図のように上海と日本リージョンに作成しています。2つ作れたらいよいよExpress Connectの設定ですが、こちらもまずはコンソールから「 Express Connect」>「ルーターインタフェイスの作成」を選択して進んでいきます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/20181202132412.png "img")

次にどのリージョンからどのリージョンのVPCに繋ぐかを設定、購入します。最後にルートテーブルで日本なら上海、上海なら日本のCIDRを設定して終了です。金額が金額ですので、購入の周辺でお困りの方はSoftBankへご相談ください。特に法人の方は担当のソフトバンク営業を通しても相談いただけます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/20181202132538.png "img")


## OBSを入れてみる

次に配信元（上海）にサーバーを立て、OBSを導入していきます。    

### ECSの購入

購入リージョンが上海あることに注意してください。また購入したいサーバーのスペックが作成したVSwitchにあるかどうかにも気をつけておいてください。（たまにラインナップにばらつきがあります）rtmpやsshを使いますのでセキュリティグループを確認し、適切なポートが開いているかも確認をお願いします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/20181202132720.png "img")


### リモートログインしてOBSをダウンロード

ECSの購入が完了したらリモートログインしてOBSをダウンロードしてきましょう。OBSの[ダウンロードサイトはこちら](https://obsproject.com/ja/download)になります。    

> https://obsproject.com/ja/download

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/20181202132809.png "img")

無事にOBSを開けるようになると上のような操作画面が出てくると思います。動画をはじめ配信したいファイルはソースの「+」マークを選択して指定します。        


最後に日本側で立てたECSにsshでログインし、nginx-rtmp-moduleを入れていきます。    

```
sudo su
yum update
yum groupinstall "Development Tools"
yum -y install pcre-devel zlib-devel openssl-devel

cd /usr/local/src/
wget http://nginx.org/download/nginx-1.8.0.tar.gz
sudo wget http://nginx.org/download/nginx-1.8.0.tar.gz
tar -zxvf nginx-1.8.0.tar.gz
wget https://github.com/arut/nginx-rtmp-module/archive/master.zip
unzip master.zip

# build
cd nginx-1.8.0
./configure --with-http_ssl_module --add-module=../nginx-rtmp-module-master
make
make install
```

無事に作成できたら、nginxのconfファイルを編集していきます。場所は以下です。    

```
# cd /usr/local/nginx/conf
# ls
fastcgi.conf            koi-win             scgi_params
fastcgi.conf.default    mime.types          scgi_params.default
fastcgi_params          mime.types.default  uwsgi_params
fastcgi_params.default  nginx.conf          uwsgi_params.default
koi-utf                 nginx.conf.default  win-utf
```

```
rtmp {
   server {
      listen 1935;
      chunk_size 4096;

        application src {
            live on;
            push rtmp://localhost/hls;
        }

   }
}
```

上記の記述をconfファイルの最後尾に追加すれば準備完了です。nginxを起動しておきましょう。OBSに戻り画面右手にある「配信開始」を選択してください。    


## 動画視聴

視聴は手軽にVLCから行いました。ダウンロードしてネットワークに    

```
rtmp://日本のECSのIP/src/ストリームキー
```
と書くだけです。（日本語の部分はOBSで設定したものに書き換えてください）    

そして実際に視聴結果を比較したのが下の動画になります。    

> https://youtu.be/fysXY7GN0aw


---

### 配信サーバの準備
[Real Time Messaging Protocol (RTMP) ](http://ja.wikipedia.org/wiki/Real_Time_Messaging_Protocol)を扱うために、オープンソースで公開されている[nginx-rtmp-module](https://github.com/arut/nginx-rtmp-module)を使います。    
今回は映像を受信して、配信するサーバは同じサーバとして、EC2(Amazon Linux)上に用意して試します。    

```
sudo su
yum update
yum groupinstall "Development Tools"
yum -y install pcre-devel zlib-devel openssl-devel

cd /usr/local/src/
wget http://nginx.org/download/nginx-1.8.0.tar.gz
sudo wget http://nginx.org/download/nginx-1.8.0.tar.gz
tar -zxvf nginx-1.8.0.tar.gz
wget https://github.com/arut/nginx-rtmp-module/archive/master.zip
unzip master.zip

# build
cd nginx-1.8.0
./configure --with-http_ssl_module --add-module=../nginx-rtmp-module-master
make
make install
```

##### nginxの設定ファイルにrtmpの設定を追加

`/usr/local/nginx/conf/nginx.conf`の一番最後に以下を追加    

```
rtmp {
   server {
      listen 1935;
      chunk_size 4096;

      application live {
         live on;
         record off;
      }
   }
}
```

`application`で指定する名称がURLの一部になります。    
上記の設定だとURLは、`rtmp://<ip address>/live`　    

設定ができたら、nginxを起動します。    

```
/usr/local/nginx/sbin/nginx
```

この状態でブラウザから`http://<ip address>/`にアクセスして、Nginxの起動してますページが表示されればOKです。    

#### 配信サーバへ映像を送るクライアントを準備

本格的に配信をする人なら[LiveShell Pro](http://static-shell.cerevo.com/pro/ja/product.html)とか使って配信するかもしれませんが、今回はお試しなのでPC上でキャプチャ出来て、配信サーバにアップロードできるオープンソースのソフトを使います。    

[Open Broadcaster Software](https://obsproject.com/)

Mac版をダウンロードして起動します。    
起動するとこんな感じの画面が表示されると思います（デフォルトではデスクトップをキャプチャする）    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/1d131eba-61a9-99b7-30d4-55e49633cb4c.png "img")

##### 配信サーバの指定
右下のボタンの`設定`をクリックして設定画面を開きます。    
次に設定画面の左側の`配信`を選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/993f6f57-c8e8-87e9-f2f7-d75cc0e758cd.png "img")

`配信種別`でカスタムストリーミングサーバを選択して、URLに準備したサーバのURLを指定します。    
`ストリームキー`には何らかの文字列を指定します（適当文字列でもOK）    
ここで指定したストリームキーは後で映像を試聴する際のURLで使われます。    

##### 映像キャプチャの設定

OBSの最初の画面で`ソース`となっているコントロールで「＋」をクリックすると、追加するソースが表示されるので、`映像キャプチャデバイス`を選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/c4af09e8-a68a-47e1-6f72-100942fdc184.png "img")

開かれたダイアログで、新規作成のままOKをクリックすると、Mac Book Proの場合は`FaceTime HD Camera`が選べるので、それを選択すると、カメラからの映像が表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/6b9027ea-a58f-a285-9e92-086d8e65cf43.png "img")

OKをクリックして設定を終了します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/8ba51259-6c06-9e10-077f-de4d1ecf474e.png "img")


この状態だとソースが画面のキャプチャと映像デバイスの２箇所となっているので、ソースで不要な方を選んで「ー」をクリックして削除します。    

##### 音声キャプチャの設定

同様に`ソース`から`音声入力キャプチャ`を追加し、`Built-In Microphone`を追加します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-media/Media_images_98012380860378000/0de3472b-1591-00be-b9aa-57067e7673bf.png "img")


### プレイヤーの準備

配信の準備はできたので、最後にプレイヤーを準備します。    
[video.js v4.2.0からrtmpに対応（beta）](http://blog.videojs.com/post/60471080014/video-js-4-2-0-released-rtmp-css-designer-and) したので、こちらを使います。    

jsファイルはCDNにホストされたものを使うので、プレイヤーと言っても以下の様なHTMLファイルを準備するだけです。    

```
<!DOCTYPE html>
<html lang="en" class="">
<head>
  <link href="http://vjs.zencdn.net/4.2.0/video-js.css" rel="stylesheet">
  <script src="http://vjs.zencdn.net/4.2.0/video.js"></script>
</head>
<body>
  <video id="rtmp live test" class="video-js vjs-default-skin" controls
   preload="auto" width="640" height="264" data-setup='{}'>
    <source src="rtmp://<ip address>/live/test" type='rtmp/mp4'>
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a web browser
      that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
    </p>
  </video>
</body>
</html>
```

srcに指定したURLの`test`は、先ほどOBSの`ストリームキー`に設定した文字列を指定します。    
このファイルをS3などどこかのサーバに置いて、ブラウザで開きます。    

### 配信

OBSで`配信開始`ボタンをクリックすると、配信が始まります。    
プレイヤー側のブラウザで`再生`のアイコンをクリックして少し待つと、Live配信されている動画が表示されます。    


## 最後に
日中間で手頃かつ安定的に動画配信をしたい場合は、Express ConnectもしくはCENについて参考に頂ければ幸いです。     



