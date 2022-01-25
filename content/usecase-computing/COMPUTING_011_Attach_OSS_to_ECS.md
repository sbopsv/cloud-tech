---
title: "ECSにOSSをマウントする"
metaTitle: "ECSにOSSをマウントしてみる"
metaDescription: "ECSにOSSをマウントしてみる"
date: "2020-06-04"
author: "sbc_yuki"
thumbnail: "/computing_images_26006613550959400/000000000000000001.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## ECSにOSSをマウントする

!![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550959400/000000000000000001.png "img")

本記事では、AlibabaCloudのプロダクトであるECS(Elastic Compute Service)とOSS(Object Storage Service)を使って簡単に分かりやすくマウントする方法についてをご紹介します。     

■ ECS(Elastic Compute Service):   
[www.alibabacloud.com](https://www.alibabacloud.com/ja/product/ecs)

> https://www.alibabacloud.com/ja/product/ecs

■ OSS(Object Storage Service):    
[www.alibabacloud.com](https://www.alibabacloud.com/ja/product/oss)

> https://www.alibabacloud.com/ja/product/oss

**【環境】**
・リージョン (Japan)  
・ECS (ecs.t5-lc2m1.nano)  
・OS (CentOS 7.7 64-bit)  
・OSS バケット

**【事前準備】  
**・ECSインスタンスを１つ作成  
     ⇨ IPアドレスはPublicIP or ElasticIPで設定  
・OSSでバケットを１つ作成・OS (CentOS 7.7 64-bit)  
・セキュリティグループで接続元IPがPort22(SSH)への接続が許可されていることを確認

今回は、OSSFS(Object Storage Service File System)を使用します。OSSFSとはAlibabaCloudが提供するFUSEをベースにしたファイルシステムです。  
OSSFSデータボリュームは、OSSバケットをデータボリュームとしてパッケージ化できます。OSSは99.999999999%(11 nines)の可用性があります。

**OSSFSは以下の点がローカルファイルシステムと異なります。**  
**・**ランダム書き込みまたは追加書き込みにより、ファイル全体が上書きされます。     
**・**ディレクトリのリスト化などのメタデータ操作はパフォーマンスがよくありません。システムが OSS サーバーにリモートアクセスする必要があるためです。    
**・**ファイル/フォルダの名前の変更操作はアトミックではありません。     
**・**複数のクライアントが同じ OSS バケットにマウントされている場合、各クライアントのアクションを自ら調整します。    
　たとえば、複数のクライアントが同じファイルを書き込むことを避けます。    
**・**ハードリンクがサポートされません。    

上記のことから、OSSバケットから頻繁に呼び出すシステムや、複数クラアントが操作をする状況が発生するシナリオがある場合は、NASをご利用することをおすすめします。     

■File Storage NAS

[www.alibabacloud.com](https://www.alibabacloud.com/ja/product/nas)

> https://www.alibabacloud.com/ja/product/nas

  
# マウント手順  

## wgetでrpmパッケージをダウンロード
※適当な作業ディレクトリを作成して作業を行うことを推奨

```
[root@test-centos7 test.space]# wget http://gosspublic.alicdn.com/ossfs/ossfs_1.80.5_centos7.0_x86_64.rpm?spm=a21mg.p38356.a3.4.6f58e8deNNEFzs&file=ossfs_1.80.5_centos7.0_x86_64.rpm
```

## リネームを実施ダウンロードファイルを.rpmファイルに変更

```
[root@test-centos7 test.space]#mv ossfs_1.80.5_centos7.0_x86_64.rpm?spm=a21mg.p38356.a3.4.6f58e8deeIaDoN ossfs_1.80.5_centos7.0_x86_64.rpm
```

## ダウンロードしたrpmパッケージのインストール

```
[root@test-centos7 test.space]# rpm -iV ossfs_1.80.5_centos7.0_x86_64.rpm
パッケージ ossfs_1.80.5_centos7.0_x86_64.rpm はインストールされていません。

[root@test-centos7 test.space]# rpm -iUh ossfs_1.80.5_centos7.0_x86_64.rpm
エラー: 依存性の欠如: fuse >= 2.8.4 は ossfs-1.80.5-1.x86_64 に必要とされています fuse-libs >= 2.8.4 は ossfs-1.80.5-1.x86_64 に必要とされています
```

## yumで足りないossfsパッケージのインストール 

```
\[root@test-centos7 test.space\]# _yum install ossfs\*_  
\========================================================================================================================  
Package アーキテクチャー バージョン リポジトリー 容量  
\========================================================================================================================  
インストール中:  
ossfs x86\_64 1.80.5-1 /ossfs\_1.80.5\_centos7.0\_x86\_64 4.2 M  
依存性関連でのインストールをします:  
fuse x86\_64 2.9.2-11.el7 base 86 k  
fuse-libs x86\_64 2.9.2-11.el7 base 93 k

トランザクションの要約  
\========================================================================================================================  
インストール 1 パッケージ (+2 個の依存関係のパッケージ)
```

## インストールされたことを確認

```
\[root@test-centos7 ~\]# _rpm -qa | grep ossfsossfs-1.80.5-1.x86\_64_
```

## マウント状況を確認する

```
\[root@test-centos7 test.space\]# _df -h_  
ファイルシス サイズ 　　使用 　　残り 　使用% 　マウント位置  
/dev/vda1　　　40G　　2.0G　　36G 　　6%　　 /  
devtmpfs 　　486M　　　  0  　 486M 　　0% 　　/dev  
tmpfs　　　　496M　　　  0 　  496M 　　0%　　 /dev/shm  
tmpfs　　　　496M　   420K 　  496M 　　1%　　 /run  
tmpfs　　　　496M　　  　0 　  496M 　　0% 　　/sys/fs/cgroup  
tmpfs　　　　100M              0 　   100M 　　0% 　　/run/user/0
```

## アクセスキー等、諸々設定

※事前に／etc配下にpasswd-ossfsファイルを作成しておく（パーミッションはchmod 640）  
※事前に/tmp配下にossfsディレクトリを作成しておく。

```
・アクセスキーの登録書式 )  
\[root@mount-test ~\]#_echo my-bucket:my-access-key-id:my-access-key-secret > /etc/passwd-ossfs_  
  
・OSSバケットのマウント書式 )  
\[root@mount-test ~\]#_ossfs my-bucket my-mount-point -ourl=my-oss-endpoint_  
実行例 )  
\[root@mount-test ~\]#_ossfs my-bucket /tmp/ossfs -ourl=[http://oss-cn-hangzhou.aliyuncs.com](http://oss-cn-hangzhou.aliyuncs.com/)_
```

## Object Storage Service(OSS)がマウントされたことを確認
```
\[root@test-centos7 test.space\]# _df -h_  
ファイルシス サイズ     使用         残り       使用%   マウント位置  
/dev/vda1　　40G 　　2.0G 　　36G　 6%          /  
devtmpfs　 486M　　　　0     486M        0%          /dev  
tmpfs　　　496M　　　　0     496M        0%          /dev/shm  
tmpfs　　　496M　　420K      496M       1%           /run  
tmpfs　　　496M 　　　   0     496M       0%           /sys/fs/cgroup  
tmpfs　　　100M　　　    0　  100M       0%           /run/user/0  
ossfs　　　  256T 　　　   0　   256T       0%           /tmp/ossfs　・・・追加された  
```

動作確認は、/tmp/ossfsディレクトリに実際にファイルをアップロードまたは作成を行い、AlibabaCloudのコンソール上のOSSで対象ファイルを確認ができれば問題ないです。    

## バックエンドのマウント解除  
※アンマウント後は、dfコマンドでディスクのマウントが外れたか確認を行う。

```
\[root@test-centos7 test.space\]# _fusermount -u /tmp/ossfs_
```

# 最後に
ディスク容量を増やしたい時に増やす方法は色々あります。よくあるのはLVMでの拡張が多いイメージだと思います。  
ログローテーションが出来ない場合や、長期間ログを保持する運用だと、ログファイルによってディスク容量をひっ迫させる事が中にはあるかと思いますが、本記事のように簡単にマウントが出来るOSSを使えば、LVMの拡張と比べると簡単にディスク容量を増やす事ができます。また、コマンドライン操作が苦手な方でもGUIで操作ができるので、個人的には属人化しなくて使いやすいかと思います。      

ECS内で全てのデータを保持していると、ごく稀に発生するファイルシステムの破損やハングアップがあった時など、直近のログを取得できない状況が発生します。コストを抑える事も大事ですが、可用性を高める事も大事です。ECSのみで運用されている方、そうでない方も是非ご参考に頂ければ幸いです。    


 <CommunityAuthor 
    author="ShotoYuki"
    self_introduction = "無記載"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yuki_shoto.jpg"
    githubUrl=""
/>

