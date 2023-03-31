---
title: "OpenAPI Explorer"
metaTitle: "Alibab Cloud OpenAPI Explorerについて紹介します"
metaDescription: "Alibab Cloud OpenAPI Explorerについて紹介します"
date: "2021-06-26"
author: "Nancy"
thumbnail: "/developer-tools_images_03/00_overview.png"
---


# OpenAPI Explorerの手順

本書は、OpenAPI Explorerの使用手順を記載します。


構成図
 ![overview](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/00_overview.png "overview")


# 1.OpenAPI Explorerとは
OpenAPI Explorerは、WebバージョンのAPIを呼び出す可視化ツールです。OpenAPIExplorerでAlibabaCloudの各プロダクトの公開APIを呼び出すことができる、またAPIリクエストとレスポンスの表示ができます。 さらに、OpenAPI Explorerは、該当APIのSDK呼び出し例を自動的に生成される、Alibaba CloudAPIの使用をサポートします。
備考：OpenAPI Explorerは、無料のAPI呼び出しツールですが、APIで作成されたプロジェクトではプロダクトの課金方法によって、課金することがあります。
[OpenAPI Explorer リンク](https://api.alibabacloud.com/)

1）下記の機能を提供します。

①API検索
Alibaba Cloud複数のプロダクトのAPIが集まられる。必要なAPIが検索できます。

②API呼び出し
OpenAPI Explorerページでパラメータを入力し、コードを書かなくてAPIを呼び出すことができます。

③APIリクエストを表示
リクエストパラメータに従ってAPIリクエストを自動的に生成し、ウェブページに表示される。APIRequestが確認できます

④APIResponse表示
APIリクエストに応じて、実際のAPI呼び出しの結果、構造化された出力を返します。

⑤SDK呼び出し例を生成します

APIリクエストパラメータに従って、複数の言語でSDK呼び出しの例が自動的に生成されます

⑥コマンドライン呼び出し
Webバージョンのコマンドラインツールを提供し、コマンドランでAPIを呼び出し、Linuxの操作と同じように体験できます

2）使用シナリオ

OpenAPI Explorerを使用して、APIの検索、API定義の確認、APIのデバッグやトラブルシューティングなどのシナリオに適用できます。APIによる二次開発に役立ちます

①APIデバッグ

Alibaba Cloud APIに基づいて二次開発を実行する前に、予めAPIリクエストメソッドとAPIの返された結果を事前に確認できます。 OpenAPI Explorerには、Webページとコマンドラインの2つの方法を提供します。
API呼び出しの結果を直感的に確認できます。 そして呼び出しにエラーが発生する場合、OpenAPIExplorerは解決する方法も提供する。

②SDKの例を確認

OpenAPI ExplorerでAPIリクエストパラメータを入力する際に​​、Java、PHP、Python、Node.jsのサンプルコードを生成して開発をガイドするのに役立ちます。このツールはSDKでの開発をサポートします。

# 2.WebページからAPIを呼び出す
## 2-1.WebページからRPC APIを呼び出す
1）OpenAPI Explorerページを開き、ログインをクリックします
[OpenAPI Explorer リンク](https://api.alibabacloud.com)
![API Explorer](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/01_API_Explorer_01.png "API Explorer 01")


2）RAMユーザーでOpenAPI Explorerをログインします
①Alibaba Cloudのログイン画面が開かれる
![homepage login](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/02_API_Explorer_login_01.png "login 01")

②RAMユーザーでログインします
![homepage login](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/02_API_Explorer_login_02.png "login 02")

③RAMユーザーのユーザー名を入力します
![homepage login](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/02_API_Explorer_login_03.png "login 03")

③RAMユーザーのパスワードを入力します
![homepage login](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/02_API_Explorer_login_04.png "login 04")

④penAPI Explorerページが登録される
![homepage login](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/02_API_Explorer_login_05.png "login 05")


3）VPCを作成します
①Productをクリックし、VPCプロダクトを選択します

![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/03_API_Explorer_VPC_01.png "VPC create 01")

②VPC API 画面が表示される

![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/03_API_Explorer_VPC_02.png "VPC create 02")

③CreateVpc APIを検索します
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/03_API_Explorer_VPC_03.png "VPC create 03")

④検索されたCreateVpcをクリックし、CreateVpc設定画面が表示される
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/03_API_Explorer_VPC_04.png "VPC create 04")

⑤CreateVpcのAPIパラメータを設定します
パラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|CidrBlock|172.16.0.0/12|Y|
|Ipv6CidrBlock|なし|N|
|EnableIpv6|なし|N|
|VpcName|openAPI_vpc|N| 
|Description|from openAPI|N|
|ResourceGroupId|なし|N|
|DryRun|なし|N|
|UserCidr|なし|N|
|ClientToken|なし|N|
|Ipv6Isp|なし|N|

![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/03_API_Explorer_VPC_05.png "VPC create 05")

⑥APIリクエストをサブミットします
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/03_API_Explorer_VPC_06.png "VPC create 06")

⑦APIレスポンスが表示される
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/03_API_Explorer_VPC_07.png "VPC create 07")

Debugging Result

```
{
	"VRouterId": "vrt-6we54fxrvimomtef39dxp",
	"RouteTableId": "vtb-6weve6ccg1qo9v75lj93i",
	"RequestId": "66A1029E-2FB3-48B0-B985-1D56D4620D22",
	"VpcId": "vpc-6webjhersexrdnfsb3vm4",
	"ResourceGroupId": "rg-acfnu655g4vjkyi"
}
```

⑧VPCが作成される
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/03_API_Explorer_VPC_08.png "VPC create 08")

⑨VPCリソースを確認します
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/03_API_Explorer_VPC_09.png "VPC create 09")

4）VSwitchを作成します
上記VPCにVSWを追加します

①CreateVSwitch APIを検索します
![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_01.png "VSW create 01")

②検索されたCreateVSwitchをクリックします
![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_02.png "VSW create 02")

③CreateVSwitchのAPI設定画面が表示される
![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_03.png "VSW create 03")

④コード例タブをクリックします
![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_04.png "VSW create 04")

⑤CreateVSwitchのAPIパラメータを設定します
パラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|CidrBlock|172.16.1.0/24|Y|
|VpcId|vpc-6webjhersexrdnfsb3vm4|Y|
|ZoneId|ap-northeast-1a|Y|
|Ipv6CidrBlock|なし|N|
|VSwitchName|openAPI_vsw|N|
|Description|from openAPI vsw|N|
|ClientToken|なし|N|
|VpcIpv6CidrBlock|なし|N|

備考：
CidrBlockはVPCのCidrBlockに含まれるCidrBlockに設定すること
パラメータは右側のドキュメントタブをクリックし、参照することができます。
![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_05.png "VSW create 05")
VPCのZoneIDはDescribeZones APIで確認できます
![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_06.png "VSW create 06")
ZoneIDを確認します
![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_07.png "VSW create 07")

⑥APIリクエストをサブミットします
![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_08.png "VSW create 08")

⑦APIレスポンスが表示される

```
{
	"RequestId": "622A4542-EC74-4BD3-B398-8212CA0CE20A",
	"VSwitchId": "vsw-6wet64hexr53ndccadjoo"
}
```
![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_09.png "VSW create 09")

⑧VSwitchが作成される
![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_10.png "VSW create 10")

⑨VSwitch詳細を確認します

![API VSW create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/04_API_Explorer_VSW_11.png "VSW create 11")

