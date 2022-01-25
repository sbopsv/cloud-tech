---
title: "PAIでレコメンデーション②"
metaTitle: "PAIで商品をレコメンドする機械学習モデルを作ってみた Part2"
metaDescription: "PAIで商品をレコメンドする機械学習モデルを作ってみた Part2"
date: "2020-02-05"
author: "SBC engineer blog"
thumbnail: "/AI_images_26006613501915481/20200124170206.png"
---

#  PAIで商品をレコメンドする機械学習モデルを作ってみた

本記事では、PAI（Machine Learning Platform for AI）を使って、商品をレコメンドする機械学習モデルを作る方法の続編で、商品の特徴をもとに類似商品をレコメンデーションする方法をご紹介します。    


#  追加するレコメンド処理の概要

商品レコメンドの学習モデルは協調フィルタリングと呼ばれる手法を用いて、どのユーザがどの商品を購入したかという情報をもとに、それぞれの商品に最も類似している商品を導き出しレコメンドしていました。  
しかしこの手法では、<span style="color: #ff0000">別のユーザが購入した商品しかレコメンドされる可能性がなく、新規商品等で一度も誰にも買われていない商品は類似しているものであってもレコメンドされることはありません</span>。  
そこで、今回は<span style="color: #0000cc">コンテンツベースフィルタリング</span>と呼ばれる手法を取り入れて、商品の特徴をもとに類似商品をレコメンドする学習モデルを作成していこうと思います。  

作成に入る前に今回使用する手法の説明をしたいと思います。  

###  コンテンツベースフィルタリング

コンテンツベースフィルタリングとは、あらかじめ設定・算出した特徴量(ジャンル、色相などなど)から、類似性の分析をしレコメンド対象を決める方法のことです。

コンテンツベースフィルタリングの手法自体もいくつかありますが、今回は<span style="color: #0000cc">K-means(K平均法)クラスタリング</span>と呼ばれる手法を用いて商品の分類を機械学習で行い、ユーザの購入した商品と同じ分類の商品をレコメンドするというモデルの作成を行っていきます。 

####  K-meansクラスタリング

K-meansクラスタリングは、与えられた多くのデータがK個の分類に分けられると仮定し分類していくクラスタリング手法となります。

具体的にどのように分類しているのかを見ていきましょう。  

![K-meansクラスタリングの解説](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124143602.png "K-meansクラスタリングの解説")

上記の図はK=4、つまり4つのグループに分類する場合の流れです。  

* ① 全データの中から適当に4つのデータを選択します。  
* ② それぞれのデータを選択されたデータに最も近いものと同じグループになるように分けます。
* ③ それぞれのグループごとに重心を求めます。 <span style="color: #ff5252">(星マークが重心)</span>
* ④ ②と同様にそれぞれのデータをグループの重心に最も近いものにグループ化しなおします。 
* ⑤ それぞれのグループごとに重心を求めます。

以降繰り返し同じ処理を行っていき、指定回数繰り返すもしくは<span style="color: #ff5252">すべてのグループの重心が不変</span>となった場合に終了します。(Ⓕ)

####  クラスタリングの距離計算法

分析時に、何をもってデータが近いのかと判断する方法はたくさんあるそうです。  
ここでは、PAIでK-meanクラスタリングを用いる際に選択可能な距離の計算法を紹介いたします。  

使用できる距離計算法は、  

* ・ ユークリッド距離法
* ・ 都市ブロック距離法（マンハッタン距離法）
* ・ コサイン類似度

の3つであり、それぞれの概要を記すと、  
ユークリッド距離法は、一般的にもよく使っている方法であり簡単に言うと直線距離のことです。クラスタリング手法でよく使用される計算法です。        
都市ブロック距離法は、軸ごとの差を合計した値となります。外れ値の影響を受けにくい利点がありますが、各軸の差の合計であるため軸が多い場合は全軸が少しずつずれているだけでも距離の差が大きくなる点に注意して使用しましょう。  
ユークリッド距離法は特徴要素全体の差でグループ分けしたい場合に、 都市ブロック距離法は1つ1つの特徴要素の差を重要視してグループ分けしたい場合に使用するべきでしょう。     
コサイン類似度は、クラスタ重心のベクトルと対象データのベクトルの向きの近さで算出します(PAIでの計算は、向きが一致している場合0,正反対の場合1となります)。主に文章の類似度判定に用いられることが多いそうです。他にも、RGB値による色の傾向等でグループ分けする場合等にも使えそうですね。    

下図のように、同じデータでも距離計算方式によって異なる結果となることがわかりますね。

![距離計算法による結果の違い](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124185820.png "距離計算法による結果の違い")

#  学習モデルの作成

手法については学んだので、さっそくPAIを用いて学習モデルを作成していきましょう！  
最初に、今回の最終目標の確認ですが、コンテンツベースフィルタリングで<span style="color: #0000cc">1つの商品に対し2つの商品をレコメンドする処理</span>を作成していきます！(前回の協調性フィルタリングとあわせて1つの商品に対し3つの商品をレコメンドします)

