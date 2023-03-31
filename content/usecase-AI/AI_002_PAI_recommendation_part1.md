---
title: "PAIでレコメンデーション①"
metaTitle: "PAIで商品をレコメンドする機械学習モデルを作ってみた"
metaDescription: "PAIで商品をレコメンドする機械学習モデルを作ってみた"
date: "2019-12-26"
author: "SBC engineer blog"
thumbnail: "/AI_images_26006613482349500/20191217140627.png"
---

## PAIで商品をレコメンドする機械学習モデルを作ってみた

本記事では、PAI（Machine Learning Platform for AI）を使って、商品をレコメンドする機械学習モデルを作る方法をご紹介します。    

### PAI（Machine Learning Platform for AI）とは

PAI（Machine Learning Platform for AI）はAlibaba Cloudのオールインワン機械学習サービスです。  
Alibaba Cloudが展開しているMLaaS（Machine Learning as a Service）であり、機械学習を従量課金制で利用することができます。  

機械学習をいざ始めようとすると、プログラミングスキルや様々なライブラリの知識に加え、数学の知識も必要です。  
そのため、未経験で機械学習を始めると形にするまでとても先が長いように感じます。  

しかし、PAIを利用すれば機械学習専門のエンジニアでなくても比較的容易に製品の推奨、財務リスク管理、画像識別、音声認識などのサービスを迅速に構築し、人工知能を実装することが可能です。  
なぜなら、PAIでは<b><span style="color: #ff0000">機械学習に必要なアルゴリズムがモジュール化されているのでコードを書く必要がなく、GUIによる直感的な設定が可能</span></b>です。     


#### PAIの構成

PAIは複数のコンポーネントによって構成されています。  

##### PAI Studio

PAI-Studioは、GUIで直感的に操作が可能な機械学習モデル開発環境です。  
200以上のアルゴリズムがモジュール化されており、Drag＆Dropで配置できます。  
アルゴリズムのパラメータはシンプルで分かりやすいGUIで設定が可能なため、専門的な知識を必要とせずに短時間で機械学習モデルを作成することができます。


##### PAI DSW  

PAI DSW（Data Science Workshop）は、開発者が直接コードを記述することが可能な機械学習モデル開発環境です。  
PAIチームによって最適化された組み込みのTensorflowフレームワークを使用しており、DSWターミナルを開いてサードパーティライブラリをインストールすることも可能です。


##### PAI EAS

PAI EAS（Elastic Algorithm Service）は、PAI StudioもしくはPAI DSWで作成した機械学習モデルをオンラインのRESTful APIとしてデプロイします。  
Alibaba Cloudが展開しているリソースモニタリングやBlue-Greenデプロイ、バージョン管理機能などにより、高い同時実行性でのデプロイが可能です。


#### PAIで機械学習モデルを作るまでの流れ

実際にPAIで機械学習モデルを作るまでのステップは以下です。

1. 利用するサービスを決定する（GUIで設定可能なPAI Studioもしくはコーディングで実装するPAI DSW）
1. 利用するサービスのプロジェクトを作成する
1. サービスごとの手法に沿って機械学習モデルを作成する
  
PAIに関するより詳しい情報は公式ドキュメントを参照してください。

> https://www.alibabacloud.com/cloud-tech/product/30347.htm



### この記事でやること

この記事では、以下の流れで商品をレコメンドする機械学習モデルを作成＆解説していきます。

1. PAIで処理を実装するための事前準備
1. テンプレートを利用して一瞬で処理を実装
1. 実装した処理を動かしてみる
1. 処理内容の確認

使用するテンプレートに関する公式ドキュメントは以下になります。  
> https://www.alibabacloud.com/cloud-tech/doc-detail/67394.htm


## PAIで処理を実装するための事前準備

### PAIを使う前に

PAIの利用前に以下が必要となります。

#### 国際サイトのAlibaba Cloudアカウント取得

上記にも記載したとおり、PAIは日本サイトではまだ公開されていません。  
本記事の作業実施前に国際サイトの登録を済ませ、Alibaba Cloudコンソールが利用できる状態になっている必要があります。

