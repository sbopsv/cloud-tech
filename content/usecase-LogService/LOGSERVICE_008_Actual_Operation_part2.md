---
title: "実運用を想定した構成 Part2"
metaTitle: "実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編①～"
metaDescription: "実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編①～"
date: "2019-07-26"
author: "SBC engineer blog"
thumbnail: "/LogService_images_26006613376466800/20190724155702.png"
---

## 実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編①～

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190903123230.png "img")

今回は、Alibaba Cloudの<span style="color: #ff0000">【LogService】</span>について、   
検索編①を投稿します。   

本記事では、収集した<span style="color: #ff0000"><b>ログを閲覧・検索</b></span>していきます。   


## 収集したログの表示
   
１．Alibaba Cloudのコンソール画面へログインし、【LogService】画面を開きます。   
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724150628.png "img")
   
   

２．検索対象の`Project`をクリックします。   
　　ここでは、`webserver-project`をクリックします。   
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724150645.png "img")
   
   

３．`Logstore`の一覧が表示されます。   
　　この中から検索対象の`Logstore`にて検索を実施します。   
　　ここでは、`web1-logstore`の`ログ使用モード`配下にある`検索`をクリックします。   
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724151054.png "img")
   
   

４．ログ検索画面が表示されます。   
　　検索対象時間は、デフォルト設定として`15分（相対）`が指定されています。   
　　今回は、下記の通り、`2019-07-23 13:00~2019-07-23 13:50`に時間指定します。   
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724151109.png "img")
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724151121.png "img")
   

５．指定時間帯のログが表示されます。   
　　収集したログは下記の通り、表示されます。   
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724151133.png "img")
   


## ログの検索
下記の2通りの方法でログの検索が可能です。   
   
　① `クエリ`を入力後、`検索と分析`をクリックし、検索する。       
　② `コンテンツ欄`の`値`をクリックすることで`クエリ`を自動生成し、検索する。       
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724155702.png "img")
   
本記事では、②を使用してクエリを自動生成し、検索していきます。       
では、実際に検索してみましょう。       

<b>例）</b>   
`2019/07/23`の`13:00～13：50`に`web1-2サーバ (IPアドレス:172.16.12.90)`の`/var/log/messages`に出力されている文字列を検索する場合        


１．ECSのIPアドレスで検索します。       
　① IPアドレス`172.16.12.90`をクリックします。        
　② 同じIPアドレスが<span style="color: #ff0000">赤色表記</span>に変更します。       
　③ クエリ`* and source: 172.16.12.90`が自動生成され、ECSのIPアドレス`172.16.12.90`のみに絞られます。       

      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724151517.png "img")
   
   

２．続けて、`ログファイルパス`で検索条件を絞ります。       
　① ログファイルパス`/var/log/messages`をクリックします。       
　② 同じログファイルパスが<span style="color: #ff0000">赤色表記</span>に変更します。       
　③ クエリ`and __tag__:__path__: /var/log/messages`が先ほどのクエリに自動追加され、       
　　検索結果が、IPアドレス`172.16.12.90`の`/var/log/messages`のみに絞られます。       
　　このように`and`でクエリを繋ぐことによって、and検索が可能です。       
　　※使用できるクエリは<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/29060.htm?spm=a21mg.p38356.b99.129.362c5f25R4rl0h">こちらのリンク</a>をご参照ください。   
　　
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724160156.png "img")
   
   

３．続けて、`文字列`で検索条件を絞ります。   
　`Logtail構成`を`シンプルモード`で作成している場合、生ログは`content`に表示されます。   
　また、Logtail構成作成時にインデックス属性をデフォルトで作成した場合、contentは、`, '";=()[]{}?@&<>/:\n\t`で区切られます。   
　本記事では、それを利用し、文字列を検索します。   
   
（参考：Logtail構成作成時のインデックス属性編集画面）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724173836.png "img")   
   
以下、検索時の手順です。   

　① 今回は、`crond`と`sendmail`の文字列で検索します。   
　　content欄の`crond`と`sendmail`をクリックします。   
　② 同じ検索文字列が<span style="color: #ff0000">赤色表記</span>に変更します。   
　③ クエリ` and crond  and sendmail `が先ほどのクエリに自動追加され、該当の文字列を含むログが表示されます。   
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724175124.png "img")
   
   


## ログの表示形式について
１．ログの表示形式については、`コンテキスト表示`を使用し、テキストファイルのように閲覧することも可能です。   
   
以下、`コンテキスト表示`使用時の手順です。   
   
　① ログを選択し、`コンテキスト表示`をクリックします。   
　② コンテキスト表示の開始箇所は、`No 0`の番号が振られ、ログが色塗りされます。   
　　`No`について、`+`には選択したログより新しいログが表示され、`-`には、古いログが表示されます。   
　③`古い`または、`新しい`を押下することによって、表示行数を増やすことができます。   
　④ 文字列を入力することによって、検索したい文字列で絞ることができます。   
　　※検索対象は、コンテキスト表示画面上のログのみとなります。   
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724170233.png "img")
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724170256.png "img")
   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724170310.png "img")
   

## まとめ
今回は、`シンプルモード`にて収集したログについて、簡単な検索方法をご紹介しました。   