5）VSwitchをリリースします
①DeleteVSwitch APIを検索します
![API VSW delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/05_API_Explorer_VSW_delete_01.png "VSW delete 01")

⑨DeleteVSwitch APIを設定します
パラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|VSwitchId|vsw-6wet64hexr53ndccadjoo|Y|
![API VSW delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/05_API_Explorer_VSW_delete_02.png "VSW delete 02")

③APIリクエストをサブミットし、APIレスポンスが表示される

```
{
	"RequestId": "98E077BC-8F2C-457C-9238-0F5D68136592"
}
```
![API VSW delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/05_API_Explorer_VSW_delete_03.png "VSW delete 03")

④Vswitchがリリースされたことを確認します

![API VSW delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/05_API_Explorer_VSW_delete_04.png "VSW delete 04")

6）VPCをリリースします
①VPCを確認します
![API VPC delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/06_API_Explorer_VPC_delete_01.png "VPC delete 01")

⑨DeleteVpc APIを検索し、パラメータを設定します
パラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|VpcId|vpc-6webjhersexrdnfsb3vm4|Y|
![API VPC delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/06_API_Explorer_VPC_delete_02.png "VPC delete 02")

③APIリクエストをサブミットし、APIレスポンスが表示される

```
{
	"RequestId": "012BC26F-D204-47B2-8A0F-483B13EF1C87"
}
```
![API VPC delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/06_API_Explorer_VPC_delete_03.png "VPC delete 03")

④VPCがリリースされたことを確認します

![API VPC delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/06_API_Explorer_VPC_delete_04.png "VPC delete 04")


## 2-2.WebページからRESTful APIを呼び出す
ElasticSearchのAPIはRestfulAPIであり、ElasticSearchを例として説明します。

1）前提条件：VPCとVSWが作成済みです。
①VPCを確認します
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/07_API_Explorer_ES_01.png "ES 01")

②VSwitchを確認します
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/07_API_Explorer_ES_02.png "ES 02")

2）ElasticSearchを作成します
①ElasticSearchプロダクトを検索します
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/08_API_Explorer_ES_create_01.png "ES 01")

②ElasticSearchAPI画面が表示される
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/08_API_Explorer_ES_create_02.png "ES 02")

③createInstanceを検索する 
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/08_API_Explorer_ES_create_03.png "ES 03")

④createInstanceパラメータ設定
パラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|clientToken|なし|Y|
|RequestBody|{"paymentType": "postpaid", "nodeAmount": "2", "instanceCategory": "x-pack", "esAdminPassword": "es_password1", "esVersion": "6.7", "nodeSpec": { "spec": "elasticsearch.sn1ne.large", "disk": "20", "diskType": "cloud_ssd" }, "networkConfig": { "type": "vpc", "vpcId": "vpc-6we6gahp387ucs4cyi1mg", "vsArea": "ap-northeast-1a", "vswitchId": "vsw-6we2znwytf5fylhpe3z95" }} |Y|


![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/08_API_Explorer_ES_create_04.png "ES 04")

⑤リクエストデータを確認します
リクエストデータ
```
aliyun elasticsearch POST /openapi/instances --header "Content-Type=application/json;" --body "{\"paymentType\":\"postpaid\",\"nodeAmount\":\"2\",\"instanceCategory\":\"x-pack\",\"esAdminPassword\":\"es_password1\",\"esVersion\":\"6.7\",\"nodeSpec\":{\"spec\":\"elasticsearch.sn1ne.large\",\"disk\":\"20\",\"diskType\":\"cloud_ssd\"},\"networkConfig\":{\"type\":\"vpc\",\"vpcId\":\"vpc-6we6gahp387ucs4cyi1mg\",\"vsArea\":\"ap-northeast-1a\",\"vswitchId\":\"vsw-6we2znwytf5fylhpe3z95\"}}"
```
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/08_API_Explorer_ES_create_05.png "ES 05")

createInstance APIのRequestは[createInstance](https://www.alibabacloud.com/cloud-tech/doc-detail/148782.htm?spm=a2c63.p38356.879954.4.4c255a4cHiNCpE#doc-api-elasticsearch-createInstance)をご参照ください
⑥リクエストをサブミットし、レスポンスを確認します
レスポンス：
```
{
	"Result": {
		"instanceId": "es-sg-82jfhghx8ks1hx017"
	},
	"RequestId": "962EAAA7-2978-458A-91E6-35E520DD0652"
}
```
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/08_API_Explorer_ES_create_06.png "ES 06")

⑦ElasticSearchインスタンスを確認する（ステータスが初期化中です）
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/08_API_Explorer_ES_create_07.png "ES 07")

⑧ElasticSearch詳細を確認します
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/08_API_Explorer_ES_create_08.png "ES 08")

⑨ElasticSearchステータスを確認します
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/08_API_Explorer_ES_create_09.png "ES 09")
 

2）ElasticSearchを確認します
①DescribeInstanceを検索する 
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/09_API_Explorer_ES_Describe_01.png "ES 01")

②DescribeInstanceパラメータを入力し、サブミットします
パラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|InstanceId|es-sg-82jfhghx8ks1hx017|Y|
|RequestBody|なし|N|
リクエスト
```
aliyun elasticsearch GET /openapi/instances/es-sg-82jfhghx8ks1hx017 --header "Content-Type=application/json;" --body "{}"
```
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/09_API_Explorer_ES_Describe_02.png "ES 02")

③APIレスポンスが表示される