#### PAIを購入するリージョンでMaxComputeを有効化

PAIでは、モジュール化されたアルゴリズム等のリソースとしてMaxComputeを使用します。  
そのため、PAIを購入後プロジェクト作成する際にMaxComputeが有効化されている必要があります。  
現時点(2019/12/12)ではPAIはJapanリージョンでは正しく動作しないため、本記事ではSingaporeリージョンで作業を行います。

この作業はPAI購入後、プロジェクト作成前に行えば問題ありません。

### PAIの購入

PAIを購入します。

Alibaba Cloudの<span style="color: #ff0000">国際サイト</span>のコンソール画面へログインし、`Machine Learning`画面を開きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191213164133.png "img")


画面を開いたら`Buy Now`をクリックします。
以下の画面が表示されたら項目を設定します。

①：リージョンは`Asia Pacific SE1 (Singapore)`を選択します。

他の項目は選択肢が1つのみのため、デフォルトのまま②`今すぐ購入`をクリックします。

※`Jpan(Tokyo)`を選択して購入することは可能ですが、PAIはJpanリージョンでは対応していないため他のリージョンを選択してください。
少なくともSingaporeリージョンで購入すれば本記事の作業は完遂できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191213165705.png "img")


### プロジェクトの作成

プロジェクトを作成します。

`Machine Learning`画面左に表示されるメニューから`Studio-Modeling Visualization`を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191213171631.png "img")


画面上部に表示されるリージョンが、PAIを購入したリージョンでなかった場合は変更します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191213182515.png "img")


`Create Project`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191213182650.png "img")


プロジェクトの各項目を設定します。

①：MaxComputeの課金タイプを選択します。今回の作業はお試しのため、従量課金を選択します。  
②：任意のプロジェクト名を入力します。  
`Alias`および`Project Description`は任意の項目です。

①、②を設定したら③`OK`をクリックします。

※PAIを購入したリージョンでMaxComputeが有効化されていない場合はプロジェクトを作成できません。  
MaxComputeの課金タイプが選択できない場合はMaxComputeを有効化してからプロジェクトを作成してください。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191213182916.png "img")


プロジェクトが作成されたことを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191213183710.png "img")


以上で事前準備が完了です。


## テンプレートを利用した処理の実装

準備が整いましたので、処理の実装を行います。

先ほど作成したプロジェクトの`Operation`列の`Machine Learning`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217113737.png "img")


新しいタブで以下の画面が開きます。  
左に表示されるインデックスの`Home`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217114940.png "img")


テンプレートが複数表示されるので、`[Recommended Algorithms] Product Recommendation`の`Create`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217120414.png "img")


`New Experiment`画面が表示されるので、①`Name`に任意の名前を入力し、②`Create`をクリックします。  
※`Description`および`Save To`は必要に応じて設定してください。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217132646.png "img")


作成が完了するとフローチャートのような図が表示されます。  
これで処理の実装は完了です。  
一瞬で終わりましたね。

※下図は左に表示されるインデックスの`Experiments`、`Data Source`、`Components`、`Models`のいずれかを選択していると表示されます。  
図が表示されない場合はインデックスを確認して下さい。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217135557.png "img")

## 商品レコメンド処理を動かしてみる

それではさっそく、テンプレートから作った処理を動かしてみましょう。

画面上部の`Run`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217133406.png "img")


動き出すと完了したコンポーネントに緑のチェックマークが表示され、次のコンポーネントが開始されるまでの間、`→`は緑の点線になります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217140627.png "img")


5分ほどですべて完了しました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217140801.png "img")


処理の実装から実行まで、あっという間にできました。

## 処理内容の確認

さて、テンプレートで実装した処理の内容について、公式ドキュメントにも説明があるにはありますが、少しわかりにくかったので改めて確認していきます。

### インプットデータ

今回作成した機械学習モデルのインプットデータは、Alibaba Cloudによって提供されている`cf_data_train`と`cd_data_result`テーブルです。  
他にも複数のテーブルがAlibaba Cloudから提供されており、PAI Studioプロジェクトを作成した時点で使用可能な状態となっています。  

