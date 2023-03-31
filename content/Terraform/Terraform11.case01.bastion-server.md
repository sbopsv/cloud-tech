---
title: "ssh踏み台サーバ"
metaTitle: "Alibab Cloud Terraformによるssh踏み台サーバ"
metaDescription: "Alibab Cloud Terraformによるssh踏み台サーバの構築方法を説明します"
date: "2021-05-10"
author: "Hironobu Ohara"
thumbnail: "/images/terraform_17.1.1.png"
---


# ssh踏み台サーバ
&nbsp; クラウド上にてEC2やOSS、RDSなどにて個人情報や外部流出したくないしたくない危険なファイルがある場合、インターネットら外部からメインサーバが見える状態は極力避けたいです。それを防ぐために様々な手段がありますが、費用対効果の高いネットワーク構造として踏み台サーバを作る方法があります。踏み台サーバーとは、インターネットに直接繋がないサーバーをSSHで接続するために経由される、セキュリティ層の役割を満たすことができるサーバーのことです。踏み台サーバを使うことで、以下のメリットがあります。


* 実行用など本番に使う各サーバに直接アクセスできないため、外部からの侵入リスクを軽減できる。
* PublicIPを実行用など本番に使う各サーバに割る必要がないため、運用における負荷を軽減できる。
* 踏み台サーバから実行用など本番に使う各サーバへのログを残せるため、不正操作を防げれる。


![イメージ図](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_17.0.0.png)


# 構成図

構成としては以下の図通りになります。

![図 1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_17.1.1.png)


&nbsp; Terraformで踏み台サーバ、本番サーバを作ってみます。ゴールの構成図は以下の通りです。

![図 2](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_17.1.2.png)




# パラメータ構成

それぞれのパラメータは以下の通りです。

|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_vpc|vpc|vpc_name|任意|${var.project_name}-vpc| VPC の名称。この例の場合、`Bastion-Server-for-Terraform-vpc` として表示されます。 |
||vpc|cidr_block|必須|192.168.1.0/24| VPC の CIDR ブロック |
||vpc|description|任意|Enable Bastion-Server vpc| VPC の説明。 |
|alicloud_vswitch|vsw|vswitch_name|任意|${var.project_name}-vswitch| vswitch の名称。この例の場合、`Bastion-Server-for-Terraform-vswitch` として表示されます。 |
||vsw|vpc_id|必須|${alicloud_vpc.vpc.id}| アタッチするVPCのID |
||vsw|cidr_block|必須|192.168.1.0/28| vswitch の CIDR ブロック |
||vsw|zone_id|必須|${var.zone}| 使用するアベイラビリティゾーン |
||vsw|description|任意|Enable Bastion-Server vswitch| vswitch の説明。 |



SSH踏み台専用セキュリティグループ構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_security_group|sg_bastion_server|name|任意|${var.project_name}_Bastion_Server| セキュリティグループ の名称。この例の場合、`Bastion-Server-for-Terraform_Bastion_Server` として表示されます。 |
||sg_bastion_server|vpc_id|必須|${alicloud_vpc.vpc.id}| アタッチするVPCのID |
||sg_bastion_server|description|任意|Enable SSH access via port 22| セキュリティグループ の説明。 |
|alicloud_security_group_rule|allow_ssh|type|必須|ingress| セキュリティグループのタイプ。 `ingress`（受信） か`egress`（送信） のいずれかになります。 |
||allow_ssh|ip_protocol|必須|tcp| 通信プロトコル。 `tcp`, `udp`, `icmp`, `gre`, `all` のいずれかになります。|
||allow_ssh|nic_type|必須|intranet| ネットワークタイプ。 `internet` か `intranet` のいずれかになります。 |
||allow_ssh|policy|必須|accept| 許可ポリシー。 `accept`か `drop` のいずれかになります。 |
||allow_ssh|port_range|必須|22/22| 通信プロトコルのポート範囲。値が「- 1/-1」の場合は無効になります。 |
||allow_ssh|priority|必須|1| 許可ポリシーの優先順位。 |
||allow_ssh|security_group_id|必須|${alicloud_security_group.sg_bastion_server.id}| アタッチするセキュリティグループのID |
||allow_ssh|cidr_ip|任意|0.0.0.0/0| ターゲットとなるIPアドレス。デフォルトは「0.0.0.0/0」。値が「0.0.0.0/0」の場合は無制限状態となります。 |


