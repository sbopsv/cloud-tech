---
title: "JP1・AJS3動作検証"
metaTitle: "AlibabaCloudでのミドルウェア導入検証【JP1/AJS3編②】～動作検証～"
metaDescription: "AlibabaCloudでのミドルウェア導入検証【JP1/AJS3編②】～動作検証～"
date: "2019-10-24"
author: "SBC engineer blog"
thumbnail: "/3rdParty_images_26006613447461200/20191010203124.png"
---


## JP1・AJS3動作検証


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010201919.png "img")      

# はじめに

<a href="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_001_jp1test_1">前回の記事</a>では、JP1-AJS3でのジョブの<span style="color: #ff0000">実装内容を検討</span>しました。  

本記事では、Alibaba CloudにてJP1/AJS3（Version 12）らミドルウェアの導入検討した内容をAlibabaCloudで正常に動作するかについてご紹介します。    

JP1/AJS3のインストールは様々なブログやドキュメントに紹介されているので、ここでは、割愛致します。  
本記事では、<span style="color: #ff0000">ジョブの動作検証</span>を実施していきます。  

以下、目次です。  

      

# 検証環境  
<a href="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_001_jp1test_1">前回の記事</a>の繰り返しとなりますが、本記事の検証を実施するための環境はこちらです。  
なお、検証環境は<span style="color: #ff0000">構築済</span>とします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010201939.png "img")      

# ジョブの実装内容  
こちらも<a href="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_001_jp1test_1">前回の記事</a>の繰り返しとなりますが、ジョブネット構成です。  
本記事では、このジョブネットの動作確認を実施していきます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010201958.png "img")      　　

# ジョブ内で使用するCLI  
<a href="https://www.alibabacloud.com/cloud-tech/doc-detail/90765.htm">【AlibabaCloudCLI】</a>を使用することで、AlibabaCloudリソースのCRUD操作を実施することができます。  
また、本記事ではジョブ内で使用するために`絶対パス`を指定し、コマンド実行します。  
以下に本記事で使用するCLIコマンドを記載します。  

# AutoScalingの台数変更  
■使用するCLI  
AutoScalingGroup(ess)の`ModifyScalingGroup`コマンドで台数変更を実施します。  
```
/usr/local/bin/aliyun ess ModifyScalingGroup --ScalingGroupId {$Id} --MinSize {$台数} --MaxSize $2 {$台数}
```

台数変更後、AutoScalingGroup(ess)の`DescribeScalingGroups`コマンドで設定値が変更されたことを確認します。  
```
/usr/local/bin/aliyun ess DescribeScalingGroups --ScalingGroupId.1 {$Id}
```

■使用するジョブ  
`launch-ecs-job`および`terminate-ecs-job`にて使用します。  
`launch-ecs-job`では`2台`、`terminate-ecs-job`では`0台`に設定します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202013.png "img")        

# 環境起動時（launch-ecs-job）の確認内容  
環境起動時は、`MaxSize`と`MinSize`が`2`になっていることを確認します。  

以下、コマンド発行後の確認内容です。  
```
/usr/local/bin/aliyun ess DescribeScalingGroups --ScalingGroupId.1 {$Id} | jq -r .
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202037.png "img")      　　

# 環境停止時（terminate-ecs-job）の確認内容  
環境停止時は、`MaxSize`と`MinSize`が`0`になっていることを確認します。  

以下、コマンド発行後の確認内容です。  
```
/usr/local/bin/aliyun ess DescribeScalingGroups --ScalingGroupId.1 {$Id} | jq -r .
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202058.png "img")      　　

# AutoScaling配下のECSの状態確認  
■使用するCLI  
AutoScalingGroup(ess)の`DescribeScalingInstances`コマンドでAutoScalingGroup配下のECSの状態確認を行います。  
```
/usr/local/bin/aliyun ess DescribeScalingInstances --ScalingGroupId {$Id}
```

■使用するジョブ  
`ecs-launchcheck-job`および`ecs-terminatecheck-job`にて使用します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202119.png "img")        

