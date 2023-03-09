---
title: "DataVでマップ作成"
metaTitle: "インパクトのあるダッシュボードを作るならDataV #2 3Dマップ編"
metaDescription: "インパクトのあるダッシュボードを作るならDataV #2 3Dマップ編"
date: "2019-07-26"
author: "SBC engineer blog"
thumbnail: "/DataV_images_26006613378008500/instance_list.png"
---

## インパクトのあるダッシュボードを作るならDataV #2 3Dマップ編


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/astronomy.png "img")

本記事では、CSVファイルと、静的JSONデータ、Function Computeを使ったAPIを通して、DataVのダッシュボードを作成する方法をご紹介します。

完成後の画面はこのようなものになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/3dmap_demo2.gif "img")


右側は、リージョンの一覧と、選択したリージョンで稼働するインスタンスの一覧を表示しています。
     
     

# 利用するプロダクト
説明の前に、本ブログでは以下のプロダクトを利用します。個々のサービス仕様等の説明は割愛させていただきますのでご了承ください。

<b>Alibaba Cloud</b>

・[DataV](https://www.alibabacloud.com/product/datav)　エンタープライズエディションを利用します。

・ [Function Compute](https://www.alibabacloud.com/product/function-compute)　リージョンやインスタンスリストを取得するためのAPIサーバとして利用します。

・[Elastic Compute Service](https://www.alibabacloud.com/product/ecs)　インスタンスリストを表示するために利用します。（起動していなくても良いです）
     

<b>位置情報サービス</b>

 ・[IP Geoloaction API](http://ip-api.com/)　IPアドレスやドメインから位置情報を取得できるサービスです。（無償の範囲内で利用する想定です）
     
     
# １：プロジェクト作成
では、ここから作成手順を説明します。はじめにDataVのプロジェクトを作成します。

１）Alibaba Cloud コンソールにログインし、プロダクト一覧からDataVを選択します。

２）DataVコンソール画面内にあるプロジェクト作成を選択します。

３）テンプレート一覧の先頭にあるBlank Canvasを選択します。
プロジェクト名（任意の文字列）を入力します。

４）ここまで完了すると以下のような画面が表示されます。（赤字は各パーツの説明です。実際には表示されません。）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/workspace.png "img")


以降は、この画面を中心に作業を行います。

     
     

# ２：画面の初期設定

次に作成するダッシュボード画面のサイズと背景の設定をします。画面右側のページ設定にて以下を入力します。

- ページサイズ：幅1440　高さ900
- 背景色：#000000
- 背景画像：削除（カーソルを合わせるとゴミ箱が表示されます）

     
     

# ３：タイトルヘッダーを作成
次に画面タイトルを表示するヘッダーを作成します。


１）プロジェクト画面上部（ウィジェット選択）から**カスタム背景ブロック**を選択します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/header1.png "img")
     
２）画面右側のウィジェット設定にて以下を入力します。（その他の項目はデフォルトのままで良いです）

- サイズ：幅1440　高さ65
- 位置：横0　縦0
- 背景色：RGBA(255,255,255,0.09)

     
３）ウィジェット選択から**タイトル**を選択し、ウィジェット設定を以下のようにします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/header2.png "img")

- サイズ：幅480　高さ55
- 位置：横25　縦5
- テキストスタイル：サイズ32　#FFFFFF　bolder

     
４）タイトルウィジェットの文字を変更するために、ウィジェット設定内にあるデータ設定タブを開き、valueの値を”Alibaba Cloud Regions”にします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/titlevalue.png "img")


     
５）プロジェクト画面上部（ウィジェット選択）から**全画面切り替え**を選択し、ウィジェット設定を以下のようにします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/header3.png "img")


- サイズ：幅55　高さ55
-  位置：横1365　縦5
- 背景色：#000000

     
ここまで完了すると以下のようになります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/header.png "img")


     
     

# ４：3Dマップを作成
ここから3Dマップ部分の作成を説明します。


