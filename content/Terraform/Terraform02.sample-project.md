---
title: "02 サンプルプロジェクトの作成"
metaTitle: "Alibab Cloud Terraform サンプルプロジェクトの作成"
metaDescription: "Alibab Cloud Terraformサンプルプロジェクトの作成方法を説明します"
date: "2021-05-10"
author: "Hironobu Ohara"
thumbnail: "/images/terraform_5.3.png"
---

# はじめに
&nbsp; ここまででTerraform のインストール方法を学びました。それではサンプルプロジェクトを作成します。簡単なWebサーバを立ち上げながら、Terraformの流れや中身を確認します。


# 1. ディレクトリ・ファイル構成
&nbsp; Terraformのファイルの拡張子は `*.tf` です。**実行時、同じディレクトリの `*.tf` ファイルがマージ**されますので、基本は以下3ファイルに分けてそれぞれの用途・目的に応じた記載・運用がベターです。
```
main.tf  … モジュールが内包するリソース、データソースなどの定義
outputs.tf  … モジュールが出力するAttributeの定義
variables.tf  … モジュールが受け取る変数の定義
```
`main.tf` には どのプロパイダを使うかを記載します。
階層化は任意ですが、.tfから別のフォルダの.tfに記載されてる変数を取り出すためにルートディレクトリを指定することがありますのでそこは注意が必要です。apply (=実行) にて分離実行することも可能です。
例えば以下のようにプロダクトサービス毎にフォルダを作成し、それぞれのリソースを作成しても、最終的には一つへまとめれます。

```
├── main.tf
├── output.tf
├── variables.tf
│
├── region
│├── VPC
││├── main.tf
││├── output.tf
││└── variables.tf
││
│├── ECS
││├── main.tf
││├── output.tf
││└── variables.tf
　・
　・
　・
```

&nbsp; RAMなど他者へ渡したくない情報がある場合、別途設定ファイル（ `confing.tfvars` など）へ記載し、実行時は -var-file引数で 設定ファイルを読み取り実行することができます。

```
├── main.tf
├── output.tf
├── variables.tf
├── confing.tfvars
│
├── region
│├── VPC
││├── main.tf
││├── output.tf
││└── variables.tf
││
│├── ECS
││├── main.tf
││├── output.tf
││└── variables.tf
　・
　・
　・
```
▼設定ファイル `confing.tfvars` の中身
```
access_key = "xxxxxxxxxxxxxxxxxx"
secret_key = "xxxxxxxxxxxxxxxxxx"
region = "ap-northeast-1"
zone = "ap-northeast-1a"
```
&nbsp; 記載した設定ファイル`confing.tfvars` を紐つけて実行するには以下のコマンドで実行します。詳細は以下にて後述します。

▼設定ファイル`confing.tfvars` を紐つけて実行する方法
```
$ terraform plan -var-file="confing.tfvars"
$ terraform apply -var-file="confing.tfvars"
```


# 2. リソースの作成
&nbsp; 事前準備として、まずは適当なディレクトリに `main.tf` というファイルを作ります。

▼リソースの作成
```
$ mkdir ECS
$ cd ECS
$ touch main.tf
```
## 2.1 HCL (HashiCorp Configuration Language)
&nbsp; Terraformのコードは HashiCorp社が設計したHCL(HashiCorp Configuration Language)という言語で実装しています。VPCやセキュリティグループ、ECSインスタンスのようなリソースは「resource」ブロックで定義します。

&nbsp; 上記 2 で作成した `main.tf` をエディタで開き、下記のように実装します。このコードはAlibaba CloudとしてVPC作成、セキュリティグループ設定、CentOS 7.4 のImageID をベースとしたECSインスタンスを作成します。

▼ECS インスタンス起動 `main.tf` の中身
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

resource "alicloud_vpc" "vpc" {
  vpc_name   = "ECS_instance_for_terraform-vpc"
  cidr_block = "192.168.1.0/24"
}

resource "alicloud_vswitch" "vsw" {
  vpc_id            = "${alicloud_vpc.vpc.id}"
  cidr_block        = "192.168.1.0/28"
  zone_id           = "${var.zone}"
}

