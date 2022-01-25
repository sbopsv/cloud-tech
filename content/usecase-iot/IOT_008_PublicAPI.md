---
title: "IoT Studioで公開API作成方法"
metaTitle: "IoT Studioで公開APIを作ってみた"
metaDescription: "IoT Studioで公開APIを作ってみた"
date: "2020-09-30"
author: "sbc_fengqi"
thumbnail: "/IoT_Platform_images_26006613634696805/20200930223058.png"
---

## IoT Studioで公開APIを作成する

本記事では、IoT Studioを使って、公開APIを作成する方法を紹介します。    
IoT Studioは、公開APIを作成する機能を提供します。 公開APIを介して、Alibaba Cloud IoT Platform上のデータはAppKeyおよびAppSecret認証なしで取得できます。   

## 開発内容

公開APIは、IoT Studioのサービスオーケストレーションによって作成され、HTTP リクエストとHTTP レスポンスの形式で呼び出し方式をサポートしています。 直接に作成した「HTTPリクエスト/HTTPリターン」ペアと比較して、公開APIは認証にAppKeyとAppSecretを必要とせず、パブリックネットワークアクセスをサポートします。

## 開発プロセス

## STEP1　テンプレートを利用して公開APIを作成する

次の図に示すように、IoT Studioのプロジェクト管理ページで、テンプレートから新規ビジネスサービスを作成する方法を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930205712.png "img")

次の図に示すように、右上隅にあるテンプレートをクリックして展開し、最後のテンプレートである公開APIを見つけます。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930210254.png "img")

ビジネスロジックの名前は任意です。テンプレート説明情報からわかるように、このテンプレートを使用して作成するビジネスサービスには、HTTPリクエスト、スクリプト、およびHTTPリターンの3つのノードが含まれています。 このテンプレートを使用して新規作成をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930211300.png "img")

## STEP2　ノードを構成する

作成が完了すると、自動的にサービスエディタページにジャンプします。 ノードを順番に構成してみましょう。


* HTTPリクエストノード：

次の図にノード構成を示します。アクションパラメーターはpublic_apiにします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930213506.png "img")


* Node.jsスクリプトノード：

次の図にノード構成を示します。戻り値のペイロードの内容を”hello SBC”に変更します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930214401.png "img")

HTTPリターンノードを変更する必要はありません。今回はデフォルト設定のままにしておきます。

右上隅にある[保存]をクリックして、ビジネスサービスをデプロイおよび公開します。

## STEP3　APIドメイン名を取得する

サービスリストで新しく作成したサービスを右クリックし、[サービス呼び出し説明]を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930215543.png "img")

次の図に示すように、サービスの詳細ページがポップアップ表示されます。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930220503.png "img")

API Pathは、APIを呼び出すためのドメイン名です。行の最後にある[コピー]をクリックします。

### 注意

次の図に示すように、ドメイン名アドレスはドメイン名管理ページにもあります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930221211.png "img")

デフォルトのAPIアクセスドメイン名として表示されますが、このドメイン名はAPIを呼び出すためのドメイン名ではありません。ご注意ください。


## STEP4　パラメータを取得する

STEP2のところでは、HTTPリクエストノードにパラメーターを追加しませんでしたが、これは、このAPIへのリクエストがパラメーターを必要としないことを意味するものではありません。

 次の図に示すように、サービスの詳細ページを下にスクロールすると、リクエストの例を見つけます。これは、APIを呼び出すためのサンプルコードです。今回はより直感的なPythonバージョンに切り替えてみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930223058.png "img")

コード内のbodyMapとHeadersの宣言は、それぞれリクエストボディ情報とリクエストヘッダー情報を表します。


* bodyMapの内容は次のとおりです：

```python
{
    'id': str(uuid.uuid4()),
    'version': "1.0",
    'request': {
        'iotToken': "xxxx",
        'apiVer': "1.0.0"
    },
    'params': {
        # インタフェース パラメータ
        
        'action':"public_api",
    }
}
```

uuidモジュールは、使用されているネットワークカードと時間情報に従ってランダムな文字列を生成するために使用されます。 ここでは、サンプルコードに基づいて提供する必要のあるパラメーター情報を知る必要があるため、ランダムな文字列に置き換えることができます。 改行とコメントを削除し、次のように構成します：

```
{
    'id':'random_id',
    'version': "1.0",
    'request': 
        {
            'iotToken': "xxxx",
            'apiVer': "1.0.0"
        },
    'params': {
        'action':"public_api"
    }
}
```

* headerの内容は次のとおりです：

```python
{
    'accept': 'application/json'
}
```

つまり、ヘッダーに次のようなキー値を追加する必要があります： 'accept'： 'application / json'

## 別のパラメータ

ヘルプドキュメントによると、次のように、HTTPリクエストのBodyにパラメータを追加する必要があります。

```
{'params':{'action':'public_api'},'request':{'apiVer':'1.0.0'},'version':'1.0','id': 12}
```

また、リクエストヘッダー情報で、application/json という MIME タイプを指定する必要があります。


## STEP5 POSTMANを使用してリクエストをテストします

これですべての準備が整いました。POSTMANを使用して実際にAPIをテストしましょう。

POSTMANを起動し、次の図に示すように新しいHTTPリクエストを作成しておきます：

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930231333.png "img")

リクエスト方法はPOSTで、ドメイン名はSTEP3で取得したドメイン名を使用します。リクエストパラメータの設定に関して、二つ方法があります。

## 方法①

次の図に示すように、Body要素の情報をヘッダーに追加します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930232123.png "img")

application / jsonは、POSTMANによって事前提供されたMIME タイプに属していないためです。 Bodyタブで、フォーマットをrawとして選択し、STEP4で取得したパラメーターをBody情報に貼り付けます。詳細は以下になります：


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930232456.png "img")

すべての準備ができたら、[Send]をクリックして、次のように結果を返します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20201020151758.png "img")

戻り値は「hello SBC」です。これは、サービス開発のノード構成の内容と一致しています。 リクエストは成功しました。

## 方法②

同じ手順で、図に示すように新しいリクエストを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930234007.png "img")

今回の入力はヘッダーのキー名をAcceptとし、キー値は変更しません。

図に示すように、Bodyの内容を入力します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-iot/IoT_Platform_images_26006613634696805/20200930234338.png "img")

[Send]をクリックして、次のように結果を返します：

```python
{
     "code": 　200,
     "data": 　"hello SBC ",
     "success": 　true,
     "description":　"請求成功"
     "message":　"success"
}
```

上記の2つのパラメータ入力方法は両方とも実行可能です。


## まとめ
以上で、IoT Studioを使って、公開APIの作成方法をご紹介しました。    
Alibaba Cloud IoT paltformにおいては、公開APIは認証にAppKeyとAppSecretを必要とせず、パブリックネットワークアクセスもサポートします。そのため、汎用性の高い機能を一部公開し、外部から手軽に利用できるようにする仕組みを整えることが出来ます。    



