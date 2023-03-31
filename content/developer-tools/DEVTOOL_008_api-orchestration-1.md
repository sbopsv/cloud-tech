---
title: "APIで自動構築① - 環境準備編"
metaTitle: "APIを用いてAlibaba Cloudリソースを自動構築する① - 環境準備編"
metaDescription: "APIを用いてAlibaba Cloudリソースを自動構築する① - 環境準備編"
date: "2019-05-15"
author: "SBC engineer blog"
thumbnail: "/developer-tools_images_17680117127130800000/000000000000000005.png"
---

## APIを用いてAlibaba Cloudリソースを自動構築する① - Java SDK環境準備編

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/000000000000000005.png "img")  

# はじめに

突然ですが、みなさんはどのようにAlibaba Cloudリソースを構築・管理していますでしょうか？  
おそらく、ほとんどの方がコンソール画面から操作を行っていると思います。
コンソール画面からのGUI操作は、操作がわかりやすく視認性が高い、といったメリットがありますが、一方で数百～数千といった数のリソースを操作する場合、管理が複雑になりオペレーションミスを誘発しやすい、といったデメリットも存在します。

そこで 本記事では`APIを用いてAlibaba Cloudリソースを自動構築する`と題しまして、プログラムチックにAlibaba Cloudリソースを構築・管理する方法、およびノウハウをシリーズでお届けしていきたいと思います。（全6回）

シリーズ第1回目の今回は、**"誰でも"** **"素早く"** **"簡単に"** API操作を行えるようになることを目標に、開発環境の整備から実際にAPIを実行する方法までをご紹介します。  

一緒に**Infrastructure as Code**の世界へ飛び込んで行きましょう 

## API実行手段
Alibaba Cloudでは、APIリクエストを発行する方法として、以下の4つが提供されています。

#### ① URLリクエスト
CurlやPostman等のツールを用い、特定のURLにHTTP(HTTPS)リクエストを送信することでAPIを実行する。  
認証情報をURL内に埋め込む必要があり、手順が複雑。

#### ② Alibaba CLI
専用のコマンドラインツールをインストールし、コマンドベースでAPIを実行する。  
お手軽に実行でき、Describe系APIでリソース一覧を取得したい場合等で重宝する。

#### ③ Alibaba SDK
Alibaba Cloudが提供する各種プログラミング言語のSDKを利用してAPIを実行する。  
ちょっとしたプロビジョニングツールから、大規模構成管理ツールの開発まで、さまざまなカスタマイズ可能。  
<font color="Red">Ailbaba推奨</font>

#### ④ Open API Explorer
上記SDKによるAPI実行をブラウザ上から可能にするWeb UI。  
リクエストパラメータを埋めることで、ソースコードが自動生成されるため、自ら実装する必要なくAPI操作が可能。  
2019/01/31リリース

本シリーズでは、Alibaba推奨であり、かつカスタムが容易な**③ Alibaba SDK**を用いてリソース構築の自動化を行っていきたいと思います。  

# Alibaba SDKの紹介
Alibaba Cloud日本サイトでは、現在4つのプログラミング言語でSDKが提供されています。  

1. Java
2. Python
3. PHP
4. C#

今回は**1. Java**を使って、APIを実行する方法を紹介していきます。

# 開発環境整備
ではさっそく、Alibaba Java SDKの開発環境を準備していきましょう。

## 必要なもの
前提条件として、以下の3つが必要となります。

1. Java（version1.6以降）
2. Eclipse等のIDE
3. Alibaba Cloudアカウント

