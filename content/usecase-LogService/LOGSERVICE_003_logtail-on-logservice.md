---
title: "LogtailでCSVデータを収集"
metaTitle: "LogtailでCSVデータを収集するLogService"
metaDescription: "LogtailでCSVデータを収集するLogService"
date: "2020-12-29"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/LogService_images_26006613660740900/20201215135145.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## LogtailでCSVデータを収集するLogService

本記事では、LogServiceを使ってLogtailでCSVデータをLogServiceへ収集する方法を記載します。  

# 前書き
> <span style="color: #ff0000"><i>LogService は、リアルタイムデータロギングサービスです。  
ログの収集、消費、出荷、検索、および分析をサポートし、大量のログを処理および分析する能力を向上させます。</i></span>

少し前になりますが、LogServiceについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www2.slideshare.net/sbopsv/alibaba-cloud-log-service

     

今回はLogtailを使ってAlibaba Cloud LogServiceへ収集、蓄積、可視化してみましょう。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201215135145.png "img")


---

# プロジェクト作成（LogService全体で共通事項）

まずはプロジェクトを作成します。LogServiceコンソールから 「Create Project」を選択し、起動します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201124101928.png "img")



Project Nameをここでは「techblog」にし、プロジェクトを作成します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201124102655.png "img")

その直後に "Do you want to create a Logstore for log data storage immediately?"、「Log Storeを作成しますか？」とポップアップが出ます。
Log StoreはLog Serviceでデータを蓄積するものなので、「OK」を選定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201124102805.png "img")

LogStore Nameをここでは「logtail_logstore」と入力し、LogStoreを作成します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201124103013.png "img")


その後、「LogStoreが作成されました。今すぐデータアクセスしますか？」とポップアップが出ますが、これは必要に応じて選定すると良いです。
ちなみに「Yes」を選択した場合、50を超える様々なデータアクセス手法のコンソールが表示されます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201124103134.png "img")


---

# データ格納について

（再掲）このシナリオでは 以下の図のように、logtailを使ってcsvファイルを登録します。     
ポイントは logserviceはデータが登録された時点で、自動でtimestampが付与されますが、csvファイルなどにてtimestampがあった場合、それをベースに反映する方法です。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201215135145.png "img")

---

## STEP1: Logtailの導入

[helpドキュメント](https://www.alibabacloud.com/cloud-tech/doc-detail/28967.htm) に沿ってECSインスタンスを作成・起動します。     
※LogServiceと同じリージョンである必要があります。著者は今回日本（東京）リージョンを選定します。      
※OSはなんでも良いですが、今回はLinux、CentOS 7.8を選択します。     


> https://www.alibabacloud.com/cloud-tech/doc-detail/28967.htm


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201209205538.png "img")


ECSインスタンス起動直後は以下コマンドを実施します。     

```bash
[root@sts ~]# yum -y upgrade
[root@sts ~]# wget http://logtail-release-ap-northeast-1.oss-ap-northeast-1.aliyuncs.com/linux64/logtail.sh -O logtail.sh; chmod 755 logtail.sh; ./logtail.sh install ap-northeast-1-internet

〜略〜

logtail-linux64.tar.gz download success
install logtail files success
agent stub for telegraf has been installed
systemd 219
+PAM +AUDIT +SELINUX +IMA -APPARMOR +SMACK +SYSVINIT +UTMP +LIBCRYPTSETUP +GCRYPT +GNUTLS +ACL +XZ +LZ4 -SECCOMP +BLKID +ELFUTILS +KMOD +IDN
use systemd for startup
Created symlink from /etc/systemd/system/default.target.wants/ilogtaild.service to /etc/systemd/system/ilogtaild.service.
systemd startup done
ilogtail is running
install logtail success
start logtail success
{
   "UUID" : "B3CAFD71-CD5F-41EE-9AA0-F650B7328756",
   "hostname" : "sts",
   "instance_id" : "343FD796-2DFE-11EB-95D8-00163E005CFC_192.168.0.195_1606185538",
   "ip" : "192.168.0.195",
   "logtail_version" : "0.16.50",
   "os" : "Linux; 3.10.0-1127.19.1.el7.x86_64; #1 SMP Tue Aug 25 17:23:54 UTC 2020; x86_64",
   "update_time" : "2020-11-24 10:38:58"
}

```

