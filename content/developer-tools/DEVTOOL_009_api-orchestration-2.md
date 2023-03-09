---
title: "APIで自動構築② - VPC編"
metaTitle: "APIを用いてAlibaba Cloudリソースを自動構築する② - VPC編"
metaDescription: "APIを用いてAlibaba Cloudリソースを自動構築する② - VPC編"
date: "2019-05-23"
author: "SBC engineer blog"
thumbnail: "/developer-tools_images_17680117127154600000/000000000000000006.png"
---

## APIを用いてAlibaba Cloudリソースを自動構築する② - VPC編

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127154600000/000000000000000006.png "img")  

# はじめに

`APIを用いてAlibaba Cloudリソースを自動構築する`シリーズ第2回目となります。

[前回の記事](https://sbopsv.github.io/cloud-tech/developer-tools/DEVTOOL_008_api-orchestration-1)では、Alibaba Java SDKの開発環境を整備する手順を紹介しました。  
今回からは、本格的にAPIを用いてAlibaba Cloud上にリソースを構築していきたいと思います。

## 全体構成図
まずはじめに、本シリーズで構築するAlibaba Cloud環境の全体像をお見せします。

<figure class="figure-image figure-image-fotolife" title="全体構成図">[f:id:sbc_nttd_satouruzg:20190521205803.png "img")      <figcaption>全体構成図</figcaption></figure>

マルチゾーン[^1]を活用した、Webサーバの冗長化アーキテクチャです。

[^1]: 東京リージョンでは、2019年1月に第2のAvailability Zone（Zone B）がリリースされたばかりです。

主な登場人物としては、以下の6つです。

1. VPC  
2. VSwitch  
3. EIP  
4. SLB(Primary/Backup)  
5. Auto Scaling(ECS)  
6. RDS(Master/Slave/Read Replica)  

これらのコンポーネントをAPIを用いて作成することが、本シリーズのゴールをとなります。  

今回のVPC編では、本構成における土台となる、Virtual Private Cloud（VPC）を構築をしていきます。

## VPC要件
簡単な要件は以下の通りです。  

⦿ 東京リージョン（ap-northeast-1）に構築  
⦿ マルチゾーン（A Zone/B Zone）構成  
・ SLB/ECS/RDSのVSwitch（サブネット）を分割    
・ 各VSwitchは/24で構築  
⦿ （拡張性を考慮し）VPCは/20で構築 [^2]  

<figure class="figure-image figure-image-fotolife" title="VPC構成図">[f:id:sbc_nttd_satouruzg:20190521205834.png "img")      <figcaption>VPC構成図</figcaption></figure>

※<font color="Red">赤字</font>の部分が今回の構築対象となります。

[^2]: VPCおよびVSwitchの構築後のCIDR拡張は出来ませんので、ご注意ください。

# VPCを構築してみよう 
## 手順
VPC構築のおおまかな手順は以下となります。

1. VPCを作成する
2. 手順1で作成したVPC内にVSwitchを作成する
3. 手順2を各VSwitch分（6回）繰り返す

## APIリファレンス
では、APIリファレンスを参照し、必要な情報を集めていきましょう。

APIリファレンスはプロダクト毎に分かれており、  
[ドキュメントセンター](https://www.alibabacloud.com/help) > [Virtual Private Cloud](https://www.alibabacloud.com/cloud-tech/product/27706.htm) > [API reference](https://www.alibabacloud.com/cloud-tech/doc-detail/35479.htm) より、対象コンポーネント参照します。

VPCを作成するAPIであれば[CreateVpc](https://www.alibabacloud.com/cloud-tech/doc-detail/35737.htm) 、VSwitchを作成するAPIであれば[CreateVSwitch](https://www.alibabacloud.com/cloud-tech/doc-detail/35745.htm)  
といった具合に、基本的にAPIの命名規則は`動詞 + コンポーネント名`になっています。  

今回利用する2つのAPIはどちらも簡易なため、詳細はサンプルコード内で説明します。  
（慣れてくると、単純なAPIであればリファレンスを参照せずにIDEのコンテンツアシスト機能で事足りるようになります。）

# VPCを作成 

## VPC SDKをインポート

忘れがちですが、SDKはプロダクト毎に提供されているため、VPC用のJava SDKをインポートする必要があります。  
以下のように`pom.xml`に依存関係を追加してください。

```xml
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>aliyun-java-sdk-vpc</artifactId>
    <version>3.0.6</version>
</dependency>
```

## サンプルコード

準備が整ったので、早速コードを書いていきましょう   
まずは、以下のサンプルコードを参考に、VPCを作成します。

```java
package com.alibaba.demo.apisample;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.vpc.model.v20160428.CreateVpcRequest;
import com.aliyuncs.vpc.model.v20160428.CreateVpcResponse;
import com.aliyuncs.vpc.model.v20160428.DescribeVpcsRequest;
import com.aliyuncs.vpc.model.v20160428.DescribeVpcsResponse;

public class ApiSample {

    private static final String REGION_ID = "ap-northeast-1";
    private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
    private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    public static void main(String[] args) {

        IAcsClient client = new DefaultAcsClient(
            DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));
/** ---------------------- ↑ここまで前回のサンプルと同様 ---------------------- */

        CreateVpcRequest request = new CreateVpcRequest();
        request.setVpcName("vpc-api-demo");  // VPC名
        request.setCidrBlock("10.0.0.0/20"); // IPアドレス範囲

        try {
            // VPC作成
            CreateVpcResponse response = client.getAcsResponse(request);
            System.out.println("VPC ID:" + createVpcResponse.getVpcId());

/** ---------------------- ↓ここから前回のサンプルと同様 ---------------------- */
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }
}
```

コメントにあるように、前回紹介したサンプルコードと重複している部分については説明を省略させていただきます。  


ご覧の通り、実質たったの4ステップでVPCが作成出来ます 

#### VPC名
VPCの名前を指定します。  
必須パラメータではありませんが、指定しない場合は名無しのVPCが作成されるため、管理上指定しておいた方が無難です。

#### IPアドレス範囲
VPCのIPアドレスの範囲をCIDR形式で指定します。  
こちらも非必須パラメータで、指定しない場合はデフォルトの`172.16.0.0/12`で作成されます。  
今回は要件に従い、`10.0.0.0/20`を指定しました。  

なお、指定可能なIPアドレス範囲は、下記の3つとそれらのサブセットに限定されます。

- ・10.0.0.0/8  
- ・172.16.0.0/12  
- ・192.168.0.0/16  

## 実行結果
下記のように、Console上に作成したVPCのリソースIDが表示されれば成功です。  
このIDはVSwitch作成時に使用するので、控えておいてください。
```
VPC ID:vpc-6wekbo76l1h7j66b26wxx
```

管理コンソール上から作成したVPCを確認してみましょう。  

<figure class="figure-image figure-image-fotolife" title="VPCコンソール画面">[f:id:sbc_nttd_satouruzg:20190521205929.png "img")      <figcaption>VPCコンソール画面</figcaption></figure>

無事、指定したパラメータ通りにVPCが作成されました。

# VSwitchを作成  
次に、先程作成したVPC内にVSwitchを作成しましょう。

## サンプルコード

```java
package com.alibaba.demo.apisample;

import com.alibaba.demo.apisample.enums.zones.TokyoZones;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.vpc.model.v20160428.CreateVSwitchRequest;

public class ApiSample {

    private static final String REGION_ID = "ap-northeast-1";
    private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
    private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    public static void main(String[] args) {

        IAcsClient client = new DefaultAcsClient(
            DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));
/** ---------------------- ↑ここまで前述のサンプルと同様 ---------------------- */

        String vpcId = "vpc-6wekbo76l1h7j66b26wxx";           // VPC ID

        CreateVSwitchRequest request1 = new CreateVSwitchRequest();
        request1.setVpcId(vpcId);                             // VPC ID
        request1.setVSwitchName("vswitch-api-demo-1");        // VSwitch名
        request1.setCidrBlock("10.0.0.0/24");                 // IPアドレス範囲
        request1.setZoneId(TokyoZones.ZONE_A_ID.getZoneId()); // Zone ID

        CreateVSwitchRequest request2 = new CreateVSwitchRequest();
        request2.setVpcId(vpcId);
        request2.setVSwitchName("vswitch-api-demo-2");
        request2.setCidrBlock("10.0.1.0/24");
        request2.setZoneId(TokyoZones.ZONE_A_ID.getZoneId());

        CreateVSwitchRequest request3 = new CreateVSwitchRequest();
        request3.setVpcId(vpcId);
        request3.setVSwitchName("vswitch-api-demo-3");
        request3.setCidrBlock("10.0.2.0/24");
        request3.setZoneId(TokyoZones.ZONE_A_ID.getZoneId());

        CreateVSwitchRequest request4 = new CreateVSwitchRequest();
        request4.setVpcId(vpcId);
        request4.setVSwitchName("vswitch-api-demo-4");
        request4.setCidrBlock("10.0.8.0/24");
        request4.setZoneId(TokyoZones.ZONE_B_ID.getZoneId());

        CreateVSwitchRequest request5 = new CreateVSwitchRequest();
        request5.setVpcId(vpcId);
        request5.setVSwitchName("vswitch-api-demo-5");
        request5.setCidrBlock("10.0.9.0/24");
        request5.setZoneId(TokyoZones.ZONE_B_ID.getZoneId());

        CreateVSwitchRequest request6 = new CreateVSwitchRequest();
        request6.setVpcId(vpcId);
        request6.setVSwitchName("vswitch-api-demo-6");
        request6.setCidrBlock("10.0.10.0/24");
        request6.setZoneId(TokyoZones.ZONE_B_ID.getZoneId());

        try {
            System.out.println("VSwitchを作成します。");

            // VSwitch作成
            client.getAcsResponse(request1);
            client.getAcsResponse(request2);
            client.getAcsResponse(request3);
            client.getAcsResponse(request4);
            client.getAcsResponse(request5);
            client.getAcsResponse(request6);

            System.out.println("VSwitchの作成が完了しました ");

/** ---------------------- ↓ここから前述のサンプルと同様 ---------------------- */
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }

}
```

VSwitchを6つ作成しているため、VPCに比べるとコードがかなり長くなってしまいますね。  

#### VPC ID
VSwitchを作成するVPCのリソースIDを指定します。**必須パラメータ** です。  
先程控えたVPCのIDを指定します。全VSwitchで同じIDを使用するため、今回は変数に格納しています。

#### VSwitch名
VSwitchの名前を指定します。  
VPC名と同様に非必須パラメータですが、指定した方が無難です。

#### IPアドレス範囲
VSwitchのIPアドレス範囲をCIDR形式で指定します。  
**必須パラメータ** で、VPCのCIDRに包含されていなければなりません。

#### Zone ID
VSwitchを作成するZoneのIDを指定します。**必須パラメータ** です。  
本シリーズでは東京リージョンにリソースを構築するため、選択可能な値は`ap-northeast-1a（Zone A）`または`ap-northeast-1b（Zone B）`になります。 [^3]

[^3]:なお、利用可能なZoneとそのIDを取得するには、[DescribeZones](https://www.alibabacloud.com/cloud-tech/doc-detail/36064.htm)を使用します。

このZone IDは今後も頻繁に使用するため、列挙型を定義しました。  
今回は、`enums` > `zones`に`TokyoZones`という名前で東京リージョンにおけるZone IDのEnumを作成しています。

```java
package com.alibaba.demo.apisample.enums.zones;

public enum TokyoZones {

    ZONE_A_ID("ap-northeast-1a"),
    ZONE_B_ID("ap-northeast-1b");

    private String zoneId;

    private TokyoZones(String zoneId) {
        this.zoneId = zoneId;
    }

    public String getZoneId() {
        return this.zoneId;
    }
}
```

## 実行結果
管理コンソール上から作成したVSwitchを確認してみましょう。  

先程VPCを作成した時点では0だったVSwitchが、API実行後は6に増えていることがわかります。

<figure class="figure-image figure-image-fotolife" title="VPCコンソール画面">[f:id:sbc_nttd_satouruzg:20190521210011.png "img")      <figcaption>VPCコンソール画面</figcaption></figure>

リンクをクリックし、VPC内VSwitch一覧を表示してみましょう。  

<figure class="figure-image figure-image-fotolife" title="VSwitchコンソール画面">[f:id:sbc_nttd_satouruzg:20190521210109.png "img")      <figcaption>VSwitchコンソール画面</figcaption></figure>

全てのVSwitchが指定したパラメータ通りに作成されていることが確認出来ました。

## おまけ
先程のサンプルコードのように、  
VSwitchの数だけリクエストクラスのインスタンスを生成 ⇒ 各パラメータをセット  
とやっていると、サブネットを細かく切るにつれ、コードが膨大になってしまいます。 [^4]

[^4]: ちなみに、VPC内に作成可能なVSwitchは最大で24までとなります。

かなり強引ではありますが、以下のようにインナークラスを定義しコンストラクタを利用することで、記述量を減らすことが可能です。

```java
// omitted

    class CustomRequest extends CreateVSwitchRequest {
        CustomRequest(String vpcId, String vSwitchName, TokyoZones zone, String cidrBlock) {
            super.setVpcId(vpcId);
            super.setVSwitchName(vSwitchName);
            super.setZoneId(zone.getZoneId());
            super.setCidrBlock(cidrBlock);
        }
    }

    try {
        client.getAcsResponse(new CustomRequest(vpcId, "vswitch-api-demo-1", TokyoZones.ZONE_A_ID, "10.0.0.0/24"));
        client.getAcsResponse(new CustomRequest(vpcId, "vswitch-api-demo-2", TokyoZones.ZONE_A_ID, "10.0.1.0/24"));
        client.getAcsResponse(new CustomRequest(vpcId, "vswitch-api-demo-3", TokyoZones.ZONE_A_ID, "10.0.2.0/24"));
        client.getAcsResponse(new CustomRequest(vpcId, "vswitch-api-demo-4", TokyoZones.ZONE_B_ID, "10.0.8.0/24"));
        client.getAcsResponse(new CustomRequest(vpcId, "vswitch-api-demo-5", TokyoZones.ZONE_B_ID, "10.0.9.0/24"));
        client.getAcsResponse(new CustomRequest(vpcId, "vswitch-api-demo-6", TokyoZones.ZONE_B_ID, "10.0.10.0/24"));
    }

// omitted
```

# Tips
## ① CIDRブロックのプレフィックスを指定可能 ？
管理コンソール上からVPCを作成した場合、VPCのIPアドレス範囲は、

- ・10.0.0.0/8  
- ・172.16.0.0/12  
- ・192.168.0.0/16

の3つから選択する必要があり、例えば/20などの細かなプレフィックスを指定することが出来ません。

<figure class="figure-image figure-image-fotolife" title="VPC作成画面">[f:id:sbc_nttd_satouruzg:20190521165305.png "img")      <figcaption>VPC作成画面</figcaption></figure>

一方APIでVPCを作成する場合、前述の通り/8（172系の場合は/12、192系の場合は/16）から/24まで、自由に指定が可能です。  

このように、現状ではAPIでのみ実行可能な操作がいくつか存在しており、APIを用いて環境構築を行うメリットのひとつとなっています。

## ② 必須パラメータを指定しない ？
先程使用した[CreateVpc](https://www.alibabacloud.com/cloud-tech/doc-detail/35737.htm)のAPIリファレンスを見ると、

- ・Action
- ・RegionId

が **必須パラメータ** として掲示されています。  
しかしながら、先程のサンプルでは`Action`も`RegionId`も指定せずにAPIを実行したのにも関わらず、正常にリソースが作成されました。  

一体どうしてでしょう？？  

実は、これらAPIリファレンスはJava SDKだけでなく、その他のSDK（Python等）、さらにはSDK以外のAPI実行手段（CLI等）のリファレンスも兼ねており、  
`Action`および`RegionId`はURLリクエストを用いてAPIを実行する場合の必須パラメータなのです。

Java SDKの場合、  
`Action`は各API専用のリクエストクラスのコンストラクタで指定されています。

<figure class="figure-image figure-image-fotolife" title="リクエストクラス">[f:id:sbc_nttd_satouruzg:20190521165719.png "img")      <figcaption>リクエストクラス</figcaption></figure>

また、`RegionId`はAPI実行時に（getAcsResponseメソッドの呼び出し先で）クライアントクラスに設定されているRegionIdがそのまま設定されます。

<figure class="figure-image figure-image-fotolife" title="クライアントクラス">[f:id:sbc_nttd_satouruzg:20190521165817.png "img")      <figcaption>クライアントクラス</figcaption></figure>

ソースコードを見るとわかるように、クライントクラスのRegionIdがリクエストクラスに設定されるのは、リクエストクラスにRegionIdが設定されていない場合のみとなります。  
つまり、リクエストクラスで明示的にRegionIdを設定することにより、クライアントクラスに設定したリージョンとは別のリージョンのリソースを操作することが可能となります。 [^5]

[^5]: ただし、`AcsRequest`(各リクエストクラスの親クラス)のsetRegionメソッドを見ると`@Deprecated`アノテーションが付与されており、個別にリージョンを設定するのは非推奨のようです。

# 最後に
今回はTips多めでお送りしましたが、  
ドキュメントだけではわからない点、実際にAPIを実行してみないと気付かない点が多くあるのではないかと思います。  
本シリーズではAPIの使い方を紹介するだけではなく、これらノウハウをどんどん紹介していきたいと考えています。

第3回では、今回作成したVPC内にAuto Scalingを作成し、ECSサーバをたててみたいと思います。  
