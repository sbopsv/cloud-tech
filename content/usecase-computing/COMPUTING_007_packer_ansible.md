---
title: "Packer+Ansibleでイメージ作成"
metaTitle: "Alibaba Cloud環境でのPacker+Ansibleを用いたゴールデンイメージ作成"
metaDescription: "Alibaba Cloud環境でのPacker+Ansibleを用いたゴールデンイメージ作成"
date: "2020-04-16"
author: "SBC engineer blog"
thumbnail: "/computing_images_26006613549751100/20200415154513.png"
---

## Alibaba Cloud環境でのPacker+Ansibleを用いたゴールデンイメージ作成

# はじめに

本記事では、Alibaba Cloud環境でPacker+Ansibleを用いたゴールデンイメージ作成をする方法をご紹介します。     


いきなりですが、例えば複数のサーバで共通のOS/MW構成の環境を構築する際に、どのように環境を構築していますか？    
1台1台サーバを立てて要件に沿って設定を行っていくのは手間がかかるので、     
共通設定部分についてはすべて同一のイメージファイルに入れて環境構築をしますよね。     

今回はそのイメージファイルの作成を便利かつ簡単に行うことができる<b><span style="color: #0000cc">Packerと</span></b>     
サーバのプロビジョニングを簡単に行うことができる<b><span style="color: #0000cc">Ansibleを使用して</span></b>     
その共通設定部分を取り込んだイメージファイル、つまり<b><span style="color: #0000cc">ゴールデンイメージを作成することが</span></b>     
<b><span style="color: #0000cc">Alibaba Cloud環境でも簡単に実現できるのか</span></b>、というのを検証してみました。     
     
結論から言うと、<b><span style="color: #ff0000">簡単に実現できました </span></b>     
     
どのように簡単だったのか、というのを一緒に見ていきましょう。     
個人的にAWS環境で上記イメージ作成の実績を積んできたのでAlibaba Cloud環境でも実績を積みたい、という想いから今回Alibaba Cloudをクラウドサービスに採用しました。     

      

# 製品紹介
↑だけだと説明が雑すぎるのでちょっとだけ製品の説明についてもしていきます。   

## Packer
> https://packer.io/

公式サイトに記載されている通りなのですが、イメージ作成を自動化してくれるPackerは非常に使いやすいです。      
また構成管理ツールとの親和性も高く、OS設定およびMWのインストールまで簡単に実現できる便利ツールだと言えます。    

## Ansible
> https://www.ansible.com/overview/how-ansible-works

こちらも公式サイトに記載されている通りで、Ansibleはクラウドプロビジョニング、構成管理等を実現する際にはよく用いるツールになります。      
エージェントレスであり、処理を記載するPlaybookと呼ばれる定義ファイルはYAML形式であり、制御に必要なモジュールについても多数用意されており、冪等性を担保しているため、      
非常に使いやすく導入しやすい構成管理ツールだと思っています。    

# 実際にやってみよう
実際にAlibaba Cloud環境でPackerとAnsibleを使用していきましょう。     
今回は以下の3StepでAlibaba Cloud環境でのPacker+Ansibleを使用したゴールデンイメージ作成および動作確認をしていきたいと思います。    

* Alibaba Cloud環境でPackerを使用したイメージ作成     
* Alibaba Cloud環境でAnsibleを使用したOS/MW設定 + Packerを使用したイメージ作成     
* Alibaba Cloud環境でPacker+Ansibleで作成したイメージからサーバ構築

また本来であれば、ハマったポイントをここで紹介すべきなのですが、なんせ簡単に実現できたもので、ハマる箇所はありませんでした。     
なぜ今回はなぜハマらなかったのか、というポイントをここで抑えておきます。    

* Packerの実行に必要なAlibaba Cloud用のプラグインはPackerのパッケージに内包済み     
* Ansibleの実行はAlibaba Cloud用に必要なものは特にない(他のクラウド環境と変わらない)      

導入を考える上ではこのポイントは非常に重要です。このポイントを踏まえながら見ていきましょう。    

