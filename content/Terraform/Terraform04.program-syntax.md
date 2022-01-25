---
title: "04 Terraformの文法について"
metaTitle: "Alibab Cloud Terraformの文法について"
metaDescription: "Alibab Cloud Terraformの文法についてを説明します"
date: "2021-05-10"
author: "Hironobu Ohara"
thumbnail: "/images/terraform_2.2.png"
---



# はじめに
&nbsp; 前章は 簡単なWebサーバを立ち上げるというサンプルプロジェクトを実行しました。うち、Terraformには様々な記載文法がありますので、把握した方がいい部分だけ説明します。


# 1. Configuration Syntax
&nbsp; Terraformのコード構成要素、コードの構成文の書き方です。Terraformの利用ガイドラインに沿って記載してみてください。Terraformのバージョンによっては書き方が異なる場合がありますので、注意が必要です。

```
# project_nameを宣言
variable "project_name" {
}


/* alicloud_vpcを設定
　 変数project_nameを呼び出す  */
resource "alicloud_vpc" "vpc" {
  name = "${var.project_name}-vpc"
  cidr_block = "192.168.1.0/24"
}

```
* 単一行コメントは`#`をつけます。
* 複数行コメントは`/*`と`*/`で囲みます。
* 文字列は二重引用符で囲みます。
* 文字列は`${}`を使って他の構文や値を補間できます。 `${var.foo}`。
* 数字は10進数で扱います。数字の前に英数字を付けると、例えば0xでも16進数として扱われます。
* ブール値が使え、true、falseのどれかになります。
* プリミティブ型のリストは角括弧（[]）で作成できます。例：`["foo", "bar", "baz"]`
* マップは中括弧（{}）とコロン（:） で作成できます。例：`{ "foo": "bar", "bar": "baz" }`  キーが数字で始まっていない限り、キーでは引用符を省略できます。その場合は、引用符が必要です。単一行マップでは、キーと値のペアの間にコンマが必要です。複数行マップではキーと値のペアの間の改行で十分です。

[他、構成文の書き方](https://www.terraform.io/docs/configuration-0-11/syntax.html)もありますが、ひとまずは上記のを抑えれば大抵問題ないです。




# 2. Interpolation Syntax
&nbsp; 変数・関数・属性など、コード補充機能です。

* ユーザ文字列変数
var.接頭辞とそれに続く変数名を使用します。たとえば`${var.foo}` で foo変数値を補間します。

* ユーザーマップ変数
構文は`var.MAP["KEY"]`です。たとえば`${var.amis["us-east-1"]}` でマップ変数`us-east-1`、内キーの値`amis`を取得します。

* ユーザリスト変数
構文は`${var.LIST}`です。たとえば`${var.subnets}` で`subnetsリストの値`をリストとして取得します。リスト要素をindexで返すこともできます。例：`${var.subnets[idx]}`。

* リソース自身の属性
構文はself.ATTRIBUTEです。たとえば`${self.private_ip}` でそのリソースの`private_ip`を取得します。

* 他のリソースの属性
構文は`TYPE.NAME.ATTRIBUTE`です。たとえば`${aws_instance.web.id}`という名前の`aws_instance`リソースからweb属性のIDを取得できます。リソースにcount属性セットがある場合は、0から始まるインデックスを使用して個々の属性にアクセスできます。例：`${aws_instance.web.0.id}`。 splat構文を使ってすべての属性のリストを取得することもできます。例：`${aws_instance.web.*.id}`。

* データソースの属性
構文は`data.TYPE.NAME.ATTRIBUTE`です。たとえば`${data.aws_ami.ubuntu.id}`なら`aws_ami`というデータソースから`ubuntu`属性の`id`を取得します。データソースに属性セットがある場合は、のようにゼロから始まるインデックスを使用して個々の属性にアクセスできます。例：` ${data.aws_subnet.example.0.cidr_block}`。 splat構文を使ってすべての属性のリストを取得することもできます。例：` ${data.aws_subnet.example.*.cidr_block}`

* モジュールからの出力
構文は`MODULE.NAME.OUTPUT`です。たとえば`${module.foo.bar}`の場合、`foo`というモジュールの`bar`を取得します。

* カウント情報
構文は`count.FIELD`です。たとえば`${count.index}`の場合、`count`毎のインデックスらリソースを取得します。

その他、[補充機能はTerraformバージョンごとに色々追加されていますので、最新版はこちらを参照](https://www.terraform.io/docs/configuration-0-11/interpolation.html)してみてください。



# 3. 外部変数
&nbsp; 上記にも記述しましたが、RAMなどの情報を他ユーザへ渡したくない場合、別途設定ファイル `confing.tfvars` へ記載します。例えば以下の別途設定ファイル `confing.tfvars`、および実行ファイル `main.tf` があるとします。

▼ 別途設定ファイル `confing.tfvars` の中身
```
access_key = "xxxxxxxxxxxxxxxxxx"
secret_key = "xxxxxxxxxxxxxxxxxx"
region = "ap-northeast-1"
zone = "ap-northeast-1a"
```
▼ 実行ファイル `main.tf` の中身
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
```
これをコマンド実行時に「 -var-file="<ファイル名>"」引数オプションで設定ファイルを外部変数・リンクし実行します。
```
$ terraform plan -var-file="confing.tfvars"
```
すると、RAMなどアカウント情報を別ファイルに残したまま、リソース作成されます。



# 4 ローカル値
&nbsp; `locals`を使うとローカル変数が定義できます。`locals`で囲んだ変数を宣言することで、ローカル変数を使うことができます。

▼ ローカル変数の定義
```
locals {
   select_instance_type = "ecs.n4.small"
}

resource "alicloud_instance" "ECS_instance" {
  instance_name   = "ECS_instance_for_terraform"
  host_name       = "ECS_instance_for_terraform"
  instance_type   = var.select_instance_type
  image_id        = "centos_7_04_64_20G_alibase_201701015.vhd"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg.id}"]
  availability_zone = "${var.zone}"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
}
```


# 5. アウトプット
&nbsp; `output`を使うとアウトプットが定義できます。定義すると、apply実行時にターミナルで値を確認したり、リソース・モジュールから値を取得できます。

▼ アウトプット値の定義
 ```
resource "alicloud_instance" "ECS_instance" {
  instance_name   = "ECS_instance_for_terraform"
  host_name       = "ECS_instance_for_terraform"
  instance_type   = "ecs.n4.small"
  image_id        = "centos_7_04_64_20G_alibase_201701015.vhd"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg.id}"]
  availability_zone = "${var.zone}"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
}

