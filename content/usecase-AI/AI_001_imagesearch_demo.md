---
title: "ImageSearchデモツールを構築"
metaTitle: "ImageSearchデモツールを作って見た"
metaDescription: "ImageSearchデモツールを作って見た"
date: "2019-11-13"
author: "SBC engineer blog"
thumbnail: "/AI_images_26006613460940500/20191105164727.png"
---

## ImageSearchデモツールを作って見た

本記事では、ImageSearchデモツールを作成する方法をご紹介します。
なお、ImageSearchは1ヶ月間は無償（1QPS/画像10万枚の制限あり）なので、お試し操作するにもちょうど良いと思います。    

## 構成図
ImageSearchにスコープを当てたシンプルな構成にしました。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191105164727.png "参照")

## ImageSearchインスタンス構築
ImageSearchインスタンスを構築します。    

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/66657.htm

1.トップ画面でImageSearchを選択。

2.次の画面で商品画像検索インスタンスを選択。

3.以下の画面が表示される。インスタンス名を入力して今すぐ購入をクリック。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191111143111.png "参照")


## OSSのバケット構築
1.トップページより、Object Storage Service（OSS）を選択。

2.バケットを以下のように作成。ImageSearchを作成したリージョンに合わせる。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191111144708.png "参照")

3.バケット内にファイル（フォルダ）を作成。ここではdemoという名で作成。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191111145200.png "参照")


4.demoファイル内にImageSearchに後々インポートする為の画像をアップロード。

　※ImageSearchがインポートできる画像サイズ等の仕様がありますので注意。 [仕様はこちら](https://www.alibabacloud.com/cloud-tech/doc-detail/125155.htm)です。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/125155.htm　　

```
　　リンク内の注意事項抜粋　〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜
　　　・アップロードする各画像のサイズが 2 MB 以下であること。　　

　　　　・各画像の高さと幅は、どちらも 200 ピクセルから 1024 ピクセルの範囲であること。

　　〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜
```

また、画像のアップロード数が多い場合はOSS-Browser利用をお勧めします。



## RAM Roleの作成

OSSへアクセスする為の権限付与のためにResource Access ManagementからRAM Roleを作成します。     

1.トップページのResource Access Managementを選択。    

2.ロール管理を選択し、新規ロール作成をクリック。   

3.ロール作成画面より、サービスロール→ImageSearchサービスを選択してロール名を入力して作成。    

4.ロール管理を選択した画面より、権限付与ポリシー管理を選択し、権限付与ポリシー作成を選択。   

5.空白ポリシーを選択し、以下の画面を参考にポリシー名と内容を記載   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191111154738.png "参照")


ポリシー内容をコピーしながら転記します
```
{
    "Version": "1",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
            "oss:GetObject"
            ],
            "Resource": [
            "acs:oss:*:*:image-demo-oss/*"
            ]
        }
    ]
} 　
```

6. 2で作成したロールに5で作成したポリシーを付与させます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191113141306.png "参照")



## OSSへメタファイルをアップロード

1.OSSのバケット構築の４の項目で画像をアップロードした箇所（/demo）にメタファイルをアップロード。    

* ファイル名：increment.meta　　　※必ずこのファイル名にしてください。    
* ファイル内の記載例　　※詳細はこちらを参照    

```
{  
    "operator":"ADD",
    "item_id":"1000", 
    "cat_id":88888888, 
    "cust_content":"k1:v1,k2:v2,k3:v3", 
    "pic_list":
        ["771001_C01.jpg"]
}
```

補足：cat_idはカテゴリ登録となります。参照URLいくつかカテゴリーが用意されていますが、カテゴリーに当てはならない場合は、その他（88888888）を選択ください。記載例の771001_C01.jpgはOSSにアップロードした各画像名になります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191113141746.png "参照")

## ImageSearchへ画像をインポート
1. ImageSearchインスタンスの構築で作成したインスタンスをクリック。     
2.以下の画像の右上のインポートをクリック。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191111191727.png "参照")

3.以下のように入力。 
補足：ARNの箇所はロール作成で作成したロールのロール詳細に記載あり。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191113101416.png "参照")


4. インポート実施
インポートが失敗した場合は、インポート状態のインポート履歴の表示をチェックして原因を確認する。     
上記で注意記載したメタファイル名、画像の仕様外である可能性が高いです。    



## ECSにアプリを構築
次のソースコードをECSへアップします。     

1.必要ツールを準備    
    Python（v3.7.3）・・・プログラミング     
    FLASK(v1.0.2)・・・WEBフレームワーク     
    SDK・・・ImageSearch用のSDK      
    aliyun-python-sdk-core 2.13.0    
    aliyun-python-sdk-core-v3 2.13.0    
    aliyun-python-sdk-imagesearch 1.0.1        　

注意:SDKの解説は公式ドキュメントに記載がありますが、そこに記載されているコマンドを入力するとmirrorサイトからDLされます。現在mirrorサイトには旧バージョンが保管されている為、githubなどから最新バージョンをインストールする必要があります。


 2.OSSの画像を通常使うURLへ変更します。
