---
title: "draw.ioでアーキテクチャ図"
metaTitle: "draw.ioでAlibaba Cloudアーキテクチャ図を描こう"
metaDescription: "draw.ioでAlibaba Cloudアーキテクチャ図を描こう"
date: "2019-12-13"
author: "SBC engineer blog"
thumbnail: "/3rdParty_images_26006613480590800/20191211193559.png"
---

## draw.ioでAlibaba Cloudアーキテクチャ図を描こう

# はじめに 

本記事では、draw.ioを使ってAlibaba Cloudのアーキテクチャ図を描く方法をご紹介します。    

※説明はいいからすぐに使いたい という方は、[こちら](https://sbc-satou.github.io/drawio/src/main/webapp/index.html)

# draw.ioって？？
draw.ioとは、英JGraph社が提供するオープンソースのオンライン作画ツールです。  
フローチャートやUML図等を**無料で**、**綺麗に**、そして**簡単に**作成することが出来ます。  

例えば、以下のような画像をオンライン上で作成可能です。


![サンプル画像①](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211193559.png "サンプル画像①")

![サンプル画像②](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211193632.png "サンプル画像②")

## 特徴
draw.ioをオススメする理由は大きく3つあります。

1. 拡大しても画質が劣化しない 
2. コネクタが自由自在  
3. テンプレートが豊富   

## 拡大しても画質が劣化しない 
draw.ioで用いられる各種Shapes（アイコン画像）はSVG（Scalable Vector Graphics）という形式で作成されています。  
そのため、画像を拡大してもボヤけたり劣化を起こすことなく、綺麗な構成図を作成することが出来ます。  

以下は、PNGファイルとSVGファイルのAlibaba Cloudアイコン画像をそれぞれ拡大し、画質を比較したものです。  
PNGファイルの方は文字の輪郭がボヤけてしまっていますが、SVGファイルの方はシャープなまま拡大されていることがわかるかと思います。


![SVG-PNG比較画像](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211194157.png "SVG-PNG比較画像")

## コネクタが自由自在  
エクセルやパワーポイントを使ってネットワーク構成図などを作成する際、    
カギ線コネクタや結合点が思ったような動作をせず、イライラした経験がある方も多いのではないでしょうか。    


![カギ線コネクタあるある](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211194250.png "カギ線コネクタあるある")

draw.ioでは、結合点によらずコネクタをジョイントすることができ、   
また、コネクタ自体を自在に屈折させることが出来るので、以下のような複雑な図形も簡単に描画することが出来ます。    

![draw.ioのコネクタ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211194402.png "draw.ioのコネクタ")

## テンプレートが豊富   
draw.ioでは、様々なテンプレートとShapes（アイコン集）を提供しています。  
AWSやAzureを始め、GCPやIBM Cloudにも対応しており、様々なパブリッククラウドのアーキテクチャ図を描くことが出来ます。  


![AWSのShapesサンプル](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211194525.png "AWSのShapesサンプル")

しかし、なんと、実は、、、
  
<span style="font-size: 150%">draw.ioはAlibaba Cloudには対応していません  
</span>[^1] 

[^1]:2019年12月時点

ということで   
今回はdraw.ioのソースコードを改造して<span style="font-size: 150%"><span style="color: #ff0000">Alibaba Cloudに対応</span></span>させてみました  


# Alibaba Cloud対応版draw.ioの紹介

## 紹介
以下のURLより、Alibaba Cloud対応版draw.ioにアクセス出来ます。  
URL：https://sbc-satou.github.io/drawio/src/main/webapp/index.html  
README：https://sbc-satou.github.io

## 使い方
1. ブラウザで[上記URL](https://sbc-satou.github.io/drawio/src/main/webapp/index.html)にアクセスします。
2. 既存のダイアグラムを開くか否かを聞かれるので、`Create New Diagram`（新規作成）を選択します。

![新規作成を選択](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211194907.png "新規作成を選択")

3. テンプレート選択画面にて`Cloud`カテゴリより任意のAlibaba Cloudテンプレート（`cloud/aliyun_xxx.xml`）を選択し、`Create`ボタンを押下します。  
※空のテンプレートから作成する場合でも、`blankDiagram`ではなく`cloud/aliyun_blank_template.xml`を選択してください。

![Aliyunテンプレートを選択](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211194936.png "Aliyunテンプレートを選択")

4. 左メニューにAlibaba Cloudのアイコンが表示されるため、Let's draw!!


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211194959.png "img")

## 注意点
- ・本ツールは[draw.io](https://github.com/jgraph/drawio)を元に作成されています。  
　ライセンスは[Apache License2.0](http://www.apache.org/licenses/LICENSE-2.0)に準拠します。
- ・Webサイトの公開に際しては、`Github`の`Github Pages`機能を用いてホスティングしています。  
　そのため、オンライン機能（Google Drive連携/Github連携等）を制限しています。
- ・上記手順でAlibaba Cloudのテンプレート指定した場合にのみ、Alibaba CloudのShapes（アイコン集）が表示されます。  
　他のテンプレートを指定した場合や、`＋More Shapes`からはAlibaba CloudのShapesを読み込むことは出来ません。
- ・本ツールは予告なく仕様変更、または公開を終了する可能性があります。

# （開発者向け）カスタマイズ方法
以降の記事では、開発者向けにdraw.ioのカスタム方法をご紹介します。  

本項では、カスタムライブラリをインポート + `GitHub Pages`でホスティング という方法で既存draw.ioをカスタマイズしていきます。  
この方法では、殆どソースコードを修正する必要がないため、非プログラマの方でも簡単にテンプレートやライブラリの追加が可能です。  
※ちなみに一番面倒なのはアイコン収集だったりします。。。

## 前提
Githubアカウントを所持している前提となります。

## 手順
大まかな手順は以下の通りです。

1. アイコン収集
2. カスタムライブラリ（Shapes）作成
3. テンプレート作成
4. GitHubリポジトリ作成
5. ソースコード編集

## 1. アイコン収集
[iconfont](https://www.iconfont.cn/plus/user/detail?&uid=41718)より、Alibaba Cloudのアイコンを収集していきます。 
 
ファイル形式は`SVG`を指定します。必要に応じて色やサイズを変更してください。  
※本例では、サイズを`128px`、色を`#00C1DE`に変更してダウンロードしています。

![iconfontよりアイコンをダウンロード](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200119.png "iconfontよりアイコンをダウンロード")

## 2. カスタムライブラリ（Shapes）作成
前手順で収集したアイコンを適度な粒度でまとめ、カスタムライブラリ（Shapes）を作成します。  
カスタムライブラリの作成には、本家draw.ioを用います。  

1. [draw.io](https://www.draw.io)にアクセスします。

2. 空のダイアグラムを作成します。  

* 保存先に`Device`を選択します。  

![保存先選択](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200218.png "保存先選択")

* `Create New Diagram`を選択し、ダイアグラムを新規作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200237.png "img")

* テンプレート選択画面にて`Basic` > `Black Diagram` > `Create`を選択し、空のダイアグラムを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200256.png "img")

3. メニューより`File` > `New Library` > `Device`を選択し、インポート画面に遷移します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200318.png "img")


4. インポート画面が表示されます。`Filename`に任意のファイル名を入力し、前手順で収集したアイコンをドラックしていきます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200343.png "img")

5. すべてのアイコンをインポートし終えたら、`Save`ボタンを押下してカスタムライブラリファイル（xml）をダウンロードします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200408.png "img")


