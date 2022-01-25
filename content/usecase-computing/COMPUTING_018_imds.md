---
title: "インスタンスメタデータのご紹介"
metaTitle: "いまさらですがインスタンスメタデータ（Instance Metadata Service）のお話をするよ❗️"
metaDescription: "いまさらですがインスタンスメタデータ（Instance Metadata Service）のお話をするよ❗️"
date: "2021-06-30"
author: "sbc_y_matsuda"
thumbnail: "/computing_images_26006613778278600/20210630094758.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## いまさらですがインスタンスメタデータ（Instance Metadata Service）のお話をするよ❗️

# はじめに


今回は ECS 利用時に使うことのできる Instance Metadata Service (インスタンスメタデータ) のお話を軽くしていきたいと思います。  
初心者向けの内容なので、この時点で何のことか大体わかる人は読まなくてもたぶん大丈夫なレベルの内容だと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613778278600/20210630094758.png "img")    


今回は単純にインスタンスメタデータの説明と簡単な使い方の紹介になります。

なぜ、いまさらインスタンスメタデータのお話をしようかと思ったかと言いますと・・・  

パブリッククラウドに慣れている人だと、だいたい何処のクラウドにも同じような機能があるので使っていると思いますが、単純に知らない人は知らんのだなー、と言う事象に遭遇したからでっす。

例えばサーバーの内部で実行する系のスクリプトなんかを作るときに、いろいろな情報が必要になると思います。  
サーバー側で管理している情報や、クラウドプラットフォーム側で持っている情報など様々ですよね。  
  

CPU、メモリ、OS情報、プライベートIP、ホスト名などの情報はサーバー側のコマンドで確認できる内容ですが、インスタンスタイプ、VPC、EIP、インスタンスIDなどはプラットフォーム側で管理している情報（メタデータ）なのでサーバー側だけでは判別ができない情報になります。  
  
このようなサーバーの内部情報を使っても取得できない情報を使ってスクリプトの処理をしたい場合に使うのが「インスタンスメタデータ」になります。

なお、全体を通して `IMDSv2` のところは今回一回置いておきます。  
Alibaba Cloud でも `Security hardening mode` として IMDSv2 に対応していますが、こちらは改めてお話しできればと思います。  
ちなみに仕様はだいぶ AWS の仕様に近い様な気がしています。

# Alibaba Cloud のインスタンスメタデータの取得方法

ではそんな「インスタンスメタデータ」を取得するにはどうすれば良いかというと、実行中のインスタンスからのみつながる特定のローカル IP アドレスにアクセスして取得します。

 Alibaba Cloud ECS では、以下のエンドポイントにアクセスすることでインスタンスのメタデータを取得する事ができます。

`http://100.100.100.200/latest/[metadata]` 

以下の様にメタデータのルートのパスを指定すると取得できるメタデータアイテムのパスが表示されます。

```
# curl http://100.100.100.200/latest/meta-data
dns-conf/
eipv4
hibernation/
hostname
image-id
instance-id
instance/
launch-index
mac
network-type
network/
ntp-conf/
owner-account-id
private-ipv4
public-keys/
ram/
region-id
serial-number
source-address
sub-private-ipv4-list
vpc-cidr-block
vpc-id
vswitch-cidr-block
vswitch-id
zone-id
```


実際のデータは以下の様に適切なURLを指定する事で取得可能です。  
本来OSの内部からはわからないプラットフォーム側で管理している情報（インスタンスタイプやリージョンID、ゾーンIDなどのメタデータ）を取得出来ることがわかります。

```
# curl http://100.100.100.200/latest/meta-data/instance/instance-type
ecs.t6-c1m1.large
```

```
# curl -s http://100.100.100.200/latest/meta-data/zone-id
ap-northeast-1b
```

Dynamic metadata という形で一部のデータを`JSON`で取得することも可能です。

```
# curl -s http://100.100.100.200/latest/dynamic/instance-identity/document
```

