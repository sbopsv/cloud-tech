---
title: "FCでECSを自動起動&自動停止"
metaTitle: "Alibaba CloudのFunction Compute(サーバレスアーキテクチャ)を使ってECSインスタンスを自動起動&自動停止させる"
metaDescription: "Alibaba CloudのFunction Compute(サーバレスアーキテクチャ)を使ってECSインスタンスを自動起動&自動停止させる"
date: "2019-12-25"
author: "sbc_tnoce"
thumbnail: "/Serverless_images_26006613488886700/20191225175054.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Function Compute(サーバレスアーキテクチャ)を使ってECSインスタンスを自動起動&自動停止させる

# はじめに

本記事では、Alibaba CloudのFunction Compute(サーバレスアーキテクチャ)を使ってECSインスタンスを自動起動&自動停止させる方法をご紹介します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/20191225175054.png "img")      


# この記事の目的
Alibaba Cloudの``FunctionCompute``というサーバーレスでコードを実行できるプロダクトを使ってみます。
AWSでいう```Lambda```に相当するプロダクトで、低料金でAlibaba Cloudが提供するSDKなどを組み合わせてAlibaba CloudのリソースをAPIで操作することができます。

# Function Computeで実現したいこと
従量課金で建てたECSを朝と夜の特定時間に自動起動ならびに自動停止させます。

背景としては、社内検証でECSを```従量課金```で複数台作りそのままにしておくことがあり、不使用時にもコストが発生していたことがもったいない と思ったからです。そして、FunctionComputeで実現する場合に、以下2点メリットが挙げられます。

- ・cron用のECSを別で用意したり、自身のPCをホストとしてタスクスケジューラーやcronを実施したりせずに、シンプルかつ低コストでAPIリクエストを投げられる
- ・Alibaba Cloud側で豊富なSDKを用意しており、使い慣れたプログラミング言語で開発できる


## より柔軟にECSの自動停止と自動起動を実現させるために
ECSにはタグ機能があり、タグにはkeyとvalueを設定することが可能です。
今回は、このタグのkeyを用いて、自動起動ならびに自動停止の対象とするECSを決定します。

keyの値は```Start&Stop```として、タグを付けたECSとタグを付けていないECSで比較していきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/abf9e426-99aa-d0cc-f036-f4e8bb181302.png)


タグっぽいアイコンがよりグレー色なECSが、タグなしのECSになります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/790b2503-7de3-9cd7-fd3d-4972a1d71028.png)


# Function Computeの概要
Alibaba Cloud国際サイトのドキュメントセンターによると以下の通りです。

### What is Function Compute?

>Alibaba Cloud Function Compute is an event-driven and fully-managed compute service.
With Function Compute, you can quickly build any type of applications or services without considering management or O&M.
You can complete a set of backend services for processing multimedia data even in several days.

意訳
> Alibaba CloudのFunctionComputeはイベント・ドリブンかつフルマネージドのコンピュートサービスである。
> FunctionComputeを用いることで、迅速にいかなるタイプのアプリケーションまたはサービスをマネジメントやQ&Mを考慮せずに構築可能になる。
> 複数のバックエンドサービスを僅かな日数で完了させることが可能。

### How it works?
> By using Function Compute, you can author and upload codes without worrying about procuring and managing infrastructure resources. Function Compute prepares computing resources for you and runs your codes on your behalf elastically and reliably.
In addition, Function Compute provides log query, performance monitoring, alarms, and other features.
You only pay for resources actually consumed when running the codes. No fee is incurred for application codes that are not run.

意訳
> FunctionComputeを利用することで、インフラリソースの管理や入手を心配せずにコードの作成とアップロードが可能になる。
> FunctionComputeは信頼性高く柔軟、（あなたの代わりに）コードを実行させるリソースを準備している。
> 実際にコードを実行するにあたって消費したリソースのみの費用を支払う。実行していないアプリケーションコードの費用は請求されない。

 

なんとなくは伝わりますが、英語がちょっとアレで結構？な点が多いです。笑
公式ドキュメントのイメージ図です。FunctionComputeがどうはたらくか、ワークフローが視覚的にわかりやすいです 


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/53b0d1bb-2205-bb0b-f444-2629b2d90583.png)


現在、対応しているSDKのプログラミング言語（ランタイム）は以下です。
>https://www.alibabacloud.com/cloud-tech/doc-detail/53277.htm

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/baa4e441-781a-dc16-3c72-008fc62819a6.png)

```SDKs for more languages are coming soon.```とあるので、今後はRubyなども登場するのでしょうか？


# Python3.xによる全体コード

自動起動と自動停止をインスタンスステータスに応じてif文で分岐させて1つのコードにまとめても良かったのですが、わかりやすくするためにfunctionごとに関数を分けました。

##### 起動のスクリプト

```python
#!/usr/bin/env python
#coding=utf-8

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkecs.request.v20140526.DescribeInstancesRequest import DescribeInstancesRequest
from aliyunsdkecs.request.v20140526.StartInstanceRequest import StartInstanceRequest
import json

# ACK情報、リージョン情報
ACCESSKEY_ID = ""
ACCESSKE_SECRET = ""
REGION_ID = "ap-northeast-1"
client = AcsClient(ACCESSKEY_ID, ACCESSKE_SECRET, REGION_ID)

# ハンドラー作成
def handler(event, context):
    describe_request = DescribeInstancesRequest()
    describe_request.set_Tags([
        {
            "Key": "Start&Stop"
            }
        ])

    execute_describe = client.do_action_with_exception(describe_request)
    data = json.loads(execute_describe)
    items = data['Instances']


    for instance in items['Instance']: 
        instanceid = instance['InstanceId']
        start_instance = StartInstanceRequest()
        start_instance.set_InstanceId(instanceid)
        start_instance_response = client.do_action_with_exception(start_instance)
        print(start_instance_response)
```

