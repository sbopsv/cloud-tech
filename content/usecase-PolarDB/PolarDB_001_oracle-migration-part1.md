---
title: "PolarDB-OマイグレーションPart1"
metaTitle: "【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part1 OracleDatabaseセットアップ、事前準備"
metaDescription: "【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part1 OracleDatabaseセットアップ、事前準備"
date: "2021-09-23"
author: "sbc_ohara"
thumbnail: "/polardb_images_13574176438014222676/20210922091036.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 【PolarDBマイグレーションシリーズ】Oracle DatabaseからPolarDB-Oマイグレーション-Part1 OracleDatabaseセットアップ、事前準備

# はじめに

本記事では、Oracle DatabaseからPolarDB-Oマイグレーション-Part1 OracleDatabaseセットアップ、事前準備 についてを紹介します。     
こちら長文になるので、全部でPart5に分けて紹介します。   

[Part1 OracleDatabaseセットアップ、事前準備](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_001_oracle-migration-part1)←本記事です         
[Part2 Oracle Database評価](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_002_oracle-migration-part2)         
[Part3 データベースマイグレーション準備](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_003_oracle-migration-part3)         
[Part4 データベースマイグレーション実行](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_004_oracle-migration-part4)         
[Part5 アプリケーションマイグレーションと改修](http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_005_oracle-migration-part5)         

# PolarDBとは


PolarDBはAlibaba Cloudが開発したCloud Native Databaseサービスです。MySQL・PostgreSQLは100%、Oracleは高い互換性を持ちながら、ユーザーのワークロードに応じて垂直・水平スケーリングすることが出来るため、コストを大幅に削減できることが特徴です。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210923094834.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210923095110.png "img")    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210923095159.png "img")    



# 最初に
本Best PracticeはOracle DatabaseおよびアプリケーションをAlibaba Cloud PolarDBへマイグレーションする方法をご紹介します。    
PolarDB-O (Oracle Databaseと高い互換性あり) をマイグレーションターゲットのデータベースとします。データベースとアプリケーションのマイグレーションサービスであるADAMプロダクトサービスを通して、Oracleおよびアプリケーションを評価、収集、改修から、PolarDB-O へのマイグレーションまでのすべてのプロセスをご紹介します。     


構造図：     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922002429.png "img")    



この記事 Part1では、ターゲットとなるOracle Databaseを構築、およびアプリケーションを構築するフェーズとなります。既にOracle Database およびアプリケーションを持っている方は本記事はSkipし、Part2から確認いただければ幸いです。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922091036.png "img")    


# 1.ECS上に Oracle Database 11R2 環境を構築

# 1-1.VPCを作成します
手順1.AlibabaCloudサイトに登録し、コンソール画面に遷移します      

手順2.プロダクトとサービスをクリックし、VPCをクリックします      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922003349.png "img")    



手順3.トップメニューでJPリージョンを選択します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922003400.png "img")    



手順4.VPC画面にVPCの作成ボタンをクリックし、VPC作成画面に遷移します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922003451.png "img")    


手順5.VPC作成画面にパラメータを設定し、VPCを作成します      

①パラメータ設定：     

|タイプ|設定項目|説明|
|---|---|---|
|VPC|名前|Nancy-oracle|
|VPC|IPv4 CIDR ブロック|172.16.0.0/12|
|VPC|名前|Nancy-oracle-vsw|
|VSwitch|名前|Nancy-oracle-vsw|
|VSwitch|ゾーン|Tokyo Zone A|
|VSwitch|IPv4 CIDR ブロック|172.16.0.0/24|



②VPC作成画面を設定       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005043.png "img")    


③VPCとVSwitch が作成したので確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005111.png "img")    


# 1-2.ECSを作成します      
手順1.AlibabaCloudサイトに登録し、ECSコンソール画面に遷移します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005122.png "img")    


手順2.ECS画面でインスタンスの作成ボタンをクリックし、ECS作成画面に遷移します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005133.png "img")    


手順3.ECSインスタンスを作成します      
基本設定      

|設定項目|説明|
|--|--|
|課金方法|従量課金|
|リージョン|日本（東京）アジア東北１ゾーンA|
|インスタンスタイプ|ecs.g6.2xlarge　|
|イメージ|CentOS 7.8 64-bit|
|ストレージ|100GB|
|ネットワーク|vpc-oracle|
|パブリック IP アドレス|パブリック IP の割り当て|
|ログイン認証|パスワード|
|インスタンス名|nancy-oracle-polardb|

①課金方法とSpec基本項目を設定します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005153.png "img")    


②イメージを設定し、「次のステップ」ボタンをクリックします      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005202.png "img")    


③VPCを設定し、「次のステップ」ボタンをクリックします      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005212.png "img")    


④パスワードを設定し、「次のステップ」ボタンをクリックします      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005221.png "img")    


⑤「利用規約」チェックボックスをクリックし、「インスタンスの作成」ボタンをクリックするとECSを作成します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005231.png "img")    


⑦ECSインスタンスが作成完了したので確認します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005240.png "img")    


⑧ECSインスタンスへログインします      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005250.png "img")    


今回のECS情報は次の通りとなります       

|インスタンス名|インスタンス ID|IP|仕様|
|--|--|--|--|
|nancy-oracle-polardb|i-6weeunel6mqbdly2gbi1|8.211.143.78|ecs.g6.2xlarge|

