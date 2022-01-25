---
title: "イメージディスクサイズ拡張方法"
metaTitle: "Alibaba Cloud ECS イメージ機能のディスクサイズの拡張方法"
metaDescription: "Alibaba Cloud ECS イメージ機能のディスクサイズの拡張方法"
date: "2020-01-07"
author: "SBC engineer blog"
thumbnail: "/computing_images_26006613488852800/010.png"
---

## Alibaba Cloud ECS イメージ機能のディスクサイズの拡張方法

今回は、Alibaba Cloud ECS イメージ機能のディスクサイズの拡張方法を紹介します。

拡張する前のディスク状況はこんな感じです。

```shell
# fdisk -l

デバイス ブート      始点        終点     ブロック   Id  システム
/dev/vda1   *        2048     2099199     1048576   83  Linux
/dev/vda2         2099200    16777215     7339008   8e  Linux LVM
```
今回は新たに /dev/vda3 を作成し、使っていないディスクサイズを割り当てました。
```shell
# fdisk -l

デバイス ブート      始点        終点     ブロック   Id  システム
/dev/vda1   *        2048     2099199     1048576   83  Linux
/dev/vda2         2099200    16777215     7339008   8e  Linux LVM
/dev/vda3        16777216   209715199    96468992   8e  Linux LVM
```

拡張方法はこちらです。
```shell
# fdisk /dev/vda 
    n
    p
    3
    [enter]
    [enter]
    t
    3
    8e
    p
    w
# reboot　※ここでrebootしないと/dev/vda3が認識されません。
# pvcreate /dev/vda3
# pvdisplay 
# vgextend rhel /dev/vda3
# vgdisplay 
# lvextend -l +100%FREE /dev/rhel/root
# xfs_growfs /dev/rhel/root
# df -h
```
実行 log はこちらです。
```shell
[root@Redhat ~]# fdisk /dev/vda
Welcome to fdisk (util-linux 2.23.2).

Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


コマンド (m でヘルプ): n
Partition type:
   p   primary (2 primary, 0 extended, 2 free)
   e   extended
Select (default p): p
パーティション番号 (3,4, default 3): 3
最初 sector (16777216-209715199, 初期値 16777216):
初期値 16777216 を使います
Last sector, +sectors or +size{K,M,G} (16777216-209715199, 初期値 209715199):
初期値 209715199 を使います
Partition 3 of type Linux and of size 92 GiB is set

コマンド (m でヘルプ): t
パーティション番号 (1-3, default 3): 3
Hex code (type L to list all codes): 8e
Changed type of partition 'Linux' to 'Linux LVM'

コマンド (m でヘルプ): p

Disk /dev/vda: 107.4 GB, 107374182400 bytes, 209715200 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O サイズ (最小 / 推奨): 512 バイト / 512 バイト
Disk label type: dos
ディスク識別子: 0x000b4c65

デバイス ブート      始点        終点     ブロック   Id  システム
/dev/vda1   *        2048     2099199     1048576   83  Linux
/dev/vda2         2099200    16777215     7339008   8e  Linux LVM
/dev/vda3        16777216   209715199    96468992   8e  Linux LVM

コマンド (m でヘルプ): w
パーティションテーブルは無事変更されました。    

ioctl() を呼び出してパーティションテーブルを再読込みします。

WARNING: Re-reading the partition table failed with error 16: デバイスもしくはリソースがビジー状態です.
The kernel still uses the old table. The new table will be used at
the next reboot or after you run partprobe(8) or kpartx(8)
ディスクを同期しています。


[root@Redhat ~]# pvcreate /dev/vda3
  Device /dev/vda3 not found.


[root@Redhat ~]# reboot


[root@Redhat ~]# pvcreate /dev/vda3
  Physical volume "/dev/vda3" successfully created.
[root@Redhat ~]#
[root@Redhat ~]#
[root@Redhat ~]# pvdisplay
  --- Physical volume ---
  PV Name               /dev/vda2
  VG Name               rhel
  PV Size               <7.00 GiB / not usable 3.00 MiB
  Allocatable           yes (but full)
  PE Size               4.00 MiB
  Total PE              1791
  Free PE               0
  Allocated PE          1791
  PV UUID               UZVses-HbtL-iC7Z-fYVE-bE1D-8eCQ-idvSTJ

  "/dev/vda3" is a new physical volume of "92.00 GiB"
  --- NEW Physical volume ---
  PV Name               /dev/vda3
  VG Name
  PV Size               92.00 GiB
  Allocatable           NO
  PE Size               0
  Total PE              0
  Free PE               0
  Allocated PE          0
  PV UUID               baejtP-mYYS-7J6K-hmTr-tLKZ-XlWJ-pZS3Pl

[root@Redhat ~]# vgextend rhel /dev/vda3
  Volume group "rhel" successfully extended
[root@Redhat ~]# vgdisplay
  --- Volume group ---
  VG Name               rhel
  System ID
  Format                lvm2
  Metadata Areas        2
  Metadata Sequence No  4
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                2
  Open LV               2
  Max PV                0
  Cur PV                2
  Act PV                2
  VG Size               98.99 GiB
  PE Size               4.00 MiB
  Total PE              25342
  Alloc PE / Size       1791 / <7.00 GiB
  Free  PE / Size       23551 / <92.00 GiB
  VG UUID               2Q1PbX-fe2g-ebBn-Dxd6-0g9o-WhFj-rpfn1I

[root@Redhat ~]# lvextend -l +100%FREE  /dev/rhel/root
  Size of logical volume rhel/root changed from <6.20 GiB (1586 extents) to 98.19 GiB (25137 extents).
  Logical volume rhel/root successfully resized.
[root@Redhat ~]#
[root@Redhat ~]# xfs_growfs /dev/rhel/root
meta-data=/dev/mapper/rhel-root  isize=512    agcount=4, agsize=406016 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=0 spinodes=0
data     =                       bsize=4096   blocks=1624064, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
log      =internal               bsize=4096   blocks=2560, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0
data blocks changed from 1624064 to 25740288
[root@Redhat ~]#
[root@Redhat ~]# df -h
ファイルシス          サイズ  使用  残り 使用% マウント位置
/dev/mapper/rhel-root    99G  1.7G   97G    2% /
devtmpfs                3.9G     0  3.9G    0% /dev
tmpfs                   3.9G     0  3.9G    0% /dev/shm
tmpfs                   3.9G  8.6M  3.9G    1% /run
tmpfs                   3.9G     0  3.9G    0% /sys/fs/cgroup
/dev/vda1              1014M  148M  867M   15% /boot
tmpfs                   783M     0  783M    0% /run/user/0
[root@Redhat ~]#
[root@Redhat ~]#
[root@Redhat ~]# fdisk -l

Disk /dev/vda: 107.4 GB, 107374182400 bytes, 209715200 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O サイズ (最小 / 推奨): 512 バイト / 512 バイト
Disk label type: dos
ディスク識別子: 0x000b4c65

デバイス ブート      始点        終点     ブロック   Id  システム
/dev/vda1   *        2048     2099199     1048576   83  Linux
/dev/vda2         2099200    16777215     7339008   8e  Linux LVM
/dev/vda3        16777216   209715199    96468992   8e  Linux LVM

Disk /dev/mapper/rhel-root: 105.4 GB, 105432219648 bytes, 205922304 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O サイズ (最小 / 推奨): 512 バイト / 512 バイト


Disk /dev/mapper/rhel-swap: 859 MB, 859832320 bytes, 1679360 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O サイズ (最小 / 推奨): 512 バイト / 512 バイト
```


以上となります。最後まで読んでいただき、ありがとうございました。    

