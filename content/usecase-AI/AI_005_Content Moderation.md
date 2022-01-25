---
title: "画像・映像コンテンツを評価する"
metaTitle: "Content Moderationで画像・映像を評価してみました"
metaDescription: "Content Moderationで画像・映像を評価してみました"
date: "2020-03-09"
author: "SBC engineer blog"
thumbnail: "/AI_images_26006613532222782/20200309111157.png"
---

## Content Moderationで画像・映像を評価してみました

## サービスの概要


本記事では、Alibaba Cloud Content Moderationを使って対象の画像や動画からアダルトやテロ関連のコンテンツを検出する方法をご紹介します。   

Content Moderationは 画像、動画、テキスト から アダルトやテロ関連のコンテンツを検出する為のAPI を提供するサービスで、対象のコンテンツが望ましくないカテゴリに属するのか、その度合はどの程度なのかを判定してくれるサービスです。     

具体的には対象の画像や動画のURLをリクエストボディに挿入してAPIを叩くと、Alibabaのビッグデータ分析を活用して、 以下のような判定結果が得られる仕組みです。    

以下はレスポンスのイメージ    

```
＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
suggestion ：[“pass”, “review”, “block”]　　#合格、人間による評価を推奨、ブロック
label：["normal","bloody", "violence"・・・・] 　#イメージのカテゴリ分類
rate ： [0.00 – 100.00]　 #評点≒いわゆる確信度ですね
＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
```

## 事前準備
といっても使い方は簡単で、要はContent ModerationのAPIを叩くだけなので、
強いて言えば（検証用の）画像や映像を用意するくらいです。


## 画像コンテンツからカテゴリを検出（実践編）
それでは早速、この画像を判定してみましょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613532222782/20200309111157.png "参照")

使用するAPIは「 ImageSyncScan 」、 リージョンはシンガポールを選択、 選択する「Scene」は"porn"と"terrorism"で画像はOSS上のバケットに保存。     

そうすると リクエスト は以下のようになります。     

```
#!/usr/bin/env python
#coding=utf-8
​
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
client = AcsClient('<accessKeyId>', '<accessSecret>', 'ap-southeast-1')
​
request = CommonRequest()
request.set_accept_format('json')
request.set_method('POST')
request.set_protocol_type('https') # https | http
request.set_domain('green.ap-southeast-1.aliyuncs.com')
request.set_version('2018-05-09')
​
request.add_header('Content-Type', 'application/json')
request.set_uri_pattern('/green/image/scan')
body = '''{
"scenes": ["porn","terrorism"],
"tasks": [
  {
    "url": "https://bucket名.oss-ap-northeast-1.aliyuncs.com/ファイル名******"
  }
]
}'''
request.set_content(body.encode('utf-8'))
​
response = client.do_action_with_exception(request)
​
# python2: print(response)
print(str(response, encoding = 'utf-8'))
​
```

そうすると以下のような レスポンス （抜粋）を得られます。

```
"results":
[
    {
        "label":"normal",　#ポルノコンテンツは含まれていません
        "rate":99.58,
        "scene":"porn",
        "suggestion":"pass"
    },
    {
        "label":"outfit", #テロリズムとカテゴリされる服装を検出したことでラベルしてます
        "rate":100.0,
        "scene":"terrorism",
        "suggestion":"block"　#ブロックを推奨
    }
]

```

実際のご利用時には、"label","rate","suggestion"の評価結果をもとに、OSSのファイルACLに対して公開、非公開をトリガすると良いかと思います。


## 映像コンテツからカテゴリを検出（実践編）
次は映像コンテンツを検証してみます 今度は以下の様なシーンを含む動画を選択してみました。
（画像はスクリーンショットです）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613532222782/20200309111236.png "参照")

### 画像スキャンとの違い は
いまのとこ同期スキャンには対応してない（非同期のみ）ので「VideoAsyncScan」のあとに「VideoAsyncScanResults」を実行する必要あります。    
また動画特有のオプションとしてスライスするフレームの間隔や最大値の指定が可能です。（検証精度とコストのバランスを調整可能）    

