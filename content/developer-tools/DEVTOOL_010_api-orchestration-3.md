---
title: "APIで自動構築③ - AutoScaling編"
metaTitle: "APIを用いてAlibaba Cloudリソースを自動構築する③ - Auto Scaling編"
metaDescription: "APIを用いてAlibaba Cloudリソースを自動構築する③ - Auto Scaling編"
date: "2019-05-30"
author: "SBC engineer blog"
thumbnail: "/developer-tools_images_17680117127171300000/000000000000000007.png"
---

## APIを用いてAlibaba Cloudリソースを自動構築する③ - Auto Scaling編

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/000000000000000007.png "img")  

# はじめに

`APIを用いてAlibaba Cloudリソースを自動構築する`シリーズ第3回目となります。

[前回の記事](https://sbopsv.github.io/cloud-tech/developer-tools/DEVTOOL_009_api-orchestration-2)では、  
シリーズを通して作成するAlibaba Cloud環境の構成図を紹介し、さらに各コンポーネントの土台となるVPCおよびVSwitchを作成しました。  

今回は前回構築したVPC内にAuto Scalingを作成し、ECSサーバをたててみたいと思います。

## Auto Scaling要件

簡単な要件は以下の通りです。  

⦿ マルチゾーン（A Zone/B Zone）構成  
⦿ Webサーバ用サブネット（10.0.1.0/24、10.0.9.0/24）に構築  
⦿ 各VSwitchに1台づつECSインスタンスを起動  

![Auto Scaling構成図](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529161203.png "Auto Scaling構成図")      

※<font color="Red">赤字</font>の部分が今回の構築対象となります。

# Auto Scalingを作成してみよう 
## 手順
ECSサーバ起動までのおおまかな手順は以下となります。

1. sshキーペアを作成する
2. Security Groupを作成する
3. Scaling Groupを作成する  
4. 手順1、手順2で作成したsshキーペアおよびSecurity Groupをもとに、Scaling Configurationを作成する  
5. 手順3で作成したScaling Groupを有効化し、ECSインスタンスを起動する

## APIリファレンス
上記の各手順に  対応するAPIを紹介します。

1. [CreateKeyPair](https://www.alibabacloud.com/cloud-tech/doc-detail/51771.htm)：ECS SDKのAPIです。sshキーペアを作成します。  
2. [CreateSecurityGroup](https://www.alibabacloud.com/cloud-tech/doc-detail/25553.htm)：ECS SDKのAPIです。Security Groupを作成します。  
3. [CreateScalingGroup](https://www.alibabacloud.com/cloud-tech/doc-detail/25936.htm)：Auto Scaling(ESS)[^6] SDKのAPIです。Scaling Groupを作成します。  
4. [CreateScalingConfiguration](https://www.alibabacloud.com/cloud-tech/doc-detail/25944.htm)：Auto Scaling(ESS) SDKのAPIです。Scaling Configrationを作成します。  
5. [EnableScalingGroup](https://www.alibabacloud.com/cloud-tech/doc-detail/25939.htm)：Auto Scaling(ESS) SDKのAPIです。Scaling Groupを有効化します。  

各APIのポイントについては、サンプルコード内で説明します。  
より詳細な情報は、上記リンクよりそれぞれのAPIリファレンスを参照してください。

[^6]: ESSとは、SDK名やパッケージ名で用いられるAuto Scalingの略称です。(**E**lastic **S**caling **S**ervice)

# sshキーペアを作成 

まずは、Auto Scalingの機能で起動したECSインスタンスにssh接続するためのsshキーペアを作成します。

## サンプルコード

```java
package com.alibaba.demo.apisample;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.ecs.model.v20140526.CreateKeyPairRequest;
import com.aliyuncs.ecs.model.v20140526.CreateKeyPairResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;

public class ApiSample {

    private static final String REGION_ID = "ap-northeast-1";
    private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
    private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    public static void main(String[] args) {

        IAcsClient client = new DefaultAcsClient(
            DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));
/** ---------------------- ↑ここまで前回のサンプルと同様 ---------------------- */

        CreateKeyPairRequest request = new CreateKeyPairRequest();
        request.setKeyPairName("keypair-api-demo"); // sshキーペア名

        try {
            // キーペア作成
            CreateKeyPairResponse response = client.getAcsResponse(request);

            Files.writeString(Path.of("/Users/username/Desktop/privateKey/ssh_key_pair.pem"),
                response.getPrivateKeyBody());      // ファイル出力

        } catch (IOException e) {
            e.printStackTrace();

/** ---------------------- ↓ここから前回のサンプルと同様 ---------------------- */
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }
}
```

#### sshキーペア名
sshキーペアの名前を指定します。**必須パラメータ** です。

#### ファイル出力
作成したsshキーペアの秘密鍵をファイルとして出力しています。  
**<font color="Red">秘密鍵は、キーペアを作成したタイミングでのみ保存可能です。</font>**  
APIのレスポンス（CreateKeyPairResponse）を確実に受け取り、標準出力、またはファイルに出力するよう注意してください。

## 実行結果
指定したパスにファイルが作成されていれば成功です。

![sshキーペア（GUI）](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529161246.png "sshキーペア（GUI）")      


```
sh-3.2# cat ssh_key_pair.pem
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAnaNkuFYG30moEiOKxWVkSXbgBWm0+R34FoZndno07z7ECe/l
O/F56pwb+njzLfUfwRBblyM+8wpl9Yl+Qnam1+YI8YCZrfg6AkMpTFHkMkRiIRJo
　 ：
（中略）
　 ：
p4jdS3unzM7YpRjm4O56bPUEV6kHvk53KmvGfw1bvavgUtjCvAGS
-----END RSA PRIVATE KEY-----
```

# Security Groupを作成  

次に、Auto Scalingの機能で起動したECSインスタンスに付与されるSecurity Groupを作成します。

## サンプルコード

```java
package com.alibaba.demo.apisample;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.ecs.model.v20140526.CreateSecurityGroupRequest;
import com.aliyuncs.ecs.model.v20140526.CreateSecurityGroupResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;

public class ApiSample {

   private static final String REGION_ID = "ap-northeast-1";
   private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
   private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    public static void main(String[] args) {

        IAcsClient client = new DefaultAcsClient(
            DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));
/** ---------------------- ↑ここまで前回のサンプルと同様 ---------------------- */

        CreateSecurityGroupRequest request = new CreateSecurityGroupRequest();
        request.setSecurityGroupName("sg-api-demo");      // Security Group名
        request.setVpcId("vpc-6wekbo76l1h7j66b26wxx");    // VPC ID

        try {
            // Security Group作成
            CreateSecurityGroupResponse response = client.getAcsResponse(request);
            System.out.println("Security Group ID：" + response.getSecurityGroupId());

/** ---------------------- ↓ここから前回のサンプルと同様 ---------------------- */
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }
}
```

#### Security Group名
Security Groupの名前を指定します。  
必須パラメータではありませんが、指定しない場合は名無しのSecurity Groupが作成されるため、管理上指定しておいた方が無難です。

#### VPC ID
Security Groupを作成するVPCのIDを指定します。**必須パラメータ** です。  
前回作成したVPCのIDを指定します。[^1]

[^1]: もしも前回作成したVPCのIDを忘れてしまった場合、[DescribeVpcs](https://www.alibabacloud.com/cloud-tech/doc-detail/35739.htm)でリソースIDを取得してください。

## 実行結果
下記のように、Console上に作成したSecurity GroupのリソースIDが表示されれば成功です。  
このIDはScaling Configuration作成時に使用するので、控えておいてください。
```
Security Group ID：sg-6we40hb018mewoovbxf2
```

管理コンソール上から作成したSecurity Groupを確認してみましょう。  

`Elastic Compute Service`　>　`セキュリティグループ`より、Security Groupの一覧を表示します。

![Security Groupコンソール画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529175523.png "Security Groupコンソール画面")      


無事にSecurity Groupが作成されていることが確認出来ました。

なお、Security Groupの仕様として、

- ・ **インバウンドルール**については、基本的に全てのアクセスを**拒否**し、指定したIP（またはSecurity Group）のみを**許可**する<font color="Red">ホワイトリスト方式</font>  
- ・ **アウトバウンドルール**については、基本的に全てのアクセスを**許可**し、指定したIP（またはSecurity Group）のみを**拒否**する<font color="Red">ブラックリスト方式</font>  

となっています。  

APIを用いてSecurity Groupを作成した場合、作成時点ではIN/OUTともに何もルールが設定されていないため、**どこからもアクセス出来ない** & **どこにでもアクセス出来る**状態となっていますので、注意が必要です。[^2]

※ただし、同一Security GroupがアタッチされているECSインスタンス同士の通信は、デフォルトで許可されます。[^3]  
（今回のサンプルでは、作成したScaling Group内のECSインスタンス間の通信は許可されます。)  

[^2]: なお、本記事で作成するAuto Scalingで起動するECSインスタンスについては、パブリックIPおよびEIPは付与されないため、Security Groupのルールに関わらず、外部からのアクセスは不可能となっています。

[^3]: 同一Security Group内の通信をデフォルトで拒否するよう設定したい場合、[ModifySecurityGroupPolicy](https://www.alibabacloud.com/cloud-tech/doc-detail/57315.htm)で`InnerAccessPolicy`を`Drop`に設定します。

# Auto Scalingを作成   

## Auto Scaling SDKをインポート

例によって、Auto Scaling用のJava SDKを忘れずにインポートしましょう。  

```xml
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>aliyun-java-sdk-ess</artifactId>
    <version>2.3.0</version>
</dependency>
```

本記事では、ECS SDKも使用しますので、インポートしていない場合は[第1回の記事](https://sbopsv.github.io/cloud-tech/developer-tools/DEVTOOL_008_api-orchestration-1)を参考に、`pom.xml`に依存関係を追加してください。

## サンプルコード
先程紹介した手順の、**3. Scaling Group作成**から**5. Scaling Groupの有効化**までを、一気通貫でやってしまいます。

```java
package com.alibaba.demo.apisample;

import java.util.Arrays;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.ess.model.v20140828.CreateScalingConfigurationRequest;
import com.aliyuncs.ess.model.v20140828.CreateScalingGroupRequest;
import com.aliyuncs.ess.model.v20140828.EnableScalingGroupRequest;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;

public class ApiSample {

    private static final String REGION_ID = "ap-northeast-1";
    private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
    private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    public static void main(String[] args) throws ServerException, ClientException {

        IAcsClient client = new DefaultAcsClient(
            DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));

        System.out.println("Auto Scalingを作成します。");

        /** ---------------------- Scaling Group作成 ---------------------- */

        CreateScalingGroupRequest createScalingGroupRequest = new CreateScalingGroupRequest();
        createScalingGroupRequest.setScalingGroupName("asg-api-demo");                // Scaling Group名
        createScalingGroupRequest.setVSwitchIds(
            Arrays.asList("vsw-6wepj9jljr2leacu2pwdj", "vsw-6wem4j7seoxdlnkjzadfl")); // VSwitch ID
        createScalingGroupRequest.setMultiAZPolicy("BALANCE");                        // マルチAZポリシー
        createScalingGroupRequest.setScalingPolicy("release");                        // スケーリングポリシー
        createScalingGroupRequest.setMaxSize(Integer.valueOf(2));                     // 最大台数
        createScalingGroupRequest.setMinSize(Integer.valueOf(2));                     // 最小台数

        // Scaling Group作成
        String scalingGroupId = client.getAcsResponse(createScalingGroupRequest).getScalingGroupId();

        /** ---------------------- Scaling Configuration作成 ---------------------- */

        CreateScalingConfigurationRequest createScalingConfigurationRequest = new CreateScalingConfigurationRequest();
        createScalingConfigurationRequest.setScalingConfigurationName("scaling-config-api-demo"); // Scaling Configuration名
        createScalingConfigurationRequest.setScalingGroupId(scalingGroupId);                      // Scaling Group ID
        createScalingConfigurationRequest.setSecurityGroupId("sg-6we40hb018mewoovbxf2");          // Security Group ID
        createScalingConfigurationRequest.setInstanceType("ecs.t5-lc1m1.small");                  // インスタンスタイプ
        createScalingConfigurationRequest.setImageId("centos_7_06_64_20G_alibase_20190218.vhd");  // イメージID
        createScalingConfigurationRequest.setKeyPairName("keypair-api-demo");                     // sshキーペア名
        createScalingConfigurationRequest.setInstanceName("ecs-api-demo");                        // ECSインスタンス名
        createScalingConfigurationRequest.setSystemDiskCategory("cloud_efficiency");              // システムディスクタイプ
        createScalingConfigurationRequest.setSystemDiskSize(Integer.valueOf(40));                 // システムディスクサイズ

        // Scaling Configuration作成
        String scalingConfigrationId = client.getAcsResponse(createScalingConfigurationRequest).getScalingConfigurationId();

        /** ---------------------- Scaling Group有効化 ---------------------- */

        EnableScalingGroupRequest enableScalingGroupRequest = new EnableScalingGroupRequest();
        enableScalingGroupRequest.setScalingGroupId(scalingGroupId);                        // Scaling Group ID
        enableScalingGroupRequest.setActiveScalingConfigurationId(scalingConfigrationId);   // Scaling Configration ID

        // Scaling Group有効化
        client.getAcsResponse(enableScalingGroupRequest);

        System.out.println("Auto Scalingの作成が完了しました ");
    }
}
```
※コードが煩雑になるため、本サンプルでは例外は捕捉せず`throw`しています。

リクエストパラメータが結構な量になっているので、ブロックに分けて解説していきます。

### Scaling Group作成
#### Scaling Group名
Scaling Groupの名前を指定します。  
非必須パラメータで、指定しない場合は作成時に生成されるScaling Group IDと同様の名前で作成されます。

#### VSwitch ID
Scaling Groupを作成するVSwitchのIDを指定します。**必須パラメータです。**  
型が`List<String>`となっており、複数のVSwitchを指定可能です。  
今回はマルチゾーンで作成するため、Webサーバ用サブネットのAゾーンとBゾーン2つVSwitchを指定しています。

#### マルチAZポリシー
マルチゾーンでScaling Groupを作成した場合の、ECSインスタンスを起動するVSwitchの選定基準です。  
非必須パラメータで、指定しない場合は`PRIORITY`が設定されます。  
指定可能な値は以下の3つです。  

1. **PRIORITY**（デフォルト）：優先度の高いVSwitchから順にECSインスタンスを起動します。  
2. **COST_OPTIMIZED**：vCPUの単価に基づき、コストが最も安価になるようにVSwitchを選択します。  
3. **BALANCE**：全てのVSwitch間でECSインスタンスの数が均等になるようにVSwitchを選択します。  

今回は各ゾーンに1台ずつECSインスタンスを起動させたいため、`BALANCE`を指定しています。

#### スケーリングポリシー
Auto Scalingの機能でECSインスタンスがスケールインする際の挙動を定義します。  
非必須パラメータで、指定しない場合はデフォルトの`recycle`が設定されます。  
指定可能な値は以下の2つです。  

1. **recycle**（デフォルト）：対象のECSインスタンスは削除されず停止状態となり、Scaling Groupから除外されます。次回スケールアウト時は、これら停止中のインスタンスから優先的にScaling Groupに追加されます。停止中も、ディスクや帯域幅には課金されたままとなります。  
2. **release**：対象インスタンスは削除されます。  

今回は`release`を指定しています。

#### 最大台数
Scaling Group内のECSインスタンスの最大台数を指定します。**必須パラメータ** です。  
Scaling Group内のECSインスタンスがこの最大台数を超えた場合、それ以下の台数になるよう自動的に調整されます。  
指定可能な値は、`0`から`1000`まで（ただし、最小台数以上）です。

#### 最小台数
Scaling Group内のECSインスタンスの最小台数を指定します。**必須パラメータ** です。  
Scaling Group内のECSインスタンスがこの最小台数を下回った場合、それ以上の台数になるよう自動的に調整されます。  
指定可能な値は、`0`から`1000`まで（ただし、最大台数以下）です。

### Scaling Configuration作成
#### Scaling Configuration名
Scaling Configurationの名前を指定します。  
非必須パラメータで、指定しない場合は作成時に生成されるScaling Configuration IDと同様の名前で作成されます。

#### Scaling Group ID
Scaling Configurationを作成するScaling GroupのIDを指定します。**必須パラメータです。**  
前ブロックで実行したScaling Group作成API（`CreteScalingGroup`）のレスポンスパラメータで返却されたScaling Group IDを指定します。

#### Security Group ID
起動したECSインスタンスにアタッチするSecurity GroupのIDを指定します。**必須パラメータです。**  
前手順で作成したSecurity GroupのIDを指定します。

#### インスタンスタイプ
起動するECSインスタンスのインスタンスタイプを指定します。**必須パラメータです。**  
指定可能なインスタンスタイプの一覧は、[DescribeInstanceTypes](https://www.alibabacloud.com/cloud-tech/doc-detail/25620.htm)で取得出来ます。  

今回はテスト用なので、`ecs.t5-lc1m1.small`を指定しています。

#### イメージID
起動するECSインスタンスの起動イメージを指定します。  
Scaling Configurationを元にECSインスタンスを起動する場合に、**必須パラメータです。**（起動テンプレートを元にする場合は非必須）  
指定可能なイメージIDの一覧は、[DescribeImages](https://www.alibabacloud.com/cloud-tech/doc-detail/25534.htm)で取得出来ます。

今回はAlibaba Cloudが提供するパブリックイメージ（Centos 7.6）を指定していますが、自分で作成したカスタムイメージも指定可能です。

#### sshキーペア名
起動したECSインスタンスにログインするためのsshキーペアを指定します。  
非必須パラメータで、Linux系OSのECSインスタンスを作成する場合にのみ、指定可能です。  
今回はCentos 7.6で作成するため、前手順で作成したsshキーペアのリソース名を指定します。

#### ECSインスタンス名
起動するECSインスタンスに付与される名前を指定します。  
非必須パラメータで、指定しない場合は`"ESS-asg-"` + `Scaling Group名`の命名規則で名前が決定されます。

#### システムディスクタイプ
起動するECSインスタンスにおける、システムディスクのディスクタイプを指定します。  
非必須パラメータで、指定しない場合はインスタンスタイプより適切なディスクタイプが設定されます。  
指定可能な値は以下の3つです。  

1. **cloud**：汎用クラウドディスク。低性能。
2. **cloud_efficiency**：Ultraクラウドディスク。中性能。
3. **cloud_ssd**：SSDクラウドディスク。高性能。

#### システムディスクサイズ
起動するECSインスタンスにおける、システムディスクのディスクサイズを指定します（GB）。   
非必須パラメータで、指定しない場合はインスタンスタイプより適切なディスクサイズが設定されます。  
指定可能な値は、インスタンスタイプやディスクタイプによって異なります。  

### Scaling Group有効化
#### Scaling Group ID
アクティベートするScaling GroupのIDを指定します。**必須パラメータです。**  

#### Scaling Configuration ID
アクティベートするScaling ConfigurationのIDを指定します。  
非必須パラメータで、Scaling Group内にアクティブなScaling Configurationが設定されていない場合、またはScaling Configurationを変更したい場合に指定します。

## 実行結果
エラーなく、完了メッセージが表示されれば成功です   
管理コンソールから作成したAuto Scalingを確認しましょう。

`Auto Scaling`　>　`スケーリンググループリスト`より、Scaling Groupの一覧を表示します。

![Scaling Groupコンソール画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529161457.png "Scaling Groupコンソール画面")      

指定したパラメータ通りにScaling Groupが作成されています。

Scaling Groupを有効化した直後はECSが起動中であるため、「インスタンスの総数」は0のままです。  

`スケーリングアクティビティ`より、スケーリングアクションのアクティビティログを確認します。  
ステータスが<span style="color: #00cc00">**成功**</span>になるまで待機します。

![スケーリングアクティビティ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529182648.png "スケーリングアクティビティ")      

Auto Scalingの機能でECSインスタンスが2台起動しました。  
さらに、`ECSインスタンスリスト`からインスタンスの詳細を確認します。

起動してきたECSインスタンスのステータスが<span style="color: #00cc00">**サービス中**</span>、およびヘルスチェックステータスが<span style="color: #00cc00">**正常**</span>であることを確認します。

![ECSインスタンスリスト](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529181503.png "ECSインスタンスリスト")      

![ECS詳細画面①](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529161637.png "ECS詳細画面①")      

![ECS詳細画面②](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529161703.png "ECS詳細画面②")      

各ゾーンに1台ずつECSインスタンスが起動出来ました  

# Tips
## ECSインスタンスが起動するゾーンが偏る ？
Scaling Group作成時にマルチAZポリシーを`BALANCE`に指定し、ゾーン内に均等にECSインスタンスが起動するよう設定したにもかかわらず、片方のゾーンにしかインスタンスが起動しない場合があります。  

これは、**Scaling Configurationのインスタンスタイプに、片方のゾーンにしか存在しないインスタンスタイプを指定している**ことが原因です。[^4]  

管理コンソールのECS作成画面や、Scaling Configration作成画面より`対応可能インスタンスタイプとリージョン`のリンクを押下することで、  
各ECSインスタンスタイプが対応しているリージョン、およびゾーンの一覧が参照可能です。

![Scaling Configuration作成画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529161742.png "Scaling Configuration作成画面")      

`詳細`にカーソールを合わせることで、サポートされるゾーンが確認出来ます。

![インスタンスタイプ一覧①](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529180854.png "img")      

今回のサンプルで指定した`ecs.t5-lc1m1.small`では、Aゾーン/Bゾーンともに対応していることが確認出来ます。

![インスタンスタイプ一覧②](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127171300000/20190529162036.png "img")      

マルチゾーンでAuto Scalingを作成しているのに、起動するゾーンが偏るなぁと感じたら、  

- ⦿マルチAZポリシーが`BALANCE`になっているか  
- ⦿インスタンスタイプが双方のゾーンで提供されているか  

を確認してみてください。

[^4]: 両ゾーンに存在するインスタンスタイプであっても、リソース状況によっては片方のゾーンに偏ってしまう可能性もあります。

# 最後に
第4回では、Server Load Balancer(SLB)を作成してみたいと思います。  
今回作成したAuto ScalingとSLBを紐付け、ECSインスタンスにssh接続してみましょう 