```
{
	"Result": {
		"instanceId": "es-sg-82jfhghx8ks1hx017",
		"version": "6.7.0_with_X-Pack",
		"description": "es-sg-82jfhghx8ks1hx017",
		"nodeAmount": 2,
		"paymentType": "postpaid",
		"status": "active",
		"privateNetworkIpWhiteList": [
			"0.0.0.0/0"
		],
		"enablePublic": false,
		"nodeSpec": {
			"spec": "elasticsearch.sn1ne.large",
			"disk": 20,
			"diskType": "cloud_ssd"
		},
		"dataNode": true,
		"networkConfig": {
			"vpcId": "vpc-6we6gahp387ucs4cyi1mg",
			"vswitchId": "vsw-6we2znwytf5fylhpe3z95",
			"vsArea": "ap-northeast-1a",
			"type": "vpc"
		},
		"createdAt": "2021-06-26T03:08:34.657Z",
		"updatedAt": "2021-06-26T03:08:34.657Z",
		"commodityCode": "elasticsearch_intl",
		"extendConfigs": [
			{
				"configType": "usageScenario",
				"value": "general"
			},
			{
				"configType": "maintainTime",
				"maintainStartTime": "02:00Z",
				"maintainEndTime": "06:00Z"
			},
			{
				"configType": "aliVersion",
				"aliVersion": "ali1.3.0"
			}
		],
		"endTime": 4780396800000,
		"clusterTasks": [],
		"vpcInstanceId": "es-sg-82jfhghx8ks1hx017-worker",
		"resourceGroupId": "rg-acfnu655g4vjkyi",
		"zoneCount": 1,
		"protocol": "HTTP",
		"zoneInfos": [
			{
				"zoneId": "ap-northeast-1a",
				"status": "NORMAL"
			}
		],
		"instanceType": "elasticsearch",
		"inited": true,
		"tags": [
			{
				"tagKey": "acs:rm:rgId",
				"tagValue": "rg-acfnu655g4vjkyi"
			}
		],
		"domain": "es-sg-82jfhghx8ks1hx017.elasticsearch.aliyuncs.com",
		"port": 9200,
		"esVersion": "6.7.0_with_X-Pack",
		"esConfig": {
			"action.destructive_requires_name": "true",
			"xpack.security.audit.outputs": "index",
			"xpack.watcher.enabled": "false",
			"xpack.security.audit.enabled": "false",
			"action.auto_create_index": "+.*,-*"
		},
		"esIPWhitelist": [
			"0.0.0.0/0"
		],
		"esIPBlacklist": [],
		"kibanaProtocol": "HTTPS",
		"kibanaIPWhitelist": [
			"127.0.0.1"
		],
		"kibanaPrivateIPWhitelist": [],
		"publicIpWhitelist": [],
		"kibanaDomain": "es-sg-82jfhghx8ks1hx017.kibana.elasticsearch.aliyuncs.com",
		"kibanaPort": 5601,
		"haveKibana": true,
		"instanceCategory": "x-pack",
		"dedicateMaster": false,
		"advancedDedicateMaster": false,
		"masterConfiguration": {},
		"haveClientNode": false,
		"warmNode": false,
		"warmNodeConfiguration": {},
		"clientNodeConfiguration": {},
		"kibanaConfiguration": {
			"spec": "elasticsearch.n4.small",
			"amount": 1,
			"disk": 0
		},
		"elasticDataNodeConfiguration": {},
		"haveElasticDataNode": false,
		"dictList": [
			{
				"name": "SYSTEM_MAIN.dic",
				"fileSize": 2782602,
				"sourceType": "ORIGIN",
				"type": "MAIN"
			},
			{
				"name": "SYSTEM_STOPWORD.dic",
				"fileSize": 132,
				"sourceType": "ORIGIN",
				"type": "STOP"
			}
		],
		"synonymsDicts": [],
		"ikHotDicts": [],
		"aliwsDicts": [],
		"haveGrafana": false,
		"haveCerebro": false,
		"enableKibanaPublicNetwork": true,
		"enableKibanaPrivateNetwork": false,
		"advancedSetting": {
			"gcName": "CMS"
		},
		"enableMetrics": true,
		"readWritePolicy": {
			"writeHa": false
		}
	},
	"RequestId": "C2852EEB-5F17-4297-8DC0-DB84F27BF576"
}
```

![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/09_API_Explorer_ES_Describe_03.png "ES 03")

3）ElasticSearchをリリースします
①DeleteInstanceを検索する 
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/10_API_Explorer_ES_Delete_01.png "ES 01")

②DeleteInstanceパラメータを入力し、サブミットします
パラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|InstanceId|es-sg-82jfhghx8ks1hx017|Y|
|clientToken|なし|N|
|deleteType|なし|N|
|RequestBody|なし|N|

リクエスト
```
aliyun elasticsearch DELETE /openapi/instances/es-sg-82jfhghx8ks1hx017 --header "Content-Type=application/json;" --body "{}"
```

![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/10_API_Explorer_ES_Delete_02.png "ES 02")
③APIレスポンスが表示される

```
{
	"Result": {
		"instanceId": "es-sg-82jfhghx8ks1hx017",
		"version": "6.7.0_with_X-Pack",
		"description": "es-sg-82jfhghx8ks1hx017",
		"nodeAmount": 2,
		"paymentType": "postpaid",
		"status": "active",
		"privateNetworkIpWhiteList": [
			"0.0.0.0/0"
		],
		"enablePublic": false,
		"nodeSpec": {
			"spec": "elasticsearch.sn1ne.large",
			"disk": 20,
			"diskType": "cloud_ssd"
		},
		"dataNode": true,
		"networkConfig": {
			"vpcId": "vpc-6we6gahp387ucs4cyi1mg",
			"vswitchId": "vsw-6we2znwytf5fylhpe3z95",
			"vsArea": "ap-northeast-1a",
			"type": "vpc"
		},
		"createdAt": "2021-06-26T03:08:34.657Z",
		"updatedAt": "2021-06-26T03:08:34.657Z",
		"commodityCode": "elasticsearch_intl",
		"extendConfigs": [
			{
				"configType": "usageScenario",
				"value": "general"
			},
			{
				"configType": "maintainTime",
				"maintainStartTime": "02:00Z",
				"maintainEndTime": "06:00Z"
			},
			{
				"configType": "aliVersion",
				"aliVersion": "ali1.3.0"
			}
		],
		"endTime": 4780396800000,
		"clusterTasks": [],
		"vpcInstanceId": "es-sg-82jfhghx8ks1hx017-worker",
		"resourceGroupId": "rg-acfnu655g4vjkyi",
		"zoneCount": 1,
		"protocol": "HTTP",
		"zoneInfos": [
			{
				"zoneId": "ap-northeast-1a",
				"status": "NORMAL"
			}
		],
		"instanceType": "elasticsearch",
		"inited": true,
		"tags": [
			{
				"tagKey": "acs:rm:rgId",
				"tagValue": "rg-acfnu655g4vjkyi"
			}
		],
		"domain": "es-sg-82jfhghx8ks1hx017.elasticsearch.aliyuncs.com",
		"port": 9200,
		"esVersion": "6.7.0_with_X-Pack",
		"esConfig": {
			"action.destructive_requires_name": "true",
			"xpack.security.audit.outputs": "index",
			"xpack.watcher.enabled": "false",
			"xpack.security.audit.enabled": "false",
			"action.auto_create_index": "+.*,-*"
		},
		"esIPWhitelist": [
			"0.0.0.0/0"
		],
		"esIPBlacklist": [],
		"kibanaProtocol": "HTTPS",
		"kibanaIPWhitelist": [
			"127.0.0.1"
		],
		"kibanaPrivateIPWhitelist": [],
		"publicIpWhitelist": [],
		"kibanaDomain": "es-sg-82jfhghx8ks1hx017.kibana.elasticsearch.aliyuncs.com",
		"kibanaPort": 5601,
		"haveKibana": true,
		"instanceCategory": "x-pack",
		"dedicateMaster": false,
		"advancedDedicateMaster": false,
		"masterConfiguration": {},
		"haveClientNode": false,
		"warmNode": false,
		"warmNodeConfiguration": {},
		"clientNodeConfiguration": {},
		"kibanaConfiguration": {
			"spec": "elasticsearch.n4.small",
			"amount": 1,
			"disk": 0
		},
		"elasticDataNodeConfiguration": {},
		"haveElasticDataNode": false,
		"dictList": [
			{
				"name": "SYSTEM_MAIN.dic",
				"fileSize": 2782602,
				"sourceType": "ORIGIN",
				"type": "MAIN"
			},
			{
				"name": "SYSTEM_STOPWORD.dic",
				"fileSize": 132,
				"sourceType": "ORIGIN",
				"type": "STOP"
			}
		],
		"synonymsDicts": [],
		"ikHotDicts": [],
		"aliwsDicts": [],
		"haveGrafana": false,
		"haveCerebro": false,
		"enableKibanaPublicNetwork": true,
		"enableKibanaPrivateNetwork": false,
		"advancedSetting": {
			"gcName": "CMS"
		},
		"enableMetrics": true,
		"readWritePolicy": {
			"writeHa": false
		}
	},
	"RequestId": "A3B23316-0786-4B79-8B1B-0A83FC50C181"
}
```
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/10_API_Explorer_ES_Delete_03.png "ES 03")

![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/10_API_Explorer_ES_Delete_04.png "ES 04")