resource "alicloud_security_group" "sg" {
  name   = "ECS_instance_for_terraform-sg"
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

resource "alicloud_instance" "ECS_instance" {
  instance_name   = "ECS_instance_for_terraform"
  host_name       = "ECS-instance-for-terraform"
  instance_type   = "ecs.sn1.medium"
  image_id        = "centos_7_04_64_20G_alibase_201701015.vhd"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg.id}"]
  availability_zone = "${var.zone}"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
  user_data = "${file("provisioning.sh")}"
}
```

&nbsp; ユーザデータ `provisioning.sh` も以下のように作成します。ECS起動後、実行してくれる処理内容になります。

▼ユーザデータ `provisioning.sh` の中身
```
#!/bin/sh
yum install -y httpd
systemctl start httpd
systemctl enable httpd
```

## 2.2 AlibabaCloudリソースの意味と説明
&nbsp; 上記リスト 2.1で作成したAlibabaCloudリソースについて説明します。Terraformに各種リソースを作成させるのは`resource`変数です。`resource`変数はリソース名と識別名を指定し、括弧の中にて実行内容を記載します。

## 2.3 variable "xxxxx" {} （外部変数）
&nbsp; RAMなどの情報を他ユーザへ渡したくない場合、別途設定ファイル `confing.tfvars` へ以下の内容を記載します。`variable`は宣言変数です。この設定ファイル`confing.tfvars` をリンクし実行した時、`confing.tfvars` の変数を外部変数として読み取ってくれます。
```
variable "access_key" {}
variable "secret_key" {}
variable "region" {}
variable "zone" {}
```

## 2.4 provider
&nbsp; TerraformはAlibabaCloudだけでなく AWSやGCP、Azureなどにも対応しています。各クラウドサービス毎に機能や構成が全く違いますが、それを抑えるのがprovider変数の役割です。provider変数は変更することができます。
```
provider "alicloud" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "${var.region}"
}
```
&nbsp; Terraformを実行するためのRAMアクセスキーおよびセキュリティキーです。こちらは別途設定ファイル `confing.tfvars` から外部変数としてリンクします。

```
access_key = "${var.access_key}"
secret_key = "${var.secret_key}"
```
&nbsp; 以下はリージョンを定義します。リージョンごとに使えるサービス・使えないサービス、機能、制限事項や仕様がありますので、必ず指定する必要があります。
```
region = "${var.region}"
```

## 2.5 VPC
&nbsp; VPCを作成するコードです。
```
resource "alicloud_vpc" "vpc" {
  vpc_name = "ECS_instance_for_terraform-vpc"
  cidr_block = "192.168.1.0/24"
}
```
&nbsp; 上記で記載したリソース以外にオプション（任意）でパラメータや構成を指定することもできます。

* `cidr_block` - （必須）VPCのCIDRブロック。この例では24bitまでをネットワーク部とする設定をしています。
* `vpc_name` - （オプション）VPCの名前。デフォルトはnullです。
* `description` - （オプション）VPCの説明。デフォルトはnullです。

&nbsp; このリソースを実行することにより、以下のVPC属性情報が出力されます。

* `id` - VPCのID。
* `cidr_block` - VPCのCIDRブロック。
* `name` - VPCの名前。
* `router_id` - VPC作成時にデフォルトで作成されたルータのID。
* `route_table_id` - VPC作成時にデフォルトで作成されたルータのルートテーブルID。

&nbsp; 詳しくは[AliCloudのterraform-VPCリファレンス](https://www.terraform.io/docs/providers/alicloud/r/vpc.html)を参照してください。

## 2.6 VPC_SWITCH
&nbsp; VPC_SWITCHを作成するコードです。
```
resource "alicloud_vswitch" "vsw" {
  vpc_id            = "${alicloud_vpc.vpc.id}"
  cidr_block        = "192.168.1.0/28"
  zone_id = "${var.zone}"
}
```
&nbsp; VPC_SWITCHも上記で記載したリソース以外にオプション（任意）でパラメータや構成を指定することもできます。

* `zone_id` - （必須）スイッチのAZ。
* `vpc_id` - （必須）VPC ID。
* `cidr_block` - （必須）スイッチのCIDR block。
* `name` - （任意）スイッチの名前。デフォルトはnullです。
* `description` - （オプション）スイッチの説明。デフォルトはnullです。

&nbsp; このリソースを実行することにより、以下のVPC_SWITCH属性情報が出力されます。

* `id` - スイッチのID
* `zone_id` スイッチのAZ
* `cidr_block` - スイッチのCIDRブロック
* `vpc_id` - VPC ID
* `name` - スイッチの名前

&nbsp; 詳しくは[AliCloudのterraform-VPC_SWITCHリファレンス](https://www.terraform.io/docs/providers/alicloud/r/vswitch.html)を参照してください。

## 2.7 セキュリティグループ
&nbsp; セキュリティグループを作成するコードです。
```
resource "alicloud_security_group" "sg" {
  name   = "ECS_instance_for_terraform-sg"
  vpc_id = "${alicloud_vpc.vpc.id}"
}
```
&nbsp; セキュリティグループも同様、上記で記載したリソース以外にオプション（任意）でパラメータや構成を指定することもできます。

* `name` - （オプション）セキュリティグループの名前。デフォルトはnullです。
* `description` - （オプション）セキュリティグループの説明。デフォルトはnullです。
* `vpc_id` - （オプション）対象のVPC IDを指定します。

&nbsp; このリソースを実行することにより、以下の属性情報が出力されます。

* `id` - セキュリティグループのID
* `name` - セキュリティグループの名前

&nbsp; 詳しくは[AliCloudのterraform-セキュリティグループ リファレンス](https://www.terraform.io/docs/providers/alicloud/r/security_group.html)を参照してください。

## 2.8 セキュリティグループルールリソース
&nbsp; 先ほどはセキュリティグループを宣言しましたが、ルールは別途記載する必要があります。セキュリティグループルールリソースを作成・実装するコードです。
```
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
```
&nbsp; セキュリティグループルールも同様、上記で記載したリソース以外にオプション（任意）でパラメータや構成を指定することもできます。

* `type` - （必須）作成中のルールの種類。有効なオプションはingress（着信）またはegress（発信）です。
* `ip_protocol` - （必須）プロトコル。することができtcp、udp、icmp、greまたはall。
* `port_range` - （必須）IPプロトコルに関連するポート番号の範囲。デフォルトは "-1 / -1"です。プロトコルがtcpまたはudpの場合、各サイドポート番号の範囲は1〜65535で、「 - 1 / -1」は無効になります。たとえば1/200、ポート番号の範囲は1〜200です。他のプロトコルport_rangeは "-1 / -1"のみであり、他の値は無効になります。
* `security_group_id` - （必須）この規則を適用するセキュリティグループ。
* `nic_type` - （オプション）ネットワークタイプのいずれinternetかintranetを指定できます。
* `internet` - （オプション）デフォルト値は`internet`です。
* `policy`- （オプション）認可ポリシーは、いずれacceptかdropになりますaccept。デフォルト値はです。
* `priority`- （オプション）許可ポリシーの優先順位。パラメータ値：1-100、デフォルト値：1。
* `cidr_ip` - （オプション）ターゲットIPアドレス範囲。デフォルト値は0.0.0.0/0です（これは制限が適用されないことを意味します）。サポートされているその他の形式は10.159.6.18/12です。IPv4のみがサポートされています。
* `source_security_group_id` - （オプション）同じリージョン内のターゲットセキュリティグループID。このフィールドを指定した場合は、nic_type選択できるだけintranetです。
* `source_group_owner_account` - （オプション）セキュリティグループがアカウント間で承認されている場合のターゲットセキュリティグループのAlibaba CloudユーザーアカウントID。このパラメータは、cidr_ipすでに設定されている場合は無効です。

&nbsp; このリソースを実行することにより、以下の属性情報が出力されます。

* `id` - セキュリティグループルールのID
* `type` - ルールのタイプ、ingressまたはegress
* `name` - セキュリティグループの名前
* `port_range` - ポート番号の範囲
* `ip_protocol` - セキュリティグループルールのプロトコル

&nbsp; 詳しくは[AliCloudのterraform-セキュリティグループルール リファレンス](https://www.terraform.io/docs/providers/alicloud/r/security_group_rule.html)を参照してください。


## 2.9 ECSインスタンスリソース
&nbsp; 先ほどはVPCやセキュリティグループを作成しました。今度はECSインスタンスを作成してみます。
```
resource "alicloud_instance" "ECS_instance" {
  instance_name   = "ECS_instance_for_terraform"
  host_name       = "ECS-instance-for-terraform"
  instance_type   = "ecs.sn1.medium"
  image_id        = "centos_7_04_64_20G_alibase_201701015.vhd"
  system_disk_category = "cloud_efficiency"
  security_groups = ["${alicloud_security_group.sg.id}"]
  availability_zone = "${var.zone}"
  vswitch_id = "${alicloud_vswitch.vsw.id}"
}
```
&nbsp; ECSインスタンス生成リソースは多くのオプション（任意）でパラメータや構成を指定できます。ECSインスタンスはVPCやセキュリティグループとは少し異なり、OSやバージョン選定、起動時データ引き渡しやECS使い捨て利用など様々な利用方法が実現出来るため、ここは抑えておきましょう。

* `image_id` - （必須）インスタンスに使用するイメージ。ECSインスタンスの画像は 'image_id'を変更することで置き換えることができます。変更されると、インスタンスは再起動して変更を有効にします。
* `instance_type` - （必須）起動するインスタンスの種類。
* `is_outdated` - （オプション）古いインスタンスタイプを使用するかどうか。デフォルトはfalseです。
* `security_groups` - （必須）関連付けるセキュリティグループIDのリスト。
* `availability_zone` - （省略可能）インスタンスを起動するゾーン。無視され、設定時に計算されvswitch_idます。
* `instance_name` - （オプション）ECSの名前。このinstance_nameは2から128文字のストリングを持つことができ、 " - "、 "。"、 "_"などの英数字またはハイフンのみを含む必要があり、ハイフンで始まったり終わったりしてはなりません。 ：//またはhttps：// 指定されていない場合、Terraformはデフォルトの名前`ECS-Instance`を自動的に生成します。
* `system_disk_category` - （オプション）有効な値はcloud_efficiency、cloud_ssdおよびcloudです。cloudI / Oに最適化されていないインスタンスにのみ使用されます。デフォルトは`cloud_efficiency`です。
* `system_disk_size` - （オプション）システムディスクのサイズ（GiB単位）。値の範囲：[20、500]。指定された値は、max {20、Imagesize}以上でなければなりません。デフォルト値：最大{40、ImageSize}。システムディスクの交換時にECSインスタンスのシステムディスクをリセットできます。
* `description` - （オプション）インスタンスの説明。この説明には2〜256文字の文字列を使用できます。http：//またはhttps：//で始めることはできません。デフォルト値はnullです。
* `internet_charge_type` - （オプション）インスタンスのインターネット料金タイプ。有効な値はPayByBandwidth、PayByTrafficです。デフォルトはPayByTrafficです。現在、 'PrePaid'インスタンスは、値を "PayByTraffic"から "PayByBandwidth"に変更することはできません。
* `internet_max_bandwidth_in` - （オプション）パブリックネットワークからの最大着信帯域幅。Mbps（Mega bit per second）で測定されます。値の範囲：[1、200]。この値が指定されていない場合は、自動的に200 Mbpsに設定されます。
* `internet_max_bandwidth_out` - （オプション）パブリックネットワークへの最大発信帯域幅。Mbps（メガビット/秒）で測定されます。値の範囲：[0、100]。デフォルトは0 Mbpsです。
* `host_name` - （任意）ECSのホスト名。2文字以上の文字列です。「hostname」は「。」または「 - 」で始めたり終わらせたりすることはできません。また、2つ以上の連続した「。」または「 - 」記号は使用できません。Windowsでは、ホスト名には最大15文字を含めることができます。これは、大文字/小文字、数字、および「 - 」の組み合わせにすることができます。ホスト名にドット（「。」）を含めることも、数字だけを含めることもできません。Linuxなどの他のOSでは、ホスト名は最大30文字で、ドット（ "。"）で区切ったセグメントにすることができます。各セグメントには、大文字/小文字、数字、または "_"を含めることができます。変更されると、インスタンスは再起動して変更を有効にします。
* `password` - （オプション）インスタンスへのパスワードは8〜30文字の文字列です。大文字と小文字、および数字を含める必要がありますが、特殊記号を含めることはできません。変更されると、インスタンスは再起動して変更を有効にします。
* `vswitch_id` - （オプション）VPCで起動する仮想スイッチID。従来のネットワークインスタンスを作成できない場合は、このパラメータを設定する必要があります。

&nbsp; このリソースを実行することにより、以下の属性情報が出力されます。出力された属性情報をベースに他のリソースを作ることも可能です。

* `id` - インスタンスID
* `availability_zone` - インスタンスを起動するゾーン。
* `instance_name` - インスタンス名
* `host_name` - インスタンスのホスト名。
* `description` - インスタンスの説明
* `status` - インスタンスのステータス。
* `image_id` - インスタンスのイメージID。
* `instance_type` - インスタンスタイプ
* `private_ip` - インスタンスのプライベートIP。
* `public_ip` - インスタンスパブリックIP。
* `vswitch_id` - インスタンスがVPCで作成された場合、この値は仮想スイッチIDです。
* `tags` - インスタンスタグは、jsonencode（item）を使って値を表示します。
* `key_name` - ECSインスタンスにバインドされているキーペアの名前。
* `role_name` - ECSインスタンスにバインドされているRAMロールの名前。
* `user_data` - ユーザーデータのハッシュ値。
* `period` - 期間を使用しているECSインスタンス。
* `period_unit` - 期間単位を使用しているECSインスタンス。
* `renewal_status` - ECSインスタンスは自動的にステータスを更新します。
* `auto_renew_period` - インスタンスの自動更新期間
* `dry_run` - 事前検出するかどうか。
* `spot_strategy` - Pay-As-You-Goインスタンスのスポット戦略
* `spot_price_limit` - インスタンスの1時間あたりの料金しきい値。

&nbsp; 他、ECSに関しては様々な入出力オプションが備わってるため、RDSやOSSなど様々なサービスと連携することも可能です。詳しくは[AliCloudのterraform-ECSインスタンス リファレンス](https://www.terraform.io/docs/providers/alicloud/r/instance.html)を参照してください。

## 2.10 他のリソースについて
&nbsp; ここまではリソースのソースコードについて説明しました。他プロダクトサービスのリソースソースコード作成については[HashiCorpによるAlibabaCloudのTerraformガイドラインを参照](https://www.terraform.io/docs/providers/alicloud/index.html)のうえ、各自作成してみてください。本ガイドラインにもいくつかのサンプルコードを準備しています。


