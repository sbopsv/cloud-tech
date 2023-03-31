---
title: "SDKでTwitterデータを収集"
metaTitle: "SDKでTwitterデータを収集するLogService"
metaDescription: "SDKでTwitterデータを収集するLogService"
date: "2020-12-29"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/LogService_images_26006613654233400/20201215140931.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## SDKでTwitterデータを収集するLogService

本記事では、LogService SDKでTwitterデータをLogServiceへ収集する方法を記載します。   

# 前書き
> <span style="color: #ff0000"><i>LogService は、リアルタイムデータロギングサービスです。  
ログの収集、消費、出荷、検索、および分析をサポートし、大量のログを処理および分析する能力を向上させます。</i></span>

少し前になりますが、LogServiceについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www2.slideshare.net/sbopsv/alibaba-cloud-log-service

     


今回はPython SDKを使ってTwitterデータをAlibaba Cloud LogServiceへ収集、蓄積、可視化してみましょう。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613654233400/20201215140931.png "img")


---

# プロジェクト作成（LogService全体で共通事項）

まずはプロジェクトを作成します。LogServiceコンソールから 「Create Project」を選択し、起動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201124101928.png "img")



Project Nameをここでは「techblog」にし、プロジェクトを作成します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613654233400/20201124102655.png "img")

その直後に "Do you want to create a Logstore for log data storage immediately?"、「Log Storeを作成しますか？」とポップアップが出ます。
Log StoreはLog Serviceでデータを蓄積するものなので、「OK」を選定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613654233400/20201124102805.png "img")

LogStore Nameをここでは「twitter_logstore」と入力し、LogStoreを作成します。

その後、「LogStoreが作成されました。今すぐデータアクセスしますか？」とポップアップが出ますが、これは必要に応じて選定すると良いです。
ちなみに「Yes」を選択した場合、50を超える様々なデータアクセス手法のコンソールが表示されます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613654233400/20201124103134.png "img")



---

# データ格納について

## STEP1: Twitter APIの準備

Twitter APIを利用するために、Twitter Developer Platformサービスから、Twitter API利用申請をします。   

> https://developer.twitter.com/ja

（ここでの説明は省略します）

申請後、Twitter APIとしてCONSUMER_KEY、CONSUMER_SECRET 、ACCESS_KEY 、ACCESS_SECRET を取得します。

---

## STEP2: LoggService 環境の準備

SDKでTwitterデータを収集する前に、LogService側でいろいろ準備する必要があります。   
ENDPOINT 、ACCESSKEYID 、ACCESSKEY 、PROJECT 、LOGSTORE 、TOKEN 、topic 、source のパラメータ値を用意しなければなりません。    

ENDPOINTはプロダクトサービスが利用している国を指します。    
今回は日本リージョンを選定しているので、 `ap-northeast-1.log.aliyuncs.com` を選定します。   

> https://www.alibabacloud.com/cloud-tech/doc-detail/29008.htm

ACCESSKEYID 、ACCESSKEY はAlibaba Cloudユーザーの認証情報です。これがあれば、様々なサービス・リソースへのプログラムによるアクセスを許可します。   
これはコンソールから確認できます。RAMユーザー（子アカウント）の場合は、RAMユーザとしてのACCESSKEYID 、ACCESSKEYを入手する必要があります。   

PROJECT はLogServiceのProjectのことを指します。上記「techblog」と作成したので、Projectは`techblog`にします。   

LOGSTORE は 「techblog」らProject配下に作成したLogStoreを指定する必要があります。上記「twitter_logstore」を作成したので、ここは`twitter_logstore`にします。    

TOKEN 、topic 、source は任意です。これはLogServiceでデータを出力するときに参照として残るパラメータ値です。    

---

## STEP3: ECSにて以下Pythonファイルを作成

上記のTwitter API CONSUMER_KEY、CONSUMER_SECRET 、ACCESS_KEY 、ACCESS_SECRET、     
およびNDPOINT 、ACCESSKEYID 、ACCESSKEY 、PROJECT 、LOGSTORE 、TOKEN 、topic 、source のパラメータ値の準備ができたら、 
ECSなどにて以下Pythonコードを記載します。 著者の Python version は `Python 3.6.8` です。