④ElasticSearchインスタンスがリリースされることを確認します
![API ES](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/10_API_Explorer_ES_Delete_05.png "ES 05")

# 3.コマンドラインからAPIを呼び出す

OpenAPI Explorerには、クラウドコマンドツールCloudShellが組み込まれています。Cloud Shellは、Alibaba Cloud CLIに基づくWebベースのCLIツールです。AccessKeyを構成する必要はなく、ログイン後に使用できます。
AlibabaCloudのプログラムのAPIはRPCとRESTful二つのタイプがあります。多くのプロダクトはRPCAPIが提供されている。例えば、ECS、VPC、RDSなど。
異なるタイプのAPIの呼び出しメソッドも異なります。 APIタイプは、次の特性で判断できます。

①Actionフィールドを含むAPIパラメーターはRPCAPIであり、PathPatternパラメーターはRESTfulAPIです。
②一般的に、一つのプロダクトではAPIタイプが同じです

1）コマンドラインを起動します
①AlibabaCloudホームページにログインし、[OpenAPIExplorer](https://api.alibabacloud.com/#/)を開く。

![API homepage](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/11_api_hp.png "API homepage ")

②「Online Linux Shell」メニューをクリックします
![CloudShell　CLI open](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/12_cli_open.png "CLI open ")

③CloudShellのコマンドラインが接続される
![CloudShell　CLI connection](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/13_cli_connection.png "CLI connection ")
1）CloudShellでCLIを通してRPCAPIを呼び出す

コマンドフォーマット：
```
aliyun <ProductCode> <ActionName> [--parameter1 value1 --paramter2 value2]
```
④CLIバージョンを確認します
![CloudShell　CLI version](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/14_cli_version.png "CLI version ")

⑤CLI構成を確認します
CloudShellでCLIを使用する際に、新たな構成はいらず、CLIが使用できます
デフォルトは一時的なAKで、デフォルトリージョンはap-southeast-1シンガポールリージョンです
```
aliyun configure list
```
![CloudShell　CLI config　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/15_cli_config.png "CLI config ")
## 3-1.コマンドラインからRPC APIを呼び出す
2）VPCを作成します
```
aliyun vpc CreateVpc --VpcName "cloudshell_cli-test"
```
```
shell@Alicloud:~$ aliyun vpc CreateVpc --VpcName "cloudshell_cli-test"
{
        "RequestId": "27D74968-E5E5-465A-A97C-17881C674E46",
        "ResourceGroupId": "rg-acfnu655g4vjkyi",
        "RouteTableId": "vtb-6weikuqo04bc56lomyefz",
        "VRouterId": "vrt-6we9cnaqw9u4sdgxdmefy",
        "VpcId": "vpc-6weg263b43uhqoa2byoil"
}
shell@Alicloud:~$ 
```
 ![vpc create　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/16_cli_vpc_create.png "vpc create 01")

![vpc create　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/17_cli_vpc_create.png "vpc create 02")

3）VPCを確認します
```
aliyun vpc DescribeVpcs --VpcId vpc-6weg263b43uhqoa2byoil
```
 ![vpc describe](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/18_cli_vpc_describe.png "vpc describe")

## 3-2.コマンドラインからRESTful APIを呼び出す

コマンドフォーマット：
```
aliyun Productcode [GET|PUT|POST|DELETE] <PathPattern> --body "$(cat input.json)"
```

1）ElasticSearchのインスタンスを作成します
リクエストコマンド
```
aliyun elasticsearch POST /openapi/instances --header "Content-Type=application/json;" --body "{\"paymentType\":\"postpaid\",\"nodeAmount\":\"2\",\"instanceCategory\":\"x-pack\",\"esAdminPassword\":\"es_password1\",\"esVersion\":\"6.7\",\"nodeSpec\":{\"spec\":\"elasticsearch.sn1ne.large\",\"disk\":\"20\",\"diskType\":\"cloud_ssd\"},\"networkConfig\":{\"type\":\"vpc\",\"vpcId\":\"vpc-6we6gahp387ucs4cyi1mg\",\"vsArea\":\"ap-northeast-1a\",\"vswitchId\":\"vsw-6we2znwytf5fylhpe3z95\"}}"
```
実行コマンド
```
shell@Alicloud:~$ aliyun elasticsearch POST /openapi/instances --header "Content-Type=application/json;" --body "{\"paymentType\":\"postpaid\",\"nodeAmount\":\"2\",\"instanceCategory\":\"x-pack\",\"esAdminPassword\":\"es_password1\",\"esVersion\":\"6.7\",\"nodeSpec\":{\"spec\":\"elasticsearch.sn1ne.large\",\"disk\":\"20\",\"diskType\":\"cloud_ssd\"},\"networkConfig\":{\"type\":\"vpc\",\"vpcId\":\"vpc-6we6gahp387ucs4cyi1mg\",\"vsArea\":\"ap-northeast-1a\",\"vswitchId\":\"vsw-6we2znwytf5fylhpe3z95\"}}"
{
        "RequestId": "AEAF7D5D-60DC-4282-B3C3-28447777A5CE",
        "Result": {
                "instanceId": "es-sg-05svh743x0i5e83ug"
        }
}
shell@Alicloud:~$ 
```

![es create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/20_cli_es_create_01.png "es create 01")

![es create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/20_cli_es_create_02.png "es create 02")

![es create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/20_cli_es_create_03.png "es create 03")

![es create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/20_cli_es_create_04.png "es create 04")

2）ElasticSearchのインスタンスを確認します

```
aliyun elasticsearch GET /openapi/instances/es-sg-05svh743x0i5e83ug
```
![es describe](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/20_cli_es_get_01.png "es describe 01")

![es describe](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/20_cli_es_get_02.png "es describe 02")

![es describe](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/20_cli_es_get_03.png "es describe 03")


3）ElasticSearchインスタンスを削除します
```
aliyun elasticsearch DELETE /openapi/instances/es-sg-05svh743x0i5e83ug
```
上記のAPIを実行します
![es delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/21_cli_es_delete_01.png "es delete 01")

![es delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/21_cli_es_delete_02.png "es delete 02")

![es delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/21_cli_es_delete_03.png "es delete 03")

ESインスタンスが削除されました
![es delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/21_cli_es_delete_04.png "es delete 04")


# 4.APIを呼び出すSDKコードサンプル

SDKガイドリンク
|SDK言語|ガイドリンク|SDKサンプルコードのデバッグ|
|--|--|--|
|Java |[Java SDK Guideリンク](https://www.alibabacloud.com/cloud-tech/doc-detail/52740.htm)|Y|
|Node.js |[Node.jsSDK Guideリンク](https://www.alibabacloud.com/cloud-tech/doc-detail/57342.htm)|Y|
|Go |[Go SDK Guideリンク](https://www.alibabacloud.com/cloud-tech/doc-detail/63640.htm)|Y|
|PHP |[PHP SDK Guideリンク](https://www.alibabacloud.com/cloud-tech/doc-detail/53111.htm)|N|
|Python |[Python SDK Guideリンク](https://www.alibabacloud.com/cloud-tech/doc-detail/53090.htm)|Y|
|.Net |[.Net SDK Guideリンク](https://www.alibabacloud.com/cloud-tech/doc-detail/66509.htm)|N|
|Ruby |[Ruby SDK Guideリンク](https://github.com/aliyun/openapi-core-ruby-sdk/blob/master/README.md)|N|

## 4-1.RPC APIのSDK例

OpenAPI Explorerは、入力したAPIリクエスト情報に基づいて、Java、Python、PHP、Node.jsなどの言語でSDK呼び出しの例を自動的に生成できます
1）RPC APIのSDK例
CreateVpcのAPIパラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|CidrBlock|172.16.0.0/12|Y|
|Ipv6CidrBlock|なし|N|
|EnableIpv6|なし|N|
|VpcName|sdk_vpc|N| 
|Description|from openAPI sdk|N|
|ResourceGroupId|なし|N|
|DryRun|なし|N|
|UserCidr|なし|N|
|ClientToken|なし|N|
|Ipv6Isp|なし|N|
```
aliyun vpc CreateVpc --region ap-northeast-1 --RegionId ap-northeast-1 --CidrBlock 172.16.0.0 --VpcName sdk_vpc --Description from openAPI sdk
```
2）VPCのCreateVpcのJava例：
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/22_Java_SDK_VPC.png "VPC create 01")

```JavaSDK-CreateVpc
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.google.gson.Gson;
import java.util.*;
import com.aliyuncs.vpc.model.v20160428.*;

public class CreateVpc {

    public static void main(String[] args) {
        DefaultProfile profile = DefaultProfile.getProfile("ap-northeast-1", "<accessKeyId>", "<accessSecret>");
        IAcsClient client = new DefaultAcsClient(profile);

        CreateVpcRequest request = new CreateVpcRequest();
        request.setRegionId("ap-northeast-1");
        request.setCidrBlock("172.16.0.0/12");
        request.setVpcName("sdk_vpc");
        request.setDescription("from openAPI sdk");

        try {
            CreateVpcResponse response = client.getAcsResponse(request);
            System.out.println(new Gson().toJson(response));
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            System.out.println("ErrCode:" + e.getErrCode());
            System.out.println("ErrMsg:" + e.getErrMsg());
            System.out.println("RequestId:" + e.getRequestId());
        }

    }
}

```

3）VPCのCreateVpcのNode.js例：
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/23_Node_SDK_VPC.png "VPC create Node.js SDK")
```Node.jsSDK-CreateVpc
const Core = require('@alicloud/pop-core');

var client = new Core({
  accessKeyId: '<accessKeyId>',
  accessKeySecret: '<accessSecret>',
  endpoint: 'https://vpc.ap-northeast-1.aliyuncs.com',
  apiVersion: '2016-04-28'
});

var params = {
  "RegionId": "ap-northeast-1",
  "CidrBlock": "172.16.0.0/12",
  "VpcName": "sdk_vpc",
  "Description": "from openAPI sdk"
}

var requestOption = {
  method: 'POST'
};

client.request('CreateVpc', params, requestOption).then((result) => {
  console.log(JSON.stringify(result));
}, (ex) => {
  console.log(ex);
})

```

4）VPCのCreateVpcのGo例：
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/24_Go_SDK_VPC.png "VPC create Go SDK")
```GoSDK-CreateVpc
package main

import (
	"fmt"
  	"github.com/aliyun/alibaba-cloud-sdk-go/services/vpc"
  
)

func main() {
	client, err := vpc.NewClientWithAccessKey("ap-northeast-1", "<accessKeyId>", "<accessSecret>")

	request := vpc.CreateCreateVpcRequest()
	request.Scheme = "https"

  request.CidrBlock = "172.16.0.0/12"
  request.VpcName = "sdk_vpc"
  request.Description = "from openAPI sdk"

	response, err := client.CreateVpc(request)
	if err != nil {
		fmt.Print(err.Error())
	}
	fmt.Printf("response is %#v\n", response)
}

```

5）VPCのCreateVpcのPHP例：
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/25_PHP_SDK_VPC.png "VPC create PHP SDK")

```PHPSDK-CreateVpc
<?php
use AlibabaCloud\Client\AlibabaCloud;
use AlibabaCloud\Client\Exception\ClientException;
use AlibabaCloud\Client\Exception\ServerException;

// Download：https://github.com/aliyun/openapi-sdk-php
// Usage：https://github.com/aliyun/openapi-sdk-php/blob/master/README.md

AlibabaCloud::accessKeyClient('<accessKeyId>', '<accessSecret>')
                        ->regionId('ap-northeast-1')
                        ->asDefaultClient();

try {
    $result = AlibabaCloud::rpc()
                          ->product('Vpc')
                          // ->scheme('https') // https | http
                          ->version('2016-04-28')
                          ->action('CreateVpc')
                          ->method('POST')
                          ->host('vpc.ap-northeast-1.aliyuncs.com')
                          ->options([
                                        'query' => [
                                          'RegionId' => "ap-northeast-1",
                                          'CidrBlock' => "172.16.0.0/12",
                                          'VpcName' => "sdk_vpc",
                                          'Description' => "from openAPI sdk",
                                        ],
                                    ])
                          ->request();
    print_r($result->toArray());
} catch (ClientException $e) {
    echo $e->getErrorMessage() . PHP_EOL;
} catch (ServerException $e) {
    echo $e->getErrorMessage() . PHP_EOL;
}

```

6）VPCのCreateVpcのPython例：
①PythonSDKを確認します
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/26_Python_SDK_VPC.png "VPC create Python SDK")

```PythonSDK-CreateVpc
#!/usr/bin/env python
#coding=utf-8

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkvpc.request.v20160428.CreateVpcRequest import CreateVpcRequest

client = AcsClient('<accessKeyId>', '<accessSecret>', 'ap-northeast-1')

request = CreateVpcRequest()
request.set_accept_format('json')

request.set_CidrBlock("172.16.0.0/12")
request.set_VpcName("sdk_vpc")
request.set_Description("from openAPI sdk")

response = client.do_action_with_exception(request)
# python2:  print(response) 
print(str(response, encoding='utf-8'))

```
②PythonSDKファイルを保存して実行検証
・CloudShellでPythonSDKのCreateVpcのSDKコード例をアップロードし、CreateVpcAPIのAK情報を設定する。
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/26_Python_SDK_VPC_01.png "VPC create Python SDK 01")

・PythonSDKのCreateVpcのSDKコード例を実行します
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/26_Python_SDK_VPC_02.png "VPC create Python SDK 02")

・VPCを確認します
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/26_Python_SDK_VPC_03.png "VPC create Python SDK 03")