##### 停止のスクリプト

```python
#!/usr/bin/env python
#coding=utf-8

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkecs.request.v20140526.DescribeInstancesRequest import DescribeInstancesRequest
from aliyunsdkecs.request.v20140526.StopInstanceRequest import StopInstanceRequest
import json

# ACK情報、リージョン情報
ACCESSKEY_ID = ""
ACCESSKE_SECRET = ""
REGION_ID = "ap-northeast-1"
client = AcsClient(ACCESSKEY_ID, ACCESSKE_SECRET, REGION_ID)

# ハンドラー作成
def handler(event, context):
    describe_request = DescribeInstancesRequest()
    describe_request.set_Tags([
        {
            "Key": "Start&Stop"
            }
        ])
    execute_describe = client.do_action_with_exception(describe_request)
    data = json.loads(execute_describe)
    items = data['Instances']

    for instance in items['Instance']: 
        instanceid = instance['InstanceId']
        stop_instance = StopInstanceRequest()
        stop_instance.set_InstanceId(instanceid)
        stop_instance_response = client.do_action_with_exception(stop_instance)
        print(stop_instance_response)
```

# 手動で実行してみる
### コンソール画面
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/d4ae996a-b5a7-fbc0-340f-35704b7d9913.png)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/1126d765-5ef2-6ecd-cfc8-e30524e434b8.png)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/916be78e-128c-5df8-ac4c-e7556f1f69b1.png)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/6b1f9396-8e17-95c0-bd9f-60e2b345af06.png)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/d9e9ddef-e46e-6ba5-c5f3-295608848af1.png)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/ad9e02cf-157c-cafe-1164-8f4ef8b3d1dc.png)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/c7fd9e25-c7d5-e5db-c391-a37b1806e707.png)


# FunctionComputeのタイムトリガー
次に、自動実行させる設定をしていきます。
タイムトリガーが利用でき、cronのような時間設定をすることで指定の時間に作成した関数を実行させることが可能です。

## 注意点
FunctionComputeでは、UTC協定時間を採用しています。
UTC日本時間とUTC協定時間では+9時間の時差があります。
例えば、いま僕がこのQitta記事を書いているUTC日本時間とUTC協定時間の時差は以下のとおりです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/2a7d432e-a8c4-7466-da13-08c8de15dd07.png)

> つまり、日本はUTC協定時間に対して、``+9時間``進んでいるので、日本時間の``-9時間``の時間をcronの時間として設定してあげる必要があります。

## タイムトリガーの設定GUI
すでに私のコンソールで設定されている``StartInstance``の関数のタイムトリガーから設定を見てみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/5a4a7b82-f73e-9dd3-2d64-20ebccba4149.png)


次に、``StopInstance``の設定を見ます。同様にCron式で時間がセットされています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/155900b0-3985-9116-2a9e-a64993c7ef17.png)

 

これで、平日月曜日〜金曜日の

- AM 9:00に対象タグ（Start&Stop）がついているECSインスタンスが自動起動
- PM 9:00に対象タグ（Start&Stop）がついているECSインスタンスが自動停止

### するようになりました  🎉

## ECSの設定で従量課金インスタンスの非課金化
ECSの概要ページから非課金化を実施します。
これを設定することによって、```従量課金```インスタンスが停止されたときにデフォルトで非課金化されます。

![非課金化](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/20200131101736.png "img")      

![非課金化](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/20200131101917.png "img")      


# おまけ
自身が使用する言語のAPIのClassやメソッドの作りなどを確認するにあたって、いくつかの便利な方法をご紹介します。

## 1. OpenAPI Explorerを利用する
Alibaba Cloudで用意されているAPIを検索することができます。
検索したAPIに必須パラメータを記載したうえで、そのままAPIリクエストを送信することも可能です。
※ただしDry-runできないので実際の実行時には注意が必要

そして、各ランタイムごとにベースとなるコードを生成することができるので、Alibaba CloudのAPIを利用するにあたって利用は必須です。
かなり便利  

> https://api.aliyun.com/


## 2. Alibaba Cloudが公開しているSDKのGitHubリポジトリを見る
あまり見ることはないかもしれませんが、直接GitHubのリポジトリを見るのも1つの方法です。
Alibaba Cloud開発している各種SDKがすべて格納されているので、困ったときに見に行っちゃうのもアリです。

例えば、python系のメソッドは以下のPathに格納されています。
> https://github.com/aliyun/aliyun-openapi-python-sdk


# 最後に
``AWS Lambda``を利用されたことがあるかたなら、直感的に理解できると思うプロダクトでした 
ECSを営業時間帯に合わせて自動起動&自動停止したい場合は、こちらを参考に頂ければ幸いです。     


 <CommunityAuthor 
    author="長岡周"
    self_introduction = "2018年からAlibabaCloudサービスに携わる。現在プリセールスエンジニア。元営業マン。初心を忘れず日々精進。AlibabaCloud Professional（Cloud computing/Security）所持。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/animal_deer.png"
    githubUrl=""
/>



