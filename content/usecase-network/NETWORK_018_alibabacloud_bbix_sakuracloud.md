---
title: "さくらクラウドをBBIXで繋げる"
metaTitle: "Alibaba Cloud 上海リージョンとさくらのクラウド東京リージョンをBBIXで繋げてみた"
metaDescription: "Alibaba Cloud 上海リージョンとさくらのクラウド東京リージョンをBBIXで繋げてみた"
date: "2020-12-01"
author: "sbc_yoshimura"
thumbnail: "/Network_images_26006613659120000/20201201175616.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Alibaba Cloud 上海リージョンとさくらのクラウド東京リージョンをBBIXで繋げてみた

# はじめに

本記事では、Alibaba Cloud 上海リージョンとさくらのクラウド東京リージョンをBBIXで繋げてみた結果をご紹介します。


# ネットワーク構成

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613659120000/20201201175616.png "img")    


今回このような構成を試してみました。

> ① Alibaba Cloud 上海リージョンとAlibaba Cloud 東京リージョンはAlibaba Cloud の国際リージョン間接続サービス CENを利用
> ② Alibaba Cloud 東京リージョンとさくらのクラウド東京リージョンは BBIX による L2 接続
> ③ソフトバンク（元SBクラウド）とさくらのクラウドそれぞれのネットワーク機器で、VLANとルーティング情報を広報

# マルチクラウド接続の背景

バッドなニュースばかりの2020年でしたが、クラウド業界では様々な動きがありました。

クラウド好きは既にご存知かもしれないですが、7月にBBIX社がマルチクラウド接続サービスを提供開始しました。