# 環境起動時（ecs-launchcheck-job）の確認内容  
環境起動時は、`HealthStatus`が`Healthy`になっているサーバが`2台`あることを確認します。  

以下、コマンド発行後の確認内容です。  
```
/usr/local/bin/aliyun ess DescribeScalingInstances --ScalingGroupId {$Id} | jq -r .
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202133.png "img")      　　

# 環境停止時（ecs-terminatecheck-job）の確認内容  
環境停止時は、`ScalingInstance`になにも表示されないことを確認します。  

以下、コマンド発行後の確認内容です。  
```
/usr/local/bin/aliyun ess DescribeScalingInstances --ScalingGroupId {$Id} | jq -r .
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202150.png "img")      　　

# SLBの状態確認  
■使用するCLI  
SLBの`DescribeHealthStatus`コマンドでSLB配下のECSの状態確認を実施します。  
```
/usr/local/bin/aliyun slb DescribeHealthStatus --LoadBalancerId {$Id}
```

■使用するジョブ  
`slb-healthcheck-job`および`slb-unhealthcheck-job`にて使用します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202203.png "img")        

# 環境起動時（slb-healthcheck-job）の確認内容  
環境起動時は、`ServerHealthStatus`が`normal`になっているサーバが`2台`あることを確認します。  

以下、コマンド発行後の確認内容です。  
```
/usr/local/bin/aliyun slb DescribeHealthStatus --LoadBalancerId {$Id}  | jq -r .
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202218.png "img")      　　

# 環境停止時（slb-unhealthcheck-job）の確認内容  
環境停止時は、`BackendServer`になにも表示されないことを確認します。  

以下、コマンド発行後の確認内容です。  
```
/usr/local/bin/aliyun slb DescribeHealthStatus --LoadBalancerId {$Id} | jq -r .
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202230.png "img")      　　

# ジョブの実行（即時実行）  
前項では、ジョブにて使用するCLIをご紹介しました。  
本項では、実際にジョブを動作させます。  
なお、JP1-AJS3の実行環境とジョブネットは<span style="color: #ff0000">構築済</span>とします。  

以下、実行させるジョブネットです。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202244.png "img")      　　

# 環境起動用ジョブネット（launch-jobnet）の確認  
1. 下記のジョブネット即時実行します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202258.png "img")      　　

2. 環境起動を即時実行で実施します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010204159.png "img")      

3. 正常にジョブが終了していることを確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010204213.png "img")      　　

# 環境停止用ジョブネット（terminate-jobnet）の確認  
1. 下記のジョブネット即時実行します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202337.png "img")      　　

2. 環境停止を即時実行で実施します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202352.png "img")      　　

3. 正常にジョブが終了していることを確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010204226.png "img")      　　

# AlibabaCloudでの確認  
以下の確認を実施します。  

# AutoScalingGroupの確認  
* ●環境起動時  
　該当のAutoScalingGroupのECSインスタンスリスト内の`ECSが正常に稼働していること`を確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202709.png "img")       

* ●環境停止時  
　該当のAutoScalingGroupのECSインスタンスリストに`ECSが存在しないこと`を確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202721.png "img")        

# SLBの確認  
* ●環境起動時  
　バックエンドサーバのポートヘルスチェックが`正常`に実施されていることを確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202733.png "img")        

* ●環境停止時  
　バックエンドサーバのポートヘルスチェックが`-`になっていることを確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202755.png "img")        

# ジョブの実行（計画実行）  
即時実行での動作確認は完了しました。  
次はスケジュールを意識し、`平日の10:00に起動`、`平日の18:00に停止`といった`計画実行`を実施していきます。  

# カレンダー定義の作成  
ジョブを平日に実行するためにカレンダー定義を作成します。  
ここでは、`schedule-jobgroup`のカレンダー定義にて、  
<span style="color: #ff0000">土日を休日</span>と定義しておきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202826.png "img")      

以下、`設定後`のView画面です。  

1. カレンダー定義を`schedule-jobgroup`に設定します。  

2. 土日を`休日`と定義します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202837.png "img")        
　

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202848.png "img")      

