---
title: "ESでテキスト分類実践編"
metaTitle: "ElasticSearchのテキスト分類実装編"
metaDescription: "ElasticSearchのテキスト分類実装編"
date: "2020-11-27"
author: "magic929"
thumbnail: "/Elasticsearch_images_26006613646127600/20201028134827.png"
---

## ElasticSearchのテキスト分類実装編

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Elasticsearch/Elasticsearch_images_26006613646127600/20201028113351.png "img")


本記事では、ElasticSearchを用いたテキスト分類の実装編を紹介します。    


# はじめに

実装する前に、準備しましょう。

## データセット

kaggle上から取得したスパム二分類データセット(英語)を扱います。各行ごとに、カンマ(,)区切りで２つの内容(Category, Message)を含んでいます。


- ・Category：分類したいもの。hamとspamの二値。  
    　　 ・spam：  スパムメールのこと  
    　　 ・ham ：スパムではないメールのことを、スパムとかけて "ham"(ハム)と表現することがある
- ・Message： メールの詳細内容  

データセットは下記のようになっています。

![例) データセットの内容](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Elasticsearch/Elasticsearch_images_26006613646127600/20201028133905.png "例) データセットの内容")



## 環境構成

今回実装環境は

- ・言語：python3  
- ・WebFrame: Flask
- ・検索：ElasticSearch
- ・Editor: vscode
- ・APIテスト：Postman
- ・ElasticSearch_SDK

# データのアップロード

## メールの前処理

データセットをElasticSearchに取り込む前に、まずテキストの前処理をしましょう。
以下の処理が含まれています。

- ・記号などを削除する  
    　　・カンマ、ピリオド、括弧...など
- ・文章を単語に分ける(Tokenize)
- ・stop wordの削除  
    　　・一般的であるなどの理由で除外対象とする単語  
    　　・英語：a, the, of...など  
    　　・日本語：が、は、の、です...など
- ・[stemmingとlemmatization](https://nlp.stanford.edu/IR-book/html/htmledition/stemming-and-lemmatization-1.html)  
    　　・活用形や派生語を原形に戻すこと  
    　　・例) the boy's cars are different colors ⇨ the boy car be differ color
- ・単語を小文字(Lower)にする

 言語によって前処理の方法は違ってきます。上に挙げたもののほとんどは英語で必要な前処理で、日本語なら例えば「ひらがな、カタカナ、漢字の統一」も必要になるでしょう。
  
簡単に説明すると、テキストの前処理は決まっている訳じゃないく、文章の種類に合わせて適切なものを選ぶ事で分類の精度などを上がることができます。
もちろんテキストの性質により「ある前処理をしたら精度が落ちる」という可能性もあります。
ここでしっかりテストしてチューニングする必要があります。

## データのアップロード

ElasticSearchにデータを保存する際には、必ずESの中にIndexを作成する必要があります。
今回は以下のように "spam" という名前の Indexを作成していきましょう。

```python
index = "spam"
body = {
    "settings": {"number_of_shards": 1},
    "mappings": {
        "properties": {
            "Category": {"type": "keyword"},
            "Message": {"type": "text"}
        }
    }
}
```

 簡単に説明すると

- ・index：インデックスの名前  
- ・body：インデックスを作成する際の詳細設定  
    　　・この中にCategoryとMessage２つのfieldを含めています。

次にElasticSearchSDKを使って、indexを作成します。

```python
from elasticsearch import client
from elasticsearch import Elasticsearch

es = Elasticsearch()
indices = client.indices.IndicesClient(es)

def create_index():
    resp = indices.create(index, body)
    print(resp)
```

indexを作成したら、前処理したデータをアップロードします。

```python
from elasticsearch import Elasticsearch
from elasticsearch import helpers

def get_csv(file, es):
    actions = []

    id_num = 0
    with open(file, 'r', encoding='utf8') as f:
        for line in islice(f, 1, 4000):
            line = line.strip().split(',')
            action = {
                "_index": index,
                "_id": id_num,
                "_source": {
                    "Category": line[0],
                    "Message": line[1]
                }
            }
            id_num += 1
            actions.append(action)
            if len(actions) == 2000:
                helpers.bulk(es, actions)
                actions = []
        
        if len(actions) > 0:
            helpers.bulk(es, actions)
        print("finish")
```

