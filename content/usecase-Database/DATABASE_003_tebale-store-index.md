---
title: "TableStoreのインデックス機能"
metaTitle: "TableStoreのインデックス機能の紹介"
metaDescription: "TableStoreのインデックス機能の紹介"
date: "2020-07-03"
author: "SBC engineer blog"
thumbnail: "/Database_images_26006613589299100/20200624162717.png"
---

## TableStoreのインデックス機能

# はじめに  

本記事では、Alibaba CloudのNoSQLプロダクトである「TableStore」に最近追加された「事前定義属性」「インデックス」機能について紹介します。  

なお、本ブログは国際サイトの上海リージョンを使用して作成しております。  
また、本ブログではテーブルの作成手順に関しては省略します。 

# 事前定義属性について  

TableStoreではPrimary Key(以下PK)以外の列を「属性」といいます。  
TableStoreはフルマネージドRDBMSサービスであるRDSと比較して決まった型と列は持たず、行ごとに属性名や型を自由にPUTすることができます。  
といっても、実際に運用する際には属性名や型を固定して入れることが多いと思われます。  

その時に利用できる機能として、「事前定義属性」という機能が存在します。  
事前定義属性は以下の特性を持ちます。  

* あらかじめ属性名に対して型を固定することができる  
* グローバルセカンダリインデックスの適用が可能になる (グローバルセカンダリインデックスの項で後述します)  

ここでは、属性の型固定に関して説明をします。  
TableStoreはPKの型は固定されていますが属性に関しては、以下のように行によって同じ属性名でも別の型で入力することが可能となっています。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162638.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162634.png "img")      


事前定義属性を用いると、この型が固定されて他の型で入力しようとした場合にエラーが返ってくるようになります。
そのため、アプリケーション実装時にはフィールドの型を確定させることができるため、Put・Get時のパースエラーを予防することが可能になります。

では、作成方法を説明していきます。  
コンソールのテーブル画面の「Details」タブを開き、「Add Pre-defined Column」をクリックします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624163245.png "img")      

「Add」ボタンを押し、属性名と型を指定しOKを押せば属性の事前定義は完了です。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162647.png "img")     

つづいて、コンソール上からデータ入力をしてみます。  
「Data Edit」タブをクリックし、「Insert」ボタンを押します。  
Insert画面では以下のようにあらかじめ事前定義した属性が表示されています。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162651.png "img")     

ここで、補足ですが事前定義属性はあくまで型を固定するものであり、必須属性になるというわけではありません。  
事前定義した属性が欠けていても入力は成功します。  

次に別の型を入れた場合どうなるのかを見てみましょう。  
Insert画面で、事前定義した属性のごみ箱マークを押し一旦削除します。  
「Add Column」を押し、同じ属性名で別の型を入れて実行します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162656.png "img")     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162707.png "img")     

結果は、以下の通りエラーが返ってきます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162712.png "img")     

間違った型でデータ投入することは無くなりますね。  
また、事前定義属性は「DescribeTable」APIで定義情報が取得できるので、アプリケーション側でデータ投入前に型チェック等の処理を入れることが可能になります。  
以上で事前定義属性の説明は終わりです。  


# TableStoreの範囲取得(GetRange)に関して  
インデックスの説明に入る前に、まずはTableStoreの範囲取得（GetRangeAPI）の仕様に関して説明します。  
解説用に以下のような気象情報のテーブルを作成しました。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162717.png "img")      

このテーブルから、「Prefecture(都道府県)が東京」の行だけを取得しようとして以下のような範囲取得を実行します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162415.png "img")     

しかしながら、これではうまく取ることができずに全件取得となってしまいます。  

これは、TableStoreの仕様上正しい結果となっています。  
それでは範囲取得の仕様について解説していきます。  

TableStoreはRDBMSのようにPK列ごとにインデックスが適用されるのではなく、1行に対しインデックスが適用されています。  
そのため、上記の検索では以下のような範囲で取得するため全件取得となるわけです。  
補足の説明ですが、<span style="color: #ff0000">取得の範囲としては「MIN設定行 <= X < MAX設定行」となります。MAX設定行は存在していても取得範囲外</span>となるので注意しましょう。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200625134642.png "img")     

テーブル作成時に「Prefecture」,「Time」の順で作成していれば、検索は以下の範囲となり取得の条件が満たせます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200625134701.png "img")     

しかしながら、「Prefecture」でも「Time」でも取得したい場合、PK順の制御だけでは不可能です。  
そこで登場するのがインデックス機能となります。  

# インデックス機能  
TableStoreのインデックス機能は2種類存在しています。  