```
{
    "zone-id": "ap-northeast-1b",
    "serial-number": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "instance-id": "i-6we1zg3rluwsxxxxxxxxx",
    "region-id": "ap-northeast-1",
    "private-ipv4": "10.100.11.84",
    "owner-account-id": "xxxxxxxx",
    "mac": "00:16:3e:00:5a:77",
    "image-id": "centos_8_1_x64_20G_alibase_20200519.vhd",
    "instance-type": "ecs.t6-c2m1.large"
}
```

このメタデータを使ってスクリプト実行時に条件分岐に使用したり設定値に使用したりすることが可能になります。
`cloud-init` の実行時にメタデータを使っており、ホスト名やパブリックキーなどの設定値をメタデータから取得しています。


  
# Alibaba Cloud 以外のプラットフォームの場合


先にご紹介したのは Alibaba Cloud でのインスタンスメタデータの取得方法になります。  
他のプラットフォームでも同様の機能を持っていることが多いので簡単に見てみたいと思います。
  

# AWS の場合
  

AWS の場合も Alibaba と同様にインスタンスメタデータを利用する方式となります。  


> https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html


Alibaba との違いとしてはエンドポイントのIPアドレス部分になります。 
取得できるアイテムの違いなどはありますが、感覚的には同じ使い方で利用可能です。

`http://169.254.169.254/`

```
$ curl http://169.254.169.254/latest/meta-data/    
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/
events/
hibernation/
hostname
identity-credentials/
instance-action
instance-id
instance-life-cycle
instance-type
local-hostname
local-ipv4
mac
metrics/
network/
placement/
product-codes
profile
public-hostname
public-ipv4
public-keys/
reservation-id
security-groups
services/
```

インスタンスタイプの取得は Alibaba とは若干パスが異なりますがだいたい同じ感じですね。

```
$ curl http://169.254.169.254/latest/meta-data/instance-type
t2.micro
```

ゾーンIDの取得はAWS特有の要素が少し出ていますね。   
`ap-northeast-1a` などの方が馴染みがあると思いますが、これはAZ名と呼ばれるものでIDとは異なっています。  
AZ名がアカウントによって実際にどのAZ（AZ ID）に割り当てられているか変わる、というAWSの謎仕様によるものでAZを特定したい場合にはAZ IDを使用します。


```
$ curl http://169.254.169.254/latest/meta-data/placement/availability-zone-id
apne1-az4
```

AWS も Dynamic metadata という形で一部のデータを`json`で取得することが可能です。
アドレス部以下のURLは Alibaba もナゼカオナジデスネ。

```
$ curl http://169.254.169.254/latest/dynamic/instance-identity/document
```

```
{
  "accountId" : "xxxxxxxxxxxx",
  "architecture" : "x86_64",
  "availabilityZone" : "ap-northeast-1a",
  "billingProducts" : null,
  "devpayProductCodes" : null,
  "marketplaceProductCodes" : [ "aw0evgkw8e5c1q413zgy5pjce" ],
  "imageId" : "ami-06a46da680048c8ae",
  "instanceId" : "i-0c3aa0e2f48xxxxxx",
  "instanceType" : "t2.micro",
  "kernelId" : null,
  "pendingTime" : "2021-03-04T02:58:56Z",
  "privateIp" : "10.0.0.45",
  "ramdiskId" : null,
  "region" : "ap-northeast-1",
  "version" : "2017-09-30"
}
```

# Azure の場合
  

Azure も同様に Azure Instance Metadata Service というメタデータのサービスを使います。

> https://docs.microsoft.com/ja-jp/azure/virtual-machines/linux/instance-metadata-service?tabs=linux

Alibaba や AWS と少し違うのは`Metadata: true` ヘッダーが必要な事と、全体の情報が基本 `JSON` で取得になるところでしょうか。


```
curl -H Metadata:true --noproxy "*" "http://169.254.169.254/metadata/instance?api-version=2020-09-01" | jq
```

この様に全てのメタデータがJSONで取得できるのが特徴ですね。