③「Debug in Linux Shell」からコードの実行（初回起動する際に、Python実行環境が準備される）
（「Debug in Linux Shell」機能はJava、Node.js、Go、Pythonのみが対応している）
・パラメータを入力し、「Debug in Linux Shell」ボタンをクリックします
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/26_Python_SDK_VPC_04.png "VPC create Python SDK 01")

・CloudShellでpythonコマンドが自動的に準備される
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/26_Python_SDK_VPC_05.png "VPC create Python SDK 02")
```
shell@Alicloud:~/alibabacloud_sdk_demo/vpc/Vc7ahEqrn/python$ python ./CreateVpc.py
{"VRouterId":"vrt-6we1zqd8ub2fxhzgitkjh","RouteTableId":"vtb-6wec5t9o38jyvtu9jh5xa","RequestId":"14A8EB08-E0B1-4BB7-8AD1-8A5A438AB5A2","VpcId":"vpc-6wexjhrqkle1uow3ds1fg","ResourceGroupId":"rg-acfnu655g4vjkyi"}
shell@Alicloud:~/alibabacloud_sdk_demo/vpc/Vc7ahEqrn/python$ 
```

・「python ./CreateVpc.py」を実行します
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/26_Python_SDK_VPC_06.png "VPC create Python SDK 06")

