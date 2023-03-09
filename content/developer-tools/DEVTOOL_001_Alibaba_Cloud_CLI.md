---
title: "Alibab Cloud CLI"
metaTitle: "Alibab Cloud CLIについて紹介します"
metaDescription: "Alibab Cloud ossutilについて紹介します"
date: "2021-06-25"
author: "Nancy"
thumbnail: "/developer-tools_images_01/29_docker_cli_config_01.png"
---


## Alibaba Cloud CLIの手順

本書は、Alibaba Cloud CLIの使用手順を記載します。

# 1.Alibaba Cloud CLIとは
Alibaba Cloud CLIは、Alibaba Cloud SDK forGoの上に構築されたオープンソースツールです。 このツールを使用すると、AlibabaCloudオープンAPIを呼び出すことでAlibabaCloud製品が管理できます。コマンドラインシェルでaliyunコマンドを使用して、Alibaba Cloudサービスとやり取ることもできます。

以下のような機能を提供します。

①クラウドリソース管理
Alibaba CloudCLIは、AlibabaCloudのオープンAPIに基づく管理ツールです。 コマンドラインから各クラウド製品APIを直接呼び出すことができ、コンソールにログインしなくてもクラウドリソースが管理および保守できます。

②マルチ製品の統合
ECS、RDS、SLBなどのAlibabaCloudインフラストラクチャ製品の機能を統合します。 同じコマンドラインですべてのAlibabaCloudプラットフォーム製品の構成と管理を完了して、マルチ製品統合が実現できます。

③マルチバージョンのOpenAPI互換
各製品各オープンAPIのバージョンと完全に互換性があります。 Alibaba Cloud CLIでコマンドを指定することで必要なバージョンを呼び出すことができ、バージョンを自由に切り替えることができます。これは便利で迅速です。

④複数のアカウントをサポート
複数のアカウントをサポートします。 1つのツールで異なるアカウントを定義し、異なる実行ポリシーをカスタマイズして、違うレベルのアクセス許可の要件を満たすことができます。


⑤複数の出力フォーマット:
表示または協同プログラミングを便利にするため、複数の出力フォーマットが提供されています。Jsonとtableのフォーマットをサポートしています。必要に応じて出力フォーマットを選択することができます

⑥オンラインヘルプ:
オンラインヘルプを提供します。helpコマンドで現在利用可能な操作とパラメータ情報を取得できます。

⑦複数システムサポート:
Windows、MacOS、Linux/UNIXなどのシステムを対応しています。
    
