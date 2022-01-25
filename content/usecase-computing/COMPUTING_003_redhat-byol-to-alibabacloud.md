---
title: "Red Hat SubscriptionをECSへ"
metaTitle: "Red Hat サブスクリプション を Alibaba Cloud に持込してみた"
metaDescription: "Red Hat サブスクリプション を Alibaba Cloud に持込してみた"
date: "2019-12-26"
author: "SBC engineer blog"
thumbnail: "/computing_images_26006613488852800/20191225173936.png"
---

## Red Hat サブスクリプション を Alibaba Cloud に持込してみた

日本では、RHEL（Redhat Enterprice Linux） を採用するサービスが多いでしょう。それらのサービスをオンプレミスからクラウドに移行する際に、既存購入した RHEL サブスクリプションを、クラウド環境に持ち込みってどうする、といった課題もよくありますね。

この記事では、Alibaba Cloud ECS イメージ機能を用いて、RHEL（Red Hat Enterprise Linux）のサブスクリプションを Alibaba Cloud ECSに持ち込む方法を紹介したいと思います。

## 大体の流れ

今回は、Alibaba Cloud ECS イメージ Import/Export 機能を利用して、オフラインで準備した仮想マシンのイメージを Alibaba Cloud ECS にインポートし、RHELを内蔵した ECS インスタンスの作成用「カスタムイメージ」にします。Alibaba Cloud ECS イメージ Import 機能が対応した仮想マシンイメージフォーマットは RAW、VHD、または QCOW2 となります。

この手順では、以下の流れで実施します：

1. Red Hat Cloud Access を Alibaba Cloud アカウントと紐付
2. VirtualBox を用いて、RHEL イメージを作成
3. ECS イメージインポート機能を対応するフォーマットへ交換（OVA -> QCOW2）
4. OSS にイメージファイルをアップロードし、ECS にインポート
5. RHEL インスタンス作成、動作確認

## 事前準備

有効な RHEL サブスクリプションの他に、以下のツールが必要となります：

1. Virtual Box。この記事ではバージョン 6.0.14 r133895 を使います。
2. qemu-img。Virtual Box が扱うフォーマットを QCOW2 フォーマットに交換するためのツールとなります。
3. RHEL の ISO イメージ（Virtual Box のマシン用）

## Red Hat Cloud Access を Alibaba Cloud アカウントと紐付

Red Hat Cloud Access については [ここでご参考ください](https://access.redhat.com/articles/4544781)。Red Hat 管理画面にログインし、[Red Hat Cloud Access](https://access.redhat.com/management/cloud) へアクセスできます。「Enable a new provider」をクリックして、ドロップダウンから「Alibaba Cloud」が選択できます。Alibaba Cloud を選択すると、Alibaba Cloud と紐付ける必要な情報が要求されます。

![Red Hat Cloud Access + Alibaba Cloud](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613488852800/20191225152422.png "Red Hat Cloud Access を Alibaba Cloud UID と紐付ける")

情報を入力してから、「有効化」ボタンをクリックするとこのステップが完了します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613488852800/20191225153002.png "img")

## RHEL 仮想マシンをインストールし、初期設定する

Red Hat 管理画面へログインした後、RHEL の ISO イメージがダウンロードできます。今回は RHEL 7.6 を使って、イメージを作ります。まずはダウンロードした ISO イメージを用いて、VirtualBoxの仮想マシンに Red Hat をインストールします。

![VirtualBox の仮想マシンに Red Hat 7.6 をインストールします](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613488852800/20191225165923.png "VirtualBox の仮想マシンに Red Hat 7.6 をインストールします")


※注意点：Red Hat をインストールする際に、「ベース環境」の設定ができます。ここでは、「最小限のインストール」がデフォルトになりますが、この手順では他のツールが必要になるので、「インフラストラクチャーサーバー」を選びます。

