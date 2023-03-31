---
title: "Cloud Shell"
metaTitle: "Alibab Cloud Cloud Shellについて紹介します"
metaDescription: "Alibab Cloud Cloud Shellについて紹介します"
date: "2021-06-25"
author: "Nancy"
thumbnail: "/developer-tools_images_02/00_overview.png"
---

## Alibaba Cloud Shellの手順

本書は、Alibaba Cloud Shellの使用手順を記載します。   

構成図
 ![overview](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/00_overview.png "overview")


# 1.Alibaba Cloud Shellとは
Alibaba Cloud Shellは、Webバージョンのコマンドラインツールです。任意のブラウザでクラウドコマンドラインを実行して、AlibabaCloudリソースを管理することができます。 クラウドコマンドラインで起動すると、Linux仮想マシンが自動的に割り当てられ、無料で使用できます。 この仮想マシンにpython、java、nodejs環境、aliyun CLI、curl、ssh、kubectl、fun、terraform、ansible、vimなど様々なクラウド管理ツールとシステムツールをプレインストールし、CloudShellが提供するWebIDEと合わせて、日常的なクラウドリソース管理をサポートします。

以下のような機能を提供します。

①無料の仮想マシンを自動的に作成します
Cloud Shellを起動すると、専用のLinux仮想マシンが自動的に作成されます。
セッションがアクティブな場合、インスタンスは無期限で使えます。 Cloud Shellundefinedは自動認証を実現します。コマンドラインを使用すると、クラウドリソースを管理することができます。 各ログインクラウドアカウントの管理権限は、RAMで付与されている操作権限と同等です。 同時に、Cloud Shellは、ログインしているすべてのユーザーに対してセキュリティ認証を実行し、ユーザーによる仮想マシンの分離を実現して、オペレーティング環境のセキュリティを確保します。

②永続ディスクストレージスペース
Cloud Shellは、ストレージスペースをバインドして、永続的なストレージを提供します。CloudShellインスタンスの$ HOMEディレクトリとして。 ホームディレクトリに保存されているすべてのファイル（スクリプトおよび.bashrcや.vimrcなどのユーザー構成ファイルを含む）は、異なるセッションやインスタンス間で変更されません。
ツールバーのストレージアイコンを使用して、ストレージスペースをバインドまたはバインド解除ができます。
 ![storage icon](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/01_storage_icon.png "storage icon")

③コードエディタ
・Cloud Shellには、組み込みのコードエディターがあります。 ツールバーのコードアイコンをクリックすると、コードエディタを開くことができます。
 ![Edit icon](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/02_Edit_icon_01.png "Edit icon 01")
・$ HOMEファイルディレクトリを参照したり、コードエディタでファイルを編集したりしながら、引き続きCloudShellを使用できます。 CloudShellに組み込まれているWebIDEを使用すると、開発環境の構成やさまざまな依存ツールのインストールを気にせず。オンラインで直接開発し、コマンドラインから実行またはデプロイできます。同時に、ストレージスペースはCloud Shellを介してバインドされ、編集したファイルは永続的に保存できます。
 ![Edit icon](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/02_Edit_icon_02.png "Edit icon 02")

④チュートリアルモード
Cloud Shellは、チュートリアルの構築と起動をサポートしています。 チュートリアルは、Markdownで記述された一連の命令ドキュメントです。