・VPCを確認します
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/26_Python_SDK_VPC_07.png "VPC create Python SDK 07")

7）VPCのCreateVpcの.Net例：
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/27_Net_SDK_VPC.png "VPC create .Net SDK")
```.NetSDK-CreateVpc
using System;
using System.Collections.Generic;
using Aliyun.Acs.Core;
using Aliyun.Acs.Core.Exceptions;
using Aliyun.Acs.Core.Profile;
using Aliyun.Acs.Vpc.Model.V20160428;

namespace VpcDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            IClientProfile profile = DefaultProfile.GetProfile("ap-northeast-1", "<accessKeyId>", "<accessSecret>");
            DefaultAcsClient client = new DefaultAcsClient(profile);

            var request = new CreateVpcRequest();
            request.CidrBlock = "172.16.0.0/12";
            request.VpcName = "sdk_vpc";
            request.Description = "from openAPI sdk";
            try {
                var response = client.GetAcsResponse(request);
                Console.WriteLine(System.Text.Encoding.Default.GetString(response.HttpResponse.Content));
            }
            catch (ServerException e)
            {
                Console.WriteLine(e);
            }
            catch (ClientException e)
            {
                Console.WriteLine(e);
            }
        }
    }
}
```

8）VPCのCreateVpcのRuby例：
![API VPC create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/28_Ruby_SDK_VPC.png "VPC create Ruby SDK")
```RubySDK-CreateVpc
# gem install aliyunsdkcore

require 'aliyunsdkcore'

client = RPCClient.new(
  access_key_id:     '<accessKeyId>',
  access_key_secret: '<accessSecret>',
  endpoint: 'https://vpc.ap-northeast-1.aliyuncs.com',
  api_version: '2016-04-28'
)

response = client.request(
  action: 'CreateVpc',
  params: {
    "RegionId": "ap-northeast-1",
    "CidrBlock": "172.16.0.0/12",
    "VpcName": "sdk_vpc",
    "Description": "from openAPI sdk"
},
  opts: {
    method: 'POST'
  }
)

print response
```

## 4-2.RESTful APIのSDK例

1）RESTful APIのSDK例
ElasticSearchのcreateInstanceパラメータ設定
パラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|clientToken|なし|Y|
|RequestBody|{"paymentType": "postpaid", "nodeAmount": "2", "instanceCategory": "x-pack", "esAdminPassword": "es_password1", "esVersion": "6.7", "nodeSpec": { "spec": "elasticsearch.sn1ne.large", "disk": "20", "diskType": "cloud_ssd" }, "networkConfig": { "type": "vpc", "vpcId": "vpc-6we6gahp387ucs4cyi1mg", "vsArea": "ap-northeast-1a", "vswitchId": "vsw-6we2znwytf5fylhpe3z95" }} |Y|

リクエスト：
```
aliyun elasticsearch POST /openapi/instances --header "Content-Type=application/json;" --body "{\"paymentType\":\"postpaid\",\"nodeAmount\":\"2\",\"instanceCategory\":\"x-pack\",\"esAdminPassword\":\"es_password1\",\"esVersion\":\"6.7\",\"nodeSpec\":{\"spec\":\"elasticsearch.sn1ne.large\",\"disk\":\"20\",\"diskType\":\"cloud_ssd\"},\"networkConfig\":{\"type\":\"vpc\",\"vpcId\":\"vpc-6we6gahp387ucs4cyi1mg\",\"vsArea\":\"ap-northeast-1a\",\"vswitchId\":\"vsw-6we2znwytf5fylhpe3z95\"}}"

```
2）ESのcreateInstanceのJava例：

![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/29_Java_SDK_ES.png "ES create 01")

```JavaSDK-createInstance
import com.aliyuncs.CommonRequest;
import com.aliyuncs.CommonResponse;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.http.FormatType;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.profile.DefaultProfile;
/*
pom.xml
<dependency>
  <groupId>com.aliyun</groupId>
  <artifactId>aliyun-java-sdk-core</artifactId>
  <version>4.0.3</version>
</dependency>
*/
public class createInstance {
    public static void main(String[] args) {
        DefaultProfile profile = DefaultProfile.getProfile("ap-northeast-1", "<accessKeyId>", "<accessSecret>");
        IAcsClient client = new DefaultAcsClient(profile);

        CommonRequest request = new CommonRequest();
        //request.setProtocol(ProtocolType.HTTPS);
        request.setMethod(MethodType.POST);
        request.setDomain("elasticsearch.ap-northeast-1.aliyuncs.com");
        request.setVersion("2017-06-13");
        request.setUriPattern("/openapi/instances");

        request.putHeadParameter("Content-Type", "application/json");
        String requestBody = "" +
                "{
" +
                "    \"paymentType\": \"postpaid\",
" +
                "    \"nodeAmount\": \"2\",
" +
                "    \"instanceCategory\": \"x-pack\",
" +
                "    \"esAdminPassword\": \"es_password1\",
" +
                "    \"esVersion\": \"6.7\",
" +
                "    \"nodeSpec\": {
" +
                "        \"spec\": \"elasticsearch.sn1ne.large\",
" +
                "        \"disk\": \"20\",
" +
                "        \"diskType\": \"cloud_ssd\"
" +
                "    },
" +
                "    \"networkConfig\": {
" +
                "        \"type\": \"vpc\",
" +
                "        \"vpcId\": \"vpc-6we6gahp387ucs4cyi1mg\",
" +
                "        \"vsArea\": \"ap-northeast-1a\",
" +
                "        \"vswitchId\": \"vsw-6we2znwytf5fylhpe3z95\"
" +
                "    }
" +
                "}";
        request.setHttpContent(requestBody.getBytes(), "utf-8", FormatType.JSON);
        try {
            CommonResponse response = client.getCommonResponse(request);
            System.out.println(response.getData());
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }
}

```
3）ESのcreateInstanceのNode.js例：
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/30_Node_SDK_ES.png "ES create Node.js SDK")

```Node.jsSDK-createInstance
var ROAClient = require('@alicloud/pop-core').ROAClient;

var client = new ROAClient({
  accessKeyId: '<accessKeyId>',
  accessKeySecret: '<accessSecret>',
  endpoint: 'https://elasticsearch.ap-northeast-1.aliyuncs.com',
  apiVersion: '2017-06-13'
});

var httpMethod = 'POST';
var uriPath = '/openapi/instances';
var queries = {};
var body = `{
    "paymentType": "postpaid",
    "nodeAmount": "2",
    "instanceCategory": "x-pack",
    "esAdminPassword": "es_password1",
    "esVersion": "6.7",
    "nodeSpec": {
        "spec": "elasticsearch.sn1ne.large",
        "disk": "20",
        "diskType": "cloud_ssd"
    },
    "networkConfig": {
        "type": "vpc",
        "vpcId": "vpc-6we6gahp387ucs4cyi1mg",
        "vsArea": "ap-northeast-1a",
        "vswitchId": "vsw-6we2znwytf5fylhpe3z95"
    }
}`;
var headers = {
  "Content-Type": "application/json"
};
var requestOption = {};

client.request(httpMethod, uriPath, queries, body, headers, requestOption).then((res) => {
  console.log(res);
}, (err) => {
  console.log(err);
})

```

4）ESのcreateInstanceのGo例：
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/31_Go_SDK_ES.png "ES create Go SDK")

