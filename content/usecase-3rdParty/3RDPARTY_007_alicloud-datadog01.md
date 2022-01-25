---
title: "Datadog導入連携"
metaTitle: "DatadogでのAlibaba Cloud連携について"
metaDescription: "DatadogでのAlibaba Cloud連携について"
date: "2020-08-07"
author: "SBC engineer blog"
thumbnail: "/3rdParty_images_26006613599370900/20200722143931.png"
---

## DatadogでのAlibaba Cloud連携について


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200722143931.png "img")      


# はじめに

本記事では、クラウド型の監視アプリケーションであるDatadogでAlibaba Cloudを連携する方法をご紹介します。    

Datadogは以下のようなことが可能なサービスです。    
* クラウドサービスのメトリクスの監視    
* アプリケーションのパフォーマンスを監視    
* ログの収集・可視化    
* アラートの管理と通知    

※上記は一部の機能になります。機能の詳細については以下をご覧ください。

> https://www.datadoghq.com/ja/product/

     
Datadogの下記のページを見るとAlibaba Cloudについても記載がありますので、     
実際に使用できるか検証したいと思います。
> https://www.datadoghq.com/ja/solutions/hybrid-cloud-monitoring/


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720101320.png "img")


# 連携可能なAlibaba Cloudプロダクトについて
ドキュメントを見ると以下のプロダクトがDatadogと連携可能なようです。
> https://docs.datadoghq.com/ja/integrations/alibaba_cloud/

     
<span style="color: #ff0000">Alibaba Cloud Servers Load Balancer</span>    
<span style="color: #ff0000">Alibaba Elastic Compute Service</span>    
<span style="color: #ff0000">Alibaba Cloud ApsaraDB for RDS</span>    
<span style="color: #ff0000">Alibaba Cloud ApsaraDB for Redis</span>    
<span style="color: #ff0000">Alibaba Cloud Content Delivery Network</span>    
<span style="color: #ff0000">Alibaba Cloud Container Service</span>    
<span style="color: #ff0000">Alibaba Cloud Express Connect</span>    
    
実際に連携できるか一部のプロダクトを使用し、検証していきます。
          


# RAM設定
以下のドキュメントによると、    
連携のためにAccount IDとAccess Key IDとAccess Key Secretが必要な手順となっていますので、    
まずはDatadogとの連携で使用するRAMユーザを作成します。    

> https://docs.datadoghq.com/ja/integrations/alibaba_cloud/

     
Resource Access ManagementでRAMユーザを作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720102932.png "img")      

連携するプロダクトに対応する権限をRAMユーザへ付与します。    
* AliyunCloudMonitorReadOnlyAccess    
* AliyunECSReadOnlyAccess    
* AliyunKvstoreReadOnlyAccess    
* AliyunRDSReadOnlyAccess    
* AliyunSLBReadOnlyAccess    
* AliyunCDNReadOnlyAccess    
* AliyunCSReadOnlyAccess    
* AliyunExpressConnectReadOnlyAccess    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200727182457.png "img")      


# Datadog＋Alibaba Cloud連携
Datadog連携用のRAMユーザと権限が用意できたので、Datadogとの連携を図ります。     
Integrationsの概要については下記をご覧ください。

> https://docs.datadoghq.com/ja/getting_started/integrations/


IntegrationsでAlibaba Cloudを選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200727182625.png "img")      

以下のプロダクトのメトリックが収集できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200717100757.png "img")      

ConfigurationタブからAdd Accountを押下します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720095651.png "img")      

Alibaba CloudのAccount IDとRAMユーザのAccess Key IDとAccess Key Secretを入力し、DatadogとAlibaba Cloudを連携します。    
※各種Alibaba Cloudインスタンスのメトリックデータ連携時にフィルタとして使用するタグもここで定義しています。    
入力後、Install Integrationを押下します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720095858.png "img")      

連携後、再びAlibaba CloudのIntegrationを開くと以下のようになります。    
連携できました。これでプロダクトのメトリクスを可視化および監視することが可能となります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720100017.png "img")      

# ダッシュボード①    
Alibaba CloudのIntegrationを追加したため、Datadogにダッシュボードが追加されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720100959.png "img")      

ECSとSLBとRDSとRedisのダッシュボードが表示されます。    
※作成したばかりのため、まだデータは表示されていません。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200722154629.png "img")           
     

# リソース用意    
Datadogに読み込ませるリソースを作成します。    
Datadogではタグによるフィルタリングが可能であるため、今回リソースには意図的にタグを付与します。    
※独自にタグを付与しない場合でもカウントやリージョン、ゾーン単位のフィルタリングは可能です。

> https://docs.datadoghq.com/ja/tagging/using_tags/?tab=assignment


Alibaba Cloudダッシュボードに表示されるECSやSLBなどのリソースを作成し、同じタグを付与します。     
今回はIntegrationでのアカウント連携時に設定したタグを付与します。    
タグによるリソースのフィルターが可能のため利用します。     
※以下はSLBのタグ設定画面

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200722163613.png "img")           

※以下はRDSのタグ設定画面
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200722163631.png "img")           


