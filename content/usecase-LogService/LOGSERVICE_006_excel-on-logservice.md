---
title: "SDKでExcelデータを収集"
metaTitle: "SDKでExcelデータを収集するLogService"
metaDescription: "SDKでExcelデータを収集するLogService"
date: "2020-12-30"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/LogService_images_26006613660741000/20201230152149.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## SDKでExcelデータを収集するLogService

本記事では、LogServiceを使ってSDK経由でExcelデータをLogServiceへ収集する方法を記載します。   

# 前書き
> <span style="color: #ff0000"><i>LogService は、リアルタイムデータロギングサービスです。  
ログの収集、消費、出荷、検索、および分析をサポートし、大量のログを処理および分析する能力を向上させます。</i></span>

少し前になりますが、LogServiceについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www2.slideshare.net/sbopsv/alibaba-cloud-log-service

     


今回はLogServiceのSDKを使ってAlibaba Cloud LogServiceへ収集、蓄積、可視化してみましょう。構成図で、こんな感じです。インポート作業のためのECSは不要で、ローカル環境で実施します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201230152149.png "img")

---

# プロジェクト作成（LogService全体で共通事項）

まずはプロジェクトを作成します。LogServiceコンソールから 「Create Project」を選択し、起動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201124101928.png "img")


Project Nameをここでは「techblog」にし、プロジェクトを作成します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201124102655.png "img")

その直後に "Do you want to create a Logstore for log data storage immediately?"、「Log Storeを作成しますか？」とポップアップが出ます。
Log StoreはLog Serviceでデータを蓄積するものなので、「OK」を選定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201124102805.png "img")

LogStore Nameをここでは「excel_logstore」と入力し、LogStoreを作成します。

その後、「LogStoreが作成されました。今すぐデータアクセスしますか？」とポップアップが出ますが、これは必要に応じて選定すると良いです。
ちなみに「Yes」を選択した場合、50を超える様々なデータアクセス手法のコンソールが表示されます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201124103134.png "img")


---

# データ格納について

このシナリオでは 以下の図のようにローカルにあるExcelファイルに対し、LogServiceのPython SDKを使ってExcelファイルを一括でLogServiceへ登録します。   
なぜPythonかというと以下のメリットがあります。    

1.  ExcelやOT（制御）などの各種データの解読・処理ライブラリが充実している（Excelの場合、xlrdを使うことでPythonからExcelを操作できます）
1.  データ整形や加工処理、業務の自動化が可能（OS問わずどんな環境でも実行可能）
1. Webデータとのやり取りがしやすい（Beautiful SoupやSelenium、RestAPIなどを通じて、どんなwebアプリケーションでも連携することができる）


Pythonがあれば何でもできます。特にLogServiceのPython SDKと組み合わせれば、基本的には何でもできます。     
本題にはいります。      
今回はローカルのExcelファイルに対し、ローカルのPythonファイルで読み取り、LogServiceへ登録してみます。Excelファイルがテーブル形式でなくても、統一したフォーマットであることがポイントです。    


## STEP1: Excelファイルのデータのインポート＆LogServiceへの格納ソースコード作成