SSH踏み台専用EC2構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_instance|ECS_instance_for_Bastion_Server|instance_name|任意|${var.project_name}-Bastion-Server-ECS-instance| ECSインスタンスの名称。この例の場合、`Bastion-Server-for-Terraform-Bastion-Server-ECS-instance` として表示されます。 |
||ECS_instance_for_Bastion_Server|host_name|任意|${var.project_name}-Bastion-Server-ECS-instance| ECSインスタンスのHost名称。この例の場合、`Bastion-Server-for-Terraform-Bastion-Server-ECS-instance` として表示されます。 |
||ECS_instance_for_Bastion_Server|instance_type|必須|ecs.sn1.medium| ECSインスタンスのタイプ。今回は `ecs.sn1.medium` を選定します。 |
||ECS_instance_for_Bastion_Server|image_id|必須|centos_7_04_64_20G_alibase_201701015.vhd| ECSインスタンスのImageID。今回は `centos_7_04_64_20G_alibase_201701015.vhd` を選定します。 |
||ECS_instance_for_Bastion_Server|system_disk_category|任意|cloud_efficiency| ECSインスタンスのディスクタイプ。デフォルトは cloud_efficiency です。 |
||ECS_instance_for_Bastion_Server|security_groups|必須|"${alicloud_security_group.sg_bastion_server.id}"|アタッチするセキュリティグループのID |
||ECS_instance_for_Bastion_Server|availability_zone|必須|${var.zone}| 使用するアベイラビリティゾーン |
||ECS_instance_for_Bastion_Server|vswitch_id|必須|${alicloud_vswitch.vsw.id}| アタッチするVSwitchのID |
||ECS_instance_for_Bastion_Server|password|任意|"!Bastion2019"| ECSインスタンスのログインパスワード。記載したくない場合は`confing.tfvars`にて記載することをお勧めします。 |
||ECS_instance_for_Bastion_Server|internet_max_bandwidth_out|任意|5| パブリックネットワークへの最大帯域幅。デフォルトは0ですが、0より大きい値を入れるとパブリックIPアドレスがアタッチされます。 |


実行サーバ専用セキュリティグループ構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_security_group|sg_production_server|name|任意|${var.project_name}_Production_Server| セキュリティグループ の名称。この例の場合、`Bastion-Server-for-Terraform_Production_Server` として表示されます。 |
||sg_production_server|vpc_id|必須|${alicloud_vpc.vpc.id}| アタッチするVPCのID |
||sg_production_server|description|任意|Marker security group for Production server| セキュリティグループ の説明。 |
|alicloud_security_group_rule|allow_http|type|必須|ingress| セキュリティグループのタイプ。 `ingress`（受信） か`egress`（送信） のいずれかになります。 |
||allow_http|ip_protocol|必須|tcp| 通信プロトコル。 `tcp`, `udp`, `icmp`, `gre`, `all` のいずれかになります。|
||allow_http|nic_type|必須|intranet| ネットワークタイプ。 `internet` か `intranet` のいずれかになります。 |
||allow_http|policy|必須|accept| 許可ポリシー。 `accept`か `drop` のいずれかになります。 |
||allow_http|port_range|必須|80/80| 通信プロトコルのポート範囲。値が「- 1/-1」の場合は無効になります。 |
||allow_http|priority|必須|1| 許可ポリシーの優先順位。 |
||allow_http|security_group_id|必須|${alicloud_security_group.sg_production_server.id}| アタッチするセキュリティグループのID |
||allow_http|cidr_ip|任意|0.0.0.0/0| ターゲットとなるIPアドレス。デフォルトは「0.0.0.0/0」。値が「0.0.0.0/0」の場合は無制限状態となります。 |
||allow_ssh_for_Bastion|type|必須|ingress| セキュリティグループのタイプ。 `ingress`（受信） か`egress`（送信） のいずれかになります。 |
||allow_ssh_for_Bastion|ip_protocol|必須|tcp| 通信プロトコル。 `tcp`, `udp`, `icmp`, `gre`, `all` のいずれかになります。|
||allow_ssh_for_Bastion|nic_type|必須|intranet| ネットワークタイプ。 `internet` か `intranet` のいずれかになります。 |
||allow_ssh_for_Bastion|policy|必須|accept| 許可ポリシー。 `accept`か `drop` のいずれかになります。 |
||allow_ssh_for_Bastion|port_range|必須|22/22| 通信プロトコルのポート範囲。値が「- 1/-1」の場合は無効になります。 |
||allow_ssh_for_Bastion|priority|必須|1| 許可ポリシーの優先順位。 |
||allow_ssh_for_Bastion|security_group_id|必須|${alicloud_security_group.sg_production_server.id}| アタッチするセキュリティグループのID |
||allow_ssh_for_Bastion|cidr_ip|任意|${alicloud_instance.ECS_instance_for_Bastion_Server.public_ip}| SSH踏み台専用サーバのみからのPort22でアクセスを許容します。 |