まずは、前回使用したテンプレートをコンテンツベースフィルタリングを組み込めるように整形しましょう。

![テンプレート整形後の画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124132119.png "テンプレート整形後の画面")


整形が完了したら、まずは特徴要素3つのカラムをもつ商品マスタテーブルを作成していきます。  
Alibaba Cloudによって提供されている `cf_data_train`  テーブルの `itemid` が30000までであるため、  30000件の商品疑似データを作成していきましょう。  

今回は、コンテンツベースフィルタリングをすることが目的であるため、初期データ投入用ファイルをそれぞれの特徴量を0から1000の乱数で作成しておきます。  (今回は以下のようなcsvをExcelを用いてあらかじめ用意しました。)   
csvのデータの説明としては、1つめのカラムが商品IDで、2つ目以降が特徴量となっています。

```
1,338,124,83
2,471,821,920
3,195,321,824
```

####  マスタテーブルの作成

では、テーブル作成に移りましょう。  

`Data Source` タブを選択し、 `Create Table` ボタンを押します。  

![テーブル新規作成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124153616.png "テーブル新規作成")

テーブル作成画面が表示されるので、テーブル名とテーブル定義を作成していきましょう。  
K-meansクラスタリングに使用できるカラムの型は、bigint か double となります。

テーブルを作成すると、初期データ投入画面になります。  
先ほど作成したcsvファイルを読み込みデータを投入しましょう。  

![初期データ投入画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124153802.png "初期データ投入画面")

![テーブル作成・データ投入画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124154300.png "テーブル作成・データ投入画面")


投入が完了したら、テーブルを読み込むコンポーネントを配置しましょう。  
方法は簡単で、作成したテーブルをドラッグアンドドロップするだけです。  

![Readコンポーネント配置](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124154634.png "Readコンポーネント配置")


####  K-meansクラスタリング作成

続いて、今回のメイン処理となるK-meansクラスタリング処理の作成をしていきます。  
`Component` タブを開き、 `Machine Learning` > `Clustering` > `K-means Clustering` コンポーネントをドラッグアンドドロップします。  
`item_master` テーブルの出力を、入力の左側に接続します。  

![K-meansクラスタリングコンポーネントの配置](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124155055.png "K-meansクラスタリングコンポーネントの配置")

各種パラメータ等の設定をしていきます。  
`Fields Setteing` は、 Feature Columns に特徴量のカラムを選択しましょう。  
`Parameters Setting` のそれぞれの設定値の意味は以下の通りです。  

* ・ Number of Clusters　 : 　何個のグループに分けるか
* ・ Distance Measurement Method　 : 　距離計算方法
* ・ Centroid Initialization Method　 : 　初期重心の決定方式
* ・ Maximum Iterations 　: 　最大ループ回数(重心を更新する回数)
* ・ Convergence Criterion 　: 　終了条件(前回との重心の差が指定値以下になったら終了)
* ・ Initial Random Seed 　: 　初期重心の決定方式がRandomのときのシード値

####  初期重心の決定方式

初期重心の決定方式ですが、 `Random` , `First K` , `Uniform`  , `K-means++` , `Use the Initial centroid table` が選択できます。  

* ・ Random : ランダムで初期重心を決める
* ・ First K : 入力テーブルの最初のK個を初期重心とする
* ・ Uniform : 入力データをもとに、均等な分布になるようにする  
* ・ Use the Initial centroid table : 外部テーブルから参照する (コンポーネント入力の右側)

K-meansでランダムに初期重心を決めた場合、<span style="color: #ff5252">重心が偏ってしまったりするときれいにクラスタリングができない</span>ことが多くあります。  
その改善手法としてなるべく初期重心を離れたところに作成するような `K-means++` というアルゴリズムが存在しています。  

基本的には `Random` を避けて、他の方式をとるべきでしょう。今回は、  `K-means++ ` を選択します。


![K-meansクラスタリングの設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124155832.png "K-meansクラスタリングの設定")

![K-meansクラスタリングの設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124155841.png "K-meansクラスタリングの設定")


ここで一旦、実行をしてみましょう。  
ただ、左上のRunから実行してしまうと、すべての実行が走ってしまい時間がかかってしまいます。  
各コンポーネントを右クリックすると、そのコンポーネントから開始し接続されている部分だけを実行こともできるので、そちらで実行しましょう。

`item_masterのRead`  コンポーネントから実行します。  

![一部実行方法](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124162828.png "一部実行方法")


`K-means Clustering` コンポーネント出力は3つ存在しています。  
左から順に クラスタリング結果、各グループの重心モデル、各グループの個数 となっています。  
それぞれ、  
*  View Data > View Output Port1  
*  Model Option > View Model  
*  View Data > View Output Port3  
で結果を確認できます