# スケジュール定義の作成  
ジョブネットを実行する時間を定義しておきます。  
実行スケジュールは下記の通り、設定します。  

● launch-jobnet（環境起動用ジョブネット）     ：　平日10:00実行  
● terminate-jobnet（環境停止用ジョブネット）  ：　平日18:00実行  

以下、設定後のView画面です。  

1. `launch-jobnet`と`terminate-jobnet`にそれぞれスケジュール定義を設定します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202904.png "img")        

2. スケジュールルールの種別を`運用日`に設定します。  

3. 任意の開始年月を設定します。  

4. 任意の開始日を設定します。  

5. 開始時刻を`絶対時刻（システム時刻）`とし、下記の実行時間は下記の通り設定します。  
　　● launch-jobnet     ：　10:00  
　　● terminate-jobnet  ：　18:00  

6. サイクルで実行するに`チェック`を入れ、`1運用日毎`に実行します。
　  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202916.png "img")      

# 計画実行の実行登録  
実行登録を計画実行で実施します。  

以下、`設定後`のView画面です。  

1. `launch-jobnet`と`terminate-jobnet`にそれぞれ実行登録を実施します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202934.png "img")      

2. 登録方法は`計画実行`を指定します。  

3. 実行タイミングは、`次回から実行する`に指定します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010202954.png "img")      

# 計画実行の設定確認  
計画実行登録後の設定を確認します。  

1. `launch-jobnet（環境起動用ジョブネット）`の確認です。  
土日以外に`■マーク`があることが確認できます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010203008.png "img")      

2. `■マーク`をダブルクリックすると下記がセットされていることが確認できます。  
<b>選択枠内の実行スケジュール</b>が`2019/10/10 10:00:00 - 2019/10/10 10:02:56`  
<b>状態</b>が`開始時刻待ち`   
<b>開始予定日時および開始日時</b>が`10:00:00`  
<b>終了日時</b>が`10:02:56`    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191023160632.png "img")      

3. `terminate-jobnet（環境停止用ジョブネット）`の確認です。  
土日以外に`■マーク`があることが確認できます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010203033.png "img")        

4. `■マーク`をダブルクリックすると下記がセットされていることが確認できます。  
<b>選択枠内の実行スケジュール</b>が`2019/10/10 18:00:00 - 2019/10/10 18:00:24`  
<b>状態</b>が`開始時刻待ち`   
<b>開始予定日時および開始日時</b>が`18:00:00`  
<b>終了日時</b>が`18:00:24`    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191023160650.png "img")      

# 計画実行の動作確認  

# JP1/AJS3-Viewでの確認  
JP1/AJS3-Viewでは`ジョブネットモニタ`にて確認を実施します。  

# 環境起動確認
1. `launch-jobnet`の進捗度が`100%`になっていることを確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010203109.png "img")        

2. 開始時刻が`10:00:00`であることを確認します。  

3. ジョブネットモニタにて、ジョブが全て`正常終了`していることを確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010203124.png "img")        

# 環境停止確認
1. `terminate-jobnet`の進捗度が`100%`になっていることを確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191011120302.png "img")       

2. 開始時刻が`18:00:00`であることを確認します。  

3. `terminate-jobnet`のジョブネットモニタにて、ジョブが全て`正常終了`していることを確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191011120318.png "img")        

# AlibabaCloudでの確認  
以下の確認を実施します。  

# スケーリングアクティビティの確認  
AutoScalingGroupの挙動を確認すると下記が記録されていることが確認できます。  
　●平日の10:00に`Add"2"ECS`   
　●平日の18:00に`Remove"2"ECS`  
　●10/5（土）、10/6（日）は`アクティビティなし`  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010203203.png "img")        


AutoScalingGroupの状態確認とSLBの状態確認については、  
<span style="color: #ff0000">即時実行時と同様</span>のため、割愛します。  


# 最後に    
以上で、AlibabaCloud上にJP1-AJS3を構築し、動作させました。  
AlibabaCloud特有の設定項目は特になく、他のクラウドサービスと遜色なく動作させることができました。  
これを機に他のミドルウェアについてもAlibabaCloud上で検証を実施していければと思います。  