# 1-3.ECSで Oracle Database 11R2 環境を構築します      
## 1-3-1. Oracle Database 11R2 環境構築を準備します      
### 1-3-1-1.ECSハードウェアを確認します      
1）まずECSインスタンスのMemoryを確認します      
今回、Oracle Database 11R2 サイジング要件としてMemory 2GB以上を推奨しています     

```
# grep MemTotal /proc/meminfo
# df
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005350.png "img")    


2）Swapを追加します      
Swap前提条件：今回ECSは8Gなので、8Gに設定します      

|RAW|SWAP|
|--|--|
|1G～2G|1.5倍|
|2G～16G|RAWと同じサイズ|
|16G以上|16G|

①swapスペースを確認します      

```
# free -mh
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005403.png "img")    


②/swap/swapfileを作成します      
```
# sudo mkdir /swap
# sudo dd if=/dev/zero of=/swap/swapfile bs=1G count=8
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005412.png "img")    


③swapスペースをフォーマットします      
```
# sudo mkswap /swap/swapfile
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005421.png "img")    


④swapスペースを設定します      
```
# sudo mkswap -f /swap/swapfile
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005430.png "img")    


⑤接続権限を設定します      
```
# sudo chmod 600 /swap/swapfile
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005440.png "img")    


⑥swapスペースをアクティブします      
```
# sudo swapon /swap/swapfile
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005450.png "img")    


⑦自動起動を設定します      
```
# sudo vi /etc/fstab
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005458.png "img")    


⑧下記内容をつ以下します      
```
# /swap/swapfile swap swap default 0 0
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005506.png "img")    


⑨Swapを確認します      
```
sudo free -h
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005514.png "img")    



3）ECSシステムマークを変更します      
OracleデフォルトではCentOS Installerがサポートされていないため、redhat-releaseをredhat-7へ修正します      
①redhat-releaseをredhat-7に修正します      
```
# cat /proc/version
# vim /etc/redhat-release
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005627.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005633.png "img")    


②redhat-releaseを確認します      
```
# cat /etc/redhat-release
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005645.png "img")    


## 1-3-1-2.Oracleインストール前準備をします      

1）依頼パッケージをインストールします      
```
# yum install binutils compat-libstdc++-33 compat-libstdc++-33.i686 elfutils-libelf elfutils-libelf-devel gcc gcc-c++ glibc glibc.i686 glibc-common glibc-devel glibc-devel.i686 glibc-headers ksh libaio libaio.i686 libaio-devel libaio-devel.i686 libgcc libgcc.i686 libstdc++ libstdc++.i686 libstdc++-devel make sysstat unixODBC unixODBC-devel –y libXp

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005702.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005709.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005716.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005722.png "img")    



2）ユーザーとユーザーグループを作成します      

```
[root@iZ6weeunel6mqbdly2gbi1Z /]# su root
[root@iZ6weeunel6mqbdly2gbi1Z /]# groupadd oinstall
[root@iZ6weeunel6mqbdly2gbi1Z /]# groupadd dba
[root@iZ6weeunel6mqbdly2gbi1Z /]# useradd -g oinstall -g dba -m oracle
[root@iZ6weeunel6mqbdly2gbi1Z /]# passwd oracle
Changing password for user oracle.
New password: 
BAD PASSWORD: The password is shorter than 8 characters
Retype new password: 
passwd: all authentication tokens updated successfully.
[root@iZ6weeunel6mqbdly2gbi1Z /]# id oracle
uid=1000(oracle) gid=1001(dba) groups=1001(dba)

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005752.png "img")    



3）oracleインストールディレクトリを作成します      

```
[root@iZ6weeunel6mqbdly2gbi1Z /]# clear
[root@iZ6weeunel6mqbdly2gbi1Z /]# cd /.
[root@iZ6weeunel6mqbdly2gbi1Z /]# mkdir -p /data/oracle
[root@iZ6weeunel6mqbdly2gbi1Z /]# mkdir -p /data/oraInventory
[root@iZ6weeunel6mqbdly2gbi1Z /]# mkdir -p /data/database
[root@iZ6weeunel6mqbdly2gbi1Z /]# cd /data
[root@iZ6weeunel6mqbdly2gbi1Z data]# ls
database  oracle  oraInventory
[root@iZ6weeunel6mqbdly2gbi1Z data]# chown -R oracle:oinstall /data/oracle
[root@iZ6weeunel6mqbdly2gbi1Z data]# chown -R oracle:oinstall /data/oraInventory
[root@iZ6weeunel6mqbdly2gbi1Z data]# chown -R oracle:oinstall /data/database

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005802.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005809.png "img")    



4）firewalldを閉じます      
①firewalld状態を確認します      
```
# systemctl status firewalld.service
# systemctl stop firewalld.service 
# systemctl disable firewalld.service
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005837.png "img")    



5）selinuxを閉じます    
ECSを再起動することで設定が有効になります     

```
# vi /etc/selinux/config
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922005858.png "img")    


```
# cat /etc/selinux/config
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010040.png "img")    


6）kernelパラメータを修正します      
①sysctl.confを修正します      
```
# vi /etc/sysctl.conf
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010054.png "img")    



②下記パラメータをsysctl.confに追加します      
```
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.rp_filter = 1
fs.file-max = 6815744 
fs.aio-max-nr = 1048576
kernel.shmall = 2097152  
kernel.shmmax = 2147483648  
kernel.shmmni = 4096  
kernel.sem = 250 32000 100 128
net.ipv4.ip_local_port_range = 9000 65500 
net.core.rmem_default = 262144
net.core.rmem_max= 4194304
net.core.wmem_default= 262144
net.core.wmem_max= 1048576

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010107.png "img")    


