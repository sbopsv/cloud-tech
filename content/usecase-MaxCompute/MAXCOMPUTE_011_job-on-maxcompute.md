---
title: "Jobを設定する方法"
metaTitle: "MaxComputeでJobを設定する"
metaDescription: "MaxComputeでJobを設定する"
date: "2021-03-17"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613699521700/20210316121020.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## MaxComputeでJobを設定する

本記事では、DataWorksのジョブ処理を使って、MaxCompute Tableで定期的なデータ格納処理をする方法について説明します。


# 前書き

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute


    
今回はDataWorksを使って、MaxComputeで定期的にデータを格納・処理するジョブを設定してみましょう。     
* 基本モードと標準モードどちらでも良いですが、今回は標準モードとして説明しています。    
* Table作成や本番環境へのコミットとか基本的なことは過去エントリにて説明していることや、今回説明する事項が多いので、基本的な操作部分を一部省略しています。   

---

# デプロイ後実施のサイクルジョブの設定
ここは５分おきにテーブルのインポート、テーブルのインサート処理を行いたいという例で実施します。    

## STEP1: ワークフローの作成
DataWorks WorkStdio画面から、新規でワークフローを作成します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316105058.png "img")



## STEP2: ソーステーブルを作成し、ソースデータをインポートする
ワークフローの中身（Node）は現在空白状態と思うので、ソーステーブルを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316105201.png "img")

上にある[ DDL Statement] からSQLでソーステーブルのフィールドを作ります。下段にある[Create Field]などのボタンで手動でフィールド作成もできます。     
```
CREATE TABLE table_demo1 (
  shop_name     string,
  customer_id   string,
  total_price   double,
  comments      string,
  sale_date     string,
  region        string
);
```

ソーステーブル作成後、コミットします。（標準モードのみ）   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316105918.png "img")

ソーステーブルは現在レコードらデータがない状態なので、データをインポートします。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316110014.png "img")

インポート元のファイルのフィールドと、ソーステーブルのフィールドを合わせます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316110100.png "img")

display名を入力後、本番環境（production environment）へコミットします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316110217.png "img")


## STEP3: ターゲットテーブルの作成
同じ要領で、今度はMaxComputeのメニューバーからCreate Tableでターゲットテーブルを作成します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316111120.png "img")

上にある[ DDL Statement] からSQLでターゲットテーブルのフィールドを作ります。下段にある[Create Field]などのボタンで手動でフィールド作成もできます。     
```
CREATE TABLE result_demo1 (
    region  string
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316111138.png "img")

ターゲットテーブル作成後、コミットします。（標準モードのみ）   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316112147.png "img")

## STEP4: 開始ノードの作成、SQLノードのインポート、SQLノードの挿入  
ソーステーブル、ターゲットテーブルを作成したら、ジョブらワークフローを成立させるために、開始ノードやSQLノードなどを挿入します。まずは開始ノードを作成します。    
開始ノード（Zero-Load Node）でノードの名前を「Start_R」としています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316112245.png "img")

次はテーブルのインポートを行うノードを作成します。ODPS SQLノードでノードの名前を「import_R」としています。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316112609.png "img")

最後にテーブルのインサートを行うノードを作成します。ODPS SQLノードでノードの名前を「imsert_R」としています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316112737.png "img")

ここまで、ノードの設定が出来ていれば、以下の図のようになります。もしワークフローとしてリンク（図で灰色の矢印）が繋がっていない場合は新たに接続します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316112933.png "img")



## STEP5: ノードプロパティの設定(5分ごとに繰り返し)
Start_Rノードにて、右側のPropertiesメニューバーから、ノードプロパティを設定します。以下画像のように、５分ごとに実施するように設定します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316113155.png "img")

続いて、import_R ノードで 以下のSQLクエリを入力します。このSQLクエリはジョブ実行時に実行されるSQL文です。     

```
INSERT INTO table_demo1(customer_id,shop_name,region,total_price,sale_date,comments ) VALUES ('ibp16rdks1akepepb63wv' , 'jd', 'hangzhou',101, '20190111', 'test' );
INSERT INTO table_demo1(customer_id,shop_name,region,total_price,sale_date,comments ) VALUES ('ibp16rdks1akepepb61wv' , 'jd', 'hangzhou',102, '20190111', 'test' );
INSERT INTO table_demo1(customer_id,shop_name,region,total_price,sale_date,comments ) VALUES ('ibp16rdks1akepepb13wv' , 'jd', 'hangzhou',103, '20190111', 'test' );
INSERT INTO table_demo1(customer_id,shop_name,region,total_price,sale_date,comments ) VALUES ('ibp16rdks1akepepb63wv' , 'jd', 'JP',101, '20190111', 'test' );
```
  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316113359.png "img")

同じく、import_R ノードでノードプロパティを設定します。以下画像のように、５分ごとに実施するように設定します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316113602.png "img")


import_R ノードのノードプロパティで下画面側に、依存関係の設定（Dependencies）がありますので、そこへ移動します。      
そこで出力先として「table_demo1」を追加します。 するとOutput Nodeリスト一覧で、出力先にtable_demo1が追加されてることがわかります。    
設定が終わったらコミットします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316114421.png "img")

続いて、Insert_R ノードへ遷移し、 以下のSQLクエリを入力します。    
```
INSERT OVERWRITE TABLE result_demo1 
SELECT region from table_demo1 where region='hangzhou';
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316114912.png "img")