１）ウィジェット選択から**3Dの地球**を選択します。
画面右側のウィジェット設定にて以下を入力します。（他はデフォルトのまま）

    - サイズ：幅845　高さ832
    - 位置：横0　縦65
    - 背景色：RGBA(0,0,0,0)
    - 視点の設定：視角90　緯度20　経度110 距離320
    - 回転速度：0.5

     
２）3Dマップにレイヤー（視覚効果など）を追加します。ウィジェット設定にある**+Component Management**を選択すると、レイヤーコンポーネントの一覧が表示されるので、以下を追加します。

    - 球体レイヤー（デフォルト）
    - アンビエントライトレイヤー（デフォルト）
    - 大気レイヤー
    - 散布レイヤー
    - フロートボードレイヤー
    - スキャンラインレイヤー

     
３）ウィジェット設定にて、各レイヤーを選択し、設定を変更します。

・球体レイヤー     
　　マッピングタイプ：パーティクル

・アンビエントライトレイヤー     
　　証明強度：2

・大気レイヤー     
 　　透明度：１　強さ：1.25　スケーリング：1.7

・散布レイヤー     
 　　呼吸速度：0.5　透明度：１　データ分類：7　散布サイズ：50　色：#FAAD14

・フロートボードレイヤー     
　　高さ：5　スケーリング：40　透明度：1

・スキャンラインレイヤー     
　　色：#91D5FF

     
     

# ５：位置情報をマッピングする
3Dマップウィジェットに追加した散布レイヤーにデータを入力することで、リージョンの位置に黄色い円が表示（マッピング）されます。

データ入力方法は、データベースからの取得や、JSON形式のテキストなどが選べますが、ここではCSVを利用します。
  
１）DataVコンソール画面TOPに戻り、データソースを選択します。
 
２）ソースを追加を選択し、以下の設定を行います。

- タイプ：CSVファイル
- データソース名：alibaba_regions（任意の名前で良いです）
- ファイル：本ブログ用に作成した[CSVファイル](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/alibaba_rigions.csv)をアップロードください。

> https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/alibaba_rigions.csv
     
３）作成画面に戻り、3Dマップのウィジェット設定にあるデータタブから散布レイヤーを選択します。
 
- データソースタイプ：CSVファイル
- 保存されたデータソース：alibaba_regions（または任意で設定したデータソース名）

     
     

# ６：リージョン名をマッピングする
次に3Dマップウィジェットのフロートボードレイヤーにデータを入力します。これを行うことで、リージョン名が表示されます。ここでは、JSONテキスト形式で行います。

２）3Dマップのウィジェット設定にあるデータタブからフロートボードレイヤーを選択し、以下の設定を行います。

- データソースタイプ：静的データ
- 本ブログ用に作成した[JSON形式のデータ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/alibaba_rigions_floatlayer.json)から、テキストをデータ枠内にコピーペーストしてください。

> https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/alibaba_rigions_floatlayer.json
     
ここまで完了すると以下のように3Dマップが完成します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/3dmap.png "img")

     
     

# ７：リージョン一覧を作成
ここからはリージョン情報の一覧を表示するための手順です。

１）ウィジェット選択からカルーセルリストを選択し、以下の設定を行います。

- サイズ：幅600　高さ290
- 位置：横805　縦：80
- テーブルのレコード数：10
- ヘッダのレコードの高さ：10%
- ヘッダ背景色：#000000
- ヘッダテキスト：色#5499FD　サイズ18　太さbold
- 奇数レコード背景色：RGBA(255,255,255,0.03)
- 偶数レコード背景色：RGBA(0,0,0,0)
- コールバックフィールド：RegionId
- カスタムカラムラベル１：フィールド名LocalName　表示名Region Name　幅比50%　テキストサイズ16
- カスタムからむラベル２：フィールド名RegionId　表示名Region ID　幅比50%　テキストサイズ16

     
     

# ８：リージョン一覧APIを作成
ここでFunction Computeを利用してAPIの作成を行います。これを行うことでリージョン一覧を取得するAPIができ、DataVのデータソースに指定することができます。

１）Function Computeのコンソール画面からサービス作成を行います。（サービス名は任意で良いです）

２）関数の作成を行います