## 2-1.WindowsにAlibaba Cloud CLIをインストールします
1）Windows用パッケージをダウンロードします
下記のリンクからWindows用インストールパッケージをダウンロードします
①[aliyuncli 公式サイト](https://aliyuncli.alicdn.com/aliyun-cli-windows-latest-amd64.zip?spm=a2c4g.11186623.2.3.328338daKOVIQs&file=aliyun-cli-windows-latest-amd64.zip):このリンクからAlibabaCloudCLIの最新バージョンが直接ダウンロードできます
![windows version download](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/01_win_cli_download_01.png "cli download 01")
②[github](https://github.com/aliyun/aliyun-cli/releases?spm=a2c4g.11186623.2.4.328338daKOVIQs):git hub から必要なバージョンをダウンロードします
![windows version download](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/01_win_cli_download_02.png "cli download 02")

2）zipファイルを解凍し、aliyun.exeを確認します
 ![unzip cli](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/02_unzip_cli_01.png "unzip cli 01")

 ![unzip cli](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/02_unzip_cli_02.png "unzip cli 02")

3）環境変数を設定します
aliyun.exeファイルのディレクトリパスをPath環境変数に追加します
①my computerから右クリックメニューのプロパティを開く

 ![set path](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/03_set_path_01.png "set path 01")

②環境変数設定画面のユーザー変数に編集をクリックします
 ![set path](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/03_set_path_02.png "set path 02")

③aliyun.exeファイルのディレクトリパスを追加し、確認ボタンを二回クリックして設定を完了します
 ![set path](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/03_set_path_03.png "set path 03")

④CMDウィンドを開き、set pathコマンドを実行して、環境変数が正常に構成されていることを確認します

 ![set path](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/03_set_path_04.png "set path 04")

⑤CLIバージョンを確認します
 ![CLI vesrion](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/04_cli_version.png "CLI vesrion")


## 2-2.LinuxにAlibaba Cloud CLIをインストールします
1）LinuxのECSを準備します
①LinuxのECSを作成します
![Linux ecs](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/05_linux_ecs_01.png "Linux ecs 01")

②LinuxのECSを確認します
![Linux ecs](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/05_linux_ecs_02.png "Linux ecs 02")

③LinuxのECSに登録します
![Linux ecs](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/05_linux_ecs_03.png "Linux ecs 03")

2）Linux用パッケージをダウンロードします
下記のリンクからLinux用インストールパッケージをダウンロードします
①[aliyuncli 公式サイト](https://aliyuncli.alicdn.com/aliyun-cli-linux-latest-amd64.tgz?spm=a2c4g.11186623.2.3.5c0c5d40x2AvAO&file=aliyun-cli-linux-latest-amd64.tgz):このリンクからAlibabaCloudCLIの最新バージョンが直接ダウンロードできます

②[github](https://github.com/aliyun/aliyun-cli/releases?spm=a2c4g.11186623.2.4.5c0c5d40x2AvAO):git hub から必要なバージョンをダウンロードします
![Linux version download](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/06_linux_cli_download_link.png "cli download　")

③Linux用パッケージをダウンロードします
```
# mkdir aliyun
# ls
# cd aliyun
# wget https://github.com/aliyun/aliyun-cli/releases/download/v3.0.80/aliyun-cli-linux-3.0.80-amd64.tgz
# ll
```
![Linux version download](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/07_linux_cli_download.png "cli download　")

3）zipファイルを解凍し、aliyun.exeを確認します
```
# tar xzvf aliyun-cli-linux-3.0.80-amd64.tgz
```
 ![Linux version tar](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/08_linux_cli_tar.png "cli tar")
4）下記コマンドで環境変数設定、aliyunプログラムを/usr/local/binフォルダにコピーペーストします
```
# sudo cp aliyun /usr/local/bin
```
 ![set path](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/08_linux_set_path.png "set path")

5）CLIバージョンを確認します
```
# aliyun
```
 ![Linux version check](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/09_linux_cli_check.png "cli check")


## 2-3.macOSにAlibaba Cloud CLIをインストールします
1）下記のリンクからLinux用インストールパッケージをダウンロードします
①[aliyuncli 公式サイト](https://aliyuncli.alicdn.com/aliyun-cli-macosx-latest-amd64.tgz?spm=a2c4g.11186623.2.3.32292c6bXvGyxu&file=aliyun-cli-macosx-latest-amd64.tgz):このリンクからAlibabaCloudCLIの最新バージョンが直接ダウンロードできます

②[github](https://github.com/aliyun/aliyun-cli/releases?spm=a2c4g.11186623.2.4.32292c6bXvGyxu):git hub から必要なバージョンをダウンロードします
![macOS version download](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/09_macOS_cli_download_link.png "cli download　")

③macOS用パッケージをダウンロードします
・aliyun フォルダを作成します
・aliyuncli 公式サイトまたはgithubからaliyun-cli-macosx-3.0.80-amd64.tgzをダウンロードします
④下記コマンドでzipファイルを解凍します
```
# tar xzvf aliyun-cli-macosx-3.0.80-amd64.tgz
```
⑤下記コマンドで環境変数設定、aliyunプログラムを/usr/local/binフォルダにコピーペーストします
```
# sudo cp aliyun /usr/local/bin
```
⑥下記コマンドでCLIバージョンを確認します

```
# aliyun
```

# 3.Alibaba Cloud CLIを構成します

## 3-1.Alibaba Cloud CLI構成概要
・Alibaba Cloud CLIを使用する前に、Alibaba Cloudリソースを呼び出すために必要なクレデンシャル情報、リージョン、言語などを構成する必要があります。

・クレデンシャルタイプ
|検証方法|説明|インタラクティブな構成のクレデンシャル（速い）|非インタラクティブな構成のクレデンシャル|
|--|--|--|--|
|AK|AccessKey ID/Secretによるアクセス|[AccessKeyクレデンシャルの構成](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/121258.htm?spm=a2c63.p38356.879954.3.211f29a5qCNptp#section-5pj-p7j-06z)|[AccessKeyクレデンシャルの構成](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/121259.htm?spm=a2c63.p38356.879954.4.211f29a5qCNptp#section-hhx-jpx-95g)|
|StsToken|TS Tokenによるアクセス|[STS Tokenクレデンシャルの構成](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/121258.htm?spm=a2c63.p38356.879954.5.211f29a5qCNptp#section-bdk-377-tnm)|[STS Tokenクレデンシャルの構成](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/121259.htm?spm=a2c63.p38356.879954.6.211f29a5qCNptp#section-mek-l1j-xib)|
|RamRoleArn|RAM子アカウントのAssumeRole方式でアクセス|[RamRoleArnクレデンシャルの構成](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/121258.htm?spm=a2c63.p38356.879954.7.211f29a5qCNptp#section-h4x-fnh-5yj)|[RamRoleArnクレデンシャルの構成](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/121259.htm?spm=a2c63.p38356.879954.8.211f29a5qCNptp#section-uyo-8pk-uow)|
|EcsRamRole|ECSでEcsRamRoleによりシークレットフリーの検証でアクセス|[EcsRamRoleクレデンシャルの構成](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/121258.htm?spm=a2c63.p38356.879954.9.211f29a5qCNptp#section-pq4-04b-7an)|[EcsRamRoleクレデンシャルの構成](https://www.alibabacloud.com/cloud-tech/zh/doc-detail/121259.htm?spm=a2c63.p38356.879954.10.211f29a5qCNptp#section-874-dbh-9k0)|

## 3-2.Alibaba Cloud CLIを構成します
本書はWindowsバージョンのインタラクティブな構成を紹介します。

1）CMDを開く、CLIのバージョンを確認します
```
aliyun version
```

2）CLI構成をします
①下記コマンドで構成します
```
aliyun configure --mode <AuthenticateMode> --profile <profileName>
```
--profile：構成名を指定する。指定の構成が存在する場合、構成を編集する。存在しない場合、構成を作成します
--mode：クレデンシャルタイプを指定する。AK、StsToken、RamRoleArnとEcsRamRoleいずれかを指定する。
インタラクティブな構成中にAccesskey、RegionIdなどを正しく設定してください。
```
aliyun configure --mode AK --profile profilewin
```
②AKを設定します
![CLI config](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/10_windows_cli_config_01.png "CLI config 01")

③リージョンを設定する(output フォーマットと言語を設定する)
[リージョンID](https://help.aliyun.com/document_detail/40654.html?spm=a2c63.p38356.879954.4.6eb1f86bcXCKCG):リージョンIDはこのリンクをご参照ください
![CLI config](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/10_windows_cli_config_02.png "CLI config 02")

④構成リストを確認します
```
aliyun configure list
```
![CLI config list](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/11_cli_config_list.png "CLI config list ")

⑤構成情報を確認します
・構成名を指定しないコマンド
```
aliyun configure get
```
 ![CLI config view](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/12_cli_config_view_01.png "CLI config view 01 ")

・構成名を指定するコマンド
```
aliyun configure get --profile profilewin
```
 ![CLI config view](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/12_cli_config_view_02.png "CLI config view 02 ")

⑥profilewin構成を削除するコマンド

```
aliyun configure delete --profile profilewin
```
3）コマンドオートコンプリート機能
Alibaba Cloud CLIを使用する場合、zsh / bashのコマンドオートコンプリートを有効または無効にできます
今zsh/bashのみがサポートします
①コマンドオートコンプリート機能を有効します
```
aliyun auto-completion
```

②コマンドオートコンプリート機能を無効します
```
aliyun auto-completion --uninstall
```

# 4.Alibaba Cloud CLIを使用します
1）Alibaba Cloud CLI使用コマンド概要
Alibaba CloudプロダクトのAPIは、RPCとRESTfulの2つのタイプに分けられます。ほとんどのプロダクトはRPCスタイルを使用します。 Alibaba Cloud CLIを使用してインターフェースを呼び出す場合、APIのスタイルが異なれば呼び出し方法も異なります。

①Alibaba Cloud CLIコマンドのフォーマットは下記の通りです
```
aliyun <command> <subcommand> [options and parameters]
・aliyun：Alibaba Cloud CLIツール名
・command：トップレベルのコマンドを指定します
    ①コマンドラインツールでサポートされているAlibabaCloudのプロダクトを指します。例：ecs、rdsなど
    ②コマンドラインツール自体の機能コマンドを表します。例：help、configureなど
・subcommand：実行したい操作の付加サブコマンドを指定する、つまり特定の操作
・options and parameters：Alibaba Cloud CLIの動作を制御するためのオプションまたはAPIパラメーターオプションを指定します。そのオプション値は、数値、文字列、json構造化文字列などを指定できます。
```
プロダクトのAPIを呼び出す際に、まず、APIのタイプを決定し、標準のコマンド構造を選択してプロダクトのAPIを呼び出す
APIタイプは以下の特徴で判断できます
```
・APIパラメーターにはActionフィールドが含まれているのはRPCAPIであり、PathPatternパラメーターが必要なのはRESTfulAPIです
・通常各製品内ですべてのAPIの呼び出しスタイルは統一されています
・各APIは特定のスタイルのみをサポートします。間違った識別子が渡されると、他のAPIを呼び出したり、ApiNotFoundエラーメッセージを受信したりする可能性があります。
```

1）RPC APIを呼び出す
コマンドフォーマット
```
aliyun <product> <ApiName> [--parameter1 value1 --parameter2 value2 ...]
```

①VPCを作成します
```
aliyun vpc CreateVpc --VpcName "cli-test"
```
 ![Create VPC API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/13_cli_vpc_01.png "VPC API 01")

![Create VPC API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/13_cli_vpc_02.png "VPC API 02")

②VPCを確認します
```
aliyun vpc DescribeVpcs --VpcId vpc-6we0mr2eume1vjwn7w0s1
```
 ![Create VPC API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/13_cli_vpc_03.png "VPC API 03")

③VPCのVSwitchを作成します
aliyun Vpc CreateVSwitch --VpcId vpc-6we0mr2eume1vjwn7w0s1 --CidrBlock 172.16.1.0/24 --ZoneId ap-northeast-1b --VSwitchName vsw-1

 ![Create vsw API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/14_cli_vsw_01.png "vsw API 01")

④VPCのVSwitchを確認します
```
aliyun Vpc DescribeVSwitches --VpcId vpc-6we0mr2eume1vjwn7w0s1
```
 ![Create vsw API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/14_cli_vsw_02.png "vsw API 02")

![Create vsw API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/14_cli_vsw_03.png "vsw API 03")

⑤ECSインスタンスを作成します
```
aliyun ecs CreateInstance --ImageId centos_7_06_64_20G_alibase_20190711.vhd --InstanceType ecs.t5-lc2m1.nano --Description TestFromCLI --InstanceName ECSTestFromCLI --VSwitchId vsw-6wenz4urbcb2jlyjajrea
```
 ![Create ECS API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/15_cli_ecs_01.png "ECS 01")

 ![Create ECS API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/15_cli_ecs_02.png "ECS 02")

⑥ECSインスタンスを確認します
```
aliyun ecs DescribeInstanceAttribute --InstanceId i-6webnglrnf4gkg7ml4b0
```
 ![Create ECS API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/15_cli_ecs_03.png "ECS 03")

⑦ECSインスタンスを削除します
```
aliyun ecs DeleteInstance --InstanceId i-6webnglrnf4gkg7ml4b0
```
 ![Create ECS API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/15_cli_ecs_04.png "ECS 04")

 ![Create ECS API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/15_cli_ecs_05.png "ECS 05")

 ![Create ECS API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/15_cli_ecs_06.png "ECS 06")

2）RESTful APIを呼び出す

```
aliyun Productcode [GET|PUT|POST|DELETE] <PathPattern> --body "$(cat input.json)"
```
ElasticSearch RESTful APIを呼び出す

①ElasticSearchのインスタンスを確認します

```
aliyun elasticsearch GET /openapi/instances/es-sg-v3ip8up8spx83982m
```
 ![get es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/16_cli_es_01.png "es 01")

 ![get es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/16_cli_es_02.png "es 02")

 ![get es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/16_cli_es_03.png "es 03")
  
 ![get es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/16_cli_es_04.png "es 04")

 ![get es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/16_cli_es_05.png "es 05")

 ![get es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/16_cli_es_06.png "es 06")

②ElasticSearchを設定します
```
aliyun elasticsearch POST /openapi/instances/es-sg-v3ip8up8spx83982m/actions/close-https
```
 ![POST es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/17_cli_es_01.png "es 01")

③ElasticSearchインスタンスを削除します
```
aliyun elasticsearch DELETE /openapi/instances/es-sg-v3ip8up8spx83982m
```
削除する前のインスタンス：
 ![DELETE es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/18_cli_es_01.png "es 01")

削除します
 ![DELETE es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/18_cli_es_02.png "es 02")

 ![DELETE es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/18_cli_es_03.png "es 03")

 ![DELETE es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/18_cli_es_04.png "es 04")

 ![DELETE es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/18_cli_es_05.png "es 05")

削除後：
 ![DELETE es API　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/18_cli_es_06.png "es 06")

# 5.DockerでAlibaba Cloud CLIを構成します
## 5-1.ECS環境を準備します

1）ECSを用意します
![Linux ecs](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/19_linux_ecs_01.png "Linux ecs 01")

2）LinuxのECSに登録します
 ![Linux ecs](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/19_linux_ecs_02.png "Linux ecs 02")


## 5-2.Docker環境を構成します
1）必要なパッケージをインストールします

```
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```
![docker package](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/20_package_install_01.png "docker package 01")

![docker package](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/20_package_install_02.png "docker package 02")

2）リポジトリを設定します
```
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
 ![set docker repository](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/21_docker_repository.png "docker repository")

3）Docker Engine-Communityをインストールします
```
sudo yum install docker-ce docker-ce-cli containerd.io
```
 ![docker install](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/22_docker_install_01.png "docker install 01")

![docker install](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/22_docker_install_02.png "docker install 02")
4）Docker を起動します
```
sudo systemctl start docker
```
 ![docker start](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/23_docker_start_01.png "docker start 01")

5）Docker を確認します
```
docker version
sudo systemctl status docker
```
 ![docker check](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/24_docker_check_01.png "docker check 01")

 ![docker check](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/24_docker_check_02.png "docker check 02")

## 5-3.DockerでAlibaba Cloud CLIを構成します
1）Dockerfileを用意します
備考：Dockerfileはテキストで編集し、拡張子がないファイルに設定、ファイル名はDockerfileです
```
vim Dockerfile
```
 ![docker file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/25_docker_file_01.png "docker file 01")
```
FROM alpine:latest

# Add jq，output with JSON format
RUN apk add --no-cache jq

# get and install CLI tool
RUN wget https://aliyuncli.alicdn.com/aliyun-cli-linux-3.0.2-amd64.tgz
RUN tar -xvzf aliyun-cli-linux-3.0.2-amd64.tgz
RUN rm aliyun-cli-linux-3.0.2-amd64.tgz
RUN mv aliyun /usr/local/bin/
```
 ![docker file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/25_docker_file_02.png "docker file 02")

2）Dockerfileを使って、docker buildコマンドでCLIイメージを作成します
```
docker build -t test/aliyuncli:v1 . 
```
備考：コマンドの最後にある「.」は、現在のディレクトリにDockerイメージをビルドするようにDockerに指示します。省略するとエラーが発生します。

 ![docker image](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/26_docker_image_01.png "docker image 01")

 ![docker image](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/26_docker_image_02.png "docker image 02")

3）CLI docker image を起動します

```
docker run -it -d --name dockercli test/aliyuncli:v1
```
 ![docker run](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/27_docker_run_01.png "docker run 01")

CLI dockerを確認します
 ![docker run](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/27_docker_run_02.png "docker run 02")

4）CLI dockerを接続します

```
docker exec -it dockercli /bin/sh
```
 ![docker connect](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/28_docker_connect_01.png "docker connect 01")

## 5-4.DockerでAlibaba Cloud CLIを使用します

1）dockerでCLI構成をします
①下記コマンドで構成します

```
aliyun configure --mode AK --profile profiledocker
```
リージョンとAKを設定する[リージョンID](https://help.aliyun.com/document_detail/40654.html?spm=a2c63.p38356.879954.4.6eb1f86bcXCKCG):リージョンIDはこのリンクをご参照ください
![CLI config](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/29_docker_cli_config_01.png "CLI config 01")

②構成リストを確認します
```
aliyun configure list
```
![CLI config list](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/30_cli_config_list.png "CLI config list ")

2）RPC APIを呼び出す

①VPCを作成します
```
aliyun vpc CreateVpc --VpcName "cli-test-docker"
```
{"VRouterId":"vrt-6weaytpdc2rr22b9lgdpw","RouteTableId":"vtb-6webmz6mk266r3e6hot4l","RequestId":"8D31603B-5F6F-4FB6-919F-22CC0D031BD9","VpcId":"vpc-6wegrzq26hyl0snlfbxpv","ResourceGroupId":"rg-acfnu655g4vjkyi"}
![Create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/31_Create_VPC_01.png "Create VPC 01 ")

![Create VPC ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_01/31_Create_VPC_02.png "Create VPC 02 ")


# 最後に
以上、Alibaba Cloud CLIについてをご紹介しました。CLIを使った開発をする際、ご参考になれば幸いです。    