[www.bbix.net](https://www.bbix.net/information/press/2020-07-03/)

Alibaba Cloud 東京リージョンやさくらのクラウドへの閉域接続がBBIX社より提供されていることで、複数のクラウド事業者からエンドースメントもありました。

ただし、こちらのサービスは顧客環境から複数のパブリッククラウド環境への閉域接続でして、マルチクラウド間の閉域接続ではありません。

[www.bbix.net](https://www.bbix.net/service/ix/multicloud/)

今回試したネットワーク構成は、2020/12/1時点ではBBIX社でサービス化されていないマルチクラウド間の閉域接続を試しております。

BBIX社とさくらインターネット社の関係者が快くご協力いただき、今回の接続テストが実現しました。

この場を借りて改めてお礼申し上げます。

# 計測

3社でリモート会議してみて、このやり方で接続はできるだろうと3社とも考えていたのですが、案の定簡単にできました。

ここでは接続確認後に調べてみたことをいくつか紹介します。

**計測方法** 

1.  ping    
2.  qperf (ノード間の速度とレイテンシ)   
3.  rsync (1M、10M、100M、1Gファイル転送)    

**計測対象の通信経路**


* 東京ECS <--> 東京さくらクラウドサーバ (BBIX経由)    
* 東京ECS <--> 東京さくらクラウドサーバ (インターネット経由)    
* 上海ECS <--> 東京さくらクラウドサーバ (CEN+BBIX経由)    
* 上海ECS <--> 東京さくらクラウドサーバ (インターネット経由)    

**計測結果　※2020/12/01 に1回実行のみの結果です。**


東京ECS <--> 東京さくらのクラウドサーバ     
上海ECS <--> 東京さくらのクラウドサーバ     

> パケットロス     
```
0%(BBIX経由)
0%(インターネット経由) 
0%(CEN+BBIX経由)
0%(インターネット経由)
```

> レイテンシ    
```
3.929ms(BBIX経由)
2.058ms(インターネット経由)
33.072ms(CEN+BBIX経由)
33.081ms(インターネット経由) 
```

> 帯域    
```
968 Mbps(BBIX経由)
96.9 Mbps(インターネット経由)
2.13 Mbps(CEN+BBIX経由)
94.4 Mbps(インターネット経由) 
```

> 1GBファイル転送時間
```
9秒(BBIX経由)
1分26秒(インターネット経由)
1時間6分31秒(CEN+BBIX経由)
2分51秒(インターネット経由) 
```

# 考察
* BBIX経由の東京ECSと東京さくらのクラウドのマルチクラウド通信は約1Gbps（想定通り）    
* CEN＋BBIX経由の上海ECSと東京さくらのクラウドのマルチクラウド通信は約2Mbps（想定通り）    
* インターネット経由の東京ECSと東京さくらのクラウド通信は約100Mbps  (想定通り)    
* インターネット経由の上海ECSと東京さくらのクラウド通信は約100Mbps  (**想定外!!**)    

こちらの想定以上に上海ECSとさくらのクラウド東京サーバまでのインターネット通信が速くて、安定もしていました。そもそも東京ECSと上海ECSのNICはインターネット速度100Ｍbpsピーク設定なのですが、まさか上海ECSでほぼフルで出るとは。そのため、日中間インターネットで1GBファイル転送がスムーズに出来ちゃいました。今回インターネットが想定以上に良かったため、相対的にCEN+BBIX経由の通信が遅く感じてしまいます。    

しかし、CEN＋BBIX経由でボトルネックになっているCEN帯域は増やせば増やすだけ速くなります。当然その分のCENコストが掛かりますが、安定した通信が必要な場合にはやはり適切でしょう。    

この結果だけを見ると、上海ECSとさくらのクラウドサーバ間の通信は、大容量転送はインターネットで行い、安定した通信はCEN+BBIXで行う、というのが賢い使い方のようです。    

とはいえ、今回は１度だけの測定でしたので、日中間通信のパケットロスなどは継続して測ってきたいと思います。おそらく長期的なパケットロス測定ではインターネットよりもCEN+BBIXに優位性があると推測してます。    

また、今回はネットワーク部分での計測でしたが、2社のクラウドサービスの特徴を考えると色々と面白い組み合わせができそうな気がします。    
 
時間を見つけてミドルウェアやアプリケーションなどでの検証もやってみたいと思います。    

# 検証の詳細結果 

# ping 3600発

さくらのクラウドサーバから東京ECS (BBIX経由)

```
--- 東京ECS(BBIX経由) ping statistics ---
3600 packets transmitted, 3598 received, 0% packet loss, time 3604510ms
rtt min/avg/max/mdev = 3.738/3.929/4.627/0.105 ms
```

さくらのクラウドサーバから東京ECS (インターネット経由)

```
--- 東京ECS(インターネット経由) ping statistics ---
3600 packets transmitted, 3600 received, 0% packet loss, time 3603002ms
rtt min/avg/max/mdev = 1.902/2.058/4.450/0.085 ms
```

さくらのクラウドサーバから上海ECS (CEN+BBIX経由)

```
--- 上海ECS(CEN+BBIX経由) ping statistics ---
3600 packets transmitted, 3600 received, 0% packet loss, time 3604040ms
rtt min/avg/max/mdev = 31.730/33.072/2162.936/41.166 ms, pipe 3
```

さくらのクラウドサーバから上海ECS (インターネット経由)

```
--- 上海ECS(インターネット経由) ping statistics ---
3600 packets transmitted, 3575 received, 0% packet loss, time 3602042ms
rtt min/avg/max/mdev = 32.907/33.081/33.664/0.166 ms
```

# qperfによるノード間の速度とレイテンシ 

さくらのクラウドサーバから東京ECS (BBIX経由)

```
# qperf -vvs -t 60 --use_bits_per_sec 東京ECS(BBIX経由) tcp_bw tcp_lat
tcp_bw:
    bw          =      968 Mb/sec
    msg_rate    =     1.85 K/sec
    send_bytes  =     7.26 GB
    send_msgs   =  110,808
    recv_bytes  =     7.26 GB
    recv_msgs   =  110,790
tcp_lat:
    latency         =    1.65 ms
    msg_rate        =     607 /sec
    loc_send_bytes  =    18.2 KB
    loc_recv_bytes  =    18.2 KB
    loc_send_msgs   =  18,198
    loc_recv_msgs   =  18,197
    rem_send_bytes  =    18.2 KB
    rem_recv_bytes  =    18.2 KB
    rem_send_msgs   =  18,197
    rem_recv_msgs   =  18,197
```

さくらのクラウドサーバから東京ECS(インターネット経由)

```
# qperf -vvs -t 60 --use_bits_per_sec 東京ECS(インターネット経由) tcp_bw tcp_lattcp_bw:
    bw          =    96.9 Mb/sec
    msg_rate    =     185 /sec
    send_bytes  =     727 MB
    send_msgs   =  11,100
    recv_bytes  =     727 MB
    recv_msgs   =  11,092
tcp_lat:
    latency         =    1.53 ms
    msg_rate        =     654 /sec
    loc_send_bytes  =    19.6 KB
    loc_recv_bytes  =    19.6 KB
    loc_send_msgs   =  19,622
    loc_recv_msgs   =  19,621
    rem_send_bytes  =    19.6 KB
    rem_recv_bytes  =    19.6 KB
    rem_send_msgs   =  19,621
    rem_recv_msgs   =  19,621
```

さくらのクラウドサーバから上海ECS (CEN+BBIX経由)

```
# qperf -vvs -t 60 --use_bits_per_sec 上海ECS(CEN+BBIX経由) tcp_bw tcp_lat
tcp_bw:
    bw          =  2.13 Mb/sec
    msg_rate    =  4.07 /sec
    send_bytes  =    16 MiB (16,777,216)
    send_msgs   =   256
    recv_bytes  =    16 MB
    recv_msgs   =   244
tcp_lat:
    latency         =     16 ms
    msg_rate        =   62.5 /sec
    loc_send_bytes  =   1.88 KB
    loc_recv_bytes  =   1.88 KB
    loc_send_msgs   =  1,877
    loc_recv_msgs   =  1,876
    rem_send_bytes  =   1.88 KB
    rem_recv_bytes  =   1.88 KB
    rem_send_msgs   =  1,876
    rem_recv_msgs   =  1,876
```

 さくらのクラウドサーバから上海ECS (インターネット経由)

```
# qperf -vvs -t 60 --use_bits_per_sec 上海ECS(インターネット経由) tcp_bw tcp_lat
tcp_bw:
    bw          =    94.4 Mb/sec
    msg_rate    =     180 /sec
    send_bytes  =     710 MB
    send_msgs   =  10,827
    recv_bytes  =     708 MB
    recv_msgs   =  10,798
tcp_lat:
    latency         =   15.5 ms
    msg_rate        =   64.7 /sec
    loc_send_bytes  =   1.94 KB
    loc_recv_bytes  =   1.94 KB
    loc_send_msgs   =  1,941
    loc_recv_msgs   =  1,940
    rem_send_bytes  =   1.94 KB
    rem_recv_bytes  =   1.94 KB
    rem_send_msgs   =  1,940
    rem_recv_msgs   =  1,940
```

# rsyncによるノード間のファイル転送速度 

東京ECSからさくらのクラウドサーバに対してrsyncでリモートファイルを転送(BBIX経由)

```
# rsync -ahv --progress root@さくらのクラウド(BBIX経由):/root/1MB.file /root/
receiving incremental file list
1MB.file
          1.05M 100%   66.67MB/s    0:00:00 (xfr#1, to-chk=0/1)

sent 43 bytes  received 1.05M bytes  2.10M bytes/sec
total size is 1.05M  speedup is 1.00


# rsync -ahv --progress root@さくらのクラウド(BBIX経由):/root/10MB.file /root/
receiving incremental file list
10MB.file
         10.49M 100%  158.73MB/s    0:00:00 (xfr#1, to-chk=0/1)

sent 43 bytes  received 10.49M bytes  20.98M bytes/sec
total size is 10.49M  speedup is 1.00


# rsync -ahv --progress root@さくらのクラウド(BBIX経由):/root/100MB.file /root/
receiving incremental file list
100MB.file
        104.86M 100%  119.76MB/s    0:00:00 (xfr#1, to-chk=0/1)

sent 43 bytes  received 104.88M bytes  69.92M bytes/sec
total size is 104.86M  speedup is 1.00


# rsync -ahv --progress root@さくらのクラウド(BBIX経由):/root/1GB.file /root/
receiving incremental file list
1GB.file
          1.05G 100%  100.41MB/s    0:00:09 (xfr#1, to-chk=0/1)

sent 43 bytes  received 1.05G bytes  99.89M bytes/sec
total size is 1.05G  speedup is 1.00
```

東京ECSからさくらのクラウドサーバに対してrsyncでリモートファイルを転送(インターネット経由)

```
# rsync -ahv --progress root@さくらのクラウド(インターネット経由):/root/1MB.file /root/
receiving incremental file list
1MB.file
          1.05M 100%   76.92MB/s    0:00:00 (xfr#1, to-chk=0/1)

sent 43 bytes  received 1.05M bytes  299.70K bytes/sec
total size is 1.05M  speedup is 1.00


# rsync -ahv --progress root@さくらのクラウド(インターネット経由):/root/10MB.file /root/
receiving incremental file list
10MB.file
         10.49M 100%   16.26MB/s    0:00:00 (xfr#1, to-chk=0/1)

sent 43 bytes  received 10.49M bytes  6.99M bytes/sec
total size is 10.49M  speedup is 1.00


# rsync -ahv --progress root@さくらのクラウド(インターネット経由):/root/100MB.file /root/
receiving incremental file list
100MB.file
        104.86M 100%   11.83MB/s    0:00:08 (xfr#1, to-chk=0/1)

sent 43 bytes  received 104.88M bytes  11.04M bytes/sec
total size is 104.86M  speedup is 1.00


# rsync -ahv --progress root@さくらのクラウド(インターネット経由):/root/1GB.file /root/
receiving incremental file list
1GB.file
          1.05G 100%   11.53MB/s    0:01:26 (xfr#1, to-chk=0/1)

sent 43 bytes  received 1.05G bytes  11.99M bytes/sec
total size is 1.05G  speedup is 1.00
```

上海ECSからさくらのクラウドサーバに対してrsyncでリモートファイルを転送(CEN＋BBIX経由)

```
# rsync -ahv --progress root@さくらのクラウド(CEN+BBIX経由):/root/1MB.file /root/
receiving incremental file list
1MB.file
          1.05M 100%  338.40kB/s    0:00:03 (xfr#1, to-chk=0/1)

sent 43 bytes  received 1.05M bytes  233.10K bytes/sec
total size is 1.05M  speedup is 1.00


# rsync -ahv --progress root@さくらのクラウド(CEN+BBIX経由):/root/10MB.file /root/
receiving incremental file list
10MB.file
         10.49M 100%  264.40kB/s    0:00:38 (xfr#1, to-chk=0/1)

sent 43 bytes  received 10.49M bytes  265.53K bytes/sec
total size is 10.49M  speedup is 1.00


# rsync -ahv --progress root@さくらのクラウド(CEN+BBIX経由):/root/100MB.file /root/
receiving incremental file list
100MB.file
        104.86M 100%  257.18kB/s    0:06:38 (xfr#1, to-chk=0/1)

sent 43 bytes  received 104.88M bytes  262.54K bytes/sec
total size is 104.86M  speedup is 1.00


# rsync -ahv --progress root@さくらのクラウド(CEN+BBIX経由):/root/1GB.file /root/
receiving incremental file list
1GB.file
          1.05G 100%  256.57kB/s    1:06:31 (xfr#1, to-chk=0/1)

sent 43 bytes  received 1.05G bytes  262.70K bytes/sec
total size is 1.05G  speedup is 1.00
```

上海ECSからさくらのクラウドサーバに対してrsyncでリモートファイルを転送(インターネット経由)

```
# rsync -ahv --progress root@さくらのクラウド(インターネット経由):/root/1MB.file /root/
receiving incremental file list
1MB.file
          1.05M 100%    6.67MB/s    0:00:00 (xfr#1, to-chk=0/1)

sent 43 bytes  received 1.05M bytes  190.72K bytes/sec
total size is 1.05M  speedup is 1.00


# rsync -ahv --progress root@さくらのクラウド(インターネット経由):/root/10MB.file /root/
receiving incremental file list
10MB.file
         10.49M 100%   10.85MB/s    0:00:00 (xfr#1, to-chk=0/1)

sent 43 bytes  received 10.49M bytes  4.20M bytes/sec
total size is 10.49M  speedup is 1.00



# rsync -ahv --progress root@さくらのクラウド(インターネット経由):/root/100MB.file /root/
receiving incremental file list
100MB.file
        104.86M 100%   10.79MB/s    0:00:09 (xfr#1, to-chk=0/1)

sent 43 bytes  received 104.88M bytes  9.99M bytes/sec
total size is 104.86M  speedup is 1.00



# rsync -ahv --progress root@さくらのクラウド(インターネット経由):/root/1GB.file /root/
receiving incremental file list
1GB.file
          1.05G 100%    5.82MB/s    0:02:51 (xfr#1, to-chk=0/1)

sent 43 bytes  received 1.05G bytes  6.08M bytes/sec
total size is 1.05G  speedup is 1.00
```

# 最後に


上記、Alibaba Cloud 上海リージョンとさくらのクラウド東京リージョンをBBIXで繋げてみた結果をご紹介しました。ご参考に頂ければ幸いです。     

 <CommunityAuthor 
    author="吉村 真輝"
    self_introduction = "Alibaba Cloud プロフェッショナルエンジニア。中国ｘクラウドが得意。趣味は日本語ラップのDJ。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yoshimura_pic.jpeg"
    githubUrl="https://github.com/masaki-coba"
/>