実行サーバ専用ECS構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_instance|ECS_instance_for_Production_Server|instance_name|必須|${var.project_name}-Production-Server-ECS-instance| ECSインスタンスの名称。この例の場合、`Bastion-Server-for-Terraform-Bastion-Server-ECS-instance` として表示されます。 |
||ECS_instance_for_Production_Server|host_name|必須|${var.project_name}-Production-Server-ECS-instance| ECSインスタンスのHost名称。この例の場合、`Bastion-Server-for-Terraform-Bastion-Server-ECS-instance` として表示されます。 |
||ECS_instance_for_Production_Server|instance_type|必須|ecs.sn1.medium| ECSインスタンスのタイプ。今回は `ecs.sn1.medium` を選定します。 |
||ECS_instance_for_Production_Server|image_id|必須|centos_7_04_64_20G_alibase_201701015.vhd| ECSインスタンスのImageID。今回は `centos_7_04_64_20G_alibase_201701015.vhd` を選定します。 |
||ECS_instance_for_Production_Server|system_disk_category|必須|cloud_efficiency| ECSインスタンスのディスクタイプ。デフォルトは cloud_efficiency です。 |
||ECS_instance_for_Production_Server|security_groups|必須|"${alicloud_security_group.sg_production_server.id}"|アタッチするセキュリティグループのID |
||ECS_instance_for_Production_Server|availability_zone|必須|${var.zone}| 使用するアベイラビリティゾーン |
||ECS_instance_for_Production_Server|vswitch_id|必須|${alicloud_vswitch.vsw.id}| アタッチするVSwitchのID |
||ECS_instance_for_Production_Server|password|任意|"!Production2019"| ECSインスタンスのログインパスワード。記載したくない場合は`confing.tfvars`にて記載することをお勧めします。 |
||ECS_instance_for_Production_Server|internet_max_bandwidth_out|任意|5| パブリックネットワークへの最大帯域幅。デフォルトは0ですが、0より大きい値を入れるとパブリックIPアドレスがアタッチされます。 |
||ECS_instance_for_Production_Server|user_data|任意|${file("provisioning.sh")}| ECSインスタンス起動直後に実行するためのユーザー定義データ。 |


# ソース

ソースは以下になります。

main.tf
```
provider "alicloud" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "${var.region}"
}

resource "alicloud_vpc" "vpc" {
  vpc_name = "${var.project_name}-vpc"
  cidr_block = "192.168.1.0/24"
  description = "Enable Bastion-Server vpc"
}

resource "alicloud_vswitch" "vsw" {
  vswitch_name = "${var.project_name}-vswitch"
  vpc_id            = "${alicloud_vpc.vpc.id}"
  cidr_block        = "192.168.1.0/28"
  zone_id = "${var.zone}"
  description = "Enable Bastion-Server vswitch"
}

# SSH踏み台専用
resource "alicloud_security_group" "sg_bastion_server" {
  name   = "${var.project_name}_Bastion_Server"
  description = "Enable SSH access via port 22"
  vpc_id = "${alicloud_vpc.vpc.id}"
}

resource "alicloud_security_group_rule" "allow_ssh" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "22/22"
  priority          = 1
  security_group_id = "${alicloud_security_group.sg_bastion_server.id}"
  cidr_ip           = "0.0.0.0/0"
}

resource "alicloud_instance" "ECS_instance_for_Bastion_Server" {
  instance_name   = "${var.project_name}-Bastion-Server-ECS-instance"
  host_name       = "${var.project_name}-Bastion-Server-ECS-instance"
  instance_type   = "ecs.sn1.medium"
  image_id        = "centos_7_04_64_20G_alibase_201701015.vhd"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg_bastion_server.id}"]
  availability_zone = "${var.zone}"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
  password = "${var.ecs_bastion_server_password}"
  internet_max_bandwidth_out = 5
}

# 実行サーバ専用
resource "alicloud_security_group" "sg_production_server" {
  name   = "${var.project_name}_Production_Server"
  description = "Marker security group for Production server"
  vpc_id = "${alicloud_vpc.vpc.id}"
}

resource "alicloud_security_group_rule" "allow_http" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "80/80"
  priority          = 1
  security_group_id = "${alicloud_security_group.sg_production_server.id}"
  cidr_ip           = "0.0.0.0/0"
}

# 実行サーバへssh接続はssh踏み台サーバのみ許容する
resource "alicloud_security_group_rule" "allow_ssh_for_Bastion" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "22/22"
  priority          = 1
  security_group_id = "${alicloud_security_group.sg_production_server.id}"
  cidr_ip           = "${alicloud_instance.ECS_instance_for_Bastion_Server.public_ip}"
}

resource "alicloud_instance" "ECS_instance_for_Production_Server" {
  instance_name   = "${var.project_name}-Production-Server-ECS-instance"
  host_name   = "${var.project_name}-Production-Server-ECS-instance"
  instance_type   = "ecs.sn1.medium"
  image_id        = "centos_7_04_64_20G_alibase_201701015.vhd"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg_production_server.id}"]
  availability_zone = "${var.zone}"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
  internet_max_bandwidth_out = 5
  password = "${var.ecs_production_server_password}"
  user_data = "${file("provisioning.sh")}"
}
```


