---
title: "RDSを利用したECSサーバ基盤"
metaTitle: "Alibab Cloud TerraformによるRDSを利用したECSサーバ基盤"
metaDescription: "Alibab Cloud TerraformによるRDSを利用したECSサーバ基盤の構築方法を説明します"
date: "2021-05-10"
author: "Hironobu Ohara"
thumbnail: "/images/terraform_19.1.1.png"
---

# RDSを利用したECSサーバ基盤の構築

前述、SLBを利用したECSサーバ基盤の構築が出来たら、今度はこれにRDSをアタッチしてみます。

# 構成図

&nbsp; TerraformでデータベースサービスであるRDSを作ってみます。ゴールの構成図は以下の通りです。

![図 1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_19.1.1.png)


またECSからRDS for MySQLへ接続するためにdocker-composeを使います。docker-composeはコンテナオーケストレーションの一つで、環境構築を再現するのが楽になる手法です。docker-compose.ymlファイルは以下の通りです。

```
version: '3'
services:
  # MySQL
  db:
    image: mysql:5.7
    container_name: mysql_host
    environment:
     - MYSQL_HOST='rds-sample.mysql.japan.rds.aliyuncs.com'
     - MYSQL_DATABASE='rds_setting_sample'
     - MYSQL_USER='test_user'
     - MYSQL_PASSWORD='!Password2019'
     - TZ='Asia/Tokyo'
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    volumes:
      - ./docker/db/data:/var/lib/mysql
      - ./docker/db/my.cnf:/etc/mysql/conf.d/my.cnf
      - ./docker/db/sql:/docker-entrypoint-initdb.d
    ports:
    - 3306:3306
 ```


# パラメータ構成

それぞれのパラメータは以下の通りです。

ネットワーク構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_vpc|vpc|vpc_name|任意|${var.project_name}-vpc|VPC の名称。この例の場合、RDS-Sample-for-Terraform-vpc として表示されます。|
||vpc|cidr_block|必須|192.168.1.0/24|VPC の CIDR ブロック|
||vpc|description|任意|Enable SLB-Setteing-Sample vpc|VPC の説明。|
|alicloud_vswitch|vsw|vswitch_name|任意|${var.project_name}-vswitch|vswitch の名称。この例の場合、RDS-Sample-for-Terraform-vswitch として表示されます。|
||vsw|vpc_id|必須|${alicloud_vpc.vpc.id}|アタッチするVPCのID|
||vsw|cidr_block|必須|192.168.1.0/28|vswitch の CIDR ブロック|
||vsw|zone_id|必須|${var.zone}|使用するアベイラビリティゾーン|
||vsw|description|任意|Enable RDS-Setteing-Sample vswitch|vswitch の説明。|


ECSインスタンスセキュリティグループ構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_security_group|sg|name|任意|${var.project_name}_sg"|セキュリティグループ の名称。この例の場合、RDS-Sample-for-Terraform_sgとして表示されます。|
||sg|vpc_id|必須|${alicloud_vpc.vpc.id}|アタッチするVPCのID|
||sg|description|任意|Enable SSH access via port 22|セキュリティグループ の説明。|
|alicloud_security_group_rule|allow_http|type|必須|ingress|セキュリティグループのタイプ。 ingress（受信） かegress（送信） のいずれかになります。|
||allow_http|ip_protocol|必須|tcp|通信プロトコル。 tcp, udp, icmp, gre, all のいずれかになります。|
||allow_http|nic_type|必須|intranet|ネットワークタイプ。 internet か intranet のいずれかになります。|
||allow_http|policy|必須|accept|許可ポリシー。 acceptか drop のいずれかになります。|
||allow_http|port_range|必須|80⁄80|通信プロトコルのポート範囲。値が「- 1/-1」の場合は無効になります。|
||allow_http|priority|必須|1|許可ポリシーの優先順位。|
||allow_http|security_group_id|必須|${alicloud_security_group.sg.id}|アタッチするセキュリティグループのID|
||allow_http|cidr_ip|任意|0.0.0.0/0|ターゲットとなるIPアドレス。デフォルトは「0.0.0.0/0」。値が「0.0.0.0/0」の場合は無制限状態となります。|
||allow_ssh|type|必須|ingress|セキュリティグループのタイプ。 ingress（受信） かegress（送信） のいずれかになります。|
||allow_ssh|ip_protocol|必須|tcp|通信プロトコル。 tcp, udp, icmp, gre, all のいずれかになります。|
||allow_ssh|nic_type|必須|intranet|ネットワークタイプ。 internet か intranet のいずれかになります。|
||allow_ssh|policy|必須|accept|許可ポリシー。 acceptか drop のいずれかになります。|
||allow_ssh|port_range|必須|22/22|通信プロトコルのポート範囲。値が「- 1/-1」の場合は無効になります。|
||allow_ssh|priority|必須|1|許可ポリシーの優先順位。|
||allow_ssh|security_group_id|必須|${alicloud_security_group.sg.id}|アタッチするセキュリティグループのID|
||allow_ssh|cidr_ip|任意|0.0.0.0/0|ターゲットとなるIPアドレス。デフォルトは「0.0.0.0/0」。値が「0.0.0.0/0」の場合は無制限状態となります。|