```Python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

# pip3 install -U aliyun-log-python-sdk
# pip3 install tweepy

from tweepy import StreamListener
from tweepy import Stream
import tweepy, json, time
from datetime import datetime

from aliyun.log.logitem import LogItem
from aliyun.log.logclient import LogClient
from aliyun.log.putlogsrequest import PutLogsRequest

CONSUMER_KEY = "<your CONSUMER_KEY>"
CONSUMER_SECRET ="<your CONSUMER_SECRET >"
ACCESS_KEY = "<your ACCESS_KEY >"
ACCESS_SECRET = "<your ACCESS_SECRET >"

ENDPOINT = 'ap-northeast-1.log.aliyuncs.com'
ACCESSKEYID = "<your ACCESSKEYID >"
ACCESSKEY ="<your ACCESSKEY >"
PROJECT = 'techblog'
LOGSTORE = 'twitter_logstore'
TOKEN = ""
topic = 'twitter_log_demo'
source = 'twitter'

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
api = tweepy.API(auth)

client = LogClient(ENDPOINT, ACCESSKEYID, ACCESSKEY, TOKEN)

class StdOutListener(StreamListener):
    def on_data(self, data):
        # print(data)
        tweet = json.loads(data)
        if not tweet['retweeted'] and 'RT @' not in tweet['text']: # retweetは取得しない
            new_datetime = datetime.strftime(datetime.strptime(tweet["created_at"],"%a %b %d %H:%M:%S +0000 %Y"), "%Y-%m-%d %H:%M:%S")
            utc_datetime = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z' 

            if 'Web' in tweet['source']:
                isWeb = 1
                isAndroid = 0
                isiPhone = 0                              
            elif  'Android' in tweet['source']:
                isWeb = 0
                isAndroid = 1
                isiPhone = 0   
            elif  'iPhone' in tweet['source']:
                isWeb = 0
                isAndroid = 0
                isiPhone = 1   
            else:
                isWeb = 0
                isAndroid = 0
                isiPhone = 0   

            contents = [
                ( 'created_at', new_datetime ),
                ( 'created_at_utc', utc_datetime ), 
                ( 'id_str', tweet['id_str'] ),                
                ( 'text', tweet['text'] ),
                ( 'source', tweet['source'] ), 
                ( 'Web', str(isWeb) ),               
                ( 'Android', str(isAndroid) ), 
                ( 'iPhone', str(isiPhone) ), 
                ( 'tweet_size', str(len( tweet['text'] )) ) 
                ]
            print(contents)
            # put LogService
            logitemList = []
            logItem = LogItem()
            logItem.set_time(int(time.time()))
            logItem.set_contents(contents)
            logitemList.append(logItem)

            request = PutLogsRequest(PROJECT, LOGSTORE, topic, source, logitemList)
            response = client.put_logs(request)
            response.log_print()

    def on_error(self, status):
        print(status)

if __name__ == '__main__':
    query = "#鬼滅の刃" # 取得したい特定のキーワードやハッシュタグ
    listener = StdOutListener()
    twitterStream = Stream(auth, listener)
    twitterStream.filter(track = [query])


```

注意として、このコードはそのままでは実行できないので、以下コマンドでTweepy、logservice-sdkをインストール実行する必要があります。    

```
pip3 install -U aliyun-log-python-sdk
pip3 install tweepy
```


## STEP4: 実行

ECSが閉じても恒久的に動くよう、nohup コマンドで 実行します。

```
[root@sts ~]# nohup python3 tweet.py &
```

これで以上です。取得したデータはこのような感じになります。

```
__source__:  twitter
__tag__:__client_ip__:  47.74.18.54
__tag__:__receive_time__:  1607694838
__topic__:  twitter_log_demo
created_at:  2020-12-1 13:53:53
created_at_utc:  2020-12-1T13:53:58.171Z
id_str:  1337395179389657091
iPhone:  0
Android:  1
Web:  0
source:  <a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>
text:  これぞ至高の領域に近き剣士…
 #グラブル  #鬼滅の刃  #日輪刀 https://t.co/IcW3ndTI4m
tweet_size:  30
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613654233400/20201217101728.png "img")

# 最後に

LogService Python SDKを使って、Twitterデータを収集する方法を簡単に説明しました。     
この作業自体、5分もかからないです（Twitter API申請は除く、、）   

ちなみにSDKは単にデータを収集するだけでなく、整形、ETL、格納処理もあります。   

> https://aliyun-log-python-sdk.readthedocs.io/README.html


LogServiceはフルマネージド環境でありながら、様々なデータを収集し蓄積・可視化する事が可能です。    
加えて、データ量や使い方に応じた課金なので、使い方次第ではコスト削減や、運用負荷の改善に効果があるのでは無いでしょうか。



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