左に表示されるインデックスの`Data Source`を選択し`Public Tables`を開くと、提供されているテーブルが確認できます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191224143306.png "img")

`cf_data_train`および`cd_data_result`のテーブル定義は以下です。    
いずれもユーザが商品対して行ったアクション履歴のデータですが、`cf_data_train`テーブルは6月までのデータであり、`cd_data_result`テーブルは7月以降のデータです。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217145655.png "img")


### 処理の概要

処理の概要を簡単に説明します。

この処理では、ユーザが商品対して行った6月までのアクション履歴と7月以降のアクション履歴をインプットとしており、処理の目的は主に以下の2点です。

1. 6月までのアクション履歴から、どのユーザにどの商品をレコメンドするのか決定する    
1. 1.でレコメンド対象となった商品が7月以降にどの程度購入されたのか確認する


具体的にどのような処理を行っているか、コンポーネントを4つ分けて説明します。

1⃣：6月までのアクション履歴をもとに、どの商品を買ったユーザにどの商品をレコメンドするのかを算出する  

2⃣：7月以降のアクション履歴をもとに、7月以降に購入された商品のうち、1⃣で算出したレコメンド対象の商品と合致するデータを抽出する  

3⃣：1⃣（6月までのアクション履歴から算出したレコメンド対象商品データ）を整形（重複データを削除）する  
　　整形したデータの基本統計量を算出し、列ごとのデータ数や最大値、最小値などのデータ特性を取得する  

4⃣：2⃣（購入されたレコメンド対象商品データ）を整形（重複データを削除）する  
　　整形したデータの基本統計量を算出し、列ごとのデータ数や最大値、最小値などのデータ特性を取得する

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217191550.png "img")


### 1⃣6月までのアクション履歴からレコメンド対象商品データを算出

1⃣では以下を行っています。

1. 6月までのアクション履歴をデータベースから読み込む。
1. 状態が購入済のレコードのみを抽出する。
1. どのユーザがどの商品を購入したかという情報をもとに、それぞれの商品に最も類似している商品を導き出す。（アイテムベースの協調フィルタリング）  
アウトプットはユーザID、商品ID、類似商品ID。
1. 3.のデータを整形する。
1. 1.のデータと4.のデータを内部結合する（キーはそれぞれの商品ID）。  
アウトプットはユーザID、商品ID、類似商品ID。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191220163028.png "img")


文章だけではわかりづらいので、それぞれの処理の設定を見ていきましょう。

#### 6月までのアクション履歴をデータベースから読み込む

PAIでは`Read MaxCompute Table`コンポーネントによって、MaxComputeのデータベースからテーブルを読み込むことが可能です。  
設定を確認するため、`Read MaxCompute Table`コンポーネントをクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217162138.png "img")

右側に設定画面が表示されます。  
`Table Selection`タブをクリックすると読み込むテーブルが確認でき、`Column Information`タブをクリックするとテーブルの列情報が確認できます。    
また、他のコンポーネントのでも同様ですが、設定画面の下に表示されるコンポーネント名`Read MaxCompute Table`をクリックすると、コンポーネントの概要が確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217161910.png "img")

コンポーネントを右クリックし`View Data`をクリックすると、コンポーネントの処理完了後のアウトプットデータを100レコードまで確認することができます。  
こちらも他のコンポーネントでも同様の機能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217161512.png "img")

#### 状態が購入済のレコードのみを抽出

`SQL Script`コンポーネントではSQL文を使用することが可能です。  
先ほどと同様にコンポーネントをクリックして設定画面を開きます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217164200.png "img")


設定画面上部の`Input Source`では、`→`で繋がれたインプットデータが`t1` `t2` `t3` `t4`として自動的にマッピングされます。  
これにより、SQL文を入力する際に実際のテーブル名ではなく`${t1}`と表すことが可能です。  
テンプレートではインプットが1つのため、`t1`にのみマッピングされています。  

SQL文は画面下部に表示されていますが、見えづらいため`Maximize`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217164655.png "img")