# Step1. Alibaba Cloud環境でPackerを使用したイメージ作成
いきなりPacker+Ansibleを組み合わせるよりイメージを掴みやすいと思うのでまずはPackerのみを使用したイメージ作成を行っていきましょう。     
Alibaba Cloudへの導入が簡単か、という観点で検証していくので、構成は簡潔にしています。     
このStepでは<span style="color: #0000cc">httpdのインストールされたCentOS7のイメージを作成する</span>、というのがゴールになります。     

構成図は以下です。     
※「×」がついているリソースは最終的に削除されるリソースです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613549751100/20200415154513.png "img")      

以下の記事でもPackerを使用したイメージ作成については紹介されているので参考にしてください。

> https://www.sbcloud.co.jp/entry/2017/08/03/packer/

## 01. Linux サーバに接続してログイン
自前で用意したLinuxサーバにssh接続し、rootでログインします。

■自前で用意した環境     
クラウド　　　　　：Alibaba Cloud     
リージョン　　　　：東京     
OS　　　　　　　　：CentOS7.7     
インスタンスタイプ：ecs.t5-lc2m1.nano     
SG　　　　　　　　：自使用のグローバルIPからSSH許可

## 02. Packerのインストールディレクトリに移動
環境変数PATHが通っているディレクトリに移動します。     
今回は例として「/usr/local/bin」ディレクトリを使用しますが、任意のディレクトリに移動し、環境変数PATHを通せば問題ありません。

```
# cd /usr/local/bin
```

## 03. Packerのパッケージををインターネット経由でダウンロード
今回はPackerのバージョン1.5.5を使用します。

```
# wget https://releases.hashicorp.com/packer/1.5.5/packer_1.5.5_linux_amd64.zip && ls -l packer_1.5.5_linux_amd64.zip
```

## 04. パッケージを解凍
ダウンロードしたパッケージを解凍します。

```
# unzip packer_1.5.5_linux_amd64.zip && ls -l packer*
```

※「-bash: unzip: command not found」と表示された場合、unzipコマンドがサーバにインストールされていません。     
　その場合以下を実行し、zipコマンド、unzipコマンドをインストールし、再度解凍を実行します。

```
# yum -y install zip unzip
```

## 05. Packerがインストールされたことを確認
Packerのバージョン確認コマンドを実行します。     
バージョンが返却されれば正常にインストールされています。


```
# packer version
```

※「command not found」と表示された場合は、Packerは正しくインストールされていません。     
　また<span style="color: #ff0000">コマンドが返却されない場合、「/usr/sbin/packer」が実行されている可能性があります。</span>     
　Cent7以降のLinuxOSではデフォルトで「cracklib-packer」のシンボリックリンクとして「/usr/sbin/packer」が存在していてるため、     
　不要の場合、以下を実行しリンク先を削除後、再実行します。     
　※リンク先のみの削除をするため、後々必要になった場合でもリンク元を使用すれば問題ありません。


```
# whereis packer

# ls -l /usr/sbin/packer

# rm /usr/sbin/packer

# export PATH
```

## 06. 作業ディレクトリ作成
作業ディレクトリおよびログ出力用ディレクトリを作成します。

```
# mkdir -p /root/packer/logs/
```

## 07. Packerのテンプレート作成
Packerのテンプレートを作成します。

```
# vi /root/packer/packer_template.json
```

以下を記載し、保存します。

```
{
 "variables": {
   "access_key": "{{env `ACCESS_KEY`}}",
   "secret_key": "{{env `SECRET_KEY`}}"
 },
 "builders": [{
   "type":"alicloud-ecs",
   "access_key":"{{user `access_key`}}",
   "secret_key":"{{user `secret_key`}}",
   "region":"ap-southeast-1",
   "image_name":"image_narushima_singapore_test01",
   "source_image":"centos_7_7_x64_20G_alibase_20200220.vhd",
   "ssh_username":"root",
   "instance_type":"ecs.t5-lc2m1.nano",
   "internet_charge_type":"PayByTraffic",
   "io_optimized":"true"
 }],
 "provisioners": [{
   "type": "shell",
   "inline": [
 "sleep 2",
 "yum install -y httpd"
   ]
 }]
}
```

variablesで変数の読み込み、buildersで外側の設定、provisionersでSSH接続後に実行するコマンドの指定をしています。     
buildersのtypeで指定されている「alicloud-ecs」がAlibaba Cloud用のプラグインになります。