同じく、Insert_R ノードでノードプロパティを設定します。以下画像のように、５分ごとに実施するように設定します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316115111.png "img")

Insert_R ノードのノードプロパティで下画面側に、依存関係の設定（Dependencies）がありますので、そこへ移動します。      
画像の図のようにtable_demo1を親ノードの出力を入力として設定します。       
設定が終わったらコミットします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316115407.png "img")


## STEP6: タスクの実行
ここまで問題なく設定できていれば、今度はタスクを実行します。まずはDataWorks DataStdio画面の「Deploy」バーから「Create Deploy Task」画面へ遷移します。   
タスク一覧が表示されてるので、対象のタスクを選定し、「Deploy Selected」でDeployタスクをセットします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316115711.png "img")


## STEP7: サイクルインスタンスと実行ログのチェック

タスクの実行結果として、タスクのサイクルをチェックします。   メニューバーから「Operation Center」で、「Cycle Instance」を選定します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316120654.png "img")

Import Nodeのタスクのサイクルログが表示されます。時間帯から、タスクが５分おきに実施されていることがわかります。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316121020.png "img")

Import Nodeのサイクルインスタンスの詳細を確認します。右側にて、図のようなConfigがありますので、「More」をクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316121215.png "img")

すると、Import Nodeのタスクのサイクルログの詳細が確認できます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316122244.png "img")

今度は、Insert Nodeのタスク結果を確認してみます。    
Insert Nodeのタスクのサイクルログが表示されます。時間帯から、タスクが５分おきに実施されていることがわかります。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316122708.png "img")

Insert Nodeのサイクルインスタンスの詳細を確認します。右側にて、図のようなConfigがありますので、「More」をクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316122729.png "img")

Insert Nodeのタスクのサイクルログの詳細が確認できます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316122756.png "img")


## STEP8: ターゲットテーブルをチェック

タスクらジョブは無事実行されたけど、それがターゲットテーブルにどのように反映しているか、正常性を含め確認します。DataMapから確認します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316121833.png "img")

これでデータがターゲットテーブルに正しく挿入されたことが確認できました。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316121936.png "img")



---
---

# 条件分岐ジョブの設定仕方
ここは今日が月初めの日なら初日専用のshell、それ以外の日なら、初日以外のshellを実行したいという例で実施します。       

## STEP1: ワークフローの作成
DataWorks WorkStdio画面から、新規でワークフローを作成します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316123247.png "img")

## STEP2: 割り当てノード、ブランチノード、およびシェルノードの作成
割り当てノード（Assignment Node）を作成します。「Assign_IfFirst」という名前にしています。          
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316124439.png "img")

ブランチノード（Branch Node）を作成します。「Branch_judgeDownRun」という名前にしています。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316124459.png "img")

Shellノード（Shell Node）を２つ作成します。「RunFirst」と「RunExceptFirst」という名前にしています。         

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316124603.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316124530.png "img")


ノード作成後、ワークフローで図のように矢印のコネクトを設定します。     
ここの流れとしては、以下の通りになります。    
1. Assign_IfFirst 割り当てノード（Assignment Node）にて、Pythonスクリプトを作成して、今日が月の最初の日かどうかをチェックします     
2. Branch_judgeDownRun ブランチノード（Branch Node）にて、ノードはAssign_ifFirst割り当てノードからのパラメータを受け取ります    
3.  2の結果で、今日が初日の場合はRunFirstシェルノードを実行し、今日が初日でない場合はRunExceptFirstシェルノードを実行します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316124759.png "img")

## STEP3: 構成割り当てノードにてPythonスクリプトを作成

