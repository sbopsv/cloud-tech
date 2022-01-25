---
title: "06 Terraform Muduleについて"
metaTitle: "Terraform の Moduleについて"
metaDescription: "Terraform の Moduleについてを説明します"
date: "2021-05-10"
author: "Hironobu Ohara"
thumbnail: "/images/terraform_2.4.png"
---

# はじめに

&nbsp; これまでTerraformの書き方を学びました。しかし問題があります。それはvariableによる変数宣言が多すぎると、可読性も下がり、場合によっては何度も同じ内容を書く必要があったりします。それを防ぐために、他のプログラミング言語と同じくモジュール化があります。

# 1. Moduleとは
&nbsp; Terraformにおけるmoduleは各resourceを抽象化するためのものです。以下の例を見てみましょう。モジュール化されてないソースと、モジュール化されてないソースを見てください。

## モジュール化されてないソース

```
variable "region" { default = "ap-northeast-1" }
variable "solution_name" { default = "Web-Application-for-Terraform" }
variable "web_layer_name" { default = "Web" }
variable "web_availability_zone" { default = "a" }

resource "alicloud_instance" "web" {
  instance_name              = "${var.web_layer_name}"
  availability_zone          = "${var.region}${var.web_availability_zone}"
　・・・
　・・・
}

```

resourceの中に変数のプレースホルダを置き、さらにその変数名を variableで変数宣言し呼び出ししてしまいます。それを抑えるのがmoduleです。

## モジュール化されてるソース

```
variable "region" {
   value = "ap-northeast-1"
}
variable "solution_name" {
   value = "Web-Application-for-Terraform"
}
variable "web_layer_name" {
   value = "Web"
}
variable "web_availability_zone" {
   value = "a"
}

module {
  source = "./hoge"

  name   = "${var.name}"
  type   = "${var.type}"
}
```


モジュール化することで、共通の構成を再利用可能なコンポーネントとして利用することができます。



# 2. Module化について
&nbsp; モジュールは名前通り、リソースをまとめてテンプレート化し、呼び出すときに必要な引数だけ与えてあげれば実行できるものです。
1つのPJ配下で同じ変数を繰り返し宣言をする部分や、サービス毎にコードら記載することが多くなった時は、モジュールを使うことで、より効率的にコード作成、実行することができます。
Webサーバ立ち上げソースをベースに、モジュールを作ってみます。

▼ ベーシックなWebサーバ

```
variable "access_key" {}
variable "secret_key" {}
variable "region" {}
variable "zone" {}

provider "alicloud" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "${var.region}"
}

resource "alicloud_security_group" "sg" {
  name   = "terraform-sg"
  vpc_id = "${alicloud_vpc.vpc.id}"
}

resource "alicloud_security_group_rule" "allow_http" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "80/80"
  priority          = 1
  security_group_id = "${alicloud_security_group.sg.id}"
  cidr_ip           = "0.0.0.0/0"
}

resource "alicloud_vpc" "vpc" {
  name = "terraform-vpc"
  cidr_block = "192.168.1.0/24"
}

resource "alicloud_vswitch" "vsw" {
  vpc_id            = "${alicloud_vpc.vpc.id}"
  cidr_block        = "192.168.1.0/28"
  availability_zone = "${var.zone}"
}

resource "alicloud_eip" "eip" {
  internet_charge_type = "PayByTraffic"
}

resource "alicloud_eip_association" "eip_asso" {
  allocation_id = "${alicloud_eip.eip.id}"
  instance_id   = "${alicloud_instance.web.id}"
}

resource "alicloud_instance" "web" {
  instance_name = "terraform-ecs"
  availability_zone = "${var.zone}"
  image_id = "centos_7_3_64_40G_base_20170322.vhd"
  instance_type = "ecs.n4.small"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg.id}"]
  vswitch_id = "${alicloud_vswitch.vsw.id}"
  user_data = "${file("provisioning.sh")}"
}

```

この例から、例えばinstance_typeを他のリソースコードでも繰り返し使いたい場合、これをモジュールとして作成します。

モジュールを作成するときは階層化された別ディレクトリにする必要があります。（フォルダで親と子の関係が必須）
以下リストのようにディレクトリ構成にします。拡張子は`.tf`です。

▼ モジュールを作成するときのディレクトリ構成

```
├── basic_webserver
│ └── module.tf ・・・ モジュールを記載するファイル
└── main.tf ・・・ モジュールを利用するファイル
```

それでは上記配置した`main.tf`および`module.tf`にてソースを記載します。

▼リスト `main.tf`の中身

```
variable "instance_type" {}
variable "access_key" {}
variable "secret_key" {}
variable "region" {}
variable "zone" {}

provider "alicloud" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "${var.region}"
}

resource "alicloud_security_group" "sg" {
  name   = "terraform-sg"
  vpc_id = "${alicloud_vpc.vpc.id}"
}

resource "alicloud_security_group_rule" "allow_http" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "80/80"
  priority          = 1
  security_group_id = "${alicloud_security_group.sg.id}"
  cidr_ip           = "0.0.0.0/0"
}

resource "alicloud_vpc" "vpc" {
  name = "terraform-vpc"
  cidr_block = "192.168.1.0/24"
}

resource "alicloud_vswitch" "vsw" {
  vpc_id            = "${alicloud_vpc.vpc.id}"
  cidr_block        = "192.168.1.0/28"
  availability_zone = "${var.zone}"
}

resource "alicloud_eip" "eip" {
  internet_charge_type = "PayByTraffic"
}

resource "alicloud_eip_association" "eip_asso" {
  allocation_id = "${alicloud_eip.eip.id}"
  instance_id   = "${alicloud_instance.web.id}"
}

resource "alicloud_instance" "web" {
  instance_name = "terraform-ecs"
  availability_zone = "${var.zone}"
  image_id = "centos_7_3_64_40G_base_20170322.vhd"
  instance_type = var.instance_type
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg.id}"]
  vswitch_id = "${alicloud_vswitch.vsw.id}"
  user_data = "${file("provisioning.sh")}"
}
```

▼リスト `module.tf`の中身

```
module "webserver" {
  source        = "./basic_webserver"
  instance_type = "ecs.n4.small"
}
```

準備ができたら、`terraform get` か`terraform init`コマンドでモジュールを認識させます。それからterraform plan、applyを実行します。

```
$ terraform get
$ terraform plan -var-file="confing.tfvars" -var 'instance_pattern=dev'
$ terraform apply -var-file="confing.tfvars" -var 'instance_pattern=production'
```
これでリソースが実行されます。