```
{
    "compute": {
        "azEnvironment": "AzurePublicCloud",
        "customData": "",
        "isHostCompatibilityLayerVm": "false",
        "licenseType": "",
        "location": "japaneast",
        "name": "matsuda-test",
        "offer": "CentOS",
        "osProfile": {
            "adminUsername": "azureuser",
            "computerName": "matsuda-test"
        },
        "osType": "Linux",
        "placementGroupId": "",
        "plan": {
            "name": "",
            "product": "",
            "publisher": ""
        },
        "platformFaultDomain": "0",
        "platformUpdateDomain": "0",
        "provider": "Microsoft.Compute",
        "publicKeys": [
            {
                "keyData": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "path": "/home/azureuser/.ssh/authorized_keys"
            }
        ],
        "publisher": "OpenLogic",
        "resourceGroupName": "xxx-xxx",
        "resourceId": "/subscriptions/xxxxxxxxxxxxxxxxxxxxxx/resourceGroups/xxx-xxx/providers/Microsoft.Compute/virtualMachines/matsuda-test",
        "securityProfile": {
            "secureBootEnabled": "false",
            "virtualTpmEnabled": "false"
        },
        "sku": "7_9",
        "storageProfile": {
            "dataDisks": [],
            "imageReference": {
                "id": "",
                "offer": "CentOS",
                "publisher": "OpenLogic",
                "sku": "7_9",
                "version": "latest"
            },
            "osDisk": {
                "caching": "ReadWrite",
                "createOption": "FromImage",
                "diffDiskSettings": {
                    "option": ""
                },
                "diskSizeGB": "30",
                "encryptionSettings": {
                    "enabled": "false"
                },
                "image": {
                    "uri": ""
                },
                "managedDisk": {
                    "id": "/subscriptions/xxxxxxxxxxxxxxxxxxx/resourceGroups/xxx-xxx/providers/Microsoft.Compute/disks/matsuda-test_OsDisk_1_d0f5d3555d174e2e8f70728b6e3a808f",
                    "storageAccountType": "Standard_LRS"
                },
                "name": "matsuda-test_OsDisk_1_d0f5d3555d174e2e8f70728b6e3a808f",
                "osType": "Linux",
                "vhd": {
                    "uri": ""
                },
                "writeAcceleratorEnabled": "false"
            }
        },
        "subscriptionId": "xxxxxxxxxxxxxxxxxxx",
        "tags": "",
        "tagsList": [],
        "version": "7.9.2021020400",
        "vmId": "7d672da5-a80a-4a39-93db-5817ffbe835c",
        "vmScaleSetName": "",
        "vmSize": "Standard_D1_v2",
        "zone": "1"
    },
    "network": {
        "interface": [
            {
                "ipv4": {
                    "ipAddress": [
                        {
                            "privateIpAddress": "10.3.0.4",
                            "publicIpAddress": ""
                        }
                    ],
                    "subnet": [
                        {
                            "address": "10.3.0.0",
                            "prefix": "24"
                        }
                    ]
                },
                "ipv6": {
                    "ipAddress": []
                },
                "macAddress": "000D3ACEAC24"
            }
        ]
    }
}
```

# GCP の場合
  

GCP も Alibaba や AWS と同じ様なデータの帰り方ですが、少し違うの `metadata.google.internal` という内部名を使ってのアクセスである事と `Metadata-Flavor: Google` ヘッダーが必要な事でしょうか。
まぁ、名前が被せてあるだけで見てるのは `169.254.169.254` なんですけどね。

```
$ ping metadata.google.internal
PING metadata.google.internal (169.254.169.254) 56(84) bytes of data.
```

> https://cloud.google.com/compute/docs/storing-retrieving-metadata?hl=ja


```
$ curl -H "Metadata-Flavor: Google" "http://metadata.google.internal/computeMetadata/v1/instance/"
attributes/
cpu-platform
description
disks/
guest-attributes/
hostname
id
image
legacy-endpoint-access/
licenses/
machine-type
maintenance-event
name
network-interfaces/
preempted
remaining-cpu-time
scheduling/
service-accounts/
tags
virtual-clock/
zone
```