- 関数テンプレート：空の関数
- 関数名：getAlibabaCloudRegions（任意名）
- トリガータイプ：HTTPトリガー
- トリガー名：HttpTrigger（任意名）
- 承認：anonymous
- メソッド：GET
- ランタイム：Python3
- オンライン編集：ここにソースコードを入力します。

```Python
# -*- coding: utf-8 -*-
import logging
import urllib.request
import json
import sys

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkecs.request.v20140526.DescribeRegionsRequest import DescribeRegionsRequest

ACCESSKEY_ID = ""
ACCESSKEY_SEC = ""

# if you open the initializer feature, please implement the initializer function, as below:
# def initializer(context):
#    logger = logging.getLogger()  
#    logger.info('initializing')

# ここでAlibaba APIをコールしてリージョン一覧を取得しています
def describeRegionRequest():
    global ACCESSKEY_ID, ACCESSKEY_SEC
    client = AcsClient(ACCESSKEY_ID, ACCESSKEY_SEC)
    request = DescribeRegionsRequest()
    request.set_accept_format('json')
    response = client.do_action_with_exception(request)
    return str(response, encoding='utf-8')
    
#　ip-apiをコールして緯度経度を取得しています
def getRegionGEO( region_end_point ):
    url = 'http://ip-api.com/json/' + region_end_point
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as res:
        body = json.loads( res.read() )
        if body['lat'] and body['lon']:
            return ( body['lat'], body['lon'] )
        
def mergeRegionGEO( org_json  ):
    org_dict = json.loads(org_json)
    rtn_dict = []
    for r in org_dict['Regions']['Region']:
        geo = getRegionGEO( r['RegionEndpoint'] )
        if len(geo) == 2:
            r['lat'] = geo[0]
            r['lng'] = geo[1]
        rtn_dict.append(r)
    
    if len(rtn_dict) > 0:
        return json.dumps(rtn_dict, ensure_ascii=False)
    else:
        raise ClientException("200 OK", "No data")

# HTTPトリガーからコールされる関数です。ここからスタートします。
def handler(environ, start_response):
    try:
        global ACCESSKEY_ID, ACCESSKEY_SEC
        ACCESSKEY_ID = environ['accessKey']
        ACCESSKEY_SEC = environ['secretKey']
    
        response_body = mergeRegionGEO( describeRegionRequest() )
        status = '200 OK'
        response_headers = [('Content-type', 'text/json')]
        start_response(status, response_headers)
        return [bytes(response_body, 'utf-8')]
        
    except Exception as e:
        #print(sys.exc_info())
        status = '200 OK'
        response_headers = [('Content-type', 'text/plain')]
        start_response(status, response_headers)
        return [bytes(e.message, 'utf-8')]

```

３）関数作成後に環境変数を設定します。
自身のAlibaba Cloudアカウントの**AccessKey ID**と**Access Key Secret**を、上記で作成した関数の環境変数として登録します。（変数名はaccessKey、secretKeyとしてください）


４）カルーセルリストのデータソースとしてAPIを設定します。
DataVの画面に戻り、上記で作成したカルーセルリストのデータ設定を以下のように行います。

- データソースタイプ：API
- URL:関数トリガーに記載されているHTTP URL

５）データ応答参照をクリックすると以下のようにAPIからの取得データが表示されます。（リージョン名が中国語ですがご了承ください）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/regionlist_res.png "img")


ここまで完了すると以下のような画面になります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/region_list.png "img")

     
     

# ９：ECSインスタンス一覧を作成

１）ウィジェット選択からカルーセルリストを選択し、以下の設定を行います。

- サイズ：幅600　高さ290
- 位置：横805　縦：400
- テーブルのレコード数：10
- ヘッダのレコードの高さ：10%
- ヘッダ背景色：#000000
- ヘッダテキスト：色#5499FD　サイズ18　太さbold
- 奇数レコード背景色：RGBA(255,255,255,0.03)
- 偶数レコード背景色：RGBA(0,0,0,0)
- カスタムカラムラベル１：フィールド名InstanceName　表示名InstanceName　幅比40%　テキストサイズ16
- ラベル２：フィールド名InstanceType　表示名Type　幅比40%　テキストサイズ16
- ラベル３：フィールド名Status　表示名Status　幅比20%　テキストサイズ16

     
     