またStep3まで共通で以下のパラメータでイメージを作成していきます。

■パラメータ     
リージョン　　　　　　：シンガポールリージョン     
パブリックイメージID　：centos_7_7_x64_20G_alibase_20200220.vhd     
sshユーザ　　　　　　：root     
インスタンスタイプ　　：ecs.t5-lc2m1.nano     
インターネット料金体系：トラフィックによる     
I/Oの最適化　　　　　：有効      

## 08. Packer実行シェル作成
Packerの実行用シェルを作成します。     

※AccessKey、SecretAccessKeyを別ファイルに出し、環境変数として読み込ませるためにテンプレートと実行シェルを分けています。     
　テンプレートに環境変数をすべて記載しても実行は可能です。

```
# vi /root/packer/packer_run.sh
```

以下を記載し、保存します。

```
#!/bin/bash

base_dir="/root/packer/"
packer_json="${base_dir}/packer_template.json"

export PACKER_YMD=`date '+%Y%m%d%H%M%S'`
export ACCESS_KEY="xxxxxxxxxxxxxxxxxxxxxxxx"
export SECRET_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

packer_log="${base_dir}/logs/packer-${PACKER_YMD}.log"

env PACKER_LOG=1 PACKER_LOG_PATH=${packer_log} packer build ${packer_json}

exit 0
```

ファイル内容の確認をします。

```
# cat /root/packer/packer_template.json; echo " "; cat /root/packer/packer_run.sh
```

## 09. Packerによるイメージ作成
作成したPacker実行シェルを実行します。

```
# sh /root/packer/packer_run.sh
```

「alicloud-ecs: Alicloud images were created:」と表示されればイメージ作成完了です。

```
==> alicloud-ecs: Prevalidating source region and copied regions...
==> alicloud-ecs: Prevalidating image name...
~中略~
alicloud-ecs: Complete!
==> alicloud-ecs: Creating image: image_narushima_singapore_test01
~中略~
Build 'alicloud-ecs' finished.

==> Builds finished. The artifacts of successful builds are:
--> alicloud-ecs: Alicloud images were created:

ap-southeast-1: m-xxxxxxxxxxxxxxxxxxxx
```

## 10. ログの確認
Packer実行時に出力されたログを確認します。

```
# tail /root/packer/logs/packer-YYYYMMDDhhmmss.log
```

ログが表示されていれば、ログ出力が正常に行われています。

これで本Stepでのゴールになります。     
Packer単体を使用したイメージ作成は比較的簡単だったかと思います。

## 番外編. Packer処理の解説
Packerの処理の流れは以下のようになっています。     
イメージを作成するために必要なリソースを一通り作成し、     
イメージ作成後、イメージ以外の作成したリソースをすべて削除します。

* keypair作成
* VPC作成
    * VSwitch作成 / SecurityGroup作成 / ECS作成 / EIP払い出し / keypairアタッチ / EIPアタッチ
    * ECS起動
        * SSH接続
        * プロビジョニング実行用シェル作成
        * シェル実行
        * プロビジョニング実行用シェル削除
    * ECS停止
    * イメージ作成
    * keypairデタッチ / EIP削除 / ECS削除 / SecurityGroup削除 / VSwitch削除
* VPC削除
* keypair削除

※EIP払い出し/削除はVPC内での作成/削除ではありませんが、処理の流れ上VPC作成の入れ子のように記載しています。

本来イメージの作成に必要なこんなにも多くの手順を自動で実施してくれるPackerは非常に便利なツールである実感できたかと思います。

# Step2. Alibaba Cloud環境でAnsibleを使用したOS/MW設定 + Packerを使用したイメージ作成
Packer単体を使用したイメージ作成で、Packerの便利さや処理の動きについて理解を深めたと思うので、     
次はAnsibleと組み合わせてイメージの作成を行っていきたいと思います。     
具体的にはprovisionersで定義した部分をAnsibleに一括してお任せする、というイメージです。     
このStepでは<span style="color: #0000cc">httpdがインストールされ、index.htmlに想定の記述がされたCentOS7のイメージを作成する</span>、というのがゴールになります。