作成したアプリは被写体に近い画像をBEST3で出力させています。     
ImageSearchの画像へアクセスすることはできません。     
出力画像はOSSの画像となります。     
その為、OSSの画像URLを公開読み取りに変更する必要があります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191113151546.png "参照")


各画像のプロパティを確認すると以下のようにURLが非公開時とは異なっていることが確認できます。このURLを使って作成したアプリは画像を表示させています。    

### Directory structure　ディレクトリ構成　============

app.py  <--- AccessDataSetting内のアクセスID,アクセスPASSはご用意ください  
static  
 　L bootstrap.css  
   　  bootstrap.min.css  
   　  sbc.jpg  <--- sbcログの為、別途オリジナルの画像を用意ください  
templates  
 　L bootstrap.html  

### Necessary tools　今回使用したtool　===============  
　Python（v3.7.3）  
　FLASK(v1.0.2)  
　SDK   
    aliyun-python-sdk-core 2.13.0  
    aliyun-python-sdk-core-v3 2.13.0  
    aliyun-python-sdk-imagesearch 1.0.1　

### How to use  サーバ上でのアプリ起動　==================
you start-up app.py when you use this application.

2ways
 Auto start(daemon)
      or
 pyhon app.py(command)



### ソースコード

> app.py 

```
# ローカルHTMLサーバのポート解放。自動起動


################# モジュール準備 ##################
import os
import pprint
import json
import sqlite3
import flask
import random, string
from PIL import Image
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, session
#for basic
from time import sleep
from flask_httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()
from werkzeug import secure_filename
app = Flask(__name__)

from aliyunsdkcore.client import AcsClient
import base64
import aliyunsdkimagesearch.request.v20190325.AddImageRequest as AddImageRequest
import aliyunsdkimagesearch.request.v20190325.DeleteImageRequest as DeleteImageRequest
import aliyunsdkimagesearch.request.v20190325.SearchImageRequest as SearchImageRequest

####### bootstrapのモジュール追加 #######
from flask_bootstrap import Bootstrap

####### bootstrapを起動 ########
bootstrap = Bootstrap(app)

########### Basic ##########
users = {
    "a": "a"
}

@auth.get_password
def get_pw(username):
    if username in users:
        return users.get(username)
    return None

########## Access　Data　Setting　###########
client = AcsClient(
   "AccessKey ID",
   "AccessKey PASS",
   "ap-northeast-1"
#from System reply:endpoint  imagesearch.ap-northeast-1.aliyuncs.com

)
###########################################



UPLOAD_FOLDER = '/root/bootstrap/static'

ALLOWED_EXTENSIONS = set(['txt', 'pdf', .png "参照")', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = os.urandom(24)


############  HTMLトップ画面表示 ##########
@app.route('/')
# for basic
@auth.login_required
def index():
      return render_template('bootstrap.html')

##########################################

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


##########################################

def GetRandomStr(num):
    # 英数字をすべて取得
    dat = string.digits + string.ascii_lowercase + string.ascii_uppercase

    # 英数字からランダムに取得
    return ''.join([random.choice(dat) for i in range(num)])


################ Main ###################

@app.route('/',  methods=['GET', 'POST'])
def search():
            img_file = request.files['img_file']
            filename = secure_filename(img_file.filename)
            hisyatai = GetRandomStr(10) +".jpg" 
            img_file.save(os.path.join(app.config['UPLOAD_FOLDER'], hisyatai))
           
            select = flask.request.form.get('categoly')
            print(filename)            
            print(select)
            img_url = UPLOAD_FOLDER + '/' + hisyatai


            #画像のサイズ調整　IphoneからだとTimeoutしてしまう。写真の画素数が大きいので容量が大きく転送に時間がかかってしまうためリサイズする
            img = Image.open(img_url)
            width,height=640,480
            img = img.resize((width,height))
            img.save(os.path.join(app.config['UPLOAD_FOLDER'],'img_resize.jpg'))

            img_urlX = UPLOAD_FOLDER + '/' + 'img_resize.jpg'
      

            requester = SearchImageRequest.SearchImageRequest()
            #requests = SearchImageRequest.SearchItemRequest()
            requester.set_endpoint("imagesearch.cn-hongkong.aliyuncs.com")

            requester.set_InstanceName("imagesearch00hk")

            ## Search setting 
            requester.set_CategoryId(select)
            #requester.set_CategoryId("88888888")
            requester.set_Num("3")

            img_url0='static' + '/' + 'img_resize.jpg'
            print('static' + '/' + hisyatai)


            with open(img_urlX, 'rb') as imgfile:
             #ファイル読み込み
             img = imgfile.read()
            #エンコード
             encoded_pic_content = base64.b64encode(img)
             requester.set_PicContent(encoded_pic_content)
            #インスタンスへのアクション＝ImageSearchインスタンスへ
            #辞書型で返ってくる。
            response = client.do_action_with_exception(requester)
                       
            pprint.pprint(response)
            #sleep(2)            
            str_data = json.loads(response)
            #上記を入れないと型エラーが発生　TypeError: byte indices must be integers or slices, not str
            #print(str_data["Auctions"][0]["PicName"])
            #辞書型配列のため、上記のように選択する必要があった
            
            print(filename)

            return render_template('bootstrap.html', img_url0='static' + '/' + hisyatai ,img_url1="https://image-demo-oss-hk.oss-cn-hongkong.aliyuncs.com/demo/" + str_data["Auctions"][0]["PicName"], img_url2="https://image-demo-oss-hk.oss-cn-hongkong.aliyuncs.com/demo/" + str_data["Auctions"][1]["PicName"], img_url3="https://image-demo-oss-hk.oss-cn-hongkong.aliyuncs.com/demo/" + str_data["Auctions"][2]["PicName"],result=response)

                    

#########　Setting ##########
if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8008)
     #FLASKのサーバ公開フォーマット　ローカルホストの適当なポートでWEBサーバ起動。debugをオンに設定
#
```