Red Hat をインストールした後に、仮想マシンを起動して、以下のコマンドを実行する必要があります：

```shell
# VirtualBoxのネットワークはNATで設定し、Redhat側のインターフェースを有効する
$ nmcli connection modify enp0s3 connection.autoconnect yes

# インストールしたマシンを Red Hat登録する
$ subscription-manager register --username <Red Hat 管理画面のユーザID> --password <Red Hat 用パスワード>

# Red Hat のサブスクリプションをアタッチする
$ subscription-manager attach --auto

# Red Hat のリポジトリーを有効化
$ subscription-manager repos --enable rhel-7-server-rpms

# /etc/shadowの権限変更
$ chattr +i /etc/shadow

# sshを有効化
$ systemctl start sshd.service

# ntpを有効化
$ yum install ntp
$ systemctl enable ntpd
$ cp /etc/ntp.conf /etc/ntp.conf.bk
$ vi /etc/ntp.conf
```

`/etc/ntp.conf` の既存の中身を全部削除し、以下の内容に変更する：

```
 driftfile  /var/lib/ntp/drift
 pidfile    /var/run/ntpd.pid
 logfile    /var/log/ntp.log
 # Access Control Support
 restrict    default kod nomodify notrap nopeer noquery
 restrict -6 default kod nomodify notrap nopeer noquery
 restrict 127.0.0.1
 restrict 192.168.0.0 mask 255.255.0.0 nomodify notrap nopeer noquery
 restrict 172.16.0.0 mask 255.240.0.0 nomodify notrap nopeer noquery
 restrict 100.64.0.0 mask 255.192.0.0 nomodify notrap nopeer noquery
 restrict 10.0.0.0 mask 255.0.0.0 nomodify notrap nopeer noquery
 # local clock
 server 127.127.1.0
 fudge  127.127.1.0 stratum 10
 restrict ntp1.aliyun.com nomodify notrap nopeer noquery
 restrict ntp1.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp10.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp11.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp12.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp2.aliyun.com nomodify notrap nopeer noquery
 restrict ntp2.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp3.aliyun.com nomodify notrap nopeer noquery
 restrict ntp3.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp4.aliyun.com nomodify notrap nopeer noquery
 restrict ntp4.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp5.aliyun.com nomodify notrap nopeer noquery
 restrict ntp5.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp6.aliyun.com nomodify notrap nopeer noquery
 restrict ntp6.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp7.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp8.cloud.aliyuncs.com nomodify notrap nopeer noquery
 restrict ntp9.cloud.aliyuncs.com nomodify notrap nopeer noquery
 server ntp1.aliyun.com iburst minpoll 4 maxpoll 10
 server ntp1.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp10.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp11.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp12.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp2.aliyun.com iburst minpoll 4 maxpoll 10
 server ntp2.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp3.aliyun.com iburst minpoll 4 maxpoll 10
 server ntp3.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp4.aliyun.com iburst minpoll 4 maxpoll 10
 server ntp4.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp5.aliyun.com iburst minpoll 4 maxpoll 10
 server ntp5.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp6.aliyun.com iburst minpoll 4 maxpoll 10
 server ntp6.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp7.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp8.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
 server ntp9.cloud.aliyuncs.com iburst minpoll 4 maxpoll 10
```

次に、Alibaba Cloud ECS にインポートした後に ECS インスタンス作成するのに clout-init を準備する必要があります：

```shell
$ yum install cloud-init
```

`cloud.cfg` を以下の内容に変更します：