6. 上記3-5の手順を、作成するカスタムライブラリの数だけ繰り返します。  
※本手順では、プロダクトの分類毎に8つのカスタムライブラリ（Aliyun_xxx.xml）を作成していますが、1つのファイルにまとめても問題ありません。  

以上でカスタムライブラリの作成は完了となります。

## 3. テンプレート作成
ダイアグラム新規作成時に選択するテンプレートファイルを作成します。  
こちらもカスタムライブラリと同様、本家draw.ioを利用します。

1. [draw.io](https://www.draw.io)にて、任意の構成を作図します。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200725.png "img")

2. テンプレートをxmlファイルとして出力します。  
メニューより`File` > `Export as` > `XML`を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200758.png "img")

3. `Export`ボタンを押下します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200822.png "img")

4. `Filename`に任意のファイル名を入力し、保存先に`Device`を選択してテンプレートファイルをローカル端末にダウンロードします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200846.png "img") 

5. テンプレート選択時に表示されるサムネイル画像を出力します。  
xmlファイルと同様の手順で`PNG`ファイルとしてローカル端末に保存します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211200947.png "img") 

6. 上記1-4の手順を必要なテンプレート数だけ繰り返します。  
※本手順では、以下の4つのテンプレートファイルを作成しています。  

* 空のテンプレート（aliyun_blank_template.xml）  
* 標準Webアーキテクチャ（aliyun_basic_web.xml）  
* マイグレーションアーキテクチャ（aliyun_cloudnative_migration.xml）  
* エンタープライズECアーキテクチャ（aliyun_enterprise_e-commerce.xml）   