これでlogtailが無事インストールされたと思います。     
試しに2つのコマンドで確認しましょう。     

```bash
[root@sts ~]# cat /usr/local/ilogtail/app_info.json
[root@sts ~]# cat /usr/local/ilogtail/ilogtail_config.json
```

app_info.jsonは[logtailのバージョンなどの情報](https://www.alibabacloud.com/cloud-tech/doc-detail/28982.htm)、ilogtail_config.jsonは[logtailでデータを収集するパラメータ](https://www.alibabacloud.com/cloud-tech/doc-detail/32278.htm)です。

```
[root@sts ~]# cat /usr/local/ilogtail/app_info.json
{
   "UUID" : "B3CAFD71-CD5F-41EE-9AA0-F650B7328756",
   "hostname" : "sts",
   "instance_id" : "343FD796-2DFE-11EB-95D8-00163E005CFC_192.168.0.195_1606185538",
   "ip" : "192.168.0.195",
   "logtail_version" : "0.16.50",
   "os" : "Linux; 3.10.0-1127.19.1.el7.x86_64; #1 SMP Tue Aug 25 17:23:54 UTC 2020; x86_64",
   "update_time" : "2020-11-24 10:38:58"
}
[root@sts ~]# 
[root@sts ~]# cat /usr/local/ilogtail/ilogtail_config.json
{
    "config_server_address" : "http://logtail.ap-northeast-1.log.aliyuncs.com",
    "data_server_list" :
    [
        {
            "cluster" : "ap-northeast-1",
            "endpoint" : "ap-northeast-1.log.aliyuncs.com"
        }
    ],
    "cpu_usage_limit" : 0.4,
    "mem_usage_limit" : 384,
    "max_bytes_per_sec" : 20971520,
    "bytes_per_sec" : 1048576,
    "buffer_file_num" : 25,
    "buffer_file_size" : 20971520,
    "buffer_map_num" : 5,
    "streamlog_open" : false,
    "streamlog_pool_size_in_mb" : 50,
    "streamlog_rcv_size_each_call" : 1024,
    "streamlog_formats":[],
    "streamlog_tcp_port" : 11111
}
[root@sts ~]# 
```


ローカルからECSにcsvファイルをアップロードします
```
PS C:\Users\1200358> scp /Users/hironobu.ohara/Desktop/logservice-test-data.csv root@<ecs ip address>:/root/ 
```

ecsにファイルがあることを確認したら、logtail設定します。
```
[root@sts ~]# ll
合計 79020
-rw-r--r-- 1 root root 80886700 11月 24 14:12 logservice-test-data.csv
-rwxr-xr-x 1 root root    28176 10月 26 14:48 logtail.sh
[root@sts ~]# 
```

---

## STEP2: インポート作業

今度はコンソールに戻り、データのインポートをします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201124154214.png "img")


Delimiter Mode、区切り文字モードを選定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201124164156.png "img")


対象のインスタンスを選定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201124164604.png "img")


道なりに登録します     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201124164801.png "img")


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201124164951.png "img")


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201124165102.png "img")

「Heartbeat Status of Machine Groups」でHeartbeatをOKにします。もし失敗した場合（NG、False）は「Automatic Retry」ボタンをクリックし再実行すると良いです。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201209210544.png "img")



![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201209211341.png "img")

ここで注意したいのが、[START_DT]フィールドを、Use System Timeとして登録するところです。   
ちなみにcsvファイルの日付 - 時間のフォーマットをLog Serviceへ合わせる場合は、[こちら](https://www.alibabacloud.com/cloud-tech/doc-detail/28980.htm)を参考にしてフォーマットを指定する必要があります。

> https://www.alibabacloud.com/cloud-tech/doc-detail/28980.htm


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201209222853.png "img")

これを設定すれば、あとはcsvファイルの日付通りにデータが登録されます。以上です。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201229130418.png "img")


---

# 最後に

Logtailを使って、csvファイルをLogServiceへ格納、可視化する方法を簡単に説明しました。       
 LogServiceはシンプルかつスピーディに構築することができます。この構築も、可視化まで1時間もかからないです。5分あれば見れます。      

LogServiceはフルマネージド環境でありながら、様々なデータを収集し蓄積・可視化する事が可能です。          
加えて、データ量や使い方に応じた課金なので、使い方次第ではコスト削減や、運用負荷の改善に効果があるのでは無いでしょうか。       


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>

