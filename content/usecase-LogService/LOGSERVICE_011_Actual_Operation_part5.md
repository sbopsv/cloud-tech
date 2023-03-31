---
title: "実運用を想定した構成 Part5"
metaTitle: "実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編④～"
metaDescription: "実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編④～"
date: "2019-09-19"
author: "SBC engineer blog"
thumbnail: "/LogService_images_26006613436206900/20190917125527.png"
---

## 実運用を想定したLogService構成⑤


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917140009.png "img")      



今回は、Alibaba Cloudの<span style="color: #ff0000">【LogService】</span>の検索編④を投稿します。   
今回は、ダッシュボードの作成を交えて様々なグラフ作成をご紹介していきます。   

## ログ検索画面までの遷移

まずは、以下の手順でログの閲覧画面まで遷移します。   

1. Alibaba Cloudのコンソール画面へログインし、【LogService】画面を開きます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190724150628.png "img")      

2. 確認対象の`Project`をクリックします。   
ここでは、`webserver-project`をクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190724150645.png "img")      

3. `Logstore`の一覧が表示されます。   
この中から確認対象の`Logstore`を選択します。   
ここでは、`web1-logstore`の`ログ使用モード`配下にある`検索`をクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190724151054.png "img")      

4. 収集したログが表示されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190830162906.png "img")      

次項で、ダッシュボードの作成を実施します。   

## ダッシュボードの作成
グラフを作成後、ダッシュボード化します。   
検索対象のログは、Logstore`web1-logstore` にて収集している全てのサーバの中の/var/log/httpd/access_logを対象とします。   

以下、手順です。

## 横棒グラフを作成し、ダッシュボード化
横棒グラフを作成し、ダッシュボード化します。   
ここでは、アクセス元の上位10をグラフ化します。   


## 横棒グラフの作成（アクセス元上位10を横棒グラフ化）   
以下、手順です。

1. ログの検索期間をグラフ化可能な期間に設定します。   
ここでは、`30日（相対）`に設定します。   

2. ログの集計を実施します。  
ここでは、下記のクエリを入力後`検索と分析`をクリック、もしくは`エンター`を押下します。  
クエリが正常に発行されるとグラフ画面へ遷移します。   

```
\* and \_\_tag\_\_\:\_\_path\_\_ \: /var/log/httpd/access_log | with_pack_meta | select "remote_addr" , pv, pv \*1.0/sum(pv) over() as percentage from( select count(\*) as pv , "remote_addr" from (select "remote_addr" from log) group by "remote_addr" order by pv desc) order by pv desc limit 10
```

3. グラフ画面後、`横棒グラフ`を選択します。   

4. グラフが表示されます。   

5. `プロパティ`を選択すると、グラフの調整が可能です。   
ここでは、デフォルト値のまま作成します。   

6. `ダッシュボードに追加`を選択します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917125527.png "img")      

## グラフをダッシュボードへ追加   
前項に引き続き、作業を実施します。  

1. `ダッシュボードに追加`の画面で、`新規ダッシュボードを作成`を選択します。   
`ダッシュボード名`と`チャート名`は任意の値を設定します。
ここでは、下記の通り設定します。   
ダッシュボード名：`test-dashboard`   
チャート名：`アクセス元上位10`   

2. `ダッシュボードに追加`の画面で、`新規ダッシュボードを作成`を選択します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919142829.png "img")      

3. 左ペインに作成したダッシュボード名が表示されたらクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917125558.png "img")      

4. ダッシュボードが表示されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919142940.png "img")      

## 既存ダッシュボードへのグラフ追加   
前項までは、新規ダッシュボードの作成方法でした。  
ここでは、作成済みのダッシュボードへグラフを追加する際の手順について、記載します。  

1.   作成済みのダッシュボードにグラフを追加したい場合は、
`項番6`にて`既存のダッシュボードに追加`を選択し、ダッシュボードを選択します。   
以降の手順は、`ダッシュボード作成`と同様です。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917125802.png "img")      

