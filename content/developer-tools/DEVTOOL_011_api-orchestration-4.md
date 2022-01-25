---
title: "APIで自動構築④ - SLB編"
metaTitle: "APIを用いてAlibaba Cloudリソースを自動構築する④ - SLB編"
metaDescription: "APIを用いてAlibaba Cloudリソースを自動構築する④ - SLB編"
date: "2019-06-10"
author: "SBC engineer blog"
thumbnail: "/developer-tools_images_17680117127185100000/000000000000000008.png"
---

# APIで自動構築④ - SLB編

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/000000000000000008.png "img")  


# はじめに

`APIを用いてAlibaba Cloudリソースを自動構築する`シリーズ第4回目となります。

[前回の記事](https://sbopsv.github.io/cloud-tech/developer-tools/DEVTOOL_010_api-orchestration-3)では、Auto Scalingを作成し、ECSサーバを起動しました。  
今回は負荷分散装置であるServer Load Balancer（SLB）を作成し、前回作成したAuto Scalingに紐付け、  
SLB経由でECSサーバにログインしてみたいと思います。

## SLB要件

簡単な要件は以下の通りです。  

⦿ マルチゾーン（A Zone/B Zone）構成  
⦿ パブリックSLB。フロントサブネット内（10.0.0.0/24、10.0.8.0/24）に構築  
⦿ EIPと紐付け  

![SLB構成図](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606133331.png "img")      

※<font color="Red">赤字</font>の部分が今回の構築対象となります。

# SLBコンポーネント解説
さっそくSLBを構築していきましょう   
と行きたいところですが、今回作成するSLBは関係するコンポーネントが多く少々複雑なため、  
先に関連するコンポーネントの解説を行っていきたいと思います。  

![SLB関連コンポーネント](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606133513.png "img")      

#### ① SLBインスタンス
受信したトラフィックの負荷分散を行うインスタンスです。  
VPCの外に作成され、インターネットからの通信を受け付けるインターネットSLBインスタンスと、VPC内部に作成され、VPC内からの通信を受け付けるイントラネットSLBインスタンスの2種類が存在します。  
SLBインスタンス作成時に、インターネットSLBインスタンスにはパブリックIPが払い出され、イントラネットSLBインスタンスには指定したvSwitchからプライベートIPが割り当てられます。

#### ② リスナー
プロトコル（ポート）に従い、SLBインスタンスからのリクエストを受け付け、バックエンドのECSサーバにトラフィックをルーティングするコンポーネントです。  
SLBを機能させるためには、必ず1つ以上のリスナーをSLBインスタンス内に作成する必要があります。  
サポートされるプロトコルは、以下の4つです。

1. **TCP**（レイヤ4）  
2. **UDP**（レイヤ4）  
3. **HTTP**（レイヤ7）  
4. **HTTPS**（レイヤ7）

#### ③ 転送ルール
リスナーがリクエストをルーティングするバックエンドサーバを選定する際の、転送ルールを定義したコンポーネントです。  
ドメイン名に基づく振り分け、およびURLに基づく振り分けがサポートされています。  
転送ルールを定義可能なのは、レイヤ7（HTTP/HTTPS）リスナーのみとなります。

#### ④ バックエンドサーバグループ
リクエストを処理するECSインスタンスをグルーピングしたコンポーネントです。  
以下の3種類のグループが存在し、用途によって使い分けます。  

1. **vServerGroup**：転送ルールを用いてルーティングの振り分けを行いたい場合に利用するグループです。  
単一SLBインスタンス内に複数作成出来ます。  
配下のバックエンドサーバにはECSインスタンスだけでなく、Auto Scalingを紐付け可能です。
2. **Active/Standby Server Group**：グループ内でActive/Standby構成を取りたい場合に利用するグループです。  
Activeサーバに対するヘルスチェックがNGになった場合、Standbyサーバにリクエストがルーティングされます。  
レイヤ4（TCP/UDP）リスナーでのみ使用可能で、グループ内には2台のECSインスタンスのみ紐付け可能です。  
3. **Default Server Group**：リスナーにvServerGroup、またはActive/Standby Server Groupが設定されていない場合に、デフォルトでリクエストがルーティングされるグループです。また、レイヤ7リスナーに転送ルールが設定されており、かつ合致するルールが存在しない場合のルーティング先となります。  
Auto Scalngと紐付け可能であり、SLBインスタンス内に1つのみ定義可能です。

## リレーション
各コンポーネントの関係性が複雑なため、整理します。  

上記コンポーネント図の通り、  

- ・1つのSLBインスタンスに対し、複数のリスナーを設定可能  
- ・1つのリスナーに対し、1つのバックエンドサーバグループのみ指定可能  
- ・1つの転送ルールに対し、1つのバックエンドサーバグループのみ指定可能  
- ・1つのバックエンドサーバグループに対し、複数のECS（Auto Scaling）を指定可能  

となっています。  

ポイントは、  
<span style="color: #ff0000">① バックエンドサーバグループは複数のリスナーで使い回しが可能</span>  
<span style="color: #ff0000">② 1つのAuto Scalingに複数のvServerGroupを紐付けることが可能（別SLBのvServerGroupでも問題なし）</span>  
の2点です。

文章で表現するとややこしくなってしまいますので、実際にリソースを構築してイメージを掴んでいきましょう。

# SLBを作成してみよう 

## 手順
SLBを作成し、ECSインスタンスにログインするまでのおおまかな手順は以下となります。

1. SLBインスタンスを作成する  
3. SLBインスタンス内に、vServerGroupを作成する
4. SLBインスタンス、およびvServerGroupの情報をもとに、リスナーを作成する
5. SLBインスタンスを有効化する
6. vServerGroupにAuto Scalingを紐付ける
7. EIPを作成し、SLBインスタンスと紐付ける

## APIリファレンス
本記事で使用するAPIを紹介します。

1. [CreateLoadBalancer](https://www.alibabacloud.com/cloud-tech/doc-detail/27577.htm)：SLB SDKのAPIです。SLBインスタンスを作成します。  
2. [CreateLoadBalancerTCPListenerRequest](https://www.alibabacloud.com/cloud-tech/doc-detail/27594.htm)：SLB SDKのAPIです。TCPプロトコルのリスナーを作成します。  
3. [SetLoadBalancerStatusRequest](https://www.alibabacloud.com/cloud-tech/doc-detail/27580.htm)：SLB SDKのAPIです。SLBのステータスを変更します。  
4. [AttachVServerGroupsRequest](https://www.alibabacloud.com/cloud-tech/doc-detail/98983.htm)：Auto Scaling(ESS) SDKのAPIです。vServerGroupとAuto Scalingを紐付けます。 [^2]  
5. [AllocateEipAddressRequest](https://www.alibabacloud.com/cloud-tech/doc-detail/36016.htm)：VPC SDKのAPIです。EIPを作成します。  
7. [AssociateEipAddressRequest](https://www.alibabacloud.com/cloud-tech/doc-detail/36017.htm)：VPC SDKのAPIです。EIPを他リソースにアタッチします。  
6. [ModifyEipAddressAttributeRequest](https://www.alibabacloud.com/cloud-tech/doc-detail/36019.htm)：VPC SDKのAPIです。EIPの属性情報を変更します。  

これらのAPIは、ヘルチェック関連の設定や各種タイムアウト値の設定等、膨大な数のリクエストパラメータを保持しています。  
今回のサンプルでは、ほとんどのパラメータをデフォルト値のまま構築し、最低限のポイントのみの説明となっているため、  
より詳細な情報を知りたい場合は、上記リンクよりそれぞれのAPIリファレンスを参照してください。

[^2]: 日本サイトのAPIリファレンスが公開されていないため、リンク先は国際サイトのAPIリファレンスとなります。

# SLBインスタンスを作成 
まずはSLBインスタンスを作成します。  

## サンプルコード
```java
package com.alibaba.demo.apisample;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.slb.model.v20140515.CreateLoadBalancerRequest;
import com.aliyuncs.slb.model.v20140515.CreateLoadBalancerResponse;

public class ApiSample {

   private static final String REGION_ID = "ap-northeast-1";
   private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
   private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    public static void main(String[] args) throws ServerException, ClientException {

        IAcsClient client = new DefaultAcsClient(
            DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));

/** ---------------------- ↑ここまで前回のサンプルと同様 ---------------------- */

        CreateLoadBalancerRequest request = new CreateLoadBalancerRequest();
        request.setLoadBalancerName("slb-api-demo");                  // インスタンス名
        request.setAddressType("intranet");                           // ネットワークタイプ
        request.setVpcId("vpc-6wekbo76l1h7j66b26wxx");                // VPC ID
        request.setVSwitchId("vsw-6weky5d8ztct45ggnpkbq");            // VSwitch ID
        request.setMasterZoneId(TokyoZones.ZONE_A_ID.getZoneId());    // マスターゾーンID
        request.setSlaveZoneId(TokyoZones.ZONE_B_ID.getZoneId());     // スレーブゾーンID
        request.setLoadBalancerSpec("slb.s1.small");                  // インスタンススペック

        // SLBインスタンス作成
        CreateLoadBalancerResponse response = client.getAcsResponse(request);
        System.out.println("Instance ID：" + response.getLoadBalancerId());
    }
}
```

#### インスタンス名
SLBインスタンスの名前を指定します。  
必須パラメータではありませんが、指定しない場合はシステムが適当に割り当てた名前が適用されるため、管理上指定しておいた方が無難です。

#### ネットワークタイプ
ネットワークのタイプを指定します。  
前述のコンポーネント解説で紹介したように、外向けか内向けかを選択します。  
非必須パラメータで、指定しない場合は`internet`（外向け）が設定されます。  
指定可能な値は、`internet`（外向け）、または`intranet`（内向け）のどちらかです。

#### VPC ID
SLBインスタンスを作成するVPCを指定します。  
ネットワークタイプを`intranet`で指定した場合に必須パラメータとなる**条件付き必須パラメータ**です。  
第2回で作成したVPCのリソースIDを指定します。

#### VSwitch ID
SLBインスタンスを作成するVSwitchを指定します。  
ネットワークタイプを`intranet`で指定した場合に必須パラメータとなる**条件付き必須パラメータ**です。  
第2回で作成したVSwitchのリソースIDを指定します。

#### マスターゾーンID
マルチゾーンでSLBインスタンスを作成する場合に、マスターとなるゾーンを指定します。  
第2回で作成した、東京リージョンにおけるゾーンの列挙型（`TokyoZones`）より、Aゾーンを指定します。

#### スレーブゾーンID
マルチゾーンでSLBインスタンスを作成する場合に、スレーブとなるゾーンを指定します。  
第2回で作成した、東京リージョンにおけるゾーンの列挙型（`TokyoZones`）より、Bゾーンを指定します。

#### インスタンススペック
SLBインスタンスのスペックを指定します。   
非必須パラメータで、指定しない場合は「パフォーマンス共有型インスタンス」で作成されます。 [^1]

指定可能な値は以下の6つとなります。

1. slb.s1.small  
2. slb.s2.small  
3. slb.s2.medium  
4. slb.s3.small  
5. slb.s3.medium  
6. slb.s3.large


[^1]: なお、「パフォーマンス共有型インスタンス」は今後廃止される予定となっています。詳細は[Q&A](https://www.alibabacloud.com/cloud-tech/doc-detail/57737.htm)を参照してください。

## 実行結果
下記のように、Console上に作成したSLBインスタンスのリソースIDが表示されれば成功です。  
このIDは今後の手順で使用するので、控えておいてください。
```
Instance ID：lb-e9b2nctcmctnslwgg0upk
```

管理コンソール上から作成したSLBインスタンスを確認してみましょう。  

`Server Load Balancer`　>　`インスタンス管理`より、SLBインスタンスの一覧を表示します。

![SLBコンソール画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606133605.png "img")      

無事にSLBインスタンスが作成されていることが確認出来ました。

# vServerGroupを作成  
次に、先程作成したSLBインスタンス内にvServerGroupを作成します。  

## サンプルコード

```java
package com.alibaba.demo.apisample;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.slb.model.v20140515.CreateVServerGroupRequest;
import com.aliyuncs.slb.model.v20140515.CreateVServerGroupResponse;

public class ApiSample {

  private static final String REGION_ID = "ap-northeast-1";
  private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
  private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

   public static void main(String[] args) throws ServerException, ClientException {

       IAcsClient client = new DefaultAcsClient(
           DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));
/** ---------------------- ↑ここまで前述のサンプルと同様 ---------------------- */

        String slbInstanceId = "lb-e9b2nctcmctnslwgg0upk";  // SLBインスタンスID

        CreateVServerGroupRequest request = new CreateVServerGroupRequest();
        request.setVServerGroupName("vsg-api-demo");        // vServerGroup名
        request.setLoadBalancerId(slbInstanceId);           // SLBインスタンスID

        // vServerGroup作成
        CreateVServerGroupResponse response = client.getAcsResponse(request);

        System.out.println("vServerGroup ID:" + response.getVServerGroupId());
    }
}
```

#### vServerGroup名
vServerGroupの名前を指定します。  
非必須パラメータですが、管理上指定しています。

#### SLBインスタンスID
vServerGroupを作成するSLBインスタンスを指定します。**必須パラメータ** です。  
先程控えたSLBインスタンスのリソースIDを指定します。

## 実行結果
下記のように、Console上に作成したvServerGroupのリソースIDが表示されれば成功です。  
このIDも今後の手順で使用するので、控えておいてください。

```
vServerGroup ID：rsp-e9bla5txf39lo
```

管理コンソール上から作成したvServerGroupを確認してみましょう。  
先程のSLBインスタンスの詳細画面より、`仮想サーバグループ`を押下します。

![vServerGroupコンソール画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606133639.png "img")      

正常にvServerGroupが作成されていることが確認出来ます。

# リスナーを作成   
リスナーを作成していきたいと思います。  
今回はバックエンドのECSインスタンスにssh接続することが目的なので、プロトコルは`TCP`、ポートは`22`でリスナーを作成します。  



## サンプルコード

```java
package com.alibaba.demo.apisample;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.slb.model.v20140515.CreateLoadBalancerTCPListenerRequest;

public class ApiSample {

   private static final String REGION_ID = "ap-northeast-1";
   private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
   private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

   public static void main(String[] args) throws ServerException, ClientException {

       IAcsClient client = new DefaultAcsClient(
           DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));

        String slbInstanceId = "lb-e9b2nctcmctnslwgg0upk";
        /** ---------------------- ↑ここまで前述のサンプルと同様 ---------------------- */

        String vServerGroupId = "rsp-e9bla5txf39lo";  // vServerGroup ID

        CreateLoadBalancerTCPListenerRequest request = new CreateLoadBalancerTCPListenerRequest();
        request.setDescription("listner-api-demo");   // リスナー名
        request.setLoadBalancerId(slbInstanceId);     // SLBインスタンスID
        request.setListenerPort(Integer.valueOf(22)); // リスナーポート
        request.setBandwidth(Integer.valueOf(-1));    // ピーク帯域幅
        request.setVServerGroupId(vServerGroupId);    // vServerGroup ID

        // リスナー作成
        client.getAcsResponse(request);
    }
}
```

#### リスナー名
リスナーの名前を指定します。パラメータ名が`description`なので、注意が必要です。  
非必須パラメータですが、管理上指定しています。

#### SLBインスタンスID
リスナーを作成するSLBインスタンスを指定します。**必須パラメータ** です。  
先程控えたSLBインスタンスのリソースIDを指定します。

#### リスナーポート
リッスンするポート番号を指定します。**必須パラメータ** です。  
指定可能な値は、`1`から`65535`です。今回はssh接続が目的のため、`22`を指定しています。

#### ピーク帯域幅
リスナーが受け付けるトラフィックの帯域幅上限を設定します。**必須パラメータ** です。  
指定可能な値は、`-1`または`1`から`5120`までのいずれかです。  
`-1`を指定した場合は、帯域幅の**上限なし**となります。

#### vServerGroup ID
リスナーと紐付けるvServerGroupを指定します。非必須パラメータです。  
先程作成したvServerGroupのリソースIDを指定します。

## 実行結果

エラーが発生しなければリスナー作成成功です。  
管理コンソール上から作成したリスナーを確認しましょう。  

先程のSLBインスタンスの詳細画面より、`リスナー`を押下します。

![リスナーコンソール画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606133702.png "img")      

指定したパラメータ通り、リスナーが作成されています。

# vServerGroupとAuto Scalingを紐付け    
前回作成したAuto ScalingにvServerGroupをアタッチします。  
Auto Scalingとの紐付けはSLBインスタンスのステータスが`実行中`でないと出来ないため、アクティブ化も一緒にやってしまいます。

## サンプルコード

```java
package com.alibaba.demo.apisample;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.slb.model.v20140515.CreateLoadBalancerTCPListenerRequest;

public class ApiSample {

   private static final String REGION_ID = "ap-northeast-1";
   private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
   private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

   public static void main(String[] args) throws ServerException, ClientException {

       IAcsClient client = new DefaultAcsClient(
           DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));

        String slbInstanceId = "lb-e9b2nctcmctnslwgg0upk";
        String vServerGroupId = "rsp-e9bla5txf39lo";
        /** ---------------------- ↑ここまで前述のサンプルと同様 ---------------------- */

        /** ---------------------- SLB有効化 ---------------------- */
        SetLoadBalancerStatusRequest setLoadBalancerStatusRequest = new SetLoadBalancerStatusRequest();
        setLoadBalancerStatusRequest.setLoadBalancerId(slbInstanceId);  // SLBインスタンスID
        setLoadBalancerStatusRequest.setLoadBalancerStatus("active");   // ステータス

        // SLBインスタンス有効化
        client.getAcsResponse(setLoadBalancerStatusRequest);

        /** ---------------------- Auto Scalingにアタッチ ---------------------- */
        AttachVServerGroupsRequest attachVServerGroupsRequest = new AttachVServerGroupsRequest();
        attachVServerGroupsRequest.setScalingGroupId("asg-6we71pyfn7n8lmphjs9v");        // Scaling Group ID
        attachVServerGroupsRequest.setForceAttach(Boolean.TRUE);　　　　　　　　　　　　　 // 強制インスタンスアタッチ

        VServerGroup vServerGroups = new VServerGroup();
        vServerGroups.setLoadBalancerId(slbInstanceId);                                  // SLBインスタンスID

        VServerGroupAttribute vServerGroupAttributes = new VServerGroupAttribute();
        vServerGroupAttributes.setPort(Integer.valueOf(22));                             // インスタンスポート
        vServerGroupAttributes.setVServerGroupId(vServerGroupId);                        // vServerGroup ID
        vServerGroups.setVServerGroupAttributes(Arrays.asList(vServerGroupAttributes));

        attachVServerGroupsRequest.setVServerGroups(Arrays.asList(vServerGroups));

        // Auto Scalingにアタッチ
        client.getAcsResponse(attachVServerGroupsRequest);
    }
}
```        

### SLBインスタンス有効化
#### SLBインスタンスID
ステータスを変更する対象のSLBインスタンスを指定します。**必須パラメータ** です。  
先程控えたSLBインスタンスのリソースIDを指定します。

#### ステータス
変更後のステータスを指定します。**必須パラメータ** です。  
指定可能な値は、`active`または`inactive`です。

### Auto Scalingにアタッチ
#### Scaling Group ID
vServerGroupをアタッチする対象のScaling Groupを指定します。**必須パラメータ** です。  
前回作成したScaling GroupのリソースIDを指定します。

#### 強制インスタンスアタッチ
Scaling Group内のECSインスタンスを、アタッチ時にvServerGroupに追加するか否かを指定します。  
`True`を指定した場合、Scaling Group内で既に稼働中のECSインスタンスがvServerGroupに追加され、リクエストを受け付けることになります。  
`False`を指定した場合、既存ECSインスタンスは追加されず、アタッチ後に新たに起動してきたECSインスタンスのみ、vServerGroupに追加されます。  
非必須パラメータで、指定しない場合は`False`が設定されます。  

#### SLBインスタンスID
アタッチ対象のSLBインスタンスを指定します。**必須パラメータ** です。  
先程控えたSLBインスタンスのリソースIDを指定します。

#### インスタンスポート
リスナーが受け付けたリクエストをECSイスタンスへ転送する際のポートを指定します。**必須パラメータ** です。  
指定可能な値は`1`から`65535`で、今回はリスナーが受け付けたポートをそのまま転送するため、`22`を指定しています。

#### vServerGroup ID
アタッチ対象のvServerGroupを指定します。**必須パラメータ** です。  
先程控えたvServerGroupのリソースIDを指定します。


## 実行結果

エラーが発生しなければAuto Scalingとの紐付け成功です。  
管理コンソール上から作成した結果を確認しましょう。  

まずはSLBインスタンスが有効化されていることを確認します。  

![SLBステータス](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606133735.png "img")      

次に、vServerGroupがAuto Scalingにアタッチされていることを確認します。  

SLBインスタンスの詳細画面より、`仮想サーバグループ` > `編集`を押下します。

![vServerGroup編集画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606133810.png "img")      

Auto Scaling配下のECSインスタンスがvServerGroup内に追加されていることが確認出来ました。  

Auto Scaling側からも確認してみます。

`Auto Scaling` > `スケーリンググループリスト`より、対象のScaling Groupを選択します。  

![Scaling Group詳細画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606133853.png "img")      

Auto Scaling⇔vServerGroupの紐付けが完了しました。


# EIP作成とアタッチ     
随分と長くなってしまいました。これが最後の手順となります。  

EIPを作成しSLBにアタッチすることで、インターネットからアクセス可能にします。



## サンプルコード

```java
package com.alibaba.demo.apisample;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.slb.model.v20140515.CreateLoadBalancerTCPListenerRequest;

public class ApiSample {

   private static final String REGION_ID = "ap-northeast-1";
   private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
   private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

   public static void main(String[] args) throws ServerException, ClientException {

       IAcsClient client = new DefaultAcsClient(
           DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));

        String slbInstanceId = "lb-e9b2nctcmctnslwgg0upk";
        /** ---------------------- ↑ここまで前述のサンプルと同様 ---------------------- */

         /** ---------------------- EIP作成 ---------------------- */
         AllocateEipAddressRequest allocateEipAddressRequest = new AllocateEipAddressRequest();
         allocateEipAddressRequest.setInstanceChargeType("PostPaid");       // 支払い方法
         allocateEipAddressRequest.setInternetChargeType("PayByTraffic");   // 課金体系
         allocateEipAddressRequest.setBandwidth("100");                     // ピーク帯域幅

         // EIP作成
         AllocateEipAddressResponse allocateEipAddressResponse = client.getAcsResponse(allocateEipAddressRequest);
         String allocationId = allocateEipAddressResponse.getAllocationId();

         /** ---------------------- EIP変更 ---------------------- */
         ModifyEipAddressAttributeRequest modifyEipAddressAttributeRequest = new ModifyEipAddressAttributeRequest();
         modifyEipAddressAttributeRequest.setAllocationId(allocationId);    // EIP ID
         modifyEipAddressAttributeRequest.setName("eip-api-demo");          // EIP名

         // EIP変更
         client.getAcsResponse(modifyEipAddressAttributeRequest);

         /** ---------------------- EIPアタッチ ---------------------- */
         AssociateEipAddressRequest associateEipAddressRequest = new AssociateEipAddressRequest();
         associateEipAddressRequest.setAllocationId(allocationId);         // EIP ID
         associateEipAddressRequest.setInstanceId(slbInstanceId);          // SLBインスタンスID
         associateEipAddressRequest.setInstanceType("SlbInstance");        // インスタンスタイプ

         // EIPアタッチ
         client.getAcsResponse(associateEipAddressRequest);
     }
 }
```

### EIP作成
#### 支払い方法
EIPの支払い方法を指定します。**必須パラメータ** です。  
現状指定可能な値は、`PostPaid`（従量課金）のみとなっています。

#### 課金体系
EIPの課金体系を指定します。**必須パラメータ** です。  
現状指定可能な値は、`PayByTraffic`（トラフィック課金）のみとなっています。

#### ピーク帯域幅
EIPが受け付けるトラフィックの帯域幅上限を設定します。**必須パラメータ** です。  
指定可能な値は、`1`から`200`までのいずれかです。  

### EIP変更
本来必要のない処理ではありますが、EIPは作成時にリソース名を指定出来ず、名無しのEIPとなってしまうため、  
メンテナンスの面から、EIP変更APIを実行し名前を付与しています。

#### EIP ID
変更対象のEIPを指定します。**必須パラメータ** です。
先程作成したEIPのリソースIDを指定します。

#### EIP名
EIPのリソース名を指定します。非必須パラメータです。

### EIPアタッチ
#### EIP ID
アタッチ対象のEIPを指定します。**必須パラメータ** です。
先程作成したEIPのリソースIDを指定します。

#### SLBインスタンス名
アタッチ対象のSLBインスタンスを指定します。**必須パラメータ** です。  
先程作成したSLBインスタンスのリソースIDを指定します。

#### インスタンスタイプ
EIPはSLBインスタンスだけでなく、ECSインスタンスやNATインスタンスにも付与可能であるため、  
対象のインスタンスがどのプロダクトなのかを指定する必要があります。  
指定可能な値は、以下の4つです。

1. Nat：Natインスタンス
2. SlbInstance：SLBインスタンス
3. EcsInstance：ECSインスタンス（のネットワークインタフェースeth0）
4. NetworkInterface：ネットワークインターフェース（eth1以降）

## 実行結果

エラーが発生しなければEIPの作成&アタッチ成功です。  
管理コンソール上からSLBインスタンスにEIPが付与されていることを確認しましょう。  

![SLB詳細画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606133936.png "img")      

無事EIPがアタッチされています。  
これでSLBインスタンスにインターネット越しにアクセス可能となりました。

### ECSにログインしよう 

さて、  
ついに準備が整ったので、ECSインスタンスにssh接続してみましょう  

ターミナルからSLBのEIPに向けsshコマンド実行します。  
`-i`オプションで前回作成しファイルとして出力しておいたssh秘密鍵を指定します。

```
# ssh root@47.91.xx.xx -i ssh_key_pair
```

**`Welcome to Alibaba Cloud Elastic Compute Server !`** とコンソール上に表示されれば、ログイン成功です。  

さらにもう一つターミナルを立ち上げ、SLBがリクエストを振り分けていることを確認してみましょう。

![ターミナル画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606134011.png "ターミナル画面")      

異なるECSインスタンスにログイン出来ていることが確認出来ました   

# Tips
## SLBとAuto Scaling紐付けのハマりポイント
SLBとAuto Scalingを紐付けようとした際に、いくつかハマりポイントがあるので、紹介していきます。

### 空のvServerGroupを作成出来ない
管理コンソールからvServerGroupをScaling Groupにアタッチする場合のハマりポイントです。

本記事のサンプルで紹介したように、SLBインスタンスを新規作成 ⇒ vServerGroupを新規作成しようとすると、**ハマります**。   

管理コンソール上から、`SLBインスタンス詳細画面` > `仮想サーバグループ` > `vServerGroupの作成`ボタンを押下すると、  
下記の画像のように「vServerGroup名」と、追加するインスタンスの選択を求められます。  

![vServerGroup作成画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606214106.png "vServerGroup作成画面")      

この際、`追加`ボタンを押下し、1つ以上のECSインスタンスを追加するまで、作成を実行するトリガである`OK`ボタンが活性化しません。  
しかしながら、vServerGroupに紐付けたいのは単体のECSインスタンスではなくAuto Scalingであり、  
本画面からはAuto Scalingを選択出来ないため、**詰みます**。  

ならば、とAuto Scaling側から操作しようにも、  
下記画像のようにScaling Groupの変更画面からは既存のvServerGroupを選択するだけで、  
新規vServerGroupは作成出来ないため、**詰みます**。

![Auto Scaling変更画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606214135.png "Auto Scaling変更画面")      

このようなユースケースでは、  

1. vServerGroup新規作成時にダミーのECSインスタンスを追加して作成する  
2. Auto Scalingと紐付ける  
3. ダミーのECSインスタンスをvServerGroupから削除する

といった手順を踏むことで解決出来ます。  
ただし、Scaling Group内にECSインスタンスが1台も起動していない場合は、ダミーECSをvServerGroupから外すことが出来ません。  
つまり、管理コンソール上からは空のvServerGroupを作成出来ないのです。  

このような場合は、Auto ScalingにECSインスタンスを立ち上げるか、  
あるいはダミーECSインスタンスを削除することで無理矢理vServerGroupからデタッチする、  
といった荒業を駆使しなければなりません。

### 空のリスナーを作成出来ない
上記のようなハマりポイントは、Default Server Groupでも同様に発生します。  

管理コンソールからSLBインスタンスを新規作成 → リスナーを作成しようとした際、  
下記画像のようにECSインスタンスを1つ以上選択するまで`次へ`ボタンが活性化しません。  

![リスナー作成画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606214159.png "リスナー作成画面")      

Auto Scaling側から操作しようにも、そもそもリスナーが作成されていないSLBインスタンスはプルダウン上に表示されません。  

![Auto Scaling変更画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606214250.png "Auto Scaling変更画面")      

リスナーを作成するにはDefault Server GroupにAuto Scalingを紐付けなければならない  
↓  
Auto ScalingにDefault Server Groupを紐付けるにはリスナーが作成されていないければならない  
↓  
リスナーを作成するには・・・  
といった"ニワトリタマゴ状態"に陥ってしまいます。  

この場合もvServerGroupと同様、ダミーのECSインスタンスを利用することで解決出来ます。

### 既存ECSインスタンスがアタッチされない
上記2つは管理コンソール上から操作した場合のハマりポイントでしたが、APIでSLBとAuto Scalingを紐付ける際にもハマりポイントは存在します。  

前述のサンプルコードでは、`AttachVServerGroups` APIを用いて作成したvServerGroupとAuto Scalingと紐付けていますが、  
Default Server GroupとAuto Sclangを紐付ける場合には、[AttachLoadBalancers](https://www.alibabacloud.com/cloud-tech/doc-detail/85125.htm)を利用します。  

ただし、`CreateLoadBalancerTCPListener`を用いて空のリスナーを作成後、  
`AttachLoadBalancers`でDefault Server Groupに指定したAuto Scalingが紐付けた場合、  
既存ECSインスタンスはDefault Server Groupに追加されません。

![Auto Scaling詳細画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606214309.png "Auto Scaling詳細画面")      

![Default Server Group画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127185100000/20190606214343.png "Default Server Group画面")      

このような場合には、  
Auto Scalingをローリングアップデートすることで、新規で起動するECSインスタンスをvServerGroupにアタッチすることが可能です。

# 最後に
かなりの長い記事になってしまいましたが、ここまでスキップせずにお読みいただけた方々は、  
APIについてだけでなく、SLB自体の知識・スキルが習得出来たのではないかと思います。     

第5回ではRDBMSサービスである**Apsara DB for RDS**を作成し、ECSインスタンスからクエリを発行してみたいと思います。    
