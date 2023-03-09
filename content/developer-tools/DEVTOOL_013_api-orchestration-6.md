---
title: "APIで自動構築⑥ - RAM編"
metaTitle: "APIを用いてAlibaba Cloudリソースを自動構築する⑥ - RAM編"
metaDescription: "APIを用いてAlibaba Cloudリソースを自動構築する⑥ - RAM編"
date: "2019-07-05"
author: "SBC engineer blog"
thumbnail: "/developer-tools_images_17680117127211900000/000000000000000010.png"
---

# APIで自動構築⑥ - RAM編

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/000000000000000010.png "img")  

# はじめに

`APIを用いてAlibaba Cloudリソースを自動構築する`シリーズ第6回目となります。

[前回の第5回](https://sbopsv.github.io/cloud-tech/developer-tools/DEVTOOL_012_api-orchestration-5)までで、予定していた構成図の全コンポーネントをAPIで作成することが出来ました。  
今回は、RAM（Resource Access Management）の機能の一部であるインスタンスRAMロールを利用して、APIを実行する方法を紹介したいと思います。

# 結論
先に結論から言ってしまいます。  
  
今回紹介するインスタンスRAMロールを用いてAPIを発行すると、  
下記ように、今まで呪文のように記述していたソースコードが、、、
```java
private static final String REGION_ID = "ap-northeast-1";
private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
// omitted
IAcsClient client = new DefaultAcsClient(DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));
```
↓  
↓次のように、`AccessKey`/`SecretAccessKey`の記述が消え、、、  
↓  
```java
private static final String REGION_ID = "ap-northeast-1";
private static final String RAM_ROLE_NAME = "ramrole-api-demo";
// omitted
IAcsClient client = new DefaultAcsClient(DefaultProfile.getProfile(REGION_ID), new InstanceProfileCredentialsProvider(RAM_ROLE_NAME));
```
↓  
↓さらに、最終的にはここまで簡略化出来てしまいます   
↓  
```java
private static final String REGION_ID = "ap-northeast-1";
// omitted
IAcsClient client = new DefaultAcsClient(REGION_ID);
```

一体何が起きているのか、まずはRAMの説明からしていきたいと思います。

## RAMとは？
RAM（Resource Access Management）とは、  
Alibaba Cloud上のリソースに対するアクセスコントロールを行うサービスです。

RAMは大きく分けて、以下の3つのコンポーネントから構成されます。

1. **RAMユーザ**：個人ユーザまたはアプリケーションに紐付くIDです。   
ログオン名/パスワードを利用した管理コンソールへのアクセスや、各RAMユーザが生成した`AccessKey/SecretAccessKey`を利用してAPIを発行することが出来ます。  
2. **RAMロール**：一時的なセキュリティトークンを使用し、Alibaba Cloudリソースの操作権限をAlibaba Cloud上のサービスや他のアカウントに委譲するためのコンポーネントです。  
RAMユーザが一個人に紐付くのに対し、RAMロールは複数のサービスやアカウントに紐付け使用することが出来ます。   
3. **RAMポリシー**：  Alibaba Cloudリソースへの操作権限を定義するコンポーネントです。`JSON`形式で記述されます。  
RAMユーザやRAMロールに付与することで、これらのリソース操作権限を制御します。

## インスタンスRAMロールとは？
**インスタンスRAMロール** とは、  
ECSインスタンスにRAMロールをアタッチし、インスタンス内部のアプリケーションが自身のメタデータを参照することで認証情報を取得する仕組みです。  

今までのように、`AccessKey/SecretAccessKey`を用いた認証では、  
（ソースコード内にベタ書きすることはないにせよ）プロパティファイルとして保持するのか、データベース内に保存するのか、といった管理方法を考慮する必要があります。いずれにせよ、データとして保持する必要がある以上、常に漏洩のリスクが付き纏います。  
また、商用環境と検証環境でアカウントが異なる場合`AccessKey/SecretAccessKey`は別になってしまうため、どのように環境差分を取り込むかといった点も課題になってきます。  

一方で、インスタンスRAMロールを利用して認証を行う場合には、  
`AccessKey/SecretAccessKey`のように秘密情報をローカルに保持することなく認証情報の取得が可能であり、ロールが付与されていないECSインスタンスからは取得不可能であるため、安全な運用が可能です。  
また、RAMロール名の命名規則次第では、環境差分と取り込むことも可能です。

このように、  
<u>**インスタンスRAMロールを利用することで、  `AccessKey/SecretAccessKey`における管理の煩わしさから解放され、さらにセキュリティリスクを軽減することが出来ます  **</u>

# インスタンスRAMロールを使ってみよう 

## 手順
ECSインスタンス上からインスタンスRAMロールを使用してAPIを実行出来るようにするまでの、大まかな手順は以下の通りです。

1. RAMロールを作成する
2. RAMポリシーを作成する  
3. RAMロールとRAMポリシーを紐付ける   
4. ECSインスタンスとRAMロールを紐づける  

## APIリファレンス
本記事で使用するAPIを紹介します。  

1. [CreateRole](https://www.alibabacloud.com/cloud-tech/doc-detail/28710.htm)：RAMロールを作成します。RAMのAPIです。  
2. [CreatePolicy](https://www.alibabacloud.com/cloud-tech/doc-detail/28716.htm)：RAMポリシーを作成します。RAMのAPIです。  
3. [AttachPolicyToRole](https://www.alibabacloud.com/cloud-tech/doc-detail/28729.htm)：RAMロールにRAMポリシーを紐付けます。RAMのAPIです。  
4. [AttachInstanceRamRole](https://www.alibabacloud.com/cloud-tech/doc-detail/54244.htm)：ECSインスタンスにRAMを紐付けます。ECSのAPIです。[^1]  

[^1]: 日本サイトのAPIリファレンスが公開されていないため、リンク先は国際サイトのAPIリファレンスとなります。

## RAM SDKをインポート
いつものように、RAMのjava SDKをインポートしておきます。

```xml
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>aliyun-java-sdk-ram</artifactId>
    <version>3.1.0</version>
</dependency>
```

# RAMロールを作成・アタッチ 
今回扱うAPIはパラメータが少ないため、
RAMロールの作成～ECSアタッチまでを一気にやってしまいます。

## サンプルコード

```java
package com.alibaba.demo.apisample;

import java.util.Arrays;
import java.util.List;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.ecs.model.v20140526.AttachInstanceRamRoleRequest;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.ram.model.v20150501.AttachPolicyToRoleRequest;
import com.aliyuncs.ram.model.v20150501.CreatePolicyRequest;
import com.aliyuncs.ram.model.v20150501.CreateRoleRequest;

public class ApiSample {

　 private static final String REGION_ID = "ap-northeast-1";
   private static final String ACCESS_KEY = "xxxxxxxxxxxxxxxx";
   private static final String SECRET_ACCESS_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

   public static void main(String[] args) throws ServerException, ClientException {

       IAcsClient client = new DefaultAcsClient(
           DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY));
/** ---------------------- ↑ここまで前述のサンプルと同様 ---------------------- */

        final String roleName = "ramrole-api-demo";
        final String policyName = "rampolicy-api-demo";

        /** ---------------------- ロール作成 ---------------------- */
        CreateRoleRequest createRoleRequest = new CreateRoleRequest();
        createRoleRequest.setRoleName(roleName);          // ロール名
        createRoleRequest.setAssumeRolePolicyDocument(    // Assumeロールポリシー
            "{\"Statement\":[{\"Action\":\"sts:AssumeRole\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":[\"ecs.aliyuncs.com\"]}}],\"Version\":\"1\"}");

        client.getAcsResponse(createRoleRequest);

        /** ---------------------- ポリシー作成 ---------------------- */
        CreatePolicyRequest createPolicyRequest = new CreatePolicyRequest();
        createPolicyRequest.setPolicyName(policyName);   // ポリシー名
        createPolicyRequest.setPolicyDocument(           // ポリシードキュメント
            "{\"Statement\":[{\"Action\":\"\",\"Effect\":\"Allow\",\"Resource\":\"\"}],\"Version\":\"1\"}");

        client.getAcsResponse(createPolicyRequest);

        /** ---------------------- ロールにポリシーアタッチ ---------------------- */
        AttachPolicyToRoleRequest attachPolicyToRoleRequest = new AttachPolicyToRoleRequest();
        attachPolicyToRoleRequest.setPolicyName(policyName);  // ポリシー名
        attachPolicyToRoleRequest.setPolicyType("Custom");    // ポリシータイプ
        attachPolicyToRoleRequest.setRoleName(roleName);      // ロール名

        client.getAcsResponse(attachPolicyToRoleRequest);

        /** ---------------------- ECSにロールアタッチ ---------------------- */        
        AttachInstanceRamRoleRequest attachInstanceRamRoleRequest = new AttachInstanceRamRoleRequest();
        attachInstanceRamRoleRequest.setRamRoleName(roleName);                                                    // ロール名
        attachInstanceRamRoleRequest.setInstanceIds("[\"i-6we56uzuhtroxfjyhn0j\", \"i-6we56uzuhtroxfjyhn0i\"]");  // インスタンスID

        client.getAcsResponse(attachInstanceRamRoleRequest);
    }
}
```
### ロール作成
#### ロール名
RAMロールの名前を指定します。必須パラメータです。  

#### Assumeロールポリシー
RAMロールを使用するユーザアカウント、またはサービスを定義するオブジェクトです。必須パラメータです。  
今回のサンプルでは、本ロールはECSにアタッチするため、`Principal`（ロールの利用者）に`Service`、名前空間に`ecs.aliyuncs.com`を指定しています。  
他のアカウントが本ロールを用いて、自分が所有するAlibaba Cloudリソースへのアクセスを許可する場合、以下のように`Principal`を定義します。
```json
"Principal": {
  "RAM": [
    "acs:ram::0123456789012345:root"  // アカウントID
  ]
}
```

### ポリシー作成
#### ポリシー名
RAMポリシーの名前を指定します。必須パラメータです。  

#### ポリシータイプ
RAMポリシーの種別を指定します。必須パラメータです。  
指定可能な値は、`Custom`または`System`のいずれかです。

#### ポリシードキュメント
RAMポリシーのアクセス制御の定義をJSON形式で指定します。必須パラメータです。  
今回の例では、全てのリソースに対する全操作権限を持つよう定義しています。  
ポリシードキュメントの構文に関する詳しい説明については、[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/93739.htm)をご覧ください。

### ロールにポリシーアタッチ
#### ポリシー名
アタッチするRAMポリシーの名前を指定します。必須パラメータです。  
先程作成したポリシーを指定しています。

#### ポリシータイプ
RAMポリシーの種別を指定します。必須パラメータです。  
指定可能な値は、`Custom`または`System`のいずれかです。  

#### ロール名
アタッチ先のRAMロール名を指定します。必須パラメータです。  
先に作成したRAMロールを指定します。  


### ECSにロールアタッチ
#### ロール名
アタッチするRAMロールの名前を指定します。必須パラメータです。  
先程作成したロールを指定しています。

#### インスタンスID
RAMロールをアタッチする対象のECSインスタンスのリソースIDを指定します。必須パラメータです。  
複数存在する場合は、カンマ区切りで指定します。  


## 実行結果
エラーが発生しなければ、RAMロールの作成・アタッチ成功です。  
管理コンソール上から作成したRAMロールを確認してみましょう。

`Resource Access Management`　>　`ロール管理`より、作成したRAMロールを確認します。

![RAMロール管理画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/20190701221412.png "RAMロール管理画面")      

無事にRAMロールが作成されています。  
ロール名をクリックし、RAMロールの詳細を表示します。  

![RAMロール詳細画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/20190701221436.png "RAMロール詳細画面")      

ロール作成時に指定したAssumeロールポリシーが正常に設定出来ていることが確認出来ます。 
 
次に、メニュー一覧から`権限付与ポリシー`をクリックし、アタッチされているRAMポリシーの一覧を表示します。

![RAMロール詳細画面②](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/20190701221511.png "RAMロール詳細画面②")      

正常に、作成したRAMポリシーがアタッチされていることが確認出来ます。  
RAMポリシーの操作メニューから、`権限を表示`をクリックします。  

![RAMポリシー詳細画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/20190701221554.png "RAMポリシー詳細画面")      

先程リクエストパラメータで指定した通り、全リソースへのフルアクセス権が定義されています。  

最後に、ECSインスタンスにRAMロールがアタッチされていることを確認します。  
`Elastic Compute Service`＞`インスタンスリスト`より、各インスタンスの詳細画面を表示します。

![ECSインスタンス詳細画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/20190701221620.png "ECSインスタンス詳細画面")      

どちらのインスタンスにも、作成したRAMロールが付与されていることが確認出来ました 

# Tips
## ①Java SDKでインスタンスRAMロールを利用する
冒頭で紹介したように、Java SDKでインスタンスRAMロールを利用して認証を行うには、  
クライアント（`IAcsClient`）の生成方法を変える必要があります。  

### RAMロール名をソースコードに記述する場合
下記のように、  
`InstanceProfileCredentialsProvider`クラスのコンストラクタでRAMロール名を指定してインスタンスを生成し、  
それを`DefaultAcsClient`クラスのコンストラクタの第2引数で指定します。  

```java
IAcsClient client = new DefaultAcsClient(DefaultProfile.getProfile("ap-northeast-1"),
    new InstanceProfileCredentialsProvider("ramrole-api-demo"));
```

上記のように記述することで、  
クライアント生成時に指定したRAMロール名でインスタンスメタデータを参照、認証情報を取得し、それを用いてAPIを発行を発行することが出来ます。  

実際にRAMロールをアタッチしたECSインスタンス上でメタデータを参照すると、  
以下のように認証情報が返却されることが確認出来るかと思います。 [^2]
```bash
# curl http://100.100.100.200/latest/meta-data/Ram/security-credentials/ramrole-api-demo
 {
  "AccessKeyId" : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "AccessKeySecret" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "Expiration" : "2019-07-01T15:11:04Z",
  "SecurityToken" : "CAISjAJ1q6Ft5B2yfSjIr4vif/
     :
  （中略）
     :
  f6mZf82Q+i0BzoX3df59/lcYdmlSWj38IF31LMslJZ037I=",
  "LastUpdated" : "2019-07-01T09:11:04Z",
  "Code" : "Success"
}
```

[^2]: インスタンスメタデータの取得方法等、詳細については[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/49122.htm)をご覧ください。

### RAMロール名を環境変数に記述する場合
環境変数として、`ALIBABA_CLOUD_ECS_METADATA`をkeyとし、valueにRAMロール名を設定することで、  
ソースコード内にRAMロール名を記述することなくインスタンスRAMロールの利用が可能となります。[^3]  

この場合、クライアントの生成時にはリージョンの指定のみとなり、  
以下のようにシンプルに記述出来ます。
```java
IAcsClient client = new DefaultAcsClient("ap-northeast-1");
```

今回はこの方法を用い、RAMロールをアタッチしたECSインスタンス上でAPIが発行出来ることを確認してみたいと思います。

[^3]: なお、RAMロール名を指定せずにインスタンスメタデータを取得した場合（http://100.100.100.200/latest/meta-data/Ram/security-credentials でアクセスした場合）、ECSインスタンスにアタッチされているRAMロールの一覧が取得されるため、実装次第では環境変数に設定する必要もなくなります。

#### 検証コード
検証に使用するソースコードは、[第1回・環境準備編](https://sbopsv.github.io/cloud-tech/developer-tools/DEVTOOL_008_api-orchestration-1)で紹介したリージョン一覧を取得するサンプルコードを使用します。  

下記のように、クライアント生成部分のみ変更します。  
（比較のため、`AccessKey/SecretAccessKey`および既存のクライアント生成部分はコメントアウトしています）

```java
package com.alibaba.demo.apisample;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.ecs.model.v20140526.DescribeRegionsRequest;
import com.aliyuncs.ecs.model.v20140526.DescribeRegionsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
public class ApiSample {

    private static final String REGION_ID = "${REGION_ID}"; // リージョンID
    // private static final String ACCESS_KEY = "${ACCESS_KEY}"; // AccessKey
    // private static final String SECRET_ACCESS_KEY = "${SECRET_ACCESS_KEY}"; // SecretAccessKey

    public static void main(String[] args) {

        // IAcsClient client = new DefaultAcsClient(
        //     DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY)); // クライアント生成

        IAcsClient client = new DefaultAcsClient(REGION_ID); // クライアント生成（追加）

        try {
            DescribeRegionsResponse response = client.getAcsResponse(new DescribeRegionsRequest()); // API実行
            response.getRegions().forEach(region -> {
                System.out.println("リージョン名:" + region.getLocalName());
                System.out.println("リージョンID:" + region.getBizRegionId());
                System.out.println("エンドポイント:" + region.getRegionEndpoint());
                System.out.println("-----------------------------------------");
            });
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }
}
```

もちろん、現状態で実行しても、下記のように認証エラーが発生します。

![認証エラー](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/20190701221815.png "認証エラー")      

#### パッケージング
- ① jarファイルとしてパッケージングするために、`pom.xml`に以下の通り定義します。
```xml
<properties>
	<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	<maven.compiler.source>11.0.3</maven.compiler.source>   <!-- Java Verson -->
	<maven.compiler.target>11.0.3</maven.compiler.target>   <!-- Java Verson -->
</properties>

<build>
	<plugins>
		<plugin>
			<groupId>org.apache.maven.plugins</groupId>
			<artifactId>maven-assembly-plugin</artifactId>
			<version>3.0.0</version>
			<configuration>
				<finalName>tips-test</finalName>   <!-- ファイル名 -->
				<descriptorRefs>
					<descriptorRef>jar-with-dependencies</descriptorRef>
				</descriptorRefs>
				<archive>
					<manifest>
						<mainClass>com.alibaba.demo.apisample.ApiSample</mainClass>  <!-- メインクラス -->
					</manifest>
				</archive>
			</configuration>
			<executions>
				<execution>
					<id>make-assembly</id>
					<phase>package</phase>
					<goals>
						<goal>single</goal>
					</goals>
				</execution>
			</executions>
		</plugin>
	</plugins>
</build>
```
- **・Java Verson**：Javaのバージョンを指定します。  
- **・ファイル名**：パッケージング後のファイル名のプレフィックスを指定します。  
- **・メインクラス**：実行するメインクラスを指定します。  

- ② `Package Explorer`上で、`Run As（実行）`＞`Maven install`を押下します。
![Maven install](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/20190701221839.png "Maven install")     

- ③ Console上に**`BUILD SUCCESS`** が表示されることを確認します。
![Maven Build](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/20190701222417.png "Maven Build")      

- ④ `Package Explorer`上で、`target`配下に`<pom.xmlに指定したファイル名> + -jar-with-dependencies.jar`という名前でjarファイルが生成されていることを確認します。
![jarファイル](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/20190701222510.png "jarファイル")     

- ⑤ 任意のターミナルソフトを用いて、ECSインスタンスに生成したjarファイルを転送します。

#### 環境設定
RAMロールを付与したECSインスタンスにログインして作業します。

- ① 以下のコマンドを実行し、javaをインストールします。
```bash
yum -y install java
```

- ② 以下のコマンドを実行し、環境変数にRAMロール名を設定します。
```bash
export ALIBABA_CLOUD_ECS_METADATA="ramrole-api-demo"
```
※RAMロール名は適宜変更してください。


#### 動作確認
以下のコマンドを実行し、jarファイルを実行します。
```bash
java -jar tips-test-jar-with-dependencies.jar
```
※jarファイル名は適宜変更してください。

以下の通り、標準出力でリージョンの一覧が出力されれば、  
インスタンスRAMロールを利用したAPIの実行は成功です  

![実行結果](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127211900000/20190701222542.png "実行結果")      

## ②Auto ScalingにRAMロールを紐付ける
先程のサンプルでは、各ECSインスタンスに個別でRAMロールをアタッチしていましたが、  
Auto ScalingにRAMロールを紐付けることで、Auto Scalingの機能で起動してくるECSインスタンスに自動でRAMロールを付与することが可能です。

サンプルコードは省略しますが、  
新規でAuto Scalingを作成する場合は、[CreateScalingConfiguration](https://www.alibabacloud.com/cloud-tech/doc-detail/25944.htm)の``RamRoleName``に、  
既存のAuto Scalingに設定する場合は、[ModifyScalingConfiguration](https://www.alibabacloud.com/cloud-tech/doc-detail/84770.htm)の``RamRoleName``に  
それぞれRAMロール名を指定することで、Auto ScalingとRAMロールの紐付けを行うことが出来ます。

※なお、Auto ScalingとRAMロールの紐付きについては、管理コンソール上は現状未実装であり、  
紐付けを行うことも、APIで紐付けた結果を画面から確認することも出来ませんので、ご了承ください。

# 最後に
本記事では、今まで触れて来なかったAPIとRAMの関係を掘り下げてみました。  
実運用では、RAMユーザやRAMロール、RAMポリシーは必ず必要となってくるコンポーネントであるため、是非参考にしていただけると幸いです。