早速検証 まずは VideoAsyncScanをリクエストします    

```
#!/usr/bin/env python
#coding=utf-8
​
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
client = AcsClient('<accessKeyId>', '<accessSecret>', 'ap-southeast-1')
​
request = CommonRequest()
request.set_accept_format('json')
request.set_method('POST')
request.set_protocol_type('https') # https | http
request.set_domain('green.ap-southeast-1.aliyuncs.com')
request.set_version('2018-05-09')
​
request.add_header('Content-Type', 'application/json')
request.set_uri_pattern('/green/video/asyncscan')
body = '''{
"scenes":["porn","terrorism"],
"tasks":[
  {
    "url":"https://Bucket名.oss-ap-northeast-1.aliyuncs.com/ファイル名*****",
    "interval":1,
    "maxFrames":200
  }
]
}'''
request.set_content(body.encode('utf-8'))
​
response = client.do_action_with_exception(request)
​
# python2: print(response)
print(str(response, encoding = 'utf-8'))
```

レスポンス（抜粋）
```
{
    "code": 200,
    "msg": "OK",
    "taskId": "vi4gg************************rG6z4",
    "url": "https://Bucket名.oss-ap-northeast-1.aliyuncs.com/ファイル名****"
}
```

syncするだけなので、レスポンスはステータスコードを確認するのだけです。    

評価結果を得るために「 VideoAsyncScanResults 」を以下で実行します。     
必要なパラメータは「Sync」のレスポンスに含まれる" taskId "です。    

```
#!/usr/bin/env python
#coding=utf-8
​
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
client = AcsClient('<accessKeyId>', '<accessSecret>', 'ap-southeast-1')
​
request = CommonRequest()
request.set_accept_format('json')
request.set_method('POST')
request.set_protocol_type('https') # https | http
request.set_domain('green.ap-southeast-1.aliyuncs.com')
request.set_version('2018-05-09')
​
request.add_header('Content-Type', 'application/json')
request.set_uri_pattern('/green/video/results')
body = '''[
"vi4gg************************rG6z4"　　#レスポンスに含まれるtaskIdを指定
]'''
request.set_content(body.encode('utf-8'))
​
response = client.do_action_with_exception(request)
​
# python2: print(response)
print(str(response, encoding = 'utf-8'))
```

動画の 評価レスポンス（抜粋）を見てみましょう

```
"results": [
    {
        "label": "normal",
        "rate": 99.9,
        "scene": "porn",
        "suggestion": "pass"
    },
    ​{
        "frames": [
        {
            "label": "politics",
            "offset": 1,
            "rate": 72.81,
            "sfaceData": [
                {
                    "faces": [
                        {
                            "id": "AliFace_0018177",
                            "name": "奥萨马.本.拉登",
                            "rate": 72.81
                        }
                    ],
                    "h": 247,
                    "w": 247,
                    "x": 242,
                    "y": 6
                }
            ],
            "url": "https://Bucket名.oss-ap-northeast-1.aliyuncs.com/ファイル名****"
        },
​
＜途中省略＞
​
    "label": "terrorism",
    "rate": 100,
    "scene": "terrorism",
    "suggestion": "block"
    }
],
```



最下段の"label","rate","suggestion"は想定通り。 だけどスライスしたフレームごとに 謎のレスポンス が含まれてるので追加で調査します。

"sfaceData"とは 非同期検出で且つテロリズムのシーンに適用されるレスポンスで、

* 名前（今回は奥萨马.本.拉登=ウサーマ・ビン・ラーディン)
* 確度
* 顔ID
* "h","w:,"x": ,"y" は映像上の顔の位置を座標で明示。

というのが有るらしいことがわかりました。

＜参照＞ [中国語のドキュメントに記載あり](https://help.aliyun.com/document_detail/70436.html#face)

> https://help.aliyun.com/document_detail/70436.html#face


## 最後に
こんなところでFaceRecognitionのテクノロジーが出てきました。 
AlibabaCloudのビッグデータ分析やディープラーニングテクノロジーが さまざまなサービス間で連携していることが見て取れますね。