構成図は以下です。     
※「×」がついているリソースは最終的に削除されるリソースです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613549751100/20200415154527.png "img")      

## 01. Python3のインストール
AnsibleはPythonを使用するプロビジョニングツールであるためPythonを事前にインストールします。     
今回はPythonのバージョン3.6.8を使用します。

```
# yum install -y python36 python36-pip python36-devel
```

※python2系はデフォルトでインストールされていますが、2020/4/2時点で公式のサポートが切れており、     
　Ansible実行時に警告メッセージが出力されるため、今回はPython3系を使用します。
## 02. pip3のインストール
Python3系を使用したAnsible実行環境を構築するため、Pythonのパッケージ管理ツールであるpip3をインストールします。

```
# pip3 install --upgrade pip
```

## 03. Ansibleインストール
インストールしたpip3を使用し、Ansibleをインストールします。     
今回はAnsibleのバージョン2.9.6を使用します。

```
# pip3 install ansible
```

## 04. Ansibleインストール確認
正常にインストールされたことを確認します。     
また同時にAnsible実行時のPythonバージョンを確認します。

```
# ansible --version
```

### 05. Packerのテンプレート作成
先に作成したPackerのテンプレートと同様にテンプレートを作成していきますが、今回はAnsible関連の記述もしていきます。     
また今回はPackerで指定する値をすべて変数化し、実行用シェルに変数定義を記載しました。

```
# vi /root/packer/packer_template2.json
```

以下を記載し、保存します。

```
{
 "variables": {
   "access_key": "{{env `PACKER_ACCESS_KEY`}}",
   "secret_key": "{{env `PACKER_SECRET_KEY`}}",
   "region": "{{env `PACKER_REGION`}}",
   "image_name": "{{env `PACKER_IMAGE_NAME`}}",
   "source_image": "{{env `PACKER_SOURCE_IMAGE`}}",
   "username": "{{env `PACKER_USERNAME`}}",
   "instance_type": "{{env `PACKER_INSTANCE_TYPE`}}",
   "internet_charge_type": "{{env `PACKER_INTERNET_CHARGE_TYPE`}}",
   "io_optimized": "{{env `PACKER_IO_OPTIMIZED`}}",
   "ansible_playbook": "{{env `PACKER_PLAYBOOK`}}"
 },
 "builders": [{
   "type":"alicloud-ecs",
   "access_key":"{{user `access_key`}}",
   "secret_key":"{{user `secret_key`}}",
   "region":"{{user `region`}}",
   "image_name":"{{user `image_name`}}",
   "source_image":"{{user `source_image`}}",
   "ssh_username":"{{user `username`}}",
   "instance_type":"{{user `instance_type`}}",
   "internet_charge_type":"{{user `internet_charge_type`}}",
   "io_optimized":"{{user `io_optimized`}}"
 }],
 "provisioners": [{
   "type": "ansible",
   "playbook_file": "{{user `ansible_playbook`}}"
 }]
}
```

variablesで変数の読み込み、buildersで外側の設定、provisionersでSSH接続後に実行するコマンドの指定をしています。

## 06 . Packer実行シェルにAnsible関連の記述追加
Packer実行用シェルにもAnsible関連の記述を追加していきます。

```
# vi /root/packer/packer_run2.sh
```

以下を記載し、保存します。

```
#!/bin/bash

base_dir="/root/packer/"
packer_json="${base_dir}/packer_template2.json"

export PACKER_PLAYBOOK="${base_dir}/main.yml"
export PACKER_YMD=`date '+%Y%m%d%H%M%S'`
export PACKER_ACCESS_KEY="xxxxxxxxxxxxxxxxxxxxxxxx"
export PACKER_SECRET_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export PACKER_REGION="ap-southeast-1"
export PACKER_IMAGE_NAME="image_narushima_singapore_test02"
export PACKER_SOURCE_IMAGE="centos_7_7_x64_20G_alibase_20200220.vhd"
export PACKER_USERNAME="root"
export PACKER_INSTANCE_TYPE="ecs.t5-lc2m1.nano"
export PACKER_INTERNET_CHARGE_TYPE="PayByTraffic"
export PACKER_IO_OPTIMIZED="true"

packer_log="${base_dir}/logs/packer-${PACKER_YMD}.log"

if [ ! -f ${PACKER_PLAYBOOK} ]; then
  echo "file not found. ${packer_json}"
  exit 1
fi

env PACKER_LOG=1 PACKER_LOG_PATH=${packer_log} packer build ${packer_json}

exit 0
```