```GoSDK-createInstance
package main

import (
	"fmt"
	"github.com/aliyun/alibaba-cloud-sdk-go/sdk"
	"github.com/aliyun/alibaba-cloud-sdk-go/sdk/requests"
)

func main() {
	client, err := sdk.NewClientWithAccessKey("ap-northeast-1", "<accessKeyId>", "<accessSecret>")
	if err != nil {
		panic(err)
	}

	request := requests.NewCommonRequest()
	request.Method = "POST"
	request.Scheme = "https" // https | http
	request.Domain = "elasticsearch.ap-northeast-1.aliyuncs.com"
	request.Version = "2017-06-13"
	request.PathPattern = "/openapi/instances"
  request.Headers["Content-Type"] = "application/json"

	body := `{
    "paymentType": "postpaid",
    "nodeAmount": "2",
    "instanceCategory": "x-pack",
    "esAdminPassword": "es_password1",
    "esVersion": "6.7",
    "nodeSpec": {
        "spec": "elasticsearch.sn1ne.large",
        "disk": "20",
        "diskType": "cloud_ssd"
    },
    "networkConfig": {
        "type": "vpc",
        "vpcId": "vpc-6we6gahp387ucs4cyi1mg",
        "vsArea": "ap-northeast-1a",
        "vswitchId": "vsw-6we2znwytf5fylhpe3z95"
    }
}`
	request.Content = []byte(body)
	
	response, err := client.ProcessCommonRequest(request)
	if err != nil {
		panic(err)
	}
	fmt.Print(response.GetHttpContentString())
}

```
5）VPCのcreateInstanceのPHP例：
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/32_PHP_SDK_ES.png "ES create PHP SDK")

```PHPSDK-createInstance
<?php
use AlibabaCloud\Client\AlibabaCloud;
use AlibabaCloud\Client\Exception\ClientException;
use AlibabaCloud\Client\Exception\ServerException;

// Download：https://github.com/aliyun/openapi-sdk-php
// Usage：https://github.com/aliyun/openapi-sdk-php/blob/master/README.md

AlibabaCloud::accessKeyClient('<accessKeyId>', '<accessSecret>')
                        ->regionId('ap-northeast-1')
                        ->asDefaultClient();

try {
    $result = AlibabaCloud::roa()
                          ->product('elasticsearch')
                          // ->scheme('https') // https | http
                          ->version('2017-06-13')
                          ->pathPattern('/openapi/instances')
                          ->method('POST')
                          ->options([
                                        'query' => [

                                        ],
                                    ])
                          ->body('{
    "paymentType": "postpaid",
    "nodeAmount": "2",
    "instanceCategory": "x-pack",
    "esAdminPassword": "es_password1",
    "esVersion": "6.7",
    "nodeSpec": {
        "spec": "elasticsearch.sn1ne.large",
        "disk": "20",
        "diskType": "cloud_ssd"
    },
    "networkConfig": {
        "type": "vpc",
        "vpcId": "vpc-6we6gahp387ucs4cyi1mg",
        "vsArea": "ap-northeast-1a",
        "vswitchId": "vsw-6we2znwytf5fylhpe3z95"
    }
}')
                          ->request();
    print_r($result->toArray());
} catch (ClientException $e) {
    echo $e->getErrorMessage() . PHP_EOL;
} catch (ServerException $e) {
    echo $e->getErrorMessage() . PHP_EOL;
}
```
6）ESのcreateInstanceのPython例：
①PythonSDKを確認します
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/33_Python_SDK_ES.png "ES create Python SDK")

```PythonSDK-createInstance
#!/usr/bin/env python
#coding=utf-8

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
client = AcsClient('<accessKeyId>', '<accessSecret>', 'ap-northeast-1')

request = CommonRequest()
request.set_accept_format('json')
request.set_method('POST')
request.set_protocol_type('https') # https | http
request.set_domain('elasticsearch.ap-northeast-1.aliyuncs.com')
request.set_version('2017-06-13')

request.add_header('Content-Type', 'application/json')
request.set_uri_pattern('/openapi/instances')
body = '''{
    "paymentType": "postpaid",
    "nodeAmount": "2",
    "instanceCategory": "x-pack",
    "esAdminPassword": "es_password1",
    "esVersion": "6.7",
    "nodeSpec": {
        "spec": "elasticsearch.sn1ne.large",
        "disk": "20",
        "diskType": "cloud_ssd"
    },
    "networkConfig": {
        "type": "vpc",
        "vpcId": "vpc-6we6gahp387ucs4cyi1mg",
        "vsArea": "ap-northeast-1a",
        "vswitchId": "vsw-6we2znwytf5fylhpe3z95"
    }
}'''
request.set_content(body.encode('utf-8'))

response = client.do_action_with_exception(request)

# python2:  print(response) 
print(str(response, encoding = 'utf-8'))
```
②PythonSDKファイルを保存して実行検証
・CloudShellでPythonSDKのCreateInstanceのSDKコード例をアップロードし、CreateInstanceのAK情報を設定する。
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/33_Python_SDK_ES_01.png "ES create Python SDK 01")

・PythonSDKのCreateInstanceのSDKコード例を実行します
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/33_Python_SDK_ES_02.png "ES create Python SDK 02")

・ElasticSearchインスタンスを確認します
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/33_Python_SDK_ES_03.png "ES create Python SDK 03")

・ElasticSearchのステータスを確認します
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/33_Python_SDK_ES_04.png "ES create Python SDK 04")

③「Debug in Linux Shell」からコードの実行（初回起動する際に、Python実行環境が準備される）
（「Debug in Linux Shell」機能はJava、Node.js、Go、Pythonのみが対応している）
・パラメータを入力し、「Debug in Linux Shell」ボタンをクリックします
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/33_Python_SDK_ES_05.png "ES create Python SDK 05")

・CloudShellでpythonコマンドが自動的に準備される
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/33_Python_SDK_ES_06.png "ES create Python SDK 06")


・「python ./createInstance.py」を実行します
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/33_Python_SDK_ES_07.png "ES create Python SDK 07")

```
shell@Alicloud:~/alibabacloud_sdk_demo/elasticsearch/FnctqZMHX/python$ python ./createInstance.py
{"Result":{"instanceId":"es-sg-e01d8odb5d2zl72bm"},"RequestId":"63246A58-5747-41CE-9A65-D0ADBD672C4F"}
shell@Alicloud:~/alibabacloud_sdk_demo/elasticsearch/FnctqZMHX/python$ 
```
・ElasticSearchのインスタンスを確認します
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/33_Python_SDK_ES_08.png "ES create Python SDK 08")

・ElasticSearchのステータスを確認します
![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/33_Python_SDK_ES_09.png "ES create Python SDK 09")

7）ESのcreateInstanceの.Net例：

![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/34_Net_SDK_ES.png "ES create .Net SDK")

