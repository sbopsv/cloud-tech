---
title: "実運用を想定した構成 Part4"
metaTitle: "実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編③～"
metaDescription: "実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編③～"
date: "2019-09-03"
author: "SBC engineer blog"
thumbnail: "/LogService_images_26006613407698100/20190830162906.png"
---

## 実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編③～

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190903123318.png "img")      


今回は、Alibaba Cloudの<span style="color: #ff0000">【LogService】</span>の検索編③を投稿します。     
本記事では、前回の記事で触れなかった<b>ログのダウンロード</b>機能について、ご紹介していきます。   



## ログのダウンロード  
LogServiceにて収集したログは、ダウンロードし、手元のテキストエディタ等で参照することが可能です。   
本記事では、<b>GUI</b>でのダウンロードと<b>CLI</b>を使用したダウンロードをご紹介致します。   

## GUIでのダウンロード   
AlibabaCloudのコンソール画面にてログのダウンロードを実施します。   
LogServiceでは、`収集したログ`とクエリ発行後の`集計結果`の2種類がダウンロード可能となりますので、   
それぞれのダウンロード方法について、記載していきます。   

まずは、以下の手順にてログの閲覧画面まで遷移します。   

1. Alibaba Cloudのコンソール画面へログインし、【LogService】画面を開きます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190724150628.png "img")      

2. 確認対象の`Project`をクリックします。   
ここでは、`webserver-project`をクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190724150645.png "img")      

3. `Logstore`の一覧が表示されます。   
この中から確認対象の`Logstore`を選択します。   
ここでは、`web1-logstore`の`ログ使用モード`配下にある`検索`をクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190724151054.png "img")      

4. 収集したログが表示されます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830162906.png "img")      

次項で、ログのダウンロードを実施します。


## 収集したログのダウンロード   
GUI上でログのダウンロードを実施します。   
検索対象のログファイルは、サーバIPアドレス`172.16.12.83`の中の`/var/log/httpd/access_log`を対象とします。   

なお、GUIでのログダウンロードについては、画面上に表示されているログのみがダウンロード対象となります。   
1度に画面上に表示できる行数はデフォルト`20`行、最大`100`行のため、100行以上のログをダウンロードする場合は、   
`次のページ`をクリックし、次頁に遷移して続きのログのダウンロードを実施、または、後述する`CLI`でのダウンロードを実施して下さい。   

以下、手順です。   

1. ログの検索期間を`1週（相対）`にします。   

2. ログの検索を実施します。  
検索は、<a href="https://www.sbcloud.co.jp/entry/2019/07/26/log-service_unyo_2/#%E3%83%AD%E3%82%B0%E3%81%AE%E6%A4%9C%E7%B4%A2">こちらの記事</a>の【ログの検索】を参考にログを検索します。  
※クエリを手動で入力する場合は、下記クエリを入力後`検索と分析`をクリック、もしくは`エンター`を押下します。  
```cpp
* and source: 172.16.12.83 and __tag__:__path__: /var/log/httpd/access_log
```
　
3. 検索したログが表示されたことを確認します。   

　
4. `1ページあたりのログ`が`20`であるため、デフォルトでは、ダウンロードできるログは画面上に表示されている20行のみです。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830162922.png "img")      

　
5. ログのダウンロードボタンをクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830162937.png "img")         

　
6. ログのダウンロード用のポップアップが表示されたら`このページのログをダウンロードします。`を選択します。   

　
7. `OK`をクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830162949.png "img")      

　
8. 検索したログが<b>CSV形式</b>で端末に保存されます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163004.png "img")      

　
9. CSVファイルには、以下のような形式でログが保存されます。   
　　なお、デフォルトの場合は、`20`行以上のログは表示されません。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163016.png "img")      

　
10. ログの表示行数は下記を変更することによって、1ページあたり`100行`に変更することが可能です。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163027.png "img")      

　
## 集計結果のダウンロード   
LogServiceを使用して集計した結果をGUI上からダウンロードします。   

以下、手順です。   

1. ログを集計します。
集計は、<a href="https://www.sbcloud.co.jp/entry/2019/08/27/log-service_unyo_3/#%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E5%85%83%E3%82%92status%E3%81%A7%E7%B5%9E%E3%81%A3%E3%81%A6%E9%9B%86%E8%A8%88">こちらの記事</a>の【アクセス元をstatusで絞って集計】を参考に実施します。    
ここでは、`/var/log/httpd/access_log`にて収集したログの中から`status`が`200`のものを`アクセス元`毎に上位順に集計しております。   

