---
title: "VSCode Aliyun Serverless"
metaTitle: "Aliyun Serverless VSCode Extensionについて紹介します"
metaDescription: "Aliyun Serverless VSCode Extensionについて紹介します"
date: "2021-06-23"
author: "Nancy"
thumbnail: "/developer-tools_images_07/13_run_remote_function_02.png"
---

# Aliyun Serverless VSCode Extensionの手順

本書は、Aliyun Serverless VSCode Extensionのインストール、実行、デバッグ、デプロイの手順を記載します。


# 1.Aliyun Serverless VSCode Extensionとは
Aliyun Serverless VSCode ExtensionはFunctionComputeが提供しているプラグインです。このプラグインは、FunctionComputeコマンドラインツールFunとFunctionCompute SDKの機能を組み合わせて、VSCodeに基づく開発、デバッグ、およびデプロイツールです。
このプラグインは下記の機能を提供します。

* ローカルでプロジェクトをすばやく初期化と関数作成することができます
* ローカル関数を実行およびデバッグし、サービス関数をクラウドにデプロイします
* クラウドのサービス関数リストを取得し、サービス関数の構成情報を表示し、クラウドの関数を呼び出します
* テンプレートファイルの構文プロンプトを取得します：オートコンプリート、スキーマ検証、フローティングプロンプト