1つ目は、グローバルセカンダリインデックスと呼ばれるもので、既存のテーブルからPKの順序を変更した別の検索用テーブルを作成するものです。  
2つ目は、検索インデックスと呼ばれるもので、既存のテーブルにPK、属性ごとにインデックスを貼りSQLのWhere句のような検索機能を実現するものです。  

2020年6月現在、グローバルセカンダリインデックスは全リージョン使用可能ですが、<span style="color: #ff0000">検索インデックスは中国の一部(杭州、上海、北京、張家口、深セン、香港)とシンガポール、インドのリージョンでしか使用できません。</span>

インデックスを作成する主なメリットとしては、  

* PK以外の列でも検索可能になる
* 取得したい行だけを取得できるので、読み込み時の課金を抑えることができる  

というメリットがあります。  

# グローバルセカンダリインデックス  
先ほどの解説で使用した気象情報のテーブルにグローバルセカンダリインデックスを作成していきます。  
コンソールから、「Manage Index」を選択し、「Create Index」をクリックします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162438.png "img")      

一番上のIndex Typeを「Secondary Index」にします。(画像の赤枠)  
Index Nameは任意の値にします。ここで設定した値がGetRangeAPIでデータを取得する際のテーブル名となります。  
Index Nameの下のIndex Typeは既存のテーブルのデータを対象にするか否かです。(画像の青枠)  
Includeにした場合は既存のデータを含めて検索対象になります。  
Excludeにした場合は、作成後にテーブルに書き込んだデータのみが検索対象になります。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162442.png "img")     

続いてPKの順番を決めていきます。  
「Add Primary Key Column」の左にあるプルダウンから選択をし、「Add Primary Key Column」ボタンを押すことで追加されます。 
またこの時、事前定義属性で定義しているかつ、PKで使用できる型(String、Integer、Binary)であれば、事前定義属性をPKにすることが可能となっています。
事前定義属性をPKにした場合の注意点ですが、Putした行にPKにした属性が含まれていない場合はグローバルセカンダリインデックスにデータは投入されません。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162447.png "img")      

事前定義属性を含めて、最大4つまで選択が可能です。  
元のテーブルに存在し、ここで選択されなかったPKは選択の後続に順序どおりにPKとして設定されます。  
通常のテーブルのPKは最大4つですが、元のテーブルにPKが4つありグローバルセカンダリインデックスの選択で事前定義属性を4つPKにした場合は、PKが8つのテーブルが作成されます。  
例) 今回使用してるテーブルで「Temperature」をPKにして作成した場合、  「Temperature」「Time」「Prefecture」がグローバルセカンダリインデックスのPKになる

続いて、表示する属性(取得できる属性)を設定します。  
「Add PreDefined Column」の左にあるプルダウンから選択をし、「Add PreDefined Column」ボタンを押すことで追加されます。  
ここで注意点ですが、グローバルセカンダリインデックスからデータを取得した際に取得できる属性はここで追加したもののみとなっています。<span style="color: #ff0000">つまり、事前定義していない属性に関してはデータを取得することができません。</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162451.png "img")      

最後にOKボタンを押して、作成が完了となります。  
データ取得方法に関しては、通常のテーブルと同じで「GetRow」か「GetRange」のAPIをコールすることで取得できます。(API実行時、テーブル名のパラメータをグローバルセカンダリインデックス名とします。)    
コンソールの場合は、「Manage Index」タブから、対象インデックスの「Index Query」をクリックして取得します。  
ここでは、コンソールから取得してみましょう。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162502.png "img")      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162507.png "img")     

結果は以下の通りです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162512.png "img")      

無事に東京のデータが取得できましたね。  
ちなみに、前述したとおり事前定義属性をPKにすることができるので新しくグローバルセカンダリインデックスを作成し試してみました。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162517.png "img")     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162527.png "img")      

最後にグローバルセカンダリインデックスを利用する際の注意点を紹介します。  
1つ目は<span style="color: #ff0000">データの投入前に属性の事前定義をしておく必要がある</span>ことです。既にデータが投入されている属性を後から事前定義しても、事前定義以前に投入しているデータはインデックスの対象外となります。    

2つ目は課金面についてです。グローバルセカンダリインデックスは内部的には別テーブルを作成しています。そのため、<span style="color: #ff0000">グローバルセカンダリインデックスに対する書き込み/読み込みコスト、およびストレージ消費コストが追加でかかる</span>点に注意しましょう。また、<span style="color: #ff0000">元テーブルからデータを射影する際に元テーブルに対する読み込みコスト</span>も発生します。    

3つ目は、インスタンス内に作成できる上限についてです。グローバルセカンダリインデックスは内部的には別テーブルなため、<span style="color: #ff0000">テーブル数としてカウントされます</span>。