## 07. Ansible PlayBook作成
AnsibleのPlayBookを作成します。

```
# vi /root/packer/main.yml
```

以下を記載し、保存します。

```
#create instance image by using packer and ansible
---
- hosts: all
  
  gather_facts: no
  handlers: 
    - name: restart httpd
      service: name=httpd state=restarted
  tasks: 
    - name: yum install httpd
      yum: name=httpd state=present
    - name: start httpd
      service: name=httpd state=started enabled=yes
    - copy: 
        content: |
          <!DOCTYPE html>
          <html>
          <head>
          <meta charset="utf-8">
          <title>test page</title>
          </head>
          <body>
          <h1>Hello,World</h1>
          </body>
          </html>
        dest: /var/www/html/index.html
      notify: 
        - restart httpd
```

本ファイルでは簡単に言うと以下の記述をしています。     
* httpdインストール     
* httpd起動     
* httpd自動起動設定     
* index.htmlファイル作成     
* httpd再起動する     

今回はAnsibleにはSSH接続後のプロビジョニングを任せているので、     
Alibaba Cloudだから何かが必要となることはありません。     
OS内でコマンドを実行していくだけになります。

ファイル内容の確認をします。

```
# cat /root/packer/packer_template2.json; echo " "; cat /root/packer/packer_run2.sh; echo " "; cat /root/packer/main.yml
```

## 08. Packerによるイメージ作成
編集したPacker実行シェルを実行します。

```
# sh /root/packer/packer_run2.sh
```

「alicloud-ecs: Alicloud images were created:」と表示されればイメージ作成完了です。

```
==> alicloud-ecs: Prevalidating source region and copied regions...
==> alicloud-ecs: Prevalidating image name...
~中略~
==> alicloud-ecs: Provisioning with Ansible...
==> alicloud-ecs: Executing Ansible: ansible-playbook --extra-vars packer_build_name=alicloud-ecs packer_builder_type=alicloud-ecs -o IdentitiesOnly=yes -i /vate_key_file=/tmp/ansible-keyxxxxxxxxx
~中略~
    alicloud-ecs: PLAY RECAP *********************************************************************
    alicloud-ecs: default                    : ok=4    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    alicloud-ecs:
~中略~
    Build 'alicloud-ecs' finished.

==> Builds finished. The artifacts of successful builds are:
--> alicloud-ecs: Alicloud images were created:

    ap-southeast-1: m-xxxxxxxxxxxxxxxxxxxx
```

## 09. ログの確認
Packer実行時に出力されたログを確認します。

```
# tail /root/packer/logs/packer-YYYYMMDDhhmmss.log
```

ログが表示されていれば、ログ出力が正常に行われています。

これで本Stepでのゴールになります。     
Ansibleを使用したプロビジョニングについても比較的簡単だったかと思います。

# Step3. Alibaba Cloud環境でPacker+Ansibleで作成したイメージからサーバ構築
イメージの作成まで完了しましたが、本当にそのイメージにMWがインストールされているのか、という確認ができていないですよね。     
なのでこのStepでは<span style="color: #0000cc">イメージから実際にECSを構築し、想定のプロビジョニングが行われていたか確認する</span>、というのがゴールになります。     
ここまでコマンドラインのみでイメージ作成まで実施してきました。     
せっかくなので最後までコマンドラインで実施していきましょう。

構成図は以下です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613549751100/20200415154536.png "img")      

## 01. Alibaba Cloud CLIのインストールおよび初期設定
ECSを構築するにあたって、今回はAlibaba Cloud CLIを使用して構築していきます。     
そのためAlibaba CloudをCLIで操作するツールであるaliyunのインストールから始めます。
今回はaliyunのバージョン3.0.37を使用します。

