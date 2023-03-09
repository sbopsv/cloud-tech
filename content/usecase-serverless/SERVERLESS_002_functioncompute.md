---
title: "FCにライブラリをアップロード"
metaTitle: "FunctionComputeにライブラリをアップロードする"
metaDescription: "FunctionComputeにライブラリをアップロードする"
date: "2020-02-06"
author: "SBC engineer blog"
thumbnail: "/Serverless_images_26006613500666600/20200205134303.png"
---

## FCにライブラリをアップロード

# はじめに
本記事では、FunctionComputeにPythonライブラリのnumpyをアップロードする方法をご紹介します。
    
アップロード方法は、コンソール画面から操作する方法と、FunctionCompute上のリソースをコマンドラインから管理するfcliというコマンドラインツールを使用した方法の2つがあります。     

# 方法1:FunctionComputeでライブラリを使用する 
関数でライブラリを使用する場合、FunctionComputeの関数に、実行するコードと一緒にライブラリをアップロードする必要があります。     
以下の手順で、アップロードファイルを準備します。     

①  pip install [使用したいライブラリ] -t [保存場所] (今回はnumpy)を実行し、パッケージをインストールする     
② ハンドラーを含むファイル(index.py)を作成する     
③ 事前にインストールしたライブラリファイルと②で作成したファイルをまとめてzipファイルにする     

```
mkdir tech-blog
cd tech-blog/
pip install numpy -t ./
vim index.py //ハンドラーを含むpythonコード
zip -r tech-blog.zip ./ 
```

ここで準備したzipファイルをFunctionComputeにアップロードする方法を、大きく2つに分けてご紹介します。

## 1. FunctionComputeコンソールからアップロード
1つめはコンソールからzipファイルをアップロードする方法です。     
まず、FunctionComputeのコンソール画面へ移動し、新たな関数を作成します。     
この時、自分が作成したサービス下で関数を作成してください。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613500666600/20200206092440.jpg "img")     
     
     
ランタイムはpython3を選択し、ハンドラー名はハンドラーを含むファイル名 + .handlerを指定します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613500666600/20200205132911.jpg "img")     
     
     
テンプレートが表示されますが、今回は事前に作成したファイルをアップロードするため使用しません。     
ファイルをアップロードすると、存在しているコードは上書きされるためご注意下さい。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613500666600/20200205133610.jpg "img")     
     
     
コード管理でzipファイルのアップロードを選択し、事前に作成したzipファイルを選択し、保存します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613500666600/20200205133000.jpg "img")     
     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613500666600/20200205133140.jpg "img")     
     
     
左ペインにnumpyのフォルダがあることからも、ちゃんとアップロードできたことがわかります。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613500666600/20200205133153.jpg "img")     
     
     
実行したところ、ちゃんと結果が表示されました      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613500666600/20200205134303.png "img")      
     
     
# 方法2.fcliを使用してコマンドラインからアップロード
次に、fcliを使用してコマンドラインからFunctionComputeにファイルをアップロードする方法をご紹介します。     
FunctionComputeの開発は、AlibabaCloudのコンソールで行うよりもローカル環境や開発環境で行うことが多いですよね？     
そんな時に役立つのがfcliです。コマンドラインでFunctionComputeを操作できるため、     
認証や画面遷移の必要なく開発が行える便利ツールです。     

## fcliの導入方法
fcliの最新バージョンのzipファイルをダウンロードし、zipファイルを解凍します。     
> https://github.com/aliyun/fcli/releases

解凍後にfcliという一つのファイルになっていることを確認できたら、fcliを使用する準備が整っています。     
fcli shellと入力してfcliのコマンドラインに入ってみます

```
unzip fcli-v1.0.2-linux-amd64.zip
ls -l ./
fcli shell
Welcome to the function compute world. Have fun!
>>>
```