クラスタリング結果を見てみましょう。  
注意点として、<span style="color: #ff5252">PAIから閲覧できるデータは最初の100行のみ</span>となっています。  
もっと多くのデータを見たい場合は、  `DataWorks` プロダクトからSQLを発行しましょう。  


![クラスタリング結果](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124163946.png "クラスタリング結果")

上記結果からわかるように、同じ `cluster_index` となっているデータは特徴が似ているということがわかりますね。  
ついでに、各グループの重心モデルも見て比較しておきましょう。  

![各グループの中心](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124164156.png "各グループの中心")

####  レコメンド商品の決定

これで、各データの分類をすることができました。  
次はこの結果をもとに、どの商品を買ったユーザにどの商品をレコメンドするのかを決めていきましょう。   

まずは、後々の結合をしやすくするために、`cluster_index` をもとに商品IDとレコメンド商品IDの2列となるようにテーブルを結合させましょう。今回は `Join` コンポーネントを用いて行います。  

`Component` タブを開き、 `Data Preprocessing` > `Data Integration` > `Join` コンポーネントをドラッグアンドドロップします。 
クラスタリング結果を、両方のInputに接続しましょう。  

![Joinコンポーネント配置](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124165031.png "Joinコンポーネント配置")

`cluster_index` が一致するものを結合していきます。  
出力するカラムは、それぞれ `item_id` だけでよいですが同じ名前となってしまうので `Columns Output by Right Join Table` で選択する際に、出力名を変更しておきましょう。  

![Join設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124165643.png "Join設定")

![Join設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124165325.png "Join設定")


これで、ユーザの購入した商品と同じグループの商品をレコメンドするためのテーブルとなりましたが、1グループに約300個存在しているためこのままでは非常にたくさんの商品がレコメンド対象になってしまいます。  

なので、1商品あたり2商品までのレコメンドとなるようにSQLを作成しましょう。  

`Component` タブを開き、 `Tools` > `SQL Script` コンポーネントをドラッグアンドドロップします。   
Joinの結果を、一番左の入力に接続しましょう。  

![SQLコンポーネントの配置](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124170206.png "SQLコンポーネントの配置")


SQLは以下のようにして、 `item_id` ごとにランダムで `recommend_item_id` を2件ずつ抽出します。(item_id と recommend_item_id が同じにならないようにもしておきます)  

```sql
SELECT 
    item_id, recommend_item_id
FROM (
    SELECT
        item_id, recommend_item_id,
        ROW_NUMBER() OVER (PARTITION BY item_id ORDER BY RAND()) as recommend
    FROM ${t1}
    WHERE item_id 
!= recommend_item_id
) AS tmp
WHERE recommend <= 2;
```

これで、以下のようにコンテンツベースフィルタリングにより1商品あたりに2商品レコメンドするテーブルが完成しました。

![SQL結果](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124170652.png "SQL結果")


####  協調フィルタリングとの合併

あとは、協調フィルタリングの結果とコンテンツベースフィルタリングの結果を結合させて完了となります。  
テーブル結合は、 `Merge Rows (Union)` コンポーネントを使用します。  

`Component` タブを開き、 `Data Preprocessing` > `Data Integration` > `Merge Rows (Union)` コンポーネントをドラッグアンドドロップします。   
元から存在している協調フィルタリングの結果 - `Join-1` の接続を削除して、  `Merge Rows (Union)`  に接続します。もう一方の入力には先ほどのSQL結果を接続します。    
 そして、 `Merge Rows (Union)`  の結果を `Join-1` に接続します。  

![Unionコンポーネント配置](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124171822.png "Unionコンポーネント配置")

`Merge Rows (Union)` でのカラム選択時に、協調フィルタリングのカラム名と一致するように、コンテンツベースフィルタリングのカラム名を変更しましょう。  

![カラム名変更](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124172117.png "カラム名変更")

実行し、結果を確認してみましょう。  
結果は、 `Join-1` の下の `SQL-based duplicate removal`  の結果が見やすいです。  
協調フィルタリングとコンテンツベースフィルタリングを合わせて、1商品あたり3商品のレコメンドをする学習モデルが完成していることがわかりますね！  
結果の中には、1商品あたり2商品しかないレコードもありますが、これは協調フィルタリング側の結果が0件であるためです。
以上で、一度も買われていない商品をレコメンドする処理の追加は完了となります。  

![最終結果](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613501915481/20200124172412.png "最終結果")



#  おわりに
特徴が類似している商品のレコメンド処理の追加を、簡単に実装することができたと思います。  

今回のようにPAIを用いて機械学習を実装する際の学習コストは用意されているアルゴリズムがどういう考えのものなのか、また、そのアルゴリズムのIN PUT/OUT PUTを理解する程度で十分であり、複雑な計算式等をプログラミングする必要が一切ありません。

PAIを用いれば、今回のように<span style="color: #ff0000">機械学習の初心者でも簡単に学習モデルの作成ができること</span>をお伝えできたかと思います。