```.NetSDK-createInstance
using System;
using System.Collections.Generic;
using Aliyun.Acs.Core;
using Aliyun.Acs.Core.Profile;
using Aliyun.Acs.Core.Exceptions;
using Aliyun.Acs.Core.Http;

namespace CommonRequestDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            IClientProfile profile = DefaultProfile.GetProfile("ap-northeast-1", "<accessKeyId>", "<accessSecret>");
            DefaultAcsClient client = new DefaultAcsClient(profile);
            CommonRequest request = new CommonRequest();
            request.Method = MethodType.POST;
            request.Domain = "elasticsearch.ap-northeast-1.aliyuncs.com";
            request.Version = "2017-06-13";
            request.UriPattern = "/openapi/instances";
            // request.Protocol = ProtocolType.HTTP;

                request.AddHeadParameters("Content-Type", "application/json");
            string requestBody = "" +
                "{
" +
                "    \"paymentType\": \"postpaid\",
" +
                "    \"nodeAmount\": \"2\",
" +
                "    \"instanceCategory\": \"x-pack\",
" +
                "    \"esAdminPassword\": \"es_password1\",
" +
                "    \"esVersion\": \"6.7\",
" +
                "    \"nodeSpec\": {
" +
                "        \"spec\": \"elasticsearch.sn1ne.large\",
" +
                "        \"disk\": \"20\",
" +
                "        \"diskType\": \"cloud_ssd\"
" +
                "    },
" +
                "    \"networkConfig\": {
" +
                "        \"type\": \"vpc\",
" +
                "        \"vpcId\": \"vpc-6we6gahp387ucs4cyi1mg\",
" +
                "        \"vsArea\": \"ap-northeast-1a\",
" +
                "        \"vswitchId\": \"vsw-6we2znwytf5fylhpe3z95\"
" +
                "    }
" +
                "}";
            request.SetContent(System.Text.Encoding.Default.GetBytes(requestBody), "utf-8", FormatType.JSON);

            try {
                CommonResponse response = client.GetCommonResponse(request);
                Console.WriteLine(response.Data);
            }
            catch (ServerException e)
            {
                Console.WriteLine(e);
            }
            catch (ClientException e)
            {
                Console.WriteLine(e);
            }
        }
    }
}

```

8）ESのcreateInstanceのRuby例：

![API ES create](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/35_Ruby_SDK_ES.png "ES create Ruby SDK")

```RubySDK-createInstance
# gem install aliyunsdkcore

require 'aliyunsdkcore'

client = ROAClient.new(
  access_key_id: '<accessKeyId>',
  access_key_secret: '<accessSecret>',
  endpoint: 'https://elasticsearch.ap-northeast-1.aliyuncs.com',
  api_version: '2017-06-13'
)

response = client.request(
  method: 'POST',
  uri: '/openapi/instances',
  queries: {},
  headers: {
    "Content-Type": "application/json"
},
  body: `{
    "paymentType": "postpaid",
    "nodeAmount": "2",
    "instanceCategory": "x-pack",
    "esAdminPassword": "es_password1",
    "esVersion": "6.7",
    "nodeSpec": {
        "spec": "elasticsearch.sn1ne.large",
        "disk": "20",
        "diskType": "cloud_ssd"
    },
    "networkConfig": {
        "type": "vpc",
        "vpcId": "vpc-6we6gahp387ucs4cyi1mg",
        "vsArea": "ap-northeast-1a",
        "vswitchId": "vsw-6we2znwytf5fylhpe3z95"
    }
}`,
  options: {}
)

print response

```
# 5.Mockデータの確認
## 5-1.RPC APIのMockデータ
①CreateVpcのパラメータを設定します
パラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|CidrBlock|172.16.0.0/12|Y|
|Ipv6CidrBlock|なし|N|
|EnableIpv6|なし|N|
|VpcName|openAPI_vpc|N| 
|Description|from openAPI|N|
|ResourceGroupId|なし|N|
|DryRun|なし|N|
|UserCidr|なし|N|
|ClientToken|なし|N|
|Ipv6Isp|なし|N|

![Python VPC mock](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/36_Python_SDK_VPC_01.png "VPC Python mock 01 ")

Request:
```
aliyun vpc CreateVpc --region ap-northeast-1 --RegionId ap-northeast-1 --CidrBlock 172.16.0.0/12 --VpcName openAPI_vpc --Description from openAPI
```
②MockCodeを確認します

```
{
	"ResourceGroupId": "rg-acfmxazb4ph6aiy",
	"RequestId": "8B2F5262-6B57-43F2-97C4-971425462DFE",
	"RouteTableId": "vtb-bp1krxxzp0c29fmontbal",
	"VRouterId": "vrt-bp1jcg5cmxjbl9xgc58bw",
	"VpcId": "vpc-bp1qpo0kug3a20qqe9h7v"
}
```

![Python VPC mock](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/36_Python_SDK_VPC_02.png "VPC Python mock 02 ")

## 5-2.RESTful APIのMockデータ

①createInstanceパラメータ設定
パラメータ記入例：
|パラメータ|値|必須項目|
|--|--|--|
|RegionId|Japan(Tokyo)|Y|
|clientToken|なし|Y|
|RequestBody|{"paymentType": "postpaid", "nodeAmount": "2", "instanceCategory": "x-pack", "esAdminPassword": "es_password1", "esVersion": "6.7", "nodeSpec": { "spec": "elasticsearch.sn1ne.large", "disk": "20", "diskType": "cloud_ssd" }, "networkConfig": { "type": "vpc", "vpcId": "vpc-6we6gahp387ucs4cyi1mg", "vsArea": "ap-northeast-1a", "vswitchId": "vsw-6we2znwytf5fylhpe3z95" }} |Y|

![Python ES mock](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/37_Python_SDK_ES_01.png "ES Python mock 01 ")

Request:
```
aliyun elasticsearch POST /openapi/instances --header "Content-Type=application/json;" --body "{\"paymentType\":\"postpaid\",\"nodeAmount\":\"2\",\"instanceCategory\":\"x-pack\",\"esAdminPassword\":\"es_password1\",\"esVersion\":\"6.7\",\"nodeSpec\":{\"spec\":\"elasticsearch.sn1ne.large\",\"disk\":\"20\",\"diskType\":\"cloud_ssd\"},\"networkConfig\":{\"type\":\"vpc\",\"vpcId\":\"vpc-6we6gahp387ucs4cyi1mg\",\"vsArea\":\"ap-northeast-1a\",\"vswitchId\":\"vsw-6we2znwytf5fylhpe3z95\"}}"
```

②MockCodeを確認します

```PythonMockCode-ES-createInstance
{
	"Result": {
		"instanceId": "es-cn-abc",
		"domain": "es-cn-abc.elasticsearch.aliyuncs.com",
		"description": "test1",
		"nodeAmount": 2,
		"paymentType": "postpaid",
		"paymentInfo": null,
		"status": null,
		"port": null,
		"esVersion": "5.5.3_with_X-Pack",
		"esConfig": null,
		"esIPWhitelist": null,
		"esIPBlacklist": null,
		"kibanaIPWhitelist": null,
		"publicIpWhitelist": null,
		"kibanaDomain": "es-cn-abc.kibana.elasticsearch.aliyuncs.com",
		"publicDomain": null,
		"enablePublic": false,
		"nodeSpec": {
			"spec": "elasticsearch.sn1ne.large",
			"disk": 20
		},
		"networkConfig": {
			"vpcId": "vpc-abc",
			"vswitchId": "vsw-def",
			"vsArea": "cn-hangzhou-b",
			"type": "vpc"
		},
		"createdAt": null,
		"updatedAt": null,
		"inited": false,
		"dedicateMaster": true,
		"commodityCode": null,
		"endTime": 0,
		"dictList": null
	},
	"RequestId": "8466BDFB-C513-4B8D-B4E3-5AB256AB0A05"
}
```

![Python ES mock](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_03/37_Python_SDK_ES_02.png "ES Python mock 02 ")


# 最後に
以上、OpenAPI Explorerについてをご紹介しました。APIを使った開発をする際、ご参考になれば幸いです。    