## その他のグラフ作成およびダッシュボードへの追加
作成したダッシュボードへグラフを追加していきます。  
ここでは、下記のグラフをダッシュボードへ追加します。  

⦿折れ線グラフ（PV数の遷移を折れ線グラフ化）  
⦿円グラフ（閲覧上位5ページを円グラフ化）  
⦿ヒートマップ（アクセス元をヒートマップ化）  

## 折れ線グラフの作成（PV数の遷移を折れ線グラフ化）  
LogServiceの<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/63451.htm?spm=a21mg.p38356.b99.144.6e396566mDowdp">日付と時間の関数</a>を使用し、PV数を日毎に表示させます。   
ここでは、`/var/log/httpd/access_log`の`status`が`200`となっているログを日毎に集計し、折れ線グラフ化します。   

以下、グラフ作成手順です。

1. ログの検索期間をグラフ化可能な期間に設定します。   
ここでは、`30日（相対）`に設定します。   

2. ログの集計を実施します。  
ここでは、下記のクエリを入力後`検索と分析`をクリック、もしくは`エンター`を押下します。  
クエリが正常に発行されるとグラフ画面へ遷移します。   

```
\* and status: 200 | select date_format(date_trunc('day',\_\_time\_\_), '%Y/%m/%d') as date, count(\*) as PV group by date order by date
```
　   
3. グラフの中から`折れ線グラフ`を選択します。

4. `プロパティ`タブにて必要に応じてグラフを編集します。   

5. 折れ線グラフにて、PV数の遷移を可視化することができます。   

6. `ダッシュボードに追加`を選択後、既存のダッシュボードに追加します。   
※ダッシュボードの追加手順は、本記事内の`既存ダッシュボードへのグラフ追加`をご参照下さい。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917134840.png "img")      

## 円グラフの作成（閲覧上位5ページを円グラフ化）  
円グラフを作成し、ダッシュボード化します。   
ここでは、閲覧頻度の多いWEBページの上位5をグラフ化します。   

以下、グラフ作成手順です。   

1. ログの検索期間をグラフ化可能な期間に設定します。   
ここでは、`30日（相対）`に設定します。   

2. ログの検索を実施します。   

```
\* and status\: 200 | select "request_uri" , pv, pv *1.0/sum(pv) over() as percentage from( select count(\*) as pv , "request_uri" from (select "request_uri" from log) group by "request_uri" order by pv desc) order by pv desc limit 5
```
　   
3. グラフの中から`円グラフ`を選択します。

4. `プロパティ`タブにて必要に応じてグラフを編集します。   

5. 円グラフにて、閲覧上位5ページを可視化することができます。   

6. `ダッシュボードに追加`を選択後、既存のダッシュボードに追加します。   
※ダッシュボードの追加手順は、本記事内の`既存ダッシュボードへのグラフ追加`をご参照下さい。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917134859.png "img")      

## ヒートマップの作成（アクセス元をヒートマップ化）  
LogServiceの<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/63458.htm?spm=a21mg.l28256.b99.149.794c1f31miH99z">IP機能</a>を使用し、ヒートマップを表示させます。   
`IP機能`を使用することで、グローバルIPアドレスが属する国、地域、都市を抽出することができます。   
ここでは、ヒートマップとして活用します。

以下、グラフ作成手順です。   

1. ログの検索期間をグラフ化可能な期間に設定します。   
ここでは、`30日（相対）`に設定します。   

2. ログの集計を実施します。  
ここでは、下記のクエリを入力後`検索と分析`をクリック、もしくは`エンター`を押下します。  
クエリが正常に発行されるとグラフ画面へ遷移します。   

```
\* and \_\_tag\_\_\:\_\_path\_\_ \: /var/log/httpd/access_log | SELECT ip_to_geo( remote_addr ) AS geo, COUNT(\*) as count GROUP BY geo ORDER BY count DESC LIMIT 10
```
　   
3. グラフの中から`ヒートマップ`を選択します。   

4. `経度/緯度`は検索クエリの中で定義している`geo`を選択します。
ここでは、クエリの中の`remote_addr`を検索対象とします。

