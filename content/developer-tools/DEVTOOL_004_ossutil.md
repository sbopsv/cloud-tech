---
title: "ossutil"
metaTitle: "Alibab Cloud ossutilについて紹介します"
metaDescription: "Alibab Cloud ossutilについて紹介します"
date: "2021-06-28"
author: "Nancy"
thumbnail: "/developer-tools_images_04/23_Linux_download_file_02.png"
---


## ossutilの手順

本書は、ossutilの使用手順を記載します。    


# 1.ossutilとは
## 1-1.ossutilとは
1）ossutilは、コマンドラインでOSSデータを管理するツールです。ストレージスペース（バケット）およびファイル（オブジェクト）に対し、便利で簡潔かつ豊富な管理コマンドを提供しています。

ossutilは下記機能を提供します。

①バケットの管理　例えば：バケットの作成、リスト、削除など。

②オブジェクトの管理　例えば：オブジェクトのアップロード、ダウンロード、リスト、コピー、削除など。

③フラグメント（パーツ）の管理　例えば：パーツのリストや削除など。

2）コマンドリスト

|コマンド名|説明|　
|--|--|
|[appendfromfile](https://www.alibabacloud.com/cloud-tech/doc-detail/120069.htm?spm=a2c63.p38356.879954.5.6f6565d0rdCEnL#concept-303823)|ローカルファイル内容を追加アップロードの方法でOSSのappendable Objectにアップロードする|
|[bucket-encryption](https://www.alibabacloud.com/cloud-tech/doc-detail/120307.htm?spm=a2c63.p38356.879954.6.6f6565d0rdCEnL#concept-354612)|追加、変更、照会、または削除バケットの暗号化構成|
|[bucket-policy](https://www.alibabacloud.com/cloud-tech/doc-detail/129733.htm?spm=a2c63.p38356.879954.7.6f6565d0rdCEnL#concept-1614438)|追加、変更、照会、または削除バケットのポリシー構成|
|[bucket-tagging](https://www.alibabacloud.com/cloud-tech/doc-detail/120305.htm?spm=a2c63.p38356.879954.8.6f6565d0rdCEnL#concept-354610)|追加、変更、照会、または削除バケットのラベル構成|
|[bucket-versioning](https://www.alibabacloud.com/cloud-tech/doc-detail/121686.htm?spm=a2c63.p38356.879954.9.6f6565d0rdCEnL#concept-610185)|追加または照会バケットのバージョンコントロール構成|
|[cat](https://www.alibabacloud.com/cloud-tech/doc-detail/120070.htm?spm=a2c63.p38356.879954.10.6f6565d0rdCEnL#concept-303824)|テキストの内容をossutilに出力する|
|[config](https://www.alibabacloud.com/cloud-tech/doc-detail/120072.htm?spm=a2c63.p38356.879954.11.6f6565d0rdCEnL#concept-303826)|OSSアクセス情報を保存するための構成ファイルを作成します|
|[cors](https://www.alibabacloud.com/cloud-tech/doc-detail/120063.htm?spm=a2c63.p38356.879954.12.6f6565d0rdCEnL#concept-303816)|追加、変更、照会、または削除バケットのCORS構成|
|[cors-options](https://www.alibabacloud.com/cloud-tech/doc-detail/122573.htm?spm=a2c63.p38356.879954.13.6f6565d0rdCEnL#concept-744986)|Bucketが指定されたクロスドメインアクセスリクエストを許可するかをテストするために使用される|
|[cp](https://www.alibabacloud.com/cloud-tech/doc-detail/120057.htm?spm=a2c63.p38356.879954.14.6f6565d0rdCEnL#concept-303810)|ファイルのアップロード、ダウンロード、コピーに使用される|
|[create-symlink](https://www.alibabacloud.com/cloud-tech/doc-detail/120059.htm?spm=a2c63.p38356.879954.15.6f6565d0rdCEnL#concept-303812)|シンボルリンクの作成（ソフトリンク）|
|[du](https://www.alibabacloud.com/cloud-tech/doc-detail/129732.htm?spm=a2c63.p38356.879954.16.6f6565d0rdCEnL#concept-1614437)|指定のバケットオブジェクトまたはファイルディレクトリのストレージサイズを取得するために使用される|
|[getallpartsize](https://www.alibabacloud.com/cloud-tech/doc-detail/120068.htm?spm=a2c63.p38356.879954.17.6f6565d0rdCEnL#concept-303821)|バケット内すべてアップロード未完成のMultipartタスクの各シャードサイズとシャード合計サイズを取得する|
|[hash](https://www.alibabacloud.com/cloud-tech/doc-detail/120073.htm?spm=a2c63.p38356.879954.18.6f6565d0rdCEnL#concept-303827)|ローカルファイルのCRC64またはMD5を計算するために使用される|
|[help](https://www.alibabacloud.com/cloud-tech/doc-detail/120071.htm?spm=a2c63.p38356.879954.19.6f6565d0rdCEnL#concept-303825)|コマンドのヘルプ情報を取得するコマンド|
|[inventory](https://www.alibabacloud.com/cloud-tech/doc-detail/163935.htm?spm=a2c63.p38356.879954.20.6f6565d0rdCEnL#concept-2483196)|追加、照会、リストまたは削除バケットのリストルール|
|[lifecycle](https://www.alibabacloud.com/cloud-tech/doc-detail/122574.htm?spm=a2c63.p38356.879954.21.6f6565d0rdCEnL#concept-744987)|ライフサイクルルールを追加、変更、照会、または削除するコマンド|
|[listpart](https://www.alibabacloud.com/cloud-tech/doc-detail/120067.htm?spm=a2c63.p38356.879954.22.6f6565d0rdCEnL#concept-303820)|シャードアップロードを完了していないオブジェクトのフラグメント情報を表示する|
|[logging](https://www.alibabacloud.com/cloud-tech/doc-detail/120065.htm?spm=a2c63.p38356.879954.23.6f6565d0rdCEnL#concept-303818)|追加、変更、照会、または削除バケットのログ管理構成|
|[ls](https://www.alibabacloud.com/cloud-tech/doc-detail/120052.htm?spm=a2c63.p38356.879954.24.6f6565d0rdCEnL#concept-303804)|Bucket、ObjectとPartのリスト|
|[mb](https://www.alibabacloud.com/cloud-tech/doc-detail/120051.htm?spm=a2c63.p38356.879954.25.6f6565d0rdCEnL#concept-303803)|バケットの作成|
|[mkdir](https://www.alibabacloud.com/cloud-tech/doc-detail/120062.htm?spm=a2c63.p38356.879954.26.6f6565d0rdCEnL#concept-303815)|Bucketにフォルダを作成する|
|[object-tagging](https://www.alibabacloud.com/cloud-tech/doc-detail/129735.htm?spm=a2c63.p38356.879954.27.6f6565d0rdCEnL#concept-1614441)|追加、変更、照会、または削除オブジェクトのラベル構成|
|[probe](https://www.alibabacloud.com/cloud-tech/doc-detail/120061.htm?spm=a2c63.p38356.879954.28.6f6565d0rdCEnL#concept-303814)|ネットワーク故障またはパラメータ設定による問題の検証コマンド|
|[read-symlink](https://www.alibabacloud.com/cloud-tech/doc-detail/120060.htm?spm=a2c63.p38356.879954.29.6f6565d0rdCEnL#concept-303813)|シンボルリンク（ソフトリンク）ファイルの情報を取得する|
|[referer](https://www.alibabacloud.com/cloud-tech/doc-detail/120066.htm?spm=a2c63.p38356.879954.30.6f6565d0rdCEnL#concept-303819)|追加、変更、照会、または削除バケットのreferer構成|
|[restore](https://www.alibabacloud.com/cloud-tech/doc-detail/120058.htm?spm=a2c63.p38356.879954.31.6f6565d0rdCEnL#concept-303811)|凍結されたオブジェクトを読み取り可能な状態に復元する|
|[request-payment](https://www.alibabacloud.com/cloud-tech/doc-detail/129734.htm?spm=a2c63.p38356.879954.32.6f6565d0rdCEnL#concept-1614439)|Bucketのリクエスター支払いモード構成を設定または照会する|
|[revert-versioning](https://www.alibabacloud.com/cloud-tech/doc-detail/171787.htm?spm=a2c63.p38356.879954.33.6f6565d0rdCEnL#concept-2541372)|バージョン管理が有効になるバケットにファイルを最新バージョンに復元するために、オブジェクトの削除ステータスIS-LATESTの属性がtrueの削除フラグを削除するために使用される|
|[rm](https://www.alibabacloud.com/cloud-tech/doc-detail/120053.htm?spm=a2c63.p38356.879954.34.6f6565d0rdCEnL#concept-303805)|Bucket、ObjectとPartの削除|
|[set-acl](https://www.alibabacloud.com/cloud-tech/doc-detail/120055.htm?spm=a2c63.p38356.879954.35.6f6565d0rdCEnL#concept-303807)|BucketまたはObjectのACLを設定する|
|[set-meta](https://www.alibabacloud.com/cloud-tech/doc-detail/120056.htm?spm=a2c63.p38356.879954.36.6f6565d0rdCEnL#concept-303809)|アップロード済みのオブジェクトのメタデータを設定する|
|[sign](https://www.alibabacloud.com/cloud-tech/doc-detail/120064.htm?spm=a2c63.p38356.879954.37.6f6565d0rdCEnL#concept-303817)|サードパーティユーザがバケット内のオブジェクトにアクセスする用の署名付きURLを生成するために使用される|
|[stat](https://www.alibabacloud.com/cloud-tech/doc-detail/120054.htm?spm=a2c63.p38356.879954.38.6f6565d0rdCEnL#concept-303806)|指定されたバケットまたはオブジェクトの説明情報を取得する|
|[update](https://www.alibabacloud.com/cloud-tech/doc-detail/120074.htm?spm=a2c63.p38356.879954.39.6f6565d0rdCEnL#concept-303828)|ossutilのバージョンを更新する|
|[website](https://www.alibabacloud.com/cloud-tech/doc-detail/122575.htm?spm=a2c63.p38356.879954.40.6f6565d0rdCEnL#concept-744988)|追加、変更、照会、または削除バケットのWebサイトホスティング構成、リダイレクト構成、ソースにミラーバック|

## 1-2.ossutilのダウンロードリンク
ossutilは、Windows、Linux、macOSなどの環境でサポートしています。実際の環境に応じて、適切なバージョンをダウンロードしてインストールできます。

1）ダウンロードリンク
Windows/Linux/macOS環境、x86（32bit、64bit）、ARM（32bit、64bit）アーキテクチャをサポートします
|ossutilダウンロードリンク|バージョン|
|--|--|
|[Linux x86 32bit](https://gosspublic.alicdn.com/ossutil/1.7.3/ossutil32?spm=a2c63.p38356.879954.5.5c453782aj8tRN)|1.7.3|
|[Linux x86 64bit](https://gosspublic.alicdn.com/ossutil/1.7.3/ossutil64?spm=a2c63.p38356.879954.6.5c453782aj8tRN)|1.7.3|
|[Windows x86 32bit](https://gosspublic.alicdn.com/ossutil/1.7.3/ossutil32.zip?spm=a2c63.p38356.879954.7.5c453782aj8tRN&file=ossutil32.zip)|1.7.3|
|[Windows x86 64bit](https://gosspublic.alicdn.com/ossutil/1.7.3/ossutil64.zip?spm=a2c63.p38356.879954.8.5c453782aj8tRN&file=ossutil64.zip)|1.7.3|
|[macOS x86 32bit](https://gosspublic.alicdn.com/ossutil/1.7.3/ossutilmac32?spm=a2c63.p38356.879954.9.5c453782aj8tRN)|1.7.3|
|[macOS x86 64bit](https://gosspublic.alicdn.com/ossutil/1.7.3/ossutilmac64?spm=a2c63.p38356.879954.10.5c453782aj8tRN)|1.7.3|
|[ARM 32bit](https://gosspublic.alicdn.com/ossutil/1.7.3/ossutilarm32?spm=a2c63.p38356.879954.11.5c453782aj8tRN)|1.7.3|
|[ARM 64bit](https://gosspublic.alicdn.com/ossutil/1.7.3/ossutilarm64?spm=a2c63.p38356.879954.12.5c453782aj8tRN)|1.7.3|

# 2.Windowsで64bitのossutilを紹介します
## 2-1.Windowsで64bitのossutilをインストールします
1）ossutilをダウンロードします
①下記リンクでossutilをダウンロードします
[Windows x86 64bit](https://gosspublic.alicdn.com/ossutil/1.7.3/ossutil64.zip?spm=a2c63.p38356.879954.8.5c453782aj8tRN&file=ossutil64.zip)

 ![win download ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/01_win_download_01.png "win download 01")

②Zipファイルを解凍します
 ![win download ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/01_win_download_02.png "win download 02")

2）ossutilを設定します
①ossutil.batをダブルクリックして実行します
 ![win ossutil ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/02_win_ossutil_run_01.png "win ossutil 01")

 ![win ossutil ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/02_win_ossutil_run_02.png "win ossutil 02")

②下記コマンドを実行し、configファイルを設定します
```
#ossutil64.exe config
```
 ![win ossutil config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/03_win_ossutil_config_01.png "win ossutil config 01")


|Config設定|値|備考|
|--|--|
|保存ファイル名とパス|なし|デフォルト：C:\\Users\Nancy\.ossutilconfig|
|Language|EN|デフォルトはCN|
|Endpoint|https://oss-ap-northeast-1.aliyuncs.com|[参照リンク](https://www.alibabacloud.com/cloud-tech/doc-detail/31837.htm?spm=a2c63.p38356.b99.57.59cc422dhkPYps)|
|accessKeyID|LT************************KwQ|[accessKeyIDを設定](https://www.alibabacloud.com/cloud-tech/doc-detail/53045.htm?spm=a2c63.p38356.879954.14.65d33782KrI9A4#task968)|
|accessKeySecret|e************************VU|[accessKeySecretを設定](https://www.alibabacloud.com/cloud-tech/doc-detail/53045.htm?spm=a2c63.p38356.879954.14.65d33782KrI9A4#task968)|
|stsToken|なし|[stsToken方法](https://www.alibabacloud.com/cloud-tech/doc-detail/100624.htm?spm=a2c63.p38356.879954.15.65d33782KrI9A4#concept-xzh-nzk-2gb)|
[Config設定方法](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/120072.htm?spm=a2c63.p38356.879954.17.65d33782KrI9A4#concept-303826)をご参照ください

 ![win ossutil config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/03_win_ossutil_config_02.png "win ossutil config 02")

③configファイルがデフォルトのパス「C:\\Users\Nancy\.ossutilconfig」に作成される
 ![win ossutil config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/03_win_ossutil_config_03.png "win ossutil config 03")

④configファイルを確認します
 ![win ossutil config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/03_win_ossutil_config_04.png "win ossutil config 04")

##　2-2.Windowsでossutilのコマンドを実行します
###　2-2-1.mb―バケットを作成します
①コマンドフォーマット
```
./ossutil64 mb oss://bucketname [--acl <value>][--storage-class <value>][--redundancy-type <value>]
```

②ossutil64.exeのフォルダでCMDを開き、下記のコマンドを実行します
```
ossutil64 mb oss://winbucket202106
```
 ![win create bucket ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/04_win_create_bucket_01.png "win create bucket 01")

レスポンス：
```
1.030347(s) elapsed
```

③コンソール画面にバケットを確認します
 ![win create bucket ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/04_win_create_bucket_02.png "win create bucket 02")

###　2-2-2.mkdir―ディレクトリを作成します

コマンドフォーマット
```
./ossutil64 mkdir oss://bucketname dirname [--encoding-type <value>]
```
1）単一レベルのディレクトリを作成します

①下記のコマンドを実行します

```
ossutil64 mkdir oss://winbucket202106/winfolder
```
 ![win create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/05_win_create_folder_01.png "win create folder 01")
レスポンス：
```
0.416390(s) elapsed
```

②コンソール画面にディレクトリを確認します
 ![win create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/05_win_create_folder_02.png "win create folder 02")

 ![win create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/05_win_create_folder_03.png "win create folder 03")

2）マルチレベルディレクトリを作成します

①下記のコマンドを実行します

```
ossutil64 mkdir oss://winbucket202106/winmultifolder/2021/06
```
 ![win create multi-folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/06_win_create_folder_01.png "win create multi-folder 01")

レスポンス：
```
0.369116(s) elapsed
```
②コンソール画面にバディレクトリを確認します
 ![win create folder  ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/06_win_create_folder_02.png "win create multi-folder  02")
 ![win create folder  ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/06_win_create_folder_03.png "win create multi-folder  03")
 ![win create folder  ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/06_win_create_folder_04.png "win create multi-folder  04")
 ![win create folder  ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/06_win_create_folder_05.png "win create multi-folder  05")


###　2-2-3.cp―ファイルをアップロードします
1）コマンドフォーマット
```
./ossutil cp file_url cloud_url  [-r] [-f] [-u] [--enable-symlink-dir] [--disable-all-symlink] [--only-current-dir] [--output-dir=odir] [--bigfile-threshold=size] [--checkpoint-dir=cdir] [--snapshot-path=sdir] [--payer requester] [--tagging]
```
説明：
file_url：ローカルパスである。Linuxシステムのファイルパス　/localfolder/examplefile.txt、Windowsシステムのファイルパス　D:\localfolder\examplefile.txt
cloud_url：OSSのファイルパス，フォーマットはoss://bucketname/objectname、例：oss://examplebucket/examplefile.txt

・cpコマンドでファイルをアップロードする際に、デフォルトでシャードアップロードと中断後継続アップロードの方法を使います。ユーザーの原因でアップロードが中断された場合、パートのファイルはOSSに保存され、費用もかかるため、必要でない場合、削除してください。rmコマンドまたはライフサイクルの設定で削除できます。
・cpコマンドを使用してローカルファイルまたはフォルダーをOSSにアップロードします

2）単一ファイルをアップロードします

アップロードの際に、file名が指定しない場合、ローカルファイル名でアップロードする。指定する場合、指定されたファイル名としてアップロードします
①ローカルファイルを用意します
```
F:\ossutil64\example.txt
```
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/07_win_upload_file_01.png "win upload file  01")
②ターゲットOSSパス
```
oss://winbucket202106/winfolder/
```
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/07_win_upload_file_02.png "win upload file  02")
③下記のコマンドを実行します

```
ossutil64 cp F:\ossutil64\example.txt oss://winbucket202106/winfolder/
```
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/07_win_upload_file_03.png "win upload file  03")

レスポンス：
```
F:\ossutil64>ossutil64 cp F:\ossutil64\example.txt oss://winbucket202106/winfolder/
Succeed: Total num: 1, size: 27. OK num: 1(upload 1 files).

average speed 0(byte/s)

0.442846(s) elapsed
```
④ファイルを確認します
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/07_win_upload_file_04.png "win upload file 04")


3）フォルダ内のファイルのみをアップロードします
①ローカルファイルを用意します
```
F:\ossutil64\folder2\example.txt
```
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/08_win_upload_file_01.png "win upload file 01")
②ターゲットOSSパス
```
oss://winbucket202106/winmultifolder/
```
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/08_win_upload_file_02.png "win upload file 02")

③下記のコマンドを実行します

```
ossutil64 cp folder2/ -r oss://winbucket202106/winmultifolder/
```

 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/08_win_upload_file_03.png "win upload file 03")

レスポンス：
```
F:\ossutil64>ossutil64 cp folder2/ -r oss://winbucket202106/winmultifolder/
Succeed: Total num: 1, size: 27. OK num: 1(upload 1 files).

average speed 0(byte/s)

0.425603(s) elapsed
```

④ファイルを確認します
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/08_win_upload_file_04.png "win upload file 04")


4）フォルダおよびフォルダ内のファイルをアップロードします

①ローカルファイルを用意します
```
F:\ossutil64\uploadtest\folder2\example.txt
F:\ossutil64\uploadtest\folder2\example1.txt
F:\ossutil64\uploadtest\folder2\ossutil64.exe
```
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/09_win_upload_file_01.png "win upload file 01")
②ターゲットOSSパス
```
oss://winbucket202106/winmultifolder/2021/
```
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/09_win_upload_file_02.png "win upload file 02")

③下記のコマンドを実行します

```
ossutil64 cp uploadtest/folder2/ -r oss://winbucket202106/winmultifolder/2021/folder2/
```
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/09_win_upload_file_03.png "win upload file 03")

レスポンス：
```
F:\ossutil64>ossutil64 cp uploadtest/folder2/ -r oss://winbucket202106/winmultifolder/2021/folder2/
Total num: 3, size: 10,295,862. Dealed num: 2(upload 2 files), OK size: 6,467,638, Progress: 62.818%, Speed: 1263.21KB/s                                                                                                                        Succeed: Total num: 3, size: 10,295,862. OK num: 3(upload 3 files).

average speed 1284000(byte/s)

8.026794(s) elapsed

F:\ossutil64>
```

④ファイルを確認します
 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/09_win_upload_file_04.png "win upload file 04")

 ![win upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/09_win_upload_file_05.png "win upload file 05")


###　2-2-4.cp―ファイルをダウンロードします
1）コマンドフォーマット
```
./ossutil cp cloud_url file_url  [-r] [-f] [-u] [--only-current-dir] [--output-dir=odir] [--bigfile-threshold=size] [--checkpoint-dir=cdir] [--range=x-y] [--payer requester] [--version-id versionId]
```
2）
①OSSファイル
 ![win download file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/10_win_download_file_01.png "win download file 01")

②下記のコマンドを実行します
```
ossutil64 cp  -r oss://winbucket202106/winmultifolder/2021/folder2/ download/
```
 ![win download file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/10_win_download_file_02.png "win download file 02")
レスポンス
```
F:\ossutil64>ossutil64 cp  -r oss://winbucket202106/winmultifolder/2021/folder2/  /download/
Succeed: Total num: 3, size: 10,295,862. OK num: 3(download 3 objects).

average speed 81000(byte/s)

126.788321(s) elapsed

F:\ossutil64>ossutil64 cp  -r oss://winbucket202106/winmultifolder/2021/folder2/ download/
Succeed: Total num: 3, size: 10,295,862. OK num: 3(download 3 objects).

average speed 116000(byte/s)

88.682866(s) elapsed
```

③ファイルを確認します
 ![win download file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/10_win_download_file_03.png "win download file 03")

###　2-2-5.cp―ファイルをコピーします
1）コマンドフォーマット
```
./ossutil cp cloud_url cloud_url [-r] [-f] [-u] [--only-current-dir] [--output-dir=odir] [--bigfile-threshold=size] [--checkpoint-dir=cdir] [--payer requester] [--version-id versionId] [--tagging]
```
2）ファイルをコピーします
①コピー元ファイルを確認します
 ![win copy file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/11_win_copy_file_01.png "win copy file 01")

②コピー先を確認します
 ![win copy file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/11_win_copy_file_02.png "win copy file 02")

③下記のコマンドを実行します
```
ossutil64 cp oss://winbucket202106/winmultifolder/2021/folder2/  oss://winbucket202106/winmultifolder/2021/06/ -r
```
 ![win copy file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/11_win_copy_file_03.png "win copy file 03")
レスポンス
```
F:\ossutil64>ossutil64 cp oss://winbucket202106/winmultifolder/2021/folder2/  oss://winbucket202106/winmultifolder/2021/06/ -r
Succeed: Total num: 3, size: 10,295,862. OK num: 3(copy 3 objects).

average speed 10064000(byte/s)

1.035505(s) elapsed

F:\ossutil64>

```
④ファイルを確認します
 ![win copy file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/11_win_copy_file_04.png "win copy file 04")

###　2-2-6.rm-ファイルを削除します

1）コマンドフォーマット
```
./ossutil64 rm oss://bucketname[/prefix]
[-r，--recursive]
[-b，--bucket]
[-m，--multipart]
[-a，--all-type]
[-f，--force]
[--include <value>]
[--exclude <value>]
[--version-id <value>] 
[--all-versions]
[--payer <value>]
[--encoding-type <value>]
```
2）ファイルを削除します
①ファイルを確認します
 ![win rm file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/12_win_rm_file_01.png "win rm file 01")

②rmコマンドを実行します
```
ossutil64 rm oss://winbucket202106/winmultifolder/2021/06/ -r
```
 ![win rm file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/12_win_rm_file_02.png "win rm file 02")

レスポンス
```
F:\ossutil64>ossutil64 rm oss://winbucket202106/winmultifolder/2021/06/ -r
Do you really mean to remove recursively objects of oss://winbucket202106/winmultifolder/2021/06/(y or N)? y
Succeed: Total 4 objects. Removed 4 objects.

8.829980(s) elapsed

F:\ossutil64>
```
③ファイルが削除されました
 ![win rm file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/12_win_rm_file_03.png "win rm file 03")

④フォルダも削除されました
 ![win rm file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/12_win_rm_file_04.png "win rm file 04")

# 3.Linuxで64bitのossutilを紹介します
##　3-1.Linuxで64bitのossutilをインストールします
1）Linux環境を用意します
①CentOS ECSを用意します

 ![linux ecs ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/13_linux_ecs_01.png "linux ecs 01")

 ![linux ecs ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/13_linux_ecs_02.png "linux ecs 02")

2）ossutilをダウンロードします
①下記リンクからLinuxのOSSutilをダウンロードします

 [Linux x86 64bit](https://gosspublic.alicdn.com/ossutil/1.7.3/ossutil64?spm=a2c63.p38356.879954.6.5c453782aj8tRN)

②ダウンロードする際にはspmのパラメータを削除し、下記コマンドでossutilをダウンロードします

```
#wget http://gosspublic.alicdn.com/ossutil/1.7.3/ossutil64 
```
 ![Linux download ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/14_Linux_download_01.png "Linux download 01")

②ossutil64の755権限を与える
```
#chmod 755 ossutil64
```
 ![Linux download ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/14_Linux_download_02.png "Linux download 02")

3）ossutilを設定します
①下記コマンドを実行し、configファイルを設定します
```
#./ossutil64 config
```
 ![Linux ossutil config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/15_Linux_ossutil_config_01.png "Linux ossutil config 01")

|Config設定|値|備考|
|--|--|
|保存ファイル名とパス|デフォルト|デフォルト：/root/.ossutilconfig|
|Language|EN|デフォルトはEN|
|Endpoint|https://oss-ap-northeast-1.aliyuncs.com|[参照リンク](https://www.alibabacloud.com/cloud-tech/doc-detail/31837.htm?spm=a2c63.p38356.b99.57.59cc422dhkPYps)|
|accessKeyID|LT************************KwQ|[accessKeyIDを設定](https://www.alibabacloud.com/cloud-tech/doc-detail/53045.htm?spm=a2c63.p38356.879954.14.65d33782KrI9A4#task968)|
|accessKeySecret|e************************VU|[accessKeySecretを設定](https://www.alibabacloud.com/cloud-tech/doc-detail/53045.htm?spm=a2c63.p38356.879954.14.65d33782KrI9A4#task968)|
|stsToken|なし|[stsToken方法](https://www.alibabacloud.com/cloud-tech/doc-detail/100624.htm?spm=a2c63.p38356.879954.15.65d33782KrI9A4#concept-xzh-nzk-2gb)|
[Config設定方法](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/120072.htm?spm=a2c63.p38356.879954.17.65d33782KrI9A4#concept-303826)をご参照ください

 ![Linux ossutil config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/16_Linux_ossutil_config_01.png "Linux ossutil config 02")

②configファイルがデフォルトのパス「C:\\Users\Nancy\.ossutilconfig」に作成される
 ![Linux ossutil config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/16_Linux_ossutil_config_02.png "Linux ossutil config 02")

③configファイルを確認します
 ![Linux ossutil config ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/16_Linux_ossutil_config_03.png "Linux ossutil config 03")

##　3-2.Linuxでossutilのコマンドを実行します
###　3-2-1.mb―バケットを作成します
①コマンドフォーマット
```
./ossutil64 mb oss://bucketname [--acl <value>][--storage-class <value>][--redundancy-type <value>]
```

②ossutil64.exeのフォルダでCMDを開き、下記のコマンドを実行します
```
./ossutil64 mb oss://linuxbucket202106
```
 ![Linux create bucket ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/17_Linux_create_bucket_01.png "Linux create bucket 01")

レスポンス：
```
# ./ossutil64 mb oss://linuxbucket202106
0.742198(s) elapsed

```

③コンソール画面にバケットを確認します
 ![Linux create bucket ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/17_Linux_create_bucket_02.png "Linux create bucket 02")

###　3-2-2.mkdir―ディレクトリを作成します

コマンドフォーマット
```
./ossutil64 mkdir oss://bucketname dirname [--encoding-type <value>]
```
1）単一レベルのディレクトリを作成します

①下記のコマンドを実行します

```
./ossutil64 mkdir oss://linuxbucket202106/linuxfolder
```
 ![Linux create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/18_Linux_create_folder_01.png "Linux create folder 01")
レスポンス：
```
# ./ossutil64 mkdir oss://linuxbucket202106/linuxfolder

0.052279(s) elapsed

```

②コンソール画面にディレクトリを確認します
 ![Linux create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/18_Linux_create_folder_02.png "Linux create folder 02")

 ![Linux create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/18_Linux_create_folder_03.png "Linux create folder 03")

2）マルチレベルディレクトリを作成します

①下記のコマンドを実行します

```
./ossutil64 mkdir oss://linuxbucket202106/linuxmultifolder/2021/06
```
 ![Linux create multi-folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/19_Linux_create_folder_01.png "Linux create multi-folder 01")

レスポンス：
```
./ossutil64 mkdir oss://linuxbucket202106/linuxmultifolder/2021/06

0.035308(s) elapsed

```
②コンソール画面にディレクトリを確認します
 ![Linux create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/19_Linux_create_folder_02.png "Linux create multi-folder 02")
 ![Linux create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/19_Linux_create_folder_03.png "Linux create multi-folder 03")
 ![Linux create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/19_Linux_create_folder_04.png "Linux create multi-folder 04")
 ![Linux create folder ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/19_Linux_create_folder_05.png "Linux create multi-folder 05")


###　3-2-3.cp―ファイルをアップロードします
1）コマンドフォーマット
```
./ossutil cp file_url cloud_url  [-r] [-f] [-u] [--enable-symlink-dir] [--disable-all-symlink] [--only-current-dir] [--output-dir=odir] [--bigfile-threshold=size] [--checkpoint-dir=cdir] [--snapshot-path=sdir] [--payer requester] [--tagging]
```
説明：
file_url：ローカルパスである。Linuxシステムのファイルパス　/localfolder/examplefile.txt、Windowsシステムのファイルパス　D:\localfolder\examplefile.txt
cloud_url：OSSのファイルパス，フォーマットはoss://bucketname/objectname、例：oss://examplebucket/examplefile.txt

・cpコマンドでファイルをアップロードする際に、デフォルトでシャードアップロードと中断後継続アップロードの方法を使います。ユーザーの原因でアップロードが中断された場合、パートのファイルはOSSに保存され、費用もかかるため、必要でない場合、削除してください。rmコマンドまたはライフサイクルの設定で削除できます。
・cpコマンドを使用してローカルファイルまたはフォルダーをOSSにアップロードします

2）単一ファイルをアップロードします

アップロードの際に、file名が指定しない場合、ローカルファイル名でアップロードする。指定する場合、指定されたファイル名としてアップロードします
①ローカルファイルを用意します
```
root/example.txt
```
 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/20_Linux_upload_file_01.png "Linux upload file 01")

 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/20_Linux_upload_file_02.png "Linux upload file 02")
②ターゲットOSSパス
```
oss://linuxbucket202106/linuxfolder/
```
![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/20_Linux_upload_file_03.png "Linux upload file 03")

③下記のコマンドを実行します

```
./ossutil64 cp example.txt oss://linuxbucket202106/linuxfolder/
```
 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/20_Linux_upload_file_04.png "Linux upload file 04")

レスポンス：
```
./ossutil64 cp example.txt oss://linuxbucket202106/linuxfolder/
Succeed: Total num: 1, size: 37. OK num: 1(upload 1 files).

average speed 0(byte/s)

0.053621(s) elapsed

```
④ファイルを確認します
 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/20_Linux_upload_file_05.png "Linux upload file 05")


3）フォルダ内のファイルのみをアップロードします
①ローカルファイルを用意します
```
root/folder2/example2.txt
```
 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/21_Linux_upload_file_01.png "Linux upload file 01")

 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/21_Linux_upload_file_02.png "Linux upload file 02")
②ターゲットOSSパス
```
oss://linuxbucket202106/linuxmultifolder/
```
 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/21_Linux_upload_file_03.png "Linux upload file 03")

③下記のコマンドを実行します

```
./ossutil64 cp folder2/ -r oss://linuxbucket202106/linuxmultifolder/
```

 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/21_Linux_upload_file_04.png "Linux upload file 04")

レスポンス：
```
# ./ossutil64 cp folder2/ -r oss://linuxbucket202106/linuxmultifolder/
Succeed: Total num: 1, size: 34. OK num: 1(upload 1 files).

average speed 0(byte/s)

0.061058(s) elapsed

```

④ファイルを確認します
 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/21_Linux_upload_file_05.png "Linux upload file 05")


4）フォルダおよびフォルダ内のファイルをアップロードします

①ローカルファイルを用意します
```
root/folder2/example1.txt
root/folder2/example2.txt
root/folder2/ossutil64.exe
```
 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/22_Linux_upload_file_01.png "Linux upload file 01")


②ターゲットOSSパス
```
oss://linuxbucket202106/linuxmultifolder/2021/
```
 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/22_Linux_upload_file_02.png "Linux upload file 02")

③下記のコマンドを実行します

```
#./ossutil64 cp folder2/ -r oss://linuxbucket202106/linuxmultifolder/2021/folder2/
```
 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/22_Linux_upload_file_03.png "Linux upload file 03")

レスポンス：
```
# ./ossutil64 cp folder2/ -r oss://linuxbucket202106/linuxmultifolder/2021/folder2/
Succeed: Total num: 3, size: 10,295,869. OK num: 3(upload 3 files).                                                     

average speed 705000(byte/s)

14.593219(s) elapsed

```

④ファイルを確認します
 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/22_Linux_upload_file_04.png "Linux upload file 04")

 ![Linux upload file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/22_Linux_upload_file_05.png "Linux upload file 05")


###　3-2-4.cp―ファイルをダウンロードします
1）コマンドフォーマット
```
./ossutil cp cloud_url file_url  [-r] [-f] [-u] [--only-current-dir] [--output-dir=odir] [--bigfile-threshold=size] [--checkpoint-dir=cdir] [--range=x-y] [--payer requester] [--version-id versionId]
```
2）ファイルをダウンロードします
①OSSファイル
 ![Linux download file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/23_Linux_download_file_01.png "Linux download file 01")

②Localフォルダ確認
 ![Linux download file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/23_Linux_download_file_02.png "Linux download file 02")
③下記のコマンドを実行します
```
./ossutil64 cp  -r oss://linuxbucket202106/linuxmultifolder/2021/folder2/ download/
```
 ![Linux download file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/23_Linux_download_file_03.png "Linux download file 03")
レスポンス
```
# ./ossutil64 cp  -r oss://linuxbucket202106/linuxmultifolder/2021/folder2/ download/
Succeed: Total num: 3, size: 10,295,869. OK num: 3(download 3 objects).

average speed 63949000(byte/s)

0.161218(s) elapsed

```

④ファイルを確認します
 ![Linux download file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/23_Linux_download_file_04.png "Linux download file 04")


###　3-2-5.cp―ファイルをコピーします
1）コマンドフォーマット
```
./ossutil cp cloud_url cloud_url [-r] [-f] [-u] [--only-current-dir] [--output-dir=odir] [--bigfile-threshold=size] [--checkpoint-dir=cdir] [--payer requester] [--version-id versionId] [--tagging]
```
2）ファイルをコピーします
①コピー元ファイルを確認します
 ![Linux copy file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/24_Linux_copy_file_01.png "Linux copy file 01")

②コピー先を確認します
 ![Linux copy file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/24_Linux_copy_file_02.png "Linux copy file 02")

③下記のコマンドを実行します
```
./ossutil64 cp oss://linuxbucket202106/linuxmultifolder/2021/folder2/  oss://linuxbucket202106/linuxmultifolder/2021/06/ -r
```
 ![Linux copy file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/24_Linux_copy_file_03.png "Linux copy file 03")
 
レスポンス
```
# ./ossutil64 cp oss://linuxbucket202106/linuxmultifolder/2021/folder2/  oss://linuxbucket202106/linuxmultifolder/2021/06/ -r
Succeed: Total num: 3, size: 10,295,869. OK num: 3(copy 3 objects).

average speed 48565000(byte/s)

0.212667(s) elapsed

```
④ファイルを確認します
 ![Linux copy file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/24_Linux_copy_file_04.png "Linux copy file 04")

###　3-2-6.rm-ファイルを削除します

1）コマンドフォーマット
```
./ossutil64 rm oss://bucketname[/prefix]
[-r，--recursive]
[-b，--bucket]
[-m，--multipart]
[-a，--all-type]
[-f，--force]
[--include <value>]
[--exclude <value>]
[--version-id <value>] 
[--all-versions]
[--payer <value>]
[--encoding-type <value>]
```
2）ファイルを削除します
①ファイルを確認します
 ![Linux rm file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/25_Linux_rm_file_01.png "Linux rm file 01")

②rmコマンドを実行します
```
./ossutil64 rm oss://linuxbucket202106/linuxmultifolder/2021/06/ -r
```
 ![Linux rm file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/25_Linux_rm_file_02.png "Linux rm file 02")
レスポンス
```
# ./ossutil64 rm oss://linuxbucket202106/linuxmultifolder/2021/06/ -r
Do you really mean to remove recursively objects of oss://linuxbucket202106/linuxmultifolder/2021/06/(y or N)? y
Succeed: Total 4 objects. Removed 4 objects.
                                             
4.547991(s) elapsed

```
③ファイルが削除されました
 ![Linux rm file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/25_Linux_rm_file_03.png "Linux rm file 03")

④フォルダも削除されました
 ![Linux rm file ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_04/25_Linux_rm_file_04.png "Linux rm file 04")

macOSとARMの環境での使用手順はmacosとARMのossutilバージョンをダウンロードします。使用手順はLinuxのと同じです。


# 最後に
以上、ossutilについてをご紹介しました。ossutilを使った開発をする際、ご参考になれば幸いです。    