③設定を確認します      
```
# cat /etc/sysctl.conf
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010121.png "img")    


④設定を有効にします      
```
# sysctl -p
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010130.png "img")    


7）oracleユーザー制限を設定します      
①下記設定をlimits.confに追加します      
```
# vi /etc/security/limits.conf
oracle soft nproc 2047
oracle hard nproc 16384
oracle soft nofile 1024
oracle hard nofile 65536
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010144.png "img")    


②limits.confを確認します      
```
# cat /etc/security/limits.conf
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010153.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010200.png "img")    


8）ユーザー環境関数を設定します      

①Localeを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010211.png "img")    


②bash_profileを編集します      
```
# vi /home/oracle/.bash_profile
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010220.png "img")    


③下記パラメータをbash_profileに追加します      
```
export ORACLE_BASE=/data/oracle
export ORACLE_HOME=$ORACLE_BASE/11gr2
export ORACLE_SID=orcl
export ORACLE_UNQNAME=orcl
export ORACLE_TERM=xterm
export PATH=$ORACLE_HOME/bin:/usr/sbin:$PATH
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:/lib:/usr/lib
export LANG=en_US.UTF-8
export NLS_LANG=AMERICAN_AMERICA.AL32UTF8
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010229.png "img")    


④設定を確認し、ユーザー環境設定を有効にします      
```
# cat /home/oracle/.bash_profile
# source /home/oracle/.bash_profile
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010237.png "img")    


9）zip unzipをインストールします      
①下記コマンドでzip unzipをインストールします      
```
yum install -y unzip zip 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010249.png "img")    


10）Java1.8環境をインストールします      
①jdk-8u144-linux-x64.tar.gzをダウンロードします      
（下記のリンクからでもjdkをダウンロードすることができます）      
[jdk download url](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)

> https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010333.png "img")    



②jdk-8u144-linux-x64.tar.gzをjavaフォルダに解凍します      
```
# mkdir /usr/local/java/
# tar -zxvf jdk-8u144-linux-x64.tar.gz -C /usr/local/java/
# cd /usr/local/java/
# ll
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010358.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010404.png "img")    



③Java環境パスを設定します      
```
# vim /etc/profile
    export JAVA_HOME=/usr/local/java/jdk1.8.0_144
    export PATH=${JAVA_HOME}/bin:$PATH
    export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
    export JRE_HOME=$JAVA_HOME/jre

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010419.png "img")    


④Java環境パスを有効します      

```
# source /etc/profile
# ln -s /usr/local/java/jdk1.8.0_144/bin/java /usr/bin/java
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010430.png "img")    


⑤Javaバージョンを確認します      
```
java -version
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010439.png "img")    


11）ECSを再起動します      

```		
reboot
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010459.png "img")    


## 1-3-2.サイレントモードで Oracle Database 11R2 をインストールします      
1） Oracle Database 11R2 インストールパッケージを準備します      
①下記リンクから Oracle Database 11R2 インストールファイルをダウンロードします      

[ Oracle Database 11R2  download link1](https://www.oracle.com/database/technologies/oracle-database-software-downloads.html)
[ Oracle Database 11R2  download link2](https://www.oracle.com/cn/database/enterprise-edition/downloads/oracle-db11g-linux.html)

> https://www.oracle.com/database/technologies/oracle-database-software-downloads.html

> https://www.oracle.com/cn/database/enterprise-edition/downloads/oracle-db11g-linux.html


```
linux.x64_11gR2_database_1of2.zip
linux.x64_11gR2_database_2of2.zip
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010542.png "img")    


② Oracle Database 11R2 インストールパッケージを確認します      
※インストールパッケージは直接ECSからダウンロードするのもOKです     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010603.png "img")    


③lrzszをインストールします      
```
yum install lrzsz
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010616.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010623.png "img")    



④ダウンロードされた Oracle Database 11R2 ファイルをrzコマンドでECSにアップロードします      
ファイルを/usr/local/srcに移動します      
```
# mv linux.x64_11gR2_database_1of2.zip /usr/local/src
# mv linux.x64_11gR2_database_2of2.zip /usr/local/src
# ls
# cd /usr/local/src
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010636.png "img")    


⑤Oracleユーザーでログインします      
```
# cd /usr/local/src
# ls	
# su - oracle
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010646.png "img")    


⑥Oracleインストールファイルを解凍します      
```
unzip linux.x64_11gR2_database_1of2.zip -d /data/database/
unzip linux.x64_11gR2_database_2of2.zip -d /data/database/
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010658.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010704.png "img")    


2）サイレントモードで Oracle Database 11R2 をインストールします      
①responseフォルダに移動します      

```
#  cd /data/database/
#  cd database/
# ls
# cd response/
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010723.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010730.png "img")    



②下記コマンドでdataフォルダに権限を付与します      

```
# chown -R oracle:osinstall /data
# cd /data/database/database
# cd response/
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010741.png "img")    