以上でテンプレートファイルの作成は完了となります。

### 4. GitHubリポジトリ作成
GitHubに公開用のリポジトリを新規作成します。  

1. Githubにログインし、`New`ボタンよりリポジトリを新規作成します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211201242.png "img")

2. リポジトリの設定を行います。  
* Github Pagesで公開するために、`Repository name`を`ユーザ名` + `.github.io`に設定します。  
* 同様の理由で、スコープを`Public`に設定します。  
* ※その他templateの選択やREADMEの作成等は任意です。  
* `Create repository`ボタンを押下し、リポジトリを作成します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211201343.png "img")

3. `Github Pages`の設定を行います。
* `Setting` > `GitHub Pages`より、`Choose a theme`ボタンを押下します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211201528.png "img")

* 任意のテーマを選択し、`Select theme`ボタンを押下します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211201605.png "img")


4. `https://<リポジトリ名>`（`https://<ユーザ名>.github.io`）にアクセスし、以下のように選択したテーマが表示されることを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211201624.png "img")



以上でGitHub Pagesの設定は完了です。

## 5. ソースコード編集
### 5-1. ソースコード入手
カスタマイズ元のdraw.ioのソースコードを入手します。

- １. 前手順で作成した公開用のリポジトリをクローンしておきます。  

```bash
git clone git@github.com:sbc-satou/sbc-satou.github.io.git
```
- ２. 本家draw.ioの[Github](https://github.com/jgraph/drawio)より、ソースコードをクローンします。  
また、ダウンロードしたソースコードを公開用リポジトリにコピーします。  

```bash
git clone git@github.com:jgraph/drawio.git
cp -R drawio sbc-satou.github.io.git
```

### 5-2. カスタムライブラリアップロード
先程作成したカスタムライブラリのファイルを公開用リポジトリにアップロードします。

- １. 公開用リポジトリに任意の名前でディレクトリを作成し、カスタムライブラリファイル（.xml）を配置します。  
※本例では、`drawio`配下に`libs/aliyun`ディレクトリを作成し、ファイルを配置しています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211202319.png "img") 

- ２. 配置したカスタムライブラリをリポジトリにpushします。
```bash
git add .
git commit -m "comment"
git push origin master
```

- ３. ブラウザで`https://<リポジトリ名>/<ライブラリファイルのパス>`にアクセスし、  
アップロードしたライブラリファイルがGitHub Pagesで正常に公開されていることを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211202444.png "img")


### 5-3. テンプレートファイル追加
先程作成したテンプレートファイルをソースコードに追加していきます。  

- １. テンプレートファイル一式（.xml + .png）を、`drawio/src/main/webapp/templates/cloud`配下に配置します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211202630.png "img")     