SQL文はこの画面で編集可能です。  
テンプレートでは`t1`にマッピングされたテーブルから、状態が購入済み（1）のデータのみを抽出するSQL文が確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217165423.png "img")


先ほどと同様に`View Data`でコンポーネントの処理結果を参照すると、`active_type`列が`1`のレコードのみであることが確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217165832.png "img")


#### 購入データから類似商品を導き出す（アイテムベースの協調フィルタリング）

ここで、今回のメインである協調フィルタリングのコンポーネントが登場します。  
誰がどの商品を購入したかという情報をもとに、それぞれの商品に類似している商品を協調フィルタリングで導き出します。  
協調フィルタリングのコンポーネントとして、PAIでは`Collaborative Filtering`コンポーネントが用意されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217170951.png "img")


`Collaborative Filtering`コンポーネントは<b>同じユーザに購入された商品同士は類似性が高い</b>と判断するアルゴリズムとなっており、いくつか設定項目があります。  
メインとなる項目を簡単に説明します。

##### Fields Settingタブ

①：ユーザ名やユーザIDなど、ユーザを判別する列を設定  
②：商品名や商品IDなど、商品を判別する列を設定


##### Prameters Settingタブ

①：類似度の計算手法を設定します。ここでは`jaccard`を選択しておりますが、他に`wbcosine`、`asymcosine`があります。  
　　※jaccardについては[jaccardとは](#jaccardとは)で説明します。  
②：類似商品をいくつ求めるかを設定します。ここでは最も類似度の高い1つの商品を求める設定がされています。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217173652.png "img")


`View Data`でコンポーネントの処理結果を参照します。  
ユーザID列が削除され、類似商品列（`similarity`列）が追加されています。  
類似商品列の値は<b>[商品IDと最も類似度の高い商品ID]:[類似度]</b>という構造になっています。  
例えば、1レコード目であれば、IDが`1000`の商品と最も類似性の高い商品のIDは`11849`であり、その類似度は`1`となります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217174513.png "img")

##### jaccardとは
jaccardは、集合Aと集合Bの類似度を<b>集合ABどちらかもしくは両方に含まれる要素うち、集合AB両方に含まれている要素が占める割合</b>によって求める手法です。  
言い換えると、2つの集合に共通する要素がどの程度あるのかを調べ、共通要素が多ければ多いほど似ている（類似度が高い）と判断します。  
計算式は以下になります。  
計算結果は0~1の間であり、1に近ければ近いほど類似度が高いという判断ができます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191223115703.png "img")

今回は、各アイテムを集合とし、購入されたユーザを要素としてアイテム同士の類似度を算出しています。  
以下のようなアイテムA、アイテムBの類似度を求めるとします。  
<b>アイテムA（アイテムAを購入したユーザ）= ["user1","user2","user3","user4"]  
アイテムB（アイテムBを購入したユーザ）= ["user1","user2","user3","user5","user6","user7"]    
</b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191223181205.png "img")

まず、アイテムABどちらかもしくは両方を購入したユーザの数を求めます。  
<b>アイテムABどちらかもしくは両方を購入したユーザの数 = 7（"user1","user2","user3","user4","user5","user6","user7"）  </b>

次に、アイテムABの両方を購入したユーザの数を求めます。  
<b>アイテムAB両方を購入したユーザの数 = 3（"user1","user2","user3"）  </b>

最後に、アイテムABどちらかもしくは両方を購入したユーザ（7人）のうち、アイテムAB両方を購入したユーザ（3人）の割合を求めます。  
<b>[アイテムAB両方を購入したユーザの数] / [アイテムABどちらかもしくは両方を購入したユーザの数]=3/7（0.4286）</b>  
よって、アイテムABの類似度は0.4286となります。

#### 類似商品データを整形する

類似商品さえわかれば類似度は不要なため、データから削除します。  
データを整形するために再び`SQL Script`コンポーネントを使用します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217180125.png "img")


先ほどと同様の方法でSQL文を確認すると、類似商品列の値のコロンから先を削除し、列名を変更していることが確認できます。  
<b>[商品IDと最も類似度の高い商品ID]:[類似度]　→　[商品IDと最も類似度の高い商品ID]</b>  
<b>`similarity`列　→　`similar_item`列</b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217182012.png "img")