ゾーンIDを取得してみると、伏せさせて頂いていますがプロジェクトIDも取得されているのが特徴でしょうか。  
GCPの場合リソースなどはそれぞれの`プロジェクト`という区画の中に作られるのでこの様になっているのだと思われます。

```
$ curl -H "Metadata-Flavor: Google" "http://metadata.google.internal/computeMetadata/v1/instance/zone"
projects/xxxxxxxxxxxxx/zones/asia-east1-a
```


# その他
  

上にあげたもの以外にも以下の様なプラットフォームでもインスタンスメタデータを提供しています。  
傾向としてはAWS, Alibaba と同じ形式のものが多い様に見えますね。

<b>Oracle Cloud Infrastructure
</b>

Oracle は Azure と同じ様に全体のデータが JSON で取得できる様ですね。  
 
`http://169.254.169.254/opc/v1/instance/`

> https://docs.oracle.com/ja-jp/iaas/Content/Compute/Tasks/gettingmetadata.htm

<b>Tencent Cloud
</b>

`http://metadata.tencentyun.com/latest/meta-data/`

> https://intl.cloud.tencent.com/zh/document/product/213/4934

<b>DigitalOcean
</b>

`http://169.254.169.254/metadata/v1/`

> https://docs.digitalocean.com/products/droplets/how-to/retrieve-droplet-metadata/

<b>OpenStack
</b>

`http://169.254.169.254/openstack`

> https://docs.openstack.org/nova/latest/user/metadata.html



# Alibaba Cloud のインスタンスメタデータリスト

Alibaba Cloud で使用可能なメタデータは以下となります。  
<span style="color: #ff0000">2021年6月時点</span>