ECSインスタンス構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_instance|ECS_instance|instance_name|任意|${var.project_name}-ECS-instance|ECSインスタンスの名称。この例の場合、RDS-Sample-for-Terraform-ECS-instance として表示されます。|
||ECS_instance|host_name|任意|${var.project_name}-ECS-instance|ECSインスタンスのHost名称。この例の場合、RDS-Sample-for-Terraform-ECS-instance として表示されます。|
||ECS_instance|instance_type|必須|ecs.sn1.medium|ECSインスタンスのタイプ。今回は ecs.sn1.mediumを選定します。|
||ECS_instance|image_id|必須|centos_7_04_64_20G_alibase_201701015.vhd|ECSインスタンスのImageID。今回は centos_7_04_64_20G_alibase_201701015.vhd を選定します。|
||ECS_instance|system_disk_category|任意|cloud_efficiency|ECSインスタンスのディスクタイプ。デフォルトは cloud_efficiency です。|
||ECS_instance|security_groups|必須|”${alicloud_security_group.sg.id}”|アタッチするセキュリティグループのID|
||ECS_instance|availability_zone|必須|${var.zone}|使用するアベイラビリティゾーン|
||ECS_instance|vswitch_id|必須|${alicloud_vswitch.vsw.id}|アタッチするVSwitchのID。|
||ECS_instance|password|任意|"${var.ecs_password}"|EC インスタンスのログインパスワード。|
||ECS_instance|internet_max_bandwidth_out|任意|20|パブリックネットワークへの最大帯域幅。デフォルトは0ですが、0より大きい値を入れるとパブリックIPアドレスがアタッチされます。|
||ECS_instance|user_data|任意|"${file("provisioning.sh")}"|ECSインスタンス起動後に実行するshell内容もしくはファイル名。今回はprovisioning.shにて記載しています。|


SLB構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_slb_load_balancer|default|load_balancer_name|任意|"${var.project_name}-slb"|SLBの名称。この例の場合、RDS-Sample-for-Terraform-slb として表示されます。|
||default|vswitch_id|任意| "${alicloud_vswitch.vsw.id}"|アタッチするVSwitchのID。|
||default|address_type|必須|internet|SLB addressのインターネットタイプ。internetのインターネットにするか、intranetのイントラネットいずれかになります。|
||default|internet_charge_type|必須|paybytraffic|インターネットチェンジタイプ。PayByBandwidth、PayByTrafficのいずれかになります。|
||default|bandwidth|任意|5|最大帯域幅。|
||default|load_balancer_spec|任意|slb.s2.small|SLBのタイプ。今回は slb.s2.smallを選定します。|
|alicloud_slb_listener|http|load_balancer_id|必須| "${alicloud_slb_load_balancer.slb.id}"|新しいリスナーを起動するために使用されるロードバランサID。|
||http|backend_port|必須|80|Server Load Balancerインスタンスバックエンドが使用するポート。|
||http|frontend_port|必須|80|Server Load Balancerインスタンスフロントエンドが使用するポート。|
||http|health_check_connect_port|任意|80|ヘルスチェックが使用するポート。health_check_typeの代わりに使用することも可能です。|
||http|protocol|必須|"http"|使用するプロトコル。http、https、tcp、udpのいずれかになります。|
||http|bandwidth|任意|10|Listenerの最大帯域幅。|
||http|sticky_session|任意|"on"|セッション持続性を有効にするかどうか。on、offのいずれかになります。|
||http|sticky_session_type|任意|"insert"|Cookieを処理するためのタイプ。insertかserverのいずれかになります。|
||http|cookie|任意|"slblistenercookie"|サーバに設定されているクッキー。|
||http|cookie_timeout|任意|86400|クッキーのタイムアウト時間。|
|alicloud_slb_attachment|slb_attachment|load_balancer_id|必須|"${alicloud_slb_load_balancer.slb.id}"|ロードバランサID。|
||slb_attachment|instance_ids|必須|"${alicloud_instance.ECS_instance.*.id}"|アタッチするECSインスタンスID。|