output "ECS_instance_id" {
  value = alicloud_instance.ECS_instance.instance_type
}
```
applyすると、実行結果の最後に、作成されたインスタンスの type が出力されます。
```
$ terraform apply
.....
Outputs:
ecs.n4.small
```



# 6. 条件分岐
&nbsp; Terraformは条件分岐が使えます。先に`variable`変数を記載したあと、resource構文にて`variable`変数を選定します。例えば環境に応じてインスタンスタイプを切り替えたい場合は、以下のように書きます。

▼ 条件分岐の記載方法
```
variable "instance_pattern" {}

resource "alicloud_instance" "ECS_instance" {
  instance_name   = "ECS_instance_for_terraform"
  host_name       = "ECS_instance_for_terraform"
  instance_type   = var.instance_pattern == "dev" ? "ecs.n4.small" : "ecs.n4.2xlarge"
  image_id        = "centos_7_04_64_20G_alibase_201701015.vhd"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg.id}"]
  availability_zone = "${var.zone}"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
}
```
そのあと、実行するときは引数でenv変数を指定することで、条件分岐してくれます。
```
$ terraform plan -var-file="confing.tfvars" -var 'instance_pattern=dev'
$ terraform apply -var-file="confing.tfvars" -var 'instance_pattern=production'
```


# 7. 組み込み関数
&nbsp; Terraformからリソースを作成するときに、例えばApacheによるWebサーバを立ち上げたい場合、ECS起動後、Apacheのインストール、Webサーバ立ち上げ（httpd.service start）をする必要があります。
これらの処理を組み込み関数として、`user_data`にて外部ファイル（shell）を読み取りユーザデータとして設定することができます。

▼ Webサーバのインストールスクリプト`install.sh`
```
#!/bin/bash -ex
wget http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpm
rpm -ivh mysql-community-release-el7-5.noarch.rpm
yum -y install mysql-server httpd php php-mysql unzip
systemctl enable httpd
systemctl enable mysqld
systemctl start httpd
systemctl start mysqld
USER="root"
DATABASE="wordpress"
mysql -u $USER << EOF
CREATE DATABASE $DATABASE;
GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpress'@'localhost' IDENTIFIED BY 'qweqwe123!';
EOF
if [ ! -f /var/www/html/latest.tar.gz ]; then
cd /var/www/html
wget -c http://wordpress.org/latest.tar.gz
tar -xzvf latest.tar.gz
mv wordpress/* /var/www/html/
chown -R apache.apache /var/www/html/
chmod -R 755 /var/www/html/
fi
```
これをuser_dataに入れて実行すると、install.shファイルを読み込み、Apacheをインストール、Webサーバを立ち上げてくれます。

▼ Webサーバのインストールスクリプトを読み込み、Webサーバを立ち上げてくれます
```
resource "alicloud_instance" "ECS_instance" {
  instance_name   = "ECS_instance_for_terraform"
  host_name       = "ECS_instance_for_terraform"
  instance_type   = var.instance_pattern == "dev" ? "ecs.n4.small" : "ecs.n4.2xlarge"
  image_id        = "centos_7_04_64_20G_alibase_201701015.vhd"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg.id}"]
  availability_zone = "${var.zone}"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
  user_data     = file("./install.sh")
}
```



# 8. Countによる複数のリソース作成
&nbsp; Terraformからリソースを作成するときに、同じ構成を複数台作成したい場合は、Countメタ変数を使うことで複数台作成することができます。

```
resource "alicloud_instance" "ECS_instance" {
  instance_name   = "ECS_instance_for_terraform"
  host_name       = "ECS_instance_for_terraform"
  instance_type   = var.instance_pattern == "dev" ? "ecs.n4.small" : "ecs.n4.2xlarge"
  image_id        = "centos_7_04_64_20G_alibase_201701015.vhd"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg.id}"]
  availability_zone = "${var.zone}"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
  user_data     = file("./install.sh")
}
```


またCountを使えば、Map形式で複数宣言してる変数からkeyを指定して処理することもできます。
```
variable "cidr_block_ips" {
  default = {
    "0" = "192.168.1.0/24"
    "1" = "192.168.2.0/24"
    "2" = "192.168.3.0/24"
  }
}

resource "alicloud_vpc" "vpc" {
  count = "3"
  cidr_block = "${lookup(var.cidr_block_ips, count.index)}"
  ・・・
}
```


配列もCountを使って処理することもできます。
```
variable "ecs_name" {
  default = ["Web", "App", "Log"]
}

resource "alicloud_instance" "ECS_instance" {
  count = "3"
  instance_name   = "ECS_instance-${var.ecs_name[count.index]}"
　 ・・・
}
```