⑤利用可能なツール
CloudShell仮想マシンに実装のツールがあります。[クラウドコマンドラインサポートツールリスト](https://www.alibabacloud.com/cloud-tech/doc-detail/151236.htm?spm=a2c63.p38356.b99.6.19187a9b37B7cO)

⑥サポートの言語
Cloud Shell仮想マシンには、次の言語を実装しています。

|言語|バージョン|
|--|--|
|Java|1.8|
|Go|1.13.4|
|Python|3.6.7|
|Nodejs|v12.13.1|
|PHP|7.2.10|
|Ruby|2.5.1|

⑦使用制限
|制限項目 |説明|
|--|--|
|　仮想マシンの数　|　複数のセッションウィンドウを開いても、一つの仮想マシンのみが起動される、そしてこの仮想マシンに自動的に接続される|
|　セッションウィンドウ　|　最大5つのセッションウィンドウを開く|
|　操作なしの仮想マシン撤回|　30分操作なしまたはすべてのセッションウィンドウを閉じる場合は、終了操作と見なされる。終了15分で仮想マシンを破棄します。再度起動すると、新しい仮想マシンが作成されます|
|　ファイルストレージ　|　Cloud Shellは、一時的に10GBのストレージをマウントする。ファイルは/home/shellディレクトリに保存できますが、仮想マシンが破棄されるとリセットされます。 ストレージスペースをマウントすることを選択することで永続的なストレージが実現できます、Cloud Shellが起動するたびに自動的にロードされます|
|　使用禁止　|　コンピューティングやネットワーク集約型などの長期使用や悪意のあるプロセスはサポートされず、警告なしにセッションが終了したり、無効になったりする可能性があります|

# 2.Alibaba Cloud Shellを使用します
## 2-1.Alibaba Cloud Shellの起動方法
1）コンソールで起動
①Alibaba Cloud公式サイトでログインをクリックし、RAMユーザーを入力します
![run cloud shell](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/03_run_cloud_shell_000.png "run cloud shell 000")

②パスワードを入力します
![run cloud shell](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/03_run_cloud_shell_001.png "run cloud shell 001")

③コンソールメニュをクリックします
![run cloud shell](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/03_run_cloud_shell_01.png "run cloud shell 01")

④コンソール画面でCloud Shellアイコンをクリックします
![run cloud shell](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/03_run_cloud_shell_02.png "run cloud shell 02")

⑤Cloud Shellを起動します
![run cloud shell](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/03_run_cloud_shell_03.png "run cloud shell 03")

⑥helpを確認します
![run cloud shell](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/03_run_cloud_shell_04.png "run cloud shell 04")
2）単独で起動
①ブラウザでリンクを開く[リンク](https://shell.aliyun.com)
![run cloud shell](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/04_run_cloud_shell_01.png "run cloud shell 01")

②OpenAPI ExplorerでCloud Shellを起動します
OpenAPI Explorerで起動[OpenAPI Explorer](https://api.alibabacloud.com/new?spm=a2c4g.11186623.2.7.24624ebbsIHCoM#/cli)
![run cloud shell](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/04_run_cloud_shell_02.png "run cloud shell 02")

## 2-2.Cloud ShellにCLIコマンドでクラウドリソースの管理
Cloud ShellでCLIコマンドでAlibabaCloud APIを直接呼び出して、クラウドリソースを管理することができます
①CloudShellにCLIコマンドでRPCAPIを呼び出すには、下記のフォーマットに従う必要があります。

```
aliyun <ProductCode> <ActionName> [--parameter1 value1 --paramter2 value2]

```
・ProductCode：AlibabaCloudのプロダクトcodeを指します。例：ecs、slbなど、aliyun --helpでProductCodeが確認できます
・ActionName：呼び出すAPI名　例：ECSのDescribeInstanceAttributeのAPIではECS の詳細情報を確認します
・parameter：渡されるパラメーター。各プロダクトのAPIをご参照ください

②Helpを確認します
フォーマット
```
aliyun <ProductCode> --help
```
コマンド
```
aliyun ecs --help
```
ECSのAPIがリストされる
![cloud shell help](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/05_cloud_shell_help_01.png "cloud shell help 01")

 ![cloud shell help](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/05_cloud_shell_help_02.png "cloud shell help 02")

③詳細APIのHelpを確認します
フォーマット
```
aliyun <ProductCode> <ApiName> --help
```
コマンド
```
aliyun ecs DescribeInstanceAttribute --help
```
 ![cloud shell help](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/05_cloud_shell_help_03.png "cloud shell help 03")


④VPCを作成します
```
aliyun vpc CreateVpc --VpcName "cloudshell_cli-test"
```
```
shell@Alicloud:~$ aliyun vpc CreateVpc --VpcName "cloudshell_cli-test"
{
        "RequestId": "451243C7-A283-4EFD-A990-87DA1199575C",
        "ResourceGroupId": "rg-acfnu655g4vjkyi",
        "RouteTableId": "vtb-t4n6ocxbre99kb9fc7tqn",
        "VRouterId": "vrt-t4npp4ku9w54g2yr5z2vi",
        "VpcId": "vpc-t4nhmjhg898hsqv63qibx"
}
```

 ![create vpc](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/06_create_vpc.png "create vpc")

⑤VPCを確認します

```
aliyun vpc DescribeVpcs --VpcId vpc-t4nhmjhg898hsqv63qibx
```
 ![check vpc](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/07_check_vpc.png "check vpc")


## 2-3.コードエディターの可視化
CloudShellはビジュアルコードエディターが組み込まれている。簡易化のWebIDEにより、1ページでオンライン開発し、コマンドラインから実行または展開できます。
CloudShellはJava、Python、Go、Nodejs、PHP、Rubyの言語を対応している。またコードエディターでMDファイルも作成できます。
Pythonを例として説明します。
1）CloudShellでコードエディター画面を開く
 ![edit code](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/08_edit_code_01.png "edit code 01")

 ![edit code](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/08_edit_code_02.png "edit code 02")

2）hellowworld.pyを追加します

 ![add python file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/09_add_python_file_01.png "python file 01")

 ![add python file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/09_add_python_file_02.png "python file 02")

3）Pythonコードを編集します
①コードを編集します
```
#test for code edit helloworld.py
print('hello world !')
```
 ![edit code](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/10_edit_python_code_01.png "edit code 01")
②コードを保存します
 ![edit code](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/10_edit_python_code_02.png "edit code 02")

4）Pythonコードを実行します
```
python helloworld.py
```
 ![run code](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/11_run_python_code.png "run code ")

## 2-4.ファイルのアップロードとダウンロード

1）ファイルをアップロードします

①helloworld.javaファイルを用意します
 ![upload file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/12_upload_file_01.png "upload file 01")

②アップロード＆ダウンロードアイコンをクリッし、アップロードメニューをクリックします
![upload file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/12_upload_file_02.png "upload file 02")

③helloworld.javaファイルを選択します
![upload file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/12_upload_file_03.png "upload file 03")

④helloworld.javaファイルがアップロード完了しました
![upload file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/12_upload_file_04.png "upload file 04")

⑤helloworld.javaファイルを確認します
![upload file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/12_upload_file_05.png "upload file 05")

⑥helloworld.javaファイルを実行します
```
javac helloworld.java
```
helloworld.classが生成される

```
java helloworld
```
helloworldがプリントされる

![upload file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/12_upload_file_06.png "upload file 06")

2）ファイルをダウンロードします
helloworld.pyをダウンロードします
①アップロード＆ダウンロードアイコンをクリッし、ダウンロードメニューをクリックします
![download file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/13_download_file_01.png "download file 01")

②ダウンロードウィンドを開く
![download file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/13_download_file_02.png "download file 02")

③ファイルパスを入力します
![download file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/13_download_file_03.png "download file 03")

④ダウンロード完成します
![download file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/13_download_file_04.png "download file 04")

⑤ファイルを確認します
![download file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/13_download_file_05.png "download file 05")

⑥helloworld.py内容を確認します
![download file](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/13_download_file_06.png "download file 06")

## 2-5.チュートリアルの作成
CloudShellでチュートリアルが作成できます
1）チュートリアルフォルダを作成します
```bash
mkdir tutorials
```
上記のコマンドを実行し、リフレッシュボタンをクリックしてフォルダが確認します
![create tutorials](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/14_create_tutorials_01.png "create tutorials 01")

2）tutorialsフォルダに移動し、tutorial.mdファイルを作成します
```bash
cd tutorials
touch tutorial.md
```
![create tutorials](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/14_create_tutorials_02.png "create tutorials 02")

3）Markdownチュートリアルを作成します
Markdown構文を使用してチュートリアルドキュメントが作成できます。下記のルールに従ってください
① H1（#）はチュートリアルのタイトルです。 一つのチュートリアルは一つのH1タイトルのみがあります
② H2（##）は手順タイトルです
③Markdownのコード構文を使用して、ドキュメントにコードが追加できます。チュートリアルドキュメントのコードブロックとしてレンダリングされます。そしてコピーボタンが付ける。コピーボタンをクリックすると、コンテンツがCloudShellのインプットエリアにコピーされます。
```bash
aliyun help
```

④Cloud Shellチュートリアルで提供されるディレクトリコマンドを使用して、チュートリアルの目次構造が自動的に生成される。
```
<tutorial-nav></tutorial-nav>
```

⑤Cloud Shellチュートリアルで提供されるファイルを開くコマンドを使用して、チュートリアルへ特定ファイルのリンクが追加できる。チュートリアルを読み取る際にこのリンクをクリックして、該当ファイルがCloudShellエディターで開かれます。
ファイルパスはフルパスまたは相対パスです。相対パスは$ HOMEに基づく

```
<tutorial-editor-open-file filePath="path/tutorial.md>Open File</tutorial-editor-open-file>
```

⑥チュートリアルを編集します
```
    # AlibabaCloud CLIでクラウドリソースを管理します
    ## CLIのヘルプを確認します
    ```bash
    aliyun help```
    ### 例1
    ### 例2
    ```bash
        echo world```
    ## ここまで完成です
```

![create tutorials](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/14_create_tutorials_02.png "create tutorials 02")

![create tutorials](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/14_create_tutorials_03.png "create tutorials 03")

⑦下記コマンドを実行し、チュートリアルをレビューします
```
teachme tutorial.md
```
![create tutorials](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/14_create_tutorials_04.png "create tutorials 04")

⑧チュートリアルレビュー画面にCopyToTerminalボタンをクリックし、コマンドがCloudShellのターミナルへコピーペーストします

![create tutorials](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/14_create_tutorials_05.png "create tutorials 05")

⑧CloudShellのターミナルにコマンドが表示される
![create tutorials](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/14_create_tutorials_06.png "create tutorials 06")

⑩CloudShellのターミナルでコマンドが実行できます
![create tutorials](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/14_create_tutorials_07.png "create tutorials 07")

チュートリアルが作成後、Cloud Shellで実装されたGitコマンドを使用して、チュートリアルをGitリポジトリとしてGitにプッシュできます。Gitリポジトリはインタネットアクセス許可の必要があります


# 3.Cloud ShellにAlibabaCloudリソースを管理します

## 3-1.CLIでAlibabaCloudリソースを管理します
CloudShellにAlibaba CloudCLIを実装されています。AlibabaCloudCLIを介してAlibabaCloudリソースを管理することができます。
Alibaba CloudCLIを起動する際に、初めてCLIを接続するときに、４０秒以内の時間がかかります。またウィンドを複数開いても同じ仮想マシンを使っている。
1）CloudShellでCLIを通してRPCAPIを呼び出す

コマンドフォーマット：
```
aliyun <ProductCode> <ActionName> [--parameter1 value1 --paramter2 value2]
```
①CLIバージョンを確認します
![CloudShell　CLI version](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/15_cli_version.png "CLI version ")
②CLI構成を確認します
CloudShellでCLIを使用する際に、新たな構成はいらず、CLIが使用できます
デフォルトは一時的なAKで、デフォルトリージョンはap-southeast-1シンガポールリージョンです
```
aliyun configure get
```
![CloudShell　CLI config　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/16_cli_config.png "CLI config ")

③VPCを作成します
```
aliyun vpc CreateVpc --VpcName "cloudshell_cli-test"
```
```
shell@Alicloud:~$ aliyun vpc CreateVpc --VpcName "cloudshell_cli-test"
{
        "RequestId": "4B416307-85C3-49CE-900E-9062076F601E",
        "ResourceGroupId": "rg-acfnu655g4vjkyi",
        "RouteTableId": "vtb-t4nvcisq71zdjvk60o5zj",
        "VRouterId": "vrt-t4npbrcvi9ukjdxn0i9fy",
        "VpcId": "vpc-t4nie19p50f4ajqltxop9"
}
```
 ![vpc create　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/17_cli_vpc_create_01.png "vpc create 01")

![vpc create　](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/17_cli_vpc_create_02.png "vpc create 02")

④VPCを確認します
```
aliyun vpc DescribeVpcs --VpcId vpc-t4nie19p50f4ajqltxop9
```
 ![vpc describe](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/18_cli_vpc_describe.png "vpc describe")

2）CloudShellでCLIを通してRESTful APIを呼び出す

コマンドフォーマット：
```
aliyun Productcode [GET|PUT|POST|DELETE] <PathPattern> --body "$(cat input.json)"
```
①CLI構成を日本リージョンに変更します
CloudShellでCLIを使用する際に、新たな構成はいらず、CLIが使用できます
```
aliyun configure get
aliyun configure --mode AK --profile profileshell
aliyun configure get
```
![profile change](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/19_cli_profile_change_01.png "profile change 01")

![profile change](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/19_cli_profile_change_02.png "profile change 02")

①ElasticSearchのインスタンスを確認します

```
aliyun elasticsearch GET /openapi/instances/es-sg-mjc28e06a000118oi
```
![es describe](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/20_cli_es_get_01.png "es describe 01")

![es describe](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/20_cli_es_get_02.png "es describe 02")

![es describe](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/20_cli_es_get_03.png "es describe 03")

②ElasticSearchインスタンスを削除します
```
aliyun elasticsearch DELETE /openapi/instances/es-sg-mjc28e06a000118oi
```
上記のAPIを実行します
![es delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/21_cli_es_delete_01.png "es delete 01")

![es delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/21_cli_es_delete_02.png "es delete 02")

ESインスタンスが削除されました
![es delete](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/21_cli_es_delete_03.png "es delete 03")


## 3-2.CLIでOSSにあるデータを管理します
Alibaba Cloud Shellには認証が組み込まれており、構成を追加設定する必要はありません。またossutilの機能が統合されているため、AlibabaCloudCLIを使用してOSSデータが直接管理できます。
1）コマンドフォーマット
```
aliyun oss [command] [options and parameters]
```
2）ossバケットを作成します
①下記コマンドでossバケットを作成します
備考：バケット名は唯一のバケット名でないとエラーになる
```
aliyun oss mb oss://shellbucket2106
```
![oss bucket](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/21_cli_oss_bucket_01.png "oss bucket 01")

②バケットを確認します
![oss bucket](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/21_cli_oss_bucket_02.png "oss bucket 02")

3）ossバケットにフォルダを作成します
①フォルダを作成します
```
aliyun oss mkdir oss://shellbucket2106/shellfolder/
```
![oss bucket](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/22_cli_oss_folder_01.png "oss bucket 01")

②フォルダを確認します
![oss bucket](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/22_cli_oss_folder_02.png "oss bucket 02")

③Helpコマンドを確認します
```
shell@Alicloud:~$ aliyun oss help
Object Storage Service

Usage:
  aliyun oss [command] [args...] [options...]

Commands:
  help              Get help about commands
  config            Create configuration file to store credentials
  mb                Make Bucket
  ls                List Buckets or Objects
  rm                Remove Bucket or Objects
  stat              Display meta information of bucket or objects
  set-acl           Set acl on bucket or objects
  set-meta          set metadata on already uploaded objects
  cp                Upload, Download or Copy Objects
  restore           Restore Frozen State Object to Read Ready Status
  create-symlink    Create symlink of object
  read-symlink      Display meta information of symlink object
  sign              Generate download link for object
  hash              Get crc64 or md5 of local file
  update            Update ossutil
  probe             Probe command, support for multiple function detection
  mkdir             Create a oss directory whose object name has the suffix character '/'
  cors              Set, get or delete the cors configuration of the oss bucket
  logging           Set、get or delete bucket log configuration
  referer           Set、get or delete bucket referer configuration
  listpart          List parts information of uncompleted multipart object
  getallpartsize    Get bucket all uncompleted multipart objects's parts size and sum size
  appendfromfile    Upload the contents of the local file to the oss appendable object by append upload mode
  cat               Output object content to standard output
  bucket-tagging    Set, get or delete bucket tag configuration
  bucket-encryption Set, get or delete bucket encryption configuration
  cors-options      Send http options request to oss for CORS detection
  lifecycle         Set, get or delete bucket lifecycle configuration
  website           Set, get or delete bucket website configuration
  bucket-qos        Set, get or delete bucket qos configuration
  user-qos          Get user's qos configuration
  bucket-versioning Set, get bucket versioning configuration
  du                Get the bucket or the specified prefix(directory) storage size
  bucket-policy     Set, get or delete bucket policy configuration
  request-payment   Set, get bucket request payment configuration
  object-tagging    Set, get or delete object tag configuration
  inventory         Add, get, delete, or list bucket inventory configuration
  revert-versioning Revert the deleted object to the latest versioning state
  sync              Sync the local file directory or oss prefix from the source to the destination
  worm              set、delete、complete、get bucket's worm configuration

Use `oss --help` for more information.
shell@Alicloud:~$ 
```
![oss help](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/23_cli_oss_help_01.png "oss help 01")

![oss help](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/23_cli_oss_help_02.png "oss help 02")

④詳細APIヘルプコマンドを確認します
コマンドフォーマット
```
aliyun oss [command] help
```
```
aliyun oss hash help
```
![oss help](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/24_cli_oss_help_detail_01.png "oss detail help 01")

![oss help](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/24_cli_oss_help_detail_02.png "oss detail help 02")

## 3-3.TerraformでAlibabaCloudリソースを管理します
Alibaba Cloud Cloud Shellは、運用と保守に役立つ無料のツールです。Terraformコンポーネントが実装されており、クレデンシャルで構成されています。 したがって、TerraformコマンドをCloudShellで直接実行できます。
1）Cloud Shellを起動する[リンク](https://shell.aliyun.com)（同上）
「## 2-1.Alibaba Cloud Shellの起動方法」をご参照ください

2）Alibaba Cloud公式サイトを登録し、Cloud Shell画面を開く（同上）
3）Terraformプロジェクトを作成します
①下記コマンドでプロジェクトフォルダを作成します
```
mkdir terraform-project
```
![Terraform](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/25_cli_terraform_01.png "Terraform 01")

②リフレッシュボタンをクリック後、フォルダを確認します
![Terraform](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/25_cli_terraform_02.png "Terraform 02")

③Shellパスをterraform-projectに切り替わる
```
cd terraform-project 
```
![Terraform](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/22_cli_terraform_03.png "Terraform 03")

4）main.tfファイルを作成します
```
touch main.tf
```
![Terraform](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/22_cli_terraform_04.png "Terraform 04")

⑤main.tfを編集します
（tfファイルの作成方はTerraformの記事もご参照ください。）
VPCを例として編集する、access_keyとsecret_keyを入れ替えてください。
下記vpc.tfコードをmain.tfに貼り付けして保存します
```
# Provider
provider "alicloud" {
  region      = "ap-northeast-1"
  access_key  = "LT************Q"
  secret_key   = "eB************VU"
}

# VPC
resource "alicloud_vpc" "cloud_shell_tf_vpc1" {
  name       = "cloud_shell_tf_vpc1"
  cidr_block = "172.16.0.0/12"
}
# Vswitch1
resource "alicloud_vswitch" "sbc_migration_vsw1" {
  vpc_id            = "${alicloud_vpc.cloud_shell_tf_vpc1.id}"
  cidr_block        = "172.16.0.0/24"
  availability_zone = "ap-northeast-1a"
}
#security_group
resource "alicloud_security_group" "cloud_shell_tf_sg1" {
  name = "cloud_shell_tf_sg1"
  vpc_id = "${alicloud_vpc.cloud_shell_tf_vpc1.id}"
}
resource "alicloud_security_group_rule" "cloud_shell_tf_all_sgr1" {
  type              = "ingress"
  ip_protocol       = "all"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "1/65535"
  priority          = 1
  security_group_id = "${alicloud_security_group.cloud_shell_tf_sg1.id}"
  cidr_ip           = "0.0.0.0/0"
}

```

 ![Terraform edit](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/23_cli_terraform_edit_01.png "Terraform edit 01")

![Terraform edit](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/23_cli_terraform_edit_02.png "Terraform edit 02")

5）Terraformを初期化します
①下記コマンドを実行します
```
terraform init
```

![Terraform init](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/24_cli_terraform_init_01.png "Terraform init 01")

②初期化が完成される
![Terraform init](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/24_cli_terraform_init_02.png "Terraform init 02")

6）terraform planを実行します
①下記コマンドを実行します
```
terraform plan
```

![Terraform plan](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/25_cli_terraform_plan_01.png "Terraform plan 01")

②terraform plan実行が完成される
![Terraform plan](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/25_cli_terraform_plan_02.png "Terraform plan 02")

7）terraform applyを実行します
①下記コマンドを実行します
```
terraform apply
```

![Terraform apply](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/26_cli_terraform_apply_01.png "Terraform apply 01")

②Enter a value: が表示されたら、yesをインプットします
 
![Terraform apply](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/26_cli_terraform_apply_02.png "Terraform apply 02")

③terraform applyが完成される
![Terraform apply](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/26_cli_terraform_apply_03.png "Terraform apply 03")

```
shell@Alicloud:~/terraform-project$ terraform apply

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # alicloud_security_group.cloud_shell_tf_sg1 will be created
  + resource "alicloud_security_group" "cloud_shell_tf_sg1" {
      + id                  = (known after apply)
      + inner_access        = (known after apply)
      + inner_access_policy = (known after apply)
      + name                = "cloud_shell_tf_sg1"
      + security_group_type = "normal"
      + vpc_id              = (known after apply)
…省略
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

alicloud_vpc.cloud_shell_tf_vpc1: Creating...
alicloud_vpc.cloud_shell_tf_vpc1: Creation complete after 7s [id=vpc-6we6gahp387ucs4cyi1mg]
alicloud_security_group.cloud_shell_tf_sg1: Creating...
alicloud_vswitch.sbc_migration_vsw1: Creating...
alicloud_security_group.cloud_shell_tf_sg1: Creation complete after 1s [id=sg-6weds4j9hpzhmxltuoyz]
alicloud_security_group_rule.cloud_shell_tf_all_sgr1: Creating...
alicloud_security_group_rule.cloud_shell_tf_all_sgr1: Creation complete after 0s [id=sg-6weds4j9hpzhmxltuoyz:ingress:all:-1/-1:intranet:0.0.0.0/0:accept:1]
alicloud_vswitch.sbc_migration_vsw1: Creation complete after 6s [id=vsw-6we2znwytf5fylhpe3z95]

Apply complete! Resources: 4 added, 0 changed, 0 destroyed.
shell@Alicloud:~/terraform-project$ 
```
④AlibabaCloudコンソール画面にVPCインスタンスを確認します
![Terraform apply](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/26_cli_terraform_apply_04.png "Terraform apply 04")

⑤VPC詳細画面にリソースを確認します
![Terraform apply](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/26_cli_terraform_apply_05.png "Terraform apply 05")

⑥VSwitchを確認します
![Terraform apply](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/26_cli_terraform_apply_06.png "Terraform apply 06")

⑦Route Tableを確認します
![Terraform apply](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/26_cli_terraform_apply_07.png "Terraform apply 07")

⑧Security Groupsを確認します
![Terraform apply](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/26_cli_terraform_apply_08.png "Terraform apply 08")


# 4.AK情報を取得する方法
①メインアカウントで公式サイトをログインし、コンソールメニューをクリックします
![ak check](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/27_ak_check_01.png "ak check 01")

②アカウントアイコンをクリックします
![ak check](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/27_ak_check_02.png "ak check 02")

③AccessKey Managementメニューをクリックし、AK管理画面に遷移します
![ak check](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/27_ak_check_03.png "ak check 03")

④メインアカウントで登録する場合、AK作成メニューが有効であり、AccessKeyが作成できる。作成したAccessKeyIDとsecretkeyをダウンロードまたはメモします。
本書はサブアカウントでログインするため、AKを作成するメニューがグレーになっている
![ak check](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_02/27_ak_check_04.png "ak check 04")



# 最後に
以上、Cloud Shellについてをご紹介しました。CLIを使った開発をする際、ご参考になれば幸いです。    