RDS構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_db_instance|db_instance|engine|必須|"MySQL"|データベースタイプ。MySQL、SQLServer、PostgreSQL、PPASのいずれかになります。|
||db_instance|engine_version|必須|"5.7"|データベースのバージョン。|
||db_instance|instance_type|必須|"rds.mysql.t1.small"|DBインスタンスタイプ。|
||db_instance|instance_storage|必須|5|DBインスタンスのストレージ領域。|
||db_instance|vswitch_id|必須|"${alicloud_vswitch.vsw.id}"|アタッチするVSwitchのID。|
||db_instance|security_ips|任意|["192.168.1.0/28"]|インスタンスのすべてのデータベースにアクセスできるIPアドレスのリスト。今回は 192.168.1.0/28を選定します。|
|alicloud_db_database|default|name|必須|"${var.database_name}"|RDSの名称。この例の場合、RDS-Sample-for-Terraform として表示されます。|
||default|instance_id|必須|"${alicloud_db_instance.db_instance.id}"|データベースを実行するインスタンスのID。|
||default|character_set|必須|"utf8"|文字セット。|
|alicloud_db_account|default|db_instance_id|必須|"${alicloud_db_instance.db_instance.id}"|データベースを実行するインスタンスのID。|
||default|account_name|必須|"${var.db_user}"|運用アカウント名。|
||default|account_password|必須|"${var.db_password}"|運用アカウント名に対するパスワード。|
|alicloud_db_account_privilege|default|instance_id|必須|"${alicloud_db_instance.db_instance.id}"|データベースを実行するインスタンスのID。|
||default|account_name|必須|"${alicloud_db_account.default.name}"|運用アカウント名。|
||default|db_names|必須|"${alicloud_db_database.default.name}"|データベース名。|
||default|privilege|必須|"ReadWrite"|アクセス権限。ReadOnly、ReadWriteのいずれかになります。|
|alicloud_db_connection|default|instance_id|必須|"${alicloud_db_instance.db_instance.id}"|データベースを実行するインスタンスのID。|
||default|connection_prefix|必須|"rds-sample"|インターネット接続プレフィックス。|
||default|port|任意|"3306"|インターネット接続ポート。|


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
  description = "Enable RDS Setting Sample vpc"
}

resource "alicloud_vswitch" "vsw" {
  vswitch_name      = "${var.project_name}-vswitch"
  vpc_id            = "${alicloud_vpc.vpc.id}"
  cidr_block        = "192.168.1.0/28"
  zone_id           = "${var.zone}"
  description = "Enable RDS Setting Sample vswitch"
}


# DBを作成する
resource "alicloud_db_instance" "db_instance" {
  engine = "MySQL"
  engine_version = "5.7"
  instance_type = "rds.mysql.t1.small"
  instance_storage = 5
  vswitch_id = "${alicloud_vswitch.vsw.id}"
  security_ips = ["192.168.1.0/28"]
}

resource "alicloud_db_database" "default" {
  name = "${var.database_name}"
  instance_id = "${alicloud_db_instance.db_instance.id}"
  character_set = "utf8"
}