③db_install.rspを設定します      
```
 vim db_install.rsp

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010753.png "img")    


④下記のようにdb_install.rspを設定します      
```
# grep -Ev "^$|^#" db_install.rsp
```
```db_install.rsp
oracle.install.responseFileVersion=/oracle/install/rspfmt_dbinstall_response_schema_v11_2_0
oracle.install.option=INSTALL_DB_SWONLY
ORACLE_HOSTNAME=iZ6weeunel6mqbdly2gbi1Z
UNIX_GROUP_NAME=oinstall
INVENTORY_LOCATION=/data/oraInventory
SELECTED_LANGUAGES=en,ja,zh_CN
ORACLE_HOME=/data/oracle/11gr2
ORACLE_BASE=/data/oracle
oracle.install.db.InstallEdition=EE
oracle.install.db.isCustomInstall=false
oracle.install.db.customComponents=oracle.server:11.2.0.1.0,oracle.sysman.ccr:10.2.7.0.0,oracle.xdk:11.2.0.1.0,oracle.rdbms.oci:11.2.0.1.0,oracle.network:11.2.0.1.0,oracle.network.listener:11.2.0.1.0,oracle.rdbms:11.2.0.1.0,oracle.options:11.2.0.1.0,oracle.rdbms.partitioning:11.2.0.1.0,oracle.oraolap:11.2.0.1.0,oracle.rdbms.dm:11.2.0.1.0,oracle.rdbms.dv:11.2.0.1.0,orcle.rdbms.lbac:11.2.0.1.0,oracle.rdbms.rat:11.2.0.1.0
oracle.install.db.DBA_GROUP=dba
oracle.install.db.OPER_GROUP=oinstall
oracle.install.db.CLUSTER_NODES=
oracle.install.db.config.starterdb.type=GENERAL_PURPOSE
oracle.install.db.config.starterdb.globalDBName=ora11g
oracle.install.db.config.starterdb.SID=ora11g
oracle.install.db.config.starterdb.characterSet=AL32UTF8
oracle.install.db.config.starterdb.memoryOption=true
oracle.install.db.config.starterdb.memoryLimit=
oracle.install.db.config.starterdb.installExampleSchemas=false
oracle.install.db.config.starterdb.enableSecuritySettings=true
oracle.install.db.config.starterdb.password.ALL=oracle
oracle.install.db.config.starterdb.password.SYS=oracle
oracle.install.db.config.starterdb.password.SYSTEM=oracle
oracle.install.db.config.starterdb.password.SYSMAN=oracle
oracle.install.db.config.starterdb.password.DBSNMP=oracle
oracle.install.db.config.starterdb.control=DB_CONTROL
oracle.install.db.config.starterdb.gridcontrol.gridControlServiceURL=
oracle.install.db.config.starterdb.dbcontrol.enableEmailNotification=false
oracle.install.db.config.starterdb.dbcontrol.emailAddress=
oracle.install.db.config.starterdb.dbcontrol.SMTPServer=
oracle.install.db.config.starterdb.automatedBackup.enable=false
oracle.install.db.config.starterdb.automatedBackup.osuid=
oracle.install.db.config.starterdb.automatedBackup.ospwd=
oracle.install.db.config.starterdb.storageType=
oracle.install.db.config.starterdb.fileSystemStorage.dataLocation=
oracle.install.db.config.starterdb.fileSystemStorage.recoveryLocation=
oracle.install.db.config.asm.diskGroup=
oracle.install.db.config.asm.ASMSNMPPassword=
MYORACLESUPPORT_USERNAME=
MYORACLESUPPORT_PASSWORD=
SECURITY_UPDATES_VIA_MYORACLESUPPORT=
DECLINE_SECURITY_UPDATES=true
PROXY_HOST=
PROXY_PORT=
PROXY_USER=
PROXY_PWD=

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010811.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010820.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010827.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010834.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010842.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010849.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010856.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010903.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010911.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010918.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922010925.png "img")    



⑤responseフォルダにて下記のコマンドで Oracle Database 11R2 をインストールします      

```
# su - oracle
# cd /data/database/database
# ./runInstaller -silent -ignorePrereq -responseFile /data/database/database/response/db_install.rsp
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011219.png "img")    


⑥インストールが無事成功したので確認します      
```
[oracle@iZ6weeunel6mqbdly2gbi1Z database]$ ./runInstaller -silent -ignorePrereq -responseFile /data/database/database/response/db_install.rsp
Starting Oracle Universal Installer...

Checking Temp space: must be greater than 120 MB.   Actual 78441 MB    Passed
Checking swap space: must be greater than 150 MB.   Actual 8191 MB    Passed
Preparing to launch Oracle Universal Installer from /tmp/OraInstall2021-08-26_12-07-54AM. Please wait ...[oracle@iZ6weeunel6mqbdly2gbi1Z database]$ You can find the log of this install session at:
 /data/oraInventory/logs/installActions2021-08-26_12-07-54AM.log
The following configuration scripts need to be executed as the "root" user. 
 #!/bin/sh 
 #Root scripts to run

/data/oraInventory/orainstRoot.sh
/data/oracle/11gr2/root.sh
To execute the configuration scripts:
	 1. Open a terminal window 
	 2. Log in as "root" 
	 3. Run the scripts 
	 4. Return to this window and hit "Enter" key to continue 

Successfully Setup Software.
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011232.png "img")    


⑦インストールログを確認します      
```
# cd /data/oraInventory/logs/
# ls
# tail -f n10 installActions2021-08-26_12-07-54AM.log 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011247.png "img")    



⑧rootでログインし、orainstRoot.shとroot.shを実行します      
```
# cd /data/oraInventory
# sh orainstRoot.sh
# cd /data/oracle/11gr2
# sh root.sh
```
実行結果：
```
[root@iZ6weeunel6mqbdly2gbi1Z ~]# cd /data/oraInventory/
[root@iZ6weeunel6mqbdly2gbi1Z oraInventory]# ls
ContentsXML  install.platform  logs  oraInstaller.properties  oraInst.loc  orainstRoot.sh  oui
[root@iZ6weeunel6mqbdly2gbi1Z oraInventory]# sh orainstRoot.sh
Changing permissions of /data/oraInventory.
Adding read,write permissions for group.
Removing read,write,execute permissions for world.