JavaおよびIDEについての説明は割愛させていただきます。（今回は[STS](https://spring.io/tools)を利用）  
もしもAlibaba Cloudのアカウントを取得されていない方がいましたら、
[こちら](https://www.alibabacloud.com/campaign/coupon-freetrial)のリンクより、アカウントの登録をお願いします。  
今ならなんと  **<font color="Red">30,000円分のクーポン（有効期限1年間）が貰えちゃいます </font>** [^1]  

[^1]: 2019年5月現在

## AccessKey/SecretAccessKeyを取得する
プログラムからAlibaba Cloudリソースを操作する場合、リソースへの操作権限を持ったRAMユーザのAccessKeyおよびSecretAccessKeyを用いて認証を行う必要があります。 [^2]

本セクションではAccessKey/SecretAccessKeyを取得する方法をご紹介します。

[^2]: 実は、RAMロールを用いることによって、AccessKey/SecretAccessKeyを使用せずに認証を行うことが可能です。RAMロールを使用した認証方法については、シリーズ後半にご紹介する予定です。乞うご期待 

### 取得手順

1. コンソールログイン  
[Alibaba Cloudコンソール](https://signin-intl.aliyun.com/login.htm)より、ユーザ名/パスワードを入力し、Alibaba Cloudコンソールにログインします。

![コンソールログイン画面](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/20190514165349.png "コンソールログイン画面")     

2. AccessKey管理画面遷移  
ログインが出来ましたら、コンソール画面右上のユーザアイコンより、`Access key 管理`をクリックし、AccessKey管理画面へ遷移します。  

![AccessKey取得①](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/20190514165525.png "AccessKey取得①")     

3. AccessKey/SecretAccessKey生成  
AccessKey管理画面より、`AccessKeyの作成`ボタンを押下し、AccessKey/SecretAccessKeyを作成します。  

![AccessKey取得②](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/20190514165603.png "AccessKey取得②")     

4. AccessKey/SecretAccessKey表示・保存  
ポップアップが表示されるので、生成されたAccessKeyおよびSecretAccessKeyを控えます。  
右下の`AK 情報を保存`ボタンを押下することで、AccessKey/SecretAccessKeyをcvsファイルとして保存することが可能です。  

![AccessKey取得③](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/20190514165658.png "AccessKey取得③")     

以上がAccessKey/SecretAccessKeyの取得手順になります。  
なお、<font color="Red">AccessKeyおよびSecretAccessKeyはコンソールのログインユーザ/パスワードと同様、重要な秘密情報となりますので、管理には十分気を付けてください。</font>

## ライブラリをインポートする
Alibaba Java SDKをインポートする方法として、  
1. Mavenリポジトリからインポートする方法（**Alibaba推奨**）  
2. jarファイルを直接インポートする方法    

の2種類があります。  
今回はAlibabaが推奨するMavenを使用したライブラリのインストール方法を紹介します。  

### プロジェクト作成
お使いのIDEでMavenプロジェクトを作成します。

1. `File` > `New` > `Other` より、『Maven Project』を選択して``Next``  

![Mavenプロジェクト作成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/20190514165919.png "Mavenプロジェクト作成")     

2. プロジェクト名・保存場所の設定、およびアーキタイプはデフォルトのまま``Next``  

![プロジェクト設定①](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/20190514165954.png "プロジェクト設定①")     

![プロジェクト設定②](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/20190514170027.png "プロジェクト設定②")     

3. Group ID、およびArtifact IDを適当に入力し、``Finish``を押下  

![プロジェクト設定③](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/20190514190638.png "プロジェクト設定③")     

4. Package Explorerにプロジェクトが作成されることを確認

### 依存関係追加
pom.xmlに以下の依存関係を追加し、ライブラリをインポートします。

```xml
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>aliyun-java-sdk-core</artifactId<name /> <!-- 共通モジュール -->
    <version>4.4.1</version>                             <!-- モジュールバージョン -->
</dependency>
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>aliyun-java-sdk-ecs</artifactId>         <!-- プロダクト個別モジュール -->
    <version>4.16.7</version>
</dependency>
```

#### 共通モジュール
Alibaba Java SDKのコアモジュールです。Clientクラスやリクエスト/レスポンスBeanの親クラス等、全プロダクト共通で用いるモジュールがパッケージングされています。  

#### モジュールバージョン
今回は[セントラルリポジトリ](https://mvnrepository.com/artifact/com.aliyun)  から最新のバージョンを指定しました。  

#### プロダクト個別モジュール
各プロダクト毎に専用のモジュールが用意されているので、必要に応じて依存関係を追加します。今回はECSのモジュールを追加しました。  
ArtifactIDの命名規則は、`aliyun-java-sdk-<プロダクト略称>`となっています。

![Maven Dependencies](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/20190514181459.png "img")      

Package Explorerの`Maven Dependencies`上にjarファイルが表示されていれば、インポート成功です。

# APIを実行してみよう 
お待たせしました   
準備が整いましたので、早速Java SDKを使ってAPIを実行してみましょう。    

以下のサンプルコードを参考に、[DescribeRegions](https://www.alibabacloud.com/cloud-tech/doc-detail/25609.htm)を実行しECSサービスを利用可能なリージョンの一覧を取得してみましょう  

## サンプルコード

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
    private static final String ACCESS_KEY = "${ACCESS_KEY}"; // AccessKey
    private static final String SECRET_ACCESS_KEY = "${SECRET_ACCESS_KEY}"; // SecretAccessKey

    public static void main(String[] args) {

        IAcsClient client = new DefaultAcsClient(
            DefaultProfile.getProfile(REGION_ID, ACCESS_KEY, SECRET_ACCESS_KEY)); // クライアント生成

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

#### リージョンID
リージョンを指定します。  
[CreateInstance](https://www.alibabacloud.com/cloud-tech/doc-detail/25499.htm)等のリソースを操作するAPIでは、ここで指定したリージョン内のリソースが操作対象となります。  
例）ap-northeast-1

#### AccessKey
先程取得したAccessKeyを指定します。

#### SecretAccessKey
先程取得したSecretAccessKeyを指定します。

#### クライアント生成
Alibaba CloudへAPIリクエストを送信するクライアントクラスのインスタンスを生成します。  
コンスタラクトの引数には、`DefaultProfile`クラスの`getProfile`メソッド（static）で生成したプロファイル情報を設定します。

#### API実行
クライアントクラス(`IAcsClient`)の`getAcsResponse`メソッドでAPIを実行します。  
引数には対象API専用のリクエストBeanクラスを指定します。返却値も同様です。

## 実行結果
以下のようにConsoleに出力されれば成功です 

```
（中略）
-----------------------------------------
リージョン名:香港
リージョンID:cn-hongkong
エンドポイント:ecs.aliyuncs.com
-----------------------------------------
リージョン名:亚太东北 1 (东京)
リージョンID:ap-northeast-1
エンドポイント:ecs.ap-northeast-1.aliyuncs.com
-----------------------------------------
リージョン名:亚太东南 1 (新加坡)
リージョンID:ap-southeast-1
エンドポイント:ecs.aliyuncs.com
-----------------------------------------
（後略）
```
リージョン名は中国語で返却されます。

# Tips
## NoClassDefFoundErrorが発生する問題について
Alibaba Java SDKを、Mavenからではなく直接jarファイルをダウンロード・インポートした場合、NoClassDefFoundErrorが発生します。

![NoClassDefFoundError](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_17680117127130800000/20190514170247.png "NoClassDefFoundError")     


`aliyun-java-sdk-core`も`aliyun-java-sdk-ecs`にもクラスパスを通しているのになぜ ？と思われた方もいらっしゃるかもしれません。（実際私もハマりました）  

本エラーは、本来Mavenで依存関係が解決されるライブラリ群がインポートされていないために発生します。  
上記のサンプルでは、以下の5つをインポートする必要があります。  
・`commons-logging`  
・`gson`  
・`httpclient`  
・`httpcore`  
・`jaxb-api`

必要となるライブラリはプロダクトのSDK毎に異なる場合があるため、[セントラルリポジトリ](https://mvnrepository.com/artifact/com.aliyun)を参照するか、素直にMavenを使うのが良さそうです。


# 最後に
**"誰でも"** **"素早く"** **"簡単に"** 開発環境が整備出来たのではないかと思います。    
第2回では、VPC編と称しまして、APIを用いて実際にVPCを構築してみたいと思います。    