resource "alicloud_db_account" "default" {
  db_instance_id = "${alicloud_db_instance.db_instance.id}"
  account_name = "${var.db_user}"
  account_password = "${var.db_password}"
}

resource "alicloud_db_account_privilege" "default" {
  instance_id = "${alicloud_db_instance.db_instance.id}"
  account_name = "${alicloud_db_account.default.name}"
  db_names = ["${alicloud_db_database.default.name}"]
  privilege = "ReadWrite"
}

resource "alicloud_db_connection" "default" {
  instance_id = "${alicloud_db_instance.db_instance.id}"
  connection_prefix = "rds-sample"
  port = "3306"
}


resource "alicloud_security_group" "sg" {
  name   = "${var.project_name}_security_group"
  description = "Enable RDS Setting Sample security group"
  vpc_id = "${alicloud_vpc.vpc.id}"
}

resource "alicloud_security_group_rule" "allow_ssh" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "22/22"
  priority          = 1
  security_group_id = "${alicloud_security_group.sg.id}"
  cidr_ip           = "0.0.0.0/0"
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

resource "alicloud_instance" "ECS_instance" {
  instance_name   = "${var.project_name}-ECS-instance"
  host_name   = "${var.project_name}-ECS-instance"
  instance_type   = "ecs.sn1.medium"
  image_id        = "centos_7_04_64_20G_alibase_201701015.vhd"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg.id}"]
  availability_zone = "${var.zone}"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
  password = "${var.ecs_password}"
  internet_max_bandwidth_out = 20
  user_data = "${file("provisioning.sh")}"
}

resource "alicloud_slb_load_balancer" "default" {
  load_balancer_name = "${var.project_name}-slb"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
  address_type = "internet"
  internet_charge_type = "paybytraffic"
  load_balancer_spec = "slb.s2.small"
  bandwidth = 5
}

resource "alicloud_slb_listener" "http" {
  load_balancer_id = "${alicloud_slb_load_balancer.default.id}"
  backend_port              = 80
  frontend_port             = 80
  health_check_connect_port = 80
  bandwidth                 = 10
  protocol = "http"
  sticky_session = "on"
  sticky_session_type = "insert"
  cookie = "slblistenercookie"
  cookie_timeout = 86400
}

resource "alicloud_slb_attachment" "default" {
  load_balancer_id = "${alicloud_slb_load_balancer.default.id}"
  instance_ids = ["${alicloud_instance.ECS_instance.id}"]
}

data "template_file" "user_data" {
  template = "${file("provisioning.sh")}"
  vars = {
    DB_HOST_IP = "${alicloud_db_instance.db_instance.connection_string}"
    DB_NAME = "${var.database_name}"
    DB_USER = "${var.db_user}"
    DB_PASSWORD = "${var.db_password}"
  }
}

```


variables.tf

```
variable "access_key" {}
variable "secret_key" {}
variable "region" {}
variable "zone" {}
variable "project_name" {}
variable "database_name" {}
variable "ecs_password" {}
variable "db_user" {}
variable "db_password" {}
```


output.tf

```
output "ECS_instance_ip" {
  value = "${alicloud_instance.ECS_instance.*.public_ip}"
}
output "slb_ip" {
  value = "${alicloud_slb_load_balancer.default.address}"
}
output "rds_host" {
  value = "${alicloud_db_instance.db_instance.connection_string}"
}
```


confing.tfvars

```
access_key = "xxxxxxxxxxxxxxxxxxxx"
secret_key = "xxxxxxxxxxxxxxxxxxxx"
region = "ap-northeast-1"
zone = "ap-northeast-1a"
project_name = "RDS-Setting-Sample-for-Terraform"
database_name = "rds_setting_sample"
ecs_password = "!Password2019"
db_user = "test_user"
db_password = "!Password2019"
```


provisioning.sh

```
#!/bin/sh
export MYSQL_HOST=${DB_HOST_IP}
export MYSQL_DATABASE=${DB_NAME}
export MYSQL_USER=${DB_USER}
export MYSQL_PASSWORD=${DB_PASSWORD}