# 2.Aliyun Serverless VSCode Extensionをインストールします
## 2-1.前提条件
AliyunサーバーレスVSCodeExtensionのすべて機能を使用するには下記の前提条件を満たす必要があります
・VSCode：[ Visual Studio Code公式サイト](https://code.visualstudio.com/?spm=a2c4g.11186623.2.8.46aa1539fdD6HI)からダウンロードし、インストールします
・Docker：[Funcraft](https://github.com/alibaba/funcraft?spm=a2c4g.11186623.2.9.46aa1539fdD6HI)のチュートリアルに従ってDockerをにインストールおよび構成する、Funcraftのインストールは[Funcraftインストール](https://github.com/alibaba/funcraft/blob/master/docs/usage/installation-zh.md)を参照してください

## 2-2.VSCodeをインストールします
詳細インストール手順は省略します
①[ Visual Studio Code公式サイト](https://code.visualstudio.com/?spm=a2c4g.11186623.2.8.46aa1539fdD6HI)からVisual Studio Codeをダウンロードします

 ![install vscode](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/01_install_vscode_01.png "vscode 01")

②VScode.exeをダブルクリックし、インストールします
 ![install vscode](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/01_install_vscode_02.png "vscode 02")

③VSCodeがインストールされました
 ![install vscode](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/01_install_vscode_03.png "vscode 03")

④VSCodeを起動します
 ![install vscode](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/01_install_vscode_04.png "vscode 04")


## 2-3.Funをインストールします

Funを使用して依存関係をコンパイルおよびインストールし、ローカルで実行およびデバッグし、fun install / build / localなどのコマンドの機能を使用する必要がある場合は、開発環境にdockerをインストールする必要があります。
[Funcraftインストール](https://github.com/alibaba/funcraft/blob/master/docs/usage/installation-zh.md)からFunとDockerのインストール方法をご参照ください

### 2-3-1.Funをインストールする（Windows環境）
1）Funのインストールは3つの方法を提供します。
・[npmパッケージでインストール](https://github.com/alibaba/funcraft/blob/master/docs/usage/installation-zh.md#%e9%80%9a%e8%bf%87-npm-%e5%8c%85%e7%ae%a1%e7%90%86%e5%ae%89%e8%a3%85)すべてのプラットフォーム（Windows / Mac / Linux）に適しています。npmの開発パッケージをプリインストールしている
・[バイナリインストールパッケージでインストール](https://github.com/alibaba/funcraft/blob/master/docs/usage/installation-zh.md#%E9%80%9A%E8%BF%87%E4%B8%8B%E8%BD%BD%E4%BA%8C%E8%BF%9B%E5%88%B6%E5%AE%89%E8%A3%85)、すべてのプラットフォーム（Windows / Mac / Linux）に適しています
・[Homebrewパッケージマネージャーでインストール](https://github.com/alibaba/funcraft/blob/master/docs/usage/installation-zh.md#%e9%80%9a%e8%bf%87-homebrew-%e5%8c%85%e7%ae%a1%e7%90%86%e5%99%a8%e5%ae%89%e8%a3%85)Macプラットフォームに適しており、MacOS開発者の習慣に沿っています。

2）バイナリインストールパッケージでインストール
①下記リンクからインストールファイルをダウンロードします
[バイナリインストールパッケージ](https://github.com/aliyun/fun/releases)
 ![install fun](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/02_install_fun_01.png "fun 01")
 ![install fun](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/02_install_fun_02.png "fun 02")

②fun-v3.6.23-win.exe.zipを解凍します
 ![install fun](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/02_install_fun_03.png "fun 03")

③fun-v3.6.23-win.exeをfun.exeリネームし、C:\WINDOWS\System32パスにコピーペーストします
 ![install fun](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/02_install_fun_04.png "fun 04")

④CMDを開き、funのバージョンを確認します

```
fun.exe --version
```
 ![install fun](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/02_install_fun_05.png "fun 05")


### 2-3-2.Dockerをインストールする（Windows環境）
1）Dockerのインストールファイル
①Windows 
・公式サイトの[チュートリアル](https://store.docker.com/editions/community/docker-ce-desktop-windows)を参照できます。AlibabaCloudの[Docker For Windows](http://mirrors.aliyun.com/docker-toolbox/windows/docker-for-windows/beta/)からもダウンロードできます
②MacOS 
・公式サイトの[チュートリアル](https://store.docker.com/editions/community/docker-ce-desktop-mac?tab=description)を参照できます。AlibabaCloudの[Docker For Mac](http://mirrors.aliyun.com/docker-toolbox/mac/docker-for-mac/stable/)からもダウンロードできます
③Linux 
・公式サイトの[チュートリアル](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-using-the-repository)を参照できます。AlibabaCloudの[ Docker CE イメージサイト](https://yq.aliyun.com/articles/110806)からもダウンロードできます

2）Dockerをインストールします
①[公式サイト](https://docs.docker.com/docker-for-windows/install)からダウンロードします
 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_01.png "Docker 01")

②Docker Desktop Installer.exeがダウンロードされる
 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_02.png "Docker 02")

③Docker Desktop Installer.exeをダブルクリックし、デフォルト設定でDockerをインストールする 
 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_03.png "Docker 03")

 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_04.png "Docker 04")

④ インストール完了し、Windowsを再起動します
 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_05.png "Docker 05")

⑤ Dockerを起動します
 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_06.png "Docker 06")

3）wsl2をインストールします
① 下記リンクからwsl2-kernelをダウンロードします
 [Linux kernel update package](https://docs.microsoft.com/windows/wsl/wsl2-kernel)の(https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)リンクからDockerをダウンロードします

 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_07.png "Docker 07")

② wsl2-kernelをインストールします
 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_08.png "Docker 08")

③wsl2-kernelをインストール後、Windowsを再起動します
 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_09.png "Docker 09")

④Dockerを起動します
 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_10.png "Docker 10")

⑤Startをクリックする 
 ![install Docker](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/03_install_Docker_11.png "Docker 11")
ここまでWindowsでDockerのインストールが完了しました。

### 2-3-3.Funを構成する（Windows環境）
1）fun configで構成します
①CMDを起動し、下記のコマンドでfunを構成します
```
# fun config
```
②　Account ID、Access Key Id、Secret Access Key、Default Region Nameを正しく設定し、その他デフォルトで設定します
Account IDはrootアカウントのAccount IDで設定してください。

・FunctionComputeコンソール画面にAccount ID情報を確認します
 ![fun config](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/04_fun_config_01.png "fun config 01")
・Access Key Id、Secret Access Key情報を確認します
 ![fun config](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/04_fun_config_02.png "fun config 02")

 ![fun config](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/04_fun_config_03.png "fun config 03")

 ![fun config](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/04_fun_config_04.png "fun config 04")

## 2-4.VSCodeでAliyun Serverlessプラグインをインストールします
①VSCodeを起動します
 ![serverless plugin](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/05_serverless_plugin_01.png "plugin 01")
 
②Extensions画面に、Aliyun Serverlessプラグインを検索します
 ![serverless plugin](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/05_serverless_plugin_02.png "plugin 02")

③Aliyun Serverlessプラグインをインストールします
 ![serverless plugin](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/05_serverless_plugin_03.png "plugin 03")

④Aliyun Serverlessプラグインがインストールされました
左側メニューにAliyun Serverlessプラグインメニューが追加されました
 ![serverless plugin](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/05_serverless_plugin_04.png "plugin 04")

# 3.Aliyun Serverless VSCode Extensionのクイックスタート

## 3-1.AlibabaCloudのFunctionComputeでサービスと関数を作成します
①AlibabaCloudサイトをログインし、FunctionComputeでサービスと関数を作成します
 ![create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/06_Create_function_01.png "function 01")
②関数を確認します
 ![create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/06_Create_function_02.png "function 02")

## 3-2.VSCodeでAlibabaCloudのアカウントをバインドします
1）アカウントをバインドします
①左側のFunctionComputeメニューをクリックします
 ![bind account ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/07_bind_account_01.png "account 01")
②アカウントIDをインプットする（プライマリーアカウントのAccountID）、Cloudのサービスと関数がリストされました
今回は2-3-3.Funを構成するAccount ID、AccessKey ID、AccessKey Secretが設定されました
 ![bind account ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/07_bind_account_02.png "account 02")

2）リージョンを変更します
リージョンを変更することで、ほかのリージョンのサービスと関数が確認することができます
①リージョンを変更します
 ![change region ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/08_change_region_01.png "change region  01")
 ![change region ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/08_change_region_02.png "change region  02")

②リージョンを日本リージョンに設定します
 ![change region ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/08_change_region_03.png "change region  03")

## 3-3.VSCodeでローカルの関数を作成します
1）VSCodeでファイルメニューからフォルダを開く
①フォルダを作成します
 ![local create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/09_create_function_01.png "create function 01")

②VSCodeを起動します
 ![local create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/09_create_function_02.png "create function 02")

③VSCodeでファイルメニューからフォルダを開く
 ![local create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/09_create_function_03.png "create function 03")

2）ローカルの関数を作成します
①Aliyun：FunctionComputeをクリックし、Local resourceに「+」をクリックします
 ![local create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/09_create_function_04.png "create function 04")

②Service名を入力するエンターキーを押します
 ![local create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/09_create_function_05.png "create function 05")

③ Fucntion名を入力し、エンターキーを押します
 ![local create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/09_create_function_06.png "create function 06")

④code uriを確認し、エンターキーを押します
```
nancy_local_service\nancy_local_fc
```
 ![local create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/09_create_function_07.png "create function 07")

⑤FunctionRuntimeを設定します
 ![local create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/09_create_function_08.png "create function 08")

⑥Functionタイプを設定します
 ![local create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/09_create_function_09.png "create function 09")

⑦Functionを確認します
nancy_local_service\nancy_local_fc\index.py
```index.py
# -*- coding: utf-8 -*-
import logging

# if you open the initializer feature, please implement the initializer function, as below:
# def initializer(context):
#   logger = logging.getLogger()
#   logger.info('initializing')

def handler(event, context):
  logger = logging.getLogger()
  logger.info('hello world')
  return 'hello world'
```
 ![local create function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/09_create_function_10.png "create function 10")

## 3-4.ローカルで関数を実行します
①Function右側の実行メニューをクリックします
 ![local run function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/10_run_function_01.png "run function 01")
②初回実行するときはPython実行環境を初期化します
 ![local run function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/10_run_function_02.png "run function 02")
 ![local run function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/10_run_function_03.png "run function 03")

③Functionを実行します
 ![local run function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/10_run_function_04.png "run function 04")

## 3-5.ローカルで関数をデバッグします
①デバッグメニューをクリックします
 ![debug function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/11_debug_function_01.png "debug function 01")

②breakpointを設定し、「Run and debug」をクリックします
 ![debug function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/11_debug_function_02.png "debug function 02")

③Pythonコンフィグファイルを選択します
 ![debug function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/11_debug_function_03.png "debug function 03")

④デバッグを開始します
 ![debug function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/11_debug_function_04.png "debug function 04")

⑤Continueをクリックします
 ![debug function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/11_debug_function_05.png "debug function 05")

⑥デバッグ完了します
 ![debug function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/11_debug_function_06.png "debug function 06")

## 3-6.VSCodeでサービスと関数をデプロイします
①depolyメニューをクリックします
 ![deploy function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/12_deploy_function_01.png "deploy function 01")

②デプロイを実行成功して、リモートリソースにもリストされる
 ![deploy function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/12_deploy_function_02.png "deploy function 02")

③AlibabaCloudのFunctionComputeコンソール画面に関数を確認します

 ![deploy function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/12_deploy_function_03.png "deploy function 03")
 ![deploy function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/12_deploy_function_03.png "deploy function 03")

## 3-7.クラウドの関数を実行します
①freshメニューをクリックし、RemoteInvokeメニューをクリックします
 ![run function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/13_run_remote_function_01.png "run remote function 01")

②RemoteInvokeが完成できます
 ![run function ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/developer-tools/developer-tools_images_07/13_run_remote_function_02.png "run remote function 02")


# 最後に

ここまでAliyun Serverless VSCode Extensionのインストール、実行、デバッグ、デプロイの手順をご紹介しました。VSCodeを使った開発をする際、参考に頂ければ幸いです。