> bootstrap.html

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Cache-Control" content="no-cache">

  <title>ImageSearchデモツール</title>

  <link rel="stylesheet" type="text/css" href="/static/css/bootstrap.css">
  <style type="text/css">

  .bs-component + .bs-component {
    margin-top: 1rem;
  }
  @media (min-width: 768px) {
    .bs-docs-section {
      margin-top: 8em;
    }
    .bs-component {
      position: relative;
    }
    .bs-component .modal {
      position: relative;
      top: auto;
      right: auto;
      bottom: auto;
      left: auto;
      z-index: 1;
      display: block;
    }
    .bs-component .modal-dialog {
      width: 90%;
    }
    .bs-component .popover {
      position: relative;
      display: inline-block;
      width: 220px;
      margin: 20px;
    }
    .nav-tabs {
      margin-bottom: 15px;
    }
    .progress {
      margin-bottom: 10px;
    }
  }
  </style>
</head>
<body>

<!-- ヘッダー作る（ロゴ部分）
================================================== -->
<header>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href="./">
        <img src="/static/css/sbc.jpg" width="200" height="30" class="d-inline-block align-top mr-1" alt="SBCloud">
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbar">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="./">Top <span class="sr-only">(current)</span></a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>

<div class="container">
  <div class="page-header" id="banner">
    <div class="row my-4">
      <div class="col-12">
        <h2>ImageSearchデモツール</h2>
        <p class="lead">ImageSearchのAPIを利用して、取り込んだ画像から類似商品を出力します。</p>
      </div>
    </div>
  </div>

  <!-- ファイルをインポートする
  ================================================== -->
  <section class="bs-docs-section clearfix">
    <div class="row">
      <div class="col-lg-12">
        <div class="page-header">
          <h1 id="navbars"></h1>
          <div class="form-group">
            <form method="post" action="" enctype="multipart/form-data">
              <label for="exampleInputFile"><h3>File input</h3></label>
          <input type="file" id="img_file" name="img_file" class="col-sm-4" accept=".jpg, .jpeg, .png "参照")">  
          </div>
        </div>
          <label for="exampleSelect1"><h4>カテゴリ選択</h4></label>
          <select class="form-control"  id="categoly" name="categoly">
           <option value="88888888" sekected>カップ</option>
           <option value="3">バッグ</option>
           <option value="4">靴</option>
          </select><br>
          <input value="検索" type="submit" class="btn btn-secondary"></button>
        </form>
      </div>
    </div>
    <br><br>
  </section>

    <!-- 検索結果返す
  ================================================== -->

  <div class="row">
      <div class="col-lg-4">
        <div class="bs-component">
          <div class="card border-info mb-3" style="max-width: 20rem;">
            <div class="card-header"><h4>被写体</h4></div>
            <div class="card-body">
              <p><img src="{{ img_url0 }}" width="270" height="200"></p>
              </div>
              </div>
   
        <div class="bs-component">
          <div class="card border-info mb-3" style="max-width: 20rem;">
            <div class="card-header"><h4>検索結果  1位</h4></div>
            <div class="card-body">
              <p><img src="{{ img_url1 }}" width="270" height="200"></p>
            </div>
            </div>

          <div class="bs-component">
          <div class="card border-info mb-3" style="max-width: 20rem;">
          <div class="card-header"><h4>検索結果  2位</h4></div>


          <div class="card-body">
          <p><img src="{{ img_url2 }}" width="270" height="200"></p>
          </div>
          </div>
          
          <div class="bs-component">
          <div class="card border-info mb-3" style="max-width: 20rem;">
          <div class="card-header"><h4>検索結果  3位</h4></div>
          <div class="card-body">
          <p><img src="{{ img_url3 }}" width="270" height="200"></p>
          </div>
          </div>

        </div>
      </div>
    </div>
    </div>
    <h4>ImageSearchからの応答値</h4>
    <p>{{result}}</p>
  </div>
```


## アプリTEST

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613460940500/20191113152500.png "参照")