以下のPythonソースコードを作成します。      
今回、ExcelファイルはVBAでも.NetでもGoでもNode.jsでもPythonでもなんでも良いですが、可読性とすぐ処理できるスピードを重視してPythonで書いてみました。     
[xlrdライブラリ](https://xlrd.readthedocs.io/en/latest/) を使います。      

```
#!/usr/bin/env python
# -*- coding: utf-8 -*-

# pip3 install xlrd
# pip3 install -U aliyun-log-python-sdk

import os
import xlrd
from aliyun.log.logitem import LogItem
from aliyun.log.logclient import LogClient
from aliyun.log.putlogsrequest import PutLogsRequest


# define（変数設定） 
# Excelフォーマットからインポートしたい箇所を定義します
sheet_name = "情報書"
cell01_row = 4 ; cell01_col = 6 ; cell01_fieldname = "発行日" # 発行日 
cell02_row = 8 ; cell02_col = 3 ; cell02_fieldname = "局番" # 局番
cell03_row = 8 ; cell03_col = 6 ; cell03_fieldname = "局名" # 局名
cell04_row = 9 ; cell04_col = 2 ; cell04_fieldname = "所在地" # 所在地
cell05_row = 10 ; cell05_col = 2 ; cell05_fieldname = "建物名" # 建物名
cell06_row = 11 ; cell06_col = 2 ; cell06_fieldname = "店舗名称等" # 店舗名称等
cell07_row = 12 ; cell07_col = 3 ; cell07_fieldname = "施工会社・会社名" # 施工会社・会社名
cell08_row = 13 ; cell08_col = 3 ; cell08_fieldname = "施工会社・担当者" # 施工会社・担当者
cell09_row = 15 ; cell09_col = 2 ; cell09_fieldname = "無線機設置日" # 無線機設置日
cell10_row = 16 ; cell10_col = 3 ; cell10_fieldname = "Down Link" # Down Link
cell11_row = 17 ; cell11_col = 3 ; cell11_fieldname = "Up Link" # Up Link
cell12_row = 18 ; cell12_col = 2 ; cell12_fieldname = "スクランブルコード（SC）" # スクランブルコード（SC）

ENDPOINT = 'ap-northeast-1.log.aliyuncs.com'
ACCESSKEYID = '<your ACCESSKEYID >'
ACCESSKEY = '<your ACCESSKEY >'
PROJECT = 'tecblog'
LOGSTORE = 'excel_logstore'
TOKEN = ""
topic = '情報書ファイル一括インポート'
source = '10.137.53.103'

client = LogClient(ENDPOINT, ACCESSKEYID, ACCESSKEY, TOKEN)

for root, dirs, files in os.walk(r"C:\Users\1200358\Desktop\list"):
    xlsfiles=[ _ for _ in files if _.endswith('.xls') ]
    for xlsfile in xlsfiles:
        workbook = xlrd.open_workbook(os.path.join(root,xlsfile))
        worksheet = workbook.sheet_by_name(sheet_name)
        print( worksheet.cell( cell01_row - 1 , cell01_col - 1 ).value )  

        contents = [
            ( cell01_fieldname, worksheet.cell( cell01_row - 1 , cell01_col - 1 ).value ),
            ( cell02_fieldname, worksheet.cell( cell02_row - 1 , cell02_col - 1 ).value ),
            ( cell03_fieldname, worksheet.cell( cell03_row - 1 , cell03_col - 1 ).value ),
            ( cell04_fieldname, worksheet.cell( cell04_row - 1 , cell04_col - 1 ).value ),
            ( cell05_fieldname, worksheet.cell( cell05_row - 1 , cell05_col - 1 ).value ),
            ( cell06_fieldname, worksheet.cell( cell06_row - 1 , cell06_col - 1 ).value ),
            ( cell07_fieldname, worksheet.cell( cell07_row - 1 , cell07_col - 1 ).value ),
            ( cell08_fieldname, worksheet.cell( cell08_row - 1 , cell08_col - 1 ).value ),
            ( cell09_fieldname, worksheet.cell( cell09_row - 1 , cell09_col - 1 ).value ),
            ( cell10_fieldname, worksheet.cell( cell10_row - 1 , cell10_col - 1 ).value ),
            ( cell11_fieldname, worksheet.cell( cell11_row - 1 , cell11_col - 1 ).value ),
            ( cell12_fieldname, worksheet.cell( cell12_row - 1 , cell12_col - 1 ).value ) ]

        logitemList = []
        logItem = LogItem()
        logItem.set_time(int(time.time()))
        logItem.set_contents(contents)
        logitemList.append(logItem)

        request = PutLogsRequest(PROJECT, LOGSTORE, topic, source, logitemList)
        response = client.put_logs(request)
        response.log_print()

```

説明として、以下の変数設定は Excelファイルから読み取りたい情報を定義としています。
例えば、「発行日」の水色セルを読み取りたい場合、そのセルの位置（４行目で6列目）を特定し、`cell01_row = 4 ; cell01_col = 6` として、フィールド名を `cell01_fieldname = "発行日"` として定義します。
結合セルがある場合は、最小位置のセル位置を指定すると良いです。この例、情報No を特定したい場合、8行目で3列目を指定します。    
Excelファイル（フォーマット）のSheet名は `sheet_name = "情報書"` として定義します。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201230131055.png "img")