```
# cd /usr/local/src
# mkdir aliyun
# cd aliyun; pwd
# wget https://aliyuncli.alicdn.com/aliyun-cli-linux-3.0.37-amd64.tgz && ls -l aliyun-cli-linux-3.0.37-amd64.tgz
# tar xvfz aliyun-cli-linux-3.0.37-amd64.tgz && ls -l aliyun
# cp -a aliyun /usr/local/bin/ && ls -l /usr/local/bin/aliyun
# export PATH
# which aliyun
# aliyun
# aliyun configure
  Access Key Id []: xxxxxxxxxxxxxxxxxxxxxxxx
  Access Key Secret []: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Default Region Id []: ap-southeast-1
  Default Language [zh|en] en:
```

以下のように表示されればAliyunの初期設定が完了です。

```
Configure Done!!!
..............888888888888888888888 ........=8888888888888888888D=..............
...........88888888888888888888888 ..........D8888888888888888888888I...........
.........,8888888888888ZI: ...........................=Z88D8888888888D..........
.........+88888888 ..........................................88888888D..........
.........+88888888 .......Welcome to use Alibaba Cloud.......O8888888D..........
.........+88888888 ............. ************* ..............O8888888D..........
.........+88888888 .... Command Line Interface(Reloaded) ....O8888888D..........
.........+88888888...........................................88888888D..........
..........D888888888888DO+. ..........................?ND888888888888D..........
...........O8888888888888888888888...........D8888888888888888888888=...........
............ .:D8888888888888888888.........78888888888888888888O ..............
```

## 02. イメージ確認
先程作成したイメージをCLIで確認します。

```
# aliyun ecs DescribeImages \
--RegionId "ap-southeast-1" \
--ImageName "image_narushima_singapore_test02"
```

## 03. VPC作成
ECSを構築するために必要なリソースを作成していきます。

```
# aliyun vpc CreateVpc \
--RegionId "ap-southeast-1" \
--CidrBlock "172.16.0.0/16" \
--VpcName "vpc_narushima_singapore" \
--Description "testing vpc for packer+ansible test created by using cli"

# aliyun vpc DescribeVpcs \
--RegionId "ap-southeast-1" \
--VpcId "[上記で作成したVPCのID]"
```

## 04. VSwitch作成

```
# aliyun vpc CreateVSwitch \
--RegionId "ap-southeast-1" \
--ZoneId "ap-southeast-1a" \
--VpcId "[上記で作成したVPCのID]" \
--CidrBlock "172.16.0.0/24" \
--VSwitchName "vsw_narushima_singapore" \
--Description "testing vsw for packer+ansible test created by using cli"

# aliyun vpc DescribeVSwitches \
--RegionId "ap-southeast-1" \
--VSwitchId "[上記で作成したVSwitchのID]"
```

## 05. SecurityGroup作成

```
# aliyun ecs CreateSecurityGroup \
--RegionId "ap-southeast-1" \
--VpcId "[上記で作成したVPCのID]" \
--SecurityGroupName "sg_narushima_singapore" \
--Description "testing sg for packer+ansible test created by using cli"

# aliyun ecs DescribeSecurityGroups \
--RegionId "ap-southeast-1" \
--SecurityGroupId "[上記で作成したSGのID]"
```

## 06. SecurityGroupルール追加

```
# aliyun ecs AuthorizeSecurityGroup \
--RegionId "ap-southeast-1" \
--SecurityGroupId "[上記で作成したSGのID]" \
--IpProtocol "tcp" \
--PortRange "22/22" \
--SourceCidrIp "[使用している端末のグローバルIP]"

# aliyun ecs AuthorizeSecurityGroup \
--RegionId "ap-southeast-1" \
--SecurityGroupId "[上記で作成したSGのID]" \
--IpProtocol "tcp" \
--PortRange "80/80" \
--SourceCidrIp "[使用している端末のグローバルIP]"
```

## 07. EIP作成

```
# aliyun vpc AllocateEipAddress \
--RegionId "ap-southeast-1" \
--InternetChargeType "PayByTraffic"

# aliyun vpc DescribeEipAddresses \
--RegionId "ap-southeast-1" \
--AllocationId "[上記で作成したEIPのAllocationID]"
```

## 08. keypair作成

