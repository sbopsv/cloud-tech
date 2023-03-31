---
title: "APIで自動構築⑤ - RDS編"
metaTitle: "APIを用いてAlibaba Cloudリソースを自動構築する⑤ - RDS編"
metaDescription: "APIを用いてAlibaba Cloudリソースを自動構築する⑤ - RDS編"
date: "2019-06-19"
author: "SBC engineer blog"
thumbnail: "/developer-tools_images_17680117127201900000/000000000000000009.png"
---

# APIで自動構築⑤ - RDS編

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/000000000000000009.png "img")  

# はじめに

`APIを用いてAlibaba Cloudリソースを自動構築する`シリーズ第5回目となります。

[前回の記事](https://sbopsv.github.io/cloud-tech/developer-tools/DEVTOOL_011_api-orchestration-4)では、Server Load Balancerを作成し、RDS経由でECSサーバにログインしました。  
今回はRDBMSサービスであるApsara DB for RDSを作成し、ECSインスタンスからクエリを発行してみたいと思います。

## RDS要件

簡単な要件は以下の通りです。  

⦿ DBエンジンはMySQLで構築（Apsara DB for MySQL）  
⦿ リードレプリカ（読み取り専用インスタンス）を構築  
⦿ マスターインスタンス/リードレプリカともにマルチゾーン（A Zone/B Zone）構成  

![RDS構成図](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617155557.png "RDS構成図")      

※<font color="Red">赤字</font>の部分が今回の構築対象となります。

## リードレプリカとは？
読み取り専用のDBインスタンスのことを、**リードレプリカ** と呼びます。  
マスターインスタンスが書き込み/読み取りの双方のリクエストを受け付けるのに対し、リードレプリカは読み取りリクエストのみを受け付けます。

![リードレプリカアーキテクチャ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617155639.png "リードレプリカアーキテクチャ")      

リードレプリカを用いるメリットとして、データベースのパフォーマンス向上が挙げられます。  
更新系クエリはマスターインスタンスに、参照系クエリはリードレプリカに分散させることで、マスターインスタンスの負荷を軽減することが出来ます。  
例えば、大量のデータをDBに格納するアプリケーションがあり、その裏で分析部隊がガリガリデータ解析する、というようなシステムにおいて高い効果が発揮されます。 [^1]

さらに、マスターインスタンスに比べ、料金が<span style="color: #ff0000">**半額近く安くなる**</span>こともポイントのひとつです。 [^2]  
読み取りリクエストの比率が高いようなシステムにおいては、リードレプリカを採用することでTCOがグッと下がる可能性があります 

ただし、リードレプリカには僅かではありますがレプリカラグが生じるため、  
決済システムなどリアルタイム性が求められる参照ワークロードが存在する場合は、リードレプリカではなくマスターインスタンスを参照するよう注意してください。

[^1]: なお、Alibaba Cloudでは[MaxCompute](https://www.alibabacloud.com/product/maxcompute)や[DataV](https://www.alibabacloud.com/product/datav)等、ビックデータ用のプロダクトを数多く提供しています。  

[^2]: 詳細は[RDSの料金表](https://www.alibabacloud.com/product/apsaradb-for-rds#pricing)をご覧ください。

# RDSを作成してみよう 

## 手順
RDSを作成し、ECSインスタンスからクエリを発行するまでのおおまかな手順は以下となります。

1. DBインスタンス（マスターインスタンス）を作成する  
2. 手順1で作成したマスターインスタンスにユーザアカウントを作成する   
3. 手順1で作成したマスターインスタンスにデータベース（スキーマ）を作成する  
4. 手順1で作成したマスターインスタンスに紐付くリードレプリカインスンタンスを作成する  


## APIリファレンス
本記事で使用するAPIを紹介します。  
すべてRDS SDKのAPIです。

1. [CreateDBInstance](https://www.alibabacloud.com/cloud-tech/doc-detail/26228.htm)：DBインスタンスを作成します。  
2. [CreateReadOnlyDBInstance](https://www.alibabacloud.com/cloud-tech/doc-detail/26252.htm)：リードレプリカを作成します。  
3. [CreateDatabase](https://www.alibabacloud.com/cloud-tech/doc-detail/26258.htm)：データベースを作成します。  
4. [CreateAccount](https://www.alibabacloud.com/cloud-tech/doc-detail/26263.htm)：ユーザアカウントを作成します。  


## RDS SDKをインポート

前準備として、RDS用のJava SDKをインポートしておきます。  

```xml
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>aliyun-java-sdk-rds</artifactId>
    <version>2.3.7</version>
</dependency>
```

# DBインスタンスを作成 
ではさっそく、APIでリソースを構築していきましょう。  
まずはDBインスタンスを作成します。  

## サンプルコード

```java
package com.alibaba.demo.apisample;

import java.io.IOException;

import com.alibaba.demo.apisample.enums.zones.TokyoZones;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.rds.model.v20140815.CreateDBInstanceRequest;
import com.aliyuncs.rds.model.v20140815.CreateDBInstanceResponse;

public class ApiSample {

    private static final String REGION_ID = "ap-northeast-1";
    private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
    private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    public static void main(String[] args) throws ServerException, ClientException, IOException {

        IAcsClient client = new DefaultAcsClient(
            DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));
/** ---------------------- ↑ここまで前回のサンプルと同様 ---------------------- */

        CreateDBInstanceRequest request = new CreateDBInstanceRequest();
        request.setDBInstanceDescription("rds-api-demo-master");  // DBインスタンス名
        request.setEngine("MySQL");                               // DBエンジン
        request.setEngineVersion("5.6");                          // エンジンバージョン
        request.setDBInstanceClass("rds.mysql.t1.small");         // DBインスタンスクラス
        request.setDBInstanceStorage(Integer.valueOf(10));        // ストレージサイズ
        request.setPayType("Postpaid");                           // 支払い方法
        request.setSecurityIPList("10.0.1.0/24, 10.0.9.0/24");    // ホワイトリスト
        request.setZoneId(TokyoZones.ZONE_MULTI_ID.getZoneId());  // ゾーンID
        request.setDBInstanceNetType("Intranet");                 // 接続タイプ
        request.setInstanceNetworkType("VPC");                    // ネットワークタイプ
        request.setVPCId("vpc-6wekbo76l1h7j66b26wxx");            // VPC ID
        request.setVSwitchId("vsw-6webaau3xpukx5jzgwk7n");        // VSwitch ID

        // DBインスタンス作成
        CreateDBInstanceResponse response = client.getAcsResponse(request);
        System.out.println("InstanceId:" + response.getDBInstanceId());
        System.out.println("Endpoint:" + response.getConnectionString());
    }
}

```

#### DBインスタンス名
DBインスタンスの名前を指定します。  
必須パラメータではありませんが、指定しない場合はリソースIDがそのまま設定されるため、管理上今回は指定しています。

#### DBエンジン
DBインスタンスのDBエンジンを指定します。**必須パラメータ** です。  
指定可能な値は、以下の4つです。  

1. MySQL  
2. SQLServer
3. PostgreSQL  
4. PPAS  

#### エンジンバージョン
DBエンジンのバージョンを指定します。**必須パラメータ** です。  
指定可能な値はDBエンジンによって異なり、MySQLの場合は`5.5`/`5.6`/`5.7`の3つバージョンから選択可能です。  

#### DBインスタンスクラス
DBインスタンスのインスタンスタイプを指定します。**必須パラメータ** です。  
指定可能なインスタンスクラスは、DBエンジンやバージョンに依存します。詳細は[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/26312.htm)を確認してください。  
今回は`MySQL5.6`における最小スペックである`rds.mysql.t1.small`を指定しています。  

#### ストレージサイズ
ストレージのサイズを指定します（GB）。**必須パラメータ** です。  
指定可能な値は、DBエンジン/バージョンやDBインスタンスクラスに依存します。詳細はDBインスタンスクラスと同様[インスタンスタイプリスト](https://www.alibabacloud.com/cloud-tech/doc-detail/26312.htm)をご覧ください。  
`MySQL5.6` / `rds.mysql.t1.small`の場合、5GBから2000GBの間で指定出来ます。

#### 支払い方法
DBインスタンスの料金支払い方法を指定します。**必須パラメータ** です。  
`Postpaid`（従量課金）または`Prepaid`（サブスクリプション課金）のどちらかを指定します。  

#### ホワイトリスト
DBインスタンスに接続可能なIPアドレスをCIDR形式で指定します。**必須パラメータ** です。  
デフォルトでは、`127.0.0.1`のみ設定されており、同一VPC内のECSインスタンスからでも接続することは出来ません。  
今回はA/Bゾーン双方のECSインスタンスから接続を行うため、各ゾーンのECSが属するVSwitchのCIDR IPを指定しています。  
複数の値を指定する場合は、 `,`(カンマ)で区切って指定します。  


#### ゾーンID
DBインスタンスをデプロイするゾーンを指定します。  
非必須パラメータで、指定しない場合はリージョンやDBエンジンに応じたデフォルトのゾーンに作成されます。  
指定可能なゾーンのIDは、[DescribeRegions](https://www.alibabacloud.com/cloud-tech/doc-detail/26243.htm)から取得出来ます。  

今回はマルチゾーンで作成するため、  
下記のように`TokyoZones`に、東京リージョンのマルチゾーン用のゾーンID`ap-northeast-1MAZ1(a,b)`を追加しています。  

```java
ZONE_MULTI_ID("ap-northeast-1MAZ1(a,b)");
```

#### 接続タイプ
DBインスタンスへの接続方法を指定します。**必須パラメータ** です。  
指定可能な値は、`Internet`または`Intranet`です。  

- ⦿ **Internet**：インターネットからアクセス可能なインスタンスを作成する場合に指定します。付与されるエンドポイントはパブリックIPアドレスに解決されます。  
- ⦿ **Intranet**：VPC内部からのみアクセス可能なインスタンスを作成する場合に指定します。付与されるエンドポイントはプライベートIPアドレスに解決されます  

#### ネットワークタイプ
DBインスタンスをデプロイするネットワークのタイプを指定します。  
指定可能な値は、`Classic`（クラシックネットワーク）または`VPC`（VPC）のどちらかです。  
非必須パラメータで、指定しない場合は`Classic`が設定されます。  
今回はVPC内部に作成するため、`VPC`を指定しています。

#### VPC ID
DBインスタンスをデプロイするVPCのリソースIDを指定します。  
ネットワークタイプが`VPC`の場合に必須となる**条件付き必須パラメータ**です。

#### VSwitch ID
DBインスタンスをデプロイするVSwitchのリソースIDを指定します。  
ネットワークタイプが`VPC`の場合に必須となる**条件付き必須パラメータ**です。

## 実行結果
下記のように、Console上に作成したDBインスタンスのリソースID、およびエンドポイントが表示されれば成功です。  
これらは今後の手順で使用するので、控えておいてください。
```
Instance ID：rm-e9b29d1u37boz6198
Endpoint：rm-e9b29d1u37boz6198.mysql.japan.rds.aliyuncs.com
```

管理コンソール上から作成したDBインスタンスを確認してみましょう。  

`ApsaraDB for RDS`　>　`インスタンスリスト`より、DBインスタンスの一覧を表示します。

![DBインスタンスコンソール画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617153538.png "DBインスタンスコンソール画面")      

![DBインスタンスコンソール詳細画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617153611.png "DBインスタンスコンソール詳細画面")      

無事にDBインスタンスが作成されていることが確認出来ました。

# ユーザ作成  
次に、先程作成したDBインスタンス内にユーザアカウントを作成します。  

AWSのRDSとは異なり、インスタンス作成時にユーザが作成されないため、  
データベースを操作するためにはインスタンス作成後に別途ユーザアカウントを作成する必要があります。

## サンプルコード

```java
package com.alibaba.demo.apisample;

import java.io.IOException;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.rds.model.v20140815.CreateAccountRequest;

public class ApiSample {

   private static final String REGION_ID = "ap-northeast-1";
   private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
   private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    public static void main(String[] args) throws ServerException, ClientException, IOException {

        IAcsClient client = new DefaultAcsClient(
            DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));
/** ---------------------- ↑ここまで前述のサンプルと同様 ---------------------- */

        String masterInstanceId = "rm-e9b29d1u37boz6198";

        CreateAccountRequest request = new CreateAccountRequest();
        request.setDBInstanceId(masterInstanceId);  // DBインスタンスID
        request.setAccountName("adminuser");        // ユーザ名
        request.setAccountPassword("********");     // パスワード
        request.setAccountType("Super");            // アカウントタイプ

        // ユーザ作成
        client.getAcsResponse(request);
    }
}
```

#### DBインスタンスID
ユーザを作成するDBインスタンスのリソースIDを指定します。**必須パラメータ** です。  
先程作成したDBインスタンスのリソースIDを指定します。

#### ユーザ名
ユーザ名を指定します。**必須パラメータ** です。  
以下の制約があります。  

- ⦿2文字以上16文字以内であること  
- ⦿英小文字、数字、" _ "（アンダースコア）のみで構成されること  
- ⦿英字で始まること
- ⦿[禁則文字列](https://www.alibabacloud.com/cloud-tech/doc-detail/26317.htm)ではないこと

#### パスワード
パスワードを指定します。**必須パラメータ** です。  
以下の制約があります。  

- ⦿8文字以上32文字以内であること  
- ⦿使用可能な特殊文字は`!`,`@`,`#`,`$`,`&`,`%`,`^`,`*`,`(`,`)`,`_`,`+`,`-`,`=`  
- ⦿英大文字、英小文字、数字、および特殊文字のうち少なくとも3つが含まれていること

#### アカウントタイプ
ユーザの権限タイプを指定します。  
指定可能な値は、`Super`（特権ユーザ）または`Normal`（通常ユーザ）のいずれかです。  
非必須パラメータで、指定しない場合は`Normal`で作成されます。  

## 実行結果
エラーが発生しなければ、ユーザ作成成功です。  
管理コンソール上から作成したユーザを確認しましょう。  

先程のDBインスタンスの詳細画面より、`アカウント管理`を押下します。

![ユーザ画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617153640.png "ユーザ画面")      

正常にユーザが作成されています。

# データベースを作成   
前手順までで、DBインスタンスに接続する準備は整いました。  

ECSインスタンスからDBインスタンスにログインし、DDLを投入することはもちろん可能ですが、  
せっかくなのでAPIを用いてデータベースを作成してみたいと思います。

## サンプルコード

```java
package com.alibaba.demo.apisample;

import java.io.IOException;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.rds.model.v20140815.CreateDatabaseRequest;

public class ApiSample {

   private static final String REGION_ID = "ap-northeast-1";
   private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
   private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    public static void main(String[] args) throws ServerException, ClientException, IOException {

        IAcsClient client = new DefaultAcsClient(
            DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));

        String masterInstanceId = "rm-e9b29d1u37boz6198";
/** ---------------------- ↑ここまで前述のサンプルと同様 ---------------------- */

        CreateDatabaseRequest request = new CreateDatabaseRequest();
        request.setDBInstanceId(masterInstanceId);  // DBインスタンスID
        request.setDBName("testdb");                // データベース名
        request.setCharacterSetName("utf8");        // 文字コード

        // データベース作成
        client.getAcsResponse(request);
    }
}
```

#### DBインスタンスID
ユーザを作成するDBインスタンスのリソースIDを指定します。**必須パラメータ** です。  
先程作成したDBインスタンスのリソースIDを指定します。

#### データベース名
データベース名を指定します。**必須パラメータ** です。  
以下の制約があります。  

- ⦿64文字以内であること  
- ⦿英小文字、数字、" _ "（アンダースコア）のみで構成されること  
- ⦿英字で始まること
- ⦿[禁則文字列](https://www.alibabacloud.com/cloud-tech/doc-detail/26317.htm)ではないこと

#### 文字コード
データベースで使用する文字コードを指定します。**必須パラメータ** です。  
指定可能な値はDBエンジンに依存し、`MySQL`の場合は以下の4つから選択します。  

- ・`utf8`  
- ・`gbk`  
- ・`latin1`  
- ・`utf8mb4`  

## 実行結果

エラーが発生しなければデータベース作成成功です。  
管理コンソール上から作成したデータベースを確認しましょう。  

先程のDBインスタンスの詳細画面より、`データベース管理`を押下します。

![データベース画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617154008.png "データベース画面")      

指定したパラメータ通り、データベースが作成されています。

## 接続確認
では、作成したデータベースに接続し、テーブルを作成してみましょう 

まずは、[前回の記事](https://sbopsv.github.io/cloud-tech/developer-tools/DEVTOOL_011_api-orchestration-4)を参考にECSインスタンスにログインします。  

![ECSインスタンスログイン](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617163321.png "ECSインスタンスログイン")      

次に、以下のコマンドを実行し、DBインスタンスに接続するためのMySQLクライアントをインストールします。  

```
# yum -y install mysql
```

![MySQLインストール](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617163431.png "MySQLインストール")      

`完了しました `のメッセージが表示されれば、インストール成功です。  

mysqlコマンドを用い、データベースに接続します。

```
# mysql -h rm-e9b29d1u37boz6198.mysql.japan.rds.aliyuncs.com -P 3306 -u adminuser -D testdb -p
```
※エンドポイントは先程控えたものに変更してください。

![DBインスタンス接続](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617154151.png "DBインスタンス接続")      

DBインスタンス、ユーザ、データベースが作成出来ていることが確認出来ました。  
以下の通りDDLを発行し、RDSの管理テーブルを作成してみます。  

```sql
CREATE TABLE db_instances
 (
   name varchar(64),
   id char(20),
   endpoint varchar(128)
 )
```

![RDS管理DB作成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617163658.png "RDS管理DB作成")      

無事、テーブルが作成出来ました  


# リードレプリカ作成    
最後に、先程作成したマスターインスタンスに紐付くリードレプリカを作成します。

## サンプルコード

```java
package com.alibaba.demo.apisample;

import java.io.IOException;

import com.alibaba.demo.apisample.enums.zones.TokyoZones;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.rds.model.v20140815.CreateReadOnlyDBInstanceRequest;
import com.aliyuncs.rds.model.v20140815.CreateReadOnlyDBInstanceResponse;

public class ApiSample {

   private static final String REGION_ID = "ap-northeast-1";
   private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
    private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

   public static void main(String[] args) throws ServerException, ClientException, IOException {

       IAcsClient client = new DefaultAcsClient(
           DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));

       String masterInstanceId = "rm-e9b29d1u37boz6198";
/** ---------------------- ↑ここまで前述のサンプルと同様 ---------------------- */

        CreateReadOnlyDBInstanceRequest request = new CreateReadOnlyDBInstanceRequest();
        request.setDBInstanceId(masterInstanceId);
        request.setDBInstanceDescription("rds-api-demo-master");
        request.setEngineVersion("5.6");
        request.setDBInstanceClass("rds.mysql.t1.small");
        request.setDBInstanceStorage(Integer.valueOf(10));
        request.setPayType("Postpaid");
        request.setZoneId(TokyoZones.ZONE_MULTI_ID.getZoneId());
        request.setInstanceNetworkType("VPC");
        request.setVPCId("vpc-6wekbo76l1h7j66b26wxx");
        request.setVSwitchId("vsw-6webaau3xpukx5jzgwk7n");

        CreateReadOnlyDBInstanceResponse response = client.getAcsResponse(request);
        System.out.println("ReadReplica ID : " + response.getDBInstanceId());
        System.out.println("ReadReplica Endpoint : " + response.getConnectionString());
    }
}
```        
基本的にマスターインスタンスと同様のため、各パラメータの詳細は省略します。  

ポイントとなるのは以下の3点です。  

- ⦿インスタンスクラスやストレージサイズ等、**マスターインスタンスと異なるスペックで作成可能**  
- ⦿現状、リードレプリカを作成可能なマスターインスタンスのDBエンジン/バージョンは**`MySQL5.6`** / **`MySQL5.7`** のみ [^3]  
- ⦿DBエンジンはマスターインスタンスと同様のエンジンでなければならず、バージョンは**マスターインスタンスと同等かそれよりも新しいバージョンに限る**  

つまり、マスターインスタンス / リードレプリカ の組み合わせは、以下の3つの組み合わせに限られるということになります。  

1. M:MySQL5.6 / R:MySQL5.6  
2. M:MySQL5.6 / R:MySQL5.7  
3. M:MySQL5.7 / R:MySQL5.7

[^3]: 2019年6月現在



## 実行結果

下記のように、Console上に作成したリードレプリカのリソースID、およびエンドポイントが表示されれば成功です。  
```
ReadReplica ID : rr-e9b6m610ix0na8dce
Endpoint：rr-e9b6m610ix0na8dce.mysql.japan.rds.aliyuncs.com
```

管理コンソール上から作成したリードレプリカを確認してみましょう。  

`ApsaraDB for RDS`　>　`インスタンスリスト`より、DBインスタンスの一覧を表示します。  

リードレプリカには自身がリードレプリカであることを示す**`R`** アイコンが、  
マスターインスタンスには先程までなかった負荷分散を示すアイコンが付与されていることがわかります。  

![リードレプリカ作成後コンソール画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617154518.png "リードレプリカ作成後コンソール画面")      

![リードレプリカ詳細画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617154547.png "リードレプリカ詳細画面")      

無事にリードレプリカが作成されていることが確認出来ました。

## 接続確認
ではリードレプリカへの接続確認として、以下の2点を確認してみたいと思います。  

1. マスターインスタンスとレプリケーションしていること  
2. 読み取り専用であること

### レプリケーション確認
レプリケーション確認として、マスターインスタンスへの変更がリードレプリカにも反映されていることを確認します。  

先程と同様マスターインスタンスにログインし、  
以下の通りクエリを発行し、RDS管理テーブルにマスターインスタンスの情報を登録します。

```sql
INSERT INTO db_instances
VALUES(
  'rds-api-demo-master',
  'rm-e9b29d1u37boz6198',
  'rm-e9b29d1u37boz6198.mysql.japan.rds.aliyuncs.com'
);
```
```sql
SELECT * FROM db_instances;
```

![テーブル作成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617154750.png "テーブル作成")      

マスターインスタンス上にレコードが登録されました。  
では、リードレプリカにログインし、先程マスターインスタンスに登録したレコードがリードレプリカに同期されていることを確認してみます。  

![レプリケーション確認](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617154909.png "レプリケーション確認")      

正常にレプリケーションが行われていることが確認出来ました 


### 読み取り専用確認
読み取り専用であることの確認として、リードレプリカに対し`INSERT`文を発行してみたいと思います。  

リードレプリカにログイン状態のまま、以下の通り`INSERT`文を発行してみましょう。

```sql
INSERT INTO db_instances
VALUES(
  'rds-api-demo-readreplica',
  'rr-e9b6m610ix0na8dce',
  'rr-e9b6m610ix0na8dce.mysql.japan.rds.aliyuncs.com'
);
```

![読み取り専用確認](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617155014.png "読み取り専用確認")      

上記画像のように、  
**`このサーバは読み取り専用なので、そのようなクエリは実行出来ません`**  
といったような内容のエラー分が返却されたかと思います。  

以上の2点を以て、  
リードレプリカが本当にリードレプリカであることを確認出来ました  

# Tips
## 読み書き分離機能について
先程のサンプルでも示したように、  
マスターインスタンスおよびリードレプリカにはそれぞれ個別のエンドポイントが付与されます。  

そのため、アプリケーションがDBにアクセスする際には、  
書き込み要求はマスターインスタンスのエンドポイントに、読み取り要求はリードレプリカのエンドポイントに、  
といった制御をアプリケーション側で行わなければなりません。

また、複数台のリードレプリカを構築した場合、リードレプリカ間でどのように負荷分散を行うか、といった点も課題になってきます。


これらを解決するのが、**読み書き分離機能**（Read/Write Splitting Function）と呼ばれる機能です。  
本機能は、各DBインスタンス個別のエンドポイントとは別に、**読み書き分離エンドポイント** と呼ばれる追加のエンドポイントを付与します。  

![RDSエンドポイント](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617155038.png "RDSエンドポイント")      


上記図に示すように、  
読み書き分離エンドポイントに送信されたリクエストは、クエリが読み取りなのか書き込みなのかを判断し、自動的に振り分けられます。  
さらに、複数のリードレプリカに対し負荷分散も行ってくれます。

本機能を用いることで、アプリケーション側で複雑な設定をする必要なく、  
単一のエンドポイントを設定するだけで読み書きの分離が可能となります。

こんな便利な読み書き分離機能ですが、実は日本リージョン未提供の機能となります。[^4]  
そこで、本記事では代替策として`ProxySQL`を用いて読み込み/書き込みリクエストを分離する方法を紹介したいと思います。

[^4]: 2019年6月現在

### ProxySQLとは
その名の通り、MySQLのプロキシサーバとして、定義したルールに従いルーティングの振り分けを行うオープンソースのミドルウェアです。  
今回は、既存ECSインスタンス上に`ProxySQL`をインストールして、読み書き分離機能を具備してみたいと思います。

### 準備
前準備として、  
複数のリードレプリカで負荷分散されていることを確認するため、リードレプリカをもう一台起動させておきます。

![リードレプリカ②](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617155103.png "リードレプリカ②")      

また、`ProxySQL`が各DBインスタンスに接続するためのDBユーザを作成しておきます。

![ProxySQL用ユーザ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617155125.png "ProxySQL用ユーザ")      

### ProxySQLインストール
ECSインスタンスにログインし、`ProxySQL`をインストールします。

#### リポジトリ追加
下記のコマンドを実行し、`ProxySQL`のリポジトリをダウンロードします。  
（今回は、`CentOS7`の最新版をインストールしています。）

```
wget -P /tmp/proxysql/ https://github.com/sysown/proxysql/releases/download/v2.0.4/proxysql-2.0.4-1-centos7.x86_64.rpm
```
#### ProxySQLインストール
下記のコマンドを実行し、`ProxySQL`をインストールします。

```
yum -y install /tmp/proxysql/proxysql-2.0.4-1-centos7.x86_64.rpm
```

#### ProxySQL起動
下記コマンドを実行し、`ProxySQL`を起動します。

```
systemctl start proxysql
```

### ProxySQL設定
`ProxySQL`の設定はすべて専用の管理コンソール上で行います。  

#### 管理コンソールログイン
下記のコマンドを実行し、`ProxySQL`管理コンソールにログインします。  

```
mysql -h 127.0.0.1 -P 6032 -u admin -padmin
```

#### ホストグループ登録
各DBインスタンスが所属するホストグループを登録します。  

今回は、  
書き込みリクエストのルーティング先となる`writer_hostgroup`のグループを`0`、  
読み込み専用のリクエストのルーティング先となる`reader_hostgroup`のグループを`1`  
として登録します。  

管理コンソール上で以下のクエリを発行します。  

```sql
INSERT INTO mysql_replication_hostgroups (writer_hostgroup, reader_hostgroup) VALUES (0, 1);
```

#### サーバ登録
振り分け先となるDBインスタンスのエンドポイントを登録していきます。  
マスターインスタンスである`rm-e9b29d1u37boz6198`は書き込み用ホストグループに、  
リードレプリカである`rr-e9b6m610ix0na8dce`と`rr-e9bopaog80y48ykfi`については、読み込み専用ホストグループに登録します。

```sql
INSERT INTO mysql_servers (hostname, hostgroup_id, port) VALUES ('rm-e9b29d1u37boz6198.mysql.japan.rds.aliyuncs.com', 0, 3306);
INSERT INTO mysql_servers (hostname, hostgroup_id, port) VALUES ('rr-e9b6m610ix0na8dce.mysql.japan.rds.aliyuncs.com', 1, 3306);
INSERT INTO mysql_servers (hostname, hostgroup_id, port) VALUES ('rr-e9bopaog80y48ykfi.mysql.japan.rds.aliyuncs.com', 1, 3306);
```

#### 設定の適用・永続化
下記のコマンドを実行し、登録した情報をランタイムに適用、さらにディスクへの永続化を行います。

```sql
LOAD MYSQL SERVERS TO RUNTIME;
SAVE MYSQL SERVERS TO DISK;
```

#### クエリルール登録
リクエストを振り分ける際のクエリルールを登録します。  

`match_digest`にルールを指定します。正規表現を使用可能です。  
`destination_hostgroup`に振り分け先のホストグループを指定します。  

今回はサンプルのため、簡単な例のみを定義していますが、
正規表現をうまく使うことで様々なパターンに適応可能なルールを定義することが可能です。

```sql
INSERT INTO mysql_query_rules (rule_id, active, match_digest, destination_hostgroup, apply) VALUES (0, 1, "^SELECT", 1, 1);
INSERT INTO mysql_query_rules (rule_id, active, match_digest, destination_hostgroup, apply) VALUES (1, 1, "^UPDATE", 0, 1);
INSERT INTO mysql_query_rules (rule_id, active, match_digest, destination_hostgroup, apply) VALUES (2, 1, "^INSERT", 0, 1);
INSERT INTO mysql_query_rules (rule_id, active, match_digest, destination_hostgroup, apply) VALUES (3, 1, "^DELETE", 0, 1);
```

#### 設定の適用・永続化
先程と同様、登録したクエリルールの情報を適用、永続化します。

```sql
LOAD MYSQL QUERY RULES TO RUNTIME;
SAVE MYSQL QUERY RULES TO DISK;
```

#### 実行ユーザ登録
以下のクエリを発行し、前準備で作成した`ProxySQL`用のユーザを実行ユーザとして登録します。  

```sql
INSERT INTO mysql_users (username, password, active, default_hostgroup, default_schema, transaction_persistent) VALUES ('proxyuser', '********', 1, 0, 'testdb', 1);
```

#### 設定の適用・永続化
ユーザ情報の適用・永続化を行います。

```sql
LOAD MYSQL USERS TO RUNTIME;
SAVE MYSQL USERS TO DISK;
```

#### モニタリングユーザ登録
最後に、`ProxySQL`が各DBインスタンスのモニタリングに用いるユーザの情報を登録します。  
今回は簡単のため、実行ユーザでモニタリングを行います。

```sql
UPDATE global_variables SET variable_value='proxyuser' WHERE variable_name='mysql-monitor_username';
UPDATE global_variables SET variable_value='********' WHERE variable_name='mysql-monitor_password';
```

#### 設定の適用・永続化
モニタリングユーザ設定の適用・永続化を行います。

```sql
LOAD MYSQL VARIABLES TO RUNTIME;
SAVE MYSQL VARIABLES TO DISK;
```

以上で`ProxySQL`の設定は完了となります。

### 動作確認
では、`ProxySQL`の動作確認を行っていきましょう   

まずは読み書き分離が行われていることを確認するため、  
`INSERT`文と`SELECT`文を発行し、それぞれがマスターインスタンスとリードレプリカに割り振られていることを確認します。  

コンソールをもうひとつ立ち上げ、以下の通り`ProxySQL`に対しクエリを発行します。  

```sql
mysql -h 127.0.0.1 -P 6033 -u proxyuser -p******** -e "INSERT INTO db_instances VALUES('rds-api-demo-readreplica', 'rr-e9b6m610ix0na8dce', 'rr-e9b6m610ix0na8dce.mysql.japan.rds.aliyuncs.com');"
mysql -h 127.0.0.1 -P 6033 -u proxyuser -p******** -e "SELECT * FROM db_instances;"
```

![INSERT・SELECTクエリ発行](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617211115.png "INSERT・SELECTクエリ発行")      


正常にクエリが完了しました。  
なお、別のサーバからクエリを発行する場合は、下記のようにホスト部分に`ProxySQL`をインストールしたサーバのIPアドレスを指定します。
```sql
mysql -h 10.0.1.168 -P 6033 -u proxyuser -p******** -e "SELECT * FROM db_instances;"
```

各クエリがどのように割り振られたかは、管理コンソール上から統計情報テーブルを参照することで確認出来ます。  
`stats_mysql_connection_pool`テーブルでは、**"どのサーバ"** が **"どのくらい"** リクエストを処理したかを、  
`stats_mysql_query_digest`テーブルでは、**"どのクエリ"** が **"どのホストグループ"** に **"どのくらい"** 割り振られたのか  
を確認出来ます。

管理コンソール上で以下の通りクエリを発行し、読み書き分離が行われていることを確認します。

```sql
SELECT hostgroup, srv_host, Queries FROM stats_mysql_connection_pool;
SELECT hostgroup, digest_text, count_star FROM stats_mysql_query_digest;
```

![結果確認①](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617155312.png "結果確認①")      

`INSERT`文がマスターインスタンス（`rm-e9b29d1u37boz6198`）に、  
`SELECT`文がリードレプリカ（`rr-e9bopaog80y48ykfi`）にそれぞれ割り振られていることが確認出来ました 

試しに同じ`INSERT`文を10回発行してみます。

![結果確認②](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617155348.png "img")      

全てマスターインスタンスに割り振られていますね。  
     
---
     
次に読み取りリクエストがリードレプリカ間で負荷分散されていることを確認してみましょう。

先程と同様の`SELECT`文を、66回ほど実行してみます。  

![結果確認③](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617155427.png "結果確認③")      

リードレプリカ①（`rr-e9b6m610ix0na8dce`）とリードレプリカ②（`rr-e9bopaog80y48ykfi`）で、均等に33回ずつ割り振られていることが確認出来ました  
     
---
     
最後に、`DELETE`文を発行してみます。

![DELETEクエリ発行](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617211158.png "DELETEクエリ発行")      

![結果確認④](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127201900000/20190617155513.png "結果確認④")      

登録したクエリルールが正常に適用されていることがわかります。

# 最後に
SLB等に比べて関連コンポーネントが少ないため、比較的スムーズに構築出来たのではないかと思います。  
今回は省略しましたが、ログやバックアップの機能、DBパラメータの設定機能等、RDSには様々なパラメータや機能があるので  
気になった方はドキュメントやAPIリファレンスを参照してみてください。  

本記事をもって、予定していた構成図における全リソースをAPIで構築することが出来ました。  
第6回では、APIとRAM（Resource Access Management）の関係について紹介したいと思います。