variables.tf

```
variable "access_key" {}
variable "secret_key" {}
variable "region" {}
variable "zone" {}
variable "project_name" {}
variable "ecs_bastion_server_password" {}
variable "ecs_production_server_password" {}
```

output.tf

```
output "Bastion-Server-ECS_instance_ip" {
  value = "${alicloud_instance.ECS_instance_for_Bastion_Server.*.public_ip}"
}

output "Production-Server-ECS_instance_ip" {
  value = "${alicloud_instance.ECS_instance_for_Production_Server.*.public_ip}"
}
```

confing.tfvars

```
access_key = "xxxxxxxxxxxxxxxxx"
secret_key = "xxxxxxxxxxxxxxxxx"
region = "ap-northeast-1"
zone = "ap-northeast-1a"
project_name = "Bastion-Server-for-Terraform"
ecs_bastion_server_password = "!Bastion2019"
ecs_production_server_password = "!Production2019"
```

provisioning.sh

```
#!/bin/sh
yum install -y httpd
systemctl start httpd
systemctl enable httpd
```


# 実行

&nbsp; ソースの準備ができたら実行します。

```
terraform init
terraform plan -var-file="confing.tfvars"
terraform apply -var-file="confing.tfvars"
```


実際にssh制限してるかチェックしてみます。踏み台サーバのIPアドレスが`47.74.2.180`、本番サーバのIPアドレスが`47.74.23.29`です。
```
$ ssh root@47.74.23.29
ssh: connect to host 47.74.23.29 port 22: Operation timed out
$
$ ssh root@47.74.2.180
The authenticity of host '47.74.2.180 (47.74.2.180)' can't be established.
ECDSA key fingerprint is SHA256:nBrjlX0/9UZy5KTzt+41rVNwtZDghpdE6wTf9EQhr68.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '47.74.2.180' (ECDSA) to the list of known hosts.
root@47.74.2.180's password:

Welcome to Alibaba Cloud Elastic Compute Service !

[root@Bastion-Server-for-Terraform-Bastion-Server-ECS-instance ~]#
```

本番サーバにsshログインは出来ず、ssh踏み台サーバにsshログインできました。
それでは本番サーバに踏み台サーバからsshログインしてみます。

```
[root@Bastion-Server-for-Terraform-Bastion-Server-ECS-instance ~]# ssh root@47.74.23.29
The authenticity of host '47.74.23.29 (47.74.23.29)' can't be established.
ECDSA key fingerprint is SHA256:83on9BQWoTV1mDRgImz+1ChiiASDQnwo58SFIK6kWlU.
ECDSA key fingerprint is MD5:72:06:09:c4:33:c5:03:de:1b:20:19:40:a2:28:d6:7f.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '47.74.23.29' (ECDSA) to the list of known hosts.
root@47.74.23.29's password:

Welcome to Alibaba Cloud Elastic Compute Service !

[root@Bastion-Server-for-Terraform-Production-Server-ECS-instance ~]#
```

ログインできました。これで本番サーバに対し外部からssh接続不可といったセキュアな運用ができます。