Changing groupname of /data/oraInventory to oinstall.
The execution of the script is complete.
[root@iZ6weeunel6mqbdly2gbi1Z oraInventory]# cd /data/oracle/11gr2
[root@iZ6weeunel6mqbdly2gbi1Z 11gr2]# ls
apex        cfgtoollogs  css     deinstall    has               instantclient  jdev  log      nls   OPatch       oui    precomp   scheduler     srvm             utl
assistants  clone        ctx     demo         hs                inventory      jdk   md       oc4j  opmn         owb    racg      slax          sysman           wwg
bin         config       cv      diagnostics  ide               j2ee           jlib  mesg     odbc  oracore      owm    rdbms     sqldeveloper  timingframework  xdk
ccr         crs          dbs     dv           install           javavm         ldap  mgw      olap  oraInst.loc  perl   relnotes  sqlj          ucp
cdata       csmig        dc_ocm  emcli        install.platform  jdbc           lib   network  ons   ord          plsql  root.sh   sqlplus       uix
[root@iZ6weeunel6mqbdly2gbi1Z 11gr2]# sh root.sh
Check /data/oracle/11gr2/install/root_iZ6weeunel6mqbdly2gbi1Z_2021-08-26_00-15-50.log for the output of root script
```
⑨実行ログを確認します      
cat /data/oracle/11gr2/install/root_iZ6weeunel6mqbdly2gbi1Z_2021-08-26_00-15-50.log
```
[root@iZ6weeunel6mqbdly2gbi1Z 11gr2]# cat /data/oracle/11gr2/install/root_iZ6weeunel6mqbdly2gbi1Z_2021-08-26_00-15-50.log

Running Oracle 11g root.sh script...

The following environment variables are set as:
    ORACLE_OWNER= oracle
    ORACLE_HOME=  /data/oracle/11gr2

Creating /etc/oratab file...
Entries will be added to the /etc/oratab file as needed by
Database Configuration Assistant when a database is created
Finished running generic part of root.sh script.
Now product-specific root actions will be performed.
Finished product-specific root actions.
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011307.png "img")    


## 1-3-3.Listenerを設定します      
①Listenerを設定します      
```
[root@iZ6weeunel6mqbdly2gbi1Z ~]su - oracle
[oracle@iZ6weeunel6mqbdly2gbi1Z ~]$ netca /silent /responsefile /data/database/database/response/netca.rsp

Parsing command line arguments:
    Parameter "silent" = true
    Parameter "responsefile" = /data/database/database/response
Done parsing command line arguments.
Oracle Net Services Configuration:
Profile configuration complete.
Oracle Net Services configuration successful. The exit code is 0
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011328.png "img")    



②Listenerを起動します      
```
[oracle@iZ6weeunel6mqbdly2gbi1Z ~]$ lsnrctl start
  
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011339.png "img")    



## 1-3-4.サイレントモードでOracleのデータベースを作成します      
①dbca.rspを設定します      
```
# vim dbca.rsp
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011353.png "img")    



②dbca.rspを設定します      

```
[oracle@iZ6weeunel6mqbdly2gbi1Z response]$ grep -Ev "^$|^#" dbca.rsp 
[GENERAL]
RESPONSEFILE_VERSION = "11.2.0"
OPERATION_TYPE = "createDatabase"
[CREATEDATABASE]
GDBNAME = "orcl11g"
SID = "orcl11g"
TEMPLATENAME = "General_Purpose.dbc"
CHARACTERSET = "AL32UTF8"
[createTemplateFromDB]
SOURCEDB = "myhost:1521:orcl"
SYSDBAUSERNAME = "system"
TEMPLATENAME = "My Copy TEMPLATE"
[createCloneTemplate]
SOURCEDB = "orcl11g"
TEMPLATENAME = "My Clone TEMPLATE"
[DELETEDATABASE]
SOURCEDB = "orcl"
[generateScripts]
TEMPLATENAME = "New Database"
GDBNAME = "orcl11g"
[CONFIGUREDATABASE]
[ADDINSTANCE]
DB_UNIQUE_NAME = "orcl11g.us.oracle.com"
NODELIST=
SYSDBAUSERNAME = "sys"
[DELETEINSTANCE]
DB_UNIQUE_NAME = "orcl11g.us.oracle.com"
INSTANCENAME = "orcl11g"
SYSDBAUSERNAME = "sys"

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011407.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011413.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011420.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011426.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011432.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011439.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011446.png "img")    



③DBインスタンスを作成します      
```
# dbca -silent -responseFile dbca.rsp
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011500.png "img")    



④インスタンス作成が始まります      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011540.png "img")    


⑤インスタンスが作成完了したので確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011557.png "img")    



⑥インストールが完了し、下記のログを確認します      
```
# cd /data/oracle/cfgtoollogs/dbca/orcl11g
# ls
# cat orcl11g.log
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011611.png "img")    



## 1-3-5.Oracleのデータベースを起動します      
1）下記のコマンドでOracleを起動します      
①Oracle起動エラーを対処     

