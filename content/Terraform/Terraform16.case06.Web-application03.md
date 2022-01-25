---
title: "オートスケーリングするWebアプリケーションの構築"
metaTitle: "Alibab Cloud TerraformによるオートスケーリングするWebアプリケーションの構築"
metaDescription: "Alibab Cloud TerraformによるオートスケーリングするWebアプリケーションの構築方法を説明します"
date: "2021-05-10"
author: "Hironobu Ohara"
thumbnail: "/images/terraform_23.1.png"
---

# オートスケーリングするWebアプリケーションの構築

&nbsp; こちらはAlibabaCloud公式サイトにある[ソリューション構築例](http://alicloud-common.oss-ap-southeast-1.aliyuncs.com/Updated_Materials/One%20Pager%20-%20Auto%20Scaling.pdf?spm=a3c0i.8269155.598512.5.26b5718fXnIJCz&file=One%20Pager%20-%20Auto%20Scaling.pdf)を通じての紹介になります。

プロビジョニング済みのECSインスタンスをメインとするWebアプリケーションにて、予測が難しいトラフィックニーズに応じて、必要なECSインスタンス台数を増減してくれます。これにより、アプリケーションを止めることなく稼働し続けることが出来ます。同時にリソースに応じた需要増/減から必要なコスト管理も実現出来ます。


* アプリケーションの稼働時間・堅牢性向上
* サーバーの自動プロビジョニング
* ニーズに応じたコスト管理


# 構成図

&nbsp; TerraformでWebアプリケーションを作ってみます。ゴールの構成図は以下の通りです。

![図 1](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/Terraform/images/terraform_23.1.png)


# パラメータ構成

それぞれのパラメータは以下の通りです。

ネットワーク構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_vpc|vpc|vpc_name|任意|${var.project_name}-vpc|VPC の名称。この例の場合、accelerated-content-delivery-for-terraform-vpc として表示されます。|
||vpc|cidr_block|必須|192.168.0.0/16|VPC の CIDR ブロック|
||vpc|description|任意|VPC for ${var.project_name}|VPC の説明。この場合VPC for accelerated-content-delivery-for-terraform として表示されます。|
|alicloud_vswitch|web|vswitch_name|任意|${var.project_name}-web-vswitch    |vswitch の名称。この例の場合、accelerated-content-delivery-for-terraform-web-vswitch として表示されます。|
||web|vpc_id|必須|${alicloud_vpc.vpc.id}|アタッチするVPCのID|
||web|cidr_block|必須|192.168.1.0/24|vswitch の CIDR ブロック|
||web|zone_id|必須|${var.zone}|使用するアベイラビリティゾーン|
||web|description|任意|Enable Web-Application web vswitch|vswitch の説明。|
|alicloud_vswitch|app|vswitch_name|任意|${var.project_name}-app-vswitch    |vswitch の名称。この例の場合、accelerated-content-delivery-for-terraform-app-vswitch として表示されます。|
||app|vpc_id|必須|${alicloud_vpc.vpc.id}|アタッチするVPCのID|
||app|cidr_block|必須|192.168.2.0/24|vswitch の CIDR ブロック|
||app|zone_id|必須|${var.zone}|使用するアベイラビリティゾーン|
||app|description|任意|Enable Web-Application app vswitch|vswitch の説明。|
|alicloud_vswitch|db|vswitch_name|任意|${var.project_name}--db-vswitch    |vswitch の名称。この例の場合、accelerated-content-delivery-for-terraform-db-vswitch として表示されます。|
||db|vpc_id|必須|${alicloud_vpc.vpc.id}|アタッチするVPCのID|
||db|cidr_block|必須|192.168.3.0/24|vswitch の CIDR ブロック|
||db|zone_id|必須|${var.zone}|使用するアベイラビリティゾーン|
||db|description|任意|Enable Web-Application db vswitch|vswitch の説明。|


WebのECSインスタンスセキュリティグループ構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_security_group|web|name|任意|${var.web_layer_name}-sg|セキュリティグループ の名称。この例の場合、web-server_sgとして表示されます。|
||web|vpc_id|必須|${alicloud_vpc.vpc.id}|アタッチするVPCのID|
|alicloud_security_group_rule|allow_web_access|type|必須|ingress|セキュリティグループのタイプ。 ingress（受信） かegress（送信） のいずれかになります。|
||allow_web_access|ip_protocol|必須|tcp|通信プロトコル。 tcp, udp, icmp, gre, all のいずれかになります。|
||allow_web_access|nic_type|必須|intranet|ネットワークタイプ。 internet か intranet のいずれかになります。|
||allow_web_access|policy|必須|accept|許可ポリシー。 acceptか drop のいずれかになります。|
||allow_web_access|port_range|必須|${var.web_instance_port}/${var.web_instance_port}|通信プロトコルのポート範囲。値が「- 1/-1」の場合は無効になります。この場合、80/80になります。|
||allow_web_access|priority|必須|1|許可ポリシーの優先順位。|
||allow_web_access|security_group_id|必須|${alicloud_security_group.web.id}|アタッチするセキュリティグループのID|
||allow_web_access|cidr_ip|任意|0.0.0.0/0|ターゲットとなるIPアドレス。デフォルトは「0.0.0.0/0」。値が「0.0.0.0/0」の場合は無制限状態となります。|


WebのECSインスタンス構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_instance|app|instance_name|任意| ${var.web_layer_name}-${count.index}|ECSインスタンスの名称。|
||web|host_name|任意| ${var.web_layer_name}-${count.index}|ECSインスタンスのHost名称。|
||web|instance_type|必須|${var.web_instance_type}|ECSインスタンスのタイプ。|
||web|image_id|必須|${var.web_instance_image_id}|ECSインスタンスのImageID。|
||web|security_groups|必須|${alicloud_security_group.web.id}|アタッチするセキュリティグループのID。|
||web|availability_zone|必須|${var.zone}|使用するアベイラビリティゾーン。|
||web|vswitch_id|必須|${alicloud_vswitch.web.id}|アタッチするVSwitchのID。|
||web|password|任意|${var.ecs_password}|EC インスタンスのログインパスワード。|
||web|internet_max_bandwidth_out|任意|20|パブリックネットワークへの最大帯域幅。デフォルトは0ですが、0より大きい値を入れるとパブリックIPアドレスがアタッチされます。|
||web|user_data|任意|${file("${var.web_instance_user_data}")}|ECSインスタンス起動後に実行するshell内容もしくはファイル名。|



WebのSLB構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_slb_load_balancer|web|load_balancer_name|任意|${var.web_layer_name}-slb|SLBの名称。|
||web|vswitch_id|任意|${alicloud_vswitch.web.id}|アタッチするVSwitchのID。|
||web|address_type|必須|internet|SLB addressのインターネットタイプ。internetのインターネットにするか、intranetのイントラネットいずれかになります。|
||web|internet_charge_type|必須|paybytraffic|インターネットチェンジタイプ。PayByBandwidth、PayByTrafficのいずれかになります。|
||web|bandwidth|任意|5|最大帯域幅。|
||web|load_balancer_spec|任意|slb.s2.small|SLBのタイプ。今回は slb.s2.smallを選定します。|
|alicloud_slb_listener|web_listener|load_balancer_id|必須|${alicloud_slb_load_balancer.web.id}|新しいリスナーを起動するために使用されるロードバランサID。|
||web_listener|backend_port|必須|${var.web_instance_port}|Server Load Balancerインスタンスバックエンドが使用するポート。|
||web_listener|frontend_port|必須|${var.web_instance_port}|Server Load Balancerインスタンスフロントエンドが使用するポート。|
||web_listener|health_check_type|任意|tcp|ヘルスチェックが使用するポート。health_check_typeの代わりに使用することも可能です。|
||web_listener|protocol|必須|http|使用するプロトコル。http、https、tcp、udpのいずれかになります。|
||web_listener|bandwidth|任意|5|Listenerの最大帯域幅。|
|alicloud_slb_attachment|web|load_balancer_id|必須|${alicloud_slb_load_balancer.web.id}|ロードバランサID。|
||web|instance_ids|必須|${alicloud_instance.web.*.id}|アタッチするECSインスタンスID。|


WebのAutoScaling構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_ess_scaling_group|web|scaling_group_name|任意|${var.solution_name}-ess-web|スケーリンググループ名称。|
||web|min_size|必須|${var.web_instance_min_count}|ECSインスタンスのスケーリング最小数。|
||web|max_size|必須|${var.web_instance_max_count}|ECSインスタンスのスケーリング最大数。|
||web|removal_policies|必須|OldestInstance, NewestInstance|スケーリング削除ポリシー。OldestInstance、NewestInstance、OldestScalingConfigurationのどれかと組み合わせて選定になります。|
||web|loadbalancer_ids|任意|${alicloud_slb_load_balancer.web.id}|SLBを利用する場合、アタッチするSLBインスタンスID。|
||web|vswitch_ids|必須|${alicloud_vswitch.web.id}|アタッチするVSwitchのID。|
|alicloud_ess_scaling_configuration|web|scaling_group_id|必須|${alicloud_ess_scaling_group.web.id}|アタッチするスケーリンググループのID。|
||web|image_id|必須|${var.web_instance_image_id}|ECSインスタンスのImageID。|
||web|instance_type|任意|${var.web_instance_type}|ECSインスタンスのリソースタイプ。|
||web|scaling_configuration_name|任意|scaling-configuration-web|スケジュール済みタスクに表示される名称。デフォルト値はScalingConfigurationIdです。|
||web|system_disk_category|任意|cloud_efficiency|システムディスクのカテゴリ。|
||web|security_group_id|任意|${alicloud_security_group.web.id}|アタッチするセキュリティグループのID|
||web|active|任意|true|現在のスケーリング設定をアクティブにするか。|
|alicloud_ess_scaling_rule|web|scaling_rule_name|必須|${var.solution_name}-ess-rule-web|スケールルールに表示される名称。|
||web|scaling_group_id|必須|${alicloud_ess_scaling_group.web.id}|スケーリンググループのID。|
||web|adjustment_type|必須|TotalCapacity|スケーリングルールの調整モード。QuantityChangeInCapacity、PercentChangeInCapacity、TotalCapacityのいずれかになります。|
||web|adjustment_value|任意|2|スケーリングルールの調整値。|
||web|cooldown|任意|60|スケーリングルールのクールダウン時間。|


AppのECSインスタンスセキュリティグループ構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_security_group|app|name|任意|${var.app_layer_name}-sg|セキュリティグループ の名称。この例の場合、app-server_sgとして表示されます。|
||app|vpc_id|必須|${alicloud_vpc.vpc.id}|アタッチするVPCのID|
|alicloud_security_group_rule|allow_app_access|type|必須|ingress|セキュリティグループのタイプ。 ingress（受信） かegress（送信） のいずれかになります。|
||allow_app_access|ip_protocol|必須|tcp|通信プロトコル。 tcp, udp, icmp, gre, all のいずれかになります。|
||allow_app_access|nic_type|必須|intranet|ネットワークタイプ。 internet か intranet のいずれかになります。|
||allow_app_access|policy|必須|accept|許可ポリシー。 acceptか drop のいずれかになります。|
||allow_app_access|port_range|必須|${var.app_instance_port}/${var.app_instance_port}|通信プロトコルのポート範囲。値が「- 1/-1」の場合は無効になります。この場合、80/80になります。|
||allow_app_access|priority|必須|1|許可ポリシーの優先順位。|
||allow_app_access|security_group_id|必須|${alicloud_security_group.app.id}|アタッチするセキュリティグループのID|
||allow_app_access|cidr_ip|任意|0.0.0.0/0|ターゲットとなるIPアドレス。デフォルトは「0.0.0.0/0」。値が「0.0.0.0/0」の場合は無制限状態となります。|


AppのECSインスタンス構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_instance|app|instance_name|任意| ${var.app_layer_name}-${count.index}|ECSインスタンスの名称。|
||app|host_name|任意| ${var.app_layer_name}-${count.index}|ECSインスタンスのHost名称。|
||app|instance_type|必須|${var.app_instance_type}|ECSインスタンスのタイプ。|
||app|image_id|必須|${var.app_instance_image_id}|ECSインスタンスのImageID。|
||app|security_groups|必須|${alicloud_security_group.app.id}|アタッチするセキュリティグループのID。|
||app|availability_zone|必須|${var.zone}|使用するアベイラビリティゾーン。|
||app|vswitch_id|必須|${alicloud_vswitch.app.id}|アタッチするVSwitchのID。|
||app|password|任意|${var.ecs_password}|EC インスタンスのログインパスワード。|
||app|internet_max_bandwidth_out|任意|5|パブリックネットワークへの最大帯域幅。デフォルトは0ですが、0より大きい値を入れるとパブリックIPアドレスがアタッチされます。|
||app|user_data|任意|${file("${var.app_instance_user_data}")}|ECSインスタンス起動後に実行するshell内容もしくはファイル名。|


AppのSLB構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_slb_load_balancer|app|load_balancer_name|任意|${var.app_layer_name}-slb|SLBの名称。|
||app|vswitch_id|任意|${alicloud_vswitch.web.id}|アタッチするVSwitchのID。|
||app|address_type|必須|intranet|SLB addressのインターネットタイプ。internetのインターネットにするか、intranetのイントラネットいずれかになります。|
||app|internet_charge_type|必須|paybytraffic|インターネットチェンジタイプ。PayByBandwidth、PayByTrafficのいずれかになります。|
||app|bandwidth|任意|5|最大帯域幅。|
||app|load_balancer_spec|任意|slb.s2.small|SLBのタイプ。今回は slb.s2.smallを選定します。|
|alicloud_slb_listener|app_listener|load_balancer_id|必須|${alicloud_slb_load_balancer.app.id}|新しいリスナーを起動するために使用されるロードバランサID。|
||app_listener|backend_port|必須|${var.web_instance_port}|Server Load Balancerインスタンスバックエンドが使用するポート。|
||app_listener|frontend_port|必須|${var.web_instance_port}|Server Load Balancerインスタンスフロントエンドが使用するポート。|
||app_listener|health_check_type|任意|tcp|ヘルスチェックが使用するポート。health_check_typeの代わりに使用することも可能です。|
||app_listener|protocol|必須|tcp|使用するプロトコル。http、https、tcp、udpのいずれかになります。|
||app_listener|bandwidth|任意|5|Listenerの最大帯域幅。|
|alicloud_slb_attachment|app|load_balancer_id|必須|${alicloud_slb_load_balancer.app.id}|ロードバランサID。|
||app|instance_ids|必須|${alicloud_instance.app.*.id}|アタッチするECSインスタンスID。|


AppのAutoScaling構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_ess_scaling_group|app|scaling_group_name|任意|${var.solution_name}-ess-app|スケーリンググループ名称。|
||app|min_size|必須|${var.app_instance_min_count}|ECSインスタンスのスケーリング最小数。|
||app|max_size|必須|${var.app_instance_max_count}|ECSインスタンスのスケーリング最大数。|
||app|removal_policies|必須|OldestInstance, NewestInstance|スケーリング削除ポリシー。OldestInstance、NewestInstance、OldestScalingConfigurationのどれかと組み合わせて選定になります。|
||app|loadbalancer_ids|任意|${alicloud_slb_load_balancer.app.id}|SLBを利用する場合、アタッチするSLBインスタンスID。|
||app|vswitch_ids|必須|${alicloud_vswitch.app.id}|アタッチするVSwitchのID。|
|alicloud_ess_scaling_configuration|app|scaling_group_id|必須|${alicloud_ess_scaling_group.app.id}|アタッチするスケーリンググループのID。|
||app|image_id|必須|${var.app_instance_image_id}|ECSインスタンスのImageID。|
||app|instance_type|任意|${var.app_instance_type}|ECSインスタンスのリソースタイプ。|
||app|scaling_configuration_name|任意|scaling-configuration-app|スケジュール済みタスクに表示される名称。デフォルト値はScalingConfigurationIdです。|
||app|system_disk_category|任意|cloud_efficiency|システムディスクのカテゴリ。|
||app|security_group_id|任意|${alicloud_security_group.app.id}|アタッチするセキュリティグループのID|
||app|active|任意|true|現在のスケーリング設定をアクティブにするか。|
|alicloud_ess_scaling_rule|app|scaling_rule_name|必須|${var.solution_name}-ess-rule-app|スケールルールに表示される名称。|
||app|scaling_group_id|必須|${alicloud_ess_scaling_group.app.id}|スケーリンググループのID。|
||app|adjustment_type|必須|TotalCapacity|スケーリングルールの調整モード。QuantityChangeInCapacity、PercentChangeInCapacity、TotalCapacityのいずれかになります。|
||app|adjustment_value|任意|2|スケーリングルールの調整値。|
||app|cooldown|任意|60|スケーリングルールのクールダウン時間。|


RDS構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_db_instance|db_instance|engine|必須|${var.db_engine}|データベースタイプ。MySQL、SQLServer、PostgreSQL、PPASのいずれかになります。|
||db_instance|engine_version|必須|${var.db_engine_version}|データベースのバージョン。|
||db_instance|instance_type|必須|${var.db_instance_type}|DBインスタンスタイプ。|
||db_instance|instance_storage|必須|${var.db_instance_storage}|DBインスタンスのストレージ領域。|
||db_instance|vswitch_id|必須|${alicloud_vswitch.db.id}|アタッチするVSwitchのID。|
||db_instance|security_ips|任意|10.0.2.0/24|データベースへのアクセスが許可されているIPアドレスのリスト。|
|alicloud_db_database|default|name|必須|${var.db_layer_name}|RDSの名称。この例の場合、RDS-Sample-for-Terraform として表示されます。|
||default|instance_id|必須|${alicloud_db_instance.db_instance.id}|データベースを実行するインスタンスのID。|
||default|character_set|必須|utf8|文字セット。|
|alicloud_db_account|default|db_instance_id|必須|${alicloud_db_instance.db_instance.id}|データベースを実行するインスタンスのID。|
||default|account_name|必須|${var.db_user}|運用アカウント名。|
||default|account_password|必須|${var.db_password}|運用アカウント名に対するパスワード。|
|alicloud_db_account_privilege|default|instance_id|必須|${alicloud_db_instance.db_instance.id}|データベースを実行するインスタンスのID。|
||default|account_name|必須|${alicloud_db_account.default.name}|運用アカウント名。|
||default|db_names|必須|${alicloud_db_database.default.name}|データベース名。|
||default|privilege|必須|ReadWrite|アクセス権限。ReadOnly、ReadWriteのいずれかになります。|
|alicloud_db_connection|default|instance_id|必須|${alicloud_db_instance.db_instance.id}|データベースを実行するインスタンスのID。|
||default|connection_prefix|必須|alicloud-database|インターネット接続プレフィックス。|
||default|port|任意|3306|インターネット接続ポート。|


CDN構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_cdn_domain_new|domain|domain_name|必須|terraform.test.webapplication.net|ドメインの名称。|
||domain|cdn_type|必須|web|CDNのタイプ。web、download、videoのいずれかになります。|
||domain|scope|必須|overseas|CDNドメインの範囲。domestic、overseas、globalのいずれかになります。|
||domain|sources|必須|${alicloud_slb_load_balancer.web.address}|高速ドメインの送信元アドレスリスト。　リストタイプで記載。|
|alicloud_cdn_domain_config|config|domain_name|必須|${alicloud_cdn_domain_new.domain.domain_name}|ドメインの名称。|
||config|function_name|必須|ip_allow_list_set|ドメイン設定の名前。|
||config|function_args|必須|ip_list,${alicloud_slb_load_balancer.web.address}|ドメイン構成の引数。|


OSS構成:


|リソース|リソース名|パラメータ|必須|設定値|内容|
|---|---|---|---|---|---|
|alicloud_oss_bucket|oss|bucket|任意|${var.project_name}-bucket|バケットの名称。|
||oss|acl|任意|private|アクセス制御リスト（ACL）の権限設定。|


# ソース


ソースは以下になります。

**注意として、OSSのbucket名およびdomainは（他ユーザ含め）まだ使われてないユニーク名が必須となっていますので、各自オリジナル名称へ変更するなど調整してください。**



main.tf

```
provider "alicloud" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}

resource "alicloud_vpc" "default" {
  vpc_name    = "${var.project_name}-vpc"
  cidr_block  = "192.168.0.0/16"
  description = "VPC for ${var.project_name}"
}

resource "alicloud_vswitch" "web" {
  vswitch_name      = "${var.project_name}-web-vswitch"
  description       = "Enable Web-Application web vswitch"
  vpc_id            = "${alicloud_vpc.default.id}"
  cidr_block        = "192.168.1.0/24"
  zone_id           = "${var.zone}"
}

resource "alicloud_vswitch" "app" {
  vswitch_name      = "${var.project_name}-app-vswitch"
  description       = "Enable Web-Application app vswitch"
  vpc_id            = "${alicloud_vpc.default.id}"
  cidr_block        = "192.168.2.0/24"
  zone_id           = "${var.zone}"
}

resource "alicloud_vswitch" "db" {
  vswitch_name      = "${var.project_name}-db-vswitch"
  description       = "Enable Web-Application db vswitch"
  vpc_id            = "${alicloud_vpc.default.id}"
  cidr_block        = "192.168.3.0/24"
  zone_id           = "${var.zone}"
}

resource "alicloud_ess_scaling_group" "web" {
  scaling_group_name = "${var.project_name}-ess-web"
  min_size           = "${var.web_instance_min_count}"
  max_size           = "${var.web_instance_max_count}"
  removal_policies   = ["OldestInstance", "NewestInstance"]
  loadbalancer_ids   = ["${alicloud_slb_load_balancer.web.id}"]
  vswitch_ids       = ["${alicloud_vswitch.web.id}"]
}

resource "alicloud_ess_scaling_configuration" "web" {
  scaling_group_id           = "${alicloud_ess_scaling_group.web.id}"
  image_id                   = "${var.web_instance_image_id}"
  instance_type              = "${var.web_instance_type}"
  scaling_configuration_name = "scaling-configuration-web"
  system_disk_category       = "cloud_efficiency"
  security_group_id          = "${alicloud_security_group.web.id}"
  active                     = true
}

resource "alicloud_ess_scaling_rule" "web" {
  scaling_rule_name = "${var.project_name}-ess-rule-web"
  scaling_group_id  = "${alicloud_ess_scaling_group.web.id}"
  adjustment_type   = "TotalCapacity"
  adjustment_value  = 2
  cooldown          = 60
}

resource "alicloud_instance" "web" {
  count                      = "${var.web_instance_count}"
  instance_name              = "${var.web_layer_name}-${count.index}"
  host_name                  = "${var.web_layer_name}-${count.index}"
  instance_type              = "${var.web_instance_type}"
  system_disk_category       = "cloud_efficiency"
  image_id                   = "${var.web_instance_image_id}"
  availability_zone          = "${var.web_availability_zone}"
  vswitch_id                 = "${alicloud_vswitch.web.id}"
  security_groups            = ["${alicloud_security_group.web.id}"]
  internet_max_bandwidth_out = 5
  password                   = "${var.ecs_password}"
  user_data                  = "${file("${var.web_instance_user_data}")}"
}

resource "alicloud_slb_load_balancer" "web" {
  load_balancer_name   = "${var.web_layer_name}-slb"
  address_type         = "internet"
  internet_charge_type = "paybytraffic"
  vswitch_id           = "${alicloud_vswitch.web.id}"
  load_balancer_spec   = "slb.s2.small"
  bandwidth            = 5
}

resource "alicloud_slb_listener" "web_listener" {
  load_balancer_id = "${alicloud_slb_load_balancer.web.id}"
  backend_port = "${var.web_instance_port}"
  frontend_port = "${var.web_instance_port}"
  protocol = "http"
  bandwidth = 5
  health_check_type = "tcp"
}


resource "alicloud_slb_attachment" "web" {
  load_balancer_id = "${alicloud_slb_load_balancer.web.id}"
  instance_ids = "${alicloud_instance.web.*.id}"
}

resource "alicloud_oss_bucket" "oss"{
  bucket = "${var.project_name}-bucket"
  acl = "private"
}

resource "alicloud_cdn_domain_new" "domain" {
  domain_name = "terraform.test.webapplication.net"
  cdn_type = "web"
  scope="overseas"
  sources {
    content = "${alicloud_slb_load_balancer.web.address}"
    type = "ipaddr"
    priority = "20"
    port = 80
    weight = "15"
  }
}

resource "alicloud_cdn_domain_config" "config" {
  domain_name = "${alicloud_cdn_domain_new.domain.domain_name}"
  function_name = "ip_allow_list_set"
  function_args {
    arg_name = "ip_list"
    arg_value = "${alicloud_slb_load_balancer.web.address}"
  }
}


resource "alicloud_security_group" "web" {
  name   = "${var.web_layer_name}-sg"
  vpc_id = "${alicloud_vpc.default.id}"
}

resource "alicloud_security_group_rule" "allow_web_access" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "${var.web_instance_port}/${var.web_instance_port}"
  priority          = 1
  security_group_id = "${alicloud_security_group.web.id}"
  cidr_ip           = "0.0.0.0/0"
}


resource "alicloud_instance" "app" {
  count                      = "${var.app_instance_count}"
  instance_name              = "${var.app_layer_name}-${count.index}"
  host_name                  = "${var.web_layer_name}-${count.index}"
  instance_type              = "${var.app_instance_type}"
  system_disk_category       = "cloud_efficiency"
  image_id                   = "${var.app_instance_image_id}"
  availability_zone          = "${var.app_availability_zone}"
  vswitch_id                 = "${alicloud_vswitch.app.id}"
  security_groups            = ["${alicloud_security_group.app.id}"]
  internet_max_bandwidth_out = 5
  password                   = "${var.ecs_password}"
  user_data                  = "${file("${var.app_instance_user_data}")}"
}

resource "alicloud_ess_scaling_group" "app" {
  scaling_group_name = "${var.project_name}-ess-app"
  min_size           = "${var.app_instance_min_count}"
  max_size           = "${var.app_instance_max_count}"
  removal_policies   = ["OldestInstance", "NewestInstance"]
  loadbalancer_ids   = ["${alicloud_slb_load_balancer.app.id}"]
  vswitch_ids       = ["${alicloud_vswitch.app.id}"]
}

resource "alicloud_ess_scaling_configuration" "app" {
  scaling_group_id           = "${alicloud_ess_scaling_group.app.id}"
  image_id                   = "${var.app_instance_image_id}"
  instance_type              = "${var.app_instance_type}"
  scaling_configuration_name = "scaling-configuration-app"
  system_disk_category       = "cloud_efficiency"
  security_group_id          = "${alicloud_security_group.app.id}"
  active                     = true
}

resource "alicloud_ess_scaling_rule" "app" {
  scaling_rule_name = "${var.project_name}-ess-rule-app"
  scaling_group_id  = "${alicloud_ess_scaling_group.app.id}"
  adjustment_type   = "TotalCapacity"
  adjustment_value  = 2
  cooldown          = 60
}

resource "alicloud_slb_load_balancer" "app" {
  load_balancer_name    = "${var.app_layer_name}-slb"
  address_type          = "intranet"
  internet_charge_type  = "paybytraffic"
  vswitch_id            = "${alicloud_vswitch.app.id}"
  load_balancer_spec    = "slb.s2.small"
  bandwidth             = 5
}

resource "alicloud_slb_listener" "app_listener" {
  load_balancer_id = "${alicloud_slb_load_balancer.app.id}"
  backend_port = "${var.app_instance_port}"
  frontend_port = "${var.app_instance_port}"
  protocol = "tcp"
  bandwidth = 5
  health_check_type = "tcp"
}

resource "alicloud_slb_attachment" "app" {
  load_balancer_id = "${alicloud_slb_load_balancer.app.id}"
  instance_ids = "${alicloud_instance.app.*.id}"
}


resource "alicloud_security_group" "app" {
  name   = "${var.web_layer_name}-sg"
  vpc_id = "${alicloud_vpc.default.id}"
}


resource "alicloud_security_group_rule" "allow_app_access" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "${var.app_instance_port}/${var.app_instance_port}"
  priority          = 1
  security_group_id = "${alicloud_security_group.app.id}"
  cidr_ip           = "0.0.0.0/0"
}

resource "alicloud_db_instance" "db_instance" {
  engine = "${var.db_engine}"
  engine_version = "${var.db_engine_version}"
  instance_type = "${var.db_instance_type}"
  instance_storage = "${var.db_instance_storage}"
  vswitch_id = "${alicloud_vswitch.db.id}"
  security_ips = ["10.0.2.0/24"]
}

resource "alicloud_db_database" "default" {
  name = "${var.db_layer_name}"
  instance_id = "${alicloud_db_instance.db_instance.id}"
  character_set = "utf8"
}

resource "alicloud_db_account" "default" {
  db_instance_id    = "${alicloud_db_instance.db_instance.id}"
  account_name      = "${var.db_user}"
  account_password  = "${var.db_password}"
}

resource "alicloud_db_account_privilege" "default" {
  instance_id = "${alicloud_db_instance.db_instance.id}"
  account_name = "${alicloud_db_account.default.name}"
  db_names = ["${alicloud_db_database.default.name}"]
  privilege = "ReadWrite"
}

resource "alicloud_db_connection" "default" {
  instance_id = "${alicloud_db_instance.db_instance.id}"
  connection_prefix = "alicloud-database"
  port = "3306"
}

```


variables.tf

```
variable "access_key" {}
variable "secret_key" {}
variable "region" {}
variable "zone" {}
variable "project_name" {}
variable "ecs_password" {}
variable "db_user" {}
variable "db_password" {}

variable "web_layer_name" {}
variable "web_instance_count" {}
variable "web_instance_min_count" {}
variable "web_instance_max_count" {}
variable "web_availability_zone" {}
variable "web_instance_type" {}
variable "web_instance_port" {}
variable "web_instance_image_id" {}
variable "web_instance_user_data" {}

variable "app_layer_name" {}
variable "app_instance_count" {}
variable "app_instance_min_count" {}
variable "app_instance_max_count" {}
variable "app_availability_zone" {}
variable "app_instance_type" {}
variable "app_instance_port" {}
variable "app_instance_image_id" {}
variable "app_instance_user_data" {}

variable "db_layer_name" {}
variable "db_availability_zone" {}
variable "db_engine" {}
variable "db_engine_version" {}
variable "db_instance_type" {}
variable "db_instance_storage" {}
```


confing.tfvars

```
access_key = "xxxxxxxxxxxxxxxx"
secret_key = "xxxxxxxxxxxxxxxx"
region = "ap-northeast-1"
zone = "ap-northeast-1a"
project_name = "accelerated-content-delivery-for-terraform"
ecs_password = "!Password2019"
db_user = "test_user"
db_password = "!Password2019"

web_layer_name = "web-server"
web_availability_zone = "ap-northeast-1a"
web_instance_count = 3
web_instance_min_count = 1
web_instance_max_count = 5
web_instance_type = "ecs.sn1ne.large"
web_instance_port = 80
web_instance_image_id = "centos_7_06_64_20G_alibase_20190218.vhd"
web_instance_user_data = "provisioning.sh"

app_layer_name = "app-server"
app_availability_zone = "ap-northeast-1a"
app_instance_count = 3
app_instance_min_count = 1
app_instance_max_count = 5
app_instance_type = "ecs.sn1ne.large"
app_instance_port = 5000
app_instance_image_id = "centos_7_06_64_20G_alibase_20190218.vhd"
app_instance_user_data = "provisioning.sh"

db_layer_name = "db-server"
db_availability_zone = "ap-northeast-1a"
db_engine = "MySQL"
db_engine_version = "5.7"
db_instance_type = "rds.mysql.s1.small"
db_instance_storage = 10
```


output.tf

```
output "slb_web_public_ip" {
  value = "${alicloud_slb_load_balancer.web.address}"
}

output "ECS_instance_app_ip" {
  value = "${alicloud_instance.app.*.public_ip}"
}

output "ECS_instance_web_ip" {
  value = "${alicloud_instance.web.*.public_ip}"
}

output "rds_host" {
  value = "${alicloud_db_instance.db_instance.connection_string}"
}
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


これで完了です。問題なく実行できたら、ECSとSLBそれぞれのIP、RDS Hostが表示されます。