```
# aliyun ecs CreateKeyPair \
--RegionId "ap-southeast-1" \
--KeyPairName "key_narushima_sigapore.pem"
```

※PrivateKeyBodyに表示された秘密鍵をコピーし、ローカルでファイルに張り付けます。     
　その後、「\n」となっている箇所をすべて「改行」に変換し、     
　ファイル名を上記KeyPair名に変更し保存します。

```
# aliyun ecs DescribeKeyPairs \
--RegionId "ap-southeast-1" \
--KeyPairName "key_narushima_sigapore.pem"
```

## 09. ECS作成用親シェル作成
今回は変数を外出しするため親シェルと子シェルで分けます。

```
# vi /root/env_create_instance.sh
```

以下を記載し、保存します。

```
#!/bin/bash

export INSTANCE_TYPE="ecs.t5-lc2m1.nano"
export REGION_ID="ap-southeast-1"
export ZONE_ID="ap-southeast-1a"
export IMAGE_ID="[前回作成したイメージのID]"
export SECURITY_GROUP_ID="[上記で作成したSGのID]"
export VSWITCH_ID="[上記で作成したVSwitchのID]"
export INSTANCE_NAME="ecs-narushima-test-singapore"
export CHARGE_TYPE="PayByTraffic"
export KEYPAIR="key_narushima_sigapore.pem"
export DESCRIPTION="testing instance by using packer+ansible"

sh /root/run_create_instance.sh | tee -a /tmp/debug.log

exit 0
```

## 10. ECS作成用子シェル作成

```
# vi /root/run_create_instance.sh
```

以下を記載し、保存します。

```
#!/bin/bash

aliyun ecs CreateInstance \
--RegionId "${REGION_ID}" \
--ZoneId "${ZONE_ID}" \
--ImageId "${IMAGE_ID}" \
--SecurityGroupId "${SECURITY_GROUP_ID}" \
--VSwitchId "${VSWITCH_ID}" \
--InstanceType "${INSTANCE_TYPE}" \
--InstanceName "${INSTANCE_NAME}" \
--InternetChargeType "${CHARGE_TYPE}" \
--HostName "${INSTANCE_NAME}" \
--KeyPairName "${KEYPAIR}" \
--Description "${DESCRIPTION}"
```

## 11. シェル実行

```
# sh /root/env_create_instance.sh
```

## 12. インスタンス確認

```
# aliyun ecs DescribeInstances \
--RegionId "ap-southeast-1" \
--InstanceName "ecs-narushima-test-singapore"
```

## 13. EIPアタッチ

```
# aliyun vpc AssociateEipAddress \
--RegionId "ap-southeast-1" \
--AllocationId "[上記で作成したEIPのAllocationID]" \
--InstanceId "[上記で作成したECSのインスタンスID]"
```

## 14. ECS起動

```
# aliyun ecs StartInstance \
--InstanceId "[上記で作成したECSのインスタンスID]"
```

## 15. ブラウザ確認
ブラウザから以下のアクセスし、Hello,Worldと表示されれば完了です。    
 
> http://[上記で作成したEIPアドレス]/index.html

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613549751100/20200414123919.png "img")      

Ansibleによるプロビジョニングでindex.htmlの作成を行っていますので、     
Packer+Ansibleで作成したイメージに正常にプロビジョニングが実行されていた、ということが確認できました。     
動作確認はこれにてすべて完了となります。

# 最後に
今回の焦点としては<span style="color: #0000cc">Alibaba Cloud環境で簡単にPacker+Ansibleでのイメージ作成ができるのか</span>、ということでしたので結論から言うと、<b><span style="color: #ff0000">簡単にできた </span></b>となります。　　　　　

今回は特段Alibaba Cloud用のプラグインを自前で用意することも設定ファイルの変更もすることもなく、PackerおよびAnsibleを実行することができました。     
テンプレートやPlayBookは凝ったものではありませんでしたが、<b>導入という観点で言えばAlibaba CloudでのPackerおよびAnsibleの使用は簡単だ</b>と結論付けることができるでしょう。

ゴールデンイメージの作成について自動化したいと思われていた方はこれを機にPackerおよびAnsibleを導入してみてはいかがでしょうか。