テキストデータをcsv formatで保存しているため、まずcsvファイルを読み込んで、各fieldに対応したデータを取得して、helpers.bulk()関数でデータをアップロードします。一回ごとの上限アップロード数があるので、気を付けてください。

# ElasticSearchでの検索

## SearchAPI

ElasticSearchには便利な RestAPI が用意されています。ここでは SearchAPI の "more like this" クエリを利用します。

> https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html

> https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html

```
curl -X GET "localhost:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
    "query": {
        "more_like_this" : {
            "fields" : ["title", "description"],
            "like" : "Once upon a time",
            "min_term_freq" : 1,
            "max_query_terms" : 12
        }
    }
}
'

```

使い方としては、"like" のところに分類したいメールテキストを入れて、そのメールテキストと最も似ている現在ElasticSearchに保存されているメールとそのカテゴリを探します。  
pythonで書くと、以下のようになります。

```python
def mlt_query(text):
    url = root + '_search'
    paydata = {
        "query": {
            "more_like_this": {
                "fields": ["Message", "Category"],
                "like": text,
                "min_term_freq": 1,
                "max_query_terms": 20
            }
        }
    }
    paydata = json.dumps(paydata)
    r = requests.get(url=url, data=paydata, headers=header)
    return r.json()
```
ここで検索されたデータ(類似してるものから最大20個)を返すようになります。
返した結果にはそれぞれカテゴリー以外にスコアという指標があります。スコアが高いほど似ている事を意味します。

## スコアでのソート

スコアについてソートするためのアルゴリズムを考える必要があります。
今回はカテゴリー毎の合計スコアが高い方を推定カテゴリーと決めます。(他にもカテゴリー毎のスコア平均などを使うこともあります。テキストの種類・性質に合わせて選んでください。)
そのコードは以下の通りになります。

```python
def get_most_like_category(text):
    categories = {}
    response = mlt_query(text)
    for hit in response['hits']['hits']:
        score = hit['_score']
        category = hit['_source']['Category']
        if category not in categories.keys():
            categories[category] = score
        else:
            categories[category] += score
    if len(categories) > 0:
        sorted_category = sorted(categories.items(), key=itemgetter(1), reverse=True)
        category_result = sorted_category[0][0]   
        return category_result
    else: 
        return "Null"
```

もし何も返してこなかった場合(ここでは Null を返した場合)は、分類したいメールテキストと似ているメールが見つからないことを意味します。これはデータが足りないことが一つの原因かもしれませんので、ElasticSearchに保存するメールを増やすなどの対策をしてください。

# APIの作成(HTTP GET)

今回Flaskを使って、WebApiを作成します。Flaskの詳細はここ書かないので、もし興味があれば、以下のページを参考してください。

```python
from flask import Flask, request
from model.classify import get_most_like_category
app = Flask(__name__)

@app.route('/')
def index():
    text = request.form['text']
    category = get_most_like_category(text)
    return category
```

> https://flask.palletsprojects.com/en/1.1.x/


# 実行

flaskをlocal上で起動して、以下のcommandを入力します。

```sh
export FLASK_APP=main.py
flask run
```

main.pyはAPI作成部分のコードファイルです。
起動成功したら、* Running on http://127.0.0.1:5000/ が表示されます。

そして、Postmanを起動して、以下のテスト用テキストを貼り付けてみます。


* ・テスト用テキスト

```
Wanna have a laugh? Try CHIT-CHAT on your mobile now! Logon by txting the word: CHAT and send it to No: 8883 CM PO Box 4217 London W1A 6ZF 16+ 118p/msg rcvd
```

結果、Spamとして分類してくれました。

![分類結果](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Elasticsearch/Elasticsearch_images_26006613646127600/20201028134827.png "分類結果")

# 最後に

今回は ElasticSearch を使ったスパムメールのテキスト分類をやってみました。今回は結構簡単なタスクを扱いましたが、これ以外にもテキスト分類で解決できる課題はいろいろとあります。もし本記事をご覧になって「自然言語・ElasticSearch」にちょっとでも興味が湧いてくるなら嬉しいです。