`View Data`でコンポーネントの処理結果を参照すると、コロンから先が削除され、列名が変更されていることを確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217182208.png "img")


#### 6月までのアクション履歴と類似商品データを内部結合する

類似商品データだけではどのユーザに商品をレコメンドしてよいのかがわからないため、6月までのアクション履歴と内部結合を行います。  
結合は`Join`コンポーネントを使用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217182533.png "img")


各項目について説明します。  

①：結合タイプを選択します。ここでは内部結合を意味する`Inner Join`を選択しています。  
②：結合キーを設定します。  
③：左のテーブルからアウトプットする列を選択します。  
④：右のテーブルからアウトプットする列を選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217183001.png "img")


③および④をクリックすると以下のような画面が表示され、チェックボックスをクリックすることで選択が可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217183542.png "img")


`View Data`でコンポーネントの処理結果を参照します。  
どのユーザにどの商品をレコメンドするのかを導き出すことができました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217183725.png "img")


### 2⃣算出したレコメンド対象商品データのうち7月以降に購入された商品のデータを抽出

2⃣では以下を行っていきます。

1. 7月以降のアクション履歴をデータベースから読み込む。
1. 状態が購入済みのレコードのみを抽出する。
1. 1⃣のデータ（ユーザ毎のレコメンド対象商品データ）と2.のデータを内部結合する  
（キーは「1⃣の類似商品IDと2.の商品ID」と、それぞれのユーザID） 。 
アウトプットはユーザID、商品ID（類似商品ID）。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191220163052.png "img")


#### 7月以降のアクション履歴をデータベースから読み込む

1⃣と同様に`Read MaxCompute Table`コンポーネントを使用してデータを読み込みます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217184642.png "img")

`View Data`でコンポーネントの処理結果を参照すると、7月以降のアクション履歴が読み込めていることが確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217184834.png "img")


#### 状態が購入済のレコードのみを抽出

1⃣では`SQL Script`コンポーネントを使用してレコードを抽出しましたが、ここでは`Filtering and Mapping`コンポーネントを使用しています。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217185359.png "img")


各項目について説明します。  

①：アウトプットする列を選択する。  
②：アウトプットするレコードの条件を入力する。ここでは状態が購入済み（1）のレコードのみという条件が入力されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217185946.png "img")

②をクリックすると以下のような画面が表示され、チェックボックスをクリックすることで選択が可能です。  
`Join`コンポーネントと同じですね。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217190300.png "img")


`View Data`でコンポーネントの処理結果を参照すると、選択した列のみがアウトプットされていることを確認できます。（状態が購入済みかどうかはこれだけだとわかりませんが…。）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191217190902.png "img")



今回は1⃣のように`SQL Script`コンポーネントを使用しても`Filtering and Mapping`コンポーネントを使用しても同じようにデータを抽出することができます。（アウトプットする列の指定は微妙に変えてましたが）  
`Filtering and Mapping`コンポーネントのほうが直感的で設定ができ入力ミスが少ないように感じますが、複数のインプットから複雑な条件での抽出はできません。  
`SQL Script`コンポーネントではSQL文を自分で用意しなくてはなりませんが、インプットデータを4つまで設定でき、複雑な条件での抽出が可能です。  
状況に応じて使い分けるとよさそうですね。


#### レコメンド対象商品データと7月以降の購入データを結合

6月までのアクション履歴をもとに算出したレコメンド対象商品が7月以降購入されたかどうかを確認するために、内部結合を行います。  
1⃣と同様に`Join`コンポーネントを使用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218114334.png "img")


各項目を確認します。

①：内部結合を設定しています。  
②：結合キーとしてそれぞれのユーザIDを指定しています。  
③：結合キーとしてレコメンド対象商品のIDと7月以降に購入された商品のIDを指定しています。  
④：アウトプットする列としてレコメンド対象商品データのユーザIDを指定しています。  
⑤：アウトプットする列として7月以降に購入された商品データの商品IDを指定しています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218171504.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218120009.png "img")