```yaml
# The top level settings are used as module
# and system configuration.

# A set of users which may be applied and/or used by various modules
# when a 'default' entry is found it will reference the 'default_user'
# from the distro configuration specified below
users:
   - default

user:
    name: root
    lock_passwd: False

# If this is set, 'root' will not be able to ssh in and they 
# will get a message to login instead as the above $user
disable_root: false

# This will cause the set+update hostname module to not operate (if true)
preserve_hostname: false

manage_etc_hosts: localhost
syslog_fix_perms: root:root
datasource_list: [ AliYun ]

# Example datasource config
datasource:
    AliYun:
        support_xen: false
        timeout: 5
        max_wait: 300

cloud_init_modules:
 - migrator
 - source_address
 - pip-source
 - bootcmd
 - write-files
 - set_hostname
 - update_hostname
 - update_etc_hosts
 - rsyslog
 - users-groups
 - ssh

cloud_config_modules:
 - mounts
 - locale
 - set-passwords
 - yum-add-repo
 - package-update-upgrade-install
 - timezone
 - puppet
 - chef
 - salt-minion
 - mcollective
 - disable-ec2-metadata
 - runcmd

cloud_final_modules:
 - rightscale_userdata
 - scripts-per-once
 - scripts-per-boot
 - scripts-per-instance
 - scripts-user
 - ssh-authkey-fingerprints
 - keys-to-console
 - phone-home
 - final-message

system_info:
  distro: rhel
  paths:
    cloud_dir: /var/lib/cloud
    templates_dir: /etc/cloud/templates
  ssh_svcname: sshd

# vim:syntax=yaml
```

ここまで Red Hat のインストールと初期設定が完了します。

## ECS イメージインポート機能を対応するフォーマットへ交換（OVA → QCOW2）

次のステップでは、準備した RHEL 仮想マシンを VirtualBox から OVA イメージをエキスポートします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613488852800/20191225174145.png "img")

![Red Hat 仮想マシンを OVA としてエキスポート](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613488852800/20191225173936.png "Red Hat 仮想マシンを OVA としてエキスポート")


出来上がった OVA ファイルから vmdk ファイルを取り出す必要があります：

```shell
$ tar -xvf RHEL-76.ova
```

実行すると、`RHEL-76-disk001.vmdk` ファイルが取り出せます。
最後に、`vmdk` ファイルから `qcow2` ファイルに交換し、このステップが完了します：

```shell
$ qemu-img convert -f vmdk -O qcow2 RHEL-76-disk001.vmdk RHEL-76.qcow2
```

## OSS にイメージファイルをアップロードし、ECS にインポート

準備した `qcow2` ファイルを Alibaba Cloud OSS バケットにアップロードします。ファイルサイズが大きいため、[aliyun-cli](https://github.com/aliyun/aliyun-cli) や [OSS Browser](https://github.com/aliyun/oss-browser) を利用してアップロードするのをおすすめです。

※注意点：ECS イメージインポートする際に、qcow2 ファイルを保存する OSS バケットのリージョンと同じリージョンである必要があります。そして、インポートしたイメージを利用して作成したインスタンスが、同じリージョンとなります。

次に、ECS コンソールにアクセスして、イメージをインポートします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613488852800/20191225182031.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613488852800/20191225182415.png "img")

ECS にイメージをインポートするために、ECS サービスから OSS へのアクセスを許可する必要があります。インポート画面の指示に従って、必要な情報入力とステップを完了すると、イメージのインポートができます。イメージインポート完了まで少し時間がかかります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613488852800/20191226134435.png "img")

## RHEL インスタンス作成、動作確認

最後に、インポートしたイメージを利用して ECS インスタンスを作成してみましょう。インスタンス作成と同じ手順で行います。但し、以下の点に注意する必要があります：

- 作成するインスタンスのリージョンがイメージのリージョンと同じとなること
- イメージを選択するときに、「カスタムイメージ」を選択し、インポートしたイメージを選ぶこと
- インスタンスの「ログイン認証」設定に、「イメージのパスワードを使用」という選択がありますので、適切に設定すること

インスタンスを作成してから、アクセスして動作確認してみましょう

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613488852800/20191226140447.png "img")

ここで既存の Red Hat サブスクリプションを無事に Alibaba Cloud に持込できました。