```
# define（変数設定） 
# Excelフォーマットからインポートしたい箇所を定義します
sheet_name = "情報書"
cell01_row = 4 ; cell01_col = 6 ; cell01_fieldname = "発行日" # 発行日 
cell02_row = 8 ; cell02_col = 3 ; cell02_fieldname = "局番" # 局番
cell03_row = 8 ; cell03_col = 6 ; cell03_fieldname = "局名" # 局名
cell04_row = 9 ; cell04_col = 2 ; cell04_fieldname = "所在地" # 所在地
cell05_row = 10 ; cell05_col = 2 ; cell05_fieldname = "建物名" # 建物名
cell06_row = 11 ; cell06_col = 2 ; cell06_fieldname = "店舗名称等" # 店舗名称等
cell07_row = 12 ; cell07_col = 3 ; cell07_fieldname = "施工会社・会社名" # 施工会社・会社名
cell08_row = 13 ; cell08_col = 3 ; cell08_fieldname = "施工会社・担当者" # 施工会社・担当者
cell09_row = 15 ; cell09_col = 2 ; cell09_fieldname = "無線機設置日" # 無線機設置日
cell10_row = 16 ; cell10_col = 3 ; cell10_fieldname = "Down Link" # Down Link
cell11_row = 17 ; cell11_col = 3 ; cell11_fieldname = "Up Link" # Up Link
cell12_row = 18 ; cell12_col = 2 ; cell12_fieldname = "スクランブルコード（SC）" # スクランブルコード（SC）
```

（C++のように#defineら変数がPythonで使えないのはつらい、、他ファイルから参照ベースだけど、もっとCoolに書ける方法があったと思う。著者とほほです）     


続いて、以下のコードは、listというディレクトリ配下に大量のExcelファイル（統一したフォーマット）を順次読み取って、一括リストアップします。     

```
for root, dirs, files in os.walk(r"C:\Users\1200358\Desktop\list"):
    xlsfiles=[ _ for _ in files if _.endswith('.xls') ]
    for xlsfile in xlsfiles:
        workbook = xlrd.open_workbook(os.path.join(root,xlsfile))
        worksheet = workbook.sheet_by_name(sheet_name)
        print( worksheet.cell( cell01_row - 1 , cell01_col - 1 ).value ) 
```



---

## STEP2:  実行

あとは実行するだけです。会社によってはクラウドサービスなどNWアクセスが禁止されてる場合や、個人情報を懸念してる場合でも、このようにローカルで処理し登録するといったこの方法は有効です。（上記のサンプルは例として説明のために個人情報が含まれていますが、ここは任意で抽出すれば良いです）       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201230132758.png "img")


---

## おまけ：写真データのOCR処理

blog記事でスペースが余ったので、おまけです。    
余談ですが、本件blogにて、ローカルにある写真データをtesseract-ocrによるOCRとして読み取って、大量のデータをLogServiceへ格納する方法も記載予定でした。これもPythonによる恩恵です。    
しかし目的が『写真データにある文字を認識し、データをAlibaba Cloud側へ登録する』というのであれば、FunctionCompute - OSS or HBase or Cassandra連携が後継処理の面でベストなので没となりました。   

なので、手法だけでも残してみます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201229161047.png "img")

