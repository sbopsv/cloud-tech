---
title: "DataVデータソース登録方法"
metaTitle: "LogServiceをDataVのデータソースに登録する"
metaDescription: "LogServiceをDataVのデータソースに登録する"
date: "2020-04-09"
author: "SBC engineer blog"
thumbnail: "/LogService_images_26006613546225700/20200408175501.png"
---

## LogServiceをDataVのデータソースに登録する

本記事では、LogServiceをDataVのデータソースとして連携する方法をご紹介します。     


## DataVとは
DataVは様々なプロダクトと連携し、データを可視化することができるツールです。   
Alibaba Cloudのプロダクト以外とも連携できることから、とても便利なツールとなっています。      

> https://www.alibabacloud.com/product/datav


## LogServiceとは
LogServiceは、大量のログデータを収集・分析するツールです。   

> https://www.alibabacloud.com/product/log-service

## DataVのデータソースとしてLogServiceを登録してみる

### 構成
このブログでは、FunctionComputeからデータをLogServiceに送り、   
LogServiceをDataVのデータソースとして登録していきます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613546225700/20200408175501.png "img")
   

### LogServiceのデータ準備
事前に、LogServiceでプロジェクトとログストアを作成します。   

|プロジェクト名|ログストア名 |
|:----:|:----:|
|techb-log|techb-logstore|

LogServiceにデータを送るFunctionComputeのコードは以下です。   
```
# -*- coding: utf-8 -*-
import logging
import json
import datetime
import time 
import random as rd
import os
from aliyun.log.logitem import LogItem
from aliyun.log.logclient import LogClient
from aliyun.log.getlogsrequest import GetLogsRequest
from aliyun.log.putlogsrequest import PutLogsRequest
from aliyun.log.listlogstoresrequest import ListLogstoresRequest
from aliyun.log.gethistogramsrequest import GetHistogramsRequest

def handler(environ, context):
    logger = logging.getLogger()

    endpoint = 'ap-northeast-1.log.aliyuncs.com' 
    accessKeyId = 'アクセスキーIDを入力' 
    accessKey = 'アクセスキーシークレットを入力'
    project ='techb-log'  #logserviceのプロジェクト名を入力
    logstore = 'techb-logstore' #logserviceのログストア名を入力
   
    client = LogClient(endpoint, accessKeyId, accessKey)
    topic = ""
    source = ""
    logitemList = []
   
    for i in range(10):
        rd_loc = [rd.randint(0,10),rd.randint(0,10),rd.randint(0,10),rd.randint(0,10),rd.randint(0,10),rd.randint(0,10),rd.randint(0,10),rd.randint(0,10),rd.randint(0,10),rd.randint(0,10),]
        for j in range(10):
            #location = location[j]
            status = str(rd_loc[j])
            location = "location"+str(j+1)
            location.encode()
            contents = [("location", location),("status",status)]

            print(contents)
            logItem = LogItem()
            logItem.set_time(int(time.time()))
            logItem.set_contents(contents)
            logitemList.append(logItem)
            req = PutLogsRequest(project, logstore, topic, source, logitemList)
            res = client.put_logs(req)
            res.log_print()
```
この関数ではlocationと、statusという値をLogServiceに送っています。   
location1~10に対応して、statusが0~9でランダムに発生します。   
この関数を実行し、LogServiceをみてみましょう！   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613546225700/20200408164134.png "img")

確かにデータが入っていることがわかりました。   
今回は、status=0の時を異常とし、location毎に異常件数を集計したいと思います。   
対象データを取るためのクエリは以下です。クエリを実行すると円グラフが表示されました。   
クエリの記載方法については公式ドキュメントをご参照ください。   

```
status = 0  | SELECT location as "場所", count(1) as "異常件数" GROUP BY location order by location
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613546225700/20200408170730.png "img")

> https://www.alibabacloud.com/cloud-tech/doc-detail/29060.htm

### DataVと連携
次に、DataVのデータソースとしてLogServiceを登録していきます。   
データソースタイプでSLS(LogService)を選択し、必要な情報を入力します。   
EndPointには、http://またはhttps://をつける必要があることにご注意ください。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613546225700/20200409110118.jpg "img")

データソースの登録が完了したら、ダッシュボード編集をしていきます。   
円グラフを選択し、データを先ほど登録したものに変更していきます。   
LogServiceのプロジェクトのどの部分のデータを使用するかを指定するために、   
データタブでクエリを記入する必要があります。   
from、toでデータのreceive_timeを記入し、グラフに表示するデータを指定しています。   
query部分は、先ほどLogServiceで入力したものを参考に記載していきます。   
```
{
  "projectName": "techb-log",
  "logStoreName": "techb-logstore",
  "topic": "",
  "from": "1586323367",
  "to": "1586330207",
  "query": "status = 0  | SELECT location as x, count(1) as y GROUP BY location order by location",
  "line": 100,
  "offset": 0
}
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613546225700/20200408181949.png "img")

DataVでLogServiceのデータを表示することができました！   



## LogServiceのダッシュボード機能とDataV

ご存知の方も多いかと思いますが、LogServiceにはダッシュボード機能があります。   
LogServiceにダッシュボードがあるのであれば、わざわざDataVで表示する必要がないのではないか   
という感想をお持ちの方もいらっしゃるのではないでしょうか？   
   
#### LogServiceのダッシュボード機能
このブログでは、DataVのデータソースとしてLogServiceを登録する方法をご紹介するため、簡単なグラフを使いましたが、   
LogServiceは<b>ログの収集・分析ツール</b>です。ダッシュボードを作成することで、収集したログを可視化することが可能です。   
また、<b>ドリルダウン機能があり、より詳細なデータを見ることができます。</b>


   
#### DataV
DataVは、RDSやTableStore,OSSなどの<b>LogService以外のデータソースのデータや、Alibaba Cloud以外のデータと連携し、   
同じダッシュボード上に表示することができます。</b>   
使用できるグラフの種類が多いことや、グラフの色を簡単に変更することができることから、表現力の高いダッシュボードと言えます。




   
このような特性の違いから、   
<b>ドリルダウン分析などを使って詳細なデータを見たい方はLogService</b>が、   
<b>様々なデータを、高い表現力で1枚のダッシュボードから視覚的に把握したい方はDataV</b>が向いています。   
   
LogServiceのダッシュボード機能とDataVを使い分けることで、必要なデータを必要としている人に伝えることができるのではないでしょうか！   
   

## 最後に
LogServiceをDataVのデータソースとして使用する方法をご紹介しましたが、いかがでしたか？   
プロダクトごとの強み、弱みを理解しうまく組み合わせることが大切ですね！   