```
# su - oracle
# lsnrctl start
# sqlplus / as sysdba
# startup
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011904.png "img")    


②Oracle起動時エラーLRM-00109とORA-01078を対処します      
エラー理由：/data/oracle/11gr2/dbs/initorcl.oraファイルがありません       
```
ORA-01078: failure in processing system parameters
LRM-00109: could not open parameter file '/data/oracle/11gr2/dbs/initorcl.ora'
```

③ORACLE_SIDによって、initorcl.oraで起動します      
起動ファイルはinit+ORACLE_SID.oraが必要であるため、dbsフォルダにないと、エラーが発生します      

まずはORACLE_SIDを確認します      
```
# vi ~/.bash_profile
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011921.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011929.png "img")    


④dbsにinitorcl.oraがあるか確認します      

```
# cd $ORACLE_HOME/dbs
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011941.png "img")    



⑤initorcl.oraを作成します      
```
# find /data -name pfile
# cd /data/oracle/admin/orcl11g/pfile
# ls
# cp /data/oracle/admin/orcl11g/pfile/init.ora.726202105116 $ORACLE_HOME/dbs
# cd $ORACLE_HOME/dbs
# mv init.ora.726202105116 initorcl.ora

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922011953.png "img")    



⑥Oracle起動時エラーORA-00845を対処します      
```
ORA-00845: MEMORY_TARGET not supported on this system
```

⑦./dev/shmサイズを確認します      
原因：MEMORY_TARGETまたはMEMORY_MAX_TARGETのサイズが/dev/shmより大きくなるとエラーが発生します     
```
# df -h
# cat /etc/fstab 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012051.png "img")    



⑧/dev/shmのサイズを増やします      
```
# mount -o remount,size=30G /dev/shm
# vim /etc/fstab
# cat /etc/fstab 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012102.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012108.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012115.png "img")    


⑨エラーORA-01102を対処します      

```
> 原因:lk<sid>ファイルが既に存在します      
ORA-01102: cannot mount database in EXCLUSIVE mode
```

```
> ⑩lk<sid>ファイルを確認します      
# cd /data/oracle/11gr2
# cd dbs/
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012137.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012144.png "img")    

```	
> ⑩lk<sid>ファイルをを削除します      	
# fuser -k lkORCL11G
# fuser -u lkORCL11G
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012159.png "img")    



2）下記のコマンドでOracleを再度起動します      

```
# startup
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012213.png "img")    



ここまでの作業で問題がなければ、Oracle Databaseが正常に起動されます。       

## 1-3-6.Oracleのlistenerを設定します      
1）listenerコンフィグファイルlistener.oraを設定します      
①コンフィグファイルパスを開きます     

```
# cd /data/oracle/11gr2/network/admin/samples
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012254.png "img")    



②listener.oraを設定します      
```
# vim listener.ora
	LISTENER =
	(DESCRIPTION_LIST =
	(DESCRIPTION =
		(ADDRESS = (PROTOCOL = IPC)(KEY = EXTPROC1521))
		(ADDRESS = (PROTOCOL = TCP)(HOST = 172.16.0.96)(PORT = 1521))
	)
	)

	ADR_BASE_LISTENER = /data/oracle/11gr2
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012312.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012319.png "img")    



2）listenerコンフィグファイルtnsnames.oraを設定します      
コンフィグファイル上にある `SERVICE_NAME` を正しく設定する必要があります            
①SERVICE_NAMEを確認します      

```
# su - oracle
# lsnrctl start
# sqlplus shoptest/shoptest as sysdba
SQL> show parameter service_name
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012405.png "img")    



②tnsnames.oraを設定します      
```
# vim tnsnames.ora
	orcl11g =

	(DESCRIPTION =

	(ADDRESS = (PROTOCOL = TCP)(HOST = 8.211.143.78)(PORT = 1521))

	(CONNECT_DATA =

	(SERVER = DEDICATED)

	(SERVICE_NAME = orcl11g)
	)
	)

	EXTPROC_CONNECTION_DATA =
	(DESCRIPTION =
	(ADDRESS_LIST =
	(ADDRESS = (PROTOCOL = IPC)(KEY = EXTPROC))
	)
	(CONNECT_DATA =
	(SID = PLSExtProc)
	(PRESENTATION = RO)
	)
	) 
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012420.png "img")    



# 2.DUMPデータを Oracle Database 11R2 へインポート
# 2-1.Oracle Databaseを設定します      
1）Oracleユーザーを作成します      
①Oracle Databaseを起動します      

```Oracle Database起動コマンド
# su - oracle
# lsnrctl start
# sqlplus / as sysdba
# startup
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922012512.png "img")    



②shoptestユーザーを作成します      

```
SQL> CREATE USER shoptest IDENTIFIED BY "shoptest";
User created.
SQL> GRANT "DBA" TO shoptest WITH ADMIN OPTION;
Grant succeeded.
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021711.png "img")    


2）gitをインストールします      
①rootユーザーでgitをインストールします      
```
# yum -y install git

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021726.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021734.png "img")    



2）プロジェクトをダウンロードします      
①今回のプロジェクトはAlibabaCloud中国サイトのBest Practiceからのソースを使っています       
[AliyunSite best practice link](https://bp.aliyun.com/detail/130)

> https://bp.aliyun.com/detail/130


```
# git clone https://code.aliyun.com/best-practice/130.git
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021824.png "img")    



②rootユーザーでプロジェクトを解凍します      

```
# cd 130/oracle-dump-data/
# gunzip shoptest.tar.gz
# tar -xvmf shoptest.tar
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021842.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021850.png "img")    


③shoptest.dmpファイルをOracleフォルダに移動します      

