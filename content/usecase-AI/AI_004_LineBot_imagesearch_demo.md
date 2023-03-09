---
title: "LineBot画像検索サービスを構築"
metaTitle: "LineBot+ImageSearchで手軽にAlibabaクラウドの画像検索サービスを利用する"
metaDescription: "LineBot+ImageSearchで手軽にAlibabaクラウドの画像検索サービスを利用する"
date: "2020-03-05"
author: "sbc_hr"
thumbnail: "/AI_images_26006613527341000/20200228151452.jpg"
---

## LineBot+ImageSearchで手軽にAlibabaクラウドの画像検索サービスを利用する

本記事では、LineBotからAlibaba CloudのImageSearchを使って、画像検索機能を利用する方法をご紹介します。

## ①LineBotを作成するために、下記のURLからLineDevelopersアカウントを作成します。

> https://developers.line.biz/en/

アカウント作成後、LineBotを一つ作成し、友達を追加します。

LineDevelopersの下記情報をメモして、後ほどLineBotAPIを呼び出しする際利用します。

 - （１）Channel secret
 - （２）Channel access token (long-lived)

## ②Alibabaクラウド上で、ImageSearchインスタンスをデプロイ方法は下記のドキュメントを参照します。

> https://www.alibabacloud.com/product/imagesearch

## ③ImageSearchのインスタンス作成後、下記のドキュメントに従って、事前に画像をインプットします。

> https://www.alibabacloud.com/cloud-tech/doc-detail/66580.htm


## ④今回利用するコードは下記になります。簡単に説明させていただきます。

利用するライブラリは以下になります。
```python
import os
import re
import oss2
import base64
from io import BytesIO
from PIL import Image

import aliyunsdkimagesearch.request.v20190325.AddImageRequest as AddImageRequest
import aliyunsdkimagesearch.request.v20190325.DeleteImageRequest as DeleteImageRequest
import aliyunsdkimagesearch.request.v20190325.SearchImageRequest as SearchImageRequest
from aliyunsdkcore.client import AcsClient

from flask import Flask
from flask import request
from flask import abort

from linebot import LineBotApi
from linebot import WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent
from linebot.models import TextMessage
from linebot.models import TextSendMessage
from linebot.models import ImageMessage
from linebot.models import ImageSendMessage

```

後ほどコードをECSにデプロイするため、ECSの環境変数は以下のものを設定します。
     
まずはLineBotAPIの呼び出しに必要なトークン情報です。
```python
# LineBot Access Token
CHANNEL_ACCESS_TOKEN = os.environ["CHANNEL_ACCESS_TOKEN"]
CHANNEL_SECRET = os.environ["CHANNEL_SECRET"]
```

次にImageSearchを利用するための必要なトークン情報も設定します。

 - （１）Alibabaクラウドにアクセスに必要なアクセスキーとシークレットトークン
 - （２）OSSにアクセスするためのURL、バケット名、バケットディレクトリ
 - （３）ImageSearchインスタンスのURL、Bot名、リージョン名

```python
# AliCloud Access Token
ALICLOUD_ACCESS_KEY = os.environ["ALICLOUD_ACCESS_KEY"]
ALICLOUD_ACCESS_SECRET = os.environ["ALICLOUD_ACCESS_SECRET"]
ALICLOUD_REGION = os.environ["ALICLOUD_REGION"]
ALICLOUD_BUCKET_NAME = os.environ["ALICLOUD_BUCKET_NAME"]
ALICLOUD_BUCKET_URL = os.environ["ALICLOUD_BUCKET_URL"]
ALICLOUD_BUCKET_DIR = os.environ["ALICLOUD_BUCKET_DIR"]
ALICLOUD_IMGSEARCH_URL = os.environ["ALICLOUD_IMGSEARCH_URL"]
ALICLOUD_IMGSEARCH_BOT = os.environ["ALICLOUD_IMGSEARCH_BOT"]

```

さて、本体のLineBotからImageSearchのAPIを呼びだしする部分は以下になります。

```python
line_bot_api = LineBotApi(CHANNEL_ACCESS_TOKEN)
handler = WebhookHandler(CHANNEL_SECRET)

auth = oss2.Auth(ALICLOUD_ACCESS_KEY, ALICLOUD_ACCESS_SECRET)
bucket = oss2.Bucket(auth, ALICLOUD_BUCKET_URL, ALICLOUD_BUCKET_NAME)

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

# ImageMessage Handler
@handler.add(MessageEvent, message=ImageMessage)
def handle_message(event):
  # get binary image
  message_id = event.message.id
  message_content = line_bot_api.get_message_content(message_id)
  image_bin = BytesIO(message_content.content)
  
  # search image
  request = SearchImageRequest.SearchImageRequest()
  request.set_endpoint(ALICLOUD_IMGSEARCH_URL)
  request.set_InstanceName(ALICLOUD_IMGSEARCH_BOT)

  encoded_pic_content = base64.b64encode(image)
  request.set_PicContent(encoded_pic_content)
  
  response = client.do_action_with_exception(request)

  # get string result
  data = str(response)

  # get image name
  imgName = (re.search("[a-z]*_[0-9]*_[0-9]*", data)).group(0)

  # get image on oss
  url = bucket.sign_url('GET', ALICLOUD_BUCKET_DIR + imgName + '.' + imgFormat, 60)

  # reply image message
  line_bot_api.reply_message(
    event.reply_token,
    ImageSendMessage(
      original_content_url = url,
      preview_image_url = url
    )
  )

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
  line_bot_api.reply_message(
    event.reply_token,
    TextSendMessage(text=event.message.text)
  )

```

iPhoneで取得した画像はサイズだと直接ImageSearchに送信できないため、画像をリサイズします。
     
※今回は画像サイズを一律（250,800）にしています。

```python

  # resize image
  pil_img = Image.open(image_bin)
  re_img = pil_img.resize((250,800))
  
  # get binary image
  output = BytesIO()
  re_img.save(output, format=imgFormat)
  image = output.getvalue()

```

Flaskサーバを外部公開するため、下記のように記載します。

```python

if __name__ == "__main__":
  callback()
  app.run(debug=False, host='0.0.0.0', port=443)

```

## ⑤作成したプログラムをECSにデプロイし、実行します。

## ⑥最後はLineDevelopersのWebHookURLに今回公開するサイトのURLを登録して構築完了です

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613527341000/20200228151239.png "参照")

     
## それでは実際動作する際のイメージを確認してみましょう。
     
（１）作成したImageSearchのBotを選択しチャット画面を開きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613527341000/20200228151511.jpg "参照")

     
（２）携帯のカメラを起動して、検索したい画像を写真撮影して送信すれば、一番類似の画像が返ってくることが確認できました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613527341000/20200228151452.jpg "参照")

## まとめ
以上でiPhoneから画像を撮影し、LineBotを経由でImageSearchで画像検索ができました。    
ImageSearchとLineBotを結合することで、ImageSearchの利用もよりユーザーに近ずくことができると考えて今回のデモを作成しました。