# ダッシュボード②    
フィルタを設定しない場合、アカウントのリソースがダッシュボードにすべて表示されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200727183641.png "img")           

$varでインスタンスに設定したタグを選択するとタグを付与したインスタンスのみダッシュボードに表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200722154815.png "img")      


# ダッシュボード③    
デフォルトで作成されるダッシュボード以外にも
自分でダッシュボード作成し、メトリクスを登録することも可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200729155857.png "img")       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200727200108.png "img")           

画面上部のウィジェットをドラッグアンドドロップで配置します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200727200118.png "img")           

表示するメトリクスを選択し、保存するとダッシュボードに反映されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200727195003.png "img")      

ダッシュボードが表示されました。
Alibaba Cloudプロダクトで表示できるメトリクスについては以下のページのメトリクスをご覧ください。

> https://docs.datadoghq.com/ja/integrations/alibaba_cloud/#%E3%83%A1%E3%83%88%E3%83%AA%E3%82%AF%E3%82%B9


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200727195019.png "img")           

# Agent登録
datadog-agentをサーバに導入するとDatadogでサーバ内プロセス監視が可能となります。     
今回はECSにAgentを導入し、プロセスを監視してみます。

> https://docs.datadoghq.com/ja/agent/basic_agent_usage/?tab=agentv6v7

     
今回はCentOS7.6のパブリックイメージを使用しているため、    
左カラムでCentOSを選択し、以下のコマンドでAgentを導入します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720135633.png "img")      


# プロセス監視    
Agentを導入したECSで設定ファイルを記述します。    
    
「/etc/datadog-agent/conf.d/process.d」配下に設定ファイルを新規作成します。      
<span style="color: #ff0000">/etc/datadog-agent/conf.d/process.d/conf.yaml</span>

```
init_config:

instances:
  - name: chrony
    search_string: ['chrony', 'chronyd']
    exact_match: False

  - name: ssh
    search_string: ['ssh', 'sshd']
    exact_match: False
```

サービス再起動をして設定を反映します。

```
# systemctl restart datadog-agent
```


設定が反映されていることを確認します。    
※下記のコマンドはAgentをインストールすることで使用可能となります。

```
# datadog-agent status
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720193838.png "img")      

DatadogでMonitors ⇒ Manage Monitorsに遷移し、New Monitorを押下して新規監視定義を作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720194327.png "img")           

Process Checkを選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720195729.png "img")           

Agentの「/etc/datadog-agent/conf.d/process.d」配下の設定ファイルで定義したプロセスが    
Pick a Processに表示されるため選択します（以下の画像ではChronyを選択）。    
監視対象とするスコープをタグで指定し（以下の画像ではservice:datadogを指定）、その他メール内容と通知先を設定します。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200722154029.png "img")      


作成後、Manage Monitorsに表示されます。     
プロセスが正常にアップしているとSTATUSがOKになります。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720194504.png "img")      

以下はプロセス監視の詳細画面です。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200729144237.png "img")       


今回プロセス監視設定をしたchronyを停止し、アラートを発報させます。    
クライアントでプロセスを停止します。
```
# systemctl stop chronyd
```
     
DatadogでSTATUSがOK ⇒ ALERTに変更されることを確認します。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200720194540.png "img")      

以下はプロセス監視の詳細画面です。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200729144208.png "img")      

以下はDatadogから送信されたメールです。    
プロセス監視でERRORになったため送信されました。     
これによりプロセス監視設定で設定したメールアドレスにメールが発報されることが確認できました。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200729144105.png "img")      

     

# Live Processesの有効化
プロセス毎にAgent側で動作プロセスを定義しなくとも     
Agent側の動作プロセス一覧および消費リソースを取得できます。    
AgentでLive Processesを有効化するとクライアントで動作している全てのプロセスが表示されます。    

> https://docs.datadoghq.com/ja/infrastructure/process/?tab=linuxwindows



以下のProcesses画面ではAgent側でLive Processesをまだ有効化していないので、何も表示されていません。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200722164905.png "img")      


以下のファイルのprocess_configをtrueにするとDatadog側にもクライアントのプロセス一覧が連携されます。    
<span style="color: #ff0000">/etc/datadog-agent/datadog.yaml</span>

```
process_config:
    enabled: 'true'
```

サービス再起動をして設定を反映します。

```
# systemctl restart datadog-agent
```
     
Agent側で有効化するとグラフと動作プロセスごとのリソース使用率が表示されます。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200722164852.png "img")      



# 最後に
今回はAlibaba CloudとDatadogを連携してみました。
Alibaba CloudプロダクトやMWのプロセス監視を中心にご紹介させていただきましたが、Datadogは他クラウドや様々なOSS製品（jenkins、Ansibleなど）、コミュニケーションツール（Slack、teams、GSuite）などとも連携が可能です。    
それらを組み合わせることでさらに利便性の向上や管理の手間を削減可能と思われます。    
フル機能が14日間無料のトライアルもありますので、 マルチクラウド環境の方や多数のツールをご利用の方はご利用してみてはいかがでしょうか。    