| Item                                                          | Description                                                                                                                                                                  |
|---------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| /meta-data/dns-conf/nameservers                               | インスタンスのドメインネームシステム（DNS）構成                                                                                                                              |
| /meta-data/hostname                                           | インスタンスのホスト名                                                                                                                                                       |
| /meta-data/instance/instance-type                             | インスタンスのインスタンスタイプ                                                                                                                                             |
| /meta-data/image-id                                           | インスタンスの作成に使用されたイメージのID                                                                                                                                   |
| /meta-data/image/market-place/product-code                    | Alibaba Cloud Marketplaceイメージの製品コード                                                                                                                                |
| /meta-data/image/market-place/charge-type                     | Alibaba Cloud Marketplaceイメージの請求方法。(サブスクリプション / 従量課金)                                                                                                 |
| /meta-data/instance-id                                        | インスタンスのID                                                                                                                                                             |
| /meta-data/mac                                                | インスタンスのMACアドレス。インスタンスが複数のNICにバインドされている場合、eth0のMACアドレスのみが表示されます                                                              |
| /meta-data/network-type                                       | インスタンスのネットワークタイプ。                                                                                           |
| /meta-data/network/interfaces/macs                            | NICのMACアドレスのリスト                                                                                                                                                     |
| /meta-data/network/interfaces/macs/[mac]/network-interface-id | NICの識別子。                                                                                                                 |
| /meta-data/network/interfaces/macs/[mac]/netmask              | NICのサブネットマスク                                                                                                                                                        |
| /meta-data/network/interfaces/macs/[mac]/vswitch-cidr-block   | NICが接続されているvSwitchのIPv4のCIDRブロック                                                                                                                               |
| /meta-data/network/interfaces/macs/[mac]/vpc-cidr-block       | NICが属するVPCのIPv4のCIDRブロック                                                                                                                                           |
| /meta-data/network/interfaces/macs/[mac]/private-ipv4s        | NICに割り当てられたプライベートIPv4アドレス                                                                                                                                  |
| /meta-data/network/interfaces/macs/[mac]/vswitch-id           | NICのセキュリティグループと同じVPCにあるvSwitchのID                                                                                                                           |
| /meta-data/network/interfaces/macs/[mac]/vpc-id               | NICのセキュリティグループが属するVPCのID                                                                                                                                     |
| /meta-data/network/interfaces/macs/[mac]/primary-ip-address   | NICのプライマリプライベートIPアドレス                                                                                                                                        |
| /meta-data/network/interfaces/macs/[mac]/gateway              | NICが属するVPCのIPv4ゲートウェイアドレス                                                                                                                                     |
| /meta-data/instance/max-netbw-egress                          | インスタンスの最大アウトバウンド内部帯域幅。単位：Kbit/s                                                                                                                     |
| /meta-data/instance/max-netbw-ingress                         | インスタンスの最大インバウンド内部帯域幅。単位：Kbit/s                                                                                                                       |
| /meta-data/private-ipv4                                       | プライマリNICのプライベートIPv4アドレス                                                                                                                                      |
| /meta-data/eipv4                                              | インスタンスのパブリックIPv4アドレス、またはプライマリNICに関連付けられたEIP                                                              |
| /meta-data/ntp-conf/ntp-servers                               | NTPサーバーのIPアドレス                                                                                                                                                      |
| /meta-data/owner-account-id                                   | インスタンスが属するAlibabaCloudアカウントのUID                                                                                                                              |
| /meta-data/public-keys                                        | インスタンスの公開鍵                                                                                                                                                         |
| /meta-data/region-id                                          | インスタンスが属するリージョンID。                                                                                                                                         |
| /meta-data/zone-id                                            | インスタンスが属するゾーンID                                                                                                                                                 |
| /meta-data/serial-number                                      | インスタンスのシリアル番号                                                                                                                                                   |
| /meta-data/source-address                                     | Linuxインスタンスのパッケージ管理ソフトウェアのソースIP、YUMまたはAPTリポジトリ                                                                                              |
| /meta-data/kms-server                                         | WindowsインスタンスKMSサーバー                                                                                                                                               |
| /meta-data/wsus-server/wu-server                              | WSUSサーバー                                                                                                                                                                 |
| /meta-data/wsus-server/wu-status-server                       | Windowsインスタンスの更新ステータスを監視するサーバー。                                                                                                                      |
| /meta-data/vpc-id                                             | インスタンスが属するVPCのID                                                                                                                                                  |
| /meta-data/vpc-cidr-block                                     | インスタンスが属するVPCのCIDRブロック                                                                                                                                        |
| /meta-data/vswitch-cidr-block                                 | インスタンスが接続されているvSwitchのCIDRブロック                                                                                                                            |
| /meta-data/vswitch-id                                         | インスタンスが接続されているvSwitchのID                                                                                                                                      |
| /meta-data/ram/security-credentials/[role-name]               | インスタンスのRAMロール用に生成されたSTSの資格情報。[role-name]パラメーターが指定されていない場合、RAMロールの名前が返されます。 |
| /meta-data/instance/spot/termination-time                     | プリエンプティブルインスタンスのOSで指定された停止時間と解放時間。例：2018-04-07T17:03:00Z.                                                                                  |
| /meta-data/instance/virtualization-solution                   | ECS仮想化ソリューション。Virt1.0およびVirt2.0がサポートされています。                                                                                                        |
| /meta-data/instance/virtualization-solution-version           | ECS仮想化ソリューションのバージョン。                                                                                                                                        |
| /maintenance/active-system-events                             | インスタンスのアクティブなシステムイベント。                                                                                                                                 |
| /dynamic/instance-identity/document                            | インスタンスのID情報を提供するインスタンスIDドキュメント。インスタンスのIDやIPアドレスなどの情報が含まれています。                                                                                                                               |
| /dynamic/instance-identity/pkcs7                             | インスタンスIDドキュメントの信頼性とコンテンツを検証するために使用されるインスタンスID署名。                                                                                                                              |
| /user-data                             | インスタンスに設定した User Data を取得します。                                                                                                     |


# おわりに

今回は Alibaba Cloud 以外のプラットフォームも交えての Instance Metadata Service (インスタンスメタデータ) のお話でした。  
各プラットフォームの場合などは調べていると細かな違いや、逆に同じ仕様だなというのが見えてきて面白いですね。

基本的な部分を紹介させて頂きましたが `IMDSv2 ` の話などは残っているので、その辺は改めて紹介できればと思います。



<CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>