5. `数値カラム`は`count`を使用します。   

6. ヒートマップにて、アクセス元を可視化することができます。  
※<span style="color: #ff0000"><b>【ヒートマップ】</b></span>や<span style="color: #ff0000"><b>【電子地図】</b></span>のように<span style="color: #ff0000"><b>経度/緯度</b></span>の特定を要するものについては、  
　中国・日本を拠点としたグローバルIPアドレスであれば、記載の通り、地図上に表示されていることを確認しました。  
　ただし、その他の国について、いくつか試しましたが、正常に<b><span style="color: #ff0000">地図上に表示されない国</span></b>（シンガポール、シドニー等）もあるため、  
　使用の際はご注意下さい。  

7. `ダッシュボードに追加`を選択後、既存のダッシュボードに追加します。   
※ダッシュボードの追加手順は前項のここでの手順は割愛します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143130.png "img")      


以上でダッシュボードの作成作業が完了です。   
次項でダッシュボードの編集方法をご紹介します。

## ダッシュボードの編集

1. 作成した`ダッシュボード`を選択します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143229.png "img")      

2. グラフがダッシュボードとして追加されます。   

3. ダッシュボードを編集するために`編集`をクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143402.png "img")      

4. `編集用のバー`が表示されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143432.png "img")      

5. グラフのクエリ等を編集する場合は、グラフ内の`編集`をクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143515.png "img")      

6. グラフの編集画面に遷移します。   
今回は、変更しませんが、クエリやグラフの種類を修正したい場合は、こちらで修正します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917125941.png "img")      

7. `インタラクション`タブでは、グラフをクリックした際の挙動を定義します。   
今回は、`無効化`とします。   

8. 設定変更を反映させたい場合は、`OK`、設定変更を行わない場合は`キャンセル`をクリックします。   
今回は、設定変更を行わないため、`キャンセル`をクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917125954.png "img")      

9. 各種グラフのサイズを変更し、適切な位置に配置します。  

10. `保存`をクリックし、ダッシュボードを保存します。   

11. ポップアップが表示されたら`OK`をクリックします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143603.png "img")      
　　　

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917130023.png "img")      

12. 下記の通り、ダッシュボードが作成されました。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143649.png "img")      

## ダッシュボードの活用   
本項では、作成したダッシュボードの活用方法について、いくつかご紹介します。  

## グラフ操作
1. ダッシュボード化したグラフは、時間軸を一括変更可能です。   
必要に応じて、時間軸を変更して下さい。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143759.png "img")      

2. ダッシュボード内のグラフは、グラフ毎に図内に記載されているような詳細情報の表示が可能です。   
詳細については、<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/102533.htm?spm=a21mg.l28256.b99.201.2e361f31I7VEfb">こちらの公式ドキュメント</a>をご参照下さい。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143808.png "img")      

## ダッシュボードのメール添付   
作成したダッシュボードについては、`サブスクライブ`機能を使用し、定期的にメール添付することが可能です。   

以下、手順です。   

1. ダッシュボード画面にて`サブスクライブ`をクリックします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143903.png "img")      

2. サブスクリプションの作成画面にて、`サブスクリプション名`、`送信頻度`を設定します。   

3. `次へ`をクリックします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919143950.png "img")      

4. `送信方法`、`宛先`、`件名`を設定します。  

5. `送信`をクリックします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917130135.png "img")      

6. 下記のポップアップが表示されたら`OK`をクリックします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917130145.png "img")      

7. 受信したメールには、下記の通り、ダッシュボードが表示されます。  

8. メール内のリンクをクリック後、AlibabaCloudアカウントへログインすることで、  
LogServiceのダッシュボード画面へ遷移することができます。  

9. `ダウンロードボタン`をクリックすることで、`png形式`でダッシュボードをダウンロードすることが可能です。  
　   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190919144026.png "img")      


## まとめ   
今回は、ダッシュボードの作成を実施しました。こちら、ご参考に頂ければ幸いです。    