```
# mv /root/130/oracle-dump-data/shoptest/shoptest.dmp /data/oracle/
# cd /data/oracle/
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021905.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021911.png "img")    


④oracleユーザーでshop1ディレクトリを作成します      

```
# su - oracle
# sqlplus / as sysdba
# create directory shop1 as '/data/oracle';
# grant read, write on directory shop1 to shoptest;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021925.png "img")    



# 2-2.DUMPデータをOracleにインポートします      
1）Dumpデータをインポートします      
①Dumpデータをインポートします      

```
# cd /data/database
# impdp shoptest/shoptest DIRECTORY=shop1 DUMPFILE=shoptest.dmp transform=segment_attributes:n
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021941.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922021950.png "img")    



2）Oracleテーブルを確認します      

```
# sqlplus / as sysdba
# SQL> conn shoptest/shoptest
# SQL> select count(*) from user_tables;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022004.png "img")    


3）DMSでOracleデータベースを確認します      
①AlibabaCloudをログインし、DMSコンソール画面でGo to NEW DMSボタンをクリックします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022017.png "img")    


②接続情報を入力し、Oracle管理画面に遷移します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022028.png "img")    


③shoptestのテーブルを確認します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022038.png "img")    


# 2-3.Oracleに全角文字のテーブルを作成します      

①Oracleユーザーを作成します      

```
# sqlplus / as sysdba
# SQL> CREATE USER nancytest IDENTIFIED BY "nancytest";
# SQL> GRANT "DBA" TO nancytest WITH ADMIN OPTION;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022153.png "img")    




②DMSでOracleを接続します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022204.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022215.png "img")    


③DMSで全角文字のテーブルを作成します      

```ignore_case_products
create table ignore_case_products (
    item_cd varchar(100),
    name varchar(255)
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022224.png "img")    



④データを挿入します      

```
insert all 
into ignore_case_products(item_cd,name) values('item1','サクラカタカナ')
into ignore_case_products(item_cd,name) values('item2','ｻｸﾗｶﾀｶﾅ')
into ignore_case_products(item_cd,name) values('item3','さくらかたかな')
into ignore_case_products(item_cd,name) values('item4','サクラヒラガナ')
into ignore_case_products(item_cd,name) values('item5','ｻｸﾗﾋﾗｶﾞﾅ')
into ignore_case_products(item_cd,name) values('item6','さくらひらがな')
into ignore_case_products(item_cd,name) values('item7','ＡＰＰＬＥ')
into ignore_case_products(item_cd,name) values('item8','ａｐｐｌｅ')
into ignore_case_products(item_cd,name) values('item9','Ａｐｐｌｅ')
into ignore_case_products(item_cd,name) values('item10','123')
into ignore_case_products(item_cd,name) values('item11','abc')
into ignore_case_products(item_cd,name) values('item11','ABC')
into ignore_case_products(item_cd,name) values('item11','Abc')
select * from dual;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022235.png "img")    



⑤DMSでデータを検索します      

```
select * from ignore_case_products where name like 'サクラカタカナ';
select * from ignore_case_products where name like 'ｻｸﾗｶﾀｶﾅ';
select * from ignore_case_products where name like 'abc';
select * FROM ignore_case_products;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022246.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022254.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022300.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022307.png "img")    



⑥DMSで文字処理関数を使って検索します      

```
SELECT item_cd , utl_i18n.transliterate(name,'KANA_FWKATAKANA') FROM ignore_case_products WHERE name='さくらかたかな';
SELECT item_cd , utl_i18n.transliterate(name,'KANA_HIRAGANA') FROM ignore_case_products WHERE name='ｻｸﾗﾋﾗｶﾞﾅ';
select item_cd , TO_MULTI_BYTE(name) FROM ignore_case_products WHERE name='abc';

```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022321.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022328.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022335.png "img")    



⑦OracleViewを作成します      

```
CREATE OR REPLACE VIEW kana_fwkatakana_view AS
SELECT UTL_I18N.TRANSLITERATE(name, 'kana_fwkatakana') AS kana_fwkatakana_name FROM ignore_case_products where not regexp_like(name,'^[a-zA-Z0-9]')

CREATE OR REPLACE VIEW kana_HIRAGANA_view AS
SELECT UTL_I18N.TRANSLITERATE(name, 'kana_HIRAGANA') AS kana_HIRAGANA_name FROM ignore_case_products  where not regexp_like(name,'^[a-zA-Z0-9]')

CREATE OR REPLACE VIEW num_en_name_view AS
SELECT  TO_MULTI_BYTE(name) AS num_en_name FROM ignore_case_products where regexp_like(name,'^[a-zA-Z0-9]')

SELECT * FROM  kana_fwkatakana_view;
SELECT * FROM  kana_HIRAGANA_view;
SELECT * FROM  num_en_name_view;
select * from user_views ignore_case_products
```

kana_fwkatakana_viewを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022357.png "img")    



kana_HIRAGANA_viewを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022409.png "img")    


num_en_name_viewを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022418.png "img")    


kana_fwkatakana_viewを検索します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022428.png "img")    


kana_HIRAGANA_viewを検索します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022437.png "img")    


num_en_name_viewを検索します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022445.png "img")    


viewを検索します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022454.png "img")    


# 3.ECSでアプリケーション環境をデプロイ
# 3-1.VPCとECSを作成します（ここでは説明を省略します）         
1）ECSインスタンスを作成します（省略）      
① ECSを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022539.png "img")    


② ECS - APPはOracleのECSと同じVPCを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022556.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022603.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022610.png "img")    