sudo yum install -y yum-utils unzip mysql
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum makecache fast
sudo yum install docker-ce
curl -L https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "version: '3'" >> docker-compose.yml
echo "services:" >> docker-compose.yml
echo "  # MySQL" >> docker-compose.yml
echo "  db:" >> docker-compose.yml
echo "    image: mysql:5.7" >> docker-compose.yml
echo "    container_name: mysql_host" >> docker-compose.yml
echo "    environment:" >> docker-compose.yml
echo "     - MYSQL_HOST=db_host" >> docker-compose.yml
echo "     - MYSQL_DATABASE=db_name" >> docker-compose.yml
echo "     - MYSQL_USER=db_user" >> docker-compose.yml
echo "     - MYSQL_PASSWORD=db_password" >> docker-compose.yml
echo "     - TZ='Asia/Tokyo'" >> docker-compose.yml
echo "    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci" >> docker-compose.yml
echo "    volumes:" >> docker-compose.yml
echo "      - ./docker/db/data:/var/lib/mysql" >> docker-compose.yml
echo "      - ./docker/db/my.cnf:/etc/mysql/conf.d/my.cnf" >> docker-compose.yml
echo "      - ./docker/db/sql:/docker-entrypoint-initdb.d" >> docker-compose.yml
echo "    ports:" >> docker-compose.yml
echo "    - 3306:3306" >> docker-compose.yml
sed -i "s/=db_host/='$MYSQL_HOST'/g" docker-compose.yml
sed -i "s/=db_name/='$MYSQL_DATABASE'/g" docker-compose.yml
sed -i "s/=db_user/='$MYSQL_USER'/g" docker-compose.yml
sed -i "s/=db_password/='$MYSQL_PASSWORD'/g" docker-compose.yml

sudo service docker start
docker-compose up -d

```



# 実行
&nbsp; ソースの準備ができたら実行します。

```
terraform init
terraform plan -var-file="confing.tfvars"
terraform apply -var-file="confing.tfvars"
```

これで完了です。問題なく実行できたら、ECSとSLBそれぞれのIP、DBのhostが表示されます。
DBのhostはECSから手動接続するにあたり必要なのでメモを残してください。

```
alicloud_db_account_privilege.default: Creation complete after 2m29s (ID: rm-e9b9hkm8u33h8cd3x:test_user:ReadWrite)
alicloud_db_connection.default: Creation complete after 2m32s (ID: rm-e9b9hkm8u33h8cd3x:rds-sample)
data.template_file.user_data: Refreshing state...

Apply complete! Resources: 14 added, 0 changed, 0 destroyed.

Outputs:

ECS_instance_ip = [
    47.74.52.124
]
rds_host = rm-e9b9hkm8u33h8cd3x.mysql.japan.rds.aliyuncs.com
slb_ip = 47.74.1.41
$
```


それではECSに入り、RDSへ接続してみます。先ほどのDB host名が必要になります。

```
$ ssh root@47.74.52.124
The authenticity of host '47.74.52.124 (47.74.52.124)' can't be established.
ECDSA key fingerprint is SHA256:XaQ96OPhtGZQPyQXlYin5qF+cqxS2Arle41wTqkOinE.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '47.74.52.124' (ECDSA) to the list of known hosts.
root@47.74.52.124's password:

Welcome to Alibaba Cloud Elastic Compute Service !

[root@RDS-Setting-Sample-for-Terraform-ECS-instance ~]#
[root@RDS-Setting-Sample-for-Terraform-ECS-instance ~]# mysql --version
mysql  Ver 15.1 Distrib 5.5.60-MariaDB, for Linux (x86_64) using readline 5.1
[root@RDS-Setting-Sample-for-Terraform-ECS-instance ~]#
[root@RDS-Setting-Sample-for-Terraform-ECS-instance ~]#
[root@RDS-Setting-Sample-for-Terraform-ECS-instance ~]# mysql -u test_user -p -h rm-e9b9hkm8u33h8cd3x.mysql.japan.rds.aliyuncs.com
Enter password:
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 51312248
Server version: 5.5.18.1 Source distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]>
MySQL [(none)]> exit;
Bye
[root@RDS-Setting-Sample-for-Terraform-ECS-instance ~]#

```
無事MySQLへ接続できたことを確認できました。