以上でグローバルセカンダリインデックスの説明は終わりになります。  

# 検索インデックス  
今度は同じ気象情報のテーブルに検索インデックスを作成していきます。  
コンソールから、「Manage Index」を選択し、「Create Index」をクリックします。  

Index Typeを「Search Index」にします。(赤枠)  
既にデータが投入されている場合は、Schema Generation Typeの「Auto Generate」を選択すると、  データが存在する列が自動的に追加されます。(青枠)    
タイピングミスを防ぐためにも、「Auto Generate」の使用をお勧めします。   
テーブル作成直後にインデックスを作成する場合は、ひとつひとつ入力する必要があります。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162532.png "img")     

今回はすべての列に対し、インデックスを貼りますのでこのままOKを押します。  
補足ですが、グローバルセカンダリインデックスは明示的に取得可能な列を設定する必要がありましたが、検索インデックスの場合はインデックスの有無に限らず全列データ取得が可能となっています。  
また、インデックスを貼った列のデータサイズが課金対象となるので、クエリで使用したい列のみインデックスを貼ることをお勧めします。  

では、クエリを発行してみましょう。  
コンソール上での画面は以下のようになっています。  
検索インデックスによる検索では、ソート順も指定することが可能です。(青枠)  
ソートのみでも実行可能で、その場合は全行取得となります。 

例では、「都道府県が東京の気象データを気温が高い順」に取得します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162538.png "img")     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162545.png "img")      

今度は、2つの条件でクエリを発行してみます。  
例では、「降水量が1以上、風向きが「北」から始まる気象データ」を取得します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162551.png "img")     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162556.png "img")      

クエリ画面や結果から分かる通り、検索インデックスによる検索ではSQLのWhere句のような取得をすることが可能となっております。

また、検索インデックスには配列データに対する検索やJSON文字列による入れ子構造での検索が可能となっています。  
試しに、以下のような学生情報を持つテーブル・データを作っておきました。  
この時の型はすべて「String」となっています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162607.png "img")      

(少し画像が小さくなってしまったので、重要な部分のみ拡大します。)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624172754.png "img")      

Index作成画面では、配列の場合は型を配列の中身に合わせた型にしArray列のトグルボタンをONにします(赤枠)、JSON構造の場合対象の属性の型を「Nested Document」にして作成します。  
「Nested Document」にしたデータはネストしたデータの属性名と型をさらに設定する必要があります。(青枠)  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162600.png "img")     

では、検索してみましょう。  まずは、配列の場合の検索です。  
配列の場合は、中身のどれかが検索条件にヒットしたら取得対象となります。  
例として、今回作成したテーブルに対し「過去の試験で10位以内に入ったことがある学生」を取得してみます。  
クエリは以下の通りです。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162612.png "img")     

結果はこちらです。想定通りの結果が得られていますね。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162617.png "img")      

続いて、JSON構造のデータに対してクエリを発行してみます。  
例として、「年齢が19歳で、血液型がO型の学生」を取得してみます。  
クエリは以下の通りです。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162621.png "img")     

結果はこちらです。想定通りの結果が得られていますね。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613589299100/20200624162628.png "img")      

JSON構造のデータを入力する際の注意点として、必ず配列形式で入力する必要があります。  

例) 
```
[{"key1":"value1","key2":123}]
```

また、ソート等には使用できないという制限もあります。  

説明は以上になります。  
今回は、コンソール上からの検索取得でしたがAPIでの実行も可能です。グローバルセカンダリインデックスとは異なり個別のAPIとなっています。    
詳細およびサンプルコードは以下の公式ドキュメントからご確認ください。  

https://www.alibabacloud.com/cloud-tech/doc-detail/117453.htm

# インデックスを利用する際の注意点  
便利なインデックス機能ですが、利用する際には以下の注意点があります。  

* テーブルのオプションでTTLが有効もしくはMax versionが2以上に設定されている場合にはグローバルセカンダリインデックス、検索インデックスともに作成ができません。  
* インデックス作成は非同期に行われるため、リアルタイム性の高い処理に対しては検討が必要となります。
* グローバルセカンダリインデックスを作成する場合、PKを日付や時刻とすると更新に時間がかかる懸念があるため、そのような場合には、日付や時刻をハッシュ化して格納することを推奨します。  

# 最後に
今回は、TableStoreに追加された「事前定義属性」と「インデックス」機能について紹介をしました。    
「事前定義属性」と「インデックス」機能を使いこなすことによって、検索が容易になり以前のように全件取得してから走査する処理が必要なくなり、使いやすいプロダクトになってきたと思われます。    
TableStoreでサービス開発をする際、インデックスなどの考え方について参考に頂ければ幸いです。    