今回のシナリオはスキャンされた免許証から、「氏名」と「免許証番号」だけを読み取って、その情報だけをLogServiceへ格納したい。ただし個人情報には最大限気を付けたい。
その場合は免許証のデータをクラウドら外部へ展開せず、ローカルでデータを処理し必要なデータだけを送る、ということが出来ます。
流れとしては、①免許証から、必要な枠だけを取り出す（前処理） ②tesseract-ocrで読み取る ③LogServiceへ登録する　です。

Tesseract-ocrはオープンソースのテキスト認識エンジン（OCR）です。Pythonを含めた多くのプログラミング言語およびフレームワークとの互換性があります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201230140951.png "img")

特に最近でたバージョン4.00からは、テキスト行認識機能として、ニュートラルネットワーク（CNN）サブシステムとしてTensorFlowでも使用できるVariable Graph Specification Language（VGSL）がC++として実装されています。つまり、通常のOCRは文字を認識するのに処理速度が遅くなる課題がありましたが、この機能により早い段階で処理することが出来るようになりました。（Tesseract-ocr側にてC++によるLSTMリカレントニューラルネットワークモデルが実装されているため。再トレーニングなど他にもいろいろありますが、ここでは割愛します。）     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201230141648.png "img")

> https://github.com/tesseract-ocr/

閑話休題、実装します。まずは前処理からOCRをします。   
```
import numpy as np
import cv2
import imutils 
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

png= cv2.imread('cat01.png')

# BGR から HSV 色空間への変換
hsv = cv2.cvtColor(png, cv2.COLOR_BGR2HSV)

# 彩度のカラーチャンネルを取得。灰色のpixelはすべてゼロなので、色付きのピクセルはゼロ以上となります
s = hsv[:, :, 1]

# cv2の自動閾値を使って、バイナリに変換
ret, threshold_result = cv2.threshold(s, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

# ずれがないか、輪郭を探す
contours = cv2.findContours(threshold_result , cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
contours = imutils.grab_contours(contours )

# 輪郭で、最大面積を取得
maxarea = max(contours , key=cv2.contourArea)

# 外接矩形を取得
x, y, w, h = cv2.boundingRect(maxarea)

#はみ出てる部分を除外
result= threshold_result [y:y+h, x:x+w].copy()

# OCRする
result_text = pytesseract.image_to_string(result)
print(f"OCR Results:\n {result_text}")

# 以降はその結果を整理し、必要に応じて加工抽出処理し、LogService SDKを使ってLogStoreへ格納する
（省略）

```

この前処理によって抽出したOCR結果（result_text）から、「氏名」と「免許証番号」だけを抽出し、LogServiceへ登録します。（ここでは上記のやり方と被るため、割愛します。）        

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201230135811.png "img")


個人情報に委縮することもなく、なおかつ写真データでもスムーズに処理することができます。    
もちろん、手書きの帳票タイプでも対応しています。著者は字が汚いですが、ほぼ高い精度で無事読み取ることもできました。      
処理基盤はローカルPCとLogServiceなので、料金はLogSericeだけで済みます。10円もかからないし、すぐ済みます。Tesseract OCR処理のためのGPU環境とかは不要です。           

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201230144452.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201230144345.png "img")


参考になった記事：

> https://qiita.com/aki_abekawa/items/418e069038fbdb77c59e

> https://qiita.com/aki_abekawa/items/c2b94187f2ba7dc56993



---

# 最後に

LogServiceのSDKを使って、Excelデータを収集する方法を簡単に説明しました。     
これにより、個人情報やExcelデータでも気にすることなく、シームレスに可視化することが出来ます。     

LogServiceはフルマネージド環境でありながら、様々なデータを収集し蓄積・可視化する事が可能です。    
加えて、データ量や使い方に応じた課金なので、使い方次第ではコスト削減や、運用負荷の改善に効果があるのでは無いでしょうか。

<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>