`View Data`でコンポーネントの処理結果を参照します。  
各ユーザがレコメンド対象商品を7月以降に購入したかどうかが判明しました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218120204.png "img")


### 3⃣レコメンド対象商品データの重複削除と基本統計量の算出

3⃣では以下を行っていきます。

1. 1⃣のデータ（ユーザ毎のレコメンド対象商品データ）を受け取り、重複レコードを削除する。
1. 1.のデータの基本統計を算出する。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191220163123.png "img")


#### 重複レコードの削除

1⃣のユーザ毎のレコメンド対象商品データを受け取り、重複レコードを削除します。  
こちらは`SQL Script`コンポーネントを使用しています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218173814.png "img")


SQL文を確認すると、完全一致するレコードを対象に重複削除を行っていることが確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218130716.png "img")


`View Data`でコンポーネントの処理結果を参照します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218131143.png "img")


#### テーブルの基本統計を算出

テーブルの基本統計を算出するには、`Full table statistics`コンポーネントを使用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218173834.png "img")


主な設定項目について説明します。

##### Fields Settingタブ

①：統計対象とする列を選択します。選択しない場合はデフォルトで全列を対象とします。  
　　ここでは選択していないので、テーブル全体の基本統計を算出します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218171348.png "img")


`View Data`でコンポーネントの処理結果を参照すると、ユーザ毎のレコメンド対象商品データの基本統計が算出されていることを確認できます。  
`count`が`18065`となっているので、`18065`通りのレコメンドが可能です。  
※レコメンド対象のユーザとアイテムの組み合わせが`18065`通りであり、ユーザもしくはアイテムの重複を含みます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218133112.png "img")

### 4⃣実際に購入されたレコメンド対象商品データの重複削除と基本統計量の算出

4⃣では以下を行っていきます。

1. 2⃣のデータ（レコメンド対象商品購入実績データ）を受け取り、重複レコードを削除する。
1. 1.のデータの基本統計を求める。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191220163200.png "img")


4⃣はインプットが異なるもののほとんど3⃣と同一の処理のため、説明は割愛します。

#### 重複レコードの削除

`SQL Script`コンポーネントを使用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218173916.png "img")


重複削除のSQL文が設定されています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218134124.png "img")


`View Data`でコンポーネントの処理結果を参照します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218134322.png "img")


#### テーブルの基本統計を算出

`Full table statistics`コンポーネントを使用します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218173930.png "img")


統計対象の列を選択していないため、テーブル全体の基本統計を算出します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218171809.png "img")


`View Data`でコンポーネントの処理結果を参照すると、ユーザ毎のレコメンド対象商品データの基本統計が算出されていることを確認できます。  
`count`が`60`となっているので、`60`通りのレコメンドは商品の購入に繋がっていることになります。  
※購入に繋がったユーザとアイテムの組み合わせが`60`通りであり、ユーザもしくはアイテムの重複を含みます。
  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613482349500/20191218135443.png "img")


## さいごに

以上で、PAIを利用して商品をレコメンドする機械学習モデルの作成がほんの数ステップで完了する方法をご紹介しました。    
ただ、今回紹介させていただいたテンプレートで作ったものはあくまでサンプルモデルであって、実用化するには精度が不十分です。    

例えば、類似度を求めるときに購入済みのデータのみをインプットとしているため、カートに入っていたりお気に入り登録されている商品の情報は考慮されていません。    
また、レコメンドする際も、カートに入れている商品やお気に入り登録している商品、ただ閲覧しただけの商品の全ての類似商品を平等にレコメンドしており優先度づけされていません。     

PAIを使いこなすには多少の知識が必要になってきますが、こんな感じでコンポーネントをぺたぺた貼っていけばPAIで機械学習ができるんだ～と思っていただければ幸いです。   

もしもPAIのコンポーネントをもっと知りたい！という方がいたら、[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/69073.htm])のドキュメントを参照してください。 
  
> https://www.alibabacloud.com/cloud-tech/doc-detail/69073.htm