2. クエリを手動で入力する場合は、下記クエリを入力後`検索と分析`をクリック、もしくは`エンター`を押下します。   
```
* and status : 200 | with_pack_meta | select "remote_addr" , pv, pv *1.0/sum(pv) over() as percentage from( select count(1) as pv , "remote_addr" from (select "remote_addr" from log limit 100000) group by "remote_addr" order by pv desc) order by pv desc limit 10
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163040.png "img")      

　
3. `ログのダウンロード`をクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163054.png "img")      

　
4. ログのダウンロード用のポップアップが表示されたら`このページのログをダウンロードします。`を選択します。   

　
5. `OK`をクリックします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163109.png "img")      

　
6. 集計結果が<b>CSV形式</b>で端末に保存されます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163126.png "img")      

　
7. CSVファイルには、以下のような形式で集計結果が保存されます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163139.png "img")      


## CLIでのダウンロード   
LogServiceでは、<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/90765.htm">【AlibabaCloudCLI】</a>ではなく、   
<a href="https://aliyun-log-cli.readthedocs.io/en/latest/tutorials/tutorial_en.html">【aliyun-log-cli】</a>を使用してLogService内の操作を行います。   
【aliyun-log-cli】とは、LogService専用のCLIであり、Logstore等の作成/参照/更新/削除のCRUD操作がCLIから可能となります。   
また、GUIでのログダウンロードの上限が最大`100行`でしたが、CLIを使用することにより、`100行以上`のログをダウンロードすることが可能となります。   

下記にECS（CentOS7.6 64bit）へのaliyun-log-cliのインストール手順を記載します。   

1. <a href="https://www.alibabacloud.com/cloud-tech/doc-detail/53045.htm">こちら</a>を参考に、`AccessKeyId`と`AccessKeySecret`を作成します。   

2. 作業対象のECSへログインし、下記のコマンドを投入します。   
```
pip install aliyun-log-cli
```

　
3. 下記のメッセージが表示され、エラーなくインストールができることを確認します。   
```
Successfully installed
```

　
4. 項番`1`にて取得した、`AccessKeyId`と`AccessKeySecret`を用いて、<b>aliyun-log-cli</b>の<b>profile</b>を作成します。   
　　下記のコマンドを投入します。   
```
aliyunlog configure <AccessKeyId> <AccessKeySecret> <endpoint>
```
　  ※`endpoint`は<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/29008.htm">こちら</a>をご参照の上、環境に合わせて入力して下さい。  
　　　なお、本記事では、`クラシックネットワークエンドポイント`の東京 (日本)リージョン`ap-northeast-1-intranet.log.aliyuncs.com`を     
　　　指定しております。  
　　　`パブリックネットワークエンドポイント`を使用する場合は、CLIを発行するECSにてインターネットアクセスが必要となります。

　
5. 下記のコマンドにて、profileが作成されていることを確認します。      
```
# cat /root/.aliyunlogcli
```
```
[main]
access-id = XXXXXXXXXX
access-key = XXXXXXXXXXXXX
region-endpoint = ap-northeast-1-intranet.log.aliyuncs.com
```
aliyun-log-cliの初期設定は以上です。   
次項より、ログのダウンロードを実施します。

## 収集したログのダウンロード
検索対象のログファイルについては、GUIでのログダウンロードと同様に   
サーバIPアドレス`172.16.12.83`の中の`/var/log/httpd/access_log`を対象とします。   

以下、手順です。

1. GUIでのログダウンロードと同様に収集対象ログを検索した後、`ログのダウンロード`ボタンを押下します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163205.png "img")      

2. ログのダウンロード用のポップアップが表示されたら`コマンドラインツールからすべてのログをダウンロードする。`を選択します。   

3. CLIにて使用できるコマンドが表示されます。

4. `コマンドのコピー`を押下し、クリップボードにコピーした後、テキストエディタに貼り付けます。   

5. `キャンセル`をクリックし、ポップアップを閉じます。   
なお、OKをクリックした場合は、<a href="https://aliyun-log-cli.readthedocs.io/en/latest/tutorials/tutorial_get_logs_en.html">aliyun-log-cliのドキュメントページ</a>へ遷移します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163219.png "img")      

6. コマンドの編集を行います。   
編集前のコマンドは以下の通りです。   
```
aliyunlog log get_log_all --project="webserver-project-01" --logstore="web1-logstore" --query="* and source: 172.16.12.83 and __tag__:__path__ : /var/log/httpd/access_log" --from_time="2019-08-22 17:25:39+09:00" --to_time="2019-08-29 17:25:39+09:00" --region-endpoint="ap-northeast-1-intranet.log.aliyuncs.com" --format-output=no_escape --jmes-filter="join('\n', map(&to_string(@), @))" --access-id="【ステップ 2 のアクセス ID】" --access-key="【ステップ 2 のアクセスキー】" >> /downloaded_data.txt
```

　   7. ログの抽出時間帯を任意の時間帯に修正します。   
```
--from_time="2019-08-22 00:00:00+09:00" --to_time="2019-08-30 00:00:00+09:00"
```

　   8. 本記事では、profileの設定にて下記3つの`値`は設定済みであるため、削除します。   
```
--region-endpoint=XXXXX
--access-id=XXXXX
--access-key=XXXXX
```

　   9. ログの出力先を任意のファイルパスに変更します。   
　   　本記事では、`/tmp/`配下に出力とし、任意のファイル名に変更し、拡張子を`csv`とします。
```
>> /tmp/172.16.12.83-access_log-test.csv
```

　   10. 編集後のコマンドは以下の通りです。   
　   　このコマンドをaliyun-log-cliが使用できる環境のECSで実行します。   
```
aliyunlog log get_log_all --project="webserver-project-01" --logstore="web1-logstore" --query="* and source: 172.16.12.83 and __tag__:__path__ : /var/log/httpd/access_log" --from_time="2019-08-22 00:00:00+09:00" --to_time="2019-08-30 00:00:00+09:00" --format-output=no_escape --jmes-filter="join('\n', map(&to_string(@), @))" >> /tmp/172.16.12.83-access_log-test.csv
```
　   11. CSVファイルの内容は以下のような形式となります。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190902102545.png "img")      

## 集計結果のダウンロード
GUIでの集計と同様に`/var/log/httpd/access_log`にて収集したログの中から`status`が`200`のものを`アクセス元`毎に上位順に集計します。    

以下、手順です。   

1. GUIでの手順と同様にクエリを発行し、集計を実施した後、`ログのダウンロード`ボタンを押下します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163252.png "img")      

2. ログのダウンロード用のポップアップが表示されたら`コマンドラインツールからすべてのログをダウンロードする。`を選択します。   

3. CLIにて使用できるコマンドが表示されます。   
クエリ内にてselect文にて集計されていることが確認できます。   

4. `コマンドのコピー`を押下し、クリップボードにコピーした後、テキストエディタに貼り付けます。   

5. `キャンセル`をクリックし、ポップアップを閉じます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163303.png "img")      

6. ログダウンロード時と同様にコマンドを編集します。   
編集前のコマンドは以下の通りです。   
```
aliyunlog log get_log_all --project="webserver-project-01" --logstore="web1-logstore" --query="* and __tag__:__path__ : /var/log/httpd/access_log | with_pack_meta | select \"remote_addr\" , pv, pv *1.0/sum(pv) over() as percentage from( select count(1) as pv , \"remote_addr\" from (select \"remote_addr\" from log limit 100000) group by \"remote_addr\" order by pv desc) order by pv desc limit 10" --from_time="2019-08-23 10:56:51+09:00" --to_time="2019-08-30 10:56:51+09:00" --region-endpoint="ap-northeast-1.log.aliyuncs.com" --format-output=no_escape --jmes-filter="join('\n', map(&to_string(@), @))" --access-id="【ステップ 2 のアクセス ID】" --access-key="【ステップ 2 のアクセスキー】" >> /downloaded_data.txt
```
　   7. 編集内容は以下の通りです。   
　   　●ログの抽出時間帯を任意の時間帯に修正します。   
```
--from_time="2019-08-22 00:00:00+09:00" --to_time="2019-08-30 00:00:00+09:00"
```
　   　●下記3つのkeyとvalueを削除します。   
```
　--region-endpoint=XXXXX
　--access-id=XXXXX
　--access-key=XXXXX
```
　   　●ログの出力先を任意のファイルパスに変更します。   
```
/tmp/172.16.12.83-access_log-test_aggregate.csv
```

　   8. 編集後のコマンドは以下の通りです。   
　   　このコマンドをaliyun-log-cliが使用できる環境のECSで実行します。   
```
aliyunlog log get_log_all --project="webserver-project-01" --logstore="web1-logstore" --query="* and __tag__:__path__ : /var/log/httpd/access_log | with_pack_meta | select \"remote_addr\" , pv, pv *1.0/sum(pv) over() as percentage from( select count(1) as pv , \"remote_addr\" from (select \"remote_addr\" from log limit 100000) group by \"remote_addr\" order by pv desc) order by pv desc limit 10" --from_time="2019-08-22 00:00:00+09:00" --to_time="2019-08-30 00:00:00+09:00" --format-output=no_escape --jmes-filter="join('\n', map(&to_string(@), @))" >> /tmp/172.16.12.83-access_log-test_aggregate.csv
```
　   9. CSVファイルの出力内容は以下のような形式となります。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830163319.png "img")      

## まとめ
今回は、LogServiceにて出力したログのダウンロード方法をご紹介しました。   
次回は、ダッシュボードの作成を交えて様々なグラフ作成をご紹介致します。   
ありがとうございました。   