- ２. `drawio/src/main/webapp/templates/index.xml`を下記のように編集し、カスタムライブラリの定義をテンプレートの追加を行います。

```xml
<templates>
<!-- ここから追加 -->
<clibs name="aliyun">
  <add>Uhttps://sbc-satou.github.io/drawio/libs/aliyun/Aliyun_General.xml</add>  <!-- ①カスタムライブラリ -->
  <add>Uhttps://sbc-satou.github.io/drawio/libs/aliyun/Aliyun_Compute.xml</add>
  <add>Uhttps://sbc-satou.github.io/drawio/libs/aliyun/Aliyun_Storage.xml</add>
  <add>Uhttps://sbc-satou.github.io/drawio/libs/aliyun/Aliyun_Network.xml</add>
  <add>Uhttps://sbc-satou.github.io/drawio/libs/aliyun/Aliyun_Security.xml</add>
  <add>Uhttps://sbc-satou.github.io/drawio/libs/aliyun/Aliyun_Database.xml</add>
  <add>Uhttps://sbc-satou.github.io/drawio/libs/aliyun/Aliyun_Domain_Hosting.xml</add>
  <add>Uhttps://sbc-satou.github.io/drawio/libs/aliyun/Aliyun_Application_Service.xml</add>
  <add>Uhttps://sbc-satou.github.io/drawio/libs/aliyun/Aliyun_Bigdata_AI.xml</add>  
  <add>Uhttps://sbc-satou.github.io/drawio/libs/aliyun/Aliyun_Management.xml</add>
</clibs>
<!-- ここまで追加 -->
<clibs name="azure">

<!-- omitted -->

<template url="charts/work_breakdown_structure.xml" libs="general"/>
<!-- ここから追加 -->
<template url="cloud/aliyun_blank_template.xml" libs="general" clibs="aliyun"/>  <!-- ②テンプレートファイル -->
<template url="cloud/aliyun_basic_web.xml" libs="general" clibs="aliyun"/>
<template url="cloud/aliyun_cloudnative_migration.xml" libs="general" clibs="aliyun"/>
<template url="cloud/aliyun_enterprise_e-commerce.xml" libs="general" clibs="aliyun"/>
<!-- ここまで追加 -->
<template url="cloud/aws_1.xml" libs="general;aws4"/>

<!-- omitted -->

</templates>
```

#### ①カスタムライブラリ
`clibs`タグでカスタムライブラリを定義します。  
このように記述することで、後述のテンプレートからカスタムライブラリの利用が可能になります。  
前手順でアップロードしたカスタムライブラリ（xmlファイル）のGiHtub PagesのURLを追加します。  

#### ②テンプレートファイル
`template`タグでテンプレートを定義します。  
このように記述することで、新規ダイアグラム作成時にテンプレートとして選択可能となります。  

`url`にはテンプレートファイルの相対パスを記述します。  
`libs`には、テンプレート生成時に読み込む組み込みライブラリを指定します。  
`clibs`に前手順で定義したカスタムライブラリを指定します。

    

- ３. 変更内容をリポジトリにpushします。

### 5-4. (Option)index.html編集
必要に応じて、draw.ioのオンライン機能（Google Drive連携/Github連携等）を制限します。  

- １.  `drawio/src/main/webapp/index.html`の49行目付近を下記のとおり修正し、オフラインを強制させます。
```javascript
// omitted

// var params = window.location.search.slice(1).split('&');
var params = ["local=1"];

// omitted
```

- ２. 変更内容をリポジトリにpushします。

### 5-5. 確認
ブラウザで`index.html`にアクセスし、draw.ioがカスタマイズされていることを確認します。  
※URLの例）https://sbc-satou.github.io/drawio/src/main/webapp/index.html


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191213121837.png "img")    

以上がdraw.ioのカスマイズ方法になります。


# 最後に
今回はdraw.ioを改造してAlibaba Cloudのアーキテクチャ図を作成するツールを紹介させていただきました。  
ブログ等に構成図を載せる際などに、是非利用していただければと思います。