## 2-1. ローカルのディレクトリごとアップロード
作業環境に保存したファイルを、移動することなくアップロードできたら便利だと思いませんか？     
fcliは、ローカルのディレクトリをFunctionCompute上にアップロードすることが可能です。     
使用したいライブラリファイルと、index.pyを一つのディレクトリに格納します。     
この時、zipファイルをアップロードするのではなく圧縮する前のファイルを同じディレィトリに格納し、アップロードするという点にご注意ください。     

```
cd tech-blog // 1.で作成したディレクトリに移動
mkdir dir-up // 圧縮前のファイルを入れるディレクトリを作成
cp -r numpy/ index.py dir-up/ //圧縮前のファイルを新しいディレクトリにコピー
fcli shell
>>>cd tech-blog-service
>>>mkf func-dir-up -d 'dir-up' -h index.handler -t python3 
>>>invk func-dir-up
>>>{"data": 14}
```

正しい値が出力されました。     

実行したfcli コマンド・オプションをご紹介します。     
cd   : カレントリソース変更     
mkf : make function 関数の作成     
-d    : ディレクトリの指定     
-h    : ハンドラー名の指定     
-t     : ランタイムの指定     
invk : 関数の実行     

## 2-2. ローカルのファイルをアップロード
ローカルのファイルをアップロードすることも可能です。
オプションを -f に変更し、アップロードしたいファイルを指定することで、ローカルからのファイルアップロードが可能です。
```
fcli shell
>>>cd tech-blog-service
>>>mkf func-file-up -f 'tech-blog.zip' -h index.handler -t python3
>>>invk func-file-up
>>>{"data": 14}
```
## 2-3. OSSからファイルをアップロード
アップロードしたいファイルをOSSにアップロードし、OSSからFunctionComputeにアップロードすることが可能です。     
まずは、SDKを使ってOSSへのzipファイルアップロードを行います。     
アップロード方法は以下ドキュメントに載っているのでご参照ください。

> https://www.alibabacloud.com/cloud-tech/doc-detail/88426.htm

OSSへファイルをアップロードするpython3コード

```
import oss2
#mport zipfile

#zipfile.ZipFile('./new.zip', 'w', zipfile.ZIP_DEFLATED) as new_zip
#new_zip.write('./numpan.zip')
#new_zip.write('./sample.py')
#new_zip.close()


# It is highly risky to log on with AccessKey of an Alibaba Cloud account because the account has permissions on all the
 APIs in OSS. We recommend that you log on as a RAM user to access APIs or perform routine operations and maintenance. 
 To create a RAM account, log on to https://ram.console.aliyun.com.
auth = oss2.Auth('LTAI4FhJ4N1kUFiCNJjhx3ra', 'xxVEc20HT05Hf9OJv2OGCLQ1dZBXDG')

# This example uses endpoint China (Hangzhou). Specify the actual endpoint based on your requirements.
bucket = oss2.Bucket(auth, 'https://oss-ap-northeast-1.aliyuncs.com', 'tech-blog-bucket')
bucket.put_object_from_file('tech-blog.zip', 'tech-blog.zip')
```

上のプログラムを実行してOSSへのファイルアップロードが完了したら、次にOSS上のzipファイルをFunctionComputeにアップロードします。

```
fcli shell
>>>cd tech-blog-service
>>>mkf func-oss-up -o 'tech-blog.zip' -b 'tech-blog-bucket' -h index.handler -t python3
>>>invk func-oss-up
>>>{"data": 14}

```

正しい値が出力されました      

新しく出てきたオプションをご紹介します。     
-o : OSS上の目的のオブジェクト(ファイル名)を指定     
-b : OSS上の目的のオブジェクト(ファイル名)が入っているbucket名を指定     


# 最後に
FunctionComputeのコンソール画面に移動してファイルをアップロードするよりも、コマンドラインから全て操作した方が便利な時もあると思います。     
そこで、今回はFunctionCompute用のCLIツールであるfcliを使ってみました。     
fcliはとても便利なツールなので、サーバレス開発をする際、参考に頂ければ幸いです。

