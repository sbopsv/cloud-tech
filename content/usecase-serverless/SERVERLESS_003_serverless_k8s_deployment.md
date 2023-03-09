---
title: "KNativeによるサーバーレスk8s"
metaTitle: "Alibab CloudによるKNativeによるサーバーレスk8s活用パターンの手順"
metaDescription: "Alibab CloudによるKNativeによるサーバーレスk8s活用パターンの手順を説明します"
date: "2021-06-09"
author: "Bob"
thumbnail: "/images/00_Use_Knative_In_ASK_Cluster.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## KnativeによるサーバーレスK8Sデプロイメント

本記事では、Container Service for Kubernetes (ACK)に付帯されてるKnativeによるサーバーレスK8Sをデプロイする方法をご紹介します。    

今回は [Container Service for Kubernetes (ACK) クラスター](https://www.alibabacloud.com/cloud-tech/doc-detail/86366.htm)を使用します。Container Service for Kubernetes (ACK) クラスターは、ノードの購入、運用・保守（O&M）、キャパシティプランニングの手間をかけずに、コンテナ化されたアプリケーションを展開することができます。      
ASKはまた、サーバーレスアプリケーションのためのクラウドネイティブでクロスプラットフォームなオーケストレーションエンジンとして利用可能な [Knative](https://www.alibabacloud.com/cloud-tech/doc-detail/184831.htm) とも統合されています。Knative APIを呼び出してクラウドリソースを利用するには、ASKクラスタを作成し、クラスタに対してKnativeを有効にするだけで済みます。ちなみにKnativeコントローラーの費用は不要です。     


![Use Knative in ASK Cluster](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/00_Use_Knative_In_ASK_Cluster.png "Use Knative in ASK Cluster")

このシナリオとしてのデモでは、OSSバケットへのZIPファイルのアップロードと、RDS MySQLデータベースへのアップロードレコードの追加を行うファイル管理サービスを構築します。     
[OSS bucket](https://www.alibabacloud.com/cloud-tech/doc-detail/31883.htm)  と [ApsaraDB for RDS MySQL](https://www.alibabacloud.com/cloud-tech/doc-detail/164594.htm) の作成プロセスはここでは省略します。     

## サーバーレス k8s cluster を作成

まず最初に、Alibaba Cloudにサーバーレスk8sクラスターを用意して、次のステップに進む準備をします。
サーバーレスk8sクラスターがOSSバケットやMySQLインスタンスと同じネットワーク下にあることを確認します。     

![Enter Common Buy Page by Create Button](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/01_Enter_Common_Buy_Page_By_Create_Button.png "Enter Common Buy Page by Create Button")      
![Config Serverless K8S Cluster](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/02_Config_Serverless_K8S_Cluster.png "Config Serverless K8S Cluster")
![Confirm Serverless K8S Cluster Configurations](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/03_Config_Serverless_K8S_Cluster_Configurations.png "Config Serverless K8S Cluster Configurations")
![作成プロセスとログの確認](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/04_Check_Creation_Process_And_Logs.png "作成プロセスとログの確認")
![作成プロセスの完了](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/05_Complete_Creation_Process.png "作成プロセスの完了")
![Create Target Serverless K8S Cluster Successfully](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/06_Create_Target_Serverless_K8S_Cluster_Successfully.png "Create Target Serverless K8S Cluster Successfully")

## ACRでイメージファイルを準備

[Alibaba Cloud Container Registry (ACR)](https://www.alibabacloud.com/cloud-tech/doc-detail/257112.htm) を使って`Git`、`BitBucket`、`GitLab`などから複数のイメージを構築することができます。    
ここでは、サーバーレスのk8sクラスタのターゲットイメージを管理するために、`Local Repository` を使用します。ACRの他にも、`Docker Official イメージ` や `Alibaba Public Cloud イメージ` などを利用することもできます。      

![サーバーレスK8Sクラスターでサポートされるイメージ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/07_Supported_Images_In_Serverless_K8S_Cluster.png "Supported Images in Serverless K8S Cluster")

イメージファイルの管理を行うために、 Alibaba Cloud Container Registry (ACR) でPersonal editionのインスタンスを作成します。    

![パーソナルエディションのインスタンス追加](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/08_Add_Instance_Of_Personal_Edition.png「パーソナルエディションのインスタンス追加」)
![機能情報の確認と注文の確定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/09_Check_Feature_Information_And_Confirm_Order.png "機能情報の確認と注文の確定")

インスタンスが作成されたら、他の操作を行う前に、`Docker Login Password` を設定する必要があります。     
* RAMアカウントを使用している場合は、メインアカウントがすでにパスワードを設定しており、そうでない場合はパスワードを設定できませんのでご注意ください。     

![Docker Login Password - Note for RAM Account](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/10_Docker_Login_Password_Note_For_RAM_Account.png "Docker Login Password - Note for RAM Account")
![Docker Login Password - Set Password](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/11_Docker_Login_Password_Set_Password.png "Docker Login Password - Set Password")

namespaceら名前空間とリポジトリを作成します。     

![Create Namespace](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/12_Create_Namespace.png "Create Namespace")
![Create Namespace Successfully](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/13_Create_Namespace_Successfully.png "Create Namespace Successfully")
![Create Repository - Repository Info](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/14_Create_Repository_Info.png "Create Repository - Repository Info")
![Create Repository - Code Source](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/15_Create_Repository_Code_Source.png "Create Repository - Code Source")
![Create Repository Successfully](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/16_Create_Repository_Successfully.png "Create Repository Successfully")

これで、ソースコードに基づいた関連画像を作成することができました。ここでは、ソースコードとして「local repository」を選択しているので、自分でDockerイメージをビルドして、ACRリポジトリにプッシュします。        
Gitなどの他のコードソースを使用している場合は、ACR経由で [build docker イメージ](https://www.alibabacloud.com/cloud-tech/doc-detail/60997.htm) をすることができます。        
ローカルリポジトリについては、詳細ページに以下のような操作ガイドやサンプルスクリプトがあります。      

![Operation Guide and Sample Scripts](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/17_Operation_Guide_And_Sample_Scripts.png "Operation Guide and Sample Scripts")

ここでは、ECSインスタンスを使用して、以下のDockerfileに基づいて関連するDockerイメージを構築します。     


```Dockerfile
# 第一段階：ビルド環境の完成
FROM maven:3.6.1-jdk-8-alpine AS builder

# pom.xmlとソースコードの追加
ADD ./pom.xml pom.xml
ADD ./src src/

# パッケージ jar
RUN mvn clean package

# 第二段階：最小限のランタイム環境
FROM openjdk:8-jre-alpine

# 第一段階のjarをコピーして、jar名を自分のものに変更する
COPY --from=builder target/file_upload_serverless_demo-1.0-SNAPSHOT.jar file_upload_serverless_demo-1.0-SNAPSHOT.jar

EXPOSE 8080

# jarの名前を自分の好きなように変更する
CMD ["java", "-jar", "file_upload_serverless_demo-1.0-SNAPSHOT.jar"]
```

docker serviceがインストールされ、正常に動作していることを確認します。     
なお、Dockerfileではマルチステージビルドを採用しているため、dockerのバージョンは17.05以降である必要があります。        

![Error Message with Lower Docker Version](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/18_Error_Message_With_Lower_Docker_Version.png "Error Message with Lower Docker Version")
![Using Docker 20.10.7](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/19_Using_Docker_20.10.7.png "Using Docker 20.10.7")

関連するソースコードをECSサーバに置き、そのフォルダに入って、コマンド `docker build -t bobdemo/bobdemo:v1 .` でイメージをビルドします。      

![Put Source Code Folder in Server](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/20_Put_Source_Code_Folder_In_Server.png "Put Source Code Folder in Server")
![Build Related Docker Image](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/21_Build_Related_Docker_Image.png "Build Related Docker Image")
![Build Related Docker Image Successfully](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/22_Build_Related_Docker_Image_Successfully.png "Build Related Docker Image Successfully")

以下のように イメージファイルを確認し、関連するenvパラメータがあれば設定します。     

```
docker run -p 8080:8080 -e MYSQL_HOST=xxx -e MYSQL_USER=xxx -e MYSQL_PASSWORD=xxx -e OSS_ENDPOINT=xxx -e OSS_ACCESSKEYID=xxx -e OSS_ACCESSKEYSECRET=xxx -e OSS_BUCKET=xxx -e OSS_LOCATION=xxx bobdemo/bobdemo:v1
```

![関連Dockerイメージの検証](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/23_Verify_Related_Docker_Image.png "関連Dockerイメージの検証")

イメージにタグを付けて、ACRのローカルリポジトリに入れます。     

```
// ACRにログイン
docker login --username=bob@5171341380549220 registry-intl.ap-northeast-1.aliyuncs.com

// タグの追加
docker tag bobdemo/bobdemo:v1 registry-intl.ap-northeast-1.aliyuncs.com/bobdemo/bobdemo:v1

// イメージのプッシュ
docker push registry-intl.ap-northeast-1.aliyuncs.com/bobdemo/bobdemo:v1
```

![Push Related Docker Image](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/24_Push_Related_Docker_Image.png "Push Related Docker Image")
![Check Related Docker Image in ACR](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/25_Check_Related_Docker_Image_In_ACR.png "Check Related Docker Image in ACR")

## サーバレスのk8sクラスターにデプロイ

docker run`コマンドでは、`-e`オプションを使って、RDSやOSSの接続情報など、アプリケーションで使用する環境変数を定義しています。この点については、サーバーレスのk8sクラスターも関連機能を提供しています。    
この辺りについては [Config map and secrets](https://www.alibabacloud.com/cloud-tech/doc-detail/86390.htm)セクションを使用します。なお、AccessKey/IdやAccessKeySecretなどの機密情報はsecretsに格納することを強く推奨します。     

![Create Config Map](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/26_Create_Config_Map.png "Create Config Map")      
![Create Config Map Successfully](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/27_Create_Config_Map_Successfully.png "Create Config Map Successfully")     
![Create Secrets](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/28_Create_Secrets.png "Create Secrets")    
![Create Secrets Successfully](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/29_Create_Secrets_Successfully.png "Create Secrets Successfully")      

 `Deployments Page`  に移動し、"Create from Image" ボタンをクリックしてデプロイ作業に入ります。     

![デプロイメント - 作成プロセスに入る](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/30_Deployments_Enter_Creation_Process.png "Deployments - Enter Creation Process")
![デプロイメント - 基本情報の設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/31_Deployments_Set_Basic_Information.png "デプロイメント - 基本情報の設定")
![デプロイメント - ターゲット画像の選択](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/32_Deployments_Select_Target_Image.png "デプロイメント - ターゲット画像の選択")
![デプロイメント - ターゲットタグの選択](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/33_Deployments_Select_Target_Tag.png "デプロイメント - ターゲットタグの選択")
![デプロイメント - コンテナポートの設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/34_Deployments_Set_Container_Port.png "Deployments - Set Container Port")
![デプロイメント - 環境変数の設定](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/35_Deployments_Set_Environment_Variables.png "Deployments - Set Environment Variables")
![デプロイメント - サービスの作成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/36_Deployments_Create_Services.png "デプロイメント - サービスの作成")
![デプロイメント - サービスの作成に成功](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/37_Deployments_Create_Services_Successfully.png "Deployments - Create Services Successfully")
![Deployments - Complete Successfully](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/38_Deployments_Complete_Successfully.png "Deployments - Complete Successfully")    

Pod の状態を確認し、「Access Method」の情報をもとにサービス状況を確認します。        

![Check Pod Status](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/39_Check_Pod_Status.png "Check Pod Status")
![Access Methodの確認](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/40_Check_Access_Method.png "Check Access Method")
![Access Service by Python](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/41_Access_Service_By_Python.png "Access Service by Python")
![Verify Service - OSS Bucket](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/42_Verify_Service_OSS_Bucket.png "Verify Service - OSS Bucket")
![サービスの検証 - RDS MySQL](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/43_Verify_Service_RDS_MySQL.png "サービスの検証 - RDS MySQL")

 `Scale Configuration（スケール設定）`  を使って常時稼働するPodの数を設定することもできますが、これを「0」に設定するとサービスが停止し、Podが稼働しなくなります。      

![希望するポッドの数を0にする](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/44_Set_Desired_Number_Of_Pod_As_0.png "希望するポッドの数を0にする")
![Terminate Existing Pod Automatically](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/45_Terminate_Existing_Pod_Automatically.png "Terminate Existing Pod Automatically")
![None Running Pod](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/46_None_Running_Pod.png "None Running Pod")
![Service Is Down](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/47_Service_Is_Down.png "Service Is Down")

## knativeを使ってサーバーレスのk8sクラスターにデプロイ

サービスへのビジネスリクエストがないときには、ポッドが稼働していないことを意味します。  上記の手順では、ポッドの数を「0」に設定したため、サービスが停止してしまいました。そのため、Knativeの助けを借りて、これを実現することができました。      
Open source のKnativeでは、コスト削減のためにscale-to-zeroの仕組みを採用しています。ASKクラスターにポッドを作成すると、コールドスタートが発生します。しかし、コールドスタート中は、セッションのタイムアウトにより、クラスタがリクエストを処理できないことがあります。一方、Knativeコントローラのインストールに使用されるインフラストラクチャ・リソースに対しては課金されます。      
[ASK Knative](https://www.alibabacloud.com/cloud-tech/doc-detail/184831.htm) は、オフピーク時にインスタンス数を0にスケールしません。代わりに、ASKはリザーブドインスタンスを使用します。[リザーブドインスタンス](https://www.alibabacloud.com/cloud-tech/doc-detail/184834.htm) を使用すると、コールドスタートを低コストで回避できます。また、Knativeのコントローラにお金を払う必要はありません。       
knativeをデプロイするためには、まずサーバーレスのk8sクラスターにknativeのコンポーネントをデプロイする必要があります。今回はイベントトリガーを使わないので、処理中にサービス機能を選択するだけで済みます。      


![Deploy Knative Components](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/48_Deploy_Knative_Components.png "Deploy Knative Components")
![Select Serving Features](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/49_Select_Serving_Features.png "Select Serving Features")
![Warning Message During Deployment Process](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/50_Warning_Message_During_Deployment_Process.png "Warning Message During Deployment Process")
![Complete Deployment Process Successfully](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/51_Complete_Deployment_Process_Successfully.png "Complete Deployment Process Successfully")
![Check Knative Status](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/52_Check_Knative_Status.png "Check Knative Status")

knativeがクラスタにデプロイされた後、それを使うことで、 [サービスの管理](https://www.alibabacloud.com/cloud-tech/doc-detail/198683.htm) を行うことができました。     

![Knative Service - Enter Creation Process](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/53_Knative_Service_Enter_Creation_Process.png "Knative Service - Enter Creation Process")を実行します。
![Knative Service - Set Basic Information](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/54_Knative_Service_Set_Basic_Information.png "Knative Service - Set Basic Information")
![Knative Service - Set Environment Variables](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/55_Knative_Service_Set_Environment_Variables.png "Knative Service - Set Environment Variables")
![Knative Service - Complete Successfully](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/56_Knative_Service_Complete_Successfully.png "Knative Service - Complete Successfully")

参考として、Knativeは上記の手順で2つのデプロイメントを作成しますが、接尾辞が `-reserve` のものは予約済みのインスタンスに基づいています。     

![Knative Service - Check Deployments](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/57_Knative_Service_Check_Deployments.png "Knative Service - Check Deployments")

あとはデフォルトのドメイン情報を使ってサービスを確認します。      

![Knative Service - Access by Python](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/58_Knative_Service_Access_By_Python.png "Knative Service - Access by Python")
![Knative Service - OSS Bucket](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/59_Knative_Service_OSS_Bucket.png "Knative Service - OSS Bucket")
![Knative Service - RDS MySQL](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/60_Knative_Service_RDS_MySQL.png "Knative Service - RDS MySQL")


## 最後に
以上で、Container Service for Kubernetes (ACK)に付帯されてるKnativeによるサーバーレスK8Sをデプロイする方法をご紹介しました。   Knative（＝サーバレスk8s）があれば、サーバーのプロビジョニングと管理のタスクが不要になるため、k8sに対する労力がかなり減るはずなので、参考に頂ければ幸いです。      


<CommunityAuthor 
    author="Bob Bao"
    self_introduction = "2017年よりAlibaba Cloudサービスに携わる。ETL、ビッグデータ、サーバーレスが得意。PythonやJavaでのプログラミング経験豊富。AlibabaCloud Expert"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/bob_icon.jpg"
    githubUrl="https://github.com/bwbw723"
/>