③ ECSへログインします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022629.png "img")    



2）Oracle Databaseが入っているECSに対し、ECS - APPのIPアドレスおよびPort 1521のアクセス権限を付与します     
①ECS - APPのプライベートIPを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022731.png "img")    


②セキュリティグループに Port 1521を追加します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022751.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022759.png "img")    



# 3-2.アプリケーションプロジェクトJarを作成します      
1）lrzszをインストールします      

```
yum install lrzsz
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022854.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022901.png "img")    



2）Java1.8をインストールします（ここでは説明を省略します）     
Java1.8のインストール方法については、上記、Step 1-3-1-2.の Java環境インストール方法をご参照ください      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922022945.png "img")    


3）maven環境をインストールします      
①mavenをダウンロードします      

```
# wget https://dlcdn.apache.org/maven/maven-3/3.8.2/binaries/apache-maven-3.8.2-bin.tar.gz
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023020.png "img")    


②mavenファイルを解凍します      

```
# mkdir /usr/local/maven
# tar -zxvf apache-maven-3.8.2-bin.tar.gz -C /usr/local/maven/
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023034.png "img")    


③/usr/local/maven/に移動します      

```
# cd /usr/local/maven/
# cd apache-maven-3.8.2
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023046.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023053.png "img")    



④maven環境関数を設定します      

```
# vi /etc/profile
	 export MAVEN_HOME=/usr/local/maven/apache-maven-3.8.2
	 export PATH=${MAVEN_HOME}/bin:$PATH
# source /etc/profile
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023113.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023119.png "img")    



⑤Mavenバージョンを確認します      

```
# mvn -version
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023133.png "img")    


⑥settings.xmlにmirrorを設定します      

```
# cd /usr/local/maven/apache-maven-3.8.2/conf
# ls
# vim settings.xml
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023152.png "img")    


```settings.xml
vim settings.xml
<mirror>  
	<id>nexus-aliyun</id>  
	<mirrorOf>central</mirrorOf>    
	<name>Nexus aliyun</name>  
	<url>http://maven.aliyun.com/nexus/content/groups/public</url>  
</mirror>
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023405.png "img")    



⑦settings.xmlにlocalrepositoryを設定します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023417.png "img")    


⑧MavenRepositoryフォルダを作成します      

```
# cd /home
# mkdir MavenRepository
# cd MavenRepository
# pwd
/home/MavenRepository
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023428.png "img")    


3）appのJarパッケージを作成します      
前提条件：ローカルPCにIntelliJ IDEAとJavaなどの環境が既に実装したので確認します      

①CMDで下記コマンドでprojectをローカルにダウンロードします      
```
git clone https://code.aliyun.com/best-practice/130.git
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023440.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023449.png "img")    



②Oracle Database - ECS のプライベートIPを確認します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023515.png "img")    


②Oracle Database - ECS のOracle Servicenameを確認します      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023533.png "img")    


③IntelliJ IDEでプロジェクトを開きます      
jdbc.propertiesを修正します(今回、OracleのECSとAPPのECSが同じVPCであるため、jdbc.urlではプライベートIPとServerNameの方法で接続します)

```jdbc.properties
\130\src\main\resources\jdbc.properties
jdbc.driver=oracle.jdbc.driver.OracleDriver
jdbc.url=jdbc:oracle:thin:@//172.16.0.96:1521/orcl11g
jdbc.user = shoptest
jdbc.password = shoptest
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023620.png "img")    


④プロジェクトをビルドします      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023631.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023638.png "img")    



⑤プロジェクトのJarパッケージを作成します      

```
mvn clean package -DskipTests
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023651.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023659.png "img")    


⑥プロジェクトのtargetフォルダにJarファイルを作成します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023710.png "img")    



# 3-3.アプリケーションをデプロイします      
1）shop-1.0.0-SNAPSHOT-release.tar.gzファイルをECS - APPにアップロードします      
rzコマンドでファイルを選択します      

```
# mkdir shoptest
# cd shoptest
# rz
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023759.png "img")    


②Jarファイルを解凍します      

```
# gunzip shop-1.0.0-SNAPSHOT-release.tar.gz
# tar -xvmf shop-1.0.0-SNAPSHOT-release.tar
# ls
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023813.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023820.png "img")    



2）run.shを実行します      
①run.shを実行します      

```
# cd shop
# ./run.sh
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023833.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023840.png "img")    



②エラー問題を解決します      
-bash: ./run.sh: /bin/sh^M: bad interpreter: No such file or directory

```
# yum install dos2unix
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023859.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023906.png "img")    


```
# dos2unix run.sh
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023917.png "img")    



③run.shを実行します      
```
# ./run.sh
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023930.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023938.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023945.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922023952.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922024002.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922024009.png "img")    



3）APPサイトを開きます
①ECS - APPのセキュリティグループにPort 8080を付与し、ホワイトリストとしてアクセス権限を追加します      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922024021.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922024028.png "img")    


②下記リンクでAPPサイトを開きます
```
http://8.211.134.35:8080/index.action
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922024039.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-PolarDB/polardb_images_13574176438014222676/20210922024049.png "img")    

# 最後に

ここまでマイグレーションのターゲットとなるOracle Databaseおよびアプリケーション環境の準備が完了しました。
次はPart2 ADAMによる診断をはじめ、どのようなプロセスでマイグレーションをするかを説明します。     

> http://sbopsv.github.io/cloud-tech/usecase-PolarDB/PolarDB_002_oracle-migration-part2


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>