# １０：インスタンス一覧APIを作成

１）Function Computeコンソールにて関数の作成を行います

- 関数テンプレート：空の関数
- 関数名：getAlibabaEcsInstances（任意名）
- トリガータイプ：HTTPトリガー
- トリガー名：HttpTrigger（任意名）
- 承認：anonymous
- メソッド：GET
- ランタイム：Python3
- オンライン編集：

```Python
#    logger.info('initializing')

def describeInstances(region_id):
    global ACCESSKEY_ID, ACCESSKEY_SEC
    client = AcsClient(ACCESSKEY_ID, ACCESSKEY_SEC, region_id)
    request = DescribeInstancesRequest()
    request.set_accept_format('json')
    #print(dir(request))
    request.set_PageSize(100)
    response = client.do_action_with_exception(request)
    #print(response)
    return str(response, encoding='utf-8')


def makeJson( org_json  ):
    org_dict = json.loads(org_json)
    rtn_dict = []
    tmp_json = {}
    ix = 0
    for r in org_dict['Instances']['Instance']:
        tmp_json['InstanceName'] = r['InstanceName']
        tmp_json['InstanceType'] = r['InstanceType']
        tmp_json['OSName'] = r['OSName']
        tmp_json['Status'] = r['Status']
        rtn_dict.append(tmp_json)
        tmp_json = {}
    if len(rtn_dict) > 0:
        return json.dumps(rtn_dict, ensure_ascii=False)
    else:
        raise ClientException("200 OK", "No data")


def handler(environ, start_response):
    try:
        logger = logging.getLogger() 
        
        global ACCESSKEY_ID, ACCESSKEY_SEC
        ACCESSKEY_ID = environ['accessKey']
        ACCESSKEY_SEC = environ['secretKey']

        # Defaultは東京リージョン
        region_id = "ap-northeast-1"
        
        if 'QUERY_STRING' in environ:
            # 注意：DataVからのリクエストは末尾に&spmが付くよ
            query_arr = re.split('[=&]', environ['QUERY_STRING'])
            if len(query_arr) >= 2 and query_arr[0] == 'region_id':
                region_id = query_arr[1]
            
        response_body = makeJson(describeInstances(region_id))
            
        status = '200 OK'
        response_headers = [('Content-type', 'text/json')]
        start_response(status, response_headers)
        return [bytes(response_body, 'utf-8')]
            
        #else:
        #    raise ClientException("200 OK", "undefined region_id")
        
    except Exception as e:
        #print(sys.exc_info())
        status = '200 OK'
        response_headers = [('Content-type', 'text/plain')]
        start_response(status, response_headers)
        return [bytes(e.message, 'utf-8')]
```

以降の手順はリージョン一覧作成時と同じです。

     
     

# １１：選択したリージョン名を表示する
リージョン一覧にあるレコードをクリックすると、リージョン名を一覧の下に表示するようにします。

１）事前にDataVのコンソールTOPからデータソース設定にて、外部のデータベースサーバへの接続設定を追加する必要があります。（DBテーブルやレコードは不要です）

２）タイトルウィジェットを選択します。
データ設定にて、データタイプをデータベースにします。上記で設定したデータソース名を指定します。
　以下のSQL文を入力します。
```
SELECT 
 CASE 
 WHEN :RegionId != ""
 THEN :RegionId
 ELSE "Select a Region from above list"
 END as value;
```

ここまで完了すると以下のような画面になります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/instance_list.png "img")

     
     

# １２：プレビューと外部公開
DataV画面上部の右側にプレビューボタンがあり、それをクリックすると別タブが起動し、作成したダッシュボードが表示されます。これは公開前の状態です。

公開をするにはプレビューボタンの隣にある公開ボタンをクリックし、パスワード等を設定することで外部に公開する状態になります。（公開用URLが表示されるのでそれを他者に配布します）

     
     

# まとめ
今回はCSVファイルと、静的JSONデータ、Function Computeを使ったAPIを通して、DataVのダッシュボードを作成する実例を掲載させていただきました。