Assign_IfFirst こと割り当てノード（Assignment Node）にて、Pythonスクリプトを作成します。    
```
# encoding: utf-8
from datetime import datetime as dtime
import datetime

def firstDayOfMonth(dt):
    return (dt + datetime.timedelta(days=-dt.day + 1)).replace(hour=0, minute=0, second=0, microsecond=0)

if firstDayOfMonth(dtime.today()).day == dtime.today().day:
    print(0)  #first day
else:
    print(1)  #not first day
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316125325.png "img")

Assign_IfFirst ノードにて、右側のPropertiesメニューバーから、ノードプロパティを設定します。以下画像のように、５分ごとに実施するように設定します。   
設定が終わったらコミットします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316125520.png "img")

## STEP4: ブランチノードの設定
Branch_judgeDownRun ブランチノード（Branch Node）にて、引数パラメータからの条件に応じたOutput先を設定します。    

Condition：${isFirst}==0     
Associated Node OutputNode：_demo.fisrt_cond.is_first     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316131239.png "img")

Condition：${isFirst}==1     
Associated Node OutputNode：_demo.fisrt_cond.not_first     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316131332.png "img")

Branch_judgeDownRun ノードでノードプロパティを設定します。以下画像のように、５分ごとに実施するように設定します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316131654.png "img")


Branch_judgeDownRun ノードプロパティで下画面側に、依存関係の設定（Dependencies）がありますので、そこへ移動します。      
そこのOutput Nodeリスト一覧で、出力先にis_first、not_first が自動で追加されてると思います。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316131817.png "img")

Branch_judgeDownRun ノードプロパティで日付を検証するパラメータを設定します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316131915.png "img")

設定が終わったらコミットします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316132230.png "img")


## STEP5: Shellノードの設定
Branch_judgeDownRun ノードの分岐処理結果をキャッチし、それぞれ処理するシェルノードを設定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316132838.png "img")

まずはRunFirstシェルノードから設定します。 シェルノードを開いたら、以下コマンドを入力します。    
```
echo "today is first day"
```
引き続き、RunFirstシェルノードでノードプロパティを設定します。以下画像のように、５分ごとに実施するように設定します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316133054.png "img")

RunFirstシェルノードプロパティで下画面側に、依存関係の設定（Dependencies）がありますので、そこへ移動します。      
そこのOutput Nodeリスト一覧で、出力先にis_firstを追加します。    
設定が終わったらコミットします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316133233.png "img")



続いて、RunExceptFirstシェルノードを設定します。 シェルノードを開いたら、以下コマンドを入力します。    
```
echo "today is not first day"
```
引き続き、RunExceptFirstシェルノードでノードプロパティを設定します。以下画像のように、５分ごとに実施するように設定します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316133420.png "img")

RunExceptFirstシェルノードプロパティで下画面側に、依存関係の設定（Dependencies）がありますので、そこへ移動します。      
そこのOutput Nodeリスト一覧で、出力先にRunExceptFirstを追加します。    
設定が終わったらコミットします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316133447.png "img")


ここまで問題なく設定できていれば、今度はタスクを実行します。まずはDataWorks DataStdio画面の「Deploy」バーから「Create Deploy Task」画面へ遷移します。   
タスク一覧が表示されてるので、対象のタスクを選定し、「Deploy Selected」でDeployタスクをセットします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316115711.png "img")

タスクの実行結果として、タスクのサイクルをチェックします。   メニューバーから「Operation Center」で、「Cycle Task」を選定します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316133615.png "img")


タスクの実行結果として、タスクのサイクルをチェックします。   メニューバーから「Operation Center」で、「Cycle Instance」を選定します。    
まずはAssign_IfFirst 割り当てノードのサイクルインスタンスを確認します。      

ここで図のようにタスクのサイクルログが表示されます。時間帯から、タスクが５分おきに実施されていることがわかります。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316133641.png "img")

Assign_IfFirst 割り当てノードのサイクルインスタンスの詳細を確認します。右側にて、図のようなConfigがありますので、「More」をクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316133817.png "img")

すると、Assign_IfFirst 割り当てノードのタスクのサイクルログの詳細が確認できます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316134222.png "img")

次に、Branch_judgeDownRun ブランチノードのサイクルインスタンスを確認します。      
図のようにタスクのサイクルログが表示されます。時間帯から、タスクが５分おきに実施されていることがわかります。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316134403.png "img")

Branch_judgeDownRun ブランチノードのサイクルログの詳細はこの通りになります。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316134435.png "img")


RunFirstシェルノードのサイクルインスタンスを確認します。      
図のようにタスクのサイクルログが表示されます。時間帯から、タスクが５分おきに実施されていることがわかります。   
ここも図のようなConfigがありますので、「More」をクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316135045.png "img")

RunFirstシェルノードのサイクルログの詳細はこの通りになります。    
結果として、今回今日の日付が月初めではないため、RunFirstシェルノードがスキップされました。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316135321.png "img")


RunExceptFirstシェルノードのサイクルインスタンスを確認します。      
図のようにタスクのサイクルログが表示されます。時間帯から、タスクが５分おきに実施されていることがわかります。   
ここも図のようなConfigがありますので、「More」をクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316135150.png "img")

RunExceptFirstシェルノードのサイクルログの詳細はこの通りになります。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316135342.png "img")


---
# 最後に
本記事では、DataWorksのジョブ処理を使って、MaxCompute Tableで定期的なデータ格納処理をする方法を簡単に説明しました。     


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


