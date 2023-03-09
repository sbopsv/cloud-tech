---
title: "05 Dockerについて"
metaTitle: "Dockerについて"
metaDescription: "Dockerについて、および活用方法を説明します"
date: "2021-05-10"
author: "Hironobu Ohara"
thumbnail: "/images/terraform_7.0.0.png"
---

# はじめに

&nbsp; 前章までは Terraformのインストール方法、Terraformの文法、実行方法を説明しました。しかしこれらは`Terraform v0.11.13`前提での話なので、Terraformのバージョンが違うことで挙動が異なってしまうこともあります。Terraformでよく使うメソッドが急に廃止、、というのもよくあります。それを防ぐためにdockerを使ったインストール、利用する方法があります。dockerはパッケージングを行うための技術です。

**注：Terraformのバージョン食い違いは基本的に[tfenv](https://github.com/tfutils/tfenv)でカバーできます。詳しくは[インストール](https://sbopsv.github.io/cloud-tech/Terraform/Terraform01.install)を参照してください*

> https://sbopsv.github.io/cloud-tech/Terraform/Terraform01.install
# 1. dockerについて
&nbsp; dockerはOS・ミドルウェア・ファイルシステム全体をイメージという単位で取り扱い、まるごとやりとり出来るツールです。また、イメージの配布やバージョン管理も可能です。メリットとして、手軽に同じ環境を何人のユーザ・ユーザ・他のマシンでも手に入れることができ、即座に同環境を再現（ CI (Continuous Integration) 継続的インテグレーションと CD (Continuous Delivery) 継続的デリバリー ）することができます。
また、dockerはTerraformで大きく３つの役割があり、Terraformのインストールや実行環境の再現、各種リソースの接続設定、docker Imageを使った既存のプロダクトリソースをそのまま導入することが可能です。（docker Imageとは、dockerコンテナを作成する際に必要となるファイルシステムです。）



# 2. dockerのTerraform位置について
&nbsp; Terraformによるdockerの利用は大きく3パターンあります。他の便利な役割もありますが、ここは以下3つに絞って紹介します。

* 1.Terraformのバージョン違いなど環境差分を抑えつつ実行する場合
* 2.Terraformで新規作成した各種リソースの接続設定をする場合
* 3.docker-imageを使った、CI/CD:継続的インテグレーションと継続的デリバリーをする場合

ざっくりですがこんなイメージです。
![図 0](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_7.0.0.png)


&nbsp; 1はバージョン固定や実行環境を汚さずに使用するメリットがあります。様々な環境でterraformを使用したい場合は直接terraformコマンドをインストールせず、バージョン管理が可能なツール(`tfenv`)を使用してインストールすルことを勧めます。
![図 1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_7.0.png)

&nbsp; 2はTerraformで新規作成したリソースに対し、docker-compose.yml ファイルを使ってアプリケーションの環境を設定します。こちらは[公式サイト](http://docs.docker.jp/compose/overview.html)にて説明がありますので参考にしてください。
http://docs.docker.jp/compose/overview.html

&nbsp; 3は、dockerのImageファイルをdocker hub（リポジトリ）へ保存することで、新規ECSや各種アプリケーション、Webサイトを立ち上げる時、docker hub（リポジトリ）から対象のDocker ImageファイルをPullしそのまま実行することで、どの環境でも継続CI/CDを実現することができます。

![図 2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/7.1.png)
本章はTerraformをメインとしてるため、ここにCI/CDや方法は載せませんが、やり方は以下サイトを参照してみてください。（近日中にCI/CD手法を載せる予定です）

[Dockerize App and Push to Container Registry: CI/CD Automation on Container Service (1)](https://www.alibabacloud.com/blog/dockerize-app-and-push-to-container-registry-cicd-automation-on-container-service-1_594539)

[Continuous Deployment Automation on Alibaba Cloud: CI/CD Automation on Container Service (2)](https://www.alibabacloud.com/blog/continuous-deployment-automation-on-alibaba-cloud-cicd-automation-on-container-service-2_594540)

[Deploy Docker Image to Alibaba Cloud Container Service: CI/CD Automation on Container Service (3)](https://www.alibabacloud.com/blog/deploy-docker-image-to-alibaba-cloud-container-service-cicd-automation-on-container-service-3_594541)





# 3. docker上でのTerraform実行について
&nbsp; それではdocker上でterraformを実行してみます。実行するためには先にdocker Imageを入手する必要がありますので、まずは以下サイトを[参照](https://hub.docker.com/r/hashicorp/terraform/)してください。
https://hub.docker.com/r/hashicorp/terraform/


参考：Terraformのdocker Imageについて
https://github.com/hashicorp/docker-hub-images/tree/master/packer



Desktopにて`terraform-docker`というディレクトリを作成し、そこでdockerを実行します。

```
$ mkdir ~/Desktop/terraform-docker
$ cd ~/Desktop/terraform-docker
$ touch main.tf
```

以下サンプルソース main.tfを作ってみます。

```
provider "alicloud" {
  region = "ap-northeast-1"
}

resource "alicloud_vpc" "vpc" {
  name = "docker-test-vpc"
  cidr_block = "192.168.1.0/24"
}
```


これで準備完了です。構成はこの通りになります。

```
$ pwd
/Users/hironobu.ohara/Desktop/terraform-docker
$ ls
total 8
drwxr-xr-x   3 hironobu.ohara  staff    96B  7 19 11:43 .
drwx------@ 54 hironobu.ohara  staff   1.7K  7 19 11:43 ..
-rw-r--r--   1 hironobu.ohara  staff   147B  7 19 11:31 main.tf
$ cat main.tf
provider "alicloud" {
  region = "ap-northeast-1"
}

resource "alicloud_vpc" "vpc" {
  name = "docker-test-vpc"
  cidr_block = "192.168.1.0/24"
}
```


次にTerraformをdocker上で起動します。
そのとき、access_key・secret_keyを渡すことでAlibabaCloudのTerraformが実行できます。また、ホストのカレントディレクトリをコンテナ上へマウント( -v $(pwd):/terraform )してファイルの共有を行います。
今後の記述するTerraformのコードはこのディレクトリに配置してコンテナと共有します。
またterraformのバージョンは過去の`0.10.1`を指定してみます。

```
docker run \
    -e access_key=<ACCESS KEY> \
    -e secret_key=<SECRET KEY> \
    -v $(pwd):/terraform \
    -w /terraform \
    -it \
    --entrypoint=ash \
    hashicorp/terraform:0.10.1
```


これが実行できたらdocker環境上に入ります。
最後に、docker内でTerraformを操作するためのコマンドを確認してみます。実行内容、結果はこのようになります。

```
/terraform # terraform version
Terraform v0.10.1

Your version of Terraform is out of date! The latest version
is 0.12.5. You can update by downloading from www.terraform.io
/terraform #
```

あとはいつもの通りに `terraform init` や `terraform plan` 、 `terraform apply` を実行するだけです。（docker環境、terraform version 0.10.1での実行になります。）

```
/terraform #
/terraform # terraform init

Initializing provider plugins...
 - Checking for available provider plugins on https://releases.hashicorp.com...
- Downloading plugin for provider "alicloud" (1.52.1)...

The following providers do not have any version constraints in configuration,
so the latest version was installed.

To prevent automatic upgrades to new major versions that may contain breaking
changes, it is recommended to add version = "..." constraints to the
corresponding provider blocks in configuration, with the constraint strings
suggested below.

* provider.alicloud: version = "~> 1.52"

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
/terraform #
/terraform # terraform play
Usage: terraform [--version] [--help] <command> [args]

The available commands for execution are listed below.
The most common, useful commands are shown first, followed by
less common or more advanced commands. If you're just getting
started with Terraform, stick with the common commands. For the
other commands, please read the help and docs before usage.

Common commands:
    apply              Builds or changes infrastructure
    console            Interactive console for Terraform interpolations
    destroy            Destroy Terraform-managed infrastructure
    env                Workspace management
    fmt                Rewrites config files to canonical format
    get                Download and install modules for the configuration
    graph              Create a visual graph of Terraform resources
    import             Import existing infrastructure into Terraform
    init               Initialize a Terraform working directory
    output             Read an output from a state file
    plan               Generate and show an execution plan
    providers          Prints a tree of the providers used in the configuration
    push               Upload this Terraform module to Atlas to run
    refresh            Update local state file against real resources
    show               Inspect Terraform state or plan
    taint              Manually mark a resource for recreation
    untaint            Manually unmark a resource as tainted
    validate           Validates the Terraform files
    version            Prints the Terraform version
    workspace          Workspace management

All other commands:
    debug              Debug output management (experimental)
    force-unlock       Manually unlock the terraform state
    state              Advanced state management
/terraform #
/terraform #
/terraform # terraform apply
alicloud_vpc.vpc: Creating...
  cidr_block:        "" => "192.168.1.0/24"
  name:              "" => "docker-test-vpc"
  resource_group_id: "" => "<computed>"
```


docker環境を終了する場合は`exit`を入力するだけです。
```
/terraform #
/terraform #
/terraform # exit
$
$
```



